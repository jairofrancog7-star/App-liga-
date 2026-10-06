package mx.ligajuventino.app;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.os.Build;
import android.text.TextPaint;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONArray;

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
    private static final String CHANNEL_NAME = "Liga Juventino";
    private static final String PREFS = "liga_notification_groups";
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @Override
    public void load() {
        ensureChannel();
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = (NotificationManager) getContext().getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationChannel existing = nm.getNotificationChannel(CHANNEL_ID);
        if (existing != null) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            CHANNEL_NAME,
            NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Goles, resultados, noticias y avisos de Liga Juventino Rosas");
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
        if (!canNotify(call)) return;

        final String title = call.getString("title", "Liga Juventino");
        final String body = call.getString("body", "");
        final String homeLogo = call.getString("homeLogo", "");
        final String awayLogo = call.getString("awayLogo", "");
        final String imageUrl = call.getString("imageUrl", "");
        final String group = call.getString("group", "liga-partidos");
        final String route = call.getString("route", "notifications");
        final int id = call.getInt("id", (int)(System.currentTimeMillis() & 0x7fffffff));

        executor.execute(() -> {
            ensureChannel();

            Bitmap largeIcon = teamPairIcon(homeLogo, awayLogo);
            Bitmap bigPicture = null;
            if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                bigPicture = downloadBitmap(imageUrl);
            }
            if (bigPicture == null) {
                bigPicture = matchCardImage(homeLogo, awayLogo, title, body);
            }

            Notification.Builder builder = baseBuilder(id, group, route)
                .setContentTitle(title)
                .setContentText(body)
                .setSubText("Liga Juventino Rosas")
                .setCategory(Notification.CATEGORY_EVENT)
                .setVisibility(Notification.VISIBILITY_PUBLIC);

            if (largeIcon != null) builder.setLargeIcon(largeIcon);
            if (bigPicture != null) {
                Notification.BigPictureStyle style = new Notification.BigPictureStyle()
                    .bigPicture(bigPicture)
                    .setBigContentTitle(title)
                    .setSummaryText(body);
                builder.setStyle(style);
            } else {
                builder.setStyle(new Notification.BigTextStyle().bigText(body));
            }

            NotificationManager nm = (NotificationManager) getContext().getSystemService(Context.NOTIFICATION_SERVICE);
            nm.notify(id, builder.build());
            pushGroupSummary(nm, group, title, body, largeIcon);

            resolveShown(call, id);
        });
    }

    @PluginMethod
    public void notifyRich(PluginCall call) {
        if (!canNotify(call)) return;

        final String title = call.getString("title", "Liga Juventino");
        final String body = call.getString("body", "");
        final String imageUrl = call.getString("imageUrl", "");
        final String iconUrl = call.getString("iconUrl", "");
        final String group = call.getString("group", "liga-noticias");
        final String route = call.getString("route", "notifications");
        final int id = call.getInt("id", (int)(System.currentTimeMillis() & 0x7fffffff));

        executor.execute(() -> {
            ensureChannel();
            Bitmap largeIcon = downloadBitmap(iconUrl);
            Bitmap bigPicture = downloadBitmap(imageUrl);

            Notification.Builder builder = baseBuilder(id, group, route)
                .setContentTitle(title)
                .setContentText(body)
                .setSubText("Liga Juventino Rosas")
                .setCategory(Notification.CATEGORY_SOCIAL)
                .setVisibility(Notification.VISIBILITY_PUBLIC);

            if (largeIcon != null) builder.setLargeIcon(largeIcon);
            if (bigPicture != null) {
                builder.setStyle(new Notification.BigPictureStyle()
                    .bigPicture(bigPicture)
                    .setBigContentTitle(title)
                    .setSummaryText(body));
            } else {
                builder.setStyle(new Notification.BigTextStyle().bigText(body));
            }

            NotificationManager nm = (NotificationManager) getContext().getSystemService(Context.NOTIFICATION_SERVICE);
            nm.notify(id, builder.build());
            pushGroupSummary(nm, group, title, body, largeIcon);

            resolveShown(call, id);
        });
    }

    private boolean canNotify(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33 && getPermissionState("notifications") != PermissionState.GRANTED) {
            call.reject("Permiso de notificaciones no concedido");
            return false;
        }
        return true;
    }

    private Notification.Builder baseBuilder(int id, String group, String route) {
        Intent intent = new Intent(getContext(), MainActivity.class);
        intent.putExtra("ljr_route", route == null ? "notifications" : route);
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
            .setAutoCancel(true)
            .setOnlyAlertOnce(false)
            .setShowWhen(true)
            .setWhen(System.currentTimeMillis())
            .setContentIntent(pendingIntent)
            .setGroup(group);

        return builder;
    }

    private void pushGroupSummary(NotificationManager nm, String group, String title, String body, Bitmap largeIcon) {
        try {
            SharedPreferences prefs = getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            String key = "g_" + Math.abs(group.hashCode());
            JSONArray rows;
            try { rows = new JSONArray(prefs.getString(key, "[]")); }
            catch (Exception ignored) { rows = new JSONArray(); }

            JSONArray next = new JSONArray();
            String line = title + " · " + body;
            next.put(line);
            for (int i = 0; i < rows.length() && i < 4; i++) {
                String old = rows.optString(i, "");
                if (!old.isEmpty() && !old.equals(line)) next.put(old);
            }
            prefs.edit().putString(key, next.toString()).apply();

            Notification.InboxStyle style = new Notification.InboxStyle()
                .setBigContentTitle("Liga Juventino Rosas")
                .setSummaryText(next.length() + " avisos");
            for (int i = 0; i < next.length(); i++) {
                style.addLine(next.optString(i));
            }

            int summaryId = 0x50000000 | (Math.abs(group.hashCode()) & 0x0fffffff);
            Notification.Builder summary = baseBuilder(summaryId, group, "notifications")
                .setContentTitle("Liga Juventino Rosas")
                .setContentText(next.length() + " avisos recientes")
                .setStyle(style)
                .setGroupSummary(true)
                .setOnlyAlertOnce(true)
                .setCategory(Notification.CATEGORY_EVENT);
            if (largeIcon != null) summary.setLargeIcon(largeIcon);
            nm.notify(summaryId, summary.build());
        } catch (Exception ignored) {}
    }

    private void resolveShown(PluginCall call, int id) {
        getActivity().runOnUiThread(() -> {
            JSObject out = new JSObject();
            out.put("shown", true);
            out.put("id", id);
            out.put("rich", true);
            call.resolve(out);
        });
    }

    private Bitmap downloadBitmap(String raw) {
        if (raw == null || raw.trim().isEmpty()) return null;
        HttpURLConnection conn = null;
        try {
            URL url = new URL(raw);
            conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(5500);
            conn.setReadTimeout(6500);
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

        final int size = 180;
        Bitmap out = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(out);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        paint.setColor(Color.rgb(4, 24, 92));
        canvas.drawCircle(size / 2f, size / 2f, 88f, paint);

        paint.setColor(Color.WHITE);
        canvas.drawCircle(56f, 90f, 50f, paint);
        canvas.drawCircle(124f, 90f, 50f, paint);

        if (a != null) drawContained(canvas, a, 17, 51, 95, 129);
        if (b != null) drawContained(canvas, b, 85, 51, 163, 129);

        paint.setColor(Color.rgb(36, 221, 235));
        paint.setStrokeWidth(5f);
        canvas.drawLine(90f, 60f, 90f, 120f, paint);
        return out;
    }

    private Bitmap matchCardImage(String homeLogo, String awayLogo, String title, String body) {
        Bitmap a = downloadBitmap(homeLogo);
        Bitmap b = downloadBitmap(awayLogo);
        if (a == null && b == null) return null;

        final int w = 920;
        final int h = 470;
        Bitmap out = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(out);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);

        paint.setColor(Color.rgb(5, 18, 87));
        canvas.drawRect(0, 0, w, h, paint);

        paint.setColor(Color.rgb(10, 70, 190));
        canvas.drawRoundRect(new RectF(28, 28, w - 28, h - 28), 42, 42, paint);

        paint.setColor(Color.rgb(18, 35, 110));
        canvas.drawRoundRect(new RectF(48, 48, w - 48, h - 48), 34, 34, paint);

        paint.setColor(Color.WHITE);
        canvas.drawCircle(245, 220, 108, paint);
        canvas.drawCircle(675, 220, 108, paint);

        if (a != null) drawContained(canvas, a, 155, 130, 335, 310);
        if (b != null) drawContained(canvas, b, 585, 130, 765, 310);

        TextPaint text = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        text.setColor(Color.rgb(48, 232, 243));
        text.setTextAlign(Paint.Align.CENTER);
        text.setFakeBoldText(true);
        text.setTextSize(34f);
        canvas.drawText(ellipsize(title, 34), w / 2f, 78f, text);

        text.setColor(Color.WHITE);
        text.setTextSize(30f);
        canvas.drawText(ellipsize(body, 54), w / 2f, 400f, text);

        paint.setColor(Color.rgb(47, 231, 242));
        paint.setStrokeWidth(6f);
        canvas.drawLine(w / 2f, 148f, w / 2f, 298f, paint);

        return out;
    }

    private String ellipsize(String input, int max) {
        String s = input == null ? "" : input.trim();
        if (s.length() <= max) return s;
        return s.substring(0, Math.max(0, max - 1)) + "…";
    }

    private void drawContained(Canvas canvas, Bitmap bitmap, int l, int t, int r, int b) {
        float maxW = r - l;
        float maxH = b - t;
        float scale = Math.min(maxW / bitmap.getWidth(), maxH / bitmap.getHeight());
        float w = bitmap.getWidth() * scale;
        float h = bitmap.getHeight() * scale;
        float left = l + (maxW - w) / 2f;
        float top = t + (maxH - h) / 2f;
        RectF dst = new RectF(left, top, left + w, top + h);
        canvas.drawBitmap(bitmap, null, dst, new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG));
    }
}
