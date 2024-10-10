import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalNoticeComponent } from '../../modal/modal-notice/modal-notice.component';
import { ModalCaseLitigant } from '../../modal/modal-case-litigant/modal-case-litigant.component';

import {
  CanActivate, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError, Routes
} from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { ModalNoticeLitigantComponent } from '../../modal/modal-notice-litigant/modal-notice-litigant.component';

@Component({
  selector: 'app-fno1800,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fno1800.component.html',
  styleUrls: ['./fno1800.component.css']
})


export class Fno1800Component implements AfterViewInit, OnInit, OnDestroy {
  title = 'datatables';

  toPage="fno1800";
  getLitType: any;
  getProv: any;
  getAmphur: any;
  getTambon: any;
  getNation: any;
  getInOut: any;
  getNoMoney: any;
  getSendBy: any;
  getPostType: any;
  getSendById: any;
  getPrintType: any;
  getPresent: any;

  sessData: any;
  userData: any;
  programName: any;
  dataHead: any = [];
  result: any = [];
  resultTmp: any = [];
  dataNotice: any = [];
  retNoticeNo: any = [];
  runId: any;
  noticeRunning: any;
  modalType: any;
  dataDeleteSelect:any = [];
  cancelTypeFlag:any;
  myExtObject: any;
  tmp_notice_no: any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;

