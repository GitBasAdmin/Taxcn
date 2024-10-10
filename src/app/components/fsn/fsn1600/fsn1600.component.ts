import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
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
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { ModalNoticeLitigantComponent } from '../../modal/modal-notice-litigant/modal-notice-litigant.component';
import {ActivatedRoute}from '@angular/router'

@Component({
  selector: 'app-fsn1600,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fsn1600.component.html',
  styleUrls: ['./fsn1600.component.css']
})


export class Fsn1600Component implements AfterViewInit, OnInit, OnDestroy {
  getLitType:any;selLitType:any;selLitType2:any;
  getProv:any;selProv:any;
  getAmphur:any;selAmphur:any;
  getTambon:any;selTambon:any;postCode:any;
  getSendById:any;selSendById:any;
  getCourt:any;selCourt:any;
  getNoMoney:any;selNoMoney:any;
  getInOut:any;selInOut:any;
  getSendBy:any;selSendBy:any;
  getNation:any;selNation:any;

  result:any = [];
  result2:any = [];
  dataHead:any = [];
  dataNotice:any = [];
  dataNoticeCurdate:any = [];
  showNotSendNOticeData:any = [];
  noticeDataResult:any = [];//หมายบนหน้าจอ
  noticeDataResult2:any = [];//จ่ายหมายบนหน้าจอ
  comeEditNoticeSend:any = [];//เก็บค่าว่ามาจากการคลิกแก้ไขการจ่ายหมาย
  modalType:any;
  myExtObject: any;
  runId:any;
  noticeToType:any;
  
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
 
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public NoticeRunning:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalComponent: boolean = false;
	public loadModalConfComponent: boolean = false;
	public loadModalLitComponent: boolean = false;
	public loadModalOrgComponent: boolean = false;
	public loadModalAppComponent: boolean = false;
  public loadModalReceiptComponent: boolean = false;
  public loadModalNoticeReceiptComponent : boolean = false;
					
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  @ViewChild( ModalNoticeLitigantComponent ) child2: ModalNoticeLitigantComponent ; 
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('nBarCode',{static: true}) nBarCode : ElementRef;
  @ViewChild('sProv') sProv : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute : ActivatedRoute,
  ){ }
   
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy : true
    };
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy : true
    };
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: ''});
        this.getLitType = getDataOptions;
        this.selLitType = this.getLitType.find((o:any) => o.fieldIdValue === 1).fieldNameValue;
        this.selLitType2 = this.getLitType.find((o:any) => o.fieldIdValue === 2).fieldNameValue;
      },
      (error) => {}
    )
    //======================== pprovince ======================================
    var student = JSON.stringify({
      "table_name" : "pprovince",
      "field_id" : "prov_id",
      "field_name" : "prov_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getProv = getDataOptions;
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
        //this.selCourt = this.getCourt.find((x : any ) => x.fieldIdValue === this.userData.courtId).fieldNameValue;
        //console.log(getDataOptions)
      },
      (error) => {}
    )
    //======================== pnotice_send_type ======================================
    var student = JSON.stringify({
      "table_name" : "pnotice_send_type",
      "field_id" : "send_by_id",
      "field_name" : "send_by_name",
      "order_by" : "send_by_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getSendById = getDataOptions;
        //this.selSendById= this.getSendById.find((x:any) => x.fieldIdValue === 2).fieldNameValue
      },
      (error) => {}
    )
    //======================== pnation ======================================
    var student = JSON.stringify({
      "table_name" : "pnation",
      "field_id" : "nation_id",
      "field_name" : "nation_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getNation = getDataOptions;
      },
      (error) => {}
    )

    this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id']){
        this.runId = params['run_id'];
        this.dataHead.run_id = params['run_id'];
      }
      if(params['notice_running']){
        this.NoticeRunning =  params['notice_running'];
         this.result.notice_running
        console.log(this.NoticeRunning);
        this.searchNotice(1);

      }
    });
  
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.setDefPage1();
      this.setDefPage2();
      this.getNoticeDataCurDate(0);
  }

  setDefPage1(){
    this.result = this.noticeDataResult = [];
    this.getNoticeNo(this.userData.courtId);
    this.result.nation_id = 1;
    this.result.lead_notice = 1;
    this.result.lit_type = 2;
    this.result.nbarcode = '';
    this.nBarCode.nativeElement.focus();
  }

  setDefPage2(){
    this.result2 = this.noticeDataResult2 = [];
    this.result2.notice_send_by = 2;
    this.result2.devoid_flag = 0;
    //this.result2.send_date = myExtObject.curDate();
    this.getBookAccount();
  }

  sendToSummon(){
    if(this.result.notice_running){
      var student = JSON.stringify({
        "notice_running" : this.result.notice_running,
        "userToken" : this.userData.userToken
      });   
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/sendToSummon', student ).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error + ' ได้รหัส '+productsJson.gennumber+'/'+productsJson.gennumber_year+ ' ในระบบ SUMMON');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.searchNotice(1);
                this.loadNotSendNOticeData();
              }
              subscription.unsubscribe();
            });

          }else{            
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
              }
              subscription.unsubscribe();
            });
          }
         },
         (error) => {}
       )
    }else{
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('คุณยังไม่ได้เลือกหมาย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
  }

  cancelPage(){
    this.setDefPage1();
    this.setDefPage2();
    this.runId = {'run_id' : 0,'counter' : Math.ceil(Math.random()*10000)}
    this.dataNotice = [];
    this.getNoticeDataCurDate(0);
  }

  getBookAccount(){
    if(this.result.to_court_id){
      var student = JSON.stringify({
        "court_id" : this.result.to_court_id,
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/getBookAccount', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.data.length){
            //this.result2.send_date = myExtObject.curDate();
            this.result2.book_account = productsJson.data[0].book_account;
            this.result2.bank_id = productsJson.data[0].bank_id;
            this.result2.bank_name = productsJson.data[0].bank_name;
          }else{
            /*
            this.result2.send_date = myExtObject.curDate();
            this.result2.book_account = productsJson.data[0].book_account;
            this.result2.bank_id = productsJson.data[0].bank_id;
            this.result2.bank_id = productsJson.data[0].bank_name;
            */
          }
         },
         (error) => {}
       )
    }
  }

  fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.result = [];
      //this.runId = this.dataHead.run_id;
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      this.setDefPage1();
      this.setDefPage2();
      this.getNoticeNo(this.dataHead.court_id);
      this.getNoticeDataCurDate(0);//ข้อมูลจ่ายหมายของวันนี้
      this.loadNotSendNOticeData();
    }else{
      this.getNoticeDataCurDate(0);//ข้อมูลจ่ายหมายของวันนี้
    }
    this.getNoticeData(0);
  }

  getNoticeNo(courrId:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(courrId && !this.result.run_id){
      var student = JSON.stringify({
        "table_name" : "pcourt",
         "field_id" : "std_id",
         "field_name" : "court_name",
        "condition" : " AND court_id='"+courrId+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.notice_court_running = productsJson[0].fieldIdValue;
            this.result.notice_yy = myExtObject.curYear();
          }else{
            this.result.notice_court_running = '';
            this.result.notice_yy = '';
          }
         },
         (error) => {}
       )
    }
  }

  searchNotice(type:any){
    if(type==2){
      if(!this.result.notice_court_running || !this.result.notice_no || !this.result.notice_yy){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาระบุรหัสหมายให้ครบถ้วน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.SpinnerService.hide();
          }
          subscription.unsubscribe();
        });
      }else{
        var student = JSON.stringify({
          "notice_court_running" : this.result.notice_court_running,
          "notice_no" : this.result.notice_no,
          "notice_yy" : this.result.notice_yy,
          "notice_type_id" : this.result.notice_type_id,
          "userToken" : this.userData.userToken
        });
        this.searchNoticeApi(student);
        console.log(student)
      }
    }else if(type==1){
      var student = JSON.stringify({
        "notice_running" : this.result.notice_running,
        "userToken" : this.userData.userToken
      });
      if(this.result.notice_running)
        this.searchNoticeApi(student);
      console.log(student)
    }else if(type==3){
      var student = JSON.stringify({
        "barcode" : this.result.nbarcode,
        "userToken" : this.userData.userToken
      });
      //if(this.result.notice_running)
        this.searchNoticeApi(student);
        this.nBarCode.nativeElement.focus();
      console.log(student)
    }

  }

  searchNoticeApi(json:any){
    this.SpinnerService.show();
      
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/getNotice', json ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)

          if(productsJson.result==1){
            
              //======================================= ข้อมูลหมาย
              if(productsJson.data.length){
                this.result = productsJson.data[0];
                //ผลการส่งข้อมูลให้ SUMMON
                if(this.result.summon_gennumber && this.result.summon_gennumber_year)
                  this.result.summon_desc = this.result.summon_gennumber+'/'+this.result.summon_gennumber_year;

                var bar = new Promise((resolve, reject) => {
                  setTimeout(() => {
                    console.log($('body').find('.send_date'))
                    // this.setCalendar('send_date');
                    // this.setCalendar('receive_date');
                    // this.setCalendar('devoid_date');
                    this.setCalendarAll();
                  }, 500);
                });
                if(bar){
                  this.runId  = this.dataHead.run_id = productsJson.data[0].run_id;
                  //this.result.pprint_type = 1;
                  if(this.result.prov_id)
                    this.changeProv(this.result.prov_id,1);
                  if(this.result.amphur_id)
                    this.changeAmphur(this.result.amphur_id,1);
                  if(this.result.tambon_id)
                    this.changeTambon(this.result.tambon_id,1);
                  this.getNoticeData(0);
                  this.getNoticeDataCurDate(0);
                  this.loadNotSendNOticeData();
                  this.noticeDataResult = $.extend({},this.result);
                }
                //========================================= ข้อมูลการจ่ายหมาย
                console.log(this.comeEditNoticeSend)
                if(this.comeEditNoticeSend.length){
                  this.result2 = this.comeEditNoticeSend[0];
                  this.noticeDataResult2 = $.extend({},this.comeEditNoticeSend[0]);
                }else{
                  if(productsJson.send_data.length){
                    this.result2 = productsJson.send_data[0];
                    this.noticeDataResult2 = $.extend({},this.result2);
                  }
                }
                this.comeEditNoticeSend = [];// clear
              }
            

            //this.SpinnerService.hide();
          }else{
            
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.setDefPage1();
                this.setDefPage2();
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {}
      )
  }

  getNoticeData(type:any){

    if(this.result.notice_running){
      var student = JSON.stringify({
        "notice_running" : this.result.notice_running,
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/getSendNotice', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.data.length){
              this.dataNotice = productsJson.data;
              //this.dataNotice.forEach((x : any ) => x.nRunning = false);
              this.rerender();
              //this.SpinnerService.hide();
              //this.masterSelect = false;
            }else{
              this.dataNotice = [];
              this.rerender();
              //this.SpinnerService.hide();
              //this.masterSelect = false;
            }
          },
          (error) => {}
        )
    }else{
      this.dataNotice = [];
      this.rerender();
    }
    
  }

  getNoticeDataCurDate(type:any){

    //if(this.dataHead.run_id){
      var student = JSON.stringify({
        "get_send_notice" : 1,
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/getSendNotice', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.data.length){
              this.dataNoticeCurdate = productsJson.data;
              //this.dataNoticeCurdate.forEach((x : any ) => x.cRunning = false);
              this.rerender();
              this.SpinnerService.hide();
              //this.masterSelect = false;
            }else{
              this.dataNoticeCurdate = [];
              this.rerender();
              this.SpinnerService.hide();
              //this.masterSelect = false;
            }
          },
          (error) => {}
        )
   // }
    
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

  changeProv(province:any,type:any){
    if(type==2){
      this.sAmphur.clearModel();this.sTambon.clearModel();this.result.post_code='';
    }
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "condition" : " AND prov_id='"+province+"'",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAmphur = getDataOptions;
        console.log(this.getAmphur)
      },
      (error) => {}
    )
  }
  changeAmphur(Amphur:any,type:any){
    if(type==2){
      this.sTambon.clearModel();this.result.post_code='';
    }
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.result.prov_id+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTambon = getDataOptions;
      },
      (error) => {}
    )
  }
  changeTambon(Tambon:any,type:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "post_code",
      "condition" : " AND tambon_id='"+Tambon+"' AND amphur_id='"+this.result.amphur_id+"' AND prov_id='"+this.result.prov_id+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.length){
          this.result.post_code = getDataOptions[0].fieldNameValue;
        }else{
          this.result.post_code = '';
        }
        if(type==2)
          this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);
      },
      (error) => {}
    )
    
  }


  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTrigger.next(null);
}
      
