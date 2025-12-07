# Voice Recorder Debugging Guide

## 🔍 Debug Logs Overview

The VoiceRecorder component now includes comprehensive logging to help diagnose recording issues. All logs are prefixed with `[VoiceRecorder]` for easy filtering.

## 📊 Log Categories

### 🎬 Component Lifecycle
- `🎬 Component mounted` - When component initializes
- `👋 Component unmounting` - When component cleans up

### 🔐 Permissions
- `🔐 Requesting initial permissions...` - Initial permission request on mount
- `📋 Requesting microphone permissions...` - Permission request on record start
- `✅ Permission granted` - Permission was granted
- `❌ Microphone permission denied` - Permission was denied
- `⚠️ Permission not granted initially` - No permission on initial check

### 🎤 Recording Operations
- `🎤 Starting recording process...` - Start button pressed
- `🔊 Setting audio mode...` - Configuring audio system
- `📊 Recorder status before start` - State before recording
- `🎙️ Calling audioRecorder.record()...` - Actual record call
- `📊 Recorder status after start` - State after recording
- `✅ Recording started successfully` - Recording confirmed active
- `❌ Recording did not start` - Recording failed to start
- `⏸️ Pausing recording...` - Pause requested
- `▶️ Resuming recording...` - Resume requested
- `🛑 Stopping recording...` - Stop requested
- `💾 Recording saved to: [uri]` - Recording file location

### ⏱️ Timer & Metering
- `⏱️ Starting timer...` - Timer started
- `⏹️ Stopping timer...` - Timer stopped
- `⚠️ Timer running but recorder not recording!` - **CRITICAL: Timer/recording desync**
- `🎵 Starting metering monitor...` - Audio level monitoring started
- `🔇 Stopping metering monitor...` - Audio level monitoring stopped
- `📊 Metering: {data}` - Periodic metering data (every ~2 seconds)
- `⚠️ 30 seconds remaining warning` - Close to max duration
- `⏰ Max duration reached` - Auto-stopping at 5 minutes

### ❌ Errors
- `💥 Recording error:` - Error during recording start
- `❌ Pause error:` - Error during pause
- `❌ Resume error:` - Error during resume
- `❌ Stop error:` - Error during stop
- `❌ Metering error:` - Error reading audio levels

## 🐛 Common Issues & What to Look For

### Issue 1: Timer runs but no recording (mic icon not showing on iPhone)

**Symptoms:**
- Timer counts up
- Visualizer may show minimal activity
- iPhone status bar doesn't show microphone icon
- No audio file created

**Debug Steps:**
1. Check initial permission log:
   ```
   [VoiceRecorder] 🔐 Initial permission result: {granted: true/false}
   ```

2. Check recording start sequence:
   ```
   [VoiceRecorder] 🎤 Starting recording process...
   [VoiceRecorder] 📋 Permission result: {...}
   [VoiceRecorder] 🔊 Setting audio mode...
   [VoiceRecorder] 📊 Recorder status before start: {isRecording: false, canRecord: true}
   [VoiceRecorder] 🎙️ Calling audioRecorder.record()...
   [VoiceRecorder] 📊 Recorder status after start: {isRecording: true/false}
   ```

3. **Critical Check:** Look for this log:
   ```
   [VoiceRecorder] ⚠️ Timer running but recorder not recording!
   ```
   This indicates the timer started but `audioRecorder.record()` didn't actually start recording.

4. Check for error logs:
   ```
   [VoiceRecorder] 💥 Recording error: [error message]
   ```

**Expected Behavior:**
- `status.isRecording` should be `true` after calling `audioRecorder.record()`
- If `isRecording` is `false`, the component will now show error and stop the timer

### Issue 2: Visualizer not aligned

**Symptoms:**
- Circular bars appear off-center
- Bars cut off at edges
- Microphone icon not centered

**Debug Steps:**
1. Check visualizer container dimensions in DevTools
2. Verify `VISUALIZER_RADIUS = 70` matches container size
3. Container should be 140x140px (radius * 2)

**Recent Fix:**
- Changed container from 200x200 to 140x140
- Fixed bar positioning to use `containerSize / 2` for centering
- Removed `translateY: -20` that was causing vertical misalignment

