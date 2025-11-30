import React, {useCallback, useEffect, useState} from "react";
import type {User} from "@/types";
import {loggedUser} from "@/utils/LoggedUser.ts";
import type {LoginSchema} from "@/lib/schema.ts";
import {authApi} from "@/lib/api.ts";
import {isAxiosError} from "axios";
import {AuthContext, type AuthContextType, type LoginResult} from "@/context/AuthContext.ts";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const logout = useCallback(() => {
        loggedUser.removeUser();
        loggedUser.removeToken();
        loggedUser.removeRefreshToken();
        loggedUser.clearCache();
        setUser(null);
    }, []);

    useEffect(() => {
        try {
            const token = loggedUser.getToken();
            const userData = loggedUser.getUser();
            if (token && userData) {
                setUser(userData);
            }
        } catch (err) {
            console.error("Error hydrating user:", err);
            logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    const login = useCallback(async (credentials: LoginSchema): Promise<LoginResult> => {
        setErrorMessage(null);
        try {
            const result = await authApi.login({ email: credentials.email, password: credentials.password });
            // persist returned tokens/user
            loggedUser.setUser(result.user as User);

            loggedUser.setToken(result.token);
            loggedUser.setRefreshToken(result.refreshToken);
            setUser(result.user as User);

            return {
                success: true,
                user: result.user as User,
            };
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.code === "ERR_NETWORK") {
                    setErrorMessage(error.message);
                    return { success: false, error: error.message };
                }
                // try to read server msg or fallback
                if ((error.status as number) >= 500) {
                    const serverMessage = (error.response?.data)?.message ?? error.message;
                    setErrorMessage(serverMessage);
                    return { success: false, error: serverMessage };
                }
            }
            setErrorMessage("Email ou mot de passe incorrect");
            return { success: false, error: "Email ou mot de passe incorrect" };
        }
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
        loggedInError: errorMessage,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};