import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Site } from 'src/app/core/models/site.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';;
import { ManageSitesService } from '../../../../core/services/manage-sites.service';
import { SiteGroup } from 'src/app/core/models/site-group.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-edit-site-group',
  templateUrl: './edit-site-group.component.html',
  styleUrls: ['./edit-site-group.component.scss']
})
export class EditSiteGroupComponent implements OnInit {
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist:any = [];
  editSiteForm!: FormGroup;
  siteIds:any= [];
  sites: Site[] = [];
  id!: string;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  sitedata: any;
  sitegroup: any;
  sites$!: Observable<Site[]>;
  constructor(private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<EditSiteGroupComponent>,
    private messageService: MessageService,
    private manageSitesService: ManageSitesService,
    public spinner: SpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }     
     }

  ngOnInit(): void {
    this.sitedata = this.data;
    console.log(this.sitedata, 'this.sitedata');
    this.siteIds = [];
    this.editSiteForm = this.formBuilder.group({
      id: ['', Validators.required],
      siteGroupName: ['', Validators.required],
      description: [''],
      siteId: [''],
      keywords: [''],
    });
    this.loadFormData();
    this.sites$ = this.manageSitesService.findAllSitesDropdown();
  }

  loadFormData(): void {
    if (this.sitedata?.getKeyword) {
      this.sitedata?.getKeyword.forEach((e:any) => {
        this.keywordlist.push(e)
      })
    }
    this.manageSitesService.fetchSiteGroupByIdService(this.sitedata.id).subscribe((data:any) => {
      this.sitegroup = data
      console.log(this.sitegroup, 'this.sitegroup')
      this.editSiteForm.get('id')?.setValue(this.sitedata.id);
      this.editSiteForm.get('siteGroupName')?.setValue(this.sitedata.siteGroupName);
      this.editSiteForm.get('description')?.setValue(this.sitedata.description);
      this.sitegroup.forEach((site: Site) => {
        this.sites.push(site);
        this.siteIds.push(site.id);
      })
      this.editSiteForm.get('siteId')?.setValue(this.siteIds);
    });
  }

  onChange(users:any) {
    console.log(users, 'users')
    var index = this.siteIds.indexOf(users.id);
    if (index === -1) {
      this.sites.push(users);
      this.siteIds.push(users.id);
    }
    else {
      // val is found, removing from array
      this.sites.splice(index, 1);
      this.siteIds.splice(index, 1);
    }
  }
  onSubmit(): void {
    this.editSiteForm.get('keywords')?.setValue(this.keywordlist.toString())
    this.manageSitesService.updateSitesGroupService(this.editSiteForm.value).subscribe((data:any) => {
      this.manageSitesService.fetchSiteGroupByIdService(this.sitedata.id);
      this.messageService.showMessage(data['response'][0].message);
      this.matDialogRef.close();
    });
  }

  removeContact(site: Site): void {
    const id = site.id;
    for (let i = 0; i < this.sites.length; i++) {
      const element = this.sites[i];
      if (id === element.id) {
        this.sites.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < this.siteIds.length; i++) {
      if (id === this.siteIds[i]) {
        this.siteIds.splice(i, 1);
        break;
      }
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
}
