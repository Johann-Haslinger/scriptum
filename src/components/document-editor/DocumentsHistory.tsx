import { useCurrentDocument } from "../../hooks";
import { useDocumentsStore, useDocumentsUIStore } from "../../store";
import { Document } from "../../types";

const DocumentsHistory = () => {
  const { history } = useDocumentsUIStore();
  const { documents } = useDocumentsStore();
  const { isRootDocumentCurrent } = useCurrentDocument();

  return (
    !isRootDocumentCurrent && (
      <div className="flex md:pl-8 select-none">
        {history.map((docId) => (
          <DocumentItem key={docId} document={documents.find((doc) => doc.id === docId) as Document} />
        ))}
        ^
        <CurrentDocumentItem />
      </div>
    )
  );
};

export default DocumentsHistory;

const DocumentItem = ({ document }: { document: Document }) => {
  const { goBack } = useDocumentsUIStore();
  const { id, name } = document;

  const handleOpenDocument = () => {
    goBack(id);
  };
  return (
    <div onClick={handleOpenDocument} className="opacity-40 cursor-pointer hover:opacity-60 active:opacity-20 mr-2">
      <span>{name}</span> /
    </div>
  );
};

const CurrentDocumentItem = () => {
  const { document } = useCurrentDocument();

  return (
    <div className="cursor-default">
      <span>{document?.name}</span>
    </div>
  );
};
