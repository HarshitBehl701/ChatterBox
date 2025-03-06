import { z } from "zod";

export const registerUserValidationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  username: z.string().min(3).max(30, "Username must be between 3-30 characters"),
  password: z.string().min(8).max(16, "Password must be between 8-16 characters"),
});

export const loginUserValidationSchema = z.object({
  username: z.string().min(3).max(30, "Username must be between 3-30 characters"),
  password: z.string().min(8).max(16, "Password must be between 8-16 characters"),
});

export const updateUserValidationSchema = z.object({
  name: z.string().optional(),
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(16).optional(),
  status: z.enum(["online", "offline"]).optional(),
  is_active: z.number().int().refine((val) => val === 0 || val === 1, {
    message: "is_active must be either 0 or 1",
  }).optional(),
});

export const manageFriendListValidationSchema = z.object({
  request_id: z.string(),
  newStatus: z.enum(["accepted", "rejected"]),
});

export const removeFriendValidationSchema = z.object({
  friend_id: z.string(),
});

export const getChatsValidationSchema = z.object({
  friend_id: z.string(),
});