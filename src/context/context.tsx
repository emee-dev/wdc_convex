import React, { createContext, useContext, ReactNode, useState } from "react";

type User = {
	roomId: string;
	username: string;
	password: string;
	videoControl: "ALLOWED" | "NOT_ALLOWED";
	moderator: boolean;
};

type ContextProp<T> = {
	user: T;
	setUser: React.Dispatch<React.SetStateAction<T>>;
};

const AuthContext = createContext<ContextProp<User> | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User>({
		roomId: "",
		username: "",
		password: "",
		moderator: false,
		videoControl: "NOT_ALLOWED",
	});

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	let context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	let key = "user";

	let data: User | null = JSON.parse(localStorage.getItem(key)!);

	const setUser = (value: User) => {
		localStorage.setItem(key, JSON.stringify(value));
		context?.setUser((prev) => {
			return {
				...prev,
				value,
			};
		});
	};

	return { user: data, setUser };
}
