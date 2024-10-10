import { Component, OnInit,Input,Output,EventEmitter,ViewChild,AfterViewInit,AfterContentInit,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import * as $ from 'jquery';
@Component({
  selector: 'app-case-copy-alle',
  templateUrl: './case-copy-alle.component.html',
  styleUrls: ['./case-copy-alle.component.css']
})
export class CaseCopyAlleComponent implements AfterViewInit,OnInit,AfterContentInit {
  sessData:any;
  userData:any;
  result:any = [];
  getCaseType:any=[];
  getCaseCateGroup:any =[];

  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  @ViewChild('sCaseTitle') sCaseTitle : NgSelectComponent;
  
  formList: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
      //======================== pcase_type ======================================
      var student = JSON.stringify({
        "table_name" : "pcase_type",
        "field_id" : "case_type",
        "field_name" : "case_type_desc",
        "order_by": " case_type ASC",
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseType = getDataOptions;
        },
        (error) => {}
      )
      //======================== pcase_cate_group ======================================
      var student = JSON.stringify({
        "table_name" : "pcase_cate_group",
        "field_id" : "case_cate_group",
        "field_name" : "case_cate_group_name",
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseCateGroup = getDataOptions;
          this.setDefPage();
        },
        (error) => {}
      )
    
  }

  setDefPage(){
    this.result.case_type1 = this.result.case_type2 = 1;
    this.result.case_cate_group1 = this.result.case_cate_group2 = this.getCaseCateGroup[0].fieldIdValue;
  }

  ngAfterViewInit(): void {
    
  }
  ngAfterContentInit() : void{
    
  }
  ngOnDestroy(): void {
   
  }



}
