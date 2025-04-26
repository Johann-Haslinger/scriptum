import { create } from "zustand";
import { DocumentId, DocumentTab, TabId } from "../types";

export const HOME_TAB_ID = "home";

interface DocumentTabsStore {
  tabs: DocumentTab[];
  createTab: (id: TabId, initialDocId?: DocumentId) => void;
  closeTab: (id: TabId) => void;
  openDocument: (id: TabId, docId: DocumentId) => void;
  goBack: (id: TabId, targetId?: DocumentId) => void;
  resetHistory: (id: TabId) => void;
  currentTabId: TabId;
  setCurrentTabId: (id: TabId) => void;
}

export const useDocumentTabsStore = create<DocumentTabsStore>((set) => ({
  tabs: [],
  currentTabId: HOME_TAB_ID,
  setCurrentTabId: (id) => {
    set(() => ({ currentTabId: id }));
  },
  createTab: (id, initialDocId) =>
    set((state) => {
      if (state.tabs.some((t) => t.id === id)) return state;
      return {
        tabs: [...state.tabs, { id, current: initialDocId ?? null, history: [] }],
        currentTabId: id,
      };
    }),

  closeTab: (id) =>
    set((state) => ({
      tabs: state.tabs.filter((t) => t.id !== id),
    })),

  openDocument: (tabId, docId) =>
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === tabId
          ? {
              ...t,
              history: t.current ? [...t.history, t.current] : t.history,
              current: docId,
            }
          : t
      ),
      currentTabId: tabId,
    })),

  goBack: (id, targetId) =>
    set((state) => ({
      tabs: state.tabs.map((t) => {
        if (t.id !== id) return t;

        if (!targetId) {
          const newHistory = [...t.history];
          const previous = newHistory.pop() ?? null;
          return {
            ...t,
            current: previous,
            history: newHistory,
          };
        }

        const targetIndex = t.history.indexOf(targetId);
        if (targetIndex === -1) return t;

        return {
          ...t,
          current: targetId,
          history: t.history.slice(0, targetIndex),
        };
      }),
    })),

  resetHistory: (id) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, history: [] } : t)),
    })),
}));
