import { Request, Response } from 'express';
import UserModal, { IUser } from "../modals/UserModal";
import GroupModal from "../modals/GroupModal";
import GroupRequestModal from "../modals/GroupRequestModal";
import GroupChatsModal from "../modals/GroupChatsModal";
import { responseStructure, handleCatchErrorResponse } from "../utils/commonUtils";
import mongoose from 'mongoose';

export  const createGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { groupName, members } = req.body;
    const user = (req as any).user as IUser;
    const groupPhoto: string | undefined = (req as any).storedFileName;

    const createObj: { name: string; adminUserId: mongoose.Types.ObjectId; picture?: string } = {
      name: groupName,
      adminUserId: user._id,
    };

    if (groupPhoto) createObj.picture = groupPhoto;

    const newGroup = await GroupModal.create(createObj);

    if (!newGroup) {
      res.status(400).json(responseStructure(false, "Something Went Wrong"));
      return;
    }

    if (members && members.split(",").length > 0) {
      const groupConnections = members.split(",").map((member: string) => ({
        groupId: newGroup._id,
        request_by: "group",
        userId: member,
      }));

      await GroupRequestModal.insertMany(groupConnections);
    }

    res.status(201).json(responseStructure(true, "Group Created Successfully"));
  } catch (error) {
    res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
  }
};

export const updateGroupData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { group_id, name, adminUserId, members, status, is_active } = req.body;

    const user = (req as any).user as IUser;

    const group = await GroupModal.findOne({ _id: group_id, is_active: 1, adminUserId: user._id });

    if (!group) {
      res.status(404).json(responseStructure(false, "Group not found"));
      return;
    }

    if (adminUserId && group.adminUserId !== user._id) {
      const newAdmin = await UserModal.findOne({ _id: adminUserId, is_active: 1 });
      if (!newAdmin) {
        res.status(404).json(responseStructure(false, "New Admin Account Not Found"));
        return;
      }

      group.adminUserId = adminUserId;
      group.members.push(user._id);
    }

    if (members && members.split(",").length > 0 && group.members.length !== members.split(",").length) {
      if (group.members.length > members.split(",").length) {
        group.members = members.split(",");
      } else {
        const newMembers = (members as string).split(",").filter((member) => !group.members.includes(member as unknown as  mongoose.Types.ObjectId));

        if (newMembers && newMembers.length > 0) {
          const groupConnections = newMembers.map((member) => ({
            groupId: group_id,
            request_by: "group",
            userId: member,
          }));

          await GroupRequestModal.insertMany(groupConnections);
        }
      }
    } else if ((members && members.split(",").length === 0) || members === "") {
      group.members = [];
    }

    if (name && group.name !== name) group.name = name;

    if (status && group.status !== status) group.status = status;

    if (is_active && group.is_active !== parseInt(is_active)) {
      group.is_active = parseInt(is_active) as (0 | 1);
    }

    const groupPhoto: string | undefined = (req as  any).storedFileName;

    if (groupPhoto) group.picture = groupPhoto;

    await group.save();

    res.status(200).json(responseStructure(true, "Successfully updated Group"));
  } catch (error) {
    res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
  }
};

export  const getGroupAllRequestsForGroupAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;

    const groups = await GroupModal.find({
      adminUserId: user._id,
      is_active: 1,
    });

    if (!groups || groups.length === 0) {
      res.status(404).json(responseStructure(false, "Group Not Found"));
      return;
    }

    const groupJoinRequests = await GroupRequestModal.find({
      groupId: { $in: groups.map((group) => group._id) },
      status: "request",
      is_active: 1,
    })
      .select("_id userId status request_by groupId")
      .populate({
        path: "userId",
        select: "_id name picture username status",
      })
      .populate({
        path: "groupId",
        select: "_id adminUserId name members picture status",
        populate: { path: "adminUserId", select: "_id name picture username status" },
      });

    res.status(200).json(
      responseStructure(true, "Successfully Fetched All Requests", {
        groupJoinRequests: groupJoinRequests,
      })
    );
  } catch (error) {
    res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
  }
};

export const getUserAllGroupsJoinRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;

    const groupJoinRequests = await GroupRequestModal.find({
      userId: user._id,
      status: "request",
      is_active: 1,
    })
      .select("_id userId status request_by groupId")
      .populate({ path: "userId", select: "_id name picture username status" })
      .populate({
        path: "groupId",
        select: "_id adminUserId name members picture status",
        populate: { path: "adminUserId", select: "_id name picture username status" },
      });

    res.status(200).json(
      responseStructure(true, "Successfully Fetched All Requests", {
        groupJoinRequests: groupJoinRequests,
      })
    );
  } catch (error) {
    res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
  }
};

