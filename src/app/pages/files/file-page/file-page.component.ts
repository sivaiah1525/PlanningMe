import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from 'src/app/core/services/file.service';
import { AccessFileNotesComponent } from '../components/access-file-notes/access-file-notes.component';
import { AddFileNotesComponent } from '../components/add-file-notes/add-file-notes.component';
import { AddFileComponent } from '../components/add-file/add-file.component';
import { AddNotesComponent } from '../components/add-notes/add-notes.component';
import { FilterPopupComponent } from '../components/filter-popup/filter-popup.component';
import { SearchPopupComponent } from '../components/search-popup/search-popup.component';
import { ViewNotesComponent } from '../components/view-notes/view-notes.component';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { FilesAndNotesShareLinkComponent } from '../components/files-and-notes-share-link/files-and-notes-share-link.component';
import { DeleteCommomComponent } from '../../commonForAll/delete-commom/delete-commom.component';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { SyncOptionsListComponent } from 'src/app/core/components/sync-options-list/sync-options-list.component';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { TranslateService } from '@ngx-translate/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GoogleApiService } from 'src/app/core/services/SYNC/google-api.service';
import { SynchronizationDataComponent } from 'src/app/core/components/synchronization-data/synchronization-data.component';
import { FileAndNoteChooseShareOptionComponent } from '../components/file-and-note-choose-share-option/file-and-note-choose-share-option.component';
declare var google: any;
declare var gapi: any;


@Component({
  selector: 'app-file-page',
  templateUrl: './file-page.component.html',
  styleUrls: ['./file-page.component.scss'],
})
export class FilePageComponent implements OnInit {
  animationState: string = 'start';
  fileList: any;
  filterFileList: any;
  userList: any;
  showbtn!: boolean;
  NumberOfRecord = 25;
  PageNumber = 1;
  TotalFileAndNotes = 0;
  DemoOrganationstatus:boolean=false
  googleouthAccessToken=null
  loader=false
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  constructor(
    private dialog: MatDialog,
    private fileService: FileService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public OrgSrvice: CheckOrganationTypeService,
    private matoService: MatomoService,
    private translate: TranslateService,
    private  goole:GoogleApiService,
    
  ){
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    this.matoService.trackPageView('Files&notes-page');
    if(localStorage.getItem('isTrailVersion')=='true'){
      this.popupforerrormessage('You are using trail account so you are able to create 10 files & 10 notes(10 subnotes per note)','files & notes')
  }
      if (this.OrgSrvice.checkOrganationType().DemoOrganation === 'true') {
      this.DemoOrganationstatus=true
      console.log(this.OrgSrvice.checkOrganationType());
      const data:any=this.OrgSrvice.messagesandheader('file/Note')
      this.popupforerrormessage(data.message, data.header);
    }
    this.fileService.fileData.subscribe((res) => {
      if (res === true) {
        this.getAllFilesAndNotes(this.PageNumber, this.NumberOfRecord);
      }
    });
  }

 

  ngOnInit(): void {
    console.log('test1');
    this.getAllFilesAndNotes(this.PageNumber, this.NumberOfRecord);
    this.showbtn = false;
  }

  getfiletype(name:any){
    return name.split('.')[1]
  }

  next(event:any) {
    this.getAllFilesAndNotes(event.pageIndex + 1, 25);
  }

  getAllFilesAndNotes(PageNumber:any, NumberOfRecord:any) {
    this.loader=true
    this.fileService.FindFilesAndNotes(PageNumber, NumberOfRecord).subscribe((result: any) => {
        if (result) {
          this.loader=false
          this.fileList = result.data;
          this.filterFileList = this.fileList;
          this.TotalFileAndNotes = result.totalItems;
          this.sortMethod('option1');
        }
      });
  }

  onCreateFile() {
    const addFileNotesDialog = this.dialog.open(AddFileNotesComponent, {
      width: '400px',
      panelClass: ['files'],
      data: { createfilesNotes: true },
      disableClose: false,
    });
    addFileNotesDialog.afterClosed().subscribe((result) => {
      console.log(result);
      this.getAllFilesAndNotes(this.PageNumber, this.NumberOfRecord);
    });
  }

  Edit(filenoteobj:any) {
    if (filenoteobj.isNote) {
      this.fileService.getNote(filenoteobj.id,1,5).subscribe((data) => {
        console.log(data);
        const editNoteDialog = this.dialog.open(AddNotesComponent, {
          data: { NoteEdit: true, data: data },
        });
        editNoteDialog.afterClosed().subscribe((result) => {
          console.log(result);
          if (result) {
            this.getAllFilesAndNotes(this.PageNumber, this.NumberOfRecord);
          }
        });
      });
    } else {
      this.fileService.getFile(filenoteobj.id).subscribe((data) => {
        console.log(data);
        const editFileDialog = this.dialog.open(AddFileComponent, {
          data: { FileEdit: true, data: data },
        });
        editFileDialog.afterClosed().subscribe((result) => {
          console.log(result);
          if (result) {
            this.getAllFilesAndNotes(this.PageNumber, this.NumberOfRecord);
          }
        });
      });
    }
  }

