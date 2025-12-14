/**
 * Edit Department Modal
 * Modal for editing existing departments
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { updateDepartment } from "../../api/departmentsApi";
import type { Department } from "../../api/departmentsApi";

const formSchema = z.object({
  departmentName: z.string().min(1, { message: "Department name is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditDepartmentModalProps {
  department: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDepartmentUpdated: (department: Department) => void;
}

export function EditDepartmentModal({
  department,
  open,
  onOpenChange,
  onDepartmentUpdated,
}: EditDepartmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departmentName: department.departmentName,
    },
  });

  // Reset form when department changes
  useEffect(() => {
    form.reset({
      departmentName: department.departmentName,
    });
  }, [department, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await updateDepartment(department.id, values);

      if (response.success) {
        showToast.success("Department updated successfully");

        // Create updated department object
        const updatedDepartment: Department = {
          ...department,
          departmentName: values.departmentName,
        };

        onDepartmentUpdated(updatedDepartment);
        onOpenChange(false);
      } else {
        showToast.error(response.message || "Failed to update department");
      }
    } catch {
      showToast.error("Failed to update department");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Update the department information
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="departmentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Human Resources" {...field} />
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
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
