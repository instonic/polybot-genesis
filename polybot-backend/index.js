const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const AuditLogger = require('./logs/audit');
const ResponseValidator = require('./validator');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const auditLogger = new AuditLogger();

// CORS Configuration - supports development and production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://polybot.online', 'https://www.polybot.online']
        : true, // Allow all origins in development
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Log the enhanced system startup
console.log('🎉 Polybot Genesis: Multi-Agent Dispatch System with Audit Logging');
console.log('📝 Features: Response Validation, Judge Fallback, Snapshot Logging');

// Token mapping for response modes
const TOKEN_LIMITS = {
  brief: 300,
  full: 800,
  deepthink: 1500
};

// Test/Demo mode when API keys are not available
const TEST_MODE = process.env.TEST_MODE === 'true' || (!process.env.OPENAI_API_KEY && !process.env.GOOGLE_API_KEY && !process.env.DEEPSEEK_API_KEY);

if (TEST_MODE) {
  console.log('🧪 Running in TEST MODE - Using simulated responses');
  console.log('💡 Set API keys in .env file for live testing');
}

// LLM Provider Functions with response time tracking
async function callOpenAI(prompt, maxTokens = 500) {
  const startTime = Date.now();
  
  console.log(`🔍 OpenAI - TEST_MODE: ${TEST_MODE}`);
  
  if (TEST_MODE) {
    console.log('🧪 Using OpenAI simulation');
    // Simulate response time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    const endTime = Date.now();
    return {
      response: `[OpenAI Simulation] Quantum computing uses quantum mechanics principles like superposition and entanglement to process information. Unlike classical bits (0 or 1), quantum bits (qubits) can exist in multiple states simultaneously, enabling quantum computers to solve certain problems exponentially faster than classical computers.`,
      responseTime: endTime - startTime
    };
  }
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    const endTime = Date.now();
    const result = response.data.choices[0].message.content;
    return { response: result, responseTime: endTime - startTime };
  } catch (error) {
    const endTime = Date.now();
    throw { ...error, responseTime: endTime - startTime };
  }
}

async function callGoogle(prompt, maxTokens = 500) {
  const startTime = Date.now();
  
  console.log(`🔍 Google - TEST_MODE: ${TEST_MODE}`);
  
  if (TEST_MODE) {
    console.log('🧪 Using Google simulation');
    // Simulate response time
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 1000));
    const endTime = Date.now();
    return {
      response: `[Google Gemini Simulation] Quantum computing harnesses quantum mechanical phenomena to process data. Key concepts include: 1) Superposition - qubits can be in multiple states at once, 2) Entanglement - qubits can be correlated across distances, 3) Quantum gates - manipulate qubits to perform calculations. This enables solving complex optimization and cryptography problems.`,
      responseTime: endTime - startTime
    };
  }
  
  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens }
    }, { timeout: 30000 });
    const endTime = Date.now();
    const result = response.data.candidates[0].content.parts[0].text;
    return { response: result, responseTime: endTime - startTime };
  } catch (error) {
    const endTime = Date.now();
    throw { ...error, responseTime: endTime - startTime };
  }
}

async function callDeepSeek(prompt, maxTokens = 500) {
  const startTime = Date.now();
  
  console.log(`🔍 DeepSeek - TEST_MODE: ${TEST_MODE}`);
  
  if (TEST_MODE) {
    console.log('🧪 Using DeepSeek simulation');
    // Simulate response time
    await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 1100));
    const endTime = Date.now();
    return {
      response: `[DeepSeek Simulation] Quantum computing represents a paradigm shift in computation. Traditional computers use binary bits, but quantum computers use qubits that leverage: • Superposition (existing in multiple states) • Entanglement (instant correlation) • Interference (amplifying correct answers). This allows exponential speedup for specific algorithms like Shor's (factoring) and Grover's (search).`,
      responseTime: endTime - startTime
    };
  }
  
  try {
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    const endTime = Date.now();
    const result = response.data.choices[0].message.content;
    return { response: result, responseTime: endTime - startTime };
  } catch (error) {
    const endTime = Date.now();
    throw { ...error, responseTime: endTime - startTime };
  }
}

async function callOpenRouter(provider, prompt, maxTokens = 500) {
  const startTime = Date.now();
  const models = {
    openai: 'openai/gpt-4o-mini',
    google: 'google/gemini-pro',
    deepseek: 'deepseek-ai/deepseek-chat',
    anthropic: 'anthropic/claude-3-sonnet'
  };
  
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: models[provider] || models.openai,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    const endTime = Date.now();
    const result = response.data.choices[0].message.content;
    return { response: result, responseTime: endTime - startTime };
  } catch (error) {
    const endTime = Date.now();
    throw { ...error, responseTime: endTime - startTime };
  }
}

