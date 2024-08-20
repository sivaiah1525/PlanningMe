import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SynchronizationDataComponent } from 'src/app/core/components/synchronization-data/synchronization-data.component';

@Component({
  selector: 'app-export-file-note',
  templateUrl: './export-file-note.component.html',
  styleUrls: ['./export-file-note.component.scss']
})
export class ExportFileNoteComponent implements OnInit {
  userForm: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<ExportFileNoteComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) { 
    this.userForm = this.formBuilder.group({
      FileName: [''],
      DriveType: ['',[Validators.required]],
      accessToken:['']
    })
  }

  ngOnInit(): void {


  }


  onSubmit(){
    const viewDialog=this.dialog.open(SynchronizationDataComponent, {
      width: '100%',
      data: { ScreenType:'ExportDrive',ActionName:this.userForm.value.DriveType},
      autoFocus: false,
      disableClose: true,
    });
    viewDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.userForm.get('accessToken')?.setValue(result.accessToken)
        console.log(result)
        this.dialogRef.close(this.userForm.value)
      }
    });
  }

}
