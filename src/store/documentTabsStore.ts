import { create } from "zustand";
import { DocumentId, DocumentTab, TabId } from "../types";

interface DocumentTabsStore {
  tabs: Record<TabId, DocumentTab>;
  currentTabId: TabId | null;
  setCurrentTabId: (tabId: TabId | null) => void;
  openDocument: (tabId: TabId, docId: DocumentId) => void;
  goBack: (tabId: TabId, targetId?: DocumentId) => void;
  resetHistory: (tabId: TabId) => void;
  createTab: (tabId: TabId, initialDocId?: DocumentId) => void;
  closeTab: (tabId: TabId) => void;
}

export const useDocumentTabsStore = create<DocumentTabsStore>((set) => ({
  tabs: {},
  currentTabId: null,
  setCurrentTabId: (tabId) => set({ currentTabId: tabId }),
  createTab: (tabId, initialDocId) =>
    set((state) => ({
      tabs: {
        ...state.tabs,
        [tabId]: {
          id: tabId,
          current: initialDocId ?? null,
          history: [],
        },
      },
    })),

  closeTab: (tabId) =>
    set((state) => {
      const newTabs = { ...state.tabs };
      delete newTabs[tabId];
      return { tabs: newTabs };
    }),

  openDocument: (tabId, docId) =>
    set((state) => {
      const tab = state.tabs[tabId];
      if (!tab) return state;

      const { current, history } = tab;
      return {
        tabs: {
          ...state.tabs,
          [tabId]: {
            ...tab,
            history: current ? [...history, current] : history,
            current: docId,
          },
        },
      };
    }),

  goBack: (tabId, targetId) =>
    set((state) => {
      const tab = state.tabs[tabId];
      if (!tab) return state;

      const { history } = tab;

      // Standard: einen Schritt zurück
      if (!targetId) {
        const newHistory = [...history];
        const previous = newHistory.pop() ?? null;
        return {
          tabs: {
            ...state.tabs,
            [tabId]: {
              ...tab,
              current: previous,
              history: newHistory,
            },
          },
        };
      }

      // Ziel-Dokument: zurück zu bestimmtem Punkt
      const targetIndex = history.indexOf(targetId);
      if (targetIndex === -1) return state;

      const newHistory = history.slice(0, targetIndex);
      return {
        tabs: {
          ...state.tabs,
          [tabId]: {
            ...tab,
            current: targetId,
            history: newHistory,
          },
        },
      };
    }),

  resetHistory: (tabId) =>
    set((state) => {
      const tab = state.tabs[tabId];
      if (!tab) return state;

      return {
        tabs: {
          ...state.tabs,
          [tabId]: {
            ...tab,
            history: [],
          },
        },
      };
    }),
}));
