
export interface MonthTargetDTO {
    targetId: number;
    month: string;
    monthlyTarget: number;
    monthlyAchievedAmount: number;

    // UI properties
    percentage?: number;
    progressPercentage?: number;
    cssClass?: string;
    performanceGain?: number;
}
