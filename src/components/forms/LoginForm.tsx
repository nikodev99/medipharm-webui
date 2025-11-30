import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Form, FormItem} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type LoginSchema, loginSchema} from "@/lib/schema.ts";
import {FormField} from "@/components/layout/FormField.tsx";
import {useAuth} from "@/hooks/useAuth.ts";
import React, {useState} from "react";
import {Message} from "@/components/layout/Message.tsx";
import {AlertCircleIcon} from "lucide-react";
import {useQueryPost} from "@/hooks/useQueryPost.ts";
import {Spinner} from "@/components/ui/spinner.tsx";

export const LoginForm = () => {
    const [messages, setMessages] = useState<{success?: string, error?: string}>({
        success: undefined,
        error: undefined
    })

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const {login} = useAuth()

    const {mutate, isPending} = useQueryPost(loginSchema)

    const handleClickSubmit = (data: LoginSchema) => {
        setMessages({success: undefined, error: undefined})
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        mutate({postFn: login, data: data}, {
            onSuccess: response => {
                if (response && typeof response === 'object' && 'error' in response) {
                    setMessages({error: response?.error as string})
                }
            },
            onError: (error) => {
                setMessages({error: error.message})
                console.error('ERROR ENCOUNTERED: ', error)
            },
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            onSubmit().then()
        }
    }

    const onSubmit = () => form.handleSubmit(handleClickSubmit)()

    return(
        <div className="flex flex-col items-center pt-30">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className='text-center'>Connecter vous</CardTitle>
                    <CardDescription>
                        <img src="/medipharm.png" alt="Logo" width={100} height={100} className="mx-auto" />
                        <h1 className='text-center font-bold font-4xl'>Medipharm</h1>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        {messages && messages.error && <Message
                            title='Connection Impossible'
                            message={messages?.error}
                            variant='destructive'
                            icon={<AlertCircleIcon/>}
                        />}
                        {isPending && <div className="flex items-center gap-4">
                            <Spinner />
                        </div>}
                        <Form {...form}>
                            <FormField
                                name='email'
                                type='email'
                                placeholder='email@exmaple.com'
                                label='Email'
                                onKeyDown={handleKeyDown}
                            />
                            <FormField
                                name='password'
                                type='password'
                                placeholder='********'
                                label='Mot de passe'
                                onKeyDown={handleKeyDown}
                            />
                            <FormItem>
                                <Button
                                    type='submit'
                                    className="w-full cursor-pointer"
                                    onClick={() => form.handleSubmit(onSubmit)()}
                                >
                                    Se connecter
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
