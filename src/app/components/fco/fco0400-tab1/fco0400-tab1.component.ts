import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ViewChildren, QueryList, Injectable, Renderer2, Input, Output, EventEmitter,ViewEncapsulation } from '@angular/core';
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
import { tap, map, catchError,startWith } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
declare var myExtObject:any;
import { CaseService, Case } from 'src/app/services/case.service.ts';
import * as e from 'cors';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fco0400-tab1,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fco0400-tab1.component.html',
  styleUrls: ['./fco0400-tab1.component.css']
})

export class Fco0400Tab1Component implements AfterViewInit, OnInit, OnDestroy {
  title = 'datatables';
  toPage1:any = "fco0400";
  posts:any;
  std_id:any;
  std_prov_name:any;
  delList:any = [];
  search:any;
  masterSelected: boolean;
  checklist:any;
  checklist2:any;
  sessData:any;
  userData:any;
  programName: string;
  Datalist:any;
  result:any = []; hResult:any = [];
  getCaseType:any; getTitle:any;
  getRedTitle:any; getPtitle:any;
  myExtObject:any;
  noticeObject:any = [];
  run_id:any;run_seq:any;
  appData:any = []; caseData:any = [];
  modalType:any;
  dataDeleteSelect:any = [];
  getDocType:any; getDocTitle:any;
  getRealDocTitle:any; getReplyRunDocTitle:any;
  getPublishing:any; getIssueType:any;
  disp1:any; disp2:any;
  publish1:any; publishSel:any;
  tr1:any = true;
  issue:any = true;
  hid901:any = true; hid902:any = true; hid903:any = true;
  getFast:any; getSecret:any;
  getLitTypeItem:any;
  getRealSendDocData:any;
  getCourt:any;
  getPolice:any;
  getOrg:any;
  draftdocNo:any;
  loginComp:any;
  //param
  getUpdateCase:any;
  param:any;

  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  states:any = [];

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public listFieldSelect:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerApp: Subject<any> = new Subject<any>();

  @ViewChild('openbutton3', { static: true }) openbutton3: ElementRef;
  @ViewChild('closebutton3', { static: true }) closebutton3: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild('stateInput',{static: true}) stateInput : ElementRef;
  @ViewChild('iCourt',{static: true}) iCourt : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;

  @Input() set onUpdateCase(onUpdateCase:any) {
    if(onUpdateCase){
      this.getUpdateCase = [];
      this.getUpdateCase=JSON.parse(JSON.stringify(onUpdateCase));
      if(this.getUpdateCase.onUpdateCase){
        this.searchDocument(5);
      }
    }
  }

