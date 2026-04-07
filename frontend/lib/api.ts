import type {
  PredictRequest,
  PredictResponse,
  ModelInfo,
  HealthResponse,
  ReportRequest,
} from "@/types/prediction";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://heart-predict-api.onrender.com";
const REMOTE_FALLBACK = "https://heart-predict-api.onrender.com";

async function request<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown
): Promise<T> {
  const url = `${BASE}${path}`;

  async function executeFetch(baseUrl: string): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(err.message ?? `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  try {
    return await executeFetch(BASE);
  } catch (err: any) {
    // If it's a network error (TypeError: failed to fetch), provide a better message
    const isNetworkError = err instanceof TypeError || err.message?.includes("fetch");
    const networkMsg = isNetworkError ? "AI Engine unreachable (Connection Refused)" : err.message;

    if (BASE !== REMOTE_FALLBACK) {
      console.warn(`Primary backend ${url} unreachable; failing over to ${REMOTE_FALLBACK}${path}`);
      try {
        return await executeFetch(REMOTE_FALLBACK);
      } catch (fallbackErr: any) {
        throw new Error(`Critical: Primary (${url}) and Fallback (${REMOTE_FALLBACK}) both unreachable. ${fallbackErr.message}`);
      }
    }
    throw new Error(`Backend Diagnostic Error (${url}): ${networkMsg}`);
  }
}

// ── GET /health ─────────────────────────────────────────────
export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("GET", "/health");
}

// ── POST /predict ───────────────────────────────────────────
export async function postPredict(data: PredictRequest): Promise<PredictResponse> {
  return request<PredictResponse>("POST", "/predict", data);
}

// ── GET /model-info ─────────────────────────────────────────
export async function getModelInfo(): Promise<ModelInfo> {
  return request<ModelInfo>("GET", "/model-info");
}

// ── POST /report (binary PDF) ───────────────────────────────
export async function postReport(payload: ReportRequest): Promise<Blob> {
  const res = await fetch(`${BASE}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Could not generate report");
  return res.blob();
}

// ── NEW: Assessments Internal API ───────────────────────────

export interface AssessmentRecord {
  id: string;
  userId: string;
  date: string;
  request: PredictRequest;
  response: PredictResponse;
}

export async function getAssessments(userId?: string): Promise<AssessmentRecord[]> {
  const path = userId ? `/api/assessments?userId=${userId}` : "/api/assessments";
  // Next.js internal API routes are at the same origin
  const res = await fetch(path);
  if (!res.ok) return [];
  const data = await res.json();
  return data.records || [];
}

export async function saveAssessment(userId: string, request: PredictRequest, response: PredictResponse): Promise<AssessmentRecord> {
  const res = await fetch("/api/assessments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, request, response }),
  });
  if (!res.ok) throw new Error("Failed to save assessment");
  const data = await res.json();
  return data.record;
}

// ── Helper: trigger download ─────────────────────────────────
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
