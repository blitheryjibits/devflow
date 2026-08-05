import mongoose, { type Mongoose } from "mongoose";
import logger from "@/lib/logger";
import "@/database";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error("MONGODB_URI not defined");
}

interface MongooseCache {
	conn: Mongoose | null;
	promise: Promise<Mongoose> | null;
}

declare global {
	// the use of var prevents block scoping of the mongoose cache
	var mongooseCache: MongooseCache;
}

let cached = global.mongooseCache;

if (!cached) {
	cached = global.mongooseCache = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
	if (cached.conn) {
		logger.info("Using existing mongoose connection");
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				dbName: "devflow",
			})
			.then((result) => {
				logger.info("connected to DB");
				return result;
			})
			.catch((error) => {
				logger.error("Error connecting to MongoDB ", error);
				throw error;
			});
	}

	cached.conn = await cached.promise;

	return cached.conn;
};

export default dbConnect;
