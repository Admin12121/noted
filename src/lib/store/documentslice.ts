import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from ".";
import {
  fetchDocumentsAPI,
  createDocumentAPI,
  archiveDocumentAPI,
  recoverDocumentAPI,
} from "./documentapi";

// Document type
export interface DocumentType {
  id: string;
  title: string;
  icon?: string;
  parentDocumentId?: string | null;
  child?: boolean;
  isArchived?: boolean;
}

// Normalized state
interface DocumentState {
  byId: Record<string, DocumentType>;
  childrenByParent: Record<string, string[]>; // parentId -> [childId, ...]
  rootIds: string[]; // Top-level document IDs
  trashIds: string[]; // Archived document IDs
  loading: boolean;
  error?: string;
}

const initialState: DocumentState = {
  byId: {},
  childrenByParent: {},
  rootIds: [],
  trashIds: [],
  loading: false,
};

// Thunks (replace with your actual API calls)
export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async () => {
    const data = await fetchDocumentsAPI();
    return data as DocumentType[];
  }
);

export const createDocument = createAsyncThunk(
  "documents/createDocument",
  async (payload: { title: string; parentDocumentId?: string | null }) => {
    const data = await createDocumentAPI(payload);
    return data as DocumentType;
  }
);

export const archiveDocument = createAsyncThunk(
  "documents/archiveDocument",
  async (id: string) => {
    await archiveDocumentAPI(id);
    return id;
  }
);

export const recoverDocument = createAsyncThunk(
  "documents/recoverDocument",
  async (id: string) => {
    const doc = await recoverDocumentAPI(id);
    return doc as DocumentType;
  }
);

// Helper to build normalized tree
function normalizeDocuments(docs: DocumentType[]) {
  const byId: Record<string, DocumentType> = {};
  const childrenByParent: Record<string, string[]> = {};
  const rootIds: string[] = [];
  const trashIds: string[] = [];

  docs.forEach((doc) => {
    byId[doc.id] = doc;
    if (doc.isArchived) {
      trashIds.push(doc.id);
    } else if (!doc.parentDocumentId) {
      rootIds.push(doc.id);
    }
    const parentId = doc.parentDocumentId || "root";
    if (!childrenByParent[parentId]) childrenByParent[parentId] = [];
    childrenByParent[parentId].push(doc.id);
  });

  return { byId, childrenByParent, rootIds, trashIds };
}

export const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    // For optimistic UI updates if needed
    updateDocumentTitle(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;
      if (state.byId[id]) state.byId[id].title = title;
    },
    updateDocumentIcon(state, action: PayloadAction<{ id: string; icon: string }>) {
      const { id, icon } = action.payload;
      if (state.byId[id]) state.byId[id].icon = icon;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        const { byId, childrenByParent, rootIds, trashIds } = normalizeDocuments(action.payload);
        state.byId = byId;
        state.childrenByParent = childrenByParent;
        state.rootIds = rootIds;
        state.trashIds = trashIds;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        const doc = action.payload;
        state.byId[doc.id] = doc;
        const parentId = doc.parentDocumentId || "root";
        if (!state.childrenByParent[parentId]) state.childrenByParent[parentId] = [];
        state.childrenByParent[parentId].unshift(doc.id);
        if (!doc.parentDocumentId) state.rootIds.unshift(doc.id);
      })
      .addCase(archiveDocument.fulfilled, (state, action) => {
        const id = action.payload;
        const doc = state.byId[id];
        if (!doc) return;
        doc.isArchived = true;
        // Remove from parent's children
        const parentId = doc.parentDocumentId || "root";
        state.childrenByParent[parentId] = (state.childrenByParent[parentId] || []).filter(
          (cid) => cid !== id
        );
        // Remove from rootIds if needed
        if (!doc.parentDocumentId) {
          state.rootIds = state.rootIds.filter((rid) => rid !== id);
        }
        // Add to trash
        state.trashIds.unshift(id);
      })
      .addCase(recoverDocument.fulfilled, (state, action) => {
        const doc = action.payload;
        state.byId[doc.id] = doc;
        doc.isArchived = false;
        // Remove from trash
        state.trashIds = state.trashIds.filter((tid) => tid !== doc.id);
        // Add back to parent's children
        const parentId = doc.parentDocumentId || "root";
        if (!state.childrenByParent[parentId]) state.childrenByParent[parentId] = [];
        state.childrenByParent[parentId].unshift(doc.id);
        // Add to rootIds if needed
        if (!doc.parentDocumentId) state.rootIds.unshift(doc.id);
      });
  },
});

export const { updateDocumentTitle, updateDocumentIcon } = documentSlice.actions;

export default documentSlice.reducer;


export const selectDocumentById = (state: RootState, id: string) => state.documents.byId[id];
export const selectChildrenByParent = (state: RootState, parentId: string) =>
  (state.documents.childrenByParent[parentId] || []).map((id) => state.documents.byId[id]);
export const selectRootDocuments = (state: RootState) =>
  state.documents.rootIds.map((id) => state.documents.byId[id]);
export const selectTrashDocuments = (state: RootState) =>
  state.documents.trashIds.map((id) => state.documents.byId[id]);