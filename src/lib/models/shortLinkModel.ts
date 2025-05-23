import type { IShortLink } from "$lib/types/crud/shortLink";
import mongoose, { Model } from "mongoose";

export const shortLinkSchema = new mongoose.Schema<IShortLink>({
	url: { type: String, required: true, maxlength: 2048 },
	suffix: { type: String, required: true, maxlength: 32 },
	hash: { type: String, select: false },
	createdAt: { type: Number, required: true },
	uses: { type: Number, default: 0 }
});
shortLinkSchema.index({ suffix: "text", url: "text" });
shortLinkSchema.virtual('hasPassword').get(function(this: IShortLink) {
	return this.hash !== undefined;
});

export const ShortLink: Model<IShortLink, {}, {}, { hasPassword: boolean }> = mongoose.models.ShortLink ?? mongoose.model('ShortLink', shortLinkSchema);