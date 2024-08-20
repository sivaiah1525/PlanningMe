import { Product } from './product.model';

export class ProductGroup {
    i!: number;
    productGroupNam!: string;
    isTarge!: boolean;
    creatorI!: string;
    creatorNam!: string;
    productsCoun!: number;
    product!: Product[];
    created!: any;
}