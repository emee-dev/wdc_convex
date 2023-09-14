import {
	createStyles,
	Image,
	Container,
	Title,
	Button,
	Group,
	Text,
	List,
	ThemeIcon,
	rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import SvgImage from "../assets/image.svg";
import JoinRoom from "../components/JoinRoom";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
	inner: {
		display: "flex",
		justifyContent: "space-between",
		paddingTop: `calc(${theme.spacing.xl} * 4)`,
		paddingBottom: `calc(${theme.spacing.xl} * 4)`,
	},

	content: {
		maxWidth: rem(480),
		marginRight: `calc(${theme.spacing.xl} * 3)`,

		[theme.fn.smallerThan("md")]: {
			maxWidth: "100%",
			marginRight: 0,
		},
	},

	title: {
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		fontSize: rem(44),
		lineHeight: 1.2,
		fontWeight: 900,

		[theme.fn.smallerThan("xs")]: {
			fontSize: rem(28),
		},
	},

	control: {
		[theme.fn.smallerThan("xs")]: {
			flex: 1,
		},
	},

	image: {
		flex: 1,

		[theme.fn.smallerThan("md")]: {
			display: "none",
		},
	},

	highlight: {
		position: "relative",
		backgroundColor: theme.fn.variant({
			variant: "light",
			color: theme.primaryColor,
		}).background,
		borderRadius: theme.radius.sm,
		padding: `${rem(4)} ${rem(12)}`,
	},
}));

const HomePage = () => {
	const [open, setOpened] = useState(false);
	const { classes } = useStyles();

	const navigate = useNavigate();
	const handleNavigation = (path: string) => navigate({ pathname: path });

	const handleOpen = () => setOpened(true);
	const handleClose = () => setOpened(false);

	return (
		<div>
			<JoinRoom open={open} onClose={handleClose} />
			<Container>
				<div className={classes.inner}>
					<div className={classes.content}>
						<Title className={classes.title}>
							Stream <span className={classes.highlight}>Videos Live</span>
							with Friends
						</Title>
						<Text color="dimmed" mt="md">
							Experience the Future of Real-Time Video Sharing! Watch Together,
							Anywhere, Anytime. ❤️‍🔥
						</Text>

						<List
							mt={30}
							spacing="sm"
							size="sm"
							icon={
								<ThemeIcon size={20} radius="xl">
									<IconCheck size={rem(12)} stroke={1.5} />
								</ThemeIcon>
							}
						>
							<List.Item>
								<b>Seamless Synchronization</b> – Enjoy synchronized video
								playback with friends, no matter where they are. 🔄
							</List.Item>
							<List.Item>
								<b>Multi-Platform Support</b> – Share Videos from Any Source,
								and Watch Together with Friends! 📺📱💻
							</List.Item>
							<List.Item>
								<b>Interactive Chat</b> – Engage in real-time conversations
								while watching videos together. 💬
							</List.Item>
						</List>

						<Group mt={30}>
							<Button
								radius="xl"
								size="md"
								className={classes.control}
								onClick={() => handleNavigation("/create")}
							>
								Get started 🤞
							</Button>

							<Button
								radius="xl"
								size="md"
								variant="default"
								className={classes.control}
								onClick={handleOpen}
							>
								Join room 😊
							</Button>
						</Group>
					</div>
					<Image src={SvgImage} className={classes.image} />
				</div>
			</Container>
		</div>
	);
};

export default HomePage;
