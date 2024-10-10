import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { Observable, of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ignoreElements, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { CaseService, Case } from 'src/app/services/case.service.ts';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import * as $ from 'jquery';
declare var myExtObject: any;

@Component({
  selector: 'app-fju0610,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fju0610.component.html',
  styleUrls: ['./fju0610.component.css']
})

export class Fju0610Component implements AfterViewInit, OnInit, OnDestroy {
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
  result :any = [];
  getJudgeType: any;
  getSendTo: any;
  getSsendTo: any;
  getSendToId: any; getSendDepId: any;
  myExtObject: any;
  modalType: any;
  case_running: any;
  param:any;

  asyncObservable: Observable<string>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public listFieldSelect:any;

  public loadModalComponent: boolean = false;
  public loadComponent: boolean = false;
  public loadJudgeComponent: boolean = false;


  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) { }

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

      if(this.param['case_running']){
        this.result.case_running = this.param['case_running'];
        this.searchCase();
      }
    });

    this.successHttp();
    this.changeJudgeType('');
    this.setDefPage();

    //======================== pdepartment ======================================
    var student = JSON.stringify({
      "table_name": "pdepartment", 
      "field_id": "dep_code", 
      "field_name": "dep_name", 
      "userToken": this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getSendDepId = getDataOptions;
      },
      (error) => {}
    )

    this.getSendTo = [{ fieldIdValue: 1, fieldNameValue: 'เจ้าหน้าที่' }, { fieldIdValue: 2, fieldNameValue: 'หน่วยงาน' }, { fieldIdValue: 3, fieldNameValue: 'ผู้พิพากษา' }];
    this.getSsendTo = [{ fieldIdValue: 0, fieldNameValue: '' },{ fieldIdValue: 1, fieldNameValue: 'เจ้าหน้าที่' }, { fieldIdValue: 2, fieldNameValue: 'หน่วยงาน' }, { fieldIdValue: 3, fieldNameValue: 'ผู้พิพากษา' }];
  }

  setDefPage(){
    this.result = [];
    this.posts = [];
    this.result.send_to = 1;
    // this.result.ssend_to = '';
    this.result.event_date = myExtObject.curDate();
    this.result.event_time = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
    this.result.send_dep_id = this.userData.depCode;
    this.result.sdep_name = this.userData.depName;
    this.result.s_date1 = myExtObject.curDate();
    this.result.s_date2 = myExtObject.curDate();
  }

  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fju0610"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          res => { // Success
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
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

  changeJudgeType(event:any){
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
          // this.runCaseNo();
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
          
          // this.result.judge_type = this.getJudgeType[0].fieldIdValue;
          // this.result.case_title = this.getJudgeType[0].fieldNameValue2;
          // this.result.case_yy = myExtObject.curYear();
          // this.runCaseNo();
        },
        (error) => { }
      )
    }
  }

  tabChangeSelect(objId:any, objName:any, event:any) {
    console.log(event);
    console.log(event.target.value);
    if (objId == "dep_id" || objId == "ssend_id") {
      if(this.result.send_to ==1 || this.result.ssend_to ==1 || this.result.ssend_to ==''){
        var student = JSON.stringify({
          "table_name": "pofficer", 
          "field_id": "off_id", 
          "field_name": "off_name",
          "condition": " AND off_id='" + event.target.value + "' ",
          "userToken": this.userData.userToken
        });
      }else if(this.result.send_to == 2 || this.result.ssend_to ==2){
        var student = JSON.stringify({
          "table_name": "pdepartment", 
          "field_id": "dep_code", 
          "field_name": "dep_name", 
          "condition": " AND dep_code='" + event.target.value + "' ",
          "userToken": this.userData.userToken
        });

      }else if(this.result.send_to == 3 || this.result.ssend_to ==3){
        var student = JSON.stringify({
          "table_name": "pjudge", 
          "field_id": "judge_id", 
          "field_name": "judge_name", 
          "condition": " AND judge_id='" + event.target.value + "' ",
          "userToken": this.userData.userToken
        });
      }
    } else if (objId == "send_dep_id") {
      var student = JSON.stringify({
        "table_name": "pdepartment", 
        "field_id": "dep_code", 
        "field_name": "dep_name",
        "condition": " AND dep_code='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    } 

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions:any = JSON.parse(JSON.stringify(response));
        if (getDataOptions.length) {
          this.result[objId] = getDataOptions[0].fieldIdValue;
          this.result[objName] = getDataOptions[0].fieldNameValue;
        } else {
          this.result[objId] = "";
          this.result[objName] = "";
        }
      },
      (error) => { }
    )
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

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
}

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0610 = this.masterSelected;
      }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0610 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0610 = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }


  searchCase(){//ลำดับที่ซอง
    // console.log(this.result.case_running);
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if( this.result.case_running){
      this.SpinnerService.show();
          var student = JSON.stringify({
          "case_running": this.result.case_running,
          "userToken": this.userData.userToken
        });
      
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0610/getCaseData', student).subscribe(posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));
        if (productsJson.result == 1) {
          if (productsJson.data.length > 0) {
            // this.result = productsJson.data[0];
            this.result.judge_type = productsJson.data[0].judge_type;
            this.result.case_title = productsJson.data[0].case_title;
            this.result.case_no = productsJson.data[0].case_no;
            this.result.case_no2 = productsJson.data[0].case_no;
            this.result.case_yy = productsJson.data[0].case_yy;
            this.getData();
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

  searchBarcode() {
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.result.doc_barcode) {
      confirmBox.setMessage('กรุณาป้อน Barcode');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    } else{
      var student = JSON.stringify({
        "barcode": this.result.doc_barcode,
        "userToken": this.userData.userToken
      });
      
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0610/getDocData', student).subscribe(posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));
        if (productsJson.result == 1) {
          this.result = productsJson.data[0];
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


  openSendjudgeCase(){
    let toPage = "fct9914";
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + toPage;
    myExtObject.OpenWindowMaxName(winURL, toPage);
  }

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent() {
    if (this.modalType == 1 || this.modalType == 4) {
      if((this.modalType == 1 && this.result.send_to == 1) || (this.modalType == 4 && this.result.ssend_to == 1) || (this.modalType == 4 && this.result.ssend_to == '')){
        var student = JSON.stringify({
          "table_name": "pofficer", 
          "field_id": "off_id", 
          "field_name": "off_name",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pofficer';
        this.listFieldId = 'off_id';
        this.listFieldName = 'off_name';
        this.listFieldCond = "";

        this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
          (response) => {
            this.list = response;
            this.loadModalComponent = false;
            this.loadComponent = true;
            this.loadJudgeComponent = false;
          },
          (error) => { }
        )

      }else if((this.modalType == 1 && this.result.send_to == 2) || (this.modalType == 4 && this.result.ssend_to == 2)){
        var student = JSON.stringify({
          "table_name": "pdepartment", 
          "field_id": "dep_code", 
          "field_name": "dep_name", 
          "userToken": this.userData.userToken
        });
        this.listTable = 'pdepartment';
        this.listFieldId = 'dep_code';
        this.listFieldName = 'dep_name';
        this.listFieldCond = "";

        this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
          (response) => {
            this.list = response;
            this.loadModalComponent = false;
            this.loadComponent = true;
            this.loadJudgeComponent = false;
          },
          (error) => { }
        )
      }else if((this.modalType == 1 && this.result.send_to == 3) || (this.modalType == 4 && this.result.ssend_to == 3)){
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
            let productsJson:any = JSON.parse(JSON.stringify(response));
            if (productsJson.data.length) {
              this.list = productsJson.data;
            } else {
              this.list = [];
            }

            this.loadModalComponent = false;
            this.loadComponent = false;
            this.loadJudgeComponent = true;
          },
          (error) => { }
        )
      }
    }else if (this.modalType == 2) {
      var student = JSON.stringify({
        "table_name": "prea_sendjudge_case", 
        "field_id": "rea_id", 
        "field_name": "rea_desc",
        "userToken": this.userData.userToken
      });
      this.listTable = 'prea_sendjudge_case';
      this.listFieldId = 'rea_id';
      this.listFieldName = 'rea_desc';
      this.listFieldCond = "";

      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          this.list = response;
          this.loadModalComponent = false;
          this.loadComponent = true;
          this.loadJudgeComponent = false;
        },
        (error) => { }
      )
    }else if (this.modalType == 3) {
      var student = JSON.stringify({
        "table_name": "pdepartment", 
        "field_id": "dep_code", 
        "field_name": "dep_name", 
        "userToken": this.userData.userToken
      });
      this.listTable = 'pdepartment';
      this.listFieldId = 'dep_code';
      this.listFieldName = 'dep_name';
      this.listFieldCond = "";

      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          this.list = response;
          this.loadModalComponent = false;
          this.loadComponent = true;
          this.loadJudgeComponent = false;
        },
        (error) => { }
      )
    } else{
      this.loadModalComponent = true;
      this.loadComponent = false;
      this.loadJudgeComponent = false;
    }
  }

  receiveFuncListData(event:any){
    // console.log(event);
    if(this.modalType == 1){
      this.result.dep_id = event.fieldIdValue;
      this.result.dep_name = event.fieldNameValue;
    }else if(this.modalType == 4){
      this.result.ssend_id = event.fieldIdValue;
      this.result.ssend_name = event.fieldNameValue;
    }else if(this.modalType == 2){
      this.result.reason_id = event.fieldIdValue;
      this.result.reason = event.fieldNameValue;
    }else if(this.modalType == 3){
      this.result.send_dep_id = event.fieldIdValue;
      this.result.sdep_name = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click()
  }

  receiveFuncJudgeListData(event:any) {
    // console.log(event);
    if(this.modalType == 1){
      this.result.dep_id = event.judge_id;
      this.result.dep_name = event.judge_name;
    }else if(this.modalType == 4){
      this.result.sdep_id = event.judge_id;
      this.result.sdep_name = event.judge_name;
    }
    this.closebutton.nativeElement.click();
  }

  ClearAll(){
    window.location.reload();
  }

  submitForm() {//save
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.dep_id){
      confirmBox.setMessage('กรุณาเลือกข้อมูลส่งให้');
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
      this.SpinnerService.show();

      if(this.result.send_to == 1){
        this.result.off_id = this.result.dep_id;
        this.result.off_name = this.result.dep_name;

        this.result.dep_id = null;
        this.result.dep_name = null;

      }else if(this.result.send_to == 2){
        this.result.dep_id = this.result.dep_id;
        this.result.dep_name = this.result.dep_name;
      }else if(this.result.send_to == 2){
        this.result.judge_id = this.result.dep_id;
        this.result.judge_name = this.result.dep_name;

        this.result.dep_id = null;
        this.result.dep_name = null;
      }

      this.result['userToken'] = this.userData.userToken;
      var tmpData = ($.extend({}, this.result))

      this.http.disableHeader().post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0610/insertHistoricalData', tmpData ).subscribe(
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
                  this.getData();
                }
                subscription.unsubscribe();
              });
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  searchData(){

    if(this.result.ssend_to == 1)
      this.result.off_id = this.result.dep_id;
    else if(this.result.ssend_to == 2)
      this.result.dep_id = this.result.dep_id;
    else if(this.result.ssend_to == 2)
      this.result.judge_id = this.result.dep_id;

    var student = JSON.stringify({
      "send_dep_id": this.result.send_dep_id,
      "sdep_id": this.result.dep_id,
      "sjudge_id": this.result.judge_id,
      "soff_id": this.result.off_id ,
      "ssend_to": this.result.ssend_to,
      "s_date": this.result.s_date1,
      "e_date": this.result.s_date2,
      "searchData": 1,
      "userToken": this.userData.userToken
    });

    this.http.disableLoading().post('/' + this.userData.appName + 'ApiJU/API/JUDGEMENT/fju0610/getData', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      if (productsJson.result == 1) {
        this.posts = productsJson.data;
        this.checklist = this.posts;
        if(productsJson.data.length)
          this.posts.forEach((x : any ) => x.edit0610 = false);
        this.rerender();
      }
      this.SpinnerService.hide();
    });
  }

  getData(){
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();

      var student = JSON.stringify({
        "userToken" : this.userData.userToken
      });
      
      this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0610/getData', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0610 = false);
            this.rerender();
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
          this.SpinnerService.hide();
      });

  }

  confirmBox() {
    var isChecked = this.posts.every(function(item:any) {
      return item.edit0610 == false;
    })

    const confirmBox = new ConfirmBoxInitializer();
    if(isChecked==true){
      confirmBox.setTitle('ไม่พบเงื่อนไข?');
      confirmBox.setMessage('กรุณาเลือกซองคำพิพากษาที่ต้องการยกเลิก');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      this.modalType="";
      this.openbutton.nativeElement.click();
    }
  }
  
  submitModalForm() {//ยกเลิกการส่งซองคำพิพากษา
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
        if (resp.success==true){}
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
      this.http.disableLoading().post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          if(productsJson.result==1){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการยกเลิกการส่งซองคำพิพากษาที่เลือกใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                var dataDetail = [],dataTmp=[];
                var bar = new Promise((resolve, reject) => {
                  this.posts.forEach((ele, index, array) => {
                        if(ele.edit0610 == true){
                          this.posts[index].cancel_flag = 1;
                          dataTmp.push(this.posts[index]);
                        }
                    });
                });
                if(bar){
                  dataDetail['userToken'] = this.userData.userToken;
                  dataDetail['data'] = dataTmp;
                  var data = $.extend({}, dataDetail);
                  this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0610/cancelHistoricalData', data ).subscribe(
                  (response) =>{
                    let alertMessage : any = JSON.parse(JSON.stringify(response));
                    if(alertMessage.result==0){
                      this.SpinnerService.hide();
                    }else{
                      this.closebutton.nativeElement.click();;
                      this.getData();
                    }
                  },
                  (error) => {this.SpinnerService.hide();}
                )
                } 
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
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }
        },
        (error) => {}
      );
    }
  }

  printReport(pflag:any){
    var dataTmp=[];
    var bar = new Promise((resolve, reject) => {
      this.posts.forEach((ele, index, array) => {
            if(ele.edit0610 == true){
              dataTmp.push(this.posts[index].history_running);
            }
        });
    });

    if(bar){
      // console.log(dataTmp.length);
      if(dataTmp.length <= 0){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลก่อนพิมพ์');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });

      }else{
        var rptName = 'rfju0610';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "phistory_running" : dataTmp.toString(),
          "ptype" : 1,
          "pflag" : pflag
        });
        this.printReportService.printReport(rptName,paramData);
        console.log(paramData);
      }
    }
  }

  closeModal(){
    this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadJudgeComponent = false;
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
