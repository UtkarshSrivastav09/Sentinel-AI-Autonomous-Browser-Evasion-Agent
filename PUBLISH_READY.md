# Chrome Web Store Submission Guide

To make your **Autonomous Captcha Agent** available for others to search and download, follow these steps:

## 1. Prepare for Production
First, ensure your project is built and optimized:
```bash
npm run build
```
This creates the `dist` folder, which contains your complete extension.

## Free Distribution via GitHub (No Fees)
If you want to share this for **FREE** without paying the Google Developer fee:
1.  Upload your project to a **GitHub Repository**.
2.  In the README, tell users to:
    *   Download the `.zip` of the code.
    *   Go to `chrome://extensions`.
    *   Enable **Developer Mode**.
    *   Click **Load Unpacked** and select the `dist` folder.

## 2. Chrome Web Store (Optional)
If you still want it to be searchable on the store:
1.  Go to the [Chrome Web Store Console](https://chrome.google.com/webstore/devconsole).
2.  Google requires a one-time $5 fee to prevent spam, but after that, you can list the extension as **100% FREE** for all users.

1.  Go into your `dist` folder.
2.  Select all files and **Compress/Zip** them into a file named `captcha-agent-v1.zip`.

## 4. Upload to the Console
1.  In the Developer Console, click **"+ New Item"**.
2.  Upload your `captcha-agent-v1.zip` file.
3.  Fill in the metadata:
    *   **Name**: Autonomous Captcha Agent
    *   **Summary**: AI-powered assistant for solving complex captchas.
    *   **Description**: High-fidelity neural solver for image grids, text distortion, and kinetic alignment.
    *   **Category**: Productivity / Accessibility.

## 5. Add Graphics (Mandatory)
You will need:
*   **Icon**: 128x128px PNG.
*   **Screenshots**: At least one 1280x800 or 640x400 image.
*   **Promotional Tile**: 440x280px image.

## 6. Submit for Review
Click **"Submit for Review"**. Google will check your extension for security and policy compliance. Once approved (usually 2-5 days), it will be searchable on the Chrome Web Store for anyone to download!

---

### Important: Real AI Backend
For the "Search and Download" version to actually solve captchas for other users, you must replace the simulated logic in `App.tsx` with a call to a real AI server (like a Cloud Function running Gemini or GPT-4o).
