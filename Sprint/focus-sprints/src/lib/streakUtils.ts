// Streak utility for tracking consecutive days of task completion
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
  streakHistory: { date: string; tasksCompleted: number }[];
}

const STREAK_STORAGE_KEY = 'focus-streak-data';

// Get today's date in YYYY-MM-DD format
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Get yesterday's date in YYYY-MM-DD format
const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

// Load streak data from localStorage
export const loadStreakData = (): StreakData => {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,
      streakHistory: []
    };
  }

  try {
    const stored = localStorage.getItem(STREAK_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading streak data:', error);
  }

  return {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: null,
    streakHistory: []
  };
};

// Save streak data to localStorage
export const saveStreakData = (data: StreakData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving streak data:', error);
  }
};

// Update streak when tasks are completed
export const updateStreak = (completedTasksToday: number): StreakData => {
  const streakData = loadStreakData();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // If no tasks completed today, don't update streak
  if (completedTasksToday === 0) {
    return streakData;
  }

  // Check if we already recorded today
  const todayExists = streakData.streakHistory.some(entry => entry.date === today);
  
  if (!todayExists) {
    // Add today's completion to history
    streakData.streakHistory.push({
      date: today,
      tasksCompleted: completedTasksToday
    });

    // Update streak logic
    if (streakData.lastCompletionDate === null) {
      // First ever completion
      streakData.currentStreak = 1;
    } else if (streakData.lastCompletionDate === yesterday) {
      // Consecutive day - increment streak
      streakData.currentStreak += 1;
    } else if (streakData.lastCompletionDate === today) {
      // Same day - don't change streak
      // This shouldn't happen with our check above, but just in case
    } else {
      // Gap in days - reset streak to 1
      streakData.currentStreak = 1;
    }

    // Update longest streak if current exceeds it
    if (streakData.currentStreak > streakData.longestStreak) {
      streakData.longestStreak = streakData.currentStreak;
    }

    // Update last completion date
    streakData.lastCompletionDate = today;

    // Clean up old history (keep last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0];
    
    streakData.streakHistory = streakData.streakHistory.filter(
      entry => entry.date >= thirtyDaysAgoString
    );

    // Save updated data
    saveStreakData(streakData);
  }

  return streakData;
};

// Get current streak (checks for breaks in streak)
export const getCurrentStreak = (): number => {
  const streakData = loadStreakData();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // If no completions ever, streak is 0
  if (!streakData.lastCompletionDate) {
    return 0;
  }

  // If last completion was today or yesterday, streak is current
  if (streakData.lastCompletionDate === today || streakData.lastCompletionDate === yesterday) {
    return streakData.currentStreak;
  }

  // Otherwise, streak is broken - reset to 0
  const updatedData = { ...streakData, currentStreak: 0 };
  saveStreakData(updatedData);
  return 0;
};

// Get streak statistics
export const getStreakStats = () => {
  const streakData = loadStreakData();
  return {
    currentStreak: getCurrentStreak(),
    longestStreak: streakData.longestStreak,
    lastCompletionDate: streakData.lastCompletionDate,
    totalActiveDays: streakData.streakHistory.length
  };
};
