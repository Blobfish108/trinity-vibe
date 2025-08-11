/**
 * Trinity Vibe Core Tests
 * Basic test suite for the extracted core functionality
 */

const TrinityVibe = require('../trinity-vibe-core.js');

let testCount = 0;
let passCount = 0;

function test(name, testFn) {
    testCount++;
    try {
        testFn();
        console.log(`✅ ${name}`);
        passCount++;
    } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

console.log('🧪 Trinity Vibe Core Tests\n');

// Test 1: Basic Symbol Creation
test('Basic Symbol Creation', () => {
    const symbol = TrinityVibe.createVibeSymbol('hello world');
    assert(symbol.value === 'hello world', 'Symbol value should match input');
    assert(symbol.hash, 'Symbol should have a hash');
    assert(symbol.coord >= 0, 'Symbol should have temporal coordinate');
    assert(symbol.vibeType === 'PRIMITIVE', 'String should be detected as PRIMITIVE');
});

// Test 2: Symbol Transformation
test('Symbol Transformation', () => {
    const original = TrinityVibe.createVibeSymbol({ count: 0 });
    const transformed = TrinityVibe.vibeTransform(original, {
        operation: (data) => ({ count: data.count + 1 })
    });
    
    assertEqual(transformed.value.count, 1, 'Transformation should increment count');
    assert(transformed.hash !== original.hash, 'Transformed symbol should have different hash');
    assert(transformed.parentHash === original.hash, 'Transformed symbol should reference parent');
});

// Test 3: Symbol Reversion
test('Symbol Reversion', () => {
    const original = TrinityVibe.createVibeSymbol({ value: 'original' });
    const step1 = TrinityVibe.vibeTransform(original, {
        operation: () => ({ value: 'step1' })
    });
    const step2 = TrinityVibe.vibeTransform(step1, {
        operation: () => ({ value: 'step2' })
    });
    
    const reverted = TrinityVibe.vibeRevert(step2, 1);
    assertEqual(reverted.value.value, 'step1', 'Should revert to step1');
    
    const revertedToOriginal = TrinityVibe.vibeRevert(step2, 2);
    assertEqual(revertedToOriginal.value.value, 'original', 'Should revert to original');
});

// Test 4: Actor Creation and Messaging
test('Actor Creation and Messaging', () => {
    const counter = TrinityVibe.createVibeActor('Counter', {
        state: { count: 0 },
        handlers: {
            increment: function() {
                this.state.count++;
                return this.state.count;
            },
            getCount: function() {
                return this.state.count;
            }
        }
    });
    
    assertEqual(counter.vibeType, 'ACTOR', 'Should be detected as ACTOR');
    
    const initialCount = TrinityVibe.sendMessage(counter, 'getCount');
    assertEqual(initialCount, 0, 'Initial count should be 0');
    
    const newCount = TrinityVibe.sendMessage(counter, 'increment');
    assertEqual(newCount, 1, 'Count should increment to 1');
});

// Test 5: Prototype System
test('Prototype System', () => {
    const Vehicle = TrinityVibe.createVibePrototype('Vehicle', {
        methods: {
            start: function() {
                return `Starting ${this.brand} ${this.model}`;
            }
        }
    });
    
    assertEqual(Vehicle.vibeType, 'PROTOTYPE', 'Should be detected as PROTOTYPE');
    
    const car = TrinityVibe.instantiate(Vehicle, {
        brand: 'Toyota',
        model: 'Camry'
    });
    
    assertEqual(car.vibeType, 'PROTOTYPE_INSTANCE', 'Should be prototype instance');
    
    const result = TrinityVibe.callMethod(car, 'start');
    assertEqual(result, 'Starting Toyota Camry', 'Method should work correctly');
});

// Test 6: Capability System
test('Capability System', () => {
    const readOnlyToken = new TrinityVibe.VibeToken(0b0001); // Only read permission
    const symbol = TrinityVibe.createVibeSymbol({ value: 'test' }, new Set([readOnlyToken]));
    
    // Should block transformation due to lack of write permission
    const blocked = TrinityVibe.vibeTransform(symbol, {
        operation: () => ({ value: 'modified' })
    });
    
    assertEqual(blocked.hash, symbol.hash, 'Transformation should be blocked');
    assertEqual(blocked.value.value, 'test', 'Value should remain unchanged');
});

// Test 7: Tape Operations
test('Tape Operations', () => {
    const original = TrinityVibe.createVibeSymbol({ data: 'original' });
    const transformed = TrinityVibe.vibeTransform(original, {
        operation: (data) => ({ data: 'transformed' })
    });
    
    assert(transformed.tapeOperations.length > 0, 'Should have tape operations recorded');
    assert(transformed.transformationMetadata.operation, 'Should have transformation metadata');
});

// Test 8: Homoiconicity
test('Homoiconicity', () => {
    const fn = function testFunction(x) { return x * 2; };
    const symbol = TrinityVibe.createVibeSymbol(fn);
    
    assert(symbol.structure, 'Should have structural representation');
    assert(symbol.sourceCode, 'Should have source code representation');
    assertEqual(symbol.structure.type, 'function', 'Should detect function type');
    assert(symbol.sourceCode.includes('createVibeSymbol'), 'Source code should be homoiconic');
});

// Test 9: Vibe Space Management
test('Vibe Space Management', () => {
    const initialSize = TrinityVibe.getVibeSpace().size;
    const symbol1 = TrinityVibe.createVibeSymbol('test1');
    const symbol2 = TrinityVibe.createVibeSymbol('test2');
    
    const newSize = TrinityVibe.getVibeSpace().size;
    assert(newSize >= initialSize + 2, 'Vibe space should grow with new symbols');
    
    assert(TrinityVibe.getVibeSpace().has(symbol1.hash), 'Symbol1 should be in vibe space');
    assert(TrinityVibe.getVibeSpace().has(symbol2.hash), 'Symbol2 should be in vibe space');
});

// Test 10: Temporal Coordinates
test('Temporal Coordinates', () => {
    const coord1 = TrinityVibe.getTemporalCoord();
    const symbol = TrinityVibe.createVibeSymbol('test');
    const coord2 = TrinityVibe.getTemporalCoord();
    
    assert(coord2 > coord1, 'Temporal coordinate should advance');
    assert(symbol.coord <= coord2, 'Symbol coordinate should be within range');
});

// Run all tests and report results
console.log(`\n📊 Test Results: ${passCount}/${testCount} passed`);

if (passCount === testCount) {
    console.log('🎉 All tests passed!');
    process.exit(0);
} else {
    console.log(`💥 ${testCount - passCount} test(s) failed`);
    process.exit(1);
}
