/**
 * LeftPanel Component - Control Panel for AI Agent Dispatch
 * Handles model selection, configuration, and prompt input
 */
class LeftPanel {
    constructor(state) {
        this.state = state;
        this.element = null;
        this.init();
    }

    init() {
        this.createElement();
        this.setupEventListeners();
        this.updateFromState();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'control-panel';
        this.element.innerHTML = this.getTemplate();
    }

    getTemplate() {
        return `
            <div class="control-header">
                <div class="control-title">AI Agent Dispatch</div>
                <div class="control-subtitle">Select models and configure your multi-agent query</div>
            </div>

            <div class="control-content">
                <!-- Model Selection -->
                <div class="config-section">
                    <div class="section-header">
                        <span class="section-icon">🤖</span>
                        <span class="section-title">Select AI Agents</span>
                    </div>
                    <div class="models-grid">
                        <div class="model-checkbox" data-agent="openai" aria-label="Select OpenAI GPT-4">
                            <input type="checkbox" id="openai-check" aria-hidden="true">
                            <div class="model-info">
                                <span class="model-name">OpenAI</span>
                                <span class="model-desc">GPT-4 Turbo</span>
                            </div>
                        </div>
                        <div class="model-checkbox" data-agent="anthropic" aria-label="Select Anthropic Claude">
                            <input type="checkbox" id="anthropic-check" aria-hidden="true">
                            <div class="model-info">
                                <span class="model-name">Anthropic</span>
                                <span class="model-desc">Claude 3.5 Sonnet</span>
                            </div>
                        </div>
                        <div class="model-checkbox" data-agent="google" aria-label="Select Google Gemini">
                            <input type="checkbox" id="google-check" aria-hidden="true">
                            <div class="model-info">
                                <span class="model-name">Google</span>
                                <span class="model-desc">Gemini 1.5 Pro</span>
                            </div>
                        </div>
                        <div class="model-checkbox" data-agent="deepseek" aria-label="Select DeepSeek">
                            <input type="checkbox" id="deepseek-check" aria-hidden="true">
                            <div class="model-info">
                                <span class="model-name">DeepSeek</span>
                                <span class="model-desc">Coder V2</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Judge Model -->
                <div class="config-section">
                    <div class="section-header">
                        <span class="section-icon">⚖️</span>
                        <span class="section-title">Judge Model</span>
                    </div>
                    <select id="judgeModel" class="judge-select" aria-label="Select judge model">
                        <option value="anthropic">Anthropic Claude (Recommended)</option>
                        <option value="openai">OpenAI GPT-4</option>
                        <option value="google">Google Gemini</option>
                        <option value="none">No Judge</option>
                    </select>
                </div>

                <!-- Response Mode -->
                <div class="config-section">
                    <div class="section-header">
                        <span class="section-icon">💬</span>
                        <span class="section-title">Response Mode</span>
                    </div>
                    <select id="responseMode" class="mode-select" aria-label="Select response mode">
                        <option value="brief">Brief (Fast responses)</option>
                        <option value="full" selected>Full (Balanced)</option>
                        <option value="deepthink">Deep Think (Comprehensive)</option>
                    </select>
                </div>

                <!-- Prompt Input -->
                <div class="config-section">
                    <div class="section-header">
                        <span class="section-icon">✍️</span>
                        <span class="section-title">Your Prompt</span>
                    </div>
                    <textarea 
                        id="prompt" 
                        class="prompt-textarea" 
                        placeholder="Enter your prompt here... Ask anything and watch multiple AI agents provide their unique perspectives!"
                        rows="6"
                        aria-label="Enter your prompt"
                    ></textarea>
                </div>

                <!-- Advanced Settings -->
                <div class="config-section">
                    <div class="section-header">
                        <span class="section-icon">⚙️</span>
                        <span class="section-title">Advanced Settings</span>
                    </div>
                    <div class="settings-grid">
                        <div class="setting-item">
                            <label for="temperature" class="form-label">Temperature</label>
                            <div class="range-control">
                                <input 
                                    type="range" 
                                    id="temperature" 
                                    class="range-input" 
                                    min="0" 
                                    max="1" 
                                    step="0.1" 
                                    value="0.7"
                                    aria-label="Temperature setting"
                                >
                                <div class="range-value">0.7</div>
                            </div>
                        </div>
                        <div class="setting-item">
                            <label for="maxTokens" class="form-label">Max Tokens</label>
                            <div class="range-control">
                                <input 
                                    type="range" 
                                    id="maxTokens" 
                                    class="range-input" 
                                    min="100" 
                                    max="2000" 
                                    step="50" 
                                    value="800"
                                    aria-label="Maximum tokens"
                                >
                                <div class="range-value">800</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Send Button -->
                <button id="sendButton" class="send-button" aria-label="Send prompt to selected AI models">
                    <span>🚀</span>
                    <span>Dispatch to AI Agents</span>
                </button>
            </div>
        `;
    }

