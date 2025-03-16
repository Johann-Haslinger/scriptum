import { useCommandMenuUIStore, useDocumentsStore } from "../../store";
import DocumentItem from "./DocumentItem";

const ResultsList = () => {
  const documents = useSearchResults();

  return (
    <ul className="px-4 mt-2 pb-4 w-full">
      {documents.map((doc) => (
        <DocumentItem key={doc.id} document={doc} />
      ))}
      {documents.length === 0 && <div className="w-full px-3 py-2.5">No results found</div>}
    </ul>
  );
};

export default ResultsList;

const useSearchResults = () => {
  const { searchQuery } = useCommandMenuUIStore();
  const documents = useDocumentsStore((state) => state.documents);

  return documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));
};
