import { useDocumentsStore, useDocumentsUIStore } from "../store";

export const useCurrentDocument = () => {
  const { currentDocumentId, setCurrentDocument } = useDocumentsUIStore();
  const { documents } = useDocumentsStore();
  const document = documents.find((doc) => doc.id === currentDocumentId);
  const isRootDocumentCurrent = document?.type === "root";

  const setDocument = (documentId: string) => {
    setCurrentDocument(documentId);
  };

  return {
    document,
    setDocument,
    isRootDocumentCurrent,
  };
};
