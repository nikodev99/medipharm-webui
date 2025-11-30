"use client";

import React, { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** class applied to wrapper (optional) */
    wrapperClassName?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ wrapperClassName, className, ...props }, ref) => {
        const [show, setShow] = useState(false);

        return (
            <div className={cn("relative", wrapperClassName)}>
                {/* Add right padding so the button doesn't overlap text */}
                <Input
                    {...props}
                    ref={ref}
                    type={show ? "text" : "password"}
                    className={cn("pr-10", className)}
                    autoComplete={props.autoComplete ?? "current-password"}
                />

                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    title={show ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-2 flex items-center rounded-md p-1"
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";
