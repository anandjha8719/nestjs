import { SetMetadata } from '@nestjs/common';
// import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// src/users/entities/user.entity.ts
import { Role } from '../../common/enums/role.enum';

export class User {
  id: number;
  email: string;
  password: string;
  name?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
