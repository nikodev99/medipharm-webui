import {useState} from "react";
import type {CreatePharmacyData} from "@/types";
import {pharmacyApi} from "@/lib/api.ts";
import {XIcon} from "lucide-react";

export interface CreatePharmacyModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const CreatePharmacyModal = ({ onClose, onSuccess }: CreatePharmacyModalProps) => {
    const [formData, setFormData] = useState<CreatePharmacyData>({
        name: '',
        address: '',
        city: 'Brazzaville',
        phoneNumber: '',
        alternatePhoneNumber: '',
        email: '',
        latitude: -4.2634,
        longitude: 15.2429,
        description: '',
        licenseNumber: '',
        adminEmail: '',
        adminName: '',
        adminPassword: ''
    });

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await pharmacyApi.createPharmacy(formData);
            alert('Pharmacie créée avec succès!');
            onSuccess();
        } catch (error) {
            console.error("Error creating pharmacy: ", error);
            alert('Erreur lors de la création');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Nouvelle pharmacie</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la pharmacie</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email (optionnel)</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className="col-span-2 border-t border-gray-200 pt-4 mt-4">
                            <h4 className="font-semibold text-gray-900 mb-4">Administrateur de la pharmacie</h4>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                            <input
                                type="text"
                                value={formData.adminName}
                                onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email admin</label>
                            <input
                                type="email"
                                value={formData.adminEmail}
                                onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe admin</label>
                            <input
                                type="password"
                                value={formData.adminPassword}
                                onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                minLength={8}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                        >
                            Créer la pharmacie
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};