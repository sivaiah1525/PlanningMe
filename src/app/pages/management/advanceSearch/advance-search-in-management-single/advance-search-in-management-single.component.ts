import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';

@Component({
  selector: 'app-advance-search-in-management-single',
  templateUrl: './advance-search-in-management-single.component.html',
  styleUrls: ['./advance-search-in-management-single.component.scss']
})
export class AdvanceSearchInManagementSingleComponent implements OnInit {
  singleSearchValue = ''
  ListSearch!: FormGroup
  filteredContacts: any;
  contacts$: any;
  filteredSites: any;
  sites$: any;
  products$: any;
  filteredProducts: any;
  filteredusers: any;
  users$: any;
  AllOption = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' },
    { v1: '<', v2: 'less than ' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<=', v2: 'less than or equal' }];
  Tags = [{id: 1, name: 'City'}, {id:2, name: 'Country'}, {id:3, name: 'Zipcode'}]
  constructor(
    private matDialogRef: MatDialogRef<AdvanceSearchInManagementSingleComponent>,
    private translate: TranslateService ,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contactService: ManageContactsService,
    private siteService: ManageSitesService,
    private productService: ManageProductsService,
    private userService: ManageUsersService,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }

  }

  ngOnInit(): void {
    this.ListSearch = this.formBuilder.group({
      Name: [null],
      Email: [null], 
      gender: [null],
      budget:[null],
      Position:[null],
      city:[null],
      country:[null],
      UsersId:[],
      ContactsId: [],
      SitesId: [],
      ProductsId: [],
      strategyConditions: this.formBuilder.array([
      ])
    });
    this.Addcondictuon()
    this.getallusers()
    this.getallContacts()
    this.getallSites()
    this.getallProducts()
  }


  getallusers(){
    // get all users
    this.userService.findAllUsersDropdown().subscribe((result) => {
      if (result) {
        this.users$ = result;
        this.filteredusers = result;
      }
    });
  } 

  getallContacts(){
    // get all contacts
    this.contactService.findAllContactsDropdown().subscribe((result) => {
      if (result) {
        this.contacts$ = result;
        this.filteredContacts = result;
      }
    });
  } 

  getallSites(){
    // get all sites
    this.siteService.findAllSitesDropdown().subscribe((result) => {
      if (result) {
        this.sites$ = result;
        this.filteredSites = result;
      }
    });
  } 
  getallProducts(){
    // get all sites
    this.productService.findAllProductsDropdown().subscribe((result) => {
      if (result) {
        this.products$ = result;
        this.filteredProducts = result;
      }
    });
  } 
  filterOptions(value: string, type: string): void {
    console.log(type);
      this.filteredContacts = this.contacts$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
      this.filteredSites = this.sites$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
      this.filteredProducts = this.products$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
      this.filteredusers = this.users$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
  }

  selactdatatype(event:any,index:number) {
    this.strategyConditions().at(index).get('dataType')?.setValue(event.dataType)
    this.strategyConditions().at(index).get('isTag')?.setValue(event.isTag)
  }
  getdataType(index:number){
    const value =this.strategyConditions().at(index).get('dataType')?.value
    return value
  }
  strategyConditions(): FormArray {
    return this.ListSearch.get("strategyConditions") as FormArray
  }

  getconditionDropDownListvalue(index:number){
    return this.strategyConditions().at(index).get('conditionDropDownList')?.value
  }
  newFile(): FormGroup {
    return this.formBuilder.group({
      conditionDropDownList: [null],
      conditionParameter: [""],
      conditionComparison: [""],
      value: [''],
      isTag: [''],
      dataType:'',
    })
  }

  Addcondictuon() {
    this.strategyConditions().push(this.newFile());
  }
  Removecondictuon(i: number) {
    this.strategyConditions().removeAt(i);
  }

  submit() {
    this.matDialogRef.close(this.singleSearchValue)

  }

}
