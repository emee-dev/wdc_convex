import { Modal } from "rsuite";
import { Button } from "@mantine/core";

import { ActionIcon, CopyButton, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { FormEvent, useState, useEffect } from "react";
import { generate } from "short-uuid";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import "./CreateRoom.css";

type Prop = {
	open: boolean;
	onClose(): void;
	videoUrl: string;
};
const ModalComponent = ({ open, videoUrl, onClose }: Prop) => {
	const [roomId, setRoomId] = useState("");
	const [username, setUsername] = useState("");
	const [passPhrase, setPassPhrase] = useState("");
	const [loading, setLoading] = useState(false);
	const [btnMsg, setBtnMsg] = useState("Create Room");
	const [videoState, setVideoState] = useState({
		seekValue: 0,
		isPlaying: false,
		volumeValue: 1,
	});

	// convex
	const createRoom = useMutation(api.db.createRoom);

	const handleBtnClick = async () => {
		// let newRoom = await createRoom({
		// 	roomId,
		// 	videoUrl,
		// 	passPhrase,
		// 	videoState,
		// 	moderator: {
		// 		username,
		// 		videoControls: "ALLOWED",
		// 	},
		// });

		setLoading(true);
		setBtnMsg("Creating Room");

		// if (!newRoom.status) {
		// 	console.log(newRoom.error);
		// 	console.log(newRoom.dbErr);
		// 	return;
		// }
	};

	// Generate temp values
	useEffect(() => {
		let roomId = generate().toString();
		let passPhrase = generate().toString();
		setRoomId(roomId);
		setPassPhrase(passPhrase);
	}, []);

	useEffect(() => {
		console.log("Each time it changes", passPhrase);
	}, [passPhrase]);

	return (
		<Modal open={open} onClose={() => onClose()}>
			<Modal.Header>
				<Modal.Title>ROOM DETAILS</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{/* <Placeholder.Paragraph rows={80} /> */}

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
					value={passPhrase}
					onChange={(e: FormEvent<HTMLInputElement>) =>
						setPassPhrase(e.currentTarget.value)
					}
					rightSection={<Copy value={passPhrase} />}
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
			{/* <Modal.Footer></Modal.Footer> */}
		</Modal>
	);
};

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

export default ModalComponent;
