import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss'],
})
export class FilterPopupComponent implements OnInit {
  filterForm!: FormGroup;
  managementType!: Array<{ id: number; name: string; value: string }>;
  selectedMgmt!: string;
  users$:any;
  sites$:any;
  contacts$:any;
  filteredList1:any;
  filteredList2:any;
  filteredList3:any;

  constructor(
    private formBuilder: FormBuilder,
    private manageUsersService: ManageUsersService,
    private manageSitesService: ManageSitesService,
    private manageContactsService: ManageContactsService,
    private matDialogRef: MatDialogRef<FilterPopupComponent>,
    private translate: TranslateService,
    
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }
    this.filterForm = this.formBuilder.group({
      options: [''],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      attachmentLevel: ['', Validators.required],
      isFile: [false],
      isNote: [false],
      selectId: [''],
      keyWord: ['', Validators.required]
    });
    this.manageUsersService.findAllUsersDropdown().subscribe((res) => {
      this.users$ = res;
      this.users$.sort(function (a:any, b:any) {
        var textA = a.firstName.toUpperCase();
        var textB = b.firstName.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      this.filteredList1 = this.users$.slice();
    });
    this.manageSitesService.findAllSitesDropdown().subscribe((res) => {
      this.sites$ = res;
      this.sites$.sort(function (a:any, b:any) {
        var textA = a.companyName.toUpperCase();
        var textB = b.companyName.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      this.filteredList3 = this.sites$.slice();
    });

    this.manageContactsService.findAllContactsDropdown().subscribe((res) => {
      this.contacts$ = res;
      this.contacts$.sort(function (a:any, b:any) {
        var textA = a.firstName.toUpperCase();
        var textB = b.firstName.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      this.filteredList2 = this.contacts$.slice();
    });
  }

  ngOnInit(): void {
    this.managementType = [
      { id: 1, name: 'Users', value: 'user' },
      { id: 2, name: 'Sites', value: 'sites' },
      { id: 3, name: 'Contacts', value: 'contacts' },
    ];
  }

  onChanged(event: any) {
    let managementType = this.managementType.filter(
      (s) => s.name === event.value
    );
    this.selectedMgmt = managementType[0].value;
    console.log(this.selectedMgmt);
  }

  submit() {
    this.matDialogRef.close(this.filterForm.value);
    console.log(this.filterForm.value);
  }
}
