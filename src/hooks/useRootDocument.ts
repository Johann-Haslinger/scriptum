import { useDocumentsStore, useDocumentsUIStore } from "../store";
import { DocumentId } from "../types";

export const useRootDocument = () => {
  const documents = useDocumentsStore((state) => state.documents);
  const currentDocumentId = useDocumentsUIStore((state) => state.currentDocumentId);
  const rootDocument = documents.find((doc) => doc.type === "root");

  const isRootDocumentCurrent = rootDocument?.id === currentDocumentId;

  return {
    rootDocumentId: (rootDocument?.id || "") as DocumentId,
    isRootDocumentCurrent,
  };
};
