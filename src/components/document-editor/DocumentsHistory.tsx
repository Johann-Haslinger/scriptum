import { useCurrentDocument } from "../../hooks";
import { useDocumentsStore, useDocumentTabsStore } from "../../store";
import { Document } from "../../types";

const DocumentsHistory = () => {
  const { documents } = useDocumentsStore();
  const tab = useCurrentTab();

  return (
    (tab?.history?.length ?? 0) > 0 && (
      <div className="flex md:pl-8 select-none">
        {tab?.history.map((docId, idx) => (
          <DocumentItem key={idx} document={documents.find((doc) => doc.id === docId) as Document} />
        ))}

        <CurrentDocumentItem />
      </div>
    )
  );
};

export default DocumentsHistory;

const DocumentItem = ({ document }: { document: Document }) => {
  const { goBack, currentTabId } = useDocumentTabsStore();
  const { id, name } = document;

  const handleOpenDocument = () => {
    goBack(currentTabId, id);
  };
  return (
    <div onClick={handleOpenDocument} className="opacity-40 cursor-pointer hover:opacity-60 active:opacity-20 mr-2">
      <span>{name}</span> /
    </div>
  );
};

const CurrentDocumentItem = () => {
  const { currentDocument } = useCurrentDocument();

  return (
    <div className="cursor-default">
      <span>{currentDocument?.name}</span>
    </div>
  );
};

const useCurrentTab = () => {
  const { currentTabId } = useDocumentTabsStore();
  const currentTab = useDocumentTabsStore((state) => state.tabs.find((tab) => tab.id === currentTabId));

  return currentTab;
};
