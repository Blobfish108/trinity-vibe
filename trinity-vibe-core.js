/**
 * Trinity Vibe Core Runtime
 * A non-Von Neumann causal programming language with ubiquitous homoiconicity and structural reversibility
 * 
 * Unlike traditional Von Neumann architecture where memory passively stores data,
 * Trinity Vibe uses memory-as-computation where the system-facing memory actively
 * performs computations through tape operations and causal relevance scoring.
 */

// Global state
let temporalCoord = 0;
const VIBE_SPACE = new Map();

// Configuration for tape pruning
const TAPE_PRUNING_CONFIG = {
    maxTapeLength: 1000,
    temporalDecayFactor: 0.1,
    structuralRelevanceThreshold: 0.3,
    causalAncestryWeight: 0.4,
    dependencyRelevanceWeight: 0.3
};

// Utility functions
function vibeHash(...inputs) {
    let hash = 0;
    const str = inputs.join('');
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

function createVibeId() {
    return vibeHash(Date.now(), Math.random(), temporalCoord);
}

// ============= CAPABILITY TOKENS =============

class VibeToken {
    constructor(permissions = 0b1111, expiry = temporalCoord + 1000, vibeLevel = 1.0) {
        this.permissions = permissions; // Bitfield: read(1) write(2) execute(4) network(8)
        this.expiry = expiry;
        this.vibeLevel = vibeLevel; // 0.0 to 1.0, affects transformation intensity
        this.attenuationChain = [];
        this.id = createVibeId();
    }
    
    can(operation) {
        const opMap = { read: 1, write: 2, execute: 4, network: 8 };
        return !this.isExpired() && (this.permissions & opMap[operation]) !== 0;
    }
    
    attenuate(restrictions) {
        const newToken = new VibeToken(
            this.permissions & (~restrictions), // Remove restricted permissions
            Math.min(this.expiry, temporalCoord + 100), // Shorter expiry
            this.expiry
        );
        newToken.vibeLevel = this.vibeLevel * 0.8; // Decay vibe
        newToken.attenuationChain = [...this.attenuationChain, restrictions];
        return newToken;
    }
    
    isExpired() {
        return temporalCoord >= this.expiry;
    }
    
    getVibeEmoji() {
        if (this.vibeLevel > 0.8) return "🔥";
        if (this.vibeLevel > 0.6) return "✨";
        if (this.vibeLevel > 0.4) return "💫";
        if (this.vibeLevel > 0.2) return "🌟";
        return "💤";
    }
}

// ============= TAPE-LOOP LAYER: REVERSIBLE + HOMOICONIC FOUNDATION =============

class TapeOperation {
    constructor(type, data, position = 0, computeInverse = true) {
        this.type = type; // 'read', 'write', 'move', 'mark', 'jump'
        this.data = data;
        this.position = position;
        this.inverse = computeInverse ? this.computeInverse() : null;
        this.structure = this.toStructure();
    }
    
    computeInverse() {
        switch(this.type) {
            case 'write': return new TapeOperation('restore', this.previousValue, this.position, false);
            case 'move': return new TapeOperation('move', -this.data, this.position, false);
            case 'mark': return new TapeOperation('unmark', this.data, this.position, false);
            case 'jump': return new TapeOperation('jump', this.returnAddress, this.position, false);
            case 'restore': return new TapeOperation('write', this.data, this.position, false);
            default: return null;
        }
    }
    
    toStructure() {
        return {
            op: this.type,
            data: this.data,
            pos: this.position,
            reversible: true,
            homoiconic: true
        };
    }
    
    toCode() {
        return `(${this.type} ${this.data} @${this.position})`;
    }
}

// ============= VIBE SYMBOL: UNIVERSAL DATA CONTAINER =============

class VibeSymbol {
    constructor(value, capabilities = null) {
        this.value = value;
        this.hash = vibeHash(typeof value, JSON.stringify(value));
        this.capabilities = capabilities || new Set([new VibeToken()]);
        this.coord = temporalCoord++;
        this.history = [];
        this.snapshot = null;
        this.inverse = null;
        this.parentHash = null;
        this.vibeType = this.detectVibeType();
        
        // INHERITED FROM TAPE-LOOP LAYER: Homoiconicity
        this.structure = this.extractStructure();
        this.sourceCode = this.generateSourceCode();
        this.tapeOperations = []; // Sequence of tape operations that created this symbol
        
        // INHERITED FROM TAPE-LOOP LAYER: Reversibility  
        this.transformationMetadata = {
            operation: null,
            operands: [],
            inverseOperation: null,
            structuralDiff: null,
            tapeState: null // Tape state before transformation
        };
        
        // Register in vibe space
        VIBE_SPACE.set(this.hash, this);
    }
    
    detectVibeType() {
        if (typeof this.value === 'function') {
            if (this.value.toString().includes('message') || 
                this.value.toString().includes('handle')) {
                return 'ACTOR';
            }
            if (this.value.toString().includes('new ') ||
                this.value.toString().includes('create') ||
                this.value.toString().includes('instantiate')) {
                return 'PROTOTYPE';
            }
            return 'FUNCTION';
        }
        if (this.value && typeof this.value === 'object') {
            if (this.value.handlers) return 'ACTOR_INSTANCE';
            if (this.value.methods) return 'PROTOTYPE_INSTANCE';
            return 'OBJECT';
        }
        return 'PRIMITIVE';
    }
    
    // HOMOICONICITY: Extract structural representation
    extractStructure() {
        if (typeof this.value === 'function') {
            return {
                type: 'function',
                name: this.value.name || 'anonymous',
                arity: this.value.length,
                body: this.value.toString(),
                homoiconic: true
            };
        } else if (this.value && typeof this.value === 'object') {
            return {
                type: 'object',
                properties: Object.keys(this.value),
                structure: Object.fromEntries(
                    Object.entries(this.value).map(([k, v]) => [k, typeof v])
                ),
                homoiconic: true
            };
        } else {
            return {
                type: typeof this.value,
                value: this.value,
                homoiconic: true
            };
        }
    }
    
    // HOMOICONICITY: Generate source code representation
    generateSourceCode() {
        if (typeof this.value === 'function') {
            return `createVibeSymbol(${this.value.toString()})`;
        } else if (this.value && typeof this.value === 'object') {
            return `createVibeSymbol(${JSON.stringify(this.value, null, 2)})`;
        } else {
            return `createVibeSymbol(${JSON.stringify(this.value)})`;
        }
    }
    
    // REVERSIBILITY: Create structural inverse for complex transformations
    createStructuralInverse() {
        return {
            restoreStructure: this.structure,
            restoreValue: this.value,
            restoreTapeOperations: [...this.tapeOperations],
            restoreMetadata: {...this.transformationMetadata}
        };
    }
    
    // REVERSIBILITY: Execute structural revert
    executeStructuralRevert() {
        if (!this.transformationMetadata.structuralDiff) {
            console.warn('No structural diff available for revert');
            return this;
        }
        
        const diff = this.transformationMetadata.structuralDiff;
        let revertedValue = {...this.value};
        
        // Reverse structural additions
        if (diff.additions) {
            diff.additions.forEach(path => {
                delete revertedValue[path];
            });
        }
        
        // Reverse structural removals
        if (diff.removals) {
            diff.removals.forEach(({path, value}) => {
                revertedValue[path] = value;
            });
        }
        
        // Reverse structural modifications
        if (diff.modifications) {
            diff.modifications.forEach(({path, oldValue}) => {
                revertedValue[path] = oldValue;
            });
        }
        
        return new VibeSymbol(revertedValue, this.capabilities);
    }
    
    // SELF-MODIFICATION: Modify symbol while preserving homoiconicity
    modifySelf(transformation) {
        const tapeOp = new TapeOperation('write', transformation, this.coord);
        this.tapeOperations.push(tapeOp);
        
        // Apply transformation while tracking structural changes
        const oldStructure = this.extractStructure();
        this.value = transformation(this.value);
        const newStructure = this.extractStructure();
        
        // Update homoiconic representations
        this.structure = newStructure;
        this.sourceCode = this.generateSourceCode();
        
        // Record structural diff for reversibility
        this.transformationMetadata.structuralDiff = this.computeStructuralDiff(oldStructure, newStructure);
        
        return this;
    }
    
    // Memory as computation: Prune tape operations based on causal relevance
    pruneTapeOperations() {
        if (this.tapeOperations.length <= TAPE_PRUNING_CONFIG.maxTapeLength) return;
        
        const scored = this.tapeOperations.map((op, index) => ({
            op,
            index,
            relevance: this.computeCausalRelevance(op, index)
        }));
        
        // Keep the most causally relevant operations
        scored.sort((a, b) => b.relevance - a.relevance);
        const keepCount = Math.floor(TAPE_PRUNING_CONFIG.maxTapeLength * 0.8);
        const toKeep = scored.slice(0, keepCount).map(item => item.op);
        
        this.tapeOperations = toKeep;
        console.log(`Pruned tape operations from ${scored.length} to ${toKeep.length}`);
    }
    
    computeCausalRelevance(operation, index) {
        const age = this.tapeOperations.length - index;
        const temporalDecay = Math.exp(-age * TAPE_PRUNING_CONFIG.temporalDecayFactor);
        
        const structuralRelevance = this.isOperationStructurallyRelevant(operation) ? 1 : 0;
        const causalAncestry = this.isInCausalAncestry(operation) ? 1 : 0;
        const dependencyRelevance = this.isDependentOperation(operation) ? 1 : 0;
        
        return temporalDecay + 
               (structuralRelevance * TAPE_PRUNING_CONFIG.structuralRelevanceThreshold) +
               (causalAncestry * TAPE_PRUNING_CONFIG.causalAncestryWeight) +
               (dependencyRelevance * TAPE_PRUNING_CONFIG.dependencyRelevanceWeight);
    }
    
    isOperationStructurallyRelevant(operation) {
        // Operations that directly modified current structure are relevant
        return operation.type === 'write' && 
               JSON.stringify(operation.data).includes(JSON.stringify(this.value).slice(0, 20));
    }
    
    isInCausalAncestry(operation) {
        // Operations that led to this symbol's creation
        return operation.position <= this.coord;
    }
    
    isDependentOperation(operation) {
        // Operations that other recent operations depend on
        const recentOps = this.tapeOperations.slice(-10);
        return recentOps.some(recentOp => 
            recentOp.data && operation.data && 
            JSON.stringify(recentOp.data).includes(JSON.stringify(operation.data))
        );
    }
    
    computeStructuralDiff(oldStructure, newStructure) {
        const diff = {
            additions: [],
            removals: [],
            modifications: []
        };
        
        // Find additions and modifications
        for (const [key, value] of Object.entries(newStructure)) {
            if (!(key in oldStructure)) {
                diff.additions.push(key);
            } else if (JSON.stringify(oldStructure[key]) !== JSON.stringify(value)) {
                diff.modifications.push({
                    path: key,
                    oldValue: oldStructure[key],
                    newValue: value
                });
            }
        }
        
        // Find removals
        for (const [key, value] of Object.entries(oldStructure)) {
            if (!(key in newStructure)) {
                diff.removals.push({path: key, value});
            }
        }
        
        return diff;
    }
}

// ============= CORE TRANSFORMATION FUNCTIONS =============

function vibeTransform(symbol, transformation) {
    // Capability check
    const hasWritePermission = Array.from(symbol.capabilities).some(token => 
        token instanceof VibeToken && token.can('write')
    );
    
    if (!hasWritePermission) {
        console.warn('Transformation blocked: insufficient capabilities');
        return symbol;
    }
    
    // Create tape operation for this transformation
    const tapeOp = new TapeOperation('transform', transformation, symbol.coord);
    
    // Create new symbol with transformation applied
    let newValue;
    if (typeof transformation.operation === 'function') {
        newValue = transformation.operation(symbol.value);
    } else if (transformation.operation === 'set') {
        newValue = transformation.value;
    } else if (transformation.operation === 'merge') {
        newValue = {...symbol.value, ...transformation.data};
    } else {
        // Generic transformation
        newValue = transformation;
    }
    
    const resultSymbol = new VibeSymbol(newValue, symbol.capabilities);
    resultSymbol.parentHash = symbol.hash;
    resultSymbol.history = [...symbol.history, symbol.hash];
    resultSymbol.tapeOperations = [...symbol.tapeOperations, tapeOp];
    
    // Store transformation metadata for reversibility
    resultSymbol.transformationMetadata = {
        operation: transformation,
        operands: [symbol.hash],
        inverseOperation: symbol.createStructuralInverse(),
        structuralDiff: resultSymbol.computeStructuralDiff(symbol.structure, resultSymbol.structure),
        tapeState: symbol.tapeOperations.length
    };
    
    // Automatic tape pruning
    resultSymbol.pruneTapeOperations();
    
    return resultSymbol;
}

function vibeRevert(symbol, steps = 1) {
    if (!symbol.parentHash) {
        console.warn('Cannot revert: no parent hash');
        return symbol;
    }
    
    if (steps === 1 && VIBE_SPACE.has(symbol.parentHash)) {
        return VIBE_SPACE.get(symbol.parentHash);
    }
    
    // Multi-step revert through history
    let current = symbol;
    for (let i = 0; i < steps && current.history.length > 0; i++) {
        const parentHash = current.history[current.history.length - 1];
        if (VIBE_SPACE.has(parentHash)) {
            current = VIBE_SPACE.get(parentHash);
        } else {
            console.warn(`Cannot revert step ${i + 1}: parent not found in VIBE_SPACE`);
            break;
        }
    }
    
    return current;
}

// ============= ACTOR/PROTOTYPE SYSTEM =============

function createVibeActor(name, definition) {
    const actorSymbol = new VibeSymbol({
        name: name,
        type: 'ACTOR',
        state: definition.state || {},
        handlers: definition.handlers || {},
        isHereditary: false // Non-hereditary actors
    });
    
    actorSymbol.vibeType = 'ACTOR';
    return actorSymbol;
}

function createVibePrototype(name, definition) {
    const prototypeSymbol = new VibeSymbol({
        name: name,
        type: 'PROTOTYPE', 
        methods: definition.methods || {},
        properties: definition.properties || {},
        isHereditary: true // Hereditary prototypes
    });
    
    prototypeSymbol.vibeType = 'PROTOTYPE';
    return prototypeSymbol;
}

function sendMessage(actor, message, ...args) {
    if (actor.vibeType !== 'ACTOR' || !actor.value.handlers) {
        console.warn('sendMessage: target is not an actor');
        return null;
    }
    
    const handler = actor.value.handlers[message];
    if (!handler) {
        console.warn(`sendMessage: no handler for message '${message}'`);
        return null;
    }
    
    // Execute handler and return result
    try {
        return handler.apply(actor.value, args);
    } catch (error) {
        console.error(`sendMessage: handler error for '${message}':`, error);
        return null;
    }
}

function instantiate(prototype, initialData = {}) {
    if (prototype.vibeType !== 'PROTOTYPE') {
        console.warn('instantiate: target is not a prototype');
        return null;
    }
    
    const instance = new VibeSymbol({
        ...initialData,
        __prototype__: prototype.hash,
        __methods__: prototype.value.methods
    });
    
    instance.vibeType = 'PROTOTYPE_INSTANCE';
    return instance;
}

function callMethod(instance, methodName, ...args) {
    if (instance.vibeType !== 'PROTOTYPE_INSTANCE') {
        console.warn('callMethod: target is not a prototype instance');
        return null;
    }
    
    const method = instance.value.__methods__[methodName];
    if (!method) {
        console.warn(`callMethod: no method '${methodName}' found`);
        return null;
    }
    
    try {
        return method.apply(instance.value, args);
    } catch (error) {
        console.error(`callMethod: method error for '${methodName}':`, error);
        return null;
    }
}

// ============= UTILITY FUNCTIONS =============

function createVibeSymbol(value, capabilities) {
    return new VibeSymbol(value, capabilities);
}

function getVibeSpace() {
    return VIBE_SPACE;
}

function clearVibeSpace() {
    VIBE_SPACE.clear();
    temporalCoord = 0;
}

function getTemporalCoord() {
    return temporalCoord;
}

// ============= EXPORTS =============

// For Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Core classes
        VibeSymbol,
        VibeToken,
        TapeOperation,
        
        // Core functions
        vibeTransform,
        vibeRevert,
        createVibeSymbol,
        
        // Actor/Prototype system
        createVibeActor,
        createVibePrototype,
        sendMessage,
        instantiate,
        callMethod,
        
        // Utilities
        getVibeSpace,
        clearVibeSpace,
        getTemporalCoord,
        vibeHash,
        createVibeId,
        
        // Configuration
        TAPE_PRUNING_CONFIG
    };
}

// For browsers
if (typeof window !== 'undefined') {
    window.TrinityVibe = {
        VibeSymbol,
        VibeToken,
        TapeOperation,
        vibeTransform,
        vibeRevert,
        createVibeSymbol,
        createVibeActor,
        createVibePrototype,
        sendMessage,
        instantiate,
        callMethod,
        getVibeSpace,
        clearVibeSpace,
        getTemporalCoord,
        vibeHash,
        createVibeId,
        TAPE_PRUNING_CONFIG
    };
}
