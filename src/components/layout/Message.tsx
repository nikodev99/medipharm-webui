import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {type ReactNode, useMemo} from "react";

export interface AlertMessageProps {
    icon?: ReactNode
    title?: ReactNode
    message: ReactNode | string[]
    variant?: 'default' | 'destructive'
}

export const Message = ({icon, title, message, variant = 'default'}: AlertMessageProps) => {
    const showMessage: ReactNode = useMemo(() => {
        if (Array.isArray(message)) {
            return <ul className="list-inside list-disc text-sm">
                {message?.map(m => (
                    <li>{m}</li>
                ))}
            </ul>
        }
        return message
    }, [message])

    return (
        <div className="grid w-full max-w-xl items-start gap-4">
            <Alert variant={variant}>
                {icon}
                {title && <AlertTitle>{title}</AlertTitle>}
                <AlertDescription>
                    {showMessage}
                </AlertDescription>
            </Alert>
        </div>
    )
}