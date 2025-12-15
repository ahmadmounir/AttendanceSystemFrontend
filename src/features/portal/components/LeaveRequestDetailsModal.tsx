/**
 * Leave Request Details Modal
 * Modal for viewing leave request details
 */

import { useEffect, useState } from "react";
import { Info, Calendar, FileText, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
} from "@/shared/components";
import { showToast } from "@/shared/components/ui/toast-config";
import { getLeaveRequest, type LeaveRequest } from "../api/leaveRequestsApi";
import { formatDate } from "@/shared/utils";

interface LeaveRequestDetailsModalProps {
  leaveRequestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeaveRequestDetailsModal({
  leaveRequestId,
  open,
  onOpenChange,
}: LeaveRequestDetailsModalProps) {
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && leaveRequestId) {
      fetchLeaveRequest();
    }
  }, [open, leaveRequestId]);

  const fetchLeaveRequest = async () => {
    setLoading(true);
    try {
      const response = await getLeaveRequest(leaveRequestId);

      if (response.success && response.data) {
        setLeaveRequest(response.data);
      } else {
        showToast.error(
          response.message || "Failed to load leave request details"
        );
        onOpenChange(false);
      }
    } catch {
      showToast.error("Failed to load leave request details");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
          <DialogDescription>
            View detailed information about this leave request
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : leaveRequest ? (
          <div className="space-y-4">
            {/* Employee Name */}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Employee
                </p>
                <p className="text-base font-semibold">
                  {leaveRequest.employeeName}
                </p>
              </div>
            </div>

            {/* Leave Type */}
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Leave Type
                </p>
                <p className="text-base font-semibold">
                  {leaveRequest.typeName}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Duration
                </p>
                <p className="text-base">
                  <span className="font-semibold">
                    {formatDate(leaveRequest.startDate)}
                  </span>
                  {" → "}
                  <span className="font-semibold">
                    {formatDate(leaveRequest.endDate)}
                  </span>
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Status
                </p>
                <Badge variant={getStatusBadgeVariant(leaveRequest.status)}>
                  {leaveRequest.status}
                </Badge>
              </div>
            </div>

            {/* Reason */}
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Reason
                </p>
                <p className="text-base text-foreground/80">
                  {leaveRequest.reason}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">No data available</div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
