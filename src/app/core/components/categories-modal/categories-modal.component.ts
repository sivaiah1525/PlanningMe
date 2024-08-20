import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { MessageService } from '../../services/message.service';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  catId: any;
}

export enum CategoryType {
  EditOrDelete = '0',
  Create = '1',
  Edit = '2',
  Delete = '3',
}

@Component({
  selector: 'pm-categories-modal',
  templateUrl: './categories-modal.component.html',
  styleUrls: ['./categories-modal.component.scss'],
})

export class CategoriesModalComponent implements OnInit {
  categoriesForm!: FormGroup;
  categoryOption:any;
  // categoryOption = CategoryType.EditOrDelete;
  categoryType = CategoryType;
  isChecked = false;

  public disabled = false;
  public touchUi = false;

  public color1: string = '#2889e9';

  categories:any;


  constructor(
    public matDialogRef: MatDialogRef<CategoriesModalComponent>,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private cpService: ColorPickerService,
    private calendarService: CalendarService,
    private messageService: MessageService,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    } 
   }


  ngOnInit() {
    this.categoriesForm = this.formBuilder.group({
      categoryId: ['', Validators.required],
      categoryName: ['', Validators.required],
      color: ['#2889e9', Validators.required],
    });
    this.viewdialog();

  }

  viewdialog() {
    this.calendarService.getCategory().subscribe((res) => {
      this.categories = res;
      console.log(this.categories);
    });
  }
  categoryChange(event: any) {
    this.categoryOption = event.value;
  }


  onFrequencyChanged(event: any) {
    this.isChecked = event.value;
  }



  public onEventLog(event: string, data: any): void {
    console.log(event, data);
    this.categoriesForm.get('color')?.setValue(data);
  }

  editCategory(editData:any) {
    console.log(editData);
    const dialogRef2 = this.dialog.open(DialogOverviewExampleDialog2, {
      width: '400px',
      data: { catId: editData }
    });
    dialogRef2.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.viewdialog();
    });
  }

  createCat() {
    const dialogRef3 = this.dialog.open(DialogOverviewExampleDialog3, {
      width: '400px',
    });

    dialogRef3.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.viewdialog();
    });
  }


  deletecategroy(data:any, type:any): void {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe(result => {
      if (result) {
        this.viewdialog();
      }
    });

  }
}



@Component({
  selector: 'dialog-overview-example-dialog2',
  templateUrl: 'dialog-overview-example-dialog2.html',
})
export class DialogOverviewExampleDialog2 implements OnInit {

  editForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog2>,
    private formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  public color1: string = '#2889e9';
  public color2: string = '#1e81b0';


  ngOnInit() {
    console.log(this.data);

    this.color1 = this.data.catId.color;
    this.color2 = this.data.catId.fontColor;
    this.editForm = this.formBuilder.group({
      id: ['', Validators.required],
      categoryName: ['', Validators.required],
      fontColor: ['', Validators.required],
      creatorId: ['', Validators.required],
      color: ['', Validators.required],
    });

    this.editForm.get('id')?.setValue(this.data.catId.id);
    this.editForm.get('categoryName')?.setValue(this.data.catId.categoryName);
    this.editForm.get('creatorId')?.setValue(this.data.catId.creatorId);
    this.editForm.get('color')?.setValue(this.color1);
    this.editForm.get('fontColor')?.setValue(this.color2);
  }

  onNoClick(): void {
    this.dialogRef.close(true);
  }

  public onEventLog(event: string, data: any): void {
    console.log(event, data);
    this.editForm.get('color')?.setValue(data);
  }
  public onEventLog1(event: string, data: any): void {
    console.log(event, data);
    this.editForm.get('fontColor')?.setValue(data);
  }

  updateCategory() {
    this.calendarService.updateCategory(this.editForm.value).subscribe((res:any) => {
      this.messageService.showMessage(res['response'][0].message);
      this.dialogRef.close(true);
    }, (error) => {
      window.alert(error['response'][0].message)
    });
  }

}


@Component({
  selector: 'dialog-overview-example-dialog3',
  templateUrl: 'dialog-overview-example-dialog3.html',
})
export class DialogOverviewExampleDialog3 {

  categoriesForm!: FormGroup;

  public color1: string = '#f9d797';
  public color2: string = '#1e81b0';


  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog3>, private formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.categoriesForm = this.formBuilder.group({
      categoryId: ['', Validators.required],
      creatorId: [''],
      categoryName: ['', Validators.required],
      color: ['', Validators.required],
      fontColor: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createcategory() {
    console.log(this.categoriesForm.value)
    this.calendarService.createCategory(this.categoriesForm.value).subscribe((res:any) => {
      this.messageService.showMessage(res['response'][0].message);
      this.dialogRef.close(true);
    }, (error) => {
      console.log(error)
      window.alert(error.error.response[0].message)
    });
  }

  public onEventLog(event: string, data: any): void {
    console.log(event, data);
    this.categoriesForm.get('categoryId')?.setValue(0);
    this.categoriesForm.get('color')?.setValue(data);
  }
  public onEventLog1(event: string, data: any): void {
    console.log(event, data);
    this.categoriesForm.get('categoryId')?.setValue(0);
    this.categoriesForm.get('fontColor')?.setValue(data);
  }

}
