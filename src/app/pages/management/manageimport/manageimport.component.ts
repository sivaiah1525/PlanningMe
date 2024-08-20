import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DriveService } from 'src/app/core/services/drive.service';
import { MapService } from 'src/app/core/services/map.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-manageimport',
  templateUrl: './manageimport.component.html',
  styleUrls: ['./manageimport.component.scss']
})
export class ManageimportComponent implements OnInit {
  form!: FormGroup;
  chooseoptionFile: boolean = false;
  showFirst: boolean = false;
  showsecond: boolean = false;
  showthird: boolean = false;
  applicationname: any;
  appname: any;
  NetButtonStatus: boolean = false;
  mapconfigurationName: any;
  externalcoulmns:any = [];
  externalonseencoulmns:any = [];
  id = 0;
  planningcolumns:any = [];
  mappingcol:any = [];
  finalmapeddata:any = [];
  filecolumns:any = [];
  columnFile:any = [];
  planningCoulmns:any = [];
  mappedColumn:any = [];
  apiKey = 'ZEp4NTg5NjljNmNmNGU4NGE0Y2EwYTM1ZDVhZGViODkwZTlPTnBl';
  url = 'http://onssendata-testenv.eu-west-3.elasticbeanstalk.com/api/Target/GetUserExportSearchedContacts';
  mapConfigurationId: any;
  fileToUpload: any;
  colusingapikey!: boolean;
  finaldata!: any[];
  tagType = [{ type: 'Boolean' }, { type: 'Text' }, { type: 'Number' }, { type: 'Dropdown' }];
  showtagType: boolean = false;
  file: any;
  index: any;
  tag: any;
  filemappedData: any;
  showUpdateConfiguration: boolean = false;
  savedconfiguation: any;
  columnMatch!: boolean;
  savedcolumn: any;
  configurationColumn: any;
  savedconfigurationDetails: any;
  savedconfigurationColumnkey: any;
  savedconfigurationColumnvalue: any;
  savedconfigurationColumn: any;
  saveconfigurationdata = [];
  Entitytype: any;
  saveConfigurationbutton = false;
  UpdateConfigurationbutton = false
  today = new Date();
  Responsemessage = ''
  templateFile = false
  getfileDio :any= [];
  gettagDio :any= [];
  constructor(
    private formBuilder: FormBuilder,
    private DriveService: DriveService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ManageimportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private messageService: MessageService,
    private dialog: MatDialog,
    private mapService: MapService,
  ) { }

  ngOnInit(): void {
    this.Entitytype = this.data
    this.showFirst = true;
    this.form = this.formBuilder.group({
      Name: [],
      applicationName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      configurationName: [''],
      configurationid: [''],
      configurationDescription: [''],
      apiKey: [null, Validators.required],
      url: [null, Validators.required],
      applicationId: [''],
      handleTemplateFileInput: [],
      isFile: []
    });
    this.getapplicationname();
    this.getPlannigandmecolumns()
  }

  // ------------------- 
  // importData 
  importData() {
    this.DriveService.importData(this.apiKey, this.url, this.mapConfigurationId).subscribe((res: any) => {
      this.messageService.showMessage(res.response[0].message);
      this.dialogRef.close(true);
    });
  }

  goToFirst() {
    this.showFirst = true;
    this.showsecond = false;
    this.showthird = false;
  }

  goToSecond() {
    this.showFirst = false;
    this.showsecond = true;
    this.showthird = false;
  }

  // createMapping
  createMapping() {
    this.showFirst = false;
    this.showsecond = false;
    this.showthird = true;
    this.saveConfigurationbutton = true
  }
  getConfigurationDetails() {
    this.FindConfigurationDetails()
    this.showFirst = false;
    this.showsecond = false;
    this.showthird = true;
    this.UpdateConfigurationbutton = true
  }

  //firts tab
  nextbutton1() {
    if (this.chooseoptionFile == true) {
      this.showFirst = false;
      this.showthird = false;
      this.showsecond = true;
      this.getfilesColumesWithEntity()
      this.fileConfiguration()
    } else if (this.chooseoptionFile == false) {
      this.onSelectForapikey()
    }
  }
  // ------------------ 

  getPlannigandmecolumns() {
    this.planningCoulmns = [];
    this.DriveService.getplanningcolumns(this.Entitytype).subscribe((res: any) => {
      res.defaultColumns.forEach((element:any) => {
        this.planningCoulmns.push({
          name: element,
          isTag: false
        })
      })
      if (res.tagColumns.length != 0) {
        this.gettagDio = res.tagColumns
      }
      setTimeout(() => {
        if (this.gettagDio.length != 0) {
          this.planningCoulmns.map((col:any) => {
            this.gettagDio.forEach((tage:any) => {
              if (col.name == tage.fieldName) {
                return col.isTag = true
              } else {
                return col.isTag = false
              }
            })
          })
        }
      }, 1000);
    });
  }


