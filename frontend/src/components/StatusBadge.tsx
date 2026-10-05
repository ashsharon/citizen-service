import type { RequestStatus } from "../api/client";

const STATUS_LABELS: Record<RequestStatus, string> = {
  submitted: "Submitted",
  in_review: "In review",
  in_progress: "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<RequestStatus, string> = {
  submitted: "#6b7280",
  in_review: "#b45309",
  in_progress: "#1d4ed8",
  resolved: "#15803d",
  rejected: "#b91c1c",
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      role="status"
      aria-label={`Status: ${STATUS_LABELS[status]}`}
      style={{
        backgroundColor: STATUS_COLORS[status],
        color: "white",
        padding: "2px 10px",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: 600,
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
