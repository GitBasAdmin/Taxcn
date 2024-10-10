import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,AfterContentInit,OnChanges,SimpleChanges   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { NgSelectComponent } from '@ng-select/ng-select';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { SharedRunIdService } from '@app/services/run-id.service.ts';
import {ActivatedRoute} from '@angular/router';
declare var myExtObject: any;
@Component({
  selector: 'app-guar-head',
  templateUrl: './guar-head.component.html',
  styleUrls: ['./guar-head.component.scss']
})


export class GuarHeadComponent implements AfterViewInit, OnInit, OnDestroy,AfterContentInit,OnChanges {

  //@ViewChild(TemplateRef, { static: true }) foo!: TemplateRef;
  sessData:any;
  userData:any;

  aCaseType:any;

  getTitle:any;
  getRedTitle:any;
  getPTitle:any;
  getCaseCate:any;
  getCourt:any;
  getCaseType:any;
  getCaseCourtType:any;
  getCaseStatus:any;
  getCaseSpecial:any;

  selCourt:any;
  selCaseCate:any;
  selCaseStatus:any;

  cType:any = '';//เก็บค่าการเปลีย่นประเภทคดี ว่ามาจากหน้าจอ หรือ โหลดใหม่
  runIdObj:any;
  modalType:any;

  hCaseType:any;
  dataHead:any;
  myExtObject:any;
  run_id:any;
  eventSearch = 0;
  program:any;
  //shareRunId:any;

  groupObj:any = [];
  postMapObj:any = [];
  prosObj:any = [];
  accuObj:any = [];
  reqObj:any = [];
  oppObj:any = [];
  mapCaseObj:any = [];
  items:any = [];

  public loadModalAlertComponent: boolean = false;

  @ViewChild('sCaseCate') sCaseCate : NgSelectComponent;
  @ViewChild('sRedTitle') sRedTitle : NgSelectComponent;
  @ViewChild('sCaseStatus') sCaseStatus : NgSelectComponent;
  @ViewChild('yy',{static: true}) yy : ElementRef;
  @ViewChild('id',{static: true}) id : ElementRef;
  @ViewChild('red_yy',{static: true}) red_yy : ElementRef;
  @ViewChild('red_id',{static: true}) red_id : ElementRef;
  @ViewChild('pyy',{static: true}) pyy : ElementRef;
  @ViewChild('pid',{static: true}) pid : ElementRef;
  @ViewChild('openbuttonalert') openbuttonalert : ElementRef;
  @ViewChild('closebuttonalert') closebuttonalert : ElementRef;

