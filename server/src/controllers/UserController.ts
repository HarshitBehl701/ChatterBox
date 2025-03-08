import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModal, { IUser } from '../modals/UserModal';
import FriendRequestModal from '../modals/FriendRequestModal';
import ChatsModal from '../modals/ChatsModal';
import jwt from 'jsonwebtoken';
import { getRandomString, responseStructure, handleCatchErrorResponse } from '../utils/commonUtils';
import mongoose from 'mongoose';
import Group from '../modals/GroupModal';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, username, password } = req.body;

        const userExists = await UserModal.findOne({
            $or: [
                { email: email },
                { username: username }
            ],
            is_active: 1
        });

        if (userExists) {
            res.status(400).json(responseStructure(false, "User Already Exists with the same email or username"));
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await UserModal.create({
            name: name,
            email: email,
            username: username,
            password: hashPassword,
        });

        res.status(201).json(responseStructure(true, "User Registered Successfully"));
    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body as { username: string; password: string };

        const user = await UserModal.findOne({ username, is_active: 1 })
            .populate({ path: 'friendsList', select: '_id name picture email username status friendsList is_active' });


        if (!user) {
            res.status(404).json(responseStructure(false, "Username or Password is incorrect"));
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            res.status(401).json(responseStructure(false, "Username or Password Not Matched"));
            return;
        }

        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined in environment variables");
        }

        const loginToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        const clientToken = jwt.sign({}, getRandomString(6));

        user.status = 'online';
        await user.save();

        res.cookie('ULOGINTOKEN', loginToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 86400000, // 24 hours
        });

        res.status(200).json(responseStructure(true, "User Login Successfully", { token: clientToken, user }));

    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('ULOGINTOKEN');

        res.status(200).json(responseStructure(true, "Successfully Logout"));
    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    try { 
        const userAccount = (req as  any).user as IUser;

        const user = await UserModal.findOne({ _id: userAccount._id, is_active: 1 })
            .select('_id name picture email username status friendsList is_active')
            .populate({ path: 'friendsList', select: '_id name picture email username status friendsList is_active' });

        if (!user) {
            res.status(404).json(responseStructure(false, "No User Found"));
            return;        
        }

        res.status(200).json(responseStructure(true, "Successfully Fetched User Details", { user }));

    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try { 
        const userAccount = (req as  any).user as IUser;
        const { name, username, email, password, status, is_active } = req.body as { 
            name?: string; 
            username?: string; 
            email?: string; 
            password?: string; 
            status?: string; 
            is_active?: string; 
        };

        const allowedFieldsToUpdate: Record<string, any> = { name, password, status };
        const updateFieldsRequested = Object.fromEntries(
            Object.entries(allowedFieldsToUpdate).filter(([_, value]) => value !== undefined)
        );

        if (username && userAccount.username.toLowerCase() !== username.toLowerCase()) {
            const isUserExistsWithSameUsername = await UserModal.findOne({
                _id: { $ne: userAccount._id },
                username,
                is_active: 1
            });

            if (isUserExistsWithSameUsername !== null) {
                res.status(400).json(responseStructure(false, "User Already Exists With Same Username"));
                return;
            }
            updateFieldsRequested.username = username;
        }

        if (email && userAccount.email.toLowerCase() !== email.toLowerCase()) {
            const isUserExistsWithSameEmail = await UserModal.findOne({
                _id: { $ne: userAccount._id },
                email,
                is_active: 1
            });

            if (isUserExistsWithSameEmail !== null) {
                res.status(400).json(responseStructure(false, "User Already Exists With Same Email"));
                return;
            }
            updateFieldsRequested.email = email;
        }
        
        if (is_active) {
            updateFieldsRequested.is_active = parseInt(is_active);
        }

        const saveImageName = (req as  any).storedFileName as string | undefined;

        if (saveImageName) updateFieldsRequested.picture = saveImageName;

        const updatedUser = await UserModal.findOneAndUpdate(
            { _id: userAccount._id, is_active: 1 },
            updateFieldsRequested,
            { new: true }
        );

        if (updatedUser === null) {
            res.status(400).json(responseStructure(false, "Something Went Wrong"));
            return;
        }

        res.status(200).json(responseStructure(true, "Successfully Updated User Profile"));

    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export const getAllActiveUsersList = async (req: Request, res: Response): Promise<void> => {
    try {
        const userAccount = (req as  any).user as IUser;

        const users = await UserModal.find({ _id: { $ne: userAccount._id }, is_active: 1 })
            .select('_id name picture email username status friendsList is_active');

        if (!users || users.length === 0) {
            res.status(404).json(responseStructure(false, "No Users Found"));
            return;
        }

        res.status(200).json(responseStructure(true, "Successfully Fetched All Users", { users }));

    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export const addFriendUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userAccount = (req as  any).user as IUser;
        const { request_sent_to_user_username } = req.body;

        const requestSentToUser = await UserModal.findOne({
            username: request_sent_to_user_username,
            is_active: 1
        });

        if (!requestSentToUser) {
            res.status(404).json(responseStructure(false, 'User Not Found'));
            return;
        }

        const isPreviousRequestPending = await FriendRequestModal.findOne({
            is_active: 1,
            status: { $ne: 'rejected' },
            $or: [
                { request_sent_by_user_id: userAccount._id, request_sent_to_user_id: requestSentToUser._id },
                { request_sent_by_user_id: requestSentToUser._id, request_sent_to_user_id: userAccount._id }
            ]
        });

        if (isPreviousRequestPending) {
            res.status(400).json(responseStructure(false, 'Request Already Exists, Please Wait For Previous Request To Be Fulfilled'));
            return;
        }

        try {
            const sendNewFriendRequest = await FriendRequestModal.create({
                request_sent_by_user_id: userAccount._id,
                request_sent_to_user_id: requestSentToUser._id,
                status: 'request'
            });

            if (!sendNewFriendRequest) {
                res.status(400).json(responseStructure(false, 'Something Went Wrong'));
                return;
            }

            res.status(201).json(responseStructure(true, 'Successfully Sent New Friend Request'));
        } catch (friendRequestCreateError) {
            res.status(500).json(responseStructure(false, handleCatchErrorResponse(friendRequestCreateError)));
        }

    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export const manageFriendRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const userAccount = (req as  any).user as IUser;
        const { request_id, newStatus } = req.body;

        const friendRequest = await FriendRequestModal.findOneAndUpdate(
            { _id: request_id, is_active: 1 },
            { status: newStatus },
            { new: true }
        );

        if (!friendRequest) {
            res.status(400).send(responseStructure(false, 'Something Went Wrong'));
            return;
        }

        if (newStatus === 'accepted') {
            const userInFriendRequestId =
                friendRequest.request_sent_by_user_id !== userAccount._id
                    ? friendRequest.request_sent_by_user_id
                    : friendRequest.request_sent_to_user_id;

            const loginUserAccount = await UserModal.findOne({ _id: userAccount._id, is_active: 1 })  as IUser;
            const userInFriendRequest = await UserModal.findOne({ _id: userInFriendRequestId, is_active: 1 })  as IUser;

            if (!loginUserAccount || !userInFriendRequest) {
                res.status(400).send(responseStructure(false, 'Something Went Wrong'));
                return;
            }

            const loginUserFriendsList = loginUserAccount.friendsList as unknown[];
            const userInFriendRequestFriendsList = userInFriendRequest.friendsList as unknown[];

            if (!loginUserFriendsList.includes(userInFriendRequest._id)) {
                loginUserAccount.friendsList.push(userInFriendRequest._id);
                await loginUserAccount.save();
            }

            if (!userInFriendRequestFriendsList.includes(loginUserAccount._id)) {
                userInFriendRequest.friendsList.push(loginUserAccount._id);
                await userInFriendRequest.save();
            }
        }

        res.status(200).send(responseStructure(true, "Successfully updated friend request"));
    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export const removeFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const userAccount = (req as  any).user as IUser;
        const { friend_id } = req.body;

        const friendAccount = await UserModal.findOne({ _id: friend_id, is_active: 1 });
        const loginUserAccount = await UserModal.findOne({ _id: userAccount._id, is_active: 1 });

        if (!friendAccount || !loginUserAccount) {
            res.status(404).send(responseStructure(false, 'No User Found'));
            return;
        }

        if (
            !friendAccount.friendsList.includes(userAccount._id) ||
            !loginUserAccount.friendsList.includes(friendAccount._id)
        ) {
            res.status(400).send(responseStructure(false, 'Not in friend List'));
            return;
        }

        // Remove friend ID from both users' friend lists
        friendAccount.friendsList = friendAccount.friendsList.filter(
            (id: mongoose.Types.ObjectId) => id !== userAccount._id
        );
        loginUserAccount.friendsList = loginUserAccount.friendsList.filter(
            (id: mongoose.Types.ObjectId) => id !== friendAccount._id
        );

        await friendAccount.save();
        await loginUserAccount.save();

        res.status(200).send(responseStructure(true, "Successfully removed friend"));
    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export const addFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const userAccount = (req as  any).user as IUser;
        const { friend_id } = req.body;

        if (!friend_id) {
            res.status(400).send(responseStructure(false, 'Friend ID is required'));
            return;
        }

        const friendAccount = await UserModal.findOne({ _id: friend_id, is_active: 1 });
        const loginUserAccount = await UserModal.findOne({ _id: userAccount._id, is_active: 1 });

        if (!friendAccount || !loginUserAccount) {
            res.status(404).send(responseStructure(false, 'No User Found'));
            return;
        }

        if (
            friendAccount.friendsList.includes(userAccount._id) ||
            loginUserAccount.friendsList.includes(friendAccount._id)
        ) {
            res.status(400).send(responseStructure(false, 'Already in friend list'));
            return;
        }

        const isPreviousRequestPending = await FriendRequestModal.findOne({
            is_active: 1,
            status: 'request',
            $or: [
                { request_sent_by_user_id: userAccount._id, request_sent_to_user_id: friendAccount._id },
                { request_sent_by_user_id: friendAccount._id, request_sent_to_user_id: userAccount._id },
            ],
        });

        if (isPreviousRequestPending) {
            res.status(400).send(responseStructure(false, 'Previous Friend Request is pending'));
            return;
        }

        await FriendRequestModal.create({
            request_sent_by_user_id: userAccount._id,
            request_sent_to_user_id: friendAccount._id,
            status: 'request',
        });

        res.status(200).send(responseStructure(true, 'Successfully sent new friend request'));
    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export  const getUserAllFriendRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const userAccount = (req as  any).user as IUser;

        const friendRequests = await FriendRequestModal.find({
            is_active: 1,
            status: 'request',
            $or: [
                { request_sent_by_user_id: userAccount._id },
                { request_sent_to_user_id: userAccount._id },
            ],
        })
            .populate({
                path: 'request_sent_by_user_id',
                select: '_id name username status is_active picture',
            })
            .populate({
                path: 'request_sent_to_user_id',
                select: '_id name username status is_active picture',
            })
            .select('_id request_sent_by_user_id request_sent_to_user_id status');

        res.status(200).json(
            responseStructure(true, 'Successfully fetched all friend requests', {
                requests: friendRequests,
            })
        );
    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export  const getUserAllGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const userAccount = (req as  any).user as IUser;

        const  groups = await Group.find({is_active:1,
            $or:[
                {adminUserId: userAccount._id},
                {members: userAccount._id}
            ]
        }).select('_id name adminUserId picture members status').populate({
            path: 'adminUserId',
            select:  '_id name  username picture status'
        }).populate({
            path: 'members',
            select:  '_id name  username picture status'
        })

        res.status(200).json(
            responseStructure(true, 'Successfully fetched all User Groups', {
                groups: groups,
            })
        );
    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};

export const getChatsData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userAccount = (req as  any).user as IUser;
        const { friend_id }: { friend_id: string } = req.body;

        const friendData = await UserModal.findOne({ _id: friend_id, is_active: 1 });

        if (!friendData) {
            res.status(404).json(responseStructure(false, 'User Not Found'));
            return;
        } else if (!friendData.friendsList.includes(userAccount._id)) {
            res.status(400).json(responseStructure(false, 'User not in your friend list, please add them first'));
            return;
        }

        const chats = await ChatsModal.find({
            $or: [
                { sender_unique_id: userAccount._id, receiver_unique_id: friendData._id },
                { sender_unique_id: friendData._id, receiver_unique_id: userAccount._id },
            ],
            is_active: 1,
        })
            .select('_id message sender_unique_id receiver_unique_id createdAt status')
            .populate({ path: 'sender_unique_id', select: '_id name username picture status' })
            .populate({ path: 'receiver_unique_id', select: '_id name username picture status' });

        res.status(200).json(responseStructure(true, 'Chats Found Successfully', { chats }));

    } catch (error) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(error)));
    }
};