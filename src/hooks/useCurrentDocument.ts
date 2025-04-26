import { useMemo } from "react";
import { useDocumentsStore, useDocumentTabsStore } from "../store";

export const useCurrentDocument = () => {
  const { currentTabId, tabs } = useDocumentTabsStore();

  const currentTab = useMemo(() => {
    return tabs.find((tab) => tab.id === currentTabId);
  }, [currentTabId, tabs]);
  const currentDocumentId = currentTab?.current || null;
  const currentDocument = useDocumentsStore((state) => state.documents.find((doc) => doc.id === currentDocumentId));
  return {
    currentDocumentId,
    currentDocument,
  };
};
