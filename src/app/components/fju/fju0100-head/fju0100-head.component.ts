import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { NgSelectComponent } from '@ng-select/ng-select';
import { AuthService } from 'src/app/auth.service';
// import { Fca0200Component } from 'src/app/components/fca/fca0200/fca0200.component';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { CaseService,Case } from 'src/app/services/case.service.ts';
import {Observable,of, Subject  } from 'rxjs';
declare var myExtObject: any;
@Component({
  selector: 'app-fju0100-head',
  templateUrl: './fju0100-head.component.html',
  styleUrls: ['./fju0100-head.component.scss']
})

export class Fju0100HeadComponent implements AfterViewInit, OnInit, OnDestroy {

  //@ViewChild(TemplateRef, { static: true }) foo!: TemplateRef;
  sessData:any;
  userData:any;

  getTitle:any;
  getRedTitle:any;
  getCaseCate:any;
  getCourt:any;
  getCaseType:any;
  getCaseCourtType:any;
  getCaseStatus:any;
  getCaseSpecial:any;

  hResult:any = [];
  prosObj:any = [];
  accuObj:any = [];
  runIdObj:any;
  run_id:any;
  mChangCType:any;
  myExtObject: any;

  public caseObservable$: Observable<Case>;
  @ViewChild('sCaseCate') sCaseCate : NgSelectComponent;
  @ViewChild('sRedTitle') sRedTitle : NgSelectComponent;
  @ViewChild('sCaseStatus') sCaseStatus : NgSelectComponent;
  @Output() sendCaseData = new EventEmitter<any>();
  @Input() set callHead(callHead: string) {//รับค่าจาก fju0100
    console.log(callHead)
    var head = callHead;
    if(typeof callHead !='undefined'){
      if(head['event']==1){//กดปุ่มจัดเก็บ
        this.hResult.caseEvent = 2;//save ข้อมูล
        this.sendCaseData.emit($.extend({},this.hResult));//ส่งค่าไป fju0100
      }else{
        this.run_id = head['run_id'];
          if(this.run_id > 0){
            this.searchCaseNo(3);
          }else{
            this.setDefHead();
          }
      }
    }
  }
  @Input() set runId(runId: string) {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    if(typeof runId !='undefined'){
      if(typeof runId === 'object'){
        var obj:any = runId;
        this.runIdObj = runId;
        if(!obj['notSearch']){//ถ้าไม่มีการส่งค่ามา
          if(obj['run_id']==0){
          }else{
            this.run_id = obj['run_id'];
            if(this.run_id > 0){
              //this.eventSearch = 1
              this.searchCaseNo(3);
            }else{
              this.setDefHead();
            }
          }
        }
      }else{
        this.run_id=runId;
        if(this.run_id>0){
          //this.eventSearch = 1
          this.searchCaseNo(3);
        }else{
          this.setDefHead();
        }
      }
    }else{
      this.setDefHead();
    }
  }
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    // private fca0200Service : Fca0200Component,
    private caseService:CaseService,
  ){ 
    //this.config.bindValue = 'value';
  }

  ngOnInit(): void {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== pcourt_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt_type",
      "field_id" : "court_type_id",
      "field_name" : "court_type_name",
      "condition": "AND select_flag='1'",
      "order_by": " court_type_id ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCourtType = getDataOptions;
      },
      (error) => {}
    )
     
    
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        console.log(getDataOptions)
      },
      (error) => {}
    )

    //======================== pcase_status ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_status",
      "field_id" : "case_status_id",
      "field_name" : "case_status",
      "order_by" : "order_no ASC, case_status_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseStatus = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )

    //======================== pcase_special ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_special",
      "field_id" : "special_id",
      "field_name" : "special_case",
      "order_by" : "order_no ASC, special_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseSpecial = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )
    //==============================================================
  }

  setDefHead(){
    this.run_id = null;
    this.hResult = [];
    this.hResult.court_id = this.userData.courtId;
    this.hResult.case_type = this.userData.defaultCaseType;
    this.hResult.title = this.userData.defaultTitle;
    this.hResult.red_title = this.userData.defaultTitle;
    this.hResult.red_yy = myExtObject.curYear();
    if(!this.hResult.run_id)
      this.hResult.case_cate_id = this.userData.defaultCaseCate;
    
    this.prosObj = [];
    this.accuObj = [];
    this.fCaseType();
  }

  ngAfterViewInit(): void {
    
  }
    
  ngOnDestroy(): void {
    //console.log(this.headFca0200.defaultCaseType)
  }

  fCaseType(){
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseType")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseType = getDataOptions;
          if(this.hResult.run_id){//ถ้ามีเลขคดี
            this.changeCaseType(this.hResult.case_type,1);
          }else{//ไม่มีเลขคดี
            this.changeCaseType(this.userData.defaultCaseType,1);
          }
        },
        (error) => {}
      )
    });
    return promise;
  }

  changeCaseType(case_type:any,type:any){
    this.mChangCType = type;//2 เรียกจากหน้าจอ
    this.fCaseTitle(case_type);
  }

  fCaseTitle(case_type:any){
    //========================== ptitle ====================================    
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='"+case_type+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='2' AND case_type='"+case_type+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    //console.log("fCaseTitle")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.getTitle = getDataOptions;
          this.fDefaultTitle(case_type);
        },
        (error) => {}
      )

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.getRedTitle = getDataOptions;
        },
        (error) => {}
      )

    });
    return promise;
  }

  fDefaultTitle(caseType:any){
    //========================== ptitle ====================================    
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='"+caseType+"' AND default_value='1' AND title_flag='1'",
      "order_by":" title_id ASC",
      "userToken" : this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='"+caseType+"' AND default_value='1' AND title_flag='2'",
      "order_by":" title_id ASC",
      "userToken" : this.userData.userToken
    });

    console.log("fDefaultTitle :"+student2)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(this.mChangCType==2)
          this.hResult.title = getDataOptions[0].fieldNameValue;
        this.fCaseStat(caseType,getDataOptions[0].fieldIdValue);
        this.changeTitle(this.hResult.title,caseType,'');//เปลี่ยนชั้นพิจารณา
      },
      (error) => {}
    )

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        //if(this.mChangCType==2)
        if(!this.hResult.run_id)//ถ้าไม่มีเลขคดี
          this.hResult.red_title = getDataOptions[0].fieldNameValue;
      },
      (error) => {}
    )

    });
    return promise;
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
    //console.log("fCaseStat :"+student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
        if(!this.hResult.run_id)
          this.fDefCaseStat(caseType,title);
      },
      (error) => {}
    )
    });
    return promise;
  }

  fDefCaseStat(caseType:any,title:any){
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "case_cate_id",
      "condition": " AND title_flag='1' AND case_type='"+caseType+"' AND title='"+title+"'",
      "order_by":" case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    //console.log("fDefCaseStat :"+student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //this.selCaseCate = getDataOptions[0].fieldNameValue;
        //console.log(this.getCaseCate)
        if(getDataOptions.length){
          var sel = this.getCaseCate;
          for (var x = 0; x < sel.length; x++) {
            if(sel[x].fieldIdValue == getDataOptions[0].fieldNameValue){
              this.hResult.case_cate_id = sel[x].fieldNameValue;
            }
          }
        }else{
          this.sCaseCate.handleClearClick();
        }
      },
      (error) => {}
    )
    });
    return promise;
  }

  changeTitle(obj:any,caseType:any,type:any){
    //console.log(obj+":"+caseType+":"+type)
    if(type)
      this.fCaseStat(caseType,obj);
    	if(obj=='ผบ'||obj=='ม'||obj=='ย'){
			  //this.selCaseStatus=3;
        var sel = this.getCaseStatus;
        for (var x = 0; x < sel.length; x++) {
          if(sel[x].fieldIdValue == 3){
            this.hResult.case_status = sel[x].fieldNameValue;
          }
        }
      }else{
        var sel = this.getCaseStatus;
        for (var x = 0; x < sel.length; x++) {
          if(sel[x].fieldIdValue == 1){
            this.hResult.case_status = sel[x].fieldNameValue;
          }
        }
      }
  }


  async searchCaseNo(type:any): Promise<void> {
    //type:any,all_data:any,run_id:any,case_type:any,title:any,id:any,yy:any
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var objCase = [];
    if(type==1){
      objCase["type"] = 1;
      objCase["case_type"] = this.hResult.case_type;
      objCase["all_data"] = 1;
      objCase["getJudgement"] = 1;
      objCase["run_id"] = 0;
      objCase["title"] = this.hResult.title;
      objCase["id"]= this.hResult.id;
      objCase["yy"]= this.hResult.yy;
      const cars = await this.caseService.searchCaseNo(objCase);
      console.log(cars)
      if(cars['result']==1){
        this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
        if(!this.hResult.red_title)
          this.hResult.red_title = this.userData.defaultRedTitle;
        if(!this.hResult.red_yy)
          this.hResult.red_yy = myExtObject.curYear();

        this.fCaseType();
        this.hResult.buttonSearch = 1;
        this.hResult.caseEvent = 1;//ค้นข้อมูล
        this.sendCaseData.emit(this.hResult);
      }else{
        confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.setDefHead();
          }
          subscription.unsubscribe();
        });
      }
    }else if(type==2){
      objCase["type"] = 2;
      objCase["case_type"] = this.hResult.case_type;
      objCase["all_data"] = 1;
      objCase["getJudgement"] = 1;
      objCase["run_id"] = 0;
      objCase["title"] = this.hResult.red_title;
      objCase["id"]= this.hResult.red_id;
      objCase["yy"]= this.hResult.red_yy;
      const cars = await this.caseService.searchCaseNo(objCase);
      console.log(cars)
      if(cars['result']==1){
        this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
        if(!this.hResult.red_title)
          this.hResult.red_title = this.userData.defaultRedTitle;
        if(!this.hResult.red_yy)
          this.hResult.red_yy = myExtObject.curYear();
        /*
        if(this.hResult.red_title){
          this.hResult.red_title = this.hResult.red_title;
          this.hResult.red_id = this.hResult.red_id;
          this.hResult.red_yy = this.hResult.red_yy;
        }*/
        this.fCaseType();
        this.hResult.buttonSearch = 1;
        this.hResult.caseEvent = 1;//ค้นข้อมูล
        this.sendCaseData.emit(this.hResult);
      }else{
        confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.setDefHead();
          }
          subscription.unsubscribe();
        });
      }
    }else if(type==3){
      objCase["type"] = 3;
      objCase["run_id"] = this.run_id;
      objCase["all_data"] = 1;
      objCase["getJudgement"] = 1;
      const cars = await this.caseService.searchCaseNo(objCase);
      console.log(cars)
      if(cars['result']==1){
        this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
        if(!this.hResult.red_title)
          this.hResult.red_title = this.userData.defaultRedTitle;
        if(!this.hResult.red_yy)
          this.hResult.red_yy = myExtObject.curYear();
        this.fCaseType();
        this.hResult.buttonSearch = null;
        this.hResult.caseEvent = 1;//ค้นข้อมูล
        this.sendCaseData.emit(this.hResult);
      }else{
        confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.setDefHead();
          }
          subscription.unsubscribe();
        });
      }
    }
  }

  runRedNo(){
    if(this.hResult.red_title && this.hResult.red_yy && !this.hResult.red_id && this.hResult.run_id){
      var student = JSON.stringify({
        "case_type": this.hResult.case_type,
        "red_title": this.hResult.red_title,
        "red_yy": this.hResult.red_yy,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/runRedNo', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(getDataOptions.result==1){
            
            this.hResult.red_id = getDataOptions.red_id;
          }
        },
        (error) => {}
      )
      });
      return promise;
    }
  }

}
