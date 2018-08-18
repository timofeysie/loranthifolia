import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  languages: string [];
  langChoice: string;

  constructor(private location: Location) {
    this.langChoice = 'en';
  }

  ngOnInit() { 
    this.languages = ['en','kr'];
  }

  changeLang(event: any) {
    this.langChoice = event;
  }

  goBack() {
    this.location.back();
  }

}
