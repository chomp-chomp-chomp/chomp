/**
 * Dad Jokes Ipsum Generator
 * Custom generator with three modes: Good, Random, and Ionesco
 */

class DadJokesGenerator {
    constructor(dataUrl, outputElementId) {
        this.dataUrl = dataUrl;
        this.outputElementId = outputElementId;
        this.data = null;

        // Anti-repetition buffers for Random mode
        this.recentNouns = [];
        this.recentVerbs = [];
        this.recentAdverbs = [];

        // Window sizes for anti-repetition
        this.RECENT_NOUNS_WINDOW = 20;
        this.RECENT_VERBS_WINDOW = 18;
        this.RECENT_ADVERBS_WINDOW = 10;

        this.initializeRandomPools();
    }

    async init() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.statusText}`);
            }
            this.data = await response.json();
            return true;
        } catch (error) {
            console.error('Error loading dad jokes data:', error);
            this.showError('Failed to load content. Please refresh the page.');
            return false;
        }
    }

    initializeRandomPools() {
        // Setup templates for random generation
        this.SETUPS = [
            "I fixed the {NOUN_A}",
            "I read a book about {NOUN_A}",
            "I tried {VERB_A} the {NOUN_A}",
            "I followed the {NOUN_A}",
            "I checked the {NOUN_A}",
            "I bought a {NOUN_A}",
            "I made a {NOUN_A}",
            "I asked the {NOUN_A} for {NOUN_B}",
            "I replaced the {NOUN_A}"
        ];

        this.CONNECTORS = ["but", "and", "so", "which", "then", "until", "because", "while", "even though"];

        this.ENDINGS = [
            ", and that was {NOUN_END}.",
            ", and nothing improved.",
            ", and the {NOUN_END} won.",
            ", and I called it {NOUN_END}.",
            ", and it stayed {ADJ_END}.",
            ", and that was my {NOUN_END}.",
            ", and we agreed to disagree."
        ];

        this.ADJ_END = [
            "available", "incorrect", "seasonal", "calibrated", "miscellaneous", "overdue",
            "conclusive", "quiet", "loud", "final", "temporary", "unhelpful", "remarkable"
        ];

        this.ADVERBS = [
            "quietly", "politely", "briefly", "anyway", "again", "sideways", "exactly", "accidentally",
            "immediately", "eventually", "overnight", "by mistake", "on purpose", "for no reason",
            "in theory", "in practice", "at scale", "as usual", "in silence", "with confidence",
            "without warning", "for compliance", "for clarity", "for safety", "for speed", "for reasons",
            "for the record", "to be fair", "strictly speaking", "as requested", "on paper"
        ];

        this.VERBS = [
            "fixed", "read", "followed", "checked", "organized", "opened", "closed", "cleaned", "removed",
            "approved", "labeled", "sorted", "archived", "assigned", "audited", "balanced", "banned",
            "blamed", "blessed", "booked", "boxed", "buffered", "calibrated", "cataloged", "circled",
            "classified", "compiled", "confirmed", "contradicted", "copied", "corrected", "crated",
            "cropped", "deferred", "deleted", "denied", "docked", "drafted", "echoed", "edited", "emailed",
            "enabled", "erased", "estimated", "exported", "flagged", "flattened", "flipped", "folded",
            "forwarded", "froze", "graded", "grounded", "halted", "handled", "highlighted", "indexed",
            "inspected", "installed", "joined", "launched", "leaked", "logged", "looped", "masked",
            "measured", "merged", "muted", "named", "noted", "numbered", "packed", "paused", "pinned",
            "printed", "processed", "published", "queued", "rated", "rebooted", "recorded", "reduced",
            "refunded", "renamed", "repaired", "replaced", "rerouted", "reset", "reshelved", "retried",
            "annotated", "attached", "backed up", "broke", "compressed", "configured", "decoded",
            "declared", "duplicated", "encrypted", "filed", "folded", "froze", "hydrated", "ignored",
            "inherited", "misread", "overrode", "patched", "polished", "prioritized", "reconciled",
            "reheated", "reported", "reversed", "skipped", "unpacked", "validated", "whispered"
        ];

        this.NOUNS = [
            "clock", "instructions", "manual", "recipe", "calendar", "time", "weather", "email", "drawer",
            "printer", "pen", "list", "map", "doorbell", "silence", "floor", "ladder", "sandwich", "bread",
            "alphabet", "reason", "problem", "number", "meeting", "confidence", "receipt", "window", "chair",
            "mug", "kettle", "toaster", "oven", "pan", "lid", "sponge", "towel", "soap", "key", "lock", "hinge",
            "screw", "tape", "string", "cord", "charger", "battery", "remote", "lamp", "blanket", "pillow",
            "shelf", "box", "basket", "jar", "bottle", "cap", "ticket", "envelope", "stamp", "form", "memo",
            "invoice", "clipboard", "binder", "folder", "tab", "appendix", "footnote", "index", "glossary",
            "deadline", "agenda", "minutes", "policy", "protocol", "procedure", "workflow", "approval",
            "signature", "margin", "draft", "revision", "version", "attachment", "plan", "idea", "mood",
            "tone", "noise", "pressure", "focus", "patience", "context", "meaning", "summary", "priority",
            "solution", "tradeoff", "assumption", "promise", "rumor", "pattern", "signal", "error", "warning",
            "cache", "cookie", "token", "variable", "endpoint", "server", "log", "queue", "buffer", "patch",
            "update", "backup", "file", "database", "schema", "query", "filter", "result", "password", "barcode",
            "catalog", "record", "hold", "fine", "stack", "call number", "spine", "label", "due date", "reference",
            "circulation", "subject", "heading", "entry", "edition",
            "toggle", "shortcut", "memoir", "binder clip", "spare key", "forgotten password", "help desk",
            "attachment limit", "draft note", "side quest", "confirmation", "status", "permission", "receipt number",
            "system", "handbook", "bullet point", "glitch", "timeout", "checkpoint", "tab group", "bookmark",
            "screenshot", "clipboard history", "comment", "annotation", "index card", "rubber band", "marker"
        ];

        this.NOUN_PREFIX = ["the", "a", "my", "your", "this", "that", "one", "another", "spare", "wrong", "final", "second", "new", "old", "same"];

        this.PUNCT = [", ", "; ", " — ", ": "];
    }

    // Helper methods for random generation
    getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    pushToBuffer(buffer, item, maxLen) {
        buffer.push(item);
        if (buffer.length > maxLen) {
            buffer.shift();
        }
    }

    isInRecent(buffer, item) {
        return buffer.includes(item);
    }

    chooseFresh(pool, buffer, maxLen, tries = 12) {
        for (let i = 0; i < tries; i++) {
            const candidate = this.getRandomElement(pool);
            if (!this.isInRecent(buffer, candidate)) {
                this.pushToBuffer(buffer, candidate, maxLen);
                return candidate;
            }
        }
        const fallback = this.getRandomElement(pool);
        this.pushToBuffer(buffer, fallback, maxLen);
        return fallback;
    }

    maybePrefix(noun) {
        if (Math.random() < 0.35) {
            return this.getRandomElement(this.NOUN_PREFIX) + " " + noun;
        }
        return noun;
    }

    pickNoun(usedSet) {
        for (let t = 0; t < 14; t++) {
            const n = this.chooseFresh(this.NOUNS, this.recentNouns, this.RECENT_NOUNS_WINDOW);
            if (!usedSet.has(n)) {
                usedSet.add(n);
                return this.maybePrefix(n);
            }
        }
        const n = this.getRandomElement(this.NOUNS);
        this.pushToBuffer(this.recentNouns, n, this.RECENT_NOUNS_WINDOW);
        usedSet.add(n);
        return this.maybePrefix(n);
    }

    pickVerb() {
        return this.chooseFresh(this.VERBS, this.recentVerbs, this.RECENT_VERBS_WINDOW);
    }

    swapVerb(originalVerb) {
        if (Math.random() < 0.80) {
            return this.pickVerb();
        }
        return originalVerb;
    }

    maybeAdverbTag() {
        if (Math.random() < 0.50) {
            const adv = this.chooseFresh(this.ADVERBS, this.recentAdverbs, this.RECENT_ADVERBS_WINDOW);
            return " " + adv;
        }
        return "";
    }

    makeClause(verb, noun) {
        return verb + " the " + noun;
    }

    joinClauses(clauses) {
        const sep = this.getRandomElement(this.PUNCT);
        return clauses.join(sep);
    }

    makeEnding(usedSet) {
        if (Math.random() < 0.55) {
            let tmpl = this.getRandomElement(this.ENDINGS);
            const endN = this.pickNoun(usedSet);
            const adj = this.getRandomElement(this.ADJ_END);
            tmpl = tmpl.replace('{NOUN_END}', endN);
            tmpl = tmpl.replace('{ADJ_END}', adj);
            return tmpl;
        } else {
            const endN = this.pickNoun(usedSet);
            return ", and kept the " + endN + ".";
        }
    }

    generateRandomSentence() {
        const used = new Set();

        // Setup
        let setupTemplate = this.getRandomElement(this.SETUPS);
        const nounA = this.pickNoun(used);
        const nounB = this.pickNoun(used);
        const verbA = this.pickVerb();

        let setup = setupTemplate
            .replace('{NOUN_A}', nounA)
            .replace('{NOUN_B}', nounB)
            .replace('{VERB_A}', verbA);

        const connector = this.getRandomElement(this.CONNECTORS);

        // Tail clauses (1-4)
        const weights = [0.15, 0.35, 0.35, 0.15];
        const rand = Math.random();
        let clauseCount = 1;
        let cumulative = 0;
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (rand < cumulative) {
                clauseCount = i + 1;
                break;
            }
        }

        const clauses = [];

        // Clause 1
        const v1 = this.pickVerb();
        const n1 = this.pickNoun(used);
        clauses.push(this.makeClause(v1, n1));

        if (clauseCount >= 2) {
            const v2 = this.swapVerb(v1);
            const n2 = this.pickNoun(used);
            clauses.push(this.makeClause(v2, n2));
        }

        if (clauseCount >= 3) {
            const v3 = this.swapVerb(this.pickVerb());
            const n3 = this.pickNoun(used);
            clauses.push("and " + this.makeClause(v3, n3));
        }

        if (clauseCount >= 4) {
            const v4 = this.swapVerb(this.pickVerb());
            const n4 = this.pickNoun(used);
            clauses.push("and " + this.makeClause(v4, n4));
        }

        const tailCore = " " + connector + " " + this.joinClauses(clauses);
        const tailEnd = this.makeEnding(used);
        const tailTag = this.maybeAdverbTag();

        let sentence = setup + tailCore + tailEnd;
        if (!sentence.endsWith('.')) {
            sentence = sentence + '.';
        }

        // Insert tag before final period
        sentence = sentence.slice(0, -1) + tailTag + ".";

        return sentence;
    }

    generate(numParagraphs, category) {
        if (!this.data) {
            console.error('Data not loaded yet');
            return 'Please wait, loading content...';
        }

        if (category === 'random') {
            return this.generateRandom(numParagraphs);
        } else if (category === 'good' || category === 'ionesco') {
            return this.generateFromList(numParagraphs, category);
        } else {
            return 'Invalid category selected';
        }
    }

    generateRandom(numParagraphs) {
        const count = Math.floor(Math.random() * 4) + 6; // 6-9 sentences per paragraph
        const paragraphs = [];

        for (let i = 0; i < numParagraphs; i++) {
            const sentences = [];
            const sentenceCount = Math.floor(Math.random() * 4) + 6; // 6-9 sentences
            for (let j = 0; j < sentenceCount; j++) {
                sentences.push(this.generateRandomSentence());
            }
            paragraphs.push(sentences.join(' '));
        }

        return paragraphs.join('\n\n');
    }

    generateFromList(numParagraphs, category) {
        const jokes = this.data.categories[category].jokes;
        if (!jokes || jokes.length === 0) {
            return 'No jokes available for this category';
        }

        const paragraphs = [];
        for (let i = 0; i < numParagraphs; i++) {
            const paragraph = [];
            const sentencesPerParagraph = Math.floor(Math.random() * 3) + 3; // 3-5 jokes per paragraph

            for (let j = 0; j < sentencesPerParagraph; j++) {
                paragraph.push(this.getRandomElement(jokes));
            }

            paragraphs.push(paragraph.join(' '));
        }

        return paragraphs.join('\n\n');
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
    window.DadJokesGenerator = DadJokesGenerator;
}
