import { useEffect } from "react";
import { useDocumentsStore, useDocumentsUIStore } from "../store";

export const useOpenRootDocument = () => {
  const documents = useDocumentsStore((state) => state.documents);
  const { setCurrentDocument, currentDocumentId } = useDocumentsUIStore();

  useEffect(() => {
    if (documents.length > 0 && currentDocumentId === null) {
      setCurrentDocument(documents.find((doc) => doc.type === "root")?.id || documents[0].id);
    }
  }, []);
};
