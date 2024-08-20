import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from './file.service';
import { MessageService } from './message.service';

@Injectable({providedIn: 'root'})
export class CreateAddNoteService {
  date: any;
  action: any;
  rule: any;
  private: any;
  data: any;
  resultData: any;
  admin: any;
  userId: any ;
  constructor(
    private fileService: FileService,
    private messageService: MessageService, 
    private dialog: MatDialog,

  ) { }


  createNote(result:any){
      console.log(result)
      this.private = result.isPrivate
      this.resultData = result;
      var today = new Date();
      var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = today.getMonth(); //January is 0!
      var yyyy = today.getFullYear();
      this.date = dd + ' ' + month[mm] + ' ' + yyyy;
      this.date = `<p class="right" style="margin-top:8px">${this.date}</p>`;
      this.action = `
      <div class="row"><div class="col-10"></div> <button class='md-button'>Edit</button> </div>`;
      this.rule = '<hr>';
      let count = 'subnotes' + "-" + Math.random().toFixed(2);
      if (this.private == true) {
        let subNote = ` <div class="sub-note" id=${count}>${this.rule} 
        <div class="row">
        <div class="col-10"></div>${this.date}</div>  
        <div class="rich-text" style="margin-left:10px">${[result.addNote]}</div> ${this.action}   <div class="row">
        <p class="user_Id" style="display:none"></p> 
        <i class="modified_date"></i>
        <img class="user_profile" src="" >
        <p class="user_name"></p> </div> ${this.rule}    </div>`
        var f = new File([...subNote], 'file.html', { type: 'text/html' });
      }
      else {
        let subNote = `<div class="sub-note" id=${count}>
       <div class="row" style="height: 55px;
        background-color: #dcf2f8;
        border-top: 1px solid grey; border-bottom: 1px solid grey">
          <div class="col-9">
          <div class="row">
              <p class="user_Id" style="display:none">${this.userId} </p> 
              <img class="user_profile" src="" style="width:40px;height:40px;border-radius:50%;margin-top:5px">
              <p class="user_name" style="font-weight:600;margin-top:12px;margin-left:10px"></p>
              </div>
          </div>
          <div class="col-3">   ${this.date}  </div>
        </div>    
      <div class="rich-text" style="margin-left:16px;margin-top:18px;">${[result.addNote]}</div> 
      ${this.action} 
      <div class="row">
            <p class="user_Id" style="display:none"></p> 
            <i class="modified_date"></i>
          <img class="user_profile" src="" >
            <p class="user_name"></p>
             </div> ${this.rule} </div>`
        var f = new File([...subNote], 'file.html', { type: 'text/html' });
      }

      const formNoteData = new FormData();
      formNoteData.append('Title', result.title);
      formNoteData.append('AttachmentLevel', result.attachmentLevel);
      formNoteData.append('SelectIds', result.selectName);
      formNoteData.append('IsPrivate', result.isPrivate);
      formNoteData.append('File', f);
      formNoteData.append('Created', new Date().toDateString());
      formNoteData.append('Keywords', result.keyword);
      console.log(formNoteData)
      this.fileService.createNote(formNoteData).subscribe(data => {
        if (data) {
          this.messageService.showMessage(data.response[0].message);
          //this.dialog.closeAll()
        }
      });
  }


  createFile(result:any){
      if (result) {
        console.log(result, "ad users");
        const formData = new FormData(); formData.append('AttachmentLevel', result.attachmentLevel);
        formData.append('SelectIds', result.selectName);
        formData.append('Keywords', result.Keywords);
        formData.append('Created', new Date().toDateString());
        const accompSize = result.AttachmentsArr.length;
        for (let i = 0; i < accompSize; i++) {
          let element = result.AttachmentsArr[i];
          formData.append('Attachments[' + i + '].file', element.upFile);
          formData.append('Attachments[' + i + '].Title', element.title);
          formData.append('Attachments[' + i + '].IsPrivate', element.isPrivate);
        }
        console.log(result)
        this.fileService.createFile(formData).subscribe(data => {
          if (data) {
            console.log(data, 'dsggfgf fgfgf')
                  this.messageService.showMessage(data.toString());
                 // this.dialog.c()

          }
        });
      }
  }
}
