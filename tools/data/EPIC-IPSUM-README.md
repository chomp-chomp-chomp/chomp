# Epic Ipsum Generator

Schema-driven lorem ipsum generator using archaic Greek epic poetry fragments from Homer and Hesiod.

## Overview

This generator implements a sophisticated text generation system with:
- **JSON Schema validation**
- **Modular fragment architecture**
- **Template-based pattern expansion**
- **Weighted random selection with blending**
- **Reproducible seeded randomness**

## File Structure

```
tools/
├── data/
│   ├── ipsum-seed.schema.json          # JSON Schema for validation
│   ├── seed_core.json                  # Core config (sources, modes, templates)
│   ├── fragments_homer.json            # 37 Homeric fragments
│   ├── fragments_hesiod.json           # 45 Hesiodic fragments
│   └── epic-ipsum-combined-reference.json  # Complete reference
├── js/
│   └── epic-ipsum-generator.js         # Generator implementation
└── epic.html                            # User interface

```

## Architecture

### 1. Schema-Driven Design

The generator validates all seed data against `ipsum-seed.schema.json`:
- Required fields: version, name, sources, modes, templates, fragments, combination_rules
- Fragment structure: id, source, mode, role, text, weight
- Template structure: mode, length, pattern, weight

### 2. Fragment System

**Sources:**
- `HOMER`: Iliad/Odyssey - heroic narrative, warfare, divine intervention
- `HESIOD`: Theogony/Works & Days - cosmogony, agriculture, moral wisdom

**Modes:**
- `fate`: Prophecy, doom, divine will
- `labor`: Work, struggle, cultivation
- `endurance`: Patient suffering, resilience
- `genealogy`: Lineage, ancestry, origins

**Roles:**
- `subject`: Primary actor
- `action`: The deed
- `object`: Recipient/target
- `modifier`: Descriptive element
- `consequence`: Result/outcome

### 3. Template Patterns

Templates define sentence structures using role tokens:

```
{modifier} {subject} {action} {object}, {consequence}
```

Example expansion:
```
"As rosy-fingered dawn arose, swift-footed heroes ordained by the will of Zeus
the doom of bronze-clad warriors, and great sorrow befell the Achaeans."
```

### 4. Blending Logic

When both sources are enabled:

1. **Dominant Source**: Determined by `blend` parameter
   - `blend ≤ 0.5` → Homer dominant
   - `blend > 0.5` → Hesiod dominant

2. **Intrusion Rate**: Random between `intrusion_rate_min` (0.1) and `intrusion_rate_max` (0.3)

3. **Role Bias**: Intrusions prefer `modifier` and `consequence` roles (1.5x chance)

4. **Deduplication**: Fragments not reused within same paragraph

### 5. Weight Calculation

```javascript
effectiveWeight = fragment.weight × sources[source].default_weight
```

Fragments are selected via weighted random sampling.

## API Usage

### Basic Generation

```javascript
const epicGen = new EpicIpsumGenerator();
await epicGen.loadSeed();

const result = epicGen.generateIpsum({
    mode: 'fate',
    length: 'medium',
    sentences: 4,
    paragraphs: 3
});

console.log(result.text);
console.log(result.debug);
```

### Options

```javascript
{
    mode: 'fate' | 'labor' | 'endurance' | 'genealogy',  // Theme
    length: 'ui' | 'short' | 'medium' | 'long',          // Sentence length
    sentences: 4,                                         // Per paragraph
    paragraphs: 3,                                        // Total
    useHomer: true,                                       // Include Homer
    useHesiod: true,                                      // Include Hesiod
    blendMode: 'block',                                   // Blending strategy
    blend: 0.5,                                           // 0=Homer, 1=Hesiod
    seedRandom: null | integer                            // For reproducibility
}
```

### Homer Only

```javascript
const result = epicGen.generateIpsum({
    mode: 'labor',
    useHomer: true,
    useHesiod: false
});
```

### Hesiod-Dominant Blend

```javascript
const result = epicGen.generateIpsum({
    mode: 'genealogy',
    blend: 0.75,  // 75% Hesiod dominant
    sentences: 5
});
```