### Issue 3: Metering not working

**Symptoms:**
- Visualizer bars don't respond to voice
- Audio level bar stays at 0%
- Shows "Speak louder..." even when speaking

**Debug Steps:**
1. Look for metering logs (appears every ~2 seconds):
   ```
   [VoiceRecorder] 📊 Metering: {metering: -40, isRecording: true, durationMillis: 2500}
   ```

2. Check metering value:
   - Should be between -160 (silence) and 0 (loud)
   - If `undefined` or `null`, metering isn't enabled
   - If always around -160, microphone may not be capturing audio

3. Verify `isMeteringEnabled: true` in recorder config

## 🔧 Testing Checklist

### Before Recording:
- [ ] Check console for `🎬 Component mounted`
- [ ] Verify `🔐 Initial permission result: {granted: true}`
- [ ] Component should request permission on first launch

### During Recording:
- [ ] Press Start Recording button
- [ ] Check for `🎤 Starting recording process...`
- [ ] Verify `📊 Recorder status after start: {isRecording: true}`
- [ ] **iPhone status bar should show 🎤 microphone icon**
- [ ] Look for `⏱️ Starting timer...`
- [ ] Look for `🎵 Starting metering monitor...`
- [ ] Speak and watch for metering logs with changing values
- [ ] Visualizer bars should grow when speaking
- [ ] Audio level bar should fill when speaking

### After Stopping:
- [ ] Check for `🛑 Stopping recording...`
- [ ] Verify `💾 Recording saved to: [uri]`
- [ ] URI should not be empty or null
- [ ] Timer should stop
- [ ] Metering monitor should stop

## 📱 Device-Specific Notes

### iOS:
- Microphone icon appears in status bar when recording is active
- Permission dialog shows custom message from `app.json`
- Silent mode doesn't affect recording (configured)

### Android:
- Recording indicator in notification shade
- Permission dialog may look different
- Check `RECORD_AUDIO` permission in app settings

## 🚨 Critical Failure Points

If recording doesn't start, the issue is likely at one of these points:

1. **Permission denied**: Check permission logs
2. **Audio mode not set**: Check audio mode logs
3. **recorder.record() failed**: Check status logs after record()
4. **Recorder state invalid**: Check `canRecord` in status logs

The new logging will pinpoint exactly where the failure occurs!

## 📝 Reading Logs in Expo

**Terminal/Console:**
```bash
# Filter for VoiceRecorder logs only
npx expo start | grep "VoiceRecorder"

# Or use Expo DevTools console
# Open http://localhost:19002 and check Console tab
```

**React Native Debugger:**
- Open React Native Debugger
- Check Console tab
- Filter by "[VoiceRecorder]"

## 💡 Quick Diagnosis

Run through recording and look for these patterns:

✅ **Success Pattern:**
```
[VoiceRecorder] 🎤 Starting recording process...
[VoiceRecorder] 📋 Permission result: {granted: true, ...}
[VoiceRecorder] 🔊 Setting audio mode...
[VoiceRecorder] ✅ Audio mode set
[VoiceRecorder] 📊 Recorder status before start: {isRecording: false, canRecord: true, ...}
[VoiceRecorder] 🎙️ Calling audioRecorder.record()...
[VoiceRecorder] 📊 Recorder status after start: {isRecording: true, ...}
[VoiceRecorder] ✅ Recording started successfully
[VoiceRecorder] ⏱️ Starting timer...
[VoiceRecorder] 🎵 Starting metering monitor...
```

❌ **Failure Pattern:**
```
[VoiceRecorder] 🎤 Starting recording process...
[VoiceRecorder] 📋 Permission result: {granted: true, ...}
[VoiceRecorder] 🔊 Setting audio mode...
[VoiceRecorder] 🎙️ Calling audioRecorder.record()...
[VoiceRecorder] 📊 Recorder status after start: {isRecording: false, ...}  ← PROBLEM HERE
[VoiceRecorder] ❌ Recording did not start - isRecording is false
[VoiceRecorder] 💥 Recording error: Recording failed to start...
```

The second pattern shows `isRecording: false` after `record()` was called - this is the root cause!
