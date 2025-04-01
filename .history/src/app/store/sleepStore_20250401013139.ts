import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SleepState {
  expandedIndex: number | null
  completedSteps: number[]
  currentStep: number
  showCongratulations: boolean
  hasShownCongratulations: boolean
  toggleExpanded: (index: number) => void
  completeStep: (index: number) => void
  uncompleteStep: (index: number) => void
  setCurrentStep: (step: number) => void
  setShowCongratulations: (show: boolean) => void
  checkAllCompleted: (totalSteps: number) => void
}

// Create the store with persistence to remember if dialog has been shown
export const useSleepStore = create<SleepState>()(
  persist(
    (set, get) => ({
      expandedIndex: null,
      completedSteps: [],
      currentStep: 0,
      showCongratulations: false,
      hasShownCongratulations: false,

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
        const { completedSteps, hasShownCongratulations } = get()

        // Only show dialog if:
        // 1. All steps are completed (progress is 100%)
        // 2. Dialog hasn't been shown before
        if (completedSteps.length === totalSteps && !hasShownCongratulations) {
          set({
            showCongratulations: true,
            hasShownCongratulations: true, // Mark as shown so it won't appear again
          })
        }
      },
    }),
    {
      name: "sleep-progress", // Name for localStorage
      partialize: (state) => ({
        completedSteps: state.completedSteps,
        hasShownCongratulations: state.hasShownCongratulations,
      }), // Only persist these fields
    },
  ),
)

