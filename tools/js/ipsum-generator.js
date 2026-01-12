/**
 * Ipsum Generator
 * Reusable lorem ipsum generator that loads content from JSON files
 */

class IpsumGenerator {
    constructor(dataUrl, outputElementId, config = {}) {
        this.dataUrl = dataUrl;
        this.outputElementId = outputElementId;
        this.data = null;
        this.config = {
            minSentences: config.minSentences || 3,
            maxSentences: config.maxSentences || 5,
            ...config
        };
    }

    async init() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.statusText}`);
            }
            this.data = await response.json();
            this.updateUI();
            return true;
        } catch (error) {
            console.error('Error loading ipsum data:', error);
            this.showError('Failed to load content. Please refresh the page.');
            return false;
        }
    }

    updateUI() {
        // Update subtitle if element exists
        const subtitleEl = document.querySelector('.tool-subtitle');
        if (subtitleEl && this.data.subtitle) {
            subtitleEl.textContent = this.data.subtitle;
        }

        // Update start checkbox label if element exists
        const startCheckboxLabel = document.querySelector('label[for="startCheckbox"]');
        if (startCheckboxLabel && this.data.startCheckboxLabel) {
            const checkbox = document.getElementById('startCheckbox');
            if (checkbox) {
                startCheckboxLabel.innerHTML = `<input type="checkbox" id="startCheckbox" style="width: auto; margin-right: 8px;">${this.data.startCheckboxLabel}`;
            }
        }

        // Populate theme dropdown
        const themeSelect = document.getElementById('theme');
        if (themeSelect && this.data.themes) {
            themeSelect.innerHTML = '';
            Object.keys(this.data.themes).forEach(key => {
                const theme = this.data.themes[key];
                const option = document.createElement('option');
                option.value = key;
                option.textContent = theme.label;
                themeSelect.appendChild(option);
            });
        }
    }

    getRandomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    generate(numParagraphs, theme, includeStartPhrase = false) {
        if (!this.data) {
            console.error('Data not loaded yet');
            return 'Please wait, loading content...';
        }

        // Get text source based on theme
        let textSource = [];

        if (theme === 'mixed') {
            // Combine all non-mixed themes
            Object.keys(this.data.themes).forEach(key => {
                if (key !== 'mixed' && this.data.themes[key].texts.length > 0) {
                    textSource.push(...this.data.themes[key].texts);
                }
            });
        } else if (this.data.themes[theme]) {
            textSource = this.data.themes[theme].texts;
        } else {
            console.error('Invalid theme:', theme);
            return 'Invalid theme selected';
        }

        if (textSource.length === 0) {
            return 'No content available for this theme';
        }

        let result = [];

        // Add opening phrase if requested
        if (includeStartPhrase && this.data.startPhrase) {
            result.push(this.data.startPhrase + '\n');
        }

        // Generate paragraphs
        for (let i = 0; i < numParagraphs; i++) {
            let paragraph = [];
            const sentencesPerParagraph = Math.floor(Math.random() * (this.config.maxSentences - this.config.minSentences + 1)) + this.config.minSentences;

            for (let j = 0; j < sentencesPerParagraph; j++) {
                paragraph.push(this.getRandomFromArray(textSource));
            }

            result.push(paragraph.join(' '));
        }

        return result.join('\n\n');
    }

    render(text) {
        const outputEl = document.getElementById(this.outputElementId);
        if (outputEl) {
            outputEl.value = text;
        }
    }

    showError(message) {
        const outputEl = document.getElementById(this.outputElementId);
        if (outputEl) {
            outputEl.value = message;
        }
    }
}

// Export for use in HTML files
if (typeof window !== 'undefined') {
    window.IpsumGenerator = IpsumGenerator;
}
