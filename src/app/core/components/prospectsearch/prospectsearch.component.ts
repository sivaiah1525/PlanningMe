import { Component, OnInit } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../services/message.service';
import { MapfilterService } from '../mapfilter.service';
import { ProspectsearchService } from '../../services/prospectsearch.service';


interface FileFormat {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-prospectsearch',
  templateUrl: './prospectsearch.component.html',
  styleUrls: ['./prospectsearch.component.scss']
})
export class ProspectsearchComponent implements OnInit {

  form!:FormGroup;
  effectif_Tranche!: [];
  codeNaf!: [];
  status!: [];
  funtion: any;
  department: any;
  region: any;
  constructor(private formBuilder: FormBuilder,
    private prospectService: ProspectsearchService,
    public MapfilterService: MapfilterService,
    private dialog: MatDialog,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'isConnectionActive': [true],
      'Siret': [''],
      'CodePostal': [''],
      'RaisonSociale': [''],
      'region': [''],
      'department': [''],
      'effectif_Tranche': [''],
      'codeNaf': [''],
      'status': [''],
      'StartDate': [''],
      'EndDate': [''],
      'funtion': [''],
      'FileName': [''],
      'Format': ['']
    });

    this.getRegion();
  }


  getRegion() {
    this.prospectService.findAllSearchPropect().subscribe((res: any) => {
      console.log(res, res.dropdownList.department);
      this.department = res.dropdownList.department;
      this.region = res.dropdownList.region;
      this.effectif_Tranche = res.dropdownList.effectif_Tranche;
      this.codeNaf = res.dropdownList.code_NAF;
      this.status = res.dropdownList.statut;
      this.funtion = res.dropdownList.fonction;
    });
  }


  getProspectConfiguration() {
    this.MapfilterService.getProspectConfiguration$.next(this.form.value);

    // getProspectConfiguration
    this.prospectService.getSearchConfiguraion(this.form.value).subscribe((res: any) => {
      if (res) {
        this.MapfilterService.prospectsearch$.next(res);
        this.dialog.closeAll();
        this.messageService.showMessage('onssendata data');
      }

    });
    // check limit  
    this.prospectService.checklimit(this.form.value).subscribe((res: any) => {
      this.MapfilterService.checklimit$.next(res);
    });
  }
}
