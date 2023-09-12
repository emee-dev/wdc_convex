import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/* let users = [
  {
    _creationTime: 1694463132051.0566,
    _id: "32nj8sagjkqk83782tejvvf69jdy398",
	roomId: "12344nd",
	username: "mmsooosl",
	status: "MOD",
    moderator: true,
  },
  {
    _creationTime: 1694463132051.0566,
    _id: "32nj8sagjkqk83782tejvvf69jdy398",
	roomId: "12344nd",
	username: "mmthjsl",
	status: "INVITE",
    moderator: false,
  },
    {
    _creationTime: 1694463132051.0566,
    _id: "32nj8sagjkqk83782tejvvf69jdy398",
	roomId: "12dscsc",
	username: "mmsooosl",
	status: "MOD",
    moderator: true,
  },
  {
    _creationTime: 1694463132051.0566,
    _id: "32nj8sagjkqk83782tejvvf69jdy398",
	roomId: "12dscsc",
	username: "mmthjsl",
	status: "INVITE",
    moderator: false,
  },
] */

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
		roomUrl:v.union(v.string(), v.null()),
		videoUrl: v.string(),
		passPhrase: v.string(),
		videoState: v.object({
			seekValue: v.number(),
			isPlaying: v.boolean(),
			volumeValue: v.number(),
		}),
	}),
});
