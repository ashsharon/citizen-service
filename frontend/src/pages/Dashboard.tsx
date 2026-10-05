import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRequests, createRequest, deleteRequest } from "../api/client";
import type { ServiceRequest, NewServiceRequest } from "../api/client";
import RequestForm from "../components/RequestForm";
import RequestList from "../components/RequestList";

export default function Dashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRequests();
      setRequests(data);
      setLoadError(null);
    } catch {
      setLoadError("Could not load your requests. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }
    loadRequests();
  }, [loadRequests, navigate]);

  async function handleCreate(payload: NewServiceRequest) {
    await createRequest(payload);
    await loadRequests();
  }

  async function handleDelete(id: number) {
    await deleteRequest(id);
    await loadRequests();
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Your service requests</h1>
        <button onClick={handleLogout}>Log out</button>
      </header>

      <section aria-labelledby="new-request-heading" style={{ marginTop: 24 }}>
        <h2 id="new-request-heading">Submit a new request</h2>
        <RequestForm onSubmit={handleCreate} />
      </section>

      <section aria-labelledby="existing-requests-heading" style={{ marginTop: 32 }}>
        <h2 id="existing-requests-heading">Existing requests</h2>
        {loading && <p>Loading…</p>}
        {loadError && <p role="alert">{loadError}</p>}
        {!loading && !loadError && <RequestList requests={requests} onDelete={handleDelete} />}
      </section>
    </main>
  );
}
