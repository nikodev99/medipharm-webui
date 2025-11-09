export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'SUPER_ADMIN' | 'PHARMACY_ADMIN' | 'USER';
    isPremium?: boolean;
}

export interface AuthResponse {
    token: string
    refreshToken: string
    user: User | null
}

export interface Pharmacy {
    id: string;
    name: string;
    address: string;
    city: string;
    phoneNumber: string;
    email?: string;
    isActive: boolean;
    isVerified: boolean;
    inventoryCount: number;
    averageRating: number;
    latitude?: number;
    longitude?: number;
    description?: string;
    licenseNumber?: string;
}

export interface Medication {
    id: string;
    name: string;
    genericName?: string;
    manufacturer?: string;
    form?: string;
    strength?: string;
    description?: string;
    searchCount: number;
    availablePharmacies: number;
}

export interface DashboardStats {
    totalPharmacies: number;
    activePharmacies: number;
    totalMedications: number;
    totalUsers: number;
    premiumUsers: number;
    searchesToday: number;
}

export interface AnalyticsData {
    topMedications: Medication[];
    pharmacyPerformance: PharmacyPerformance[];
    searchTrends: SearchTrend[];
}

export interface PharmacyPerformance {
    name: string;
    totalInventory: number;
    availableItems: number;
    searchImpressions: number;
    averagePrice: number;
}

export interface SearchTrend {
    date: string;
    count: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface CreatePharmacyData {
    name: string;
    address: string;
    city: string;
    phoneNumber: string;
    alternatePhoneNumber?: string;
    email?: string;
    latitude: number;
    longitude: number;
    description?: string;
    licenseNumber?: string;
    adminEmail: string;
    adminName: string;
    adminPassword: string;
}