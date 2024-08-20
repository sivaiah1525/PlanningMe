import { Tag } from './tag.model';

export interface Contact {
    lastTargetDto: any;
    id: number;
    contactType: number;
    creatorId: string;
    creatorName: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    companyName: string;
    registrationNumber: string;
    address: string;
    zipCode: string;
    city: string;
    country: string;
    isActive: boolean;
    isTarget: boolean;
    isProspect: boolean;
    phoneNumber: string;
    tag: Tag;
    organizationId: number;
    organizationName: string;
    currencyId?: number;
    currencyName?: string;
    profilePicture: any;
    latitude?: any;
    longitude?: any;
    tagViewModels: any;
    // used by Contact Group
    contactName?: string;
}