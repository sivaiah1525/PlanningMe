import { Contact } from './contact.model';

export interface ContactGroup {
    dynamicGroupId: any;
    id: number;
    contactGroupName: string;
    isTarget: boolean;
    creatorId: string;
    creatorName: string;
    contactsCount: number;
    contacts: Contact[];
    created?: any
}