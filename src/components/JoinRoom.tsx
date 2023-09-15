import { Modal } from "rsuite";
import { Button, TextInput } from "@mantine/core";
import { FormEvent, useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/context";

type Prop = {
	open: boolean;
	onClose(): void;
};
const JoinRoom = ({ open, onClose }: Prop) => {
	// convex function
	const joinRoom = useMutation(api.db.inviteUser);

	const [roomId, setRoomId] = useState("12dscsc");
	const [username, setUsername] = useState("mmthjsl");
	const [password, setPassword] = useState("stringified");
	const [loading, setLoading] = useState(false);
	const [disable, setDisabled] = useState(false);
	const [btnMsg, setBtnMsg] = useState("Join Room");

	const navigate = useNavigate();
	const handleNavigation = (path: string) => navigate({ pathname: path });

	// const wait = (time: number) => {
	// 	return new Promise((resolve) => setTimeout(resolve, time));
	// };

	let { setUser } = useAuth();

	useEffect(() => {
		if (!roomId || !username || !password) {
			setBtnMsg("All fields are required");
			setDisabled(true);
		} else {
			setBtnMsg("Join Room");
			setDisabled(false);
		}
	}, [roomId, username, password]);

	const handleBtnClick = async () => {
		setLoading(true);
		let newInvite = await joinRoom({
			roomId,
			password,
			invited: {
				username,
				videoControls: "NOT_ALLOWED",
			},
			moderator: false,
		});

		if (!newInvite.status && newInvite.data.length === 0) {
			setLoading(false);
			setBtnMsg("Room does not exist");
			console.log(newInvite.error);
			console.log(newInvite.dbErr);
			return;
		}

		let data = newInvite.data[0];

		setUser({
			password,
			roomId: data.roomId,
			username: data.username,
			moderator: false,
			videoControl: "NOT_ALLOWED",
		});

		setLoading(false);
		setBtnMsg("Joining pls wait");
		handleNavigation("/room");
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
					value={password}
					onChange={(e: FormEvent<HTMLInputElement>) =>
						setPassword(e.currentTarget.value)
					}
					required
				/>

				<Button
					fullWidth
					mt="xl"
					onClick={handleBtnClick}
					loading={loading ? true : false}
					disabled={disable ? true : false}
				>
					{btnMsg}
				</Button>
			</Modal.Body>
		</Modal>
	);
};

export default JoinRoom;
