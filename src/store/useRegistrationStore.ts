import { create } from "zustand";

interface RegistrationStore {
  platform?: string | null;
  setPlatform: (value: string) => void;
  currentStep: number;
  setCurrentStep: (value: number) => void;
  submitForm: boolean;
  setSubmitForm: (value: boolean) => void;
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  platform: null,
  setPlatform: (value) => set({ platform: value }),
  currentStep: 0,
  setCurrentStep: (value) => set({ currentStep: value }),
  submitForm: false,
  setSubmitForm: (value) => set({ submitForm: value }),
}));
