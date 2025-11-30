// src/hooks/useAuth.ts
"use client";

import { useContext } from "react";
import {AuthContext, type AuthContextType} from "@/context/AuthContext.ts";


export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return ctx;
}