  // step ------000000000000001 
  // getapplicationname with api key 
  getapplicationname() {
    this.chooseoptionFile = false;
    this.DriveService.getApplications().subscribe((res:any) => {
      console.log(res);
      this.applicationname = res;
    });
  }


  // handleFileInput 
  handleFileInput(event:any, name:any) {
    this.chooseoptionFile = true;
    this.file = event.target.files[0];
    this.fileToUpload = event.target.files[0].name;
    if (name == 'CustomFile') {
      this.form.patchValue({ 'Name': this.fileToUpload });
      this.NetButtonStatus = true;
      this.templateFile = false;
    } else if (name == 'templateFile') {
      this.form.patchValue({ 'handleTemplateFileInput': this.fileToUpload });
      this.templateFile = true;
      this.NetButtonStatus = false;
    }

  }
  handileurlAndAPIKEY(value:any) {
    console.log(value)
    if (value) {
      this.NetButtonStatus = true;
    }
  }


  //getApikeyCollames
  getApikeyCollames() {
    this.DriveService.mappingConfigurations(this.appname).subscribe((res:any) => {
      console.log(res);
      this.mapconfigurationName = res;
    });
  }
  // getfilesColumesWithEntity 
  getfilesColumesWithEntity() {
    const formData = new FormData();
    formData.append('file', this.file);
    this.DriveService.getFileColumn(formData, this.Entitytype, this.templateFile).subscribe((res: any) => {
      console.log(res)
      console.log(res.tagTypeDtos)
      this.mappedColumn = [];
      res.excelColumnNames.forEach((element:any) => {
        this.mappedColumn.push({
          id: this.id,
          fileColumnName: element,
          isChecked: false,
          entityFieldName: [],
          isTag: false,
        });
      });
      if (res.tagTypeDtos.length != 0) {
        this.gettagDio = res.tagTypeDtos
      }
      setTimeout(() => {
        if (this.gettagDio.length != 0) {
          this.mappedColumn.map((col:any) => {
            this.gettagDio.forEach((tage:any) => {
              console.log(col.fileColumnName)
              console.log(tage.fieldName)
              if (col.fileColumnName == tage.fieldName) {
                return col.isTag = true
              } else {
                return col.isTag = false
              }
            })
          })
        }
      }, 1000);
    });
  }


  // step ------------ 0000000000000002 
  // fileConfiguration 
  fileConfiguration() {
    this.DriveService.fileMappingConfigurations(this.Entitytype).subscribe((res:any) => {
      console.log(res);
      this.mapconfigurationName = res
    });
  }

  // selectConfiguration 
  selectConfiguration(configuration:any) {
    this.form.get('configurationid')?.setValue(configuration.id)
    console.log(configuration)
    this.filemappedData = configuration;
    this.form.get('isFile')?.setValue(false)
  }

  onChange(id:any, appName:any) {
    this.appname = id;
    this.form.patchValue({ 'applicationName': appName.applicationName });
    this.NetButtonStatus = true
    this.chooseoptionFile = false
  }


  // Api key 
  onSelectForapikey() {
    let data = {
      ApiKey: this.form.get('apiKey')?.value,
      Url: this.form.get('url')?.value
    }
    this.getcolumnsWithApiKey(data)
  }


  ImportExternalDataResponse(res:any) {
    this.mapService.ImportOnssendataResponse(res).subscribe((res:any) => {
      if (res) {
        this.Responsemessage = ''
        res.forEach((element:any) => {
          this.Responsemessage += ',' + element


        })
        this.snackBar.open(this.Responsemessage, '', { duration: 2000, });
        this.dialog.closeAll()

      }
    })
  }
  getcolumnsWithApiKey(data:any) {
    this.DriveService.getcolumnsWithonssendata(data).subscribe((res: any) => {
      if (res) {
        this.ImportExternalDataResponse(res)
        // this.getPlannigandmecolumns()
        // this.form.get('isFile')?.setValue(false)
        // this.mappedColumn = []
        // res.forEach((element:any) => {
        //   this.mappedColumn.push({
        //     fileColumnName: element,
        //     isChecked: false,
        //     entityFieldName: '',
        //     dataType: '',
        //     isTag: false
        //   });

        // });

      }
    })
  }



  getcolumnsWithonseendata(data:any) {
    this.DriveService.getcolumnsWithonssendata(data).subscribe((res: any) => {
      if (res) {
        this.getPlannigandmecolumns()
        this.form.get('isFile')?.setValue(false)
        this.mappedColumn = []
        const columns = Object.entries(res[0])
        columns.forEach((element:any) => {
          this.mappedColumn.push({
            fileColumnName: element[0],
            isChecked: false,
            entityFieldName: '',
            dataType: '',
            isTag: false
          });

        });

      }
    })
  }



