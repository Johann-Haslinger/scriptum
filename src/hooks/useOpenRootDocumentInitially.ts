import { useEffect } from "react";
import { useDocumentsStore, useDocumentsUIStore, useUserStore } from "../store";

export const useOpenRootDocument = () => {
  const { documents, loadRootDocument, loadRecentDocuments } = useDocumentsStore();
  const { setCurrentDocument, currentDocumentId } = useDocumentsUIStore();
  const { isUserLoggedIn, userId } = useUserStore();

  useEffect(() => {
    if (documents.length > 0 && currentDocumentId === null) {
      setCurrentDocument(documents.find((doc) => doc.type === "root")?.id || documents[0].id);
    }
  }, [documents, currentDocumentId, setCurrentDocument]);

  useEffect(() => {
    if (isUserLoggedIn && userId) {
      loadRootDocument(userId);
      loadRecentDocuments();
    }
  }, [isUserLoggedIn, userId, loadRecentDocuments, loadRootDocument]);
};
