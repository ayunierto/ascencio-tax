import { create } from 'zustand';

interface TemporalCameraStoreState {
  selectedImages: string[];

  addSelectedImage: (image: string) => void;
  clearImages: () => void;
  removeImage: (image: string) => void;
}

export const useCameraStore = create<TemporalCameraStoreState>()((set) => ({
  selectedImages: [],

  addSelectedImage: (image: string) => {
    set((state) => ({
      selectedImages: [...state.selectedImages, image],
    }));
  },

  clearImages: () => set({ selectedImages: [] }),

  removeImage: (image: string) =>
    set((state) => ({
      selectedImages: state.selectedImages.filter((img) => img !== image),
    })),
}));
