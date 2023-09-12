import { Modal } from "rsuite";
import { ActionIcon, CopyButton, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import { FormEvent } from "react";
import { generate } from "short-uuid";

type Prop = {
	open: boolean;
	onClose(): void;
};
const ModalComponent = ({ open, onClose }: Prop) => {
	const [passPhrase, setpassPhrase] = useState("");
	const [userName, setUsername] = useState("");

	return (
		<Modal open={open} onClose={() => onClose()}>
			<Modal.Header>
				<Modal.Title>ROOM DETAILS</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{/* <Placeholder.Paragraph rows={80} /> */}

				<TextInput
					label="Pick a username"
					placeholder="Sukuna"
					value={userName}
					onChange={(e: FormEvent<HTMLInputElement>) =>
						setUsername(e.currentTarget.value)
					}
					required
				/>
				<TextInput
					mt={5}
					label="Pass phrase"
					placeholder="xxajnaikw,"
					value={passPhrase}
					onChange={(e: FormEvent<HTMLInputElement>) =>
						setpassPhrase(e.currentTarget.value)
					}
					rightSection={<Copy value={passPhrase} />}
					required
				/>
			</Modal.Body>
			<Modal.Footer></Modal.Footer>
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
