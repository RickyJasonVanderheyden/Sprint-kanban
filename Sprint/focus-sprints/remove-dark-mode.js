import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Function to remove all dark: classes from a string
function removeDarkClasses(content) {
  // Remove dark: classes but keep the rest
  return content.replace(/\s*dark:[a-zA-Z0-9-]+/g, '');
}

// List of files to process
const filesToProcess = [
  'src/components/TaskList.tsx',
  'src/components/EnergySelector.tsx',
  'src/components/Dashboard.tsx',
  'src/components/KanbanBoard.tsx',
  'src/components/AddTask.tsx',
  'src/components/FocusTimer.tsx',
  'src/components/TabNav.tsx',
  'src/pages/focus.tsx',
  'src/pages/index.tsx',
  'src/pages/kanban.tsx',
  'src/pages/login.tsx',
  'src/pages/register.tsx',
];

// Process each file
filesToProcess.forEach(filePath => {
  try {
    const fullPath = join(process.cwd(), filePath);
    const content = readFileSync(fullPath, 'utf-8');
    const updatedContent = removeDarkClasses(content);
    
    if (content !== updatedContent) {
      writeFileSync(fullPath, updatedContent, 'utf-8');
      console.log(`✅ Removed dark classes from: ${filePath}`);
    } else {
      console.log(`⚪ No dark classes found in: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('🎉 Dark mode removal complete!');
