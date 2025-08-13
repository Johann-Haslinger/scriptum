import { useEffect } from "react";
import { HOME_TAB_ID, useDocumentsStore, useDocumentTabsStore, useUserStore } from "../store";
import { useCurrentDocument } from "./useCurrentDocument";

export const useDocumentEntry = () => {
  const { loadRootDocument, loadRecentDocuments, loadDocument } = useDocumentsStore();
  const { openDocument, currentTabId } = useDocumentTabsStore();
  const { currentDocumentId } = useCurrentDocument();
  const { userId } = useUserStore();
  const { createTab } = useDocumentTabsStore();

  useEffect(() => {
    const loadDocEntry = async () => {
      let currentDoc = null;

      const { data: rootDoc, error } = await loadRootDocument(userId);

      if (error) {
        console.error("Error loading root document", error);
        return;
      }

      if (currentDocumentId) {
        const { data: doc, error } = await loadDocument(currentDocumentId);
        if (error) {
          console.error("Error loading document", error);
          return;
        }

        if (doc) {
          console.log("Document loaded", doc);
          openDocument(currentTabId, doc.id);
          currentDoc = doc;
        }
      } else {
        if (rootDoc) {
          createTab(HOME_TAB_ID, rootDoc.id);
          currentDoc = rootDoc;
        }
      }
    };

    loadDocEntry();
    loadRecentDocuments();
  }, []);
};
