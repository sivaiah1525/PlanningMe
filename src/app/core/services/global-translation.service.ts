import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalTranslationService { 
  readonly languages = [
    { value: 'English', label: 'English', img: 'assets/language_Icons/English.svg' },
    { value: 'Français', label: 'Français', img: 'assets/language_Icons/French.svg' },
    { value: 'Spanish', label: 'Spanish', img: 'assets/language_Icons/Spanish.svg' },
    { value: 'Portuguese', label: 'Portuguese', img: 'assets/language_Icons/Portuguese.svg' },
    { value: 'German', label: 'German', img: 'assets/language_Icons/German.svg' },
    { value: 'Chinese', label: 'Chinese', img: 'assets/language_Icons/Chinese.svg' },
    // --------- 
    { value: 'Arabic', label: 'Arabic', img: 'assets/language_Icons/Arabic.svg' },
    { value: 'Japanese', label: 'Japanese', img: 'assets/language_Icons/Japanese.svg' },
    { value: 'Russian', label: 'Russian', img: 'assets/language_Icons/Russian.svg' },
    { value: 'Korean', label: 'Korean', img: 'assets/language_Icons/Korean.svg' },
    { value: 'Italian', label: 'Italian', img: 'assets/language_Icons/Italian.svg' },
  ];
  constructor(
    private translate: TranslateService
    ) {}

    getAlllanguages(){
      return this.languages
    }
    setselectedlanguage(){
  console.log(localStorage.getItem('lang'))
  if (localStorage.getItem('lang') == 'English') {
    return this.languages[0];
  }else if (localStorage.getItem('lang') == 'Spanish') {
    return this.languages[2];
  }else if (localStorage.getItem('lang') == 'Portuguese') {
    return this.languages[3];
  }else if (localStorage.getItem('lang') == 'German') {
    return this.languages[4];
  }else if (localStorage.getItem('lang') == 'Chinese') {
    return this.languages[5];
  }else if (localStorage.getItem('lang') == 'Arabic') {
    return this.languages[6];
  }else if (localStorage.getItem('lang') == 'Japanese') {
    return this.languages[7];
  }else if (localStorage.getItem('lang') == 'Russian') {
    return this.languages[8];
  }else if (localStorage.getItem('lang') == 'Korean') {
    return this.languages[9];
  }else if (localStorage.getItem('lang') == 'Italian') {
    return this.languages[10];
  }else if (localStorage.getItem('lang') == 'Français') {
    return this.languages[1];
  }else{
    return this.languages[0];
  }
}


  setLanguage(lang: string) {
    this.translate.use(lang);
  }

  get(key: string): string {
    return this.translate.instant(key);
  }
}
