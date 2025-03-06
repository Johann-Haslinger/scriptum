export default function BlockEditor({ pageId, onNavigate, onClose }: { pageId: string; onNavigate: (id: string) => void; onClose: () => void }) {
  return (
    <div className="flex flex-col w-full h-full p-6 bg-white shadow-lg">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Editor für {pageId}</h1>
        <button onClick={onClose} className="p-2 bg-red-500 text-white rounded">Schließen</button>
      </div>
      
      <div className="mt-4 space-y-2">
        <button onClick={() => onNavigate(`page-${Math.random().toString(36).substr(2, 5)}`)} className="p-2 bg-blue-500 text-white rounded">
          ➕ Neue Seite öffnen
        </button>
      </div>
    </div>
  );
}
