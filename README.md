<div align="center">
  <h1>🤖 Autonomous AI Captcha Agent</h1>
  <p><b>Enterprise-Grade Vision AI & Human-Evasion Engine</b></p>
  
  [![React](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![Gemini API](https://img.shields.io/badge/AI-Google_Gemini_Vision-orange.svg?style=for-the-badge)](https://deepmind.google/technologies/gemini/)
</div>

<br/>

<div align="center">
  <h3>🌍 Live Project Links</h3>
  <a href="https://sentinel-ai-autonomous-browser-evas.vercel.app"><b>📺 View Frontend Dashboard (Vercel)</b></a> | 
  <a href="https://sentinel-ai-autonomous-browser-evasion.onrender.com/health"><b>🧠 View AI Backend Health (Render)</b></a>
</div>

<br/>

An advanced, full-stack autonomous agent designed to identify, intercept, and solve complex captchas (Image Grids, Distorted Text, Sliders, and Contextual Objects) across the web using Google's Gemini Vision AI and mathematical human-interaction simulations.

---

## 🌟 Core Architecture (20+ LPA Standard)

This project utilizes a highly modular **Monorepo Architecture**, separating the system into three distinct operational domains:

1. **🧠 The Brain (Backend Microservice)**: A secure Node.js/Express server that integrates the `GEMINI_API_KEY`. It receives screenshots, constructs multi-modal prompts, and parses the AI's response into exact mathematical (X, Y) coordinates.
2. **🌐 The Eyes & Hands (Chrome Extension)**: A Manifest V3 Extension running `content.js` and background workers. It autonomously detects captchas on live websites, injects a seamless "SOLVE PUZZLE" button, and executes the physical click simulations.
3. **💻 Mission Control (React Dashboard)**: A premium, glassmorphic UI built with Zustand for ultra-fast state management, providing real-time telemetry and a visual simulation of the agent's internal neural logic.

---

## ⚡ Breakthrough Features

*   **🖱️ Human-Like Evasion Engine**: To prevent being blocked by security systems like Cloudflare or GitHub Arkose Labs, the agent uses **Cubic Bezier Curves** with micro-jitters to simulate perfectly realistic, non-linear human mouse movements. It does not instantly "teleport" the mouse.
*   **🎯 "One-Click" Injection**: The Chrome Extension automatically injects a floating `🤖 SOLVE PUZZLE` button next to any detected captcha on any website. 
*   **🔒 Secure API Bridging**: The AI logic is completely decoupled from the browser, preventing API key theft and ensuring enterprise-level security.

---

## 🚀 Step-by-Step Setup Guide

### 1. Local Development Installation
```bash
# Clone the repository
git clone https://github.com/your-username/autonomous-captcha-agent.git
cd autonomous-captcha-agent

# Install dependencies for both Frontend and Backend automatically
npm run install:all
```

*Note: Create a `.env` file in the `/backend` directory and add `GEMINI_API_KEY=your_actual_key` to activate real AI vision.*

### 2. Start the Local Servers
Run both the React Dashboard and Node.js Backend concurrently with a single command:
```bash
npm run dev
```
*   **Frontend Dashboard**: `http://localhost:3000`
*   **Backend Server**: `http://localhost:4000`

---

## 🧩 Chrome Extension Installation

To enable the agent to solve captchas on live websites (like Google or GitHub):

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** (top right corner).
3. Click **Load unpacked** and select the `/extension` folder from this repository.
4. *(Optional)* To use the agent in private browsing: Click **Details** on the extension and turn ON **Allow in Incognito**.
5. Visit any website with a captcha (e.g., [Google reCAPTCHA Demo](https://www.google.com/recaptcha/api2/demo)) to see the "SOLVE PUZZLE" button inject itself!

---

## ☁️ Cloud Deployment Guide (Production)

To make the agent accessible anywhere in the world, 24/7:

1. **Protect your Keys**: Ensure your `.env` file is listed in `.gitignore` (already configured).
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploying Captcha Agent"
   git push origin main
   ```
3. **Host the Backend**: Create an account on **Render.com** or **Railway.app**, connect your GitHub repo, and deploy the `/backend` folder. Add your `GEMINI_API_KEY` to the Cloud Environment Variables.
4. **Update the Extension**: Change the `http://localhost:4000` link in `extension/background.js` to your new live Render URL.
5. **Publish to Chrome Web Store**: Zip the `/extension` folder and upload it to the Chrome Developer Dashboard to share it globally.

---

> **Architected & Engineered by Utkarsh Srivastav**  
> <sub>*Founder & Lead Engineer* | *Autonomous Systems & AI Integration*</sub>  
> <sup>Bringing Enterprise-Grade Automation to the Modern Web.</sup>
