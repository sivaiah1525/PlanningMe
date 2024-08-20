import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nitifications-rights',
  templateUrl: './nitifications-rights.component.html',
  styleUrls: ['./nitifications-rights.component.scss']
})
export class NitificationsRightsComponent implements OnInit {
  getAllnotificationsoptions:any;
  constructor() { }

  ngOnInit(): void {
    this.getAllnotificationsoptions={
      management:{Users:true,Contacts:true,users:true,Sites:true,Products:true,Transactions:true,Targets:true,Discounts:true,Groups:true},
      Planning:{option1:true,option2:true,option3:true},
      Map:{option1:true,option2:true},
      FilesandNotes:true,
      ActivityReports:true,
      PermissionRights:true,
      Alerts:true,
      ProfileDetails:true,
    }
  }




  updatenotificationsrights(){
    console.log(this.getAllnotificationsoptions)
  }

}
