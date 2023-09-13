import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	// Other tables here...

	users: defineTable({
		roomId: v.string(),
		username: v.string(),
		videoControls: v.union(v.literal("ALLOWED"), v.literal("NOT_ALLOWED")),
		moderator: v.boolean(),
	}),
	rooms: defineTable({
		roomId: v.string(),
		roomUrl: v.union(v.string(), v.null()),
		videoUrl: v.string(),
		passPhrase: v.string(),
		videoState: v.object({
			seekValue: v.number(),
			isPlaying: v.boolean(),
			volumeValue: v.number(),
		}),
	}),
});
