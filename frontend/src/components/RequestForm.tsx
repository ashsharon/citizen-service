import { useState, FormEvent } from "react";
import type { NewServiceRequest, RequestCategory } from "../api/client";

interface Props {
  onSubmit: (payload: NewServiceRequest) => Promise<void>;
}

const CATEGORY_OPTIONS: { value: RequestCategory; label: string }[] = [
  { value: "road_damage", label: "Road damage" },
  { value: "streetlight", label: "Streetlight outage" },
  { value: "waste", label: "Waste collection" },
  { value: "appointment", label: "Appointment request" },
  { value: "other", label: "Other" },
];

export default function RequestForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RequestCategory>("road_damage");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (description.trim().length < 10) {
      setError("Please describe the issue in at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ title, description, category, location: location || undefined });
      setTitle("");
      setDescription("");
      setLocation("");
      setCategory("road_damage");
    } catch (err) {
      setError("Something went wrong submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="New service request form" noValidate>
      {error && (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="title">Title</label>
        <br />
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-required="true"
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="category">Category</label>
        <br />
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as RequestCategory)}
          style={{ width: "100%", padding: 8 }}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="location">Location (optional)</label>
        <br />
        <input
          id="location"
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="description">Description</label>
        <br />
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-required="true"
          rows={4}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}
