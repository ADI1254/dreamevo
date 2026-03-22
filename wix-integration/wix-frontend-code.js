// Wix Velo Frontend Code (Page Code)
// Add this to your Wix page to call the backend when buttons are clicked

import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(function () {
  
  // Journey button click handler
  $w('#journeyButton').onClick(async () => {
    await loadStory('journey', 'calm');
  });
  
  // Devotional button click handler
  $w('#devotionalButton').onClick(async () => {
    await loadStory('sanctuary', 'calm');
  });
  
  // Romantic button click handler
  $w('#romanticButton').onClick(async () => {
    await loadStory('exploration', 'curious');
  });
  
});

async function loadStory(world, mood) {
  try {
    // Show loading state
    $w('#loadingText').show();
    
    // Call your Wix backend endpoint (which calls FastAPI)
    const response = await wixLocation.to(`/story/${world}/${mood}`);
    
    // OR use wix-fetch to call directly:
    // const response = await fetch(`/_functions/getStory?world=${world}&mood=${mood}`);
    // const data = await response.json();
    
    // Display the story in a text element or lightbox
    $w('#storyText').text = data.story;
    $w('#storyModal').show();
    
  } catch (error) {
    console.error('Error loading story:', error);
    $w('#errorText').text = 'Failed to load story. Please try again.';
    $w('#errorText').show();
  } finally {
    $w('#loadingText').hide();
  }
}
