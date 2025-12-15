/**
 * Overtime Requests Page (Employee)
 * View and manage personal overtime requests
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
import { Clock, X } from "lucide-react";
import { showToast } from "@/shared/components/ui/toast-config";
import { useEffect, useState, useMemo } from "react";
import { useProfile } from "@/shared/stores/profileStore";
import type { EmployeeOvertimeRequest } from "../api/overtimeRequestsApi";
import {
  getMyOvertimeRequests,
  cancelOvertimeRequest,
} from "../api/overtimeRequestsApi";
import { AddOvertimeRequestModal } from "../components";

const OvertimeRequests = () => {
  const profile = useProfile();
  const [overtimeRequests, setOvertimeRequests] = useState<
    EmployeeOvertimeRequest[]
  >([]);
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

  // Fetch overtime requests
  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.employeeId) return;

      setLoading(true);
      setError(false);

      try {
        const response = await getMyOvertimeRequests(profile.employeeId);

        if (response.success && response.data) {
          setOvertimeRequests(response.data);
        } else {
          setError(true);
          showToast.error(
            response.message || "Failed to load overtime requests"
          );
        }
      } catch {
        setError(true);
        showToast.error("An error occurred while loading overtime requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.employeeId]);

  // Handle request added
  const handleRequestAdded = (request: EmployeeOvertimeRequest) => {
    setOvertimeRequests((prev) => [request, ...prev]);
  };

  // Handle cancel request
  const handleCancelRequest = async (requestId: string) => {
    showConfirmDialog(
      "Cancel Overtime Request",
      "Are you sure you want to cancel this overtime request? This action cannot be undone.",
      async () => {
        try {
          const response = await cancelOvertimeRequest(requestId);

          if (response.success) {
            setOvertimeRequests((prev) =>
              prev.filter((req) => req.id !== requestId)
            );
            showToast.success("Overtime request cancelled successfully");
          } else {
            showToast.error(
              response.message || "Failed to cancel overtime request"
            );
          }
        } catch {
          showToast.error("Failed to cancel overtime request");
        }
      }
    );
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
    return overtimeRequests.map((request) => {
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
                <Clock
                  className={`h-5 w-5 ${getAvatarIconColor(request.status)}`}
                />
              </Avatar>
              <span className="font-medium">
                {formatDate(request.requestDate)}
              </span>
            </div>
          </TableCell>
          <TableCell className="px-6 py-3 text-muted-foreground">
            {request.hours} {request.hours === 1 ? "hour" : "hours"}
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
  }, [overtimeRequests]);

  if (loading) {
    return <Loader text="Loading overtime requests..." />;
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
            <PageHeader title="My Overtime Requests" />
            <p className="text-sm text-muted-foreground mt-1">
              View and manage your overtime requests
            </p>
          </div>

          <AddOvertimeRequestModal
            employeeId={profile.employeeId}
            onRequestAdded={handleRequestAdded}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto pb-6">
          {error ? (
            <DataError
              title="Couldn't load overtime requests"
              message="Unable to load overtime requests data. Please try again."
              retryText="Try Again"
            />
          ) : (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="ps-6 py-4 font-medium">
                        Request Date
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Hours
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
                            <Skeleton className="h-4 w-[80px]" />
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
                    ) : overtimeRequests.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="px-6 py-12 text-center"
                        >
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Clock className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">
                              No overtime requests yet
                            </p>
                            <p className="text-sm">
                              Submit your first overtime request to get started
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

export default OvertimeRequests;
