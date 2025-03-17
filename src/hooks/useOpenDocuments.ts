import { useDocumentsStore, useDocumentsUIStore } from "../store";

export const useOpenDocuments = () => {
  const openDocumentIds = useDocumentsUIStore((state) => state.openDocumentIds);
  const documents = useDocumentsStore((state) => state.documents);

  return documents.filter((doc) => openDocumentIds[doc.id]);
};
