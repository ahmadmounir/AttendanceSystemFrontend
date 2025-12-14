/**
 * Edit Employee Modal
 * Modal for editing existing employees
 */

import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components";
import { showToast } from "@/shared/components/ui/toast-config";
import {
  updateEmployee,
  type Employee,
  type EmployeeFormData,
} from "../api/employeesApi";
import { getDepartments, type Department } from "../api/departmentsApi";
import { getJobTitles, type JobTitle } from "../api/jobTitlesApi";
import { getShifts, type Shift } from "../api/shiftsApi";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  departmentId: string;
  jobId: string;
  shiftId: string;
  isSystemActive: boolean;
}

interface EditEmployeeModalProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeUpdated: (employee: Employee) => void;
}

export function EditEmployeeModal({
  employee,
  open,
  onOpenChange,
  onEmployeeUpdated,
}: EditEmployeeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      password: "",
      departmentId: employee.departmentId,
      jobId: employee.jobId,
      shiftId: employee.shiftId,
      isSystemActive: employee.isSystemActive,
    },
  });

  // Reset form when employee changes
  useEffect(() => {
    form.reset({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      password: "",
      departmentId: employee.departmentId,
      jobId: employee.jobId,
      shiftId: employee.shiftId,
      isSystemActive: employee.isSystemActive,
    });
  }, [employee, form]);

  // Fetch dropdown data when modal opens
  useEffect(() => {
    if (open) {
      fetchDropdownData();
    }
  }, [open]);

  const fetchDropdownData = async () => {
    setIsLoadingData(true);
    try {
      const [deptResponse, jobResponse, shiftResponse] = await Promise.all([
        getDepartments(),
        getJobTitles(),
        getShifts(),
      ]);

      if (deptResponse.success && deptResponse.data) {
        setDepartments(deptResponse.data);
      }
      if (jobResponse.success && jobResponse.data) {
        setJobTitles(jobResponse.data);
      }
      if (shiftResponse.success && shiftResponse.data) {
        setShifts(shiftResponse.data);
      }
    } catch {
      showToast.error("Failed to load form data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    // Validation
    if (!values.firstName?.trim()) {
      form.setError("firstName", { message: "First name is required" });
      return;
    }
    if (!values.email?.trim()) {
      form.setError("email", { message: "Email is required" });
      return;
    }
    if (!values.departmentId) {
      form.setError("departmentId", { message: "Department is required" });
      return;
    }
    if (!values.jobId) {
      form.setError("jobId", { message: "Job title is required" });
      return;
    }
    if (!values.shiftId) {
      form.setError("shiftId", { message: "Shift is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      const employeeData: EmployeeFormData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password || "Ax@12345", // Use provided password or default
        departmentId: values.departmentId,
        jobId: values.jobId,
        shiftId: values.shiftId,
        countryId: employee.countryId,
        roleId: "m2e3b5tmsbsers1sf3e", // Default member role
        isSystemActive: values.isSystemActive,
        endDate: employee.endDate,
      };

      const response = await updateEmployee(employee.id, employeeData);

      if (response.success) {
        showToast.success("Employee updated successfully");

        // Update local state
        const updatedEmployee: Employee = {
          ...employee,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          departmentId: values.departmentId,
          jobId: values.jobId,
          shiftId: values.shiftId,
          isSystemActive: values.isSystemActive,
        };

        onEmployeeUpdated(updatedEmployee);
        onOpenChange(false);
      } else {
        showToast.error(response.message || "Failed to update employee");
      }
    } catch {
      showToast.error("Failed to update employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatShiftDisplay = (shift: Shift) => {
    return `${shift.shiftName} (${shift.startTime.substring(
      0,
      5
    )} - ${shift.endTime.substring(0, 5)})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>Update employee details</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+905551234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Leave empty to keep current"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingData}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingData}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobTitles.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.titleName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shiftId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shift *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingData}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shifts.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {formatShiftDisplay(shift)}
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
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingData}>
                {isSubmitting ? "Updating..." : "Update Employee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
