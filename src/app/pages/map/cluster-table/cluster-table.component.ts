import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserDetailsComponent } from '../../management/manage-users/user-details/user-details.component';
import { SiteDetailsComponent } from '../../management/manage-sites/site-details/site-details.component';
import { ContactDetailsComponent } from '../../management/manage-contacts/contact-details/contact-details.component';

@Component({
  selector: 'app-cluster-table',
  templateUrl: './cluster-table.component.html',
  styleUrls: ['./cluster-table.component.scss']
})
export class ClusterTableComponent implements OnInit {
  ClusterTabledata:any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.ClusterTabledata=this.data.data
    }
    console.log(this.data)
  }


  showmapclickdetails(data:any): void {
    console.log(data)
    let type = data.type;
    if (type === 'Users' && data.isConsumedData == false) {
      this.dialog.open(UserDetailsComponent, {
        data: { data: data, type: 'user' },
        width: '500px'
      });
    }
    else if (type === "Sites" && data.isConsumedData == false) {
      this.dialog.open(SiteDetailsComponent, {
        data: { data: data, type: 'site' },
        width: '500px'
      });
    }
    else if (type === "Contacts" && data.isConsumedData == false) {
       this.dialog.open(ContactDetailsComponent, {
        data: { data: data, type: 'contact' },
        width: '500px'
      });
    }
  }

}
