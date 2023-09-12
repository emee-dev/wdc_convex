import { query, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

/* let rooms = [
	{
		_creationTime: 1694463132051.0566,
		_id: "32nj8sagjkqk83782tejvvf69jdy398",
		roomId: "12344nd",
		passPhrase: "comeandgo",
		videoUrl: "https://youtube.com/1233ddmd",
		roomUrl: "",
		videoState: {
			seekValue: 0,
			isPlaying: false,
			volumeValue: 1,
		},
	},
	{
		_creationTime: 1694464304709.5396,
		_id: "33aycjkbx7dsx6a58t901h439jdww28",
		roomId: "12dscsc",
		passPhrase: "stringified",
		videoUrl: "https://youtube.com/",
		roomUrl: "",
		videoState: {
			seekValue: 0,
			isPlaying: false,
			volumeValue: 1,
		},
	},
]; */

export const getRoom = query({
	args: {
		roomId: v.string(),
		passPhrase: v.string(),
	},
	handler: async (ctx, { roomId, passPhrase }) => {
		const room = await ctx.db
			.query("rooms")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("passPhrase"), passPhrase)
				)
			)
			.collect();

		if (!room) throw new Error("'Get Room', room does not exist");
		console.log(room);

		return room;
	},
});

export const createRoom = mutation({
	args: {
		roomId: v.string(),
		roomUrl: v.optional(v.string()),
		moderator: v.object({
			username: v.string(),
			videoControls: v.literal("ALLOWED"),
		}),
		passPhrase: v.string(),
		videoUrl: v.string(),
		videoState: v.object({
			seekValue: v.number(),
			isPlaying: v.boolean(),
			volumeValue: v.number(),
		}),
	},
	handler: async (ctx, args) => {
		let { roomId, roomUrl, moderator, passPhrase, videoState, videoUrl } = args;

		let createRoom = await ctx.db.insert("rooms", {
			roomId,
			videoUrl,
			videoState,
			passPhrase,
			roomUrl: roomUrl ? roomUrl : null,
		});
		if (!createRoom) throw new Error("'Create Room', room was not created");

		// Retrieve the Id of the record
		let recordId = await ctx.db.get(createRoom);
		if (!recordId) throw new Error("'Create Room', record was not found");

		// Create moderator record
		let createModerator = await ctx.db.insert("users", {
			moderator: true,
			roomId: roomId,
			username: moderator.username,
			videoControls: moderator.videoControls,
		});

		return createModerator;
	},
});

export const updateVideo = mutation({
	args: {
		roomId: v.string(),
		moderator: v.object({ username: v.string() }),
		passPhrase: v.string(),
		videoState: v.object({
			seekValue: v.number(),
			isPlaying: v.boolean(),
			volumeValue: v.number(),
		}),
	},
	handler: async (ctx, { roomId, moderator, passPhrase, videoState }) => {
		// Find the room record
		const record = await ctx.db
			.query("rooms")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("passPhrase"), passPhrase)
				)
			)
			.first();

		if (!record) throw new Error("'Update video' room record was not found");

		// Be certain it is the moderator for the room
		const findModerator = await ctx.db
			.query("users")
			.filter((q) =>
				q.and(
					q.eq(q.field("moderator"), true),
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("username"), moderator.username)
				)
			)
			.first();

		if (!findModerator)
			throw new Error("'Update Video', you are not authorized");

		let recordId = record._id;

		// Modify the video state
		let updateRecord = await ctx.db.patch(recordId, {
			videoState,
		});

		return updateRecord;
	},
});

export const elevateUser = mutation({
	args: {
		roomId: v.string(),
		moderator: v.object({
			username: v.string(),
		}),
		passPhrase: v.string(),
		invited: v.object({
			username: v.string(),
			videoControls: v.union(v.literal("ALLOWED"), v.literal("NOT_ALLOWED")),
		}),
	},
	handler: async (ctx, { roomId, moderator, invited }) => {
		// Be certain it is the moderator for the room
		const findModerator = await ctx.db
			.query("users")
			.filter((q) =>
				q.and(
					q.eq(q.field("moderator"), true),
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("username"), moderator.username)
				)
			)
			.first();

		if (!findModerator)
			throw new Error("'Elevate User', you are not authorized");

		// Be certain it is the invited user for the room
		const findInvite = await ctx.db
			.query("users")
			.filter((q) =>
				q.and(
					q.eq(q.field("moderator"), false),
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("username"), invited.username)
				)
			)
			.first();

		if (!findInvite) throw new Error("'Elevate User', user does not exist");

		let moderatorId = findModerator._id;
		let inviteId = findInvite._id;

		// Update the status of moderator user
		let updateMod = await ctx.db.patch(moderatorId, {
			videoControls: "NOT_ALLOWED",
			moderator: false,
		});

		// Update the status of invite user
		let updateInvite = await ctx.db.patch(inviteId, {
			videoControls: "ALLOWED",
			moderator: true,
		});

		return;
	},
});
