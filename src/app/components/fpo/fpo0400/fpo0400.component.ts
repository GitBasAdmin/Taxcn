import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PrintReportService } from 'src/app/services/print-report.service';

// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';

declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fpo0400,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fpo0400.component.html',
  styleUrls: ['./fpo0400.component.css']
})


export class Fpo0400Component implements AfterViewInit, OnInit, OnDestroy {
  sessData: any;
  userData: any;
  programName: any;
  asyncObservable: Observable<string>;
  result: any = [];
  tmpResult: any = [];
  dataSearch: any = [];
  myExtObject: any;
  judge_id: any;
  toPage: any = 'fpo0100';

  getTitle: any;
  getReqType: any;
  getPcrown: any;
  getPolice: any;
  arr: any = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private authService: AuthService,
    private ngbModal: NgbModal,
    private printReportService: PrintReportService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      destroy: true,
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    //======================== ptitle ======================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND special_case IN (1,2,6)",
      "order_by": " order_id ASC",
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getTitle = getDataOptions;
      },     // nextHandler
    });

    //======================== pcrown ======================================
    var student = JSON.stringify({
      "table_name": "pcrown",
      "field_id": "crown_id",
      "field_name": "crown_desc",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getPcrown = getDataOptions;
      },     // nextHandler
    });
    //======================== ppolice ======================================
    var student = JSON.stringify({
      "table_name": "ppolice",
      "field_id": "police_id",
      "field_name": "police_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getPolice = getDataOptions;
      },     // nextHandler
    });

    this.getReqType = [{ fieldIdValue: 0, fieldNameValue: 'ไม่เลือก' }, { fieldIdValue: 1, fieldNameValue: 'พนักงานอัยการ' }, { fieldIdValue: 2, fieldNameValue: 'พนักงานสอบสวน' }, { fieldIdValue: 3, fieldNameValue: 'ผู้กำกับ' }];
    this.arr = {
      1: 'พนักงานอัยการ',
      2: 'พนักงานสอบสวน',
      3: 'ผู้กำกับ'
    };
    
    this.result.req_type = 0;
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

  ngAfterContentInit(): void {
    myExtObject.callCalendar();
  }

  openDatalistReturn(){
    if(!this.result.req_type){
      this.alertMessageWARNING('กรุณาเลือกประเภทข้อมูลผู้ร้อง');
    }else{
      const modalRef = this.ngbModal.open(DatalistReturnComponent)
      if(this.result.req_type==1){
        modalRef.componentInstance.items = this.getPcrown
        modalRef.componentInstance.value1 = "pcrown"
        modalRef.componentInstance.value2 = "crown_id"
        modalRef.componentInstance.value3 = "crown_desc"
      }else  if(this.result.req_type==2 || this.result.req_type==3){
        modalRef.componentInstance.items = this.getPolice
        modalRef.componentInstance.value1 = "ppolice"
        modalRef.componentInstance.value2 = "police_id"
        modalRef.componentInstance.value3 = "police_name"
      }
     
      modalRef.componentInstance.types = 1
      modalRef.result.then((item: any) => {
        if(item){
            this.result.req_id = this.result.imprison_id = item.fieldIdValue;
            this.result.req_name = this.result.imprison_name = item.fieldNameValue;
        }
      })
    }
  }
  
  alertMessageWARNING(message: string) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage(message);
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

  tabChangeSelect(objId:any,objName:any,event:any){
      if(this.result.req_type==1){
        var val = this.getPcrown.filter((x:any) => x.fieldIdValue === event.target.value) ;
      }else{
        var val = this.getPolice.filter((x:any) => x.fieldIdValue === event);
      }
      if(val.length!=0){
        this.result[objId] = val[0].fieldIdValue;
        this.result[objName] = val[0].fieldNameValue;
      }else{
        this.result[objId] = null;
        this.result[objName] = null;
      }
    
  }

  searchData() {
    if((this.result.req_type=='0')&&
      (!this.result.title)&&(!this.result.id)&&(!this.result.yy)&&
      (!this.result.post_start1)&&(!this.result.post_start2)&&
      (!this.result.case_date1)&&(!this.result.case_date2)&&
      (!this.result.post_end)&&(!this.result.next_post_date)
    ){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ป้อนเงื่อนไขเพื่อค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { this.SpinnerService.hide(); }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();
      var jsonTmp = $.extend({}, this.result);
      jsonTmp['userToken'] = this.userData.userToken;

      // ลบฟิลด์ที่มีค่าว่างออก
      for (var key in jsonTmp) {
        if (jsonTmp[key] === "") {
            delete jsonTmp[key];
        }
      }

      var student = jsonTmp;
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiPO/API/POST/fpo0400', student).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let productsJson: any = JSON.parse(JSON.stringify(v));
          if (productsJson.result == 1) {
            console.log(this.dataSearch);
            this.dataSearch = productsJson.data;
            this.rerender();
          } else {
            this.dataSearch = [];
            this.rerender();
          }
          this.SpinnerService.hide();
        },     // nextHandler
      });
    }
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  printRpt() {
    var rptName = 'rfpo0400';

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

  goToPage(run_id: any) {

    let winURL = window.location.href;

    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + this.toPage + '?run_id=' + run_id;

    window.open(winURL, '_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
  }

}