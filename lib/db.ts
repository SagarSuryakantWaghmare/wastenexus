import mongoose, { ConnectOptions, Connection } from 'mongoose';

// Ensure MongoDB URI is set
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Type for the mongoose connection cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastConnectionAttempt: number | null;
  isConnected: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

// Initialize the cache if it doesn't exist
const globalWithMongoose = global as typeof globalThis & {
  mongoose: MongooseCache;
};

let cached = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
  lastConnectionAttempt: null,
  isConnected: false,
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = {
    conn: null,
    promise: null,
    lastConnectionAttempt: null,
    isConnected: false,
  };
  cached = globalWithMongoose.mongoose;
}

// Connection event handlers
function setupMongooseEvents(connection: Connection) {
  connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
    cached.lastConnectionAttempt = Date.now();
    cached.isConnected = true;
  });

  connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
    cached.isConnected = false;
    // Reset the connection on error to allow reconnection
    cached.conn = null;
    cached.promise = null;
  });

  connection.on('disconnected', () => {
    console.log('ℹ️  MongoDB disconnected');
    cached.isConnected = false;
  });

  connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
    cached.isConnected = true;
  });
}

// Check if we're already connected
function isConnected() {
  return cached.isConnected && mongoose.connection.readyState === 1;
}

/**
 * Connect to MongoDB with retry logic and connection pooling
 */
async function dbConnect(): Promise<typeof mongoose> {
  // If we have a valid connection, use it
  if (isConnected() && cached.conn) {
    console.log('♻️  Using existing MongoDB connection');
    return cached.conn;
  }

  // If we're already connecting, wait for that connection
  if (cached.promise) {
    console.log('⏳ Waiting for existing connection...');
    return cached.promise;
  }

  // If last connection attempt was recent, wait a bit before retrying
  const now = Date.now();
  if (cached.lastConnectionAttempt && now - cached.lastConnectionAttempt < 5000) {
    console.log('⏳ Waiting before reconnection attempt...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return dbConnect();
  }

  console.log('🌐 Creating new MongoDB connection...');
  cached.lastConnectionAttempt = now;

  const options: ConnectOptions = {
    serverSelectionTimeoutMS: 15000, // 15 seconds
    socketTimeoutMS: 30000, // 30 seconds
    connectTimeoutMS: 15000, // 15 seconds
    maxPoolSize: 10, // Maximum number of connections in the connection pool
    minPoolSize: 1, // Minimum number of connections in the connection pool
    maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
    family: 4, // Use IPv4, skip trying IPv6
    retryWrites: true,
    retryReads: true,
    w: 'majority',
  };

  try {
    console.log(`🔌 Connecting to MongoDB at ${MONGODB_URI.split('@')[1] || MONGODB_URI}`);
    
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      console.log('✅ MongoDB connection established');
      setupMongooseEvents(mongoose.connection);
      return mongoose;
    });

    // Set up error handling for the promise
    cached.promise = cached.promise.catch((error) => {
      console.error('❌ MongoDB connection failed:', error);
      cached.promise = null;
      cached.conn = null;
      throw error;
    });

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to connect to MongoDB:', errorMessage);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    
    // Reset the promise to allow retries
    cached.promise = null;
    cached.conn = null;
    
    throw new Error(`Database connection failed: ${errorMessage}`);
  }
}

export default dbConnect;
