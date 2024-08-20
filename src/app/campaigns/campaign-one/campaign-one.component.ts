import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-campaign-one',
  templateUrl: './campaign-one.component.html',
  styleUrls: ['./campaign-one.component.scss']
})
export class CampaignOneComponent implements OnInit {

  windowHeight=1000
  constructor() { 
    this.windowHeight=window.innerHeight
  }

  ngOnInit(): void {
  }

}
