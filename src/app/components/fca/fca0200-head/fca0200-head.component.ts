import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy, Injectable, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerService } from "ngx-spinner";
import { NgSelectComponent } from '@ng-select/ng-select';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';
import { Fca0200Component } from '@app/components/fca/fca0200/fca0200.component';
import { FunntionService } from '@app/function/function.service';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { NgbAlertConfig, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as $ from 'jquery';

import { AlertSearchComponent } from '@app/components/modal/alert-search/alert-search.component';
import { CaseCopyComponent } from '@app/components/modal/case-copy/case-copy.component';

declare var myExtObject: any;
@Component({
  selector: 'app-fca0200-head',
  templateUrl: './fca0200-head.component.html',
  styleUrls: ['./fca0200-head.component.css']
})

export class Fca0200HeadComponent implements AfterViewInit, OnInit, OnDestroy {

  sessData: any;
  userData: any;

  aCaseType: any;

  getTitle: any;
  getRedTitle: any;
  getCaseCate: any = [];
  getCourt: any;
  getCaseType: any;
  getCaseCourtType: any;
  getCaseStatus: any;
  getCaseSpecial: any;
  myExtObject: any;
  courtOther: any;//คดีศาลอื่น
  courtOther2: any;//รับฟ้องที่ศาล
  //selTitle:any;
  //selRedTitle:any;

  //selCaseType:any;
  //selCaseCate:any;
  selCaseCourtType: any;
  selCaseStatus: any;

  dataHead: any;
  groupObj: any;
  postMapObj: any;
  prosObj: any;
  accuObj: any;
  reqObj: any;
  oppObj: any;
  items: any = [];

  courtTypeId: any;
  hCaseType: any;
  caseNoLast: any;
  caseTypeValue: any;
  caseDataUPdate: any;
  caseDataInsert: any;
  counter = 1;
  runId: any;
  reloadCase: any;

  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadCopyComponent: boolean = false;
  public loadModalAlertComponent: boolean = false;


  @ViewChild('sCaseCate') sCaseCate: NgSelectComponent;
  @ViewChild('sRedTitle') sRedTitle: NgSelectComponent;
  @ViewChild('sCaseStatus') sCaseStatus: NgSelectComponent;
  @ViewChild('yy', { static: true }) yy: ElementRef;
  @ViewChild('id', { static: true }) id: ElementRef;
  @ViewChild('red_yy', { static: true }) red_yy: ElementRef;
  @ViewChild('red_id', { static: true }) red_id: ElementRef;
  @ViewChild('case_date', { static: true }) case_date: ElementRef;

  @ViewChild(DataTableDirective) private datatableElement: DataTableDirective;


  @Output() viewLoaded = new EventEmitter();
  @Output() onClickList = new EventEmitter<any>();
  @Output() onClickList2 = new EventEmitter<any>();
  @Output() onClickList3 = new EventEmitter<any>();
  @Output() onClickList4 = new EventEmitter<any>();
  @Output() onClickList5 = new EventEmitter<any>();
  @Output() onClickList6 = new EventEmitter<any>();
  @Output() onClickList7 = new EventEmitter<any>();
  @Output() onClickList8 = new EventEmitter<{ data: any, counter: any }>();
  @Output() onClickList9 = new EventEmitter<any>();//login เปลียนเลขคดี

  @Input() set caseUpdate(caseUpdate: any) {
    this.caseDataUPdate = caseUpdate;
    console.log(this.caseDataUPdate)
    this.updateCaseData(this.caseDataUPdate);
  }

  @Input() set caseInsert(caseInsert: any) {
    this.caseDataInsert = caseInsert.data;
    console.log(this.caseDataInsert)
    if (this.caseDataInsert)
      this.submitNewCase();
  }

  @Input() set changeVal(changeVal: any) {
    console.log(changeVal)
    if (typeof changeVal === 'object') {
      if (parseInt(changeVal.data.deposit) < 200000) {
        this.dataHead.case_court_type = 3;
      } else {
        this.dataHead.case_court_type = 2;
      }
    }
  }

  @Input() set reloadData(reloadData: any) {
    console.log(reloadData)
    if (reloadData) {
      this.reloadCase = 1;
      this.searchCaseNo(3, reloadData.data.run_id);
    }
  }

  @Input() set sendRunId(sendRunId: any) {
    if (sendRunId) {
      this.runId = sendRunId;
      console.log(this.runId)
    }
  }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('openCopyCaseButton', { static: true }) openCopyCaseButton: ElementRef;
  @ViewChild('openAlertButton', { static: true }) openAlertButton: ElementRef;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;


  //@Input()  formGroup: FormGroup;
  //headFormGroup :FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService,
    private fca0200Service: Fca0200Component,
    private FunntionService: FunntionService,
    private SpinnerService: NgxSpinnerService,
    private router: Router,
    private _renderer: Renderer2,
    private ngbModal: NgbModal,

  ) {
    /*
    this.headFormGroup = this.formBuilder.group({
      yy: [''],
    })
    */
  }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [[2, 'asc']],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    console.log(this.userData)
    if (this.runId) {
      this.SpinnerService.show();
      this.searchCaseNo(3, this.runId);
    }
    this.courtTypeId = this.userData.courtTypeId;
    this.dataHead = [];
    this.groupObj = [];
    this.postMapObj = [];
    this.prosObj = [];
    this.accuObj = [];
    this.reqObj = [];
    this.oppObj = [];
    this.dataHead.court_id = this.userData.courtId;
    this.dataHead.court_name = this.userData.courtName;
    this.dataHead.case_type = this.userData.defaultCaseType;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = Number(today.getMonth() + 1);
    var yyyy = today.getFullYear() + 543;
    this.dataHead.yy = yyyy;
    this.dataHead.case_date = dd + '/' + mm + "/" + yyyy;
    this.fCaseType();
    this.setDeposit(this.userData.defaultTitle, '');

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    //======================== pcourt_type ======================================
    var student = JSON.stringify({
      "table_name": "pcourt_type",
      "field_id": "court_type_id",
      "field_name": "court_type_name",
      "condition": "AND select_flag='1'",
      "order_by": " court_type_id ASC",
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => { 
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        console.log(getDataOptions)
        this.getCaseCourtType = getDataOptions;
        this.selCaseCourtType = this.getCaseCourtType[0].fieldNameValue;
      },     // nextHandler
    });

    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name": "pcourt",
      "field_id": "court_id",
      "field_name": "court_name",
      "field_name2": "court_running",
      "field_name3": "court_province",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => { 
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getCourt = getDataOptions;
      },     // nextHandler
    });


    //======================== pcase_status ======================================
    var student = JSON.stringify({
      "table_name": "pcase_status",
      "field_id": "case_status_id",
      "field_name": "case_status",
      "order_by": "order_no ASC, case_status_id ASC",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => { 
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getCaseStatus = getDataOptions;
      },     // nextHandler
    });
    //======================== pcase_special ======================================
    var student = JSON.stringify({
      "table_name": "pcase_special",
      "field_id": "special_id",
      "field_name": "special_case",
      "order_by": "order_no ASC, special_id ASC",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => { 
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getCaseSpecial = getDataOptions;
      },     // nextHandler
    });
    //==============================================================
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next('');
    });
  }

  ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next('');

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  changeCaseType(obj: any, type: any) {
    this.aCaseType = obj;
    if (obj == 2) {
      this.hCaseType = '';
    } else {
      this.hCaseType = 1;
    }
    if (type)
      this.fCaseTitle(obj);
    this.onClickList2.emit(obj);
    this.caseTypeValue = obj;
  }

  changeTitle(obj: any, caseType: any, type: any) {
    //console.log(obj+":"+caseType+":"+type)
    if (type)
      this.fCaseStat(caseType, obj);
    if (obj == 'ผบ' || obj == 'ม' || obj == 'ย') {
      //this.dataHead.case_status=3;
      var sel = this.getCaseStatus;
      for (var x = 0; x < sel.length; x++) {
        if (sel[x].fieldIdValue == 3) {
          this.dataHead.case_status = sel[x].fieldIdValue;
        }
      }
    } else {
      var sel = this.getCaseStatus;
      for (var x = 0; x < sel.length; x++) {
        if (sel[x].fieldIdValue == 1) {
          this.dataHead.case_status = sel[x].fieldIdValue;
        }
      }
    }
  }

  fCaseType() {
    this.SpinnerService.show();//จะปิดอีกทีเมื่อโหลด ประเภทคดีเสร็จ
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name": "pcase_type",
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "userToken": this.userData.userToken
    });
    //console.log("fCaseType")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          this.getCaseType = getDataOptions;
          //this.dataHead.case_type = 'แพ่ง';//this.fca0200Service.defaultCaseType;

          var sel = this.getCaseType;
          for (var x = 0; x < sel.length; x++) {
            if (sel[x].fieldIdValue == this.fca0200Service.defaultCaseType) {
              this.dataHead.case_type = sel[x].fieldIdValue;
              this.changeCaseType(sel[x].fieldIdValue, '');
              this.fCaseTitle(this.fca0200Service.defaultCaseType);
              //this.changeCaseType(this.fca0200Service.defaultCaseType,'');
            }
          }
        },     // nextHandler
      });
    });
    return promise;
  }

  fCaseTitle(val: any) {
    //========================== ptitle ====================================    
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='" + val + "'",
      "order_by": " order_id ASC",
      "userToken": this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='2' AND case_type='" + val + "'",
      "order_by": " order_id ASC",
      "userToken": this.userData.userToken
    });

    //console.log("fCaseTitle")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          console.log(getDataOptions)
          this.getTitle = getDataOptions;
          //this.dataHead.title = this.fca0200Service.defaultTitle;
          this.fDefaultTitle(val);
          
        },     // nextHandler
      });

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student2, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          //console.log(getDataOptions)
          this.getRedTitle = getDataOptions;
          this.dataHead.red_title = this.fca0200Service.defaultTitle;
          
        },     // nextHandler
      });
    });
    return promise;
  }

  fDefaultTitle(caseType: any) {
    //========================== ptitle ====================================    
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='" + caseType + "' AND default_value='1' AND title_flag='1'",
      "order_by": " title_id ASC",
      "userToken": this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='" + caseType + "' AND default_value='1' AND title_flag='2'",
      "order_by": " title_id ASC",
      "userToken": this.userData.userToken
    });

    //console.log("fDefaultTitle :"+student2)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          this.dataHead.title = getDataOptions[0].fieldIdValue;
          this.fCaseStat(caseType, getDataOptions[0].fieldIdValue);
          this.changeTitle(this.dataHead.title, caseType, '');
          console.log(caseType)
          this.runCaseNo(caseType);
          
        },     // nextHandler
      });

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student2, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          //console.log(getDataOptions)
          this.dataHead.red_title = getDataOptions[0].fieldIdValue;
          
        },     // nextHandler
      });
    });
    return promise;
  }

  runCaseNo(caseType:any) {

    var student = JSON.stringify({
      "case_type": caseType,//this.caseTypeValue,
      "title": this.dataHead.title,
      "yy": myExtObject.curYear(),
      "userToken": this.userData.userToken
    });

    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/runCaseNo', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          console.log(getDataOptions)
          if (getDataOptions.result) {
            this.caseNoLast = getDataOptions.id;
            $("body").find("input#id").trigger("click");
          } else
            this.caseNoLast = '';
          
        },     // nextHandler
      });
    });
    return promise;

  }

  fCaseStat(caseType: any, title: any) {
    var student = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "field_name2": "case_flag",
      "condition": " AND case_type='" + caseType + "'",
      "order_by": " case_cate_id ASC",
      "userToken": this.userData.userToken
    });
    //console.log("fCaseStat :"+student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          this.getCaseCate = getDataOptions;
          console.log(this.getCaseCate)
          this.fDefCaseStat(caseType, title);
          
        },     // nextHandler
      });
    });
    return promise;
  }

  fDefCaseStat(caseType: any, title: any) {

    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "case_cate_id",
      "condition": " AND title_flag='1' AND case_type='" + caseType + "' AND title='" + title + "'",
      "order_by": " case_cate_id ASC",
      "userToken": this.userData.userToken
    });

    //console.log("fDefCaseStat :"+student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          console.log(getDataOptions)
          console.log(this.getCaseCate)
          //this.dataHead.case_cate_id = getDataOptions[0].fieldNameValue;
          if (getDataOptions.length) {
            var sel = this.getCaseCate;
            for (var x = 0; x < sel.length; x++) {
              if (sel[x].fieldIdValue == getDataOptions[0].fieldNameValue) {
                this.dataHead.case_cate_id = sel[x].fieldIdValue;
                this.changeCaseCate(sel[x].fieldIdValue);
                console.log(sel[x].fieldNameValue2)
                if (sel[x].fieldNameValue2 == 4) {
                  this.courtOther = 1;
                } else {
                  this.courtOther = null;
                }
                if (sel[x].fieldNameValue2 == 6) {
                  this.courtOther2 = 1;
                } else {
                  this.courtOther2 = null;
                }

                setTimeout(() => {
                  this.SpinnerService.hide();
                  console.log(this.dataHead.court_id + ":" + this.userData.courtId + ":" + this.courtOther + ":" + this.courtOther2)
                  this.viewLoaded.next(true);
                }, 500);
              }
            }
          } else {
            this.sCaseCate.handleClearClick();
          }
          
        },     // nextHandler
      });
    });
    return promise;
  }

  changeCaseCate(val: any) {
    //this.dataHead.case_cate_idId = val;
    this.onClickList.emit(val);
    this.onClickList3.emit(this.getCaseCate.find((o: any) => o.fieldIdValue === val).fieldNameValue);
    this.onClickList4.emit(this.getCaseCate.find((o: any) => o.fieldIdValue === val).fieldNameValue2);
  }

  searchCaseNo(type: any, run_id: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var alert = 0;

    if (type == 1) {//เลขคดีดำ
      if (!this.dataHead.title) {
        confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีดำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
        alert++;
      } else if (!this.dataHead.id) {
        confirmBox.setMessage('กรุณาระบุหมายเลขคดีดำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
            this.id.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      } else if (!this.dataHead.yy) {
        confirmBox.setMessage('กรุณาระบุปีเลขคดีดำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
            this.yy.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      } else {
        var student = JSON.stringify({
          "case_type": this.dataHead.case_type,
          "title": this.dataHead.title,
          "id": this.id.nativeElement.value,
          "yy": this.yy.nativeElement.value,
          "allData": 1,
          "court_id": this.dataHead.court_id,
          "url_name": 'fca0200',
          "userToken": this.userData.userToken
        });
        var apiUrl = '/crimApiCA/API/CASE/dataFromTitle';
        console.log(student)
      }
    } else if (type == 2) {//เลขคดีแดง
      if (!this.dataHead.red_title) {
        confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีแดง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
        alert++;
      } else if (!this.dataHead.red_id) {
        confirmBox.setMessage('กรุณาระบุหมายเลขคดีแดง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
            this.red_id.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      } else if (!this.dataHead.red_yy) {
        confirmBox.setMessage('กรุณาระบุปีเลขคดีแดง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
            this.red_yy.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      } else {
        var student = JSON.stringify({
          "case_type": this.dataHead.case_type,
          "red_title": this.dataHead.red_title,
          "red_id": this.dataHead.red_id,
          "red_yy": this.dataHead.red_yy,
          "court_id": this.dataHead.court_id,
          "allData": 1,
          "url_name": 'fca0200',
          "userToken": this.userData.userToken
        });
        var apiUrl = '/crimApiCA/API/CASE/dataFromRedTitle';
        console.log(student)
      }
    } else {
      var student = JSON.stringify({
        "run_id": run_id,
        "allData": 1,
        "url_name": 'fca0200',
        "userToken": this.userData.userToken
      });
      var apiUrl = '/crimApiCA/API/CASE/dataFromRunId';
      console.log(student)
    }

    if (!alert) {
      if (type != 3)
        this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      let promise = new Promise((resolve, reject) => {
        this.http.post(apiUrl, student, { headers: headers }).subscribe({
          complete: () => { }, // completeHandler
          error: (e) => { console.error(e) },    // errorHandler 
          next: (v) => { 
            let getDataOptions: any = JSON.parse(JSON.stringify(v));
            console.log(getDataOptions)
            if (getDataOptions.data[0]) {
              this.dataHead = getDataOptions.data[0];
              if (getDataOptions.data[0].groupObj) {
                this.groupObj = getDataOptions.data[0].groupObj;
                this.groupObj.forEach((r: any, index: any, array: any) => {
                  console.log(r.appoint_desc);
                  if (r.appoint_desc) {
                    var appoint_desc = r.appoint_desc.split(',');
                    r.appoint_desc1 = appoint_desc[0];
                    r.appoint_desc2 = r.appoint_desc.replaceAll(',', '<br>');
                    // r.appoint_desc2 = appoint_desc2.replaceAll('(','<br>(');
                    r.appoint_flag = false;
                  }
                  console.log(r);
                });
                console.log(this.groupObj)
              }
              if (getDataOptions.data[0].postMapObj)
                this.postMapObj = getDataOptions.data[0].postMapObj;
              if (getDataOptions.data[0].prosObj)
                this.prosObj = getDataOptions.data[0].prosObj;
              if (getDataOptions.data[0].accuObj)
                this.accuObj = getDataOptions.data[0].accuObj;
              if (getDataOptions.data[0].reqObj)
                this.reqObj = getDataOptions.data[0].reqObj;
              if (getDataOptions.data[0].oppObj)
                this.oppObj = getDataOptions.data[0].oppObj;
              //this.runId = {'run_id' : this.dataHead.run_id,'counter' : Math.ceil(Math.random()*10000)}
              //this.dataHead.transfer_date = '16/11/2564';
              //this.dataHead.transferto_court_id = '300.006';
              //this.dataHead.dispute = 1;
              if (!this.reloadCase) {
                console.log(getDataOptions.data[0].case_type)

                this.runCaseNo(getDataOptions.data[0].case_type);
                this.loadAlertComponent();
                this.onClickList5.emit(this.dataHead);
                if (this.getCaseCate.length) {
                  var caseCate = this.getCaseCate.filter((o: any) => o.fieldIdValue === this.dataHead.case_cate_id);
                  if (caseCate.length)
                    this.onClickList4.emit(caseCate[0].fieldNameValue2);
                }
              }
            }
            console.log(this.dataHead)
            if (getDataOptions.result == 1) {
              if (type == 1 || type == 2)
                location.replace(window.location.href.split("/#/")[0] + "/#/fca0200");
              this.SpinnerService.hide();
            } else {
              //this.runId = 0;
              //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.gotoUrl('fca0200');
                }
                subscription.unsubscribe();
              });
              //-----------------------------//
              //this.SpinnerService.hide();
              //this.reloadCase = null;
            }
          },     // nextHandler
        });
      });
    }
    //console.log(this.FunntionService.searchBackNo('','',''))
  }

  appointDescAll(index: any) {
    this.clearFlag();
    this.groupObj[index].appoint_flag = true;
  }

  clearFlag() {
    this.groupObj.forEach((r: any, index: any, array: any) => {
      console.log(r.appoint_desc);
      if (r.appoint_desc) {
        r.appoint_flag = false;
      }
    });
  }

  searchOldCaseNo(type: any) {
    if (type == 1) {
      if (!this.dataHead.old_title || !this.dataHead.old_id || !this.dataHead.old_yy) {
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาระบุเลขคดีศาลเดิมให้ครบถ้วน');
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
          "old_court_id": this.dataHead.old_court_id,
          "old_title": this.dataHead.old_title,
          "old_id": this.dataHead.old_id,
          "old_yy": this.dataHead.old_yy,
          "userToken": this.userData.userToken
        });
      }
    } else {
      if (!this.dataHead.old_red_title || !this.dataHead.old_red_id || !this.dataHead.old_red_yy) {
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาระบุเลขแดงคดีศาลเดิมให้ครบถ้วน');
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
          "old_court_id": this.dataHead.old_court_id,
          "old_red_title": this.dataHead.old_red_title,
          "old_red_id": this.dataHead.old_red_id,
          "old_red_yy": this.dataHead.old_red_yy,
          "userToken": this.userData.userToken
        });
      }
    }
  }

  callDataTab1() {
    var data = 1;
    var counter = this.counter++;
    this.onClickList8.emit({ data, counter });
  }

  submitNewCase() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.dataHead.title) {
      confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีดำ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (!this.dataHead.id) {
      confirmBox.setMessage('กรุณาระบุหมายเลขคดีดำ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.id.nativeElement.focus();
        }
        subscription.unsubscribe();
      });
    } else if (!this.dataHead.yy) {
      confirmBox.setMessage('กรุณาระบุปีเลขคดีดำ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.yy.nativeElement.focus();
        }
        subscription.unsubscribe();
      });
    } else if (!this.case_date.nativeElement.value) {
      confirmBox.setMessage('กรุณาระบุวันที่ยื่นฟ้อง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.case_date.nativeElement.focus();
        }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      var court_running = this.getCourt.find((o: any) => o.fieldIdValue === this.dataHead.court_id).fieldNameValue2;
      //console.log(this.caseDataInsert)
      var dataTab1 = this.caseDataInsert;
      dataTab1["court_id"] = this.dataHead.court_id;
      dataTab1["owncourt_running"] = this.dataHead.court_running;

      if (this.userData.courtTypeId == 2 || this.userData.courtTypeId == 3) {
        dataTab1['case_court_type'] = this.userData.courtTypeId;
      } else if (this.userData.courtTypeId == 4 || this.userData.courtTypeId == 5 || this.userData.courtTypeId == 6) {
        dataTab1['case_court_type'] = 2;
      } else if (this.userData.courtTypeId == 1) {
        dataTab1['case_court_type'] = this.dataHead.case_court_type;//ค่าจากหน้าจอ
      }

      dataTab1["barcode"] = this.dataHead.barcode;
      dataTab1["special_id"] = this.dataHead.special_id;
      dataTab1["case_type"] = this.dataHead.case_type;
      dataTab1["case_date"] = this.case_date.nativeElement.value;
      dataTab1["case_cate_id"] = this.dataHead.case_cate_id;
      dataTab1["case_status"] = this.dataHead.case_status;
      dataTab1["title"] = this.dataHead.title;
      dataTab1["id"] = this.dataHead.id;
      dataTab1["yy"] = this.dataHead.yy;
      if (typeof this.dataHead.old_court_id !== 'undefined')
        student['old_court_id'] = this.dataHead.old_court_id;
      if (typeof this.dataHead.old_title !== 'undefined')
        student['old_title'] = this.dataHead.old_title;
      if (typeof this.dataHead.old_id !== 'undefined')
        student['old_id'] = this.dataHead.old_id;
      if (typeof this.dataHead.old_yy !== 'undefined')
        student['old_yy'] = this.dataHead.old_yy;
      if (typeof this.dataHead.old_red_title !== 'undefined')
        student['old_red_title'] = this.dataHead.old_red_title;
      if (typeof this.dataHead.old_red_id !== 'undefined')
        student['old_red_id'] = this.dataHead.old_red_id;
      if (typeof this.dataHead.old_red_yy !== 'undefined')
        student['old_red_yy'] = this.dataHead.old_red_yy;
      dataTab1['gen_case'] = 1;
      dataTab1["userToken"] = this.userData.userToken;

      //dataTab1['depData'] = dataTab1.depObj;
      delete dataTab1['depObj'];
      //dataTab1.push(dataHead)

      var student = $.extend({}, dataTab1);
      console.log(student)
      /*
      var student = JSON.stringify({
        "court_id" : this.dataHead.court_id,
        "owncourt_running" : court_running,
        "barcode" : this.dataHead.barcode,
        "special_id" : this.dataHead.special_id,
        "case_type": this.dataHead.case_type,
        "case_date": this.case_date.nativeElement.value,
        "case_cate_id" : this.dataHead.case_cate_id,
        "case_status" : this.dataHead.case_status,
        "title": this.dataHead.title,
        "id": this.dataHead.id,
        "yy": this.dataHead.yy,
        "userToken" : this.userData.userToken
      });
      */
      /*
      this.dataService
      .dataResult$()
      .pipe()
      .subscribe((report: any) => {
        //this.report = report;
        console.log(report)
      });
      */
      //console.log(this.fca0200Tab1Service.dataHeadValue)
      //console.log(student)


      this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/insertCaseData', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          console.log(getDataOptions)
          if (getDataOptions.result == 1) {
            if (getDataOptions.error) {
              //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  //this.SpinnerService.hide();
                  this.searchCaseNo(3, getDataOptions.run_id);
                }
                subscription.unsubscribe();
              });
              //-----------------------------//
            } else {
              //this.SpinnerService.hide();
              confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.searchCaseNo(3, getDataOptions.run_id);
                }
                subscription.unsubscribe();
              });

            }
          } else if (getDataOptions.result == 3) {
            //-----------------------------//
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
             layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.dataHead.id = getDataOptions.id;
              }
              subscription.unsubscribe();
            });
            //-----------------------------//
            this.SpinnerService.hide();
          } else {
            //-----------------------------//
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
             layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.dataHead.id = this.caseNoLast + 1;
              }
              subscription.unsubscribe();
            });
            //-----------------------------//
            this.SpinnerService.hide();
          }
        },     // nextHandler
      });
    }
  }





  closeModal() {
    this.loadComponent = false;
    this.loadModalComponent = false;
    this.loadCopyComponent = false;
    this.loadModalAlertComponent = false;
    /*
    $('.modal')
    .find("input[type='text'],input[type='password'],textarea,select")
    .val('')
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();
    */
  }

  onOpenConfirm = (type: any) => {
    const modalRef: NgbModalRef = this.ngbModal.open(ModalConfirmComponent)
    modalRef.componentInstance.types = type
    modalRef.result.then((item: any) => {
      if (item) {
        this.submitModalForm(item);
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  submitModalForm(log_remark: any) {

    this.onClickList9.emit(JSON.stringify({
      "login_case": 1,
      "log_remark": log_remark,
      "userToken": this.userData.userToken
    }));

    /*var chkForm = JSON.parse(this.child.ChildTestCmp());

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!chkForm.password){
      confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
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
        if(resp.success==true){
          //this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    }else{
      this.onClickList9.emit(JSON.stringify({
        "login_case":1,
        "log_remark": chkForm.log_remark,
        "userToken": "AZrmbt8HPc-fJwI6q1bcMSGjTHfmXlSq"
      }));
      this.closebutton.nativeElement.click();
    }*/

  }

  openCopyCase() {
    //$(".modal").find(".modalOpen").click();
    this.openCopyCaseButton.nativeElement.click();
  }

  gotoUrl(url: any) {
    //alert(url)
    //window.location.reload();
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    location.replace(winURL + 'fca0200')
    window.location.reload();
  }

  autoRunning() {
    if (!this.dataHead.run_id)
      this.dataHead.id = this.caseNoLast + 1;
  }

  confirmEditCase() {
    if (this.runId) {
      this.openbutton.nativeElement.click();
    } else {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      //-----------------------------//
      confirmBox.setMessage('กรุณาค้นหาเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
      //-----------------------------//
    }

  }

  loadMyChildComponent() {
    this.loadComponent = true;
    this.loadCopyComponent = false;
    this.loadModalAlertComponent = false;
  }
  loadCopyCaseComponent() {
    this.loadCopyComponent = true;
    this.loadComponent = false;
    this.loadModalAlertComponent = false;
    $("#exampleModal").find(".modal-content").css("width", "800px");
  }
  loadAlertComponent() {
    if (this.dataHead.run_id) {
      var student = JSON.stringify({
        "run_id": this.dataHead.run_id,
        "event": "searchCase",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.disableLoading().post('/' + this.userData.appName + 'Api/API/alert', student).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          console.log(getDataOptions)
          if (getDataOptions.data.length) {
            this.items = getDataOptions.data;
            this.openAlert();
            // this.onOpenAlertSearch();
          }
        },     // nextHandler
      });
    }
  }
  openAlert() {
    this.openAlertButton.nativeElement.click();
    this.loadCopyComponent = false;
    this.loadComponent = false;
    this.loadModalAlertComponent = true;
    $("#exampleModal").find(".modal-content").css("width", "650px");
  }


  updateCaseData(dataObject: any) {
    //console.log(dataObject);return false;
    if (typeof dataObject != 'undefined') {
      this.SpinnerService.show();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');

      var student = dataObject.data
      if (this.dataHead.run_id) {
        if (typeof this.dataHead.special_id !== 'undefined')
          student['special_id'] = this.dataHead.special_id;
        student['court_id'] = this.dataHead.court_id;
        student['case_type'] = this.dataHead.case_type;
        if (this.userData.courtTypeId == 2 || this.userData.courtTypeId == 3) {
          student['case_court_type'] = this.userData.courtTypeId;
        } else if (this.userData.courtTypeId == 4 || this.userData.courtTypeId == 5 || this.userData.courtTypeId == 6) {
          student['case_court_type'] = 2;
        } else if (this.userData.courtTypeId == 1) {
          student['case_court_type'] = this.dataHead.case_court_type;//ค่าจากหน้าจอ
        }
        student['case_date'] = this.dataHead.case_date;
        student['case_cate_id'] = this.dataHead.case_cate_id;
        student['case_status'] = this.dataHead.case_status;
        student['title'] = this.dataHead.title;
        student['id'] = this.dataHead.id;
        student['yy'] = this.dataHead.yy;
        if (typeof this.dataHead.old_court_id !== 'undefined')
          student['old_court_id'] = this.dataHead.old_court_id;
        if (typeof this.dataHead.old_title !== 'undefined')
          student['old_title'] = this.dataHead.old_title;
        if (typeof this.dataHead.old_id !== 'undefined')
          student['old_id'] = this.dataHead.old_id;
        if (typeof this.dataHead.old_yy !== 'undefined')
          student['old_yy'] = this.dataHead.old_yy;
        if (typeof this.dataHead.old_red_title !== 'undefined')
          student['old_red_title'] = this.dataHead.old_red_title;
        if (typeof this.dataHead.old_red_id !== 'undefined')
          student['old_red_id'] = this.dataHead.old_red_id;
        if (typeof this.dataHead.old_red_yy !== 'undefined')
          student['old_red_yy'] = this.dataHead.old_red_yy;
        var api = '/' + this.userData.appName + 'ApiCA/API/CASE/updateCaseData';
      } else {
        if (!this.dataHead.title) {
          confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีดำ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) { }
            subscription.unsubscribe();
          });
        } else if (!this.dataHead.id) {
          confirmBox.setMessage('กรุณาระบุหมายเลขคดีดำ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              this.id.nativeElement.focus();
            }
            subscription.unsubscribe();
          });
        } else if (!this.dataHead.yy) {
          confirmBox.setMessage('กรุณาระบุปีเลขคดีดำ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              this.yy.nativeElement.focus();
            }
            subscription.unsubscribe();
          });
        } else if (!this.case_date.nativeElement.value) {
          confirmBox.setMessage('กรุณาระบุวันที่ยื่นฟ้อง');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              this.case_date.nativeElement.focus();
            }
            subscription.unsubscribe();
          });
        } else {
          if (typeof this.dataHead.special_id !== 'undefined')
            student['special_id'] = this.dataHead.special_id;
          student['court_id'] = this.dataHead.court_id;
          if (typeof this.dataHead.barcode !== 'undefined')
            student['barcode'] = this.dataHead.barcode;
          student['case_type'] = this.dataHead.case_type;
          if (this.userData.courtTypeId == 2 || this.userData.courtTypeId == 3) {
            student['case_court_type'] = this.userData.courtTypeId;
          } else if (this.userData.courtTypeId == 4 || this.userData.courtTypeId == 5 || this.userData.courtTypeId == 6) {
            student['case_court_type'] = 2;
          } else if (this.userData.courtTypeId == 1) {
            student['case_court_type'] = this.dataHead.case_court_type;//ค่าจากหน้าจอ
          }
          student['case_date'] = this.dataHead.case_date;
          student['case_cate_id'] = this.dataHead.case_cate_id;
          student['case_status'] = this.dataHead.case_status;
          student['title'] = this.dataHead.title;
          student['id'] = this.dataHead.id;
          student['yy'] = this.dataHead.yy;
          if (typeof this.dataHead.old_court_id !== 'undefined')
            student['old_court_id'] = this.dataHead.old_court_id;
          if (typeof this.dataHead.old_title !== 'undefined')
            student['old_title'] = this.dataHead.old_title;
          if (typeof this.dataHead.old_id !== 'undefined')
            student['old_id'] = this.dataHead.old_id;
          if (typeof this.dataHead.old_yy !== 'undefined')
            student['old_yy'] = this.dataHead.old_yy;
          if (typeof this.dataHead.old_red_title !== 'undefined')
            student['old_red_title'] = this.dataHead.old_red_title;
          if (typeof this.dataHead.old_red_id !== 'undefined')
            student['old_red_id'] = this.dataHead.old_red_id;
          if (typeof this.dataHead.old_red_yy !== 'undefined')
            student['old_red_yy'] = this.dataHead.old_red_yy;
          var api = '/' + this.userData.appName + 'ApiCA/API/CASE/insertCaseData';
        }
      }

      console.log(student)
      this.http.post(api, $.extend({}, student), { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => { 
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          console.log(getDataOptions)
          if (getDataOptions.result == 1) {
            if (getDataOptions.error) {
              //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  //this.SpinnerService.hide();
                  this.searchCaseNo(3, getDataOptions.run_id);
                }
                subscription.unsubscribe();
              });
              //-----------------------------//
            } else {
              //this.SpinnerService.hide();
              this.searchCaseNo(3, getDataOptions.run_id);
            }

          } else {
            //-----------------------------//
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
             layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                //this.dataHead.id = this.caseNoLast+1;
              }
              subscription.unsubscribe();
            });
            //-----------------------------//
            this.SpinnerService.hide();
          }
        },     // nextHandler
      });
    }
  }

  setDeposit(title: any, run_id: any) {

    if (run_id) {
      var student = JSON.stringify({
        "run_id": run_id,
        "court_type_id": this.dataHead.court_type_id,
        "userToken": this.userData.userToken
      });
      //console.log(student)
    } else {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = Number(today.getMonth() + 1);
      var yyyy = today.getFullYear() + 543;

      this.dataHead.case_date = myExtObject.curDate();
      if (this.dataHead.case_date)
        var case_date: any = this.dataHead.case_date;
      else
        var case_date: any = dd + '/' + mm + "/" + yyyy;
      var student = JSON.stringify({
        "title": title,
        "case_date": case_date,
        "court_type_id": this.dataHead.court_type_id,
        "userToken": "AZrmbt8HPc-fJwI6q1bcMSGjTHfmXlSq"
      });
      //console.log(student)
    }

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/getCourtFee', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => { 
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        if (getDataOptions.result == 1) {
          this.onClickList6.emit(getDataOptions.data[0].fee_id);
        }
      },     // nextHandler
    });
  }

  changeCourtName(event: any) {
    var student = JSON.stringify({
      "table_name": "pcourt",
      "field_id": "court_province",
      "field_name": "court_ampheur",
      "field_name2": "court_tambon",
      "field_name3": "post_no",
      "condition": "AND court_id='" + event + "'",
      "userToken": this.userData.userToken
    });
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => { 
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        console.log(getDataOptions)
        if (getDataOptions.length) {
          //var court  = this.getCourt.filter((x:any) => x.fieldIdValue === event);
          //this.dataHead.court_id = getDataOptions[0].fieldIdValue;
          //console.log(court)
          this.onClickList7.emit(getDataOptions[0]);
        }
      },     // nextHandler
    });

  }

  receiveCopyData(event: any) {
    console.log(event)
    this.searchCaseNo(3, event.run_id);
    this.closebutton.nativeElement.click();
  }

  directiveDate(date: any, obj: any) {
    this.dataHead[obj] = date;
  }


  onOpenAlertSearch = () => {
    const modalRef: NgbModalRef = this.ngbModal.open(AlertSearchComponent)
    modalRef.componentInstance.alert = this.items
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if (item) {
        console.log(item)
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  onOpenCaseCopy = () => {
    var data = {
      "case_type" : this.dataHead.case_type,
      "title" : this.dataHead.title,
      "id" : this.dataHead.id,
      "run_id" : this.dataHead.run_id,
      "case_cate_id" : this.dataHead.case_cate_id
    };

    const modalRef: NgbModalRef = this.ngbModal.open(CaseCopyComponent,{ size: 'lg', backdrop: 'static' })
    modalRef.componentInstance.headData = data
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if (item) {
        console.log(item)
        this.receiveCopyData(item);
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

}
