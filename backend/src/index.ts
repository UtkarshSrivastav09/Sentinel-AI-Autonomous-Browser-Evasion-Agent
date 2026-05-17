import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini API (replace with actual API key setup via .env)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0' });
});

app.post('/api/solve-captcha', upload.single('image'), async (req, res) => {
  try {
    const { challengeType, instruction } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY set. Returning simulated response.");
      // Simulated response logic
      if (challengeType === 'image-grid') {
        return res.json({
          status: 'success',
          targets: [0, 2, 4, 7],
          confidence: 0.95
        });
      } else if (challengeType === 'text') {
        return res.json({
          status: 'success',
          solution: 'X8R2P',
          confidence: 0.99
        });
      }
    }

    // Real API Call (when key is available)
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            data: file.buffer.toString("base64"),
                            mimeType: file.mimetype
                        }
                    },
                    {
                        text: `This is a captcha challenge. Type: ${challengeType}. Instruction: ${instruction}. 
                        If it's an image grid, return the 0-indexed indices of the matching grid items as a JSON array (e.g., [0, 2]).
                        If it's text, return the exact text string. 
                        Return ONLY the raw JSON format with no markdown.`
                    }
                ]
            }
        ]
    });

    const aiText = response.text || '';
    
    // Simple parsing logic
    let parsedResult;
    try {
        parsedResult = JSON.parse(aiText);
    } catch(e) {
        // Fallback for raw text
        parsedResult = { solution: aiText.trim() };
    }

    res.json({
      status: 'success',
      data: parsedResult
    });

  } catch (error: any) {
    console.error('Error solving captcha:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🤖 Agent Backend running on port ${port}`);
});
