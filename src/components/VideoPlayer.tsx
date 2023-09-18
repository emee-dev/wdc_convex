// import ReactPlayer from "react-player/youtube";
import AllPlayer from "react-player";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { ActionIcon, Grid, Progress, Slider } from "@mantine/core";
import { api } from "../../convex/_generated/api";
import { OnProgressProps } from "react-player/base";
import { useAuth } from "../context/context";

const VideoPlayer = () => {
	let { user } = useAuth();

	const updateVideo = useMutation(api.db.updateVideo);

	const getVideo = useQuery(api.db.getVideo, {
		roomId: user.roomId,
		password: user.password,
	});

	const [videoControls, setVideoControls] =
		useState<typeof user.videoControls>("NOT_ALLOWED");
	const [volume, setVolume] = useState(0.7); // volume range [0, 1]
	const [playing, setPlaying] = useState(false); // playing range [0, 1]
	const [seek, setSeek] = useState(0); // seek range [0, 1]
	const [progress, setProgress] = useState(0); // progress range [0, 1]
	const [videoUrl, setVideoUrl] = useState("/sample.mp4");
	const [videoState, setVideoState] = useState({
		seekValue: 0,
		isPlaying: false,
		volumeValue: 1,
		progressValue: 0,
	});

	const playerRef = useRef<any>(null);
	// console.log(playerRef.current);

	const onSeek = (val: number) => {
		console.log("onSeek: ", val);
		setSeek(val);
	};

	const handlePause = () => {
		setPlaying(false);
		console.log("Paused video");
	};

	const handlePlay = () => {
		setPlaying(true);
		console.log("Playing video");
	};

	const handleVideoEnded = () => {
		if (playing) {
			setPlaying(!playing);
		}
		console.log("Video ended");
	};

	const handleVideoProgress = (state: OnProgressProps) => {
		setProgress(state.played * 100);
	};

	// set videoplayer control state based on user video control
	useEffect(() => {
		setVideoControls(user.videoControls);
	}, [user]);

	// Set videostate
	useEffect(() => {
		if (!getVideo || !getVideo.status || getVideo.data.length === 0) {
			console.log("video is not true");
		} else {
			let videoState = getVideo.data[0].videoState;
			let videoUrl = getVideo.data[0].videoUrl;

			setVideoUrl(videoUrl);
			setVideoState({ ...videoState });
		}
	}, [getVideo]);

	useEffect(() => {
		if (videoControls === "NOT_ALLOWED") {
			let lts = progress - 0.9;
			let grt = progress + 0.9;

			console.log({ less: lts, curr: progress, greater: grt });
			// then fetch db video and set state
		}

		if (videoControls === "ALLOWED") {
			// Then write db and set state
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
			<Grid style={{ height: "100vh" }}>
				<Grid.Col span={12} style={{ background: "red", height: "60px" }}>
					1
				</Grid.Col>
				<Grid.Col
					span={6}
					style={{
						height: "100%",
						placeItems: "center",
						padding: "5px 25px",
					}}
				>
					2
					<div
						style={{
							paddingTop: "53.25%",
							position: "relative",
							background: "transparent",
						}}
					>
						<AllPlayer
							ref={playerRef}
							playing={playing}
							volume={volume}
							controls={videoControls === "ALLOWED" ? true : false}
							onSeek={onSeek}
							onPause={handlePause}
							onPlay={handlePlay}
							onEnded={handleVideoEnded}
							onProgress={handleVideoProgress}
							onError={() => console.log("Error loading media")}
							// url="/sample.mp4"
							url={videoUrl}
							// width="100%"
							// height="100%"
							style={{
								position: "absolute",
								top: 0,
								left: 0,
							}}
						/>
					</div>
				</Grid.Col>
				<Grid.Col style={{ background: "yellow" }} span={6}>
					3
				</Grid.Col>
			</Grid>
		</>
	);
};

export default VideoPlayer;
