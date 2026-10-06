package mx.ligajuventino.app;

import android.Manifest;
import android.content.ActivityNotFoundException;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.CalendarContract;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "LigaCalendar",
    permissions = {
        @Permission(
            alias = "calendar",
            strings = {
                Manifest.permission.READ_CALENDAR,
                Manifest.permission.WRITE_CALENDAR
            }
        )
    }
)
public class LigaCalendarPlugin extends Plugin {
    @PluginMethod
    public void openEvent(PluginCall call) {
        String title = call.getString("title", "");
        Long start = call.getLong("startMs");
        Long end = call.getLong("endMs");
        if (title.trim().isEmpty() || start == null || end == null || end <= start) {
            call.reject("El partido no tiene fecha válida.");
            return;
        }
        if (getPermissionState("calendar") != PermissionState.GRANTED) {
            requestPermissionForAlias("calendar", call, "calendarPermissionCallback");
            return;
        }
        createEvent(call);
    }

    @PermissionCallback
    private void calendarPermissionCallback(PluginCall call) {
        if (getPermissionState("calendar") == PermissionState.GRANTED) {
            createEvent(call);
        } else {
            call.reject("Permite acceso al calendario para agregar el partido automáticamente.", "CALENDAR_PERMISSION_DENIED");
        }
    }

    private void createEvent(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            try {
                ContentResolver resolver = getContext().getContentResolver();
                long calendarId = findWritableGoogleCalendar(resolver);
                if (calendarId < 0) {
                    call.reject("No se encontró un calendario de Google editable en el dispositivo.", "NO_WRITABLE_GOOGLE_CALENDAR");
                    return;
                }

                String title = call.getString("title", "").trim();
                String description = call.getString("description", "");
                String location = call.getString("location", "");
                String timeZone = call.getString("timeZone", "America/Mexico_City");
                long start = call.getLong("startMs");
                long end = call.getLong("endMs");
                boolean allDay = call.getBoolean("allDay", false);

                long existingId = findExistingEvent(resolver, calendarId, title, start, end);
                long eventId = existingId;
                boolean created = false;

                if (eventId < 0) {
                    ContentValues values = new ContentValues();
                    values.put(CalendarContract.Events.CALENDAR_ID, calendarId);
                    values.put(CalendarContract.Events.TITLE, title);
                    values.put(CalendarContract.Events.DESCRIPTION, description);
                    values.put(CalendarContract.Events.EVENT_LOCATION, location);
                    values.put(CalendarContract.Events.DTSTART, start);
                    values.put(CalendarContract.Events.DTEND, end);
                    values.put(CalendarContract.Events.EVENT_TIMEZONE, timeZone);
                    values.put(CalendarContract.Events.ALL_DAY, allDay ? 1 : 0);
                    values.put(CalendarContract.Events.STATUS, CalendarContract.Events.STATUS_CONFIRMED);
                    values.put(CalendarContract.Events.AVAILABILITY, CalendarContract.Events.AVAILABILITY_BUSY);

                    Uri inserted = resolver.insert(CalendarContract.Events.CONTENT_URI, values);
                    if (inserted == null) {
                        call.reject("Google Calendar no pudo crear el evento.", "CALENDAR_INSERT_FAILED");
                        return;
                    }
                    eventId = ContentUris.parseId(inserted);
                    created = true;
                }

                openCreatedEvent(eventId);

                JSObject result = new JSObject();
                result.put("created", created);
                result.put("eventId", String.valueOf(eventId));
                result.put("calendarId", String.valueOf(calendarId));
                call.resolve(result);
            } catch (SecurityException error) {
                call.reject("Falta permiso para escribir en Google Calendar.", "CALENDAR_PERMISSION_DENIED", error);
            } catch (Exception error) {
                call.reject("No se pudo agregar el partido a Google Calendar.", "CALENDAR_CREATE_FAILED", error);
            }
        });
    }

    private long findWritableGoogleCalendar(ContentResolver resolver) {
        String[] projection = new String[] {
            CalendarContract.Calendars._ID,
            CalendarContract.Calendars.ACCOUNT_TYPE,
            CalendarContract.Calendars.CALENDAR_ACCESS_LEVEL,
            CalendarContract.Calendars.VISIBLE,
            CalendarContract.Calendars.IS_PRIMARY
        };
        String selection = CalendarContract.Calendars.VISIBLE + "=? AND "
            + CalendarContract.Calendars.CALENDAR_ACCESS_LEVEL + ">=?";
        String[] args = new String[] {
            "1",
            String.valueOf(CalendarContract.Calendars.CAL_ACCESS_CONTRIBUTOR)
        };

        long bestId = -1;
        int bestScore = Integer.MIN_VALUE;
        try (Cursor cursor = resolver.query(
            CalendarContract.Calendars.CONTENT_URI,
            projection,
            selection,
            args,
            null
        )) {
            if (cursor == null) return -1;
            int idCol = cursor.getColumnIndexOrThrow(CalendarContract.Calendars._ID);
            int typeCol = cursor.getColumnIndexOrThrow(CalendarContract.Calendars.ACCOUNT_TYPE);
            int primaryCol = cursor.getColumnIndexOrThrow(CalendarContract.Calendars.IS_PRIMARY);
            while (cursor.moveToNext()) {
                long id = cursor.getLong(idCol);
                String accountType = cursor.getString(typeCol);
                int primary = cursor.getInt(primaryCol);
                int score = 0;
                if ("com.google".equals(accountType)) score += 100;
                if (primary == 1) score += 50;
                if (score > bestScore) {
                    bestScore = score;
                    bestId = id;
                }
            }
        }
        return bestScore >= 100 ? bestId : -1;
    }

    private long findExistingEvent(ContentResolver resolver, long calendarId, String title, long start, long end) {
        String[] projection = new String[] { CalendarContract.Events._ID };
        String selection = CalendarContract.Events.CALENDAR_ID + "=? AND "
            + CalendarContract.Events.TITLE + "=? AND "
            + CalendarContract.Events.DTSTART + "=? AND "
            + CalendarContract.Events.DTEND + "=?";
        String[] args = new String[] {
            String.valueOf(calendarId),
            title,
            String.valueOf(start),
            String.valueOf(end)
        };
        try (Cursor cursor = resolver.query(
            CalendarContract.Events.CONTENT_URI,
            projection,
            selection,
            args,
            null
        )) {
            if (cursor != null && cursor.moveToFirst()) {
                return cursor.getLong(cursor.getColumnIndexOrThrow(CalendarContract.Events._ID));
            }
        }
        return -1;
    }

    private void openCreatedEvent(long eventId) {
        Uri eventUri = ContentUris.withAppendedId(CalendarContract.Events.CONTENT_URI, eventId);
        Intent google = new Intent(Intent.ACTION_VIEW, eventUri).setPackage("com.google.android.calendar");
        try {
            if (google.resolveActivity(getContext().getPackageManager()) != null) {
                getActivity().startActivity(google);
                return;
            }
            getActivity().startActivity(new Intent(Intent.ACTION_VIEW, eventUri));
        } catch (ActivityNotFoundException ignored) {
            // El evento ya quedó creado aunque no exista una app para mostrarlo.
        }
    }
}