// Judge fallback logic - uses OpenAI if primary judge fails
async function callJudge(judgeAgent, judgePrompt, originalResults, dispatchId, maxTokens = 500) {
  console.log(`🏛️  Calling judge: ${judgeAgent}`);
  
  if (TEST_MODE) {
    // Simulate judge response time
    await new Promise(resolve => setTimeout(resolve, 900 + Math.random() * 1200));
    
    const judgeResponse = {
      response: `[${judgeAgent.toUpperCase()} Judge Simulation] Based on the three responses about quantum computing:

**WINNER: DeepSeek** - Most comprehensive and well-structured explanation

**Reasoning:**
- DeepSeek provided the clearest breakdown with bullet points
- Included specific algorithm examples (Shor's, Grover's) 
- Balanced technical depth with accessibility
- OpenAI was solid but less detailed
- Google covered key concepts but lacked concrete examples

**Score:** DeepSeek: 9/10, OpenAI: 7/10, Google: 7/10`,
      responseTime: 900 + Math.random() * 1200
    };

    return {
      agent: judgeAgent,
      verdict: judgeResponse.response,
      responseTime: judgeResponse.responseTime,
      validation: { valid: true, issues: [] },
      fallback_used: false
    };
  }
  
  try {
    let judgeResponse;
    
    if (judgeAgent === 'anthropic') {
      // Anthropic through OpenRouter (known to fail with 404)
      judgeResponse = await callOpenRouter('anthropic', judgePrompt, maxTokens);
    } else if (judgeAgent === 'openai') {
      judgeResponse = await callOpenAI(judgePrompt, maxTokens);
    } else if (judgeAgent === 'google') {
      judgeResponse = await callGoogle(judgePrompt, maxTokens);
    } else if (judgeAgent === 'deepseek') {
      judgeResponse = await callDeepSeek(judgePrompt, maxTokens);
    } else {
      throw new Error(`Unknown judge agent: ${judgeAgent}`);
    }

    // Validate judge response
    const validation = ResponseValidator.validateJudgeResponse(judgeAgent, judgeResponse.response, originalResults);
    
    return {
      agent: judgeAgent,
      verdict: judgeResponse.response,
      responseTime: judgeResponse.responseTime,
      validation,
      fallback_used: false
    };
    
  } catch (error) {
    console.log(`⚠️  Judge ${judgeAgent} failed: ${error.message}`);
    
    // Log judge failure
    auditLogger.logJudgeFailure(dispatchId, judgeAgent, 'openai', error);
    
    // Fallback to OpenAI GPT-4o-mini if original judge wasn't OpenAI
    if (judgeAgent !== 'openai') {
      console.log(`🔄 Falling back to OpenAI GPT-4o-mini for judge verdict`);
      
      try {
        const fallbackResponse = await callOpenAI(judgePrompt, maxTokens);
        const validation = ResponseValidator.validateJudgeResponse('openai', fallbackResponse.response, originalResults);
        
        return {
          agent: 'openai',
          verdict: fallbackResponse.response,
          responseTime: fallbackResponse.responseTime,
          validation,
          fallback_used: true,
          original_judge: judgeAgent,
          fallback_reason: error.message
        };
      } catch (fallbackError) {
        return {
          agent: judgeAgent,
          error: `Judge failed: ${error.message}. Fallback also failed: ${fallbackError.message}`,
          fallback_used: true,
          original_judge: judgeAgent
        };
      }
    } else {
      return {
        agent: judgeAgent,
        error: `Judge failed: ${error.message}`,
        fallback_used: false
      };
    }
  }
}

// Routes
app.get('/health', (req, res) => {
  const summary = auditLogger.getAuditSummary();
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Polybot Genesis backend is running',
    audit_summary: summary
  });
});

app.get('/audit/summary', (req, res) => {
  const summary = auditLogger.getAuditSummary();
  res.json(summary);
});

