import { DocumentType } from "./documentslice";

// Helper to get auth headers if needed
function getHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

// 1. Fetch all documents (non-archived, tree/flat)
export async function fetchDocumentsAPI(): Promise<DocumentType[]> {
  const res = await fetch("/api/documents?page=1&limit=1000", {
    method: "GET",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch documents");
  const json = await res.json();
  // The API returns { data: [...] }
  return json.data;
}

// 2. Create a document
export async function createDocumentAPI(payload: { title: string; parentDocumentId?: string | null }): Promise<DocumentType> {
  const res = await fetch("/api/documents", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      title: payload.title,
      parentDocumentId: payload.parentDocumentId ?? null,
    }),
  });
  if (!res.ok) throw new Error("Failed to create document");
  const json = await res.json();
  // The API returns { data: { ... } }
  return json.data;
}

// 3. Archive (move to trash)
export async function archiveDocumentAPI(id: string): Promise<void> {
  // Use DELETE with ?id=...
  const res = await fetch(`/api/documents?id=${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to archive document");
}

// 4. Recover from archive
export async function recoverDocumentAPI(id: string): Promise<DocumentType> {
  // PATCH to /api/documents/archive/[slug]
  const res = await fetch(`/api/documents/archive/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to recover document");
  // The API does not return the document, so you may want to refetch or return a stub
  // For now, return { id } and refetch in the slice if needed
  return { id } as DocumentType;
}

// 5. Fetch archived documents (trash)
export async function fetchArchivedDocumentsAPI(): Promise<DocumentType[]> {
  const res = await fetch("/api/documents/archive?page=1&limit=1000", {
    method: "GET",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch archived documents");
  const json = await res.json();
  return json.data;
}