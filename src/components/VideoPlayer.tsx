// import ReactPlayer from "react-player/youtube";
import AllPlayer from "react-player";
import { useState, useRef, FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import "./VideoPlayer.css";

const VideoPlayer = () => {
	
	// const getRoom = useQuery(api.shared.getRoom, {});
	// const updateVideo = useMutation(api.shared.updateVideo);

	const [volume, setVolume] = useState(0); // volume range [0, 1]
	const [playing, setPlaying] = useState(false); // volume range [0, 1]
	const [seek, setSeek] = useState(0); // volume range [0, 1]

	const playerRef = useRef<any>(null);

	const onSeek = (val: number) => console.log("onSeek: ", val);
	const handlePause = () => console.log("Paused");
	const handlePlay = () => console.log("Played");

	const togglePlay = () => setPlaying(!playing);
	const handleVolumeChange = (e: FormEvent<HTMLInputElement>) => {
		return setVolume(parseInt(e.currentTarget.value));
	};

	const handleSeekChange = (e: FormEvent<HTMLInputElement>) => {
		let value = e.currentTarget.value;

		if (playerRef.current) {
			setSeek(parseInt(value));
			playerRef.current.seekTo(value);
		}
	};

	return (
		<>
			<div className="vWrapper">
				<div className="header"></div>
				<div className="content">
					<p>The video is here</p>
					<div className="player">
						<AllPlayer
							ref={playerRef}
							playing={playing}
							volume={volume}
							controls={false}
							onSeek={onSeek}
							onPause={handlePause}
							onPlay={handlePlay}
							// url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
							url="/sample.mp4"
						/>
					</div>
					<div className="users">
						<div>
							<p>Seek: </p>
							<input
								type="range"
								min={0}
								max={0.999999}
								step="any"
								// value={8.294504}
								onChange={handleSeekChange}
								// onMouseUp={handleSeekChange}
							/>
						</div>
						<div>
							<p>Volume: </p>
							<input
								type="range"
								min={0}
								max={1}
								step="any"
								onMouseUp={handleVolumeChange}
							/>
						</div>
						<button onClick={togglePlay}>Pause and Play</button>
					</div>
				</div>

				{/* <ReactPlayer
					controls={false}
					// config={config}
					// url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
					url="../../public/Boruto.mp4" /> 
				*/}
			</div>
		</>
	);
};

export default VideoPlayer;
