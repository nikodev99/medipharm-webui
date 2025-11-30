import {AxiosError, type AxiosResponse, isAxiosError} from "axios";
import {useMutation, type UseMutationOptions} from "@tanstack/react-query";
import {z} from "zod";
import {useState} from "react";

export type ReturnType<T extends object | boolean> = Promise<{
    success: boolean;
    data?: T;
    error?: unknown
    status?: number;
    code?: string
}>

export interface ResponseRepo<T> {
    isSuccess: boolean
    isLoading?: boolean
    error?: string
    success?: string
    data?: T[] | T
}

export type InsertReturnType<TData extends object | boolean> = ReturnType<TData>

type InsertFunction<TData, TReturn extends object | boolean, TParams extends readonly unknown[] = []> = {
    insert: (data: TData, params: TParams) => InsertReturnType<TReturn>
}

type UseQueryReturn <
    TReturn extends object | boolean,
> = {
    result?: TReturn,
    error?: unknown,
    isLoading?: boolean,
    isError?: boolean,
    failureReason?: AxiosError | null
}

export type PostFunction<TData, TParams extends readonly unknown[] = []> = (data: TData, ...params: TParams) => Promise<AxiosResponse<TData>>

export type MutationPostVariables<TData, TParams extends readonly unknown[]> = {
    postFn: PostFunction<TData, TParams>;
    data: TData;
} & (
    TParams extends readonly [] ? {params?: never} : {params: TParams}
    )

export type UseQueryOptions<TData, TParams extends readonly unknown[] = []> = Omit<
    UseMutationOptions<
        AxiosResponse<TData>,
        AxiosError,
        MutationPostVariables<TData, TParams>
    >, "mutationFn">

export type UseInsertReturn<
    TData,
    TReturn extends object | boolean,
    TParams extends readonly unknown[] = []
> = UseQueryReturn<TReturn> & InsertFunction<TData, TReturn, TParams>


/**
 * A flexible hook for POST mutations that validates data with Zod schemas
 * and supports functions with varying parameter signatures.
 *
 * Key features:
 * - Validates data against Zod schema before sending
 * - Supports functions with no additional params: (data) => Promise<Response>
 * - Supports functions with params: (data, ...params) => Promise<Response>
 * - Type-safe parameter handling with full TypeScript inference
 *
 * @param schema - Zod schema for validating the data
 * @param options - Additional options for the mutation (excluding mutationFn)
 */
export const useQueryPost = <TData, TParams extends readonly unknown[] = []>(
    schema: z.ZodSchema<TData>,
    options?: UseQueryOptions<TData, TParams>
) => {
    return useMutation<AxiosResponse<TData>, AxiosError, MutationPostVariables<TData, TParams>>({
        mutationFn: async ({postFn, data, params}) => {
            const validate = schema.safeParse(data)
            console.log({data, validate})
            if (!validate.success) {
                throw new AxiosError(
                    `Donnée non valide: \n${JSON.stringify(validate.error)}.`,
                    'VALIDATION_ERROR'
                )
            }
            if (params === undefined) {
                return (postFn as unknown as PostFunction<TData, []>)(validate.data)
            }
            return postFn(validate.data, ...params as never)
        },
        ...options,
    })
}

export const usePost = async <TData, TParams extends readonly unknown[] = []>(
    postFn: PostFunction<TData, TParams>,
    data: TData,
    params: TParams
): Promise<ResponseRepo<TData>> => {
    try {
        const resp: AxiosResponse<TData> = await postFn(data, ...params)
        if (resp.status !== 200) {
            return {
                isSuccess: false,
                error: `Error ${resp.status}: ${resp.statusText} - ${resp.data}`
            }
        }
        return {
            isSuccess: true,
            data: resp.data
        }

    }catch (error: unknown) {
        return ErrorCatch(error)
    }
}

export const useInsert = <
    TData,
    TReturn extends object | boolean,
    TParams extends readonly unknown[] = []
>(schema: z.ZodSchema, func: PostFunction<TData, TParams>, options?: UseQueryOptions<TData, TParams>): UseInsertReturn<TData, TReturn, TParams> => {
    const { mutate, isError, failureReason, isPending, isPaused } = useQueryPost(schema, options as never);
    const [result, setResult] = useState<TReturn | undefined>(undefined);
    const [error, setError] = useState<unknown | null>(null);
    const [status, setStatus] = useState<number>(0)
    const [code, setCode] = useState<string | undefined>(undefined)

    const insert = async (data: TData, params?: TParams): InsertReturnType<TReturn> => {
        return new Promise((resolve) => {
            setResult(undefined);
            setError(null);
            setStatus(0)
            setCode(undefined)

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mutate({postFn: func, data: data, params: params}, {
                onSuccess: (response) => {
                    const success = response.status === 200;
                    const data = success ? (response.data as TReturn) : undefined;

                    setResult(data);
                    setStatus(response.status);
                    setCode(response.statusText)
                    resolve({ success, data, status: status, code: code });
                },
                onError: (error) => {
                    const errorMessage = catchError(error);
                    setError(errorMessage);
                    setStatus(error.response?.status as number);
                    setCode(error.code as string)
                    resolve({ success: false, error: errorMessage, status: status, code: code });
                }
            });
        });
    };

    return {insert, result, error, isLoading: isPending || isPaused, isError, failureReason};
};

export const ErrorCatch = (err: unknown) => {
    if (isAxiosError(err)) {
        if (err.response) {
            return {
                isSuccess: false,
                error: `Error ${err.status}: ${err.message}`
            }
        }
        return {
            isSuccess: false,
            error: `Error ${err.message}`
        }
    }else {
        return {
            isSuccess: false,
            error: `Unexpected error occurred ${err}`
        };
    }
}

export const isString = (value: unknown): value is string => typeof value === 'string'

export const catchError = (err: unknown) => {
    if (isAxiosError(err)) {
        if (err.response) {
            if (err?.response?.data
                && typeof err?.response?.data === 'object'
                && 'error' in err.response.data
            ) {
                return err.response?.data.error;
            }
            if (err?.response?.data
                && typeof err?.response?.data === 'object'
                && 'message' in err.response.data
            ) {
                return err.response?.data.message;
            }
            if (err?.response?.data && isString(err?.response?.data)) {
                return err.response?.data
            }else {
                return err?.message
            }
        }else {
            return err.message
        }
    }
}