    setupEventListeners() {
        // Model selection
        this.element.querySelectorAll('.model-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => this.handleModelSelection(e));
        });

        // Judge model selection
        this.element.querySelector('#judgeModel').addEventListener('change', (e) => {
            this.state.setSelectedJudge(e.target.value);
        });

        // Response mode change
        this.element.querySelector('#responseMode').addEventListener('change', (e) => {
            this.state.setResponseMode(e.target.value);
            this.updateTokensFromMode();
        });

        // Range inputs
        this.element.querySelectorAll('.range-input').forEach(range => {
            range.addEventListener('input', () => this.updateRangeValues());
        });

        // Prompt textarea
        this.element.querySelector('#prompt').addEventListener('input', (e) => {
            this.state.setPrompt(e.target.value);
        });

        // Send button
        this.element.querySelector('#sendButton').addEventListener('click', () => {
            this.state.dispatch();
        });
    }

    handleModelSelection(event) {
        event.preventDefault();
        const checkbox = event.currentTarget;
        const agent = checkbox.dataset.agent;
        
        if (this.state.selectedAgents.includes(agent)) {
            this.state.removeAgent(agent);
        } else {
            this.state.addAgent(agent);
        }
    }

    updateRangeValues() {
        this.element.querySelectorAll('.range-input').forEach(range => {
            const value = range.value;
            const valueDisplay = range.parentElement.querySelector('.range-value');
            if (valueDisplay) {
                valueDisplay.textContent = value;
            }
        });
    }

    updateTokensFromMode() {
        const mode = this.element.querySelector('#responseMode').value;
        const tokensRange = this.element.querySelector('#maxTokens');
        const tokenModes = {
            brief: 300,
            full: 800,
            deepthink: 1500
        };
        
        if (tokenModes[mode]) {
            tokensRange.value = tokenModes[mode];
            this.updateRangeValues();
        }
    }

    updateFromState() {
        // Update model selections
        this.element.querySelectorAll('.model-checkbox').forEach(checkbox => {
            const agent = checkbox.dataset.agent;
            const isSelected = this.state.selectedAgents.includes(agent);
            checkbox.classList.toggle('selected', isSelected);
            checkbox.querySelector('input').checked = isSelected;
        });

        // Update send button state
        this.updateSendButton();

        // Update prompt
        const promptTextarea = this.element.querySelector('#prompt');
        if (promptTextarea.value !== this.state.prompt) {
            promptTextarea.value = this.state.prompt;
        }
    }

    updateSendButton() {
        const sendButton = this.element.querySelector('#sendButton');
        const hasAgents = this.state.selectedAgents.length > 0;
        const hasPrompt = this.state.prompt.trim().length > 0;
        
        sendButton.disabled = !hasAgents || !hasPrompt || this.state.isDispatching;
        
        if (this.state.isDispatching) {
            sendButton.innerHTML = '<div class="loading-spinner"></div><span>Dispatching...</span>';
        } else {
            sendButton.innerHTML = '<span>🚀</span><span>Dispatch to AI Agents</span>';
        }
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
    module.exports = LeftPanel;
} else {
    window.LeftPanel = LeftPanel;
}