app.post('/dispatch', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { prompt, agents, judge, responseMode = 'full' } = req.body;
    
    // Get token limit based on response mode
    const maxTokens = TOKEN_LIMITS[responseMode] || TOKEN_LIMITS.full;
    
    // Validate request
    const requestValidation = ResponseValidator.validateDispatchRequest(prompt, agents, responseMode);
    if (!requestValidation.valid) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        validation_errors: requestValidation.errors 
      });
    }

    console.log(`🚀 Dispatch: "${prompt.substring(0, 50)}..." to [${agents.join(', ')}] (${responseMode}: ${maxTokens} tokens)${judge ? ` with judge: ${judge}` : ''}`);

    const results = {};
    const validations = {};
    const errors = {};
    
    // Process each agent with token limits
    for (const agent of agents) {
      try {
        let agentResult;
        
        switch (agent) {
          case 'openai':
            agentResult = (TEST_MODE || process.env.OPENAI_API_KEY) ? 
              await callOpenAI(prompt, maxTokens) : 
              await callOpenRouter('openai', prompt, maxTokens);
            break;
          case 'google':
            agentResult = (TEST_MODE || process.env.GOOGLE_API_KEY) ? 
              await callGoogle(prompt, maxTokens) : 
              await callOpenRouter('google', prompt, maxTokens);
            break;
          case 'deepseek':
            agentResult = (TEST_MODE || process.env.DEEPSEEK_API_KEY) ? 
              await callDeepSeek(prompt, maxTokens) : 
              await callOpenRouter('deepseek', prompt, maxTokens);
            break;
          case 'anthropic':
            agentResult = await callOpenRouter('anthropic', prompt, maxTokens);
            break;
          default:
            throw new Error(`Unknown agent: ${agent}`);
        }
        
        results[agent] = agentResult.response;
        
        // Validate response
        const validation = ResponseValidator.validateAgentResponse(agent, agentResult.response, prompt);
        validations[agent] = validation;
        
        if (!validation.valid) {
          console.log(`⚠️  ${agent} response validation failed: ${validation.errors.join(', ')}`);
        }
        
        console.log(`✅ ${agent}: ${agentResult.response.substring(0, 80)}... (${agentResult.responseTime}ms)`);
        
      } catch (error) {
        const errorMsg = `Error: ${error.message}`;
        results[agent] = errorMsg;
        errors[agent] = {
          message: error.message,
          status: error.response?.status,
          responseTime: error.responseTime || null
        };
        console.log(`❌ ${agent}: ${errorMsg}`);
      }
    }
    
    // Log the dispatch with audit trail (without judge initially)
    const dispatchId = auditLogger.logDispatch(prompt, agents, results, null, errors, responseMode, maxTokens);
    
    const endTime = Date.now();
    const response = { 
      dispatch_id: dispatchId,
      prompt, 
      agents, 
      results,
      validations,
      response_mode: responseMode,
      max_tokens: maxTokens,
      execution_time: endTime - startTime,
      timestamp: new Date().toISOString(),
      judge_ready: judge && Object.keys(results).filter(agent => !results[agent].startsWith('Error:')).length > 1
    };
    
    console.log(`📝 Dispatch ${dispatchId} completed in ${endTime - startTime}ms (${responseMode} mode)`);
    res.json(response);
    
  } catch (error) {
    console.error('❌ Dispatch error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/judge', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { dispatch_id, judge, prompt, results, responseMode = 'full' } = req.body;
    
    if (!judge || !prompt || !results) {
      return res.status(400).json({ 
        error: 'Missing required fields: judge, prompt, results' 
      });
    }

    const maxTokens = TOKEN_LIMITS[responseMode] || TOKEN_LIMITS.full;
    const successfulResults = Object.fromEntries(
      Object.entries(results).filter(([agent, response]) => !response.startsWith('Error:'))
    );

    if (Object.keys(successfulResults).length < 2) {
      return res.status(400).json({ 
        error: 'Need at least 2 successful agent responses for judge evaluation' 
      });
    }

    console.log(`🏛️  Judge evaluation requested for dispatch ${dispatch_id}`);

    const judgePrompt = `Compare these AI responses to the prompt: "${prompt}"

Responses:
${Object.entries(successfulResults).map(([agent, response]) => `${agent.toUpperCase()}: ${response}`).join('\n\n')}

Provide a brief analysis of which response is best and why (focus on accuracy, completeness, and relevance):`;

    const judgeResult = await callJudge(judge, judgePrompt, successfulResults, dispatch_id, maxTokens);
    
    // Update audit log with judge result
    auditLogger.logJudgeEvaluation(dispatch_id, judgeResult);
    
    const endTime = Date.now();
    const response = {
      dispatch_id,
      judge: judgeResult,
      evaluation_time: endTime - startTime,
      timestamp: new Date().toISOString()
    };
    
    console.log(`📝 Judge evaluation for ${dispatch_id} completed in ${endTime - startTime}ms`);
    res.json(response);
    
  } catch (error) {
    console.error('❌ Judge evaluation error:', error);
    res.status(500).json({ 
      error: 'Judge evaluation failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Polybot Genesis backend running on ${HOST}:${PORT}`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Audit summary: http://localhost:${PORT}/audit/summary`);
  
  // Log the successful startup
  console.log(`\n🎯 MILESTONE: Enhanced multi-agent dispatch system with:`);
  console.log(`   ✅ Response validation and audit logging`);
  console.log(`   ✅ Judge fallback logic (Anthropic → OpenAI)`);
  console.log(`   ✅ Snapshot logging for every dispatch`);
  console.log(`   ✅ No retry logic (as requested)`);
  console.log(`   ✅ Comprehensive audit trails\n`);
});
