module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, responses, judge = 'anthropic' } = req.body;
    
    if (!prompt || !responses) {
      return res.status(400).json({ error: 'Prompt and responses are required' });
    }

    // Simulate judge evaluation
    const agents = Object.keys(responses);
    const randomWinner = agents[Math.floor(Math.random() * agents.length)];
    
    const scores = {};
    agents.forEach(agent => {
      scores[agent] = Math.random() * 0.3 + 0.7; // Random score between 0.7-1.0
    });
    
    // Boost the winner's score
    scores[randomWinner] = Math.max(scores[randomWinner], 0.85);

    const judgeResult = {
      status: 'success',
      judge: judge,
      winner: randomWinner,
      reasoning: `After analyzing all responses, ${randomWinner} provided the most comprehensive and accurate answer. The response demonstrated strong understanding of the prompt and delivered practical, well-structured information.`,
      scores: scores,
      evaluation: {
        criteria: ['accuracy', 'completeness', 'clarity', 'relevance'],
        detailed_scores: {
          [randomWinner]: {
            accuracy: 0.9,
            completeness: 0.85,
            clarity: 0.88,
            relevance: 0.92
          }
        }
      },
      metadata: {
        judge_id: `judge_${Date.now()}`,
        timestamp: new Date().toISOString(),
        agents_evaluated: agents.length,
        mode: 'demo'
      }
    };
    
    res.json(judgeResult);
  } catch (error) {
    console.error('Judge error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
