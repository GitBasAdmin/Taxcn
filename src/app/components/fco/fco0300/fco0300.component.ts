import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ViewChildren, QueryList, Injectable, Renderer2, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
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
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
declare var myExtObject: any;
import { CaseService, Case } from 'src/app/services/case.service.ts';
import { tap, map, catchError, startWith } from 'rxjs/operators';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fco0300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fco0300.component.html',
  styleUrls: ['./fco0300.component.css']
})
export class Fco0300Component implements AfterViewInit, OnInit, OnDestroy {
  title = 'datatables';
  posts: any;
  caseData: any = []; procData: any = []; hData: any = [];
  search: any;
  masterSelected: boolean;
  checklist: any; checkedList: any;
  delValue: any;
  sessData: any;
  userData: any;
  programName: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  myExtObject: any;

  getCaseType: any; getTitle: any; getRedTitle: any;
  getPtitle: any; getCaseCate: any; getCourt: any; getOrg: any;
  getCaseCourtType: any; getCaseStatus: any; getCaseSpecial: any;

  getDocType: any; getDocTitle: any;
  getRealSendDocData: any;
  getIssueType: any; getFast: any;
  getSecret: any;
  getLitTypeItem: any;
  getOldCourt: any;;

  noticeObject: any = [];
  hResult: any = []; result: any = [];
  pResult: any = [];
  run_id: any; run_seq: any;
  modalType: any;
  dataDeleteSelect: any = []; procDeleteSelect: any = [];
  fileToUpload1: any; fileToUpload2: any; s_file1: any = [];
  loginComp: any;

  stateCtrl: FormControl;
  stateCtrl2: FormControl;
  filteredStates: Observable<any[]>;
  filteredStates2: Observable<any[]>;
  states: any = [];
  states2: any = [];
  param:any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;
  public listFieldSelect: any;

  asyncObservable: Observable<string>;
  currFieldset: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTriggerCase: Subject<any> = new Subject<any>();
  dtTriggerProc: Subject<any> = new Subject<any>();
  dtTriggerHis: Subject<any> = new Subject<any>();

  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadAddCaseComponent: boolean = false;
  public loadJudgeComponent: boolean = false;
  public loadSendDocComponent: boolean = false;

  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild('stateInput', { static: true }) stateInput: ElementRef;
  @ViewChild('stateInput2', { static: true }) stateInput2: ElementRef;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private caseService: CaseService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.stateCtrl = new FormControl();
    this.stateCtrl2 = new FormControl();
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
    