  @Output() sendCaseData = new EventEmitter<any>();
  @Input() set runId(runId: string) {

    //notSearch ไม่ต้องโหลด head ใหม่
    //sendCase โหลด head ใหม่แต่ไม่ต้องส่งกลับ
    if(typeof runId === 'object'){
      var obj = runId ?? {};
      this.runIdObj = runId;
      if(!obj['notSearch']){//ถ้าไม่มีการส่งค่ามา
        if(obj['run_id']==0){
          this.setDefHead();
        }else{
          this.run_id = obj['run_id'];
          if(this.run_id > 0){
            this.eventSearch = 1
            this.sessData=localStorage.getItem(this.authService.sessJson);
            this.userData = JSON.parse(this.sessData);
            this.searchCaseNo(4,this.run_id);
          }
        }
      }
    }else{
      this.run_id=runId;
      if(this.run_id>0){
        this.eventSearch = 1
        this.sessData=localStorage.getItem(this.authService.sessJson);
        this.userData = JSON.parse(this.sessData);
        this.searchCaseNo(4,this.run_id);
      }
    }
  }
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private SharedRunIdService: SharedRunIdService
  ){
    //this.config.bindValue = 'value';
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      this.program = params['program'];
    });
      this.selCourt=this.userData.courtName;
      this.dataHead = [];
      //============= set defalut data ==============//
      if(this.run_id && !this.eventSearch){
        this.searchCaseNo(4,this.run_id);
      }else{
        this.dataHead.court_id = this.userData.courtId;
        this.dataHead.case_type = this.userData.defaultCaseType;
        this.dataHead.title = this.userData.defaultTitle;
        this.dataHead.red_title = this.userData.defaultRedTitle;
        this.dataHead.ptitle = 'ผ';
        this.dataHead.case_cate_id = this.userData.defaultCaseCate;
        this.fCaseType();
      }
      //=============================================//
      //this.SharedRunIdService.shareRunId$
      //.subscribe(shareRunId => this.shareRunId = shareRunId);
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
        this.dataHead.case_court_type = this.getCaseCourtType[0].fieldNameValue;
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
        //console.log(getDataOptions)
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
        console.log(getDataOptions)
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

  ngAfterViewInit(): void {

  }
  ngAfterContentInit() : void{
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    //console.log(this.headFca0200.defaultCaseType)
  }

  ngOnChanges(changes: SimpleChanges): void{
    //console.log(changes.runId.currentValue)
  }

  setDefHead(){
    this.run_id = null;
    this.dataHead = [];
    this.dataHead.court_id = this.userData.courtId;
    this.dataHead.case_type = this.userData.defaultCaseType;
    this.dataHead.red_title = this.userData.defaultRedTitle;
    this.fCaseType();
    //this.fCaseTitle(this.userData.defaultCaseType);
    this.groupObj = [];
    this.postMapObj = [];
    this.prosObj = [];
    this.accuObj = [];
    this.reqObj = [];
    this.oppObj = [];
    this.mapCaseObj = [];
  }

  barcodeEnter(){
    this.dataHead.barcodeEnter = 1;
    this.dataHead.buttonSearch = null;
    this.sendCaseData.emit(this.dataHead);
  }

  changeCaseType(obj:any,type:any){
    console.log(obj)
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


  changeTitle(obj:any,caseType:any,type:any){
    if(type){
      this.cType = type;
      this.fCaseStat(caseType,obj);
    }
    	if(obj=='ผบ'||obj=='ม'||obj=='ย'){
        var caseStat = this.getCaseStatus.filter((x:any) => x.fieldIdValue === 3) ;
        if(caseStat.length!=0){
          this.dataHead.case_status = caseStat[0].fieldNameValue;
        }
      }else{
        var caseStat = this.getCaseStatus.filter((x:any) => x.fieldIdValue === 1) ;
        if(caseStat.length!=0){
          this.dataHead.case_status = caseStat[0].fieldNameValue;
        }
      }
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
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseType = getDataOptions;
          //if(!this.run_id){
            //this.changeCaseType(this.userData.defaultCaseType,'');
            this.fCaseTitle(this.dataHead.case_type);//โหลด ptitle
          //}
        },
        (error) => {}
      )
    });
    return promise;
  }

  fCaseTitle(val:any){
    //========================== ptitle ====================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='"+val+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='2' AND case_type='"+val+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    var student3 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND title_flag='1' AND special_case in (1,2)",
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
          //console.log(getDataOptions)
          this.getTitle = getDataOptions;
          //if(!this.run_id)
          this.fDefaultTitle(val);//กำหนดค่าตัวแรก
        },
        (error) => {}
      )

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getRedTitle = getDataOptions;

        },
        (error) => {}
      )

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student3 , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getPTitle = getDataOptions;

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

    //console.log("fDefaultTitle :"+student2)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        if(getDataOptions.length){
          //console.log(this.dataHead.title+":"+this.cType)

          if(this.cType){
            this.dataHead.title = getDataOptions[0].fieldIdValue;
            this.fCaseStat(caseType,getDataOptions[0].fieldIdValue);
            this.changeTitle(this.dataHead.title,caseType,'');
          }else{
            if(this.dataHead.title){
              this.fCaseStat(caseType,this.dataHead.title);
            }else{
              this.dataHead.title = getDataOptions[0].fieldIdValue;
              this.fCaseStat(caseType,getDataOptions[0].fieldIdValue);
            }
            this.changeTitle(this.dataHead.title,caseType,'');
          }

        }
      },
      (error) => {}
    )

    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        if(getDataOptions.length){
          //console.log(this.cType)
          if(this.cType)
            this.dataHead.red_title = getDataOptions[0].fieldIdValue;

        }
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
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
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
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        var caseCate = this.getCaseCate.filter((x:any) => x.fieldIdValue === getDataOptions[0].fieldNameValue) ;
        if(caseCate.length!=0){
          this.dataHead.case_cate_id = caseCate[0].fieldNameValue;
          this.SpinnerService.hide();
        }else{
          this.sCaseCate.handleClearClick();
        }
        this.cType = '';
      },
      (error) => {}
    )
    });
    return promise;
  }

  searchCaseNo(type:any,run_id:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var alert = 0;


    if(type==1){//เลขคดีดำ
      if(!this.dataHead.title){
        confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีดำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else if(!this.dataHead.id){
        confirmBox.setMessage('กรุณาระบุหมายเลขคดีดำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.id.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      }else if(!this.dataHead.yy){
        confirmBox.setMessage('กรุณาระบุปีเลขคดีดำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.yy.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      }else{
        var student = JSON.stringify({
          "case_type": this.dataHead.case_type,
          "title": this.dataHead.title,
          "id": this.id.nativeElement.value,
          "yy": this.yy.nativeElement.value,
          "allData" : 1,
          "court_id": this.dataHead.court_id,
          "userToken" : this.userData.userToken
        });
        var apiUrl = '/'+this.userData.appName+'ApiCA/API/CASE/dataFromTitle';
        console.log(student)
      }
    }else if(type==2){//เลขคดีแดง
      if(!this.dataHead.red_title){
        confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีแดง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else if(!this.dataHead.red_id){
        confirmBox.setMessage('กรุณาระบุหมายเลขคดีแดง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.red_id.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      }else if(!this.dataHead.red_yy){
        confirmBox.setMessage('กรุณาระบุปีเลขคดีแดง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.red_yy.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      }else{
        var student = JSON.stringify({
          "case_type": this.dataHead.case_type,
          "red_title": this.dataHead.red_title,
          "red_id": this.dataHead.red_id,
          "red_yy": this.dataHead.red_yy,
          "allData" : 1,
          "court_id": this.dataHead.court_id,
          "userToken" : this.userData.userToken
        });
        var apiUrl = '/'+this.userData.appName+'ApiCA/API/CASE/dataFromRedTitle';
        console.log(student)
      }
    }else if(type==3){//เลขฝากขัง
      if(!this.dataHead.ptitle){
        confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีฝากขัง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else if(!this.dataHead.pid){
        confirmBox.setMessage('กรุณาระบุหมายเลขคดีฝากขัง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.pid.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      }else if(!this.dataHead.pyy){
        confirmBox.setMessage('กรุณาระบุปีเลขคดีฝากขัง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.pyy.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      }else{
        var student = JSON.stringify({
          "case_type": this.dataHead.case_type,
          "title": this.dataHead.ptitle,
          "id": this.dataHead.pid,
          "yy": this.dataHead.pyy,
          "allData" : 1,
          "court_id": this.dataHead.court_id,
          "userToken" : this.userData.userToken
        });
        var apiUrl = '/'+this.userData.appName+'ApiCA/API/CASE/dataFromTitle';
        console.log(student)
      }
    }else{
      var student = JSON.stringify({
        "run_id": run_id,
        "allData" : 1,
        "userToken" : this.userData.userToken
      });
      var apiUrl = '/'+this.userData.appName+'ApiCA/API/CASE/dataFromRunId';
      console.log(student)
    }

    if(!alert){
      if(type!=4)
        this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
        this.http.post(apiUrl, student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.data[0]){
              this.dataHead = getDataOptions.data[0];
              console.log(this.dataHead);
              if(getDataOptions.data[0].groupObj)
                this.groupObj = getDataOptions.data[0].groupObj;
              if(getDataOptions.data[0].postMapObj)
                this.postMapObj = getDataOptions.data[0].postMapObj;
              if(getDataOptions.data[0].prosObj)
                this.prosObj = getDataOptions.data[0].prosObj;
              if(getDataOptions.data[0].accuObj)
                this.accuObj = getDataOptions.data[0].accuObj;
              if(getDataOptions.data[0].reqObj)
                this.reqObj = getDataOptions.data[0].reqObj;
              if(getDataOptions.data[0].oppObj)
                this.oppObj = getDataOptions.data[0].oppObj;
              if(getDataOptions.data[0].mapCaseObj)
                this.mapCaseObj = getDataOptions.data[0].mapCaseObj;
              if(type==1 || type==2 || type==3)
                this.dataHead.buttonSearch = 1;
              else
                this.dataHead.buttonSearch = null;
              //if(window.location.href.indexOf('fkb0100')==-1)
              this.run_id = this.dataHead.run_id;
              this.SharedRunIdService.setData(this.dataHead.run_id);
              this.fCaseType();//โหลด ความ ประเภทคดี คำนำหน้า
              this.dataHead.barcodeEnter = null;
              this.alertSearch();//เช็ค alert
              console.log(this.runIdObj)
              if(type==1 || type==2 || type==3){//ถ้าคลิกค้นจากหน้าจอ 1เลขดำ 2เลขแดง 3เลขฝากขัง
                //location.replace(window.location.href.split("/#/")[0]+"/#/fca0200");

                if(window.location.href.split("/#/")[1].indexOf('?')!=-1){
                  if(this.program)
                    location.replace(window.location.href.split("/#/")[0]+"/#/"+window.location.href.split("/#/")[1].split("?")[0]+"?program="+this.program);
                  else
                    location.replace(window.location.href.split("/#/")[0]+"/#/"+window.location.href.split("/#/")[1].split("?")[0]);
                }
                this.sendCaseData.emit(this.dataHead);
              }else{// 3จาก run_id
                if(typeof this.runIdObj == 'undefined'){
                  this.sendCaseData.emit(this.dataHead);
                }else{
                  if(this.runIdObj && typeof this.runIdObj.sendCase == 'undefined'){
                    this.sendCaseData.emit(this.dataHead);
                  }
                }
              }

            }
            //console.log(this.dataHead)
            if(getDataOptions.result==1){
              this.SpinnerService.hide();
            }else{
              //-----------------------------//
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){}
                  subscription.unsubscribe();
                });
              //-----------------------------//
              this.SpinnerService.hide();
            }

          },
          (error) => {}
        )
      });
    }
  }

  alertSearch(){
    if(this.dataHead.run_id){
      var student = JSON.stringify({
        "run_id" : this.run_id,
        "event" : "searchCase",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.disableLoading().post('/'+this.userData.appName+'Api/API/alert', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            //console.log(getDataOptions)
            if(getDataOptions.data.length){
              this.items = getDataOptions.data;
              this.clickOpenMyModalComponent(1);
              console.log(this.items)
            }
          },
          (error) => {}
        );
    }
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbuttonalert.nativeElement.click();
  }

  loadMyModalComponent(){
    if(this.modalType==1){
        $("#exampleModal-alert").find(".modal-content").css("width","650px");
        this.loadModalAlertComponent = true;
    }
  }

  closeModal(){
    this.loadModalAlertComponent = false;
  }

}
