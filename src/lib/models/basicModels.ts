import type { ISingleValue } from '$lib/types/basicTypes';
import mongoose, { type Model } from 'mongoose';

export const singleValueSchema = new mongoose.Schema<ISingleValue>(
	{},
	{
		toJSON: {
			virtuals: true,
			transform: function (_doc, ret) {
				delete ret.__t;
				delete ret._id;
			},
		},
		toObject: {
			virtuals: true,
			transform: function (_doc, ret) {
				delete ret.__t;
				delete ret._id;
			},
		},
		timestamps: true,
	}
);

/**
 * The base model for all the single doc information that will be stored in the database.
 *
 * This is its own model because the other types will use a discriminator to separate the different types of data.
 */
export const SingleValueModel: Model<ISingleValue> =
	mongoose.models.SingleValue ?? mongoose.model('SingleValue', singleValueSchema);