### Reproducible Output

```javascript
const result = epicGen.generateIpsum({
    mode: 'endurance',
    seedRandom: 42  // Same seed = same output
});
```

## Fragment Coverage

| Mode | Homer | Hesiod | Total |
|------|-------|--------|-------|
| fate | 9 | 11 | 20 |
| labor | 6 | 10 | 16 |
| endurance | 7 | 7 | 14 |
| genealogy | 7 | 11 | 18 |
| **Total** | **37** | **45** | **82** |

## Implementation Details

### Seeded RNG

Uses **Mulberry32** algorithm for reproducible randomness:

```javascript
createRNG(seed) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
```

### Validation

Manual schema validation checks:
- Required fields present
- Version format: `\d+\.\d+\.\d+`
- Fragments array non-empty
- Each fragment has required fields

### Template Expansion

1. Parse pattern for `{role}` tokens
2. For each token:
   - Filter fragments by mode + role
   - Apply source filtering (Homer/Hesiod)
   - Apply blending logic if both enabled
   - Weight-based random selection
   - Track used IDs for deduplication
3. Replace token with fragment text
4. Capitalize and punctuate

## Debug Output

Enable debug mode to see:
- Selected mode, length, sentences, paragraphs
- Source configuration (useHomer, useHesiod, blend)
- Per-paragraph dominant source
- Per-paragraph intrusion rate
- Every selected fragment with ID, source, role, text

## Example Outputs

### Fate Mode (Homer-dominant, blend=0.3)
```
As rosy-fingered dawn arose, the grey-eyed goddess ordained by the will of Zeus
the doom of bronze-clad warriors, and great sorrow befell the Achaeans. When
battle-fury seized mortal hearts, swift-footed heroes spun upon the thread of
destiny the journey home across wine-dark seas, as the fates had spun from the
beginning.
```

### Labor Mode (Hesiod-dominant, blend=0.7)
```
When winter's cold loosens its grip, the tiller of earth plowed the fertile
soil the grain-giving earth, for idleness brings only hunger and shame. Through
honest work and righteous deeds, mortals who work with their hands sowed seeds
when the Pleiades rise the harvest ordained by seasons, thus may prosperity
come to the household.
```

### Genealogy Mode (Mixed, blend=0.5)
```
First of all came into being primordial Chaos gave birth to the race of Titans
the first generation of immortals, from whom all other beings descended.
According to the sacred genealogy, broad-breasted Earth engendered the deathless
gods powers that rule the cosmos eternal, and thus the cosmos was ordered from
formless void.
```

## Extending the System

### Adding New Fragments

1. Edit `fragments_homer.json` or `fragments_hesiod.json`
2. Follow schema:
   ```json
   {
     "id": "unique_id",
     "source": "HOMER" | "HESIOD",
     "mode": "fate" | "labor" | "endurance" | "genealogy",
     "role": "subject" | "action" | "object" | "modifier" | "consequence",
     "text": "fragment text",
     "weight": 1.0
   }
   ```
3. Reload generator

### Adding New Modes

1. Edit `seed_core.json`:
   ```json
   "modes": {
     "new_mode": {
       "label": "New Mode",
       "description": "Description"
     }
   }
   ```
2. Add templates for new mode
3. Add fragments with new mode

### Adding New Sources

1. Create `fragments_newsource.json`
2. Add to `seed_core.json`:
   ```json
   "sources": {
     "NEWSOURCE": {
       "label": "New Source",
       "description": "Description",
       "default_weight": 1.0
     }
   }
   ```
3. Update loader in generator

## Performance

- Initial load: ~50-100ms (async fetch × 4 files)
- Generation: <1ms per paragraph (82 fragments)
- Memory: ~50KB seed data
- No dependencies (vanilla JS)

## Browser Support

- Modern browsers with ES6+ support
- Requires `fetch`, `async/await`, `Array.from`, spread operator
- Chrome 55+, Firefox 52+, Safari 11+, Edge 15+

---

**Created**: 2026-01-12
**Version**: 1.0.0
**Author**: Chomp Chomp
**License**: Part of chompchomp.cc tools
