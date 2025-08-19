import mongoose from "mongoose";
import { Roles } from "../enums/role.enum";
import AccountModel from "../models/account.model";
import RolePermissionModel from "../models/role-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException } from "../utils/appError";
import MemberModel from "../models/member.model";

export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture: string;
  email: string;
}) => {
  const { provider, providerId, displayName, picture, email } = data;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    console.log("Starting transaction for user login or creation");
    let user = await UserModel.findOne({ email }).session(session);
    if (!user) {
      // create user
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture,
      });
      await user.save({ session });

      // create account
      const account = new AccountModel({
        userId: user._id,
        provider,
        providerId,
      });
      await account.save({ session });

      // create workspace
      const workspace = new WorkspaceModel({
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });

      // get roles
      const ownerRole = await RolePermissionModel.findOne({
        name: Roles.OWNER,
      }).session(session);
      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      //create member
      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      // set current workspace
      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }

    await session.commitTransaction();
    console.log("Transaction committed successfully");
    session.endSession();
    return { user };
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction aborted due to error:", error);
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};
