import { MONGO_DB_URI } from '$env/static/private';
import mongoose from 'mongoose';
import { dev } from '$app/environment';

export default async function connect() {
	mongoose.set('toJSON', {
		virtuals: true,
		versionKey: false,
		transform: function (_doc, ret) {
			delete ret._id;
		},
	});
	mongoose.set('toObject', {
		virtuals: true,
		versionKey: false,
		transform: function (_doc, ret) {
			delete ret._id;
		},
	});
	const db = dev ? 'dev' : 'prod';
	return await mongoose.connect(MONGO_DB_URI, { dbName: db });
}

export async function getFileBucket() {
	if (!mongoose.connection.db) await connect();
	if (!mongoose.connection.db) throw new Error('MongoDB connection failed');
	return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'files' });
}
