# Real-World Integration Guide

This project is currently a **High-Fidelity Simulation** designed to demonstrate the UI and logic of an autonomous agent. To transition this into a tool that solves captchas on live websites (like GitHub or Google), you would need to implement the following architectural bridge:

## 1. The Browser Extension (The "Eyes & Hands")
To interact with external websites, you need a Browser Extension (Chrome/Edge/Brave).
*   **Role**: It injects a script into the target page (e.g., github.com).
*   **Action**: It detects the `<iframe>` or `<img>` containing the captcha, takes a screenshot, and sends it to your Dashboard.
*   **Execution**: Once the Dashboard solves it, the extension receives the coordinates and performs "Virtual Clicks" on the real page.

## 2. API Integration (The "Brain")
Instead of the mocked logic in `solveChallenge`, you would connect a real Vision AI:
*   **Gemini 2.0 / GPT-4o**: Send the captcha image to an AI API.
*   **Prompt**: "Identify the coordinates of all cars in this image" or "OCR the text in this image."
*   **Mapping**: Map the AI's response back to the percentages used by the `AgentOverlay`.

## 3. Communication Bridge (The "Nerve System")
You need a way for your Dashboard to talk to the extension:
*   **WebSockets**: Use `Socket.io` or standard WebSockets to create a real-time link.
*   **Flow**:
    1.  User opens GitHub.
    2.  Extension detects Captcha -> Sends to Dashboard via WebSocket.
    3.  Dashboard shows the image -> AI solves it -> AgentOverlay shows the boxes.
    4.  Dashboard sends "Click(x, y)" command back to Extension.
    5.  Extension clicks the real button.

## 4. How to Run for Development
To start your current simulation and begin building these bridges:

```bash
# 1. Install dependencies
npm install

# 2. Run the Dashboard
npm run dev
```

## Target: Google reCAPTCHA Walkthrough

If you want to solve a captcha on a real Google Search or Login page:

1.  **Identify the Iframe**:
    Google uses `<iframe>` tags for reCAPTCHA. Your `content.js` is already configured to find these using the selector: `iframe[src*="recaptcha"]`.

2.  **The Flow**:
    *   **Step A**: Visit a Google page with a captcha.
    *   **Step B**: Your extension's `content.js` will automatically find the captcha and apply a **Blue Neural Glow** to it.
    *   **Step C**: Open your extension dashboard. It will say "TARGET_DETECTED: GOOGLE_RECAPTCHA".
    *   **Step D**: When you click **SOLVE_NOW**, the dashboard sends a message to the extension to "Capture" the screenshot of that specific iframe.
    *   **Step E**: The dashboard displays the screenshot, and your agent calculates the click positions.

3.  **Advanced: Automated Bypassing**:
    To fully automate this (so the user doesn't have to click anything), you would use the `chrome.scripting.executeScript` API in your `background.js` to simulate a real mouse click on the "I'm not a robot" checkbox once the AI gives the "OK".

---

### How to Run it Right Now:
1.  Open Chrome and go to `chrome://extensions`.
2.  Enable **Developer Mode**.
3.  Click **Load Unpacked** and select your `dist` folder.
4.  Go to a [reCAPTCHA Demo Page](https://www.google.com/recaptcha/api2/demo).
5.  You will see your agent **glow** around the Google captcha box!

