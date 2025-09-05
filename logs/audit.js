const fs = require('fs');
const path = require('path');

class AuditLogger {
  constructor(logDir = './logs') {
    this.logDir = logDir;
    this.auditFile = path.join(logDir, 'audit.jsonl');
    this.metricsFile = path.join(logDir, 'metrics.json');
    
    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  generateId() {
    return `dispatch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  logDispatch(prompt, agents, results, judgeResult = null, errors = {}, responseMode = 'full', maxTokens = 500) {
    const dispatchId = this.generateId();
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      dispatch_id: dispatchId,
      timestamp,
      prompt: prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''),
      agents_requested: agents,
      agents_successful: Object.keys(results).filter(agent => !results[agent].startsWith('Error:')),
      agents_failed: Object.keys(results).filter(agent => results[agent].startsWith('Error:')),
      response_mode: responseMode,
      max_tokens: maxTokens,
      token_estimate: this.calculateTokenEstimate(results, maxTokens),
      judge_agent: judgeResult?.agent || null,
      judge_fallback_used: judgeResult?.fallback_used || false,
      execution_summary: {
        total_agents: agents.length,
        successful_agents: Object.keys(results).filter(agent => !results[agent].startsWith('Error:')).length,
        failed_agents: Object.keys(results).filter(agent => results[agent].startsWith('Error:')).length,
        judge_status: judgeResult ? (judgeResult.error ? 'failed' : 'success') : 'not_used'
      },
      errors: Object.keys(errors).length > 0 ? errors : null,
      snapshot_saved: true
    };

    // Write to audit log
    fs.appendFileSync(this.auditFile, JSON.stringify(logEntry) + '\n');
    
    // Create snapshot
    this.createSnapshot(dispatchId, { prompt, agents, results, judgeResult, errors, responseMode, maxTokens });
    
    // Update metrics
    this.updateMetrics(logEntry);
    
    console.log(`📝 Audit logged: ${dispatchId} (${responseMode} mode, ${maxTokens} tokens)`);
    return dispatchId;
  }

  logJudgeEvaluation(dispatchId, judgeResult) {
    const timestamp = new Date().toISOString();
    
    const judgeEntry = {
      type: 'judge_evaluation',
      dispatch_id: dispatchId,
      timestamp,
      judge_agent: judgeResult?.agent,
      judge_fallback_used: judgeResult?.fallback_used || false,
      judge_status: judgeResult?.error ? 'failed' : 'success',
      fallback_reason: judgeResult?.fallback_reason || null
    };

    fs.appendFileSync(this.auditFile, JSON.stringify(judgeEntry) + '\n');
    console.log(`⚖️  Judge evaluation logged for ${dispatchId}`);
  }

  calculateTokenEstimate(results, maxTokens) {
    const successfulResponses = Object.values(results).filter(response => !response.startsWith('Error:'));
    const totalChars = successfulResponses.reduce((sum, response) => sum + response.length, 0);
    // Rough estimate: 4 chars per token
    return Math.min(Math.ceil(totalChars / 4), maxTokens * successfulResponses.length);
  }

  logJudgeFailure(dispatchId, originalJudge, fallbackJudge, error) {
    const timestamp = new Date().toISOString();
    
    const failureEntry = {
      type: 'judge_failure',
      dispatch_id: dispatchId,
      timestamp,
      original_judge: originalJudge,
      fallback_judge: fallbackJudge,
      error_message: error.message,
      error_status: error.response?.status || null
    };

    fs.appendFileSync(this.auditFile, JSON.stringify(failureEntry) + '\n');
    console.log(`⚠️  Judge failure logged: ${originalJudge} → ${fallbackJudge}`);
  }

  createSnapshot(dispatchId, data) {
    const snapshotPath = path.join('./snapshots', `${dispatchId}.json`);
    
    if (!fs.existsSync('./snapshots')) {
      fs.mkdirSync('./snapshots', { recursive: true });
    }
    
    const snapshot = {
      dispatch_id: dispatchId,
      timestamp: new Date().toISOString(),
      full_data: data,
      metadata: {
        prompt_length: data.prompt.length,
        response_lengths: Object.entries(data.results).reduce((acc, [agent, response]) => {
          acc[agent] = response.length;
          return acc;
        }, {}),
        snapshot_size: JSON.stringify(data).length
      }
    };
    
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
    console.log(`📸 Snapshot created: ${snapshotPath}`);
  }

  updateMetrics(logEntry) {
    let metrics = { total_dispatches: 0, total_agents_called: 0, total_judge_calls: 0, judge_fallbacks: 0 };
    
    if (fs.existsSync(this.metricsFile)) {
      metrics = JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
    }
    
    metrics.total_dispatches++;
    metrics.total_agents_called += logEntry.execution_summary.total_agents;
    
    if (logEntry.judge_agent) {
      metrics.total_judge_calls++;
      if (logEntry.judge_fallback_used) {
        metrics.judge_fallbacks++;
      }
    }
    
    metrics.last_updated = new Date().toISOString();
    
    fs.writeFileSync(this.metricsFile, JSON.stringify(metrics, null, 2));
  }

  getAuditSummary() {
    const summary = {
      audit_file_exists: fs.existsSync(this.auditFile),
      total_log_entries: 0,
      latest_entries: []
    };
    
    if (fs.existsSync(this.auditFile)) {
      const logData = fs.readFileSync(this.auditFile, 'utf8');
      const lines = logData.trim().split('\n').filter(line => line);
      summary.total_log_entries = lines.length;
      
      // Get last 3 entries
      const recentLines = lines.slice(-3);
      summary.latest_entries = recentLines.map(line => {
        try {
          const entry = JSON.parse(line);
          return {
            dispatch_id: entry.dispatch_id,
            timestamp: entry.timestamp,
            type: entry.type || 'dispatch',
            summary: entry.execution_summary || 'judge_failure'
          };
        } catch (e) {
          return { error: 'Invalid log entry' };
        }
      });
    }
    
    // Include metrics if available
    if (fs.existsSync(this.metricsFile)) {
      summary.metrics = JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
    }
    
    return summary;
  }
}

module.exports = AuditLogger;
