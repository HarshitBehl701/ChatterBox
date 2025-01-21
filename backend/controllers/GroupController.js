const UserModal = require("../modals/UserModal");
const GroupModal = require("../modals/GroupModal");
const GroupRequestModal = require("../modals/GroupRequestModal");
const GroupChatsModal = require("../modals/GroupChatsModal");
const path = require('path');
const fs = require("fs");

const createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const isGroupExistsWithSameName = await GroupModal.findOne({
      name: groupName,
      adminUserId: user._id,
      is_active: 1,
    });

    if (isGroupExistsWithSameName)
      return res
        .status(400)
        .send({ message: "Group  Already Exists With  Same  Name" });

    try {
      const membersDetails = await UserModal.find({
        username: { $in: members },
        is_active: 1,
      }).select("username");

      const flattenedUsernames = membersDetails.flatMap(
        (item) => item.username
      );

      const newGroup = await GroupModal.create({
        name: groupName,
        adminUserId: user._id,
      });

      if (!newGroup)
        return res
          .status(400)
          .send({ message: "Some Unexpected  Error Occured", status: false });

          try{
            const groupConnections = flattenedUsernames.map((username) => ({
                groupId: newGroup._id,
                request_by: "group",
                username,
              }));
    
              await GroupRequestModal.insertMany(groupConnections);

              return res
                .status(201)
                .send({ message: "Group Created  Successfully", status: true });

          }catch(groupConnectionCreateError){
            return  res.status(500).send({message: error.message, status: false});
          }
    } catch (groupCreateError) {
      return res
        .status(500)
        .send({ message: groupCreateError.message, status: false });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const { groupName } = req.body;

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const group = await GroupModal.findOne({ name: groupName, $or: [
      {members: user._id},
      {adminUserId:  user._id}
    ], is_active: 1 }).select(['name','picture','status', 'members' ,'adminUserId']).populate({
      path: "members",
      select: "name  username status  picture",
    }).populate({
      path: "adminUserId",
      select: 'username'
    });


    if (!group) return res.status(400).send({ message: "Group  Not  Exists" });

    const requiredData = group.members.map((val) => {
      return  {
        name: val.name,
        username: val.username,
        status: val.status,
        picture: val.picture,
        is_friend: user.friendsList.indexOf(val._id) !== -1,
      }
    
    });


    return res
      .status(200)
      .send({
        message: "Resource  Found  Successfully",
        status: true,
        data: {
          membersList: requiredData,
          groupDetail: {
            name:  groupName,
            status:  group.status,
            picture:  group.picture,
            totalMembers:  requiredData.length,
            adminUsername:  group.adminUserId.username,
          },
          is_current_user_is_Admin: group.adminUserId.username == user.username
        },
      });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
};

