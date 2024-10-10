import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Inject, Injectable,OnChanges,Input,ChangeDetectorRef,AfterContentInit   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

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
  selector: 'app-fca0200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fca0200.component.html',
  styleUrls: ['./fca0200.component.css'],
})


export class Fca0200Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  title = 'datatables';
  
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  caseCateId :any;
  caseCateName :any;
  caseCateFlag :any;
  caseType:any;
  courtFee:any;
  courtProvince:any;
  dataHead:any;
  dataUPdate:any;
  dataInsert:any = 0;
  dataChange:any = 0;
  dataReload:any = 0;
  callTab1:any=0;
  runId:any;
  loginCase:any;

  displaySectionB:boolean=false;
  displaySectionC:boolean=false;
 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ){
    //this.parentFormGroup.valueChanges.subscribe(console.log);
    
   }
   
  ngOnInit(): void {

    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id']){
        this.runId = params['run_id'];
      }
    });
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      

  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

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
          //console.log(getDataAuthen)
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
    this.dtTrigger.next('');
      });}
      
 ngAfterViewInit(): void {
    this.dtTrigger.next('');
    
    
    
  }
  ngAfterContentInit(): void{

  }
  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }


    receiveCaseCateId(event:any){
      //console.log(event)
      this.caseCateId = event;
    }

    receiveCaseCateName(event:any){
      //console.log(event)
      this.caseCateName = event;
    }
    receiveCaseCateFlag(event:any){
      //console.log(event)
      this.caseCateFlag = event;
    }
    fnDataHead(event:any){
      //console.log(event)
      this.dataHead = event;
      if((this.runId && this.runId != this.dataHead.run_id) || typeof this.runId =='undefined')
        this.runId = this.dataHead.run_id;
    }
    dfCourtFee(event:any){
      this.courtFee = event;
    }
    courtProv(event:any){
      this.courtProvince = event;
    }



    receiveCaseType(event:any){
      //console.log(event)
      this.caseType = event;
    }

    closeModal(){
      $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
      this.loadComponent = false;
    }

    loadMyChildComponent(){
      this.loadComponent = true;
    }

    receiveObjData(objData:any){//update รับจาก main
      console.log(objData)
      this.dataUPdate = objData;
    }
    callDataTab1(objData:any){//insert วิ่งไปเรียก main
      console.log(objData)
      this.callTab1 = objData;
    }
    receiveObjData2(objData:any){//insert รับจาก main
      console.log(objData)
      this.dataInsert = objData;
    }
    receiveObjData3(objData:any){//รับค่า deposit
      console.log(objData)
      this.dataChange = objData;
    }
    receiveObjData4(objData:any){//รับค่า obj run_id เพื่อ
      console.log(objData)
      this.dataReload = objData;
    }
    logInChgCase(jsonData:any){
      this.loginCase = jsonData;
    }




}







