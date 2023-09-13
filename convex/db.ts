import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/* {
	roomId: "12dscsc",
	passPhrase: "stringified",
	} 
*/

export const getRoom = query({
	args: {
		roomId: v.string(),
		passPhrase: v.string(),
	},
	handler: async (ctx, { roomId, passPhrase }) => {
		// Find the room
		const room = await ctx.db
			.query("rooms")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("passPhrase"), passPhrase)
				)
			)
			.first();

		if (!room)
			return {
				status: false,
				dbErr: room,
				error: "'Get Room', room does not exist, try again!!",
				data: [],
			};

		return {
			status: true,
			dbErr: null,
			error: null,
			data: room,
		};
	},
});

export const createRoom = mutation({
	args: {
		roomId: v.string(),
		roomUrl: v.optional(v.string()), // in production maybe
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

		// Create a new room
		let createRoom = await ctx.db.insert("rooms", {
			roomId,
			videoUrl,
			videoState,
			passPhrase,
			roomUrl: roomUrl ? roomUrl : null,
		});
		if (!createRoom)
			return {
				status: false,
				dbErr: createRoom,
				error: "'Create Room', room was not created!!",
				data: [],
			};

		// Retrieve the Id of the record
		let recordId = await ctx.db.get(createRoom);
		if (!recordId)
			return {
				status: false,
				dbErr: recordId,
				error: "'Create Room', record with Id was not found!!",
				data: [],
			};

		// Create a new moderator for the room
		let createModerator = await ctx.db.insert("users", {
			moderator: true,
			roomId: roomId,
			username: moderator.username,
			videoControls: moderator.videoControls,
		});

		if (!createModerator)
			return {
				status: false,
				dbErr: createModerator,
				error: "'Create room', moderator was not created!!",
				data: [],
			};

		return {
			status: true,
			dbErr: null,
			error: null,
			data: [],
		};
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

		if (!record)
			return {
				status: false,
				dbErr: record,
				error: "'Update video' room record was not found",
				data: [],
			};

		// Only a user with a status of moderator can update the status of the video
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
			return {
				status: false,
				dbErr: findModerator,
				error: "'Update Video', you are not authorized",
				data: [],
			};

		let recordId = record._id;

		// Modify the video state
		await ctx.db.patch(recordId, {
			videoState,
		});

		return {
			status: true,
			dbErr: null,
			error: null,
			data: [],
		};
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
		// Only a moderator can elevate another user
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
			return {
				status: false,
				dbErr: findModerator,
				error: "'Elevate User', you are not authorized",
				data: [],
			};

		// Make sure invited user exists for the room and is not a moderator
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

		if (!findInvite)
			return {
				status: false,
				dbErr: findModerator,
				error: "'Elevate User', invited user does not exist",
				data: [],
			};

		let moderatorId = findModerator._id;
		let inviteId = findInvite._id;

		// Update the status of moderator user
		await ctx.db.patch(moderatorId, {
			videoControls: "NOT_ALLOWED",
			moderator: false,
		});

		// Update the status of invite user
		await ctx.db.patch(inviteId, {
			videoControls: "ALLOWED",
			moderator: true,
		});

		return {
			status: true,
			dbErr: null,
			error: null,
			data: [],
		};
	},
});

export const inviteUser = mutation({
	args: {
		roomId: v.string(),
		passPhrase: v.string(),
		invited: v.object({
			username: v.string(),
			videoControls: v.union(v.literal("ALLOWED"), v.literal("NOT_ALLOWED")),
		}),
	},
	handler: async (ctx, { roomId, passPhrase, invited }) => {
		// Find the room
		const room = await ctx.db
			.query("rooms")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("passPhrase"), passPhrase)
				)
			)
			.first();

		if (!room)
			return {
				status: false,
				dbErr: room,
				error: "'Join Room', room does not exist, try again",
				data: [],
			};

		// Be certain invited user does not already exist
		const inviteExists = await ctx.db
			.query("users")
			.filter((q) =>
				q.and(
					q.eq(q.field("moderator"), false),
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("username"), invited.username)
				)
			)
			.first();

		if (inviteExists) {
			return {
				status: false,
				dbErr: inviteExists,
				error: "'Join Room', invite already exists, join to continue",
				data: [],
			};
		}

		if (invited.videoControls === "ALLOWED") {
			return {
				status: false,
				dbErr: null,
				error: "'Join Room', a moderator already exists, check your status",
				data: [],
			};
		}
		// Add invited user to db
		let saveRecord = await ctx.db.insert("users", {
			roomId,
			moderator: false,
			username: invited.username,
			videoControls: invited.videoControls,
		});

		if (!saveRecord)
			return {
				status: false,
				dbErr: saveRecord,
				error: "'Join Room', error inviting user to room",
				data: [],
			};

		return {
			status: true,
			dbErr: null,
			error: null,
			data: [],
		};
	},
});