/**
 * Attend Employee Modal
 * Modal for marking employee attendance
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components";
import { showToast } from "@/shared/components/ui/toast-config";
import {
  createAttendanceLog,
  type AttendanceLog,
} from "../api/attendanceLogsApi";
import { getEmployees, type Employee } from "../api/employeesApi";

interface FormValues {
  employeeId: string;
}

interface AttendEmployeeModalProps {
  onEmployeeAttended: (log: AttendanceLog) => void;
  attendedEmployeeIds: string[];
}

export function AttendEmployeeModal({
  onEmployeeAttended,
  attendedEmployeeIds,
}: AttendEmployeeModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      employeeId: "",
    },
  });

  // Fetch employees when modal opens
  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const response = await getEmployees();

      if (response.success && response.data) {
        // Filter out employees who already attended today
        const availableEmployees = response.data.filter(
          (emp) => !attendedEmployeeIds.includes(emp.id)
        );
        setEmployees(availableEmployees);
      } else {
        showToast.error(response.message || "Failed to load employees");
      }
    } catch {
      showToast.error("Failed to load employees");
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    // Validation
    if (!values.employeeId) {
      form.setError("employeeId", { message: "Please select an employee" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createAttendanceLog({ id: values.employeeId });

      if (response.success && response.data) {
        showToast.success("Employee attendance marked successfully");

        // Find the employee to get full details
        const employee = employees.find((emp) => emp.id === values.employeeId);

        // Create attendance log for local state update
        const newLog: AttendanceLog = {
          id: response.data,
          employeeId: values.employeeId,
          employeeFullName: employee
            ? `${employee.firstName} ${employee.lastName}`
            : "Unknown",
          clockInTime: new Date().toISOString(),
          clockOutTime: null,
          totalHours: 0,
        };

        onEmployeeAttended(newLog);
        setOpen(false);
        form.reset();
      } else {
        showToast.error(response.message || "Failed to mark attendance");
      }
    } catch {
      showToast.error("Failed to mark attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="me-2 h-4 w-4" />
          Attend Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Employee Attendance</DialogTitle>
          <DialogDescription>
            Select an employee to mark their attendance for today
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingEmployees || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingEmployees
                              ? "Loading employees..."
                              : employees.length === 0
                              ? "No employees available"
                              : "Select employee"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName} -{" "}
                          {employee.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <Button
                type="submit"
                disabled={
                  isSubmitting || isLoadingEmployees || employees.length === 0
                }
              >
                {isSubmitting ? "Marking..." : "Mark Attendance"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
