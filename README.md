## Trinity Vibe Language

A non-Von Neumann causal programming language with ubiquitous homoiconicity and structural reversibility. Trinity Vibe uses memory-as-computation where the system-facing memory performs computations rather than just storing data.

Minimal, homoiconic, and reversible language designed around LLM-native thinking: Functions → Actors → Prototypes. Runs entirely in the browser via `index.html` (no build step).

### Quick Start

- Open locally: double-click `index.html` or serve with `python3 -m http.server 8001` and visit `http://localhost:8001/trinity-vibe/index.html`.
- Live UI buttons:
  - Execute Trinity Pattern, Show Vibe Coding Style, LLM Coding Example
  - 🌐 Web Framework File System demo
  - 🎬 Tape-Loop Reversibility demo
  - 🏗️ Architect Chain (actor → system root → user root → feature prototypes)
  - ✅ Run Language Tests (built-in harness)
  - 💾 Persistence: Save/Load/Clear symbol space
  - 🧭 Symbol Inspector: Inspect any symbol from the symbol space

### Core Principles

- Homoiconicity (code is data): every symbol exposes `structure` and `sourceCode`.
- Structural reversibility: every transformation is reversible (time travel across states).
- Memory as computation: system-facing memory performs computation through tape operations pruned by causal relevance (non-Von Neumann architecture).
- Minimal orthogonal layers:
  - ⚡ Functions: pure transformations (non-stateful)
  - 🎭 Actors: non-hereditary, message-driven state
  - 🏗️ Prototypes: hereditary, instance factories with method resolution

### Runtime Primitives

- `VibeSymbol(value, capabilities?)`
  - Registers into global `VIBE_SPACE` with temporal coordinates
  - Provides `structure`, `sourceCode`, `history`, `tapeOperations`
- `VibeToken(perms, scope, expiry)`
  - Capability-based security (READ=1, WRITE=2, EXECUTE=4, NETWORK=8)
- `vibeTransform(inputSymbol, transformSymbol)`
  - Universal operation with capability checks, provenance, and tape tracking
- `vibeRevert(symbol, steps)` / `vibeRevertWithTape(symbol, steps)`
  - Time travel using structural inverses and tape rewind

### Tape-Loop Foundation

- `TapeOperation(type, data, position)` with reversible inverse ops
- Universal tape for all transformations; recorded per `VibeSymbol`
- Intelligent pruning (`symbol.pruneTapeOperations()`):
  - Scores ops by temporal decay, structural impact, causal ancestry, and dependency relevance
  - Retains only causally relevant operations (memory as computation)

### Language Layers

- Function layer: `createVibeFunction(fn, { description, requiredPerms, inverse })`
- Actor layer: `createVibeActor(handlers, initialState)` plus `sendMessage(actor, msg, ...args)` and `stepActor(...)`
- Prototype layer: `createVibePrototype(template, methods, parent?)`, `instantiate(proto, params)`, `callMethod(instance, name, ...args)`

### Demos & Tools (in UI)

- Web Framework File System: Files/Directories/Framework prototypes + Cache/Watcher/Router actors
- Tape-Loop Reversibility: end-to-end homoiconicity and structural time travel
- Architect Chain:
  - `SystemArchitect` actor synthesizes a system-facing root prototype
  - System root spawns a user-facing root
  - User root can spawn feature prototypes (e.g., `Inbox`), each with `describe()`
- Symbol Inspector:
  - Inspect any symbol, view structure/source/tape/history, and perform `Prune` / `Revert` / `Export`
- Persistence:
  - Save and Load the global `VIBE_SPACE` via localStorage
- Language Tests:
  - Validates transforms/provenance, actor messaging, prototype inheritance, homoiconicity, reversibility, pruning, and capabilities

### Development Notes

- No external dependencies; all logic in `index.html`.
- For debugging, open your browser console to see tape rewinds and activation logs.
- Cache-busting query param `?cb=timestamp` helps force reloads during development.