const getGroupRequestsByUsers = async (req, res) => {
  try {
    const { groupName } = req.body;

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const group = await GroupModal.findOne({
      name: groupName,
      adminUserId: user._id,
      is_active: 1,
    });

    if (!group)
      return res
        .status(400)
        .send({
          message: "You Don't  have permissions to  see this  group requests",
        });

    const groupJoinRequests = await GroupRequestModal.find({
      groupId: group._id,
      request_by: 'user',
      status: "request",
      is_active: 1,
    }).select("username status groupId");

    return res
      .status(200)
      .send({
        message: "Resource  Found  Successfully",
        status: true,
        data: groupJoinRequests,
      });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
};

const getGroupRequestsToUsers = async (req, res) => {
  try {

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const groupJoinRequests = await GroupRequestModal.find({
      request_by: 'group',
      username:  user.username,
      status: "request",
      is_active: 1,
    }).select('groupId').populate({
      path: 'groupId',
      select:  'name picture',
      populate:{
        path: 'adminUserId',
        select: 'name  username'
      }
    });

    const requiredData  =  groupJoinRequests.map((val) =>  {
      return  {
        'groupId': val.groupId._id,
        'groupName': val.groupId.name,
        'groupPicture': val.groupId.picture,
        'adminUsername': val.groupId.adminUserId.username,
        'adminName': val.groupId.adminUserId.name,
      }
    })

    return res
      .status(200)
      .send({
        message: "Resource  Found  Successfully",
        status: true,
        data: requiredData,
      });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
};

const manageGroupRequestsByAdmin = async (req, res) => {
  try {
    const { groupId, username, newStatus } = req.body;

    const adminUser = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });
    
    const requestUser = await UserModal.findOne({
      username: username,
      is_active: 1,
    });


    if (!adminUser ||  !requestUser)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const group = await GroupModal.findOne({
      _id: groupId,
      adminUserId: adminUser._id,
      is_active: 1,
    });

    if (!group)
      return res
        .status(400)
        .send({
          message: "You Don't  have permissions to mange group requests",
        });

        const setStatus = newStatus == 'accept' ?   "joined"  : 'rejected';

    const groupConnection = await GroupRequestModal.findOneAndUpdate(
      {
        groupId: group._id,
        request_by: 'user',
        username: requestUser.username,
        is_active: 1,
        status: { $ne: "rejected" },
      },
      { status: setStatus },
      { new: true }
    );

    if (!groupConnection)
      return res
        .status(400)
        .send({ message: "Some Unexpected Error Occured", status: false });
    
    const previousMembers = group.members;

    const  isAlreadyInMembersList = previousMembers.indexOf(requestUser._id);

    if(setStatus ==  'joined' &&  isAlreadyInMembersList   ==  -1){
      previousMembers.push(requestUser._id);
    }else if(setStatus == 'rejected' && isAlreadyInMembersList  !==  -1){
      previousMembers.splice(isAlreadyInMembersList,1);
    }

    group.members  = previousMembers;
    await  group.save();


    return res
      .status(200)
      .send({ message: "Status  Changed Successfully", status: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
};

const manageGroupRequestsByUser = async (req, res) => {
  try {
    const { groupId, newStatus } = req.body;

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const group = await GroupModal.findOne({
      _id: groupId,
      is_active: 1,
    });

    if (!group)
      return res
        .status(400)
        .send({
          message: "Group Not  Found with  this  name",
        });

    const setStatus = newStatus == 'accept' ?   "joined"  : 'rejected';

    const groupConnection = await GroupRequestModal.findOneAndUpdate(
      {
        groupId: group._id,
        request_by: 'group',
        username: user.username,
        status: 'request',
        is_active: 1,
      },
      { status: setStatus },
      { new: true }
    );

    if (!groupConnection)
      return res
        .status(400)
        .send({ message: "Some Unexpected Error Occured", status: false });

    const previousMembers = group.members;

    const  isAlreadyInMembersList = previousMembers.indexOf(user._id);

    if(setStatus ==  'joined' &&  isAlreadyInMembersList   ==  -1){
      previousMembers.push(user._id);
    }else if(setStatus == 'rejected' && isAlreadyInMembersList  !==  -1){
      previousMembers.splice(isAlreadyInMembersList,1);
    }

    group.members  = previousMembers;
    await  group.save();

    return res
      .status(200)
      .send({ message: "Status  Changed Successfully", status: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
};

const manageGroupMembers = async (req, res) => {
  try {
    const { groupName, username, action } = req.body;

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    const memberDetail = await UserModal.findOne({
      username: username,
      is_active: 1,
    });

    if (!user || !memberDetail)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const group = await GroupModal.findOne({
      name: groupName,
      adminUserId: user._id,
      is_active: 1,
    });

    if (!group)
      return res
        .status(400)
        .send({
          message: "You Don't  have permissions to mange group members",
        });

    const membersList = group.members;
    const userExistsInGroup = membersList.indexOf(memberDetail._id);

    if (userExistsInGroup == -1) {
      return res
        .status(400)
        .send({ message: "User is not  in this group", status: false });
    }

    if (action == "transfer_ownership") {
      group.adminUserId = memberDetail._id;
      const groupMembers = group.members;

      const isPastAdminInMemberList =  groupMembers.indexOf(user._id);
      const newAdminIndexInMemberList = groupMembers.indexOf(memberDetail._id);

      if(isPastAdminInMemberList == -1 ){
        groupMembers.push(user._id);
      }

      groupMembers.splice(newAdminIndexInMemberList,1);

      group.members = groupMembers;

    } else if (action == "remove_member") {
      membersList.splice(userExistsInGroup, 1);
      group.members = membersList;
    } else {
      return res
        .status(400)
        .send({ message: "Action  Is Invalid", status: false });
    }

    await group.save();

    return res
      .status(200)
      .send({
        message: "Action  Performed  Changed  Successfully",
        status: true,
      });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
};

const manageGroup = async (req, res) => {
  try {
    const { groupName, action } = req.body;

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const group = await GroupModal.findOne({
      name: groupName,
      adminUserId: user._id,
      is_active: 1,
    });

    if (!group)
      return res
        .status(400)
        .send({ message: "You Don't  have permissions to delete this  group" });

    if (action == "inactive") {
      group.status = "inactive";
    } else if (action == "active") {
      group.status = "active";
    } else if (action == "delete") {
      group.is_active = 0;
    } else {
      return res
        .status(400)
        .send({ message: "Invalid Request", status: false });
    }

    await group.save();
    return res
      .status(200)
      .send({
        message: "Action  Performed  Changed  Successfully",
        status: true,
      });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
};

const updateGroupPicture  = async   (req,res) => {
  try {
    const { groupName } = req.body;

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const group = await GroupModal.findOne({
      name: groupName,
      adminUserId: user._id,
      is_active: 1,
    });

    if (!group)
      return res
        .status(400)
        .send({ message: "You Don't  have permissions to change this  group picture" });

    if(group.picture){
      const oldPicturePath = path.resolve(process.cwd(),"../frontend/src/assets/images/groupPicture",group.picture).trim();
            
      if (fs.existsSync(oldPicturePath)) {
          try {
              fs.unlinkSync(oldPicturePath);
          } catch (unlinkErr) {
              console.error("Error removing old file:", unlinkErr.message);
          }
      }
    }

    group.picture  = req.storedFileName
    await group.save();
    return res
      .status(200)
      .send({
        message: "Action  Performed  Changed  Successfully",
        status: true,
      });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
}

const updateGroupName = async (req, res) => {
  try {
    const { groupName, newName } = req.body;

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const group = await GroupModal.findOne({
      name: groupName,
      adminUserId: user._id,
      is_active: 1,
    });

    if (!group)
      return res
        .status(400)
        .send({ message: "You Don't  have permissions to delete this  group" });


    const isSimilarNameGroupExists = await   GroupModal.findOne({name:  newName,is_active:1});

    if(isSimilarNameGroupExists)
      return res.status(400).send({message:"Group  Already Exists With Same Name",status:false});
    
    group.name  = newName;
    await group.save();
    return res
      .status(200)
      .send({
        message: "Rename  Group  Successfully",
        status: true,
      });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
};

const getGroupChats = async (req, res) => {
  try {
    const { groupName } = req.body;

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const group = await GroupModal.findOne({ name: groupName, $or: [
      {adminUserId:   user._id},
      {members: user._id}
    ] , is_active: 1 });

    if (!group)
      return res
        .status(400)
        .send({ message: "Invalid Request  Group Not   Found" });

    const groupChats = await GroupChatsModal.find({
      group_id: group._id,
      is_active: 1,
    })
      .select(["sender_unique_id", "message"])
      .populate({
        path: "sender_unique_id",
        select: "username   status  picture",
      });

    return res
      .status(200)
      .send({
        message: "Resources  Fetch  Successfully",
        status: true,
        data: {
          chats : groupChats,
          groupId: group._id,
          picture: group.picture
        },
      });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: true });
  }
};

const groupJoinRequest  =  async  (req,res)  => {
  try{

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

      const {groupName,groupId} = req.body

    const group  = await   GroupModal.findOne({_id: groupId, name: groupName, status:  'active',is_active: 1});


    if(!group)
      return  res.status(409).send({message: "Group  Not    Found",status:false});


    const  isRequestAlreadyExists =  await  GroupRequestModal.findOne({groupId:  groupId,request_by: 'user',username:  user.username,status: 'request',is_active: 1});

    if(isRequestAlreadyExists)
      return  res.status(400).send({message: "Your previous request is  pending to join  this group,   please wait for the admin  to complete previous request",status:false});

    try{
      const groupRequest = await  GroupRequestModal.create({
        groupId:  group._id,
        request_by: 'user',
        username:  user.username
      });

      return res.status(200).send({message: "Add   Request  Added  Successfully",status:true});
    }catch(createGroupRequestError){
      return  res.status(500).send({message: createGroupRequestError.message,status:false})
    }
    
  }catch(error){
    return  res.status(500).send({message: error.message,status:false})
  }
}

const getGroupsList =  async  (req,res) =>  {
  try{

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    if (!user)
      return res
        .status(409)
        .send({ message: "User Not  Found", status: false });

    const groups  = await   GroupModal.find({is_active: 1, status:  'active', adminUserId:{$ne:  user._id} , members:  {$ne: user._id}}).select(['name','picture']);

    return res.status(200).send({message: "Resource Fetch  Successfully",status:true,data: groups});

  }catch(error){
    return  res.status(500).send({message: error.message,status:false})
  }

}

const addNewMember  =  async  (req,res)  => {
  try{

    const {username,groupName} = req.body

    const user = await UserModal.findOne({
      _id: req.userId,
      username: req.userName,
      is_active: 1,
    });

    const newMember  = await UserModal.findOne({username:username,is_active: 1});

    if (!user || !newMember)
      return res
    .status(409)
    .send({ message: "User Not  Found", status: false });


    const group  = await   GroupModal.findOne({name: groupName,adminUserId: user._id, status:  'active',is_active: 1});


    if(!group)
      return  res.status(409).send({message: "Group  Not Found",status:false});


    const  isRequestAlreadyExists =  await  GroupRequestModal.findOne({groupId:  group._id,$or:  [
      {request_by: 'group'},
      {request_by: 'user'},
    ],username:  user.username,status: 'request',is_active: 1});

    if(isRequestAlreadyExists)
      return  res.status(400).send({message: "Previous Request is Already  Pending for  this  user  to  join  this group ",status:false});

    try{
      const groupRequest = await  GroupRequestModal.create({
        groupId:  group._id,
        request_by: 'group',
        username:  newMember.username
      });

      return res.status(200).send({message: "Add   Request  Added  Successfully",status:true});
    }catch(createGroupRequestError){
      return  res.status(500).send({message: createGroupRequestError.message,status:false})
    }
    
  }catch(error){
    return  res.status(500).send({message: error.message,status:false})
  }
}

module.exports = {
  createGroup,
  getGroupMembers,
  getGroupRequestsByUsers,
  getGroupRequestsToUsers,
  manageGroupRequestsByAdmin,
  manageGroupRequestsByUser,
  manageGroupMembers,
  updateGroupPicture,
  manageGroup,
  updateGroupName,
  getGroupChats,
  groupJoinRequest,
  getGroupsList,
  addNewMember
};
