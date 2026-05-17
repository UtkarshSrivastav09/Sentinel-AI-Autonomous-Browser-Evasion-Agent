// Content Script to detect captchas and add a simple "Solve" button

console.log("Captcha Agent Content Script Loaded on: " + window.location.href);

// Check if we are inside the actual reCAPTCHA iframe
const isRecaptchaFrame = window.location.href.includes('google.com/recaptcha/api2/anchor');

if (isRecaptchaFrame) {
    console.log("Agent injected into reCAPTCHA iframe.");
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'EXECUTE_CLICKS') {
            const checkbox = document.querySelector('#recaptcha-anchor');
            if (checkbox) {
                console.log("Agent autonomously clicking the reCAPTCHA checkbox!");
                checkbox.click();
            }
        }
    });
} else {
    // Main Page Logic
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
            
            // Wait 1 second after solving to automatically signup/submit the page
            setTimeout(() => {
                // Try to find a sign up / submit button
                const submitBtn = document.querySelector('button[type="submit"], input[type="submit"]') || 
                                  Array.from(document.querySelectorAll('button')).find(b => 
                                      b.textContent.toLowerCase().includes('sign') || 
                                      b.textContent.toLowerCase().includes('submit') || 
                                      b.textContent.toLowerCase().includes('login') ||
                                      b.textContent.toLowerCase().includes('register')
                                  );
                
                if (submitBtn) {
                    console.log("Agent found Signup/Submit button! Autonomously clicking it...", submitBtn);
                    submitBtn.click();
                } else {
                    // Fallback: try to submit the nearest form
                    const form = document.querySelector('form');
                    if (form) {
                        console.log("Agent found form! Autonomously submitting it...");
                        form.submit();
                    }
                }
            }, 1000);
        }
    });
}
