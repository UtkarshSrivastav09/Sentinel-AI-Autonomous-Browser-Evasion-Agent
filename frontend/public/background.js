/**
 * Autonomous Captcha Agent - Background Service Worker
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log("Captcha Agent By Utkarsh Installed.");
  
  // Create Context Menu
  chrome.contextMenus.create({
    id: "solve-captcha-utkarsh",
    title: "Solve with Utkarsh Agent",
    contexts: ["image", "frame"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "solve-captcha-utkarsh") {
    // Open the dashboard in a new tab and start solving
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html?autosolve=true") });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CAPTCHA_DETECTED") {
    console.log("Captcha detected on tab:", sender.tab.id);
    // You could update the extension icon or badge here
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeBackgroundColor({ color: "#6366f1" });
  }
  
  if (message.type === "SOLVE_REQUEST") {
    console.log("Solving captcha for tab:", message.tabId);
    sendResponse({ status: "processing" });
  }
  
  return true;
});
