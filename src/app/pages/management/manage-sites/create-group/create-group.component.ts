import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Site } from 'src/app/core/models/site.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ManageSitesService } from '../../../../core/services/manage-sites.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TargetService } from 'src/app/core/services/target.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ManagesiteService } from '../managesite.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';

export class Sites {
  constructor(public id: number,
    public creatorId: string,
    public creatorName: string,
    public organizationId: number,
    public organizationName: string,
    public companyName: string,
    public siteName: string,
    public address: string,
    public zipCode: string,
    public city: string,
    public country: string,
    public registrationNumber: string,
    public activityName: string,
    public isTarget: boolean,
    public currencyId: number,
    public currencyName: string,
    public contactPhone: string,
    public isActive: boolean,
    public latitude?: string,
    public longitude?: string,
    public selected?: boolean) {

  }
}
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html'
})
export class CreateGroupComponent implements OnInit {
  siteCreateForm!: FormGroup;
  siteIds!: any[];
  userControl = new FormControl();

  selectedUsers: Site[] = new Array<Site>();
  allSites: Site[] = [];
  filteredUsers!: Observable<Site[]>;
  filteredSite!: Observable<Site[]>;
  lastFilter: string = '';
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public sites: Site[],
    private formBuilder: FormBuilder,
    private managesiteservice: ManagesiteService,
    private manageSitesService: ManageSitesService,
    private targetService: TargetService,
    private dialogRef: MatDialogRef<CreateGroupComponent>,
    private messageService: MessageService,
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
    this.targetService.fetchSite().subscribe((res) => {
      console.log(res);
      this.allSites = res;
      this.filteredSite = this.userControl.valueChanges.pipe(
        startWith<string | Site[]>(''),
        map(value => typeof value === 'string' ? value : this.lastFilter),
        map(filter => this.filter(filter))
      );
      console.log(this.filteredUsers);
      // this.filterList = res;
      // console.log(this.filterList);
    });

    this.siteIds = [];
    this.siteCreateForm = this.formBuilder.group({
      siteGroupName: ['', Validators.required],
      description: [''],
      siteId: [this.siteIds],
      keyword: [''],

    });
  }
  filter(filter: string): Site[] {
    this.lastFilter = filter;
    if (filter) {
      return this.allSites.filter((option:any) => {
        return option.companyName.toLowerCase().indexOf(filter.toLowerCase()) >= 0
          ;
      })
    } else {
      return this.allSites.slice();
    }
  }
  onSubmit(): void {
    this.siteCreateForm.get('keyword')?.setValue(this.keywordlist)
    this.selectedUsers.forEach(site => this.siteIds.push(site.id));
    console.log(this.siteCreateForm.value);
    //this.siteCreateForm.patchValue('siteId',this.siteIds)
    this.manageSitesService.createSiteGroupService(this.siteCreateForm.value).subscribe(
      data => {
        this.dialogRef.close();
        this.messageService.showMessage(data['response'][0].message);
        this.managesiteservice.managesitegroup$.next(true);
      }
    );
  }
  displayFn(value: Site[] | string): string | undefined {
    let displayValue: any;
    if (Array.isArray(value)) {
      value.forEach((user:any, index:number) => {
        if (index === 0) {
          displayValue = user.companyName;
        } else {
          displayValue += ', ' + user.companyName;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }
  optionClicked(event: Event, user: Site) {

    event.stopPropagation();
    this.toggleSelection(user);
  }

  toggleSelection(user: Site) {
    user.selected = !user.selected;
    if (user.selected) {
      this.selectedUsers.push(user);
    } else {
      const i = this.selectedUsers.findIndex(value => value.companyName === user.companyName);
      this.selectedUsers.splice(i, 1);
    }

    this.userControl?.setValue(this.selectedUsers);
  }
  removeContact(site: Site): void {
    for (let i = 0; i < this.sites.length; i++) {
      const element = this.sites[i];
      if (site.id === element.id) {
        this.sites.splice(i, 1);
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
