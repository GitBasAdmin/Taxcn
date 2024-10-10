import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, OnDestroy, ViewChildren, QueryList, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PrintReportService } from 'src/app/services/print-report.service';
// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';
import { ExcelService } from '../../../services/excel.service.ts';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;

@Component({
  selector: 'app-fmg0105,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg0105.component.html',
  styleUrls: ['./fmg0105.component.css']
})

export class Fmg0105Component implements AfterViewInit, OnInit, OnDestroy, AfterContentInit {
  title = 'datatables';
  getCaseType: any;
  getRedTitle: any;
  getMaterial: any;
  sessData: any;
  userData: any;
  programName: any;
  result: any = [];
  dataSearch: any = [];
  itemsTmp: any = [];
  myExtObject: any;
  modalType: any;
  modalIndex: any;
  getCate: any;
  getSelType: any;
  getCond: any;
  getuFlag: any;
  getCasecate: any;
  getRoom: any;
  getCondition: any;
  getAppoint: any;
  count: any;
  masterSelected1: boolean;
  masterSelected2: boolean;
  masterSelected3: boolean;
  checklist: any;
  delValue: any;
  partyGroup: any;
  runId: any;
  Text: any;
  getMonthTh: any = [];
  getYearData: any = [];
  sDetail:boolean;
  order_no: any;
  tmpData: any;
  deposit_level1: any;
  deposit_level2: any;
  deposit_level3: any;

  dataFileSearch1: any = [];
  dataFileSearch2: any = [];
  getAttachSubType: any;
  getAttachSubTypeOriginal: any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldName3: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;

