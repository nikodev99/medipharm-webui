export const medicationForm = {
    TABLET: 'Comprimé',
    CAPSULE: 'Capsule',
    INJECTION: 'Injection',
    DROPS: 'Gouttes',
    OINTMENT: 'Pommade',
    SYRUP: 'Sirop',
    CREAM: 'Crème',
    POWDER: 'Poudre',
    SPRAY: 'Aérosol',
    INHALER: 'Inhalateur',
    SUPPOSITORY: 'Suppositoire',
    OTHER: 'Autre'
}

export type Moment = Date | string | number[];

export type MedicationForm = typeof medicationForm[keyof typeof medicationForm];

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
    id: string
    name: string
    dci?: string
    dosage: string
    manufacturer?: string;
    form?: string;
    strength?: string;
    description?: string;
    searchCount: number;
    availablePharmacies: number;
    isActive: boolean

    totalSearches: number,
    availableInPharmacies: number,
    averagePrice: number,
    createdAt: Moment
}

export interface CreateMedication {
    name: string
    dci: string
    dosage: string
    form: string
    manufacturer?: string
    description?: string
    requiresPrescription: boolean
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

export interface Inventory {
    id: number,
    medication: Medication,
    quantity: number,
    price: number,
    isAvailable: boolean,
    expiryDate?: string,
    lastUpdated: string,
    status: string | "in-stock" | "low-stock" | "out-of-stock"
}

export interface AddInventoryRequest {
    pharmacyId: number,
    medicationId: number,
    quantity?: number
    price?: number
    isAvailable: boolean,
    expiryDate: Date | string | number[]
}

export interface CreateMedication {
    name: string,
    dci: string,
    dosage: string,
    form: MedicationForm,
    manufacturer?: string,
    description?: string,
    requiresPrescription: boolean,
    activeIngredients: string[]
    imageUrls: string[]
    leafletUrl?: string,
    isActive: boolean,
    quantity: number,
    price: number
    isAvailable: boolean,
    expiryDate: Date | string | number[]
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