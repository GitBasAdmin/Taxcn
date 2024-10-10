import { Component, OnInit , ViewChild ,ViewEncapsulation, ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2,Input,Output,EventEmitter   } from '@angular/core';
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
  selector: 'app-fst2400-tab1',
  templateUrl: './fst2400-tab1.component.html',
  styleUrls: ['./fst2400-tab1.component.css']
})
export class Fst2400Tab1Component implements OnInit {

  sessData: any;
  userData: any;
  getCaseTypeStat: any;
  parm: any = [];
  numColumn: any;
  data: any = [];
  result: any = [];
  totle: any = [];
  posts: any = [];
  caseDataValue: any;
 
  sum1: any = [];
  sum2: any = [];
  sum3: any = [];
  sum4: any = [];
  sum5: any = [];
  sum6_1: any = [];
  sum6_2: any = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @Output() eventUpdate = new EventEmitter<{data:any,counter:any}>();
  @Input() set caseData(caseData: any) {
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
    
    this.posts=[]; this.result=[];
    this.sum1 =[];
    this.sum2 = [];
    this.sum3 = [];
    this.sum4 = [];
    this.sum5 = [];
    this.sum6_1 = [];
    this.sum6_2 = [];
  }

  CaseTypeStat(){
    var student = JSON.stringify({
      "table_name" : "pcase_type_stat",
      "field_id" : "case_type_stat",
      "field_name" : "case_type_stat_desc",
      "condition" : "AND case_type='2'",
      "order_by" : " case_type_stat ASC ",
      "userToken" : this.userData.userToken
    });

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseTypeStat = getDataOptions;
          this.numColumn = this.getCaseTypeStat.length;
        },
        (error) => {}
      );
  }

  calCase1(event: any, row: any, column: any){
    this.sum1[3] = 0;
    this.sum1[column] = 0;
    this.posts.data1.forEach((ele, i, array) => {
      this.posts.data1[i].case_hold = this.assignValue(ele.case_old) + this.assignValue(ele.case_new) -this.assignValue(ele.case_finish);

      this.sum1[column] += this.assignValue(ele[row]);
      this.sum1[3] += this.posts.data1[i].case_hold;
    });
  }

  calCase2(event: any, row: any, column: any){
    this.sum2[3] = 0;
    this.sum2[column] = 0;
    this.posts.data2.forEach((ele, i, array) => {
      this.posts.data2[i].case_month_hold = this.assignValue(ele.case_old) + this.assignValue(ele.case_new) -this.assignValue(ele.case_finish);

      this.sum2[column] += this.assignValue(ele[row]);
      this.sum2[3] += this.posts.data2[i].case_month_hold;
    });
  }

  calCase3(event: any, row: any, column: any){
    this.sum3[column] = 0;
    this.posts.data3.forEach((ele, i, array) => {
      this.sum3[column] += this.assignValue(ele[row]);
    });
  }

  calCase4(event: any, row: any, column: any){
    this.sum4[column] = 0;
    this.sum4[4] = 0;
    this.posts.data4.forEach((ele, i, array) => {

      this.posts.data4[i].case_hold_send_month = this.assignValue(ele.case_hold_app) + this.assignValue(ele.case_new_app) - this.assignValue(ele.case_hold_send_app) - this.assignValue(ele.case_send_app);
      this.sum4[column] += this.assignValue(ele[row]);
      this.sum4[4] += this.posts.data4[i].case_hold_send_month;
    });
  }

  calCase5(event: any, row: any, column: any){
    this.sum5[column] = 0;
    this.sum5[6] = 0;
    this.posts.data4.forEach((ele, i, array) => {
      // this.posts.data4[i].case_hold_send_dika_month = this.assignValue(ele.case_hold_dika) + this.assignValue(ele.case_new_dika) - this.assignValue(ele.case_hold_send_dika) - this.assignValue(ele.case_send_dika);
      this.posts.data4[i].case_hold_send_dika_month = this.assignValue(ele.case_hold_dika) + this.assignValue(ele.case_new_dika) - this.assignValue(ele.case_send_dika);
      this.sum5[column] += this.assignValue(ele[row]);
      this.sum5[6] +=  this.posts.data4[i].case_hold_send_dika_month;
    });
  }

  calCase6_1(event: any, row: any, column: any){
    this.sum6_1[column] = this.assignValue(this.posts.data6[column].case_new1) + this.assignValue(this.posts.data6[column].case_new2) + this.assignValue(this.posts.data6[column].case_new3) +
                          this.assignValue(this.posts.data6[column].case_new4) + this.assignValue(this.posts.data6[column].case_new5) + this.assignValue(this.posts.data6[column].case_new6) + 
                          this.assignValue(this.posts.data6[column].case_new7) + this.assignValue(this.posts.data6[column].case_new8) ;

  }

  calCase6_2(event: any, row: any, column: any){
    this.sum6_2[column] = this.assignValue(this.posts.data6[column].case_finish1) + this.assignValue(this.posts.data6[column].case_finish2) + this.assignValue(this.posts.data6[column].case_finish3) +
                          this.assignValue(this.posts.data6[column].case_finish4) + this.assignValue(this.posts.data6[column].case_finish5) + this.assignValue(this.posts.data6[column].case_finish6) + 
                          this.assignValue(this.posts.data6[column].case_finish7) + this.assignValue(this.posts.data6[column].case_finish8) ;
  }

  assingData(productsJson :any){
    this.setDefForm();
    this.posts = productsJson;

    if(productsJson.stat_year > 0){
      var data = productsJson;
      this.eventUpdate.emit({data,counter:Math.ceil(Math.random()*10000)});
    }
    

    // data1
    this.posts.data1.forEach((ele, i, array) => {
      this.posts.data1[i].case_hold = this.assignValue(ele.case_old) + this.assignValue(ele.case_new) -this.assignValue(ele.case_finish);

      this.sum1[0] = this.assignValue(this.sum1[0]) + this.assignValue(ele.case_old);
      this.sum1[1] = this.assignValue(this.sum1[1]) + this.assignValue(ele.case_new);
      this.sum1[2] = this.assignValue(this.sum1[2]) + this.assignValue(ele.case_finish);
      this.sum1[3] = this.assignValue(this.sum1[3]) + this.assignValue(ele.case_hold);
    });

    // data2
    this.posts.data2.forEach((ele, i, array) => {
      this.posts.data2[i].case_month_hold = this.assignValue(ele.case_old) + this.assignValue(ele.case_new) - this.assignValue(ele.case_finish);

      this.sum2[0] = this.assignValue(this.sum2[0]) + this.assignValue(ele.case_old);
      this.sum2[1] = this.assignValue(this.sum2[1]) + this.assignValue(ele.case_new);
      this.sum2[2] = this.assignValue(this.sum2[2]) + this.assignValue(ele.case_finish);
      this.sum2[3] = this.assignValue(this.sum2[3]) + this.assignValue(ele.case_month_hold);
    });

    // data3
    this.posts.data3.forEach((ele, i, array) => {
      this.sum3[0] = this.assignValue(this.sum3[0]) + this.assignValue(ele.nover1m);
      this.sum3[1] = this.assignValue(this.sum3[1]) + this.assignValue(ele.over1m_nover3m);
      this.sum3[2] = this.assignValue(this.sum3[2]) + this.assignValue(ele.over3m_nover6m);
      this.sum3[3] = this.assignValue(this.sum3[3]) + this.assignValue(ele.over6m_nover1y);
      this.sum3[4] = this.assignValue(this.sum3[4]) + this.assignValue(ele.over1y_nover2y);
      this.sum3[5] = this.assignValue(this.sum3[5]) + this.assignValue(ele.over2y_nover3y);
      this.sum3[6] = this.assignValue(this.sum3[6]) + this.assignValue(ele.over3y_nover4y);
      this.sum3[7] = this.assignValue(this.sum3[7]) + this.assignValue(ele.over4y_nover5y);
      this.sum3[8] = this.assignValue(this.sum3[8]) + this.assignValue(ele.morethan5y);
    });

    // data4   data5
    this.posts.data4.forEach((ele, i, array) => {
      this.posts.data4[i].case_hold_send_month = this.assignValue(ele.case_hold_app) + this.assignValue(ele.case_new_app) - this.assignValue(ele.case_hold_send_app) - this.assignValue(ele.case_send_app);

      this.sum4[0] = this.assignValue(this.sum4[0]) + this.assignValue(ele.case_hold_app);
      this.sum4[1] = this.assignValue(this.sum4[1]) + this.assignValue(ele.case_new_app);
      this.sum4[2] = this.assignValue(this.sum4[2]) + this.assignValue(ele.case_hold_send_app);
      this.sum4[3] = this.assignValue(this.sum4[3]) + this.assignValue(ele.case_send_app);
      this.sum4[4] = this.assignValue(this.sum4[4]) + this.assignValue(ele.case_hold_send_month);

      // this.posts.data4[i].case_hold_send_dika_month = this.assignValue(ele.case_hold_dika) + this.assignValue(ele.case_new_dika) - this.assignValue(ele.case_hold_send_dika) - this.assignValue(ele.case_send_dika);

      this.sum5[0] = this.assignValue(this.sum5[0]) + this.assignValue(ele.case_hold_dika);
      this.sum5[1] = this.assignValue(this.sum5[1]) + this.assignValue(ele.case_new_dika);
      this.sum5[2] = this.assignValue(this.sum5[2]) + this.assignValue(ele.case_send_dika);
      this.sum5[3] = this.assignValue(this.sum5[3]) + this.assignValue(ele.case_dika_permit);
      this.sum5[4] = this.assignValue(this.sum5[4]) + this.assignValue(ele.case_dika_npermit);
      this.sum5[5] = this.assignValue(this.sum5[5]) + this.assignValue(ele.case_dika);
      this.sum5[6] = this.assignValue(this.sum5[6]) + this.assignValue(ele.case_hold_send_dika_month);
    });

    // data6
    this.posts.data6.forEach((ele, i, array) => {

      this.sum6_1[i] = this.assignValue(this.sum6_1[i]) + 
                        this.assignValue(ele.case_new1) + this.assignValue(ele.case_new2) + this.assignValue(ele.case_new3) +
                        this.assignValue(ele.case_new4) + this.assignValue(ele.case_new5) + this.assignValue(ele.case_new6) + 
                        this.assignValue(ele.case_new7) + this.assignValue(ele.case_new8) ;

      this.sum6_2[i] = this.assignValue(this.sum6_2[i]) + 
                        this.assignValue(ele.case_finish1) + this.assignValue(ele.case_finish2) + this.assignValue(ele.case_finish3) +
                        this.assignValue(ele.case_finish4) + this.assignValue(ele.case_finish5) + this.assignValue(ele.case_finish6) + 
                        this.assignValue(ele.case_finish7) + this.assignValue(ele.case_finish8) ;

    });

    setTimeout(() => {
      this.SpinnerService.hide();
      
    }, 500);
  }

  processData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    var student = JSON.stringify({
      "stat_mon": this.caseDataValue.stat_mon,
      "stat_year": this.caseDataValue.stat_year,
      "case_type": 2,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2400/getStatDataTab1', student).subscribe(
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
      "stat_mon": 0,
      "stat_year": 0,
      "case_type": 2,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2400/getDataTab1', student).subscribe(
      (response) => {
        let alertMessage: any = JSON.parse(JSON.stringify(response));
        if (alertMessage.result == 1) {
          this.assingData(alertMessage);
          this.dtTrigger.next(null);
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
      "stat_mon": this.caseDataValue.stat_mon,
      "stat_year": this.caseDataValue.stat_year,
      "case_type": 2,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2400/getDataTab1', student).subscribe(
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

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    var dataTmp = this.posts;
    dataTmp['stat_mon'] = this.caseDataValue.stat_mon;
    dataTmp['stat_year'] = this.caseDataValue.stat_year;
    dataTmp['case_type'] = 2
    dataTmp['userToken'] = this.userData.userToken;
    var data = $.extend({}, dataTmp);
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2400/saveDataTab1', data).subscribe(
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
          confirmBox.setMessage('ข้อความแจ้งเตือน');
          confirmBox.setMessage(alertMessage.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              this.caseDataValue.stat_mon = alertMessage.stat_mon,
              this.caseDataValue.stat_year = alertMessage.stat_year,
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

  assignValue(num: any) {
    if ((num == undefined) || (num == ""))
      return 0;
    else
      return parseInt(num);
  }

  showCaseAll(item:any){
    if(item){
      const modalRef: NgbModalRef = this.ngbModal.open(PopupStatComponent,{ windowClass: 'my-class'})
      modalRef.componentInstance.items = item
    }
  }
}
