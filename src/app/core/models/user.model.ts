import { Tag } from './tag.model';

export interface User {
    [x: string]: any;
    position: any;
    tagViewModels: any;
    profileName: any;
    id: string;
    organizationId: number;
    organizationName: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    dateOfBirth: string;
    fonction: string;
    address: string;
    zipCode: string;
    city: string;
    country: string;
    gender: string;
    formulaName: string;
    tag: Tag;
    roles: string[];
    profilePicture?: string;
    managerId?: string;
    managerName?: string
}