import { permission } from "process";
import {
  Roles,
  PermissionType,
  Permissions,
  RoleType,
} from "../enums/role.enum";

export const RolePermissions: Record<RoleType, Array<PermissionType>> = {
  OWNER: [
    Permissions.CREATE_WORKSPACE,
    Permissions.EDIT_WORKSPACE,
    Permissions.MANAGE_WORKSPACE_SETTINGS,
    Permissions.DELETE_WORKSPACE,

    Permissions.CREATE_PROJECT,
    Permissions.DELETE_PROJECT,
    Permissions.EDIT_PROJECT,

    Permissions.ADD_MEMBER,
    Permissions.CHANGE_MEMBER_ROLE,
    Permissions.REMOVE_MEMBER,

    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,

    Permissions.VIEW_ONLY,
  ],
  ADMIN: [
    Permissions.MANAGE_WORKSPACE_SETTINGS,

    Permissions.CREATE_PROJECT,
    Permissions.DELETE_PROJECT,
    Permissions.EDIT_PROJECT,

    Permissions.ADD_MEMBER,

    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,

    Permissions.VIEW_ONLY,
  ],
  MEMBER: [
    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,

    Permissions.VIEW_ONLY,
  ],
};
