import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from 'src/app/services/excel.service.ts';
// import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-prkb0500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prkb0500.component.html',
  styleUrls: ['./prkb0500.component.css']
})


export class Prkb0500Component implements AfterViewInit, OnInit, OnDestroy {
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
  toPage: any = "rkb0500";
  asyncObservable: Observable<string>;
  result: any = [];
  tmpResult: any = [];
  dataSearch: any = [];
  judge_id: any;
  judge_name: any;
  stype: any;

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
  // @ViewChild('prkb0500',{static: true}) case_type : ElementRef;
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
    // this.activatedRoute.queryParams.subscribe(params => {
    //   if(params['program'])
    //     this.retPage = params['program'];
    // });

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.result.event_type = params['event_type'];
      // this.result.notice_running = params['notice_running'];
      // this.result.notice_no = params['notice_no'];
      // this.result.notice_type_name = params['notice_type_name'];
      // if(typeof this.notice_running !='undefined')
      //   this.LoadData();

    });
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

    this.getEventType = [{ id: '1', text: 'ส่งคำร้อง' }, { id: '2', text: 'รับคำร้อง' }];
    this.getOrderType = [{ id: '1', text: 'ลำดับที่รับ/ส่ง' }, { id: '2', text: 'เลขคดีดำ' }, { id: '3', text: 'เลขคดีแดง' }, { id: '4', text: 'หน่วยงานปลางทาง' }, { id: '5', text: 'หน่วยงานปลายทางและผู้พิพากษา' }];
    this.result.order_type = '1';
    this.result.event_date = myExtObject.curDate();
    this.LoadData();

  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

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

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prkb0500"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          res => { // Success
            //this.results = res.json().results;
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
            console.log(getDataAuthen)
            this.programName = getDataAuthen.programName;
            // this.defaultCaseType = getDataAuthen.defaultCaseType;
            // this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
            // this.defaultTitle = getDataAuthen.defaultTitle;
            // this.defaultRedTitle = getDataAuthen.defaultRedTitle;
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
    this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadModalJudgeComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "auto");
  }

  receiveJudgeListData(event: any) {
    this.result.judge_id = event.judge_id;
    this.result.judge_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  ClearAll() {
    window.location.reload();
  }


  printReport() {

    var rptName = 'rkb0500';

    if (typeof (this.result.pno_from) == 'undefined') {
      this.result.pno_from = '';
    }
    if (typeof (this.result.pno_to) == 'undefined') {
      this.result.pno_to = '';
    }
    if (typeof (this.result.dep_id) == 'undefined') {
      this.result.dep_id = '';
    }
    if (typeof (this.result.event_type) == 'undefined') {
      this.result.event_type = '';
    }
    if (this.result.dep_id) {
      this.result.deps = this.getDep.find(x => x.fieldIdValue == this.result.dep_id)
      this.result.dep_name = this.result.deps.fieldNameValue;
    } else {
      this.result.dep_name = '';
    }

    console.log(this.result.deps);

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "pevent_date": myExtObject.conDate(this.result.event_date),
      "ptype": this.result.event_type,
      "pno_from": this.result.pno_from,
      "pno_to": this.result.pno_to,
      "porder": this.result.order_type,
      "pdep_id": this.userData.depCode.toString(),
      "prun_id": '',
      "puser_id": this.userData.userCode.toString(),
      "pdep_name": this.result.dep_name,
      "pdep_code": this.result.dep_id,
      "pjudge_id": '',
      "pflag": '',
    });
    console.log(paramData);
    // alert(paramData);return false;
    this.printReportService.printReport(rptName, paramData);
  }

  LoadData() {
    //  alert("xxxx");
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
    this.http.post('/' + this.userData.appName + 'ApiKB/API/KEEPB/prkb0500', student).subscribe(
      posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));

        this.posts = productsJson.data;
        // this.posts.release_date =  myExtObject.callCalendarSet('posts.release_date');
        console.log(productsJson)
        if (productsJson.result == 1) {

          this.dataSearch = productsJson.data;
          console.log(this.dataSearch);
          // alert(this.dataSearch.length);
          this.checklist = this.posts;
          // this.checklist2 = this.posts;
          if (productsJson.length)
            this.posts.forEach((x: any) => x.edit3001 = false);

          this.rerender();
          setTimeout(() => {
            myExtObject.callCalendar();
          }, 500);
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
    //alert(winURL);
    window.open(winURL, '_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
    //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  }

}