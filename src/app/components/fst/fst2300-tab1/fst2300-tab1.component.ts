import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2,Input,Output,EventEmitter,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
declare var myExtObject: any;
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import { PopupStatComponent } from '@app/components/modal/popup-stat/popup-stat.component';
import { NgbModal, NgbModalRef   } from '@ng-bootstrap/ng-bootstrap';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fst2300-tab1',
  templateUrl: './fst2300-tab1.component.html',
  styleUrls: ['./fst2300-tab1.component.css']
})
export class Fst2300Tab1Component implements OnInit {

  sessData: any;
  userData: any;
  getCaseTypeStat: any;
  parm: any = [];
  numColumn: any;
  data: any = [];
  result: any = [];
  resultNotice: any = [];
  totle: any = [];
  posts: any = [];
  caseDataValue: any;
  case_old: any = [];
  case_old_close: any = [];
  case_old_total: any = [];
  case_new: any = [];
  case_new_close: any = [];
  case_new_hold: any = [];
  case_close: any = [];
  sum_hold: any = [];
  case_today: any = [];
  case_today_close: any = [];
  case_new_increse: any = [];
  case_new_decrese: any = [];
  case_appeal: any = [];
  case_deega: any = [];
  case_autospy_new: any = [];
  case_autospy_finish: any = [];
  case_violate_new: any = [];
  case_violate_finish: any = [];
  case_conciliate_today: any = [];
  case_conciliate_close_today: any = [];
  case_conciliate_cancel: any = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @Output() eventUpdate = new EventEmitter<{data:any,counter:any}>();
  @Input() set caseData(caseData: any) {
    // console.log("Fst2300Tab1->", caseData)
    if (caseData) {
      this.caseDataValue = [];
      this.caseDataValue = caseData.sendData
      if ((this.caseDataValue.tab_index == 0) && (this.caseDataValue.search_data == 1)){
        this.searchData();
      }        

      if ((this.caseDataValue.tab_index == 0) && (this.caseDataValue.process_data == 1)){
        this.processData();
      }

      if ((this.caseDataValue.tab_index == 0) && (this.caseDataValue.submit_data == 1)){
        this.submitForm();
      }
    }
  }
  constructor(
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
    private http: HttpClient,
    private ngbModal: NgbModal
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

    this.CaseTypeStat();
    this.setDefForm();//--set default
    this.getData();
  }

  setDefForm() {
    this.posts=[]; this.result=[];this.resultNotice=[];
    this.result.sum_case_old = 0;
    this.result.sum_case_old_close = 0;
    this.result.sum_case_old_total = 0;
    this.result.sum_case_new = 0;
    this.result.sum_case_today = 0;
    this.result.sum_case_new_close = 0;
    this.result.sum_case_today_close = 0;
    this.result.sum_case_new_hold = 0;
    // ----------------------------
    this.result.sum_case_close = 0;
    this.result.sum_case_hold = 0;
    this.result.sum_case_new_increse = 0;
    this.result.sum_case_new_decrese = 0;
    this.result.sum_case_appeal = 0;
    this.result.sum_case_deega = 0;
    this.result.sum_case_conciliate_old = 0;
    this.result.sum_case_conciliate = 0;
    this.result.sum_case_conciliate_close = 0;
    this.result.sum_case_conciliate_noclose = 0;
    this.result.sum_case_conciliate_today = 0;
    this.result.sum_case_conciliate_close_today = 0;
    this.result.sum_case_conciliate_noclose_today = 0;
    this.result.sum_case_conciliate_cancel = 0;
    this.result.sum_commit_contempt_new = 0;
    this.result.sum_commit_contempt_finish = 0;
    //------------------------------
    this.result.sum_case_autospy_new = 0;
    this.result.sum_case_autospy_finish = 0;
    this.result.sum_case_violate_new = 0;
    this.result.sum_case_violate_finish = 0;
  }

  processData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    var student = JSON.stringify({
      "stat_date": this.caseDataValue.stat_date,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2300/getStatDataTab1', student).subscribe(
      (response) => {
        let alertMessage: any = JSON.parse(JSON.stringify(response));
        if (alertMessage.result == 1) {
          this.assingData(alertMessage);
          // this.SpinnerService.hide() ปิดที่ assingData
        }else{
          this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
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
        }
      },
      (error) => { this.SpinnerService.hide(); }
    )

  }

