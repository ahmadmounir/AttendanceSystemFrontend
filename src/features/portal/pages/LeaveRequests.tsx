/**
 * Leave Requests Page (Portal)
 * Manage all employee leave requests
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
import { Users, User, Check, X, Info } from "lucide-react";
import { showToast } from "@/shared/components/ui/toast-config";
import { useEffect, useState, useMemo } from "react";
import type { LeaveRequest } from "../api/leaveRequestsApi";
import { getLeaveRequests, reviewLeaveRequest } from "../api/leaveRequestsApi";
import { LeaveRequestDetailsModal } from "../components";

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Details modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedLeaveRequestId, setSelectedLeaveRequestId] =
    useState<string>("");

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

  // Fetch leave requests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await getLeaveRequests();

        if (response.success && response.data) {
          setLeaveRequests(response.data);
        } else {
          setError(true);
          showToast.error(response.message || "Failed to load leave requests");
        }
      } catch {
        setError(true);
        showToast.error("An error occurred while loading leave requests");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle approve leave request
  const handleApprove = async (id: string, employeeName: string) => {
    showConfirmDialog(
      "Approve Leave Request",
      `Are you sure you want to approve the leave request for ${employeeName}?`,
      async () => {
        try {
          const response = await reviewLeaveRequest(id, { status: "Approved" });

          if (response.success) {
            setLeaveRequests((prev) =>
              prev.map((req) =>
                req.id === id ? { ...req, status: "Approved" } : req
              )
            );
            showToast.success("Leave request approved successfully");
          } else {
            showToast.error(
              response.message || "Failed to approve leave request"
            );
          }
        } catch {
          showToast.error("Failed to approve leave request");
        }
      }
    );
  };

  // Handle reject leave request
  const handleReject = async (id: string, employeeName: string) => {
    showConfirmDialog(
      "Reject Leave Request",
      `Are you sure you want to reject the leave request for ${employeeName}?`,
      async () => {
        try {
          const response = await reviewLeaveRequest(id, { status: "Rejected" });

          if (response.success) {
            setLeaveRequests((prev) =>
              prev.map((req) =>
                req.id === id ? { ...req, status: "Rejected" } : req
              )
            );
            showToast.success("Leave request rejected successfully");
          } else {
            showToast.error(
              response.message || "Failed to reject leave request"
            );
          }
        } catch {
          showToast.error("Failed to reject leave request");
        }
      }
    );
  };

  // Handle view details
  const handleViewDetails = (id: string) => {
    setSelectedLeaveRequestId(id);
    setDetailsModalOpen(true);
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
                <User
                  className={`h-5 w-5 ${getAvatarIconColor(request.status)}`}
                />
              </Avatar>
              <span className="font-medium">{request.employeeName}</span>
            </div>
          </TableCell>
          <TableCell className="px-6 py-3">{request.typeName}</TableCell>
          <TableCell className="px-6 py-3 text-nowrap text-muted-foreground">
            {formatDate(request.startDate)}
          </TableCell>
          <TableCell className="px-6 py-3 text-nowrap text-muted-foreground">
            {formatDate(request.endDate)}
          </TableCell>
          <TableCell className="px-6 py-3">
            <Badge variant={getStatusBadgeVariant(request.status)}>
              {request.status}
            </Badge>
          </TableCell>
          <TableCell className="px-6 py-3 text-center">
            <div className="flex items-center justify-center gap-2">
              {isPending && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() =>
                      handleApprove(request.id, request.employeeName)
                    }
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() =>
                      handleReject(request.id, request.employeeName)
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 hover:bg-muted"
                onClick={() => handleViewDetails(request.id)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    });
  }, [leaveRequests]);

  if (loading) {
    return <Loader text="Loading leave requests..." />;
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-8">
          <div>
            <PageHeader title="Leave Requests" />
            <p className="text-sm text-muted-foreground mt-1">
              Review and manage employee leave requests
            </p>
          </div>
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
            <div className="rounded-lg border bg-card text-card-foreground">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="ps-6 py-4 font-medium">
                        Employee
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Leave Type
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Start Date
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        End Date
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
                            <Skeleton className="h-4 w-[120px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[80px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5 text-center">
                            <Skeleton className="h-8 w-[120px] mx-auto" />
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
                            <Users className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">
                              No leave requests found
                            </p>
                            <p className="text-sm">
                              Leave requests will appear here when employees
                              submit them
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

      {/* Leave Request Details Modal */}
      {selectedLeaveRequestId && (
        <LeaveRequestDetailsModal
          leaveRequestId={selectedLeaveRequestId}
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
        />
      )}

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

export default LeaveRequests;
