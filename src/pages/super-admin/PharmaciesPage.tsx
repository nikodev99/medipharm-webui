import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import {superAdminApi} from "@/lib/api.ts";
import {toast} from 'sonner'
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@radix-ui/react-dialog";
import {Button} from "@/components/ui/button.tsx";
import {CheckCircle, Eye, Plus, Search, Star, Table, ToggleLeft, ToggleRight} from "lucide-react";
import {DialogHeader} from "@/components/ui/dialog.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";

export const PharmaciesPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const queryClient = useQueryClient()

    const { data: pharmacies, isLoading } = useQuery({
        queryKey: ['pharmacies', searchTerm],
        queryFn: async () => await superAdminApi.getPharmacies(searchTerm)
    })

    const toggleStatusMutation = useMutation({
        mutationFn: (id: number) => superAdminApi.toggleStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['pharmacies']}).then()
             toast.success('Statut mis à jour avec succès', {
                 duration: 2000,
                 closeButton: true,
             })
        },
    })

    const verifyMutation = useMutation({
        mutationFn: (id: number) => superAdminApi.verifyPharmacy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['pharmacies']}).then()
             toast.success('Pharmacie vérifiée avec succès', {
                 duration: 2000,
                 closeButton: true,
             })
        },
    })

    return (
        <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestion des pharmacies</h1>
                        <p className="text-muted-foreground mt-1">Gérez toutes les pharmacies de la plateforme</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nouvelle pharmacie
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Créer une nouvelle pharmacie</DialogTitle>
                            </DialogHeader>
                            {/* Form content here */}
                            <p className="text-muted-foreground">Formulaire à implémenter</p>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search */}
                <Card className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher une pharmacie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </Card>

                {/* Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pharmacie</TableHead>
                                <TableHead>Ville</TableHead>
                                <TableHead>Téléphone</TableHead>
                                <TableHead>Inventaire</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (<Spinner />) :
                            pharmacies?.map((pharmacy) => (
                                <TableRow key={pharmacy.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{pharmacy.name}</div>
                                            <div className="text-sm text-muted-foreground">{pharmacy.address}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{pharmacy.city}</TableCell>
                                    <TableCell>{pharmacy.phoneNumber}</TableCell>
                                    <TableCell>{pharmacy.inventoryCount || 0}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium">{pharmacy.averageRating.toFixed(1)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <Badge variant={pharmacy.isActive ? 'default' : 'secondary'}>
                                                {pharmacy.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                            {pharmacy.isVerified && (
                                                <Badge variant="outline">Vérifiée</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => toggleStatusMutation.mutate(pharmacy.id as never)}
                                            >
                                                {pharmacy.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                                            </Button>
                                            {!pharmacy.isVerified && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => verifyMutation.mutate(pharmacy?.id as never)}
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button size="icon" variant="ghost">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
    )
}