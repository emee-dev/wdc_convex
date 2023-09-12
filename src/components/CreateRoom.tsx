import {
	Input,
	// Loader,
	ActionIcon,
	Tooltip,
	CopyButton,
	Checkbox,
	Anchor,
	Paper,
	Title,
	Text,
	Container,
	Group,
	Button,
	MantineTheme,
	Portal,
	TextInput,
	createStyles,
} from "@mantine/core";
import { FormEvent, useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import ModalComponent from "./ShareModal";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import "./CreateRoom.css";

/**
 * To be able to share a video and watch it with others
 * 1. A youtube video link
 * 2. A Room Key or Pass Code
 * 3. A Username
 *
 * To be able to join a room you need a
 * 1. A Room Key or Pass Code
 * 2. A Username
 */

const useStyles = createStyles((theme) => ({
	modal: {
		right: 10,
		background: "red",
		height: "10px",
	},
}));

const ShareLink = () => {
	// const createRoom = useMutation(api.shared.createRoom);

	// // createRoom({})

	const [url, setUrl] = useState("");
	const [open, setOpened] = useState(false);

	const { classes } = useStyles();
	const handleOpen = () => setOpened(true);
	const handleClose = () => setOpened(false);

	return (
		<>
			<ModalComponent open={open} onClose={handleClose} />
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
						mt={5}
						label="Video Link"
						placeholder="https://youtu.be/R2OQnIg1Ya4?si=HlfEHDCq9H4PC14G"
						value={url}
						onChange={(e: FormEvent<HTMLInputElement>) =>
							setUrl(e.currentTarget.value)
						}
						required
					/>

					<Button fullWidth mt="xl" onClick={() => handleOpen()}>
						Generate
					</Button>
				</Paper>
			</Container>
		</>
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

export default ShareLink;
