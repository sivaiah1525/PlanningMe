import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DriveService } from 'src/app/core/services/drive.service';
import { onseencol, plancol } from '../mapping/mapping.component';
import { MessagePopupComponent } from '../../commonForAll/message-popup/message-popup.component';
import { CKEditorComponent } from 'ckeditor4-angular';



@Component({
  selector: 'app-create-configurationform',
  templateUrl: './create-configurationform.component.html',
  styleUrls: ['./create-configurationform.component.scss']
})
export class CreateConfigurationformComponent implements OnInit {
  @ViewChild('ckeditor', { static: true }) ckeditor!: CKEditorComponent;
  CreateConfiguration: FormGroup;
  managementType = ['Users', 'Contacts', 'Sites', 'Products', 'Transactions'];
  SelectEntityValue: any;
  planningcolumns: plancol[] = [];
  appname: any;
  externalcoulmns: onseencol[] = [];
  externalonseencoulmns: any;
  PlanningAndMecolumns:any = []
  ConfigurationNamelistforfile: any;
  ConfigurationNamelistforApiKey: any;
  applicationname: any;
  mappingcol :any= [];
  finalmapeddata:any = [];
  tabindex = 0;
  dataType = ['Number', 'String', 'Boolean']
  isTagType = [true, false]
  today = new Date();
  Responsemessage = ''
  Textarea = 'siva'
  TextareaArrey :any= []
  TextareaNewArrey:any = []
  manuvallmappingcol: boolean = true
  Textareamapping: boolean = false;
  highlightedText: string = '';
  replaceValue:any = []
  editorData: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private DriveService: DriveService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateConfigurationformComponent>,
  ) {

    this.CreateConfiguration = this.formBuilder.group({
      Entity: [''],
      applicationname: [''],
      applicationId: [0],
      configurationName: [''],
      configurationDescription: [''],
      isFile: [false],
      UploadFile: [''],
      name: [''],
      created: [],
      url: [''],
      apiKey: [''],
      textareahtmlFile: [''],
      textareahtmlcontent: [''],
      Textareamapping: this.formBuilder.array([
        this.createfileBody()
      ])

    })
  }

  saveContent() {
    const blob = new Blob([this.editorData], { type: 'text/html' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'edited_content.html';
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  convertToHtmlFile() {
    const data = new Blob([this.editorData], { type: 'text/html' });
    return data
  }


  gettexdataforarray() {
    return this.editorData.split('<br />')
  }

  onSelectFortextarea() {
    this.Textareamapping = true;
    this.manuvallmappingcol = false
    this.getPlanningAndMecolumns()
    // this.saveContent()
  }




  getTextareamappingBody() {
    return this.CreateConfiguration.get('Textareamapping') as FormArray;
  }

  createfileBody(): FormGroup {
    return this.formBuilder.group({
      replaceValue: [''],
      PnMColumn: [''],
    })
  }

  removeConditiona(i: number) {
    this.getTextareamappingBody().removeAt(i);

  }
  addConditionalBody() {
    this.getTextareamappingBody().push(this.createfileBody())
  }

  ngOnInit(): void {
    console.log(this.data)
    if (this?.data) {
      this.CreateConfiguration.get('Entity')?.setValue(this?.data?.type)
      this.SelectEntityValue = this?.data?.type
      this.getPlanningAndMecolumns()
    } else {
      this.getapplicationname()

    }
  }
  // getapplicationname 
  getapplicationname() {
    this.DriveService.getApplications().subscribe((res) => {
      this.applicationname = res;
      this.applicationname.map((e:any) => {
        if (this.data.mapscreen == true) {
          if (e.applicationName == 'MySource.Data') {
            this.Selactapplication(e)
          }
        }

      })
    });
  }

  CreateApplication() {
    const CreateApplication = this.dialog.open(MessagePopupComponent, {
      data: { screenType: 'createApplication' },
      width: '300px'
    })
    CreateApplication.afterClosed().subscribe(result => {
      if (result) {
        this.getapplicationname()
      }
    });
  }


  // Selactapplication 
  Selactapplication(application:any) {
    this.CreateConfiguration.get('applicationId')?.setValue(application.id);
    this.appname = application.id;
    this.getAvailableApiKeys(application.id)

  }
  // getAvailableApiKeys 
  getAvailableApiKeys(id:any) {
    this.DriveService.getAvailableApiKeys(id).subscribe((res: any) => {
      if (res) {
        this.ConfigurationNamelistforApiKey = res
      }
    })
  }

  tabChanged(event:any) {
    this.tabindex = event.index
    console.log(this.tabindex)
  }

  SelectEntity(value:any) {
    this.SelectEntityValue = value
    this.getPlanningAndMecolumns()
  }
  onSelectforfile(e:any) {
    this.getPlanningAndMecolumns()
    var file = e.target.files[0];
    this.CreateConfiguration.get('UploadFile')?.setValue({ fileSource: file })
    var formData = new FormData();
    formData.append('File', file);
    this.DriveService.getfilecolumns(formData, this.SelectEntityValue).subscribe((res: any) => {
      if (res) {
        this.mappingcol = []
        this.CreateConfiguration.get('isFile')?.setValue(true)
        res.excelColumnNames.forEach((element:any) => {
          this.mappingcol.push({
            fileColumnName: element,
            isChecked: false,
            entityFieldName: '',
            dataType: '',
            isTag: false
          });

        });

      }
    })
  }

  onSelectForapikeyorURL() {
    if (this.manuvallmappingcol == true) {
      if (this.CreateConfiguration.get('apiKey')?.value.length > 15 && this.CreateConfiguration.get('url')?.value.length > 15) {
        let data = {
          ApiKey: this.CreateConfiguration.get('apiKey')?.value,
          Url: this.CreateConfiguration.get('url')?.value
        }
        this.getcolumnsWithApiKey(data)
      }
    }
  }

  getcolumnsWithApiKey(data:any) {
    this.DriveService.getcolumnsWithApiKey(data).subscribe((res: any) => {
      if (res) {
        this.getPlanningAndMecolumns()
        this.CreateConfiguration.get('isFile')?.setValue(false)
        this.mappingcol = []
        res.forEach((element:any) => {
          this.mappingcol.push({
            fileColumnName: element,
            isChecked: false,
            entityFieldName: '',
            dataType: '',
            isTag: false
          });
        });
      }
    })
  }

  // ------------ 
  getPlanningAndMecolumns() {
    if (this.PlanningAndMecolumns.length == 0) {
      this.DriveService.getplanningcolumns(this.SelectEntityValue).subscribe((result: any) => {
        if (result) {
          this.PlanningAndMecolumns = []
          result?.defaultColumns?.forEach((element:any) => {
            this.PlanningAndMecolumns.push({
              name: element,
              isTag: false
            })
            result?.tagColumns?.forEach((element:any) => {
              this.PlanningAndMecolumns.push({
                name: element,
                isTag: true
              })
            })
          })
        }
      })
    }
  }

  // savemapping 
  savemapping() {
    this.mappingcol.forEach((element:any) => {
      if (element.isChecked == true) {
        this.finalmapeddata.push({
          "id": element.id,
          "fileColumnName": element.fileColumnName,
          "entityFieldName": element.entityFieldName,
          "isTag": element.isTag,
          "dataType": element.dataType
        });
      }
    });
    if (this.tabindex == 1) {
      // manuvall mapping with file 
      this.CreateConfiguration.get('isFile')?.setValue(true)
      let data = {
        name: this.CreateConfiguration.get('applicationname')?.value,
        applicationId: this.CreateConfiguration.get('applicationId')?.value,
        configurationName: this.CreateConfiguration.get('configurationName')?.value,
        configurationDescription: this.CreateConfiguration.get('configurationDescription')?.value,
        created: this.today,
        isFile: this.CreateConfiguration.get('isFile')?.value,
        columns: this.finalmapeddata
      };
      this.DriveService.CreateNewConfiguration(data).subscribe((result) => {
        if (result) {
          this.snackBar.open('New mapping Created', '', { duration: 3000, });
          this.ImportMapImportFile()
        }
      })
    } else if (this.tabindex == 0) {
      this.CreateConfiguration.get('isFile')?.setValue(false)
      // manuvall mapping for api & key 
      if (this.manuvallmappingcol == true) {
        let data = {
          name: this.CreateConfiguration.get('applicationname')?.value,
          applicationId: this.CreateConfiguration.get('applicationId')?.value,
          configurationName: this.CreateConfiguration.get('configurationName')?.value,
          configurationDescription: this.CreateConfiguration.get('configurationDescription')?.value,
          created: this.today,
          apiKey: this.CreateConfiguration.get('apiKey')?.value,
          url: this.CreateConfiguration.get('url')?.value,
          isFile: this.CreateConfiguration.get('isFile')?.value,
          columns: this.finalmapeddata
        };
        this.DriveService.CreateNewConfiguration(data).subscribe((result) => {
          if (result) {
            this.snackBar.open('New mapping Created', '', { duration: 3000, });
          }
        })
        // text area mapping 
      } else {
        this.TextareaArrey = this.gettexdataforarray()
        this.TextareaArrey.forEach((element:any, index:number) => {
          this.CreateConfiguration?.value.Textareamapping.forEach((value:any) => {
            let position = element.search(value.replaceValue);
            if (position > 0) {
              this.TextareaNewArrey.push({
                replaceValue: value.replaceValue,
                PnMColumn: value.PnMColumn,
                lineNumber: index + 1
              })
            }
          })
        })
        let data = {
          name: this.CreateConfiguration.get('applicationname')?.value,
          applicationId: this.CreateConfiguration.get('applicationId')?.value,
          configurationName: this.CreateConfiguration.get('configurationName')?.value,
          configurationDescription: this.CreateConfiguration.get('configurationDescription')?.value,
          created: this.today,
          apiKey: this.CreateConfiguration.get('apiKey')?.value,
          url: this.CreateConfiguration.get('url')?.value,
          isFile: this.CreateConfiguration.get('isFile')?.value,
          columns: this.TextareaNewArrey
        };
        this.DriveService.CreateNewConfiguration(data).subscribe((result:any) => {
          if (result) {
            this.AddWebserviceMapping(result['response'][0].message)
            this.snackBar.open('New mapping Created', '', { duration: 3000, });
          }
        })
      }
    }
  }
  AddWebserviceMapping(data:any) {
    console.log(data)
    const formData = new FormData();
    formData.append('file', this.convertToHtmlFile());
    formData.append('MappingConfigurationId', data);
    formData.append('ObjectStartRow', '');
    formData.append('ObjectEndRow', '');
    this.TextareaNewArrey.forEach((element:any, index:any) => {
      formData.append('RowMap[' + index + '].replaceValue', element.replaceValue);
      formData.append('RowMap[' + index + '].PnMColumn', element.PnMColumn.replaceAll(' ', ''));
      formData.append('RowMap[' + index + '].lineNumber', element.lineNumber);
    })
    this.DriveService.AddWebserviceMapping(formData).subscribe((result:any) => {
      if (result) {
        this.snackBar.open(result['response'][0].message, '', { duration: 3000, });
        this.dialogRef.close(true)
      }
    })
  }

  // ------------- 
  // ImportMapImportFile 
  ImportMapImportFile() {
    if (this.CreateConfiguration.get('isFile')?.value == true) {
      const formData = new FormData();
      formData.append('File', this.CreateConfiguration.get('UploadFile')?.value.fileSource);
      formData.append('ConfigurationName', this.CreateConfiguration.get('configurationName')?.value);
      formData.append('ConfigurationDescription', this.CreateConfiguration.get('configurationDescription')?.value);
      if (this.SelectEntityValue == 'Contacts') {
        this.mappingcol.forEach((elament:any) => {
          if (elament.isChecked == true) {
            formData.append('ContactMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament.fileColumnName);
          }
        })
      } else if (this.SelectEntityValue == 'Transactions') {
        this.mappingcol.forEach((elament:any) => {
          if (elament.isChecked == true) {
            formData.append('TransactionMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament.fileColumnName);
          }
        })
      } else if (this.SelectEntityValue == 'Users') {
        this.mappingcol.forEach((elament:any) => {
          if (elament.isChecked == true) {
            formData.append('UserMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament.fileColumnName);
          }
        })
      } else if (this.SelectEntityValue == 'Sites') {
        this.mappingcol.forEach((elament:any) => {
          if (elament.isChecked == true) {
            formData.append('SiteMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament.fileColumnName);
          }
        })
      } else if (this.SelectEntityValue == 'Products') {
        this.mappingcol.forEach((elament:any) => {
          if (elament.isChecked == true) {
            formData.append('ProductMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament.fileColumnName);
          }
        })
      }
      this.DriveService.ImportMapImportFile(this.SelectEntityValue, formData).subscribe((result) => {
        if (result) {
          this.snackBar.open('Import mapping Done', '', { duration: 3000, });
        }
      }, (error) => {
        this.Responsemessage = ''
        error.error.forEach((e:any) => {
          this.Responsemessage += ',' + e
        })
        window.alert(this.Responsemessage)
      })

    }
  }

}