  getExternalcolumnapplication() {
    this.DriveService.getApplicationsById(this.appname).subscribe((res: any) => {
      this.mappedColumn = [];
      res.forEach((element:any) => {
        this.id += 1;
        this.mappedColumn.push({
          id: this.id,
          fileColumnName: element,
          isChecked: false,
          entityFieldName: [],
          isTag: false,
          dataType: ''
        });
      });
    });
  }

  // FindConfigurationDetails 
  FindConfigurationDetails() {
    let data = { MapId: this.form.get('configurationid')?.value, IsFile: true }
    this.DriveService.FindConfigurationDetails(data).subscribe((result: any) => {
      if (result) {
        this.form.get('configurationDescription')?.setValue(result.configurationDescription)
        this.form.get('applicationId')?.setValue(result.applicationId)
        this.form.get('configurationName')?.setValue(result.configurationName)
        this.form.get('apiKey')?.setValue(result.apiKey)
        this.mappedColumn = []
        result.columns.forEach((element:any) => {
          console.log(element)
          this.mappedColumn.push({
            id: element.id,
            fileColumnName: element.fileColumnName,
            isChecked: true,
            entityFieldName: element.entityFieldName,
            dataType: element?.dataType,
            isTag: element.isTag,
          });
        });
      }
    })
  }

  ImportTemplateFile() {
    const formData = new FormData();
    formData.append('file', this.file);
    this.DriveService.getFileColumn(formData, this.Entitytype, this.templateFile).subscribe((resilt: any) => {
      if (resilt) {
        this.getfileDio = []
        this.gettagDio = []
        if (this.Entitytype == 'Transactions') {
          const columns = Object.entries(resilt.transactionMappedColumnDto)
          this.gettagDio = resilt.tagTypeDtos
          columns.forEach((elament:any) => {
            this.getfileDio.push(elament)
          })

        } else if (this.Entitytype == 'Events') {
          const columns = Object.entries(resilt.eventMappedColumnDto)
          this.gettagDio = resilt.tagTypeDtos
          columns.forEach((elament:any) => {
            this.getfileDio.push(elament)
          })

        } else if (this.Entitytype == 'Users') {
          const columns = Object.entries(resilt.userMappedColumnDto)
          this.gettagDio = resilt.tagTypeDtos
          columns.forEach((elament:any) => {
            this.getfileDio.push(elament)
          })

        } else if (this.Entitytype == 'Contacts') {
          const columns = Object.entries(resilt.contactMappedColumnDto)
          this.gettagDio = resilt.tagTypeDtos
          columns.forEach((elament:any) => {
            this.getfileDio.push(elament)
          })

        } else if (this.Entitytype == 'Sites') {
          const columns = Object.entries(resilt.siteMappedColumnDto)
          this.gettagDio = resilt.tagTypeDtos
          columns.forEach((elament:any) => {
            this.getfileDio.push(elament)
          })

        }
        else if (this.Entitytype == 'Products') {
          const columns = Object.entries(resilt.productMappedColumnDto)
          this.gettagDio = resilt.tagTypeDtos
          columns.forEach((elament:any) => {
            this.getfileDio.push(elament)
          })

        }

        if (this.getfileDio.length != 0) {
          this.getfileDio.forEach((element:any) => {
            this.id += 1;
            console.log(element)
            this.mappedColumn.push({
              id: this.id,
              fileColumnName: element[1] == null ? ' ' : element[1],
              isChecked: true,
              entityFieldName: element[0] == null ? ' ' : element[0],
            });
          });
        }
        if (this.gettagDio.length != 0) {
          this.gettagDio.forEach((element:any) => {
            this.id += 1;
            console.log(element)
            this.mappedColumn.push({
              id: this.id,
              fileColumnName: element.fieldName == null ? ' ' : element.fieldName,
              isChecked: true,
              entityFieldName: element.mappedName == null ? ' ' : element.mappedName,
            });
          });
        }
        setTimeout(() => {
          console.log(this.mappedColumn)
          this.ImportMapImportFile()
        });
      }
    })

  }


  // step -111111 

