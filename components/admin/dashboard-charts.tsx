"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ChartDataProps {
  dailyRegistrations: { date: string; count: number }[];
  bookingStatuses: { status: string; count: number }[];
  funnelCounts: {
    sessions: number;
    registrations: number;
    bookings: number;
    outlines: number;
  };
  sourceBreakdown?: { source: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--chart-4)",
  confirmed: "var(--chart-2)",
  cancelled: "var(--chart-1)",
  completed: "var(--chart-3)",
};

const SOURCE_COLORS: Record<string, string> = {
  website_funnel: "var(--chart-1)",
  website_contact: "var(--chart-1)",
  meta_ads: "var(--chart-2)",
  linkedin: "var(--chart-3)",
  cold_email: "var(--chart-4)",
};

const SOURCE_LABELS: Record<string, string> = {
  website_funnel: "Website",
  website_contact: "Contact",
  meta_ads: "Meta Ads",
  linkedin: "LinkedIn",
  cold_email: "Cold Email",
};

const sourceConfig: ChartConfig = {
  website_funnel: { label: "Website", color: "var(--chart-1)" },
  meta_ads: { label: "Meta Ads", color: "var(--chart-2)" },
  linkedin: { label: "LinkedIn", color: "var(--chart-3)" },
  cold_email: { label: "Cold Email", color: "var(--chart-4)" },
};

const FUNNEL_DATA_KEYS = ["sessions", "registrations", "bookings", "outlines"] as const;

const areaConfig: ChartConfig = {
  count: { label: "Registrations", color: "var(--chart-1)" },
};

const funnelConfig: ChartConfig = {
  value: { label: "Count", color: "var(--chart-2)" },
};

const bookingConfig: ChartConfig = {
  pending: { label: "Pending", color: "var(--chart-4)" },
  confirmed: { label: "Confirmed", color: "var(--chart-2)" },
  cancelled: { label: "Cancelled", color: "var(--chart-1)" },
  completed: { label: "Completed", color: "var(--chart-3)" },
};

export function DashboardCharts({
  dailyRegistrations,
  bookingStatuses,
  funnelCounts,
  sourceBreakdown,
}: ChartDataProps) {
  const funnelData = FUNNEL_DATA_KEYS.map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: funnelCounts[key],
  }));

  const funnelBarColors = [
    "var(--chart-5)",
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
  ];

  return (
    <div className="grid gap-4 grid-cols-1 desktop:grid-cols-2">
      {/* Leads Over Time */}
      <Card className="border-border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="font-inter-tight text-base font-semibold">
            Leads Over Time
          </CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {dailyRegistrations.every((d) => d.count === 0) ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-secondary">
              No registrations in the last 30 days
            </div>
          ) : (
          <ChartContainer config={areaConfig} className="h-[250px] w-full">
            <AreaChart data={dailyRegistrations}>
              <defs>
                <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--chart-1)"
                fill="url(#fillLeads)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Booking Status Donut */}
      <Card className="border-border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="font-inter-tight text-base font-semibold">
            Booking Status
          </CardTitle>
          <CardDescription>All-time breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          {bookingStatuses.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-secondary">
              No bookings yet
            </div>
          ) : (
          <ChartContainer config={bookingConfig} className="h-[250px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={bookingStatuses}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {bookingStatuses.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] ?? "var(--chart-5)"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Funnel Conversion */}
      <Card className="border-border bg-white shadow-sm desktop:col-span-2">
        <CardHeader>
          <CardTitle className="font-inter-tight text-base font-semibold">
            Funnel Conversion
          </CardTitle>
          <CardDescription>
            Sessions → Registrations → Bookings → Outlines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={funnelConfig} className="h-[250px] w-full">
            <BarChart data={funnelData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {funnelData.map((_, i) => (
                  <Cell key={i} fill={funnelBarColors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      {/* Leads by Source */}
      {sourceBreakdown && sourceBreakdown.length > 0 && (
        <Card className="border-border bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-inter-tight text-base font-semibold">
              Leads by Source
            </CardTitle>
            <CardDescription>All-time breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sourceConfig} className="h-[250px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={sourceBreakdown.map((s) => ({ ...s, name: SOURCE_LABELS[s.source] || s.source }))}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {sourceBreakdown.map((entry) => (
                    <Cell
                      key={entry.source}
                      fill={SOURCE_COLORS[entry.source] ?? "var(--chart-5)"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
