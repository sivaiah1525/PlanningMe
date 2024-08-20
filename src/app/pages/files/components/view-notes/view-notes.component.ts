import { DatePipe } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from 'src/app/core/services/file.service';
import { AddNotesComponent } from '../add-notes/add-notes.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { TranslateService } from '@ngx-translate/core';
import { NoteSubnoteFormatService } from 'src/app/core/services/note-subnote-format.service';
import { HtmlToFileService } from 'src/app/core/services/fileAndNote/html-to-file.service';

@Component({
  selector: 'app-view-notes',
  templateUrl: './view-notes.component.html',
  styleUrls: ['./view-notes.component.scss'],
})
export class ViewNotesComponent implements OnInit {
  panelOpenState = false;

  notesData: any;
  action: any;
  noteType!: string;
  comment!: string;
  rule!: string;
  date: any;
  html: any;
  private!: boolean;
  rseultdata: any;
  modifieddate!: string | null;
  isDelete!: boolean;
  allText: any;
  SubNoteId: any;
  requestData!: {};
  subNote!: string;
  userId!: any;
  isPrivate!: boolean;
  admin!: any;
  doc: any
  noteId: any;
  noteURL: any;
  PageNumber=1
  NumberOfRecord=10
totalnotescount=100
loader=false
color = 'primary';
mode = 'indeterminate';
value = 50;

subnoteedit(data:any){
  console.log(data)
  if(data.isMediaLinked==false){
    const editNote=this.httpGet(data.notes?data.notes:data.subNoteUrl)
    const addNotesDialog = this.dialog.open(AddNotesComponent, {
      width: '600px',
      panelClass: ['addNotes'],
      data: { EditSubNote: true, data: { data: this.data, EditTex: editNote } },
    });
    addNotesDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
           this.subnoteUpdate(result[0].id,result[0].addNote)
      }
    });
  }

}







subnoteDelete(data:any){
  console.log(data)
  this.deleteDialogConfirmation(data, 'DeleteSubNote')
}



  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      this.getNotes();
      this.matDialogRef.close(true);
    })
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileService: FileService,
    private _snackBar: MatSnackBar,
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<ViewNotesComponent>,
    private translate: TranslateService,
    public notformat:NoteSubnoteFormatService,
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
    console.log(this.admin)
    this.isPrivate = this.data.data.isPrivate
    this.userId = localStorage.getItem('id');
    console.log(this.userId)
    this.noteId = this.data.data.id
    this.noteURL = this.data.data.notes
    this.updatesubNotes(this.data.data);
  }


  formatDate(value:any) {
    return this.datepipe.transform(value, 'dd-MMM-yyyy')
  }
  getNotes() {
    this.loader=true
    this.fileService.getNote(this.data.id ? this.data.id : this.data.data.id,this.PageNumber,this.NumberOfRecord).subscribe(res => {
      console.log("nowwwprint", res)
      if(res){
        if(this.PageNumber==1){
          this.data = {};
          this.data = res;
          this.isPrivate = res.isPrivate;
          this.updatesubNotes(this.data);
          this.fileService.loadingData(true);
          this.loader=false
        }else{
          this.loader=false
          this.notesData.subNoteDtos=res.subNoteDtos          ;
        }
      }
    });
  }

  getsenderemail(email:any){
    const slicedEmail = email.slice(0, 24);
    if (email.length > 24) {
        return slicedEmail + '...'; 
    } else {
        return slicedEmail;
    }
  }

  next(event:any){
    this.PageNumber=this.PageNumber+1
    this.getNotes();

  }

  updatesubNotes(data:any) {
    console.log(data)
    this.notesData = data;
    this.comment = this.notesData.notes;
    this.html = this.httpGet(this.comment);
    if (this.notesData.isPrivate) {
      this.noteType = 'Private Note';
    } else {
      this.noteType = 'Public Note';
    }
  }









  // editNotes ------------------ 
  editNotes(id:number) {
    this.fileService.getNote(id,this.PageNumber,this.NumberOfRecord).subscribe(data => {
      const editNoteDialog = this.dialog.open(AddNotesComponent, {
        width: '600px',
        position: { top: '125px', left: '700px' },
        autoFocus: false,
        disableClose: true,
        data: { NoteEdit: true, data: data }
      });
      editNoteDialog.afterClosed().subscribe((result) => {
        if (result === true) {
          this.getNotes();
          this.matDialogRef.close(true);
        }

      });
    });
  }















  // s-------------- 
  // addSubNote -------------------- 
  addSubNote() {
    const addNotesDialog = this.dialog.open(AddNotesComponent, {
      width: '600px',
      panelClass: ['addNotes'],
      data: { AddSubNote: true },
    });
    addNotesDialog.afterClosed().subscribe((result) => {
      console.log(result)
      if (result !== '') {
        this.subnotecreate(this.notesData.id,result[0].addNote)
      }
    });

  }






  httpGet(theUrl:any) {
    var xmlHttp:any= null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', theUrl, false);
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200 || xmlHttp.status == 0) {
          this.allText = xmlHttp.responseText;
          this.doc = new DOMParser().parseFromString(this.allText, 'text/html')
        }
      }
    }
    xmlHttp.send(null);
    return xmlHttp.responseText;
  }





  // printhtml 
  printhtml(HTML:any): void {
    console.log(HTML)
    let printContents, popupWin:any;
    printContents = document.getElementById('print-section')?.innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          button{
            background-color: transparent;
            color: transparent;
            border: none;
            display: none;
        }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }







  subnotecreate(id:any,filecontent:any){
    console.log(id)
    const file=new File([filecontent], 'file.html', { type: 'text/html' }); 
    const formData = new FormData();
    formData.append('NoteId', id)
    formData.append('SubNotes[' + 0 + '].Title', 'SubNoteTitle')
    formData.append('SubNotes[' + 0 + '].File', file)
    formData.append('SubNotes[' + 0 + '].Attachments', '')
    if(id){
      this.fileService.CreateSubNotes(formData).subscribe(result=>{
        if (result) {
          this._snackBar.open('Sub Notes created', '', { duration: 2000, });
          this.getNotes();
        }
      })
    }
  }


  getfiletype(name:any){
    return name.split('.')[1]
  }

  subnoteUpdate(id:any,filecontent:any){
    console.log(id)
    const file=new File([filecontent], 'file.html', { type: 'text/html' }); 
    const formData = new FormData();
    formData.append('Id', id)
    formData.append('Title', '')
    formData.append('File', file)
    formData.append('Attachments', '')
    if(id){
      this.fileService.updateSubNote(formData).subscribe(result=>{
        if (result) {
          this._snackBar.open('Sub Notes created', '', { duration: 2000, });
          this.getNotes();
        }
      })
    }
  }
}

