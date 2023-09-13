import {
	// Loader,
	Paper,
	Title,
	Text,
	Container,
	Button,
	MantineTheme,
	TextInput,
	Anchor,
} from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
// import { IconCopy, IconCheck } from "@tabler/icons-react";
import CreateRoom from "./CreateRoom";

const VideoLink = () => {
	// const createRoom = useMutation(api.shared.createRoom);

	// // createRoom({})

	const [videoUrl, setVideoUrl] = useState("");
	const [open, setOpened] = useState(false);
	const [error, setError] = useState("");

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

	return (
		<>
			<CreateRoom open={open} videoUrl={videoUrl} onClose={handleClose} />
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
