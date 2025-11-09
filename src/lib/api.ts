import axios from "axios";
import {loggedUser} from "@/utils/LoggedUser.ts";
import type {
    AnalyticsData,
    AuthResponse,
    CreatePharmacyData,
    DashboardStats,
    LoginCredentials, Medication,
    Pharmacy, User
} from "@/types";
import {redirectTo} from "@/context/RedirectContext.ts";

const API_URL = import.meta.env.VITE_API_URL;

export const mod = {
    auth: '/auth',
    user: '/user',
    search: '/search',
    pharmacy: '/pharmacy',
    admin: '/admin',
    medication: '/medication',
}

const api = axios.create({
    baseURL: API_URL,
})

api.interceptors.request.use((config) => {
    const token = loggedUser.getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

//Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            loggedUser.clearCache()
            redirectTo("/login")
        }
        return Promise.reject(error);
    }
)

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(`${mod.auth}/login`, credentials)
        return response.data
    }
}

export const dashboardApi = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await api.get<DashboardStats>(`${mod.admin}/stats`)
        return response.data
    },

    getAnalytics: async (days: number): Promise<AnalyticsData> => {
        const response = await api.get<AnalyticsData>(`${mod.admin}/analytics`, {
            params: {
                days: days,
            }
        })
        return response.data
    }
}

export const pharmacyApi = {
    getPharmacies: async (search?: string, city?: string, status?: string): Promise<Pharmacy[]> => {
        const response = await api.get<Pharmacy[]>(`${mod.pharmacy}/all`, {
            params: {
                ...(search ? {search}: {}),
                ...(city ? {city}: {}),
                ...(status ? {status}: {})
            }
        })
        return response.data
    },

    createPharmacy: async (data: CreatePharmacyData): Promise<Pharmacy> => {
        const response = await api.post<Pharmacy>(mod.pharmacy, data)
        return response.data
    },

    toggleStatus: async (id: string): Promise<void> => {
        await api.patch(`${mod.pharmacy}/status/${id}`)
    },

    verifyPharmacy: async (id: string): Promise<void> => {
        await api.patch(`${mod.pharmacy}/verify/${id}`)
    }
}

export const medicationsApi = {
    getMedications: async (search?: string): Promise<Medication[]> => {
        const response = await api.get<Medication[]>(mod.medication, {
            params: {
                ...(search ? {search}: {}),
            }
        })
        return response.data
    }
}

export const userApi = {
    getUsers: async (search?: string, role?: string, isPremium?: boolean): Promise<User[]> => {
        const response = await api.get<User[]>(mod.user, {
            params: {
                ...(search ? {search}: {}),
                ...(role ? {role}: {}),
                ...(isPremium ? {isPremium: isPremium}: {})
            }
        })
        return response.data
    },

    createPharmacyAdmin: async (data: User)=> {
        const response = await api.post<Pharmacy>(`${mod.auth}/admin`, data)
        return response.data
    }
}