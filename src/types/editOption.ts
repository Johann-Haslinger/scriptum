import { EditOptionName } from "./enums";

export interface EditOption {
  name: EditOptionName;
  icon: React.ReactNode;
  color: string;
  outlineColor: string;
  order: number;
}
