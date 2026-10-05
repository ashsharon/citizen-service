import type { ServiceRequest } from "../api/client";
import StatusBadge from "./StatusBadge";

interface Props {
  requests: ServiceRequest[];
  onDelete: (id: number) => void;
}

export default function RequestList({ requests, onDelete }: Props) {
  if (requests.length === 0) {
    return <p>You haven't submitted any requests yet.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <caption style={{ textAlign: "left", marginBottom: 8 }}>Your service requests</caption>
      <thead>
        <tr>
          <th scope="col" style={{ textAlign: "left", padding: 8 }}>Title</th>
          <th scope="col" style={{ textAlign: "left", padding: 8 }}>Category</th>
          <th scope="col" style={{ textAlign: "left", padding: 8 }}>Status</th>
          <th scope="col" style={{ textAlign: "left", padding: 8 }}>Submitted</th>
          <th scope="col" style={{ textAlign: "left", padding: 8 }}>
            <span className="visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => (
          <tr key={r.id} style={{ borderTop: "1px solid #e5e7eb" }}>
            <td style={{ padding: 8 }}>{r.title}</td>
            <td style={{ padding: 8 }}>{r.category.replace("_", " ")}</td>
            <td style={{ padding: 8 }}>
              <StatusBadge status={r.status} />
            </td>
            <td style={{ padding: 8 }}>{new Date(r.created_at).toLocaleDateString()}</td>
            <td style={{ padding: 8 }}>
              <button
                onClick={() => onDelete(r.id)}
                aria-label={`Delete request: ${r.title}`}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
