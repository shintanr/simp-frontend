import { create } from "zustand";

interface Lab {
  id: string;
  name: string;
}

interface LabState {
  selectedLab: Lab | null;
  setSelectedLab: (lab: Lab) => void;
}

export const useLabStore = create<LabState>((set) => ({
  selectedLab: null,
  setSelectedLab: (lab) => set({ selectedLab: lab }),
}));
