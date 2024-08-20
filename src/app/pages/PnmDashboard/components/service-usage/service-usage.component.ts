import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-service-usage',
  templateUrl: './service-usage.component.html',
  styleUrls: ['./service-usage.component.css'],
})
export class ServiceUsageComponent implements OnInit {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }  }

  clocepopup() {
    this.dialog.closeAll();
  }
  ngOnInit(): void {}

  downloadFile() {
    const fileURL =
      '/assets/Doc/GENERAL CONDITIONS OF PLANNING&ME SERVICE.docx'; // Replace with the actual path to your HTML file
    const fileName = 'GENERAL CONDITIONS OF PLANNING&ME SERVICE'; // Replace with the actual filename

    fetch(fileURL)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error('Error downloading file:', error));
  }
}