  openSearchPopup() {
    this.showbtn = false;
    const createSearchDialog = this.dialog.open(SearchPopupComponent, {
      autoFocus: false,
      disableClose: true,
    });
    createSearchDialog.afterClosed().subscribe((data) => {
      if (data) {
        this.fileService.filterForFilesAndNotes(data).subscribe((res) => {
          if (res) {
            this.filterFileList = res;
            this.showbtn = true;
          } else if (!res) {
            this.showbtn = false;
            this._snackBar.open('Search Result Faild', '', { duration: 2000 });
          }
        });
      }
    });
  }

  openFilterPopup() {
    this.showbtn = true;
    const createFilterDialog = this.dialog.open(FilterPopupComponent, {
      autoFocus: false,
      disableClose: true,
    });

    createFilterDialog.afterClosed().subscribe((data) => {
      if (data) {
        this.fileService.filterForFilesAndNotes(data).subscribe((res) => {
          if (res) {
            console.log(res);
            this.filterFileList = res;
          }
        });
      }
    });
  }

  share(data:any) {
    console.log(data);
    this.dialog.open(FileAndNoteChooseShareOptionComponent, {
      autoFocus: false,
      disableClose: true,
      data: data,
    });
  }


  Access(data:any) {
    console.log(data);
    this.fileService.getPermission(!data.isNote, data.id).subscribe((res) => {
      this.userList = res;
      this.userList['fileName'] = data.fileName;
      this.userList['fileCreatorId'] = data.fileCreatorId;
      const createAccessDialog = this.dialog.open(AccessFileNotesComponent, {
        autoFocus: false,
        disableClose: true,
        data: this.userList,
      });

      createAccessDialog.afterClosed().subscribe((res) => {
        if (res) {
          let groups = res.GroupId.filter((el:any) => {
            return el != 0;
          });
          let users = res.users.filter((el:any) => {
            return el != 0;
          });
          const accessObj :any= {
            isFile: !data.isNote,
            userIds: users.join(','),
            userGroupIds: groups.join(','),
            access: 'true',
          };
          if (accessObj.isFile) {
            accessObj['fileId'] = data.id;
          } else {
            accessObj['noteId'] = data.id;
          }
          this.fileService.updatePermission(accessObj).subscribe((resp) => {
            if (resp) {
              this._snackBar.open(resp.response[0].message, '', {
                duration: 2000,
              });
            }
          });
        }
      });
    });
  }

  View(filenoteobj:any) {
    console.log(filenoteobj);
    if (filenoteobj.isNote) {
      this.fileService.getNote(filenoteobj.id,1,5).subscribe((data) => {
        console.log(data);
        const viewNoteDialog = this.dialog.open(ViewNotesComponent, {
          width: '500px',
          autoFocus: false,
          disableClose: true,
          data: { type: 'view', data: data },
        });
        viewNoteDialog.afterClosed().subscribe((result) => {
          if (result) {
            this.getAllFilesAndNotes(this.PageNumber, this.NumberOfRecord);
          }
        });
      });
    } else {
      this.fileService.getFile(filenoteobj.id).subscribe((res) => {
        if (res) {
          window.open(res.attachedFile, '_blank');
        }
      });
    }
  }

  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, {
      data: { data, type: type },
    });
    deleteorder.afterClosed().subscribe((result: any) => {
      if(result){
        this.getAllFilesAndNotes(this.PageNumber, this.NumberOfRecord);
      }
    });
  }

  applyFilter(e:any) {
    if (e.length >= 3) {
      this.filterFileList = this.fileList.filter((item:any) => {
        return item.title?.toLowerCase()?.includes(e.toLowerCase());
      });
    } else {
      this.filterFileList = this.fileList;
    }
  }

  dynamicSort(property:any) {
    var sortOrder = 1;

    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a:any, b:any) {
      if (sortOrder == -1) {
        return b[property]?.localeCompare(a[property]);
      } else {
        return a[property]?.localeCompare(b[property]);
      }
    };
  }

  sortMethod(e:any) {
    if (e === 'option2') {
      this.filterFileList.sort(this.dynamicSort('title'));
    } else {
      this.filterFileList
        .sort((val1:any, val2:any) => {
          return <any>new Date(val1.dateTime) - <any>new Date(val2.dateTime);
        })
        .reverse();
    }
  }
  close() {
    this.showbtn = false;
    this.getAllFilesAndNotes(this.PageNumber, this.NumberOfRecord);
  }

  Downloadfile(data:any) {
    console.log(data);
    this.fileService
      .downloadFile(data.id, data?.isNote == false ? true : false)
      .subscribe(
        (result) => {
          console.log(result, 'aaaas');
          const blob = new Blob([result], { type: result.type });
          FileSaver.saveAs(blob, data.fileName);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }






  SynchronizationData(){
    this.dialog.open(SynchronizationDataComponent, {
      width: '100%',
      data: { ScreenType:'FilesAndNotesPage'},
      autoFocus: false,
      disableClose: true,
    });
  }


  



}
