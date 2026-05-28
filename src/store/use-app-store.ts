import { create } from "zustand"
import type { Project, Stem, User } from "@/types"

interface AppState {
  user: User | null
  projects: Project[]
  stems: Stem[]
  isUploading: boolean
  uploadProgress: number
  processingProjectId: string | null
  sidebarOpen: boolean

  setUser: (user: User | null) => void
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  setStems: (stems: Stem[]) => void
  addStem: (stem: Stem) => void
  setIsUploading: (isUploading: boolean) => void
  setUploadProgress: (progress: number) => void
  setProcessingProjectId: (id: string | null) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  projects: [],
  stems: [],
  isUploading: false,
  uploadProgress: 0,
  processingProjectId: null,
  sidebarOpen: false,

  setUser: (user) => set({ user }),
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),
  updateProject: (id, updates) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  setStems: (stems) => set({ stems }),
  addStem: (stem) => set((s) => ({ stems: [...s.stems, stem] })),
  setIsUploading: (isUploading) => set({ isUploading }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setProcessingProjectId: (processingProjectId) => set({ processingProjectId }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
