/**
 * Create Department Modal
 * Modal for creating new departments
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { createDepartment } from "../../api/departmentsApi";
import type { Department } from "../../api/departmentsApi";

const formSchema = z.object({
  departmentName: z.string().min(1, { message: "Department name is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateDepartmentModalProps {
  onDepartmentCreated: (department: Department) => void;
}

export function CreateDepartmentModal({
  onDepartmentCreated,
}: CreateDepartmentModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departmentName: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await createDepartment(values);

      if (response.success && response.data) {
        showToast.success("Department created successfully");

        // Create department object with the returned ID
        const newDepartment: Department = {
          id: response.data,
          departmentName: values.departmentName,
          employeeCount: 0,
        };

        onDepartmentCreated(newDepartment);
        setOpen(false);
        form.reset();
      } else {
        showToast.error(response.message || "Failed to create department");
      }
    } catch {
      showToast.error("Failed to create department");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="me-2 h-4 w-4" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
          <DialogDescription>
            Add a new department to your organization
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
