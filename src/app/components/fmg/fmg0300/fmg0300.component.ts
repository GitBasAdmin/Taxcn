import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fmg0300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg0300.component.html',
  styleUrls: ['./fmg0300.component.css']
})


export class Fmg0300Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  
  getAppOther:any;selAppOther:any;
  getTime:any;
  getCaseType:any;selCaseType:any;
  getCaseCate:any;selCaseCate:any;
  getCaseStatus:any;
  getAppointTable:any;
  getRoom:any;selRoom:any;
  getJRoom:any;selJRoom:any;

  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  
  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild('sCaseCate') sCaseCate : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ){ }
   
  ngOnInit(): void {

    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
   //======================== pcase_type ======================================
   var student = JSON.stringify({
    "table_name" : "pcase_type",
    "field_id" : "case_type",
    "field_name" : "case_type_desc",
    "order_by": " case_type ASC",
    "userToken" : this.userData.userToken
  });
  //console.log(student)
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
      this.getCaseType = getDataOptions;
      this.selCaseType = this.getCaseType.find((x:any) => x.fieldIdValue === 0).fieldNameValue;  
      
    },
    (error) => {}
  )
  //======================== pcase_cate ======================================
  var student = JSON.stringify({
    "table_name" : "pcase_cate",
    "field_id" : "case_cate_id",
    "field_name" : "case_cate_name",
    "order_by" : "case_cate_id ASC",
    "userToken" : this.userData.userToken
  });

  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
      this.getCaseCate = getDataOptions;  
      this.selCaseCate = this.getCaseCate.find((x:any) => x.fieldIdValue === 0).fieldNameValue;  
    },
    (error) => {}
  )
  //======================== pcase_status ======================================
  var student = JSON.stringify({
    "table_name" : "pcase_status",
    "field_id" : "case_status_id",
    "field_name" : "case_status",
    "order_by" : "case_status_id ASC",
    "userToken" : this.userData.userToken
  });

  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getCaseStatus = getDataOptions;      
    },
    (error) => {}
  )

  //======================== pappoint_table ======================================
  var student = JSON.stringify({
    "table_name" : "pappoint_table",
    "field_id" : "table_id",
    "field_name" : "table_name",
     "userToken" : this.userData.userToken
  });
  console.log(student)
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getAppointTable = getDataOptions;
    },
    (error) => {}
  )
  //======================== plevel_room ======================================
  var student = JSON.stringify({
    "table_name" : "plevel_room",
    "field_id" : "level_room_id",
    "field_name" : "level_room_desc",
    "userToken" : this.userData.userToken
  });
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
      this.getRoom = getDataOptions;  
      this.selRoom = this.getRoom.find((x:any) => x.fieldIdValue === 0).fieldNameValue;  
    },
    (error) => {}
  )
  //======================== pjudge_room ======================================
  var student = JSON.stringify({
    "table_name" : "pjudge_room",
    "field_id" : "room_id",
    "field_name" : "room_desc",
    "userToken" : this.userData.userToken
  });

  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
      this.getJRoom = getDataOptions;  
      this.selJRoom = this.getJRoom.find((x:any) => x.fieldIdValue === 0).fieldNameValue;  
    },
    (error) => {}
  )

    this.getAppOther = [{fieldIdValue:0,fieldNameValue: 'ทั้งหมด'},{fieldIdValue:1,fieldNameValue: 'เทป'},{fieldIdValue:2,fieldNameValue: 'จดเอง'}];
    this.selAppOther = this.getAppOther.find((x:any) => x.fieldIdValue === 0).fieldNameValue
    this.getTime = [{fieldIdValue:1,fieldNameValue: 'เช้า'},{fieldIdValue:2,fieldNameValue: 'บ่าย'}];
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/
  changeCaseType(caseType:any){
    this.sCaseCate.clearModel();
    //======================== pcase_cate ======================================
    if(caseType>0){
      var student = JSON.stringify({
        "table_name" : "pcase_cate",
        "field_id" : "case_cate_id",
        "field_name" : "case_cate_name",
        "condition" : " AND case_type='"+caseType+"'",
        "order_by" : "case_cate_id ASC",
        "userToken" : this.userData.userToken
      });
    }else{
      var student = JSON.stringify({
        "table_name" : "pcase_cate",
        "field_id" : "case_cate_id",
        "field_name" : "case_cate_name",
        "order_by" : "case_cate_id ASC",
        "userToken" : this.userData.userToken
      });
    }

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
        this.getCaseCate = getDataOptions;
        this.selCaseCate = this.getCaseCate.find((x:any) => x.fieldIdValue === 0).fieldNameValue;  
      },
      (error) => {}
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fca0200"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
          this.defaultCaseType = getDataAuthen.defaultCaseType;
          this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
          this.defaultTitle = getDataAuthen.defaultTitle;
          this.defaultRedTitle = getDataAuthen.defaultRedTitle;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}
      
 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
     }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

 




}







