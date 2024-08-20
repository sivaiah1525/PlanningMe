import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionService } from 'src/app/core/services/permission.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { elementAt } from 'rxjs-compat/operator/elementAt';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-permission-apply-edit',
  templateUrl: './permission-apply-edit.component.html',
  styleUrls: ['./permission-apply-edit.component.scss']
})
export class PermissionApplyEditComponent implements OnInit {
  permission: FormGroup;
  type: any;
  getparams: [] = [];
  listdata: any;
  index: any;
  userid: any[] = [];
  Groupid: any[] = [];
  linkeduserid: any[] = [];
  linkedGroupid: any[] = [];
  uniqueUserList: any[] = [];
  AllDataByGroupId: any[] = [];
  tagparameters: any[] = [];
  UserDetails: any;
  singleSearchValue = null;
  SearchValue = null;
  showicon!: boolean;
  isChecked!: boolean;
  UserPermission: any = {};
  create: any;
  tempdata: any;
  permisiondata: any[] = [];
  permisiononly: any[] = [];
  opendialog = false;
  permssionarray!: any[];
  id: any;
  params: any[] = [];
  selected = [];
  coldata: any;
  tagdata: any;
  permissionId: any;
  result: any;
  resultsplit: any;
  length: any;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  Height!: Window["innerHeight"];
  AllLinks!: any[];
  AllGroupsLinks!: any[];
  getAllSingle!: any[];
  getAllGroups!: any[];
  defaultParameters: any[] = [];
  tagParameters: any[] = [];
  parametter: any[] = []
  createButton = false
  screenType = ''
  transationType = ''
  saleType = true
  buyType = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private manageUsersService: ManageUsersService,
    private manageContactsService: ManageContactsService,
    private manageSitesService: ManageSitesService,
    private manageProductsService: ManageProductsService,
    private ManageTransactionsService: ManageTransactionsService,
    private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }    this.permission = this.formBuilder.group({
      parameters: [[]],
      SelactIds: [[]],
      GroupIds: [[]],
      userType: ['', Validators.required],
      tableId: [],
      SelactGroups: [false],
      TransactionTypeSale: [true],
      TransactionTypeBuy: [false],
    });
  }

  ngOnInit(): void {
    this.type = this.data.type
    if (this.data.screenType == 'CreatePermission') {
      this.getparametervalue();
      this.screenType = this.data.screenType
    } else {
      console.log(this.data)
      this.screenType = this.data.screenType
    }
    this.droupdowncall()
  }

  checkTransationTypeSale(value:any) {
    if (value == true) {
      this.permission.get('TransactionTypeSale')?.setValue(true)
    } else {
      this.permission.get('TransactionTypeSale')?.setValue(false)

    }
  }
  checkTransationTypeBuy(value:any) {
    if (value == true) {
      this.permission.get('TransactionTypeBuy')?.setValue(true)

    } else {
      this.permission.get('TransactionTypeBuy')?.setValue(false)

    }
  }


  droupdowncall() {
    this.UserDetails = this.data.data
    this.userid.push(this.data.data.id)
    this.permission.get('SelactIds')?.setValue([this.data.data.id])
    this.getalluserdata()
    this.getallGroupdata()
    this.getparametervalue()
    if (this.data.type == 'Users') {
      this.getalluser();
    } else if (this.data.type == 'Contacts') {
      this.getallcontact();
    } else if (this.data.type == 'Sites') {
      this.getallsites();
    } else if (this.data.type == 'Products') {
      this.getallproduct();
    } else if (this.data.type == 'Transactions') {
      this.getallTransactions();

    }
  }

  getgroupvalue() {
    return this.permission.get('SelactGroups')?.value
  }
  ApplytootherGroups() {
    this.userid.length = 0
    this.permission.get('GroupIds')?.value.forEach((element:any) => {
      this.manageUsersService.fetchUserGroupByIdService(element).subscribe((result: any) => {
        if (result) {
          result.forEach((element:any) => {
            console.log(element)
            this.userid.push(element.id)
          })

        }
      })
    })
    setTimeout(() => {
      this.permission.get('SelactIds')?.value.forEach((element:any) => {
        this.userid.push(element)
      })
      let uniqueArr = [...new Set(this.userid)];
      this.permission.get('SelactIds')?.setValue(uniqueArr)
    }, 1000);
  }



  getUserPermission() {
    this.permissionService.getUserPermission(this.data.data.id).subscribe((result: any) => {
      result.forEach((element:any) => {
        if (this.type == element.tableName) {
          if (element.tableName == 'Transactions') {
            this.permission.get('TransactionTypeBuy')?.setValue(element.isBuy)
            this.saleType = element.isSale
            this.buyType = element.isBuy
            this.permission.get('TransactionTypeSale')?.setValue(element.isSale)
            this.permissionId = element.permissionId
          } else {
            this.UserPermission = element;
            const permissionLinkDtos = element?.permissionLinkDtos[0]
            this.gettageAndparameterUdate(permissionLinkDtos)
            this.permissionId = element.permissionLinkDtos[0].permissionId
            element.permissionLinkDtos.forEach((element:any) => {
              this.AllLinks.map(e => {
                if (element.tableId == e.id) {
                  this.getuniqueUserList(e.id)
                  e.isChecked = true
                }
              })
            })
          }
        }
      });
    });
  }
  createpermistionApiCall() {
    const data = {
      "tableName": this.type,
      "usersId": this.permission.get('SelactIds')?.value,
      "linkedTableId": this.uniqueUserList,
      "permissionColumnDto": {
        "defaultParameters": this.defaultParameters,
        "tagParameters": this.tagParameters
      },
      "isBuy": this.permission.value.TransactionTypeBuy,
      "isSale": this.permission.value.TransactionTypeSale

    }
    console.log(data)
    this.permissionService.createPermissions(data).subscribe((result) => {
      this.linkeduserid = [];
      this.showicon = false;
      this.SearchValue = null;
      this.messageService.showMessage(result['response'][0].message);
      this.dialog.closeAll();
      this.userid = [];
    });
  }

  updatepermission() {
    const data = {
      "permissionId": this.permissionId,
      "tableName": this.type,
      "usersId": this.permission.get('SelactIds')?.value,
      "linkedTableId": this.uniqueUserList,
      "permissionColumnDto": {
        "defaultParameters": this.defaultParameters,
        "tagParameters": this.tagParameters
      },
      "isBuy": this.permission.value.TransactionTypeBuy,
      "isSale": this.permission.value.TransactionTypeSale
    }
    this.permissionService.updatePermission(data).subscribe((result) => {
      this.showicon = false;
      this.SearchValue = null;
      this.messageService.showMessage(result['response'][0].message);
      this.dialog.closeAll();
      this.userid = [];
    });
  }


  getuniqueUserList(value:any) {
    this.linkeduserid.push(value)
    this.uniqueUserList.forEach(id => {
      this.linkeduserid.push(id)
    })
    this.uniqueUserList = []
    this.uniqueUserList = [...new Set(this.linkeduserid)];
  }

  closedialogbox() {
    this.opendialog = false;
    this.dialog.closeAll();
  }

  applysearch(filterValue:any) {
    if (filterValue.trim().toLowerCase().length > 0) {
      let arr = this.AllLinks;
      arr = this.AllLinks.filter((item) => {
        return (item.name.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
        );
      });
      this.AllLinks = arr;
    }
    this.showicon = true;
  }

  // getparametervalue 
  getparametervalue() {
    this.permissionService.getparams(this.type).subscribe((result) => {
      if (result.length != 0) {
        this.gettageAndparameter(result)
      }
    });
  }


  gettageAndparameter(result:any) {
    if (result?.defaultParameters?.length != 0) {
      this.permisiondata = [];
      result?.defaultParameters?.forEach((elament:any) => {
        this.permisiondata.push({
          name: elament,
          tage: false,
        })
      })
    }
    if (result?.tagParameters?.length != 0) {
      result?.tagParameters?.forEach((elament:any) => {
        this.permisiondata.push({
          name: elament,
          tage: true,
        })
      })
    }
    setTimeout(() => {
      if (this.permisiondata.length != 0) {
        this.permission.get('parameters')?.setValue(this.permisiondata)
      }
    },);
  }
  gettageAndparameterUdate(result:any) {
    console.log(result)
    if (result?.defaultParameters?.length != 0) {
      this.permisiononly = []
      result?.defaultParameters.forEach((elament:any) => {
        this.permisiononly.push({
          name: elament,
          tage: false,
        })
      })
    }
    if (result?.tagParameters?.length != 0) {
      result?.tagParameters.forEach((elament:any) => {
        this.permisiononly.push({
          name: elament,
          tage: true,
        })
      })
    }

    // setTimeout(() => {
    //   if (this.permisiononly.length!=0) {
    //     this.permission.get('parameters')?.setValue(this.permisiononly)
    //   }
    // });
  }


  // Single User 
  getlinkeduserid(id:any, event:any) {
    if (event == true) {
      this.AllLinks.map((element:any) => {
        if (element.id == id) {
          element.isChecked = true
          this.getuniqueUserList(element.id)
        }
      })
    } else {
      this.AllLinks.map((element:any) => {
        if (element.id == id) {
          element.isChecked = false
          this.removevalueofArray('Single', element.id)
        }
      })
    }
  }
  // Group User 
  getlinkedGroupsid(id:any, event:any) {
    if (event == true) {
      this.AllGroupsLinks.map((element:any) => {
        if (element.id == id) {
          element.isChecked = true
          this.getAllUsersListByGroupId(element.id);
        }
      })
      this.linkedGroupid.push(id);
    } else {
      this.AllGroupsLinks.map((element:any) => {
        if (element.id == id) {
          element.isChecked = false
          this.removevalueofArray('Group', element.id)
        }
      })

    }
  }
  // Get All Singles 
  SelactAllSingle(event:any) {
    if (event == true) {
      this.AllLinks.map((element:any) => {
        element.isChecked = true
        this.uniqueUserList.push(element.id);
      })
    } else {
      this.AllLinks.map((element:any) => {
        element.isChecked = false
        this.uniqueUserList.length = 0
        this.linkeduserid.length = 0
      })
    }
  }
  // Get All Single in Group 
  SelactAllgroups(event:any) {
    if (event == true) {
      this.AllGroupsLinks.map((element:any) => {
        element.isChecked = true
        this.getAllUsersListByGroupId(element.id)
      })
    } else {
      this.AllGroupsLinks.map((element:any) => {
        element.isChecked = false
        this.uniqueUserList.length = 0
        this.linkeduserid.length = 0
      })
    }
  }

  searchclose() {
    if (this.type == 'Users') {
      this.showicon = false;
      this.SearchValue = null;
      this.getalluser();
    } else if (this.type == 'Contacts') {
      this.showicon = false;
      this.SearchValue = null;
      this.getallcontact();
    } else if (this.type == 'Sites') {
      this.showicon = false;
      this.SearchValue = null;
      this.getallsites();
    } else if (this.type == 'Products') {
      this.showicon = false;
      this.SearchValue = null;
      this.getallproduct();
    } else if (this.data.type == 'Transactions') {
      this.showicon = false;
      this.SearchValue = null;
      this.getallTransactions();

    }
  }
  // ===========1111111111111============ 
  getalluserdata() {
    this.permissionService.findAllUsers().subscribe((res) => {
      console.log(res)
      this.getAllSingle = [];
      res.forEach((element:any) => {
        this.getAllSingle.push({
          id: element.id,
          firstName: element.firstName,
          lastName: element.lastName,
          profilePicture: element.profilePicture,
          isChecked: false
        });
      });
      this.resultsplit = this.getAllSingle;
      this.length = this.resultsplit.length;
    });

  }

  // ====================2222222222222222 ========== 
  getallGroupdata() {
    this.manageUsersService.fetchUserGroupsService(100, 1).subscribe((res: any) => {
      console.log(res)
      this.getAllGroups = []
      res.forEach((element:any) => {
        this.getAllGroups.push({
          id: element.id,
          firstname: element.userGroupName,
          dynamicGroupId: element.dynamicGroupId,
          isChecked: false
        })
      })
    })
  }







  // -2222222222222222033333333333333347777777777777777777 
  // user&userGroup 
  getalluser() {
    this.permissionService.findAllUsers().subscribe((res) => {
      console.log(res)
      this.AllLinks = [];
      res.forEach((element:any) => {
        this.AllLinks.push({
          id: element.id,
          firstName: element.firstName,
          lastName: element.lastName,
          profilePicture: element.profilePicture,
          isChecked: false
        });
      });
    });
    // get all User Group 
    this.manageUsersService.fetchUserGroupsService(100, 1).subscribe((res: any) => {
      console.log(res)
      this.AllGroupsLinks = []
      res.forEach((element:any) => {
        this.AllGroupsLinks.push({
          id: element.id,
          firstname: element.userGroupName,
          dynamicGroupId: element.dynamicGroupId,
          isChecked: false
        })
      })
    })
    setTimeout(() => {
      if (this.data.screenType == 'CreatePermission') {
      } else {

        this.getUserPermission()
      }
    }, 1000);
  }
  getallcontact() {
    this.permissionService.findAllContacts().subscribe((res) => {
      console.log(res)
      this.AllLinks = [];
      res.forEach((element:any) => {
        this.AllLinks.push({
          id: element.id,
          firstName: element.firstName,
          lastName: element.lastName,
          profilePicture: element.profilePicture,
          isChecked: false
        });
      });
    });

    // get all contact Group 
    this.manageContactsService.fetchContactGroupsService(100, 1, '').subscribe((res) => {
      console.log(res)
      this.AllGroupsLinks = []
      res.forEach((element:any) => {
        this.AllGroupsLinks.push({
          id: element.id,
          firstname: element.contactGroupName,
          dynamicGroupId: element.dynamicGroupId,
          isChecked: false
        })
      })
    })
    setTimeout(() => {
      if (this.data.screenType == 'CreatePermission') {
      } else {

        this.getUserPermission()
      }
    }, 1000);
  }

  getallsites() {
    this.permissionService.fetchSite().subscribe((res) => {
      console.log(res)
      this.AllLinks = [];
      res.forEach((element:any) => {
        this.AllLinks.push({
          id: element.id,
          firstname: element.companyName,
          isChecked: false
        });
      });

    });
    // get all siteGroup 
    this.manageSitesService.fetchSiteGroupsService(100, 1).subscribe((res) => {
      console.log(res)
      this.AllGroupsLinks = []
      res.forEach((element:any) => {
        this.AllGroupsLinks.push({
          id: element.id,
          firstname: element.siteGroupName,
          dynamicGroupId: element.dynamicGroupId,
          isChecked: false
        })
      })
    })
    setTimeout(() => {
      if (this.data.screenType == 'CreatePermission') {
      } else {
        this.getUserPermission()
      }
    }, 1000);
  }

  getallproduct() {
    this.permissionService.findAllProducts().subscribe((res) => {
      console.log(res)
      this.AllLinks = [];
      res.forEach((element:any) => {
        this.AllLinks.push({
          id: element.id,
          firstname: element.productName,
          isChecked: false
        });
      });
    });
    // get all product group 
    this.manageProductsService.fetchProductGroupsService(10, 1).subscribe((res) => {
      console.log(res)
      this.AllGroupsLinks = []
      res.forEach((element:any) => {
        this.AllGroupsLinks.push({
          id: element.id,
          firstname: element.productGroupName,
          dynamicGroupId: element.dynamicGroupId,
          isChecked: false
        })
      })
    })
    setTimeout(() => {
      if (this.data.screenType == 'CreatePermission') {
      } else {
        this.getUserPermission()
      }
    }, 1000);
  }



  getallTransactions() {
    this.ManageTransactionsService.fetchTransactionsServices(100, 1, '').subscribe((res: any) => {
      console.log(res)
      this.AllLinks = [];
      res.data.forEach((element:any) => {
        this.AllLinks.push({
          id: element.id,
          isChecked: false
        });
      });
    });
    setTimeout(() => {
      if (this.data.screenType == 'CreatePermission') {
      } else {
        this.getUserPermission()
      }
    }, 1000);
  }

  removevalueofArray(name:any, id:number) {
    this.linkeduserid.length = 0
    if (name == 'Single') {
      this.uniqueUserList = this.uniqueUserList.filter((value) => value !== id);
    } else if (name == 'Group') {
      if (this.type == 'Users') {
        this.manageUsersService.fetchUserGroupByIdService(id).subscribe((result: any) => {
          if (result.length != 0) {
            result.forEach((element:any) => {
              this.uniqueUserList = this.uniqueUserList.filter((value) => value !== id);
              this.AllLinks.map(All => {
                if (All.id === element.id) {
                  console.log(element.id)
                  console.log(All.id)
                  element.isChecked = false
                }
              })
            });
          }
        })
      } else if (this.type == 'Contacts') {
        this.manageContactsService.fetchContactGroupByIdService(id).subscribe((result: any) => {
          if (result.length != 0) {
            result.forEach((element:any) => {
              this.uniqueUserList = this.uniqueUserList.filter((value) => value !== id);
              this.AllLinks.map(All => {
                if (All.id == element.id) {
                  element.isChecked = false
                }
              })
            });
          }
        })
      } else if (this.type == 'Sites') {
        this.manageSitesService.fetchSiteGroupByIdService(id).subscribe((result: any) => {
          if (result.length != 0) {
            result.forEach((element:any) => {
              this.uniqueUserList = this.uniqueUserList.filter((value) => value !== id);
              this.AllLinks.map(All => {
                if (All.id == element.id) {
                  element.isChecked = false
                }
              })
            });
          }
        })
      } else if (this.type == 'Products') {
        this.manageProductsService.fetchProductGroupByIdService(id).subscribe((result: any) => {
          if (result.length != 0) {
            result.forEach((element:any) => {
              this.uniqueUserList = this.uniqueUserList.filter((value) => value !== id);
              this.AllLinks.map(All => {
                if (All.id == element.id) {
                  element.isChecked = false
                }
              })
            });
          }
        })
      }
    }
  }


  getAllUsersListByGroupId(id:any) {
    if (this.type == 'Users') {
      this.manageUsersService.fetchUserGroupByIdService(id).subscribe((result: any) => {
        if (result.length != 0) {
          result.forEach((element:any) => {
            this.getuniqueUserList(element.id)
            this.getlinkeduserid(element.id, true)
          });
        }
      })
    } else if (this.type == 'Contacts') {
      this.manageContactsService.fetchContactGroupByIdService(id).subscribe((result: any) => {
        if (result.length != 0) {
          result.forEach((element:any) => {
            this.getuniqueUserList(element.id)
            this.getlinkeduserid(element.id, true)
          });
        }
      })
    } else if (this.type == 'Sites') {
      this.manageSitesService.fetchSiteGroupByIdService(id).subscribe((result: any) => {
        if (result.length != 0) {
          result.forEach((element:any) => {
            this.getuniqueUserList(element.id)
            this.getlinkeduserid(element.id, true)
          });
        }
      })
    } else if (this.type == 'Products') {
      this.manageProductsService.fetchProductGroupByIdService(id).subscribe((result: any) => {
        if (result.length != 0) {
          result.forEach((element:any) => {
            this.getuniqueUserList(element.id)
            this.getlinkeduserid(element.id, true)
          });
        }
      })
    }
  }

  // createpermission 
  managegroupids() {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to Permissions',
        'Permissions'
      );
    } else {
    console.log(this.permission.value)
    this.permission.value.parameters.forEach((elament:any) => {
      if (elament.tage == true) {
        this.tagParameters.push(elament.name)
      } else {
        this.defaultParameters.push(elament.name)
      }
    })
    setTimeout(() => {
      if (this.data.screenType == 'CreatePermission') {
        this.createpermistionApiCall()
      } else {
        this.updatepermission()

      }
    });
  }
  }



  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

}
