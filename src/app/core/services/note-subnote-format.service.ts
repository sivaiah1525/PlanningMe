import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NoteSubnoteFormatService {

  constructor() {

   }

createnote(data:any){
  console.log(data)
const note =`<div class="sub-note" id="${data.subnoteid}">
<!-- 000 -->
${this.getnoteheader(data)}
  <!-- 111  -->
 ${this.getlinkmedia(data)}
</div>
  <!-- 222  -->
  <div class="rich-text mt-2" style="margin:10px">${data.addNote}</div>
  <!-- 333333  -->
  <div style="display: flex;display:none">
  <p class="user_Id" style="display:none">${data.userId}</p>
  <div style="width: 30%;">
    <p class="Modified"><b>Modified on : ${data.ceatedate} By :</b></p>
  </div>
  <div style="width:20%;">
     <img class="user_profile" src=""
      style="width:30px;height:30px;border-radius:50%;margin-top:-3px;margin-left:4px;">
  </div>
  <div style="width: 25%;">
    <p class="user_name" style="font-weight:600;font-size: 12px;"></p>
  </div>
</div>
</div>`
return note

}


updatenote(data:any){
  console.log(data)

 
    

  const note =`<div class="sub-note" id="${data.subnoteid}">
  <!-- 000 -->
   ${this.getnoteheader(data)}
  <!-- 111  -->
    ${this.getlinkmedia(data)}
    <!-- 222  -->
    <div class="rich-text mt-2" style="margin:10px">${data.addNote}</div> 
    <!-- 333333  -->
    <div style="display: flex;margin-top:10px;">
    <p class="user_Id" style="display:none">${data.userId}</p>
      <div style="width: 60%;">
        <p style="font-style: italic;color: red;font-size: 12px;" class="Modified"><b>Modified on : ${data.modifieddate} By :</b></p>
      </div>
      <div style="width:15%;">
         <img class="user_profile" src=""
          style="width:30px;height:30px;border-radius:50%;margin-top:-3px;margin-left:4px;">
      </div>
      <div style="width:25%;">
        <p class="user_name" style="font-weight:600;font-size: 12px;"></p>
      </div>
    </div>
  </div>`
  return note
  
  }









  getmediaicon(name:any){
    if(name=='name'){
      return '<i class="fa fa-whatsapp" style="font-size:24px;color:green"></i>'
    }else{
      return '<i class="fa fa-envelope-open" style="font-size:24px;color:red"></i>'
    }
  }




  getlinkmedia(data:any){
    if(data.LinkMediastatus==true){
      var linkmedia=` <div style="display: flex;margin-top:10px;">
      <div style="width:10%;">
      ${this.getmediaicon('')}
      </div>
      <div style="width:45%;">
        <p class="media_name" style="font-weight:600;font-size: 12px;">siva@gmail.com</p>
      </div>
      <div style="width: 45%;color:#528bf1;font-size: 12px;margin-top:10px">Received on  ${data.date}</div>`
      return linkmedia
    }else {
      var linkmedia=` <div style="display: flex;margin-top:10px;display:none;">
      <div style="width:10%;">
      ${this.getmediaicon('')}
      </div>
      <div style="width:45%;">
        <p class="media_name" style="font-weight:600;font-size: 12px;">siva@gmail.com</p>
      </div>
      <div style="width: 45%;color:#528bf1;font-size: 12px;margin-top:10px">Received on  ${data.date}</div>`
      return linkmedia
    }
  }

  getnoteheader(data:any){
    var noteheader
    if(data.isPrivate==true){
       noteheader=`<div style="background-color: white;display: flex;border-bottom: 1px solid black">
      <p class="user_Id" style="display:none">${data.userId}</p>
      <div style="width:15%;">
      </div>
      <div style="width:30%;">
      </div>
      <div style="width: 25%;">
        <p style="margin-top:5px;font-size: 12px;"><b>${data.date}</b></p>
      </div>
      <div style="width:30%;">
        <button class="m-2"
          style="padding: 0 10px;border-radius: 10px;background-color: #528bf1;color:#fff;border: none;margin-top:5px;font-size: 10px;padding: 3px 8px;">Edit</button>
          <button class="m-2"
          style="padding: 0 10px;border-radius: 10px;background-color: red;color:#fff;border: none;margin-top:5px;font-size: 10px;padding: 3px 8px;">delete</button>
      </div>
      </div>`
    }else if(data.isPrivate==false){
       noteheader=`<div style="background-color: #DDF1F8;display: flex;border-bottom: 1px solid black;border-top: 1px solid black;">
      <p class="user_Id" style="display:none">${data.userId}</p>
      <div style="width:15%;">
        <img class="user_profile" src="" style="width:40px;height:40px;border-radius:50%;">
      </div>
      <div style="width:30%;">
        <p class="user_name" style="font-weight:600;margin-top:5px;font-size: 12px;"></p>
      </div>
      <div style="width: 25%;">
        <p style="margin-top:5px;font-size: 12px;"><b>${data.date}</b></p>
      </div>
      <div style="width:30%;">
        <button class="m-2"
          style="padding: 0 10px;border-radius: 10px;background-color: #528bf1;color:#fff;border: none;margin-top:5px;font-size: 10px;padding: 3px 8px;">Edit</button>
          <button class="m-2"
          style="padding: 0 10px;border-radius: 10px;background-color: red;color:#fff;border: none;margin-top:5px;font-size: 10px;padding: 3px 8px;">delete</button>
      </div>
      </div>`
    }
    return noteheader

  }
  









}
