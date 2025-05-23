import type { IClub } from "$lib/types/crud/club";
import mongoose, { Model } from "mongoose";
import { crudCollectionSchema } from "../globalCrudModel";

export const clubSchema = new mongoose.Schema<IClub>({
	name: { type: String, required: true, maxlength: 250 },
	day: { type: String, required: true, maxlength: 250 },
	time: { type: String, required: true, maxlength: 250 },
	location: { type: String, required: true, maxlength: 250 },
	advisor: { type: String, required: true, maxlength: 250 },
	instagram: { type: String, maxlength: 250 },
	desc: { type: String, maxlength: 1000 }
}).add(crudCollectionSchema); // Extends the crudCollectionSchema

export const Club: Model<IClub> = mongoose.models.Club ?? mongoose.model('Club', clubSchema);
