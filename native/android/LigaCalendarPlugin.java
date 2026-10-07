package mx.ligajuventino.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.provider.CalendarContract;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "LigaCalendar")
public class LigaCalendarPlugin extends Plugin {
    @PluginMethod
    public void openEvent(PluginCall call) {
        String title = call.getString("title", "").trim();
        Long start = call.getLong("startMs");
        Long end = call.getLong("endMs");
        if (title.isEmpty() || start == null || end == null || end <= start) {
            call.reject("El partido no tiene fecha válida.");
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                Intent editor = new Intent(Intent.ACTION_INSERT);
                editor.setData(CalendarContract.Events.CONTENT_URI);
                editor.putExtra(CalendarContract.Events.TITLE, title);
                editor.putExtra(CalendarContract.Events.DESCRIPTION, call.getString("description", ""));
                editor.putExtra(CalendarContract.Events.EVENT_LOCATION, call.getString("location", ""));
                editor.putExtra(CalendarContract.Events.EVENT_TIMEZONE, call.getString("timeZone", "America/Mexico_City"));
                editor.putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, start);
                editor.putExtra(CalendarContract.EXTRA_EVENT_END_TIME, end);
                editor.putExtra(CalendarContract.EXTRA_EVENT_ALL_DAY, call.getBoolean("allDay", false));

                getActivity().startActivity(editor);

                JSObject result = new JSObject();
                result.put("opened", true);
                result.put("mode", "prefilled-editor");
                call.resolve(result);
            } catch (ActivityNotFoundException error) {
                String googleUrl = call.getString("googleURL", "");
                if (!googleUrl.trim().isEmpty()) {
                    try {
                        getActivity().startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(googleUrl)));
                        JSObject result = new JSObject();
                        result.put("opened", true);
                        result.put("mode", "google-web-fallback");
                        call.resolve(result);
                        return;
                    } catch (Exception ignored) {
                        // Fall through to the clear error below.
                    }
                }
                call.reject("No se encontró una aplicación de calendario para completar el evento.", "NO_CALENDAR_APP", error);
            } catch (Exception error) {
                call.reject("No se pudo abrir el evento en el calendario.", "CALENDAR_OPEN_FAILED", error);
            }
        });
    }
}
