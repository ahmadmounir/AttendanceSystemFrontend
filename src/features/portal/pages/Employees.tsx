/**
 * Employees Page
 * Manage employee records
 */

import { formatDate } from "@/shared/utils";
import {
  Loader,
  DataError,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Avatar,
  Badge,
  ConfirmDialog,
  PageHeader,
  Skeleton,
} from "@/shared/components";
import { Users, MoreVertical, Trash2, User, Pencil } from "lucide-react";
import { showToast } from "@/shared/components/ui/toast-config";
import { useEffect, useState, useMemo } from "react";
import type { Employee } from "../api/employeesApi";
import { getEmployees, deleteEmployee } from "../api/employeesApi";
import { getDepartments, type Department } from "../api/departmentsApi";
import { AddEmployeeModal, EditEmployeeModal } from "../components";
import { useProfile,  } from "@/shared/stores/profileStore";

const Employees = () => {
  const profile = useProfile();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Confirmation dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    (() => Promise<void>) | null
  >(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  // Helper function to show confirmation dialog
  const showConfirmDialog = (
    title: string,
    description: string,
    action: () => Promise<void>
  ) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setConfirmAction(() => action);
    setConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setIsConfirming(true);
    try {
      await confirmAction();
      setConfirmDialogOpen(false);
    } finally {
      setIsConfirming(false);
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const [employeesResponse, departmentsResponse] = await Promise.all([
          getEmployees(),
          getDepartments(),
        ]);

        if (employeesResponse.success && employeesResponse.data) {
          setEmployees(employeesResponse.data);
        } else {
          setError(true);
          showToast.error(
            employeesResponse.message || "Failed to load employees"
          );
        }

        if (departmentsResponse.success && departmentsResponse.data) {
          setDepartments(departmentsResponse.data);
        }
      } catch {
        setError(true);
        showToast.error("An error occurred while loading employees");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle employee added
  const handleEmployeeAdded = (employee: Employee) => {
    setEmployees((prev) => [...prev, employee]);
  };

  // Handle employee updated
  const handleEmployeeUpdated = (updatedEmployee: Employee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
  };

  // Memoize table rows
  const tableRows = useMemo(() => {
    const handleEdit = (employee: Employee) => {
      setSelectedEmployee(employee);
      setEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
      showConfirmDialog(
        "Delete Employee",
        "Are you sure you want to delete this employee? This action cannot be undone.",
        async () => {
          try {
            const response = await deleteEmployee(id);

            if (response.success) {
              setEmployees((prev) => prev.filter((emp) => emp.id !== id));
              showToast.success("Employee deleted successfully");
            } else {
              showToast.error(response.message || "Failed to delete employee");
            }
          } catch {
            showToast.error("Failed to delete employee");
          }
        }
      );
    };

    const getDeptName = (departmentId: string) => {
      const dept = departments.find((d) => d.id === departmentId);
      return dept?.departmentName || "Unknown";
    };

    return employees.map((employee) => (
      <TableRow key={employee.id} className="hover:bg-muted/50">
        <TableCell className="ps-6 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 flex items-center justify-center bg-blue-100">
              <User className="h-5 w-5 text-blue-800" />
            </Avatar>
            <span className="font-medium">
              {employee.firstName} {employee.lastName}
            </span>
          </div>
        </TableCell>
        <TableCell className="px-6 py-3">{employee.email}</TableCell>
        <TableCell className="px-6 py-3">
          {getDeptName(employee.departmentId)}
        </TableCell>
        <TableCell className="px-6 py-3 text-nowrap text-muted-foreground">
          {formatDate(employee.hireDate)}
        </TableCell>
        <TableCell className="px-6 py-3">
          <Badge variant={employee.isSystemActive ? "success" : "error"}>
            {employee.isSystemActive ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell className="px-6 py-3 text-center">
          {employee.email !== profile?.username ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(employee)}>
                  <Pencil className="me-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(employee.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="me-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-muted-foreground text-xs"></span>
          )}
        </TableCell>
      </TableRow>
    ));
  }, [employees, departments]);

  if (loading) {
    return <Loader text="Loading employees..." />;
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-8">
          <div>
            <PageHeader title="Employees" />
            <p className="text-sm text-muted-foreground mt-1">
              Manage your company employees and their information
            </p>
          </div>

          <AddEmployeeModal onEmployeeAdded={handleEmployeeAdded} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto pb-6">
          {error ? (
            <DataError
              title="Couldn't load employees"
              message="Unable to load employees data. Please try again."
              retryText="Try Again"
            />
          ) : (
            <div className="rounded-lg border bg-card text-card-foreground">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="ps-6 py-4 font-medium">
                        Name
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Email
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Department
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Hire Date
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium">
                        Status
                      </TableHead>
                      <TableHead className="w-[100px] px-6 py-4 font-medium text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Skeleton rows while loading
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell className="ps-6 py-5">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-9 w-9 rounded-full" />
                              <Skeleton className="h-4 w-[150px]" />
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[180px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[120px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[120px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[60px]" />
                          </TableCell>
                          <TableCell className="px-6 py-5 text-center">
                            <Skeleton className="h-8 w-8 mx-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : employees.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="px-6 py-12 text-center"
                        >
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Users className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">
                              No employees found
                            </p>
                            <p className="text-sm">
                              Get started by adding your first employee
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tableRows
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Employee Modal */}
      {selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onEmployeeUpdated={handleEmployeeUpdated}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={confirmTitle}
        description={confirmDescription}
        confirmText="Confirm"
        variant="destructive"
        isLoading={isConfirming}
        loadingText="Loading..."
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Employees;
