import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'pm-graph-more',
  templateUrl: './graph-more.component.html',
  styleUrls: ['./graph-more.component.scss'],
})
export class GraphMoreComponent implements OnInit {
  @Output() save = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() view = new EventEmitter();
  @Input('id') id: any;
  constructor(
  private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }

   }

  ngOnInit() {
  }

  Save() {
    this.save.emit();
  }
  Edit() {
    this.edit.emit(this.id);
  }
  Delete() {
    const data = { id: this.id, type: 'deleteChart' }
    this.delete.emit(data);
  }

}
