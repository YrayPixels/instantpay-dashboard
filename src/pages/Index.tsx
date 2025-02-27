
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowUpRight, ChevronUp, DollarSign, Users } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 700 },
  { name: "Jun", value: 900 },
];

const stats = [
  {
    title: "Total Volume",
    value: "$12,345",
    change: "+12.5%",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "1,234",
    change: "+8.2%",
    icon: Users,
  },
  {
    title: "Success Rate",
    value: "99.9%",
    change: "+0.1%",
    icon: ArrowUpRight,
  },
];

export default function Index() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your merchant account today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6 hover-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <h3 className="text-2xl font-semibold">{stat.value}</h3>
                <span className="flex items-center text-sm font-medium text-success">
                  <ChevronUp className="h-4 w-4" />
                  {stat.change}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="mb-4 flex flex-col space-y-2">
            <h3 className="text-lg font-medium">Transaction Volume</h3>
            <p className="text-sm text-muted-foreground">
              Last 6 months of transaction volume
            </p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
