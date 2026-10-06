package mx.ligajuventino.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.provider.CalendarContract;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "LigaCalendar")
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
        getActivity().runOnUiThread(() -> {
            Intent event = new Intent(Intent.ACTION_INSERT)
                .setDataAndType(CalendarContract.Events.CONTENT_URI, "vnd.android.cursor.item/event")
                .putExtra(CalendarContract.Events.TITLE, title)
                .putExtra(CalendarContract.Events.DESCRIPTION, call.getString("description", ""))
                .putExtra(CalendarContract.Events.EVENT_LOCATION, call.getString("location", ""))
                .putExtra(CalendarContract.Events.EVENT_TIMEZONE, call.getString("timeZone", "America/Mexico_City"))
                .putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, start.longValue())
                .putExtra(CalendarContract.EXTRA_EVENT_END_TIME, end.longValue())
                .putExtra(CalendarContract.EXTRA_EVENT_ALL_DAY, call.getBoolean("allDay", false));
            try {
                if (event.resolveActivity(getContext().getPackageManager()) == null) {
                    call.reject("No hay una aplicación de calendario disponible.", "NO_CALENDAR_APP");
                    return;
                }
                Intent chooser = Intent.createChooser(event, "Completar acción utilizando");
                getActivity().startActivity(chooser);
                call.resolve();
            } catch (ActivityNotFoundException error) {
                call.reject("No hay una aplicación de calendario disponible.", "NO_CALENDAR_APP", error);
            }
        });
    }
}
