# Trinity Vibe Runtime

## Overview

Trinity Vibe is a non-Von Neumann causal programming language that uses memory-as-computation architecture. Unlike traditional Von Neumann systems where memory passively stores data, Trinity Vibe's system-facing memory actively performs computations through tape operations and causal relevance scoring.

Trinity Vibe is now available as a standalone JavaScript runtime that can be embedded in web applications and Node.js projects. The core has been extracted from the original HTML IDE into a reusable library.

## Installation

### Browser (CDN)
```html
<script src="https://cdn.jsdelivr.net/gh/Blobfish108/trinity-vibe/trinity-vibe-core.js"></script>
<script>
  const TV = window.TrinityVibe;
  // Use Trinity Vibe...
</script>
```

### Node.js
```bash
npm install trinity-vibe
```
```javascript
const TrinityVibe = require('trinity-vibe');
// Use Trinity Vibe...
```

### Local Development
```bash
git clone https://github.com/Blobfish108/trinity-vibe.git
cd trinity-vibe
node examples/test-core.js  # Run tests
node examples/node-integration.js  # See examples
```

## Core API

### Symbol Creation
```javascript
// Create basic symbols
const symbol = TrinityVibe.createVibeSymbol('hello world');
const objSymbol = TrinityVibe.createVibeSymbol({ count: 0 });
```

### Transformations
```javascript
// Transform symbols (creates new versions)
const transformed = TrinityVibe.vibeTransform(symbol, {
    operation: (data) => ({ ...data, count: data.count + 1 })
});
```

### Time Travel
```javascript
// Revert to previous states
const previous = TrinityVibe.vibeRevert(transformed, 1); // Go back 1 step
const original = TrinityVibe.vibeRevert(transformed, 2); // Go back 2 steps
```

### Actors (Non-Hereditary)
```javascript
// Create actors for message handling
const counter = TrinityVibe.createVibeActor('Counter', {
    state: { count: 0 },
    handlers: {
        increment: function() {
            this.state.count++;
            return this.state.count;
        }
    }
});

// Send messages
const result = TrinityVibe.sendMessage(counter, 'increment');
```

### Prototypes (Hereditary)
```javascript
// Create prototypes for object creation
const Vehicle = TrinityVibe.createVibePrototype('Vehicle', {
    methods: {
        start: function() {
            return `Starting ${this.brand} ${this.model}`;
        }
    }
});

// Create instances
const car = TrinityVibe.instantiate(Vehicle, {
    brand: 'Toyota',
    model: 'Camry'
});

// Call methods
const message = TrinityVibe.callMethod(car, 'start');
```

### Capabilities
```javascript
// Create tokens with specific permissions
const readOnlyToken = new TrinityVibe.VibeToken(0b0001); // read only
const adminToken = new TrinityVibe.VibeToken(0b1111); // all permissions

// Create symbols with capability restrictions
const secureData = TrinityVibe.createVibeSymbol(
    { secret: 'password' }, 
    new Set([readOnlyToken])
);
```

## Key Features

### 🔄 **Ubiquitous Reversibility**
Every transformation is automatically reversible. Travel back in time through any symbol's history.

### 🧬 **Homoiconicity** 
Every symbol can represent itself as both code and data, enabling powerful self-modification.

### 🎭 **Actor/Prototype Duality**
- **Actors**: Non-hereditary message handlers for concurrent systems
- **Prototypes**: Hereditary object templates with method inheritance

### 🔐 **Capability Security**
Fine-grained permission system with temporal scope and automatic attenuation.

### 📼 **Tape-Loop Foundation**
All operations are recorded as reversible tape operations with intelligent pruning.

### 🧠 **Memory as Computation (Non-Von Neumann)**
System-facing memory actively computes through tape operations, with automatic pruning of causal history based on relevance scoring. Unlike Von Neumann architecture where memory passively stores data, Trinity Vibe's memory participates in computation.

## Examples

### Web Integration
See `examples/web-integration.html` for a complete web application example showing:
- Data processing pipelines
- Actor-based state management  
- Time travel debugging
- Prototype system usage

### Node.js Integration
See `examples/node-integration.js` for server-side examples:
- API request processing with actors
- Database operations with reversibility
- Event processing pipelines
- Configuration management with capabilities

### Testing
Run the test suite:
```bash
npm test
# or
node examples/test-core.js
```

## Configuration

### Tape Pruning
```javascript
// Adjust tape pruning behavior
TrinityVibe.TAPE_PRUNING_CONFIG.maxTapeLength = 2000;
TrinityVibe.TAPE_PRUNING_CONFIG.temporalDecayFactor = 0.05;
```

### Vibe Space Management
```javascript
// Get current symbol space
const space = TrinityVibe.getVibeSpace();

// Clear all symbols (useful for testing)
TrinityVibe.clearVibeSpace();

// Get current temporal coordinate
const time = TrinityVibe.getTemporalCoord();
```

## Architecture

Trinity Vibe implements a non-Von Neumann six-layer architecture where memory participates in computation:

- **L5**: Natural Language (Moop) - Human-readable syntax
- **L4**: Prototypes (Rio) - Object-oriented abstractions  
- **L3**: Actors/Controllers (Turchin) - Message-passing concurrency
- **L2**: Functional (Prigogine) - Mathematical bridge layer
- **L1**: Operations (McCarthy) - Reversible, homoiconic foundation with memory-as-computation
- **L0**: RISC-V Assembly - Hardware target with dual memory systems (conventional user-facing + gate-based system-facing)

The extracted runtime provides the core L1-L4 functionality for embedding in applications, featuring system-facing memory that actively computes through tape operations and causal relevance scoring, departing from traditional Von Neumann passive memory storage.

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Node.js 14+

## License

MIT - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass: `npm test`
5. Submit a pull request

## Links

- **Live IDE**: https://blobfish108.github.io/trinity-vibe
- **Repository**: https://github.com/Blobfish108/trinity-vibe
- **Issues**: https://github.com/Blobfish108/trinity-vibe/issues
