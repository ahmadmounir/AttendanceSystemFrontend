/**
 * Add Overtime Request Modal
 * Modal for employees to submit new overtime requests
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Calendar, Clock, FileText } from "lucide-react";
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
} from "@/shared/components";
import { showToast } from "@/shared/components/ui/toast-config";
import {
  createOvertimeRequest,
  type EmployeeOvertimeRequest,
} from "../api/overtimeRequestsApi";

interface FormValues {
  requestDate: string;
  hours: number;
  reason: string;
}

interface AddOvertimeRequestModalProps {
  employeeId: string;
  onRequestAdded: (request: EmployeeOvertimeRequest) => void;
}

export function AddOvertimeRequestModal({
  employeeId,
  onRequestAdded,
}: AddOvertimeRequestModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      requestDate: "",
      hours: 0,
      reason: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Validation
    if (!values.requestDate) {
      form.setError("requestDate", { message: "Request date is required" });
      return;
    }
    
    // Check if request date is before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(values.requestDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      form.setError("requestDate", {
        message: "Request date cannot be in the past",
      });
      return;
    }
    
    if (!values.hours || values.hours <= 0) {
      form.setError("hours", { message: "Hours must be greater than 0" });
      return;
    }
    if (values.hours > 24) {
      form.setError("hours", { message: "Hours cannot exceed 24" });
      return;
    }
    if (!values.reason?.trim()) {
      form.setError("reason", { message: "Reason is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Format date to match API requirements (YYYY-MM-DDTHH:mm:ss)
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0] + "T00:00:00";
      };

      const requestData = {
        requestDate: formatDate(values.requestDate),
        hours: values.hours,
        reason: values.reason,
      };

      const response = await createOvertimeRequest(employeeId, requestData);

      if (response.success && response.data) {
        showToast.success("Overtime request submitted successfully");

        // Create request object for local state update
        const newRequest: EmployeeOvertimeRequest = {
          id: response.data,
          employeeId: employeeId,
          requestDate: requestData.requestDate,
          hours: values.hours,
          reason: values.reason,
          status: "Pending",
        };

        onRequestAdded(newRequest);
        setOpen(false);
        form.reset();
      } else {
        showToast.error(
          response.message || "Failed to submit overtime request"
        );
      }
    } catch {
      showToast.error("Failed to submit overtime request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="me-2 h-4 w-4" />
          New Overtime Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Overtime Request</DialogTitle>
          <DialogDescription>
            Fill in the details for your overtime request
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="requestDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Date *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input 
                        type="date" 
                        className="ps-10" 
                        min={new Date().toISOString().split('T')[0]}
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        placeholder="e.g. 3.5"
                        className="ps-10"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        placeholder="Please provide a reason for your overtime request"
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
