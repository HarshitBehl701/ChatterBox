import { z } from "zod";

export const createGroupSchemaValidation = z.object({
  groupName: z.string().min(1, "Group name is required"),
  members: z.string(),
});

export const updateGroupSchemaValidation = z.object({
  group_id: z.string().min(1, "Group ID is required"),
  name: z.string().optional(),
  adminUserId: z.string().optional(),
  members: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  is_active: z.number().int().refine((val) => val === 0 || val === 1, {
    message: "is_active must be either 0 or 1",
  }).optional(),
});

export const getGroupRequestsSchemaValidation = z.object({
  group_id: z.string().min(1, "Group ID is required"),
});

export const manageGroupRequestsByAdminSchemaValidation = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  groupId: z.string().min(1, "Group ID is required"),
  status: z.enum(["accept", "rejected"]),
});

export const manageGroupRequestsByUserSchemaValidation = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  groupId: z.string().min(1, "Group ID is required"),
  status: z.enum(["accept", "rejected"]),
});

export const getGroupChatsSchemaValidation = z.object({
  group_id: z.string().min(1, "Group ID is required"),
});

export const groupJoinRequestSchemaValidation = z.object({
  groupId: z.string().min(1, "Group ID is required"),
});