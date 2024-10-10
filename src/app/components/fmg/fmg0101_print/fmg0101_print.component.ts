import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import {ActivatedRoute} from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fmg0101_print,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg0101_print.component.html',
  styleUrls: ['./fmg0101_print.component.css']
})


export class Fmg0101PrintComponent implements  OnInit {
  //form: FormGroup;
  myExtObject: any;
  tableApiData:any;
  sessData:any;
  userData:any;
  month:any;
  year:any;
  assign_type:any;
  day_flag:any;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ){ }
   
  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      this.month = params['month'];
      this.year = params['year'];
      this.assign_type = params['assign_type'];
      this.day_flag = params['day_flag'];
    });
      //this.successHttp();
      //this.setDefPage();
      this.getAppointTable();
  }

  getAppointTable(){
    var student = JSON.stringify({
      "month" : this.month,
      "year" : this.year,
      "assign_type" : this.assign_type,
      "day_flag" : this.day_flag,
      "userToken" : this.userData.userToken
    });
    this.SpinnerService.show();
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg0101/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.SpinnerService.hide();
        if(getDataOptions.result==1){
          this.tableApiData = getDataOptions.data;
          setTimeout(() => {
            window.print();
          }, 500);
        }
      },
      (error) => {}
    )
  }

  

}