ngAfterViewInit(): void {
  this.dtTrigger.next(null);
  myExtObject.callCalendar();
}
    
ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

setCalendar(obj:any){
  myExtObject.callCalendarSet(obj);
}

setCalendarAll(){
  myExtObject.callCalendar();
}
   

    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      if((type==2 || type==3 || type==4 || type==5) && !this.dataHead.run_id){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if((type==2 && !this.result.lead_notice) || (type==4 && !this.result.lit_type)){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        if(type==2)
          confirmBox.setMessage('กรุณาเลือกผู้นำหมาย');
        else
          confirmBox.setMessage('กรุณาเลือกหมายถึง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        if(this.modalType!=8)
          this.openbutton.nativeElement.click();
        else
          this.loadMyModalComponent();
      }
    }

    loadMyModalComponent(){
      $("#exampleModal").find(".modal-dialog").css({"left":"0px","top":"0px"});
      if(this.modalType==1){
        $("#exampleModal").find(".modal-content").css("width","650px");
        
        var student = JSON.stringify({
          "table_name" : "pnotice_type",
           "field_id" : "notice_type_id",
           "field_name" : "notice_type_name",
           "field_name2" : "notice_printleft",
           "search_id" : "",
           "search_desc" : "",
           "condition" : " AND notice_type_id NOT BETWEEN 8 AND 17",
           "userToken" : this.userData.userToken});
        this.listTable='pnotice_type';
        this.listFieldId='notice_type_id';
        this.listFieldName='notice_type_name';
        this.listFieldNull='';
        this.listFieldCond=" AND notice_type_id NOT BETWEEN 8 AND 17";
        $("#exampleModal").find(".modal-content").css('margin','0 auto !important');
      }else if(this.modalType==2 || this.modalType==3 ){
      
        $("#exampleModal").find(".modal-content").css("width","800px");
        if(this.modalType==2 ){
          this.listTable='3';
        }else{
          this.listTable='2';
        }
        this.noticeToType = 'lead_notice';
        this.loadModalComponent = false;  
        this.loadModalConfComponent = false;
        this.loadModalLitComponent = true;
        this.loadModalOrgComponent = false;
        this.loadModalAppComponent = false;
        this.loadModalReceiptComponent = false;
        this.loadModalNoticeReceiptComponent = false;
      }else if(this.modalType==4 || this.modalType==5 ){
      
        $("#exampleModal").find(".modal-content").css("width","800px");
        if(this.modalType==4 ){
          this.listTable='3';
        }else{
          this.listTable='2';
        }
        this.noticeToType = 'lit_type';
        this.loadModalComponent = false;  
        this.loadModalConfComponent = false;
        this.loadModalLitComponent = true;
        this.loadModalOrgComponent = false;
        this.loadModalAppComponent = false;
        this.loadModalReceiptComponent = false;
        this.loadModalNoticeReceiptComponent = false;
      }else if(this.modalType==6){
        $("#exampleModal").find(".modal-content").css("width","800px");
        this.loadModalComponent = false;  
        this.loadModalConfComponent = false;
        this.loadModalLitComponent = false;
        this.loadModalOrgComponent = true;
        this.loadModalAppComponent = false;
        this.loadModalReceiptComponent = false;
      }else if(this.modalType==7){
        $("#exampleModal").find(".modal-content").css("width","800px");
        this.loadModalComponent = false;  
        this.loadModalConfComponent = false;
        this.loadModalLitComponent = false;
        this.loadModalOrgComponent = false;
        this.loadModalAppComponent = true;
        this.loadModalReceiptComponent = false;
        this.loadModalNoticeReceiptComponent = false;
      }else if(this.modalType==8){//ใบเสร็จ
        //if(this.result.notice_running && !this.result2.notice_running){
          //this.saveData(2);
        //}else{
          this.openbutton.nativeElement.click();
          $("#exampleModal").find(".modal-content").css({"width":screen.width-100+'px',"margin":"100px auto !important"});
          this.loadModalComponent = false;  
          this.loadModalConfComponent = false;
          this.loadModalLitComponent = false;
          this.loadModalOrgComponent = false;
          this.loadModalAppComponent = false;
          this.loadModalReceiptComponent = true;
          this.loadModalNoticeReceiptComponent = false;
          myExtObject.openModalDraggable($("#exampleModal"));
        //}
      }else if(this.modalType==9){
        $("#exampleModal").find(".modal-content").css("width","780px");
        
        var student = JSON.stringify({
          "table_name" : "pbank",
           "field_id" : "bank_id",
           "field_name" : "bank_name",
           "search_id" : "",
           "search_desc" : "",
           "userToken" : this.userData.userToken});
        this.listTable='pbank';
        this.listFieldId='bank_id';
        this.listFieldName='bank_name';
        this.listFieldNull='';
        //$("#exampleModal").find(".modal-content").css('margin','0 auto !important');
      }else if(this.modalType==10 ){
        $("#exampleModal").find(".modal-content").css("width","650px");
        
        var student = JSON.stringify({
          "table_name" : "psentnotice_officer",
           "field_id" : "off_id",
           "field_name" : "off_name",
           "search_id" : "",
           "search_desc" : "",
           "condition" : " AND prov_id='"+this.result2.prov_id+"' AND amphur_id='"+this.result2.prov_id+"' AND tambon_id='"+this.result2.tambon_id+"'",
           "userToken" : this.userData.userToken});
        this.listTable='psentnotice_officer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
        this.listFieldNull='';
        this.listFieldCond=" AND prov_id='"+this.result2.prov_id+"' AND amphur_id='"+this.result2.prov_id+"' AND tambon_id='"+this.result2.tambon_id+"'";
        //$("#exampleModal").find(".modal-content").css('margin','0 auto !important');
      }else if(this.modalType==11 ){
        $("#exampleModal").find(".modal-content").css("width","650px");
        
        var student = JSON.stringify({
          "table_name" : "psentnotice_officer",
           "field_id" : "off_id",
           "field_name" : "off_name",
           "search_id" : "",
           "search_desc" : "",
           "userToken" : this.userData.userToken});
        this.listTable='psentnotice_officer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
        this.listFieldNull='';
        //$("#exampleModal").find(".modal-content").css('margin','0 auto !important');
      }else if(this.modalType==12 ){
        $("#exampleModal").find(".modal-content").css("width","1000px");
        this.loadModalComponent = false;  
        this.loadModalConfComponent = false;
        this.loadModalLitComponent = false;
        this.loadModalOrgComponent = false;
        this.loadModalAppComponent = false;
        this.loadModalReceiptComponent = false;
        this.loadModalNoticeReceiptComponent = true;
      }else if(this.modalType==100){
        $("#exampleModal").find(".modal-content").css("width","650px");
        this.loadModalComponent = false;  
        this.loadModalConfComponent = true;
        this.loadModalLitComponent = false;
        this.loadModalOrgComponent = false;
        this.loadModalAppComponent = false;
        this.loadModalReceiptComponent = false;
        this.loadModalNoticeReceiptComponent = false;
      }

      if(this.modalType==1 || this.modalType==9 || this.modalType==10 || this.modalType==11){
        this.loadModalComponent = true;  
        this.loadModalConfComponent = false;
        this.loadModalLitComponent = false;
        this.loadModalOrgComponent = false;
        this.loadModalAppComponent = false;
        this.loadModalReceiptComponent = false;
        this.loadModalNoticeReceiptComponent = false;
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
          },
          (error) => {}
        )
      }
    }

    
    closeModal(){
      this.loadModalComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalOrgComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalReceiptComponent = false;
      this.loadModalNoticeReceiptComponent = false;
      
    }


    submitModalForm(){
      var chkForm = JSON.parse(this.child.ChildTestCmp());
      
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
  
      if(!chkForm.password){
        confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            //this.SpinnerService.hide();
          }
          subscription.unsubscribe();
        });
        
      }else if(!chkForm.log_remark){
        confirmBox.setMessage('กรุณาป้อนเหตุผล');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            //this.SpinnerService.hide();
          }
          subscription.unsubscribe();
        });
      }else{
        
          var student = JSON.stringify({
            "user_running" : this.userData.userRunning,
            "password" : chkForm.password,
            "log_remark" : chkForm.log_remark,
            "userToken" : this.userData.userToken
          });
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type','application/json');
          this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student , {headers:headers}).subscribe(
            posts => {
              let productsJson : any = JSON.parse(JSON.stringify(posts));
              console.log(productsJson)
            if(productsJson.result==1){
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              // Choose layout color type
              confirmBox2.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    
                    this.SpinnerService.show();
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type','application/json');
                    
                    var delJson = JSON.stringify({
                      "notice_running" : this.result2.notice_running,
                      "send_item" : this.noticeDataResult2.send_item,
                      "userToken" : this.userData.userToken
                    });
                    console.log(delJson)
                    
                    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/delNoticeSend', delJson , {headers:headers}).subscribe(
                      (response) =>{
                        let alertMessage : any = JSON.parse(JSON.stringify(response));
                        console.log(alertMessage)
                        if(alertMessage.result==0){
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              this.closebutton.nativeElement.click();
                              this.SpinnerService.hide();
                            }
                            subscription.unsubscribe();
                          });
                        }else{
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              this.closebutton.nativeElement.click();
                              this.searchNotice(1);
                              this.setDefPage2();
                            }
                            subscription.unsubscribe();
                          });
                        }
                      },
                      (error) => {this.SpinnerService.hide();}
                    )
                    
                  }
                  subscription2.unsubscribe();
                });
              }else{
                confirmBox.setMessage(productsJson.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){}
                  subscription.unsubscribe();
                });
              }
            },
            (error) => {}
          );
  
      }
    }

    tabChangeInput(name:any,event:any){
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      if(name=='notice_type_id'){
        var student = JSON.stringify({
          "table_name" : "pnotice_type",
           "field_id" : "notice_type_id",
           "field_name" : "notice_type_name",
           "field_name2" : "notice_printleft",
          "condition" : " AND notice_type_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.notice_type_name = productsJson[0].fieldNameValue;
            // this.result.notice_type_name = productsJson[0].fieldNameValue+productsJson[0].fieldNameValue2;//พี่จูให้เอาค่าต่อท้ายออก
            this.runNotice();
          }else{
            this.result.notice_type_id = null;
            this.result.notice_type_name = '';
          }
          },
          (error) => {}
        )
      }else if(name=='bank_id'){
        var student = JSON.stringify({
          "table_name" : "pbank",
           "field_id" : "bank_id",
           "field_name" : "bank_name",
          "condition" : " AND bank_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result2.bank_name = productsJson[0].fieldNameValue;
          }else{
            this.result2.bank_id = null;
            this.result2.bank_name = '';
          }
          },
          (error) => {}
        )
      }else if(name=='receive_off_id'){
        var student = JSON.stringify({
          "table_name" : "psentnotice_officer",
           "field_id" : "off_id",
           "field_name" : "off_name",
           "search_id" : "",
           "search_desc" : "",
           "condition" : " AND prov_id='"+this.result2.prov_id+"' AND amphur_id='"+this.result2.prov_id+"' AND tambon_id='"+this.result2.tambon_id+"'",
           "userToken" : this.userData.userToken});
           console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result2.receive_off_name = productsJson[0].fieldNameValue;
          }else{
            this.result2.receive_off_id = null;
            this.result2.receive_off_name = '';
          }
          },
          (error) => {}
        )
      }else if(name=='lead_notice_item'){
        var student = JSON.stringify({
          "table_name" : "psentnotice_officer",
           "field_id" : "off_id",
           "field_name" : "off_name",
           "search_id" : "",
           "search_desc" : "",
           "condition" : " AND prov_id='"+this.result2.prov_id+"' AND amphur_id='"+this.result2.prov_id+"' AND tambon_id='"+this.result2.tambon_id+"'",
           "userToken" : this.userData.userToken});
           console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result2.receive_off_name = productsJson[0].fieldNameValue;
          }else{
            this.result2.receive_off_id = null;
            this.result2.receive_off_name = '';
          }
          },
          (error) => {}
        )
      }
    }

    receiveFuncReceiptData(event:any){
      this.result.notice_running = event;
      this.searchNotice(1);
      this.closebutton.nativeElement.click();
    }

    receiveFuncNoticeReceiptData(event:any){
      this.closebutton.nativeElement.click();
      this.result.notice_running = event.notice_running;
      this.searchNotice(1);
      
    }

    receiveFuncListData(event:any){
      console.log(event)
      if(this.modalType==1){
        this.result.notice_type_id=event.fieldIdValue;
        // this.result.notice_type_name=event.fieldNameValue+event.fieldNameValue2;//พี่จูให้เอาค่าต่อท้ายออก
        this.result.notice_type_name=event.fieldNameValue;
        this.runNotice();
      }else if(this.modalType==2 || this.modalType==3 ){
        this.result.lead_notice_item = event.seq;
        this.result.lead_notice_name = event.lit_name+" "+event.lit_type_desc2;
        this.result.lead_notice = event.lit_type;
  
        //เลือกผู้นำหมายแล้ว ไม่ต้องเอาที่อยู่ไปแทนที่ ที่อยู่ของคนที่หมายถึง
        /*this.result.addr = event.address;
        this.result.addr_no = event.addr_no;
        this.result.moo = event.moo;
        this.result.soi = event.soi;
        this.result.road = event.road;
        this.result.near_to = event.near_to;
        this.result.prov_id = event.prov_id;
        this.result.amphur_id = event.amphur_id;
        this.result.tambon_id = event.tambon_id;
        this.result.post_code = event.post_no;
        this.result.tel = event.tel_no;
  
        if(this.result.prov_id)
          this.changeProv(this.result.prov_id,1);
        if(this.result.amphur_id)
          this.changeAmphur(this.result.amphur_id,1);
        if(this.result.tambon_id)
          this.changeTambon(this.result.tambon_id,1);
        
        if(this.result.prov_id && this.result.amphur_id && this.result.tambon_id)
          this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);
        */
  
      }else if(this.modalType==4 || this.modalType==5 ){
        this.result.item = event.seq;
        this.result.noticeto_name = event.lit_name+" "+event.lit_type_desc2;
        this.result.lit_type = event.lit_type;
  
        this.result.addr = event.address;
        this.result.addr_no = event.addr_no;
        this.result.moo = event.moo;
        this.result.soi = event.soi;
        this.result.road = event.road;
        this.result.near_to = event.near_to;
        this.result.prov_id = event.prov_id;
        this.result.amphur_id = event.amphur_id;
        this.result.tambon_id = event.tambon_id;
        this.result.post_code = event.post_no;
        this.result.tel = event.tel_no;
  
        if(this.result.prov_id)
          this.changeProv(this.result.prov_id,1);
        if(this.result.amphur_id)
          this.changeAmphur(this.result.amphur_id,1);
        if(this.result.tambon_id)
          this.changeTambon(this.result.tambon_id,1);
        if(this.result.prov_id && this.result.amphur_id && this.result.tambon_id)
          this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);
  
      }else if(this.modalType==6){
        this.result.item = event.pers_no;
        this.result.noticeto_name = event.pers_desc;
      }else if(this.modalType==7){
        this.result.appoint_date = event.date_appoint;
        this.result.appoint_time = event.time_appoint;
      }else if(this.modalType==9){
        this.result2.bank_id = event.fieldIdValue;
        this.result2.bank_name = event.fieldNameValue;
      }else if(this.modalType==10 || this.modalType==11){
        this.result2.receive_off_id = event.fieldIdValue;
        this.result2.receive_off_name = event.fieldNameValue;

        // เพิ่มเติม
        this.result2.s_officer_id = event.fieldIdValue;
        this.result2.s_officer_name = event.fieldNameValue;

      }
      this.closebutton.nativeElement.click();
    }

    amtSentNotice(prov:any,amphur:any,tambon:any,moo:any,court_type:any){
      if(typeof moo== 'undefined')
        moo = '';
      if(typeof court_type== 'undefined')
        court_type = '';
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
        var student = JSON.stringify({
          "prov_id" : prov,
          "amphur_id" : amphur,
          "tambon_id" : tambon,
          "moo" : moo,
          "case_court_type" : court_type,
          "userToken" : this.userData.userToken
        });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNoticeAmt', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
            this.result.send_amt = getDataOptions.data[0].amtsentnotice;
            this.result.inout_flag = getDataOptions.data[0].inout_flag;
            this.result.to_court_id = getDataOptions.data[0].court_id;
            this.result.to_court_name = getDataOptions.data[0].court_name;
          }else{
            this.result.send_amt = '0.00';
            this.result.inout_flag = null;
          }
        },
        (error) => {}
      )
      //console.log(prov+":"+amphur+":"+tambon+":"+moo+":"+court_type)
    }

    assignRep(boolean:any,el:any){
      if(el=='appoint_time'){
        this.result[el] = '09.00-16.30';
      }
    }

    checkAmt(){
      if(this.result.send_by==1){
        this.result.send_amt = this.userData.postAmt;
      }else if(this.result.send_by!=1 && this.result.no_money==2){
        if(this.result.prov_id && this.result.amphur_id && this.result.tambon_id)
          this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);
      }else if(this.result.no_money==1){
        this.result.send_amt = '';
      }
    }

    loadNotSendNOticeData(){
      if(this.dataHead.run_id){

          var student = JSON.stringify({
          "run_id" : this.dataHead.run_id,
          "unsend_flag" : 1,
          "userToken" : this.userData.userToken});
        
        console.log(student)
        
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNoticeData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
              this.showNotSendNOticeData = getDataOptions.data;
            }else{
              this.showNotSendNOticeData = [];
            }
          },
          (error) => {}
        )
      }
    }

    editNotice(index:any){
      this.SpinnerService.show();
      this.result = this.noticeDataResult =  this.showNotSendNOticeData[index];
      //ผลการส่งข้อมูลให้ SUMMON
      if(this.result.summon_gennumber && this.result.summon_gennumber_year)
        this.result.summon_desc = this.result.summon_gennumber+'/'+this.result.summon_gennumber_year;
      if(this.result.prov_id)
          this.changeProv(this.result.prov_id,1);
        if(this.result.amphur_id)
          this.changeAmphur(this.result.amphur_id,1);
        if(this.result.tambon_id)
          this.changeTambon(this.result.tambon_id,1);
  
        if(this.result.prov_id && this.result.amphur_id && this.result.tambon_id)
          this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);
      setTimeout(() => {
        var bar = new Promise((resolve, reject) => {
          // this.setCalendar('send_date');
          // this.setCalendar('receive_date');
          // this.setCalendar('devoid_date');
          this.setCalendarAll();
        });
        if(bar){
          this.SpinnerService.hide();
          this.setDefPage2();
        }  

      }, 200);
      //console.log(this.showNotSendNOticeData[index])
    }

    editNoticeSend(index:any,type:any){
      if(type==1)
        var eNoticeRunning = this.dataNotice[index].notice_running;
      else
        var eNoticeRunning = this.dataNoticeCurdate[index].notice_running;

      if((this.result.notice_running != eNoticeRunning) || !this.result.notice_running){
        if(type==1){
          this.dataNotice[index]['edit_send_item'] = this.dataNotice[index].send_item;
          this.result.notice_running = this.dataNotice[index].notice_running;
          this.comeEditNoticeSend = [this.dataNotice[index]];
        }else{
          this.dataNoticeCurdate[index]['edit_send_item'] = this.dataNoticeCurdate[index].send_item;
          this.result.notice_running = this.dataNoticeCurdate[index].notice_running;
          this.comeEditNoticeSend = [this.dataNoticeCurdate[index]];
        }
        this.searchNotice(1);
      }else{
        //console.log(this.result2.send_date+":"+this.result2.receive_date+":"+this.result2.devoid_date)
        this.SpinnerService.show();
          this.result2 = [];
          if(type==1){
            console.log(this.dataNotice[index])
            this.dataNotice[index]['edit_send_item'] = this.dataNotice[index].send_item;
            this.result2 =  $.extend([],this.dataNotice[index]);
            this.noticeDataResult2 =  $.extend([],this.dataNotice[index]);
          }else{
            console.log(this.dataNoticeCurdate[index])
            this.dataNoticeCurdate[index]['edit_send_item'] = this.dataNoticeCurdate[index].send_item;
            this.result2 = $.extend([],this.dataNoticeCurdate[index]);
            this.noticeDataResult2 =  $.extend([],this.dataNoticeCurdate[index]);
          }
          setTimeout(() => {
            var bar = new Promise((resolve, reject) => {
              // this.setCalendar('send_date');
              // this.setCalendar('receive_date');
              // this.setCalendar('devoid_date');
              this.setCalendarAll();
            });
            if(bar){
              this.SpinnerService.hide();
            }  
          }, 200);
          
      }
      
    }

    editNoticeSendButton(){
      this.SpinnerService.show();
      var objData = this.dataNotice.filter((x:any) => x.send_item === parseInt(this.result2.send_item)) ;
      console.log(objData)
      if(objData.length!=0){
        objData[0]['edit_send_item'] = parseInt(this.result2.send_item);
        this.result2 = $.extend({},objData[0]);
        this.noticeDataResult2 = $.extend({},objData[0]);
        setTimeout(() => {
          var bar = new Promise((resolve, reject) => {
            // this.setCalendar('send_date');
            // this.setCalendar('receive_date');
            // this.setCalendar('devoid_date');
            this.setCalendarAll();
          });
          if(bar){
            this.SpinnerService.hide();
          }  
        }, 200);
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ไม่พบข้อมูลการจ่ายหมาย');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){this.SpinnerService.hide();}
            subscription.unsubscribe();
          });
      }
    }

    assignBank(checked:any){
      if(checked==true){
        this.getBookAccount();
        this.result2.send_date = myExtObject.curDate();
      }else{
        this.result2.send_date = '';
      }
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    directiveDate2(date:any,obj:any){
      this.result2[obj] = date;
    }

    saveData(type:any){//1 คือ กดจัดเก็บปกติ , 2 คือ เลือก popup 
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.dataHead.run_id){
        confirmBox.setMessage('กรุณาค้นหาเลขคดี');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
      }else{
        if(this.result.notice_running=='0' || this.result.notice_running=='' || !this.result.notice_running){
          if(!this.result.notice_type_id){
            confirmBox.setMessage('คุณยังไม่ได้เลือกประเภทหมาย');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else if(!this.result.noticeto_name){
            confirmBox.setMessage('คุณยังไม่ได้เลือกข้อมูลหมายถึง');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else{
            this.saveDataCommit(type);
          }
        }else{
          if(this.noticeDataResult.send_amt=='0.00' || this.noticeDataResult.send_amt=='' || !this.noticeDataResult.send_amt){
            if(this.result2.send_date==''){
              confirmBox.setMessage('ป้อนข้อมูลวันที่จ่ายหมาย');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
              });
            }else if(!this.result2.notice_send_by){
              confirmBox.setMessage('ป้อนข้อมูลส่งโดย');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
              });
            }else{
              this.saveDataCommit(type);
            }
          }else{
            this.saveDataCommit(type);
          }
          
        }
      }
    }

    saveDataCommit(type:any){
          console.log(this.result2)
          this.result.nbarcode='';
          this.SpinnerService.show();
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type','application/json');
            
            var arrayData = [];
            //var data = [],send_data = [];
            //var student = $.extend({},this.result);
            if(type==1){
              arrayData['data'] = [$.extend({},this.result)];
              arrayData['send_data'] = [$.extend({},this.result2)];
            }else{
              arrayData['data'] = [];
              arrayData['send_data'] = [$.extend({},this.result2)];
            }
            arrayData['run_id'] = this.dataHead.run_id;
            arrayData['userToken'] = this.userData.userToken;
            var student = $.extend({},arrayData);
            
            console.log(student)

            this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/saveSendNotice', student , {headers:headers}).subscribe(
              (response) =>{
                let getDataOptions : any = JSON.parse(JSON.stringify(response));
                console.log(getDataOptions)
                if(getDataOptions.result==1){
                    //-----------------------------//
                    confirmBox.setMessage(getDataOptions.error);
                    confirmBox.setButtonLabels('ตกลง');
                    confirmBox.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){
                        if(type==1){
                          this.result2.send_item = getDataOptions.send_item;
                          this.result2.notice_running = getDataOptions.notice_running;
                          this.getNoticeData(0);
                          this.getNoticeDataCurDate(0);
                          this.loadNotSendNOticeData();
                          this.SpinnerService.hide();
                        }else{
                          this.searchNotice(1);
                        }
                      }
                      subscription.unsubscribe();
                    });
                    //-----------------------------//
                }else{
                  //-----------------------------//
                    confirmBox.setMessage(getDataOptions.error);
                    confirmBox.setButtonLabels('ตกลง');
                    confirmBox.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){
                        this.SpinnerService.hide();
                      }
                      subscription.unsubscribe();
                    });
                  //-----------------------------//
                }

              },
              (error) => {}
            )
            
    }

    runNotice(){
      if(!this.result.notice_running){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
        var student = JSON.stringify({
          "notice_type_id" : this.result.notice_type_id,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/runNoticeNo', student , {headers:headers}).subscribe(
           (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.result==1){
              this.result.notice_no = productsJson.notice_no;
              this.result.notice_yy = productsJson.notice_yy;
            }else{
              this.result.notice_no = '';
              this.result.notice_yy = myExtObject.curYear();
            }
           },
           (error) => {}
         )
      }
    }


    gotoLink(page:any){
      if(page=='fno0900' || page=='prno5000'){
      //notice_running=60724&notice_no=(38)-184%2F2565&notice_type_name=หมายนัด(๑๙)
      //if(this.result.notice_running){
        let winURL = window.location.href.split("/#/")[0]+"/#/";
        //var run_id = this.dataHead.run_id;
        /*if(!this.result.notice_type_name){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ไม่พบประเภทหมาย');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
        }else{
          */
          var notice_no = '('+this.result.notice_court_running+')-'+this.result.notice_no+'/'+this.result.notice_yy;
          if(this.result.notice_running && this.result.notice_type_name)
            myExtObject.OpenWindowMaxName(winURL+page+'?notice_running='+this.result.notice_running+'&notice_no='+notice_no+'&notice_type_name='+this.result.notice_type_name,page);
          else if (!this.result.notice_running && this.result.notice_type_name)
            myExtObject.OpenWindowMaxName(winURL+page+'?notice_type_name='+this.result.notice_type_name,page);
          else if (!this.result.notice_running && !this.result.notice_type_name)
            myExtObject.OpenWindowMaxName(winURL+page,page);
          else if (this.result.notice_running && !this.result.notice_type_name)
            myExtObject.OpenWindowMaxName(winURL+page+'?notice_running='+this.result.notice_running+'&notice_no='+notice_no,page);

        //}
      /*}else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ไม่พบข้อมูลการจ่ายหมาย');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.SpinnerService.hide();
          }
          subscription.unsubscribe();
        });
      }*/
    }else if(page=='fkb0301'){
      console.log()
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      myExtObject.OpenWindowMaxName(winURL+page+'?run_id='+this.dataHead.run_id+'&notice_running='+this.result.notice_running,page);

    }
        
    }

    checkSendBy(){
      if(this.result.send_by==1){
        this.result.post_type = 1;
      }else{
        this.result.post_type = null;
      }
    }
}







