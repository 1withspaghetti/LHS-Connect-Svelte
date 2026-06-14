import { User } from '$api/users/model';
import type { ISession } from '$lib/types/session';
import mongoose, { type Model, Types } from 'mongoose';

const sessionSchema = new mongoose.Schema<ISession & { _id: Buffer }>({
	_id: { type: Buffer, required: true },
	user: { type: Types.ObjectId, ref: User.modelName, required: true },
	expires: { type: Date, required: true, expires: 0 },
});
sessionSchema
	.virtual('id')
	.get(function () {
		return this._id;
	})
	.set(function (id: Buffer) {
		this._id = id;
	});

export const Session: Model<ISession> =
	mongoose.models.Session ?? mongoose.model('Session', sessionSchema);
