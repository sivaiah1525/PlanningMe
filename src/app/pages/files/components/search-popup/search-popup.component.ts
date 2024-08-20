import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManagecontactService } from 'src/app/pages/management/manage-contacts/managecontact.service';
import { ManagesiteService } from 'src/app/pages/management/manage-sites/managesite.service';
import { ManageuserService } from 'src/app/pages/management/manage-users/manageuser.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss']
})
export class SearchPopupComponent implements OnInit {

  searchForm!: FormGroup;
  managementType!: Array<{ id: number, name: string, value: string }>;
  selectedMgmt!: string;
  filterforuserlist: any;
  filterforcontactlist: any;
  filterforsiteslist: any;
  filterforuserGrouplist: any;
  filterforcontactGrouplist: any;
  filterforsiteGrouplist: any;
  filterforProsuctlist: any;
  filterforProsucGrouptlist: any;
  filterfortransactionlist: any;
  filterforeventslist: any;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];

  constructor(private formBuilder: FormBuilder,
    private manageUsersService: ManageUsersService,
    private manageSitesService: ManageSitesService,
    private manageContactsService: ManageContactsService,
    private matDialogRef: MatDialogRef<SearchPopupComponent>,
    private manageProductsService: ManageProductsService,
    private calendarService: CalendarService,
    private ManageTransactionsService: ManageTransactionsService,
    private translate: TranslateService,
    
  ){
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    this.searchForm = this.formBuilder.group({
      options: ['1'],
      title: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      attachmentLevel: ['', Validators.required],
      selectid: ['', Validators.required],
      selectGroup: ['', Validators.required],
      isFile: [true],
      isNote: [true],
      keyword: ['', Validators.required]
    });

    this.getdatafordroupdown()
  }

  ngOnInit(): void {
    this.managementType = [
      { id: 1, name: 'Users', value: 'user' },
      { id: 2, name: 'Sites', value: 'sites' },
      { id: 3, name: 'Contacts', value: 'contacts' },
      { id: 4, name: 'Products', value: 'Products' },
      { id: 5, name: 'Orders', value: 'Orders' },
      { id: 6, name: 'Events', value: 'Events' },
    ];
  }

  onChanged(event: any) {
    let managementType = this.managementType.filter(s => s.name === event.value);
    this.selectedMgmt = managementType[0].value;
    console.log(this.selectedMgmt);

  }
  submit() {
    this.searchForm.get('keyword')?.setValue(this.keywordlist)
    console.log(this.searchForm.value);
    this.matDialogRef.close(this.searchForm.value);
  }

  onchange(val: any) {
    console.log(val)
    this.searchForm.get('options')?.setValue(val);
  }

  // ---------------- 
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent) {
    console.log(event.value)
    const value = (event.value || '').trim();
    if (value) { this.keywordlist.push(value); }
    // Clear the input value
    event.input.value = ''
    this.searchForm.get('keyword')?.setValue(null)
  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.keywordlist.push(event.option.viewValue);
    this.searchForm.get('keyword')?.setValue(null)
  }



  getdatafordroupdown() {
    // get all users 
    this.manageUsersService.findAllUsersDropdown().subscribe((res: any) => {
      console.log(res)
      const data = res;
      this.filterforuserlist = data;
    })
    // get all contacts 
    this.manageContactsService.findAllContactsDropdown().subscribe((res) => {
      console.log(res)
      const data = res;
      this.filterforcontactlist = data;
    })
    //get all sites 
    this.manageSitesService.findAllSitesDropdown().subscribe((res) => {
      console.log(res)
      const data = res;
      this.filterforsiteslist = data;
    })
    // get all product 
    this.manageProductsService.findAllProductsDropdown().subscribe((res) => {
      console.log(res)
      const data = res;
      this.filterforProsuctlist = data;
    })
    // get all transaction 
    this.ManageTransactionsService.fetchTransactionsServices(1000, 1, '').subscribe(
      (res: any) => {
        console.log(res)
        const data = res.data;
        this.filterfortransactionlist = data;
      });
    // get all events 
    this.calendarService.getAllEvents().subscribe((res: any) => {
      console.log(res)
      const data = res;
      this.filterforeventslist = data;
    })
    // get all User Group 
    this.manageUsersService.findAllUsersGroupDropdown().subscribe((res) => {
      console.log(res)
      const data = res;
      this.filterforuserGrouplist = data;
    })
    // get all contact Group 
    this.manageContactsService.findAllContactsGroupDropdown().subscribe((res) => {
      console.log(res)
      const data = res;
      this.filterforcontactGrouplist = data;
    })
    // get all siteGroup 
    this.manageSitesService.findAllSitesGroupDropdown().subscribe((res) => {
      console.log(res)
      const data = res;
      this.filterforsiteGrouplist = data;
    })
    // get all product group 
    this.manageProductsService.findAllProductsGroupDropdown().subscribe((res) => {
      console.log(res)
      const data = res;
      this.filterforProsucGrouptlist = data;
    })
  }





}
