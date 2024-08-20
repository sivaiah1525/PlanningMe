import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { FileService } from 'src/app/core/services/file.service';

@Component({
  selector: 'app-files-and-notes-share-link',
  templateUrl: './files-and-notes-share-link.component.html',
  styleUrls: ['./files-and-notes-share-link.component.scss']
})
export class FilesAndNotesShareLinkComponent implements OnInit {
  FileAndNoteId: any;
  isFile = false;
  isNote = false;
  isReport = false;
  FileAndNoteTitle: any
  FileAndNoteCreatorId: any
  filesAndNoteShareLinlK = 'https://planningme.s3.eu-west-3.amazonaws.com/6/0b577ae7-1609-4d5c-b4f6-3e948359aa22/File/xXBoqbmcoXUCx8em%2BVdHLsO5OdkrUQnM29ueX4QFTejA7E7ddb8JOA%3D%3D/TOTAL%20MOBILITY%20CORPORATE%20JAN23.html?X-Amz-Expires=569407&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX26ISNOD6EXN7OMQ/20230224/eu-west-3/s3/aws4_request&X-Amz-Date=20230224T094952Z&X-Amz-SignedHeaders=host&X-Amz-Signature=4bd385e06cef2af60adbfb79099f399e9a05a3efd8bde348eaacfef7f256a4b4'
  constructor(
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileService: FileService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FilesAndNotesShareLinkComponent>,
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
    console.log(this.data)
    this.FileAndNoteTitle = this.data.fileName;
    this.FileAndNoteCreatorId = this.data.fileCreatorId;
    this.FileAndNoteId = this.data.id
    if (this.data.isNote == true) {
      this.isNote = true
    } else {
      this.isFile = true
    }
    this.GetSharableLink()
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Copy done', '', { duration: 2000, });
    this.dialogRef.close(true)
  }

  GetSharableLink() {
    var data = {
      id: this.FileAndNoteId,
      IsFile: this.isFile,
      IsNote: this.isNote,
      IsReport: this.isReport,
      NameOfTheFile: this.FileAndNoteTitle,
      FileCreatorId: this.FileAndNoteCreatorId,
    }
    this.fileService.GetSharableLink(data).subscribe((data: any) => {
      if (data) {
        this.filesAndNoteShareLinlK = data.response[0].message
      }
    })
  }


}
