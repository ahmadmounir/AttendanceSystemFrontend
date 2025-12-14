/**
 * Add Employee Modal
 * Modal for adding new employees
 */

import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components";
import { showToast } from "@/shared/components/ui/toast-config";
import {
  createEmployee,
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

interface AddEmployeeModalProps {
  onEmployeeAdded: (employee: Employee) => void;
}

export function AddEmployeeModal({ onEmployeeAdded }: AddEmployeeModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      departmentId: "",
      jobId: "",
      shiftId: "",
      isSystemActive: true,
    },
  });

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
    if (!values.password?.trim()) {
      form.setError("password", { message: "Password is required" });
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
        password: values.password,
        departmentId: values.departmentId,
        jobId: values.jobId,
        shiftId: values.shiftId,
        countryId: "a001-ksa-001", // Default country
        roleId: "m2e3b5tmsbsers1sf3e", // Default member role
        isSystemActive: values.isSystemActive,
        endDate: null,
      };

      const response = await createEmployee(employeeData);

      if (response.success && response.data) {
        showToast.success("Employee created successfully");

        // Create employee object for local state update
        const newEmployee: Employee = {
          id: response.data,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          departmentId: values.departmentId,
          jobId: values.jobId,
          shiftId: values.shiftId,
          countryId: "a001-ksa-001",
          isSystemActive: values.isSystemActive,
          hireDate: new Date().toISOString(),
          startDate: new Date().toISOString(),
          endDate: null,
        };

        onEmployeeAdded(newEmployee);
        setOpen(false);
        form.reset();
      } else {
        showToast.error(response.message || "Failed to create employee");
      }
    } catch {
      showToast.error("Failed to create employee");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="me-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Create a new employee account with their details
          </DialogDescription>
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
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
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
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingData}>
                {isSubmitting ? "Creating..." : "Create Employee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
