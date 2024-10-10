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
  selector: 'app-fst2300-tab2',
  templateUrl: './fst2300-tab2.component.html',
  styleUrls: ['./fst2300-tab2.component.css']
})
export class Fst2300Tab2Component implements OnInit {
  sessData:any;
  userData:any;
  parm: any = [];
  numColumn: any;
  data: any = [];
  result: any = [];
  totle: any = [];
  posts: any = [];
  getCaseTypeStat:any;
  getHoldStat:any =[];
  case_hold:any=[];
  sum_case_hold:any=[];
  caseDataValue:any;


  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @Output() eventUpdate = new EventEmitter<{data:any,counter:any}>(); 
  @Input() set caseData(caseData: any) {
    // console.log('Fst2300Tab2=>',caseData)
    if (caseData) {
      this.caseDataValue = [];
      this.caseDataValue = caseData.sendData
      if ((this.caseDataValue.tab_index == 1) && (this.caseDataValue.search_data == 1)){
        this.searchData();
      }

      if ((this.caseDataValue.tab_index == 1) && (this.caseDataValue.process_data == 1)){
        this.processData();
      }
        
      if ((this.caseDataValue.tab_index == 1) && (this.caseDataValue.submit_data == 1)){
        this.submitForm();
      }
    }
  }
  @Output() sendDdata = new EventEmitter<any>();
  constructor(
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
    private http: HttpClient,
    private ngbModal: NgbModal
  ) { }

  ngOnInit(): void {
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.CaseTypeStat();
    this.setDefForm();
    this.getData();

  }

  setDefForm(){
    this.posts = [];
    this.sum_case_hold = [];

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

  CaseTypeStat(){
    //======================== pcase_type_stat ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type_stat",
      "field_id" : "case_type_stat",
      "field_name" : "case_type_stat_desc",
      "order_by" : "order_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        // console.log(getDataOptions)
        this.getCaseTypeStat = getDataOptions;
        this.numColumn = this.getCaseTypeStat.length;
        this.CaseHoldStat();
      },
      (error) => {}
    );
  }

  CaseHoldStat(){
    var student = JSON.stringify({
      "table_name" : "phold_reason",
      "field_id" : "hold_id",
      "field_name" : "hold_name",
      "order_by" : "order_by ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        // console.log(getDataOptions)
        this.getHoldStat = getDataOptions;
        this.dtTrigger.next(null);
      },
      (error) => {}
    );
  }

  caseHold(event:any,i:any,j:any){
    this.sum_case_hold[j] = 0;
    for (let index = 0; index < this.posts.data.length; index++) {
      this.sum_case_hold[j] +=  this.assignValue(this.posts.data[index].stat_data[j].case_hold); 
    }
  }

  assignValue(num:any){
    if((num == undefined) || (num == ""))
      return 0;
    else
      return parseInt(num);
  }

  assingData(alertMessage :any){
    this.setDefForm();

    if(alertMessage.stat_date){
      var data = alertMessage;
      this.eventUpdate.emit({data,counter:Math.ceil(Math.random()*10000)});
    }

    this.posts=alertMessage;
    this.data=alertMessage.data;

    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].stat_data.length; j++) {
        this.sum_case_hold[j] = this.assignValue(this.sum_case_hold[j]) + this.assignValue(this.data[i].stat_data[j].case_hold); 
      }
    }

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  getData() {
    this.SpinnerService.show();
    var student = JSON.stringify({
      "stat_date": '',
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2300/getDataTab2', student).subscribe(
      (response) => {
        let alertMessage: any = JSON.parse(JSON.stringify(response));
        if (alertMessage.result == 1) {
          this.assingData(alertMessage);
          // this.SpinnerService.hide() ปิดที่ assingData
          this.SpinnerService.hide();
        }
      },
      (error) => { this.SpinnerService.hide(); }
    )
  }

  processData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    
    this.SpinnerService.show();
    var student = JSON.stringify({
      "stat_date": this.caseDataValue.stat_date,
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiST/API/STAT/fst2300/getStatDataTab2', student).subscribe(
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

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    var student = JSON.stringify({
      "stat_date": this.caseDataValue.stat_date,
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiST/API/STAT/fst2300/getDataTab2', student).subscribe(
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
    dataTmp['stat_date'] = this.caseDataValue.stat_date;
    dataTmp['userToken'] = this.userData.userToken;
    var data = $.extend({}, dataTmp);
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiST/API/STAT/fst2300/saveDataTab2', data).subscribe(
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

  showCaseAll(item:any){
    if(item){
      const modalRef: NgbModalRef = this.ngbModal.open(PopupStatComponent,{ windowClass: 'my-class'})
      modalRef.componentInstance.items = item
    }
  }
}
