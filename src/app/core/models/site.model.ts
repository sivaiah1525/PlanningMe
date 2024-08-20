import { Tag } from './tag.model';

export class Site {
    id?: number;
    creatorId?: string;
    creatorName?: string;
    organizationId?: number;
    organizationName?: string;
    companyName?: string;
    siteName?: string;
    address?: string;
    zipCode?: string;
    city?: string;
    country?: string;
    registrationNumber?: string;
    activityName?: string;
    isTarget?: boolean;
    currencyId?: number;
    currencyName?: string;
    contactPhone?: string;
    isActive?: boolean;
    tag?: Tag;
    latitude?: string;
    longitude?: string;
    selected?: boolean;
    lastTargetDto: any;
}