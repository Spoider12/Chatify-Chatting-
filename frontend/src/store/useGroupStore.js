import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useGroupStore = create((set) => ({
  groups: [],

  fetchGroups: async () => {
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      console.log(error);
    }
  },

  createGroup: async (name, members) => {
    try {
      const res = await axiosInstance.post("/groups/create", {
        name,
        members,
      });

      set((state) => ({
        groups: [...state.groups, res.data],
      }));
    } catch (error) {
      console.log(error);
    }
  },
}));