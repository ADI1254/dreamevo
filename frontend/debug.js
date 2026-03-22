/**
 * Debug click handlers
 * Attach click listeners to buttons and log what happens
 */

console.log('🔧 Debug script loaded');

// Attach click handlers to all CHOOSE buttons
function attachDebugHandlers() {
  const buttons = document.querySelectorAll('.card-choose-btn');
  console.log(`Found ${buttons.length} CHOOSE buttons`);
  
  buttons.forEach((btn, index) => {
    const worldCard = btn.closest('.world-card');
    const world = worldCard ? worldCard.dataset.world : 'unknown';
    
    btn.addEventListener('click', function(e) {
      console.log(`✓ CLICK DETECTED on ${world} button (index: ${index})`);
      console.log('Event:', e);
      console.log('Button:', this);
      selectWorld(world);
      e.stopPropagation();
    });
    
    // Also add mousedown and touchstart
    btn.addEventListener('mousedown', function(e) {
      console.log(`📍 MOUSEDOWN on ${world} button`);
    });
    
    btn.addEventListener('touchstart', function(e) {
      console.log(`📍 TOUCHSTART on ${world} button`);
    });
    
    console.log(`✓ Debug handlers attached to ${world} button`);
  });
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachDebugHandlers);
} else {
  attachDebugHandlers();
}

// Also log any click events on the entire page
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('card-choose-btn')) {
    console.log('🎯 PAGE-LEVEL CLICK detected on button');
  }
}, true); // Use capturing phase

console.log('🔧 Debug script ready - check console for click events');
