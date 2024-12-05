import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const SocketURL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log(error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data, navigate) => {
    set({ isSigningUp: true });
    try {
      // console.log("form Data at store", data);
      const res = await axiosInstance.post("auth/signup", data);
      // console.log(res.data.NewUser);
      set({ authUser: res.data.NewUser });
      get().connectSocket();
      toast.success(res.data.message || "account created successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({
        isSigningUp: false,
      });
    }
  },

  login: async (data, navigate) => {
    set({ isLoggingIn: true });
    // console.log("data from login store", data);
    try {
      const res = await axiosInstance.post("auth/login", data);
      // console.log(res.data);
      set({ authUser: res.data.user });
      get().connectSocket();
      navigate("/");
      toast.success(res.data.message || "logged in successfully");
    } catch (error) {
      // console.log(error.response.data.message);
      toast.error(error.responsed.data.message || "something error ");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async (navigate) => {
    console.log("======>", navigate);
    try {
      const res = await axiosInstance.post("auth/logout");
      toast.success(res.data.message || "logged out successfully");
      get().disconnectSocket();
      set({ authUser: null });
      navigate("/login");
    } catch (error) {
      console.log(error.response.data.message || "error to logged out");
    }
  },

  updateProfile: async (data) => {
    // console.log(data);
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("auth/profile", data);
      set({ authUser: res.data });
      // console.log(res.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(SocketURL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
