"use strict";

import { generateID, findNotebook, findNoteIndex, findNotebookIndex, findNote } from "./utils.js";

let notekeeperDB = {};

const initDB = function () {
  const db = localStorage.getItem("notekeeperDB");
  if (db) {
    notekeeperDB = JSON.parse(db);
  } else {
    notekeeperDB.notebooks = [];
    localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
  }
};
initDB();

const readDB = function () {
  notekeeperDB = JSON.parse(localStorage.getItem("notekeeperDB"));
};

const writeDB = function () {
  localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
};

export const db = {
  post: {
    notebook(name) {
      readDB();

      const notebookData = {
        id: generateID(),
        name,
        notes: [],
      };

      notekeeperDB.notebooks.push(notebookData);

      writeDB();

      return notebookData;
    },
    note(notebookId, object) {
      readDB();

      const notebook = findNotebook(notekeeperDB, notebookId);

      const noteData = {
        id: generateID(),
        notebookId,
        ...object,
        postedOn: new Date().getTime(),
      };

      notebook.notes.unshift(noteData);

      writeDB();

      return noteData;
    },
  },

  get: {
    note(notebookId) {
      readDB();

      const notebook = findNotebook(notekeeperDB, notebookId);
      return notebook.notes;
    },
    notebook() {
      readDB();
      return notekeeperDB.notebooks;
    },
  },

  delete: {
    note(notebookId, noteId) {
      readDB();

      const notebook = findNotebook(notekeeperDB, notebookId);
      const noteIndex = findNoteIndex(notebook, noteId);

      notebook.notes.splice(noteIndex, 1);
      writeDB();
      return notebook.notes;
    },

    notebook(notebookId) {
      readDB();

      const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
      notekeeperDB.notebooks.splice(notebookIndex, 1);

      writeDB();

      return;
    },
  },

  update: {
    note(noteId, object) {
      readDB();

      const oldNote = findNote(notekeeperDB, noteId);
      const newNote = Object.assign(oldNote, object);

      writeDB();
      return newNote;
    },

    notebook(notebookId, name) {
      readDB();

      const notebook = findNotebook(notekeeperDB, notebookId);
      notebook.name = name;

      writeDB();
      return notebook;
    },
  },
};
