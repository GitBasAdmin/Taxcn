import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer, ConfirmBoxConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';


@Component({
  selector: 'app-fco1300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fco1300.component.html',
  styleUrls: ['./fco1300.component.css']
})


export class Fco1300Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  myExtObject: any;
  title = 'datatables';
  toPage: any = 'fco1300';
  result: any = [];
  getCaseType: any;
  getCaseCate: any;
  getPostType: any;
  getCaseTypeStat: any;
  getRealDocTitle: any;
  getTitle: any;
  getRefNo: any;
  getRefRunning: any;
  dataSearch: any = [];
  tmpResult: any = [];
  getTitleStat: any;
  getRedTitle: any;
  getOrder: any;
  posts: any;
  search: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  delValue: any;
  sessData: any;
  userData: any;
  programName: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  getResult: any;
  result_id: any;
  asyncObservable: Observable<string>;
  modalType: any;
  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldType: any;
  public listFieldCond: any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadModalJudgeComponentArry: boolean = false;


  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  // @ViewChild('Barcode',{static: true}) BarCode : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChild('sResult') sResult: NgSelectComponent;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,

  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      destroy: true
    };

    // if(this.items)
    // this.items.forEach((x : any ) => x.index = false);
    // console.log(this.items)

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    //this.asyncObservable = this.makeObservable('Async Observable');
    this.successHttp();

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
          // console.log(this.list)
        } else {
          this.list = [];
        }
        //  this.list = response;
        // console.log('xxxxxxx',response)
      },
      (error) => { }
    )

    //======================== pdoc_title ======================================
    var student = JSON.stringify({
      "table_name": "pdoc_title",
      "field_id": "LISTAGG(doc_title_id, '')",
      "field_name": "doc_title",
      "condition": "AND in_out = 2 GROUP BY doc_title",
      "order_by": "doc_title ASC",
      "userToken": this.userData.userToken
    });

    // console.log(student);
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        // console.log(getDataOptions);
        // getDataOptions.unshift({fieldIdValue:'',fieldNameValue: 'ทั้งหมด'});
        this.getRealDocTitle = getDataOptions;
      },
      (error) => { }
    )

    this.getOrder = [{ id: '1', text: 'เลขที่หนังสือ' }, { id: '2', text: 'ลำดับที่' }, { id: '3', text: 'รหัส EMS' }];
    this.getPostType = [{ id: '1', text: 'ลงทะเบียน' }, { id: '2', text: 'รับรอง' }, { id: '3', text: 'EMS' }, { id: '4', text: 'รับประกัน' }, { id: '5', text: 'พัสดุ' }, { id: '6', text: 'พกง.' }];
    this.result.porder = '1';
    this.result.ssend_date = myExtObject.curDate();
    this.result.real_doc_title = '';
    // this.result.real_doc_title = this.userData.defaultTitle;
    this.result.ref_yy = myExtObject.curYear();
    // this.result.case_type = this.userData.defaultCaseType;
    // this.changeCaseType(this.result.case_type);
    // setTimeout(() => {
    //       this.result.title = this.userData.defaultTitle;
    // }, 200);
    // this.result.start_date = myExtObject.curDate();
    // this.searchData(3);
    this.getFRefNo();
    // this.loadData(0);
  }

  clickOpenMyModalComponent(val: any) {
    this.modalType = val;
    this.openbutton.nativeElement.click();
  }
  loadMyModalComponent() {
    if (this.modalType == 1 || this.modalType == 2 || this.modalType == 3 || this.modalType == 4) {
      this.loadModalJudgeComponent = true;
      this.loadModalJudgeComponentArry = false;
      this.loadModalComponent = false;
      this.loadComponent = false;
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldNull = '';
      this.listFieldType = JSON.stringify({ "type": 2 });

      // console.log(student)

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
            // console.log(this.list)
          } else {
            this.list = [];
          }
        },
        (error) => { }
      )
    } else if (this.modalType == 5) {//ผลคำพิพากษา
      $("#exampleModal").find(".modal-content").css("width", "700px");
      var student = JSON.stringify({
        "table_name": "pjudge_result",
        "field_id": "result_id",
        "field_name": "result_desc",
        "search_id": "",
        "search_desc": "",
        "condition": " AND case_type='" + this.result.case_type + "'",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge_result';
      this.listFieldId = 'result_id';
      this.listFieldName = 'result_desc';
      this.listFieldNull = '';
      this.listFieldCond = " AND case_type='" + this.result.case_type + "'";
    } else if (this.modalType == 6) {
      // alert(this.modalType)
      $("#exampleModal").find(".modal-content").css("width", "650px");
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeComponentArry = false;
      this.loadModalComponent = true;
      this.loadComponent = false;
    }

    //ส่วนนี้จะใช้กับ popup return ธรรมดา
    if (this.modalType == 5) {
      this.loadModalComponent = false;
      this.loadComponent = true;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeComponentArry = false;
      // console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student, { headers: headers }).subscribe(
        (response) => {
          // console.log(response)
          this.list = response;
        },
        (error) => { }
      )
    }
  }

  getFRefNo() {
    var student = JSON.stringify({
      "ref_yy": parseInt(this.result.ref_yy),
      "userToken": this.userData.userToken
    });
    // console.log(student);
    this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco1300/runRefNo', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getRefNo = getDataOptions;
        // console.log(this.getRefNo)
        this.result.ref_no = this.getRefNo.ref_no;
        //this.result.ref_id = this.getRefNo.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => { }
    )
  }

  getFRefRunning() {
    var student = JSON.stringify({
      // "ref_no": this.result.ref_no.toString(),
      "ref_no": parseInt(this.result.ref_no),
      "ref_yy": parseInt(this.result.ref_yy),
      "userToken": this.userData.userToken
    });
    // console.log(student);
    this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco1300/searchRef', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getRefRunning = getDataOptions;
        // console.log(this.getRefRunning);
        this.result.ref_running = this.getRefRunning.ref_running;
        // console.log(this.result.ref_running);
        //this.result.ref_id = this.getRefNo.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => { }
    )
  }

  listSave(index: any) {
    this.dataSearch[index]['edit1300'] = true;
  }

  printReport(val: any) {
    var rptName = 'rfco1300';

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "psend_date": myExtObject.conDate(this.result.ssend_date),
      "pref_running": this.result.ref_running ? this.result.ref_running.toString() : '',
      "puser_id": this.userData.userCode,
      "pdep_code": this.userData.depCode.toString(),
      "porder": this.result.porder,
      "pflag": val,
    });
    console.log(paramData);
    this.printReportService.printReport(rptName, paramData);
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fco1300"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen)
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
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
  }



  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
      // "condition": "AND case_type='"+val+"'",
      "order_by": " case_cate_id ASC",
      "userToken": this.userData.userToken
    });

    var student4 = JSON.stringify({
      "table_name": "pcase_type_stat",
      "field_id": "case_type_stat",
      "field_name": "case_type_stat_desc",
      "condition": "AND case_type='" + val + "'",
      "order_by": " case_type_stat ASC",
      "userToken": this.userData.userToken
    });




    //console.log("fCaseTitle")

    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getTitle = getDataOptions;
          this.result.title = '';
          //this.selTitle = this.fca0200Service.defaultTitle;
        },
        (error) => { }
      )

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student2).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getRedTitle = getDataOptions;
        },
        (error) => { }
      )

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student3).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          this.getCaseCate = getDataOptions;
        },
        (error) => { }
      )

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student4).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          this.result.case_type_stat = '';
          this.result.title_stat = '';
          this.getCaseTypeStat = getDataOptions;
        },
        (error) => { }
      )


    });
    return promise;
  }

  changeTitle(val: any) {
    var student5 = JSON.stringify({
      "table_name": "pstat_case_title",
      "field_id": "case_type_stat",
      "field_name": "case_title",
      "condition": "AND title_type = 'B' AND con_flag is null AND case_type ='" + this.result.case_type + "' AND case_type_stat='" + val + "'",
      "order_by": " case_type_stat ASC",
      "userToken": this.userData.userToken
    });

    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student5).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          this.result.title_stat = '';
          this.getTitleStat = getDataOptions;
          this.getTitleStat = this.getTitleStat.forEach((x: any) => this.result.title_stat = this.result.title_stat.length == 0 ? this.result.title_stat.concat('', x.fieldNameValue) : this.result.title_stat.concat(',', x.fieldNameValue));
        },
        (error) => { }
      )
    });
    return promise;
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit1300 = this.masterSelected;
    }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.edit1300 == true;
    })
  }

  toId(event: any) {
    if (this.result.real_doc_id)
      this.result.real_doc_id2 = event.target.value;
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit1300 = false;
    }

    // for (var i = 0; i < this.checklist2.length; i++) {
    //   this.checklist2[i].editNoticeId = false;
    // }
    this.masterSelected = false;
    // this.masterSelected2 = false;
    $("body").find("input[name='delValue']").val('');
    // $("body").find("input[name='delValue2']").val('');
  }
  // isAllSelected(obj:any,master:any,child:any) {
  //   this[master] = obj.every(function(item:any) {
  //     return item[child] == true;
  //   })
  // }


  // checkUncheckAll(obj:any,master:any,child:any) {
  //   for (var i = 0; i < obj.length; i++) {
  //     obj[i][child] = this[master];
  //   }
  //   // this.getCheckedItemList();
  // }

  // checkUncheckAll() {
  //   for (var i = 0; i < this.checklist.length; i++) {
  //     this.checklist[i].edit1300 = this.masterSelected;
  //     }
  //   }
  BarcodeSubmit(event: any) {
    if (event.keyCode == 13)
      if (!this.result.barcode) {
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ป้อน Barcode');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { this.SpinnerService.hide(); }
          subscription.unsubscribe();
        });
      } else {
        const confirmBox = new ConfirmBoxInitializer();

        var student = JSON.stringify({
          "barcode": this.result.barcode,
          "userToken": this.userData.userToken
        });
        // console.log(student);

        this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco1300/saveData', student).subscribe(
          (response) => {
            let alertMessage: any = JSON.parse(JSON.stringify(response));
            // console.log(alertMessage)

            if (alertMessage.result == 0) {
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
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
              this.result.ref_running = alertMessage.ref_running;
              // console.log(this.result.ref_running);
              // this.SpinnerService.hide();
              // confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
              // confirmBox.setButtonLabels('ตกลง');
              // confirmBox.setConfig({
              //     layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              // });
              // const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              //   if (resp.success==true){
              //      this.searchData(3);
              //      this.result.barcode = '';
              //     //  this.BarCode.nativeElement.focus();
              //      $("input[name='barcode']")[0].focus();
              //     //  window.setTimeout(function() { $('#dialog').dialog('close'); }, 4000);
              //     //  this.closebutton.nativeElement.click();
              //     //$("button[type='reset']")[0].click();
              //     //this.SpinnerService.hide();
              //   }
              //   subscription.unsubscribe();
              // });
              // this.searchData(1);
              this.searchData(2);
              this.result.barcode = '';
              $("input[name='barcode']")[0].focus();
              //this.ngOnInit();
              //this.form.reset();
              // $("button[type='reset']")[0].click();

            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      }
  }

  newRef() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ต้องการสร้างเลขอ้างอิงใช่ไหม');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });

    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) {
        var student = JSON.stringify({
          "ref_yy": this.result.ref_yy.toString(),
          "userToken": this.userData.userToken
        });
        // console.log(student);
        this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco1300/saveRef', student).subscribe(
          (response) => {
            let getDataOptions: any = JSON.parse(JSON.stringify(response));
            this.getRefNo = getDataOptions;
            // console.log(this.getRefNo)
            this.result.ref_no = this.getRefNo.ref_no;
            this.result.ref_running = this.getRefNo.ref_running;
            // console.log(this.result.ref_running);
            //this.result.ref_id = this.getRefNo.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
          },
          (error) => { }
        )
      }
      subscription.unsubscribe();
    });


  }

  Autosubmit(val: any) {
    if ((!this.result.real_doc_id || !this.result.real_doc_yy) && (!this.result.real_send_date1 || !this.result.real_send_date2)) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ป้อนเงื่อนไขเลขที่หนังสือหรือวันที่ส่งหนังสือไม่ครบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { this.SpinnerService.hide(); }
        subscription.unsubscribe();
      });
    } else {
      const confirmBox = new ConfirmBoxInitializer();

      var student = JSON.stringify({
        "ref_running": this.result.ref_running,
        "real_doc_title": this.result.real_doc_title,
        "real_doc_id": this.result.real_doc_id ? this.result.real_doc_id : null,
        "real_doc_yy": this.result.real_doc_yy ? this.result.real_doc_yy : null,
        "real_send_date1": this.result.real_send_date1 ? this.result.real_send_date1 : null,
        "real_send_date2": this.result.real_send_date2 ? this.result.real_send_date2 : null,
        "userToken": this.userData.userToken
      });
      // console.log(student);

      // this.http.post('/'+this.userData.appName+'ApiCO/API/CORRESP/fco1300/saveData', student).subscribe(
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco1300/searchDocument', student).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          // console.log(alertMessage)
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                //this.SpinnerService.hide();
                this.dataSearch = [];
                this.rerender();
              }
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();

            this.posts = alertMessage.data;
            if (alertMessage.result == 1) {
              //this.loadResult();
              this.checklist = this.posts;
              // this.checklist2 = this.posts;
              if (alertMessage.data.length) {
                this.masterSelected = true;
                this.posts.forEach((x: any) => x.edit1300 = true);
              }

              setTimeout(() => {
                myExtObject.callCalendar();
              }, 500);

              var bar = new Promise((resolve, reject) => {
                alertMessage.data.forEach((ele, index, array) => {
                  if (ele.post_type != null) {
                    alertMessage.data[index]['post_type'] = ele.post_type.toString();
                  }
                  // alertMessage.data[index]['ems_barcode'] = '';
                  alertMessage.data[index]['order_num'] = index + 1;

                });
              });

              this.dataSearch = alertMessage.data;
              this.rerender();
            } else {
              this.dataSearch = [];
              this.rerender();
            }
            this.SpinnerService.hide();



            /*confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                 this.result.ref_running = alertMessage.ref_running;
                //  this.searchData(1);
                this.searchData(2);
                 this.result.real_doc_id = '';
                 this.result.real_doc_yy = '';
                //  this.BarCode.nativeElement.focus();
                 $("input[name='barcode']")[0].focus();
                //  window.setTimeout(function() { $('#dialog').dialog('close'); }, 4000);
                //  this.closebutton.nativeElement.click();
                //$("button[type='reset']")[0].click();
                //this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });*/
            // this.searchData(1);
            // this.result.real_doc_id = '';
            // this.result.real_doc_yy = '';
            // $("input[name='barcode']")[0].focus();
            //this.ngOnInit();
            //this.form.reset();
            // $("button[type='reset']")[0].click();

          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }

  }

  searchDataDoc(val: any) {
    if ((!this.result.real_doc_id || !this.result.real_doc_yy) && (!this.result.real_send_date1 || !this.result.real_send_date2)) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ป้อนเงื่อนไขเลขที่หนังสือหรือวันที่ส่งหนังสือไม่ครบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { this.SpinnerService.hide(); }
        subscription.unsubscribe();
      });
    } else {
      const confirmBox = new ConfirmBoxInitializer();

      var student = JSON.stringify({
        "ref_running": this.result.ref_running,
        "real_doc_title": this.result.real_doc_title,
        "real_doc_id": this.result.real_doc_id ? this.result.real_doc_id : null,
        "real_doc_yy": this.result.real_doc_yy ? this.result.real_doc_yy : null,
        "real_send_date1": this.result.real_send_date1 ? this.result.real_send_date1 : null,
        "real_send_date2": this.result.real_send_date2 ? this.result.real_send_date2 : null,
        "userToken": this.userData.userToken
      });
      // console.log(student);
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco1300/searchDocument', student).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          // console.log(alertMessage)
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.dataSearch = [];
                this.rerender();
              }
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();

            this.posts = alertMessage.data;
            if (alertMessage.result == 1) {
              this.checklist = this.posts;
              if (alertMessage.data.length) {
                this.masterSelected = true;
                this.posts.forEach((x: any) => x.edit1300 = true);
              }
              setTimeout(() => {
                myExtObject.callCalendar();
              }, 500);

              var bar = new Promise((resolve, reject) => {
                alertMessage.data.forEach((ele, index, array) => {
                  if (ele.post_type != null) {
                    alertMessage.data[index]['post_type'] = ele.post_type.toString();
                  }
                  alertMessage.data[index]['order_num'] = index + 1;

                });
              });

              this.dataSearch = alertMessage.data;
              this.rerender();
            } else {
              this.dataSearch = [];
              this.rerender();
            }
            this.SpinnerService.hide();
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  delData(run_id: any) {
    this.result.del_id = run_id;
    this.clickOpenMyModalComponent(6);
  }


  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if (ele.edit1300 == true) {
          del++;
        }
      });
    });
    if (bar) {
      if (!del) {
        confirmBox.setMessage('ไม่มีรายการที่เลือก');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
          }
          subscription.unsubscribe();
        });

      } else {

        var dataTmp = [], dataSave = [];
        var bar = new Promise((resolve, reject) => {
          this.dataSearch.forEach((ele, index, array) => {
            if (ele.edit1300 == true) {
              dataTmp.push(this.dataSearch[index]);
            }
          });
        });
        if (bar) {
          dataSave['ref_running'] = this.result.ref_running;
          dataSave['ref_no'] = parseInt(this.result.ref_no);
          dataSave['ref_yy'] = this.result.ref_yy;
          dataSave['data'] = dataTmp;
          dataSave['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataSave);
          // console.log(JSON.stringify(data));
          this.SpinnerService.show();
          this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco1300/saveDocData', data, {}).subscribe(
            // this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco1300/saveSelectData', data, {}).subscribe(//M
            (response) => {
              let alertMessage: any = JSON.parse(JSON.stringify(response));
              // console.log(alertMessage);
              if (alertMessage.result == 0) {
                this.SpinnerService.hide();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox
                  .openConfirmBox$()
                  .subscribe((resp) => {
                    if (resp.success == true) {
                      //this.SpinnerService.hide();
                    }
                    subscription.unsubscribe();
                  });
              } else {
                this.SpinnerService.hide();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS, // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
                  if (resp.success == true) {
                    this.result.real_doc_id = null;
                    this.result.real_doc_yy = null;

                    this.result.ref_running = alertMessage.ref_running;
                    this.result.ref_no = alertMessage.ref_no;
                    this.result.ref_yy = alertMessage.ref_yy;
                    this.searchData(2);
                    $("input[name='id']")[0].focus();
                  }
                  subscription.unsubscribe();
                });
              }
            },
            (error) => {
              this.SpinnerService.hide();
            }
          );
        }
      }
    }
  }



  searchData(type: any) {

    if (!this.result.ssend_date && type == 1) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ป้อนวันที่นำส่งเพื่อค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { this.SpinnerService.hide(); }
        subscription.unsubscribe();
      });
    } else if ((!this.result.ref_no || !this.result.ref_yy) && type == 2) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ป้อนเลขที่อ้างอิง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { this.SpinnerService.hide(); }
        subscription.unsubscribe();
      });
      // }
    } else {
      this.loadData(type);
    }

  }


  loadData(type: any) {
    this.SpinnerService.show();
    this.tmpResult = this.result;
    var jsonTmp = $.extend({}, this.tmpResult);
    if (type == 1) {
      jsonTmp['searchDate'] = 1;
    } else if (type == 2) {
      this.getFRefRunning();
    } else if (type == 3) {
      jsonTmp['searchNotSend'] = 1;
    }
    jsonTmp['userToken'] = this.userData.userToken;

    setTimeout(() => {
      if (type == 2 && this.result.ref_running > 0) {
        jsonTmp['ref_running'] = this.result.ref_running;
      }else{
        jsonTmp['ref_running'] ='';
      }
      var student = jsonTmp;
      
      // console.log(JSON.stringify(student))
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco1300/searchData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          this.posts = productsJson.data;
          if (productsJson.result == 1) {
            //this.loadResult();
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if (productsJson.data.length) {
              if (type == 0) {
                this.posts.forEach((x: any) => x.edit1300 = false);
              } else {
                this.masterSelected = true;
                this.posts.forEach((x: any) => x.edit1300 = true);
              }

            }

            // this.rerender();
            setTimeout(() => {
              myExtObject.callCalendar();
            }, 500);

            var bar = new Promise((resolve, reject) => {
              productsJson.data.forEach((ele, index, array) => {
                // if(ele.indict_desc != null){
                //   if(ele.indict_desc.length > 47 )
                //     productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
                // }
                // if(ele.deposit != null){
                //   productsJson.data[index]['deposit'] = this.curencyFormat(ele.deposit,2);
                // }
                if (ele.post_type != null) {
                  productsJson.data[index]['post_type'] = ele.post_type.toString();
                }
                productsJson.data[index]['order_num'] = index + 1;

              });
            });

            bar.then(() => {
              //this.dataSearch = productsJson.data;
              //console.log(this.dataSearch)
            });

            this.dataSearch = productsJson.data;
            // this.numCase = productsJson.num_case;
            // this.numLit = productsJson.num_lit;
            //this.dtTrigger.next(null);
            // this.assignJudgeArry();
            this.rerender();
            // console.log(this.dataSearch)
          } else {
            this.dataSearch = [];
            this.posts=[];
            this.checklist
            this.rerender();
            // this.numCase = 0;
            // this.numLit = 0;
          }
          // console.log(productsJson)
          this.SpinnerService.hide();
        },
        (error) => { }
      )
    }, 500);
  }

  directiveDateArry(date: any, obj: any, index: any) {
    // console.log(date.target.value)
    this.dataSearch[index][obj] = date.target.value;
  }


  curencyFormat(n: any, d: any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }//100000 เป็น 100,000.00

  updateRef() {
    // alert('xxxxx');
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if (ele.edit1300 == true) {
          del++;
        }
      });
    });

    if (bar) {
      if (!del) {
        confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการแก้ไข');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
            // this.result.setFocus('barcode');
          }
          subscription.unsubscribe();
        });

      } else {
        // alert('ooooo');
        var dataTmp = [], dataSave = [];
        var bar = new Promise((resolve, reject) => {
          this.dataSearch.forEach((ele, index, array) => {
            if (ele.edit1300 == true) {
              dataTmp.push(this.dataSearch[index]);
            }
          });
        });
        if (bar) {
          dataSave['data'] = dataTmp;
          dataSave['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataSave);
          // console.log(JSON.stringify(data));
          // this.SpinnerService.show();

          this.SpinnerService.hide();
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ต้องการแก้ไขข้อมูลใช่ไหม');
          confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });

          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              // this.assignJudgeArry();
              //   this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fco1300/assignCaseJudge', data ).subscribe(response => {
              //     let alertMessage : any = JSON.parse(JSON.stringify(response));
              //     confirmBox.setMessage(alertMessage.error);
              //     confirmBox.setButtonLabels('ตกลง');
              //     confirmBox.setConfig({
              //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              //   });

              //     const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              //       if (resp.success==true){this.SpinnerService.hide();}
              //       subscription.unsubscribe();
              //     });
              //     // alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล');
              //     //  $("button[type='reset']")[0].click();
              //    //this.ngOnInit();
              //    this.searchData();
              //  });
              // }else{
              //   alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
            }
            subscription.unsubscribe();
          });
        }
      }
    }
  }

  loadTableComponent(val: any) {
    this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadModalJudgeComponent = true;
    this.loadModalJudgeComponentArry = false;
    $("#exampleModal").find(".modal-body").css("height", "auto");
  }

  loadTableComponentArry(val: any, index: any) {
    this.modalType = val;
    this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalJudgeComponentArry = true;
    this.result.index = index;
    $("#exampleModal").find(".modal-body").css("height", "auto");
  }

  closeModal() {
    this.loadComponent = false;
    this.loadModalComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalJudgeComponentArry = false;
  }


  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }
}