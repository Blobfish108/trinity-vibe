/**
 * Trinity Vibe Node.js Integration Example
 * Demonstrates using Trinity Vibe in server-side applications
 */

const TrinityVibe = require('../trinity-vibe-core.js');

console.log('🌟 Trinity Vibe Node.js Integration Examples\n');

// Example 1: API Request Processing with Actors
function apiProcessingExample() {
    console.log('📡 Example 1: API Request Processing with Actors');
    console.log('=' .repeat(50));
    
    // Create an API request processor actor
    const apiProcessor = TrinityVibe.createVibeActor('APIProcessor', {
        state: {
            requestCount: 0,
            errorCount: 0
        },
        handlers: {
            processRequest: function(request) {
                this.state.requestCount++;
                
                // Simulate request validation
                if (!request.userId || !request.action) {
                    this.state.errorCount++;
                    return {
                        success: false,
                        error: 'Missing required fields',
                        requestId: TrinityVibe.createVibeId()
                    };
                }
                
                // Process the request
                return {
                    success: true,
                    data: {
                        userId: request.userId,
                        action: request.action,
                        processed: true,
                        timestamp: new Date().toISOString()
                    },
                    requestId: TrinityVibe.createVibeId()
                };
            },
            
            getStats: function() {
                return {
                    totalRequests: this.state.requestCount,
                    errorCount: this.state.errorCount,
                    successRate: ((this.state.requestCount - this.state.errorCount) / this.state.requestCount * 100).toFixed(2) + '%'
                };
            }
        }
    });
    
    // Simulate API requests
    const requests = [
        { userId: 'user123', action: 'getData' },
        { userId: 'user456', action: 'updateProfile' },
        { action: 'deleteUser' }, // Missing userId - should error
        { userId: 'user789', action: 'createPost' }
    ];
    
    requests.forEach((req, index) => {
        const result = TrinityVibe.sendMessage(apiProcessor, 'processRequest', req);
        console.log(`Request ${index + 1}:`, result);
    });
    
    const stats = TrinityVibe.sendMessage(apiProcessor, 'getStats');
    console.log('\n📊 API Processing Stats:', stats);
    console.log('');
}

