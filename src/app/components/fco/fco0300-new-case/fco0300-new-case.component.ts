import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
declare var myExtObject: any;
import { CaseService, Case } from 'src/app/services/case.service.ts';

@Component({
  selector: 'app-fco0300-new-case,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fco0300-new-case.component.html',
  styleUrls: ['./fco0300-new-case.component.css']
})

export class Fco0300NewCaseComponent implements AfterViewInit, OnInit, OnDestroy {
  title = 'datatables';

  posts: any;
  search: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  delValue: any;
  sessData: any;
  userData: any;
  programName: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  myExtObject: any;

  getCaseType: any;
  getTitle: any;
  getRedTitle: any;
  getCaseCate: any;
  getCourt: any;
  getCaseCourtType: any;
  getCaseStatus: any;
  getCaseSpecial: any;
  getOldCourt: any;;

  getDocType: any;
  getDocTitle: any;
  getRealDocTitle: any;
  getReplyRunDocTitle: any;
  getRealSendDocData: any;
  getIssueType: any;
  getFast: any;
  getSecret: any;
  getLitTypeItem:any;

  noticeObject: any = [];
  dataHead:any;
  run_id:any;
  run_seq:any;
  mapCase:any;
  court_name:any;
  cType:any = '';//เก็บค่าการเปลีย่นประเภทคดี ว่ามาจากหน้าจอ หรือ โหลดใหม่
  aCaseType:any;
  hCaseType:any;

