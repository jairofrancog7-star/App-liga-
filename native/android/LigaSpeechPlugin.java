package mx.ligajuventino.app;
import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import java.util.Locale;
import java.util.ArrayList;
import com.getcapacitor.*;
import com.getcapacitor.annotation.*;
@CapacitorPlugin(name="LigaSpeech",permissions={@Permission(alias="microphone",strings={Manifest.permission.RECORD_AUDIO})})
public class LigaSpeechPlugin extends Plugin {
 private SpeechRecognizer recognizer; private boolean running=false;
 private TextToSpeech voice;
 @PluginMethod public void speak(PluginCall call){String text=call.getString("text","");if(text.trim().isEmpty()||text.length()>TextToSpeech.getMaxSpeechInputLength()){call.reject("Escribe una narración más corta.");return;}getActivity().runOnUiThread(()->{if(voice!=null)voice.shutdown();voice=new TextToSpeech(getContext(),status->{if(status!=TextToSpeech.SUCCESS){call.reject("No se pudo activar la voz de Android.");return;}int language=voice.setLanguage(new Locale("es","MX"));if(language==TextToSpeech.LANG_MISSING_DATA||language==TextToSpeech.LANG_NOT_SUPPORTED){call.reject("Instala la voz en español en Ajustes de Android.");return;}if(voice.speak(text,TextToSpeech.QUEUE_FLUSH,null,"liga-narracion")==TextToSpeech.ERROR)call.reject("No se pudo reproducir la narración.");else call.resolve();});});}
 @PluginMethod public void stopAudio(PluginCall call){getActivity().runOnUiThread(()->{if(voice!=null)voice.stop();call.resolve();});}
 @PluginMethod public void start(PluginCall call){if(getPermissionState("microphone")!=PermissionState.GRANTED){requestPermissionForAlias("microphone",call,"permissionResult");return;}startListening(call);}
 @PermissionCallback private void permissionResult(PluginCall call){if(getPermissionState("microphone")==PermissionState.GRANTED)startListening(call);else call.reject("Permite el micrófono para transcribir.");}
 private void startListening(PluginCall call){getActivity().runOnUiThread(()->{if(!SpeechRecognizer.isRecognitionAvailable(getContext())){call.reject("Instala o activa el servicio de reconocimiento de voz de Android.");return;}if(recognizer!=null)recognizer.destroy();running=true;recognizer=SpeechRecognizer.createSpeechRecognizer(getContext());recognizer.setRecognitionListener(new RecognitionListener(){
 public void onReadyForSpeech(Bundle b){} public void onBeginningOfSpeech(){} public void onRmsChanged(float f){} public void onBufferReceived(byte[] b){} public void onEndOfSpeech(){} public void onEvent(int t,Bundle b){}
 private void send(Bundle b,boolean done){ArrayList<String> words=b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);if(words!=null&&!words.isEmpty()){JSObject result=new JSObject();result.put("text",words.get(0));result.put("isFinal",done);notifyListeners("transcript",result);}}
 public void onPartialResults(Bundle b){send(b,false);} public void onResults(Bundle b){send(b,true);restart();}
 public void onError(int error){if(error==SpeechRecognizer.ERROR_NO_MATCH||error==SpeechRecognizer.ERROR_SPEECH_TIMEOUT){restart();return;}running=false;JSObject r=new JSObject();r.put("message",error==SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS?"Permite el micrófono.":"La transcripción se detuvo ("+error+"). Reintenta.");notifyListeners("speechError",r);}
 });recognizer.startListening(intent());call.resolve();});}
 private Intent intent(){Intent i=new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);i.putExtra(RecognizerIntent.EXTRA_LANGUAGE,"es-MX");i.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS,true);return i;}
 private void restart(){if(running&&recognizer!=null)getBridge().getWebView().postDelayed(()->{if(running&&recognizer!=null)recognizer.startListening(intent());},400);}
 @PluginMethod public void stop(PluginCall call){running=false;getActivity().runOnUiThread(()->{if(recognizer!=null){recognizer.cancel();recognizer.destroy();recognizer=null;}call.resolve();});}
 @Override protected void handleOnDestroy(){running=false;if(recognizer!=null){recognizer.destroy();recognizer=null;}if(voice!=null){voice.shutdown();voice=null;}}
}
