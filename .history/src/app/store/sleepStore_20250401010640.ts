import { create } from "zustand"

interface SleepState {
  expandedIndex: number | null
  completedSteps: number[]
  currentStep: number
  showCongratulations: boolean
  toggleExpanded: (index: number) => void
  completeStep: (index: number) => void
  uncompleteStep: (index: number) => void
  setCurrentStep: (step: number) => void
  setShowCongratulations: (show: boolean) => void
  checkAllCompleted: (totalSteps: number) => void
}

export const useSleepStore = create<SleepState>((set, get) => ({
  expandedIndex: null,
  completedSteps: [],
  currentStep: 0,
  showCongratulations: false,

  toggleExpanded: (index) =>
    set((state) => ({
      expandedIndex: state.expandedIndex === index ? null : index,
    })),

  completeStep: (index) => {
    set((state) => {
      const newCompletedSteps = state.completedSteps.includes(index)
        ? state.completedSteps
        : [...state.completedSteps, index].sort((a, b) => a - b)

      return {
        completedSteps: newCompletedSteps,
        currentStep: Math.max(state.currentStep, index + 1),
      }
    })

    // Check if all steps are completed after updating
    const { checkAllCompleted } = get()
    setTimeout(() => checkAllCompleted(5), 300) // Check with total number of steps
  },

  uncompleteStep: (index) =>
    set((state) => ({
      completedSteps: state.completedSteps.filter((step) => step !== index),
    })),

  setCurrentStep: (step) => set({ currentStep: step }),

  setShowCongratulations: (show) => set({ showCongratulations: show }),

  checkAllCompleted: (totalSteps) => {
    const { completedSteps } = get()

    // If all steps are completed and dialog isn't already showing
    if (completedSteps.length === totalSteps && !get().showCongratulations) {
      set({ showCongratulations: true })
    }
  },
}))

