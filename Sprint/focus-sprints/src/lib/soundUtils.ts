// Preload audio for instant playback
let completionAudio: HTMLAudioElement | null = null;

// Initialize audio on first load
const initializeAudio = () => {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  if (!completionAudio) {
    completionAudio = new Audio('/short-success-sound-glockenspiel-treasure-video-game-6346.mp3');
    completionAudio.volume = 0.3;
    completionAudio.preload = 'auto';
    // Load the audio file immediately
    completionAudio.load();
  }
};

// Sound utility for playing completion sounds
export const playCompletionSound = (volume: number = 0.3) => {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  try {
    // Initialize audio if not already done
    if (!completionAudio) {
      initializeAudio();
    }
    
    if (completionAudio) {
      completionAudio.volume = Math.max(0, Math.min(1, volume));
      completionAudio.currentTime = 0; // Reset to beginning for instant replay
      completionAudio.play().catch((error) => {
        console.log('Could not play completion sound:', error);
      });
    }
  } catch (error) {
    console.log('Error playing audio:', error);
  }
};

// Initialize audio when module loads (only in browser)
if (typeof window !== 'undefined') {
  initializeAudio();
}

export const playSuccessSound = playCompletionSound; // Alias for consistency

// Test function to play sound immediately (for debugging)
export const testCompletionSound = () => {
  console.log('Playing test completion sound...');
  playCompletionSound(0.5);
};
