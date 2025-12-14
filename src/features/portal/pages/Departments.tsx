/**
 * Departments Page
 * Manage company departments
 */

import React, { useEffect, useState, useCallback } from "react";
import {
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
  ConfirmDialog,
  Skeleton,
} from "@/shared/components";
import { PageHeader } from "@/shared/components/ui";
import { MoreVertical, Trash2, Pencil, Building2 } from "lucide-react";
import { showToast } from "@/shared/components/ui/toast-config";
import type { Department } from "../api/departmentsApi";
import { getDepartments, deleteDepartment } from "../api/departmentsApi";
import { CreateDepartmentModal, EditDepartmentModal } from "../components";

// Memoized department row component to prevent unnecessary re-renders
const DepartmentRow = React.memo(function DepartmentRow({
  department,
  onEditDepartment,
  onDeleteDepartment,
}: {
  department: Department;
  onEditDepartment: (department: Department) => void;
  onDeleteDepartment: (departmentId: string, departmentName: string) => void;
}) {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="ps-6 py-4">
        <span className="font-medium">{department.departmentName}</span>
      </TableCell>
      <TableCell className="px-6 py-3 text-center">
        <span className="text-muted-foreground">
          {department.employeeCount || 0}
        </span>
      </TableCell>
      <TableCell className="px-6 py-3 text-center">
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
            <DropdownMenuItem onClick={() => onEditDepartment(department)}>
              <Pencil className="me-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onDeleteDepartment(department.id, department.departmentName)
              }
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="me-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

const Departments = () => {
  // Departments management state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState(false);

  // Modal states
  const [editDepartmentOpen, setEditDepartmentOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch departments data
  useEffect(() => {
    const fetchDepartments = async () => {
      setDepartmentsLoading(true);
      setDepartmentsError(false);

      try {
        const response = await getDepartments();

        if (response.success && response.data) {
          setDepartments(response.data);
        } else {
          setDepartmentsError(true);
          showToast.error(response.message || "Failed to load departments");
        }
      } catch {
        setDepartmentsError(true);
        showToast.error("Failed to load departments");
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Memoized handlers to prevent DepartmentRow re-renders
  const handleEditDepartment = useCallback((department: Department) => {
    setSelectedDepartment(department);
    setEditDepartmentOpen(true);
  }, []);

  const handleDepartmentCreated = useCallback((newDepartment: Department) => {
    setDepartments((prevDepartments) => [...prevDepartments, newDepartment]);
  }, []);

  const handleDepartmentUpdated = useCallback(
    (updatedDepartment: Department) => {
      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept.id === updatedDepartment.id ? updatedDepartment : dept
        )
      );

      // Update selected department if it's the same one
      if (selectedDepartment?.id === updatedDepartment.id) {
        setSelectedDepartment(updatedDepartment);
      }
    },
    [selectedDepartment?.id]
  );

  const handleDeleteDepartment = useCallback(
    (departmentId: string, departmentName: string) => {
      // Open confirmation dialog
      setDepartmentToDelete({ id: departmentId, name: departmentName });
      setDeleteDialogOpen(true);
    },
    []
  );

  const confirmDeleteDepartment = useCallback(async () => {
    if (!departmentToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteDepartment(departmentToDelete.id);

      if (response.success) {
        // Update local state
        setDepartments((prevDepartments) =>
          prevDepartments.filter((dept) => dept.id !== departmentToDelete.id)
        );
        showToast.success("Department deleted successfully");
        setDeleteDialogOpen(false);
        setDepartmentToDelete(null);
      } else {
        showToast.error(response.message || "Failed to delete department");
      }
    } catch {
      showToast.error("Failed to delete department");
    } finally {
      setIsDeleting(false);
    }
  }, [departmentToDelete]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-8">
        <PageHeader title="Departments" subtitle="Manage company departments" />

        <CreateDepartmentModal onDepartmentCreated={handleDepartmentCreated} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {departmentsError ? (
          <DataError
            title="Couldn't load departments"
            message="Unable to load departments"
            retryText="Refresh"
          />
        ) : (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="ps-6 py-4 font-medium">
                      Department Name
                    </TableHead>
                    <TableHead className="px-6 py-4 font-medium text-center">
                      Employees
                    </TableHead>
                    <TableHead className="w-[100px] px-6 py-4 font-medium text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentsLoading ? (
                    // Skeleton rows while loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell className="ps-6 py-5">
                          <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell className="px-6 py-5 text-center">
                          <Skeleton className="h-4 w-[40px] mx-auto" />
                        </TableCell>
                        <TableCell className="px-6 py-5 text-center">
                          <Skeleton className="h-8 w-8 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : departments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Building2 className="h-12 w-12 mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-1">
                            No departments yet
                          </p>
                          <p className="text-sm">
                            Create your first department to get started
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((department) => (
                      <DepartmentRow
                        key={department.id}
                        department={department}
                        onEditDepartment={handleEditDepartment}
                        onDeleteDepartment={handleDeleteDepartment}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Department Modal */}
      {selectedDepartment && (
        <EditDepartmentModal
          department={selectedDepartment}
          onDepartmentUpdated={handleDepartmentUpdated}
          open={editDepartmentOpen}
          onOpenChange={(open) => {
            setEditDepartmentOpen(open);
            if (!open) setSelectedDepartment(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Department"
        description={
          departmentToDelete
            ? `Are you sure you want to delete "${departmentToDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
        loadingText="Deleting..."
        onConfirm={confirmDeleteDepartment}
      />
    </div>
  );
};

export default Departments;
