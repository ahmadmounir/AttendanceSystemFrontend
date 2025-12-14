/**
 * Edit Job Title Modal
 * Modal for editing existing job titles
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
} from "@/shared/components";
import { showToast } from "@/shared/components/ui/toast-config";
import { updateJobTitle } from "../../api/jobTitlesApi";
import type { JobTitle } from "../../api/jobTitlesApi";

interface FormValues {
  titleName: string;
  minSalary: number;
  maxSalary: number;
}

interface EditJobTitleModalProps {
  jobTitle: JobTitle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobTitleUpdated: (jobTitle: JobTitle) => void;
}

export function EditJobTitleModal({
  jobTitle,
  open,
  onOpenChange,
  onJobTitleUpdated,
}: EditJobTitleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      titleName: jobTitle.titleName,
      minSalary: jobTitle.minSalary,
      maxSalary: jobTitle.maxSalary,
    },
  });

  useEffect(() => {
    form.reset({
      titleName: jobTitle.titleName,
      minSalary: jobTitle.minSalary,
      maxSalary: jobTitle.maxSalary,
    });
  }, [jobTitle, form]);

  const onSubmit = async (values: FormValues) => {
    // Validation
    if (!values.titleName?.trim()) {
      form.setError("titleName", { message: "Job title name is required" });
      return;
    }
    if (values.minSalary <= 0) {
      form.setError("minSalary", {
        message: "Minimum salary must be greater than 0",
      });
      return;
    }
    if (values.maxSalary <= 0) {
      form.setError("maxSalary", {
        message: "Maximum salary must be greater than 0",
      });
      return;
    }
    if (values.maxSalary < values.minSalary) {
      form.setError("maxSalary", {
        message:
          "Maximum salary must be greater than or equal to minimum salary",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateJobTitle(jobTitle.id, values);

      if (response.success && response.data) {
        showToast.success("Job title updated successfully");
        onJobTitleUpdated(response.data);
        onOpenChange(false);
      } else {
        showToast.error(response.message || "Failed to update job title");
      }
    } catch {
      showToast.error("Failed to update job title");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Job Title</DialogTitle>
          <DialogDescription>
            Update the job title information and salary range
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Salary</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Salary</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
