import {
	Paper,
	Title,
	Text,
	Container,
	MantineTheme,
	ActionIcon,
	CopyButton,
	TextInput,
	Tooltip,
	Button,
} from "@mantine/core";
import { Modal } from "rsuite";
import { FormEvent, useState, useEffect } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { generate } from "short-uuid";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { User } from "../context/context";

const Copy = ({ value = "" }) => {
	return (
		<CopyButton value={value} timeout={2000}>
			{({ copied, copy }) => (
				<Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
					<ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
						{copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
					</ActionIcon>
				</Tooltip>
			)}
		</CopyButton>
	);
};

const VideoLink = () => {
	// convex function
	const createRoom = useMutation(api.db.createRoom);

	const [videoControls, setVideoControls] = useState<"ALLOWED">("ALLOWED");
	const [open, setOpened] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [btnMsg, setBtnMsg] = useState("Create Room");

	const [videoUrl, setVideoUrl] = useState("");
	const [roomId, setRoomId] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [videoState, setVideoState] = useState({
		seekValue: 0,
		isPlaying: false,
		volumeValue: 1,
		progressValue: 0,
	});

	const handleOpen = () => setOpened(true);
	const handleClose = () => setOpened(false);

	useEffect(() => {
		const urlRegex =
			/^(https?|ftp):\/\/([^\s/$.?#].[^\s]*)\.([a-zA-Z]{2,}|localhost)(:[0-9]+)?([^\s]*)$/i;

		let errTest = !urlRegex.test(videoUrl);

		if (errTest) {
			setError("Please enter a valid url");
		} else {
			setError("");
		}
	}, [videoUrl]);

	// Generate values
	useEffect(() => {
		let roomId = generate().toString();
		let password = generate().toString();
		setRoomId(roomId);
		setPassword(password);
	}, []);

	const navigate = useNavigate();
	const handleNavigation = (path: string) => navigate({ pathname: path });

	const handleBtnClick = async () => {
		setLoading(true);
		setBtnMsg("Creating Room");
		let newRoom = await createRoom({
			roomId,
			videoUrl,
			password,
			videoState,
			moderator: {
				username,
				videoControls,
			},
		});

		if (!newRoom.status) {
			setLoading(false);
			setBtnMsg("Create Room");
			console.log(newRoom.error);
			console.log(newRoom.dbErr);
			return;
		}

		setLoading(false);
		setBtnMsg("Room was created");
		handleNavigation("/room");
		return;
	};

	return (
		<>
			<Modal open={open} onClose={handleClose}>
				<Modal.Header>
					<Modal.Title>ROOM DETAILS</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<TextInput
						label="Enter username"
						placeholder="Sukuna"
						value={username}
						onChange={(e: FormEvent<HTMLInputElement>) =>
							setUsername(e.currentTarget.value)
						}
						required
					/>
					<TextInput
						mt={10}
						label="Password"
						placeholder="Xxajnaikwss"
						value={password}
						onChange={(e: FormEvent<HTMLInputElement>) =>
							setPassword(e.currentTarget.value)
						}
						rightSection={<Copy value={password} />}
						required
					/>
					<TextInput
						mt={10}
						label="Room Id"
						placeholder="Skjachsocls"
						value={roomId}
						onChange={(e: FormEvent<HTMLInputElement>) =>
							setRoomId(e.currentTarget.value)
						}
						rightSection={<Copy value={roomId} />}
						required
					/>

					<Button
						fullWidth
						mt="xl"
						onClick={handleBtnClick}
						loading={loading ? true : false}
					>
						{btnMsg}
					</Button>
				</Modal.Body>
			</Modal>
			<Container size={420} my={40}>
				<Title
					align="center"
					sx={(theme: MantineTheme) => ({
						fontFamily: `Greycliff CF, ${theme.fontFamily}`,
						fontWeight: 900,
					})}
				>
					Welcome!
				</Title>
				<Text color="dimmed" size="sm" align="center" mt={5}>
					Share and watch live with ur friends
				</Text>

				<Paper withBorder shadow="md" p={30} mt={30} radius="md">
					<TextInput
						mt={10}
						label="Video Link"
						placeholder="https://youtu.be/"
						value={videoUrl}
						onChange={(e: FormEvent<HTMLInputElement>) => {
							let value = e.currentTarget.value;
							setVideoUrl(value);
						}}
						error={error ? error : ""}
						required
					/>

					<Button
						fullWidth
						mt="xl"
						disabled={error ? true : false}
						onClick={() => handleOpen()}
					>
						Proceed
					</Button>
				</Paper>
			</Container>
		</>
	);
};

export default VideoLink;
