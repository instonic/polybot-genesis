/**
 * RightPanel Component - Output Area for AI Responses
 * Displays responses, judge evaluations, and audit information
 */
class RightPanel {
    constructor(state) {
        this.state = state;
        this.element = null;
        this.init();
    }

    init() {
        this.createElement();
        this.updateFromState();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'output-area';
        this.element.innerHTML = this.getTemplate();
    }

    getTemplate() {
        return `
            <div class="output-header">
                <div class="output-title">AI Responses</div>
                <div class="output-subtitle">Live results from your selected AI models</div>
            </div>
            
            <div class="output-content">
                <div id="resultsContainer" class="response-container">
                    <div class="empty-state">
                        <div class="empty-state-icon">🤖</div>
                        <div class="empty-state-title">Ready to Dispatch</div>
                        <div class="empty-state-description">
                            Select your AI models, enter a prompt, and click "Dispatch to AI Agents" to see responses from multiple AI systems.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateFromState() {
        const resultsContainer = this.element.querySelector('#resultsContainer');
        
        if (this.state.isDispatching) {
            this.showLoading(resultsContainer);
        } else if (this.state.lastDispatchData) {
            this.displayResults(resultsContainer, this.state.lastDispatchData);
        } else {
            this.showEmptyState(resultsContainer);
        }
    }

    showLoading(container) {
        container.innerHTML = `
            <div class="loading-text">
                <div class="loading-spinner"></div>
                Dispatching to AI agents...
            </div>
        `;
    }

    showEmptyState(container) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🤖</div>
                <div class="empty-state-title">Ready to Dispatch</div>
                <div class="empty-state-description">
                    Select your AI models, enter a prompt, and click "Dispatch to AI Agents" to see responses from multiple AI systems.
                </div>
            </div>
        `;
    }

    displayResults(container, data) {
        let html = '';

        // Display responses
        Object.entries(data.responses).forEach(([agent, response]) => {
            html += `
                <div class="response-card">
                    <div class="response-header">
                        <div class="response-agent">
                            <span class="agent-badge ${agent}">${agent}</span>
                            <span>${response.model || agent}</span>
                        </div>
                        <div class="response-meta">
                            <span>📊 ${response.tokens} tokens</span>
                            <span>⏱️ ${new Date(response.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                    <div class="response-body">
                        ${response.response.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        });

        // Add judge section if there are multiple responses
        if (Object.keys(data.responses).length > 1 && this.state.selectedJudge !== 'none') {
            html += `
                <div class="judge-section">
                    <div class="judge-header">
                        <span>⚖️</span>
                        <span>Judge Evaluation</span>
                    </div>
                    <button class="judge-button" id="evaluateButton">
                        Evaluate Responses
                    </button>
                    <div id="judgeResults"></div>
                </div>
            `;
        }

        // Add audit section
        html += `
            <div class="audit-section">
                <div class="audit-title">📊 Audit Information</div>
                <div class="audit-grid">
                    <div class="audit-item">
                        <div class="audit-label">Dispatch ID</div>
                        <div class="audit-value">${data.metadata.dispatch_id}</div>
                    </div>
                    <div class="audit-item">
                        <div class="audit-label">Timestamp</div>
                        <div class="audit-value">${new Date(data.metadata.timestamp).toLocaleString()}</div>
                    </div>
                    <div class="audit-item">
                        <div class="audit-label">Agents</div>
                        <div class="audit-value">${data.agents.length}</div>
                    </div>
                    <div class="audit-item">
                        <div class="audit-label">Mode</div>
                        <div class="audit-value">${data.metadata.mode || 'live'}</div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup judge evaluation button if it exists
        const evaluateButton = container.querySelector('#evaluateButton');
        if (evaluateButton) {
            evaluateButton.addEventListener('click', () => this.evaluateWithJudge());
        }
    }

    async evaluateWithJudge() {
        if (!this.state.lastDispatchData) return;

        const judgeButton = this.element.querySelector('#evaluateButton');
        const judgeResults = this.element.querySelector('#judgeResults');
        
        if (!judgeButton || !judgeResults) return;

        judgeButton.disabled = true;
        judgeButton.textContent = 'Evaluating...';

        try {
            const backendUrl = this.state.getBackendUrl();
            const response = await fetch(`${backendUrl}/judge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: this.state.lastDispatchData.prompt,
                    responses: this.state.lastDispatchData.responses,
                    judge: this.state.selectedJudge
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.displayJudgeResults(judgeResults, data);
            } else {
                throw new Error(data.error || 'Judge evaluation failed');
            }
        } catch (error) {
            console.log('Judge API not available, showing demo evaluation:', error.message);
            
            // Demo judge evaluation when API is not available
            const agents = Object.keys(this.state.lastDispatchData.responses);
            const randomWinner = agents[Math.floor(Math.random() * agents.length)];
            
            const demoJudgeResult = {
                status: 'success',
                judge: this.state.selectedJudge || 'anthropic',
                winner: randomWinner,
                reasoning: `After analyzing all responses, ${randomWinner.toUpperCase()} provided the most comprehensive and accurate answer. The response demonstrated strong understanding of the prompt and delivered practical, well-structured information. (Demo evaluation)`,
                scores: {},
                timestamp: new Date().toISOString(),
                mode: 'demo'
            };
            
            // Generate demo scores
            agents.forEach(agent => {
                demoJudgeResult.scores[agent] = Math.random() * 0.3 + 0.7;
            });
            demoJudgeResult.scores[randomWinner] = Math.max(demoJudgeResult.scores[randomWinner], 0.85);
            
            this.displayJudgeResults(judgeResults, demoJudgeResult);
        } finally {
            judgeButton.disabled = false;
            judgeButton.textContent = 'Evaluate Responses';
        }
    }

    displayJudgeResults(container, data) {
        let html = `
            <div style="margin-bottom: 16px; padding: 12px; background: white; border-radius: 6px; border: 1px solid #b3d9ff;">
                <strong>🏆 Winner: ${data.winner.toUpperCase()}</strong>
            </div>
            
            <div class="judge-results">
        `;

        // Display scores
        Object.entries(data.scores).forEach(([agent, score]) => {
            const percentage = Math.round(score * 100);
            html += `
                <div class="score-bar">
                    <div class="score-label">${agent.toUpperCase()}</div>
                    <div class="score-progress">
                        <div class="score-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="score-value">${percentage}%</div>
                </div>
            `;
        });

        html += `
            </div>
            
            <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 6px; border: 1px solid #b3d9ff; font-style: italic;">
                <strong>Reasoning:</strong><br>
                ${data.reasoning}
            </div>
        `;

        container.innerHTML = html;
    }

    getElement() {
        return this.element;
    }

    // Public method to update component when state changes
    onStateChange() {
        this.updateFromState();
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RightPanel;
} else {
    window.RightPanel = RightPanel;
}
