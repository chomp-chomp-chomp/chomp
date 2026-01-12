/**
 * Archaic Epic Ipsum Generator
 * Schema-driven lorem ipsum generator using Homeric and Hesiodic fragments
 */

class EpicIpsumGenerator {
    constructor() {
        this.seed = null;
        this.schema = null;
        this.rng = null;
    }

    /**
     * Seeded random number generator (mulberry32)
     */
    createRNG(seed) {
        return function() {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    /**
     * Load and merge all seed data
     */
    async loadSeed() {
        try {
            // Load schema
            const schemaResponse = await fetch('data/ipsum-seed.schema.json');
            this.schema = await schemaResponse.json();

            // Load core seed
            const coreResponse = await fetch('data/seed_core.json');
            const core = await coreResponse.json();

            // Load fragment files
            const homerResponse = await fetch('data/fragments_homer.json');
            const hesiodResponse = await fetch('data/fragments_hesiod.json');

            const homerFragments = await homerResponse.json();
            const hesiodFragments = await hesiodResponse.json();

            // Merge fragments into core
            this.seed = {
                ...core,
                fragments: [...homerFragments, ...hesiodFragments]
            };

            // Validate
            this.validateSeed();

            return true;
        } catch (error) {
            console.error('Failed to load seed data:', error);
            return false;
        }
    }

    /**
     * Validate seed against schema (manual validation)
     */
    validateSeed() {
        const required = ['version', 'name', 'sources', 'modes', 'templates', 'fragments', 'combination_rules'];

        for (const field of required) {
            if (!this.seed[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Validate version format
        if (!/^\d+\.\d+\.\d+$/.test(this.seed.version)) {
            throw new Error(`Invalid version format: ${this.seed.version}`);
        }

        // Validate fragments
        if (!Array.isArray(this.seed.fragments) || this.seed.fragments.length === 0) {
            throw new Error('Fragments must be a non-empty array');
        }

        for (const frag of this.seed.fragments) {
            if (!frag.id || !frag.source || !frag.mode || !frag.role || !frag.text) {
                throw new Error(`Invalid fragment: ${JSON.stringify(frag)}`);
            }
        }

        console.log('✓ Seed validation passed');
    }

    /**
     * Generate ipsum text
     */
    generateIpsum(options = {}) {
        const {
            mode = 'fate',
            length = 'medium',
            sentences = 4,
            paragraphs = 1,
            useHomer = true,
            useHesiod = true,
            blendMode = 'block',
            blend = 0.5,
            seedRandom = null
        } = options;

        // Initialize RNG
        this.rng = seedRandom !== null ? this.createRNG(seedRandom) : Math.random;

        const debug = {
            mode,
            length,
            sentences,
            paragraphs,
            useHomer,
            useHesiod,
            blend,
            selectedFragments: []
        };

        const paragraphTexts = [];

        for (let p = 0; p < paragraphs; p++) {
            const usedFragmentIds = new Set();
            const sentenceTexts = [];

            // Determine dominant source for this paragraph
            let dominantSource = null;
            let intrusionRate = 0;

            if (useHomer && useHesiod && blendMode === 'block') {
                dominantSource = blend <= 0.5 ? 'HOMER' : 'HESIOD';
                const { intrusion_rate_min, intrusion_rate_max } = this.seed.combination_rules.block;
                intrusionRate = intrusion_rate_min + this.rng() * (intrusion_rate_max - intrusion_rate_min);

                debug[`paragraph_${p}_dominant`] = dominantSource;
                debug[`paragraph_${p}_intrusion_rate`] = intrusionRate.toFixed(3);
            }

            for (let s = 0; s < sentences; s++) {
                const sentence = this.generateSentence({
                    mode,
                    length,
                    useHomer,
                    useHesiod,
                    dominantSource,
                    intrusionRate,
                    usedFragmentIds,
                    debug
                });
                sentenceTexts.push(sentence);
            }

            paragraphTexts.push(sentenceTexts.join(' '));
        }

        const text = paragraphTexts.join('\n\n');

        return { text, debug };
    }

    /**
     * Generate a single sentence from a template
     */
    generateSentence(context) {
        const { mode, length, useHomer, useHesiod, dominantSource, intrusionRate, usedFragmentIds, debug } = context;

        // Find matching templates
        const matchingTemplates = this.seed.templates.filter(t =>
            t.mode === mode && t.length === length
        );

        if (matchingTemplates.length === 0) {
            throw new Error(`No templates found for mode=${mode}, length=${length}`);
        }

        // Select template (weighted random)
        const template = this.weightedRandomSelect(matchingTemplates);

        // Parse pattern to extract role tokens
        const pattern = template.pattern;
        const roleTokens = pattern.match(/\{([^}]+)\}/g) || [];

        let sentence = pattern;

        // Replace each role token with a fragment
        for (const token of roleTokens) {
            const role = token.slice(1, -1); // Remove { and }

            const fragment = this.selectFragment({
                mode,
                role,
                useHomer,
                useHesiod,
                dominantSource,
                intrusionRate,
                usedFragmentIds
            });

            if (fragment) {
                sentence = sentence.replace(token, fragment.text);
                usedFragmentIds.add(fragment.id);
                debug.selectedFragments.push({
                    role,
                    fragmentId: fragment.id,
                    source: fragment.source,
                    text: fragment.text
                });
            } else {
                sentence = sentence.replace(token, `[${role}]`);
            }
        }

        // Capitalize first letter and add period
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        if (!sentence.endsWith('.') && !sentence.endsWith(',')) {
            sentence += '.';
        }

        return sentence;
    }

    /**
     * Select a fragment matching the given criteria
     */
    selectFragment(criteria) {
        const { mode, role, useHomer, useHesiod, dominantSource, intrusionRate, usedFragmentIds } = criteria;

        // Filter fragments by mode and role
        let candidates = this.seed.fragments.filter(f =>
            f.mode === mode &&
            f.role === role &&
            !usedFragmentIds.has(f.id)
        );

        if (candidates.length === 0) {
            return null;
        }

        // Apply source filtering
        if (!useHomer && !useHesiod) {
            return null;
        }

        if (useHomer && !useHesiod) {
            candidates = candidates.filter(f => f.source === 'HOMER');
        } else if (!useHomer && useHesiod) {
            candidates = candidates.filter(f => f.source === 'HESIOD');
        } else if (dominantSource && intrusionRate > 0) {
            // Both sources enabled with blending
            const nonDominantSource = dominantSource === 'HOMER' ? 'HESIOD' : 'HOMER';

            // Check if this role should potentially intrude
            const intrusionRoleBias = this.seed.combination_rules.block.intrusion_role_bias || [];
            const isIntrusionBiasedRole = intrusionRoleBias.includes(role);

            // Determine if this selection should be an intrusion
            const shouldIntrude = isIntrusionBiasedRole ?
                this.rng() < intrusionRate * 1.5 : // Boosted chance for biased roles
                this.rng() < intrusionRate;

            if (shouldIntrude) {
                candidates = candidates.filter(f => f.source === nonDominantSource);
            } else {
                candidates = candidates.filter(f => f.source === dominantSource);
            }
        }

        if (candidates.length === 0) {
            return null;
        }

        // Apply weights
        const weighted = candidates.map(frag => ({
            ...frag,
            effectiveWeight: (frag.weight || 1.0) * this.seed.sources[frag.source].default_weight
        }));

        return this.weightedRandomSelect(weighted, 'effectiveWeight');
    }

    /**
     * Weighted random selection
     */
    weightedRandomSelect(items, weightField = 'weight') {
        const totalWeight = items.reduce((sum, item) => sum + (item[weightField] || 1.0), 0);
        let random = this.rng() * totalWeight;

        for (const item of items) {
            random -= (item[weightField] || 1.0);
            if (random <= 0) {
                return item;
            }
        }

        return items[items.length - 1]; // Fallback
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.EpicIpsumGenerator = EpicIpsumGenerator;
}
