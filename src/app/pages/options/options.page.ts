import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataStorageService } from '../../services/storage/data-storage.service';

@Component({
  selector: 'options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  optionsName = 'options';
  languages: string [];
  langChoice: string;
  options: any;
  constructor(
    private location: Location,
    private dataStorageService: DataStorageService,
    private router: Router) {
    this.langChoice = 'en';
  }

  /**
   * Get options from the native storage or create them if they don't exist.
   */
  ngOnInit() { 
    this.dataStorageService.getItemViaNativeStorage(this.optionsName).then((result) => {
      if (result) {
        this.options = result;
        this.languages = this.options['languages'];
        this.langChoice = this.options['language'];
      }
    });
  }

  changeLang(event: any) {
    this.langChoice = event;
    this.options['language'] = event;
    this.dataStorageService.setItem(this.optionsName,this.options);
    this.location.back();
  }

  goBack() {
    this.location.back();
  }

}
