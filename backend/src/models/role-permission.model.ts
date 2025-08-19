import mongoose, { Document, Schema } from "mongoose";
import {
  RoleType,
  PermissionType,
  Roles,
  Permissions,
} from "../enums/role.enum";
import { RolePermissions } from "../utils/role-permissions";

export interface RoleDocument extends Document {
  name: RoleType;
  permissions: Array<PermissionType>;
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      enum: Object.values(Roles),
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permissions),
      required: true,
      default: function (this: RoleDocument) {
        return RolePermissions[this.name];
      },
    },
  },
  { timestamps: true }
);

const RolePermissionModel = mongoose.model<RoleDocument>("Roles", roleSchema);
export default RolePermissionModel;
