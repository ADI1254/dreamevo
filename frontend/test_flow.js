/**
 * Automated test flow for DreamPulse
 * Fills in all form fields and triggers the dream experience
 */

console.log('🎬 Starting DreamPulse automated test flow...');

// Wait for DOM to be ready
function runTest() {
  console.log('📍 Step 1: Selecting Journey world...');
  
  // Click Journey card choose button
  const journeyBtn = document.querySelector('[data-world="journey"] .card-choose-btn');
  if (journeyBtn) {
    journeyBtn.click();
    console.log('✓ Journey selected');
  } else {
    console.error('✗ Journey button not found');
    return;
  }

  // Wait for UI to show mood section
  setTimeout(() => {
    console.log('📍 Step 2: Selecting Calm mood...');
    
    const calmMoodBtn = document.querySelector('[data-mood="calm"]');
    if (calmMoodBtn) {
      calmMoodBtn.click();
      console.log('✓ Calm mood selected');
    } else {
      console.error('✗ Calm mood button not found');
      return;
    }

    // Wait for name section to appear
    setTimeout(() => {
      console.log('📍 Step 3: Entering name...');
      
      const nameInput = document.querySelector('#userName');
      if (nameInput) {
        nameInput.value = 'DreamTester';
        nameInput.focus();
        console.log('✓ Name entered: DreamTester');
      } else {
        console.error('✗ Name input not found');
        return;
      }

      // Wait for CTA section to appear
      setTimeout(() => {
        console.log('📍 Step 4: Clicking Enter Dream button...');
        
        const startBtn = document.querySelector('#startButton');
        if (startBtn) {
          startBtn.click();
          console.log('✓ Enter Dream button clicked');
          console.log('🎬 Test flow completed successfully!');
        } else {
          console.error('✗ Start button not found');
        }
      }, 800);
    }, 800);
  }, 800);
}

// Start test when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runTest);
} else {
  runTest();
}
