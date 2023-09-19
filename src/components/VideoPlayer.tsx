import ReactPlayer, { YouTubeConfig } from "react-player/youtube";
import AllPlayer from "react-player";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { ActionIcon, Grid, Slider, Textarea, rem } from "@mantine/core";
import { api } from "../../convex/_generated/api";
import { OnProgressProps } from "react-player/base";
import { useAuth } from "../context/context";
import {
	IconReload,
	IconPlayerPlay,
	IconPlayerPause,
	IconRefreshAlert,
	IconUser,
	IconUserBolt,
} from "@tabler/icons-react";

const VideoPlayer = () => {
	let { user } = useAuth();

	const updateVideo = useMutation(api.db.updateVideo);

	const videoStateQuery = useQuery(api.db.getVideo, {
		roomId: user.roomId,
		password: user.password,
	});

	const allMembersQuery = useQuery(api.db.getAllMembers, {
		roomId: user.roomId,
	});

	const videoStateFromDatabase = videoStateQuery?.data[0]?.videoState;
	const videoUrlFromDb = videoStateQuery?.data[0]?.videoUrl;
	const allMembers = allMembersQuery?.data;

	const [videoControls, setVideoControls] =
		useState<typeof user.videoControls>("NOT_ALLOWED");

	const [isBuffering, setIsBuffering] = useState(true);
	const [videoUrl, setVideoUrl] = useState("/sample.mp4");
	const [members, setMembers] = useState<typeof allMembers>([]);
	const [player, setPlayer] = useState({
		seekValue: 0, // seek range [0, 1]
		isPlaying: false,
		volumeValue: 1, // volume range [0, 1]
		progressValue: 0, // progress range [0, 1]
	});

	const playerRef = useRef<any>(null);

	const onSeek = (seconds: number) =>
		setPlayer((prev) => {
			return {
				...prev,
				seekValue: seconds,
			};
		});

	const onPause = () => {
		setPlayer((prev) => {
			return {
				...prev,
				isPlaying: false,
			};
		});
		// handleSetProgress(videoStateFromDatabase.progressValue);
	};

	const onPlay = () => {
		setPlayer((prev) => {
			return {
				...prev,
				isPlaying: true,
			};
		});
		// handleSetProgress(videoStateFromDatabase.progressValue);
	};

	const onVideoEnded = () => {
		if (player.isPlaying) {
			setPlayer((prev) => {
				return {
					...prev,
					isPlaying: !player.isPlaying,
					progressValue: 0, // reset the slider
				};
			});
		}
	};

	const onVideoProgress = (state: OnProgressProps) => {
		if (state.played === 1) {
			// if the video has concluded
			setPlayer((prev) => {
				return {
					...prev,
					progressValue: 0, // reset the slider
				};
			});
		} else {
			setPlayer((prev) => {
				return {
					...prev,
					progressValue: state.played,
				};
			});
		}
	};

	const handleSetProgress = (value: number) => {
		playerRef.current.seekTo(value, "fraction");
		setPlayer((prev) => {
			return {
				...prev,
				progressValue: value,
			};
		});
	};

	useEffect(() => {
		setVideoControls(user.videoControls);
		if (videoUrlFromDb) setVideoUrl(videoUrlFromDb);
		if (videoControls === "NOT_ALLOWED" && videoStateFromDatabase) {
			setPlayer((prev) => {
				return {
					...prev,
					isPlaying: videoStateFromDatabase.isPlaying,
					volumeValue: videoStateFromDatabase.progressValue,
				};
			});
		}

		if (allMembers && allMembers.length >= 1) {
			setMembers([...allMembers]);
		}
	}, [user, videoStateFromDatabase, allMembers]);

	// Sync moderator with db
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
		<>
			<Grid style={{ height: "100vh", background: "#555555" }} grow>
				<Grid.Col span={12} style={{ height: "10%" }}>
					1
				</Grid.Col>
				<Grid.Col
					span={3}
					style={{
						display: "flex",
						flexDirection: "row",
						height: "90%",
						gap: "5px",
						background: "grey",
						borderRadius: "4px",
						paddingLeft: "15px",
					}}
				>
					{members &&
						members.map((item) => {
							if (item.moderator) {
								return (
									<div>
										<ActionIcon
											size={62}
											variant={"gradient"}
											aria-label="The Moderator"
										>
											<IconUserBolt
												style={{ width: rem(30), height: rem(30) }}
											/>
										</ActionIcon>
									</div>
								);
							}

							if (!item.moderator) {
								return (
									<div>
										<ActionIcon
											size={62}
											variant={"default"}
											aria-label="The Invite"
										>
											<IconUser style={{ width: rem(25), height: rem(25) }} />
										</ActionIcon>
									</div>
								);
							}
						})}
				</Grid.Col>
				<Grid.Col
					span={6}
					style={{
						display: "flex",
						height: "90%",
						justifyContent: "center",
					}}
				>
					3
					<div>
						<AllPlayer
							ref={playerRef}
							playing={player.isPlaying}
							volume={player.volumeValue}
							controls // rerender to show controls
							onSeek={onSeek}
							onPause={onPause}
							onPlay={onPlay}
							onEnded={onVideoEnded}
							onProgress={onVideoProgress}
							onBuffer={() => {
								setIsBuffering(true);
								console.log("Buffering");
							}}
							onBufferEnd={() => {
								setIsBuffering(false);
								console.log("Buffer ended");
							}}
							onError={() => console.log("Error loading media")}
							// url="/sample.mp4"
							url={videoUrl}
						/>

						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginTop: "5px",
								gap: "5px",
							}}
						>
							<div>
								<ActionIcon
									size={42}
									variant="default"
									aria-label="Toggle Play or Pause"
								>
									{!player.isPlaying ? (
										<IconPlayerPlay
											onClick={onPlay}
											style={{ width: rem(24), height: rem(24) }}
										/>
									) : null}
									{player.isPlaying ? (
										<IconPlayerPause
											onClick={onPause}
											style={{ width: rem(24), height: rem(24) }}
										/>
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
										style={{ width: rem(24), height: rem(24) }}
									/>
								</ActionIcon>
							</div>
							<div>
								{videoControls === "NOT_ALLOWED" ? (
									<ActionIcon
										size={42}
										variant="default"
										aria-label="Sync video"
									>
										<IconReload
											onClick={() => {
												if (videoStateFromDatabase) {
													handleSetProgress(
														videoStateFromDatabase.progressValue
													);
												}
											}}
											style={{ width: rem(24), height: rem(24) }}
										/>
									</ActionIcon>
								) : null}
							</div>
						</div>

						<div
							style={{
								display: "flex",
								height: "60px",
								gap: "5px",
								alignItems: "center",
								borderRadius: "4px",
								paddingTop: "30px",
							}}
						>
							<Textarea
								placeholder="Input placeholder"
								style={{ width: "95%" }}
							/>
							<ActionIcon
								size={42}
								variant="default"
								aria-label="The Moderator"
							>
								<IconUserBolt style={{ width: rem(30), height: rem(30) }} />
							</ActionIcon>
						</div>
					</div>
				</Grid.Col>
				<Grid.Col span={3} style={{ height: "90%", background: "yellow" }}>
					4
				</Grid.Col>
			</Grid>
		</>
	);
};

export default VideoPlayer;
