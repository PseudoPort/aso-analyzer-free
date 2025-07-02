const store = require('app-store-scraper');

/**
 * Simple app store scraper service
 * Fetches app data by track ID from App Store
 */
async function getAppData(trackId) {
  try {
    // Validate trackId is numeric
    const numericTrackId = parseInt(trackId, 10);
    if (isNaN(numericTrackId)) {
      throw new Error('Invalid trackId. Must be a numeric value.');
    }

    // Fetch app data from app-store-scraper
    const appData = await store.app({ id: numericTrackId });
    
    // Return structured data with title, description, and screenshots
    return {
      title: appData.title,
      description: appData.description,
      genres: appData.genres || [],
      screenshots: appData.screenshots || []
    };
    
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('404')) {
      throw new Error('App not found');
    }
    throw new Error(`Failed to fetch app data: ${error.message}`);
  }
}

/**
 * Get similar apps by track ID
 */
async function getSimilarApps(trackId) {
  try {
    // Validate trackId is numeric
    const numericTrackId = parseInt(trackId, 10);
    if (isNaN(numericTrackId)) {
      throw new Error('Invalid trackId. Must be a numeric value.');
    }

    // Fetch similar apps data from app-store-scraper
    const similarApps = await store.similar({ id: numericTrackId });
    
    return similarApps;
    
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('404')) {
      throw new Error('App not found');
    }
    throw new Error(`Failed to fetch similar apps: ${error.message}`);
  }
}

module.exports = {
  getAppData,
  getSimilarApps
};