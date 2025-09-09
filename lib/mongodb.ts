// lib/mongodb.ts
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI!;
if (!uri) {
    throw new Error("❌ Please add your MongoDB URI to .env.local");
}

// Global is used here to maintain a cached connection across hot reloads in dev.
// This prevents creating new connections on every reload.

// if (process.env.NODE_ENV === "development") {
//     if (!(global as any)._mongoClientPromise) {
//         client = new MongoClient(uri, {
//             serverApi: {
//                 version: ServerApiVersion.v1,
//                 strict: true,
//                 deprecationErrors: true,
//             },
//         });
//         (global as any)._mongoClientPromise = client.connect();
//     }
//     clientPromise = (global as any)._mongoClientPromise;
// } else {
// In production, create a new client instance (no hot reloads).
const client: MongoClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
const clientPromise: Promise<MongoClient> = client.connect();
// }

export default clientPromise;