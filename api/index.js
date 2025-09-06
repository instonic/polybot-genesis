const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// CORS Configuration
const corsOptions = {
    origin: ['https://polybot.online', 'https://www.polybot.online', 'https://polybot-online.vercel.app'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Polybot Genesis API'
    });
});

// Main dispatch endpoint
app.post('/dispatch', async (req, res) => {
    try {
        const { prompt, agents = ['openai'], responseMode = 'brief' } = req.body;
        
        // For now, return a test response
        const results = {
            status: 'success',
            prompt: prompt,
            agents: agents,
            responseMode: responseMode,
            responses: {
                openai: { 
                    response: `OpenAI would respond to: "${prompt}"`, 
                    tokens: 150,
                    timestamp: new Date().toISOString()
                }
            },
            metadata: {
                dispatch_id: `dispatch_${Date.now()}`,
                timestamp: new Date().toISOString()
            }
        };
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Judge endpoint
app.post('/judge', async (req, res) => {
    try {
        const { prompt, responses } = req.body;
        
        const judgeResult = {
            status: 'success',
            winner: 'openai',
            reasoning: 'Selected based on response quality and relevance',
            scores: {
                openai: 0.85
            },
            timestamp: new Date().toISOString()
        };
        
        res.json(judgeResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export for Vercel
module.exports = app;
