/**
 * Notifications Page (Employee)
 * View and manage notifications
 */

import { useEffect, useState, useMemo } from "react";
import {
  Loader,
  DataError,
  PageHeader,
  Button,
  Badge,
} from "@/shared/components";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Calendar,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";
import { showToast } from "@/shared/components/ui/toast-config";
import {
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from "../api/notificationsApi";
import { cn } from "@/shared/utils/cn";

type FilterType = "all" | "unread" | "read";

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [markingIds, setMarkingIds] = useState<Set<string>>(new Set());

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await getNotifications();

      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        setError(true);
        showToast.error(response.message || "Failed to load notifications");
      }
    } catch {
      setError(true);
      showToast.error("An error occurred while loading notifications");
    } finally {
      setLoading(false);
    }
  };

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case "unread":
        return notifications.filter((n) => !n.markedAsRead);
      case "read":
        return notifications.filter((n) => n.markedAsRead);
      default:
        return notifications;
    }
  }, [notifications, filter]);

  // Count unread
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.markedAsRead).length;
  }, [notifications]);

  // Handle mark as read/unread
  const handleMarkAsRead = async (
    notificationId: string,
    markedAsRead: boolean
  ) => {
    setMarkingIds((prev) => new Set(prev).add(notificationId));

    try {
      const response = await markNotificationAsRead(
        notificationId,
        markedAsRead
      );

      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, markedAsRead } : n
          )
        );
        showToast.success(
          markedAsRead
            ? "Notification marked as read"
            : "Notification marked as unread"
        );
      } else {
        showToast.error(response.message || "Failed to update notification");
      }
    } catch {
      showToast.error("Failed to update notification");
    } finally {
      setMarkingIds((prev) => {
        const next = new Set(prev);
        next.delete(notificationId);
        return next;
      });
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.markedAsRead);

    if (unreadNotifications.length === 0) {
      showToast.info("No unread notifications");
      return;
    }

    try {
      const promises = unreadNotifications.map((n) =>
        markNotificationAsRead(n.id, true)
      );

      await Promise.all(promises);

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, markedAsRead: true }))
      );

      showToast.success("All notifications marked as read");
    } catch {
      showToast.error("Failed to mark all as read");
    }
  };

  // Get notification icon based on title
  const getNotificationIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("approved")) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (titleLower.includes("rejected")) {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
    if (titleLower.includes("pending")) {
      return <Clock className="h-5 w-5 text-yellow-600" />;
    }
    if (titleLower.includes("reminder") || titleLower.includes("due")) {
      return <Calendar className="h-5 w-5 text-blue-600" />;
    }
    return <Info className="h-5 w-5 text-blue-600" />;
  };

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (loading) {
    return <Loader text="Loading notifications..." />;
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div>
              <PageHeader title="Notifications" />
              <p className="text-sm text-muted-foreground mt-1">
                Stay updated with your latest notifications
              </p>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                filter === "all"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
              <Badge
                variant="secondary"
                className="ms-2 h-5 min-w-5 px-1.5 text-xs"
              >
                {notifications.length}
              </Badge>
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                filter === "unread"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Unread
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ms-2 h-5 min-w-5 px-1.5 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setFilter("read")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                filter === "read"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Read
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto pb-6">
          {error ? (
            <DataError
              title="Couldn't load notifications"
              message="Unable to load notifications data. Please try again."
              retryText="Try Again"
            />
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                {filter === "unread" ? (
                  <BellOff className="h-12 w-12 text-muted-foreground" />
                ) : (
                  <Bell className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {filter === "unread"
                  ? "No unread notifications"
                  : filter === "read"
                  ? "No read notifications"
                  : "No notifications yet"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {filter === "unread"
                  ? "You're all caught up! Check back later for new updates."
                  : filter === "read"
                  ? "You haven't read any notifications yet."
                  : "Notifications will appear here when you receive them."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const isMarking = markingIds.has(notification.id);

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md",
                      !notification.markedAsRead &&
                        "border-l-4 border-l-primary"
                    )}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        )}
                      >
                        {getNotificationIcon(notification.title)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={cn("text-sm font-semibold")}>
                            {notification.title}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.descr}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{getRelativeTime(notification.createdAt)}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {!notification.markedAsRead && (
                        <div className="shrink-0 flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleMarkAsRead(notification.id, true)
                            }
                            disabled={isMarking}
                            className="h-8 w-8 p-0 transition-opacity"
                            title="Mark as read"
                          >
                            {isMarking ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
