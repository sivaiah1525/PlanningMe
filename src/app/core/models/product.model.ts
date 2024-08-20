export interface Product {
    lastTargetDto: any;
    id: number;
    creatorId: string;
    creatorName: string;
    organizationId: number;
    organizationName: string;
    contactsId: number;
    contactsName: string;
    productName: string;
    productDescription: string;
    isTarget: boolean;
    currencyId: number;
    currencyName: string;
    unitPrice: number;
    deliveredDate: string;
    expirationDate: string;
    comments: string;
    isActive: boolean;
    tag: any;
    productId?: any;
    picture?: string;
    stockQuantity?:any;
    stockTotalPrice:any;
}