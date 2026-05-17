// Background Service Worker for Captcha Agent

chrome.runtime.onInstalled.addListener(() => {
  console.log("Autonomous Captcha Agent installed.");
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SOLVE_CAPTCHA') {
    console.log("Received captcha solve request:", message);
    
    // Simulate sending to backend
    fetch('http://localhost:4000/api/solve-captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        challengeType: message.challengeType,
        instruction: message.instruction,
        image: message.image // Base64 image
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Backend response:", data);
      sendResponse({ status: 'success', data });
      
      // Tell content script to execute clicks
      if (sender.tab && sender.tab.id) {
          chrome.tabs.sendMessage(sender.tab.id, {
              type: 'EXECUTE_CLICKS',
              targets: data.data.targets || []
          });
      }
    })
    .catch(err => {
      console.error("Backend error:", err);
      sendResponse({ status: 'error', error: err.message });
    });

    return true; // Keep message channel open for async response
  }
});
