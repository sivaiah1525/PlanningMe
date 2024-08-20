import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from 'src/app/core/services/file.service';
import { AddFileComponent } from '../add-file/add-file.component';
import { AddNotesComponent } from '../add-notes/add-notes.component';
import { FileDownloadShareComponent } from '../file-download-share/file-download-share.component';
import { ViewNotesComponent } from '../view-notes/view-notes.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NoteSubnoteFormatService } from 'src/app/core/services/note-subnote-format.service';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver'; 
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';
import { HtmlToFileService } from 'src/app/core/services/fileAndNote/html-to-file.service';

@Component({
  selector: 'app-add-file-notes',
  templateUrl: './add-file-notes.component.html',
  styleUrls: ['./add-file-notes.component.scss'],
  providers: [
    Document,
    TranslateModule,
  ],
})
export class AddFileNotesComponent implements OnInit {
  month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
  date!: string;
  action!: string;
  rule!: string;
  private: any;
  data: any;
  resultData: any;
  showfile!: boolean;
  showNote!: boolean;
  admin: any;
  userId!: string | null;
  file = '';
  getfile: any;
  getNote: any;
  filesCount!: number;
  notesCount!: number;
  createfileNote = true
  fileNoteForEvent = false;
  ismanage = false;
  attachmentLevel = true;
  htmlcontent:any;
  PageNumber=1
  NumberOfRecord=10
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public eventdata: any,
    private _snackBar: MatSnackBar,
    private fileService: FileService,
    private matDialogRefNotes: MatDialogRef<AddFileNotesComponent>,
    @Inject(Document) private _document: any,
    private translate: TranslateService,
    public notformat:NoteSubnoteFormatService,
    public datepipe: DatePipe,
    private htmlToFile:HtmlToFileService
    
  ){
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
   }

  ngOnInit(): void {
    this.admin = localStorage.getItem('userName');
    this.userId = localStorage.getItem('id');
    if (this.eventdata?.attachmentLevel == 'Events') {
      this.fileNoteForEvent = true;
      this.createfileNote = false;
      this.attachmentLevel = this.eventdata?.attachmentLevel;
      this.ismanage = this.eventdata?.ismanage;
    }
  }

  skip() {
    this.matDialogRefNotes.close(true)
  }


  radioChange(value:any) {
    // AddNotesComponent 
    if (value === 1) {
      const addNotesDialog = this.dialog.open(AddNotesComponent,
        {
          data: {
            data: this.eventdata?.data,
            attachmentLevel: this.attachmentLevel,
            ismanage: this.ismanage,
          },
          disableClose: true,
          width: '600px',
          panelClass: ['addNotes'],
        });
      addNotesDialog.afterClosed().subscribe((result) => {
        console.log(result)
        this.private = result.isPrivate;
        this.resultData = result;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = today.getMonth(); //January is 0!
        var yyyy = today.getFullYear();
        this.date = dd + ' ' + this.month[mm] + ' ' + yyyy;
        let subnoteid = 'subnotes' + '-' + Math.random().toFixed(4);
        const ceatedate = this.datepipe.transform(today, 'MM d, y, h:mm:ss a');
          const formNoteData = new FormData();
          result.forEach((res:any, index:any) => {
            const data ={
              isPrivate:res.isPrivate,
              LinkMediastatus:res.LinkMediastatus,
              subnoteid:subnoteid,
              userId:this.userId,
              date:this.date,
              addNote:res.addNote,
              ceatedate:ceatedate
            }
            var finalnoteformat=this.notformat.createnote(data)
            this.htmlcontent=res.addNote
            const file=this.htmlToFile.htmlContentToFileConvert(res.addNote)
            formNoteData.append('file', file);
            formNoteData.append('Title', res.title);
            formNoteData.append('IsMediaLinked', res.LinkMediastatus=='1'?'false':'true');
            formNoteData.append('IsPrivate', res.isPrivate)
            formNoteData.append('Keywords', res.keyword)
            formNoteData.append('Created', today.toISOString())
            res.conditions.forEach((res:any, index:any) => {
              if (res.selectid.length >= 1) {
                formNoteData.append('Entities[' + index + '].AttachmentLevel', res.attachmentLevel)
                formNoteData.append('Entities[' + index + '].SelectIds', res.selectid)
                formNoteData.append('Entities[' + index + '].IsGroup', 'false')
              }
              if (res.selectGroup.length >= 1) {
                formNoteData.append('Entities[' + index + '].AttachmentLevel', res.attachmentLevel)
                formNoteData.append('Entities[' + index + '].SelectIds', res.selectGroup)
                formNoteData.append('Entities[' + index + '].IsGroup', 'true')
              }
            })

          });
          this.fileService.createNote(formNoteData).subscribe((data) => {
            if (data) {
              this._snackBar.open('Note  Created', '', { duration: 2000, });
            }
          },error=>{
            console.log(error)
            if(error.status==429){
              this.APIerrormessage(error?.error,'Create Notes')
            }
          });
      });
    }
    // AddFileComponent 
    else {
      const addFilesDialog = this.dialog.open(AddFileComponent, {
        disableClose: true,
        width: '500px',
        panelClass: ['addFiles'],
        data: {
          data: this.eventdata?.data,
          attachmentLevel: this.attachmentLevel,
          ismanage: this.ismanage,
        },
      });
      addFilesDialog.afterClosed().subscribe((result) => {
        const todayDate = new Date();
        const formData = new FormData();
        result.forEach((res:any, index:number) => {
          console.log(res)
          console.log(index, 'index')
          formData.append('model[' + index + '].file', res.uploadfile);
          formData.append('model[' + index + '].Title', res.title);
          formData.append('model[' + index + '].IsPrivate', res.isPrivate)
          formData.append('model[' + index + '].Keywords', res.keyword)
          formData.append('model[' + index + '].Created', todayDate.toISOString())
          res.conditions.forEach((res:any, count:number) => { 
            console.log(count, 'count')
            if (res.selectid.length >= 1) {
              formData.append('model[' + index + '].Entities[' + count + '].AttachmentLevel', res.attachmentLevel)
              formData.append('model[' + index + '].Entities[' + count + '].SelectIds', res.selectid)
              formData.append('model[' + index + '].Entities[' + count + '].IsGroup', 'false')
            }
            if (res.selectGroup.length >= 1) {
              formData.append('model[' + index + '].Entities[' + count + '].AttachmentLevel', res.attachmentLevel)
              formData.append('model[' + index + '].Entities[' + count + '].SelectIds', res.selectGroup)
              formData.append('model[' + index + '].Entities[' + count + '].IsGroup', 'true')
            }
          })

        })
        this.fileService.createFile(formData).subscribe(data => {
          if (data) {
            this._snackBar.open(data[0], '', { duration: 2000, });
            setTimeout(() => { this._document.defaultView.location.reload(); }, 10);
          }
        },error=>{
          console.log(error)
          if(error.status==429){
            this.APIerrormessage(error?.error,'Create Files')
          }
        })
      });
    }

  }










  showFiles() {
    this.showfile = !this.showfile;
  }
  showNotes() {
    this.showNote = !this.showNote;
  }

  gotofiles(row:any) {
    this.dialog.open(FileDownloadShareComponent, {
      width: '500px',
      data: row,
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true,
    })
  }
  ShowNote(id:any) {
    this.fileService.getNote(id,this.PageNumber,this.NumberOfRecord).subscribe(data => {
      console.log(data);
      this.dialog.open(ViewNotesComponent, {
        width: '500px',
        position: { top: '125px', left: '700px' },
        autoFocus: false,
        disableClose: true,
        data: {
          type: 'view',
          data: data
        },
      })
    });
  }




  APIerrormessage(message:any, header:any) {
    this.dialog.open(ApiErrorMessagesComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

}
