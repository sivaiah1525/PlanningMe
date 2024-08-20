import { MonthTargetDTO } from './month-target-dto.model';

export interface ContactGroupTarget {
    childUserIds: any;
    sectionId: string;
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
    dynamicGrpId:number[];

    // UI properties
    screen: string;
    percentage?: any;
    cssClass?: string;
    performanceGain?: number;
    targetValue: any;
    totalAchievedValue: any;
    totalAchievedDuration: any;
    targetDuration: any;
    targetTypeName: any;
}