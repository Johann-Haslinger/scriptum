export type DocumentId = string;
export type TabId = string;

export interface DocumentTab {
  id: TabId;
  current: DocumentId | null;
  history: DocumentId[];
}
