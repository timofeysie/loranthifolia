import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataStorageService } from '../../services/storage/data-storage.service';
import { CONSTANTS } from '../../constants';

@Component({
  selector: 'options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  version: string;
  optionsName = 'options';
  languages: string [];
  langChoice: string;
  options: any;
  customPopoverOptions: any
  
  constructor(
    private location: Location,
    private dataStorageService: DataStorageService,
    private router: Router) {
      this.version = CONSTANTS.VERSION;
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
    this.customPopoverOptions = {
      header: 'Available languages',
      subHeader: 'Select',
      message: 'This will change the list language'
    };
  }

  refreshList() {
    console.log('refreshList');
    this.dataStorageService.sharedAction = 'reset-list';
    this.location.back();
    
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
