import ReactPlayer, { YouTubeConfig } from "react-player/youtube";
import AllPlayer from "react-player";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { ActionIcon, Grid, Progress, Slider, rem } from "@mantine/core";
import { api } from "../../convex/_generated/api";
import { OnProgressProps } from "react-player/base";
import { useAuth } from "../context/context";
import {
	IconHeart,
	IconPlayerPlay,
	IconPlayerPause,
} from "@tabler/icons-react";

const VideoPlayer = () => {
	let { user } = useAuth();

	const updateVideo = useMutation(api.db.updateVideo);

	const videoStateSubscription = useQuery(api.db.getVideo, {
		roomId: user.roomId,
		password: user.password,
	});

	const videoStateFromDatabase = videoStateSubscription?.data[0]?.videoState;
	const videoUrlFromDb = videoStateSubscription?.data[0]?.videoUrl;

	const [videoControls, setVideoControls] =
		useState<typeof user.videoControls>("NOT_ALLOWED");
	const [volume, setVolume] = useState(0.7); // volume range [0, 1]
	const [playing, setPlaying] = useState(false); // playing range [0, 1]
	const [isBuffering, setIsBuffering] = useState(true);
	const [seek, setSeek] = useState(0); // seek range [0, 1]
	const [progress, setProgress] = useState(0); // progress range [0, 1]
	const [videoUrl, setVideoUrl] = useState("/sample.mp4");
	const [player, setPlayer] = useState({
		seekValue: 0,
		isPlaying: false,
		volumeValue: 1,
		progressValue: 0,
	});

	const playerRef = useRef<any>(null);

	const onSeek = (seconds: number) => setSeek(seconds);

	const onPause = () => {
		setPlaying(false);
	};

	const onPlay = () => {
		setPlaying(true);
	};

	const onVideoEnded = () => {
		if (playing) {
			setPlaying(!playing);
			setProgress(0); // reset the slider
		}
	};

	const onVideoProgress = (state: OnProgressProps) => {
		if (state.played === 1) {
			// if the video has concluded
			setProgress(0); // reset the slider
		} else {
			setProgress(state.played);
		}
	};

	const handleSetProgress = (value: number) => {
		playerRef.current.seekTo(value, "fraction");
		setProgress(value);
	};

	useEffect(() => {
		setVideoControls(user.videoControls);
		if (videoUrlFromDb) setVideoUrl(videoUrlFromDb);
		if (videoControls === "NOT_ALLOWED" && videoStateFromDatabase) {
			setPlaying(videoStateFromDatabase.isPlaying);

			handleSetProgress(videoStateFromDatabase.progressValue);

			setVolume(videoStateFromDatabase.volumeValue);
		}
	}, [user, videoStateFromDatabase]);

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
					seekValue: seek,
					isPlaying: playing,
					progressValue: progress,
					volumeValue: volume,
				},
			});
		}
	}, [playing, seek, volume, progress]);

	return (
		<>
			<Grid style={{ height: "100vh", background: "#555555" }} grow>
				<Grid.Col span={12} style={{ height: "10%" }}>
					1
				</Grid.Col>
				<Grid.Col span={3} style={{ height: "90%", background: "yellow" }}>
					2222
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
					<div
						style={{
							position: "relative",
						}}
					>
						<AllPlayer
							ref={playerRef}
							playing={playing}
							volume={volume}
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
									aria-label="ActionIcon with size as a number"
								>
									{!playing ? (
										<IconPlayerPlay
											onClick={onPlay}
											style={{ width: rem(24), height: rem(24) }}
										/>
									) : null}
									{playing ? (
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
									value={progress}
									onChangeEnd={(v) => handleSetProgress(v)}
								/>
							</div>
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
