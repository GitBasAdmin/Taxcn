import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
declare var myExtObject: any;
@Component({
  selector: 'app-alert-search',
  templateUrl: './alert-search.component.html',
  styleUrls: ['./alert-search.component.css']
})
export class AlertSearchComponent implements AfterViewInit,OnInit {
  @Input() alert : any = [];
  @Input() mail : any = [];
  @Output() onClickList = new EventEmitter<any>();
  myExtObject: any;
  sessData:any;
  userData:any;
  getMail:any= [];
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  onClickListData(index:any): void {
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = 'win_'+Math.ceil(Math.random()*1000);
    myExtObject.OpenWindowMaxName(winURL+'fkb0700?alert_running='+this.alert[index].alert_running,name);
  }
  onClickListData2(): void {
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = 'win_'+Math.ceil(Math.random()*1000);
    myExtObject.OpenWindowMaxName(winURL+'fkn0720',name);
  }

  

  

}
