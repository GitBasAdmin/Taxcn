import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent implements OnInit {
  windows:any;
  constructor() { }

  ngOnInit(): void {
    this.windows = window.location.hash.split('?')[0].split('/')[1];
    console.log(this.windows)
  }

}
