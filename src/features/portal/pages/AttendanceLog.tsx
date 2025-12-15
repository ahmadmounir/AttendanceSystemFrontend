/**
 * Attendance Log Page
 * View all attendance records
 */

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
  Button,
  Avatar,
  Badge,
  ConfirmDialog,
  PageHeader,
  Skeleton,
} from "@/shared/components";
import { Users, DoorOpen, DoorClosed, LogOut } from "lucide-react";
import { showToast } from "@/shared/components/ui/toast-config";
import { useEffect, useState, useMemo } from "react";
import type { AttendanceLog as AttendanceLogType } from "../api/attendanceLogsApi";
import {
  getAttendanceLogs,
  updateAttendanceLog,
} from "../api/attendanceLogsApi";
import { AttendEmployeeModal } from "../components";

const AttendanceLog = () => {
  const [logs, setLogs] = useState<AttendanceLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Confirmation dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    (() => Promise<void>) | null
  >(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  // Helper function to show confirmation dialog
  const showConfirmDialog = (
    title: string,
    description: string,
    action: () => Promise<void>
  ) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setConfirmAction(() => action);
    setConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setIsConfirming(true);
    try {
      await confirmAction();
      setConfirmDialogOpen(false);
    } finally {
      setIsConfirming(false);
    }
  };

  // Fetch attendance logs
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await getAttendanceLogs();

        if (response.success && response.data) {
          setLogs(response.data);
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

    fetchLogs();
  }, []);

  // Handle employee attended
  const handleEmployeeAttended = (log: AttendanceLogType) => {
    setLogs((prev) => [log, ...prev]);
  };

  // Handle mark as left
  const handleMarkAsLeft = async (logId: string) => {
    showConfirmDialog(
      "Mark as Left",
      "Are you sure you want to mark this employee as left?",
      async () => {
        try {
          const response = await updateAttendanceLog(logId);

          if (response.success) {
            // Update local state
            setLogs((prev) =>
              prev.map((log) =>
                log.id === logId
                  ? { ...log, clockOutTime: new Date().toISOString() }
                  : log
              )
            );
            showToast.success("Employee marked as left successfully");
          } else {
            showToast.error(response.message || "Failed to mark as left");
          }
        } catch {
          showToast.error("Failed to mark as left");
        }
      }
    );
  };

  // Format time to display (HH:MM)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get attended employee IDs for TODAY only (to filter in modal)
  const attendedEmployeeIds = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    return logs
      .filter((log) => {
        const clockInDate = new Date(log.clockInTime);
        clockInDate.setHours(0, 0, 0, 0); // Start of clock in day
        return clockInDate.getTime() === today.getTime(); // Same day
      })
      .map((log) => log.employeeId);
  }, [logs]);

  // Memoize table rows
  const tableRows = useMemo(() => {
    return logs.map((log) => {
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
              <span className="font-medium">{log.employeeFullName}</span>
            </div>
          </TableCell>
          <TableCell className="px-6 py-3 text-nowrap text-muted-foreground">
            {formatDate(log.clockInTime)} {formatTime(log.clockInTime)}
          </TableCell>
          <TableCell className="px-6 py-3 text-nowrap text-muted-foreground">
            {log.clockOutTime
              ? `${formatDate(log.clockOutTime)} ${formatTime(
                  log.clockOutTime
                )}`
              : "-"}
          </TableCell>
          <TableCell className="px-6 py-3">
            {log.totalHours > 0 ? `${log.totalHours}h` : "-"}
          </TableCell>
          <TableCell className="px-6 py-3">
            <Badge variant={isStillPresent ? "success" : "outline"}>
              {isStillPresent ? "Present" : "Left"}
            </Badge>
          </TableCell>
          <TableCell className="px-6 py-3 text-center">
            {isStillPresent && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 hover:bg-muted"
                onClick={() => handleMarkAsLeft(log.id)}
              >
                <LogOut className="me-2 h-4 w-4" />
                Mark as Left
              </Button>
            )}
          </TableCell>
        </TableRow>
      );
    });
  }, [logs]);

  if (loading) {
    return <Loader text="Loading attendance logs..." />;
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-8">
          <div>
            <PageHeader title="Attendance Log" />
            <p className="text-sm text-muted-foreground mt-1">
              View and manage employee attendance records
            </p>
          </div>

          <AttendEmployeeModal
            onEmployeeAttended={handleEmployeeAttended}
            attendedEmployeeIds={attendedEmployeeIds}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto pb-6">
          {error ? (
            <DataError
              title="Couldn't load attendance logs"
              message="Unable to load attendance logs data. Please try again."
              retryText="Try Again"
            />
          ) : (
            <div className="rounded-lg border bg-card text-card-foreground">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="ps-6 py-4 font-medium">
                        Employee
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
                      <TableHead className="px-6 py-4 font-medium">
                        Status
                      </TableHead>
                      <TableHead className="w-[180px] px-6 py-4 font-medium text-center">
                        Actions
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
                              <Skeleton className="h-4 w-[150px]" />
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[180px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[180px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[60px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[80px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5 text-center">
                            <Skeleton className="h-8 w-[120px] mx-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : logs.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="px-6 py-12 text-center"
                        >
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Users className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">
                              No attendance logs found
                            </p>
                            <p className="text-sm">
                              Start by marking employee attendance
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={confirmTitle}
        description={confirmDescription}
        confirmText="Confirm"
        variant="default"
        isLoading={isConfirming}
        loadingText="Loading..."
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default AttendanceLog;
