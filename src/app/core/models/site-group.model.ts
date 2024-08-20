import { Site } from './site.model';

export interface SiteGroup {
    id: number;
    siteGroupName: string;
    isTarget: boolean;
    creatorId: string;
    creatorName: string;
    sitesCount: number;
    sites: Site[];
    created?: any;
}