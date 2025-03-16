export interface Document {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  sharedWith: string[];
  type?: string;
}
