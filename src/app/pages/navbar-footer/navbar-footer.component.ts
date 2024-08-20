import { Component, OnInit } from '@angular/core';
import { PolicyComponent } from '../PnmDashboard/components/policy/policy.component';
import { ServiceUsageComponent } from '../PnmDashboard/components/service-usage/service-usage.component';
import { ContactFormComponent } from '../PnmDashboard/components/contact-form/contact-form.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'pnm-navbar-footer',
  templateUrl: './navbar-footer.component.html',
  styleUrls: ['./navbar-footer.component.scss']
})
export class NavbarFooterComponent implements OnInit {

  constructor(
    private router: Router, 
    private dialog: MatDialog
    ) {}
  ngOnInit(): void {}

  locationchange(value: string) {
    if (value == 'Policy') {
      this.policy()
    } else if (value == 'ServiceUsage') {
      this.ServiceUsage()
    } else if (value == 'Contactus') {
      this.Contactus()
    } else if (value == 'Aboutus') {
    }
    
  }

  policy() {
     this.dialog.open(PolicyComponent, {
      width: '1000px',
      disableClose: true,
      position: { top: '10px' },

    });
  }
  ServiceUsage() {
     this.dialog.open(ServiceUsageComponent, {
      width: '1000px',
      disableClose: true,
      position: { top: '10px' },

    });
  }
  Contactus() {
     this.dialog.open(ContactFormComponent, {
      width: '1000px',
      disableClose: true,
      position: { top: '10px' },

    });
  }
}