// Example 2: Database-like Operations with Reversibility
function databaseExample() {
    console.log('🗄️  Example 2: Database-like Operations with Reversibility');
    console.log('=' .repeat(50));
    
    // Create a user database prototype
    const UserDatabase = TrinityVibe.createVibePrototype('UserDatabase', {
        methods: {
            addUser: function(userData) {
                if (!this.users) this.users = [];
                
                const user = {
                    id: TrinityVibe.createVibeId(),
                    ...userData,
                    createdAt: new Date().toISOString()
                };
                
                this.users.push(user);
                return user;
            },
            
            findUser: function(id) {
                return this.users ? this.users.find(user => user.id === id) : null;
            },
            
            updateUser: function(id, updates) {
                if (!this.users) return null;
                
                const userIndex = this.users.findIndex(user => user.id === id);
                if (userIndex === -1) return null;
                
                const oldUser = {...this.users[userIndex]};
                this.users[userIndex] = {
                    ...this.users[userIndex],
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                
                return { old: oldUser, new: this.users[userIndex] };
            },
            
            getAllUsers: function() {
                return this.users || [];
            }
        }
    });
    
    // Create database instance
    let db = TrinityVibe.instantiate(UserDatabase, { users: [] });
    
    console.log('➕ Adding users...');
    const user1 = TrinityVibe.callMethod(db, 'addUser', { name: 'Alice', email: 'alice@example.com' });
    const user2 = TrinityVibe.callMethod(db, 'addUser', { name: 'Bob', email: 'bob@example.com' });
    console.log('Added Alice:', user1.id);
    console.log('Added Bob:', user2.id);
    
    // Transform database state (this creates a new version we can revert to)
    db = TrinityVibe.vibeTransform(db, {
        operation: (dbState) => {
            // Add a computed field to all users
            return {
                ...dbState,
                users: dbState.users.map(user => ({
                    ...user,
                    displayName: user.name.toUpperCase()
                }))
            };
        }
    });
    
    console.log('\n🔄 After transformation (added displayName):');
    // After transformation, access the data directly since it's no longer a prototype instance
    const allUsers = db.value.users || [];
    allUsers.forEach(user => {
        console.log(`- ${user.name} (${user.displayName}) - ${user.email}`);
    });
    
    // Make another transformation
    db = TrinityVibe.vibeTransform(db, {
        operation: (dbState) => ({
            ...dbState,
            users: dbState.users.map(user => ({
                ...user,
                status: 'active'
            }))
        })
    });
    
    console.log('\n✅ After adding status field:');
    (db.value.users || []).forEach(user => {
        console.log(`- ${user.name}: ${user.status}`);
    });
    
    // Time travel back to before status was added
    console.log('\n⏰ Reverting to previous state...');
    const revertedDb = TrinityVibe.vibeRevert(db, 1);
    (revertedDb.value.users || []).forEach(user => {
        console.log(`- ${user.name} (${user.displayName}) - status: ${user.status || 'undefined'}`);
    });
    
    console.log(`\n📊 Current DB has ${db.history.length} historical versions`);
    console.log(`🧵 Tape operations recorded: ${db.tapeOperations.length}`);
    console.log('');
}

// Example 3: Event Processing Pipeline
function eventProcessingExample() {
    console.log('⚡ Example 3: Event Processing Pipeline');
    console.log('=' .repeat(50));
    
    // Create event processor
    const eventProcessor = TrinityVibe.createVibeActor('EventProcessor', {
        state: {
            processedEvents: [],
            filters: []
        },
        handlers: {
            addFilter: function(filterFn, name) {
                this.state.filters.push({ fn: filterFn, name: name });
                return `Filter '${name}' added`;
            },
            
            processEvent: function(event) {
                // Apply all filters
                for (const filter of this.state.filters) {
                    if (!filter.fn(event)) {
                        return {
                            processed: false,
                            reason: `Filtered out by ${filter.name}`,
                            event: event
                        };
                    }
                }
                
                // Process the event
                const processedEvent = {
                    ...event,
                    processedAt: new Date().toISOString(),
                    id: TrinityVibe.createVibeId()
                };
                
                this.state.processedEvents.push(processedEvent);
                
                return {
                    processed: true,
                    event: processedEvent,
                    totalProcessed: this.state.processedEvents.length
                };
            },
            
            getProcessedEvents: function() {
                return this.state.processedEvents;
            }
        }
    });
    
    // Add some filters
    TrinityVibe.sendMessage(eventProcessor, 'addFilter', 
        (event) => event.type !== 'spam', 'spam-filter');
    TrinityVibe.sendMessage(eventProcessor, 'addFilter', 
        (event) => event.priority >= 1, 'priority-filter');
    
    // Process some events
    const events = [
        { type: 'user-login', userId: 'user123', priority: 2 },
        { type: 'spam', content: 'buy now!', priority: 0 },
        { type: 'order-placed', orderId: 'order456', priority: 3 },
        { type: 'user-logout', userId: 'user123', priority: 1 },
        { type: 'low-priority', data: 'test', priority: 0 }
    ];
    
    console.log('Processing events...');
    events.forEach((event, index) => {
        const result = TrinityVibe.sendMessage(eventProcessor, 'processEvent', event);
        console.log(`Event ${index + 1} (${event.type}):`, 
            result.processed ? '✅ Processed' : `❌ ${result.reason}`);
    });
    
    const processed = TrinityVibe.sendMessage(eventProcessor, 'getProcessedEvents');
    console.log(`\n📈 Total events processed: ${processed.length}`);
    processed.forEach(event => {
        console.log(`- ${event.type} (priority: ${event.priority}) at ${event.processedAt}`);
    });
    console.log('');
}

// Example 4: Configuration Management with Capabilities
function configurationExample() {
    console.log('⚙️  Example 4: Configuration Management with Capabilities');
    console.log('=' .repeat(50));
    
    // Create configuration with restricted capabilities
    const readOnlyToken = new TrinityVibe.VibeToken(0b0001, Date.now() + 10000, 0.5); // Only read permission
    const adminToken = new TrinityVibe.VibeToken(0b1111, Date.now() + 10000, 1.0); // All permissions
    
    const config = TrinityVibe.createVibeSymbol({
        database: {
            host: 'localhost',
            port: 5432,
            name: 'myapp'
        },
        api: {
            timeout: 5000,
            retries: 3
        },
        features: {
            darkMode: true,
            notifications: false
        }
    }, new Set([readOnlyToken]));
    
    console.log('📋 Initial config created with read-only capabilities');
    console.log('Config value:', JSON.stringify(config.value, null, 2));
    
    // Try to modify with read-only token (should be blocked)
    console.log('\n🚫 Attempting to modify with read-only token...');
    const blockedResult = TrinityVibe.vibeTransform(config, {
        operation: (cfg) => ({
            ...cfg,
            api: { ...cfg.api, timeout: 10000 }
        })
    });
    
    console.log('Blocked result same as original?', blockedResult.hash === config.hash);
    
    // Create new config with admin capabilities
    const adminConfig = TrinityVibe.createVibeSymbol(config.value, new Set([adminToken]));
    
    console.log('\n✅ Creating new config with admin token...');
    const modifiedConfig = TrinityVibe.vibeTransform(adminConfig, {
        operation: (cfg) => ({
            ...cfg,
            api: { ...cfg.api, timeout: 10000 },
            features: { ...cfg.features, notifications: true }
        })
    });
    
    console.log('Modified config:', JSON.stringify(modifiedConfig.value, null, 2));
    console.log('Modification successful?', modifiedConfig.hash !== adminConfig.hash);
    
    // Show capability information
    const token = Array.from(modifiedConfig.capabilities)[0];
    console.log(`\n🔐 Token info: ${token.getVibeEmoji()} (vibe level: ${token.vibeLevel})`);
    console.log('Can read:', token.can('read'));
    console.log('Can write:', token.can('write'));
    console.log('Can execute:', token.can('execute'));
    console.log('');
}

// Run all examples
function runAllExamples() {
    apiProcessingExample();
    databaseExample();
    eventProcessingExample();
    configurationExample();
    
    console.log('🎯 All examples completed!');
    console.log(`📊 Total symbols in VIBE_SPACE: ${TrinityVibe.getVibeSpace().size}`);
    console.log(`⏰ Current temporal coordinate: ${TrinityVibe.getTemporalCoord()}`);
}

// Run if called directly
if (require.main === module) {
    runAllExamples();
}

module.exports = {
    apiProcessingExample,
    databaseExample,
    eventProcessingExample,
    configurationExample,
    runAllExamples
};
