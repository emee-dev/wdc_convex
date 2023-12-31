import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getVideo = query({
	args: {
		roomId: v.string(),
		password: v.string(),
	},
	handler: async (ctx, { roomId, password }) => {
		// Find the room
		const room = await ctx.db
			.query("rooms")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("password"), password)
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
			data: [room],
		};
	},
});

export const login = mutation({
	args: {
		roomId: v.string(),
		username: v.string(),
		password: v.string(),
	},
	handler: async (ctx, { roomId, username, password }) => {
		// Find the user
		const user = await ctx.db
			.query("users")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("username"), username)
				)
			)
			.first();

		if (!user)
			return {
				status: false,
				dbErr: user,
				error: "'Login', user does not exist, try again!!",
				data: [],
			};

		const room = await ctx.db
			.query("rooms")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("password"), password)
				)
			)
			.first();

		if (!room) {
			return {
				status: false,
				dbErr: user,
				error: "'Login', room does not exist, try again!!",
				data: [],
			};
		}

		return {
			status: true,
			dbErr: null,
			error: null,
			data: [user],
		};
	},
});

export const getAllMembers = query({
	args: {
		roomId: v.string(),
	},
	handler: async (ctx, { roomId }) => {
		// Find the room members
		const users = await ctx.db
			.query("users")
			.filter((q) => q.and(q.eq(q.field("roomId"), roomId)))
			.collect();
		if (!users)
			return {
				status: false,
				dbErr: users,
				error: "'Get All Members', no body was found, try again!!",
				data: [],
			};

		return {
			status: true,
			dbErr: null,
			error: null,
			data: users,
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
		password: v.string(),
		videoUrl: v.string(),
		videoState: v.object({
			seekValue: v.number(),
			volumeValue: v.number(),
			isPlaying: v.boolean(),
			progressValue: v.number(),
		}),
	},
	handler: async (ctx, args) => {
		let { roomId, roomUrl, moderator, password, videoState, videoUrl } = args;

		// Create a new room
		let createRoom = await ctx.db.insert("rooms", {
			roomId,
			videoUrl,
			videoState,
			password,
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

export const inviteUser = mutation({
	args: {
		roomId: v.string(),
		password: v.string(),
		invited: v.object({
			username: v.string(),
			videoControls: v.union(v.literal("ALLOWED"), v.literal("NOT_ALLOWED")),
		}),
		moderator: v.boolean(),
	},
	handler: async (ctx, { roomId, password, invited, moderator }) => {
		// Find the room
		const room = await ctx.db
			.query("rooms")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("password"), password)
				)
			)
			.first();

		if (!room) {
			return {
				status: false,
				dbErr: room,
				error: "'Join Room', room does not exist, try again",
				data: [],
			};
		}

		if (moderator) {
			return {
				status: false,
				dbErr: null,
				error: "'Join Room', a moderator already exists",
				data: [],
			};
		}

		// Check if invited user already exists and is not a moderator
		const inviteExists = await ctx.db
			.query("users")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("moderator"), false),
					q.eq(q.field("username"), invited.username)
				)
			)
			.first();

		if (inviteExists) {
			return {
				status: true,
				dbErr: null,
				error: null,
				data: [inviteExists],
			};
		}

		if (invited.videoControls !== "NOT_ALLOWED") {
			return {
				status: false,
				dbErr: null,
				error: "'Join Room', video controls cannot be granted",
				data: [],
			};
		}

		// Add invited user to the database
		const saveRecord = await ctx.db.insert("users", {
			roomId,
			moderator: false,
			username: invited.username,
			videoControls: invited.videoControls,
		});

		if (!saveRecord) {
			return {
				status: false,
				dbErr: saveRecord,
				error: "'Join Room', error inviting user to room",
				data: [],
			};
		}

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
		password: v.string(),
		videoState: v.object({
			seekValue: v.number(),
			volumeValue: v.number(),
			isPlaying: v.boolean(),
			progressValue: v.number(),
		}),
	},
	handler: async (ctx, { roomId, moderator, password, videoState }) => {
		// Find the room record
		const record = await ctx.db
			.query("rooms")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("password"), password)
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

export const addComment = mutation({
	args: {
		roomId: v.string(),
		username: v.string(),
		password: v.string(),
		comment: v.string(),
	},
	handler: async (ctx, { comment, password, roomId, username }) => {
		//
		const findRoom = await ctx.db
			.query("rooms")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("password"), password)
				)
			)
			.first();

		if (!findRoom)
			return {
				status: false,
				dbErr: findRoom,
				error: "'Add Comment', room was not found",
				data: [],
			};

		let newComment = await ctx.db.insert("comment", {
			comment,
			roomId,
			username,
		});

		if (!newComment) {
			return {
				status: false,
				dbErr: newComment,
				error: "'Add Comment', comment was not added",
				data: [],
			};
		}

		return {
			status: true,
			dbErr: null,
			error: null,
			data: [newComment],
		};
	},
});

export const fetchComments = query({
	args: {
		roomId: v.string(),
		password: v.string(),
	},
	handler: async (ctx, { password, roomId }) => {
		//
		const findRoom = await ctx.db
			.query("rooms")
			.filter((q) =>
				q.and(
					q.eq(q.field("roomId"), roomId),
					q.eq(q.field("password"), password)
				)
			)
			.first();

		if (!findRoom)
			return {
				status: false,
				dbErr: findRoom,
				error: "'Fetch Comment', room was not found",
				data: [],
			};

		let allComments = await ctx.db
			.query("comment")
			.filter((q) => q.eq(q.field("roomId"), roomId))
			.collect();

		if (!allComments) {
			return {
				status: false,
				dbErr: allComments,
				error: "'Fetch Comment', there was no comment",
				data: [],
			};
		}

		return {
			status: true,
			dbErr: null,
			error: null,
			data: allComments,
		};
	},
});