  @Input() set sendParam(sendParam:any) {
    if(sendParam){
      this.param = sendParam;
      console.log(this.param)
    }
  }
  @Output() sendCaseData = new EventEmitter<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadAddCaseComponent: boolean = false;
  public loadReqLawyerComponent: boolean = false;
  public loadModalCaseLitComponent: boolean = false;
  public loadPopupDocAppoinComponent: boolean = false;
  public loadMutipleComponent: boolean = false;
  public loadJudgeComponent: boolean = false;
  public loadPopupListReturnMappingComponent: boolean = false;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private renderer: Renderer2,
    private caseService: CaseService,
  ) {
    this.masterSelected = false
    this.stateCtrl = new FormControl();
  }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.setDefPage();
    this.setDefCase();
    this.genDocTitle();

    console.log('param',this.param);
    if(this.param){
      if(this.param['reply_run_seq']){
        this.result.reply_run_seq = this.param['reply_run_seq'];
        this.getReplyDoc();
      }

      if(this.param['run_seq']){
        this.result.run_seq = this.param['run_seq'];
        this.searchDocument(4);
      }

      if(this.param['run_id']){
        this.run_id = this.param['run_id'];
        this.searchCaseNo(3);
      }
    }
    //======================== authen ======================================
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fco0400"
    });
    this.http.post('/' + this.userData.appName + 'Api/API/authen', authen).subscribe(
      (response) => {
        let getDataAuthen:any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => { }
    )
    // ======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name": "pcase_type",
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
      },
      (error) => { }
    )
    //======================== pdoc_type ======================================
    var student = JSON.stringify({
      "table_name": "pdoc_type",
      "field_id": "doc_type_id",
      "field_name": "doc_type_desc",
      "order_by": " doc_type_id ASC",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        this.getDocType = getDataOptions;
      },
      (error) => { }
    )
    //======================== pdoc_title ======================================
    var student = JSON.stringify({
      "table_name": "pdoc_title",
      "field_id": "doc_title",
      "field_name": "doc_title",
      "condition": " AND in_out=1 GROUP BY doc_title",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        this.getReplyRunDocTitle = getDataOptions;
      },
      (error) => { }
    )
    //======================== pdoc_title ======================================
    var student = JSON.stringify({
      "table_name": "ppublishing_house",
      "field_id": "publishing_id",
      "field_name": "publishing_name",
      "field_name2": "publish_cost",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        this.getPublishing = getDataOptions;
      },
      (error) => { }
    )
    //======================== pdoc_title ======================================
    var student = JSON.stringify({
      "table_name": "plit_type",
      "field_id": "lit_type",
      "field_name": "lit_type_desc",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        this.getLitTypeItem = getDataOptions;
      },
      (error) => { }
    )
    //======================== autocomplete ======================================
    var student1 = JSON.stringify({
      "table_name": "pcourt", 
      "field_id": "court_id", 
      "field_name": "court_name", 
      "condition": " AND court_name is not null ",
      "userToken": this.userData.userToken
    });
    var student2 = JSON.stringify({
      "table_name": "ppolice", 
      "field_id": "police_id", 
      "field_name": "police_name",
      "condition": " AND police_flag=1 ",
      "userToken": this.userData.userToken
    });
    var student3 = JSON.stringify({
      "table_name": "porg", 
      "field_id": "org_id", 
      "field_name": "org_name",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student1).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        this.getCourt.forEach((x : any ) => x.fieldNameValue2 = 4);
        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student2).subscribe(
          (response) => {
            let getDataOptions:any = JSON.parse(JSON.stringify(response));
            this.getPolice = getDataOptions;
            this.getPolice.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString());
            this.getPolice.forEach((x : any ) => x.fieldNameValue2 = 5);

            this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student3).subscribe(
              (response) => {
                let getDataOptions:any = JSON.parse(JSON.stringify(response));
                this.getOrg = getDataOptions;
                this.getOrg.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
                this.getOrg = this.getOrg.filter((x:any) => x.fieldNameValue !== null); 
                this.getOrg.forEach((x : any ) => x.fieldNameValue2 = 6);
                //===================================
                // console.log(this.getCourt);
                var bar = new Promise((resolve, reject) => {
                  var concatData= this.getCourt.concat(this.getPolice, this.getOrg);
                  this.states =concatData;
                });
                if (bar) {
                  console.log(this.states);
                  this.filteredStates = this.stateCtrl.valueChanges.pipe(startWith(''),
                    map(state => state ? this.filterStates(state) : this.states.slice())
                  );
                }
                //===================================
              },
              (error) => { }
            )
          },
          (error) => { }
        )
      },
      (error) => { }
    )
    
    this.getIssueType = [{ fieldIdValue: 1, fieldNameValue: 'ส่งสำนวน' }, { fieldIdValue: 2, fieldNameValue: 'ส่งสำเนา' }];
    this.getFast = [{ fieldIdValue: 0, fieldNameValue: '----------เลือก---------' }, { fieldIdValue: 1, fieldNameValue: 'ด่วน' }, { fieldIdValue: 2, fieldNameValue: 'ด่วนมาก' }, { fieldIdValue: 3, fieldNameValue: 'ด่วนที่สุด' }];
    this.getSecret = [{ fieldIdValue: 0, fieldNameValue: '----------เลือก---------' }, { fieldIdValue: 1, fieldNameValue: 'ลับ' }, { fieldIdValue: 3, fieldNameValue: 'ลับมาก' }, { fieldIdValue: 4, fieldNameValue: 'ลับที่สุด' }];
  }

  filterStates(name: string) {
    console.log('filterStates',name);
      return this.states.filter((state:any) => state.fieldNameValue.includes(name));
  }

  onEnter(event: any){
    //console.log(event, this.stateCtrl);
    //if (event.fieldIdValue){
      this.result.court_id = event.fieldIdValue;
      this.result.doc_dest = event.fieldNameValue;
    //}
    //this.assignDocto(event.fieldNameValue2);
    if(event.fieldNameValue2==4)
      this.assignDocto(0);
  }

  setDefPage() {
    this.getRealSendDocData = [];
    this.caseData = []; this.appData = [];
    this.disp2 = '';
    this.publish1 = false;
    this.issue = false;
    this.result = [];
    this.result.run_seq = 0;
    this.result.edit_run_seq = 0;
    this.result.court_level = 1;
    this.result.doc_type = 1;
    this.result.send_rcv_date = myExtObject.curDate();
    this.result.doc_orig = this.userData.depName;
    this.result.fast = 0;
    this.result.secret = 0;
    this.result.run_doc_yy = myExtObject.curYear();
    this.result.real_doc_yy = myExtObject.curYear();
  }

  setDefCase() {
    // ข้อมูลเลขคดี
    this.hResult = [];
    this.hResult.court_id = this.userData.courtId;
    this.hResult.case_type = this.userData.defaultCaseType;
    this.changeCaseType();
    this.hResult.title = this.userData.defaultTitle;
    this.hResult.red_title = this.userData.defaultTitle;
    this.hResult.notice_type = '1';
    this.getNoticeNo(this.userData.courtId);
    this.hResult.case_cate_id = this.userData.defaultCaseCate;
    this.hResult.lit_type_item = 2;
    this.pTitle();
  }

  checkDisabled(subject_id:any) {
    if (subject_id == 90) {
      this.tr1 = false;
      this.hid901 = false;
      this.hid902 = false;
      this.hid903 = false;
    } else if (subject_id == 91) {
      this.hid902 = false;
      this.hid903 = false;
    } else {
      this.tr1 = true;;
      this.hid901 = true;
      this.hid902 = true;
      this.hid903 = true;
    }
  }

  genDocTitle() {
    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/genDocTitle', student).subscribe(
      (response) => {
        let productsJson:any = JSON.parse(JSON.stringify(response));
        // console.log(productsJson)
        this.getDocTitle = productsJson.data;
        this.getRealDocTitle = productsJson.data;

        productsJson.data.forEach((ele, index, array) => {
          this.getDocTitle[index].fieldIdValue = ele.doc_title_id;
          this.getDocTitle[index].fieldNameValue = ele.doc_title;

          this.getRealDocTitle[index].fieldIdValue = ele.doc_title_id;
          this.getRealDocTitle[index].fieldNameValue = ele.doc_title;

          if (ele.dep_use == this.userData.depCode) {
            this.result.run_doc_title = ele.doc_title;
            this.result.real_doc_title = ele.doc_title
            this.result.real_doc_id = ''
            this.result.draft_doc_no = ele.draft_doc_no;
          }
        });

        if (this.result.draft_doc_no == 1) {
          this.disp2 = '';
          this.runDocId(1);
        } else {
          this.disp2 = 'none';
        }
      },
      (error) => { }
    )
  }

  runDocId(type:any) {//1 runId , 2 runId And save
    if (this.result.run_doc_title && this.result.run_doc_yy) {
      var student = JSON.stringify({
        "run_doc_title": this.result.run_doc_title,
        "run_doc_yy": this.result.run_doc_yy,
        "in_out": 2,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/runDocNo', student).subscribe(
        (response) => {
          let productsJson:any = JSON.parse(JSON.stringify(response));
          // console.log(productsJson)
          this.result.run_doc_id = productsJson.run_doc_id;
          if(type == 2){//สร้าง/จัดเก็บเลขร่างหนังสือ
            this.submitForm();
          }
        },
        (error) => { }
      )
    }
  }

  runRealDocId(type:any) {//1 runId , 2 runId And save
    if (this.result.real_doc_title && this.result.real_doc_yy) {
      var student = JSON.stringify({
        "real_doc_title": this.result.real_doc_title,
        "real_doc_yy": this.result.real_doc_yy,
        "in_out": 2,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/runRealDocNo', student).subscribe(
        (response) => {
          let productsJson:any = JSON.parse(JSON.stringify(response));
          // console.log(productsJson)
          this.result.real_doc_id = productsJson.real_doc_id;
          if(type == 2){//สร้าง/จัดเก็บเลขร่างหนังสือ
            this.submitForm();
          }
        },
        (error) => { }
      )
    }
  }

  runDocTitle(event) {//เลขที่ร่างส่งหนังสือ
    this.result.real_doc_title = event;
    this.result.real_doc_id = '';

    this.result.draft_doc_no = this.getDocTitle.find((x:any) => x.fieldNameValue === event).draft_doc_no;
    if (this.result.draft_doc_no == 1) {
      this.disp2 = '';
      this.runDocId(1);
    } else {
      this.disp2 = 'none';
      this.result.run_doc_title = this.result.real_doc_title;
      this.result.run_doc_id = this.result.real_doc_id;
      this.result.run_doc_yy = this.result.real_doc_yy;
    }
  }

  runRealDocTitle(event) {//เลขที่ส่งหนังสือ
    if(!this.result.run_doc_id && this.result.real_doc_id)
      this.runRealDocId(1);

    this.result.draft_doc_no = this.getRealDocTitle.find((x:any) => x.fieldNameValue === event).draft_doc_no;
    if (this.result.draft_doc_no == 1) {
      // this.result.run_doc_title = event;
      this.disp2 = '';
      //this.runDocId(1);
    } else {
      this.disp2 = 'none';
      this.result.run_doc_title = this.result.real_doc_title;
      this.result.run_doc_id = this.result.real_doc_id;
      this.result.run_doc_yy = this.result.real_doc_yy;
    }
  }

  getReplyDoc(){//ตอบกลับหนังสือรับที่
    if (this.result.reply_run_seq) {
      var student = JSON.stringify({
        "run_seq": this.result.reply_run_seq,
        "in_out": 1,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/getDocData', student).subscribe(
        (response) => {
          let productsJson:any = JSON.parse(JSON.stringify(response));
          this.result.reply_run_doc_title = productsJson.data[0].run_doc_title;
          this.result.reply_run_doc_id = productsJson.data[0].run_doc_id;
          this.result.reply_run_doc_yy = productsJson.data[0].run_doc_yy;
        },
        (error) => { }
      )
    }
  }

  clickDocId(){
    if (!this.result.run_doc_id) {
      this.runDocId(1);
    }
  }

  clickRealDocId() {//วันที่ส่งหนังสือ 
    if (!this.result.real_doc_id) {
      this.runRealDocId(1);
    }
    this.result.real_send_date = myExtObject.curDate();
  }

  pTitle() {
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND special_case IN (1,2,6)",
      "order_by": " title DESC",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        this.getPtitle = getDataOptions;
        this.hResult.ptitle = this.getPtitle[0].fieldIdValue;
      },
      (error) => { }
    )
  }

  getPublishAmt(event:any) {
    if(event){
      var val = this.getPublishing.find((x:any) => x.fieldIdValue === event).fieldNameValue2;
      this.result.publish_amt = this.curencyFormat(val, 2);
    }else{
      this.result.publishing_id = "";
    }
  }

  curencyFormat(n:any, d:any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  curencyFormatRevmove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, "").slice(.00, -3);;
    } else {
      return "";
    }
  }

  changeCaseType() {
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='" + this.hResult.case_type + "' ",
      "order_by": " order_id ASC",
      "userToken": this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        this.getTitle = getDataOptions;
        if (this.hResult.case_type == this.userData.defaultCaseType)
          this.hResult.title = this.userData.defaultTitle;
        else
          this.hResult.title = this.getTitle[0].fieldIdValue;
      },
      (error) => { }
    )
    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='2' AND case_type='" + this.hResult.case_type + "'",
      "order_by": " order_id ASC",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        this.getRedTitle = getDataOptions;

        if (this.hResult.case_type == this.userData.defaultCaseType)
          this.hResult.red_title = this.userData.defaultRedTitle;
        else
          this.hResult.red_title = this.getRedTitle[0].fieldIdValue;
      },
      (error) => { }
    )
  }

  getNoticeNo(courrId:any) {
    if (courrId && !this.hResult.run_id) {
      var student = JSON.stringify({
        "table_name": "pcourt",
        "field_id": "std_id",
        "field_name": "court_name",
        "condition": " AND court_id='" + courrId + "'",
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson:any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.hResult.notice_court_running = productsJson[0].fieldIdValue;
            this.hResult.notice_yy = myExtObject.curYear();
          } else {
            this.hResult.notice_court_running = '';
            this.hResult.notice_yy = '';
          }
        },
        (error) => { }
      )
    }
  }

  async searchCaseNo(type:any): Promise<void> {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var objCase = [];
    if (type == 1) {
      objCase["type"] = 1;
      objCase["case_type"] = this.hResult.case_type;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      objCase["run_id"] = 0;
      objCase["title"] = this.hResult.title;
      objCase["id"] = this.hResult.id;
      objCase["yy"] = this.hResult.yy;
      const cars = await this.caseService.searchCaseNo(objCase);
      if(cars){
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          if (!this.hResult.lit_type_item)
            this.hResult.lit_type_item = 2;
          this.hResult.caseEvent = 1;//ค้นข้อมูล
          this.result.run_id = this.hResult.run_id;
          // this.sendCaseData.emit(this.result);
          this.getMapAppoint(1);//ข้อมูลนัด
        } else {
          confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
            }
            subscription.unsubscribe();
          });
        }
      }
    } else if (type == 2) {
      objCase["type"] = 2;
      objCase["case_type"] = this.hResult.case_type;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      objCase["run_id"] = 0;
      objCase["title"] = this.hResult.red_title;
      objCase["id"] = this.hResult.red_id;
      objCase["yy"] = this.hResult.red_yy;
      const cars = await this.caseService.searchCaseNo(objCase);
      if(cars){
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          if (!this.hResult.lit_type_item)
            this.hResult.lit_type_item = 2;
          this.hResult.caseEvent = 1;//ค้นข้อมูล
          this.result.run_id = this.hResult.run_id;
          // this.sendCaseData.emit(this.result);
          this.getMapAppoint(1);
        } else {
          confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
            }
            subscription.unsubscribe();
          });
        }
      }
    } else if (type == 3) {
      objCase["type"] = 3;
      objCase["run_id"] = this.run_id;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      const cars = await this.caseService.searchCaseNo(objCase);
      if(cars){
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          if (!this.hResult.lit_type_item)
            this.hResult.lit_type_item = 2;
          this.hResult.caseEvent = 1;//ค้นข้อมูล
          this.getMapAppoint(1);
          if (this.noticeObject.length) {
            this.hResult.notice_court_running = this.noticeObject[0].notice_court_running;
            this.hResult.notice_no = this.noticeObject[0].notice_no;
            this.hResult.notice_yy = this.noticeObject[0].notice_yy;
            this.hResult.notice_type = this.noticeObject[0].notice_type;
            // this.hResult.nbarcode = this.noticeObject[0].notice_barcode;
            this.noticeObject = [];
          }
          this.result.run_id = this.hResult.run_id;
          // this.sendCaseData.emit(this.result);
        }
      } else {
        confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
          }
          subscription.unsubscribe();
        });
      }
    } else if (type == 4) {//ค้นหาหมายเลขคดีฝากขัง
      objCase["type"] = 4;
      objCase["case_type"] = this.hResult.case_type;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      objCase["run_id"] = 0;
      objCase["ptitle"] = this.hResult.ptitle;
      objCase["pid"] = this.hResult.pid;
      objCase["pyy"] = this.hResult.pyy;
      const cars = await this.caseService.searchCaseNo(objCase);
      if(cars){
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          if (!this.hResult.lit_type_item)
            this.hResult.lit_type_item = 2;
          this.hResult.caseEvent = 1;//ค้นข้อมูล
          this.result.run_id = this.hResult.run_id;
          // this.sendCaseData.emit(this.result);
          
          this.getMapAppoint(1);
        } else {
          confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
            }
            subscription.unsubscribe();
          });
        }
      }
    }
  }

  getMapAppoint(type:any) {
    if (this.hResult.run_id && this.result.run_seq) {
      var student = JSON.stringify({
        "run_id": this.hResult.run_id,
        "run_seq": this.result.run_seq,
        "userToken": this.userData.userToken
      });
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/getMapAppointData', student).subscribe(
        datalist => {
          let getDataOptions:any = JSON.parse(JSON.stringify(datalist));
          if (getDataOptions.data.length > 0) {
            this.appData = getDataOptions.data;
            this.rerender();
          } else {
            this.appData = [];
          }
          if(type == 2)
            this.SpinnerService.hide();
        },
        (error) => { }
      );
    }
  }

  searchNotice(type:any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (type == 1) {
      if (!this.hResult.notice_court_running || !this.hResult.notice_no || !this.hResult.notice_yy) {

        confirmBox.setMessage('กรุณาระบุรหัสหมายให้ครบถ้วน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
          }
          subscription.unsubscribe();
        });
      } else {
        var student = JSON.stringify({
          "notice_type": this.hResult.notice_type,
          "notice_court_running": this.hResult.notice_court_running,
          "notice_no": this.hResult.notice_no,
          "notice_yy": this.hResult.notice_yy,
          "userToken": this.userData.userToken
        });
      }
    } else {
      if (!this.hResult.nbarcode) {
        confirmBox.setMessage('กรุณาระบุ barcode หมาย');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
          }
          subscription.unsubscribe();
        });
      } else {
        var student = JSON.stringify({
          "notice_barcode": this.hResult.nbarcode,
          "userToken": this.userData.userToken
        });
      }
    }
    this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/getNotice', student).subscribe(
      (response) => {
        let productsJson:any = JSON.parse(JSON.stringify(response));
        if (productsJson.data.length) {
          this.noticeObject = productsJson.data;
          this.run_id = productsJson.data[0].run_id;
          this.searchCaseNo(3);
        } else {
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage(productsJson.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {}
            subscription.unsubscribe();
          });
        }
      },
      (error) => { }
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
    this.dtTriggerApp.next(null);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtTriggerApp.next(null);
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerApp.unsubscribe();
  }

  setFocus(name:any) {
  }

  directiveDate(date:any, obj:any) {
    this.result[obj] = date;
  }

  ClearAll() {
    window.location.reload();
  }
  
  clickOpenMyModalComponent(type:any) {
    if (type == 10 && this.result.run_seq && !this.hResult.run_id){
      if(this.caseData.length > 0)
        this.hResult.run_id = this.caseData[0].run_id;
    } 
    if ((type == 10 || type == 14 || type == 12 || type == 13) && !this.hResult.run_id) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else {
      this.modalType = type;
      this.openbutton3.nativeElement.click();
    }
  }

  loadMyModalComponent() {
    this.listTable = '';
    this.listFieldId = '';
    this.listFieldName = '';
    this.listFieldName2 = '';
    this.listFieldCond = '';
    this.listFieldType = '';

    if (this.modalType == 1 || this.modalType == 3 || this.modalType == 4 || this.modalType == 5 ||
      this.modalType == 6 || this.modalType == 7 || this.modalType == 9 || this.modalType == 15 || this.modalType == 17) {
      if (this.modalType == 1) {
        var student = JSON.stringify({
          "table_name": "pdoc_sub_type", 
          "field_id": "doc_sub_type_id", 
          "field_name": "doc_sub_type_name",
          "condition": " AND doc_type_id='" + this.result.doc_type + "' ",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pdoc_sub_type';
        this.listFieldId = 'doc_sub_type_id';
        this.listFieldName = 'doc_sub_type_name';
        this.listFieldName2 = '';
        this.listFieldCond = " AND doc_type_id='" + this.result.doc_type + "' ";
      } else if (this.modalType == 3) {
        var student = JSON.stringify({
          "table_name": "pcontent_form",
          "field_id": "form_running",
          "field_name": "form_name",
          "field_name2": "form_add",
          "condition": " AND court_running='" + this.userData.courtRunning + "' ",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pcontent_form';
        this.listFieldId = 'form_running';
        this.listFieldName = 'form_name';
        this.listFieldName2 = "form_add";
        this.listFieldCond = " AND court_running='" + this.userData.courtRunning + "' ";
      } else if (this.modalType == 4) {
        var student = JSON.stringify({
          "table_name": "pcourt", 
          "field_id": "court_id", 
          "field_name": "court_name", 
          "userToken": this.userData.userToken
        });
        this.listTable = 'pcourt';
        this.listFieldId = 'court_id';
        this.listFieldName = 'court_name';
        this.listFieldName2 = '';
        this.listFieldCond = '';
      } else if (this.modalType == 5) {
        var student = JSON.stringify({
          "table_name": "ppolice", 
          "field_id": "police_id", 
          "field_name": "police_name",
          "condition": " AND police_flag=1 ",
          "userToken": this.userData.userToken
        });
        this.listTable = 'ppolice';
        this.listFieldId = 'police_id';
        this.listFieldName = 'police_name';
        this.listFieldName2 = '';
        this.listFieldCond = " AND police_flag=1 ";
      } else if (this.modalType == 6) {
        var student = JSON.stringify({
          "table_name": "porg", 
          "field_id": "org_id", 
          "field_name": "org_name",
          "userToken": this.userData.userToken
        });
        this.listTable = 'porg';
        this.listFieldId = 'org_id';
        this.listFieldName = 'org_name';
        this.listFieldName2 = '';
        this.listFieldCond = "";
      } else if (this.modalType == 7) {
        var student = JSON.stringify({
          "table_name": "pdoc_to", 
          "field_id": "docto_id", 
          "field_name": "docto_desc",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pdoc_to';
        this.listFieldId = 'docto_id';
        this.listFieldName = 'docto_desc';
        this.listFieldName2 = '';
        this.listFieldCond = '';
      } else if (this.modalType == 9) {
        var student = JSON.stringify({
          "table_name": "pconciliate", 
          "field_id": "conciliate_id", 
          "field_name": "conciliate_name",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pconciliate';
        this.listFieldId = 'conciliate_id';
        this.listFieldName = 'conciliate_name';
        this.listFieldName2 = '';
        this.listFieldCond = '';
      } else if (this.modalType == 15) {
        var student = JSON.stringify({
          "table_name": "pofficer", 
          "field_id": "off_id", 
          "field_name": "off_name", 
          "userToken": this.userData.userToken
        });
        this.listTable = 'pofficer';
        this.listFieldId = 'off_id';
        this.listFieldName = 'off_name';
        this.listFieldName2 = '';
        this.listFieldCond = '';
      } else if (this.modalType == 17) {
        var student = JSON.stringify({
          "table_name": "pcoorp_setup", 
          "field_id": "co_id", 
          "field_name": "co_desc",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pcoorp_setup';
        this.listFieldId = 'co_id';
        this.listFieldName = 'co_desc';
        this.listFieldName2 = '';
        this.listFieldCond = '';
      }
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          this.list = response;
          $(".modal-backdrop").remove();
          this.loadComponent = true;
          this.loadModalComponent = false;
          this.loadAddCaseComponent = false;
          this.loadReqLawyerComponent = false;
          this.loadModalCaseLitComponent = false;
          this.loadPopupDocAppoinComponent = false;
          this.loadMutipleComponent = false;
          this.loadJudgeComponent = false;
          this.loadPopupListReturnMappingComponent = false;

          $("#exampleModal-3").find(".modal-content").css("width", "650px");
          $("#exampleModal-3").find(".modal-body").css("height", "auto");
          $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
        },
        (error) => { }
      )
    } else if (this.modalType == 13) {
      this.run_id = this.hResult.run_id;
      var student = JSON.stringify({
        "table_name": "pcase_litigant",
        "field_id": "seq",
        "field_name": "CONCAT(title || name , '') AS fieldNameValue",
        "condition": " AND run_id=" + this.run_id + " AND lit_type=" + this.hResult.lit_type_item + "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pcase_litigant';
      this.listFieldId = 'seq';
      this.listFieldName = "CONCAT(title || name , '') AS fieldNameValue";
      this.listFieldName2 = '';
      this.listFieldCond = "AND run_id=" + this.run_id + " AND lit_type'" + this.hResult.lit_type_item + "";

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          this.list = response;

          $(".modal-backdrop").remove();
          this.loadComponent = false;
          this.loadModalComponent = false;
          this.loadAddCaseComponent = false;
          this.loadReqLawyerComponent = false;
          this.loadModalCaseLitComponent = false;
          this.loadPopupDocAppoinComponent = false;
          this.loadMutipleComponent = true;
          this.loadJudgeComponent = false;
          this.loadPopupListReturnMappingComponent = false;

          $("#exampleModal-3").find(".modal-content").css("width", "750px");
          $("#exampleModal-3").find(".modal-body").css("height", "auto");
          $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
        },
        (error) => { }
      )
    } else if (this.modalType == 2) {
      $(".modal-backdrop").remove();
      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadAddCaseComponent = false;
      this.loadReqLawyerComponent = false;
      this.loadModalCaseLitComponent = false;
      this.loadPopupDocAppoinComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadPopupListReturnMappingComponent = true;

      $("#exampleModal-3").find(".modal-content").css("width", "650px");
      $("#exampleModal-3").find(".modal-body").css("height", "auto");
      $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
      /*var student = JSON.stringify({
        "table_name": "pcontent_form_mapping", 
        "field_id": "form_running", 
        "field_name": "form_name", 
        "field_name2": "form_add",
        "condition": " AND court_running='" + this.userData.courtRunning + "' AND dep_use='" + this.userData.depCode + "' ",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pcontent_form_mapping';
      this.listFieldId = 'form_running';
      this.listFieldName = 'form_name';
      this.listFieldName2 = "form_add";
      this.listFieldCond = " AND court_running='" + this.userData.courtRunning + "'  AND dep_use='" + this.userData.depCode + "' ";
      */
    } else if (this.modalType == 8) {//popuplist_lawyer
      $(".modal-backdrop").remove();
      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadAddCaseComponent = false;
      this.loadReqLawyerComponent = true;
      this.loadModalCaseLitComponent = false;
      this.loadPopupDocAppoinComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadPopupListReturnMappingComponent = false;

      $("#exampleModal-3").find(".modal-content").css("width", "950px");
      $("#exampleModal-3").find(".modal-body").css("height", "auto");
      $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
    } else if (this.modalType == 10 || this.modalType == 14) {//popup_case_litigant 
      this.run_id = this.hResult.run_id;
      this.listTable = '2';
      $(".modal-backdrop").remove();
      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadAddCaseComponent = false;
      this.loadReqLawyerComponent = false;
      this.loadModalCaseLitComponent = true;
      this.loadPopupDocAppoinComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadPopupListReturnMappingComponent = false;

      $("#exampleModal-3").find(".modal-content").css("width", "650px");
      $("#exampleModal-3").find(".modal-body").css("height", "auto");
      $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
    } else if (this.modalType == 11) {//บันทึกข้อมูลคดี(หลายคดี)
      $(".modal-backdrop").remove();
      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadAddCaseComponent = true;
      this.loadReqLawyerComponent = false;
      this.loadModalCaseLitComponent = false;
      this.loadPopupDocAppoinComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadPopupListReturnMappingComponent = false;

      $("#exampleModal-3").find(".modal-content").css("width", "980px");
      $("#exampleModal-3").find(".modal-body").css("height", "450px");
      $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
    } else if (this.modalType == 12) {//ข้อมูลนัด popup_doc_appoint
      if (this.hResult.run_id && this.result.run_seq) {
        this.run_id = this.hResult.run_id;
        this.run_seq = this.result.run_seq;
        $(".modal-backdrop").remove();
        this.loadComponent = false;
        this.loadModalComponent = false;
        this.loadAddCaseComponent = false;
        this.loadReqLawyerComponent = false;
        this.loadModalCaseLitComponent = false;
        this.loadPopupDocAppoinComponent = true;
        this.loadMutipleComponent = false;
        this.loadJudgeComponent = false;
        this.loadPopupListReturnMappingComponent = false;

        $("#exampleModal-3").find(".modal-content").css("width", "880px");
        $("#exampleModal-3").find(".modal-body").css("height", "auto");
        $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
      }
    } else if (this.modalType == 16) {//ผู้เซ็นต์หนังสือแสดงรายการข้อมูลผู้พิพากษา
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldName2 = '';
      this.listFieldCond = '';
      // this.listFieldName2 = "position";
      this.listFieldType = JSON.stringify({ "type": 2 });

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          let productsJson:any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
          } else {
            this.list = [];
          }
          $(".modal-backdrop").remove();
          this.loadComponent = false;
          this.loadModalComponent = false;
          this.loadAddCaseComponent = false;
          this.loadReqLawyerComponent = false;
          this.loadModalCaseLitComponent = false;
          this.loadPopupDocAppoinComponent = false;
          this.loadMutipleComponent = false;
          this.loadJudgeComponent = true;
          this.loadPopupListReturnMappingComponent = false;

          $("#exampleModal-3").find(".modal-content").css("width", "800px");
          $("#exampleModal-3").find(".modal-body").css("height", "auto");
          $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
        },
        (error) => { }
      )
    } else if (this.modalType == 'deleteAppRow' || this.modalType == 'changeDocument' || 
               this.modalType == 'deleteDocument' || this.modalType == 'deleteCaseRow') {
      $(".modal-backdrop").remove();
      this.loadComponent = false;
      this.loadModalComponent = true;
      this.loadAddCaseComponent = false;
      this.loadReqLawyerComponent = false;
      this.loadModalCaseLitComponent = false;
      this.loadPopupDocAppoinComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadPopupListReturnMappingComponent = false;

      $("#exampleModal-3").find(".modal-content").css("width", "650px");
      $("#exampleModal-3").find(".modal-body").css("height", "auto");
      $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
    } 
  }

  receiveAddCaseData(event:any) {//this.modalType == 11 บันทึกข้อมูลคดี(หลายคดี)
    this.btnSaveCases(event);
  }

  receiveFuncListData(event:any) {
    // console.log(event);
    if (this.modalType == 1) {
      this.result.doc_sub_type = event.fieldIdValue;
      this.result.doc_sub_type_name = event.fieldNameValue;
    } else if (this.modalType == 2) {
        this.result.subject_id = event.form_running;
        this.result.subject_name = event.form_name;
        this.getPublish(event.fieldIdValue, this.modalType);
    } else if (this.modalType == 3) {
    // } else if (this.modalType == 2 || this.modalType == 3) {
      this.result.subject_id = event.fieldIdValue;
      this.result.subject_name = event.fieldNameValue;
      this.getPublish(event.fieldIdValue, this.modalType);
    } else if (this.modalType == 4 || this.modalType == 5 || this.modalType == 6) {
      this.result.court_id = event.fieldIdValue;
      this.result.doc_dest = event.fieldNameValue;
      this.result.docto_desc = '';
      this.stateInput.nativeElement.value = event.fieldNameValue;
      if (this.modalType == 4 || this.modalType == 6 )
        this.assignDocto(this.modalType);
        
    } else if (this.modalType == 7 || this.modalType == 9) {
      this.result.docto_id = event.fieldIdValue;
      this.result.docto_desc = event.fieldNameValue;
      if (this.modalType == 7)
        this.getDocTo();
      if (this.modalType == 9)
        this.assignAdress(event); 
    } else if (this.modalType == 15) {
      this.result.sign_user_id = event.fieldIdValue;
      this.result.sign_user_name = event.fieldNameValue;
      this.getId(event.fieldIdValue,this.modalType);
      // this.getPost(event.fieldNameValue2, this.modalType);
    } else if (this.modalType == 17) {
      this.result.rcv_witness = event.fieldIdValue;
      this.result.rcv_witness_desc = event.fieldNameValue;
    }
    this.closebutton3.nativeElement.click();
  }

  getId(id:any, type:any){
    if(type == 15){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "condition" : " AND off_id='"+id+"' ",
        "userToken" : this.userData.userToken
      });
    }else if (type == 16){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "field_name2" : "post_id",
        "condition" : " AND judge_id='"+id+"' ",
        "userToken" : this.userData.userToken
      });
    }
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(getDataOptions.length){
          this.getPost(getDataOptions[0].fieldNameValue2,type);
        }
      },
      (error) => {}
    )
  }

  receiveFuncModalListData(event:any) {//this.modalType == 10, 14
    console.log(event);
    if (this.modalType == 10) {
      this.result.docto_id = event.seq;
      this.result.docto_desc = event.lit_name;

      this.assignAdress(event);

    } else if (this.modalType == 14) {
      this.hResult.lit_type_item = event.lit_type;
      this.hResult.accu_item = event.seq;
      this.hResult.accu_item_name = event.lit_name;
    }
    this.closebutton3.nativeElement.click();
  }

  receiveFuncMutipleListData(event:any) {//this.modalType == 13
    // console.log(event);
    this.hResult.accu_item = event.fieldIdValue;
    this.hResult.accu_item_name = event.fieldNameValue;

    this.closebutton3.nativeElement.click();
  }

  receiveReqLawyeData(event:any) {//this.modalType == 8
    console.log(event);
    this.result.docto_id2 = event.lawyer_id;
    this.result.docto_desc = event.lawyer_name;

    this.assignAdress(event);

    this.closebutton3.nativeElement.click();
  }

  receiveFuncJudgeListData(event:any) {//this.modalType == 16
    // console.log(event);
    this.result.sign_user_id = event.judge_id;
    this.result.sign_user_name = event.judge_name;
    // this.result.sign_user_position = event.post_name;
    this.getId(event.fieldIdValue,this.modalType);
    this.closebutton3.nativeElement.click();
  }

  assignAdress(event:any){
    if(this.modalType == 8 || this.modalType == 10){
      this.result.addr_no = event.addr_no;
      this.result.moo = event.moo;
      this.result.soi = event.soi;
      this.result.road = event.road;
      this.result.prov_id = event.prov_id;
      this.result.prov_name = event.prov_name;
      this.result.amphur_id = event.amphur_id;
      this.result.amphur_name = event.amphur_name;
      this.result.tambon_id = event.tambon_id;
      this.result.tambon_name = event.tambon_name;
      this.result.post_no = event.post_no;	
    }else if(this.modalType == 9){
      
    }
  }

  getDocTo(){
    if(!this.result.doc_dest)
      this.result.doc_dest = '';
    this.result.docto_desc = this.result.docto_desc + this.result.doc_dest;
  }

  assignDocto(type:any){
    if(type == 6){
      this.result.getAddress = 1;
    }else{
      this.result.getAddress = 0;
    }
    var docDesc=this.result.doc_dest;
    var ret=docDesc.indexOf('ศาล');
    //console.log(docDesc, ret,this.result.run_seq);
    // if(this.result.run_seq == 0  || type == 4 || type == 6){
    if(type == 0  || type == 4 || type == 6){
      if(ret == 1){
        var student = JSON.stringify({
          "table_name": "pcourt",
          "field_id": "court_id",
          "field_name": "director",
          "condition": " AND court_id='" + this.result.court_id + "' ",
          "userToken": this.userData.userToken
        });
        this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
          (response) => {
            let productsJson:any = JSON.parse(JSON.stringify(response));
            if (productsJson.length > 0) {
              if(productsJson[0].fieldNameValue)
                this.result.docto_desc = productsJson[0].fieldNameValue;
            }
          },
          (error) => { }
        )
      }else if(ret == 0){
        var student = JSON.stringify({
          "table_name": "pcourt",
          "field_id": "court_id",
          "field_name": "director_post",
          "condition": " AND court_id='" + this.result.court_id + "' ",
          "userToken": this.userData.userToken
        });
        this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
          (response) => {
            let productsJson:any = JSON.parse(JSON.stringify(response));
            if (productsJson.length > 0) {
              if(productsJson[0].fieldNameValue)
                this.result.docto_desc = productsJson[0].fieldNameValue  + this.result.doc_dest;
            }else{
              this.result.docto_desc = '';
            } 
          },
          (error) => { }
        )
      }
    }
  }

  saveDocAppoint(event:any) {//this.modalType == 12 ปุ่มข้อมูลนัด
    // console.log(event);
    this.closebutton3.nativeElement.click();

    var dataAdd = [], dataTmp = [];
    var bar = new Promise((resolve, reject) => {
      event.forEach((ele, index, array) => {
        ele.run_seq = this.result.run_seq;
        if (ele.index == true) {
          dataTmp.push(event[index]);
        } else if (ele.index == false) {
          if (ele.edit_app_seq) {
            event[index].del = 1;
            dataTmp.push(event[index]);
          }
        }
      });
    });
    if (bar) {
      dataAdd['userToken'] = this.userData.userToken;
      dataAdd['run_seq'] = this.result.run_seq;
      dataAdd['run_id'] = this.hResult.run_id;
      dataAdd['data'] = dataTmp;
      var data = $.extend({}, dataAdd);
      // console.log(data);

      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      this.SpinnerService.show();
      this.http.disableHeader().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/saveDocAppoint', data).subscribe(
        (response) => {
          let alertMessage:any = JSON.parse(JSON.stringify(response));
          // console.log(alertMessage);
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
              }
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();
            confirmBox.setMessage('ข้อความแจ้งเตือน');
            confirmBox.setMessage('จัดเก็บข้อมูลแล้ว');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) { 
                this.SpinnerService.show();
                this.getMapAppoint(2);
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  getPublish(subject_id:any, edit:any) {//edit = 1 editData
    if (subject_id) {
      var student = JSON.stringify({
        "table_name": "pcontent_form",
        "field_id": "content_type",
        "field_name": "thing",
        "field_name2": "thing2",
        "field_name3": "thing3",
        "condition": " AND form_running='" + subject_id + "'",
        "userToken": this.userData.userToken
      });
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson:any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            //getPublish
            this.publishSel = productsJson[0].fieldIdValue;
            if (this.publishSel == 1) {
              this.publish1 = true;
              this.issue = false;
            } else if (this.publishSel == 2 || this.publishSel == 5) {
              this.publish1 = false;
              this.issue = true;
            } else if (this.publishSel == 5) {
              this.publish1 = false;
            } else {
              this.publish1 = false;
              this.issue = false;
              this.tr1 = true;
            }
            //getThing
            if (edit != 1) {
              if (productsJson[0].fieldNameValue)
                this.result.thing1 = productsJson[0].fieldNameValue;
              if (productsJson[0].fieldNameValue2)
                this.result.thing2 = productsJson[0].fieldNameValue2;
              if (productsJson[0].fieldNameValue3)
                this.result.thing3 = productsJson[0].fieldNameValue3;
            }
          }
        },
        (error) => { }
      )
    }
  }

  getPost(post_id:any, modalType:any) {
    // console.log('getPost', post_id);
    if (post_id) {
      var student = JSON.stringify({
        "table_name": "pposition",
        "field_id": "post_id",
        "field_name": "post_name",
        "condition": " AND post_id='" + post_id + "'",
        "userToken": this.userData.userToken
      });
      // console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson:any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.sign_user_position = productsJson[0].fieldNameValue;
          } else {
            this.result.sign_user_position = '';
          }
        },
        (error) => { }
      )
    }
  }

  tabChangeSelect(objId:any, objName:any, event:any) {
    //console.log(objId);
    if (objId == "doc_sub_type") {
      var student = JSON.stringify({
        "table_name": "pdoc_sub_type",
        "field_id": "doc_sub_type_id",
        "field_name": "doc_sub_type_name",
        "condition": " AND doc_type_id='" + this.result.doc_type + "' AND doc_sub_type_id='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    } else if (objId == "subject_id") {
      var student = JSON.stringify({
        "table_name": "pcontent_form",
        "field_id": "form_running",
        "field_name": "form_name",
        "condition": " AND court_running=" + this.userData.courtRunning + " AND form_running=" + event.target.value + "",
        "userToken": this.userData.userToken
      });
    } else if (objId == "court_id") {
      var student = JSON.stringify({
        "table_name": "pcourt",
        "field_id": "court_id",
        "field_name": "court_name",
        "condition": " AND court_id='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    } else if (objId == "docto_id") {
      var student = JSON.stringify({
        "table_name": "pdoc_to",
        "field_id": "docto_id",
        "field_name": "docto_desc",
        "condition": " AND docto_id='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    } else if (objId == "sign_user_id") {
      var student = JSON.stringify({
        "table_name": "pofficer",
        "field_id": "off_id",
        "field_name": "off_name",
        "field_name2": "post_id",
        "condition": " AND off_id='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    }
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions,event.target.value);
        if (getDataOptions.length) {
          this.result[objId] = getDataOptions[0].fieldIdValue;
          this.result[objName] = getDataOptions[0].fieldNameValue;

          if (objId == "sign_user_id"){
            this.getPost(getDataOptions[0].fieldNameValue2, '');
          }else if (objId == "subject_id"){
            this.getPublish(getDataOptions[0].fieldIdValue, '');
          }else if (objId == "court_id"){
            if(event.target.value!=" "){
              //console.log(getDataOptions[0].fieldNameValue);
              this.iCourt.nativeElement.focus();
              this.stateInput.nativeElement.value = getDataOptions[0].fieldNameValue;
              this.result.doc_dest = getDataOptions[0].fieldNameValue;
              this.assignDocto(0);
            }else{
              this.result.court_id = "";
              this.stateInput.nativeElement.value = "";
            }
          }else if(objId == "docto_id"){
            this.getDocTo();
          }
        } else {
          if (objId == "court_id"){
            this.result.court_id = "";
            this.stateInput.nativeElement.value = "";
          }else{
            this.result[objId] = "";
            this.result[objName] = "";
          }
        }
      },
      (error) => { }
    )
  }

  tabChangeSelect2(objId:any, objName:any, event:any) {
    // console.log(this.hResult.run_id, objId);
    if (this.hResult.run_id) {
      if (objId == "accu_item") {
        var student = JSON.stringify({
          "table_name": "pcase_litigant",
          "field_id": "seq",
          "field_name": "CONCAT(title || name, '') AS fieldNameValue",
          "condition": " AND run_id=" + this.hResult.run_id + " AND lit_type=" + this.hResult.lit_type_item + ""+ " AND seq=" + event.target.value + "",
          "userToken": this.userData.userToken
        });
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
          (response) => {
            let getDataOptions:any = JSON.parse(JSON.stringify(response));
            // console.log(getDataOptions)
            if (getDataOptions.length) {
              this.hResult[objId] = getDataOptions[0].fieldIdValue;
              this.hResult[objName] = getDataOptions[0].fieldNameValue;
            } else {
              this.hResult[objId] = "";
              this.hResult[objName] = "";
            }
          },
          (error) => { }
        )
      }
    }
  }

  confirmBox() {
    var isChecked = this.posts.every(function (item:any) {
      return item.edit0721 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ไม่พบเงื่อนไข?');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการลบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else {
      this.openbutton3.nativeElement.click();
    }
  }

  submitModalForm() {
    var chkForm = JSON.parse(this.child.ChildTestCmp());
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!chkForm.password) {
      confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });

    } else if (!chkForm.log_remark) {
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else {
      var student = JSON.stringify({
        "user_running": this.userData.userRunning,
        "password": chkForm.password,
        "log_remark": chkForm.log_remark,
        "userToken": this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson:any = JSON.parse(JSON.stringify(posts));
          if (productsJson.result == 1) {
            if (this.modalType == "deleteAppRow") {
              this.SpinnerService.show();

              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.closebutton3.nativeElement.click();
                  
                  var dataDel = [];
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = this.dataDeleteSelect;
                  var data = $.extend({}, dataDel);
                  // console.log("data=>", data)
                  this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/delDocAppoint', data).subscribe(
                    (response) => {
                      let alertMessage:any = JSON.parse(JSON.stringify(response));
                      // console.log("alertMessage=>", alertMessage)
                      if (alertMessage.result == 1) {
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success == true) {}
                          subscription.unsubscribe();
                          this.modalType = "";
                          this.getMapAppoint(2);
                        });
                      }
                    },
                    (error) => { }
                  )
                }
                subscription2.unsubscribe();
              });

            } else if (this.modalType == "deleteDocument") {//ลบข้อมูลส่งหนังสือ
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลเลขหนังสือใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.closebutton3.nativeElement.click();

                  this.result['userToken'] = this.userData.userToken;
                  var data = $.extend({}, this.result);
                  // console.log("data=>", data)
                  this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/deleteDoc', data).subscribe(
                    (response) => {
                      let alertMessage:any = JSON.parse(JSON.stringify(response));
                      // console.log("alertMessage=>", alertMessage)
                      if (alertMessage.result == 1) {
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success == true) {
                            this.ngOnInit();
                          }
                          subscription.unsubscribe();
                        });
                      }
                    },
                    (error) => { }
                  )
                }
                subscription2.unsubscribe();
              });
            } else if (this.modalType == "deleteCaseRow") {//ลบข้อมูลเลขคดี
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลเลขคดีใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.closebutton3.nativeElement.click();

                  var dataDel = [];
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = this.dataDeleteSelect;
                  var data = $.extend({}, dataDel);
                  // console.log("data=>", data)
                  this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/delDocMapCase', data).subscribe(
                    (response) => {
                      let alertMessage:any = JSON.parse(JSON.stringify(response));
                      // console.log("alertMessage=>", alertMessage)
                      if (alertMessage.result == 1) {
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success == true) {}
                          subscription.unsubscribe();
                          this.modalType = "";
                          this.getMapCaseData();
                        });
                      }
                    },
                    (error) => { }
                  )
                }
                subscription2.unsubscribe();
              });
            } else if (this.modalType == "changeDocument") {
              this.loginComp = 1;
              this.closebutton3.nativeElement.click();
            }
          } else {
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {}
              subscription.unsubscribe();
            });
          }
        },
        (error) => { }
      );
    }
  }

  closeModal() {
    this.loadComponent = false;
    this.loadModalComponent = false;
    this.loadAddCaseComponent = false;
    this.loadReqLawyerComponent = false;
    this.loadModalCaseLitComponent = false;
    this.loadPopupDocAppoinComponent = false;
    this.loadMutipleComponent = false;
    this.loadJudgeComponent = false;
    this.loadPopupListReturnMappingComponent = false;

  }

  async editCaseData(runid:any, index:any): Promise<void> {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var objCase = [];
    if (runid) {
      objCase["type"] = 3;
      objCase["run_id"] = runid;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      const cars = await this.caseService.searchCaseNo(objCase);
      if (cars['result'] == 1) {
        this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
        if (!this.hResult.red_title)
          this.hResult.red_title = this.userData.defaultRedTitle;

        //this.fCaseType();
        this.hResult.caseEvent = 1;//ค้นข้อมูล
        this.hResult.run_seq = this.result.run_seq;
        this.hResult.edit_run_id = this.caseData[index].run_id;
        this.hResult.lit_type_item = this.caseData[index].lit_type;
        if (!this.hResult.lit_type_item)
            this.hResult.lit_type_item = 2;
        this.hResult.accu_item = this.caseData[index].accu_item;
        this.hResult.accu_item_name = this.caseData[index].accu_item_name;

        this.result.run_id = this.hResult.run_id;
        // this.sendCaseData.emit(this.result);
        this.getMapAppoint(1);
      }
    } else {
      confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    }
  }

  deleteAppData(index:any) { //ลบข้อมูลนัด
    // console.log("deleteData=>", this.appData[index]);
    this.dataDeleteSelect = [];
    this.dataDeleteSelect.push(this.appData[index]);
    this.modalType = "deleteAppRow";
    this.openbutton3.nativeElement.click();
  }

  deleteCaseData(index:any) { //ลบข้อมูลเลขคดี
    // console.log("deleteData=>", this.caseData[index]);
    this.dataDeleteSelect = [];
    this.dataDeleteSelect.push(this.caseData[index]);
    this.modalType = "deleteCaseRow";
    this.openbutton3.nativeElement.click();
  }

  searchDocument(type:any) {//barcode หนังสือ=1 ค้นหาร่าง=2 ค้นหาส่ง=3
    
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (type == 1 && !this.result.doc_barcode) {
      confirmBox.setMessage('กรุณาระบุ barcode ที่ต้องการค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else if ((type == 2) && (!this.result.run_doc_title || !this.result.run_doc_id || !this.result.run_doc_yy)) {
      confirmBox.setMessage('กรุณาระบุข้อมูลเลขที่ร่างส่งหนังสือที่ต้องการค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else if ((type == 3) && (!this.result.real_doc_title || !this.result.real_doc_id || !this.result.real_doc_yy)) {
      confirmBox.setMessage('กรุณาระบุข้อมูลเลขที่ส่งหนังสือที่ต้องการค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else{
      this.SpinnerService.show();
      if (type == 1) {
        var student = JSON.stringify({
          "barcode": this.result.doc_barcode,
          "userToken": this.userData.userToken
        });
      } else if (type == 2) {
        var student = JSON.stringify({
          "run_doc_title": this.result.run_doc_title,
          "run_doc_id": this.result.run_doc_id,
          "run_doc_yy": this.result.run_doc_yy,
          "in_out": 2,//2 ส่งหนังสือ
          "userToken": this.userData.userToken
        });
      } else if (type == 3) {
        var student = JSON.stringify({
          "real_doc_title": this.result.real_doc_title,
          "real_doc_id": this.result.real_doc_id,
          "real_doc_yy": this.result.real_doc_yy,
          "in_out": 2,//2 ส่งหนังสือ
          "userToken": this.userData.userToken
        });
      } else if (type == 4 || type == 5) {//4 หนังสือส่งที่เกี่ยวข้อง  5  ค้นหาจากการ update tab2
        var student = JSON.stringify({
          "run_seq": this.result.run_seq,
          "in_out": 2,//2 ส่งหนังสือ
          "userToken": this.userData.userToken
        });
      }
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/getDocData', student).subscribe(posts => {
        let productsJson:any = JSON.parse(JSON.stringify(posts));
        if (productsJson.result == 1) {
          this.SpinnerService.hide();
          if (productsJson.data.length > 0) {
            //ข้อมูลหนังสือส่ง
            this.result = productsJson.data[0];
            this.result.edit_run_seq = productsJson.data[0].run_seq;
            this.result.run_id = 0;
            this.result.real_doc_id = productsJson.data[0].real_doc_id ? productsJson.data[0].real_doc_id : '';
            this.result.real_doc_yy = productsJson.data[0].real_doc_yy ? productsJson.data[0].real_doc_yy : '';
            this.result.real_doc_title_old = productsJson.data[0].real_doc_title;
            this.result.real_doc_id_old = productsJson.data[0].real_doc_id ? productsJson.data[0].real_doc_id : '';
            this.result.real_doc_yy_old = productsJson.data[0].real_doc_yy ? productsJson.data[0].real_doc_yy : ''; 
            this.result.fast = productsJson.data[0].fast ? productsJson.data[0].fast : 0; 
            this.result.secret = productsJson.data[0].secret ? productsJson.data[0].secret : 0; 
            this.result.doc_barcode = productsJson.data[0].barcode; 
            this.stateInput.nativeElement.value = productsJson.data[0].doc_dest;
            
            if (productsJson.data[0]['draft_doc_no'] == 1) {
              this.disp2 = '';
            } else {
              this.disp2 = 'none';
            }
            this.getPublish(this.result.subject_id, 1);
  
            if (productsJson.data[0].publish_amt)
              this.result.publish_amt = this.curencyFormat(productsJson.data[0].publish_amt, 2);
  
            //หนังสือส่งที่เกี่ยวข้อง
            this.getRealSendDoc();
  
            this.checkDisabled(this.result.subject_id);
  
            //ข้อมูลคดี
            this.caseData = [];
            if (productsJson.case_data.length > 0){
              this.caseData = productsJson.case_data;
            }/*else{
              this.caseData = [];
            }*/
             this.rerender();
  
            if(type != 5){
              if(this.caseData.length > 0 )
                this.result.run_id = this.caseData[0].run_id;
              else
                this.result.run_id = '';
              this.sendCaseData.emit(this.result);
            }
  
            this.setDefCase();
            // this.hResult=[];
            this.appData=[];
            this.run_id="";
  
            /*if(!this.result.sign_user_name){
              if(this.userData.userLevel == 'S'){
                this.result.sign_user_id = this.programName.;
                this.result.sign_user_name = this.programName.postName;
                this.result.sign_user_position = this.programName;
              }
            }*/
            //console.log('result',this.result.real_doc_id);
          }
          if (type == 1 || type == 2 || type == 3){
            if(productsJson.error){
              confirmBox.setMessage(productsJson.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                }
                subscription.unsubscribe();
              });
            }
          }
  
        } else {
          this.SpinnerService.hide();
  
          confirmBox.setMessage(productsJson.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
            }
            subscription.unsubscribe();
          });
        }
      });
    }
  }

  getRealSendDoc() {
    var student = JSON.stringify({
      "run_seq": this.result.run_seq,
      "in_out": 2,//2 ส่งหนังสือ
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/getRealSendDoc', student).subscribe(posts => {
      let productsJson:any = JSON.parse(JSON.stringify(posts));
      this.getRealSendDocData = productsJson.data;
    });
  }

  clearBarcode(){
    this.result.doc_barcode = "";
  }

  openDoc(runSeq:any) {//หนังสือส่งที่เกี่ยวข้อง
    this.result.run_seq = runSeq;
    this.searchDocument(4);
  }

  getMapCaseData() {
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "run_seq": this.result.run_seq,
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/getMapCaseData', student).subscribe(posts => {
      let productsJson:any = JSON.parse(JSON.stringify(posts));
      // console.log("productsJson=>", productsJson);
      if (productsJson.result == 1) {

        if (productsJson.data.length > 0) {
          this.caseData = productsJson.data;
          this.rerender();
        }
      } else {
        this.caseData=[];
      }
      this.SpinnerService.hide();
    });
  }

  NewDoc(type:any) {//สร้าง/จัดเก็บเลขที่หนังสือ
    if(type == 1){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการสร้าง/จัดเก็บเลขร่างหนังสือ');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      // Choose layout color type
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          if(!this.result.run_doc_id){
            this.runDocId(2);
          }else{
            this.submitForm();
          }
        }
        subscription.unsubscribe();
      });
    }else if(type == 2){//สร้าง/จัดเก็บเลขที่หนังสือ
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการสร้าง/จัดเก็บเลขที่หนังสือ');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      // Choose layout color type
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          if(!this.result.real_doc_id){
            this.runRealDocId(2);
          }else{
            this.submitForm();
          }
        }
        subscription.unsubscribe();
      });
    }
  }

  changeDocument() {//login เพื่อแก้ไขเลขที่หนังสือ
    this.modalType = "changeDocument";
    this.openbutton3.nativeElement.click();
  }

  submitForm() {//จัดเก็บข้อมูล
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if ((!this.result.run_doc_title || !this.result.run_doc_id || !this.result.run_doc_yy) && this.result.draft_doc_no == 1) {
      confirmBox.setMessage('กรุณาระบุเลขที่ร่างส่งหนังสือ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else if ((!this.result.real_doc_title || !this.result.real_doc_id || !this.result.real_doc_yy) && this.result.draft_doc_no != 1) {
      confirmBox.setMessage('กรุณาระบุเลขที่ส่งหนังสือ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else if ((this.result.real_doc_title_old && this.result.real_doc_id_old && this.result.real_doc_yy_old) &&
      ((this.result.real_doc_title_old != this.result.real_doc_title) ||
        (this.result.real_doc_id_old != this.result.real_doc_id) ||
        (this.result.real_doc_yy_old != this.result.real_doc_yy)) &&
      (this.loginComp != 1)) {
      confirmBox.setMessage('กรุณา Login เพื่อแก้ไขเลขหนังสือ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else if ((this.publishSel == 2) && (this.result.issue_flag) && !this.hResult.run_id) {
      confirmBox.setMessage('คุณยังไม่ได้เลือกหมายเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else if ((this.publishSel == 2) && (this.result.issue_flag) && !this.result.court_id) {
      confirmBox.setMessage('คุณยังไม่ได้ป้อนศาลที่ส่งประเด็น');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else if ((this.publishSel == 2) && (this.result.issue_flag) && !this.result.real_send_date) {
      confirmBox.setMessage('คุณยังไม่ได้ป้อนวันที่ส่ง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    }else if(!this.result.result_date && this.result.rcv_witness_desc){//ผลการประสานงาน
      confirmBox.setMessage('คุณยังไม่ได้ป้อนวันที่ส่ง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else {
      if ((this.publishSel == 1) && ((this.caseData.length == 0 && this.hResult.run_id  =='') || !this.result.publishing_id || !this.result.publish_amt)) {
        confirmBox.setMessage('คุณยังไม่ได้ป้อนค่าประกาศหนังสือพิมพ์ , ยังไม่ได้เลือกสำนักพิมพ์ , ยังไม่ได้เลือกหมายเลขคดี กรุณาตรวจสอบหลังจากจัดเก็บข้อมูลเรียบร้อยแล้ว');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { 
          this.saveDoc();
        }
        subscription.unsubscribe();
      });
      }else{
        this.saveDoc();
      }
    }
  }

  saveDoc(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();

    if (this.result.draft_doc_no != 1) {
      this.result.run_doc_title = this.result.real_doc_title;
      this.result.run_doc_id = this.result.real_doc_id;
      this.result.run_doc_yy = this.result.real_doc_yy;
    }

    //ข้อมูลเลขคดี
    this.result.run_id = this.hResult.run_id;
    //ประเภทคู่ความ
    this.result.lit_type_item = this.hResult.lit_type_item;
    this.result.accu_item = this.hResult.accu_item;
    this.result.accu_item_name = this.hResult.accu_item_name;

    if (!this.result.publish_amt)
      this.result.publish_amt = 0;

      var data = [];
      if (this.hResult.run_id) {
        data.push({
          "run_id": this.hResult.run_id,
          "lit_type": this.hResult.lit_type_item,
          "accu_item": this.hResult.accu_item,
          "accu_item_name": this.hResult.accu_item_name,
        });
      }
    //parameter
    if(this.result.run_seq == 0){
      if(this.param){
        this.result.guar_running = this.param['guar_running'];
        this.result.asset_item = this.param['ast_item'];
        this.result.asset_type = this.param['ast_type'];
        this.result.guarman_item = this.param['guarman_item'];
        this.result.receipt_running = this.param['receipt_running'];
        this.result.led_running = this.param['led_running'];
        this.result.kp_notice_running = this.param['kp_notice_running'];
        this.result.notice_running = this.param['notice_running'];
        this.result.appeal_running = this.param['appeal_running'];
        this.result.appeal_type = this.param['appeal_type'];
        this.result.appeal_item = this.param['appeal_item'];
        this.result.case_running = this.param['case_running'];
        
      }
    }
    console.log(this.result.court_id)
    // console.log(this.stateInput.nativeElement.value)
    // if(this.stateInput.nativeElement.value)
      this.result.doc_dest =  this.stateInput.nativeElement.value ? this.stateInput.nativeElement.value : '';

    this.result.getAddress = this.result.getAddress ? this.result.getAddress : 0;
    this.result['in_out'] = 2;
    this.result['userToken'] = this.userData.userToken;
    var tmpData = ($.extend({}, this.result))
    tmpData['real_doc_id'] = this.result.real_doc_id ? this.result.real_doc_id : 0;
    tmpData['court_id'] = this.result.court_id ? this.result.court_id.toString() : null;
    tmpData["case_data"] = data;

    // console.log(tmpData)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiCO/API/CORRESP/fco0400/saveDoc', tmpData ).subscribe(
      (response) =>{
        let alertMessage :any = JSON.parse(JSON.stringify(response));
        if(alertMessage.result==0){
          this.SpinnerService.hide();
          confirmBox.setMessage(alertMessage.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
            }
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
              // if(this.param['run_id'])
              //   this.reloadData(alertMessage.run_seq);
              this.result.run_seq = alertMessage.run_seq;
              this.searchDocument(4);
            }
            subscription.unsubscribe();
          });
        }
      },
      (error) => {this.SpinnerService.hide();}
    )
  }

  copyDoc() {//สำเนาข้อมูล
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('คุณต้องการสำเนาข้อมูล');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    // Choose layout color type
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) {
        this.SpinnerService.show();

        var tmpData = JSON.stringify({
          "run_seq": this.result.run_seq,
          "in_out": 2,
          "userToken": this.userData.userToken
        });
        // console.log(tmpData)
        this.http.disableLoading().post('/'+this.userData.appName+'ApiCO/API/CORRESP/fco0400/copyDoc', tmpData ).subscribe(
          (response) =>{
            let alertMessage :any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==1){
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                this.result.run_seq = alertMessage.run_seq;
                this.searchDocument(4);
                subscription.unsubscribe();
              });
            }else{
              this.SpinnerService.hide();
              confirmBox.setMessage('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
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
          (error) => {this.SpinnerService.hide();}
          )
      }
      subscription.unsubscribe();//ลบ
    });
  }

  deleteDocument() {//ลบข้อมูลส่งหนังสือ
    this.modalType = "deleteDocument";
    this.openbutton3.nativeElement.click();
  }

  opentWord() {//พิมพ์หนังสือ MS Word
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.result.subject_id) {
      confirmBox.setMessage('คุณยังไม่เลือกเรื่อง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();

      var student = JSON.stringify({
        "run_seq": this.result.run_seq,
        "userToken": this.userData.userToken
      });

      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/openDocWord', student).subscribe(
        (response) => {
          let alertMessage:any = JSON.parse(JSON.stringify(response));
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {}
              subscription.unsubscribe();
            });
          } else {
            myExtObject.OpenWindowMax(alertMessage.file);
            this.getData();
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  deleteWord() {//ลบหนังสือ MS Word
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ลบไฟล์ word');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    if (resp.success == true) {
      subscription.unsubscribe();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ยืนยันการลบไฟล์ word อีกครั้ง');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription2 = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) {
        subscription2.unsubscribe();

        var student = JSON.stringify({
          "run_seq": this.result.run_seq,
          "userToken": this.userData.userToken
        });
        this.http.post('/'+this.userData.appName+'ApiCO/API/CORRESP/fco0400/deleteWord', student).subscribe(
          (response) =>{
            let alertMessage :any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==0){
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
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
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.getData();
                  subscription.unsubscribe();
                }
              });
            }
          },
          (error) => {subscription.unsubscribe();}
          )
        }
      });  
    }
    subscription.unsubscribe();
    });
  }

  getData(){
    if(this.result.run_seq){
      var student = JSON.stringify({
        "run_seq": this.result.run_seq,
        "in_out": 2,//2 ส่งหนังสือ
        "userToken": this.userData.userToken
      });

      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/getDocData', student).subscribe(posts => {
        let productsJson:any = JSON.parse(JSON.stringify(posts));
        if (productsJson.result == 1) {
          //this.SpinnerService.hide();
          if (productsJson.data.length > 0) {
            //ปุ่ม พิมพ์หนังสือ MS Word/ลบหนังสือ MS Word
            this.result.file_exists = productsJson.data[0].file_exists;
          }
        } 
      });
    }
  }
  // reloadData(runSeq:any){
  //   let winURL = window.location.href.split("/#/")[0] + "/#/";
  //   location.replace(winURL + this.toPage1)
  //   window.location.reload();
  // }

  buttonNew() {//เพิ่ม
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    location.replace(winURL + this.toPage1)
    window.location.reload();
  }

  btnSaveCases(event:any) {//บันทึกข้อมูลคดี(หลายคดี)
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (event.length == 0) {
      confirmBox.setMessage('ระบุข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else {
      this.closebutton3.nativeElement.click();
      this.SpinnerService.show();
      // console.log(event);
      var tmpRunId:any = [];
      for (let index = 0; index < event.length; index++) {
        var tmp = {
          "run_id": event[index].run_id
        };
        tmpRunId.push(tmp);
      }

      var student = JSON.stringify({
        "run_seq": this.result.run_seq,
        "userToken": this.userData.userToken,
        "data": tmpRunId
      });

      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/addDocMapCase', student).subscribe(
        (response) => {
          let alertMessage:any = JSON.parse(JSON.stringify(response));
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {}
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();
            confirmBox.setMessage('ข้อความแจ้งเตือน');
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {}
              this.getMapCaseData();
              subscription.unsubscribe();
            });
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  btnSaveCase() {//จัดเก็บข้อมูลคดี
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.hResult.run_id) {
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();

      var dataCase = JSON.stringify({
        "run_seq": this.result.run_seq,
        "run_id": this.hResult.run_id,
        "edit_run_seq": this.result.edit_run_seq,
        "edit_run_id": this.hResult.edit_run_id ? this.hResult.edit_run_id : 0,
        "lit_type": this.hResult.lit_type_item,
        "accu_item": this.hResult.accu_item,
        "accu_item_name": this.hResult.accu_item_name,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0400/saveDocMapCase', dataCase).subscribe(
        (response) => {
          let alertMessage:any = JSON.parse(JSON.stringify(response));
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {}
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();
            confirmBox.setMessage('ข้อความแจ้งเตือน');
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {}
              this.getMapCaseData();
              subscription.unsubscribe();
            });
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  btnNewDoc() {//เพิ่มข้อมูลคดี loadData
    this.setDefCase();
  }

  openOrg() {
    let toPage = "fct9916";
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage;
    myExtObject.OpenWindowMaxName(winURL,toPage);
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
}