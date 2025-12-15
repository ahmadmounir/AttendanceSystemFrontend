/**
 * Profile Page (Employee)
 * User profile and personal information with attendance history
 */

import { useEffect, useState, useMemo } from "react";
import { formatDate } from "@/shared/utils";
import {
  Loader,
  DataError,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  Badge,
  PageHeader,
  Skeleton,
} from "@/shared/components";
import {
  User,
  Mail,
  Clock,
  Calendar,
  DoorOpen,
  DoorClosed,
} from "lucide-react";
import { showToast } from "@/shared/components/ui/toast-config";
import { useProfile } from "@/shared/stores/profileStore";
import { ThemeSwitcher } from "@/shared/components/theme/ThemeSwitcher";
import {
  getMyAttendanceLogs,
  type MyAttendanceLog,
} from "../api/attendanceLogsApi";

const Profile = () => {
  const profile = useProfile();
  const [attendanceLogs, setAttendanceLogs] = useState<MyAttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch attendance logs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await getMyAttendanceLogs();

        if (response.success && response.data) {
          setAttendanceLogs(response.data);
        } else {
          setError(true);
          showToast.error(response.message || "Failed to load attendance logs");
        }
      } catch {
        setError(true);
        showToast.error("An error occurred while loading attendance logs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDays = attendanceLogs.length;
    const completedDays = attendanceLogs.filter(
      (log) => log.clockOutTime
    ).length;
    const totalHours = attendanceLogs.reduce(
      (sum, log) => sum + (log.totalHours || 0),
      0
    );
    const averageHours = totalDays > 0 ? totalHours / totalDays : 0;

    return { totalDays, completedDays, totalHours, averageHours };
  }, [attendanceLogs]);

  // Memoize table rows
  const tableRows = useMemo(() => {
    return attendanceLogs.map((log) => {
      const isStillPresent = !log.clockOutTime;

      return (
        <TableRow key={log.id} className="hover:bg-muted/50">
          <TableCell className="ps-6 py-3">
            <div className="flex items-center gap-3">
              <Avatar
                className={`h-9 w-9 flex items-center justify-center ${
                  isStillPresent ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isStillPresent ? (
                  <DoorOpen className="h-5 w-5 text-green-800" />
                ) : (
                  <DoorClosed className="h-5 w-5 text-red-800" />
                )}
              </Avatar>
              <span className="font-medium text-nowrap">
                {formatDate(log.clockInTime)}
              </span>
            </div>
          </TableCell>
          <TableCell className="px-6 py-3 text-muted-foreground text-nowrap">
            {new Date(log.clockInTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </TableCell>
          <TableCell className="px-6 py-3 text-muted-foreground text-nowrap">
            {log.clockOutTime
              ? new Date(log.clockOutTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "-"}
          </TableCell>
          <TableCell className="px-6 py-3">
            {log.totalHours ? (
              <Badge variant="outline" className="font-mono">
                {log.totalHours.toFixed(2)}h
              </Badge>
            ) : (
              <Badge variant="warning">In Progress</Badge>
            )}
          </TableCell>
        </TableRow>
      );
    });
  }, [attendanceLogs]);

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <PageHeader title="My Profile" />

          {/* Profile Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Info */}
            <div className="lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {profile?.name || "Loading..."}
                      </h2>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">
                          {profile?.username || "Loading..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-medium capitalize">
                        {profile?.role || "Member"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/10">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Employee ID
                      </p>
                      <p className="text-sm font-medium font-mono">
                        {profile?.employeeId?.slice(0, 8) || "N/A"}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Switcher Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your preferred theme
                </p>
                <ThemeSwitcher size="md" />
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Days</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalDays}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.completedDays}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <DoorClosed className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.totalHours.toFixed(1)}h
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Hours/Day</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.averageHours.toFixed(1)}h
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="flex-1 overflow-auto pb-6">
          <h3 className="text-lg font-semibold mb-4">Attendance History</h3>
          {error ? (
            <DataError
              title="Couldn't load attendance history"
              message="Unable to load attendance data. Please try again."
              retryText="Try Again"
            />
          ) : (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="ps-6 py-4 font-medium">
                        Date
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Clock In
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Clock Out
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Total Hours
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Skeleton rows while loading
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell className="ps-6 py-5">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-9 w-9 rounded-full" />
                              <Skeleton className="h-4 w-[120px]" />
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[80px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[80px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[60px]" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : attendanceLogs.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="px-6 py-12 text-center"
                        >
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Clock className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">
                              No attendance records yet
                            </p>
                            <p className="text-sm">
                              Your attendance history will appear here
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tableRows
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
