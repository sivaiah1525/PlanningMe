import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {



  constructor(
    private router: Router, 
    private dialog: MatDialog,
    private translate: TranslateService,
    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }    }


   
  ngOnInit(): void {
  }

  popupcolse(){
      this.dialog.closeAll()
  }



  downloadFile() {
    const fileURL = '/assets/Doc/Policy.docx'; // Replace with the actual path to your HTML file
    const fileName = 'policy'; // Replace with the actual filename

    fetch(fileURL)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error downloading file:', error));
  }
}

