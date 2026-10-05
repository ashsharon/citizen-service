import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type RequestCategory =
  | "road_damage"
  | "streetlight"
  | "waste"
  | "appointment"
  | "other";

export type RequestStatus =
  | "submitted"
  | "in_review"
  | "in_progress"
  | "resolved"
  | "rejected";

export interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  category: RequestCategory;
  status: RequestStatus;
  location: string | null;
  created_at: string;
  updated_at: string;
  owner_id: number;
}

export interface NewServiceRequest {
  title: string;
  description: string;
  category: RequestCategory;
  location?: string;
}

export async function login(email: string, password: string): Promise<string> {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);
  const { data } = await apiClient.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data.access_token;
}

export async function register(email: string, password: string, fullName: string) {
  await apiClient.post("/auth/register", { email, password, full_name: fullName });
}

export async function fetchRequests(): Promise<ServiceRequest[]> {
  const { data } = await apiClient.get<ServiceRequest[]>("/requests/");
  return data;
}

export async function createRequest(payload: NewServiceRequest): Promise<ServiceRequest> {
  const { data } = await apiClient.post<ServiceRequest>("/requests/", payload);
  return data;
}

export async function deleteRequest(id: number): Promise<void> {
  await apiClient.delete(`/requests/${id}`);
}
