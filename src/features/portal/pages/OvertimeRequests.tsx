/**
 * Overtime Requests Page (Portal)
 * Manage all employee overtime requests
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
import type { OvertimeRequest } from "../api/overtimeRequestsApi";
import {
  getOvertimeRequests,
  reviewOvertimeRequest,
} from "../api/overtimeRequestsApi";
import { OvertimeRequestDetailsModal } from "../components";

const OvertimeRequests = () => {
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Details modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOvertimeRequestId, setSelectedOvertimeRequestId] =
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

  // Fetch overtime requests
  useEffect(() => {
    const fetchOvertimeRequests = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await getOvertimeRequests();

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

    fetchOvertimeRequests();
  }, []);

  // Handle view details
  const handleViewDetails = (id: string) => {
    setSelectedOvertimeRequestId(id);
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
    const handleApproveClick = (id: string, employeeName: string) => {
      showConfirmDialog(
        "Approve Overtime Request",
        `Are you sure you want to approve the overtime request for ${employeeName}?`,
        async () => {
          try {
            const response = await reviewOvertimeRequest(id, {
              status: "Approved",
            });

            if (response.success) {
              setOvertimeRequests((prev) =>
                prev.map((req) =>
                  req.id === id ? { ...req, status: "Approved" } : req
                )
              );
              showToast.success("Overtime request approved successfully");
            } else {
              showToast.error(
                response.message || "Failed to approve overtime request"
              );
            }
          } catch {
            showToast.error("Failed to approve overtime request");
          }
        }
      );
    };

    const handleRejectClick = (id: string, employeeName: string) => {
      showConfirmDialog(
        "Reject Overtime Request",
        `Are you sure you want to reject the overtime request for ${employeeName}?`,
        async () => {
          try {
            const response = await reviewOvertimeRequest(id, {
              status: "Rejected",
            });

            if (response.success) {
              setOvertimeRequests((prev) =>
                prev.map((req) =>
                  req.id === id ? { ...req, status: "Rejected" } : req
                )
              );
              showToast.success("Overtime request rejected successfully");
            } else {
              showToast.error(
                response.message || "Failed to reject overtime request"
              );
            }
          } catch {
            showToast.error("Failed to reject overtime request");
          }
        }
      );
    };

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
                <User
                  className={`h-5 w-5 ${getAvatarIconColor(request.status)}`}
                />
              </Avatar>
              <span className="font-medium">{request.employeeName}</span>
            </div>
          </TableCell>
          <TableCell className="px-6 py-3 text-nowrap text-muted-foreground">
            {formatDate(request.requestDate)}
          </TableCell>
          <TableCell className="px-6 py-3">{request.hours}h</TableCell>
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
                      handleApproveClick(request.id, request.employeeName)
                    }
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() =>
                      handleRejectClick(request.id, request.employeeName)
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
  }, [overtimeRequests]);

  if (loading) {
    return <Loader text="Loading overtime requests..." />;
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-8">
          <div>
            <PageHeader title="Overtime Requests" />
            <p className="text-sm text-muted-foreground mt-1">
              Review and manage employee overtime requests
            </p>
          </div>
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
            <div className="rounded-lg border bg-card text-card-foreground">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="ps-6 py-4 font-medium">
                        Employee
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Request Date
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Hours
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
                            <Skeleton className="h-4 w-[100px]" />
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
                    ) : overtimeRequests.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="px-6 py-12 text-center"
                        >
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Users className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">
                              No overtime requests found
                            </p>
                            <p className="text-sm">
                              Overtime requests will appear here when employees
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

      {/* Overtime Request Details Modal */}
      {selectedOvertimeRequestId && (
        <OvertimeRequestDetailsModal
          overtimeRequestId={selectedOvertimeRequestId}
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

export default OvertimeRequests;
