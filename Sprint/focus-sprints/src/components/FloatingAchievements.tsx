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
  useEffect(() => {
    setPortalContainer(document.body);
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
        color: '#10b981',
        glowColor: '#34d399',
        isActive: todayCompleted > 0,
        type: 'progress'
      },
      {
        id: 'focus-streak',
        title: 'Focus Streak',
        icon: '🔥',
        value: streakStats.currentStreak,
        maxValue: streakStats.longestStreak > 0 ? streakStats.longestStreak : 7,
        color: '#f59e0b',
        glowColor: '#fbbf24',
        isActive: streakStats.currentStreak > 0,
        type: 'streak'
      },
      {
        id: 'task-master',
        title: 'Tasks Done',
        icon: '⚡',
        value: todayCompleted,
        color: '#8b5cf6',
        glowColor: '#a78bfa',
        isActive: todayCompleted > 0,
        type: 'counter'
      },
      {
        id: 'productivity-level',
        title: 'Productivity',
        icon: '💪',
        value: Math.round(completionRate),
        maxValue: 100,
        color: '#ef4444',
        glowColor: '#f87171',
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

    return (
      <div
        key={achievement.id}
        className={`floating-achievement ${achievement.isActive ? 'active' : ''}`}
        style={{
          left: '50px',
          top: `${150 + index * 100}px`,
          animationDelay: `${index * 0.2}s`,
          '--glow-color': achievement.glowColor,
          '--main-color': achievement.color,
        } as React.CSSProperties}
      >
        <div className="achievement-icon">{achievement.icon}</div>
        <div className="achievement-content">
          <div className="achievement-title">{achievement.title}</div>
          <div className="achievement-value">{getDisplayValue()}</div>
          {(achievement.type === 'progress' || achievement.type === 'streak') && achievement.maxValue && (
            <div className="achievement-progress">
              <div 
                className="achievement-progress-bar"
                style={{ 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: achievement.color 
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const achievementElements = (
    <div className="floating-achievements-container">
      {achievements.map(renderAchievement)}
    </div>
  );

  if (!portalContainer) {
    return achievementElements;
  }

  return createPortal(achievementElements, portalContainer);
};

export default FloatingAchievements;