  asyncObservable: Observable<string>;
  currFieldset: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions2: DataTables.Settings = {};

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @Output() sendUpdateCase = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private caseService: CaseService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.mapCase = params['mapCase'];
      this.run_seq = params['run_seq'];
      this.court_name = params['court_name'];
      this.run_id = params['run_id'];
      if(this.run_id)
       this.searchCaseNo(3);
    });

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();
    this.setDefCase();

    // ======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name": "pcase_type",
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "userToken": this.userData.userToken
    });
    //console.log("fCaseType")
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getCaseType = getDataOptions;
      },
      (error) => { }
    )
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name": "pcourt",
      "field_id": "court_id",
      "field_name": "court_name",
      "field_name2": "court_running",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        this.getOldCourt = getDataOptions;
      },
      (error) => { }
    )
    //======================== pcase_cate ======================================
    var student = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "order_by" : "case_cate_id",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
      },
      (error) => { }
    )
    //======================== pcase_status ======================================
    var student = JSON.stringify({
      "table_name": "pcase_status",
      "field_id": "case_status_id",
      "field_name": "case_status",
      "order_by" : "order_no ASC, case_status_id ASC",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseStatus = getDataOptions;
      },
      (error) => { }
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fco0300"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          res => { // Success
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
            // console.log(getDataAuthen)
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

  setDefCase() {
    // ข้อมูลเลขคดี
    this.dataHead = [];
    this.dataHead.court_id = this.userData.courtId;
    this.dataHead.old_court_id = this.userData.courtId;
    this.dataHead.case_type = this.userData.defaultCaseType;
    // this.dataHead.title = this.userData.defaultTitle;
    // this.dataHead.red_title = this.userData.defaultRedTitle;
    this.dataHead.case_cate_id = this.userData.defaultCaseCate;
    this.dataHead.yy = myExtObject.curYear();
    
    this.dataHead.notice_type = '1';
    this.dataHead.lit_type_item = 2;
    this.dataHead.case_status = 1;
    this.dataHead.case_date = myExtObject.curDate();

    this.fCaseType();
  }

  async searchCaseNo(type: any): Promise<void> {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var objCase = [];
    if (type == 3) {
      objCase["type"] = 3;
      objCase["run_id"] = this.run_id;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      const cars = await this.caseService.searchCaseNo(objCase);
      // console.log(cars)
      if (cars) {
        if (cars['result'] == 1) {
          this.dataHead = JSON.parse(JSON.stringify(cars['data'][0]));
        } else {
          confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              //this.setDefHead();
            }
            subscription.unsubscribe();
          });
        }
      }
    }
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  directiveDate(date: any, obj: any) {
    this.dataHead[obj] = date;
  }

  changeCaseType(obj:any,type:any){
    // console.log(obj)
    this.cType = type;
    this.aCaseType=obj;
    if(obj==2){
      this.hCaseType='';
    }else{
      this.hCaseType=1;
    }
    if(type)
      this.fCaseTitle(obj);
  }

  fCaseType(){//โหลด pcase_type
    this.SpinnerService.show();//จะปิดอีกทีเมื่อโหลด ประเภทคดีเสร็จ
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseType")
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseType = getDataOptions;      
          this.fCaseTitle(this.dataHead.case_type);//โหลด ptitle
        },
        (error) => {}
      )
    });
    return promise;
  }

  fCaseTitle(val:any){
    // console.log(val);
    var student1 = JSON.stringify({
      "case_type" : val,
      "title_flag" : 1,
      "userToken" : this.userData.userToken
    });

    var student2 = JSON.stringify({
      "case_type" : val,
      "title_flag" : 2,
      "userToken" : this.userData.userToken
    });
      this.http.post('/'+this.userData.appName+'ApiCO/API/CORRESP/fco0300/getTitle', student1).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));

          if( getDataOptions.data.length>0){
              this.getTitle = getDataOptions.data;
              getDataOptions.data.forEach((ele, index, array) => {
                this.getTitle[index]["fieldIdValue"] = ele.title;
                this.getTitle[index]["fieldNameValue"] = ele.title;
              });
            
              if(this.cType){
                this.dataHead.title = this.getTitle[0].fieldNameValue;
                this.fCaseStat(val,this.getTitle[0].fieldNameValue);
                this.changeTitle(this.dataHead.title,val,''); 
              }else{
                if(this.dataHead.title){
                  this.fCaseStat(val,this.dataHead.title);
                }else{
                  this.dataHead.title = this.getTitle[0].fieldNameValue;
                  this.fCaseStat(val,this.getTitle[0].fieldNameValue);
                }
                this.changeTitle(this.dataHead.title,val,''); 
              }
            }

          // this.runCaseNo(this.dataHead.case_type);
        },
        (error) => {}
      )
      // console.log(this.getTitle);

     
      this.http.post('/'+this.userData.appName+'ApiCO/API/CORRESP/fco0300/getTitle', student2).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getRedTitle = getDataOptions.data;

          if(getDataOptions.data.length > 0){
            getDataOptions.data.forEach((ele, index, array) => {
              this.getRedTitle[index].fieldIdValue = ele.title;
              this.getRedTitle[index].fieldNameValue = ele.title;
            });
          // console.log(this.getRedTitle);

          //  if(this.cType)
            this.dataHead.red_title = this.getRedTitle[0].fieldNameValue;
          }
          
        },
        (error) => {}
      )

  }

  runCaseNo(case_type :any){
    var student = JSON.stringify({
      "title": this.dataHead.title,
      "yy": this.dataHead.yy,
      "case_type": case_type,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/runCaseNo', student).subscribe(
      (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        // console.log(productsJson)
        this.dataHead.id = productsJson.id+1;
        this.dataHead.run_case_no = productsJson.id;
      },
      (error) => { }
    )
  }

  changeTitle(obj:any,caseType:any,type:any){
    if(type){
      this.cType = type;
      this.fCaseStat(caseType,obj);
    }
    	if(obj=='ผบ'||obj=='ม'||obj=='ย'){
        var caseStat = this.getCaseStatus.filter((x:any) => x.fieldIdValue === 3) ;
        if(caseStat.length!=0){
          this.dataHead.case_status = caseStat[0].fieldIdValue;
        }
      }else{
        var caseStat = this.getCaseStatus.filter((x:any) => x.fieldIdValue === 1) ;
        if(caseStat.length!=0){
          this.dataHead.case_status = caseStat[0].fieldIdValue;
        }
      }
  }

  fCaseStat(caseType:any,title:any){
    var student = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "condition": " AND case_type='"+caseType+"'",
      "order_by":" case_cate_id ASC",
      "userToken" : this.userData.userToken
    });
    // console.log("fCaseStat :"+student)
    let promise = new Promise((resolve, reject) => {
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
        if(this.cType){
          this.fDefCaseStat(caseType,title);
        }else{
          if(this.dataHead.run_id){
            this.SpinnerService.hide();
            this.cType = '';
          }else{
            this.fDefCaseStat(caseType,title);
          }
        }
        
      },
      (error) => {}
    )
    });
    return promise;
  }

  fDefCaseStat(caseType:any,title:any){
    // console.log("caseType",caseType, "title", title);
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "case_cate_id",
      "field_name2": "title_desc",
      "condition": " AND title_flag='1' AND case_type='"+caseType+"' AND title='"+title+"' ",
      "order_by":" case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    let promise = new Promise((resolve, reject) => {
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        var caseCate = this.getCaseCate.filter((x:any) => x.fieldIdValue === getDataOptions[0].fieldNameValue) ;
        // console.log(getDataOptions);
        if(getDataOptions.length > 0)
          this.dataHead.title_desc_txt = "("+getDataOptions[0].fieldNameValue2+")";
        this.runCaseNo(caseType);
        if(caseCate.length!=0){
          this.dataHead.case_cate_id = caseCate[0].fieldIdValue;

          this.SpinnerService.hide();
        }
        this.cType = '';
      },
      (error) => {}
    )
    });
    return promise;
  }

  submitForm(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.dataHead.id){
      confirmBox.setMessage('กรุณาระบุหมายเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    }else if(!this.dataHead.yy){
      confirmBox.setMessage('กรุณาระบุปีหมายเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      var val =  this.getOldCourt.filter((x:any) => x.fieldIdValue === this.dataHead.old_court_id);
      if(this.dataHead.old_court_id)
        this.dataHead['old_court_running']  = val[0].fieldNameValue2;
      
      this.dataHead['userToken'] = this.userData.userToken;
      var data = $.extend({}, this.dataHead);
      // console.log(data);
      this.http.disableLoading().post('/'+this.userData.appName+'ApiCA/API/CASE/insertCaseData', data ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==0){
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
              });
            }else{
              this.SpinnerService.hide();
              confirmBox.setMessage('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.run_id = alertMessage.run_id;
                  this.saveDocMapCase(this.run_id);

                }
                subscription.unsubscribe();
              });
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  saveDocMapCase(runId:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(this.mapCase == 1 && runId && this.run_seq){
      var dataCase = JSON.stringify({
        "run_seq": this.run_seq,
        "run_id": runId,
        "edit_run_seq": this.run_seq,
        "edit_run_id": this.dataHead.edit_run_id ? this.dataHead.edit_run_id : 0,
        "userToken": this.userData.userToken
      });
      // console.log("student=>", dataCase)
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/saveDocMapCase', dataCase).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) { }
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();
            this.reloadCase(runId);
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  reloadCase(runId:any){
    // console.log("reloadCase", runId);
    if(runId){
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+"fco0300_new_case?run_seq=" + this.run_seq+"&run_id=" + runId;
      location.href = winURL;
      window.location.reload();
    }


    let winURL = window.location.href.split("/#/")[0] + "/#/";
    var url = "fco0300" + "?run_seq=" + this.run_seq
    window.opener.myExtObject.openerReloadUrl(url);
  }

  closeWindow() {
    if (window.close() == undefined) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบหน้าจอหลัก ไม่สามารถปิดหน้าจอได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    }
    else
      window.close();
  }

  searchLitigant(){
    if(this.run_id){
      let toPage = "fca0130";
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage + "?run_id=" + this.run_id;
      myExtObject.OpenWindowMaxName(winURL, toPage);
    }
  }

  clickOpenMyModalComponent(type: any) {
  }

  loadMyModalComponent() {

  }

  closeModal() {
  }
}