/**
 * Portal Dashboard Page
 * Overview of system metrics for admin users
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  type DashboardStats,
} from "@/features/portal/api/portalApi";
import { PageHeader, Card, CardContent, Loader } from "@/shared/components/ui";
import { Clock, CalendarDays, Users, Building2 } from "lucide-react";
import { showToast } from "@/shared/components/ui/toast-config";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          showToast.error(
            response.message || "Failed to load dashboard statistics"
          );
        }
      } catch {
        showToast.error("An error occurred while loading dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <Loader text="Loading dashboard..." variant="container" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Pending Overtime Requests",
      value: stats?.pendingOvertimeRequests || 0,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      onClick: () => navigate("/portal/overtime-requests"),
    },
    {
      title: "Pending Leave Requests",
      value: stats?.pendingLeaveRequests || 0,
      icon: CalendarDays,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      onClick: () => navigate("/portal/leave-requests"),
    },
    {
      title: "Total Employees",
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      onClick: () => navigate("/portal/employees"),
    },
    {
      title: "Total Departments",
      value: stats?.totalDepartments || 0,
      icon: Building2,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      onClick: () => navigate("/portal/departments"),
    },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Admin dashboard overview" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={card.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                  <div className={`${card.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
