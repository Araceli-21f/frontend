import { createSlice } from '@reduxjs/toolkit';

export const notificacion = createSlice({
    name: 'message',
    initialState: {
        isSaving: false,
        messageSaved: '',
        messageBirth: '',
        messageTask: '',
        notes: [],
        active: null,
    },
    reducers: {
        savingNewNote: ( state ) => {
            state.isSaving = true;
        },
        addNewEmptyNote: (state, action ) => {
            state.notes.push( action.payload );
            state.isSaving = false;
        },
        setActiveNote: (state, action ) => {
            state.active = action.payload;
            state.messageSaved = '';
            state.messageBirth = '';
            state.messageTask = '';
        },
        setNotes: (state, action ) => {
            state.notes = action.payload;
        },
        setSaving: (state ) => {
            state.isSaving = true;
            state.messageSaved = '';
            state.messageBirth = '';
            state.messageTask = '';
        },
        updateNote: (state, action ) => { // payload: note
            state.isSaving = false;
            state.notes = state.notes.map( note => {

                if ( note.id === action.payload.id ) {
                    return action.payload;
                }

                return note;
            });

            state.messageSaved = `${ action.payload.title }, actualizada correctamente`;
            state.messageBirth = `${ action.payload.title }, Hoy es tu Cumpleaños`;
            state.messageTask = `${ action.payload.title }, La Tarea ya está por terminar`;
        },
        setPhotosToActiveNote: (state, action) => {
            state.active.imageUrls = [ ...state.active.imageUrls, ...action.payload ]; 
            state.isSaving = false;
        },

        clearNotesLogout: (state) => {
            state.isSaving = false;
            state.messageSaved = '';
            state.notes = [];
            state.active = null;
        },

        deleteNoteById: (state, action ) => {
            state.active = null;
            state.notes = state.notes.filter( note => note.id !== action.payload );
        },
    }
});


// Action creators are generated for each case reducer function
export const { 
    addNewEmptyNote,
    clearNotesLogout,
    deleteNoteById, 
    savingNewNote,
    setActiveNote,
    setNotes,
    setPhotosToActiveNote,
    setSaving,
    updateNote,
} = journalSlice.actions;