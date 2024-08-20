import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  windowHeight=1000
  constructor() { 
    this.windowHeight=window.innerHeight-125
  }

  ngOnInit(): void {
  }

}
