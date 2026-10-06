package mx.ligajuventino.app;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(
    name = "LigaNotifications",
    permissions = {
        @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS })
    }
)
public class LigaNotificationsPlugin extends Plugin {
    private static final String CHANNEL_ID = "liga_partidos";
    private static final String CHANNEL_NAME = "Partidos Liga Juventino";
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @Override
    public void load() {
        ensureChannel();
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = (NotificationManager) getContext().getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm.getNotificationChannel(CHANNEL_ID) != null) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            CHANNEL_NAME,
            NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Goles, resultados y avisos de partidos de Liga Juventino Rosas");
        channel.enableVibration(true);
        channel.setShowBadge(true);
        nm.createNotificationChannel(channel);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT < 33) {
            JSObject out = new JSObject();
            out.put("granted", true);
            call.resolve(out);
            return;
        }
        if (getPermissionState("notifications") == PermissionState.GRANTED) {
            JSObject out = new JSObject();
            out.put("granted", true);
            call.resolve(out);
            return;
        }
        requestPermissionForAlias("notifications", call, "notificationPermissionCallback");
    }

    @PermissionCallback
    private void notificationPermissionCallback(PluginCall call) {
        JSObject out = new JSObject();
        out.put("granted", getPermissionState("notifications") == PermissionState.GRANTED);
        call.resolve(out);
    }

    @PluginMethod
    public void notifyMatch(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33 && getPermissionState("notifications") != PermissionState.GRANTED) {
            call.reject("Permiso de notificaciones no concedido");
            return;
        }
        final String title = call.getString("title", "Liga Juventino");
        final String body = call.getString("body", "");
        final String homeLogo = call.getString("homeLogo", "");
        final String awayLogo = call.getString("awayLogo", "");
        final String group = call.getString("group", "liga-partidos");
        final int id = call.getInt("id", (int)(System.currentTimeMillis() & 0x7fffffff));

        executor.execute(() -> {
            ensureChannel();
            Bitmap largeIcon = teamPairIcon(homeLogo, awayLogo);

            Intent intent = new Intent(getContext(), MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                getContext(),
                id,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            Notification.Builder builder;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                builder = new Notification.Builder(getContext(), CHANNEL_ID);
            } else {
                builder = new Notification.Builder(getContext());
                builder.setPriority(Notification.PRIORITY_HIGH);
            }

            int icon = getContext().getApplicationInfo().icon;
            builder
                .setSmallIcon(icon)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new Notification.BigTextStyle().bigText(body))
                .setSubText("Liga Juventino Rosas")
                .setAutoCancel(true)
                .setOnlyAlertOnce(false)
                .setCategory(Notification.CATEGORY_EVENT)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setContentIntent(pendingIntent)
                .setGroup(group);

            if (largeIcon != null) builder.setLargeIcon(largeIcon);

            NotificationManager nm = (NotificationManager) getContext().getSystemService(Context.NOTIFICATION_SERVICE);
            nm.notify(id, builder.build());

            getActivity().runOnUiThread(() -> {
                JSObject out = new JSObject();
                out.put("shown", true);
                out.put("id", id);
                call.resolve(out);
            });
        });
    }

    private Bitmap downloadBitmap(String raw) {
        if (raw == null || raw.trim().isEmpty()) return null;
        HttpURLConnection conn = null;
        try {
            URL url = new URL(raw);
            conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            conn.setInstanceFollowRedirects(true);
            conn.setRequestProperty("User-Agent", "LigaJuventino/1.0");
            try (InputStream in = conn.getInputStream()) {
                return BitmapFactory.decodeStream(in);
            }
        } catch (Exception ignored) {
            return null;
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    private Bitmap teamPairIcon(String home, String away) {
        Bitmap a = downloadBitmap(home);
        Bitmap b = downloadBitmap(away);
        if (a == null && b == null) return null;

        final int size = 160;
        Bitmap out = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(out);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        paint.setColor(Color.rgb(4, 24, 92));
        canvas.drawCircle(size / 2f, size / 2f, 78f, paint);

        paint.setColor(Color.WHITE);
        canvas.drawCircle(49f, 80f, 45f, paint);
        canvas.drawCircle(111f, 80f, 45f, paint);

        if (a != null) drawContained(canvas, a, 14, 45, 84, 115);
        if (b != null) drawContained(canvas, b, 76, 45, 146, 115);

        paint.setColor(Color.rgb(36, 221, 235));
        paint.setStrokeWidth(4f);
        canvas.drawLine(79f, 55f, 79f, 105f, paint);
        return out;
    }

    private void drawContained(Canvas canvas, Bitmap bitmap, int l, int t, int r, int b) {
        float maxW = r - l;
        float maxH = b - t;
        float scale = Math.min(maxW / bitmap.getWidth(), maxH / bitmap.getHeight());
        float w = bitmap.getWidth() * scale;
        float h = bitmap.getHeight() * scale;
        float left = l + (maxW - w) / 2f;
        float top = t + (maxH - h) / 2f;
        android.graphics.RectF dst = new android.graphics.RectF(left, top, left + w, top + h);
        canvas.drawBitmap(bitmap, null, dst, new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG));
    }
}
