import { Modal } from "rsuite";
import { Button } from "@mantine/core";

import { ActionIcon, CopyButton, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

type Prop = {
	open: boolean;
	onClose(): void;
};
const JoinRoom = ({ open, onClose }: Prop) => {
	const [roomId, setRoomId] = useState("");
	const [username, setUsername] = useState("");
	const [passPhrase, setPassPhrase] = useState("");
	const [loading, setLoading] = useState(false);
	const [btnMsg, setBtnMsg] = useState("Join Room");

	const navigate = useNavigate();
	const handleNavigation = () => navigate({ pathname: "/room" });

	// convex function
	const joinRoom = useMutation(api.db.inviteUser);

	// const wait = (time: number) => {
	// 	return new Promise((resolve) => setTimeout(resolve, time));
	// };

	const handleBtnClick = async () => {
		setLoading(true);
		let newInvite = await joinRoom({
			roomId,
			passPhrase,
			invited: {
				username,
				videoControls: "NOT_ALLOWED",
			},
		});

		if (!newInvite.status) {
			setLoading(false);
			setBtnMsg("Error Joining room");
			console.log(newInvite.error);
			console.log(newInvite.dbErr);
			return;
		}

		// await wait(3000);

		setLoading(false);
		setBtnMsg("Joining pls wait");
		handleNavigation();
		return;
	};

	return (
		<Modal open={open} onClose={() => onClose()}>
			<Modal.Header>
				<Modal.Title>Join Room</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<TextInput
					mt={10}
					label="Room Id"
					placeholder="Bmsnyyaoo"
					value={roomId}
					onChange={(e: FormEvent<HTMLInputElement>) =>
						setRoomId(e.currentTarget.value)
					}
					required
				/>
				<TextInput
					mt={10}
					label="Username"
					placeholder="Gojo"
					value={username}
					onChange={(e: FormEvent<HTMLInputElement>) =>
						setUsername(e.currentTarget.value)
					}
					required
				/>
				<TextInput
					mt={10}
					label="Room Password"
					placeholder="Uisllcoos"
					value={passPhrase}
					onChange={(e: FormEvent<HTMLInputElement>) =>
						setPassPhrase(e.currentTarget.value)
					}
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
	);
};

export default JoinRoom;
