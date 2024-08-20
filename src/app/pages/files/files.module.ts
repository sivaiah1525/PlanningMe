import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FilePageComponent } from './file-page/file-page.component';
import { AddFileNotesComponent } from './components/add-file-notes/add-file-notes.component';
import { AddFileComponent } from './components/add-file/add-file.component';
import { AddNotesComponent } from './components/add-notes/add-notes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FileService } from '../../core/services/file.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccessFileNotesComponent } from './components/access-file-notes/access-file-notes.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { SearchPopupComponent } from './components/search-popup/search-popup.component';
import { FilterPopupComponent } from './components/filter-popup/filter-popup.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { ViewNotesComponent } from './components/view-notes/view-notes.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { FileDownloadShareComponent } from './components/file-download-share/file-download-share.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FilesAndNotesShareLinkComponent } from './components/files-and-notes-share-link/files-and-notes-share-link.component';
import { CKEditorModule } from 'ckeditor4-angular';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FileAndNoteChooseShareOptionComponent } from './components/file-and-note-choose-share-option/file-and-note-choose-share-option.component';
import { ExportFileNoteComponent } from './components/export-file-note/export-file-note.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
 
const routes: Routes = [
  {
    path: '',
    component: FilePageComponent 
  }
];

@NgModule({
  declarations: [
    FilePageComponent,
    AddFileNotesComponent,
    AddFileComponent,
    AddNotesComponent,
    AccessFileNotesComponent,
    SearchPopupComponent,
    FilterPopupComponent,
    ViewNotesComponent,
    SafeHtmlPipe,
    FileDownloadShareComponent,
    FilesAndNotesShareLinkComponent,
    FileAndNoteChooseShareOptionComponent,
    ExportFileNoteComponent, 
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectFilterModule,
    RichTextEditorModule,
    MatAutocompleteModule,
    CKEditorModule,
    MatSlideToggleModule,
    
  ],
  entryComponents: [
    AddFileNotesComponent,
    AddFileComponent,
    AddNotesComponent,
    ViewNotesComponent
  ],

  providers: [FileService, FilePageComponent, AddFileComponent, AddNotesComponent,AddFileNotesComponent]
})
export class FilesModule { }
