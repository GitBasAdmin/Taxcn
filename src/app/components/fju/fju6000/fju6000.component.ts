import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy   } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ActivatedRoute } from '@angular/router';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,Subject  } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';

import { AuthService } from 'src/app/auth.service';
import { ExcelService } from 'src/app/services/excel.service.ts';

import * as $ from 'jquery';

declare var myExtObject: any;

@Component({
  selector: 'app-fju6000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fju6000.component.html',
  styleUrls: ['./fju6000.component.css']
})

export class Fju6000Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  // getCaseType:any;selCaseType:any;
  // getDateType:any;selDateType:any;
  getJudgeCaseType:any;
  getAppointTable:any;
  // posts:any;
  // search:any;
  // masterSelected:boolean;
  // checklist:any;
  // checkedList:any;
  // delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  // defaultTitle:any;
  // defaultRedTitle:any;
  // numCase:any;
  // numLit:any;
  retPage:any;
  myExtObject:any;
  toPage:any="fju0600";
  // asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  pjudge_type:any;
  judge_case_name:any;
  stype:any;
  modalType:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldType:any;
  public listFieldCond:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private excelService: ExcelService,
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true
    };
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['program'])
        this.retPage = params['program'];
    });
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    /** get pjudge case type */
    var student1 = JSON.stringify({
      "table_name" : "pjudge_case_type",
      "field_id" : "judge_case_type",
      "field_name" : "judge_case_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student1 , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getJudgeCaseType = getDataOptions;
      },
      (error) => {}
    )
    /** get pappoint table */
    var student2 = JSON.stringify({
      "table_name" : "pappoint_table",
      "field_id" : "table_id",
      "field_name" : "table_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAppointTable = getDataOptions;
      },
      (error) => {}
    )
    this.successHttp();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fju6000"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          this.programName = getDataAuthen.programName;
          this.defaultCaseType = getDataAuthen.defaultCaseType;
          this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
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

  ngAfterContentInit() : void{
    this.result.cFlag = 1;
    myExtObject.callCalendar();
  }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }

  closeModal(){
    $('.modal')
    .find("input[type='text'],input[type='password'],textarea,select")
    .val('')
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();
    this.loadModalComponent = false;
    this.loadModalJudgeComponent = false;
  }

  loadTableComponent(val:any){
    this.loadModalComponent = false;
    this.loadComponent = true;
    this.loadModalJudgeComponent = false;
    $("#exampleModal").find(".modal-body").css("height","auto");
  }

  tabChangeInput(name:any,event:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if (name=='table_id') {
      var student = JSON.stringify(
        {
          "table_name" : "pappoint_table",
          "field_id" : "table_id",
          "field_name" : "table_name",
          "condition" : " AND table_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        }
      );
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            if(name == 'table_id'){
              this.result.table_desc = productsJson[0].fieldNameValue;
            }
          } else {
            if (name=='table_id') {
              this.result.table_id = null;
              this.result.table_desc = '';
            }
          }
        },
        (error) => {}
      )
    }
    if (name=='pjudge_type') {
      var student = JSON.stringify(
        {
          "table_name" : "pjudge_case_type",
          "field_id" : "judge_case_type",
          "field_name" : "judge_case_name",
          "condition" : " AND judge_case_type='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        }
      );
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.judge_case_name = productsJson[0].fieldNameValue;
          } else {
            if (name=='table_id') {
              this.result.pjudge_type = null;
              this.result.judge_case_name = '';
            }
          }
        },
        (error) => {}
      )
    }
  }

  receiveFuncListData(event:any){
    if (this.modalType==1) {
      this.result.table_id = event.fieldIdValue;
      this.result.table_desc = event.fieldNameValue;
    }
    if (this.modalType==2) {
      this.result.pjudge_type = event.fieldIdValue;
      this.result.judge_case_name = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  receiveJudgeListData(event:any){
    if (this.modalType==1) {
      this.result.case_judge_id = event.judge_id;
      this.result.case_judge_name = event.judge_name;
    } else if (this.modalType==2) {
      this.result.judge_id1 = event.judge_id;
      this.result.judge_name1 = event.judge_name;
    } else if(this.modalType==3) {
      this.result.judge_id2 = event.judge_id;
      this.result.judge_name2 = event.judge_name;
    }
    this.closebutton.nativeElement.click();
  }

  searchData(){
    if(
      !this.result.sdate &&
      !this.result.edate &&
      !this.result.sdate2 &&
      !this.result.edate2 &&
      !this.result.pjudge_type &&
      !this.result.judge_case_name &&
      !this.result.table_id &&
      !this.result.table_desc &&
      !this.result.read_flag &&
      !this.result.read_alert &&
      !this.result.read_total &&
      !this.result.run_seq
    ) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ระบุวันที่รับซอง และ/หรือ วันที่นัดให้ครบถ้วน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    } else if ((!this.result.sdate && this.result.edate) || (this.result.sdate2 && !this.result.edate2)) {
      /** ตรวจสอบวันที่นัด */
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ระบุวันที่รับซองหรือวันนัดให้ครบถ้วน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();
      this.tmpResult = this.result;
      var jsonTmp = $.extend({}, this.tmpResult);
      jsonTmp['userToken'] = this.userData.userToken;
      var student = jsonTmp;
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju6000', student , {headers:headers}).subscribe(
      this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju6000', student , {headers:headers}).subscribe(
        (response) => {
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(student);
            if (productsJson.result==1) {
              this.dataSearch = productsJson.data;
              this.rerender();
            } else {
              this.dataSearch = [];
              this.rerender();
            }
            this.SpinnerService.hide();
        },
        (error) => {}
      )
    }
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }
  clickOpenMyModalComponent(val:any){
    this.modalType = val;
    /** ประเภทนัด */
    if (this.modalType==1) {
      $("#exampleModal").find(".modal-content").css("width","700px");
      var student = JSON.stringify(
        {
          "table_name" : "pappoint_table",
          "field_id" : "table_id",
          "field_name" : "table_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken
        }
      );
      this.listTable='pappoint_table';
      this.listFieldId='table_id';
      this.listFieldName='table_name';
      this.listFieldNull='';
      this.listFieldCond='';
    }
    /** ประเภทอุทธรณ์ */
    if (this.modalType==2) {
      $("#exampleModal").find(".modal-content").css("width","700px");
      var student = JSON.stringify(
        {
          "table_name" : "pjudge_case_type",
          "field_id" : "judge_case_type",
          "field_name" : "judge_case_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken
        }
      );
      this.listTable='pjudge_case_type';
      this.listFieldId='judge_case_type';
      this.listFieldName='judge_case_name';
      this.listFieldNull='';
      this.listFieldCond='';
    }
    //ส่วนนี้จะใช้กับ popup return ธรรมดา
      this.loadModalComponent = false;
      this.loadComponent = true;
      this.loadModalJudgeComponent = false;
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        (response) => {
          this.list = response;
        },
        (error) => {}
      )
  }

  exportAsXLSX(): void {
    if(this.dataSearch){
      var excel =  JSON.parse(JSON.stringify(this.dataSearch));
      var data = [];
      var extend = [];
      var bar = new Promise((resolve, reject) => {
        for(var i = 0; i < excel.length; i++){
          for(var x=0;x<18;x++){
            if(x==0) data.push(excel[i]['caseno']);
            if(x==1) data.push(excel[i]['rcv_date']);
            if(x==2) data.push(excel[i]['pcase_black_no']);
            if(x==3) data.push(excel[i]['pcase_red_no']);
            if(x==4) data.push(excel[i]['pros_desc']);
            if(x==5) data.push(excel[i]['accu_desc']);
            if(x==6) data.push(excel[i]['hcase_no']);
            if(x==7) data.push(excel[i]['date_appoint']);
            if(x==8) data.push(excel[i]['room_desc']);
            if(x==9) data.push(excel[i]['app_name']);
            if(x==10) data.push(excel[i]['return_flag']);
            if(x==11) data.push(excel[i]['readevent']);
            if(x==12) data.push(excel[i]['delay_name']);
            if(x==13) data.push(excel[i]['next_appoint']);
            if(x==14) data.push(excel[i]['realdoc']);
            if(x==15) data.push(excel[i]['real_send_date']);
            if(x==16) data.push(excel[i]['event_dep']);
          }
          extend[i] = $.extend([], data)
          data = [];
        }
      });
      if(bar){
        var objExcel = [];
        objExcel['data'] = extend;
        this.excelService.exportAsExcelFile(objExcel,'fju6000' ,this.programName);
      }
    }else{
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นหาข้อมูล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
  }

  goToPage(case_running:any){
    let winURL = window.location.href;
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?case_running='+case_running;
    window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
  }
}







