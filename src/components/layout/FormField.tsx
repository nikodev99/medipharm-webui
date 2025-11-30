"use client";

import React from "react";
import { type FieldValues, type Path, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    FormField as ShadcnFormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";
import {PasswordInput} from "@/components/ui/passwordInput.tsx";

// Define the structure for select/radio/checkbox options
export type Option = {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
};

// Props interface with proper generic typing for type safety
export interface FormFieldProps<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    label?: string;
    type?:
        | "text"
        | "email"
        | "number"
        | "password"
        | "date"
        | "time"
        | "datetime-local"
        | "url"
        | "tel"
        | "textarea"
        | "select"
        | "radio"
        | "checkbox";
    placeholder?: string;
    disabled?: boolean;
    options?: Option[];
    rows?: number;
    className?: string;
    description?: string;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * A flexible form field component that integrates with react-hook-form and shadcn/ui.
 * This component handles multiple input types with a unified interface while maintaining
 * full type safety through generics.
 */
export function FormField<TFieldValues extends FieldValues>(
    {name, label, type = "text", placeholder, disabled = false, options = [], rows = 4, className, description, onKeyDown}: FormFieldProps<TFieldValues>
) {
    // Access the form context provided by react-hook-form's FormProvider
    const form = useFormContext<TFieldValues>();

    return (
        <ShadcnFormField
            control={form.control}
            name={name}
            render={({ field, fieldState }) => {
                // Determine if this field has validation errors
                const hasError = !!fieldState.error;

                // Render textarea field
                if (type === "textarea") {
                    return (
                        <FormItem className={className}>
                            {label && <FormLabel>{label}</FormLabel>}
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    rows={rows}
                                />
                            </FormControl>
                            {description && !hasError && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                            {hasError && (
                                <p className="text-sm font-medium text-destructive">
                                    {fieldState.error?.message}
                                </p>
                            )}
                        </FormItem>
                    );
                }

                // Render select field
                if (type === "select") {
                    return (
                        <FormItem className={className}>
                            {label && <FormLabel>{label}</FormLabel>}
                            <Select
                                value={field.value ? String(field.value) : ""}
                                onValueChange={(value) => {
                                    // Convert the value back to its original type if needed
                                    const option = options.find(opt => String(opt.value) === value);
                                    field.onChange(option?.value ?? value);
                                }}
                                disabled={disabled}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={placeholder ?? "Select an option..."} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {options.map((opt) => (
                                        <SelectItem
                                            key={String(opt.value)}
                                            value={String(opt.value)}
                                            disabled={opt.disabled}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {description && !hasError && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                            {hasError && (
                                <p className="text-sm font-medium text-destructive">
                                    {fieldState.error?.message}
                                </p>
                            )}
                        </FormItem>
                    );
                }

                // Render radio group field
                if (type === "radio") {
                    return (
                        <FormItem className={className}>
                            {label && <FormLabel>{label}</FormLabel>}
                            <FormControl>
                                <RadioGroup
                                    value={field.value ? String(field.value) : ""}
                                    onValueChange={(value) => {
                                        // Preserve the original type of the value
                                        const option = options.find(opt => String(opt.value) === value);
                                        field.onChange(option?.value ?? value);
                                    }}
                                    disabled={disabled}
                                    className="flex flex-col space-y-2"
                                >
                                    {options.map((opt) => (
                                        <div key={String(opt.value)} className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={String(opt.value)}
                                                id={`${String(name)}-${String(opt.value)}`}
                                                disabled={disabled || opt.disabled}
                                            />
                                            <Label
                                                htmlFor={`${String(name)}-${String(opt.value)}`}
                                                className="cursor-pointer font-normal"
                                            >
                                                {opt.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            {description && !hasError && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                            {hasError && (
                                <p className="text-sm font-medium text-destructive">
                                    {fieldState.error?.message}
                                </p>
                            )}
                        </FormItem>
                    );
                }

                // Render checkbox group (multiple selections)
                if (type === "checkbox" && options.length > 0) {
                    return (
                        <FormItem className={className}>
                            {label && <FormLabel>{label}</FormLabel>}
                            <div className="space-y-2">
                                {options.map((opt) => {
                                    // Handle checkbox groups with array of selected values
                                    const selectedValues = Array.isArray(field.value) ? field.value : [];
                                    const isChecked = selectedValues.some(
                                        (v: unknown) => String(v) === String(opt.value)
                                    );

                                    return (
                                        <FormItem
                                            key={String(opt.value)}
                                            className="flex flex-row items-start space-x-2 space-y-0"
                                        >
                                            <FormControl>
                                                <Checkbox
                                                    checked={isChecked}
                                                    disabled={disabled || opt.disabled}
                                                    onCheckedChange={(checked) => {
                                                        // Add or remove from the array based on checked state
                                                        const updatedValues = checked
                                                            ? [...selectedValues, opt.value]
                                                            : selectedValues.filter(
                                                                (v: unknown) => String(v) !== String(opt.value)
                                                            );
                                                        field.onChange(updatedValues);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                {opt.label}
                                            </FormLabel>
                                        </FormItem>
                                    );
                                })}
                            </div>
                            {description && !hasError && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                            {hasError && (
                                <p className="text-sm font-medium text-destructive">
                                    {fieldState.error?.message}
                                </p>
                            )}
                        </FormItem>
                    );
                }

                // Render a single checkbox field
                if (type === "checkbox") {
                    return (
                        <FormItem className={`flex flex-row items-start space-x-2 space-y-0 ${className}`}>
                            <FormControl>
                                <Checkbox
                                    checked={!!field.value}
                                    disabled={disabled}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                {label && <FormLabel className="cursor-pointer">{label}</FormLabel>}
                                {description && !hasError && (
                                    <p className="text-sm text-muted-foreground">{description}</p>
                                )}
                                {hasError && (
                                    <p className="text-sm font-medium text-destructive">
                                        {fieldState.error?.message}
                                    </p>
                                )}
                            </div>
                        </FormItem>
                    );
                }

                // Render default input field (text, email, number, password, etc.)
                return (
                    <FormItem className={className}>
                        {label && <FormLabel>{label}</FormLabel>}
                        <FormControl className="grid gap-2">
                            {type === 'password' ? (
                                <PasswordInput
                                    {...field}
                                    value={field.value ?? ""}
                                    type='password'
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    onKeyDown={onKeyDown}
                                    onBlur={field.onBlur}
                                />
                            ) : (
                                <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    type={type}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    onKeyDown={onKeyDown}
                                />
                            )}
                        </FormControl>
                        {description && !hasError && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                        {hasError && (
                            <p className="text-sm font-medium text-destructive">
                                {fieldState.error?.message}
                            </p>
                        )}
                    </FormItem>
                );
            }}
        />
    );
}