import {
  getEnhancedDashboardStats,
  getChartData,
  getRecentActivity,
} from "@/lib/actions/admin";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { BlurFade } from "@/components/ui/blur-fade";

export default async function AdminDashboard() {
  const [stats, chartData, activities] = await Promise.all([
    getEnhancedDashboardStats(),
    getChartData(),
    getRecentActivity(),
  ]);

  return (
    <div className="space-y-6">
      <BlurFade delay={0.05}>
        <div>
          <h1 className="font-inter-tight text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 font-inter text-sm text-muted-secondary">
            Overview of all funnel activity
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.1}>
        <DashboardStats {...stats} />
      </BlurFade>

      <BlurFade delay={0.15}>
        <DashboardCharts {...chartData} />
      </BlurFade>

      <BlurFade delay={0.2}>
        <ActivityFeed activities={activities} />
      </BlurFade>
    </div>
  );
}
