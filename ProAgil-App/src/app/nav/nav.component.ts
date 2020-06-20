import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input() flocal: any;
  toggled = false;
  constructor() { }

  ngOnInit() {
  }

  AlterarMenu() {
    this.toggled = !this.toggled;
  }
}
