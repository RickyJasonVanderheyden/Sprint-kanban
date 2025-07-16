import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

interface TaskCatProps {
  remainingTasks: number;
  initialPosition?: 'left' | 'right';
}

interface TaskCatHandle {
  resetPosition: () => void;
}

const TaskCat = forwardRef<TaskCatHandle, TaskCatProps>(({ remainingTasks, initialPosition = 'left' }, ref) => {
  const [position, setPosition] = useState({ x: 200, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const catRef = useRef<HTMLDivElement>(null);

  // Initialize position and portal container on mount
  useEffect(() => {
    if (!isInitialized) {
      // Calculate initial position based on initialPosition prop and screen size
      const screenWidth = window.innerWidth;
      // Use base cat dimensions (90x110) and calculate actual size after scaling
      const baseWidth = 90;
      const baseHeight = 110;
      const scale = screenWidth <= 480 ? 0.75 : screenWidth <= 768 ? 0.8 : screenWidth <= 1200 ? 0.9 : 1;
      const catWidth = baseWidth * scale;
      const catHeight = baseHeight * scale;
      const margin = screenWidth <= 480 ? 10 : 20;
      const signWidth = 120 * scale; // Account for sign width
      
      const initialX = initialPosition === 'right' 
        ? screenWidth - catWidth - margin - signWidth // Extra space for sign
        : margin;
      const initialY = screenWidth <= 480 ? 80 : 120;
      setPosition({ x: initialX, y: initialY });
      setIsInitialized(true);
    }
    
    // Set portal container to document body
    setPortalContainer(document.body);
  }, [isInitialized, initialPosition]);

  // Expose reset function to parent
  useImperativeHandle(ref, () => ({
    resetPosition: () => {
      const screenWidth = window.innerWidth;
      // Use base cat dimensions (90x110) and calculate actual size after scaling
      const baseWidth = 90;
      const baseHeight = 110;
      const scale = screenWidth <= 480 ? 0.75 : screenWidth <= 768 ? 0.8 : screenWidth <= 1200 ? 0.9 : 1;
      const catWidth = baseWidth * scale;
      const catHeight = baseHeight * scale;
      const margin = screenWidth <= 480 ? 10 : 20;
      const signWidth = 120 * scale; // Account for sign width
      
      const resetX = initialPosition === 'right' 
        ? screenWidth - catWidth - margin - signWidth // Extra space for sign
        : margin;
      const resetY = screenWidth <= 480 ? 80 : 120;
      setPosition({ x: resetX, y: resetY });
      setIsInitialized(true);
    }
  }));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!catRef.current) return;
    
    // Simple offset calculation - just use the mouse position relative to the cat's current position
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;
    
    console.log('Mouse down:', { clientX: e.clientX, clientY: e.clientY, posX: position.x, posY: position.y, offsetX, offsetY });
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!catRef.current) return;
    
    const touch = e.touches[0];
    const offsetX = touch.clientX - position.x;
    const offsetY = touch.clientY - position.y;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      console.log('Mouse move:', { 
        clientX: e.clientX, 
        clientY: e.clientY, 
        dragOffsetX: dragOffset.x, 
        dragOffsetY: dragOffset.y, 
        newX, 
        newY,
        oldPosX: position.x,
        oldPosY: position.y
      });
      
      // Add boundaries to keep cat within viewport
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      // Use base cat dimensions (90x110) and calculate actual size after scaling
      const baseWidth = 90;
      const baseHeight = 110;
      const scale = screenWidth <= 480 ? 0.75 : screenWidth <= 768 ? 0.8 : screenWidth <= 1200 ? 0.9 : 1;
      const catWidth = (baseWidth * scale) + (120 * scale); // Add space for sign
      const catHeight = baseHeight * scale;
      
      const boundedX = Math.max(0, Math.min(newX, screenWidth - catWidth));
      const boundedY = Math.max(0, Math.min(newY, screenHeight - catHeight));
      
      setPosition({
        x: boundedX,
        y: boundedY
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;
      
      // Add boundaries to keep cat within viewport for touch devices
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      // Use base cat dimensions (80x100) and calculate actual size after scaling
      const baseWidth = 80;
      const baseHeight = 100;
      const scale = screenWidth <= 480 ? 0.6 : screenWidth <= 768 ? 0.75 : screenWidth <= 1200 ? 0.9 : 1;
      const catWidth = (baseWidth * scale) + (110 * scale); // Add space for sign
      const catHeight = baseHeight * scale;
      
      const boundedX = Math.max(0, Math.min(newX, screenWidth - catWidth));
      const boundedY = Math.max(0, Math.min(newY, screenHeight - catHeight));
      
      setPosition({
        x: boundedX,
        y: boundedY
      });
      
      e.preventDefault();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  // Handle window resize to reposition cat if needed
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      // Use base cat dimensions (80x100) and calculate actual size after scaling
      const baseWidth = 80;
      const baseHeight = 100;
      const scale = screenWidth <= 480 ? 0.6 : screenWidth <= 768 ? 0.75 : screenWidth <= 1200 ? 0.9 : 1;
      const catWidth = (baseWidth * scale) + (110 * scale); // Add space for sign
      const catHeight = baseHeight * scale;
      
      // Check if cat is outside the viewport after resize
      const maxX = screenWidth - catWidth;
      const maxY = screenHeight - catHeight;
      
      if (position.x > maxX || position.y > maxY) {
        setPosition(prev => ({
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY)
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  const catElement = (
    <div 
      className={`task-cat-container ${isDragging ? 'dragging' : ''}`}
      ref={catRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
        visibility: isInitialized ? 'visible' : 'hidden',
        zIndex: 9999999,
        position: 'fixed',
        // Make touch interactions more responsive
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <div className="task-cat">
        {/* Cat body */}
        <div className="cat-body">
          {/* Cat head */}
          <div className="cat-head">
            {/* Cat ears */}
            <div className="cat-ear cat-ear-left"></div>
            <div className="cat-ear cat-ear-right"></div>
            
            {/* Cat face */}
            <div className="cat-face">
              {/* Eyes */}
              <div className="cat-eye cat-eye-left"></div>
              <div className="cat-eye cat-eye-right"></div>
              
              {/* Nose */}
              <div className="cat-nose"></div>
              
              {/* Mouth */}
              <div className="cat-mouth"></div>
              
              {/* Whiskers */}
              <div className="cat-whisker cat-whisker-left-1"></div>
              <div className="cat-whisker cat-whisker-left-2"></div>
              <div className="cat-whisker cat-whisker-right-1"></div>
              <div className="cat-whisker cat-whisker-right-2"></div>
            </div>
          </div>
          
          {/* Cat body torso */}
          <div className="cat-torso">
            {/* Cat arms */}
            <div className="cat-arm cat-arm-left"></div>
            <div className="cat-arm cat-arm-right"></div>
            
            {/* Cat legs */}
            <div className="cat-leg cat-leg-left"></div>
            <div className="cat-leg cat-leg-right"></div>
          </div>
          
          {/* Cat tail */}
          <div className="cat-tail"></div>
        </div>
        
        {/* Sign that cat is holding */}
        <div className="cat-sign">
          <div className="sign-post"></div>
          <div className="sign-board">
            <div className="sign-text">
              {remainingTasks > 0 ? (
                <>
                  <span className="task-count">{remainingTasks}</span>
                  <span className="task-label">tasks left</span>
                </>
              ) : (
                <>
                  <span className="task-count">Welcome</span>
                  <span className="task-label">to focus!</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render using portal to document body to escape any container constraints
  if (!portalContainer) {
    // Fallback: render normally if portal container is not ready
    return catElement;
  }
  
  return createPortal(catElement, portalContainer);
});

TaskCat.displayName = 'TaskCat';

export default TaskCat;
