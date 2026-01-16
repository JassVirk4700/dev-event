import mongoose from 'mongoose';

// MongoDB connection string. Make sure this is set in your environment (e.g. .env.local)
// Example: MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/my-db?retryWrites=true&w=majority"
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Fail fast in production if the connection string is missing to avoid
  // starting the app in a bad state.
  throw new Error('Please define the MONGODB_URI environment variable in your environment');
}

// Shape of the cached connection object we attach to the global scope.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Augment the Node.js global type so TypeScript knows that `global.mongoose` exists.
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// In development, Next.js hot reloading can cause this module to be executed
// multiple times. To prevent creating multiple connections, we store the
// connection state in the global scope and reuse it across runs.
const cached: MongooseCache = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

/**
 * Establishes (or reuses) a single shared MongoDB connection using Mongoose.
 *
 * - Returns an existing connection if one is already established.
 * - Otherwise, creates a new connection and caches it for subsequent calls.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    // If we already have an active connection, reuse it.
    return cached.conn;
  }

  if (!cached.promise) {
    // Create and cache the initial connection promise so that concurrent
    // calls share the same in-flight connection attempt.
    cached.promise = mongoose.connect(MONGODB_URI!, {
      // Recommended options for modern Mongoose / MongoDB drivers.
      autoIndex: true,
    }).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  // Await the shared promise, then store the resolved connection for reuse.
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
