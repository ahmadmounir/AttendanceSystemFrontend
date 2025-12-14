/**
 * Create Job Title Modal
 * Modal for creating new job titles
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
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
} from "@/shared/components";
import { showToast } from "@/shared/components/ui/toast-config";
import { createJobTitle } from "../../api/jobTitlesApi";
import type { JobTitle } from "../../api/jobTitlesApi";

interface FormValues {
  titleName: string;
  minSalary: number;
  maxSalary: number;
}

interface CreateJobTitleModalProps {
  onJobTitleCreated: (jobTitle: JobTitle) => void;
}

export function CreateJobTitleModal({
  onJobTitleCreated,
}: CreateJobTitleModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      titleName: "",
      minSalary: 0,
      maxSalary: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Validation
    if (!values.titleName?.trim()) {
      form.setError("titleName", { message: "Job title name is required" });
      return;
    }
    if (values.minSalary < 0) {
      form.setError("minSalary", {
        message: "Minimum salary must be greater than 0",
      });
      return;
    }
    if (values.maxSalary < 0) {
      form.setError("maxSalary", {
        message: "Maximum salary must be greater than 0",
      });
      return;
    }
    if (values.maxSalary <= values.minSalary) {
      form.setError("maxSalary", {
        message:
          "Maximum salary must be greater than or equal to minimum salary",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createJobTitle(values);

      if (response.success && response.data) {
        showToast.success("Job title created successfully");

        // Create job title object with the returned ID
        const newJobTitle: JobTitle = {
          id: response.data,
          titleName: values.titleName,
          minSalary: values.minSalary,
          maxSalary: values.maxSalary,
        };

        onJobTitleCreated(newJobTitle);
        setOpen(false);
        form.reset();
      } else {
        showToast.error(response.message || "Failed to create job title");
      }
    } catch {
      showToast.error("Failed to create job title");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="me-2 h-4 w-4" />
          Add Job Title
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Job Title</DialogTitle>
          <DialogDescription>
            Add a new job title with salary range
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
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
