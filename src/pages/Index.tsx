
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowUpRight, ChevronUp, DollarSign, Notebook, PictureInPicture, Users } from "lucide-react";
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
    title: "Total Users",
    value: "1",
    change: "+100%",
    icon: Users,
  },
  {
    title: "Total Posts",
    value: "1,234",
    change: "+8.2%",
    icon: Notebook,
  },
  {
    title: "Total Photos",
    value: "99.9%",
    change: "+0.1%",
    icon: PictureInPicture,
  },
];

export default function Index() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Manage Your Admin Dashboard Today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6 bg-main2 text-white hover-card">
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
            <h3 className="text-xl font-bold">Current Site Look</h3>
          </div>
          <div className="h-screen">
            <ResponsiveContainer width="100%" height="100%">
              <iframe src="https://shosa-eight.vercel.app/" ></iframe>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
