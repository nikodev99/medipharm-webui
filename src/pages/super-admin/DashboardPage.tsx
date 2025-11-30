import {StatCard} from "@/components/layout/StatCard.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {useQuery} from "@tanstack/react-query";
import {superAdminApi} from "@/lib/api.ts";
import {Pill, Search, Store, Users} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

const DashboardPage = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => superAdminApi.getStats(),
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Tableau de bord</h1>
                    <p className="text-muted-foreground mt-1">Vue d'ensemble de la plateforme Medipharm</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Pharmacies"
                        value={stats?.totalPharmacies || 0}
                        subtitle={`${stats?.activePharmacies || 0} actives`}
                        icon={Store}
                        color="bg-blue-500"
                        trend="+12%"
                    />
                    <StatCard
                        title="Médicaments"
                        value={stats?.totalMedications || 0}
                        subtitle="Dans la base"
                        icon={Pill}
                        color="bg-purple-500"
                        trend="+8%"
                    />
                    <StatCard
                        title="Utilisateurs"
                        value={stats?.totalUsers || 0}
                        subtitle={`${stats?.premiumUsers || 0} premium`}
                        icon={Users}
                        color="bg-emerald-500"
                        trend="+23%"
                    />
                    <StatCard
                        title="Recherches"
                        value={stats?.searchesToday || 0}
                        subtitle="Aujourd'hui"
                        icon={Search}
                        color="bg-orange-500"
                        trend="+15%"
                    />
                </div>

                {/* TODO Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activité récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Chargement des données...</p>
                    </CardContent>
                </Card>
            </div>
    );
};

export default DashboardPage;
