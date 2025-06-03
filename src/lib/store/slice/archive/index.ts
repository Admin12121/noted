import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DocumentType = {
    id: string;
    title: string;
    icon: string;
    parentDocumentId?: string,
};

type TrashState = {
    data: DocumentType[];
};

const initialState: TrashState = {
    data: [],
};

const trashSlice = createSlice({
    name: 'trash',
    initialState,
    reducers: {
        setTrash(state, action: PayloadAction<DocumentType[]>) {
            state.data = action.payload;
        },
        addToTrash(state, action: PayloadAction<DocumentType>) {
            state.data.unshift(action.payload);
        },
        removeFromTrash(state, action: PayloadAction<string>) {
            state.data = state.data.filter(doc => doc.id !== action.payload);
        },
        clearTrash(state) {
            state.data = [];
        },
    },
});

export const { setTrash, addToTrash, removeFromTrash, clearTrash } = trashSlice.actions;
export default trashSlice.reducer;