  public masterSelBurn: boolean = false;
  public masterSelBurn2: boolean = false;
  public masterSelBurn3: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};

  public loadComponent: boolean = false;
  public loadMutipleComponent: boolean = false;
  public loadJudgeComponent: boolean = false;
  public loadModalJudgeGroupComponent: boolean = false;
  public loadModalAttachFileComponent: boolean = false;
  public loadModalJudgePatyComponent: boolean = false;
  public loadModalReadTextComponent: boolean = false;
  

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  // @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChildren('jcalendar') jcalendar: QueryList<ElementRef>;
  @ViewChildren('icalendar') icalendar: QueryList<ElementRef>;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;

  constructor(
    private ngbModal: NgbModal,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private printReportService: PrintReportService,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
  ) {
    this.masterSelected1 = false
    this.masterSelected2 = false
    this.masterSelected3 = false
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.successHttp();

    var student = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "order_by": "case_cate_id ASC ",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({ fieldIdValue: 0, fieldNameValue: 'ทั้งหมด' });
        this.getCate = getDataOptions;
      },
      (error) => { }
    )

    var student = JSON.stringify({
      "table_name": "passign_stat_condition",
      "field_id": "condition_id",
      "field_name": "condition_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({ fieldIdValue: 0, fieldNameValue: 'ทั้งหมด' });
        this.getCond = getDataOptions;

      },
      (error) => { }
    )

    var student = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCasecate = getDataOptions;
        if (getDataOptions.length)
          this.getCasecate.forEach((x: any) => x.case_cate = false);
        var tmp: any;
        tmp = Math.floor(this.getCasecate.length / 3);
        this.count = (this.getCasecate.length - (tmp * 3)) + 1;
        console.log(this.count, this.getCasecate.length, tmp);
      },
      (error) => { }
    )

    var student = JSON.stringify({
      "table_name": "pjudge_room",
      "field_id": "room_id",
      "field_name": "room_desc",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getRoom = getDataOptions;
      },
      (error) => { }
    )

    var student = JSON.stringify({
      "table_name": "passign_stat_condition",
      "field_id": "condition_id",
      "field_name": "condition_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCondition = getDataOptions;
      },
      (error) => { }
    )

    // องค์คณะ
    var student = JSON.stringify({
      "j_type": 1,
      "cond": 2,
      "skip_auto": 1,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupJudgeParty', student).subscribe(
      datalist => {
        let productsJson: any = JSON.parse(JSON.stringify(datalist));
        if (productsJson.length) 
          this.partyGroup = productsJson;
        else
          this.partyGroup = [];
      },
      (error) => { }
    );

    this.getSelType = [{ fieldIdValue: '', fieldNameValue: 'ทั้งหมด' }, { fieldIdValue: 1, fieldNameValue: 'เฉพาะประเภทคดี' }, { fieldIdValue: 2, fieldNameValue: 'ยกเว้นประเภทคดี' }];
    this.getuFlag = [{ fieldIdValue: 'o', fieldNameValue: 'เจ้าหน้าที่' }, { fieldIdValue: 'j', fieldNameValue: 'ผู้พิพากษา' }];
    this.getMonthTh = [{fieldIdValue: '01', fieldNameValue: "มกราคม"},{fieldIdValue: '02', fieldNameValue: "กุมภาพันธ์"},{fieldIdValue: '03',fieldNameValue: "มีนาคม"},{ fieldIdValue: '04',fieldNameValue: "เมษายน"},{fieldIdValue: '05',fieldNameValue: "พฤษภาคม"},{fieldIdValue: '06',fieldNameValue: "มิถุนายน"},{fieldIdValue: '07',fieldNameValue: "กรกฎาคม"},{fieldIdValue: '08',fieldNameValue: "สิงหาคม"},{fieldIdValue: '09',fieldNameValue: "กันยายน"},{fieldIdValue: '10',fieldNameValue: "ตุลาคม"},{fieldIdValue: '11',fieldNameValue: "พฤศจิกายน"},{fieldIdValue: '12',fieldNameValue: "ธันวาคม"}];

    let year = myExtObject.curYear()-5;
    console.log(year);
    for (let index = 0; index < 11; index++) {
      this.getYearData[index]={ fieldIdValue: year+index, fieldNameValue: year+index };
    }
    this.setDefPage();
  }

  setDefPage() {
    this.result = []; this.getAppoint = [];
    // this.result.c_cate_id = 0;
    // this.result.uFlag = 'o';
    // this.result.sel_type = '';
    // this.result.cond = 2;
    this.result.app_flag = 1;//กลุ่มการจ่ายสำนวน
    this.result.cond2 = 0;//ทุนทรัพย์
    this.result.cond3 = 99;//จ่ายสำนวนให้คณะแล้ว
    this.result.data = 2;//ข้อมูลคดี
    this.result.sMonth = myExtObject.curMonth();
    this.result.sYear = myExtObject.curYear();

    this.sDetail = false;

    this.getDepositLevelData();
  }

  getDepositLevelData(){
    var student = JSON.stringify({
      "app_flag" : this.result.app_flag ? this.result.app_flag : 1,
      "userToken": this.userData.userToken
    });
    
    this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0105/getMaxPartyId', student).subscribe(
      datalist => {
        let productsJson: any = JSON.parse(JSON.stringify(datalist));
        this.deposit_level1="";this.deposit_level2="";this.deposit_level3="";
        if (productsJson.result==1) {
          productsJson.data.forEach((ele, index1, array) => {
            if(ele.deposit_level == 1)
              this.deposit_level1=ele.assign_party_id;
            else if(ele.deposit_level == 2)
              this.deposit_level2=ele.assign_party_id;
            else if(ele.deposit_level == 3)
              this.deposit_level3=ele.assign_party_id;
          });
        }
      },
      (error) => { }
    );
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fmg0105"
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
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
  }

  ngAfterContentInit(): void {
    // this.setDefPage();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  callCalendarSet() {
    myExtObject.callCalendar();
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
    if(obj=="sdate" || obj=="edate"){
      if(this.result.sdate || this.result.sdate){
        this.result.sMonth = null;
        this.result.sYear = null;
      }
    }

    if(obj=="sdate1" || obj=="edate1"){
      if(this.result.sdate1 || this.result.sdate1){
        this.result.cond3 = 3;
      }
    }
  }

  changeSearchDate(obj: any){
    if(obj=="sMonth" || obj=="sYear"){
      if(this.result.sMonth || this.result.sYear){
        this.result.sdate = null;
        this.result.edate = null;
      }
    } 
  }

  showDetail(){
    this.sDetail = !this.sDetail;
    console.log(this.sDetail);
  }

  assignToDate() {
    console.log(this.result.cond3 );
    if (this.result.cond3 == 3) {
      this.result.sdate1 = myExtObject.curDate();
      this.result.edate1 = myExtObject.curDate();
    } else {
      //this.result.cond3 = 0;
      this.result.sdate1 = '';
      this.result.edate1 = '';
    }
  }

  directiveDateObj(index: any, obj: any) {
    this.dataSearch[index][obj] = this.jcalendar.get(index).nativeElement.value;
  }

  checkUncheckAll(type: any) {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0101 = this.masterSelected2;

      if (!this.checklist[i].edit0101){
        this.dataSearch[i].party_id = '';
        this.dataSearch[i].judge_name = '';
        this.dataSearch[i].assign_auto_flag = '';
        this.dataSearch[i].party_assign_date = '';
      }
      /*if (this.checklist[i].edit0101)
        this.dataSearch[i].case_judge_date = myExtObject.curDate();
      else
        this.dataSearch[i].case_judge_date = '';
        */
    }

    this.getCheckedItemList(type);
  }

  isAllSelected(type: any, index: any) {
    if(!this.dataSearch[index].edit0101){
      this.dataSearch[index].party_id = '';
      this.dataSearch[index].judge_name = '';
      this.dataSearch[index].assign_auto_flag = '';
      this.dataSearch[index].party_assign_date = '';
    }

    /*if (type == 0) {
      this.masterSelected2 = this.checklist.every(function (item: any) {
        return item.edit0101 == true;
      })
    }
     else if (type == 1) {
      this.masterSelected2 = this.checklist.every(function (item: any) {
        return item.edit0101 == true;
      })

       this.assignDate(index);

    } /*else if (type == 2) {
      this.masterSelected3 = this.checklist.every(function (item: any) {
        return item.own_new_flag == true;
      })
    }*/
    this.getCheckedItemList(type);
  }

  // assignDate(index: any) {
  //   console.log(index,);
  //   if (this.checklist[index].edit0101)
  //     this.dataSearch[index].case_judge_date = myExtObject.curDate();
  //   else
  //     this.dataSearch[index].case_judge_date = '';
  // }

  uncheckAll(type: any) {
    if (type == 0) {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].skip_assign_auto = this.masterSelected1;
      }

      this.masterSelected1 = false;
      // $("body").find("input[name='delValue']").val('');
    } /*else if (type == 1) {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].edit0101 = this.masterSelected2;
      }

      this.masterSelected2 = false;
      $("body").find("input[name='delValue']").val('');
    } else if (type == 2) {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].own_new_flag = this.masterSelected3;
      }

      this.masterSelected3 = false;
      $("body").find("input[name='delValue']").val('');
    }*/
  }

  getCheckedItemList(type: any) {
    if (type == 0) {
      this.delValue = "";
      for (var i = 0; i < this.checklist.length; i++) {
        if (this.checklist[i].skip_assign_auto) {
          if (this.delValue != '')
            this.delValue += ','
          this.delValue += this.checklist[i].skip_assign_auto;
        }
      }
    }/* else if (type == 1) {
      this.delValue = "";
      for (var i = 0; i < this.checklist.length; i++) {
        if (this.checklist[i].edit0101) {
          if (this.delValue != '')
            this.delValue += ','
          this.delValue += this.checklist[i].edit0101;
        }
      }
    } else if (type == 2) {
      this.delValue = "";
      for (var i = 0; i < this.checklist.length; i++) {
        if (this.checklist[i].own_new_flag) {
          if (this.delValue != '')
            this.delValue += ','
          this.delValue += this.checklist[i].own_new_flag;
        }
      }
    }*/
  }

  saveDataSelect() {
    var isChecked = this.dataSearch.every(function (item: any) {
      return item.edit0101 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการจัดเก็บ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      var dataVal = [], dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
          if (ele.edit0101 == true) {
            dataTmp.push(this.dataSearch[index]);
          }
        });
      });
      if (bar) {
        // dataVal['judge_id'] = this.result.judge_id;
        // dataVal['judge_name'] = this.result.judge_name;
        dataVal['userToken'] = this.userData.userToken;
        dataVal['data'] = dataTmp;
        var data = $.extend({}, dataVal);

        this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0105/saveData', data).subscribe(
          (response) => {
            let alertMessage: any = JSON.parse(JSON.stringify(response));
            if (alertMessage.result == 0) {
              this.SpinnerService.hide();
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
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
            } else {
              this.SpinnerService.hide();
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.searchData();
                  this.getDepositLevelData();
                }
                subscription.unsubscribe();
              });
            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      }
    }

  }

  sendSms(){
    var isChecked = this.dataSearch.every(function (item: any) {
      return item.edit0101 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ข้อความแจ้งเตือน'); 
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องส่ง SMS');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      confirmBox.setTitle('ต้องการยืนยันส่ง sms การจ่ายสำนวนหรือไม่?');
      confirmBox.setMessage('ระบบจะทำการส่ง sms ไปยังผู้พิพากษาและองค์คณะของคดีที่เลือก');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { 
          this.sendSmsDetail();
        }
        subscription.unsubscribe();
      });
    }
  }

  sendSmsDetail(){
    var dataVal = [], dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
          if (ele.edit0101 == true) {
            dataTmp.push(this.dataSearch[index]);
          }
        });
      });
      if (bar) {
        dataVal['userToken'] = this.userData.userToken;
        dataVal['data'] = dataTmp;
        var data = $.extend({}, dataVal);

        this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0105/sendSms', data).subscribe(
          (response) => {
            let alertMessage: any = JSON.parse(JSON.stringify(response));
            if (alertMessage.result == 0) {
              this.SpinnerService.hide();
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
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
            } else {
              this.SpinnerService.hide();
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  // this.searchData();
                  // this.getDepositLevelData();
                }
                subscription.unsubscribe();
              });
            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      }
  }


  getAppointData(runId: any) {
    console.log("runId-" + runId);
    if (runId) {
      var student = JSON.stringify({
        "run_id": runId,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiAP/API/APPOINT/getAppointData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          this.getAppoint = [];
          this.getAppoint = getDataOptions.data;
        },
        (error) => { }
      )
    }
  }

  curencyFormat(n: any, d: any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if ((!this.result.sdate || !this.result.edate) && (!this.result.sMonth || !this.result.sYear) && (this.result.data!=3)) {
      confirmBox.setMessage('กรุณาระบุ วันที่นัดหรือเดือนที่นัด ก่อนการค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    // } else if (this.result.data == 3 && (!this.result.sdate1 || !this.result.edate1)) {
    //   confirmBox.setMessage('ระบุวันที่ก่อนการค้นหา');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //     layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success == true) { }
    //     subscription.unsubscribe();
    //   });
    }else if ((!this.result.sdate || !this.result.edate) && (!this.result.sMonth || !this.result.sYear) && (this.result.data==3 && this.result.cond3 == 99)) {
      confirmBox.setMessage('กรุณาระบุ วันที่นัดหรือเดือนที่นัด ก่อนการค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if ((this.result.data==3 && this.result.cond3 == 3) && (!this.result.sdate1 || !this.result.edate1)) {
      confirmBox.setMessage('กรุณาระบุ วันที่จ่ายสำนวน ก่อนการค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {

      // this.SpinnerService.show();

      this.result["userToken"] = this.userData.userToken
      var student = $.extend({}, this.result);
      if(student.cond3 == 99)
        student.cond3=null;

      this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0105/searchData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.masterSelBurn = this.masterSelBurn2 = this.masterSelBurn3 = false;
          if (getDataOptions.result == 1) {
            this.dataSearch = getDataOptions.data;
            var bar = new Promise((resolve, reject) => {
              // this.dataSearch.forEach((x: any) => x.flag_cancel_burn = x.flag_burn = x.doc_burn_flag = false);
              this.dataSearch.forEach((ele, index, array) => {
                // ele.case_judge_id = ele.judge_id;
                ele.party_assign_date = ele.party_id ? ele.party_assign_date : "";
                ele.deposit = ele.deposit ? this.curencyFormat(ele.deposit, 2) : "";
                ele.edit0101 = false;
              });
            });
            if (bar) {
              if (this.dataSearch.length > 0)
                this.order_no = this.dataSearch.length
              else
                this.order_no = '';

              this.checklist = this.dataSearch;
              // this.itemsTmp = JSON.parse(JSON.stringify(this.dataSearch));
              this.rerender();

              // this.SpinnerService.hide(); 

              setTimeout(() => {
                this.callCalendarSet();
              }, 500);
            }
          } else {
            this.dataSearch = this.itemsTmp = [];
            this.rerender();

            this.SpinnerService.hide();
          }
        },
        (error) => { }
      )
    }
  }

  receiveFuncListData(event: any) {
    console.log(event);
    if (this.modalType == 1) {
      this.result.table_id = event.fieldIdValue;
      this.result.ptable_name = event.fieldNameValue;
    } else if (this.modalType == 4) {
      this.result.oid = event.fieldIdValue;
      this.result.oname = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  receiveFuncJudgeListData(event: any) {
    console.log(this.modalType, event);
    if (this.modalType == 2) {
      this.result.sjudge_id = event.judge_id;
      this.result.sjudge_name = event.judge_name;
    } else if (this.modalType == 3) {
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
    } else if (this.modalType == 4) {
      this.result.oid = event.judge_id;
      this.result.oname = event.judge_name;
    } else if (this.modalType == 5) {
      this.dataSearch[this.result.index].case_judge_id = event.judge_id;
      this.dataSearch[this.result.index].case_judge_name = event.judge_name;
      this.dataSearch[this.result.index].room_id = event.room_id;

      this.dataSearch[this.result.index].party_assign_date = myExtObject.curDate();

    } else if (this.modalType == 6) {
      this.dataSearch[this.result.index].case_judge_gid = event.judge_id;
      this.dataSearch[this.result.index].case_judge_gname = event.judge_name;
    } else if (this.modalType == 7) {
      this.dataSearch[this.result.index].case_judge_gid2 = event.judge_id;
      this.dataSearch[this.result.index].case_judge_gname2 = event.judge_name;
    }
    this.closebutton.nativeElement.click();
  }

  closeModal() {
    // this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadMutipleComponent = false;
    this.loadJudgeComponent = false;
    this.loadModalJudgeGroupComponent = false;
    this.loadModalAttachFileComponent = false;
    this.loadModalJudgePatyComponent = false;
    this.loadModalReadTextComponent = false;
  }

  changeParty(index: any) {
    if(!this.dataSearch[index].party_id){
      this.dataSearch[index].judge_name = "";
      this.dataSearch[index].party_assign_date = "";
    }
  }

  //ไฟล์แนบสำนวน
  onOpenAttachFile(run_id:any){
    this.runId = run_id
    this.clickOpenMyModalComponent(5);
  }

  //ใจความฟ้อง
  onOpenReadText(text:any){
    console.log(text);
    this.Text = text
    this.clickOpenMyModalComponent(6);
  }

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent() {
    if (this.modalType == 1) {

      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pappoint_table';
      this.listFieldId = 'table_id';
      this.listFieldName = "table_name";
      this.listFieldName2 = '';
      this.listFieldCond = "";
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          this.list = response;

          // this.loadModalComponent = false;
          this.loadComponent = false;
          this.loadMutipleComponent = true;
          this.loadJudgeComponent = false;
          this.loadModalJudgeGroupComponent = false;
          this.loadModalAttachFileComponent = false;
          this.loadModalJudgePatyComponent = false;
          this.loadModalReadTextComponent = false;
          $("#exampleModal").find(".modal-content").css("width", "650px");
        },
        (error) => { }
      )
    } else if (this.modalType == 2 || this.modalType == 3) {
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldName2 = '';
      this.listFieldCond = '';
      this.listFieldType = JSON.stringify({ "type": 2 });

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
          } else {
            this.list = [];
          }
          // this.loadModalComponent = false;
          this.loadComponent = false;
          this.loadMutipleComponent = false;
          this.loadJudgeComponent = true;
          this.loadModalJudgeGroupComponent = false;
          this.loadModalAttachFileComponent = false;
          this.loadModalJudgePatyComponent = false;
          this.loadModalReadTextComponent = false;

        },
        (error) => { }
      )

    } else if (this.modalType == 4) {
      if (this.result.uFlag == 'o') {
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
        this.listFieldCond = "";

        this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
          (response) => {
            this.list = response;
            // this.loadModalComponent = false;
            this.loadComponent = true;
            this.loadJudgeComponent = false;
            this.loadModalJudgeGroupComponent = false;
            this.loadModalAttachFileComponent = false;
            this.loadModalJudgePatyComponent = false;
            this.loadModalReadTextComponent = false;

          },
          (error) => { }
        )
      } else if (this.result.uFlag == 'j') {
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

            // this.loadModalComponent = false;
            this.loadComponent = false;
            this.loadMutipleComponent = false;
            this.loadJudgeComponent = true;
            this.loadModalJudgeGroupComponent = false;
            this.loadModalAttachFileComponent = false;
            this.loadModalJudgePatyComponent = false;
            this.loadModalReadTextComponent = false;
          },
          (error) => { }
        )
      }
    }else if(this.modalType == 5){
      $("#exampleModal").find(".modal-content").css({ "width": "950px" });
      // this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalAttachFileComponent = true;
      this.loadModalJudgePatyComponent = false;
      this.loadModalReadTextComponent = false;

    }else if(this.modalType == 6){
      $("#exampleModal").find(".modal-content").css({ "width": "900px" });
      // this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalAttachFileComponent = false;
      this.loadModalJudgePatyComponent = false;
      this.loadModalReadTextComponent = true;

    }
  }

  loadTableComponentArry(type: any, index: any) {
    this.openbutton.nativeElement.click();
    this.modalType = type;
    this.result.index = index;

    /*if (this.modalType == 5 || this.modalType == 6 || this.modalType == 7) {
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

          // this.loadModalComponent = false;
          this.loadComponent = false;
          this.loadMutipleComponent = false;
          this.loadJudgeComponent = true;
          this.loadModalJudgeGroupComponent = false;
          this.loadModalAttachFileComponent = false;
          this.loadModalJudgePatyComponent = false;
        },
        (error) => { }
      )
    } else {
      this.listFieldType = JSON.stringify({ "type": 2 });
      $("#exampleModal").find(".modal-content").css({ "width": "650px" });
      this.modalType = '';
      // this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadModalJudgeGroupComponent = true;
      this.loadModalAttachFileComponent = false;
      this.loadModalJudgePatyComponent = false;
    }*/
    if (this.modalType == 8) {
      $("#exampleModal").find(".modal-content").css({ "width": "650px" });
      this.loadComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalAttachFileComponent = false;
      this.loadModalJudgePatyComponent = true;
      this.loadModalReadTextComponent = false;

    }
  }

  receiveJudgeGroupListArry(event: any) {
    console.log(event);
    var index = this.result.index;
    this.dataSearch[index]['case_judge_id'] = event.judge_id1;
    this.dataSearch[index]['case_judge_name'] = event.judge_name1;
    this.dataSearch[index]['room_id'] = event.room_id;

    this.dataSearch[index]['case_judge_gid'] = event.judge_id2;
    this.dataSearch[index]['case_judge_gname'] = event.judge_name2;

    if (this.dataSearch[this.result.index].case_judge_id)
      this.dataSearch[this.result.index].party_assign_date = myExtObject.curDate();

    this.closebutton.nativeElement.click();
  }

  receiveJudgePartyArry(event: any) {
    console.log(event);
    var index = this.result.index;
    this.dataSearch[index]['party_id'] = event.party_id;
    this.dataSearch[index]['judge_name'] = event.judge_name;

    if (this.dataSearch[this.result.index].party_id)
      this.dataSearch[this.result.index].party_assign_date = myExtObject.curDate();

    this.checklist[this.result.index].edit0101 = true;

    this.closebutton.nativeElement.click();
  }

  tabChange(name: any, event: any) {
    if (name == 'table_id') {
      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "condition": " AND table_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));

          if (productsJson.length) {
            this.result.ptable_name = productsJson[0].fieldNameValue;
          } else {
            this.result.table_id = null;
            this.result.ptable_name = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'sjudge_id' || name == 'judge_id') {

      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "condition": " AND judge_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));

          if (productsJson.length) {
            if (name == 'sjudge_id') {
              this.result.sjudge_name = productsJson[0].fieldNameValue;
            } else if (name == 'judge_id') {
              this.result.judge_name = productsJson[0].fieldNameValue;
            }
          } else {
            if (name == 'sjudge_id') {
              this.result.sjudge_id = null;
              this.result.sjudge_name = '';
            } else if (name == 'judge_id') {
              this.result.judge_id = null;
              this.result.judge_name = '';
            }
          }
        },
        (error) => { }
      )
    }
  }
  

  tabChangeInputArry(index: any, name: any, event: any, type: any) {
    this.modalType = type;
    if (name == 'case_judge_id' || name == 'case_judge_gid' || name == 'case_judge_gid2') {
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "condition": " AND judge_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.dataSearch[index]['edit0120'] = true;
            if (name == 'case_judge_id') {
              this.dataSearch[index]['case_judge_name'] = productsJson[0].fieldNameValue;
              this.dataSearch[index].party_assign_date = myExtObject.curDate();
            } else if (name == 'case_judge_gid') {
              this.dataSearch[index]['case_judge_gname'] = productsJson[0].fieldNameValue;
            } else if (name == 'case_judge_gid2') {
              this.dataSearch[index]['case_judge_gname2'] = productsJson[0].fieldNameValue;
            }
          } else {
            if (name == 'case_judge_id') {
              this.dataSearch[index]['case_judge_id'] = null;
              this.dataSearch[index]['case_judge_name'] = '';
              this.dataSearch[index].party_assign_date = '';
            } else if (name == 'case_judge_gid') {
              this.dataSearch[index]['case_judge_gid'] = null;
              this.dataSearch[index]['case_judge_gname'] = '';
            } else if (name == 'case_judge_gid2') {
              this.dataSearch[index]['case_judge_gid2'] = null;
              this.dataSearch[index]['case_judge_gname2'] = '';
            }
          }
        },
        (error) => { }
      )
    }else if (name == 'party_id'){

    }
  }

  retToPage(type: any, name: any) {
    console.log(type);
    if (type == 1) {
      let winURL = this.authService._baseUrl.substring(0, this.authService._baseUrl.indexOf("#") + 1) + '/' + 'fmg0101';
      myExtObject.OpenWindowMax(winURL);
      console.log(winURL);
    } else if (type == 2) {
      let winURL = this.authService._baseUrl.substring(0, this.authService._baseUrl.indexOf("#") + 1) + '/' + 'fmg0200';
      myExtObject.OpenWindowMax(winURL + '?run_id=' + name);
      console.log(winURL + '?run_id=' + name);
    } else if (type == 3) {
      let winURL = this.authService._baseUrl.substring(0, this.authService._baseUrl.indexOf("#") + 1) + '/' + 'fmg2100';
      myExtObject.OpenWindowMax(winURL + '?date_appoint=' + myExtObject.conDate(name));
      console.log(winURL);
    }
  }

  printPlew() {
    var isChecked = this.dataSearch.every(function (item: any) {
      return item.edit0101 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกข้อมูลคดีที่ต้องการพิมพ์ปลิว');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      var dataVal = [], dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
          if (ele.edit0101 == true) {
            dataTmp.push(this.dataSearch[index].run_id);
          }
        });
      });
      if (bar) {
        // let winURL = this.authService._baseUrl.substring(0, this.authService._baseUrl.indexOf("#") + 1) + '/' + 'prca2100';
        // myExtObject.OpenWindowMax(winURL + '?run_id=' + dataTmp.toString());
        // console.log(winURL);
        var rptName = 'rca2100';

        // For no parameter : paramData ='{}'
        var paramData = '{}';
        var paramData = JSON.stringify({
          "pdate_appoint": myExtObject.conDate(myExtObject.curDate()),
          "judge_name": '',
          "ptype": '',
          "proom": '',
          "pgroup": '',
          "prun_id": dataTmp.toString(),
          "pprint_type": '',
          "pprint_by": 1,

        });
        console.log(paramData);
        this.printReportService.printReport(rptName, paramData);
      }
    }
  }

  printRpt() {
    var rptName = 'rfmg0105';

    // For no parameter : paramData ='{}'
    var paramData = '{}';
    var pcon = '';
    // For set parameter to report
    var paramData = JSON.stringify({
      "pcondition": this.result.pcon,
      "pquery": this.result.pquery ? this.result.pquery : ''
    });
    console.log(paramData);

    this.printReportService.printReport(rptName, paramData);
  }

  assignAuto() {
    /*var isChecked = this.dataSearch.every(function (item: any) {
      return item.edit0101 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกข้อมูลคดีที่ต้องจ่ายสำนวน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      var dataVal = [], dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
          if (ele.edit0101 == true) {
            dataTmp.push(this.dataSearch[index].run_id);
          }
        });
      });
      if (bar) {
        this.SpinnerService.show();
        var student = JSON.stringify({
          "userToken": this.userData.userToken
        });
        console.log(student)
        this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0105/getMaxPartyId', student).subscribe(
          datalist => {
            let productsJson: any = JSON.parse(JSON.stringify(datalist));
            console.log(productsJson)
            if (productsJson.length) {
              let assign = productsJson.data;
              // this.JudgeGroup = productsJson;
              var i = 0;
              this.dataSearch.forEach((ele, index, array) => {
                if (ele.edit0101 == true) {
                  if(this.dataSearch[index]['deposit_level']==1){
                    var assign_party_id:any;
                    var bar = new Promise((resolve, reject) => {
                      assign.forEach((ele1, index1, array1) => {
                        if(ele1.deposit_level==1){
                          assign_party_id=ele1.assign_party_id;
                        }
                      });
                    });
                    if (bar) {
                      this.JudgeGroup.forEach((ele3, index3, array3) => {
                        if(ele3.judge_id1==assign_party_id){
                          this.dataSearch[index]['case_judge_id'] = this.JudgeGroup[i].judge_id1;
                          this.dataSearch[index]['case_judge_name'] = this.JudgeGroup[i].judge_name1;
                          this.dataSearch[index]['room_id'] = this.JudgeGroup[i].room_id;
                          this.dataSearch[index]['party_assign_date'] = myExtObject.curDate();

                          this.dataSearch[index]['case_judge_gid'] = this.JudgeGroup[i].judge_id2;
                          this.dataSearch[index]['case_judge_gname'] = this.JudgeGroup[i].judge_name2;
                        } 
                      });
                      if (i < this.JudgeGroup.length - 1)
                        i++;
                      else
                        i = 0;
                    }
                  }
                }
              });


              this.SpinnerService.hide();
            } else {
              this.JudgeGroup = [];
              this.SpinnerService.hide();
            }
          },
          (error) => { }
        );
      }
    }*/
  }

  /*assignJudgePartyAuto() {
    var isChecked = this.dataSearch.every(function (item: any) {
      return item.edit0101 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกข้อมูลคดีที่ต้องจ่ายสำนวน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      var dataVal = [], dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
          if (ele.edit0101 == true) {
            dataTmp.push(this.dataSearch[index].run_id);
          }
        });
      });
      if (bar) {
        this.SpinnerService.show();
        var student = JSON.stringify({
          "j_type": 1,
          "cond": 2,
          "userToken": this.userData.userToken
        });
        console.log(student)
        // this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupJudgeParty', student).subscribe(
        this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0105/getMaxPartyId', student).subscribe(
          datalist => {
            let productsJson: any = JSON.parse(JSON.stringify(datalist));
            console.log(productsJson)
            if (productsJson.length) {
              this.JudgeGroup = productsJson;
              var i = 0;
              this.dataSearch.forEach((ele, index, array) => {
                if (ele.edit0101 == true) {
                  console.log(i + "<" + this.JudgeGroup.length);
                  this.dataSearch[index]['assign_auto_flag'] = 1;
                  this.dataSearch[index]['party_id'] = this.JudgeGroup[i].party_id;
                  this.dataSearch[index]['judge_name'] = this.JudgeGroup[i].judge_name;
                  this.dataSearch[index].party_assign_date = myExtObject.curDate();

                  if (i < this.JudgeGroup.length - 1)
                    i++;
                  else
                    i = 0;
                }
              });
              this.SpinnerService.hide();

              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage('ทำการกำหนดคณะให้อัตโนมัติแล้ว กรุณาตรวจสอบและจัดเก็บอีกครั้ง');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) { }
                subscription.unsubscribe();
              });
            } else {
              this.JudgeGroup = [];
              this.SpinnerService.hide();
            }
          },
          (error) => { }
        );
      }
    }
  }*/
  assignJudgePartyAuto() {
    var isChecked = this.dataSearch.every(function (item: any) {
      return item.edit0101 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกข้อมูลคดีที่ต้องจ่ายสำนวน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      var dataVal = [], dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
          if (ele.edit0101 == true) {
            this.dataSearch[index].party_id = '';
            this.dataSearch[index].judge_name = '';
            this.dataSearch[index].assign_auto_flag = '';
            this.dataSearch[index].party_assign_date = '';
            // dataTmp.push(this.dataSearch[index].run_id);
          }
        });
      });
      if (bar) {
        this.SpinnerService.show();
        var student = JSON.stringify({
          "app_flag" : this.result.app_flag,
          "userToken": this.userData.userToken
        });
        this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0105/getMaxPartyId', student).subscribe(
          datalist => {
            let productsJson: any = JSON.parse(JSON.stringify(datalist));
            console.log(productsJson)
            if (productsJson.result==1) {
              this.tmpData= productsJson.data;
              var maxPartyId=[];
              var bar = new Promise((resolve, reject) => {
                //deposit_level=1 : 0 - < 30 ล้าน
                //deposit_level=2 : >= 30 ล้าน - < 1,000 ล้าน
                //deposit_level=3 : >= 1,000 ล้าน
                //assign index ของ level
                for (let i =0; i < 3; i++) {
                  if (this.tmpData.length>0){
                    maxPartyId[i]=this.tmpData[0];
                    this.tmpData.shift();
                    this.partyGroup.forEach((ele, index1, array) => {
                      if(ele.party_id == maxPartyId[i].assign_party_id)
                        maxPartyId[i].index=index1;
                        console.log(i,index1);
                    });
                  }else{
                    maxPartyId[i]={ "assign_party_id": 0, 
                      "deposit_level": i+1, 
                      "index":this.partyGroup.length-1 };
                  }
                }
              });
              if (bar) {
                console.log(maxPartyId);
                var i = 0;
                var tmp_level = 0;
                this.dataSearch.forEach((ele, index, array) => {
                  if (ele.edit0101 == true) {
                    if(!this.dataSearch[index].party_id){
                      if(this.dataSearch[index]['deposit_level']!= tmp_level){
                        tmp_level = this.dataSearch[index]['deposit_level'];
                        i=maxPartyId[tmp_level-1].index;
                      }
                      if (i < this.partyGroup.length - 1){
                        i++;
                        maxPartyId[tmp_level-1].index=i;
                      }else{
                        i = 0;
                        maxPartyId[tmp_level-1].index=i;
                      }

                      this.dataSearch[index].party_id = this.partyGroup[i].party_id;
                      this.dataSearch[index].judge_name = this.partyGroup[i].judge_name;
                      this.dataSearch[index].assign_auto_flag = 1;
                      this.dataSearch[index].party_assign_date = myExtObject.curDate();

                      //ถ้าคดี เป็นชุดเดียวกัน หลักกับสาขา ให้ใช้คณะเดียวกัน
                      if(this.dataSearch[index]['group_no']){
                        this.dataSearch.forEach((ele1, index1, array1) => {
                          console.log(ele1.group_no, this.dataSearch[index].group_no,ele1.run_id)
                          if(!ele1.party_id){
                            if((ele1.group_no==this.dataSearch[index].group_no) && (ele1.run_id != this.dataSearch[index].run_id) ){
                              ele1.party_id= this.dataSearch[index].party_id;
                              ele1.judge_name=this.dataSearch[index].judge_name;
                              ele1.assign_auto_flag=1;
                              ele1.party_assign_date=myExtObject.curDate();
                            }
                          }
                        });
                      }
                    }
                  }
                });

                this.SpinnerService.hide();

                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage('ทำการกำหนดคณะให้อัตโนมัติแล้ว กรุณาตรวจสอบและจัดเก็บอีกครั้ง');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success == true) { }
                  subscription.unsubscribe();
                });
              }
            } else {
              this.partyGroup = [];
              this.SpinnerService.hide();
            }
          },
          (error) => { }
        );
      }
    }
  }

  showObj(e: any) {
    setTimeout(() => {
      $('body').find('.xdsoft_datetimepicker').each(function () {
        if ($(this).css("display") === "block") {
          $(this).css("left", e.pageX - 100)
        }
      });
    }, 200);
  }

  clearAll() {
    window.location.reload();
  }

  // openNav() {
  //   document.getElementById("sidebar").style.width = "auto";
  //   document.getElementById("sidebar-close").style.display = "block";
  //   document.getElementById("sidebar-open").style.display = "none";
  //   document.getElementById("form_button").style.display = "block";
  // }

  // closeNav() {
  //   document.getElementById("sidebar").style.width = "0";
  //   document.getElementById("sidebar-close").style.display = "none";
  //   document.getElementById("sidebar-open").style.display = "block";
  //   document.getElementById("form_button").style.display = "none";
  // }

  //ไฟล์แนบสำนวน
  searchFileData(runId: any) {
    var student = JSON.stringify({
      "run_id": runId,
      "userToken": this.userData.userToken
    });

    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/fca0230/getAttachData', student).subscribe(
      (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if (productsJson.result == 1 && productsJson.data.length) {
          this.dataFileSearch1 = productsJson.data;
          console.log(this.dataFileSearch1)
          // this.rerender();
          this.searchFileData2(runId);
        } else {
          this.dataFileSearch1 = [];
          // this.rerender();
          this.searchFileData2(runId);
        }
      },
      (error) => { }
    )
  }

  searchFileData2(runId: any) {
    var student = JSON.stringify({
      "run_id": runId,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/fca0230/getDittoData', student).subscribe(
      (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if (productsJson.result == 1 && productsJson.data[0].file_list.length) {
          var bar = new Promise((resolve, reject) => {
          });
          if (bar) {
            this.dataFileSearch2 = productsJson.data[0].file_list;
            // this.rerender();
            this.SpinnerService.hide();
          }
        } else {
          this.dataFileSearch2 = [];
          // this.rerender();
          this.SpinnerService.hide();
        }
      },
      (error) => { }
    )
  }

  clickOpenFile(index: any, type: any) {
    var last = this.dataFileSearch1[index].file_name.split('.').pop().toLowerCase();
    let winURL = window.location.host;
    if (last != 'pdf') {
      var api = '/' + this.userData.appName + "ApiCA/API/CASE/fca0230/openAttach";
      console.log("http://" + winURL + api + '?run_id=' + this.dataFileSearch1[index].run_id + '&file_name=' + this.dataFileSearch1[index].file_name)
      myExtObject.OpenWindowMax("http://" + winURL + api + '?run_id=' + this.dataFileSearch1[index].run_id + '&file_name=' + this.dataFileSearch1[index].file_name);
    } else {
      var api = '/' + this.userData.appName + "ApiCA/API/CASE/fca0230/openPdf";
      console.log("http://" + winURL + api + '?run_id=' + this.dataFileSearch1[index].run_id + '&file_name=' + this.dataFileSearch1[index].file_name)
      myExtObject.OpenWindowMax("http://" + winURL + api + '?run_id=' + this.dataFileSearch1[index].run_id + '&file_name=' + this.dataFileSearch1[index].file_name);
    }
  }

  clickOpenFile2(index: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "ref_no": this.dataFileSearch2[index].ref_no
    });
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/fca0230/openDittoAttach', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if (getDataOptions.result == 1) {
          myExtObject.OpenWindowMax(getDataOptions.file);
        } else {
          confirmBox.setMessage(getDataOptions.error);
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

  printReport() {
    var rptName = 'rfmg0105';
    // For no parameter : paramData ='{}'
    var paramData = '{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "pmonth" : this.result.sMonth ? this.result.sMonth : "",
      "pyear" : this.result.sYear ? this.result.sYear : "",
      "pdate_start" : this.result.sdate ? this.result.sdate : "",
      "pdate_end" : this.result.edate ? this.result.edate : ""
    });
    console.log(paramData);
    this.printReportService.printReport(rptName, paramData);
  }
}