/**
 * Job Titles Page
 * Manage employee job titles
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
import { MoreVertical, Trash2, Pencil, Briefcase } from "lucide-react";
import { showToast } from "@/shared/components/ui/toast-config";
import type { JobTitle } from "../api/jobTitlesApi";
import { getJobTitles, deleteJobTitle } from "../api/jobTitlesApi";
import { CreateJobTitleModal, EditJobTitleModal } from "../components";

// Memoized job title row component to prevent unnecessary re-renders
const JobTitleRow = React.memo(function JobTitleRow({
  jobTitle,
  onEditJobTitle,
  onDeleteJobTitle,
}: {
  jobTitle: JobTitle;
  onEditJobTitle: (jobTitle: JobTitle) => void;
  onDeleteJobTitle: (jobTitleId: string, titleName: string) => void;
}) {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="ps-6 py-4">
        <span className="font-medium">{jobTitle.titleName}</span>
      </TableCell>
      <TableCell className="px-6 py-3">
        <span className="text-muted-foreground">
          ${jobTitle.minSalary.toLocaleString()} - $
          {jobTitle.maxSalary.toLocaleString()}
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
            <DropdownMenuItem onClick={() => onEditJobTitle(jobTitle)}>
              <Pencil className="me-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteJobTitle(jobTitle.id, jobTitle.titleName)}
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

const JobTitles = () => {
  // Job titles management state
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [jobTitlesLoading, setJobTitlesLoading] = useState(true);
  const [jobTitlesError, setJobTitlesError] = useState(false);

  // Modal states
  const [editJobTitleOpen, setEditJobTitleOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState<JobTitle | null>(
    null
  );

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobTitleToDelete, setJobTitleToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch job titles data
  useEffect(() => {
    const fetchJobTitles = async () => {
      setJobTitlesLoading(true);
      setJobTitlesError(false);

      try {
        const response = await getJobTitles();

        if (response.success && response.data) {
          setJobTitles(response.data);
        } else {
          setJobTitlesError(true);
          showToast.error(response.message || "Failed to load job titles");
        }
      } catch {
        setJobTitlesError(true);
        showToast.error("Failed to load job titles");
      } finally {
        setJobTitlesLoading(false);
      }
    };

    fetchJobTitles();
  }, []);

  // Memoized handlers to prevent JobTitleRow re-renders
  const handleEditJobTitle = useCallback((jobTitle: JobTitle) => {
    setSelectedJobTitle(jobTitle);
    setEditJobTitleOpen(true);
  }, []);

  const handleJobTitleCreated = useCallback((newJobTitle: JobTitle) => {
    setJobTitles((prevJobTitles) => [...prevJobTitles, newJobTitle]);
  }, []);

  const handleJobTitleUpdated = useCallback(
    (updatedJobTitle: JobTitle) => {
      setJobTitles((prevJobTitles) =>
        prevJobTitles.map((jt) =>
          jt.id === updatedJobTitle.id ? updatedJobTitle : jt
        )
      );

      // Update selected job title if it's the same one
      if (selectedJobTitle?.id === updatedJobTitle.id) {
        setSelectedJobTitle(updatedJobTitle);
      }
    },
    [selectedJobTitle?.id]
  );

  const handleDeleteJobTitle = useCallback(
    (jobTitleId: string, titleName: string) => {
      // Open confirmation dialog
      setJobTitleToDelete({ id: jobTitleId, name: titleName });
      setDeleteDialogOpen(true);
    },
    []
  );

  const confirmDeleteJobTitle = useCallback(async () => {
    if (!jobTitleToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteJobTitle(jobTitleToDelete.id);

      if (response.success) {
        // Update local state
        setJobTitles((prevJobTitles) =>
          prevJobTitles.filter((jt) => jt.id !== jobTitleToDelete.id)
        );
        showToast.success("Job title deleted successfully");
        setDeleteDialogOpen(false);
        setJobTitleToDelete(null);
      } else {
        showToast.error(response.message || "Failed to delete job title");
      }
    } catch {
      showToast.error("Failed to delete job title");
    } finally {
      setIsDeleting(false);
    }
  }, [jobTitleToDelete]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-8">
        <PageHeader title="Job Titles" subtitle="Manage employee job titles" />

        <CreateJobTitleModal onJobTitleCreated={handleJobTitleCreated} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {jobTitlesError ? (
          <DataError
            title="Couldn't load job titles"
            message="Unable to load job titles"
            retryText="Refresh"
          />
        ) : (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="ps-6 py-4 font-medium">
                      Job Title
                    </TableHead>
                    <TableHead className="px-6 py-4 font-medium">
                      Salary Range
                    </TableHead>
                    <TableHead className="w-[100px] px-6 py-4 font-medium text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobTitlesLoading ? (
                    // Skeleton rows while loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell className="ps-6 py-5">
                          <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell className="px-6 py-5 text-center">
                          <Skeleton className="h-8 w-8 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : jobTitles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Briefcase className="h-12 w-12 mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-1">
                            No job titles yet
                          </p>
                          <p className="text-sm">
                            Create your first job title to get started
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobTitles.map((jobTitle) => (
                      <JobTitleRow
                        key={jobTitle.id}
                        jobTitle={jobTitle}
                        onEditJobTitle={handleEditJobTitle}
                        onDeleteJobTitle={handleDeleteJobTitle}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Job Title Modal */}
      {selectedJobTitle && (
        <EditJobTitleModal
          jobTitle={selectedJobTitle}
          onJobTitleUpdated={handleJobTitleUpdated}
          open={editJobTitleOpen}
          onOpenChange={(open) => {
            setEditJobTitleOpen(open);
            if (!open) setSelectedJobTitle(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Job Title"
        description={
          jobTitleToDelete
            ? `Are you sure you want to delete "${jobTitleToDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
        loadingText="Deleting..."
        onConfirm={confirmDeleteJobTitle}
      />
    </div>
  );
};

export default JobTitles;
