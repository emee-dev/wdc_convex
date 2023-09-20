import { Modal } from "rsuite";
import { Button, TextInput } from "@mantine/core";
import { FormEvent, useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/context";

type Prop = {
	open: boolean;
	onClose(): void;
};
const Login = ({ open, onClose }: Prop) => {
	// convex function
	const loginMutation = useMutation(api.db.login);
	let { setUser } = useAuth();

	const [roomId, setRoomId] = useState("sL6NmWWjS34bmS2j9fRWTT");
	const [username, setUsername] = useState("Gojo");
	const [password, setPassword] = useState("6cJWYwzzbtzNy76yHkm4yF");
	const [loading, setLoading] = useState(false);
	const [disable, setDisabled] = useState(false);
	const [btnMsg, setBtnMsg] = useState("Join Room");

	const navigate = useNavigate();
	const handleNavigation = (path: string) => navigate({ pathname: path });

	useEffect(() => {
		if (!roomId || !username) {
			setBtnMsg("All fields are required");
			setDisabled(true);
		} else {
			setBtnMsg("Join Room");
			setDisabled(false);
		}
	}, [roomId, username]);

	const handleBtnClick = async () => {
		setLoading(true);
		let login = await loginMutation({
			roomId,
			username,
			password,
		});

		if (!login.status || login.data.length === 0) {
			setLoading(false);
			setDisabled(false);
			setBtnMsg("Click to continue");
			console.log(login.error);
			console.log(login.dbErr);
			return;
		}

		let data = login.data[0];
		console.log("Data", data);

		setUser({
			password,
			roomId: data.roomId,
			username: data.username,
			moderator: data.moderator,
			videoControls: data.videoControls,
		});

		setLoading(false);
		setDisabled(false);
		setBtnMsg("Pls wait");
		handleNavigation("/room");
		return;
	};

	return (
		<Modal open={open} onClose={() => onClose()}>
			<Modal.Header>
				<Modal.Title>Login now ❤️‍🔥</Modal.Title>
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

export default Login;
