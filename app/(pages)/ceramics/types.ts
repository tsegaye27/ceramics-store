import { ICeramics } from "@/app/_models/ceramics/types";

export interface CeramicsClientProps {
  ceramics: ICeramics[];
  searchQuery: string;
}
