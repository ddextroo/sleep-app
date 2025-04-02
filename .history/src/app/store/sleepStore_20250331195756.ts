import { create } from "zustand"

interface SleepState {
  expandedIndex: number | null
  completedSteps: number[]
  currentStep: number
  toggleExpanded: (index: number) => void
  completeStep: (index: number) => void
  uncompleteStep: (index: number) => void
  setCurrentStep: (step: number) => void
}

export const useSleepStore = create<SleepState>((set) => ({
  expandedIndex: null,
  completedSteps: [],
  currentStep: 0,

  toggleExpanded: (index) =>
    set((state) => ({
      expandedIndex: state.expandedIndex === index ? null : index,
    })),

  completeStep: (index) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(index)
        ? state.completedSteps
        : [...state.completedSteps, index].sort((a, b) => a - b),
      currentStep: Math.max(state.currentStep, index + 1),
    })),

  uncompleteStep: (index) =>
    set((state) => ({
      completedSteps: state.completedSteps.filter((step) => step !== index),
    })),

  setCurrentStep: (step) => set({ currentStep: step }),
}))