export const manageGroupRequestsByAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;

    const { requestId, groupId, status } = req.body as {
      requestId: string;
      groupId: string;
      status: string;
    };

    const group = await GroupModal.findOne({
      _id: groupId,
      adminUserId: user._id,
      is_active: 1,
    });

    if (!group) {
      res.status(404).json(responseStructure(false, "Group Not found"));
      return;
    }

    const groupConnection = await GroupRequestModal.findOneAndUpdate(
      {
        _id: requestId,
        groupId: group._id,
        is_active: 1,
        status: "request",
      },
      { status: status },
      { new: true }
    );

    if (!groupConnection) {
      res.status(400).json(responseStructure(false, "Something Went Wrong"));
      return;
    }

    if (status === "accepted") {
      group.members.push(groupConnection.userId);
      await group.save();
    }

    res.status(200).json(responseStructure(true, "Request Updated Successfully"));
  } catch (error) {
    res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
  }
};

export const manageGroupRequestsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId, groupId, status } = req.body as {
      requestId: string;
      groupId: string;
      status: string;
    };

    const user = (req as any).user as IUser;

    const group = await GroupModal.findOne({ _id: groupId, is_active: 1 });

    if (!group) {
      res.status(404).json(responseStructure(false, "Group Not Found"));
      return;
    }

    const groupConnection = await GroupRequestModal.findOne({
      _id: requestId,
      groupId: groupId,
      userId: user._id,
      status: "request",
      is_active: 1,
    });

    if (!groupConnection) {
      res.status(400).json(responseStructure(false, "Request not found"));
      return;
    }

    if (status === "rejected") {
      groupConnection.status = "rejected";
      await groupConnection.save();
    }

    if (status === "accepted") {
      if (groupConnection.request_by === "group") {
        groupConnection.status = "accepted";
        await groupConnection.save();
        group.members.push(user._id);
        await group.save();
      } else {
        res.status(400).json(responseStructure(false, "You do not have permissions to accept the request"));
        return;
      }
    }

    res.status(200).json(responseStructure(true, "Successfully Updated Request"));
  } catch (error) {
    res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
  }
};

export const leaveGroupForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { group_id } = req.body;

    const user = (req as any).user as IUser;

    const group = await GroupModal.findOne({ _id: group_id,members: user._id, is_active: 1 });

    if (!group) {
      res.status(404).json(responseStructure(false, "Group Not Found"));
      return;
    }

    const groupMembers  = group.members;

    group.members  = groupMembers.filter((member) => (member as mongoose.Types.ObjectId).toString()  !==  (user._id as mongoose.Types.ObjectId).toString());
    await  group.save();

    res.status(200).json(responseStructure(true, "Successfully leave  group"));
  } catch (error) {
    res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
  }
};

export const getGroupChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { group_id } = req.body as { group_id: string };

    const user = (req as any).user as IUser;

    const group = await GroupModal.findOne({
      _id: group_id,
      $or: [{ adminUserId: user._id }, { members: user._id }],
      is_active: 1,
    });

    if (!group) {
      res.status(404).json(responseStructure(false, "Group Not Found"));
      return;
    }

    const groupChats = await GroupChatsModal.find({
      group_id: group._id,
      is_active: 1,
    })
      .select("_id group_id sender_user_id message status")
      .populate({
        path: "sender_user_id",
        select: "_id name username status picture",
      });

    res.status(200).json(
      responseStructure(true, "Successfully Fetch Group Chats", { groupChats })
    );
  } catch (error) {
    res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
  }
};

export const makeGroupJoinRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;
    const { groupId } = req.body

    const group = await GroupModal.findOne({ _id: groupId, status: "active", is_active: 1 });

    if (!group) {
      res.status(404).json(responseStructure(false, "Group Not Found"));
      return;
    }

    const isRequestAlreadyExists = await GroupRequestModal.findOne({
      groupId: groupId,
      request_by: "user",
      userId: user._id,
      status: "request",
      is_active: 1,
    });

    if (isRequestAlreadyExists) {
      res.status(400).json(
        responseStructure(
          false,
          "Your previous request is pending to join this group. Please wait for the admin to process your request."
        )
      );
      return;
    }

    const groupRequest = await GroupRequestModal.create({
      groupId: group._id,
      request_by: "user",
      userId: user._id,
    });

    if (!groupRequest) {
      res.status(400).json(responseStructure(false, "Something Went Wrong"));
      return;
    }

    res.status(201).json(responseStructure(true, "New Request created successfully"));
  } catch (error) {
    res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
  }
};

export const getGroupsList = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;

    const groups = await GroupModal.find({
      is_active: 1,
      status: "active",
      adminUserId: { $ne: user._id },
      members: { $ne: user._id },
    })
      .populate({ path: "adminUserId", select: "_id name username picture" })
      .select("_id name picture status adminUserId members");

    res.status(200).json(responseStructure(true, "Groups Found Successfully", { groups }));
  } catch (error) {
    res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
  }
};
