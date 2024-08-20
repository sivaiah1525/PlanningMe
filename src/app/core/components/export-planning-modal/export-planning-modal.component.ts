
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalendarService } from 'src/app/core/services/calendar.service';
// import { saveAs, FileSaver, Blob } from 'file-saver';
import * as FileSaver from 'file-saver';

// import {FileSaver } from 'angular-file-saver'
import { DomSanitizer } from '@angular/platform-browser';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ManageSitesService } from '../../services/manage-sites.service';
import { MatOption } from '@angular/material/core';
import { ManageContactsService } from '../../services/manage-contacts.service';
import { ManageUsersService } from '../../services/manage-users.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'pm-export-planning-modal',
  templateUrl: './export-planning-modal.component.html',
  styleUrls: ['./export-planning-modal.component.scss'],
})
export class ExportPlanningModalComponent implements OnInit {
  @ViewChild('allresource') private allresource!: MatOption;
  resourceList:any;
  filteredList1:any;
  filteredList3:any;
  filterforuserGrouplist:any;
  filterforcontactGrouplist:any;
  filterforsiteGrouplist:any;
  filterforcontactlist:any;
  sites$:any;
  categories:any;
  exportPlanningForm!: FormGroup;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  constructor(
    private matDialogRef: MatDialogRef<ExportPlanningModalComponent>,
    private formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private manageUsersService: ManageUsersService,
    private sanitizer: DomSanitizer,
    private manageSitesService: ManageSitesService,
    private manageContactsService: ManageContactsService,
    private translate: TranslateService ,
    public datepipe: DatePipe,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
  }

  ngOnInit() {
    this.getAlldropdownvalue()
    this.exportPlanningForm = this.formBuilder.group({
      fileFormat: ['xlsx', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      resource: [''],
      contactids: [''],
      categoryId: [''],
      keyword: [''],
      SiteId: [''],
      selectGroup: [''],
      isPrivate: [true],
      isPublic: [true],
      isonline: [true],
      offline: [true],
      hasFile: [true],

    }) 


  }

  download() {
    this.exportPlanningForm.get('keyword')?.setValue(this.keywordlist.toString())
    console.log(this.exportPlanningForm.value)
    const startDate = this.datepipe.transform(this.exportPlanningForm.value.startDate, 'yyyy-MM-dd')
    const endDate = this.datepipe.transform(this.exportPlanningForm.value.endDate,'yyyy-MM-dd');
    this.exportPlanningForm.get('startDate')?.setValue(startDate)
    this.exportPlanningForm.get('endDate')?.setValue(endDate)
    this.calendarService.exportEvents(this.exportPlanningForm.value).subscribe((response) => {
      if (response) {
        let blob = new Blob([response], { type: 'application/zip' });
        FileSaver.saveAs(blob);
        this.matDialogRef.close()
      }

    });
  }


  SelectionAllUserGroup() {
    if (this.allresource.selected) {
      this.allresource.value = 0;
      this.exportPlanningForm.get('resource')?.patchValue([
        ...this.filteredList1.map((item:any) => item.id),
        0,
      ]);

    } else {
      this.exportPlanningForm.get('resource')?.patchValue([]);
    }
  }



  // ---------------- 
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) { this.keywordlist.push(value); }
    // Clear the input value
    event.input.value = ''

  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.keywordlist.push(event.option.viewValue);
  }

  getAlldropdownvalue() {
    // findAllUsers
    this.calendarService.findAllUsers().subscribe((res) => {
      this.resourceList = res;
      this.resourceList.sort(function (a:any, b:any) {
        var textA = a.firstName.toUpperCase();
        var textB = b.firstName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList1 = this.resourceList.slice()
    })
    // getCategory 
    this.calendarService.getCategory().subscribe((res) => {
      this.categories = res
    })
    // findAllSites 
    this.manageSitesService.findAllSitesDropdown().subscribe((res) => {
      this.sites$ = res;
      this.sites$.sort(function (a:any, b:any) {
        var textA = a.companyName.toUpperCase();
        var textB = b.companyName.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      this.filteredList3 = this.sites$.slice();
    });
    // get all contacts 
    this.manageContactsService.findAllContactsDropdown().subscribe((res) => {
      console.log(res)
      const data = res;
      this.filterforcontactlist = data;
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
    this.manageSitesService.findAllSitesDropdown().subscribe((res) => {
      console.log(res)
      const data = res;
      this.filterforsiteGrouplist = data;
    })
  }


}
