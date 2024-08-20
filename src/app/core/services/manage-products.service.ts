import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ProductGroup } from '../models/product-group.model';
import { ProductGroupTarget } from '../models/product-group-target.model';
import { environment } from '../../../environments/environment';
import { Measure } from '../models/measure.model';
import { AchievedAmount } from '../models/achieved-amount.model';


const baseUrl = environment.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class ManageProductsService {

    constructor(private http: HttpClient) { }
    fetchProducts(noOfRecords: number, pageNo: number, search:any) {
        return this.http.get(baseUrl + '/api/Products/PT001FindProductsByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search)
    }

    fetchProductsService(noOfRecords: number, pageNo: number): Observable<Product[]> {
        return this.http.get(baseUrl + '/api/Products/PT001FindProductsByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
            .pipe(map((data:any) => data['data']));
    }


    findAllProductsDropdown(): Observable<any> {
        return this.http.get(baseUrl + '/api/Products/FindAllProduct')
    }
    findAllProductsGroupDropdown() {
        return this.http.get(baseUrl + '/api/ContactsGroupName/FindContactGroupDropdown')
    }

    fetchProductByIdService(id: string): Observable<Product> {
        return this.http.get<Product>(baseUrl + '/api/Products/PT001FindProductById?Id=' + id);
    }

    fetchProductGroupsService(noOfRecords: number, pageNo: number) {
        return this.http.get(baseUrl + '/api/ProductsGroupName/FindProductsGroupByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
            .pipe(map((data:any) => data['data']));
    }

    fetchProductGroups(noOfRecords: number, pageNo: number, search:any) {
        return this.http.get(baseUrl + '/api/ProductsGroupName/FindProductsGroupByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search)
    }

    fetchProductGroupByIdService(id: number) {
        return this.http.get(baseUrl + '/api/ProductsGroupName/FindProductsByGroupId?Id=' + id);
    }
    getDynamicGroupService(entity:any, id: string) {
        return this.http.get(baseUrl + '/api/DynamicGroup/FindDynamicGroupData?DynamicGroupId=' + id + '&TableName=' + entity);
    }


    fetchProductGroupsTargetService(noOfRecords: number, pageNo: number, keyword: string): Observable<ProductGroupTarget[]> {
        return this.http.get(baseUrl + '/api/TargetOfProducts/PTFindTargetOfProductsByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + keyword)
            .pipe(map((data:any) => data['data']));
    }
    fetchProductTargetService(noOfRecords: number, pageNo: number, keyword: string) {
        return this.http.get(baseUrl + '/api/TargetOfProducts/PTFindTargetOfProductsByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + keyword)

    }

    fetchProductsAchievedAmountService(ids: string, year: number, isMonthly: boolean, monthName: string): Observable<AchievedAmount[]> {
        return this.http.get<AchievedAmount[]>(baseUrl + '/api/TargetOfProducts/PTFindProductAchievedAmount?Id=' + ids + '&year=' + year + '&isMonthly=' + isMonthly + '&monthName=' + monthName);
    }

    createProductGroupService(value: any): Observable<any> {
        const reqdata = value;
        return this.http.post(baseUrl + '/api/ProductsGroupName/create', reqdata);
    }

    FindProductPrices(value: any): Observable<any> {
        const reqdata = value;
        return this.http.post(baseUrl + '/api/Transaction/FindProductPrices', reqdata);
    } 

    FindProductMatrixConditionsByProductId(id:any): Observable<any> {
        return this.http.get(baseUrl + '/api/Products/FindProductMatrixConditionsByProductId?ProductId='+id);
    }

    

    updateProductsGroupService(requestData: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        }
        return this.http.put(baseUrl + '/api/ProductsGroupName/Update', requestData, httpOptions);
    }

    deleteProductsGroupService(id: string) {
        return this.http.delete(baseUrl + '/api/ProductsGroupName/delete?Id=' + id).toPromise();
    }


    createProductService(formData: any) {
        const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
        return this.http.post(baseUrl + '/api/Products/Create', formData, { headers: headers });
    }

    updateProductService(formData: any) {
        const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
        return this.http.put(baseUrl + '/api/Products/Update', formData, { headers: headers });
    }

    updateProductprice(ProductId:any, Price:any, IsSellingPrice:any) {
        const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
        return this.http.put(baseUrl + '/api/Products/UpdateProductPrice?ProductId=' + ProductId + '&Price=' + Price + '&IsSellingPrice=' + IsSellingPrice, headers);
    }

    fetchAllMeasuresService(): Observable<Measure[]> {
        return this.http.get<Measure[]>(baseUrl + '/api/Measure/FindAllMeasures');
    }

    deleteproduct(id: number) {
        return this.http.delete(baseUrl + '/api/Products/Delete?Id=' + id).toPromise();
    }

    deletetargetproduct(TargetIdentity: number) {
        return this.http.delete(baseUrl + '/api/TargetOfProducts/DeleteTargetOfProducts?Id=' + TargetIdentity).toPromise();
    }
    DeleteTargetOfGroupOfProducts(TargetIdentity: number) {
        return this.http.delete(baseUrl + '/api/TargetOfGroupOfProducts/DeleteTargetOfGroupOfProducts?TargetIdentity=' + TargetIdentity).toPromise();
    }

    createtag(value: any, tablename:any): Observable<any> {
        const reqdata = value;
        return this.http.post(baseUrl + '/api/Tags/AddTagColumns?TableName=' + tablename, reqdata);
    }
    gettag(tablename:any) {
        return this.http.get(baseUrl + '/api/Tags/FindTagColumns?TableName=' + tablename);
    }
    deletetag(id: number) {
        return this.http.delete(baseUrl + '/api/Tags/DeleteTag?Id=' + id);
    }
    updateprofileproductId(id:any, formData: any) {
        console.log(formData)
        const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
        return this.http.put(baseUrl + '/api/Products/UpdateProductProfile?ProductId=' + id, formData, { headers: headers })
    }
    singleToAddGroup(ProductId:any, GroupId:any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
        return this.http.post(baseUrl + ' /api/ProductsGroupName/AddProductInGroup?ProductId=' + ProductId + '&GroupId=' + GroupId, httpOptions)
    }

    GetProductPriceHistory(ProductId:any, IsSellingPrice:any, NumberOfRecord:any, PageNumber:any) {
        return this.http.get(baseUrl + '/api/Products/FindProductPriceHistory?ProductId=' + ProductId + '&IsSellingPrice=' + IsSellingPrice + '&NumberOfRecord=' + NumberOfRecord + '&PageNumber=' + PageNumber);

    }
    GetDiscountHistory(DiscountId:any, NumberOfRecord:any, PageNumber:any) {
        return this.http.get(baseUrl + '/api/Discount/FindDiscountHistory?DiscountId=' + DiscountId + '&NumberOfRecord=' + NumberOfRecord + '&PageNumber=' + PageNumber);
    }
    GetDiscountMatrix(DiscountId:any, NumberOfRecord:any, PageNumber:any) {
        return this.http.get(baseUrl + '/api/Discount/FindDiscountMatrix?DiscountId=' + DiscountId + '&NumberOfRecord=' + NumberOfRecord + '&PageNumber=' + PageNumber);
    }

    getProductGroups(id:any) {
        return this.http.get(baseUrl + '/api/ProductsGroupName/FindProductsByGroupId?Id=' + id);
      }
}
