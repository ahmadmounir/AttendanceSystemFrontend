/**
 * Add Leave Request Modal
 * Modal for employees to submit new leave requests
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Calendar, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components";
import { showToast } from "@/shared/components/ui/toast-config";
import {
  createLeaveRequest,
  getLeaveTypes,
  type EmployeeLeaveRequest,
  type LeaveType,
} from "../api/leaveRequestsApi";

interface FormValues {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface AddLeaveRequestModalProps {
  employeeId: string;
  onRequestAdded: (request: EmployeeLeaveRequest) => void;
}

export function AddLeaveRequestModal({
  employeeId,
  onRequestAdded,
}: AddLeaveRequestModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  // Fetch leave types when modal opens
  useEffect(() => {
    if (open) {
      fetchLeaveTypes();
    }
  }, [open]);

  const fetchLeaveTypes = async () => {
    setIsLoadingTypes(true);
    try {
      const response = await getLeaveTypes();

      if (response.success && response.data) {
        setLeaveTypes(response.data);
      } else {
        showToast.error(response.message || "Failed to load leave types");
      }
    } catch {
      showToast.error("Failed to load leave types");
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    // Validation
    if (!values.leaveTypeId) {
      form.setError("leaveTypeId", { message: "Please select a leave type" });
      return;
    }
    if (!values.startDate) {
      form.setError("startDate", { message: "Start date is required" });
      return;
    }
    if (!values.endDate) {
      form.setError("endDate", { message: "End date is required" });
      return;
    }
    if (!values.reason?.trim()) {
      form.setError("reason", { message: "Reason is required" });
      return;
    }

    // Check if end date is after start date
    if (new Date(values.endDate) < new Date(values.startDate)) {
      form.setError("endDate", {
        message: "End date must be after start date",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Format dates to match API requirements (YYYY-MM-DDTHH:mm:ss)
      const formatDate = (dateStr: string, isEnd: boolean) => {
        const date = new Date(dateStr);
        const time = isEnd ? "T17:00:00" : "T09:00:00";
        return date.toISOString().split("T")[0] + time;
      };

      const requestData = {
        leaveTypeId: values.leaveTypeId,
        startDate: formatDate(values.startDate, false),
        endDate: formatDate(values.endDate, true),
        reason: values.reason,
      };

      const response = await createLeaveRequest(employeeId, requestData);

      if (response.success && response.data) {
        showToast.success("Leave request submitted successfully");

        // Create request object for local state update
        const newRequest: EmployeeLeaveRequest = {
          id: response.data,
          employeeId: employeeId,
          leaveTypeId: values.leaveTypeId,
          startDate: requestData.startDate,
          endDate: requestData.endDate,
          reason: values.reason,
          status: "Pending",
        };

        onRequestAdded(newRequest);
        setOpen(false);
        form.reset();
      } else {
        showToast.error(response.message || "Failed to submit leave request");
      }
    } catch {
      showToast.error("Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="me-2 h-4 w-4" />
          New Leave Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Leave Request</DialogTitle>
          <DialogDescription>
            Fill in the details for your leave request
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="leaveTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingTypes || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingTypes
                              ? "Loading leave types..."
                              : "Select leave type"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.typeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input type="date" className="ps-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input type="date" className="ps-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Textarea
                        placeholder="Please provide a reason for your leave request"
                        className="ps-10 min-h-[100px]"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingTypes}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