    this.activatedRoute.queryParams.subscribe(params => {
      this.param = params;

      if(this.param['run_seq']){
        this.result.run_seq = this.param['run_seq'];
        this.searchDocument(4);
      }

      if(this.param['run_id']){
        this.run_id = this.param['run_id'];
        this.searchCaseNo(3);
      }
    });

    
    this.successHttp();
    this.setDefPage();
    this.setDefCase();
    this.genDocTitle();

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
        // console.log(getDataOptions)
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
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getDocType = getDataOptions;
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
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getLitTypeItem = getDataOptions;
      },
      (error) => { }
    )

     //======================== pcourt ======================================
     var student = JSON.stringify({
      "table_name": "pcourt",
      "field_id": "court_id",
      "field_name": "court_name",
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

    //======================== autocomplete ======================================
    var student1 = JSON.stringify({
      "table_name": "pcourt",
      "field_id": "court_id",
      "field_name": "court_name",
      "userToken": this.userData.userToken
    });;
    var student2 = JSON.stringify({
      "table_name": "porg",
      "field_id": "org_id",
      "field_name": "org_name",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student1).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student2).subscribe(
          (response) => {
            let getDataOptions: any = JSON.parse(JSON.stringify(response));
            this.getOrg = getDataOptions;
            this.getOrg.forEach((x: any) => x.fieldIdValue = x.fieldIdValue.toString())
            this.getOrg = this.getOrg.filter((x: any) => x.fieldNameValue !== null);
            //===================================
            // console.log(this.getCourt);
            var concatData = this.getCourt.concat(this.getOrg);
            this.states = concatData;
            this.filteredStates = this.stateCtrl.valueChanges
              .pipe(
                startWith(''),
                map(state => state ? this.filterStates(state, 1) : this.states.slice())
              );
            //===================================
          },
          (error) => { }
        )
      },
      (error) => { }
    )

    var student = JSON.stringify({
      "table_name": "pdoc_location_setup",
      "field_id": "location_id",
      "field_name": "location_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        //===================================
        // console.log(getDataOptions);
        getDataOptions.forEach((x: any) => x.fieldIdValue = x.fieldIdValue.toString())
        this.states2 = getDataOptions;
        this.filteredStates2 = this.stateCtrl2.valueChanges
        .pipe(
          startWith(''),
          map(state2 => state2 ? this.filterStates(state2, 2) : this.states2.slice())
        );
        //===================================
      },
      (error) => { }
    )

    this.getIssueType = [{ fieldIdValue: 1, fieldNameValue: 'ส่งสำนวน' }, { fieldIdValue: 2, fieldNameValue: 'ส่งสำเนา' }];
    this.getFast = [{ fieldIdValue: 0, fieldNameValue: '----------เลือก---------' }, { fieldIdValue: 1, fieldNameValue: 'ด่วน' }, { fieldIdValue: 2, fieldNameValue: 'ด่วนมาก' }, { fieldIdValue: 3, fieldNameValue: 'ด่วนที่สุด' }];
    this.getSecret = [{ fieldIdValue: 0, fieldNameValue: '----------เลือก---------' }, { fieldIdValue: 1, fieldNameValue: 'ลับ' }, { fieldIdValue: 3, fieldNameValue: 'ลับมาก' }, { fieldIdValue: 4, fieldNameValue: 'ลับที่สุด' }];
  }


  filterStates(name: string, type:any) {
    // console.log(name, this.states);
    if(type == 1)
      return this.states.filter((state: any) => state.fieldNameValue.includes(name));
    else
      return this.states2.filter((state2: any) => state2.fieldNameValue.includes(name));
  }

  onEnter(event: any, type:any) {
    // console.log(event);
    if(type == 1){
      if (event.fieldIdValue)
        this.result.doc_id_title = "ศย." + event.fieldIdValue + "/";
      else
        this.result.doc_id_title = "";
      this.result.doc_orig = event.fieldNameValue;
    }else{
      if (event.fieldNameValue)
        this.pResult.location_name = event.fieldNameValue;
      else
        this.pResult.location_name = "";
    }
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

  setDefPage() {
    this.caseData = [];
    this.procData = [];
    this.hData = [];
    this.getRealSendDocData = [];
    this.result = [];
    this.result.run_seq = 0;
    this.result.edit_run_seq = 0;
    this.result.court_level = 1;
    this.result.doc_type = 1;
    this.result.run_doc_title = 'ส';
    this.result.send_rcv_date = myExtObject.curDate();
    this.result.fast = 0;
    this.result.secret = 0;
    this.result.tmp_doc_desc = '';
    this.result.run_doc_yy = myExtObject.curYear();
    this.stateInput.nativeElement.value = "";
    this.stateInput2.nativeElement.value = "";
    $('body').find('.custom-file-label').html('');
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
    this.hResult.case_cate_id = this.userData.defaultCaseCate;
    this.hResult.lit_type_item = 2;
    this.pTitle();
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
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        // console.log(getDataOptions)
        this.getPtitle = getDataOptions;
        this.hResult.ptitle = this.getPtitle[0].fieldIdValue;
      },
      (error) => { }
    )
  }

  genDocTitle() {
    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/genDocTitle', student).subscribe(
      (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        // console.log(productsJson)
        this.getDocTitle = productsJson.data;

        productsJson.data.forEach((ele, index, array) => {
          this.getDocTitle[index].fieldIdValue = ele.doc_title_id;
          this.getDocTitle[index].fieldNameValue = ele.doc_title;
        });
        this.runDocId(1);
      },
      (error) => { }
    )
  }

  runDocId(type: any) {//1 runId , 2 runId And save
    if (this.result.run_doc_title && this.result.run_doc_yy) {
      var student = JSON.stringify({
        "run_doc_title": this.result.run_doc_title,
        "run_doc_yy": this.result.run_doc_yy,
        "in_out": 1,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/runDocNo', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          // console.log(productsJson)
          this.result.run_doc_id = productsJson.run_doc_id;
          if (type == 2) {
            this.submitForm();
          }
        },
        (error) => { }
      )
    }
  }

  runDocProc() {
    this.pResult = [];
    if (this.result.run_seq) {
      var student = JSON.stringify({
        "run_seq": this.result.run_seq,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/runDocProc', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          // console.log(productsJson)
          this.pResult.item = productsJson.item;
        },
        (error) => { }
      )
    }
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
    });
    this.dtTriggerCase.next(null);
    this.dtTriggerProc.next(null);
    this.dtTriggerHis.next(null);
  }

  ngAfterViewInit(): void {
    this.dtTriggerCase.next(null);
    this.dtTriggerProc.next(null);
    this.dtTriggerHis.next(null);

    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTriggerCase.unsubscribe();
    this.dtTriggerProc.unsubscribe();
    this.dtTriggerHis.unsubscribe();
  }

  ShowFieldSet() {
    if (this.currFieldset == false)
      this.currFieldset = true;
    else
      this.currFieldset = false;
  }

  directiveDate(date: any, obj: any) {
    // console.log(date, obj);
    if (obj == "proc_date")
      this.pResult[obj] = date;
    else
      this.result[obj] = date;
  }

  openDoc(runSeq: any) {//หนังสือรับที่เกี่ยวข้อง
    this.result.run_seq = runSeq;
    this.searchDocument(4);
  }

  changeCaseType() {
    //========================== ptitle ====================================
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
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        // console.log(getDataOptions)
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
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        // console.log(getDataOptions)
        this.getRedTitle = getDataOptions;

        if (this.hResult.case_type == this.userData.defaultCaseType)
          this.hResult.red_title = this.userData.defaultRedTitle;
        else
          this.hResult.red_title = this.getRedTitle[0].fieldIdValue;
      },
      (error) => { }
    )
  }

  searchNotice(type: any) {
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
    } else if (type == 2) {
      if (!this.hResult.nbarcode) {
        confirmBox.setMessage('กรุณาระบุ barcode หมาย');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
      } else {
        var student = JSON.stringify({
          "notice_barcode": this.hResult.nbarcode,
          "userToken": this.userData.userToken
        });
      }
    }
    // console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/getNotice', student).subscribe(
      (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        // console.log(productsJson)
        if (productsJson.data.length) {
          this.noticeObject = productsJson.data;
          this.run_id = productsJson.data[0].run_id;
          this.hResult.run_id = productsJson.data[0].run_id;
          if (this.result.run_seq && this.hResult.run_id)
            this.btnSaveCase();
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
            if (resp.success == true) { }
            subscription.unsubscribe();
          });
        }
      },
      (error) => { }
    )
  }

  async searchCaseNo(type: any): Promise<void> {
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
      // console.log(cars)
      if (cars) {
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          if (this.result.run_seq && this.hResult.run_id)
            this.btnSaveCase();
          this.hResult.caseEvent = 1;//ค้นข้อมูล
        } else {
          confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              //this.btnSaveCase();
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
      // console.log(cars)
      if (cars) {
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          if (this.result.run_seq && this.hResult.run_id)
            this.btnSaveCase();
          this.hResult.caseEvent = 1;//ค้นข้อมูล
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
    } else if (type == 3) {
      objCase["type"] = 3;
      objCase["run_id"] = this.run_id;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      const cars = await this.caseService.searchCaseNo(objCase);
      // console.log(cars)
      if (cars) {
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          //this.fCaseType();
          this.hResult.caseEvent = 1;//ค้นข้อมูล
          if (this.noticeObject.length) {
            this.hResult.notice_court_running = this.noticeObject[0].notice_court_running;
            this.hResult.notice_no = this.noticeObject[0].notice_no;
            this.hResult.notice_yy = this.noticeObject[0].notice_yy;
            this.hResult.notice_type = this.noticeObject[0].notice_type;
            this.hResult.nbarcode = this.noticeObject[0].notice_barcode;
            this.noticeObject = [];
          }
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
    } else if (type == 4) {
      objCase["type"] = 4;
      objCase["case_type"] = this.hResult.case_type;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      objCase["run_id"] = 0;
      objCase["ptitle"] = this.hResult.ptitle;
      objCase["pid"] = this.hResult.pid;
      objCase["pyy"] = this.hResult.pyy;
      const cars = await this.caseService.searchCaseNo(objCase);
      // console.log(cars)
      if (cars) {
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;

          //this.fCaseType();
          this.hResult.caseEvent = 1;//ค้นข้อมูล
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
    } else if (type == 5) {
      var student = JSON.stringify({
        "case_type": this.hResult.case_type,
        "old_id": this.hResult.old_id,
        "old_red_id": this.hResult.old_red_id,
        "old_yy": this.hResult.old_yy,
        "old_red_yy": this.hResult.old_red_yy,
        "old_title": this.hResult.old_title,
        "old_court_id": this.hResult.old_court_id,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/dataFromOtherCourt', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.result == 1) {
            this.hResult = JSON.parse(JSON.stringify(productsJson.data[0]));
            this.hResult.caseEvent = 1;//ค้นข้อมูล
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
        },
        (error) => { }
      )

      
    }
  }

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent() {
    // console.log("loadMyModalComponent", this.modalType);
    if (this.modalType == 1 || this.modalType == 2 || this.modalType == 3 ||
      this.modalType == 4 || this.modalType == 5 || this.modalType == 6 ||
      this.modalType == 7 || this.modalType == 9 || this.modalType == 11) {
      if (this.modalType == 1 || this.modalType == 11) {
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
      } else if (this.modalType == 2) {
        var student = JSON.stringify({
          "table_name": "pbook_form_rcv",
          "field_id": "doc_id",
          "field_name": "form_name",
          "order_by": "doc_id ASC",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pbook_form_rcv';
        this.listFieldId = 'doc_id';
        this.listFieldName = 'form_name';
        this.listFieldName2 = '';
        this.listFieldCond = 'doc_id ASC';
      } else if (this.modalType == 3) {
        var student = JSON.stringify({
          "table_name": "pbook_to_rcv",
          "field_id": "to_id",
          "field_name": "to_name",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pbook_to_rcv';
        this.listFieldId = 'to_id';
        this.listFieldName = 'to_name';
        this.listFieldName2 = '';
        this.listFieldCond = '';
      } else if (this.modalType == 4) {
        var student = JSON.stringify({
          "table_name": "pdepartment",
          "field_id": "dep_code",
          "field_name": "dep_name",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pdepartment';
        this.listFieldId = 'dep_code';
        this.listFieldName = 'dep_name';
        this.listFieldName2 = '';
        this.listFieldCond = '';
      } else if (this.modalType == 5) {
        var student = JSON.stringify({
          "table_name": "pdoc_sub_type",
          "field_id": "doc_sub_type_id",
          "field_name": "doc_sub_type_name",
          "condition": " AND in_out=1 AND doc_type_id='" + this.result.doc_type + "' ",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pdoc_sub_type';
        this.listFieldId = 'doc_sub_type_id';
        this.listFieldName = 'doc_sub_type_name';
        this.listFieldCond = " AND in_out=1 AND doc_type_id='" + this.result.doc_type + "' ";
        this.listFieldName2 = '';
        this.listFieldCond = '';
      } else if (this.modalType == 6) {
        var student = JSON.stringify({
          "table_name": "pdoc_list_rcv",
          "field_id": "book_id",
          "field_name": "book_title",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pdoc_list_rcv';
        this.listFieldId = 'book_id';
        this.listFieldName = 'book_title';
        this.listFieldName2 = '';
        this.listFieldCond = '';
      } else if (this.modalType == 7) {
        var student = JSON.stringify({
          "table_name": "pdoc_command",
          "field_id": "command_id",
          "field_name": "command_name",
          "field_name2": "command_desc",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pdoc_command';
        this.listFieldId = 'command_id';
        this.listFieldName = 'command_name';
        this.listFieldName2 = 'command_desc';
        this.listFieldCond = "";
      } else if (this.modalType == 9) {
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
      }
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          this.list = response;
          this.loadComponent = true;
          this.loadModalComponent = false;
          this.loadAddCaseComponent = false;
          this.loadJudgeComponent = false;
          this.loadSendDocComponent = false;
          $(".modal-backdrop").css("z-index", "2");
          $("#exampleModal").find(".modal-content").css("z-index", "4");
          if (this.modalType == 7)
            $("#exampleModal").find(".modal-content").css("width", "950px");
          else
            $("#exampleModal").find(".modal-content").css("width", "auto");
        },
        (error) => { }
      )
    } else if (this.modalType == 8) {//ผู้พิพากษาที่สั่ง
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldName2 = "position";
      this.listFieldType = JSON.stringify({ "type": 2 });

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
          } else {
            this.list = [];
          }
          this.loadComponent = false;
          this.loadModalComponent = false;
          this.loadAddCaseComponent = false;
          this.loadJudgeComponent = true;
          this.loadSendDocComponent = false;
          $(".modal-backdrop").css("z-index", "2");
          $("#exampleModal").find(".modal-content").css("z-index", "4");
          $("#exampleModal").find(".modal-content").css("width", "800px");
        },
        (error) => { }
      )
    } else if (this.modalType == 10) {//บันทึกข้อมูลคดี(หลายคดี)
      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadAddCaseComponent = true;
      this.loadJudgeComponent = false;
      this.loadSendDocComponent = false;
      $(".modal-backdrop").css("z-index", "2");
      $("#exampleModal").find(".modal-content").css("z-index", "4");
      $("#exampleModal").find(".modal-content").css("width", "980px");
    } else if (this.modalType == 12) {//รับหนังสือให้งานอื่น
      this.run_seq = this.result.run_seq;

      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadAddCaseComponent = false;
      this.loadJudgeComponent = false;
      this.loadSendDocComponent = true;
      $(".modal-backdrop").css("z-index", "2");
      $("#exampleModal").find(".modal-content").css("width", "1000px");
      $("#exampleModal").find(".modal-content").css("z-index", "4");

    } else if (this.modalType == 'changeDocument' || this.modalType == 'deleteDocument' ||
      this.modalType == 'deleteCaseRow' || this.modalType == 'deleteProcRow') {
      this.loadComponent = false;
      this.loadModalComponent = true;
      this.loadAddCaseComponent = false;
      this.loadJudgeComponent = false;
      this.loadSendDocComponent = false;
      $(".modal-backdrop").css("z-index", "2");
      $("#exampleModal").find(".modal-content").css("z-index", "4");
      $("#exampleModal").find(".modal-content").css("width", "auto");
    }
  }

  receiveAddCaseData(event: any) {//10 บันทึกข้อมูลคดี(หลายคดี)
    // console.log(event);
    this.btnSaveCases(event);
  }

  receivSendDocData(event: any) {//12 ส่งหนังสือมห้หน่วยงานอื่น
    // console.log(event);
    this.btnSaveSendDoc(event);
  }

  receiveFuncListData(event: any) {
    // console.log(event);
    if (this.modalType == 1) {
      if (event.fieldIdValue)
        this.result.doc_id_title = "ศย." + event.fieldIdValue + "/";
      else
        this.result.doc_id_title = event.fieldIdValue;
      this.result.doc_orig = event.fieldNameValue;
      this.stateInput.nativeElement.value = event.fieldNameValue;
    } else if (this.modalType == 2) {
      this.result.doc_id_title = event.fieldIdValue;
      this.result.doc_orig = event.fieldNameValue;
      this.stateInput.nativeElement.value = event.fieldNameValue;
    } else if (this.modalType == 3 || this.modalType == 4) {
      this.result.doc_dest_id = event.fieldIdValue;
      this.result.doc_dest = event.fieldNameValue;
    } else if (this.modalType == 5) {
      this.result.doc_sub_type = event.fieldIdValue;
      this.result.doc_sub_type_name = event.fieldNameValue;
    } else if (this.modalType == 6) {
      this.result.subject_id = event.fieldIdValue;
      this.result.subject_name = event.fieldNameValue;
    } else if (this.modalType == 7) {
      this.result.doc_desc_id = event.fieldIdValue;
      this.result.doc_desc_name = event.fieldNameValue;
      this.result.doc_desc = event.fieldNameValue2;
      this.assignUser();
    } else if (this.modalType == 9) {
      this.result.judge_order_id = event.fieldIdValue;
      this.result.judge_order_name = event.fieldNameValue;
    } else if (this.modalType == 11) {
      this.hResult.old_court_id = event.fieldIdValue;
      this.hResult.old_court_name = event.fieldNameValue;
    }

    this.closebutton.nativeElement.click();
  }

  receiveFuncJudgeListData(event: any) {//this.modalType == 7
    // console.log(event);
    this.result.judge_order_id = event.judge_id;
    this.result.judge_order_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  closeModal() {
    this.loadComponent = false;
    this.loadModalComponent = false;
    this.loadAddCaseComponent = false;
    this.loadJudgeComponent = false;
    this.loadSendDocComponent = false;

  }

  changeDocument() {//login เพื่อเปลี่ยนเลขที่รับหนังสือ
    this.modalType = "changeDocument";
    this.openbutton.nativeElement.click();
  }

  deleteDocument() {//ลบข้อมูลรับหนังสือ
    this.modalType = "deleteDocument";
    this.openbutton.nativeElement.click();
  }

  assignUser() {
    if (this.result.doc_desc != this.result.tmp_doc_desc) {
      if (!this.result.tmp_doc_desc) {
        this.result.user_type_order = this.userData.userCode;
        this.result.user_type_order_name = this.userData.offName;
        this.result.user_type_dep_code = this.userData.depCode;
        this.result.user_type_dep_name = this.userData.depName;
      } else {
        this.result.user_update_order = this.userData.userCode;
        this.result.user_update_order_name = this.userData.offName;
        this.result.user_update_dep_code = this.userData.depCode;
        this.result.user_update_dep_name = this.userData.depName;
      }
    } else {
      if (!this.result.tmp_doc_desc) {
        this.result.user_type_order = '';
        this.result.user_type_order_name = '';
        this.result.user_type_dep_code = '';
        this.result.user_type_dep_name = '';
      } else {
        this.result.user_update_order = '';
        this.result.user_update_order_name = '';
        this.result.user_update_dep_code = '';
        this.result.user_update_dep_name = '';
      }
    }
  }

  tabChangeSelect(objId: any, objName: any, event: any) {
    if (objId == "doc_dest_id") {
      var student = JSON.stringify({
        "table_name": "pbook_to_rcv",
        "field_id": "to_id",
        "field_name": "to_name",
        "condition": " AND to_id='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    } else if (objId == "doc_sub_type") {
      var student = JSON.stringify({
        "table_name": "pdoc_sub_type",
        "field_id": "doc_sub_type_id",
        "field_name": "doc_sub_type_name",
        "condition": " AND in_out=1 AND doc_type_id='" + this.result.doc_type + "' AND doc_sub_type_id=" + event.target.value + "",
        "userToken": this.userData.userToken
      });
    } else if (objId == "subject_id") {
      var student = JSON.stringify({
        "table_name": "pdoc_list_rcv",
        "field_id": "book_id",
        "field_name": "book_title",
        "condition": " AND book_id='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    } else if (objId == "doc_desc_id") {
      var student = JSON.stringify({
        "table_name": "pdoc_command",
        "field_id": "command_id",
        "field_name": "command_name",
        "field_name2": "command_desc",
        "condition": " AND command_id='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    } else if (objId == "judge_order_id") {
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "condition": " AND judge_id='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    }
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        // console.log(getDataOptions, getDataOptions.length)
        if (getDataOptions.length > 0) {
          this.result[objId] = getDataOptions[0].fieldIdValue;
          this.result[objName] = getDataOptions[0].fieldNameValue;

          if (objId == "doc_desc_id") {
            this.result.doc_desc = getDataOptions[0].fieldNameValue2;
            this.result.doc_desc_name = getDataOptions[0].fieldNameValue;

            this.assignUser();
          }

        } else {
          this.result[objId] = "";
          this.result[objName] = "";
        }
      },
      (error) => { }
    )
  }

  tabChangeSelect2(objId: any, objName: any, event: any) {
    if (objId == "old_court_id") {
      var student = JSON.stringify({
        "table_name": "pcourt",
        "field_id": "court_id",
        "field_name": "court_name",
        "condition": " AND court_id='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    }
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
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

  searchDocument(type: any) {
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (type == 1) {//ค้นหาเลขที่รับหนังสือ
      var student = JSON.stringify({
        "run_doc_title": this.result.run_doc_title,
        "run_doc_id": this.result.run_doc_id,
        "run_doc_yy": this.result.run_doc_yy,
        "in_out": 1,// รับหนังสือ
        "userToken": this.userData.userToken
      });
    } else if (type == 4) {
      var student = JSON.stringify({
        "run_seq": this.result.run_seq,
        "in_out": 1,// รับหนังสือ
        "userToken": this.userData.userToken
      });
    }
    // console.log("student=>", student);
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/getDocData', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      // console.log("productsJson=>", productsJson);
      if (productsJson.result == 1) {
        this.setDefCase();
        if (productsJson.data.length > 0) {
          //ข้อมูลหนังสือ
          this.result = productsJson.data[0];
          this.result.edit_run_seq = productsJson.data[0].run_seq;

          this.result.tmp_run_doc_title = productsJson.data[0].run_doc_title;
          this.result.tmp_run_doc_id = productsJson.data[0].run_doc_id;
          this.result.tmp_run_doc_yy = productsJson.data[0].run_doc_yy;
          this.result.tmp_doc_desc = productsJson.data[0].doc_desc;
          this.stateInput.nativeElement.value = productsJson.data[0].doc_orig;

          //หนังสือส่งที่เกี่ยวข้อง
          this.getRealSendDoc();

          //ข้อมูลคดี
          if (productsJson.case_data.length > 0) {
            this.caseData = productsJson.case_data;
          }else{
            this.caseData = [];
          }
          //process
          this.runDocProc();
          if (productsJson.proc_data.length > 0) {
            this.procData = productsJson.proc_data;
          }else{
            this.procData = [];
          }

          this.rerender();
          //historical
          if (this.result.run_seq)
            this.getDocHistorical();

        }
        if (type == 1){
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
      this.SpinnerService.hide();
    });
  }

  getDocHistorical() {
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "run_seq": this.result.run_seq,
      "in_out": 1,//2 รับหนังสือ
      "userToken": this.userData.userToken
    });
    // console.log("student=>", student);
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/getHistiricalData', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      // console.log("productsJson=>", productsJson);
      this.hData = [];
      if (productsJson.result == 1) {
        this.hData = productsJson.data;
      }
      this.rerender();
      this.SpinnerService.hide();
    });
  }

  async editCaseData(runId: any, index: any): Promise<void> {
    // console.log(runId, index);
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var objCase = [];
    if (runId) {
      objCase["type"] = 3;
      objCase["run_id"] = runId;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      const cars = await this.caseService.searchCaseNo(objCase);
      // console.log(cars)
      if (cars['result'] == 1) {
        this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
        if (!this.hResult.red_title)
          this.hResult.red_title = this.userData.defaultRedTitle;

        //this.fCaseType();
        this.hResult.caseEvent = 1;//ค้นข้อมูล
        this.hResult.run_seq = this.result.run_seq;
        this.hResult.edit_run_id = this.caseData[index].edit_run_id;
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
  }

  editProcData(item: any, index: any) {
    this.SpinnerService.show();

    this.pResult = this.procData[index];
    this.stateInput2.nativeElement.value = this.procData[index].location_name;

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  deleteCaseData(index: any) { //ลบข้อมูลเลขคดี
    // console.log("deleteData=>", this.caseData[index]);
    this.dataDeleteSelect = [];
    this.dataDeleteSelect.push(this.caseData[index]);
    this.modalType = "deleteCaseRow";
    this.openbutton.nativeElement.click();
  }

  deleteProcData(index: any) { //ลบข้อมูล
    // console.log("deleteProcRow=>", this.procData[index]);
    this.procDeleteSelect = [];
    this.procDeleteSelect.push(this.procData[index]);
    this.modalType = "deleteProcRow";
    this.openbutton.nativeElement.click();
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
        if (resp.success == true) { }
        subscription.unsubscribe();
      });

    } else if (!chkForm.log_remark) {
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
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
          let productsJson: any = JSON.parse(JSON.stringify(posts));
          if (productsJson.result == 1) {
            if (this.modalType == "deleteProcRow") {
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  var dataDel = [];
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = this.procDeleteSelect;
                  var data = $.extend({}, dataDel);
                  // console.log("data=>", data)
                  this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/delDocProcess', data).subscribe(
                    (response) => {
                      let alertMessage: any = JSON.parse(JSON.stringify(response));
                      // console.log("alertMessage=>", alertMessage)
                      if (alertMessage.result == 0) {
                      } else {
                        this.closebutton.nativeElement.click();
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success == true) {
                            this.modalType = "";
                            this.getProcess();
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

            } else if (this.modalType == "deleteDocument") {//
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลหนังสือใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูล');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.result['userToken'] = this.userData.userToken;
                  var data = $.extend({}, this.result);
                  // console.log("data=>", data)
                  this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/deleteDoc', data).subscribe(
                    (response) => {
                      let alertMessage: any = JSON.parse(JSON.stringify(response));
                      // console.log("alertMessage=>", alertMessage)
                      if (alertMessage.result == 1) {
                        this.closebutton.nativeElement.click();
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success == true) {
                            this.modalType = "";
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
                  var dataDel = [];
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = this.dataDeleteSelect;
                  var data = $.extend({}, dataDel);
                  // console.log("data=>", data)
                  this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/delDocMapCase', data).subscribe(
                    (response) => {
                      let alertMessage: any = JSON.parse(JSON.stringify(response));
                      // console.log("alertMessage=>", alertMessage)
                      if (alertMessage.result == 0) {
                      } else {
                        this.closebutton.nativeElement.click();
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success == true) {
                            this.modalType = "";
                            this.setDefCase();
                            this.getMapCaseData();
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
            } else if (this.modalType == "changeDocument") {
              
              this.closebutton.nativeElement.click();

              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ข้อความแจ้งเตือน');
              confirmBox2.setMessage('ต้องการแก้ไขเลขที่รับหนังสือ หรือไม่');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.modalType = "";
                  this.loginComp = 1;

                  const confirmBox = new ConfirmBoxInitializer();
                  confirmBox.setTitle('ข้อความแจ้งเตือน');
                  confirmBox.setMessage('คุณสามารถทำการแก้ไขเลขที่รับหนังสือและกดปุ่ม "จัดเก็บ" เพื่อบันทึกข้อมูล');
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success == true) { }
                    subscription.unsubscribe();
                  });
                }
                subscription2.unsubscribe();
              });

            }
          } else {
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) { }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { }
      );
    }
  }

  btnSaveSendDoc(event: any) {//รับหนังสือให้งานอื่น
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    event['userToken'] = this.userData.userToken;
    event['run_seq'] = this.result.run_seq;
    var student = $.extend({}, event);

    // console.log("student=>", student)
    this.http.disableHeader().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/saveDocHistorical', student).subscribe(
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
            if (resp.success == true) {}
            subscription.unsubscribe();
          });
        } else {
          this.SpinnerService.hide();
          confirmBox.setMessage(alertMessage.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) { 
              if (this.result.run_seq)
                this.getDocHistorical();
              this.closebutton.nativeElement.click();
            }
            subscription.unsubscribe();
          });
        }
      },
      (error) => { this.SpinnerService.hide(); }
    )
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
      this.closebutton.nativeElement.click();
      this.SpinnerService.show();
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

      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/addDocMapCase', student).subscribe(
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
              if (resp.success == true) {
                this.setDefCase();
                this.getMapCaseData();
              }
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
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();

      var dataCase = JSON.stringify({
        "run_seq": this.result.run_seq,
        "run_id": this.hResult.run_id,
        "edit_run_seq": this.result.edit_run_seq,
        "edit_run_id": this.hResult.edit_run_id ? this.hResult.edit_run_id : 0,
        "old_court_id": this.hResult.old_court_id,
        "old_court_name": this.hResult.old_court_name,
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
            confirmBox.setMessage('ข้อความแจ้งเตือน');
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.setDefCase();
                this.getMapCaseData();
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  btnNewCase() {//เพิ่มข้อมูลคดี loadData
    this.setDefCase();
  }

  getMapCaseData() {
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "run_seq": this.result.run_seq,
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/getMapCaseData', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      // console.log("productsJson=>", productsJson);
      this.caseData = [];
      if (productsJson.result == 1) {

        if (productsJson.data.length > 0) {
          this.caseData = productsJson.data;
        }
      } 
      this.rerender();
      this.SpinnerService.hide();
    });
  }

  getProcess() {
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "run_seq": this.result.run_seq,
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/getProcessData', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      // console.log("productsJson=>", productsJson);
      if (productsJson.result == 1) {

        if (productsJson.data.length > 0) {
          this.procData = productsJson.data;
          this.runDocProc();
          this.rerender();
        }
      } else {
          this.procData = [];
          this.runDocProc();
          this.rerender();
        /*confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });*/
      }
      this.SpinnerService.hide();
    });
  }

  getRealSendDoc() {
    var student = JSON.stringify({
      "run_seq": this.result.run_seq,
      "in_out": 1,// รับหนังสือ
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/getRealSendDoc', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      // console.log("productsJson=>", productsJson);
      this.getRealSendDocData = productsJson.data;
    });
  }

  getMessagetMess(text: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage(text);
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) { }
      subscription.unsubscribe();
    });
  }

  submitFormProcData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.pResult.item) {
      confirmBox.setMessage('กรุณาระบุลำดับที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();

      if(this.stateInput2.nativeElement.value)
        this.pResult.location_name =  this.stateInput2.nativeElement.value;

      var formData = new FormData();
      this.pResult['run_seq'] = this.result.run_seq;
      this.pResult['userToken'] = this.userData.userToken;
      formData.append('file', this.fileToUpload2 ? this.fileToUpload2 : null);
      formData.append('data', JSON.stringify($.extend({}, this.pResult)));
      // console.log("formData=>", formData.get('data'));
      this.http.disableHeader().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/saveDocProcess', formData).subscribe(
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
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.getProcess();
                this.fileToUpload2 = null;
                this.stateInput2.nativeElement.value = "";
                $('body').find('.custom-file-label').html('');
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  submitForm() {//จัดเก็บข้อมูล
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.result.run_doc_title || !this.result.run_doc_id || !this.result.run_doc_yy) {
      this.getMessagetMess('กรุณาระบุเลขที่รับหนังสือ');
    } else if ((this.result.tmp_run_doc_title && this.result.tmp_run_doc_id && this.result.tmp_run_doc_yy) &&
      ((this.result.tmp_run_doc_title != this.result.run_doc_title) ||
        (this.result.tmp_run_doc_id != this.result.run_doc_id) ||
        (this.result.tmp_run_doc_yy != this.result.run_doc_yy)) &&
      (this.loginComp != 1)) {
      this.getMessagetMess('ไม่สามารถแก้ไขเลขที่รับหนังสือได้ กรุณา login เพื่อเปลี่ยนเลขที่รับหนังสือรับก่อนแก้ไข');

    } else {
      this.SpinnerService.show();

      //ข้อมูลเลขคดี
      this.result.run_id = this.hResult.run_id;
      var data;
      if (this.hResult.run_id) {
        data=({
          "run_seq": this.result.run_seq,
          "run_id": this.hResult.run_id,
          "edit_run_seq": this.result.edit_run_seq,
          "edit_run_id": this.hResult.edit_run_id ? this.hResult.edit_run_id : 0,
          "userToken" : this.userData.userToken
        });
      }

      //parameter
      if(this.result.run_seq == 0){
        if(this.param){
          this.result.guar_running = this.param['guar_running'];
          this.result.asset_item = this.param['asset_item'];
          this.result.asset_type = this.param['asset_type'];
          this.result.guarman_item = this.param['guarman_item'];
          this.result.receipt_running = this.param['receipt_running'];
          this.result.led_running = this.param['led_running'];
          this.result.kp_notice_running = this.param['kp_notice_running'];
          this.result.notice_running = this.param['notice_running'];
          this.result.appeal_running = this.param['appeal_running'];
          this.result.appeal_type = this.param['appeal_type'];
          this.result.appeal_item = this.param['appeal_item'];
        }
      }

      if(this.stateInput.nativeElement.value)
        this.result.doc_orig =  this.stateInput.nativeElement.value;

      this.result.real_doc_title = this.result.run_doc_title;
      this.result.real_doc_id = this.result.run_doc_id;
      this.result.real_doc_yy = this.result.run_doc_yy;
      this.result['in_out'] = 1;
      this.result['userToken'] = this.userData.userToken;

      var formData = new FormData();
      formData.append('file', this.fileToUpload1 ? this.fileToUpload1 : null);
      formData.append('data', JSON.stringify($.extend({}, this.result)));
      formData.append('case_data', JSON.stringify($.extend({}, data)));
      // var formData = ($.extend({}, this.result))
      // formData["case_data"] = data;
      this.http.disableHeader().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/saveDoc', formData).subscribe(
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
              if (resp.success == true) { 
              }
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
              if (resp.success == true) {
                this.fileToUpload1 = null;
                this.result.run_seq = alertMessage.run_seq;
                this.searchDocument(4);
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  clickDocId(){
    if (!this.result.run_doc_id) {
      this.runDocId(1);
    }
  }

  NewDoc() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ต้องการสร้าง/จัดเก็บเลขรับหนังสือ');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    // Choose layout color type
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) {
        if (!this.result.run_doc_id) {
          this.runDocId(2);
        } else {
          this.submitForm();
        }
      }
      subscription.unsubscribe();
    });
  }

  onFileChange(e: any, type: any) {
    if (type == 's_file1') {
      if (e.target.files.length) {
        this.fileToUpload1 = e.target.files[0];
        var fileName = e.target.files[0].name;
        // console.log(e.target, fileName);
        $(e.target).parent('div').find('label').html(fileName);
      } else {
        this.fileToUpload1 = null;
        $(e.target).parent('div').find('label').html('');
      }
    } else {
      if (e.target.files.length) {
        this.fileToUpload2 = e.target.files[0];
        var fileName = e.target.files[0].name;
        $(e.target).parent('div').find('label').html(fileName);
      } else {
        this.fileToUpload2 = null;
        $(e.target).parent('div').find('label').html('');
      }
    }
  }

  clickOpenFile1() {
    var pdf_flag1 = this.result.attach_file1.search('.pdf');
    var pdf_flag2 = this.result.attach_file1.search('.PDF');
    // console.log(pdf_flag1, pdf_flag2);
    let winURL = window.location.host;
    if ((pdf_flag1) > 0 || (pdf_flag2 > 0))
      winURL = winURL + '/'+this.userData.appName+"ApiCO/API/CORRESP/fco0300/opendDocPdf";
    else
      winURL = winURL + '/'+this.userData.appName+"ApiCO/API/CORRESP/fco0300/openDocAttach";

    myExtObject.OpenWindowMax("http://" + winURL + '?run_seq=' + this.result.run_seq + "&file_name=" + this.result.attach_file1+ "&doc_word=1");
  }

  clickOpenFile(index: any) {

    var pdf_flag1 = this.procData[index].file_attach.search('.pdf');
    var pdf_flag2 = this.procData[index].file_attach.search('.PDF');
    // console.log(pdf_flag1, pdf_flag2);
    let winURL = window.location.host;
    if ((pdf_flag1) > 0 || (pdf_flag2 > 0))
      winURL = winURL + '/'+this.userData.appName+"ApiCO/API/CORRESP/fco0300/opendDocPdf";
    else
      winURL = winURL + '/'+this.userData.appName+"ApiCO/API/CORRESP/fco0300/openDocAttach";

    myExtObject.OpenWindowMax("http://" + winURL + '?run_seq=' + this.result.run_seq + "&file_name=" + this.procData[index].file_attach+ "&doc_word=2");
  }

  buttonNew() {//เพิ่ม
    let toPage = "fco0300";
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    location.replace(winURL + toPage)
    window.location.reload();
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

        var tmprocData = JSON.stringify({
          "run_seq": this.result.run_seq,
          "in_out": 1,
          "userToken": this.userData.userToken
        });
        // console.log(tmprocData)
        this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/copyDoc', tmprocData).subscribe(
          (response) => {
            let alertMessage: any = JSON.parse(JSON.stringify(response));
            if (alertMessage.result == 1) {
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) { }
                this.result.run_seq = alertMessage.run_seq;
                this.searchDocument(4);
                subscription.unsubscribe();
              });
            } else {
              this.SpinnerService.hide();
              confirmBox.setMessage('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) { }
                subscription.unsubscribe();
              });
            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      }
      subscription.unsubscribe();//ลบ
    });
  }

  checkData(event: any) {
    this.result.check_flag = event.target.checked;
    // console.log(event, this.result.check_flag);
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (this.result.check_flag) {
      confirmBox.setMessage('ยืนยันการตรวจสอบข้อมูล');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.updateCheck();
        }
        subscription.unsubscribe();
      });
    } else {
      confirmBox.setMessage('ยืนยันการยกเลิกตรวจสอบข้อมูล');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.updateCheck();
        }
        subscription.unsubscribe();
      });
    }
  }

  updateCheck() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (this.result.run_seq) {
      this.SpinnerService.show();

      var dataCase = JSON.stringify({
        "run_seq": this.result.run_seq,
        "check_flag": this.result.check_flag,
        "userToken": this.userData.userToken
      });
      // console.log("student=>", dataCase)
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0300/updateCheck', dataCase).subscribe(
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

            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) { }
              subscription.unsubscribe();
              this.result.run_seq = alertMessage.run_seq;
              this.searchDocument(4);
            });
          }
        },
        (error) => { this.SpinnerService.hide(); }
      );
    }
  }

  NewCase() {//บันทึกเลขคดีใหม่
    this.result.doc_orig = this.result.doc_orig ? this.result.doc_orig : "";
    this.hResult.run_id = this.hResult.run_id ? this.hResult.run_id : "";

    let toPage = "fco0300_new_case";
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage + "?mapCase=1&run_seq=" + this.result.run_seq + "&court_name=" + this.result.doc_orig + "&run_id=" + this.hResult.run_id;
    myExtObject.OpenWindowMaxDimensionName(winURL, 320, 1300, toPage);
  }

  bttOpenWindow() {
    let toPage = "fju0600";
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    var tmp = "";
    if (this.hResult.run_id)
      tmp = this.hResult.run_id;
    else if(this.caseData.length > 0)
      tmp = this.caseData[0].run_id;

    if (tmp)
      winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage + "?run_seq=" + this.result.run_seq + "&run_id=" + tmp;
    else
      winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage + "?run_seq=" + this.result.run_seq;

    console.log(winURL);
    myExtObject.OpenWindowMaxName(winURL, toPage);
  }

  replyDoc() {
    let toPage = "fco0400";
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage + "?reply_run_seq=" + this.result.run_seq;
    myExtObject.OpenWindowMaxName(winURL, toPage);
  }

  ClearAll() {
    window.location.reload();
  }
}