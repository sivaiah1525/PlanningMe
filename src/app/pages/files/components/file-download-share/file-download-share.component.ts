import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from 'src/app/core/services/file.service';
import * as FileSaver from 'file-saver';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { id } from '@swimlane/ngx-charts';
import { FilesAndNotesShareLinkComponent } from '../files-and-notes-share-link/files-and-notes-share-link.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-file-download-share',
  templateUrl: './file-download-share.component.html',
  styleUrls: ['./file-download-share.component.scss']
})
export class FileDownloadShareComponent implements OnInit {
  fileId: any;
  fileisPrivate: any
  title: any;
  fileAndNoteData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileService: FileService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<FileDownloadShareComponent>,
    private translate: TranslateService,
    
  ){
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }

   }

  ngOnInit(): void {
    this.fileAndNoteData = this.data
    this.title = this.data.title
    this.fileisPrivate = this.data.isPrivate,
      this.fileId = this.data.id
    console.log(this.data)
  }


  Downloadfile() {
    this.fileId = this.data.id;
    this.fileisPrivate = this.data.isPrivate;
    this.fileService.downloadFile(this.fileId, this.fileisPrivate).subscribe((result) => {
      if (result) {
        const blob = new Blob([result], { type: result.type });
        FileSaver.saveAs(blob);
        this.matDialogRef.close(true)
      }
    }, err => {
      console.log(err)
    })
  }

  View() {
    this.fileService.getFile(this.fileId).subscribe((res) => {
      if (res) {
        window.open(res.attachedFile, '_blank');
        this.matDialogRef.close(true)
      }
    })
  }



  linkfile() {
    this.dialog.open(FilesAndNotesShareLinkComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: this.fileAndNoteData
    });

  }
  backupfile() {

  }
}