  // SaveAndUpdateConfiguration 
  SaveAndUpdateConfiguration() {
    this.mappedColumn.forEach((element:any) => {
      if (element.isChecked == true) {
        console.log(element)
        this.finalmapeddata.push({
          "fileColumnName": element.fileColumnName,
          "entityFieldName": element.entityFieldName,
          "isTag": element?.isTag,
          "dataType": element.dataType
        });
      }
    });
    if (this.chooseoptionFile == true) {
      if (this.UpdateConfigurationbutton == true) {
        let data = {
          mappingId: this.form.get('configurationid')?.value,
          name: this.Entitytype,
          configurationName: this.form.get('configurationName')?.value,
          configurationDescription: this.form.get('configurationDescription')?.value,
          created: this.today,
          isFile: this.chooseoptionFile,
          columns: this.finalmapeddata
        };
        this.DriveService.UpdateConfiguration(data).subscribe((result) => {
          if (result) {
            this.snackBar.open('Update mapping ', '', { duration: 2000, });
            this.ImportMapImportFile()

          }
        })
      } else if (this.saveConfigurationbutton == true) {
        let data = {
          name: this.Entitytype,
          configurationName: this.form.get('configurationName')?.value,
          configurationDescription: this.form.get('configurationDescription')?.value,
          created: this.today,
          isFile: this.chooseoptionFile,
          columns: this.finalmapeddata
        };
        this.DriveService.CreateNewConfiguration(data).subscribe((result) => {
          if (result) {
            this.snackBar.open('New mapping Created', '', { duration: 2000, });
            this.ImportMapImportFile()
          }
        })
      }

    } else if (this.chooseoptionFile == false) {
      let data = {
        applicationId: this.appname,
        name: this.Entitytype,
        configurationName: this.form.get('configurationName')?.value,
        configurationDescription: this.form.get('configurationDescription')?.value,
        created: this.today,
        apiKey: this.form.get('configurationDescription')?.value,
        url: this.form.get('url')?.value,
        isFile: this.form.get('apiKey')?.value,
        columns: this.finalmapeddata
      };
      this.DriveService.CreateNewConfiguration(data).subscribe((result) => {
        if (result) {
          this.snackBar.open('New mapping Created', '', { duration: 2000, });
          this.ImportMapImportFile()
        }
      })

    }
  }

  // File step ----------------- 
  // ImportMapImportFile 
  ImportMapImportFile() {
    console.log(this.finalmapeddata)
    if (this.chooseoptionFile == false) {
      let data = {
        applicationId: this.appname,
        applicationName: this.form.get('applicationName')?.value,
        configurationName: this.form.get('configurationName')?.value,
        configurationDescription: this.form.get('configurationDescription')?.value,
        apiKey: this.form.get('apiKey')?.value,
        url: this.form.get('url')?.value,
        isFile: false,
        mappedColumns: this.finalmapeddata
      };
      this.DriveService.createconfiguration(data).subscribe((res: any) => {
        this.messageService.showMessage('configurationCreated');
        this.mapConfigurationId = res?.response[0]?.message;
        if (res?.response[0]?.message) {
          this.importData();
          this.dialogRef.close();
        }
      });
    }
    else if (this.chooseoptionFile == true) {
      const formData = new FormData();
      formData.append('ConfigurationName', this.form.get('configurationName')?.value);
      formData.append('ConfigurationDescription', this.form.get('configurationDescription')?.value);
      formData.append('Save', 'true');
      formData.append('file', this.file);
      if (this.Entitytype == 'Contacts') {
        this.mappedColumn.forEach((elament:any) => {
          console.log(elament)
          if (elament.isChecked == true) {
            formData.append('ContactMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament?.fileColumnName);
          }
        })
      } else if (this.Entitytype == 'Transactions') {
        this.mappedColumn.forEach((elament:any) => {
          if (elament.isChecked == true) {
            formData.append('TransactionMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament?.fileColumnName);
          }
        })
      } else if (this.Entitytype == 'Users') {
        this.mappedColumn.forEach((elament:any) => {
          console.log(elament)
          if (elament.isChecked == true) {
            formData.append('UserMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament?.fileColumnName);
          }
        })
      } else if (this.Entitytype == 'Sites') {
        this.mappedColumn.forEach((elament:any) => {
          if (elament.isChecked == true) {
            formData.append('SiteMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament?.fileColumnName);
          }
        })
      } else if (this.Entitytype == 'Products') {
        console.log("siva")
        this.mappedColumn.forEach((elament:any) => {
          if (elament.isChecked == true) {
            formData.append('ProductMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament?.fileColumnName);
          }
        })
      } else if (this.Entitytype == 'Events') {
        this.mappedColumn.forEach((elament:any) => {
          if (elament.isChecked == true) {
            console.log(elament)
            formData.append('EventMappedColumnDto.' + elament.entityFieldName.replaceAll(' ', ''), elament?.fileColumnName);
          }
        })
      }
      this.DriveService.ImportMapImportFile(this.Entitytype, formData).subscribe((result: any) => {
        if (result) {
          if (result.lenght > 1) {
            this.Responsemessage = result[0] + ',' + result[1] + ',' + result[2] + ',' + result[3] + ',' + result[4]
            window.alert(this.Responsemessage)
          }
          this.snackBar.open('Import Maping Done', '', { duration: 2000, });
          this.dialogRef.close(true)
          this.dialog.closeAll()
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






