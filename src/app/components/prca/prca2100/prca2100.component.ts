import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component';

import {
  CanActivate, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError, Routes
} from '@angular/router';
import { PrintReportService } from 'src/app/services/print-report.service';

// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';

declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-prca2100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prca2100.component.html',
  styleUrls: ['./prca2100.component.css']
})


export class Prca2100Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType: any; selCaseType: any;
  getDateType: any; selDateType: any;
  getJudge: any;
  getEventType: any;
  getOrderType: any;
  posts: any;
  search: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  delValue: any;
  getDep: any;
  getMonthTh: any;
  dep_id: any;
  sessData: any;
  userData: any;
  programName: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  numCase: any;
  numLit: any;
  retPage: any;
  myExtObject: any;
  toPage: any = "rca2100";
  asyncObservable: Observable<string>;
  result: any = [];
  tmpResult: any = [];
  dataSearch: any = [];
  judge_id: any;
  judge_name: any;
  stype: any;
  getType: any;

  notice_running: any;
  notice_no: any;
  notice_type_name: any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldNull: any;
  public listFieldType: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  // @ViewChild('prca2100',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
    private ngbModal: NgbModal,
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      destroy: true,
      lengthChange: false,
      info: false,
      paging: false,
      searching: false
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.result.prun_id = params['run_id'];
      this.result.pprint_by = params['pprint_by'];
      this.result.case_no = params['case_no'];
      this.result.red_no = params['red_no'];
    });

    this.getMonthTh = [{ "fieldIdValue": '1', "fieldNameValue": "มกราคม" },
    { "fieldIdValue": '2', "fieldNameValue": "กุมภาพันธ์" },
    { "fieldIdValue": '3', "fieldNameValue": "มีนาคม" },
    { "fieldIdValue": '4', "fieldNameValue": "เมษายน" },
    { "fieldIdValue": '5', "fieldNameValue": "พฤษภาคม" },
    { "fieldIdValue": '6', "fieldNameValue": "มิถุนายน" },
    { "fieldIdValue": '7', "fieldNameValue": "กรกฎาคม" },
    { "fieldIdValue": '8', "fieldNameValue": "สิงหาคม" },
    { "fieldIdValue": '9', "fieldNameValue": "กันยายน" },
    { "fieldIdValue": '10', "fieldNameValue": "ตุลาคม" },
    { "fieldIdValue": '11', "fieldNameValue": "พฤศจิกายน" },
    { "fieldIdValue": '12', "fieldNameValue": "ธันวาคม" }];

    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name": "pcase_type",
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "order_by": " case_type ASC",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();

      },
      (error) => { }
    )

    //======================== pdepartment ======================================
    var student = JSON.stringify({
      "table_name": "pdepartment",
      "field_id": "dep_code",
      "field_name": "dep_name",
      "field_name2": "print_dep_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
        this.getDep.forEach((x: any) => x.fieldIdValue = x.fieldIdValue.toString())
        console.log(this.getDep)
      },
      (error) => { }
    )

    var student = JSON.stringify({
      "cond": 2,
      "userToken": this.userData.userToken
    });
    this.listTable = 'pjudge';
    this.listFieldId = 'judge_id';
    this.listFieldName = 'judge_name';
    this.listFieldNull = '';
    this.listFieldType = JSON.stringify({ "type": 2 });

    //console.log(student)

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
      (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        if (productsJson.data.length) {
          this.list = productsJson.data;
          console.log(this.list)
        } else {
          this.list = [];
        }
        //  this.list = response;
        // console.log('xxxxxxx',response)
      },
      (error) => { }
    )

    //======================== pjudge ======================================
    var student = JSON.stringify({
      "table_name": "pjudge",
      "field_id": "judge_id",
      "field_name": "judge_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getJudge = getDataOptions;
        this.getJudge.forEach((x: any) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => { }
    )

    // this.getEventType = [{id:'1',text:'ส่งคำร้อง'},{id:'2',text:'รับคำร้อง'}];
    this.getType = [{ id: '', text: 'ไม่ระบุ' }, { id: '1', text: 'ก่อนเข้าระบบพิจารณาคดีต่อเนื่อง' }, { id: '2', text: 'ชั้นพิจารณาคดีต่อเนื่อง' }, { id: '3', text: 'คดีพิเศษ' }, { id: '4', text: 'คดีนัดวันเสาร์' }, { id: '5', text: 'คดีนัดตอนเย็น' }, { id: '6', text: 'ชั้นคดีสาขา' }, { id: '7', text: 'อื่นๆ' }];
    // this.result.order_type = '1';
    this.result.ptype = '';
    this.result.date_appoint = myExtObject.curDate();
  }

  getRemark(val: any) {
    // alert(val.checked);
    if (val.checked == true) {
      this.result.premark = 'และสำเนาคำฟ้อง';
    } else {
      this.result.premark = '';
    }
  }

  tabChangeSelect(objName: any, objData: any, event: any, type: any) {
    if (typeof objData != 'undefined') {
      if (type == 1) {
        var val = objData.filter((x: any) => x.fieldIdValue === event.target.value);
      } else {
        var val = objData.filter((x: any) => x.fieldIdValue === event);
      }
      console.log(objData)
      //console.log(event.target.value)
      //console.log(val)
      if (val.length != 0) {
        //  alert(val.length);
        this.result[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
        // if(objName=='zone_id'){
        //   this.changeAmphur(val[0].fieldIdValue,1);
      } else {
        this.result[objName] = null;
        this[objName] = null;
      }
    } else {
      // alert(val);
      this.result[objName] = null;
      this[objName] = null;
    }
  }

  tabChangeInput(name: any, event: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (name == 'judge_id') {
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "condition": " AND judge_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
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
    this.result.judge_id = event.judge_id;
    this.result.judge_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prca2100"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          res => { // Success
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
            console.log(getDataAuthen)
            this.programName = getDataAuthen.programName;
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
      this.dtTrigger.next(null);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterContentInit(): void {
    this.result.cFlag = 1;
    myExtObject.callCalendar();
  }

  loadMyModalComponent() {
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "100px");
  }

  changeCaseType(val: any) {
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

    var student3 = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "condition": "AND case_type='" + val + "'",
      "order_by": " case_cate_id ASC",
      "userToken": this.userData.userToken
    });

    //console.log("fCaseTitle")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
        },
        (error) => { }
      )

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student2, { headers: headers }).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
        },
        (error) => { }
      )

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student3, { headers: headers }).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          // this.getCaseCate = getDataOptions;
        },
        (error) => { }
      )

    });
    return promise;
  }


  closeModal() {
    $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
  }

  loadTableComponent(val: any) {
    // this.loadModalComponent = false;
    // this.loadComponent = false;
    // this.loadModalJudgeComponent = true;
    //$("#exampleModal").find(".modal-body").css("height", "auto");
    const modalRef: NgbModalRef = this.ngbModal.open(ModalJudgeComponent, { size: 'lg', backdrop: 'static' })
    modalRef.componentInstance.value1 = "pjudge"
    modalRef.componentInstance.value2 = "judge_id"
    modalRef.componentInstance.value3 = "judge_name"
    modalRef.componentInstance.value4 = ''
    modalRef.componentInstance.types = "1"
    modalRef.componentInstance.value5 = JSON.stringify({"type":1})

    modalRef.result.then((item: any) => {
      if (item) {
        this.result.judge_id = item.judge_id;
        this.result.judge_name = item.judge_name;
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  ClearAll() {
    window.location.reload();
  }

  printReport() {

    var rptName = 'rca2100';

    if (typeof (this.result.judge_name) == 'undefined') {
      this.result.judge_name = '';
    }
    if (typeof (this.result.pgroup) == 'undefined') {
      this.result.pgroup = '';
    }
    if (typeof (this.result.proom) == 'undefined') {
      this.result.proom = '';
    }

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "pdate_appoint": myExtObject.conDate(this.result.date_appoint),
      "judge_name": this.result.judge_name,
      "ptype": this.result.ptype,
      "proom": this.result.proom,
      "pgroup": this.result.pgroup,
      "prun_id": this.result.prun_id,
      "pprint_type": this.result.pprint_type,
      "pprint_by": this.result.pprint_by,

    });
    console.log(paramData);
    this.printReportService.printReport(rptName, paramData);
  }

  LoadData() {

    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    var student = JSON.stringify({
      "event_type": this.result.event_type,
      "event_date": this.result.event_date,
      "userToken": this.userData.userToken
    });
    console.log(student);
    this.http.post('/' + this.userData.appName + 'ApiKB/API/KEEPB/prca2100', student).subscribe(
      posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));

        this.posts = productsJson.data;
        console.log(productsJson)
        if (productsJson.result == 1) {

          this.dataSearch = productsJson.data;
          console.log(this.dataSearch);
          // alert(this.dataSearch.length);
          this.checklist = this.posts;
          if (productsJson.length)
            this.posts.forEach((x: any) => x.edit3001 = false);

          this.rerender();
          setTimeout(() => {
            myExtObject.callCalendar();
          }, 500);
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
        this.SpinnerService.hide();

      },
      (error) => { this.SpinnerService.hide(); }
    );
  }



  curencyFormat(n: any, d: any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  CloseWindow() {
    window.close();
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }


  goToPage(event_type: any) {
    let winURL = window.location.href;
    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + this.toPage + '?event_type=' + event_type;

    window.open(winURL, '_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");

  }
}







