// Content Script to detect captchas and add a simple "Solve" button

console.log("Captcha Agent Content Script Loaded");

// Look for common captcha iframes (e.g., reCAPTCHA, hCaptcha, ArkoseLabs)
function detectCaptchas() {
    const iframes = document.querySelectorAll('iframe[src*="recaptcha"], iframe[src*="hcaptcha"], iframe[src*="arkoselabs"]');
    
    iframes.forEach(iframe => {
        if (!iframe.classList.contains('agent-detected')) {
            iframe.classList.add('agent-detected');
            
            // 1. Add the Neural Glow to the puzzle
            iframe.style.boxShadow = '0 0 20px 5px rgba(79, 70, 229, 0.6)';
            iframe.style.border = '2px solid rgb(79, 70, 229)';
            
            // 2. Create the simple "SOLVE" button
            const solveBtn = document.createElement('button');
            solveBtn.innerHTML = '🤖 SOLVE PUZZLE';
            solveBtn.style.cssText = `
                position: absolute;
                z-index: 999999;
                background: #4f46e5;
                color: white;
                font-weight: bold;
                padding: 10px 16px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                font-family: sans-serif;
                font-size: 14px;
                margin-top: -50px;
                margin-left: 10px;
            `;

            // Place the button right before the iframe in the HTML
            iframe.parentNode.insertBefore(solveBtn, iframe);

            // 3. When the user clicks the button, tell the agent to solve it!
            solveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                solveBtn.innerHTML = '⏳ SOLVING...';
                solveBtn.style.background = '#fbbf24'; // yellow
                
                console.log("User clicked solve! Sending to Brain...");
                
                // Tell the background script to take a screenshot and solve
                chrome.runtime.sendMessage({ 
                    type: 'SOLVE_CAPTCHA',
                    challengeType: 'unknown',
                    instruction: 'Solve this puzzle automatically'
                }, (response) => {
                    if(response && response.status === 'success') {
                        solveBtn.innerHTML = '✅ SOLVED!';
                        solveBtn.style.background = '#10b981'; // green
                    } else {
                        solveBtn.innerHTML = '❌ ERROR';
                        solveBtn.style.background = '#ef4444'; // red
                    }
                });
            });
            
            console.log("Target Detected. Solve button injected!");
        }
    });
}

// Run detection periodically
setInterval(detectCaptchas, 2000);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'EXECUTE_CLICKS') {
        console.log("Agent is now moving the mouse to click the targets!", message.targets);
        // This is where the Bezier curve mouse movement would execute on the real page
    }
});
