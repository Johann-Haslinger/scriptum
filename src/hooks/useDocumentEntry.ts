import { useEffect } from "react";
import { useDocumentsStore, useDocumentsUIStore, useDocumentTabsStore, useUserStore } from "../store";

export const useDocumentEntry = () => {
  const { loadRootDocument, loadRecentDocuments, loadDocument } = useDocumentsStore();
  const { setCurrentDocument, currentDocumentId } = useDocumentsUIStore();
  const { userId } = useUserStore();
  const { createTab, tabs } = useDocumentTabsStore();

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
          setCurrentDocument(doc.id);
          currentDoc = doc;
        }
      } else {
        if (rootDoc) {
          setCurrentDocument(rootDoc.id);
          currentDoc = rootDoc;
        }
      }

      if (Object.values(tabs).length === 0) {
        createTab(crypto.randomUUID(), currentDoc?.id);
      }
    };

    loadDocEntry();
    loadRecentDocuments();
  }, []);
};
