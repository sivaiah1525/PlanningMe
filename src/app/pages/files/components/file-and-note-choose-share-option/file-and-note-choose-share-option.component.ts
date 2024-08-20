import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SynchronizationDataComponent } from 'src/app/core/components/synchronization-data/synchronization-data.component';
import { FileService } from 'src/app/core/services/file.service';
import { MessageService } from 'src/app/core/services/message.service';
import { FilesAndNotesShareLinkComponent } from '../files-and-notes-share-link/files-and-notes-share-link.component';
import { ExportFileNoteComponent } from '../export-file-note/export-file-note.component';

@Component({
  selector: 'app-file-and-note-choose-share-option',
  templateUrl: './file-and-note-choose-share-option.component.html',
  styleUrls: ['./file-and-note-choose-share-option.component.scss']
})
export class FileAndNoteChooseShareOptionComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<FileAndNoteChooseShareOptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fileService: FileService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
  }




  radioChange(value:any) {
    if (value == 'Link') {
      this.shareLink()
      this.dialogRef.close(true)

    } else if (value == 'Drive') {
      this.ExportDrive()
    }
  }





  shareLink() {
    this.dialog.open(FilesAndNotesShareLinkComponent, {
      autoFocus: false,
      disableClose: true,
      data: this.data,
    });
  }

  ExportDrive(){
    const viewDialog=this.dialog.open(ExportFileNoteComponent, {
      width: '400',
      autoFocus: false,
      disableClose: true,
    });
    viewDialog.afterClosed().subscribe((result) => {
      if (result) {
        console.log(this.data)
        console.log(result)
        if(result.DriveType=='GoogleDrive'||result.DriveType=='Googledrive'){
          const formData = new FormData();
          formData.append('AccessToken', result.accessToken);
          formData.append('Id', this.data.id);
          formData.append('GoogleDrive', 'true');
          formData.append('FileName', result.FileName);
          formData.append('IsFile', 'true');
          this.fileService.ExportFiletodrive(formData).subscribe((result:any) => {
            if (result) {
              this.dialogRef.close(true)
              this.messageService.showMessage('Your File Exported Successfully');
            }
          },error=>{
            if(error.status=200){
              this.dialogRef.close(true)
              this.messageService.showMessage('Your File Exported Successfully');
            }
          })
        }else if(result.DriveType=='OneDrive'||result.DriveType=='Onedrive'){
          const formData = new FormData();
          formData.append('AccessToken', result.accessToken);
          formData.append('Id', this.data.id);
          formData.append('OneDrive', 'true');
          formData.append('FileName', result.FileName);
          formData.append('IsFile', 'true');
          this.fileService.ExportFiletodrive(formData).subscribe((result:any) => {
            if (result) {
              this.dialogRef.close(true)
              this.messageService.showMessage('Your File Exported Successfully');
            }
          },error=>{
            if(error.status=200){
              this.dialogRef.close(true)
              this.messageService.showMessage('Your File Exported Successfully');

            }
          })
        }
        console.log(result)

      }
    });
  }
}

