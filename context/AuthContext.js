import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_URL, NEXT_API_URL } from "@/config/index";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const router = useRouter();

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    // Register user
    const register = async (user) => {
        const res = await fetch(`${NEXT_API_URL}/api/account/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        const data = await res.json();

        console.log(data);

        if (res.ok) {
            setUser(data.user);
            router.push("/account/dashboard");
        } else {
            setError(data.message);
            setError(null);
        }
    };

    // login user
    const login = async ({ email: identifier, password }) => {
        const res = await fetch(`${NEXT_API_URL}/api/account/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ identifier, password }),
        });

        const data = await res.json();

        console.log(data);

        if (res.ok) {
            setUser(data.user);
            router.push("/account/dashboard");
        } else {
            setError(data.message);
            setError(null);
        }
    };

    // logout
    const logout = async () => {
        const res = await fetch(`${NEXT_API_URL}/api/account/logout`, {
            method: "POST",
        });

        if (res.ok) {
            setUser(null);
            router.push("/");
        }
    };

    // check if user is logged in
    const checkUserLoggedIn = async (user) => {
        const res = await fetch(`${NEXT_API_URL}/api/account/user`);
        const data = await res.json();

        console.log("check login", data);

        if (res.ok) {
            setUser(data.user);
        } else {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
