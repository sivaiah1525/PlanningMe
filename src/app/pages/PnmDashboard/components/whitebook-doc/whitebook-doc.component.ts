import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-whitebook-doc',
  templateUrl: './whitebook-doc.component.html',
  styleUrls: ['./whitebook-doc.component.scss']
})
export class WhitebookDocComponent implements OnInit {
  windowHeight=1000
  constructor() { 
    this.windowHeight=window.innerHeight-125
  }

  ngOnInit(): void {
  }

}
