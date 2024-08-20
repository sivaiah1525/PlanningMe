import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarComponent } from 'src/app/pages/calendar/calendar.component';
import { MapPageComponent } from 'src/app/pages/map/map.page';
import { ManageUsersService } from '../../services/manage-users.service';
import { SpinnerService } from '../../services/spinner.service';
import { FiltershareService } from '../filtershare.service';
import { MapfilterService } from '../mapfilter.service';
// import { MapfilterService } from '../Mapfilter.service';


@Component({
  selector: 'app-other-pepole',
  templateUrl: './other-pepole.component.html',
  styleUrls: ['./other-pepole.component.scss']
})
export class OtherPepoleComponent implements OnInit {
  otherPepoleform!: FormGroup;
  showicon: boolean = false
  screenType: any;
  AllUsersdata:any= [];
  id: any;
  adminId: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUserService: ManageUsersService,
    public spinner: SpinnerService,
    public fileshareservice: FiltershareService,
    public MapfilterService: MapfilterService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private dialog: MatDialog,
  ) {
    this.adminId = localStorage.getItem('id');

  }

  ngOnInit(): void {
    this.otherPepoleform = this.formBuilder.group({
      search: [''],
      IsPublic: [true],
      User: [''],
    });
    this.screenType = this.data.screenType
    this.loadUsers()
  }
  filterSearch(event:any) {
    this.showicon = true
    this.loadUsers()
  }
  closesearch() {
    this.showicon = false
    this.loadUsers()
  }

  // checkBoxSelact
  checkBoxSelact(event:any) {
    this.otherPepoleform.get('User')?.setValue(event)
    console.log(this.otherPepoleform.value)
  }



  GetData() {
    sessionStorage.setItem("SelectedFilter", 'Users');
    if (this.screenType == 'Map') {
      sessionStorage.setItem("FilterType", 'map');
      const openAddEventDialog = this.dialog.open(MapPageComponent, {
        width: '100%',
        height: '700px',
        autoFocus: false,
        disableClose: true,
        data: { data: this.otherPepoleform.value, screenType: 'otherUserMap' },
      });
    } else if (this.screenType == 'Planning') {
      sessionStorage.setItem("FilterType", 'Events');
      const openAddEventDialog = this.dialog.open(CalendarComponent, {
        width: '100%',
        height: '700px',
        autoFocus: false,
        disableClose: true,
        data: { data: this.otherPepoleform.value, screenType: 'otherUserPlanning' },

      });
    }
  }

  // getalluser
  loadUsers() {
    this.AllUsersdata.length = 0;
    this.manageUserService.FindAllUsersUnderMine().subscribe((data: any) => {
      if (data) {
        data.forEach((e:any) => {
            this.AllUsersdata.push(e)
        })
      }
    });
  }



}
