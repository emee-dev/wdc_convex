import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import {
	ActionIcon,
	Grid,
	Slider,
	Textarea,
	rem,
	Button,
	Tooltip,
} from "@mantine/core";
import { api } from "../../convex/_generated/api";
import { OnProgressProps } from "react-player/base";
import { useAuth } from "../context/context";
import { useClipboard } from "@mantine/hooks";
import {
	IconReload,
	IconPlayerPlay,
	IconPlayerPause,
	IconRefreshAlert,
	IconUser,
	IconUserBolt,
	IconSend,
} from "@tabler/icons-react";
import AllPlayer from "react-player";
import { Copy } from "./CreateRoom";

const VideoPlayer = () => {
	const { user } = useAuth();

	const updateVideo = useMutation(api.db.updateVideo);
	const addCommentMutation = useMutation(api.db.addComment);

	const videoStateQuery = useQuery(api.db.getVideo, {
		roomId: user.roomId,
		password: user.password,
	});

	const allMembersQuery = useQuery(api.db.getAllMembers, {
		roomId: user.roomId,
	});

	const commentsQuery = useQuery(api.db.fetchComments, {
		roomId: user.roomId,
		password: user.password,
	});

	const videoStateFromDatabase = videoStateQuery?.data[0]?.videoState;
	const videoUrlFromDb = videoStateQuery?.data[0]?.videoUrl;
	const allMembers = allMembersQuery?.data;
	const allComments = commentsQuery?.data;

	const [videoControls, setVideoControls] =
		useState<typeof user.videoControls>("NOT_ALLOWED");
	const [isBuffering, setIsBuffering] = useState(true);
	const [videoUrl, setVideoUrl] = useState("/sample.mp4");
	const [members, setMembers] = useState<typeof allMembers>([]);
	const [comments, setComments] = useState<typeof allComments>([]);
	const [newComment, setNewComment] = useState("");
	const [player, setPlayer] = useState({
		seekValue: 0,
		isPlaying: false,
		volumeValue: 1,
		progressValue: 0,
	});

	const playerRef = useRef<any>(null);

	const onSeek = (seconds: number) => {
		setPlayer((prev) => ({
			...prev,
			seekValue: seconds,
		}));
	};

	const onPause = () => {
		setPlayer((prev) => ({
			...prev,
			isPlaying: false,
		}));
	};

	const onPlay = () => {
		setPlayer((prev) => ({
			...prev,
			isPlaying: true,
		}));
	};

	const onVideoEnded = () => {
		if (player.isPlaying) {
			setPlayer((prev) => ({
				...prev,
				isPlaying: !player.isPlaying,
				progressValue: 0,
			}));
		}
	};

	const onVideoProgress = (state: OnProgressProps) => {
		if (state.played === 1) {
			setPlayer((prev) => ({
				...prev,
				progressValue: 0,
			}));
		} else {
			setPlayer((prev) => ({
				...prev,
				progressValue: state.played,
			}));
		}
	};

	const handleSetProgress = (value: number) => {
		playerRef.current.seekTo(value, "fraction");
		setPlayer((prev) => ({
			...prev,
			progressValue: value,
		}));
	};

	// const handleCommentSubmit = ()

	useEffect(() => {
		setVideoControls(user.videoControls);
		if (videoUrlFromDb) setVideoUrl(videoUrlFromDb);
		if (videoControls === "NOT_ALLOWED" && videoStateFromDatabase) {
			setPlayer((prev) => ({
				...prev,
				isPlaying: videoStateFromDatabase.isPlaying,
				volumeValue: videoStateFromDatabase.progressValue,
			}));
		}

		if (allMembers && allMembers.length >= 1) {
			setMembers([...allMembers]);
		}

		if (allComments && allComments.length >= 1) {
			setComments([...allComments]);
		}
	}, [user, videoStateFromDatabase, allMembers, allComments]);

	useEffect(() => {
		if (videoControls === "ALLOWED") {
			updateVideo({
				roomId: user.roomId,
				password: user.password,
				moderator: {
					username: user.username,
				},
				videoState: {
					seekValue: player.seekValue,
					isPlaying: player.isPlaying,
					progressValue: player.progressValue,
					volumeValue: player.volumeValue,
				},
			});
		}
	}, [
		player.isPlaying,
		player.seekValue,
		player.volumeValue,
		player.progressValue,
	]);

	return (
		<Grid style={{ height: "100vh", background: "#555555" }}>
			<Grid.Col span={12} style={{ height: "10%" }}>
				{/* Section 1 */}
				<div style={styles.roomDetails}>
					<Button variant="outline" rightIcon={<Copy value={user.roomId} />}>
						Copy Room Id
					</Button>
					<Button variant="outline" rightIcon={<Copy value={user.password} />}>
						Copy Password
					</Button>
				</div>
			</Grid.Col>
			<Grid.Col span={3} style={styles.membersColumn as React.CSSProperties}>
				{/* Section 2: Members */}
				{members &&
					members.map(({ moderator, _id }) => (
						<div key={_id}>
							<ActionIcon
								size={62}
								variant={moderator ? "gradient" : "default"}
								aria-label={moderator ? "The Moderator" : "The Invite"}
							>
								{moderator ? (
									<IconUserBolt style={styles.Icon30} />
								) : (
									<IconUser style={styles.Icon30} />
								)}
							</ActionIcon>
						</div>
					))}
			</Grid.Col>
			<Grid.Col span={6} style={styles.videoColumn}>
				{/* Section 3: Video Player */}
				<div>
					<AllPlayer
						controls
						ref={playerRef}
						playing={player.isPlaying}
						volume={player.volumeValue}
						onSeek={onSeek}
						onPause={onPause}
						onPlay={onPlay}
						onEnded={onVideoEnded}
						onProgress={onVideoProgress}
						onBuffer={() => setIsBuffering(true)}
						onBufferEnd={() => setIsBuffering(false)}
						onError={() => console.log("Error loading media")}
						url={videoUrl}
					/>
					<div style={styles.controlsContainer}>
						<div>
							<ActionIcon
								size={42}
								variant="default"
								aria-label="Toggle Play or Pause"
							>
								{!player.isPlaying ? (
									<IconPlayerPlay onClick={onPlay} style={styles.Icon24} />
								) : null}
								{player.isPlaying ? (
									<IconPlayerPause onClick={onPause} style={styles.Icon24} />
								) : null}
							</ActionIcon>
						</div>
						<div style={{ width: "400px" }}>
							<Slider
								min={0}
								max={0.9999}
								step={0.01}
								value={player.progressValue}
								onChangeEnd={(v) => handleSetProgress(v)}
							/>
						</div>
						<div>
							<ActionIcon
								size={42}
								variant="default"
								aria-label="Restart video"
							>
								<IconRefreshAlert
									onClick={() => handleSetProgress(0)}
									style={styles.Icon24}
								/>
							</ActionIcon>
						</div>
						<div>
							{videoControls === "NOT_ALLOWED" ? (
								<ActionIcon size={42} variant="default" aria-label="Sync video">
									<IconReload
										onClick={() => {
											if (videoStateFromDatabase) {
												handleSetProgress(videoStateFromDatabase.progressValue);
											}
										}}
										style={styles.Icon24}
									/>
								</ActionIcon>
							) : null}
						</div>
					</div>
					<div style={styles.commentContainer}>
						<Textarea
							value={newComment}
							onChange={(e) => setNewComment(e.currentTarget.value)}
							placeholder="Input placeholder"
							style={styles.textarea}
						/>
						<ActionIcon
							size={42}
							variant="default"
							aria-label="Submit Comment"
							style={styles.sendIcon}
							onClick={() => {
								addCommentMutation({
									comment: newComment,
									roomId: user.roomId,
									password: user.password,
									username: user.username,
								});
								setNewComment("");
							}}
						>
							<IconSend style={styles.sendIcon} />
						</ActionIcon>
					</div>
				</div>
			</Grid.Col>
			<Grid.Col span={3} style={styles.commentColumn as React.CSSProperties}>
				{/* Section 4 */}

				{comments &&
					comments.map(({ _id, comment, username }) => {
						return (
							<div key={_id} style={styles.comment}>
								<span>
									{comment} -- <span>{username}</span>
								</span>
							</div>
						);
					})}
			</Grid.Col>
		</Grid>
	);
};

