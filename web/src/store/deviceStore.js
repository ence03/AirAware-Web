import { create } from "zustand";
import axios from "axios";

export const useDeviceStore = create((set) => ({
  devices: [],
  isLoading: false,
  error: null,

  // Fetch devices from the API
  getDevices: async () => {
    set({ isLoading: true, error: null });

    try {
      // API call to fetch devices
      const response = await axios.get(
        "https://airaware.up.railway.app/api/device/"
      );

      if (response.data.success) {
        set({
          devices: response.data.data, // Update devices state with fetched data
          isLoading: false,
        });
      } else {
        set({
          error: "Failed to fetch devices", // Set error state if response is unsuccessful
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message, // Set error state if request fails
        isLoading: false,
      });
    }
  },

  updateDevice: async (deviceId, updates) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(
        `https://airaware.up.railway.app/api/device/${deviceId}`,
        updates
      );

      if (response.data.success) {
        // Update the device in the store state
        set((state) => {
          const updatedDevices = state.devices.map((device) =>
            device._id === deviceId ? response.data.data : device
          );
          return { devices: updatedDevices, isLoading: false };
        });
      } else {
        set({
          error: "Failed to update device",
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  enableDisableDevice: async (deviceId, isConnected) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.patch(
        `https://airaware.up.railway.app/api/device/${deviceId}/enable-disable`,
        { isConnected }
      );

      if (response.data.success) {
        // Update the device status in the store state
        set((state) => {
          const updatedDevices = state.devices.map((device) =>
            device._id === deviceId ? response.data.data : device
          );
          return { devices: updatedDevices, isLoading: false };
        });
      } else {
        set({
          error: "Failed to update device status",
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },
}));
