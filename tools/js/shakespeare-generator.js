/**
 * Shakespeare Love & Hate Generator
 * Generates random text combining love phrases and Shakespeare insults
 */

class ShakespeareGenerator {
    constructor(outputElementId) {
        this.outputElementId = outputElementId;
        this.loveFragments = [
            "my heart knows you before my mind does",
            "I would choose you again without being asked",
            "you make the quiet feel like home",
            "I am calmer when you are near",
            "loving you feels inevitable",
            "you soften the sharpest parts of me",
            "I like the world better when you are in it",
            "you are my favorite place to arrive",
            "I trust you with my unfinished thoughts",
            "you are the warmth I look for without realizing it",
            "I would walk slowly with you anywhere",
            "you make ordinary moments feel deliberate",
            "I feel seen when you look at me",
            "you are the thought I return to",
            "I want to learn the shape of your days",
            "you make me less alone in my own head",
            "being with you feels unforced",
            "I like who I am around you",
            "you make time behave differently",
            "I would gladly share silence with you",
            "you are my chosen constant",
            "I want to grow older beside you",
            "your presence steadies me",
            "I find rest in you",
            "I recognize myself more clearly with you",
            "standing close like you expect me to notice",
            "knowing exactly how much space you're taking",
            "that pause feels intentional",
            "not pretending this is accidental",
            "very sure of your hands",
            "watching me react",
            "enjoying how quiet I've gotten",
            "standing close on purpose",
            "making it difficult not to touch you",
            "testing my self control",
            "knowing what you're doing with that look",
            "letting things linger",
            "clearly not in a hurry",
            "pushing boundaries slowly",
            "comfortable holding my attention",
            "knowing how to use your voice",
            "making suggestions without words",
            "leaving very little to the imagination",
            "enjoying the tension you're creating",
            "not backing away",
            "watching to see if I will",
            "making patience feel impossible",
            "letting the moment stretch",
            "very aware of where you are standing",
            "enjoying how close this is getting",
            "making restraint feel optional",
            "playing this carefully",
            "enjoying how undone I look",
            "taking your time on purpose",
            "letting anticipation do the work",
            "closer than necessary",
            "making expectations rise",
            "not hiding your intentions",
            "enjoying being the distraction",
            "confident about what comes next",
            "watching my breath change",
            "enjoying how easily this escalates",
            "holding eye contact too long",
            "making silence feel heavy",
            "testing how far this can go",
            "letting the tension build between us",
            "enjoying the lack of interruption",
            "comfortable taking control",
            "making me wait",
            "enjoying how hard that is",
            "very sure I'm paying attention",
            "standing like you expect to be touched",
            "enjoying the way I hesitate",
            "not pretending this stays innocent",
            "enjoying how close we are to crossing that line",
            "letting the moment do the talking",
            "clearly pleased with yourself",
            "watching me decide",
            "making it hard to look away",
            "comfortable with the tension you're creating",
            "not rushing because you don't need to",
            "enjoying how aware I am of you",
            "letting things get charged",
            "pushing just enough",
            "enjoying how much this affects me",
            "holding back on purpose",
            "confident I'll follow",
            "enjoying the slow burn",
            "making closeness feel deliberate",
            "watching to see what I'll do next",
            "enjoying the way this feels inevitable",
            "letting the anticipation stretch thin",
            "very aware of the effect you're having",
            "not pretending there isn't more coming",
            "comfortable staying right here",
            "enjoying how tense this has become",
            "letting me feel it",
            "pushing the moment forward without moving",
            "enjoying how hard it is to stop",
            "letting this hover right at the edge"
        ];

        this.insultFragments = [
            "fat as butter",
            "villain i have done thy mother",
            "unfit for any place but hell",
            "three-inch fool",
            "a boil a plague sore",
            "fat guts",
            "a flesh-monger a fool and a coward",
            "scullion rampallian fustilarian",
            "loathsome as a toad",
            "better strangers",
            "most pernicious usurer",
            "brain as dry as the remainder biscuit after a voyage",
            "a fool if echo were as hollow as thy head",
            "base proud shallow beggarly knave",
            "not worth another word",
            "an ass",
            "not so much brain as earwax",
            "very ragged wart",
            "villainous knave",
            "a most notable coward an infinite and endless liar",
            "unwashed heathen",
            "caitiff",
            "very dog",
            "idle lump",
            "blockhead",
            "ugly as sin",
            "knave begone",
            "fool-born",
            "very toad",
            "idle-headed",
            "profane",
            "clodpole",
            "lewd vain",
            "most scurvy",
            "beyond all repair",
            "base-minded",
            "pernicious",
            "witless",
            "most contemptible",
            "knavish",
            "detestable",
            "shallow",
            "foul-mouthed",
            "rank",
            "miserable",
            "contemptible",
            "gross",
            "scurvy",
            "lying",
            "base",
            "witless",
            "shameless",
            "ridiculous",
            "sorry excuse for a man",
            "most loathsome",
            "brainless",
            "despicable",
            "worthless",
            "foul thing",
            "whoreson",
            "beetle-headed",
            "hedge-born",
            "greasy",
            "muddy-mettled",
            "dankish",
            "scurvy",
            "currish",
            "loutish",
            "peevish",
            "drunken",
            "dull",
            "craven",
            "reeky",
            "pinching",
            "foul beast",
            "pestilent",
            "shallow",
            "knotty-pated",
            "brazen-faced",
            "mangled",
            "contemptible",
            "foppish",
            "barren",
            "leprous",
            "puddle-headed",
            "wrangling",
            "snarling",
            "rotten",
            "shrill-tongued",
            "dusty",
            "tickle-brained",
            "moon-calf",
            "foul miscreant",
            "besotted",
            "crooked",
            "whining",
            "brutish",
            "patched",
            "scabby",
            "loathed"
        ];
    }

    getRandomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    shuffleArray(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    generate(mode) {
        const totalFragments = Math.floor(Math.random() * 5) + 8; // 8-12 fragments
        let fragments = [];

        if (mode === 'love') {
            // Only love phrases
            for (let i = 0; i < totalFragments; i++) {
                fragments.push(this.getRandomFromArray(this.loveFragments));
            }
        } else if (mode === 'insult') {
            // Only insults
            for (let i = 0; i < totalFragments; i++) {
                fragments.push(this.getRandomFromArray(this.insultFragments));
            }
        } else if (mode === 'mixed') {
            // Mix of both (60% love, 40% insults)
            const loveCount = Math.round(totalFragments * 0.6);
            const insultCount = totalFragments - loveCount;

            for (let i = 0; i < loveCount; i++) {
                fragments.push(this.getRandomFromArray(this.loveFragments));
            }
            for (let i = 0; i < insultCount; i++) {
                fragments.push(this.getRandomFromArray(this.insultFragments));
            }

            // Shuffle to randomize order
            fragments = this.shuffleArray(fragments);
        }

        // Join fragments with spaces, occasionally adding "and" or "but"
        let result = [];
        for (let i = 0; i < fragments.length; i++) {
            result.push(fragments[i]);

            // 20-30% chance to add connector before next fragment
            if (i < fragments.length - 1) {
                const rand = Math.random();
                if (rand < 0.25) { // 25% chance
                    const connector = Math.random() < 0.5 ? 'and' : 'but';
                    result.push(connector);
                }
            }
        }

        return result.join(' ');
    }

    render(text) {
        const outputEl = document.getElementById(this.outputElementId);
        if (outputEl) {
            outputEl.value = text;
        }
    }
}

// Export for use in HTML files
if (typeof window !== 'undefined') {
    window.ShakespeareGenerator = ShakespeareGenerator;
}
