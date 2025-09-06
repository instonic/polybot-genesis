/**
 * PolybotApp - Main Application Controller
 * Orchestrates the component-based architecture with centralized state management
 */
class PolybotApp {
    constructor() {
        this.state = new AppState();
        this.leftPanel = null;
        this.rightPanel = null;
        this.container = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.createMainContainer();
        this.initializeComponents();
        this.setupGlobalEventListeners();
        console.log('Polybot Genesis initialized with component-based architecture');
    }

    createMainContainer() {
        // Find or create the main container
        this.container = document.querySelector('.main-container') || document.querySelector('body');
        
        // If we need to create the structure
        if (!document.querySelector('.main-container')) {
            const existingContent = this.container.innerHTML;
            this.container.innerHTML = `
                <div class="header">
                    <div class="header-content">
                        <div class="logo">
                            <span class="logo-icon">🤖</span>
                            <span class="logo-text">Polybot Genesis</span>
                        </div>
                        <div class="header-subtitle">Multi-Agent AI Dispatch System</div>
                    </div>
                </div>
                <div class="main-container">
                    <!-- Components will be inserted here -->
                </div>
            `;
            this.container = document.querySelector('.main-container');
        }
    }

    initializeComponents() {
        // Create components
        this.leftPanel = new LeftPanel(this.state);
        this.rightPanel = new RightPanel(this.state);

        // Subscribe components to state changes
        this.state.subscribe(this.leftPanel);
        this.state.subscribe(this.rightPanel);

        // Add components to DOM
        this.container.appendChild(this.leftPanel.getElement());
        this.container.appendChild(this.rightPanel.getElement());

        // Initial state sync
        this.syncInitialState();
    }

    syncInitialState() {
        // Sync any initial state from DOM elements that might exist
        const judgeModel = document.getElementById('judgeModel');
        if (judgeModel && judgeModel.value) {
            this.state.setSelectedJudge(judgeModel.value);
        }

        const responseMode = document.getElementById('responseMode');
        if (responseMode && responseMode.value) {
            this.state.setResponseMode(responseMode.value);
        }

        const prompt = document.getElementById('prompt');
        if (prompt && prompt.value) {
            this.state.setPrompt(prompt.value);
        }
    }

    setupGlobalEventListeners() {
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to dispatch
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.state.dispatch();
            }
            
            // Escape to clear prompt
            if (e.key === 'Escape') {
                const prompt = document.getElementById('prompt');
                if (prompt && document.activeElement === prompt) {
                    prompt.blur();
                }
            }
        });

        // Handle window resize for responsive behavior
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden - could pause any ongoing operations
                console.log('Page hidden');
            } else {
                // Page is visible - could resume operations
                console.log('Page visible');
            }
        });
    }

    handleResize() {
        // Handle responsive behavior if needed
        const container = document.querySelector('.main-container');
        if (container) {
            const width = window.innerWidth;
            
            // Update CSS custom properties for dynamic sizing
            document.documentElement.style.setProperty(
                '--viewport-width', 
                `${width}px`
            );
            
            // Log viewport changes for debugging
            console.log(`Viewport resized to ${width}px`);
        }
    }

    // Public API methods
    getState() {
        return this.state.getState();
    }

    dispatch() {
        return this.state.dispatch();
    }

    reset() {
        this.state.reset();
    }

    // Utility method to get backend URL
    getBackendUrl() {
        return this.state.getBackendUrl();
    }

    // Method to update configuration programmatically
    updateConfig(config) {
        if (config.selectedAgents) {
            this.state.setSelectedAgents(config.selectedAgents);
        }
        if (config.selectedJudge) {
            this.state.setSelectedJudge(config.selectedJudge);
        }
        if (config.responseMode) {
            this.state.setResponseMode(config.responseMode);
        }
        if (config.prompt) {
            this.state.setPrompt(config.prompt);
        }
    }

    // Cleanup method
    destroy() {
        // Unsubscribe components
        this.state.unsubscribe(this.leftPanel);
        this.state.unsubscribe(this.rightPanel);
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('resize', this.handleResize);
        
        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        console.log('Polybot Genesis destroyed');
    }
}

// Auto-initialize when script loads
let polybotApp;

// Initialize app
function initializePolybot() {
    if (!polybotApp) {
        polybotApp = new PolybotApp();
        
        // Make app globally accessible for debugging
        window.polybotApp = polybotApp;
        
        // Expose useful methods globally for backward compatibility
        window.getBackendUrl = () => polybotApp.getBackendUrl();
    }
    return polybotApp;
}

// Auto-initialize
initializePolybot();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PolybotApp, initializePolybot };
} else {
    window.PolybotApp = PolybotApp;
    window.initializePolybot = initializePolybot;
}
