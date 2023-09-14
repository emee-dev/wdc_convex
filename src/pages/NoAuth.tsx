import {
	createStyles,
	Image,
	Container,
	Title,
	Text,
	Button,
	SimpleGrid,
	rem,
} from "@mantine/core";
import image from "../assets/otp.svg";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
	root: {
		paddingTop: rem(80),
		paddingBottom: rem(80),
	},

	title: {
		fontWeight: 900,
		fontSize: rem(34),
		marginBottom: theme.spacing.md,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,

		[theme.fn.smallerThan("sm")]: {
			fontSize: rem(32),
		},
	},

	control: {
		[theme.fn.smallerThan("sm")]: {
			width: "100%",
		},
	},

	mobileImage: {
		[theme.fn.largerThan("sm")]: {
			display: "none",
		},
	},

	desktopImage: {
		[theme.fn.smallerThan("sm")]: {
			display: "none",
		},
	},
}));

const NoAuth = () => {
	const { classes } = useStyles();

	const navigate = useNavigate();
	const handleNavigation = () => navigate({ pathname: "/ " });

	return (
		<Container className={classes.root}>
			<SimpleGrid
				spacing={80}
				cols={2}
				breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}
			>
				<Image src={image} className={classes.mobileImage} />
				<div>
					<Title className={classes.title}>You are not authorized...</Title>
					<Text color="dimmed" size="lg">
						Simply join a room, to continue in this amazing app
					</Text>
					<Button
						variant="outline"
						size="md"
						mt="xl"
						className={classes.control}
						onClick={handleNavigation}
					>
						Get back to home page
					</Button>
				</div>
				<Image src={image} className={classes.desktopImage} />
			</SimpleGrid>
		</Container>
	);
};

export default NoAuth;
