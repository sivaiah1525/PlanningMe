import { MonthTargetDTO } from './month-target-dto.model';

export interface SiteGroupTarget {
    targetId: number;
    id: number;
    name: string;
    creatorId: string;
    creatorName: string;
    year: string;
    yearlyTarget: number;
    yearlyAchievedAmount: number;
    currencyId: number;
    currencyName: string;
    monthsTargetDtos: MonthTargetDTO[];
    childIds: number[];

    // UI properties
    screen: string;
    percentage?: any;
    progressPercentage?: number;
    cssClass?: string;
    performanceGain?: number;
    targetValue?:any;
    totalAchievedValue?: any;

}