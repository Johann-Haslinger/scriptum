import { compareDesc, format, isToday, isYesterday, parseISO } from "date-fns";
import { useDocumentsStore } from "../../store";
import { Document } from "../../types";
import AddDocumentButton from "./AddDocumentButton";
import DocumentItem from "./DocumentItem";

const RecentDocumentList = () => {
  const documents = useDocumentsStore((state) => state.documents);
  const groupedDocs = groupAndSortDocuments(documents);

  return (
    <ul className="px-4 pb-4 w-full">
      <AddDocumentButton />

      {Object.entries(groupedDocs).map(([date, docs]) => (
        <div key={date} className="mt-1">
          <div className="text-sm text-white/30 mb-1 pl-3 font-semibold">{date}</div>
          <ul>
            {docs.map((doc) => (
              <DocumentItem key={doc.id} document={doc} />
            ))}
          </ul>
        </div>
      ))}
    </ul>
  );
};

export default RecentDocumentList;

const groupAndSortDocuments = (documents: Document[]) => {
  const sortedDocs = [...documents].sort((a, b) => compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt)));

  return sortedDocs.reduce<Record<string, Document[]>>((groups, doc) => {
    const date = parseISO(doc.updatedAt);
    let key = format(date, "yyyy-MM-dd");

    if (isToday(date)) key = "Today";
    else if (isYesterday(date)) key = "Yesterday";
    else if (date.getMonth() === new Date().getMonth() - 1) key = "Last 30 days";
    else return groups;

    if (!groups[key]) groups[key] = [];
    groups[key].push(doc);

    return groups;
  }, {});
};
