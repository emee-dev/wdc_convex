// import ReactPlayer from "react-player/youtube";
import AllPlayer from "react-player";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
// import { Slider } from "rsuite";
import { ActionIcon, Grid, Progress, SimpleGrid, Slider } from "@mantine/core";
// import {
// 	IconSettings,
// 	IconPlayerPause,
// 	IconPlayerPlay,
// } from "@tabler/icons-react";
import { OnProgressProps } from "react-player/base";
import { useAuth } from "../context/context";

const VideoPlayer = () => {
	// const updateVideo = useMutation(api.db.updateVideo);

	// updateVideo({

	// })

	let { user } = useAuth();

	// useEffect(() => {
	// 	setUser((v) => {
	// 		return {
	// 			...v,
	// 			roomId: "123evv",
	// 			username: "llaop",
	// 			moderator: true,
	// 			videoControl: "NOT_ALLOWED",
	// 		};
	// 	});
	// }, []);

	console.log(user);

	const [volume, setVolume] = useState(0.7); // volume range [0, 1]
	const [playing, setPlaying] = useState(false); // playing range [0, 1]
	const [seek, setSeek] = useState(0); // seek range [0, 1]
	const [progress, setProgress] = useState(0); // progress range [0, 1]

	const playerRef = useRef<any>(null);

	const onSeek = (val: number) => console.log("onSeek: ", val);

	const handlePause = () => {
		setPlaying(false);
		console.log("Paused video");
	};

	const handlePlay = () => {
		setPlaying(true);
		console.log("Playing video");
	};

	const togglePlay = () => setPlaying(!playing);

	const handleVolumeChange = (volume: number) => {
		let value = volume / 100;
		return setVolume(value);
	};

	const handleSeekChange = (val: number) => {
		let value = val / 100;

		if (playerRef.current) {
			setSeek(value);
			playerRef.current.seekTo(value);
		}
	};

	const handleVideoEnded = () => {
		if (playing) {
			setPlaying(!playing);
		}
		console.log("video ended");
	};

	const handleVideoProgress = (state: OnProgressProps) => {
		setProgress(state.played * 100);
	};

	return (
		<>
			<Grid style={{ height: "100vh" }}>
				<Grid.Col span={12} style={{ background: "red", height: "60px" }}>
					1
				</Grid.Col>
				<Grid.Col
					span={8}
					style={{
						height: "100%",
						placeItems: "center",
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
							controls={!false}
							onSeek={onSeek}
							onPause={handlePause}
							onPlay={handlePlay}
							onEnded={handleVideoEnded}
							onProgress={handleVideoProgress}
							onError={() => console.log("Error loading media")}
							// url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
							url="/sample.mp4"
							width="100%"
							height="100%"
							style={{
								position: "absolute",
								top: 0,
								left: 0,
							}}
						/>
					</div>
				</Grid.Col>
				<Grid.Col style={{ background: "yellow" }} span={4}>
					3
				</Grid.Col>
			</Grid>
		</>
	);
};

export default VideoPlayer;
