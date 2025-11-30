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
import { Plus, Search, Upload, Edit, Trash2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [lowStockOnly, setLowStockOnly] = useState(false)
    const [uploadOpen, setUploadOpen] = useState(false)
    const queryClient = useQueryClient()

    const { data: inventory, isLoading } = useQuery({
        queryKey: ['inventory', searchTerm, lowStockOnly],
        queryFn: async () => {
            const { data } = await pharmacyAdminAPI.getInventory(searchTerm, lowStockOnly)
            return data
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => pharmacyAdminAPI.deleteInventoryItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] })
            toast({ title: 'Article supprimé' })
        },
    })

    const uploadMutation = useMutation({
        mutationFn: (file: File) => pharmacyAdminAPI.uploadExcel(file),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] })
            setUploadOpen(false)
            toast({
                title: `${data.data.imported} médicaments importés avec succès!`,
                description: data.data.failed > 0 ? `${data.data.failed} échecs` : undefined
            })
        },
    })

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            uploadMutation.mutate(file)
        }
    }

    const getStockBadge = (status: string) => {
        const variants = {
            'in-stock': 'default',
            'low-stock': 'warning',
            'out-of-stock': 'destructive',
        }
        const labels = {
            'in-stock': 'En stock',
            'low-stock': 'Stock faible',
            'out-of-stock': 'Rupture',
        }
        return (
            <Badge variant={variants[status as keyof typeof variants] as any}>
                {labels[status as keyof typeof labels]}
            </Badge>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestion de l'inventaire</h1>
                        <p className="text-muted-foreground mt-1">Gérez les médicaments de votre pharmacie</p>
                    </div>
                    <div className="flex gap-3">
                        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Importer
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Importer l'inventaire</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <Input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <Label htmlFor="file-upload" className="cursor-pointer">
                                            <p className="font-medium mb-2">Cliquez pour sélectionner un fichier Excel</p>
                                            <p className="text-sm text-muted-foreground">Formats: .xlsx, .xls</p>
                                        </Label>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un médicament..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="lowStock"
                                checked={lowStockOnly}
                                onCheckedChange={(checked) => setLowStockOnly(checked as boolean)}
                            />
                            <Label htmlFor="lowStock" className="cursor-pointer">
                                Stock faible uniquement
                            </Label>
                        </div>
                    </div>
                </Card>

                {/* Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Médicament</TableHead>
                                <TableHead>Dosage</TableHead>
                                <TableHead>Forme</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Prix</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory?.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{item.medication.name}</div>
                                            <div className="text-sm text-muted-foreground">{item.medication.dci}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.medication.dosage}</TableCell>
                                    <TableCell>{item.medication.form}</TableCell>
                                    <TableCell>
                                        <span className="font-semibold">{item.quantity}</span>
                                    </TableCell>
                                    <TableCell>{item.price.toLocaleString()} FCFA</TableCell>
                                    <TableCell>{getStockBadge(item.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => deleteMutation.mutate(item.id)}
                                            >
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
        </DashboardLayout>
    )
}