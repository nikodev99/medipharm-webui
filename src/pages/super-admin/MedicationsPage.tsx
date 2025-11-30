import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {toast} from "sonner";
import {superAdminApi} from "@/lib/api.ts";

const MedicationsPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        dci: '',
        dosage: '',
        form: 'TABLET',
        manufacturer: '',
        description: '',
        requiresPrescription: false,
    })

    const queryClient = useQueryClient()

    const { data: medications } = useQuery({
        queryKey: ['medications', searchTerm],
        queryFn: async () =>  await superAdminApi.getMedications(searchTerm)
    })

    const createMutation = useMutation({
        mutationFn: (data: MedicationSchema) => superAdminApi.createMedication(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['medications']}).then()
            setOpen(false)
            toast.success('Médicament créé avec succès', {
                position: "top-center",
                duration: 2000,
            })
        },
    })

    const handleSubmit = (data: MedicationSchema) => {
        createMutation.mutate(data)
    }

    return (
        <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestion des médicaments</h1>
                        <p className="text-muted-foreground mt-1">Gérez la base de données des médicaments</p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nouveau médicament
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Ajouter un médicament</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom commercial</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dci">DCI</Label>
                                        <Input
                                            id="dci"
                                            value={formData.dci}
                                            onChange={(e) => setFormData({ ...formData, dci: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dosage">Dosage</Label>
                                        <Input
                                            id="dosage"
                                            placeholder="500mg"
                                            value={formData.dosage}
                                            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="manufacturer">Fabricant</Label>
                                        <Input
                                            id="manufacturer"
                                            value={formData.manufacturer}
                                            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={createMutation.isPending}>
                                        {createMutation.isPending ? 'Création...' : 'Créer'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search */}
                <Card className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un médicament..."
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
                                <TableHead>Médicament</TableHead>
                                <TableHead>DCI</TableHead>
                                <TableHead>Dosage</TableHead>
                                <TableHead>Forme</TableHead>
                                <TableHead>Fabricant</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medications?.map((med) => (
                                <TableRow key={med.id}>
                                    <TableCell>
                                        <div className="font-medium">{med.name}</div>
                                    </TableCell>
                                    <TableCell>{med.dci}</TableCell>
                                    <TableCell>{med.dosage}</TableCell>
                                    <TableCell>{med.form}</TableCell>
                                    <TableCell>{med.manufacturer || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={med.isActive ? 'default' : 'secondary'}>
                                            {med.isActive ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost">
                                                <Trash2 className="h-4 w-4 text-destructive" />
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

export default MedicationsPage