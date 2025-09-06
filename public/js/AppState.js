/**
 * AppState - Centralized State Management for Polybot Genesis
 * Manages all application state and provides reactive updates to components
 */
class AppState {
    constructor() {
        // Core state
        this.selectedAgents = [];
        this.selectedJudge = 'anthropic';
        this.responseMode = 'full';
        this.prompt = '';
        this.lastDispatchData = null;
        this.isDispatching = false;
        
        // Component observers
        this.observers = [];
    }

    // Observer pattern for reactive updates
    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify() {
        this.observers.forEach(observer => {
            if (observer.onStateChange) {
                observer.onStateChange();
            }
        });
    }

    // Agent management
    addAgent(agent) {
        if (!this.selectedAgents.includes(agent)) {
            this.selectedAgents.push(agent);
            this.notify();
        }
    }

    removeAgent(agent) {
        this.selectedAgents = this.selectedAgents.filter(a => a !== agent);
        this.notify();
    }

    setSelectedAgents(agents) {
        this.selectedAgents = [...agents];
        this.notify();
    }

    // Judge model
    setSelectedJudge(judge) {
        this.selectedJudge = judge;
        this.notify();
    }

    // Response mode
    setResponseMode(mode) {
        this.responseMode = mode;
        this.notify();
    }

    // Prompt
    setPrompt(prompt) {
        this.prompt = prompt;
        this.notify();
    }

    // Dispatch state
    setDispatching(isDispatching) {
        this.isDispatching = isDispatching;
        this.notify();
    }

    setLastDispatchData(data) {
        this.lastDispatchData = data;
        this.notify();
    }

    // Get API base URL with support for Vercel API, custom domain, Codespaces, and localhost
    getBackendUrl() {
        // Check for custom domain environment variable (future use)
        const customDomain = window.REACT_APP_API_DOMAIN || '';
        
        // Generate Codespaces URL by replacing port in current origin
        const codespacesUrl = window.location.origin
            .replace(/-\d+\.app\.github\.dev/, '-3000.app.github.dev');
        
        // Check if we're on the custom domain or Vercel domain
        if (window.location.hostname === 'polybot.online' || window.location.hostname.includes('vercel.app')) {
            return window.location.origin + '/api';
        }
        
        // Priority: custom domain env var > Codespaces > localhost
        if (customDomain) return customDomain;
        if (window.location.hostname.includes('github.dev')) return codespacesUrl;
        return 'http://localhost:3000';
    }

    // Main dispatch method
    async dispatch() {
        if (this.isDispatching) return;
        
        const prompt = this.prompt.trim();
        if (!prompt || this.selectedAgents.length === 0) return;

        this.setDispatching(true);

        try {
            const backendUrl = this.getBackendUrl();
            
            // Get configuration values from DOM (these could be moved to state later)
            const temperature = document.getElementById('temperature')?.value || 0.7;
            const maxTokens = document.getElementById('maxTokens')?.value || 800;

            const response = await fetch(`${backendUrl}/dispatch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    agents: this.selectedAgents,
                    judge: this.selectedJudge,
                    responseMode: this.responseMode,
                    temperature: parseFloat(temperature),
                    maxTokens: parseInt(maxTokens)
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.setLastDispatchData(data);
            } else {
                throw new Error(data.error || 'Request failed');
            }
        } catch (error) {
            console.log('API not available, showing demo response:', error.message);
            
            // Fallback demo response when API is not available
            const demoResponse = {
                status: 'success',
                prompt: prompt,
                agents: this.selectedAgents,
                responseMode: this.responseMode,
                responses: {},
                metadata: {
                    dispatch_id: `demo_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    mode: 'demo'
                }
            };
            
            // Generate demo responses for selected agents
            this.selectedAgents.forEach(agent => {
                demoResponse.responses[agent] = {
                    response: `This is a demo response from ${agent.toUpperCase()} for the prompt: "${prompt}"\n\nThe actual implementation would connect to the ${agent} API to generate intelligent responses. Currently showing demo mode since the backend API is being configured.\n\nThis response demonstrates the multi-agent dispatch system's capability to coordinate multiple AI models and present their responses in a unified interface.`,
                    tokens: Math.floor(Math.random() * 50) + 100,
                    timestamp: new Date().toISOString(),
                    model: agent === 'openai' ? 'gpt-4' : agent === 'google' ? 'gemini-pro' : 'deepseek-coder'
                };
            });
            
            this.setLastDispatchData(demoResponse);
        } finally {
            this.setDispatching(false);
        }
    }

    // Utility methods for getting current state
    getState() {
        return {
            selectedAgents: [...this.selectedAgents],
            selectedJudge: this.selectedJudge,
            responseMode: this.responseMode,
            prompt: this.prompt,
            lastDispatchData: this.lastDispatchData,
            isDispatching: this.isDispatching
        };
    }

    // Reset state
    reset() {
        this.selectedAgents = [];
        this.selectedJudge = 'anthropic';
        this.responseMode = 'full';
        this.prompt = '';
        this.lastDispatchData = null;
        this.isDispatching = false;
        this.notify();
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppState;
} else {
    window.AppState = AppState;
}
