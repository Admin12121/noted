import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DocumentType = {
    id: string;
    title: string;
    icon: string;
    parentDocumentId?: string;
    child?: boolean;
};

type DocState = {
    [parentId: string]: {
        page: number;
        limit: number;
        expanded: boolean;
        data: DocumentType[];
        hasNext: boolean;
    };
};

const initialState: DocState = {
    root: { page: 1, limit: 10, expanded: true, data: [], hasNext: true },
};

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setDocuments(state, action: PayloadAction<{ parentId: string; data: DocumentType[]; hasNext: boolean; page: number; limit: number }>) {
            const { parentId, data, hasNext, page, limit } = action.payload;
            state[parentId] = {
                ...state[parentId],
                data: page === 1 ? data : [...(state[parentId]?.data || []), ...data],
                hasNext,
                page,
                limit,
                expanded: state[parentId]?.expanded ?? true,
            };
        },
        setExpanded(state, action: PayloadAction<{ parentId: string; expanded: boolean }>) {
            const { parentId, expanded } = action.payload;
            if (!state[parentId]) return;
            state[parentId].expanded = expanded;
        },
        addDocument(state, action: PayloadAction<{ parentId: string; doc: DocumentType }>) {
            const { parentId, doc } = action.payload;
            if (!state[parentId]) {
                state[parentId] = { page: 1, limit: 10, expanded: true, data: [], hasNext: true };
            }
            state[parentId].data = [doc, ...state[parentId].data];
        },
        updateChildFlag(state, action: PayloadAction<{ parentId: string; child: boolean }>) {
            Object.keys(state).forEach((key) => {
                state[key].data = state[key].data.map(doc =>
                    doc.id === action.payload.parentId ? { ...doc, child: action.payload.child } : doc
                );
            });
        },
        removeDocument(state, action: PayloadAction<{ id: string; parentId?: string }>) {
            Object.keys(state).forEach((key) => {
                state[key].data = state[key].data.filter(doc => doc.id !== action.payload.id);
            });
            if (action.payload.parentId && state[action.payload.parentId]) {
                if (state[action.payload.parentId].data.length === 0) {
                    Object.keys(state).forEach((key) => {
                        state[key].data = state[key].data.map(doc =>
                            doc.id === action.payload.parentId ? { ...doc, child: false } : doc
                        );
                    });
                }
            }
        },
        setPage(state, action: PayloadAction<{ parentId: string; page: number }>) {
            if (state[action.payload.parentId]) {
                state[action.payload.parentId].page = action.payload.page;
            }
        }
    },
});

export const {
    setDocuments,
    setExpanded,
    addDocument,
    updateChildFlag,
    removeDocument,
    setPage,
} = documentsSlice.actions;

export default documentsSlice.reducer;