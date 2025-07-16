import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { updateStreak, getCurrentStreak, getStreakStats } from '../lib/streakUtils';

interface FloatingAchievementsProps {
  tasks: any[];
  completedTasks: number;
  totalTasks: number;
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
  value: number;
  maxValue?: number;
  color: string;
  glowColor: string;
  isActive: boolean;
  type: 'counter' | 'progress' | 'streak';
}

const FloatingAchievements: React.FC<FloatingAchievementsProps> = ({ 
  tasks, 
  completedTasks, 
  totalTasks 
}) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isMobileToggleOpen, setIsMobileToggleOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setPortalContainer(document.body);
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Update streak data when tasks change
    const todayCompleted = completedTasks;
    updateStreak(todayCompleted);
    
    // Calculate achievements based on current data
    const todayTotal = totalTasks;
    const completionRate = todayTotal > 0 ? (todayCompleted / todayTotal) * 100 : 0;
    const streakStats = getStreakStats();

    const newAchievements: Achievement[] = [
      {
        id: 'daily-progress',
        title: 'Daily Progress',
        icon: '🎯',
        value: todayCompleted,
        maxValue: todayTotal,
        color: '#4CAF50',
        glowColor: '#66BB6A',
        isActive: todayCompleted > 0,
        type: 'progress'
      },
      {
        id: 'focus-streak',
        title: 'Focus Streak',
        icon: '🔥',
        value: streakStats.currentStreak,
        maxValue: streakStats.longestStreak > 0 ? streakStats.longestStreak : 7,
        color: '#FF9800',
        glowColor: '#FFB74D',
        isActive: streakStats.currentStreak > 0,
        type: 'streak'
      },
      {
        id: 'task-master',
        title: 'Tasks Done',
        icon: '✅',
        value: todayCompleted,
        color: '#9C27B0',
        glowColor: '#BA68C8',
        isActive: todayCompleted > 0,
        type: 'counter'
      },
      {
        id: 'productivity-level',
        title: 'Productivity',
        icon: '💪',
        value: Math.round(completionRate),
        maxValue: 100,
        color: '#2196F3',
        glowColor: '#64B5F6',
        isActive: completionRate > 0,
        type: 'progress'
      }
    ];

    setAchievements(newAchievements);
  }, [completedTasks, totalTasks]);

  const renderAchievement = (achievement: Achievement, index: number) => {
    const getDisplayValue = () => {
      switch (achievement.type) {
        case 'progress':
          return `${achievement.value}${achievement.maxValue ? `/${achievement.maxValue}` : '%'}`;
        case 'counter':
          return achievement.value.toString();
        case 'streak':
          return achievement.value === 0 ? '0d' : `${achievement.value}d`;
        default:
          return achievement.value.toString();
      }
    };

    const getProgressPercentage = () => {
      if (achievement.type === 'progress' && achievement.maxValue) {
        return (achievement.value / achievement.maxValue) * 100;
      }
      if (achievement.type === 'streak' && achievement.maxValue) {
        return Math.min((achievement.value / achievement.maxValue) * 100, 100);
      }
      return 100;
    };

    const getDataType = () => {
      switch (achievement.id) {
        case 'daily-progress':
          return 'daily';
        case 'focus-streak':
          return 'streak';
        case 'task-master':
          return 'tasks';
        case 'productivity-level':
          return 'productivity';
        default:
          return 'focus';
      }
    };

    const getSubtitle = () => {
      switch (achievement.id) {
        case 'daily-progress':
          return 'Today\'s Tasks';
        case 'focus-streak':
          return 'Consecutive Days';
        case 'task-master':
          return 'Completed';
        case 'productivity-level':
          return 'Completion Rate';
        default:
          return '';
      }
    };

    return (
      <div
        key={achievement.id}
        className="achievement"
        data-type={getDataType()}
      >
        <div className="achievement-icon">{achievement.icon}</div>
        <div className="achievement-content">
          <div className="achievement-title">{achievement.title}</div>
          <div className="achievement-value">{getDisplayValue()}</div>
          <div className="achievement-subtitle">{getSubtitle()}</div>
          {(achievement.type === 'progress' || achievement.type === 'streak') && achievement.maxValue && (
            <div className="achievement-progress">
              <div 
                className="achievement-progress-bar"
                style={{ 
                  width: `${getProgressPercentage()}%`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const achievementElements = (
    <>
      {isMobile && (
        <div className="mobile-achievements-toggle">
          <button 
            className="toggle-button"
            onClick={() => setIsMobileToggleOpen(!isMobileToggleOpen)}
          >
            <span className="toggle-icon">🏆</span>
            <span className="toggle-text">Achievements</span>
            <span className={`toggle-arrow ${isMobileToggleOpen ? 'open' : ''}`}>▼</span>
          </button>
        </div>
      )}
      <div className={`achievements-container ${isMobile ? 'mobile' : ''} ${isMobile && isMobileToggleOpen ? 'mobile-open' : ''}`}>
        {achievements.map(renderAchievement)}
      </div>
    </>
  );

  if (!portalContainer) {
    return achievementElements;
  }

  return createPortal(achievementElements, portalContainer);
};

export default FloatingAchievements;
