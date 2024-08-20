import { Component, Inject, OnInit } from '@angular/core';
import { CreatePriceMatrixComponent } from '../create-price-matrix/create-price-matrix.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';

@Component({
  selector: 'app-price-matrix',
  templateUrl: './price-matrix.component.html',
  styleUrls: ['./price-matrix.component.scss']
})
export class PriceMatrixComponent implements OnInit {
pricematrixlist:any=[]
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageProductsService: ManageProductsService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.getpricematricedetails(this.data.id)
  }




  getpricematricedetails(id:any){
    this.manageProductsService.FindProductMatrixConditionsByProductId(id).subscribe((result)=>{
      if(result){
        this.pricematrixlist=result
        console.log(result)
      }
    })

  }










  addpricematrix(screenType:any){
    const Createdynamickeywords=this.dialog.open(CreatePriceMatrixComponent, {
      width: '550px',
      data: { screenType:screenType,data:this.data },
      autoFocus: false,
      disableClose: true,
    });

    Createdynamickeywords.afterClosed().subscribe(result => {
      if (result) {
        // this.getAlldynamickeywords()
        console.log(result)
      }
    });
  }

}
