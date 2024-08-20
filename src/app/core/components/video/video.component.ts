import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  url!: SafeResourceUrl;
    constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.url=this.domSanitizer.bypassSecurityTrustResourceUrl(this.data.url);
      console.log(this.data)
    }
  }

}
