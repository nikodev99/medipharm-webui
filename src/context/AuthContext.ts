import {createContext} from "react";
import type {User} from "@/types";
import type {LoginSchema} from "@/lib/schema.ts";

export interface LoginResult {
    success: boolean;
    error?: string;
    user?: User;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (credentials: LoginSchema) => Promise<LoginResult>;
    logout: () => void;
    loading: boolean;
    loggedInError: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);