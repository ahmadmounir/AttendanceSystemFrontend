/**
 * Leave Requests Page (Employee)
 * View and manage personal leave requests
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
import { Calendar, FileText, X } from "lucide-react";
import { showToast } from "@/shared/components/ui/toast-config";
import { useEffect, useState, useMemo } from "react";
import { useProfile } from "@/shared/stores/profileStore";
import type { EmployeeLeaveRequest } from "../api/leaveRequestsApi";
import {
  getMyLeaveRequests,
  cancelLeaveRequest,
  getLeaveTypes,
  type LeaveType,
} from "../api/leaveRequestsApi";
import { AddLeaveRequestModal } from "../components";

const LeaveRequests = () => {
  const profile = useProfile();
  const [leaveRequests, setLeaveRequests] = useState<EmployeeLeaveRequest[]>(
    []
  );
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
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

  // Fetch leave requests and types
  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.employeeId) return;

      setLoading(true);
      setError(false);

      try {
        const [requestsResponse, typesResponse] = await Promise.all([
          getMyLeaveRequests(profile.employeeId),
          getLeaveTypes(),
        ]);

        if (requestsResponse.success && requestsResponse.data) {
          setLeaveRequests(requestsResponse.data);
        } else {
          setError(true);
          showToast.error(
            requestsResponse.message || "Failed to load leave requests"
          );
        }

        if (typesResponse.success && typesResponse.data) {
          setLeaveTypes(typesResponse.data);
        }
      } catch {
        setError(true);
        showToast.error("An error occurred while loading leave requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.employeeId]);

  // Handle request added
  const handleRequestAdded = (request: EmployeeLeaveRequest) => {
    setLeaveRequests((prev) => [request, ...prev]);
  };

  // Handle cancel request
  const handleCancelRequest = async (requestId: string) => {
    showConfirmDialog(
      "Cancel Leave Request",
      "Are you sure you want to cancel this leave request? This action cannot be undone.",
      async () => {
        try {
          const response = await cancelLeaveRequest(requestId);

          if (response.success) {
            setLeaveRequests((prev) =>
              prev.filter((req) => req.id !== requestId)
            );
            showToast.success("Leave request cancelled successfully");
          } else {
            showToast.error(
              response.message || "Failed to cancel leave request"
            );
          }
        } catch {
          showToast.error("Failed to cancel leave request");
        }
      }
    );
  };

  // Get leave type name by ID
  const getLeaveTypeName = (leaveTypeId: string) => {
    const type = leaveTypes.find((t) => t.id === leaveTypeId);
    return type?.typeName || "Unknown";
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "approved":
        return "success" as const;
      case "pending":
        return "warning" as const;
      case "rejected":
        return "error" as const;
      default:
        return "outline" as const;
    }
  };

  // Get avatar color based on status
  const getAvatarColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "approved":
        return "bg-green-100";
      case "pending":
        return "bg-yellow-100";
      case "rejected":
        return "bg-red-100";
      default:
        return "bg-blue-100";
    }
  };

  const getAvatarIconColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "approved":
        return "text-green-800";
      case "pending":
        return "text-yellow-800";
      case "rejected":
        return "text-red-800";
      default:
        return "text-blue-800";
    }
  };

  // Memoize table rows
  const tableRows = useMemo(() => {
    return leaveRequests.map((request) => {
      const isPending = request.status.toLowerCase() === "pending";

      return (
        <TableRow key={request.id} className="hover:bg-muted/50">
          <TableCell className="ps-6 py-3">
            <div className="flex items-center gap-3">
              <Avatar
                className={`h-9 w-9 flex items-center justify-center ${getAvatarColor(
                  request.status
                )}`}
              >
                <FileText
                  className={`h-5 w-5 ${getAvatarIconColor(request.status)}`}
                />
              </Avatar>
              <span className="font-medium">
                {getLeaveTypeName(request.leaveTypeId)}
              </span>
            </div>
          </TableCell>
          <TableCell className="px-6 py-3 text-nowrap text-muted-foreground">
            {formatDate(request.startDate)}
          </TableCell>
          <TableCell className="px-6 py-3 text-nowrap text-muted-foreground">
            {formatDate(request.endDate)}
          </TableCell>
          <TableCell className="px-6 py-3 max-w-xs truncate">
            {request.reason}
          </TableCell>
          <TableCell className="px-6 py-3">
            <Badge variant={getStatusBadgeVariant(request.status)}>
              {request.status}
            </Badge>
          </TableCell>
          <TableCell className="px-6 py-3 text-center">
            {isPending && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleCancelRequest(request.id)}
              >
                <X className="me-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </TableCell>
        </TableRow>
      );
    });
  }, [leaveRequests, leaveTypes]);

  if (loading) {
    return <Loader text="Loading leave requests..." />;
  }

  if (!profile?.employeeId) {
    return (
      <DataError
        title="No employee ID found"
        message="Please ensure you are logged in as an employee."
        retryText="Refresh"
      />
    );
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-8">
          <div>
            <PageHeader title="My Leave Requests" />
            <p className="text-sm text-muted-foreground mt-1">
              View and manage your leave requests
            </p>
          </div>

          <AddLeaveRequestModal
            employeeId={profile.employeeId}
            onRequestAdded={handleRequestAdded}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto pb-6">
          {error ? (
            <DataError
              title="Couldn't load leave requests"
              message="Unable to load leave requests data. Please try again."
              retryText="Try Again"
            />
          ) : (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="ps-6 py-4 font-medium">
                        Leave Type
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Start Date
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        End Date
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Reason
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Status
                      </TableHead>
                      <TableHead className="w-[120px] px-6 py-4 font-medium text-center">
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
                              <Skeleton className="h-4 w-[120px]" />
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[200px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[80px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5 text-center">
                            <Skeleton className="h-8 w-[80px] mx-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : leaveRequests.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="px-6 py-12 text-center"
                        >
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Calendar className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">
                              No leave requests yet
                            </p>
                            <p className="text-sm">
                              Submit your first leave request to get started
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
        variant="destructive"
        isLoading={isConfirming}
        loadingText="Loading..."
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default LeaveRequests;
