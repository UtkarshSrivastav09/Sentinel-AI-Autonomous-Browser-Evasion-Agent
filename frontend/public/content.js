/**
 * Captcha Agent By Utkarsh - Content Script
 * This script runs on real websites to identify captcha elements.
 */

console.log("%c[Utkarsh-Agent] Initializing Neural Scanner...", "color: #6366f1; font-weight: bold;");

// Function to inject the "Neural Eye" button
function injectSolverButton(targetElement) {
  if (document.getElementById('utkarsh-solver-eye')) return;

  const eye = document.createElement('div');
  eye.id = 'utkarsh-solver-eye';
  eye.innerHTML = `
    <div style="
      position: absolute;
      top: -20px;
      right: -20px;
      width: 50px;
      height: 50px;
      background: #6366f1;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.5);
      z-index: 10000;
      border: 2px solid white;
      transition: all 0.3s ease;
      animation: utkarsh-pulse 2s infinite;
    ">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </div>
    <style>
      @keyframes utkarsh-pulse {
        0% { transform: scale(1); box-shadow: 0 10px 25px rgba(99, 102, 241, 0.5); }
        50% { transform: scale(1.1); box-shadow: 0 15px 35px rgba(99, 102, 241, 0.7); }
        100% { transform: scale(1); box-shadow: 0 10px 25px rgba(99, 102, 241, 0.5); }
      }
      #utkarsh-solver-eye:hover { transform: scale(1.1) rotate(12deg); }
    </style>
  `;

  eye.onclick = () => {
    chrome.runtime.sendMessage({ type: "SOLVE_REQUEST", status: "active" });
    alert("Utkarsh Agent: Initiating Neural Bypass...");
  };

  // Attach to the captcha container
  targetElement.style.position = 'relative';
  targetElement.appendChild(eye);
}

// Function to find captchas on the page
function scanForCaptchas() {
  const captchaSelectors = [
    'iframe[src*="recaptcha"]',
    'iframe[src*="hcaptcha"]',
    'div[class*="captcha"]',
    '#captcha',
    '.g-recaptcha'
  ];

  captchaSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      // Glow effect
      el.style.outline = "4px solid #6366f1";
      el.style.outlineOffset = "4px";
      el.style.borderRadius = "8px";
      el.style.boxShadow = "0 0 30px rgba(99, 102, 241, 0.3)";
      
      // Inject the Eye
      injectSolverButton(el.parentElement || el);
    });
  });
}

// Listen for manual triggers (from Context Menu)
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "MANUAL_SOLVE_TRIGGER") {
    alert("Utkarsh Agent: Context Menu Triggered. Solving...");
    chrome.runtime.sendMessage({ type: "SOLVE_REQUEST", status: "active" });
  }
});

// Run scan periodically
setInterval(scanForCaptchas, 3000);
scanForCaptchas();
