import type {ReactNode} from "react";
import {Card, CardContent} from "@/components/ui/card.tsx";
import type {LucideIcon} from "lucide-react";

export interface StatCardProps {
    title: ReactNode;
    value: number;
    subtitle: ReactNode;
    icon: LucideIcon;
    color: string;
    trend?: string;
}

export const StatCard = ({title, value, subtitle, icon: Icon, color, trend }: StatCardProps) => {
    return(
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    {trend && (
                        <span className="text-sm font-semibold text-emerald-600">{trend}</span>
                    )}
                </div>
                <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
                <p className="text-muted-foreground mt-1">{title}</p>
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            </CardContent>
        </Card>
    )
}