const styles = {
	membersColumn: {
		display: "flex",
		flexDirection: "row",
		height: "90%",
		gap: "5px",
		background: "grey",
		borderRadius: "4px",
		paddingLeft: "15px",
	},
	videoColumn: {
		display: "flex",
		height: "90%",
		justifyContent: "center",
	},
	roomDetails: {
		display: "flex",
		marginTop: "5px",
		gap: "5px",
		justifyContent: "center",
	},
	commentColumn: {
		display: "flex",
		flexDirection: "column",
		height: "90%",
		gap: "5px",
		background: "grey",
		borderRadius: "4px",
		paddingRight: "15px",
	},
	comment: {
		display: "flex",
		width: "100%",
		color: "white",
		fontSize: "1rem",
	},
	videoControls: {
		display: "flex",
		alignItems: "center",
		marginTop: "5px",
		gap: "5px",
	},
	Icon30: {
		width: rem(30),
		height: rem(30),
	},
	Icon24: {
		width: rem(24),
		height: rem(24),
	},
	controlsContainer: {
		display: "flex",
		alignItems: "center",
		marginTop: "5px",
		gap: "5px",
	},
	commentContainer: {
		display: "flex",
		height: "60px",
		gap: "5px",
		alignItems: "center",
		borderRadius: "4px",
		paddingTop: "30px",
	},
	textarea: {
		width: "95%",
	},
	sendIcon: {
		width: rem(30),
		height: rem(30),
	},
};

export default VideoPlayer;
