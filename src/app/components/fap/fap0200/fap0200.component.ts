import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, AfterContentInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { PrintReportService } from 'src/app/services/print-report.service';
// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';
import { ExcelService } from '../../../services/excel.service.ts';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fap0200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fap0200.component.html',
  styleUrls: ['./fap0200.component.css']
})


export class Fap0200Component implements AfterViewInit, OnInit, OnDestroy, AfterContentInit {
  //form: FormGroup;
  title = 'datatables';

  getCaseType: any;
  getTimeFlag: any; selTimeFlag: any;
  getCaseCate: any;
  getCourtType: any;
  getJudgeBy: any;
  sessData: any;
  userData: any;
  programName: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  masterSelected: boolean;
  checklist: any;
  asyncObservable: Observable<string>;
  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;

  result: any = [];
  items: any = [];
  objItems: any = [];
  myExtObject: any;
  modalType: any;
  app_id: any;
  delay_id: any;
  result_id: any;
  getAppoint: any;
  getDelay: any;
  getResult: any;
  getTitle: any;
  titleType = new Array;
  getCourt: any;
  getJudgeRoom: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadModalListComponent: boolean = false;
  masterSelect: boolean = false;


  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private excelService: ExcelService,
  ) {
    this.masterSelected = false
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      destroy: true
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name": "pcase_type",
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "order_by": " case_type ASC",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;

      },
      (error) => { }
    )
    //======================== pcase_cate ======================================
    var student = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "order_by": "case_cate_id ASC",
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
      },
      (error) => { }
    )
    //======================== pcourt_type ======================================
    var student = JSON.stringify({
      "table_name": "pcourt_type",
      "field_id": "court_type_id",
      "field_name": "court_type_name",
      "condition": " AND select_flag='1'",
      "order_by": "court_type_id ASC",
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCourtType = getDataOptions;
      },
      (error) => { }
    )
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name": "pcourt",
      "field_id": "court_id",
      "field_name": "court_name",
      "field_name2": "court_running",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        console.log(this.getCourt)
      },
      (error) => { }
    )
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name": "pjudge_room",
      "field_id": "room_id",
      "field_name": "room_desc",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getJudgeRoom = getDataOptions;
        console.log(this.getCourt)
      },
      (error) => { }
    )
    //======================== pappoint_list ======================================
    /*
    var student = JSON.stringify({
      "table_name" : "pappoint_list",
      "field_id" : "app_id",
      "field_name" : "app_name",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAppoint = getDataOptions;
        this.getAppoint.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())

      },
      (error) => {}
    )

    //======================== pappoint_delay ======================================
    var student = JSON.stringify({
      "table_name" : "pappoint_delay",
      "field_id" : "delay_id",
      "field_name" : "delay_name",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDelay = getDataOptions;
        this.getDelay.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())

      },
      (error) => {}
    )
    */
    //======================== pappoint_result ======================================
    var student = JSON.stringify({
      "table_name": "pappoint_result",
      "field_id": "result_id",
      "field_name": "result_name",
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getResult = getDataOptions;
        this.getResult.forEach((x: any) => x.fieldIdValue = x.fieldIdValue.toString())

      },
      (error) => { }
    )
    //======================== ptitle ======================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title_desc",
      "field_name2": "case_type",
      "condition": "AND title_flag='1'",
      "order_by": " order_id ASC",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getTitle = getDataOptions;
        setTimeout(() => {
          for (var i = 0; i < this.getCaseType.length; i++) {
            this.titleType[this.getCaseType[i].fieldIdValue] = this.getTitle.filter((x: any) => x.fieldNameValue2 === this.getCaseType[i].fieldIdValue);
          }
        }, 1000);

      },
      (error) => { }
    )


    this.getTimeFlag = [
      { fieldIdValue: 0, fieldNameValue: 'ทั้งหมด' },
      { fieldIdValue: 1, fieldNameValue: 'เช้า' },
      { fieldIdValue: 2, fieldNameValue: 'บ่าย' },
      { fieldIdValue: 3, fieldNameValue: 'เย็น' }
    ];
    this.result.time_flag = 0;
    this.getJudgeBy = [
      { fieldIdValue: 1, fieldNameValue: 'ห้องพิจารณา' },
      { fieldIdValue: 2, fieldNameValue: 'ต่างจังหวัด' },
      { fieldIdValue: 3, fieldNameValue: 'VDO conference' },
      { fieldIdValue: 5, fieldNameValue: 'VDO conference ต่างประเทศ' },
      { fieldIdValue: 4, fieldNameValue: 'Net meeting' }];
    this.result.case_flag = 1;
    // this.result.judge_by = 1;
    //this.asyncObservable = this.makeObservable('Async Observable');
    this.successHttp();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fap0200"
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
  }
  ngAfterContentInit(): void {
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    if (this.modalType == 1) {
      if (!this.result.case_type) {
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาเลือกความ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
            //this.SpinnerService.hide();
          }
          subscription.unsubscribe();
        });
      } else {
        this.openbutton.nativeElement.click();
      }
    } else if (this.modalType == 2 || this.modalType == 3 || this.modalType == 4 || this.modalType == 5 || this.modalType == 6) {
      this.openbutton.nativeElement.click();
    }
  }
  loadMyModalComponent() {

    if (this.modalType == 1) {
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title_desc",
        "search_id": "",
        "search_desc": "",
        "condition": " AND case_type='" + this.result.case_type + "' AND title_flag=1",
        "userToken": this.userData.userToken
      });
      this.listTable = 'ptitle';
      this.listFieldId = 'title';
      this.listFieldName = 'title_desc';
      this.listFieldNull = '';
      this.listFieldCond = " AND case_type='" + this.result.case_type + "' AND title_flag=1";
    } else if (this.modalType == 2) {
      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pappoint_table';
      this.listFieldId = 'table_id';
      this.listFieldName = 'table_name';
      this.listFieldNull = '';
    } else if (this.modalType == 3) {
      var student = JSON.stringify({
        "table_name": "pmt_weekday",
        "field_id": "date_day",
        "field_name": "date_name",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pmt_weekday';
      this.listFieldId = 'date';
      this.listFieldName = 'date_name';
      this.listFieldNull = '';
    } else if (this.modalType == 4) {
      var student = JSON.stringify({
        "table_name": "pappoint_list",
        "field_id": "app_id",
        "field_name": "app_name",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pappoint_list';
      this.listFieldId = 'app_id';
      this.listFieldName = 'app_name';
      this.listFieldNull = '';
    } else if (this.modalType == 5) {
      var student = JSON.stringify({
        "table_name": "pappoint_delay",
        "field_id": "delay_id",
        "field_name": "delay_name",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pappoint_delay';
      this.listFieldId = 'delay_id';
      this.listFieldName = 'delay_name';
      this.listFieldNull = '';
    } else if (this.modalType == 6) {
      var student = JSON.stringify({
        "table_name": "pappoint_result",
        "field_id": "result_id",
        "field_name": "result_name",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pappoint_result';
      this.listFieldId = 'result_id';
      this.listFieldName = 'result_name';
      this.listFieldNull = '';
    }

    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student, { headers: headers }).subscribe(
      (response) => {
        console.log(response)
        this.list = response;
        if (this.modalType == 4 || this.modalType == 5 || this.modalType == 6) {
          this.loadModalComponent = false;
          this.loadComponent = false;
          this.loadModalListComponent = true;
        } else {
          this.loadModalComponent = true;
          this.loadComponent = false;
          this.loadModalListComponent = false;
        }

      },
      (error) => { }
    )

  }

  loadMyModalJudgeComponent(type: any) {

    //$(".modal-backdrop").remove();
    this.loadComponent = true; //popup
    this.loadModalComponent = false; //password confirm
    this.loadModalListComponent = false;
    //$("#exampleModal").find(".modal-body").css("height","auto");
    //$("#exampleModal").css({"background":"rgba(51,32,0,.4)"});
    if (type == 2) {
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldNull = '';
      this.listFieldType = JSON.stringify({ "type": 2 });
    }
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
  }

  // checkUncheckAll(obj:any,master:any,child:any) {
  //   for (var i = 0; i < obj.length; i++) {
  //     obj[i][child] = this[master];
  //   }
  // }

  // isAllSelected(obj:any,master:any,child:any) {
  //   this[master] = obj.every(function(item:any) {
  //     return item[child] == true;
  //   })
  // }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].sendData = this.masterSelected;
    }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.sendData == true;
    })
  }

  sendToCalendar() {
    var isChecked = this.items.every(function (item: any) {
      return item.sendData == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ไม่พบเงื่อนไข?');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ส่ง');
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
      var dataSend = [], dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        this.items.forEach((ele, index, array) => {
          if (ele.sendData == true && ele.cancel_flag != 1) {
            dataTmp.push(this.items[index]);
          }
        });
      });
      if (bar) {
        dataSend['userToken'] = this.userData.userToken;
        dataSend['data'] = dataTmp;
        var data = $.extend({}, dataSend);
        this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/sendToCalendar', data).subscribe(
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
              let winURL = alertMessage.url;
              myExtObject.OpenWindowMax(winURL);
              /*confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {                  
                }
                subscription.unsubscribe();
              });
              */
            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      }
    }
  }


  closeModal() {
    this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadModalListComponent = false;
  }

  submitModalForm() {

  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  receiveFuncListData(event: any) {
    if (this.modalType == 1) {
      this.result.title_id = event.fieldIdValue;
      this.result.title_desc = event.fieldNameValue;
    } else if (this.modalType == 2) {
      this.result.table_id = event.fieldIdValue;
      this.result.table_name = event.fieldNameValue;
    } else if (this.modalType == 3) {
      this.result.dayweek_id = event.fieldIdValue;
      this.result.dayweek = event.fieldNameValue;
    } else if (this.modalType == 4) {
      this.result.app_id = event.fieldIdValue;
      this.result.app_name = event.fieldNameValue;
    } else if (this.modalType == 5) {
      this.result.delay_id = event.fieldIdValue;
      this.result.delay_name = event.fieldNameValue;
    } else if (this.modalType == 6) {
      this.result.result_id = event.fieldIdValue;
      this.result.result_name = event.fieldNameValue;
    }

    this.closebutton.nativeElement.click();
  }

  receiveJudgeListData(event: any) {
    console.log(event)
    this.result.judge_id = event.judge_id;
    this.result.judge_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  tabChangeSelect(objName: any, objData: any, event: any, type: any) {
    if (typeof objData != 'undefined') {
      if (type == 1) {
        var val = objData.filter((x: any) => x.fieldIdValue === event.target.value);
      } else {
        var val = objData.filter((x: any) => x.fieldIdValue === event);
      }
      if (val.length != 0) {
        this.result[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
      }
    } else {
      this.result[objName] = null;
      this[objName] = null;
    }
  }

  tabChangeSelectObj(objName: any, objData: any, event: any, type: any) {
    if (typeof objData != 'undefined') {
      if (type == 1) {
        var val = objData.filter((x: any) => x.fieldIdValue === event.target.value);
      } else {
        var val = objData.filter((x: any) => x.fieldIdValue === event);
      }
      if (val.length != 0) {
        this.result[objName] = val[0].fieldIdValue;
      }
    } else {
      this.result[objName] = null;
    }
  }

  tabChangeTitle() {
    if (!this.result.case_type) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.result.title_id = null;
          this.result.title_desc = null;
        }
        subscription.unsubscribe();
      });
    } else {
      if (this.result.title_id) {
        var val = this.titleType[this.result.case_type].filter((x: any) => x.fieldIdValue === this.result.title_id);
        if (val.length != 0) {
          this.result.title_desc = val[0].fieldNameValue;
        } else {
          this.result.title_id = null;
          this.result.title_desc = null;
        }
      } else {
        this.result.title_id = null;
        this.result.title_desc = null;
      }

    }
  }

  tabChangeInput(name: any, event: any) {
    if (name == 'table_id') {
      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "condition": " AND table_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));

          if (productsJson.length == 1) {
            this.result.table_name = productsJson[0].fieldNameValue;
          } else {
            this.result.table_id = null;
            this.result.table_name = null;
          }
        },
        (error) => { }
      )
      if (!event.target.value) {
        this.result.table_name = null;
      }

    } else if (name == 'dayweek_id') {
      var student = JSON.stringify({
        "table_name": "pmt_weekday",
        "field_id": "date_day",
        "field_name": "date_name",
        "condition": " AND date_day='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if (productsJson.length == 1) {
            this.result.dayweek = productsJson[0].fieldNameValue;
          } else {
            this.result.dayweek_id = null;
            this.result.dayweek = null;
          }
        },
        (error) => { }
      )
      if (!event.target.value) {
        this.result.dayweek = null;
      }
    } else if (name == 'app_id') {
      var student = JSON.stringify({
        "table_name": "pappoint_list",
        "field_id": "app_id",
        "field_name": "app_name",
        "condition": " AND app_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));

          if (productsJson.length == 1) {
            this.result.app_name = productsJson[0].fieldNameValue;
          } else {
            this.result.app_id = null;
            this.result.app_name = null;
          }
        },
        (error) => { }
      )
      if (!event.target.value) {
        this.result.app_name = null;
      }
    } else if (name == 'delay_id') {
      var student = JSON.stringify({
        "table_name": "pappoint_delay",
        "field_id": "delay_id",
        "field_name": "delay_name",
        "condition": " AND delay_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));

          if (productsJson.length == 1) {
            this.result.delay_name = productsJson[0].fieldNameValue;
          } else {
            this.result.delay_id = null;
            this.result.delay_name = null;
          }
        },
        (error) => { }
      )
      if (!event.target.value) {
        this.result.delay_name = null;
      }
    } else if (name == 'result_id') {
      var student = JSON.stringify({
        "table_name": "pappoint_result",
        "field_id": "result_id",
        "field_name": "result_name",
        "condition": " AND result_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));

          if (productsJson.length == 1) {
            this.result.result_name = productsJson[0].fieldNameValue;
          } else {
            this.result.result_id = null;
            this.result.result_name = null;
          }
        },
        (error) => { }
      )
      if (!event.target.value) {
        this.result.result_name = null;
      }
    }
  }

  orderJudgeTab(event: any) {
    this.SpinnerService.show();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "table_name": "pjudge",
      "field_id": "judge_id",
      "field_name": "judge_name",
      "condition": " AND judge_id='" + event.target.value + "'",
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if (getDataOptions.length > 0) {
          this.result.judge_name = getDataOptions[0].fieldNameValue;
        } else {
          this.result.judge_id = '';
          this.result.judge_name = '';
        }
        this.SpinnerService.hide();
      },
      (error) => { }
    )
  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if ((!this.result.start_date || !this.result.end_date) && (!this.result.scase_date || !this.result.ecase_date)) {
      confirmBox.setMessage('กรุณาป้อนวันที่นัด/วันที่รับฟ้องเพื่อค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          //this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();
      var dataTmp = $.extend([], this.result);
      Object.keys(dataTmp).forEach(key => {
        if (dataTmp[key] === null) {
          delete dataTmp[key];
        }
      });
      if (dataTmp['time_flag'] == 0)
        delete dataTmp['time_flag'];
      if (dataTmp['table_id'])
        dataTmp['table_id'] = dataTmp['table_id'].toString();
      /*
    if(dataTmp['case_type']==null)
      delete dataTmp['case_type'];
    if(dataTmp['title_id']==null)
      delete dataTmp['title_id'];
    if(dataTmp['title_desc']==null)
      delete dataTmp['title_desc'];
    */
      dataTmp['userToken'] = this.userData.userToken;
      var data = $.extend({}, dataTmp);
      console.log(data)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      this.http.post('/' + this.userData.appName + 'ApiAP/API/APPOINT/fap0200', data, { headers: headers }).subscribe(
        (response) => {
          console.log(response)
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          if (alertMessage.result == 0) {
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.items = [];
                this.rerender();
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          } else {
            this.items = alertMessage.data;
            this.checklist = this.items;
            if (alertMessage.data.length)
              this.items.forEach((x: any) => x.sendData = false);
            this.objItems = alertMessage;
            if (dataTmp.start_date)
              this.objItems.start_date = dataTmp.start_date;
            else
              this.objItems.start_date = '';
            if (dataTmp.end_date)
              this.objItems.end_date = dataTmp.end_date;
            else
              this.objItems.end_date = '';
            this.rerender();
            this.SpinnerService.hide();
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  printReport() {

    var rptName = 'rap0200';
    var rptResult = $.extend({}, this.result);
    var bar = new Promise((resolve, reject) => {
      if (rptResult['scase_date'])
        rptResult['scase_date'] = myExtObject.conDate(rptResult['scase_date']);
      if (rptResult['ecase_date'])
        rptResult['ecase_date'] = myExtObject.conDate(rptResult['ecase_date']);
      if (rptResult['start_date'])
        rptResult['start_date'] = myExtObject.conDate(rptResult['start_date']);
      if (rptResult['end_date'])
        rptResult['end_date'] = myExtObject.conDate(rptResult['end_date']);
    });
    if (bar) {
      if (rptResult['userToken'])
        delete rptResult['userToken'];
      var paramData = rptResult;
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    }
  }

  changeJudgeBy(event: any) {
    this.result.room_id = null;
  }

  exportAsXLSX(): void {
    if (this.items) {
      var excel = JSON.parse(JSON.stringify(this.items));
      console.log(excel)
      var data = []; var extend = [];
      var bar = new Promise((resolve, reject) => {

        for (var i = 0; i < excel.length; i++) {
          /*
          if(excel[i]['title'] && excel[i]['id'] && excel[i]['yy'])
            excel[i]['case_no'] = excel[i]['title']+excel[i]['id']+'/'+excel[i]['yy'];
          else
            excel[i]['case_no'] = "";
          if(excel[i]['red_title'] && excel[i]['red_title'] && excel[i]['red_title'])
            excel[i]['red_no']  = excel[i]['red_title']+excel[i]['red_id']+'/'+excel[i]['red_yy'];
          else
            excel[i]['red_no'] = "";
          if(excel[i]['date_appoint'])
            excel[i]['dateAppoint'] = excel[i]['date_appoint']+"  "+excel[i]['time_appoint'];
          else
            excel[i]['dateAppoint'] = "";
          if(excel[i]['old_red_no'])
            excel[i]['oldCaseNo'] = excel[i]['old_case_no']+" ("+excel[i]['old_red_no']+")";
          else
            excel[i]['oldCaseNo'] = excel[i]['old_case_no'];
        */

          excel[i]['room_desc'] = excel[i]['room_desc'] + "" + excel[i]['room_desc_remark'] + "";

          for (var x = 0; x < 20; x++) {
            if (x == 0)
              data.push(excel[i]['black']);
            if (x == 1)
              data.push(excel[i]['red']);
            if (x == 2)
              data.push(excel[i]['case_date']);
            if (x == 3)
              data.push(excel[i]['pros_desc']);
            if (x == 4)
              data.push(excel[i]['accu_desc']);
            if (x == 5)
              data.push(excel[i]['table_name']);
            if (x == 6)
              data.push(excel[i]['app_seq']);
            if (x == 7)
              data.push(excel[i]['date_appoint']);
            if (x == 8)
              data.push(excel[i]['time_appoint']);
            if (x == 9)
              data.push(excel[i]['room_desc']);
            if (x == 10)
              data.push(excel[i]['judge_name']);
            if (x == 11)
              data.push(excel[i]['app_name']);
            if (x == 12)
              data.push(excel[i]['delay_name']);
            if (x == 13)
              data.push(excel[i]['result_name']);
            if (x == 14)
              data.push(excel[i]['result_desc']);
            if (x == 15)
              data.push(excel[i]['alle_desc']);
            if (x == 16)
              data.push(excel[i]['diff_judge']);
            if (x == 17)
              data.push(excel[i]['diff_app']);
            if (x == 18)
              data.push(excel[i]['date_appoint_next']);
            if (x == 19)
              data.push(excel[i]['time_appoint_next']);
          }

          extend[i] = $.extend([], data)
          data = [];
          //extend[i] = Object.values(data)
        }
      });
      if (bar) {
        var objExcel = [];
        objExcel['num_case'] = this.objItems.num_case;
        objExcel['num_app'] = this.objItems.num_app;
        objExcel['start_date'] = this.objItems.start_date;
        objExcel['end_date'] = this.objItems.end_date;
        objExcel['num_case_appoint'] = this.objItems.num_case_appoint;
        objExcel['num_case_no_appoint'] = this.objItems.num_case_no_appoint;
        objExcel['data'] = extend;
        console.log(objExcel)
        this.excelService.exportAsExcelFile(objExcel, 'fap0200', this.programName);
      }

    } else {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นหาข้อมูล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    }
  }

  changeCaseType() {
    this.result.title_id = null;
    this.result.title_desc = null;
  }
}