/**
 * Overtime Request Details Modal
 * Modal for viewing overtime request details
 */

import { useEffect, useState, useCallback } from "react";
import { Info, Calendar, Clock, FileText, User } from "lucide-react";
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
import {
  getOvertimeRequest,
  type OvertimeRequest,
} from "../api/overtimeRequestsApi";
import { formatDate } from "@/shared/utils";

interface OvertimeRequestDetailsModalProps {
  overtimeRequestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OvertimeRequestDetailsModal({
  overtimeRequestId,
  open,
  onOpenChange,
}: OvertimeRequestDetailsModalProps) {
  const [overtimeRequest, setOvertimeRequest] =
    useState<OvertimeRequest | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOvertimeRequest = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOvertimeRequest(overtimeRequestId);

      if (response.success && response.data) {
        setOvertimeRequest(response.data);
      } else {
        showToast.error(
          response.message || "Failed to load overtime request details"
        );
        onOpenChange(false);
      }
    } catch {
      showToast.error("Failed to load overtime request details");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }, [overtimeRequestId, onOpenChange]);

  useEffect(() => {
    if (open && overtimeRequestId) {
      fetchOvertimeRequest();
    }
  }, [open, overtimeRequestId, fetchOvertimeRequest]);

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
          <DialogTitle>Overtime Request Details</DialogTitle>
          <DialogDescription>
            View detailed information about this overtime request
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : overtimeRequest ? (
          <div className="space-y-4">
            {/* Employee Name */}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Employee
                </p>
                <p className="text-base font-semibold">
                  {overtimeRequest.employeeName}
                </p>
              </div>
            </div>

            {/* Request Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Request Date
                </p>
                <p className="text-base font-semibold">
                  {formatDate(overtimeRequest.requestDate)}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Hours
                </p>
                <p className="text-base font-semibold">
                  {overtimeRequest.hours}h
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
                <Badge variant={getStatusBadgeVariant(overtimeRequest.status)}>
                  {overtimeRequest.status}
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
                  {overtimeRequest.reason}
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