  getData() {
    this.SpinnerService.show();
    var student = JSON.stringify({
      "stat_date": '',
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2300/getDataTab1', student).subscribe(
      (response) => {
        let alertMessage: any = JSON.parse(JSON.stringify(response));
        if (alertMessage.result == 1) {
          this.assingData(alertMessage);
          // this.SpinnerService.hide() ปิดที่ assingData
        }
      },
      (error) => { this.SpinnerService.hide(); }
    )

  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    var student = JSON.stringify({
      "stat_date": this.caseDataValue.stat_date,
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiST/API/STAT/fst2300/getDataTab1', student).subscribe(
      (response) => {
        let alertMessage: any = JSON.parse(JSON.stringify(response));
        if (alertMessage.result == 1) {
          this.assingData(alertMessage);
          // this.SpinnerService.hide() ปิดที่ assingData
        }else{
          this.SpinnerService.hide();
          confirmBox.setMessage(alertMessage.error);
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
        }
      },
      (error) => { this.SpinnerService.hide(); }
    )

  }

  assingData(productsJson :any){
    this.setDefForm();

    if(productsJson.stat_date){
      var data = productsJson;
      this.eventUpdate.emit({data,counter:Math.ceil(Math.random()*10000)});
    }

    this.posts = productsJson;
    this.data = productsJson.data;
    if(productsJson.notice_data.length >0){
      this.resultNotice = productsJson.notice_data[0];
      console.log(this.resultNotice);
    }else{
      this.resultNotice=[];
    }

    this.data.forEach((ele, i, array) => {
      if (i == 0) {
        this.result.create_user = ele.create_user;
        this.result.create_date = ele.create_date;
        this.result.update_user = ele.update_user;
        this.result.update_date = ele.update_date;
      }

      this.case_old_total[i] = this.assignValue(ele.case_old) - this.assignValue(ele.case_old_close);
      this.result.sum_case_old += this.assignValue(ele.case_old);
      this.result.sum_case_old_close += this.assignValue(ele.case_old_close);
      this.result.sum_case_old_total = this.assignValue(this.result.sum_case_old) - this.assignValue(this.result.sum_case_old_close);
      this.result.sum_case_new += this.assignValue(ele.case_new);
      this.result.sum_case_today += this.assignValue(ele.case_today);
      this.result.sum_case_new_close += this.assignValue(ele.case_new_close);
      this.result.sum_case_today_close += this.assignValue(ele.case_today_close);
      ele.case_new_hold = this.assignValue(ele.case_new - ele.case_new_close);
      this.result.sum_case_new_hold += this.assignValue(ele.case_new_hold);
      // ----------------------------
      ele.case_close = this.assignValue(ele.case_old_close + ele.case_new_close);
      // ele.sum_hold = this.assignValue(ele.case_old_total) + this.assignValue(ele.case_new_hold);
      ele.sum_hold = this.case_old_total[i] + this.assignValue(ele.case_new_hold);
      this.result.sum_case_close += this.assignValue(ele.case_close);
      this.result.sum_case_hold += this.assignValue(ele.sum_hold);
      this.result.sum_case_new_increse += this.assignValue(ele.case_new_increse);
      this.result.sum_case_new_decrese += this.assignValue(ele.case_new_decrese);
      this.result.sum_case_appeal += this.assignValue(ele.case_appeal);
      this.result.sum_case_deega += this.assignValue(ele.case_deega);
      this.result.sum_case_conciliate_old += this.assignValue(ele.case_conciliate_old);
      this.result.sum_case_conciliate += this.assignValue(ele.case_conciliate);
      this.result.sum_case_conciliate_close += this.assignValue(ele.case_conciliate_close);
      this.result.sum_case_conciliate_noclose += this.assignValue(ele.case_conciliate_noclose);
      this.result.sum_case_conciliate_today += this.assignValue(ele.case_conciliate_today);
      this.result.sum_case_conciliate_close_today += this.assignValue(ele.case_conciliate_close_today);
      this.result.sum_case_conciliate_noclose_today += this.assignValue(ele.case_conciliate_noclose_today);
      this.result.sum_case_conciliate_cancel += this.assignValue(ele.case_conciliate_cancel);
      this.result.sum_commit_contempt_new += this.assignValue(ele.commit_contempt_new);
      this.result.sum_commit_contempt_finish += this.assignValue(ele.commit_contempt_finish);
      //------------------------------
      this.result.sum_case_autospy_new += this.assignValue(ele.case_autospy_new);
      this.result.sum_case_autospy_finish += this.assignValue(ele.case_autospy_finish);
      this.result.sum_case_violate_new += this.assignValue(ele.case_violate_new);
      this.result.sum_case_violate_finish += this.assignValue(ele.case_violate_finish);
      // -----------------------------

      this.sum_hold[i] = ele.sum_hold;
      this.case_new_hold[i] = ele.case_new_hold;
      this.case_close[i] = ele.case_close;
    });

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    
    this.SpinnerService.show();

    var dataTmp =[];
    dataTmp['data'] = this.posts.data;
    dataTmp['stat_date'] = this.caseDataValue.stat_date;
    dataTmp['userToken'] = this.userData.userToken;

    if(this.resultNotice.notice_c1 || this.resultNotice.notice_c2 || this.resultNotice.notice_c3 || this.resultNotice.notice_c4 ||
      this.resultNotice.notice_catch || this.resultNotice.notice_seek){
      var tmp=[];
      tmp.push($.extend({},  this.resultNotice)) ;
      dataTmp['notice_data'] =  tmp ;
    }else{
      dataTmp['notice_data'] =[];
    }
    var data1 = $.extend({}, dataTmp);
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2300/saveDataTab1', data1).subscribe(
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
          confirmBox.setMessage('ข้อความแจ้งเตือน');
          confirmBox.setMessage(alertMessage.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              this.caseDataValue.stat_date = alertMessage.stat_date,
              this.searchData();
            }
            subscription.unsubscribe();
          });
        }
      },
      (error) => { this.SpinnerService.hide(); }
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
    //this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  CaseTypeStat() {
    //======================== pcase_type_stat ======================================
    var student = JSON.stringify({
      "table_name": "pcase_type_stat",
      "field_id": "case_type_stat",
      "field_name": "case_type_stat_desc",
      "order_by": "order_id ASC",
      "userToken": this.userData.userToken
    });
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          // console.log(getDataOptions)
          this.getCaseTypeStat = getDataOptions;
          this.numColumn = this.getCaseTypeStat.length;
          this.dtTrigger.next(null);
        },
        (error) => { }
      );
  }

  assignValue(num: any) {
    if ((num == undefined) || (num == ""))
      return 0;
    else
      return parseInt(num);
  }

  caseOld(event: any, row: any, column: any) {//คดีค้างมาจากปีก่อน, คดีค้างมาแล้วเสร็จ
    // console.log(this.posts.data[column].case_old);
    this.case_old_total[column] = 0;
    this.case_old_total[column] = this.assignValue(this.posts.data[column].case_old) - this.assignValue(this.posts.data[column].case_old_close);

    this.result.sum_case_old = 0;
    this.result.sum_case_old_close = 0;
    this.result.sum_case_old_total = 0;
    for (var i = 0; i < this.getCaseTypeStat.length; i++) {
      this.result.sum_case_old += this.assignValue(this.posts.data[i].case_old);
      this.result.sum_case_old_close += this.assignValue(this.posts.data[i].case_old_close);
      this.result.sum_case_old_total += this.assignValue(this.case_old_total[i]);
    }

    this.calHold(column);
  }

  caseNew(event: any, row: any, column: any) {//คดีรับใหม่  คดีรับใหม่แล้วเสร็จ
    this.case_new_hold[column] = 0;
    this.case_new_hold[column] = this.assignValue(this.posts.data[column].case_new) - this.assignValue(this.posts.data[column].case_new_close);

    this.result.sum_case_new = 0;
    this.result.sum_case_new_close = 0;
    this.result.sum_case_new_hold = 0;

    for (var i = 0; i < this.getCaseTypeStat.length; i++) {
      this.result.sum_case_new += this.assignValue(this.posts.data[i].case_new);
      this.result.sum_case_new_close += this.assignValue(this.posts.data[i].case_new_close);
      this.result.sum_case_new_hold += this.assignValue(this.case_new_hold[i]);
    }
    
    this.calHold(column);
  }

  calHold(column: any) {//รวมคดีเสร็จไปทั้งสิ้น

    this.case_close[column] = this.assignValue(this.posts.data[column].case_old_close) + this.assignValue(this.posts.data[column].case_new_close);
    this.result.sum_case_close = 0;
    for (var i = 0; i < this.getCaseTypeStat.length; i++) {
      this.result.sum_case_close += this.assignValue(this.case_close[i]);
    }

    this.sum_hold[column] = this.assignValue(this.case_old_total[column]) + this.assignValue(this.case_new_hold[column]);
    this.result.sum_case_hold = 0;
    for (var i = 0; i < this.getCaseTypeStat.length; i++) {
      this.result.sum_case_hold += this.assignValue(this.sum_hold[i]);
    }
  }

  calToday(event: any, row: any, column: any) {//คดีรับใหม่วันนี้ 
    this.result.sum_case_today = 0;
    this.result.sum_case_today_close = 0;
    this.result.sum_case_new_increse = 0;
    for (var i = 0; i < this.getCaseTypeStat.length; i++) {
      this.result.sum_case_today += this.assignValue(this.posts.data[i].case_today);
      this.result.sum_case_today_close += this.assignValue(this.posts.data[i].case_today_close);
      this.result.sum_case_new_increse += this.assignValue(this.posts.data[i].case_new_increse);
    }

    //**คดีรับใหม่เพิ่มขึ้น/ลดลง หมายถึง ปริมาณคดีรับใหม่เพิ่มขึ้น/ลดลง จากวันที่ผ่านมา
    if(this.caseDataValue.stat_date == ""){
      //getLastData
      var old_data = this.caseDataValue.old_data;
    }else{
      var old_data = this.posts.old_data;
    }
    console.log(old_data);
    // var tmp = this.assignValue(this.posts.data[column].case_today) - this.assignValue(this.posts.data[column].case_today_close);
    var tmp = this.assignValue(this.posts.data[column].case_today) - this.assignValue(old_data[column].case_today);
    if (tmp > 0) {
      this.posts.data[column].case_new_increse = Math.abs(tmp);
      this.posts.data[column].case_new_decrese = 0;

    } else {
      this.posts.data[column].case_new_increse = 0;
      this.posts.data[column].case_new_decrese = Math.abs(tmp);
    }

    this.result.sum_case_new_increse = 0;
    this.result.sum_case_new_decrese = 0;
    for (var i = 0; i < this.getCaseTypeStat.length; i++) {
      this.result.sum_case_new_increse += this.assignValue(this.posts.data[i].case_new_increse);//คดีรับใหม่เพิ่มขึ้น
      this.result.sum_case_new_decrese += this.assignValue(this.posts.data[i].case_new_decrese);//คดีรับใหม่ลดลง 
    }
  }

  caseConciliate(event: any, row: any, column: any) {
    this.result.sum_case_appeal = 0;
    this.result.sum_case_deega = 0;
    for (var i = 0; i < this.getCaseTypeStat.length; i++) {
      this.result.sum_case_appeal += this.assignValue(this.posts.data[i].case_appeal);
      this.result.sum_case_deega += this.assignValue(this.posts.data[i].case_deega);
    }
  }

  caseSumData(event: any, row: any, column: any){
    if(row == 'case_autospy_new'){
      this.result.sum_case_autospy_new = 0;
      for (var i = 0; i < this.getCaseTypeStat.length; i++) {
        this.result.sum_case_autospy_new += this.assignValue(this.posts.data[i].case_autospy_new);
      }
    }else if(row == 'case_autospy_finish'){
      this.result.sum_case_autospy_finish = 0;
      for (var i = 0; i < this.getCaseTypeStat.length; i++) {
        this.result.sum_case_autospy_finish += this.assignValue(this.posts.data[i].case_autospy_finish);
      }
    }else if(row == 'case_violate_new'){
      this.result.sum_case_violate_new = 0;
      for (var i = 0; i < this.getCaseTypeStat.length; i++) {
        this.result.sum_case_violate_new += this.assignValue(this.posts.data[i].case_violate_new);
      }
    }else if(row == 'case_violate_finish'){
      this.result.sum_case_violate_finish = 0;
      for (var i = 0; i < this.getCaseTypeStat.length; i++) {
        this.result.sum_case_violate_finish += this.assignValue(this.posts.data[i].case_violate_finish);
      }
    }else if(row == 'case_conciliate_today'){
      this.result.sum_case_conciliate_today = 0;
      for (var i = 0; i < this.getCaseTypeStat.length; i++) {
        this.result.sum_case_conciliate_today += this.assignValue(this.posts.data[i].case_conciliate_today);
      }
    }else if(row == 'case_conciliate_close_today'){
      this.result.sum_case_conciliate_close_today = 0;
      for (var i = 0; i < this.getCaseTypeStat.length; i++) {
        this.result.sum_case_conciliate_close_today += this.assignValue(this.posts.data[i].case_conciliate_close_today);
      }
    }else if(row == 'case_conciliate_cancel'){
      this.result.sum_case_conciliate_cancel = 0;
      for (var i = 0; i < this.getCaseTypeStat.length; i++) {
        this.result.sum_case_conciliate_cancel += this.assignValue(this.posts.data[i].case_conciliate_cancel);
      }
    }
  }

  showCaseAll(item:any){
    if(item){
      const modalRef: NgbModalRef = this.ngbModal.open(PopupStatComponent,{ windowClass: 'my-class'})
      modalRef.componentInstance.items = item
    }
  }
}
