import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import RolePermissionModel from "../models/role-permission.model";
import { RolePermissions } from "../utils/role-permissions";

const seedRoles = async () => {
  console.log("Seeding roles started...");

  try {
    await connectDatabase();
    const session = await mongoose.startSession();

    session.startTransaction();

    console.log("Clearing existing data...");
    await RolePermissionModel.deleteMany({}, { session });

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permissions = RolePermissions[role];

      const existingRole = await RolePermissionModel.findOne({
        name: role,
      }).session(session);

      if (!existingRole) {
        const newRole = new RolePermissionModel({
          name: role,
          permissions,
        });
        await newRole.save({ session });
      } else {
        console.log(`Role ${role} already exists`);
      }
    }

    await session.commitTransaction();
    console.log("Transaction commited");
    session.endSession();
    console.log("Session ended.");
    console.log("Seeding completed successfully");
  } catch (error) {
    console.log(`Error seeding roles ${error}`);
  }
};

seedRoles().catch((error) => {
  console.log(`Error running script: `, error);
});