  public loadModalJudgeComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  public loadModalLitComponent: boolean = false;
  public loadModalNoticeLitComponent: boolean = false;

  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  defaultdepTelNo: any;
  asyncObservable: Observable<string>;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public masterSelect: boolean = false;
  public loadComponent: boolean = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChild(ModalNoticeLitigantComponent) child2: ModalNoticeLitigantComponent;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal
  ) { }

  ngOnInit(): void {
    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    console.log(this.userData);

    this.dtOptions = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false
    };

    this.activatedRoute.queryParams.subscribe(params => {
      this.runId = params['run_id'];
      this.noticeRunning = params['notice_running'];
      if (this.runId > 0) {
        this.dataHead.run_id = params['run_id'];
        this.getNoticeData(0);
      }
      if (this.noticeRunning) {
        this.result.notice_running = this.noticeRunning;
        this.searchNotice(1);
      }
    });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name": "plit_type",
      "field_id": "lit_type",
      "field_name": "lit_type_desc",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getLitType = getDataOptions;
      },
      (error) => { }
    )

    this.successHttp();
    this.setDefPage();
  }
  setDefPage() {
    this.tmp_notice_no = 0;
    this.result = [];
    this.result.notice_running = 0;
    this.result.jp_flag = 1;
    this.result.notice_type_id = 17;
    this.result.checkbox = 0;
    this.result.lit_type = 2;
    this.result.type_by = this.userData.offName;
    this.result.type_date = myExtObject.curDate();
    this.result.notice_yy = myExtObject.curYear();
    this.result.notice_date = myExtObject.curDate();
    this.result.remark = "แล้วส่งตัวจำเลยไปกักขังตามหมายกักขังที่              ลว               ที่ส่งมาตามหมายปล่อยฉบับนี้";
    this.result.cancel_flag = 0;
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fno1800"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          res => { // Success
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
            console.log(getDataAuthen)
            this.programName = getDataAuthen.programName;
            this.defaultCaseType = getDataAuthen.defaultCaseType;
            this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
            this.defaultTitle = getDataAuthen.defaultTitle;
            this.defaultRedTitle = getDataAuthen.defaultRedTitle;
            this.defaultdepTelNo = getDataAuthen.depTelNo;
            // this.result.dep_tel_no = this.defaultdepTelNo;
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
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance)
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
  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }
  checkUncheckAll(obj: any, master: any, child: any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
  }

  isAllSelected(obj: any, master: any, child: any) {
    this[master] = obj.every(function (item: any) {
      return item[child] == true;
    })
  }
  setCalendar(obj: any) {
    if (this.result.notice_type_id == 17)
      myExtObject.callCalendarSet(obj);
  }

  fnDataHead(event: any) {
    console.log(event)
    this.dataHead = event;
    if (this.dataHead.buttonSearch == 1) {
      this.setDefPage();
      this.getNoticeData(0);
      this.result.alle_desc = this.dataHead.alle_desc;
      this.result.pros_name = this.dataHead.pros_desc;
      this.result.accu_name = this.dataHead.accu_desc;
      this.runId = { 'run_id': event.run_id, 'counter': Math.ceil(Math.random() * 10000), 'notSearch': 1 }
    }
  }

  runNotice() {
    if (!this.result.notice_running && this.result.notice_type_id) {
      var student = JSON.stringify({
        "notice_type_id": this.result.notice_type_id,
        "notice_yy": this.result.notice_yy,
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/fno1800/runNoticeCNo', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if (productsJson.result == 1) {
            this.tmp_notice_no = productsJson.notice_no;
            this.result.notice_no = productsJson.notice_no;
            this.result.notice_yy = productsJson.notice_yy;
          } else {
            this.result.notice_no = '';
            this.result.notice_yy = myExtObject.curYear();
          }
        },
        (error) => { }
      )
    }
  }

  popupLitName(){
    var student = JSON.stringify({
      "run_id": this.dataHead.run_id,
      "lit_type": this.result.lit_type,
      "seq": this.result.item,
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/popupLitName', student).subscribe(
      (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        console.log(productsJson);
        if(productsJson.data.length){
          var litDesc = productsJson.data[0].lit_type_desc3?(" "+productsJson.data[0].lit_type_desc3):"";
          this.result.item = productsJson.data[0].seq;
          this.result.accuitem_name=(productsJson.data[0].lit_name?productsJson.data[0].lit_name:'')+litDesc;
        }else{
          this.result.item = '';
          this.result.accuitem_name = '';
        }
      },
      (error) => { }
    )
  }

  tabChangeInput(name: any, event: any) {
    console.log(name);
    if (name == 'item') {
      if (this.dataHead.run_id && this.result.lit_type) {
        this.popupLitName();
      }
    } else if (name == 'prison') {
      if (this.result.jp_flag == 1) {
        var student = JSON.stringify({
          "table_name": "pjail",
          "field_id": "jail_id",
          "field_name": "jail_name",
          "condition": " AND jail_id='" + event.target.value + "'",
          "userToken": this.userData.userToken
        });
      } else {
        var student = JSON.stringify({
          "table_name": "ppolice",
          "field_id": "police_id",
          "field_name": "police_name",
          "condition": " AND police_id='" + event.target.value + "'",
          "userToken": this.userData.userToken
        });
      }
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.noticeto_name = productsJson[0].fieldNameValue;
          } else {
            this.result.prison = null;
            this.result.noticeto_name = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'back_notice_id') {
      var student = JSON.stringify({
        "table_name": "pnotice_type",
        "field_id": "notice_type_id",
        "field_name": "notice_type_name",
        "condition": " AND notice_type_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.back_notice = productsJson[0].fieldNameValue;
          } else {
            this.result.back_notice_id = null;
            this.result.back_notice = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'fromnow_id') {
      var student = JSON.stringify({
        "table_name": "pnotice_order",
        "field_id": "order_id",
        "field_name": "order_desc",
        "condition": " AND order_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.fromnow = productsJson[0].fieldNameValue;
          } else {
            this.result.fromnow_id = null;
            this.result.fromnow = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'endnotice_id') {
      var student = JSON.stringify({
        "table_name": "pendnotice",
        "field_id": "endnotice_id",
        "field_name": "endnotice_desc",
        "condition": " AND endnotice_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.bremark = productsJson[0].fieldNameValue;
          } else {
            this.result.endnotice_id = null;
            this.result.bremark = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'judge_id') {
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "condition": " AND judge_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.judge_name = productsJson[0].fieldNameValue;
          } else {
            this.result.judge_id = null;
            this.result.judge_name = '';
          }
        },
        (error) => { }
      )
    }
  }

  receiveJudgeListData(event: any) {
    if (this.modalType == 7) {
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
    }
    this.closebutton.nativeElement.click();
  }

  receiveFuncListData(event: any) {
    console.log(event)
    if (this.modalType == 1) {
      this.result.item = event.fieldIdValue;
      // this.result.accuitem_name = event.fieldNameValue;
      this.popupLitName();

    } else if (this.modalType == 2) {
      this.result.lit_type = event.lit_type;
      this.result.item = event.seq;
      var litDesc = event.lit_type_desc3?(" "+event.lit_type_desc3):"";
      this.result.accuitem_name=(event.lit_name?event.lit_name:'')+litDesc;
        
    } else if (this.modalType == 3) {
      this.result.prison = event.fieldIdValue;
      this.result.noticeto_name = event.fieldNameValue;
      this.result.noticeto_name2 = event.fieldNameValue2;
    } else if (this.modalType == 4) {
      this.result.back_notice_id = event.fieldIdValue;
      this.result.back_notice = event.fieldNameValue;
    } else if (this.modalType == 5) {
      this.result.fromnow_id = event.fieldIdValue;
      this.result.fromnow = event.fieldNameValue;
    } else if (this.modalType == 6) {
      this.result.endnotice_id = event.fieldIdValue;
      this.result.bremark = event.fieldNameValue;
    } else if (this.modalType == 8) {
      this.result.type_by = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  clickOpenMyModalComponent(type: any) {
    if ((type == 1 || type == 2 ) && !this.dataHead.run_id) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
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
      this.modalType = type;
      this.openbutton.nativeElement.click();
    }
  }

  closeModal() {
    this.loadModalJudgeComponent = false;
    this.loadModalComponent = false;
    this.loadModalConfComponent = false;
    this.loadModalLitComponent = false;

    if(this.cancelTypeFlag == "cancelFlag"){
      var tmp = !this.result.cancel_flag;
      this.result.cancel_flag = tmp;
    }
  }

  getLastNotice(){
    if (!this.dataHead.run_id) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    }else if(!this.result.lit_type || !this.result.item){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกคู่ความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    }else{
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id ? this.dataHead.run_id : this.result.run_id,
        "lit_type" :  this.result.lit_type,
        "seq" :  this.result.item,
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno1800/popupNoticeC', student).subscribe(
        (response) =>{
          let productsJson: any = JSON.parse(JSON.stringify(response));
            if (productsJson.length) {
              this.list = productsJson;
            } else {
              this.list = [];
            }
            this.modalNoticeComponent();
        },
        (error) => {}
      )
    }
  }

  modalNoticeComponent = () => {
    const modalRef = this.ngbModal.open(ModalNoticeComponent, { size : 'lg'})
    modalRef.componentInstance.types = 1;
    modalRef.componentInstance.items = this.list;
    modalRef.result.then((item: any) => {
      if(item){
        console.log(item)
        this.result.prison = item.prison;
        this.result.noticeto_name = item.noticeto_name;
        this.result.noticeto_name2 = item.noticeto_name2;
        this.result.back_notice_id = item.notice_type_id;
        this.result.back_notice = item.notice_type_name;
        this.result.noticetype_no1 = item.notice_no;
        this.result.noticetype_yy1 = item.notice_yy;
        this.result.noticetype_date1 = item.notice_date;
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  submitModalFormLit() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.dataHead.run_id) {
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    }else if(!this.result.notice_no) {
      confirmBox.setMessage('กรุณาป้อนเลขที่หมาย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    }else if(!this.result.item) {
      confirmBox.setMessage('กรุณาเลือกข้อมูลจำเลย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    }else if(!this.result.noticeto_name) {
      confirmBox.setMessage('กรุณาป้อนข้อมูลเรือนจำ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    }else if(this.result.notice_no &&((this.result.notice_no-this.tmp_notice_no)>10)) {
      confirmBox.setMessage('เลขที่หมาย run กระโดดเกินเลขหมายล่าสุดมากกว่า 10 กรุณาตรวจสอบเลขหมายก่อนจัดเก็บ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      console.log(this.result.checkbox);
      if(!this.result.checkbox){
        if(this.result.remark=="แล้วส่งตัวจำเลยไปกักขังตามหมายกักขังที่              ลว               ที่ส่งมาตามหมายปล่อยฉบับนี้")
          this.result.remark='';
      }
      
      this.result['red_title'] = this.dataHead.red_title;
      this.result['red_id'] = this.dataHead.red_id;
      this.result['red_yy'] = this.dataHead.red_yy;
      this.result['dep_tel_no'] = this.defaultdepTelNo;
      this.result["userToken"] = this.userData.userToken;
      this.result["run_id"] = this.dataHead.run_id;
      
      var student = JSON.stringify($.extend({}, this.result));
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/fno1800/saveNoticeC', student).subscribe(
        (response) => {
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          console.log(alertMessage)
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
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.result.notice_running = alertMessage.notice_running;
                this.searchNotice(1);
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { }
      )
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
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });
    } else if (!chkForm.log_remark) {
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
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
        "user_running": this.userData.userRunning,
        "password": chkForm.password,
        "log_remark": chkForm.log_remark,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson: any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          if (productsJson.result == 1) {
            const confirmBox2 = new ConfirmBoxInitializer();
            console.log(this.result.cancel_flag);
            if (this.modalType == 9) {
              if(this.result.cancel_flag){
                confirmBox2.setTitle('ข้อความแจ้งเตือน');
                confirmBox2.setMessage('ต้องการยกเลิกหมายใช่หรือไม่?');
              }else{
                confirmBox2.setTitle('ข้อความแจ้งเตือน');
                confirmBox2.setMessage('ต้องการยกเลิกการยกเลิกหมายใช่หรือไม่?');
              }              
            } else if (this.modalType == 10) {
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            }
            confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
            // Choose layout color type
            confirmBox2.setConfig({
              layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                if(this.modalType==9){
                  if(this.result.cancel_flag){
                    this.result.cancel_reason = chkForm.log_remark;
                  }else{
                    this.result.cancel_reason = '';
                  }
                  this.cancelTypeFlag = "";
                  this.closebutton.nativeElement.click();
                }else if(this.modalType==10){
                  this.SpinnerService.show();

                  var dataDel = [];
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = this.dataDeleteSelect;

                  var data = $.extend({}, dataDel);
                  this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/fno1800/deleteNoticeC', data, ).subscribe(
                    (response) => {
                      let alertMessage: any = JSON.parse(JSON.stringify(response));
                      console.log(alertMessage)
                      if (alertMessage.result == 0) {
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success == true) {
                            this.closebutton.nativeElement.click();
                            this.SpinnerService.hide();
                          }
                          subscription.unsubscribe();
                        });
                      } else {
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success == true) {
                            this.closebutton.nativeElement.click();
                            this.getNoticeData(0);
                            this.setDefPage();
                          }
                          subscription.unsubscribe();
                        });
                      }
                    },
                    (error) => { this.SpinnerService.hide(); }
                  )
                }
              }
              subscription2.unsubscribe();
            });
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
        },
        (error) => { }
      );
    }
  }

  loadMyModalComponent() {
    if (this.modalType == 1) {
      $("#exampleModal").find(".modal-content").css("width", "800px");
      var student = JSON.stringify({
        "table_name": "pcase_litigant",
        "field_id": "seq",
        "field_name": "CONCAT(title, name) AS fieldNameValue",
        "condition": " AND run_id='" + this.dataHead.run_id + "' AND lit_type='" + this.result.lit_type + "'",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pcase_litigant';
      this.listFieldId = 'seq';
      this.listFieldName = 'CONCAT(title, name) AS fieldNameValue';
      this.listFieldNull = '';
      this.listFieldCond = " AND run_id='" + this.dataHead.run_id + "' AND lit_type='" + this.result.lit_type + "'";
    } else if (this.modalType == 2) {
      this.listTable = '2';
      this.loadModalComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalLitComponent = true;
      this.loadModalJudgeComponent = false;
      this.loadModalNoticeLitComponent = false;
    } else if (this.modalType == 3) {
      if (this.result.jp_flag == 1) {
        var student = JSON.stringify({
          "table_name": "pjail",
          "field_id": "jail_id",
          "field_name": "jail_name",
          "field_name2": "notice_to",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pjail';
        this.listFieldId = 'jail_id';
        this.listFieldName = 'jail_name';;
        this.listFieldNull = '';
      } else {
        var student = JSON.stringify({
          "table_name": "ppolice",
          "field_id": "police_id",
          "field_name": "police_name",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pjail';
        this.listFieldId = 'jail_id';
        this.listFieldName = 'jail_name';;
        this.listFieldNull = '';
      }
    } else if (this.modalType == 4) {
      var student = JSON.stringify({
        "table_name": "pnotice_type",
        "field_id": "notice_type_id",
        "field_name": "notice_type_name",
        "condition": " AND (notice_type_id BETWEEN 9 AND 17 ) ",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pnotice_type';
      this.listFieldId = 'notice_type_id';
      this.listFieldName = 'notice_type_name';;
      this.listFieldNull = '';
      this.listFieldCond = " AND (notice_type_id BETWEEN 9 AND 17 ) ";
    } else if (this.modalType == 5) {
      var student = JSON.stringify({
        "table_name": "pnotice_order",
        "field_id": "order_id",
        "field_name": "order_desc",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pnotice_order';
      this.listFieldId = 'order_id';
      this.listFieldName = 'order_desc';;
      this.listFieldNull = '';
      this.listFieldCond = "";
    } else if (this.modalType == 6) {
      var student = JSON.stringify({
        "table_name": "pendnotice",
        "field_id": "endnotice_id",
        "field_name": "endnotice_desc",
        "condition": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pendnotice';
      this.listFieldId = 'endnotice_id';
      this.listFieldName = 'endnotice_desc';;
      this.listFieldNull = '';
      this.listFieldCond = "";
    } else if (this.modalType == 7) {//judge
      $("#exampleModal").find(".modal-content").css("width", "650px");
      this.loadModalComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalJudgeComponent = true;
      this.loadModalNoticeLitComponent = false;
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldNull = '';
      this.listFieldCond = '';
      this.listFieldType = JSON.stringify({ "type": 2 });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupJudge', student, { headers: headers }).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
            console.log(this.list)
          } else {
            this.list = [];
          }
        },
        (error) => { }
      )
    } else if (this.modalType == 8) {
      var student = JSON.stringify({
        "table_name": "pofficer",
        "field_id": "off_id",
        "field_name": "off_name",
        "condition": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pofficer';
      this.listFieldId = 'off_id';
      this.listFieldName = 'off_name';;
      this.listFieldNull = '';
      this.listFieldCond = "";
    }else{
      this.loadModalComponent = false;
      this.loadModalConfComponent = true;
      this.loadModalJudgeComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalNoticeLitComponent = false;
      if(this.modalType == 9)
        this.cancelTypeFlag = "cancelFlag";
    }
    if (this.modalType == 1 || this.modalType == 3 || this.modalType == 4 || this.modalType == 5 || this.modalType == 6 || this.modalType == 8) {
      this.loadModalComponent = true;
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalNoticeLitComponent = false;
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student, { headers: headers }).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
        },
        (error) => { }
      )
    }
  }

  editData(index:any){
    this.result.notice_running = this.dataNotice[index].notice_running;
    this.searchNotice(1);
  }

  getNoticeData(type: any) {
    if (this.dataHead.run_id) {
      var student = JSON.stringify({
        "run_id": this.dataHead.run_id,
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/fno1800/getNoticeCData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if (productsJson.data.length) {
            this.dataNotice = productsJson.data;
            var bar = new Promise((resolve, reject) => {
              this.dataNotice.forEach((x: any) => x.nRunning = false);
              this.rerender();
              this.masterSelect = false;
            });
            console.log(this.dataNotice);
            this.SpinnerService.hide();
          } else {
            this.dataNotice = [];
            this.rerender();
            this.SpinnerService.hide();
            this.masterSelect = false;
          }
        },
        (error) => { }
      )
    }
  }

  searchNotice(type: any) {
    if ((type == 2) && (!this.result.notice_no || !this.result.notice_yy)) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุรหัสหมายให้ครบถ้วน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    } else {
      if (type == 1) {
        var student = JSON.stringify({
          "notice_running": this.result.notice_running ? this.result.notice_running : 0,
          "userToken": this.userData.userToken
        });
      } else if (type == 2) {
        var student = JSON.stringify({
          "notice_type_id": this.result.notice_type_id,
          "notice_no": this.result.notice_no,
          "notice_yy": this.result.notice_yy,
          "userToken": this.userData.userToken
        });
      }

      this.SpinnerService.show();
      this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/fno1800/getNoticeCData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.result=[];
            this.result = JSON.parse(JSON.stringify(productsJson.data[0]));
            this.result.checkbox = 0;
            if(!this.result.remark)
              this.result.remark = "แล้วส่งตัวจำเลยไปกักขังตามหมายกักขังที่              ลว               ที่ส่งมาตามหมายปล่อยฉบับนี้";
            
            this.dataHead.run_id = this.result.run_id;
            this.getNoticeData(0);
          } else {
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.setDefPage();
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { }
      )
    }
  }

  copyData() {
    if (!this.result.notice_running) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบเลขหมายที่ต้องการสำเนา กรุณาค้นหาหมาย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    } else {
      var student = JSON.stringify({
        "notice_running": this.result.notice_running,
        "notice_type_id": this.result.Notice_type_id,
        "userToken": this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/fno1800/copyNoticeC', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if (productsJson.result == 1) {
            confirmBox.setMessage('สำเนาข้อมูลหมายเรียบร้อยแล้ว');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.result.notice_running = productsJson.notice_running;
                this.searchNotice(1);
                this.getNoticeData(0);
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          } else {

            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { }
      )
    }
  }

  deleteData(index:any) {

    this.dataDeleteSelect = [];
    this.dataDeleteSelect.push(this.dataNotice[index]);
    this.clickOpenMyModalComponent(10);
  }

  buttonNew() {//เพิ่ม
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    location.replace(winURL + this.toPage)
    window.location.reload();
  }

  printReport(){
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
    }else{
      var rptName = 'rno_color';
      var paramData ='{}';

      var paramData = JSON.stringify({
        "pcourt_running" : this.result.court_running ? this.result.court_running : "",
        "pnotice_running" : this.result.notice_running ? this.result.notice_running : "",
        // "pcolor" : 1,
        "pprint_by" : 1,
        "ppage" : 1,
      });
      console.log("paramData=>",paramData);
      this.printReportService.printReport(rptName,paramData);
    }
  }
}