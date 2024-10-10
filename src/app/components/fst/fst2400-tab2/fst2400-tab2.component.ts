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
  selector: 'app-fst2400-tab2',
  templateUrl: './fst2400-tab2.component.html',
  styleUrls: ['./fst2400-tab2.component.css']
})
export class Fst2400Tab2Component implements OnInit {
  posts: any = [];
  sessData:any;
  userData:any;
  getCaseTypeStat:any;
  caseDataValue:any;
  numColumn:any;

  sum7 :any = [];
  sum9 :any = [];
  sum10:any = [];

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

    this.setDefForm();//--set default
    this.getData();
  }

  setDefForm() {
    this.posts=[];
    this.sum7=[];
    this.sum9=[];
    this.sum10=[];
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
      "condition" : "AND case_type='2'",
      "order_by" : " case_type_stat ASC ",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseType")
    this.getCaseTypeStat = [];
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseTypeStat = getDataOptions;
          this.numColumn = this.getCaseTypeStat.length;
        },
        (error) => {}
      );
  }

  caseOld(event: any, row: any, column: any){

  }

  calCase9(event: any, row: any, column: any){
    this.sum9[column] = 0;
    this.sum9[9] = 0;
    this.posts.data9.forEach((ele, i, array) => {
      this.posts.data9[i].sum = this.assignValue(ele.nover1m) + this.assignValue(ele.over1m_nover3m) + this.assignValue(ele.over3m_nover6m) + 
      this.assignValue(ele.over6m_nover1y)+ this.assignValue(ele.over1y_nover2y)+ this.assignValue(ele.over2y_nover3y)+ 
      this.assignValue(ele.over3y_nover4y)+ this.assignValue(ele.over4y_nover5y)+ this.assignValue(ele.morethan5y);
      this.sum9[column] += this.assignValue(ele[row]);
      this.sum9[9] += this.posts.data9[i].sum;
    });
  }

  caseHold(event:any,i:any,j:any){
    this.sum10[j] = 0;
    for (let index = 0; index < this.posts.data10.length; index++) {
      this.sum10[j] +=  this.assignValue(this.posts.data10[index].stat_data[j].case_hold); 
    }
  }

  assingData(productsJson :any){
    this.setDefForm();
    this.posts = productsJson;

    var data = productsJson;
    this.eventUpdate.emit({data,counter:Math.ceil(Math.random()*10000)});

    // data7
    this.posts.data7.forEach((ele, i, array) => {
      this.sum7[i] = this.assignValue(this.sum7[i]) + 
      this.assignValue(ele.case_new1) + this.assignValue(ele.case_new2) + this.assignValue(ele.case_new3) +
      this.assignValue(ele.case_new4) + this.assignValue(ele.case_new5) + this.assignValue(ele.case_new6) + 
      this.assignValue(ele.case_new7) + this.assignValue(ele.case_new8) ;
    });

    // data9
    this.posts.data9.forEach((ele, i, array) => {
      this.posts.data9[i].sum = this.assignValue(ele.nover1m) + this.assignValue(ele.over1m_nover3m) + this.assignValue(ele.over3m_nover6m) +
                                this.assignValue(ele.over6m_nover1y) + this.assignValue(ele.over1y_nover2y) + this.assignValue(ele.over2y_nover3y) +
                                this.assignValue(ele.over3y_nover4y) + this.assignValue(ele.over4y_nover5y) + this.assignValue(ele.morethan5y);

      this.sum9[0] = this.assignValue(this.sum9[0]) + this.assignValue(ele.nover1m);
      this.sum9[1] = this.assignValue(this.sum9[1]) + this.assignValue(ele.over1m_nover3m);
      this.sum9[2] = this.assignValue(this.sum9[2]) + this.assignValue(ele.over3m_nover6m);
      this.sum9[3] = this.assignValue(this.sum9[3]) + this.assignValue(ele.over6m_nover1y);
      this.sum9[4] = this.assignValue(this.sum9[4]) + this.assignValue(ele.over1y_nover2y);
      this.sum9[5] = this.assignValue(this.sum9[5]) + this.assignValue(ele.over2y_nover3y);
      this.sum9[6] = this.assignValue(this.sum9[6]) + this.assignValue(ele.over3y_nover4y);
      this.sum9[7] = this.assignValue(this.sum9[7]) + this.assignValue(ele.over4y_nover5y);
      this.sum9[8] = this.assignValue(this.sum9[8]) + this.assignValue(ele.morethan5y);
      this.sum9[9] = this.assignValue(this.sum9[9]) + this.assignValue(ele.sum);
    });

    // data10
    this.posts.data10.forEach((ele, i, array) => {
      ele.stat_data.forEach((ele1, j, array) => {
        this.sum10[j] = this.assignValue(this.sum10[j]) + this.assignValue(ele1.case_hold);
      });
    });

    setTimeout(() => {
      this.SpinnerService.hide();
      
    }, 500);
  }

  getData() {
    this.SpinnerService.show();
    var student = JSON.stringify({
      "stat_mon": 0,
      "stat_year": 0,
      "case_type": 2,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2400/getDataTab2', student).subscribe(
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
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2400/getDataTab2', student).subscribe(
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
    this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2400/getStatDataTab2', student).subscribe(
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
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiST/API/STAT/fst2400/saveDataTab2', data).subscribe(
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
