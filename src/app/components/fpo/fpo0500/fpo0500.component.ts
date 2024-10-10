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
  selector: 'app-fpo0500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fpo0500.component.html',
  styleUrls: ['./fpo0500.component.css']
})


export class Fpo0500Component implements AfterViewInit, OnInit, OnDestroy {
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
  arr: any = [];
  total: any;

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

    this.arr = {
      1: 'พนักงานอัยการ',
      2: 'พนักงานสอบสวน',
      3: 'ผู้กำกับ'
    };
    
    this.total = 0;
    this.searchData();
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


  searchData() {
    // if(!this.result.title){
    //   const confirmBox = new ConfirmBoxInitializer();
    //   confirmBox.setTitle('ข้อความแจ้งเตือน');
    //   confirmBox.setMessage('ป้อนเงื่อนไขเพื่อค้นหา');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //     layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success == true) { this.SpinnerService.hide(); }
    //     subscription.unsubscribe();
    //   });
    // } else {
      var jsonTmp = $.extend({}, this.result);
      jsonTmp['userToken'] = this.userData.userToken;

      var student = jsonTmp;
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiPO/API/POST/fpo0500', student).subscribe({
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
        },     // nextHandler
      });
    // }
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  goToPage(run_id: any) {

    let winURL = window.location.href;

    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + this.toPage + '?run_id=' + run_id;

    window.open(winURL, '_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
  }

  openNewTab(run_id: any) {
    let winURL = window.location.href;

    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + this.toPage + '?run_id=' + run_id;

    window.open(winURL, '_blank');
  }

}