/**
 * Send Notification Modal
 * Modal for sending notifications to employees
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { sendNotification } from "../api/notificationsApi";

interface FormValues {
  title: string;
  description: string;
}

interface SendNotificationModalProps {
  employeeId: string;
  employeeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendNotificationModal({
  employeeId,
  employeeName,
  open,
  onOpenChange,
}: SendNotificationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Validation
    if (!values.title.trim()) {
      form.setError("title", { message: "Title is required" });
      return;
    }

    if (!values.description.trim()) {
      form.setError("description", { message: "Description is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendNotification(employeeId, {
        title: values.title.trim(),
        description: values.description.trim(),
      });

      if (response.success) {
        showToast.success(`Notification sent to ${employeeName}`);
        onOpenChange(false);
        form.reset();
      } else {
        showToast.error(response.message || "Failed to send notification");
      }
    } catch {
      showToast.error("Failed to send notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Send a notification to {employeeName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter notification title"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter notification description"
                      rows={5}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Send className="me-2 h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Notification"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
