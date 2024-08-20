export interface Transaction {
    id: number;
    transactionId: string;
    organizationId: number;
    organizationName: string;
    transactionDate: string;
    contactsId: number;
    contactName: string;
    contactProfile?: any;
    productsId: number;
    productName: string;
    productProfile?: any;
    quantity: number;
    measureId: number;
    measureName: string;
    transactionTypeId: number;
    transactionTypeName: string;
    finalPrice: number;
    comments: string;
    siteId: number;
    siteName: string;
    tag: any;
    orderId?: string;
    currencyId: number;
    tagViewModels: any;
}