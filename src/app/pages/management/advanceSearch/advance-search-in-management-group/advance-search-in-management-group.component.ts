import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';

@Component({
  selector: 'app-advance-search-in-management-group',
  templateUrl: './advance-search-in-management-group.component.html',
  styleUrls: ['./advance-search-in-management-group.component.scss']
})
export class AdvanceSearchInManagementGroupComponent implements OnInit {
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
  constructor(
    private matDialogRef: MatDialogRef<AdvanceSearchInManagementGroupComponent>,
    private translate: TranslateService ,
    private userService: ManageUsersService,
    private contactService: ManageContactsService,
    private siteService: ManageSitesService,
    private productService: ManageProductsService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
      description: [''],
      UsersId: [],
      ContactsId: [],
      SitesId: [],
      ProductsId: [],
      keywords: []
    });
    this.getallusers();
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






  submit() {
    this.matDialogRef.close(this.singleSearchValue)

  }

}
