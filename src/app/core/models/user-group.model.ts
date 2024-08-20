import { User } from './user.model';

export interface UserGroup {
    [x: string]: any;
    id: number;
    userGroupName: string;
    creatorId: string;
    creatorName: string;
    usersCount: number;
    organizationId: number;
    users: User[];
    organizationName?: any;
    created?: any
}