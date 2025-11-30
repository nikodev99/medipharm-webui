import axios from "axios";
import {loggedUser} from "@/utils/LoggedUser.ts";
import type {
    AddInventoryRequest,
    AnalyticsData,
    AuthResponse, CreateMedication,
    CreatePharmacyData,
    DashboardStats, Inventory,
    LoginCredentials, Medication, Pharmacy
} from "@/types";
import {redirectTo} from "@/context/RedirectContext.ts";

const API_URL = import.meta.env.VITE_API_URL;

export const mod = {
    auth: '/auth',
    superAdmin: '/superadmin',
    admin: '/admin',
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
        console.log({credentials})
        const response = await api.post<AuthResponse>(`${mod.auth}/login`, credentials)
        console.log({response})
        return response.data
    }
}

export const superAdminApi = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await api.get<DashboardStats>(`${mod.superAdmin}/dashboard_stats`)
        return response.data
    },

    getAnalytics: async (days: number = 7): Promise<AnalyticsData> => {
        const response = await api.get<AnalyticsData>(`${mod.superAdmin}/dashboard_analytics`, {
            params: {
                days: days,
            }
        })
        return response.data
    },

    createMedication: async (medication: CreateMedication): Promise<CreateMedication> => {
        const response = await api.post<CreateMedication>(`${mod.superAdmin}/medications`, medication)
        return response.data
    },

    getMedications: async (search?: string): Promise<Medication[]> => {
        const response = await api.get<Medication[]>(`${mod.superAdmin}/medications`, {
            params: {
                ...(search ? {search}: {})
            }
        })
        return response.data
    },

    getPharmacies: async (search?: string, city?: string, status?: string): Promise<Pharmacy[]> => {
        const response = await api.get<Pharmacy[]>(`${mod.superAdmin}/pharmacies`, {
            params: {
                ...(search ? {search}: {}),
                ...(city ? {city}: {}),
                ...(status ? {status}: {})
            }
        })
        return response.data
    },

    createPharmacy: async (data: CreatePharmacyData): Promise<Pharmacy> => {
        const response = await api.post<Pharmacy>(mod.superAdmin + '/pharmacies', data)
        return response.data
    },

    verifyPharmacy: async (id: number): Promise<void> => {
        await api.patch(`${mod.superAdmin}/pharmacies/${id}/verify`)
    },

    toggleStatus: async (id: number): Promise<void> => {
        await api.patch(`${mod.superAdmin}/pharmacies/${id}/status`)
    }
}

export const adminApi = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await api.get<DashboardStats>(`${mod.admin}/dashboard_stats`)
        return response.data
    },

    getAnalytics: async (days: number = 7): Promise<AnalyticsData> => {
        const response = await api.get<AnalyticsData>(`${mod.admin}/dashboard_analytics`, {
            params: {
                days: days,
            }
        })
        return response.data
    },

    getInventory: async (search?: string, lowStock?: boolean): Promise<Inventory[]> => {
        const response = await api.get<Inventory[]>(mod.admin + '/inventory', {
            params: {
                ...(search ? {search: search}: {}),
                ...(lowStock ? {lowStock: lowStock}: {})
            }
        })
        return response.data
    },

    addInventory: async (request: AddInventoryRequest): Promise<AddInventoryRequest> => {
        const response = await api.post<AddInventoryRequest>(mod.admin + '/inventory', request)
        return response.data
    },

    addMedications: async (request: CreateMedication[]): Promise<CreateMedication[]> => {
        const response = await api.post<CreateMedication[]>(mod.admin + '/bulk/medication', request)
        return response.data
    }
}

