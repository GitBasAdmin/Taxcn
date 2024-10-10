import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, ViewChildren, QueryList, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmFfnComponent } from '../../modal/modal-confirm-ffn/modal-confirm-ffn.component';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import * as $ from 'jquery';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
declare var myExtObject: any;
@Component({
  selector: 'app-ffn1600,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './ffn1600.component.html',
  styleUrls: ['./ffn1600.component.css']
})

export class Ffn1600Component implements AfterViewInit, OnInit, OnDestroy {
  sessData: any;
  userData: any;
  programName: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  dataHead: any = [];
  result: any = [];
  result3: any = [];

  receiptDetailData: any = [];
  forfeitDefObj: any = [];
  checkListObj: any = [];
  creditObj: any = [];
  check: any = [];
  credit: any = [];
  receiptDetailObj: any;
  costReceiptObj: any;
  runId: any;
  getReceive: any;
  getReceiveType: any;
  fine_type: any;
  getLitType: any;
  myExtObject: any;
  modalType: any;
  modalIndex: any;
  pRun_id: any;
  pCost_running: any;
  delIndex: any;//ตำแหน่งการลบ
  masterSelected: boolean;
  checklist: any;
  checkedList: any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldName3: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;

  public loadModalLitComponent: boolean = false;
  public loadComponent: boolean = false;
  public loadModalConfComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerRev: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('cCheck', { static: true }) cCheck: ElementRef;
  @ViewChildren('jcalendarS') jcalendarS: QueryList<ElementRef>;
  @ViewChildren('jcalendarE') jcalendarE: QueryList<ElementRef>;
  @ViewChildren('icalendar') icalendar: QueryList<ElementRef>;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true,
      retrieve: true,
    };

    this.dtOptions2 = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true,
      retrieve: true,
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      this.pRun_id = params['run_id'];
      this.pCost_running = params['cost_running'];
    });

    this.successHttp();
    this.setDefPage();

    if (this.pRun_id) {
      this.result.run_id = this.pRun_id;
      this.dataHead.run_id = this.pRun_id;
      this.pRun_id = null;
      this.searchData(1);
    }
    if (this.pCost_running) {
      this.result.cost_running = this.pCost_running;
      this.pCost_running = null;
    }

    var student = JSON.stringify({
      "table_name": "plit_type",
      "field_id": "lit_type",
      "field_name": "lit_type_desc",
      "condition": " AND (lit_type_desc NOT LIKE \'%พยาน%\' AND lit_type_desc NOT LIKE \'%ทนาย%\') ",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getLitType = getDataOptions;
      },
      (error) => { }
    )
  }

  fnDataHead(event: any) {
    console.log(event)
    this.dataHead = event;
    if (this.dataHead.buttonSearch == 1) {
      this.runId = { 'run_id': event.run_id, 'counter': Math.ceil(Math.random() * 10000), 'notSearch': 1 }
      this.result.run_id =this.dataHead.run_id
      this.setDefPage();
      this.searchData(1);
    }
  }

  setDefPage() {
    this.result = [];
    this.result.cost_payer = "";
    this.result.lit_type = 1;
    this.result.appeal_type = 1;
    this.result.other_cost1_desc = "ค่าทนายความ";
    this.result.cost_interest = this.curencyFormat(0, 2);
    this.result.cost_amount = this.curencyFormat(0, 2);
    this.result.sum_cost = this.curencyFormat(0, 2);
    this.result.court_fee =this.curencyFormat(0, 2);
    this.result.other_cost1 = this.curencyFormat(0, 2);
    this.result.other_cost2 = this.curencyFormat(0, 2);
    this.result.other_cost3 = this.curencyFormat(0, 2);
    this.result.total_cost = this.curencyFormat(0, 2);
    this.result.grand_total = this.curencyFormat(0, 2);
    this.result3.sum_rcv = this.curencyFormat(0, 2);
    this.result3.receipt_cost = this.curencyFormat(0, 2);

    this.costReceiptObj=[];
    this.receiptDetailObj=[];
    this.receiptDetailObj.push({
      'edit_item' :0, 'item' :0, 'capital_amt': '', 'start_date': '', 'end_date': '', 'interest_rate': '', 'duration': '', 'interest_amt': ''
    });
    setTimeout(() => {
      this.callCalendarSet();
    }, 500);
  }

  successHttp() {
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "ffn1600"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.disableLoading().post('/' + this.userData.appName + 'Api/API/authen', authen)
        .toPromise()
        .then(
          res => { // Success
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
            console.log(getDataAuthen)
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

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit1600 = this.masterSelected;
      this.checkValue(i);
    }
  }

  isAllSelected(i:any) {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.editSetId == true;
    })
    this.checkValue(i);
  }

  checkValue(i:any){
    if(this.checklist[i].edit1600)
      this.costReceiptObj[i].cost_amt = this.costReceiptObj[i].rcv_amt;
    else
      this.costReceiptObj[i].cost_amt = '';
    this.sumReceipt();
  }

  sumReceipt(){
    var sum=0;
    for (let i = 0; i < this.costReceiptObj.length; i++) {
      if(this.checklist[i].edit1600){
        sum+=this.costReceiptObj[i].cost_amt ? parseFloat(this.curencyFormatRemove(this.costReceiptObj[i].cost_amt)) : 0 ;
      }
    }
    this.result3.receipt_cost = this.curencyFormat(sum, 2);

    this.calSum();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit1600 = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  display(i: any) {
    this.receiptDetailObj = JSON.parse(JSON.stringify(this.receiptDetailObj));
    if(i == this.receiptDetailObj.length-1){
      this.receiptDetailObj.push({
        'edit_item' :0, 'item' :0, 'capital_amt': '', 'start_date': '', 'end_date': '', 'interest_rate': '', 'duration': '', 'interest_amt': ''
      });
      this.dtTriggerRev.next(null);
    }

    setTimeout(() => {
      this.callCalendarSet();
    }, 500);

    this.calInterest(i);
  }

  calInterest(i: any) {
    if(this.receiptDetailObj[i].capital_amt && this.receiptDetailObj[i].start_date && this.receiptDetailObj[i].end_date && this.receiptDetailObj[i].interest_rate){
      var student = JSON.stringify({
        "capital" : parseFloat(this.curencyFormatRemove(this.receiptDetailObj[i].capital_amt)),
        "sdate" : this.receiptDetailObj[i].start_date,
        "edate" : this.receiptDetailObj[i].end_date,
        "interest" : parseFloat(this.curencyFormatRemove(this.receiptDetailObj[i].interest_rate)),
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn1600/calInterest', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
            this.receiptDetailObj[i].duration = getDataOptions.duration;
            this.receiptDetailObj[i].interest_amt =  this.curencyFormat(getDataOptions.interest_amt,2);

            this.calSum();
          }
        },
        (error) => {}
      )
    }else{
      this.receiptDetailObj[i].duration = '';
      this.receiptDetailObj[i].interest_amt =  '';
    }
  }

  calCapital(i:any) {
    var sum = 0;
    this.receiptDetailObj.forEach((event: any, index: any, array: any) => {
      sum += event.capital_amt ? parseFloat(this.curencyFormatRemove(event.capital_amt)) : 0;
    });
    //เงินต้น
    this.result.cost_amount = this.curencyFormat(sum,2);

    this.calInterest(i);
    this.calSum();
  }

  calSum() {
    var sum_capital = 0;
    var sum_interest = 0;
    this.receiptDetailObj.forEach((event: any, index: any, array: any) => {
      sum_capital += event.capital_amt ? parseFloat(this.curencyFormatRemove(event.capital_amt)) : 0;
      sum_interest += event.interest_amt ? parseFloat(this.curencyFormatRemove(event.interest_amt)) : 0;
    });

    // this.result.cost_interest = sum_interest.toFixed(2);
    this.result.cost_interest = this.curencyFormat(sum_interest,2);
    //เงินต้นรวมดอกเบี้ย
    var sum_cost = 0;
    sum_cost = sum_interest + sum_capital;
    // this.result.sum_cost = sum_cost.toFixed(2);
    this.result.sum_cost = this.curencyFormat(sum_cost,2);
    

    setTimeout(() => {
      // ค่าขึ้นศาล        
      this.getFeeAmt();
      // this.getTotalCost();
    }, 500);
  }

  getFeeAmt(){
    var student = JSON.stringify({
      "deposit" : this.result.sum_cost ,
      "run_id" : this.dataHead.run_id ? this.dataHead.run_id : this.result.run_id,
      "fee_id" :  this.dataHead.fee_id ? this.dataHead.fee_id : 4,
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiCA/API/CASE/getFeeAmt', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result==1){
          this.result.court_fee = this.curencyFormat(getDataOptions.data[0].fee_amout, 2);
        }else{
          this.result.court_fee = 0;
        }
        this.getTotalCost();
      },
      (error) => {}
    )
  }

  getTotalCost() {
    // ค่าฤชาธรรมเนียมใช้แทน
    var total_cost = 0; var total_cost1 = 0;
    total_cost=(this.result.court_fee ? parseFloat(this.curencyFormatRemove(this.result.court_fee)) : 0) + (this.result3.receipt_cost ? parseFloat(this.curencyFormatRemove(this.result3.receipt_cost)) : 0 );

    if (this.result.other_cost1) {
      total_cost += this.result.other_cost1 ? parseFloat(this.curencyFormatRemove(this.result.other_cost1)) : 0;
      total_cost1 += this.result.other_cost1 ? parseFloat(this.curencyFormatRemove(this.result.other_cost1)) : 0;
    }
    if (this.result.other_cost2) {
      total_cost += this.result.other_cost2 ? parseFloat(this.curencyFormatRemove(this.result.other_cost2)) : 0;
      total_cost1 += this.result.other_cost2 ? parseFloat(this.curencyFormatRemove(this.result.other_cost2)) : 0;
    }
    if (this.result.other_cost3) {
      total_cost += this.result.other_cost3 ? parseFloat(this.curencyFormatRemove(this.result.other_cost3)) : 0;
      total_cost1 += this.result.other_cost3 ? parseFloat(this.curencyFormatRemove(this.result.other_cost3)) : 0;
    }
    if (parseFloat(this.result3.receipt_cost)>0) {
      total_cost1 += this.result3.receipt_cost ? parseFloat(this.curencyFormatRemove(this.result3.receipt_cost)) : 0;
    }

    //ค่าฤชาธรรมเนียมใช้แทน
    this.result.total_cost = this.curencyFormat(total_cost1,2);
    //ค่าขึ้นศาลรวมค่าฤชาธรรมเนียมใช้แทน
    this.result.grand_total = this.curencyFormat(total_cost,2);
  }

  searchData(type: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(type==1){
      var student = JSON.stringify({
        "run_id": this.dataHead.run_id ? this.dataHead.run_id : this.result.run_id,
        "lit_type": this.result.lit_type ? this.result.lit_type : '',
        "appeal_type": this.result.appeal_type ? this.result.appeal_type : '',
        "userToken": this.userData.userToken
      });
    }else if(type==2){
      var student = JSON.stringify({
        "cost_running": this.result.cost_running,
        "userToken": this.userData.userToken
      });
    }
    this.SpinnerService.show();
    this.http.post('/' + this.userData.appName + 'ApiFN/API/FINANCE/ffn1600/getCostData', student).subscribe((response) => {
      let getDataOptions: any = JSON.parse(JSON.stringify(response));
      console.log(getDataOptions)
      if (getDataOptions.result == 1 && getDataOptions.error=="") {
        //ชำระหนี้ตามคำพิพากษา
        if (getDataOptions.cost_detail.length != 0 ) {
          var bar = new Promise((resolve, reject) => {
            this.receiptDetailObj = getDataOptions.cost_detail;

            this.receiptDetailObj.forEach((event: any, index: any, array: any) => {
              event.capital_amt = this.curencyFormat(event.capital_amt ? event.capital_amt : 0, 2);
              event.interest_rate = this.curencyFormat(event.interest_rate ? event.interest_rate : 0, 2);
              event.interest_amt = this.curencyFormat(event.interest_amt ? event.interest_amt :  0, 2);
              
            });
            this.receiptDetailObj.push({
              'edit_item' :0, 'item' :0, 'capital_amt': '', 'start_date': '', 'end_date': '', 'interest_rate': '', 'duration': '', 'interest_amt': ''
            });
            setTimeout(() => {
              this.callCalendarSet();
            }, 500);
          });
        } else {
          this.receiptDetailObj = [];
          this.receiptDetailObj.push({
            'edit_item' :0, 'item' :0, 'capital_amt': '', 'start_date': '', 'end_date': '', 'interest_rate': '', 'duration': '', 'interest_amt': ''
          });
          setTimeout(() => {
            this.callCalendarSet();
          }, 500);
        }

        // ชำระหนี้ตามคำพิพากษา
        if (getDataOptions.data.length != 0 ) {
          this.result = getDataOptions.data[0];

          this.result.cost_interest = this.curencyFormat(this.result.cost_interest ? this.result.cost_interest : 0, 2);
          this.result.cost_amount = this.curencyFormat(this.result.cost_amount ? this.result.cost_amount : 0, 2);
          this.result.sum_cost = this.curencyFormat(this.result.sum_cost ? this.result.sum_cost : 0, 2);
          this.result.court_fee = this.curencyFormat(this.result.court_fee ? this.result.court_fee : 0, 2);
          this.result.other_cost1 = this.curencyFormat(this.result.other_cost1 ? this.result.other_cost1 : 0, 2);
          this.result.other_cost2 = this.curencyFormat(this.result.other_cost2 ? this.result.other_cost2 : 0, 2);
          this.result.other_cost3 = this.curencyFormat(this.result.other_cost3 ? this.result.other_cost3 : 0, 2);
          this.result.total_cost = this.curencyFormat(this.result.total_cost ? this.result.total_cost : 0, 2);
          this.result.grand_total = this.curencyFormat(this.result.grand_total ? this.result.grand_total : 0, 2);
        }

        //ค่าธรรมเนียม 
        if (getDataOptions.cost_receipt.length != 0 ) {
          this.result3.sum_rcv = 0;
          this.result3.receipt_cost = 0;
          var bar = new Promise((resolve, reject) => {
            this.costReceiptObj = getDataOptions.cost_receipt;
            this.checklist = getDataOptions.cost_receipt;
            if (this.costReceiptObj.length)
              this.costReceiptObj.forEach((x: any) => x.edit1600 = false);

            this.costReceiptObj.forEach((event: any, index: any, array: any) => {
              this.result3.sum_rcv += event.rcv_amt ? event.rcv_amt : 0;
              this.result3.receipt_cost += event.cost_amt ? event.cost_amt : 0;

              event.rcv_amt = this.curencyFormat(event.rcv_amt ? event.rcv_amt : 0, 2);
              event.cost_amt = this.curencyFormat(event.cost_amt ? event.cost_amt: 0, 2);
              if(event.chk)
                event.edit1600 = true;
            });

            this.result3.sum_rcv = this.curencyFormat(this.result3.sum_rcv ? this.result3.sum_rcv : 0 , 2);
            this.result3.receipt_cost = this.curencyFormat(this.result3.receipt_cost ? this.result3.receipt_cost : 0, 2);

            this.dtTrigger.next(null);
          });
        } else {
          this.costReceiptObj = [];
          this.result3=[];
          this.dtTrigger.next(null);
        }
        if (bar)
            this.SpinnerService.hide();
      }else{
        this.SpinnerService.hide();
        this.setDefPage();
      }
    },
      (error) => { }
    )
  }

  submitForm(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.dataHead.run_id){
      confirmBox.setMessage('กรุณาระบุคดี');
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

      var receipt=[];
      var costreceipt=[];
      for (let i = 0; i < this.receiptDetailObj.length-1; i++) {
        receipt[i]=this.receiptDetailObj[i];
          receipt[i].capital_amt = this.receiptDetailObj[i].capital_amt ? parseFloat(this.curencyFormatRemove(this.receiptDetailObj[i].capital_amt)) : 0;
          receipt[i].interest_rate = this.receiptDetailObj[i].interest_rate ? parseFloat(this.curencyFormatRemove(this.receiptDetailObj[i].interest_rate)) : 0;
          receipt[i].interest_amt = this.receiptDetailObj[i].interest_amt ? parseFloat(this.curencyFormatRemove(this.receiptDetailObj[i].interest_amt)) : 0;
      }

      this.costReceiptObj.forEach((event: any, index: any, array: any) => {
        costreceipt[index]=event;
        costreceipt[index].rcv_amt = event.rcv_amt ? parseFloat(this.curencyFormatRemove(event.rcv_amt)) : 0;
        costreceipt[index].cost_amt = event.cost_amt ? parseFloat(this.curencyFormatRemove(event.cost_amt)) : 0;
        if(event.edit1600)
          costreceipt[index].chk =1;
        else
          costreceipt[index].chk =0;
      });

      this.result.total_cost=parseFloat(this.curencyFormatRemove(this.result.total_cost));
      this.result.cost_interest=parseFloat(this.curencyFormatRemove(this.result.cost_interest));
      this.result.sum_cost=parseFloat(this.curencyFormatRemove(this.result.sum_cost));
      this.result.other_cost2=parseFloat(this.curencyFormatRemove(this.result.other_cost2));
      this.result.other_cost3=parseFloat(this.curencyFormatRemove(this.result.other_cost3));
      this.result.other_cost1=parseFloat(this.curencyFormatRemove(this.result.other_cost1));
      this.result.grand_total=parseFloat(this.curencyFormatRemove(this.result.grand_total));
      this.result.pay_amt=parseFloat(this.curencyFormatRemove(this.result.pay_amt));
      this.result.cost_amount=parseFloat(this.curencyFormatRemove(this.result.cost_amount));
      this.result.court_fee=parseFloat(this.curencyFormatRemove(this.result.court_fee));
      this.result.run_id=this.dataHead.run_id;

      var  data=[($.extend({}, this.result))];
      var student = JSON.stringify({
        "data" : data,
        "cost_detail" : receipt,//ชำระหนี้ตามคำพิพากษา
        "cost_receipt" : costreceipt,//ค่าธรรมเนียม
        "userToken" : this.userData.userToken
     });
     
      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn1600/saveData', student).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          console.log(alertMessage)
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
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){

                this.result.cost_running = alertMessage.cost_running;
                this.searchData(2);
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
    });
    this.dtTrigger.next(null);
    this.dtTriggerRev.next(null);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtTriggerRev.next(null);
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerRev.unsubscribe();
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  directiveDateSObj(index: any, obj: any) {
    this.receiptDetailObj[index][obj] = this.jcalendarS.get(index).nativeElement.value;
    //ดอกเบี้ยที่คำนวณได้
    this.calInterest(index);
  }

  directiveDateEObj(index: any, obj: any) {
    this.receiptDetailObj[index][obj] = this.jcalendarE.get(index).nativeElement.value;
    //ดอกเบี้ยที่คำนวณได้
    this.calInterest(index);
  }

  callCalendarSet() {
    myExtObject.callCalendar();
  }

  curencyFormat(n: any, d: any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  curencyFormatRemove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, "");
    } else {
      return '';
    }
  }

  receiveFuncListData(event: any) {
    var tmp = "";
    if (this.result.lit_type)
      tmp = this.getLitType.find((x: any) => x.fieldIdValue === parseInt(this.result.lit_type)).fieldNameValue;
    this.result.cost_payer = event.fieldNameValue + "ชำระค่าฤชาธรรมเนียมใช้แทน" + tmp;
    this.closebutton.nativeElement.click();
  }

  closeModal() {
    this.loadComponent = false;
    this.loadModalConfComponent = false;
  }

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent() {
    if (this.modalType == 1) {
      $("#exampleModal").find(".modal-content").css("width", "750px");
      var student = JSON.stringify({
        "table_name": "plit_type",
        "field_id": "lit_type",
        "field_name": "lit_type_desc",
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          this.list = response;
          this.loadComponent = true;
          this.loadModalConfComponent = false;
        },
        (error) => { }
      )
    } else {
      this.loadComponent = false;
      this.loadModalConfComponent = true;
    }
  }

  clickOpenMyModalComponentIndex(type: any, index: any) {
    this.modalType = type;
    this.modalIndex = index;
    this.openbutton.nativeElement.click();
  }

  submitConfirmForm() {
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
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });

    } else if (!chkForm.log_remark) {
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
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
      var student = JSON.stringify({
        "password": chkForm.password,
        "log_remark": chkForm.log_remark,
        "userToken": this.userData.userToken
      });

      this.http.post('/' + this.userData.appName + 'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson: any = JSON.parse(JSON.stringify(posts));
          if (productsJson.result == 1) {

            const confirmBox2 = new ConfirmBoxInitializer();
            confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox2.setMessage('ยืนยันการลบข้อมูล');
            confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
            // Choose layout color type
            confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox2.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                subscription.unsubscribe();
                
                var delData = JSON.stringify({
                  "cost_running" : this.result.cost_running,
                  "userToken" : this.userData.userToken
                });
                this.http.post('/' + this.userData.appName + 'ApiFN/API/FINANCE/ffn1600/deleteData', delData).subscribe(
                  (response) => {
                    let alertMessage: any = JSON.parse(JSON.stringify(response));
                    console.log(alertMessage)
                    if (alertMessage.result == 0) {
                      const confirmBox3 = new ConfirmBoxInitializer();
                      confirmBox3.setTitle('ข้อความแจ้งเตือน');
                      confirmBox3.setMessage(alertMessage.error);
                      confirmBox3.setButtonLabels('ตกลง');
                      confirmBox3.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription3 = confirmBox.openConfirmBox$().subscribe(resp => {
                        if (resp.success == true) {
                          this.closebutton.nativeElement.click();
                        }
                        subscription3.unsubscribe();
                      });
                    } else {
                      this.closebutton.nativeElement.click();
                      this.setDefPage();
                      this.searchData(1);
                    }
                  },
                  (error) => { }
                )
              }
            });
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

  deleteData() {
    this.clickOpenMyModalComponent(2);
  }

  printReport() {
    var rptName = 'rfn6500';
    var paramData = '{}';
    var paramData = JSON.stringify({
      "prun_id": this.result.run_id ? this.result.run_id : 0,
      "pappeal_type": this.result.appeal_type ? this.result.appeal_type : 0
    });
    console.log(paramData)
    this.printReportService.printReport(rptName, paramData);
  }

  cancleData() {
    window.location.reload();
  }
}