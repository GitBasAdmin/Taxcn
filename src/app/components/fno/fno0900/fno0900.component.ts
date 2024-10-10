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
import { PrintReportService } from 'src/app/services/print-report.service';
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
} from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { ModalNoticeLitigantComponent } from '../../modal/modal-notice-litigant/modal-notice-litigant.component';

@Component({
  selector: 'app-fno0900,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fno0900.component.html',
  styleUrls: ['./fno0900.component.css']
})


export class Fno0900Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  
  getLitType:any;
  getProv:any;
  getAmphur:any;
  getTambon:any;
  getNation:any;
  getInOut:any;
  getNoMoney:any;
  getSendBy:any;
  getPostType:any;
  getSendById:any;
  getPrintType:any;
  getPresent:any;

  sessData:any;
  userData:any;
  programName:any;
  dataHead:any = [];
  result:any = [];
  resultTmp:any = [];
  dataNotice:any = [];
  retNoticeNo:any = [];
  runId:any;
  noticeRunning:any;
  appeal_running:any;
  modalType:any;
  myExtObject: any;
  
  

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalJudgeComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  public loadModalLitComponent: boolean = false;
  public loadModalOrgComponent: boolean = false;
  public loadModalAppComponent: boolean = false;
  public loadModalMulComponent: boolean = false;
  public loadModalNoticeLitComponent: boolean = false;
  
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  defaultdepTelNo:any;
  asyncObservable: Observable<string>;
 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public masterSelect: boolean = false;
  public loadComponent: boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  @ViewChild( ModalNoticeLitigantComponent ) child2: ModalNoticeLitigantComponent ; 
  @ViewChild('sProv') sProv : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService
  ){ }
   
  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };

    this.activatedRoute.queryParams.subscribe(params => {
      this.runId = params['run_id'];
      this.noticeRunning = params['notice_running'];
      if(this.runId>0){
        this.getNoticeData(0);
      }
      if(this.noticeRunning){
        this.result.notice_running = this.noticeRunning;
        this.searchNotice(1);
      }
      if(params['appeal_running'])
        this.appeal_running = params['appeal_running'];
        this.result.appeal_running = params['appeal_running'];
    });

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
        this.getLitType = getDataOptions;
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
      },
      (error) => {}
    )
    this.getInOut = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'ในเขต'},{fieldIdValue:2,fieldNameValue: 'ข้ามเขต'}];
    this.getNoMoney = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'หมายศาล'},{fieldIdValue:2,fieldNameValue: 'หมายนำ'}];
    this.getSendBy = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: '1.ไปรษณีย์'},{fieldIdValue:2,fieldNameValue: '2.เจ้าหน้าที่'},{fieldIdValue:3,fieldNameValue: '3.คู่ความส่งเอง'},{fieldIdValue:4,fieldNameValue: '4.หนังสือนำส่ง'}];
    this.getPostType = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'EMS'},{fieldIdValue:2,fieldNameValue: 'ลงทะเบียนตอบรับ'}];
    this.getPrintType = [{fieldIdValue:1,fieldNameValue: 'พิมพ์หน้าและหลัง'},{fieldIdValue:2,fieldNameValue: 'พิมพ์เฉพาะหน้าหมาย'},{fieldIdValue:3,fieldNameValue: 'พิมพ์เฉพาะหลังหมาย'},{fieldIdValue:4,fieldNameValue: 'พิมพ์หมายรวม'}];
    this.getPresent = [{fieldIdValue:'ผู้บัญชาการตำรวจแห่งชาติ',fieldNameValue: '1.ผู้บัญชาการตำรวจแห่งชาติ'},
    {fieldIdValue:'ผู้บัญชาการตำรวจสอบสวนกลาง',fieldNameValue: '2.ผู้บัญชาการตำรวจสอบสวนกลาง'},
    {fieldIdValue:'ผู้บัญชาการตำรวจนครบาล',fieldNameValue: '3.ผู้บัญชาการตำรวจนครบาล'},
    {fieldIdValue:'ผู้บังคับการตำรวจภูธรจังหวัด',fieldNameValue: '4.ผู้บังคับการตำรวจภูธรจังหวัด'},
    {fieldIdValue:'ผู้กำกับการ',fieldNameValue: '5.ผู้กำกับการ'},
    {fieldIdValue:'ผู้บัญชาการตำรวจแห่งชาติ และเลขาธิการสำนักงานศาลยุติธรรม',fieldNameValue: '6.ผู้บัญชาการตำรวจแห่งชาติ และเลขาธิการสำนักงานศาลยุติธรรม'},
    {fieldIdValue:'เลขาธิการสำนักงานศาลยุติธรรม และผู้บัญชาการตำรวจนครบาล',fieldNameValue: '7.เลขาธิการสำนักงานศาลยุติธรรม และผู้บัญชาการตำรวจนครบาล'},
    {fieldIdValue:'เลขาธิการสำนักงานศาลยุติธรรม และผู้บังคับการตำรวจภูธรจังหวัด',fieldNameValue: '8.เลขาธิการสำนักงานศาลยุติธรรม และผู้บังคับการตำรวจภูธรจังหวัด'}];
    this.successHttp();
    this.setDefPage();
  }
  setDefPage(){
    this.result = [];
    this.getNoticeNo(this.userData.courtId);
    this.result.nation_id = 1;
    this.result.no_money = 2;
    this.result.send_by = 2;
    this.result.send_by_id = 2;
    this.result.pprint_type = 1;
    this.result.type_by = this.userData.offName;
    this.result.type_date = myExtObject.curDate();
    this.result.alle_desc = this.dataHead.alle_desc;
    this.result.to = 1;
    this.result.lead_notice = 1;
    this.result.pprint_type = 1;
    this.result.notice_date = myExtObject.curDate();
    this.result.dep_tel_no = this.defaultdepTelNo;
    this.actionIn();
  }
  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fno0900"
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
          this.defaultdepTelNo = getDataAuthen.depTelNo;
          this.result.dep_tel_no = this.defaultdepTelNo;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  actionIn(){
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "condition" : " AND c_lan='1'",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getAllRecData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.result.action_in = getDataOptions[0].action_in;
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
  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }
  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }
  setCalendar(obj:any){
    if(this.result.notice_type_id==3)
      myExtObject.callCalendarSet(obj);
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

  fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.result = [];
      this.setDefPage();
      this.getNoticeNo(this.dataHead.court_id);
      this.getNoticeData(0);
      this.result.alle_desc = this.dataHead.alle_desc;
      //this.runId = this.dataHead.run_id;
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      //console.log(this.runId)
      
    }else{
      this.getNoticeData(0);
    }
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

  runNotice(){
    if(!this.result.notice_running && this.result.notice_type_id){
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
          var name2 = productsJson[0].fieldNameValue2?productsJson[0].fieldNameValue2:'';
          // this.result.notice_type_name = productsJson[0].fieldNameValue+name2;//พี่จูให้เอาค่าต่อท้ายออก
          this.result.notice_type_name = productsJson[0].fieldNameValue;
          this.checkNoiceType(this.result.notice_type_id);
          this.runNotice();
        }else{
          this.result.notice_type_id = null;
          this.result.notice_type_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='item'){
      console.log(this.dataHead.run_id +":"+ this.result.lit_type)
      if(this.dataHead.run_id && this.result.lit_type){
        var student = JSON.stringify({
          "run_id": this.dataHead.run_id,
          "lit_type": this.result.lit_type,
          "seq":this.result.item,
          "userToken" : this.userData.userToken
        }); 
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/popupLitName', student , {headers:headers}).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.data.length){
            if(this.result.lit_type== 10)//ถ้า lit_type เป็นทนาย ไม่เอาข้อความมาต่อ
              this.result.noticeto_name = productsJson.data[0].lit_name;
            else
              this.result.noticeto_name = productsJson.data[0].lit_name+" "+productsJson.data[0].lit_type_desc2;
            this.result.addr = productsJson.data[0].address;
            this.result.addr_no = productsJson.data[0].addr_no;
            this.result.moo = productsJson.data[0].moo;
            this.result.soi = productsJson.data[0].soi;
            this.result.road = productsJson.data[0].road;
            this.result.near_to = productsJson.data[0].near_to;
            this.result.prov_id = productsJson.data[0].prov_id;
            this.result.amphur_id = productsJson.data[0].amphur_id;
            this.result.tambon_id = productsJson.data[0].tambon_id;
            this.result.post_code = productsJson.data[0].post_no;
            this.result.tel = productsJson.data[0].tel_no;

            if(this.result.prov_id)
              this.changeProv(this.result.prov_id,1);
            if(this.result.amphur_id)
              this.changeAmphur(this.result.amphur_id,1);
            if(this.result.tambon_id)
              this.changeTambon(this.result.tambon_id,1);

            this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);


          }else{
            this.result.item = '';
            this.result.noticeto_name = '';
            this.result.addr = '';
            this.result.addr_no = '';
            this.result.moo = '';
            this.result.soi = '';
            this.result.road = '';
            this.result.near_to = '';
            this.result.prov_id = '';
            this.result.amphur_id = '';
            this.result.tambon_id = '';
            this.result.post_code = '';
            this.result.tel = '';
          }
          },
          (error) => {}
        )
      }
    }else if(name=='item_inform'){
      console.log(this.dataHead.run_id +":"+ this.result.lit_type_inform)
      if(this.dataHead.run_id && this.result.lit_type_inform){
        var student = JSON.stringify({
          "run_id": this.dataHead.run_id,
          "lit_type": this.result.lit_type_inform,
          "seq":this.result.item_inform,
          "userToken" : this.userData.userToken
        }); 
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/popupLitName', student , {headers:headers}).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.data.length){
            this.result.lit_name_inform = productsJson.data[0].lit_name+" "+productsJson.data[0].lit_type_desc2;
            this.result.addr = productsJson.data[0].address;
            this.result.addr_no = productsJson.data[0].addr_no;
            this.result.moo = productsJson.data[0].moo;
            this.result.soi = productsJson.data[0].soi;
            this.result.road = productsJson.data[0].road;
            this.result.near_to = productsJson.data[0].near_to;
            this.result.prov_id = productsJson.data[0].prov_id;
            this.result.amphur_id = productsJson.data[0].amphur_id;
            this.result.tambon_id = productsJson.data[0].tambon_id;
            this.result.post_code = productsJson.data[0].post_no;
            this.result.tel = productsJson.data[0].tel_no;

            if(this.result.prov_id && this.result.prov_id!=10){
              this.result.pre_noticeto_name = 'ผู้บังคับการตำรวจภูธรจังหวัด';
              this.result.noticeto_name = productsJson.data[0].prov_name;
            }else if(this.result.prov_id && this.result.prov_id==10){
              this.result.pre_noticeto_name = 'ผู้บัญชาการตำรวจนครบาล';
              this.result.noticeto_name = '';
            }
            if(this.result.lit_name_inform)
              this.result.remark1 = this.result.lit_name_inform;

            if(this.result.prov_id)
              this.changeProv(this.result.prov_id,1);
            if(this.result.amphur_id)
              this.changeAmphur(this.result.amphur_id,1);
            if(this.result.tambon_id)
              this.changeTambon(this.result.tambon_id,1);

            this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);


          }else{
            this.result.item = '';
            this.result.noticeto_name = '';
            this.result.addr = '';
            this.result.addr_no = '';
            this.result.moo = '';
            this.result.soi = '';
            this.result.road = '';
            this.result.near_to = '';
            this.result.prov_id = '';
            this.result.amphur_id = '';
            this.result.tambon_id = '';
            this.result.post_code = '';
            this.result.tel = '';
          }
          },
          (error) => {}
        )
      }
    }else if(name=='app_id'){
      var student = JSON.stringify({
        "table_name" : "pappoint_list",
         "field_id" : "app_id",
         "field_name" : "app_name",
        "condition" : " AND app_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.app_name = productsJson[0].fieldNameValue;
        }else{
          this.result.app_id = '';
          this.result.app_name = '';
        }
        },
        (error) => {}
      )
      this.runNotice();
    }else if(name=='_id'){
      if(this.dataHead.case_type){
        var student = JSON.stringify({
          "table_name" : "pnotice_add_order_setup",
          "field_id" : "add_order_id",
          "field_name" : "add_order_desc",
          "condition" : " AND add_order_id='"+event.target.value+"' AND case_type='"+this.dataHead.case_type+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.remark4 = productsJson[0].fieldNameValue;
          }else{
            this.result._id = '';
            this.result.remark4 = '';
          }
          },
          (error) => {}
        )
      }
    }else if(name=='to_court_id'){
      if(this.dataHead.case_type){
        var student = JSON.stringify({
          "table_name" : "pcourt",
          "field_id" : "court_id",
          "field_name" : "court_name",
          "condition" : " AND court_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.to_court_name = productsJson[0].fieldNameValue;
          }else{
            this.result.to_court_id = '';
            this.result.to_court_name = '';
          }
          },
          (error) => {}
        )
      }
    }else if(name=='judge_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.judge_name = productsJson[0].fieldNameValue;
          }else{
            this.result.judge_id = '';
            this.result.judge_name = '';
          }
          },
          (error) => {}
        )
    }else if(name=='catch_judge_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.catch_judge_name = productsJson[0].fieldNameValue;
        }else{
          this.result.catch_judge_id = '';
          this.result.catch_judge_name = '';
        }
        },
        (error) => {}
      )
  }else if(name=='form_id'){
      var student = JSON.stringify({
        "table_name" : "pnotice_form",
        "field_id" : "form_id",
        "field_name" : "form_desc",
        "condition" : " AND form_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.form_name = productsJson[0].fieldNameValue;
          this.saveData();
        }else{
          this.result.form_id = '';
          this.result.form_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='notice_reason_id'){
      var student = JSON.stringify({
        "table_name" : "pnotice_reason",
        "field_id" : "notice_reason_id",
        "field_name" : "notice_reason_desc",
        "condition" : " AND notice_reason_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.notice_reason_desc = productsJson[0].fieldNameValue;
        }else{
          this.result.notice_reason_id = '';
          this.result.notice_reason_desc = '';
        }
        },
        (error) => {}
      )
    }
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
        if(getDataOptions.result==1 && getDataOptions.data.length){
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
  receiveFuncNoticeListData(event:any){

  }
  receiveJudgeListData(event:any){
    if(this.modalType==10){
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
    }else if(this.modalType==18){
      this.result.catch_judge_id = event.judge_id;
      this.result.catch_judge_name = event.judge_name;
    }
    this.closebutton.nativeElement.click();
  }
  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.notice_type_id=event.fieldIdValue;
      var name2 = event.fieldNameValue2?event.fieldNameValue2:'';
      // this.result.notice_type_name=event.fieldNameValue+name2;//พี่จูให้เอาค่าต่อท้ายออก
      this.result.notice_type_name=event.fieldNameValue;
      this.runNotice();
      this.checkNoiceType(event.fieldIdValue);
    }else if(this.modalType==2 || this.modalType==3 ){
      this.result.item = event.seq;
      if(event.lit_type== 10)//ถ้า lit_type เป็นทนาย ไม่เอาข้อความมาต่อ
        this.result.noticeto_name = event.lit_name;
      else
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

      this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);

    }else if(this.modalType==16 ){
      this.result.item_inform = event.seq;
      this.result.lit_name_inform = event.lit_name+" "+event.lit_type_desc2;
      this.result.lit_type_inform = event.lit_type;

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

      if(this.result.prov_id && this.result.prov_id!=10){
        this.result.pre_noticeto_name = 'ผู้บังคับการตำรวจภูธรจังหวัด';
        this.result.noticeto_name = event.data[0].prov_name;
      }else if(this.result.prov_id && this.result.prov_id==10){
        this.result.pre_noticeto_name = 'ผู้บัญชาการตำรวจนครบาล';
        this.result.noticeto_name = '';
      }
      if(this.result.lit_name_inform)
        this.result.remark1 = this.result.lit_name_inform;

      if(this.result.prov_id)
        this.changeProv(this.result.prov_id,1);
      if(this.result.amphur_id)
        this.changeAmphur(this.result.amphur_id,1);
      if(this.result.tambon_id)
        this.changeTambon(this.result.tambon_id,1);

      this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);

    }else if(this.modalType==4){
      this.result.item = event.fieldIdValue;
      this.result.noticeto_name = event.fieldNameValue;
    }else if(this.modalType==5){
      this.result.item = event.pers_no;
      this.result.noticeto_name = event.pers_desc;

      this.result.addr = event.address;
      this.result.addr_no = event.addr_no;
      this.result.moo = event.moo;
      this.result.soi = event.soi;
      this.result.road = event.road;
      this.result.near_to = '';
      this.result.prov_id = event.prov_id;
      this.result.amphur_id = event.amphur_id;
      this.result.tambon_id = event.tambon_id;
      this.result.post_code = event.post_code;
      this.result.tel = event.tel_no;

      if(this.result.prov_id)
        this.changeProv(this.result.prov_id,1);
      if(this.result.amphur_id)
        this.changeAmphur(this.result.amphur_id,1);
      if(this.result.tambon_id)
        this.changeTambon(this.result.tambon_id,1);

      this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);

    }else if(this.modalType==6){
      this.result.appoint_date = event.date_appoint;
      this.result.appoint_time = event.time_appoint;
      this.result.app_id = event.app_id;
      this.result.app_name = event.app_name;
    }else if(this.modalType==7){
      this.result.app_id = event.fieldIdValue;
      this.result.app_name = event.fieldNameValue;
    }else if(this.modalType==8){
      this.result._id = event.fieldIdValue;
      this.result.remark4 = event.fieldNameValue;
    }else if(this.modalType==9){
      this.result.to_court_id = event.fieldIdValue;
      this.result.to_court_name = event.fieldNameValue;
    }else if(this.modalType==11){
      this.result.form_id = event.fieldIdValue;
      this.result.form_name = event.fieldNameValue;
      this.saveData();
    }else if(this.modalType==14){
      this.result.pers_item1 = event.fieldIdValue;
      this.result.person_1 = event.fieldNameValue;
    }else if(this.modalType==15){
      this.result.notice_reason_id = event.fieldIdValue;
      this.result.notice_reason_desc = event.fieldNameValue;
    }else if(this.modalType==17){
      this.result.catch_chk3_remark = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  clickOpenMyModalComponent(type:any){
    if((type==2 || type==3 || type==8 || type==11) && !this.dataHead.run_id){
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
    }else if(type==2 && !this.result.lit_type){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกประเภทคู่ความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      this.modalType = type;
      this.openbutton.nativeElement.click();
    }
  }
  closeModal(){
    this.loadModalJudgeComponent = false;
    this.loadModalComponent = false;
    this.loadModalConfComponent = false;
    this.loadModalLitComponent = false;
    this.loadModalOrgComponent = false;
    this.loadModalAppComponent = false;
    this.loadModalMulComponent = false;
    this.loadModalNoticeLitComponent = false;
  }

  submitModalFormLit(){
    var dataSend = [];
    dataSend['notice_running'] = this.result.notice_running;
    dataSend['userToken'] = this.userData.userToken;
    dataSend['data'] = this.child2.ChildTestCmp();
    this.SpinnerService.show();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var student = $.extend({},dataSend);
        console.log(student)
        
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/saveLitigantNotice', student , {headers:headers}).subscribe(
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
                this.closebutton.nativeElement.click();
                this.getNoticeData(1);
                this.retNoticeNo = getDataOptions.data;
                this.SpinnerService.hide();
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
            if(this.modalType==12){
              confirmBox2.setTitle('ต้องการยกเลิกข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการยกเลิกข้อมูลที่เลือก');
            }else{
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            }
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
                  
                    var dataDel = [],dataTmp=[];
                    dataDel['log_remark'] = chkForm.log_remark;
                    dataDel['userToken'] = this.userData.userToken;
                    var bar = new Promise((resolve, reject) => {
                      this.dataNotice.forEach((ele, index, array) => {
                            if(ele.nRunning == true){
                              dataTmp.push(this.dataNotice[index]);
                            }
                        });
                    });
                    
                    if(bar){
                      this.SpinnerService.show();
                      let headers = new HttpHeaders();
                      headers = headers.set('Content-Type','application/json');
                      dataDel['data'] = dataTmp;
                      var data = $.extend({}, dataDel);
                      console.log(data)
                      if(this.modalType==12){
                        var api = '/'+this.userData.appName+'ApiNO/API/NOTICE/cencelNotice';
                      }else{
                        var api = '/'+this.userData.appName+'ApiNO/API/NOTICE/deleteNotice';
                      }
                      console.log(api)
                      this.http.post(api, data , {headers:headers}).subscribe(
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
                                this.getNoticeData(0);
                                this.setDefPage();
                              }
                              subscription.unsubscribe();
                            });
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
                    }
                  
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

  loadMyModalComponent(){
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
      this.runNotice();
    }else if(this.modalType==2 || this.modalType==3 || this.modalType==16){
      
      $("#exampleModal").find(".modal-content").css("width","800px");
      if(this.modalType==2 ){
        this.listTable='3';
      }else{
        this.listTable='2';
      }
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalLitComponent = true;
      this.loadModalJudgeComponent = false; 
      this.loadModalOrgComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalMulComponent = false;
      this.loadModalNoticeLitComponent = false;
    }else if(this.modalType==19){
      $("#exampleModal").find(".modal-content").css("width","800px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalJudgeComponent = false; 
      this.loadModalOrgComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalMulComponent = false;
      this.loadModalNoticeLitComponent = true;
    }else if(this.modalType==4){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "ppolice",
         "field_id" : "police_id",
         "field_name" : "police_name",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='ppolice';
      this.listFieldId='police_id';
      this.listFieldName='police_name';
      this.listFieldNull='';
      this.listFieldCond='';
    }else if(this.modalType==5){
      $("#exampleModal").find(".modal-content").css("width","800px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalOrgComponent = true;
      this.loadModalAppComponent = false;
      this.loadModalMulComponent = false;
      this.loadModalNoticeLitComponent = false;
    }else if(this.modalType==6){
      $("#exampleModal").find(".modal-content").css("width","800px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalOrgComponent = false;
      this.loadModalAppComponent = true;
      this.loadModalMulComponent = false;
      this.loadModalNoticeLitComponent = false;
    }else if(this.modalType==7){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pappoint_list",
         "field_id" : "app_id",
         "field_name" : "app_name",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='pappoint_list';
      this.listFieldId='app_id';
      this.listFieldName='app_name';
      this.listFieldNull='';
      this.listFieldCond='';
    }else if(this.modalType==8){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pnotice_add_order_setup",
         "field_id" : "add_order_id",
         "field_name" : "add_order_desc",
         "search_id" : "",
         "search_desc" : "",
         "condition" : " AND case_type='"+this.dataHead.case_type+"'",
         "userToken" : this.userData.userToken});
      this.listTable='pnotice_add_order_setup';
      this.listFieldId='add_order_id';
      this.listFieldName='add_order_desc';
      this.listFieldNull='';
      this.listFieldCond=" AND case_type='"+this.dataHead.case_type+"'";
    }else if(this.modalType==9){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pcourt",
         "field_id" : "court_id",
         "field_name" : "court_name",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='pcourt';
      this.listFieldId='court_id';
      this.listFieldName='court_name';
      this.listFieldNull='';
      this.listFieldCond='';
    }else if(this.modalType==10 || this.modalType==18){//judge
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalJudgeComponent = true;
      this.loadModalOrgComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalMulComponent = false;
      this.loadModalNoticeLitComponent = false;
      var student = JSON.stringify({
        "cond":2,
        "userToken" : this.userData.userToken
      });
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.listFieldCond='';
      this.listFieldType=JSON.stringify({"type":2});
    
      console.log(student)
      let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
     
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.data.length){
            this.list = productsJson.data;
            console.log(this.list)
          }else{
            this.list = [];
          }
         },
         (error) => {}
       )
    }else if(this.modalType==11){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pnotice_form",
         "field_id" : "form_id",
         "field_name" : "form_desc",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='pnotice_form';
      this.listFieldId='form_id';
      this.listFieldName='form_desc';
      this.listFieldNull='';
      this.listFieldCond='';
    }else if(this.modalType==12 || this.modalType==13 ){//confirm
      this.loadModalComponent = false;  
      this.loadModalConfComponent = true;
      this.loadModalJudgeComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalOrgComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalMulComponent = false;
      this.loadModalNoticeLitComponent = false;
    }else if(this.modalType==14){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "plit_type",
         "field_id" : "lit_type",
         "field_name" : "lit_type_desc",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='plit_type';
      this.listFieldId='lit_type';
      this.listFieldName='lit_type_desc';
      this.listFieldNull='';
      this.listFieldCond='';
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalOrgComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalMulComponent = true;
      this.loadModalNoticeLitComponent = false;
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
    }else if(this.modalType==15 || this.modalType==17){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pnotice_reason",
         "field_id" : "notice_reason_id",
         "field_name" : "notice_reason_desc",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='pnotice_reason';
      this.listFieldId='notice_reason_id';
      this.listFieldName='notice_reason_desc';
      this.listFieldNull='';
      this.listFieldCond='';
    }

    if(this.modalType==1 || this.modalType==4 || this.modalType==7 || this.modalType==8 || this.modalType==9 || this.modalType==11 || this.modalType==15 || this.modalType==17){
      this.loadModalComponent = true;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalOrgComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalMulComponent = false;
      this.loadModalNoticeLitComponent = false;
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

  assignRep(boolean:any,el:any){
    if(el=='noticeto_name'){
      if(boolean==true){
        if(this.result[el])
          this.result[el] = this.result[el] + '(ส่งให้ตัวแทน)';
        else
          this.result[el] = '(ส่งให้ตัวแทน)';
      }
    }else if(el=='appoint_time'){
      this.result[el] = '09.00-16.30';
    }
  }

  saveData(){
    if(!this.dataHead.run_id){
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
    }else if(!this.result.send_by && this.result.notice_type_id!='3' && this.result.notice_type_id!='31'){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกส่งโดย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.notice_type_id){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกประเภทหมาย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        //var student = this.difference(this.dataHead,this.dataSource);
        var student = $.extend({},this.result);
        student['run_id'] = this.dataHead.run_id;
        student['userToken'] = this.userData.userToken;
        console.log(student)
        
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/saveNotice', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
                //-----------------------------//
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.result.notice_running = getDataOptions.notice_running;
                    this.searchNotice(1);
                    this.getNoticeData(0);
                    this.SpinnerService.hide();
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
    
  }

  updateData(type:any,val:any,notice_running:any){
    
      this.SpinnerService.show();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        if(type==1){
          var student = JSON.stringify({
          "notice_group" : val,
          "notice_running" : notice_running,
          "userToken" : this.userData.userToken});
        }else{
          var student = JSON.stringify({
          "notice_group_yy" : val,
          "notice_running" : notice_running,
          "userToken" : this.userData.userToken});
        }
        console.log(student)
        
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/updateNotice', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
              //-----------------------------//
              this.getNoticeData(0);
              this.SpinnerService.hide();
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

  getNoticeData(type:any){
    if(this.dataHead.run_id){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        //this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNoticeData', student , {headers:headers}).subscribe(
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNoticeData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.data.length){
              this.dataNotice = productsJson.data;
              var bar = new Promise((resolve, reject) => {
                this.dataNotice.forEach((x : any ) => x.nRunning = false);
                this.rerender();
                this.masterSelect = false;
              });
              if(bar){
                //console.log(this.retNoticeNo)
                if(this.result.notice_running){
                  var fineNotice = this.dataNotice.filter((x:any) => x.notice_running === this.result.notice_running);
                    if(fineNotice.length){
                      this.resultTmp = JSON.parse(JSON.stringify(fineNotice[0]));
                    }
                }
                
                if(this.retNoticeNo != null){
                  //var noticeArray = Object.values(this.retNoticeNo)
                  var noticeArray = this.retNoticeNo;
                  console.log(noticeArray)
                  for (var x = 0; x < this.dataNotice.length; x++) {
                    if(noticeArray.includes(this.dataNotice[x].notice_running)){
                      this.dataNotice[x].nRunning = true;
                    }
                    this.dataNotice[x].napoint_date = this.convDate(this.dataNotice[x].appoint_date);
                  }
                  this.retNoticeNo = null;
                }
                this.SpinnerService.hide();
              }
            }else{
              this.dataNotice = [];
              this.rerender();
              this.SpinnerService.hide();
              this.masterSelect = false;
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
          "userToken" : this.userData.userToken
        });
        this.searchNoticeApi(student);
        console.log(student)
      }
    }else{
      var student = JSON.stringify({
        "notice_running" : this.result.notice_running,
        "userToken" : this.userData.userToken
      });
      if(this.result.notice_running)
        this.searchNoticeApi(student);
      console.log(student)
    }
    
      

  }

  searchNoticeApi(json:any){
    
    this.SpinnerService.show();
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNotice', json , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)

          if(productsJson.data.length){
            this.result = productsJson.data[0];
            this.resultTmp = JSON.parse(JSON.stringify(productsJson.data[0]));
            if(productsJson.data[0].run_id != this.runId){
              // this.runId = productsJson.data[0].run_id;
              this.runId = {'run_id' : productsJson.data[0].run_id,'nRunning' : this.result.notice_running,'counter' : Math.ceil(Math.random()*10000),'sendCase':1}
            }
            this.noticeRunning=this.result.notice_running;
            this.result.pprint_type = 1;
            if(this.result.prov_id)
              this.changeProv(this.result.prov_id,1);
            if(this.result.amphur_id)
              this.changeAmphur(this.result.amphur_id,1);
            if(this.result.tambon_id)
              this.changeTambon(this.result.tambon_id,1);
            this.getNoticeData(0);
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
                this.setDefPage();
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {}
      )
  }
  
  copyData(){
    if(!this.result.notice_running){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบเลขหมายที่ต้องการสำเนา กรุณาค้นหาหมาย');
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
        "notice_running" : this.result.notice_running,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      
      this.SpinnerService.show();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/copyNotice', student , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            confirmBox.setMessage('สำเนาข้อมูลหมายเรียบร้อยแล้ว');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.result.notice_running = productsJson.notice_running;
                this.searchNotice(1);
                this.getNoticeData(0);
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          }else{
            
            confirmBox.setMessage(productsJson.error);
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
          }
        },
        (error) => {}
      )
    }
  }

  cancelData(){
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataNotice.forEach((ele, index, array) => {
        if(ele.nRunning == true){
          del++;
        }
      });
    });
    if(bar){
      if(del){
        this.clickOpenMyModalComponent(12);
        //this.openbutton.nativeElement.click();
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องการยกเลิก');
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
      }
    }
  }

  deleteData(){
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataNotice.forEach((ele, index, array) => {
        if(ele.nRunning == true){
          del++;
        }
      });
    });
    if(bar){
      if(del){
        this.clickOpenMyModalComponent(13);
        //this.openbutton.nativeElement.click();
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องการลบ');
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
      }
    }
  }

  assignApp(val:any){
    if(val==1){
      this.result.app_type_desc = 'กำหนดอายุความ';
    }else{
      this.result.app_type_desc = 'กำหนดนัด';
    }
  }

  printWord(type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataNotice.forEach((ele, index, array) => {
        if(ele.nRunning == true){
          del++;
        }
      });
    });
    if(bar){
      if(del){
        confirmBox.setMessage('พิมพ์หมาย(A4) ใช้สำหรับพิมพ์หมายที่แสดงบนหน้าจอเท่านั้น ไม่สามารถพิมพ์หมายจากที่เลือกได้');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        if((this.result.notice_running && (!this.result.form_id || this.result.form_id==0)) || (!this.result.notice_running && (!this.result.form_id || this.result.form_id==0))){
      
          confirmBox.setMessage('กรุณาเลือกแบบหมาย');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
        }else{
          this.SpinnerService.show();
            var student = JSON.stringify({
              "notice_running" : this.result.notice_running,
              "form_size": type.toString(),
              "pgroup": "1",
              "userToken" : this.userData.userToken
            });
          console.log(student)
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          let headers = new HttpHeaders();
           headers = headers.set('Content-Type','application/json');
          this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/openNotice', student , {headers:headers}).subscribe(
            (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              console.log(productsJson)
              if(productsJson.result==1){
                this.SpinnerService.hide();
                console.log(productsJson.file)
                myExtObject.OpenWindowMax(productsJson.file);
                this.searchNotice(1);
              }else{
                confirmBox.setMessage(productsJson.error);
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
              }
            },
            (error) => {}
          )
        }
      }
    }
    
  }

  printWordIndex(notice_running:any){
    this.SpinnerService.show();
        var student = JSON.stringify({
          "notice_running" : notice_running,
          "form_size": 2,
          "pgroup": "1",
          "userToken" : this.userData.userToken
        });
      console.log(student)
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/openNotice', student , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            this.SpinnerService.hide();
            console.log(productsJson.file)
            myExtObject.OpenWindowMax(productsJson.file);
            //this.searchNotice(1);
          }else{
            confirmBox.setMessage(productsJson.error);
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
          }
        },
        (error) => {}
      )
    }

  printReport(type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var chkSel = false;
    var bar = new Promise((resolve, reject) => {
      chkSel = this.dataNotice.some(function(item:any) {
        return item.nRunning == true;
      })
    });
    if(bar){
      if(((this.result.notice_running && (!this.result.form_id || this.result.form_id==0)) || (!this.result.notice_running && (!this.result.form_id || this.result.form_id==0))) && !chkSel){
        confirmBox.setMessage('กรุณาเลือกแบบหมายหรือคลิกเลือกหมายที่ต้องการพิมพ์');
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
        if(chkSel){
          var notice_running = [];
          var bar2 = new Promise((resolve, reject) => {
            this.dataNotice.forEach((ele, index, array) => {
                  if(ele.nRunning == true){
                    notice_running.push(this.dataNotice[index].notice_running);
                  }
              });
          });
          if(bar2){
            console.log(notice_running.toString())
            var rptName = 'rfno0900';
            // For no parameter : paramData ='{}'
            var paramData ='{}';
            // For set parameter to report
              var paramData = JSON.stringify({
                "pgnotice_running" : notice_running.toString(),
                "pprint_type" : this.result.pprint_type,
                "pprint_by" : 1,
                "pcase_flag" : this.dataHead.case_flag
              });
              console.log(paramData)
              // alert(paramData);return false;
              this.printReportService.printReport(rptName,paramData);
          }
        }else{
          console.log(this.result.notice_running)
            var rptName = 'rfno0900';
            // For no parameter : paramData ='{}'
            var paramData ='{}';
            // For set parameter to report
              var paramData = JSON.stringify({
                "pgnotice_running" : this.result.notice_running,
                "pprint_type" : this.result.pprint_type,
                "pprint_by" : 1,
                "pcase_flag" : this.dataHead.case_flag
              });
              console.log(paramData)
              // alert(paramData);return false;
              this.printReportService.printReport(rptName,paramData);
        }
      }
    }

    /*
    if(!this.result.notice_running){
      confirmBox.setMessage('กรุณาค้นหาเลขหมาย');
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
      var rptName = 'rfno0900';
      // For no parameter : paramData ='{}'
      var paramData ='{}';
      // For set parameter to report
        var paramData = JSON.stringify({
          "pgnotice_running" : this.result.notice_running,
          "pprint_type" : this.result.pprint_type,
          "pprint_by" : 1,
          "pcase_flag" : this.dataHead.case_flag
        });
        console.log(paramData)
        // alert(paramData);return false;
        this.printReportService.printReport(rptName,paramData);
      
      
    }
    */
  }

  openPrint(type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.notice_running){
      confirmBox.setMessage('กรุณาค้นหาเลขหมาย');
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
    }else if(!this.resultTmp.form_id){
      confirmBox.setMessage('กรุณาเลือกแบบหมาย');
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
      let winURL = window.location.href.split("/#/")[0]+"/#/";
        //var name = 'win_'+Math.ceil(Math.random()*1000);
        var name = 'fno0910';
        //console.log(winURL+'ffn1600?run_id='+this.dataHead.run_id)
        if(this.dataHead.id)
          var case_no= this.dataHead.title+this.dataHead.id+"/"+this.dataHead.yy;
        else
          var case_no = '';
        if(this.dataHead.red_id)
          var red_no= this.dataHead.red_title+this.dataHead.red_id+"/"+this.dataHead.red_yy;
        else
          var red_no = '';
        var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
        var notice_type_id = this.resultTmp.notice_type_id?this.resultTmp.notice_type_id:'';
        var form_xml_name = this.resultTmp.xml_name?this.resultTmp.xml_name:'';
        myExtObject.OpenWindowMaxName(winURL+'fno0910?run_id='+run_id+'&notice_type_id='+notice_type_id+'&form_xml='+form_xml_name+'&case_no='+case_no+'&red_no='+red_no,name);
    }
  }

  clickOpenPopupLit(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    console.log(this.result.notice_running +"&"+ this.result.form_id )
    if(!this.result.notice_running || !this.result.form_id || this.result.form_id==0){
    confirmBox.setMessage('กรุณาเลือกแบบหมาย');
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
    }else
      this.clickOpenMyModalComponent(19);
  }

  checkAmt(){
    if(this.result.send_by==1){
      this.result.send_amt = this.userData.postAmt;
      this.result.post_type = 1;
    }else if(this.result.send_by!=1 && this.result.no_money==2){
      this.amtSentNotice(this.result.prov_id,this.result.amphur_id,this.result.tambon_id,this.result.moo,this.dataHead.case_court_type);
      this.result.post_type = null;
    }else if(this.result.no_money==1){
      this.result.send_amt = '';
      this.result.post_type = null;
    }
  }

  convDate(date:any){
    if(date){
      var dateArray = date.split('/');
      return dateArray[2]+dateArray[1]+dateArray[0];
    }else
      return '';
  }

  delWord(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
    confirmBox.setMessage('ลบไฟล์ WORD');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

    // Choose layout color type
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //============================================
            const confirmBox2 = new ConfirmBoxInitializer();
            confirmBox2.setTitle('ยืนยันการลบข้อมูล');
            confirmBox2.setMessage('ยืนยันการลบไฟล์ WORD อีกครั้ง');
            confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
        
            // Choose layout color type
            confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  var student = JSON.stringify({
                    "notice_running" : this.result.notice_running,
                    "userToken" : this.userData.userToken
                  });
                  console.log(student)
                  this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/delNoticeWord', student ).subscribe(
                    (response) =>{
                      let getDataOptions : any = JSON.parse(JSON.stringify(response));
                      console.log(getDataOptions)
                      const confirmBox3 = new ConfirmBoxInitializer();
                      confirmBox3.setTitle('ข้อความแจ้งเตือน');
                      if(getDataOptions.result==1){
          
                          //-----------------------------//
                          confirmBox3.setMessage('ลบไฟล์ WORD เรียบร้อยแล้ว');
                          confirmBox3.setButtonLabels('ตกลง');
                          confirmBox3.setConfig({
                              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              this.searchNotice(1);
                            }
                            subscription3.unsubscribe();
                          });
                          //-----------------------------//
          
                      }else{
                        //-----------------------------//
                          confirmBox3.setMessage(getDataOptions.error);
                          confirmBox3.setButtonLabels('ตกลง');
                          confirmBox3.setConfig({
                              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              this.SpinnerService.hide();
                            }
                            subscription3.unsubscribe();
                          });
                        //-----------------------------//
                      }
          
                    },
                    (error) => {}
                  )
                }
                subscription2.unsubscribe();
            });   
          //============================================
        }
        subscription.unsubscribe();
    });   
  }

  checkNoiceType(id:any){
    if(id==31){
      var student = JSON.stringify({
        "table_name" : "ppers_setup",
        "field_id" : "pers_no",
        "field_name" : "pers_desc",
        "condition" : " AND pers_no='13' AND pers_type='4'",
        "userToken" : this.userData.userToken
      });    
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getAllRecData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
          if(productsJson.length){
            this.result.noticeto_name = productsJson[0].pers_desc;

            this.result.addr = productsJson[0].address;
            this.result.addr_no = productsJson[0].addr_no;
            this.result.moo = productsJson[0].moo;
            this.result.soi = productsJson[0].soi;
            this.result.road = productsJson[0].road;
            this.result.near_to = '';
            this.result.prov_id = productsJson[0].prov_id;
            this.result.amphur_id = productsJson[0].amphur_id;
            this.result.tambon_id = productsJson[0].tambon_id;
            this.result.post_code = productsJson[0].post_code;
            this.result.tel = productsJson[0].tel_no;

            if(this.result.prov_id)
              this.changeProv(this.result.prov_id,1);
            if(this.result.amphur_id)
              this.changeAmphur(this.result.amphur_id,1);
            if(this.result.tambon_id)
              this.changeTambon(this.result.tambon_id,1);
          }else{
            this.result.item = '';
            this.result.noticeto_name = '';
            this.result.addr = '';
            this.result.addr_no = '';
            this.result.moo = '';
            this.result.soi = '';
            this.result.road = '';
            this.result.near_to = '';
            this.result.prov_id = '';
            this.result.amphur_id = '';
            this.result.tambon_id = '';
            this.result.post_code = '';
            this.result.tel = '';
          }
        },
        (error) => {}
      )
    }else{
      this.result.item = '';
      this.result.noticeto_name = '';
      this.result.addr = '';
      this.result.addr_no = '';
      this.result.moo = '';
      this.result.soi = '';
      this.result.road = '';
      this.result.near_to = '';
      this.result.prov_id = '';
      this.result.amphur_id = '';
      this.result.tambon_id = '';
      this.result.post_code = '';
      this.result.tel = '';
    }
  }

}







