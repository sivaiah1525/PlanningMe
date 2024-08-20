import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pnm-dashboard',
  templateUrl: './pnm-dashboard.component.html',
  styleUrls: ['./pnm-dashboard.component.scss'],
})
export class PnmDashboardComponent implements OnInit {
  constructor() {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {}
}
