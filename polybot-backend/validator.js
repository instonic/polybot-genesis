class ResponseValidator {
  static validateDispatchRequest(prompt, agents, responseMode = 'full') {
    const errors = [];
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      errors.push('Prompt is required and must be a non-empty string');
    }
    
    if (!Array.isArray(agents) || agents.length === 0) {
      errors.push('Agents array is required and must contain at least one agent');
    }
    
    const validAgents = ['openai', 'google', 'deepseek', 'anthropic'];
    const invalidAgents = agents.filter(agent => !validAgents.includes(agent));
    if (invalidAgents.length > 0) {
      errors.push(`Invalid agents: ${invalidAgents.join(', ')}. Valid agents: ${validAgents.join(', ')}`);
    }
    
    const validModes = ['brief', 'full', 'deepthink'];
    if (responseMode && !validModes.includes(responseMode)) {
      errors.push(`Invalid response mode: ${responseMode}. Valid modes: ${validModes.join(', ')}`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateAgentResponse(agent, response, originalPrompt) {
    const errors = [];
    const warnings = [];
    
    // Basic response validation
    if (!response || typeof response !== 'string') {
      errors.push('Response must be a non-empty string');
      return { valid: false, errors, warnings, score: 0 };
    }
    
    // Length validation
    if (response.length < 10) {
      errors.push('Response too short (minimum 10 characters)');
    }
    
    if (response.length > 5000) {
      warnings.push('Response very long (over 5000 characters)');
    }
    
    // Quality checks
    const score = this.calculateQualityScore(response, originalPrompt);
    
    // Agent-specific validations
    if (agent === 'openai' && response.includes('I cannot assist')) {
      warnings.push('OpenAI response indicates refusal or limitation');
    }
    
    if (agent === 'google' && response.includes('I cannot provide')) {
      warnings.push('Google response indicates refusal or limitation');
    }
    
    // Check for error indicators
    const errorIndicators = ['error', 'failed', 'unable to', 'cannot process'];
    const hasErrorIndicators = errorIndicators.some(indicator => 
      response.toLowerCase().includes(indicator)
    );
    
    if (hasErrorIndicators) {
      warnings.push('Response contains error indicators');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score,
      metadata: {
        length: response.length,
        word_count: response.split(' ').length,
        agent
      }
    };
  }

  static validateJudgeResponse(judge, verdict, originalResults) {
    const errors = [];
    const warnings = [];
    
    if (!verdict || typeof verdict !== 'string') {
      errors.push('Judge verdict must be a non-empty string');
      return { valid: false, errors, warnings, score: 0 };
    }
    
    // Check if judge mentions the agents that responded
    const successfulAgents = Object.keys(originalResults).filter(
      agent => !originalResults[agent].startsWith('Error:')
    );
    
    const mentionedAgents = successfulAgents.filter(agent => 
      verdict.toLowerCase().includes(agent.toLowerCase())
    );
    
    if (mentionedAgents.length === 0) {
      warnings.push('Judge verdict does not mention any of the responding agents');
    }
    
    // Check for comparative language
    const comparativeWords = ['best', 'better', 'worse', 'superior', 'prefer', 'recommend'];
    const hasComparative = comparativeWords.some(word => 
      verdict.toLowerCase().includes(word)
    );
    
    if (!hasComparative) {
      warnings.push('Judge verdict lacks comparative analysis');
    }
    
    // Check verdict length
    if (verdict.length < 50) {
      warnings.push('Judge verdict is quite brief');
    }
    
    const score = this.calculateJudgeScore(verdict, successfulAgents);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score,
      metadata: {
        length: verdict.length,
        mentioned_agents: mentionedAgents,
        has_comparative_language: hasComparative,
        judge
      }
    };
  }

  static calculateQualityScore(response, prompt) {
    let score = 50; // Base score
    
    // Length scoring
    if (response.length > 100) score += 10;
    if (response.length > 300) score += 10;
    
    // Structure scoring
    if (response.includes('\n')) score += 5; // Has paragraphs
    if (response.match(/\d+/)) score += 5; // Contains numbers
    if (response.match(/[.!?].*[.!?]/)) score += 5; // Multiple sentences
    
    // Relevance scoring (simple keyword matching)
    const promptWords = prompt.toLowerCase().split(' ').filter(word => word.length > 3);
    const responseWords = response.toLowerCase().split(' ');
    const matchedWords = promptWords.filter(word => responseWords.includes(word));
    score += Math.min(20, matchedWords.length * 2);
    
    return Math.min(100, Math.max(0, score));
  }

  static calculateJudgeScore(verdict, agents) {
    let score = 50; // Base score
    
    // Agent mention scoring
    score += agents.length * 10; // Base points for each agent in context
    
    // Comparative analysis scoring
    const comparativeWords = ['best', 'better', 'superior', 'prefer', 'recommend', 'compare'];
    const comparativeCount = comparativeWords.filter(word => 
      verdict.toLowerCase().includes(word)
    ).length;
    score += comparativeCount * 5;
    
    // Reasoning scoring
    const reasoningWords = ['because', 'since', 'due to', 'reason', 'accurate', 'complete'];
    const reasoningCount = reasoningWords.filter(word => 
      verdict.toLowerCase().includes(word)
    ).length;
    score += reasoningCount * 3;
    
    return Math.min(100, Math.max(0, score));
  }
}

module.exports = ResponseValidator;
