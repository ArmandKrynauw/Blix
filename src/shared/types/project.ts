import type { UUID } from "../utils/UniqueEntity";
import type { LayoutPanel } from "./layout";

export interface SharedProject {
  id: UUID;
  name?: string;
  layout?: LayoutPanel;
  graphs?: UUID[];
}
