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
  selector: 'app-fju0600,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fju0600.component.html',
  styleUrls: ['./fju0600.component.css']
})


export class Fju0600Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

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
  myExtObject: any;
  run_id: any; run_seq: any; case_running:any;
  result: any = []; hResult: any = [];
  getCaseType: any; getTitle: any; getRedTitle: any;
  getCaseCate: any; getJudgeType: any;
  getDocType: any; getDocTitle: any;
  getToCour: any;
  param:any; 
  modalType:any;
  caseData:any;
  dataDeleteSelect:any = [];

  asyncObservable: Observable<string>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalComponent: boolean = false;
  public loadSendDocComponent: boolean = false;
  public loadPopupCaseAppoinComponent: boolean = false;

  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  constructor(
    private activatedRoute: ActivatedRoute,
    private caseService: CaseService,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.masterSelected = false
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

    this.successHttp();
    this.setDefPage();
    this.genDocTitle();
    this.setDefCase();
    this.changeJudgeType('');


    this.activatedRoute.queryParams.subscribe(params => {
      this.param = params;
      // console.log(this.param);
      if(this.param['run_seq']){
        this.result.run_seq = this.param['run_seq'];
        this.searchDocument(4);
      }

      if(this.param['run_id']){
        this.run_id = this.param['run_id'];
        this.searchCaseNo(3);
      }

      if(this.param['case_running']){
        this.result.case_running = this.param['case_running'];
        this.searchCase(4);
      }
    });
    // ======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name": "pcase_type",
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
      },
      (error) => { }
    )

    this.getToCour = [{ fieldIdValue: 1, fieldNameValue: 'ชั้นอุทธรณ์' }, { fieldIdValue: 2, fieldNameValue: 'ชั้นฎีกา' }, { fieldIdValue: 3, fieldNameValue: 'ชั้นต้น' }];
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fju0600"
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
    this.result = [];
    this.caseData = [];
    this.case_running = "";
    this.result.case_running = '';
    this.result.to_court = 1;
    this.result.case_yy = myExtObject.curYear();
  }

  setDefCase() {
    // ข้อมูลเลขคดี
    this.hResult.court_id = this.userData.courtId;
    this.hResult.case_type = this.userData.defaultCaseType;
    this.changeCaseType(this.userData.defaultCaseType);
    this.hResult.title = this.userData.defaultTitle;
    this.hResult.red_title = this.userData.defaultTitle;
  }
  
  runCaseNo() {
    if (this.result.case_title && this.result.case_yy) {
      var student = JSON.stringify({
        "case_title": this.result.case_title,
        "case_yy": this.result.case_yy,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0600/runCaseNo', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          this.result.case_no = productsJson.case_no;
        },
        (error) => { }
      )
    }
  }

  genDocTitle() {
    if(this.userData.userLevel == 'A'){
      // ======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name": "pdoc_title",
      "field_id": "doc_title",
      "field_name": "doc_title",
      "condition": "AND in_out=1 ",
      "order_by": " doc_title_id ASC ",
      "userToken": this.userData.userToken
    });
    
    }else{
      var student = JSON.stringify({
        "table_name": "pdoc_title",
        "field_id": "doc_title",
        "field_name": "doc_title",
        "condition": "AND in_out=1 AND dep_use="+this.userData.depCode,
        "order_by": " doc_title_id ASC ",
        "userToken": this.userData.userToken
      });
    }
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getDocTitle = getDataOptions;
        this.result.real_doc_title = this.getDocTitle[0].fieldNameValue;
      },
      (error) => { }
    )
  }

  directiveDate(date: any, obj: any) {
      this.result[obj] = date;
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
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  changeJudgeType(event:any){
    // console.log(this.result.case_running);
    // console.log(event);
    if(event){
      var student = JSON.stringify({
        "table_name": "pjudge_case_type",
        "field_id": "judge_case_type",
        "field_name": "judge_case_name",
        "field_name2": "judge_case_title",
        "condition": "AND judge_case_type=" + this.result.judge_type,
        "userToken": this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          this.result.case_title = getDataOptions[0].fieldNameValue2;
          if(!this.result.case_running)
            this.runCaseNo();
        },
        (error) => { }
      )
    }else{
      var student = JSON.stringify({
        "table_name": "pjudge_case_type",
        "field_id": "judge_case_type",
        "field_name": "judge_case_name",
        "field_name2": "judge_case_title",
        "userToken": this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          this.getJudgeType = getDataOptions;
          this.result.judge_type = this.getJudgeType[0].fieldIdValue;
          this.result.case_title = this.getJudgeType[0].fieldNameValue2;
          this.result.case_yy = myExtObject.curYear();
          if(!this.result.case_running)
            this.runCaseNo();
        },
        (error) => { }
      )
    }
  }

  changeCaseType(event :any) {
    // console.log(event);
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='" + event + "'",
      "order_by": " order_id ASC",
      "userToken": this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
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
      "condition": "AND title_flag='2' AND case_type='" + event + "'",
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

  searchCase(type:any){//ลำดับที่ซอง
    // console.log(type);
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(type ==1 && (!this.result.case_no || !this.result.case_yy)){
        confirmBox.setMessage('กรุณาป้อนข้อมูลเลขที่ซองคำพิพากษา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){ }
        subscription.unsubscribe();
      });
    }else if( type ==3 && (!this.result.hcase_no || !this.result.hcase_yy)){
      confirmBox.setMessage('กรุณาป้อนข้อมูลเลขที่ซองศาลสูง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){ }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();
      if(type == 1){
          var student = JSON.stringify({
            "case_title": this.result.case_title,
            "case_no": this.result.case_no,
            "case_yy": this.result.case_yy,
            "userToken": this.userData.userToken
          });
      }else if(type ==2 || type ==4){
          var student = JSON.stringify({
          "case_running": this.result.case_running,
          "userToken": this.userData.userToken
        });
      }else if(type ==3){
        var student = JSON.stringify({
          "hcase_title": this.result.hcase_title,
          "hcase_no": this.result.hcase_no,
          "hcase_yy": this.result.hcase_yy,
          "userToken": this.userData.userToken
        });
      }
      console.log(student)
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0600/getData', student).subscribe(posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));
        if (productsJson.result == 1) {
          if (productsJson.data.length > 0) {
            this.result = productsJson.data[0];
            this.result.send_doc = this.result.real_doc;
            this.result.strCaseLocation = this.result.case_location;
            this.result.submit_date2 = this.result.event_date ? this.result.event_date : ''+" "+ this.result.event_time ? this.result.event_time : '';
            this.result.strSendFor = this.result.reason;
            if((type == 2 )&& productsJson.data[0].run_id){
              this.getData()
            }else if((type == 1 || type == 3) && productsJson.data[0].run_id){
              this.run_id = productsJson.data[0].run_id;
              this.searchCaseNo(3);
            }else if(type == 4){
              this.run_id = productsJson.data[0].run_id;
              this.searchCaseNo(4);
            }
          }

          if(productsJson.error){
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
  }

  searchDocument(type: any) {
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (type == 1) {//ค้นหาเลขที่รับหนังสือ
      var student = JSON.stringify({
        "real_doc_title": this.result.real_doc_title,
        "real_doc_id": this.result.real_doc_id,
        "real_doc_yy": this.result.real_doc_yy,
        "userToken": this.userData.userToken
      });
    } else if (type == 4) {
      var student = JSON.stringify({
        "run_seq": this.result.run_seq,
        "userToken": this.userData.userToken
      });
    }
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0600/searchDocData', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      if (productsJson.result == 1) {
        this.result.run_seq = productsJson.data[0].run_seq;
        this.result.real_doc_title = productsJson.data[0].real_doc_title;
        this.result.real_doc_id = productsJson.data[0].real_doc_id;
        this.result.real_doc_yy = productsJson.data[0].real_doc_yy;
        this.result.run_id = productsJson.data[0].run_id;
        if(productsJson.data[0].run_id > 0){
          this.run_id = productsJson.data[0].run_id;
          this.searchCaseNo(3);
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
      if (cars) {
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          this.result.run_id = this.hResult.run_id;
          this.getData();
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
      if (cars) {
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          this.result.run_id = this.hResult.run_id;
          this.getData();
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
    } else if (type == 3) {
      objCase["type"] = 3;
      objCase["run_id"] = this.run_id;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      const cars = await this.caseService.searchCaseNo(objCase);
      if (cars) {
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          this.result.run_id = this.hResult.run_id;
          this.getData();
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
    } else if (type == 4) {
      objCase["type"] = 3;
      objCase["run_id"] = this.run_id;
      objCase["all_data"] = 0;
      objCase["getJudgement"] = 0;
      const cars = await this.caseService.searchCaseNo(objCase);
      if (cars) {
        if (cars['result'] == 1) {
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          if (!this.hResult.red_title)
            this.hResult.red_title = this.userData.defaultRedTitle;
          this.result.run_id = this.hResult.run_id;
          this.getData();
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
    }
  }

  clickOpenMyModalComponent(type: any) {

   if (type == 2  && !this.result.run_id) {
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
   }else if(type == 1 && !this.result.case_running){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาจัดเก็บซองคำพิพากษา');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
    } else {
      this.modalType = type;
      this.openbutton.nativeElement.click();
    }
  }

  loadMyModalComponent() {
    if (this.modalType == 1) {
      if(this.result.case_running){
        this.case_running = this.result.case_running;
        this.loadModalComponent = false;
        this.loadSendDocComponent = true;
        this.loadPopupCaseAppoinComponent = false;
      }
    }else if (this.modalType == 2) {
      if (this.result.run_id && this.result.case_running) {
        this.run_id = this.result.run_id;
        this.case_running = this.result.case_running;
        this.loadModalComponent = false;
        this.loadSendDocComponent = false;
        this.loadPopupCaseAppoinComponent = true;
      }
    
    } else if(this.modalType == 'deleteCase' || this.modalType == 'deleteCaseSelect'){
      this.loadModalComponent = true;
      this.loadSendDocComponent = false;
      this.loadPopupCaseAppoinComponent = false;
    }
  }

  receivCaseAppoint(event: any){
    // console.log(event);
    this.saveDocAppoint(event);
    this.closebutton.nativeElement.click();
  }

  receivSendDocData(event: any) {
    // console.log(event);
    this.btnSaveSendDoc(event);
  }

  saveDocAppoint(event:any) {
    this.closebutton.nativeElement.click();

    var dataAdd = [], dataTmp = [];
    var bar = new Promise((resolve, reject) => {
      event.forEach((ele, index, array) => {
        event[index].case_running = this.result.case_running;
        if (ele.index == true) {
          event[index].sel = 1;
          dataTmp.push(event[index]);
        } else if (ele.index == false) {
          if (ele.map_case_running) {
            event[index].sel = null;
            dataTmp.push(event[index]);
          }
        }
      });
    });
    if (bar) {
      dataAdd['userToken'] = this.userData.userToken;
      dataAdd['case_running'] = this.result.case_running;
      dataAdd['run_id'] = this.result.run_id;
      dataAdd['data'] = dataTmp;
      var data = $.extend({}, dataAdd);

      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      this.SpinnerService.show();
      this.http.disableHeader().post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0600/saveMapCase', data).subscribe(
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
                this.searchCase(2);
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  btnSaveSendDoc(event: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    event['userToken'] = this.userData.userToken;
    event['run_seq'] = this.result.run_seq;
    event['case_running'] = this.result.case_running;
    event['real_send_date'] = this.result.hsend_date ? this.result.hsend_date : '';
    var student = $.extend({}, event);
    this.http.disableHeader().post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0600/saveMapDoc', student).subscribe(
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
              this.closebutton.nativeElement.click();
              this.searchCase(2);
            }
            subscription.unsubscribe();
          });
        }
      },
      (error) => { this.SpinnerService.hide(); }
    )
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
            if (this.modalType == "deleteCase") {//
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลซองคำพิพากษานี้?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูล');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.result['userToken'] = this.userData.userToken;
                  var data = $.extend({}, this.result);
                  this.http.post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0600/deleteData', data).subscribe(
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
            }else if (this.modalType == "deleteCaseSelect") {//
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลซองคำพิพากษานี้?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูล');
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
                  this.http.post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0600/deleteDataSelect', data).subscribe(
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
                            this.getData();
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

  submitForm() {//จัดเก็บข้อมูล
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.run_id){
      confirmBox.setMessage('กรุณาเลือกเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.rcv_date){
      confirmBox.setMessage('กรุณาระบุข้อมูลวันที่รับซอง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.case_no || !this.result.case_yy){
      confirmBox.setMessage('กรุณาระบุข้อมูลเลขที่ซองคำพิพากษา');
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

      this.result['userToken'] = this.userData.userToken;
      var data = ($.extend({}, this.result))
      console.log(data)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0600/saveData', data ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==0){
              this.SpinnerService.hide();
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
              this.SpinnerService.hide();
              confirmBox.setMessage('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.result.case_running = alertMessage.case_running;
                  this.searchCase(2);
                }
                subscription.unsubscribe();
              });
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  getData(){
    if(this.result.run_id){
      this.SpinnerService.show();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var student = JSON.stringify({
        "run_id": this.result.run_id,
        "userToken": this.userData.userToken
      });

      this.http.disableLoading().post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0600/getData', student).subscribe(posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));
        if (productsJson.result == 1) {
          this.caseData = productsJson.data;
          this.checklist = this.posts;
          if(productsJson.data.length)
            this.caseData.forEach((x : any ) => x.edit0600 = false);
          this.rerender();

        } else {
          confirmBox.setMessage(productsJson.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) { 
              this.caseData = [];
              this.rerender();
            }
            subscription.unsubscribe();
          });
        }
        this.SpinnerService.hide();
      });
    }
  }

  deleteData(){//ลบข้อมูลแฟ้ม
    this.modalType = "deleteCase";
    this.openbutton.nativeElement.click();
  }

  deleteCaseData(index:any){
    this.dataDeleteSelect = [];
    this.dataDeleteSelect.push(this.caseData[index]);

    this.modalType = "deleteCaseSelect";
    this.openbutton.nativeElement.click();
  }

  editCaseData(index:any){
    this.result.case_running = this.caseData[index].case_running;
    this.result.run_id = this.caseData[index].run_id;
    this.searchCase(4);

    // let winURL = window.location.href.split("/#/")[0] + "/#/";
    // location.replace(winURL + 'fju0600?case_running='+ this.result.case_running+'&run_id='+this.result.run_id)
    // window.location.reload();
  }

  closeModal() {
    this.loadModalComponent = false;;
    this.loadSendDocComponent = false;
  }

  sendDoc(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.case_running){
      confirmBox.setMessage('กรุณาจัดเก็บซองคำพิพากษา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      let toPage = "fco0400";
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage + "?case_running=" + this.result.case_running;
      myExtObject.OpenWindowMaxName(winURL, toPage);
    }
  }

  openAppointment(){//ลงนัด

      let toPage = "fap0111";
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      if(this.result.run_id)
        winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage + '?run_id='+this.result.run_id;
      else
        winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage;

      if(this.result.case_running)
      winURL += '&case_running='+this.result.case_running;
      myExtObject.OpenWindowMaxName(winURL, toPage);
  }

  openHistoryData(type:any){
    if(type == 1){
      let toPage = "fju0600_history";
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage + "?case_running=" + this.result.case_running;
      myExtObject.OpenWindowMaxDimensionName(winURL, 300, 1100, toPage);

    }else if(type == 2){
      let toPage = "fju0610";
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage + "?case_running=" + this.result.case_running;
      myExtObject.OpenWindowMaxName(winURL, toPage);

    }else if(type == 3){
      let toPage = "fju0620";
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage + "?case_running=" + this.result.case_running;
      myExtObject.OpenWindowMaxName(winURL, toPage);
    }
  }

  ClearAll() {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    location.replace(winURL + 'fju0600')
    window.location.reload();
  }
}