import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

import {ActivatedRoute} from '@angular/router';
import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmFfnComponent } from '../../modal/modal-confirm-ffn/modal-confirm-ffn.component';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import * as $ from 'jquery';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
declare var myExtObject: any;
@Component({
  selector: 'app-ffn0400,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './ffn0400.component.html',
  styleUrls: ['./ffn0400.component.css']
})


export class Ffn0400Component implements AfterViewInit, OnInit, OnDestroy {

  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  dataHead:any = [];
  result:any = [];
  receiptDetailData:any = [];
  forfeitDefObj:any = [];
  checkListObj:any = [];
  creditObj:any = [];
  check:any = [];
  credit:any = [];
  receiptDetailObj:any ;
  runId:any;
  getReceive:any;
  getReceiveType:any;
  fine_type:any;
  getLitType:any;
  myExtObject: any;
  modalType:any;
  modalIndex:any;
  sum_fee1:any;
  sum_pay1:any;
  payment_ratio:any;
  fine_per_day:any;
  sum_fee:any;
  sum_cash:any;
  sum_check:any;
  sum_credit:any;
  getCard:any;
  getYears:any;
  editReceipt:any = 0;//คลิกแก้ไข
  loginEdit:any = 0;//login เพื่อแก้ไข
  pRun_id:any;
  pReceipt_running:any;
  //delType:any;//ประเภทการลบ
  delIndex:any;//ตำแหน่งการลบ
  visibleCheck: boolean = true;
  visibleCredit: boolean = true;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldName3:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  public loadModalLitComponent: boolean = false;
  public loadComponent: boolean = false;
  public loadModalGuarComponent: boolean = false;
  public loadModalConfirmFfnComponent: boolean = false;
  public loadModalConfComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerRev: Subject<any> = new Subject<any>();
  dtTriggerFof: Subject<any> = new Subject<any>();
  dtTriggerData: Subject<any> = new Subject<any>();
  dtTriggerCheck: Subject<any> = new Subject<any>();
  dtTriggerCredit: Subject<any> = new Subject<any>();
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild( ModalConfirmFfnComponent ) child2: ModalConfirmFfnComponent ; 
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('cCheck',{static: true}) cCheck : ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ){ }
   
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']],
      destroy : true,
    };

    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy : true,
      retrieve: true,
    };
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      this.pRun_id = params['run_id'];
      this.pReceipt_running = params['receipt_running'];
    });
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_running",
      "field_name" : "fine_per_day",
      "condition" : " AND c_lan=1",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.fine_per_day = this.curencyFormatRemove(getDataOptions[0].fieldNameValue);
      },
      (error) => {}
    )
    //======================== pcard_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcredit_card_type",
      "field_id" : "card_type_id",
      "field_name" : "card_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getCard = getDataOptions;
      },
      (error) => {}
    )
    //======================== years ======================================
    var year = [];
    for(var i =0;i<12;i++){
      year.push({'year':(parseInt(myExtObject.curYear())-543)+i});
    }
    this.getYears = year;
    console.log(this.getYears)
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      if(!this.pRun_id || this.pRun_id==0)
        this.setDefPage();
      else
        this.runId = {'run_id' : this.pRun_id,'counter' : Math.ceil(Math.random()*10000)}
  }

  fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      this.searchData(1);
      
    }
      this.setDefPage();
  }

  setDefPage(){
    // alert(99)
    this.result = [];
    this.editReceipt = this.loginEdit = 0;
    // this.result.rcv_date = myExtObject.curDate();
    this.getCurDate();
    this.result.appeal_type = 1;
    // this.result.budget_year = myExtObject.curYear();
    this.result.userrcv_id = this.userData.userCode;
    this.result.userrcv_name = this.userData.offName;
    this.forfeitDefObj = [{'jail_day_amt':this.curencyFormat(this.fine_per_day,2),'jail_day':0,'forfeit_amt':'0.00','total_amt':'0.00','total_pay':'0.00','pay_amt':'0.00'}];
    this.result.cancel_flag = 0;//ประเภทเงิน เบ็ดเตล็ดอื่นๆ เพิ่มปุ่ม ลบ ยกเลิก
    
    this.litType();
    this.result.received_cash = this.result.return_cash = '0.00';
    this.payment_ratio = 100;
    
    this.check = [];
    this.checkListObj = [];
    this.visibleCheck = true;
    this.dtTriggerCheck.next(null);

    this.credit = [];
    this.creditObj = [];
    this.visibleCredit = true;
    this.dtTriggerCredit.next(null);
    this.credit.valid_month = myExtObject.curMonth();
    this.credit.valid_year = myExtObject.curYear()-543;
    if(this.pRun_id){
      //if(!this.dataHead.buttonSearch)
        //this.runId = {'run_id' : this.pRun_id,'counter' : Math.ceil(Math.random()*10000)}
      this.result.run_id = this.pRun_id;
      this.pRun_id = null;
      this.searchData(1);
    }
    if(this.pReceipt_running){
      
      this.editReceipt = 1;
      this.result.receipt_running = this.pReceipt_running;
      this.searchData(3);
      this.pReceipt_running = null;
    }
    this.receiptList();
  }

  setDefCredit(){
    this.credit.valid_month = myExtObject.curMonth();
    this.credit.valid_year = myExtObject.curYear()-543;
  }

  getCurDate(){
    var student = JSON.stringify({
      "userToken" : this.userData.userToken,
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getCurrentDate', student).subscribe(
      datalist => {
        let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
        console.log(getDataOptions);
        this.result.rcv_date=getDataOptions.cur_date;
      },
      (error) => {}
    );
  }

  successHttp() {
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fca0200"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.disableLoading().post('/'+this.userData.appName+'Api/API/authen', authen )
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
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

  async receiptList():Promise<void>{
    var student = JSON.stringify({
      "table_name" : "preceipt_type",
      "field_id" : "receipt_type_id",
      "field_name" : "receipt_type_desc",
      "condition" : this.dataHead.run_id || this.result.run_id ?'':' AND receipt_type_id = 5',
      "order_by" : " NVL(order_no,999) ASC ",
      "userToken" : this.userData.userToken
    });
    console.log(student)
     this.http.disableLoading().post<void>('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getReceive = getDataOptions;
        this.result.receipt_running ? '' : this.result.rcv_flag=getDataOptions[0].fieldIdValue;
        if(!this.result.receipt_running){
          if(this.dataHead.fee_flag==1 ){//กรณีหน้ารับฟ้อง มีติ๊กว่า มีค่าขึ้นศาลอนาคต
            this.receiptDetailObj = [
              {'receipt_type_id':this.result.rcv_flag,'cash_amt':'0.00','cheque_amt':'0.00','credit_amt':'0.00','rcv_amt':'0.00'},
              {'receipt_type_id':this.result.rcv_flag,'cash_amt':'0.00','cheque_amt':'0.00','credit_amt':'0.00','rcv_amt':'0.00'},
              {'receipt_type_id':this.result.rcv_flag,'cash_amt':'0.00','cheque_amt':'0.00','credit_amt':'0.00','rcv_amt':'0.00'}
            ];
          }else{
            this.receiptDetailObj = [
              {'receipt_type_id':this.result.rcv_flag,'cash_amt':'0.00','cheque_amt':'0.00','credit_amt':'0.00','rcv_amt':'0.00'},
              {'receipt_type_id':this.result.rcv_flag,'cash_amt':'0.00','cheque_amt':'0.00','credit_amt':'0.00','rcv_amt':'0.00'}
            ];
          }
          
        }
        this.receiptType(1);
      },
      (error) => {}
      )
  }

  async receiptType(type:any){//2 เปลี่ยนค่าเองจากหน้าจอ
    var student = JSON.stringify({
      "table_name" : "preceipt_sub_type",
      "field_id" : "sub_type_id",
      "field_name" : "sub_type_name",
      "field_name2" : "fine_type",
      "condition" : ' AND receipt_type_id = '+this.result.rcv_flag,
      "order_by" : " NVL(order_no,999) ASC ",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let promise = new Promise((resolve, reject) => {
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).toPromise().then(
        res => { // Success
          let getDataOptions : any = JSON.parse(JSON.stringify(res));
          console.log(getDataOptions)
          console.log(type)
          this.getReceiveType = getDataOptions;
          if(type==1){
            (this.result.receipt_running && this.result.s_type) ? '' : this.result.s_type=getDataOptions[0].fieldIdValue;
            var fine = getDataOptions.filter((x:any) => x.fieldIdValue === this.result.s_type);
              
            //กรณีหน้ารับฟ้อง มีติ๊กว่า มีค่าขึ้นศาลอนาคต
            if(this.dataHead.fee_flag==1 && fine[0].fieldNameValue=='ค่าขึ้นศาล'){
              if(!this.result.receipt_running){
                this.receiptDetailObj[0].sub_type_id = fine[0].fieldIdValue;
                this.receiptDetailObj[0].sub_type_name = fine[0].fieldNameValue;

                var fine2 = getDataOptions.filter((x:any) => x.fieldNameValue === 'ค่าขึ้นศาลอนาคต');
                console.log(fine2)
                this.receiptDetailObj[1].sub_type_id = fine2[0].fieldIdValue;
                this.receiptDetailObj[1].sub_type_name = fine2[0].fieldNameValue;

                this.runReceive();
                this.getAmt(0);
                this.getfee(1);
              }//-----
            }else{
              if(!this.result.receipt_running){
                this.receiptDetailObj[0].sub_type_id = fine[0].fieldIdValue;
                this.receiptDetailObj[0].sub_type_name = fine[0].fieldNameValue;
                this.runReceive();
                this.getAmt(0);
              }
            }
            
          }else{
            //19/09/2565 แก้ กรณีเปลี่ยนประเภทเงิน แล้ว มีค่าขึ้นศาลอนาคต มันค้างอยู่
            this.receiptDetailObj
            this.receiptDetailObj = [
              {'receipt_type_id':this.result.rcv_flag,'cash_amt':'0.00','cheque_amt':'0.00','credit_amt':'0.00','rcv_amt':'0.00'},
              {'receipt_type_id':this.result.rcv_flag,'cash_amt':'0.00','cheque_amt':'0.00','credit_amt':'0.00','rcv_amt':'0.00'}
            ];
            //---
            this.result.s_type = getDataOptions[0].fieldIdValue;
            if(!this.result.receipt_running)
              this.runReceive();
            var fine = getDataOptions.filter((x:any) => x.fieldIdValue === this.result.s_type);
            this.receiptDetailObj[0].receipt_type_id = this.result.rcv_flag;
            this.receiptDetailObj[0].sub_type_id = fine[0].fieldIdValue;
            this.receiptDetailObj[0].sub_type_name = fine[0].fieldNameValue;
            if(this.receiptDetailObj.length>1 && !this.receiptDetailObj[1].edit_item){
              this.receiptDetailObj[1].receipt_type_id = this.result.rcv_flag;
            }
            this.getAmt(0);
          }
          
          
          if(fine.length){
            this.fine_type = fine[0].fieldNameValue2;
          }else{
            this.fine_type = null;
          }
          resolve(res);
        },
        msg => { // Error
          reject(msg);
        }
      );
    });
    return promise;
  }

  calForfeitDef(index:any){
    var jail_day = parseFloat(this.curencyFormatRemove(this.forfeitDefObj[index].jail_day));
    var jail_day_amt = parseFloat(this.curencyFormatRemove(this.forfeitDefObj[index].jail_day_amt));
    var total_amt = jail_day * jail_day_amt;
    this.forfeitDefObj[index].total_amt =  this.curencyFormat(total_amt,2);

    var total_pay = parseFloat(this.curencyFormatRemove(this.forfeitDefObj[index].forfeit_amt)) - total_amt;
    this.forfeitDefObj[index].total_pay = this.curencyFormat(total_pay,2);
    var pay_amt = (total_pay * this.payment_ratio)/100;
    this.forfeitDefObj[index].pay_amt = this.curencyFormat(pay_amt,2);
    //this.sum_fee1 = 
    //this.sum_pay1 =
    var sum_total_pay = 0,sum_pay_amt=0;
    var bar = new Promise((resolve, reject) => {
      for(var i=0;i<this.forfeitDefObj.length;i++){
        sum_total_pay = sum_total_pay + parseFloat(this.curencyFormatRemove(this.forfeitDefObj[i].total_pay));
        sum_pay_amt = sum_pay_amt + parseFloat(this.curencyFormatRemove(this.forfeitDefObj[i].pay_amt));
      }
    });
    if(bar){
      this.sum_fee1 = this.curencyFormat(sum_total_pay,2);
      this.sum_pay1 = this.curencyFormat(sum_pay_amt,2);
      this.receiptDetailObj[0].cash_amt = this.sum_pay1;
      this.sumCash();
    }

  }
  sumForfeitDef(){
    var sum_pay_amt=0;
    var bar = new Promise((resolve, reject) => {
      for(var i=0;i<this.forfeitDefObj.length;i++){
        var pay = parseFloat(this.curencyFormatRemove(this.forfeitDefObj[i].total_pay));
        var pay_row = (pay * this.payment_ratio)/100;
        this.forfeitDefObj[i].pay_amt = this.curencyFormat(pay_row,2);
        sum_pay_amt = sum_pay_amt + pay_row;
      }
    });
    if(bar){
      this.sum_pay1 = this.curencyFormat(sum_pay_amt,2);
      this.receiptDetailObj[0].cash_amt = this.sum_pay1;
      this.sumCash();
    }
  }

  calAmt(index:any){
    if(typeof index !='string'){
    //console.log(parseFloat(this.curencyFormatRemove(this.receiptDetailObj[index].cash_amt)) + parseFloat(this.curencyFormatRemove(this.receiptDetailObj[index].cheque_amt)) + parseFloat(this.curencyFormatRemove(this.receiptDetailObj[index].credit_amt)))       
    var rcv_amt = parseFloat(this.curencyFormatRemove(this.receiptDetailObj[index].cash_amt?this.receiptDetailObj[index].cash_amt:0)) + parseFloat(this.curencyFormatRemove(this.receiptDetailObj[index].cheque_amt?this.receiptDetailObj[index].cheque_amt:0)) + parseFloat(this.curencyFormatRemove(this.receiptDetailObj[index].credit_amt?this.receiptDetailObj[index].credit_amt:0));
    this.receiptDetailObj[index].rcv_amt =  this.curencyFormat(rcv_amt,2);
    }
    
    var sum_fee = 0;
    var bar = new Promise((resolve, reject) => {
      for(var i=0;i<this.receiptDetailObj.length;i++){
        sum_fee = sum_fee + parseFloat(this.curencyFormatRemove(this.receiptDetailObj[i].rcv_amt));
      }
    });
    if(bar){
      this.sum_fee = this.curencyFormat(sum_fee,2);
      this.sumCash();
    }
  }

  sumCash(){
    var sum_cash = 0,sum_check = 0,sum_credit = 0;
    var bar = new Promise((resolve, reject) => {
      for(var i=0;i<this.receiptDetailObj.length;i++){
        //console.log(parseFloat(this.curencyFormatRemove(this.receiptDetailObj[i].cash_amt)))
        //console.log(this.receiptDetailObj[i].cash_amt)
        sum_cash = sum_cash + parseFloat(this.curencyFormatRemove(this.receiptDetailObj[i].cash_amt?this.receiptDetailObj[i].cash_amt:0));
        sum_check = sum_check + parseFloat(this.curencyFormatRemove(this.receiptDetailObj[i].cheque_amt?this.receiptDetailObj[i].cheque_amt:0));
        sum_credit = sum_credit + parseFloat(this.curencyFormatRemove(this.receiptDetailObj[i].credit_amt?this.receiptDetailObj[i].credit_amt:0));
      }
    });
    if(bar){
      this.sum_cash = this.curencyFormat(sum_cash,2);
      this.sum_check = this.curencyFormat(sum_check,2);
      this.sum_credit = this.curencyFormat(sum_credit,2);
    }
  }

  retCash(){
    if(this.result.received_cash){
      var received_cash = parseFloat(this.curencyFormatRemove(this.result.received_cash));
      var sum_cash = parseFloat(this.curencyFormatRemove(this.sum_cash));
      console.log(sum_cash)
      if(sum_cash>received_cash){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('จำนวนเงินรับต้องมากกว่ายอดที่ต้องชำระ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.result.received_cash = this.result.return_cash = '';

          }
          subscription.unsubscribe();
        });
      }else{
        if(received_cash==0){
          this.result.return_cash = '0.00';
        }else{
          var return_cash = received_cash - sum_cash;
          this.result.return_cash = this.curencyFormat(return_cash,2);
        }
        
      }
      
      
    }else{
      this.result.return_cash = '0.00';
    }
  }

  addComma(event:any){
    if(!event.target.value){
      (event.target as HTMLInputElement).value = '0.00';
    }else{
      (event.target as HTMLInputElement).value = this.curencyFormat(event.target.value,2);
    }
  }
  revComma(event:any){
    //console.log(event.target.value.indexOf('.00'))
    if(event.target.value.indexOf('.00')==-1)
      (event.target as HTMLInputElement).value = this.curencyFormatRemove(event.target.value);
    else{
      if(event.target.value=='0.00'){
        (event.target as HTMLInputElement).value = '';
      }else{
        var eVal = event.target.value.split('.')[0];
        (event.target as HTMLInputElement).value = this.curencyFormatRemove(eVal);
      }
    }
  }

  
  getfee(index:any){
    if(this.dataHead.future_court_fee > 0){
      //21/11/2565 ใบเสร็จรับเงิน กรณีค่าขึ้นศาลอนาคต ต้องเอาจำนวนจากหน้ารับฟ้อง
      //เพิ่มเช็คในข้อมูลคดีมีค่าไหม ถ้ามีค่าเอามาจากคดี ถ้าไม่มีค่าเอามาด้วยวิธีเดิม
      this.receiptDetailObj[index].cash_amt = this.curencyFormat(this.dataHead.future_court_fee ? this.dataHead.future_court_fee : 0,2);
      this.calAmt(index);
    }else{
      //กรณีหน้ารับฟ้อง มีติ๊กว่า มีค่าขึ้นศาลอนาคต
      if(this.receiptDetailObj[index].receipt_type_id && this.receiptDetailObj[index].sub_type_id){
        var student = JSON.stringify({
          "table_name" : "preceipt_sub_type",
          "field_id" : "receipt_type_id",
          "field_name" : "default_value",
          "condition" : " AND receipt_type_id ="+this.receiptDetailObj[index].receipt_type_id +" AND sub_type_id ="+this.receiptDetailObj[index].sub_type_id,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions[0].fieldNameValue);
            this.receiptDetailObj[index].cash_amt = this.curencyFormat(getDataOptions[0].fieldNameValue ? getDataOptions[0].fieldNameValue : 0,2);
            this.calAmt(index);
          },
          (error) => {}
        )
      }
    }
    
  }
  //---
  
  getAmt(index:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(this.receiptDetailObj[index].receipt_type_id && this.receiptDetailObj[index].sub_type_id){
      var student = JSON.stringify({
        "rcv_flag" : this.receiptDetailObj[index].receipt_type_id,
        "s_type" : this.receiptDetailObj[index].sub_type_id,
        "run_id" : this.dataHead.run_id?this.dataHead.run_id:0,
        "userToken" : this.userData.userToken
      });
      console.log(student)
    
      this.http.disableLoading().post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/getAmt', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log('getAmt',index,getDataOptions)
          if(getDataOptions.result==1){
              //-----------------------------//
              this.receiptDetailObj[index].cash_amt = this.curencyFormat(getDataOptions.cash_amt,2);
              this.calAmt(index);
              // this.receiptDetailObj[index].cash_amt = this.receiptDetailObj[index].rcv_amt = this.curencyFormat(getDataOptions.cash_amt,2);//M
              // this.calAmt(''); //M
              //-----------------------------//
          }else{
            //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
              });
            //-----------------------------//
          }

        },
        (error) => {}
      )
    }
  }

  litType(){
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    console.log(student)
     this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getLitType = getDataOptions;
        if(!this.result.receipt_running && this.dataHead.run_id ){
          this.result.litigant_type = 1;
          this.defLitRunId();
        }else{
          this.result.litigant_type = 1;
          this.result.item = '';
        }
      },
      (error) => {}
      )
  }

  defLitRunId(){
      var student = JSON.stringify({
        "table_name" : "pcase_litigant",
         "field_id" : "lit_running",
         "field_name" : "title",
         "field_name2" : "name",
         "condition" : " AND run_id='"+this.dataHead.run_id+"' AND lit_type='1'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.length ){
          if(productsJson.length > 1)
            this.result.def_name = productsJson[0].fieldNameValue?productsJson[0].fieldNameValue+productsJson[0].fieldNameValue2+' โจทก์ที่ 1':''+productsJson[0].fieldNameValue2+' โจทก์ที่ 1';
          else
            this.result.def_name = productsJson[0].fieldNameValue?productsJson[0].fieldNameValue+productsJson[0].fieldNameValue2+' โจทก์':''+productsJson[0].fieldNameValue2+' โจทก์';
          this.result.item = 1;
        }else{
          this.result.def_name = '';
          this.result.item = '';
        }
        },
        (error) => {}
      )
  }

  receiptTypeIndex(index:any){
    if(index==0){
      this.result.rcv_flag = this.receiptDetailObj[0].receipt_type_id;
      this.receiptType(2);
      this.runReceive();
      this.getAmt(index);
    }
  }
  runReceive(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(this.result.rcv_flag && this.result.rcv_flag && this.dataHead.run_id){
      var student = JSON.stringify({
        "rcv_flag" : this.result.rcv_flag,
        "s_type" : this.result.s_type,
        "title" : this.dataHead.title,
        "userToken" : this.userData.userToken
      });
      console.log(student)
    }else if(this.result.rcv_flag && this.result.rcv_flag && !this.dataHead.run_id){
      var student = JSON.stringify({
        "rcv_flag" : this.result.rcv_flag,
        "s_type" : this.result.s_type,
        "title" : '',
        "userToken" : this.userData.userToken
      });
      console.log(student)
    }
    this.http.disableLoading().post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/runReceiptNo', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result==1){
            //-----------------------------//
              this.result.usermng_id = getDataOptions.usermng_id;
              this.result.usermng_name = getDataOptions.usermng_name;
              this.result.book_no = getDataOptions.book_no;
              this.result.rreceipt_no = getDataOptions.rreceipt_no;
              this.result.budget_year = getDataOptions.budget_year;
            //-----------------------------//
        }else{
          //-----------------------------//
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
            
          //-----------------------------//
        }

      },
      (error) => {}
    )
  }

  tabChangeInputFof(index:any,event:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');

     var student = JSON.stringify({
      "table_name" : "pcase_litigant",
       "field_id" : "seq",
       "field_name" : "title",
       "field_name2" : "name",
       "condition" : " AND seq='"+event.target.value+"' AND run_id='"+this.dataHead.run_id+"' AND lit_type='2'",
      "userToken" : this.userData.userToken
    });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.forfeitDefObj[index]['def_name'] = productsJson[0].fieldNameValue+productsJson[0].fieldNameValue2;
          if(this.forfeitDefObj.length-1 == index){
            this.forfeitDefObj.push({'jail_day_amt':this.curencyFormat(this.fine_per_day,2),'jail_day':0,'forfeit_amt':'0.00','total_amt':'0.00','total_pay':'0.00','pay_amt':'0.00'});
            this.dtTriggerFof.next(null);
          }
        }else{
          this.forfeitDefObj[index]['def_item'] = '';
          this.forfeitDefObj[index]['def_name'] = '';
        }
        },
        (error) => {}
      )
  }

  tabChangeInput(name:any,event:any){
    if(name=='bank_id'){
      var student = JSON.stringify({
        "table_name" : "pbank",
        "field_id" : "bank_id",
        "field_name" : "bank_name",
        "condition" : " AND bank_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.bank_name = productsJson[0].fieldNameValue;
        }else{
          this.result.bank_id = '';
          this.result.bank_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='userrcv_id'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.userrcv_name = productsJson[0].fieldNameValue;
        }else{
          this.result.userrcv_id = '';
          this.result.userrcv_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='usermng_id'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "condition" : " AND pofficer.off_id = '"+event.target.value+"' AND EXISTS(SELECT * FROM puser_login WHERE pofficer.off_id=puser_login.user_id AND puser_login.user_flag='o' AND puser_login.user_level='S')",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.usermng_name = productsJson[0].fieldNameValue;
        }else{
          this.result.usermng_id = '';
          this.result.usermng_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='bank_id2'){
      var student = JSON.stringify({
        "table_name" : "pbank",
        "field_id" : "bank_id",
        "field_name" : "bank_name",
        "condition" : " AND bank_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.check.bank_name = productsJson[0].fieldNameValue;
        }else{
          this.check.bank_id = '';
          this.check.bank_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='bank_id3'){
      var student = JSON.stringify({
        "table_name" : "pbank",
        "field_id" : "bank_id",
        "field_name" : "bank_name",
        "condition" : " AND bank_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.credit.bank_name = productsJson[0].fieldNameValue;
        }else{
          this.credit.bank_id = '';
          this.credit.bank_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='item'){
      //console.log(this.dataHead.run_id +":"+ this.result.lit_type)
      if(this.dataHead.run_id && this.result.litigant_type){
        var student = JSON.stringify({
          "run_id": this.dataHead.run_id,
          "lit_type": this.result.litigant_type,
          "seq":this.result.item,
          "userToken" : this.userData.userToken
        }); 
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/popupLitName', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.data.length){
            this.result.def_name = productsJson.data[0].lit_name+" "+productsJson.data[0].lit_type_desc2;
          }else{
            this.result.item = '';
            this.result.def_name = '';
            
          }
          },
          (error) => {}
        )
      }
    }
  }
  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTrigger.next(null);
    this.dtTriggerRev.next(null);
    this.dtTriggerFof.next(null);
    this.dtTriggerData.next(null);
    this.dtTriggerCheck.next(null);
    this.dtTriggerCredit.next(null);
}
      
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtTriggerRev.next(null);
    this.dtTriggerFof.next(null);
    this.dtTriggerData.next(null);
    this.dtTriggerCheck.next(null);
    this.dtTriggerCredit.next(null);
    myExtObject.callCalendar();
  }

    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
      this.dtTriggerRev.unsubscribe();
      this.dtTriggerFof.unsubscribe();
      this.dtTriggerData.unsubscribe();
      this.dtTriggerCheck.unsubscribe();
      this.dtTriggerCredit.unsubscribe();
    }

    
    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }
    directiveCheckDate(date:any,obj:any){
      this.check[obj] = date;
    }

    dFineType(event:any){
      if(event){
        var fine = this.getReceiveType.filter((x:any) => x.fieldIdValue === event);
        console.log(fine)
        this.receiptDetailObj[0].sub_type_id = fine[0].fieldIdValue;
        this.receiptDetailObj[0].sub_type_name = fine[0].fieldNameValue;
          if(fine.length)
            this.fine_type = fine[0].fieldNameValue2;
          else
            this.fine_type = null;
      }
    }

    searchData(type:any){//1 เลขคดี,2 เลขที่,3 running
      console.log("search:"+this.editReceipt+""+this.loginEdit)
      if(type==2){
        const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
        if(!this.result.book_no){
          confirmBox.setMessage('กรุณาระบุเล่มที่ใบเสร็จ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
        }else if(!this.result.rreceipt_no){
          confirmBox.setMessage('กรุณาระบุเลขที่ใบเสร็จ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
        }else{
          var student = JSON.stringify({
            "book_no" : this.result.book_no,
            "rreceipt_no" : this.result.rreceipt_no,
            "userToken" : this.userData.userToken
          });
          console.log(student)
          this.searchDataCommit(student,type);
        }
      }else if(type==1){
        if(this.dataHead.run_id || this.result.run_id){
          this.SpinnerService.show();
          var student = JSON.stringify({
            "run_id" : this.dataHead.run_id?this.dataHead.run_id:this.result.run_id,
            "userToken" : this.userData.userToken
          });
          //console.log(student)
          this.searchDataCommit(student,type);
        }
      }else{
        if(this.result.receipt_running){
          
          var student = JSON.stringify({
            "receipt_running" : this.result.receipt_running,
            "userToken" : this.userData.userToken
          });
          this.searchDataCommit(student,type);
        }/*else{
          this.setDefPage();
        }*/
      }
    }

    searchDataCommit(json:any,type:any){
      //console.log("searchCommit:"+this.editReceipt+""+this.loginEdit+":"+type)
      console.log(json)
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/getReceiptData', json ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1 && getDataOptions.data.length){
              this.receiptList();
              //-----------------------------//
              if(getDataOptions.data.length){
                if(type==1){
                  var bar = new Promise((resolve, reject) => {
                    this.receiptDetailData = getDataOptions.data;
                    this.receiptDetailData.forEach((x : any ) => x.cFlag = x.cancel_flag);
                    this.result.run_id = getDataOptions.data[0].run_id;

                    this.dtTriggerData.next(null);
                  });
                  if(bar)
                    this.SpinnerService.hide();
                }else if(type==2){
                  if(this.result.run_id!=getDataOptions.data[0].run_id)
                    this.result.run_id = this.runId = getDataOptions.data[0].run_id;
                  else
                    this.result.run_id = getDataOptions.data[0].run_id;
                  this.searchData(1);
                  this.editData(getDataOptions.data[0],1);
                }else{
                  //console.log("searchCommitEnd:"+this.editReceipt+""+this.loginEdit)
                  if(this.result.run_id!=getDataOptions.data[0].run_id)
                    this.result.run_id = this.runId = getDataOptions.data[0].run_id;
                  else
                    this.result.run_id = getDataOptions.data[0].run_id;
                  this.searchData(1);
                  this.editData(getDataOptions.data[0],1);
                }
              }else{
                this.receiptDetailData = [];
                this.dtTriggerData.next(null);
              }
              //-----------------------------//
          }else{
            //แก้ลบใบเสร็จแล้ว reload
            this.receiptDetailData = [];
            this.dtTriggerData.next(null);
            //ค้นไม่เจอ ไม่ต้องแสดงไม่พบข้อมูล
            //-----------------------------//
              /*confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
              });
              */
            //-----------------------------//
          }

        },
        (error) => {}
      )
    }


    editData(index:any,type:any){//2คือคลิกจากหน้าจอ
      if(type==2){
        this.editReceipt = 1;
        this.SpinnerService.show();
      }
        //console.log(this.receiptDetailData[index])
      var bar = new Promise((resolve, reject) => {
        this.result = [];
        if(typeof index === 'object')
          this.result = JSON.parse(JSON.stringify(index));
        else
          this.result = JSON.parse(JSON.stringify(this.receiptDetailData[index]));
        console.log(this.result)
        //this.runId = {'run_id' : this.result.run_id,'rRunning' : this.result.receipt_running,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
        this.runId = {'run_id' : this.result.run_id,'rRunning' : this.result.receipt_running,'counter' : Math.ceil(Math.random()*10000),'sendCase':1}
        this.sum_fee = this.curencyFormat(this.result.sum_fee,2);
        this.result.received_cash = this.curencyFormat(this.result.received_cash,2);
        this.result.return_cash = this.curencyFormat(this.result.return_cash,2);

        this.sum_cash = this.curencyFormat(this.result.sum_cash,2);
        this.sum_check = this.curencyFormat(this.result.sum_check,2);
        this.sum_credit = this.curencyFormat(this.result.sum_credit,2);

        this.receiptType(1);
        if(this.result.forfeitDefObj.length){
          this.sum_fee1 = this.curencyFormat(this.result.forfeitDefObj.map(pay => pay.total_pay).reduce((acc, amount) => acc + amount),2);
          this.sum_pay1 = this.curencyFormat(this.result.forfeitDefObj.map(pay => pay.pay_amt).reduce((acc, amount) => acc + amount),2);
          var bar = new Promise((resolve, reject) => {
            this.result.forfeitDefObj.forEach((r:any,index:any,array:any)  =>  {
              r.forfeit_amt = this.curencyFormat(r.forfeit_amt,2)
              r.jail_day_amt = this.curencyFormat(r.jail_day_amt,2)
              r.total_amt = this.curencyFormat(r.total_amt,2)
              r.total_pay = this.curencyFormat(r.total_pay,2)
              r.pay_amt = this.curencyFormat(r.pay_amt,2)
              r.edit_item = r.item
            });
          });
          if(bar){
            this.forfeitDefObj = [];
            this.forfeitDefObj = JSON.parse(JSON.stringify(this.result.forfeitDefObj));
            this.forfeitDefObj.push({
              'jail_day_amt':this.curencyFormat(this.fine_per_day,2),
              'jail_day':0,
              'forfeit_amt':'0.00',
              'total_amt':'0.00',
              'total_pay':'0.00',
              'pay_amt':'0.00'
            });
            this.dtTriggerFof.next(null);
          }
        }else{
          this.forfeitDefObj = [];
          this.forfeitDefObj.push({
            'jail_day_amt':this.curencyFormat(this.fine_per_day,2),
            'jail_day':0,
            'forfeit_amt':'0.00',
            'total_amt':'0.00',
            'total_pay':'0.00',
            'pay_amt':'0.00'
          });
          this.dtTriggerFof.next(null);
        }
        if(this.result.receiptDetailObj.length){
          var bar = new Promise((resolve, reject) => {
            this.result.receiptDetailObj.forEach((r:any,index:any,array:any)  =>  {
              r.cash_amt = this.curencyFormat(r.cash_amt ? r.cash_amt:0,2)
              r.cheque_amt = this.curencyFormat(r.cheque_amt ? r.cheque_amt:0,2)
              r.credit_amt = this.curencyFormat(r.credit_amt ? r.credit_amt:0,2)
              r.rcv_amt = this.curencyFormat(r.rcv_amt ? r.rcv_amt:0,2)
              r.edit_item = r.item
            });
          });
          if(bar){
            this.receiptDetailObj = [];
            this.receiptDetailObj = JSON.parse(JSON.stringify(this.result.receiptDetailObj));
            this.receiptDetailObj.push({
              'receipt_type_id':this.receiptDetailObj[this.receiptDetailObj.length-1].receipt_type_id,
              'cash_amt':'0.00',
              'cheque_amt':'0.00',
              'credit_amt':'0.00',
              'rcv_amt':'0.00'
            });
            console.log(this.result.receiptDetailObj)
            this.dtTriggerRev.next(null);
          }
        }else{
          this.receiptDetailObj = [];
          this.receiptDetailObj.push({
            'receipt_type_id':this.receiptDetailObj[this.receiptDetailObj.length-1].receipt_type_id,
            'cash_amt':'0.00',
            'cheque_amt':'0.00',
            'credit_amt':'0.00',
            'rcv_amt':'0.00'
          });
          this.dtTriggerRev.next(null);
        }
        //if(this.result.checkListObj.length){
          this.checkListObj = [];
          this.checkListObj = JSON.parse(JSON.stringify(this.result.checkListObj));
          this.dtTriggerCheck.next(null);
        //}
        //if(this.result.creditObj.length){
          this.creditObj = [];
          this.creditObj = JSON.parse(JSON.stringify(this.result.creditObj));
          this.dtTriggerCheck.next(null);
        //}
        
      });
      if(bar){
        setTimeout(() => {
          this.SpinnerService.hide();
          console.log(this.runId)
        }, 200);
      }
      
    }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
    curencyFormatRemove(val: number): string {
      //console.log(val)
      if (val !== undefined && val !== null) {
        return val.toString().replace(/,/g, "");
      } else {
        return '';
      }
    }

    receiveFuncListData(event:any){
      console.log(event)
      if(this.modalType==1){
        if(typeof event.fieldIdValue !='undefined'){
          this.result.item = event.fieldIdValue;
          this.result.def_name = event.fieldNameValue;
        }else{
          this.result.litigant_type = event.lit_type;
          this.result.item = event.seq;
          this.result.def_name = (event.lit_name?event.lit_name:'')+" "+event.lit_type_desc2;
        }
        this.result.guar_running = null;
      }else if(this.modalType==2){
        this.result.litigant_type = event.lit_type;
        this.result.item = event.seq;
        this.result.def_name = (event.lit_name?event.lit_name:'')+" "+event.lit_type_desc2;
        this.result.guar_running = null;
      }else if(this.modalType==4){
        if(this.modalIndex==0){
          this.receiptDetailObj[this.modalIndex].sub_type_id = event.fieldIdValue;
          this.receiptDetailObj[this.modalIndex].sub_type_name = event.fieldNameValue;
          this.result.s_type = event.fieldIdValue;
        }else if(this.receiptDetailObj.length-1 == this.modalIndex){
          this.receiptDetailObj[this.modalIndex].sub_type_id = event.fieldIdValue;
          this.receiptDetailObj[this.modalIndex].sub_type_name = event.fieldNameValue;
          this.receiptDetailObj.push({
            'receipt_type_id':this.receiptDetailObj[this.receiptDetailObj.length-1].receipt_type_id,
            'cash_amt':'0.00',
            'cheque_amt':'0.00',
            'credit_amt':'0.00',
            'rcv_amt':'0.00'
          });
          console.log(this.receiptDetailObj)
          this.dtTriggerRev.next(null);
        }else{
          this.receiptDetailObj[this.modalIndex].sub_type_id = event.fieldIdValue;
          this.receiptDetailObj[this.modalIndex].sub_type_name = event.fieldNameValue;
        }
        this.getAmt(this.modalIndex);
      }else if(this.modalType==5){
        this.forfeitDefObj[this.modalIndex].def_item = event.fieldIdValue;
        this.forfeitDefObj[this.modalIndex].def_name = event.fieldNameValue+event.fieldNameValue2;
        if(this.forfeitDefObj.length-1 == this.modalIndex){
          this.forfeitDefObj.push({'jail_day_amt':this.curencyFormat(this.fine_per_day,2),'jail_day':0,'forfeit_amt':'0.00','total_amt':'0.00','total_pay':'0.00','pay_amt':'0.00'});
          this.dtTriggerFof.next(null);
        }
      }else if(this.modalType==6){
        this.result.bank_id = event.fieldIdValue;
        this.result.bank_name = event.fieldNameValue;
      }else if(this.modalType==7){
        this.result.userrcv_id = event.fieldIdValue;
        this.result.userrcv_name = event.fieldNameValue;
      }else if(this.modalType==8 || this.modalType==9){
        this.result.usermng_id = event.fieldIdValue;
        this.result.usermng_name = event.fieldNameValue;
      }else if(this.modalType==10){
        this.check.bank_id = event.fieldIdValue;
        this.check.bank_name = event.fieldNameValue;
      }else if(this.modalType==11){
        this.credit.bank_id = event.fieldIdValue;
        this.credit.bank_name = event.fieldNameValue;
      }
      this.closebutton.nativeElement.click();
    }
    receiveGuarData(event:any){
      console.log(event);
      this.result.guar_running = event.guar_running;
      this.result.item = event.guarman_item;
      this.result.def_name = event.guarantor_name;//หน้าใบเสร็จรับเงิน กรณีเลือกนายประกัน popup เลือก แล้วแต่กลับเอาชื่อจำเลยลงมาที่ผู้ชำระเงิน (ที่ถูกต้องนำชื่อนายประกันลงมา)
      // this.result.def_name = event.pname;
      this.closebutton.nativeElement.click();
    }
    closeModal(){
      this.loadModalLitComponent = false;
      this.loadComponent = false;
      this.loadModalGuarComponent = false;
      this.loadModalConfirmFfnComponent = false;
      this.loadModalConfComponent = false;
    }

    clickOpenMyModalComponent(type:any){
      if((type==1 || type==2 || type==3) && !this.dataHead.run_id){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        this.modalType = type;
        this.openbutton.nativeElement.click();
      }
    }

    loadMyModalComponent(){
      if(this.modalType==1 || this.modalType==2){
          $("#exampleModal").find(".modal-content").css("width","800px");
          if(this.modalType==1){
            this.listTable='1';
          }else{
            this.listTable='2';
          }
          this.loadModalLitComponent = true;
          this.loadComponent = false;
          this.loadModalGuarComponent = false;
          this.loadModalConfirmFfnComponent = false;
          this.loadModalConfComponent = false;
      }else if(this.modalType==3){
        $("#exampleModal").find(".modal-content").css("width","950px");
        this.loadModalLitComponent = false;
        this.loadComponent = false;
        this.loadModalGuarComponent = true;
        this.loadModalConfirmFfnComponent = false;
        this.loadModalConfComponent = false;
      }else if(this.modalType==4){
        $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
            "table_name" : "preceipt_sub_type",
            "field_id" : "sub_type_id",
            "field_name" : "sub_type_name",
            "field_name2" : "fine_type",
            "condition" : ' AND receipt_type_id = '+this.receiptDetailObj[this.modalIndex].receipt_type_id,
            "order_by" : " NVL(order_no,999) ASC ",
            "userToken" : this.userData.userToken
          });
        this.listTable='pappoint_list';
        this.listFieldId='app_id';
        this.listFieldName='app_name';
        this.listFieldCond="";
      }else if(this.modalType==5){
        $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pcase_litigant",
           "field_id" : "seq",
           "field_name" : "title",
           "field_name2" : "name",
           "field_name3" : "lit_running",
           "condition" : " AND run_id='"+this.dataHead.run_id+"' AND lit_type='2'",
          "userToken" : this.userData.userToken
        });    
        this.listTable='pcase_litigant';
        this.listFieldId='seq';
        this.listFieldName='title';
        this.listFieldName2='name';
        this.listFieldName3='lit_running';
        this.listFieldCond=" AND run_id='"+this.dataHead.run_id+"' AND lit_type='2'";
      }else if(this.modalType==6 || this.modalType==10 || this.modalType==11){
        $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pbank",
           "field_id" : "bank_id",
           "field_name" : "bank_name",
          "userToken" : this.userData.userToken
        });    
        this.listTable='pbank';
        this.listFieldId='bank_id';
        this.listFieldName='bank_name';
        this.listFieldCond="";
      }else if(this.modalType==7 || this.modalType==9){
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "userToken" : this.userData.userToken
        });    
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
        this.listFieldCond="";
      }else if(this.modalType==8){
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "condition" : " AND EXISTS(SELECT * FROM puser_login WHERE pofficer.off_id=puser_login.user_id AND puser_login.user_flag='o' AND puser_login.user_level='S')",
          "userToken" : this.userData.userToken
        });    
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
        this.listFieldCond=" AND EXISTS(SELECT * FROM puser_login WHERE pofficer.off_id=puser_login.user_id AND puser_login.user_flag='o' AND puser_login.user_level='S')";
      }else if(this.modalType==12 || this.modalType==13 || this.modalType==14 || this.modalType==15 || this.modalType==16 || this.modalType==17){
        $("#exampleModal").find(".modal-content").css("width","650px");
        this.loadModalLitComponent = false;
        this.loadComponent = false;
        this.loadModalGuarComponent = false;
        this.loadModalConfirmFfnComponent = true;
        this.loadModalConfComponent = false;
      }else if(this.modalType==18){
        $("#exampleModal").find(".modal-content").css("width","650px");
        this.loadModalLitComponent = false;
        this.loadComponent = false;
        this.loadModalGuarComponent = false;
        this.loadModalConfirmFfnComponent = false;
        this.loadModalConfComponent = true;
      }

      if(this.modalType==4 || this.modalType==5 || this.modalType==6 || this.modalType==7 || this.modalType==8 || this.modalType==9 || this.modalType==10 || this.modalType==11){
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
              this.loadModalLitComponent = false;
              this.loadComponent = true;
              this.loadModalGuarComponent = false;
              this.loadModalConfirmFfnComponent = false;
              this.loadModalConfComponent = false;
          },
          (error) => {}
        )
      }
    }

    clickOpenMyModalComponentIndex(type:any,index:any){
      this.modalType = type;
      this.modalIndex = index;
      this.openbutton.nativeElement.click();
    }

    submitModalForm(){
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
          if (resp.success==true){
            //this.SpinnerService.hide();
          }
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
            //this.SpinnerService.hide();
          }
          subscription.unsubscribe();
        });
      }else{
        
          var student = JSON.stringify({
            "password" : chkForm.password,
            "log_remark" : chkForm.log_remark,
            "userToken" : this.userData.userToken
          });

          this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student ).subscribe(
            posts => {
              let productsJson : any = JSON.parse(JSON.stringify(posts));
              console.log(productsJson)
              if(productsJson.result==1){
                if(this.modalType==18){
                  console.log(this.delIndex)
                  const confirmBox2 = new ConfirmBoxInitializer();
                  confirmBox2.setTitle('ยืนยันการยกเลิกข้อมูล');
                  //ประเภทเงิน เบ็ดเตล็ดอื่นๆ เพิ่มปุ่ม ลบ ยกเลิก
                  if(this.delIndex=='cancel'){
                    if(this.result.cancel_flag){
                      confirmBox2.setMessage('ต้องการยกเลิกรายการใบเสร็จ');
                      var cflag = 1;
                    }else{
                      confirmBox2.setMessage('ต้องการยกเลิกการยกเลิกรายการใบเสร็จ');
                      var cflag = 0;
                    }
                  }else{
                    if(this.receiptDetailData[this.delIndex].cancel_flag){
                      confirmBox2.setMessage('ต้องการยกเลิกการยกเลิกรายการใบเสร็จ');
                      var cflag = 0;
                    }else{
                      confirmBox2.setMessage('ต้องการยกเลิกรายการใบเสร็จ');
                      var cflag = 1;
                    }
                  }
                  confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
                   
                    confirmBox2.setConfig({
                        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                        if (resp.success==true){
                          //ประเภทเงิน เบ็ดเตล็ดอื่นๆ เพิ่มปุ่ม ลบ ยกเลิก
                          if(this.delIndex=='cancel'){
                            var student = JSON.stringify({
                              "receipt_running" : this.result.receipt_running,
                              "cancel_flag" : cflag,
                              "userToken" : this.userData.userToken
                            });
                          }else{
                            var student = JSON.stringify({
                              "receipt_running" : this.receiptDetailData[this.delIndex].receipt_running,
                              "cancel_flag" : cflag,
                              "userToken" : this.userData.userToken
                            });
                          }
                          
                          console.log(student)
                          this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/cancelReceipt', student).subscribe(
                            (response) =>{
                              let getDataOptions : any = JSON.parse(JSON.stringify(response));
                              console.log(getDataOptions)
                              const confirmBox3 = new ConfirmBoxInitializer();
                              confirmBox3.setTitle('ข้อความแจ้งเตือน');
                              if(getDataOptions.result==1){
                                  //-----------------------------//
                                  if(!cflag)
                                    confirmBox3.setMessage('ยกเลิกการยกเลิกรายการใบเสร็จเรียบร้อยแล้ว');
                                  else
                                    confirmBox3.setMessage('ยกเลิกรายการใบเสร็จเรียบร้อยแล้ว');
                                  confirmBox3.setButtonLabels('ตกลง');
                                  confirmBox3.setConfig({
                                      layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.searchData(1);
                                    }
                                    subscription3.unsubscribe();
                                  });
                                  //-----------------------------//
                  
                              }else{
                                //-----------------------------//
                                  confirmBox3.setMessage(getDataOptions.error);
                                  confirmBox3.setButtonLabels('ตกลง');
                                  confirmBox3.setConfig({
                                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.SpinnerService.hide();
                                    }
                                    subscription3.unsubscribe();
                                  });
                                //-----------------------------//
                              }
                  
                            },
                            (error) => {}
                          )
                        }
                        subscription2.unsubscribe();
                    });   
                }
                this.closebutton.nativeElement.click();
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

    submitConfirmForm(){
      var chkForm = JSON.parse(this.child2.ChildTestCmp());
    
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
  
      if(!chkForm.password){
        confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            //this.SpinnerService.hide();
          }
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
            //this.SpinnerService.hide();
          }
          subscription.unsubscribe();
        });
      }else{
        
          var student = JSON.stringify({
            "password" : chkForm.password,
            "log_remark" : chkForm.log_remark,
            "userToken" : this.userData.userToken
          });

          this.http.post('/'+this.userData.appName+'Api/API/checkReceiptPassword', student ).subscribe(
            posts => {
              let productsJson : any = JSON.parse(JSON.stringify(posts));
              console.log(productsJson)
              if(productsJson.result==1){
                if(this.modalType==12){
                  this.loginEdit = 1;
                }else if(this.modalType==13){
                  var delData = this.checkListObj[this.delIndex];
                  delData["userToken"] = this.userData.userToken;
                  console.log(delData)
                  this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/delCheckList', delData ).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      console.log(alertMessage)
                      if(alertMessage.result==0){
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            this.closebutton.nativeElement.click();
                          }
                          subscription.unsubscribe();
                        });
                      }else{
                        this.closebutton.nativeElement.click();
                        this.searchDataCheck(); 
                      }
                    },
                    (error) => {}
                  )
                }else if(this.modalType==14){
                  var delData = this.creditObj[this.delIndex];
                  delData["userToken"] = this.userData.userToken;
                  console.log(delData)
                  this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/delCreditCard', delData ).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      console.log(alertMessage)
                      if(alertMessage.result==0){
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            this.closebutton.nativeElement.click();
                          }
                          subscription.unsubscribe();
                        });
                      }else{
                        this.closebutton.nativeElement.click();
                        this.searchDataCredit(); 
                      }
                    },
                    (error) => {}
                  )
                }else if(this.modalType==15){
                  var delData = this.forfeitDefObj[this.delIndex];
                  delData["userToken"] = this.userData.userToken;
                  console.log(delData)
                  this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/delForfeitDef', delData ).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      console.log(alertMessage)
                      if(alertMessage.result==0){
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            this.closebutton.nativeElement.click();
                          }
                          subscription.unsubscribe();
                        });
                      }else{
                        this.closebutton.nativeElement.click();
                        this.searchData(3);
                      }
                    },
                    (error) => {}
                  )
                }else if(this.modalType==16){
                  var delData = this.receiptDetailObj[this.delIndex];
                  delData["userToken"] = this.userData.userToken;
                  console.log(delData)
                  this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/delReceiptDetail', delData ).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      console.log(alertMessage)
                      if(alertMessage.result==0){
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            this.closebutton.nativeElement.click();
                          }
                          subscription.unsubscribe();
                        });
                      }else{
                        this.closebutton.nativeElement.click();
                        this.searchData(3);
                      }
                    },
                    (error) => {}
                  )
                }else if(this.modalType==17){
                  if(this.delIndex=='del')
                    var delData = this.result;
                  else
                    var delData = this.receiptDetailData[this.delIndex];
                  delData["userToken"] = this.userData.userToken;
                  console.log(delData)
                  this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/delReceipt', delData ).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      console.log(alertMessage)
                      if(alertMessage.result==0){
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            this.closebutton.nativeElement.click();
                          }
                          subscription.unsubscribe();
                        });
                      }else{
                        /*this.closebutton.nativeElement.click();
                        this.searchData(1);
                        this.setDefPage();
                        */
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            this.searchData(1);
                            this.setDefPage();
                          }
                          subscription.unsubscribe();
                        });
                        this.closebutton.nativeElement.click();
                      }
                    },
                    (error) => {}
                  )
                }
                this.closebutton.nativeElement.click();
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

    saveData(type:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.result.book_no){
        confirmBox.setMessage('ป้อนข้อมูลเล่มที่ใบเสร็จ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(!this.result.rreceipt_no){
        confirmBox.setMessage('ป้อนข้อมูลเลขที่ใบเสร็จ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(!this.result.rcv_flag){
        confirmBox.setMessage('ป้อนข้อมูลประเภท');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(!this.result.def_name){
        confirmBox.setMessage('ป้อนข้อมูลผู้ชำระเงิน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });		
      }else if((this.result.rcv_flag!='3') && (!this.receiptDetailObj[0].sub_type_name[0])){
        confirmBox.setMessage('ป้อนข้อมูลรายละเอียดเงิน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });		
      }else if((this.result.rcv_flag!='3') && (!this.sum_fee)){
        confirmBox.setMessage('ป้อนข้อมูลจำนวนเงิน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });		
      }else if((this.result.rcv_flag=='3') && (!this.sum_fee)){
        confirmBox.setMessage('ป้อนข้อมูลจำนวนเงิน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });		
      }else if(!this.result.userrcv_id){
        confirmBox.setMessage('ป้อนข้อมูลผู้รับเงิน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });		
      }else if(!this.receiptDetailObj[0].sub_type_id){
        confirmBox.setMessage('เลือกรายละเอียดเงินจาก popup');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });		
      }else{
        var rData = $.extend({},this.result);
        if(rData.item)
          rData.item = rData.item.toString();
        else
          rData.item = null;
        rData.run_id = this.dataHead.run_id?this.dataHead.run_id:0;
        rData.userToken  = this.userData.userToken;
        rData.receipt_running = this.result.receipt_running?this.result.receipt_running:0;
        rData.received_cash = (this.result.received_cash!='0.00' && this.result.received_cash)?parseFloat(this.curencyFormatRemove(this.result.received_cash)):0;
        rData.return_cash = (this.result.return_cash!='0.00' && this.result.return_cash)?parseFloat(this.curencyFormatRemove(this.result.return_cash)):0;
        rData.sum_fee1 = parseFloat(this.sum_fee1)>0?parseFloat(this.curencyFormatRemove(this.sum_fee1)):0;
        rData.sum_pay1 = parseFloat(this.sum_pay1)>0?parseFloat(this.curencyFormatRemove(this.sum_pay1)):0;
        rData.sum_fee = parseFloat(this.sum_fee)>0?parseFloat(this.curencyFormatRemove(this.sum_fee)):0;
        rData.sum_cash = parseFloat(this.sum_cash)>0?parseFloat(this.curencyFormatRemove(this.sum_cash)):0;
        rData.sum_check = parseFloat(this.sum_check)>0?parseFloat(this.curencyFormatRemove(this.sum_check)):0;
        rData.sum_credit = parseFloat(this.sum_credit)>0?parseFloat(this.curencyFormatRemove(this.sum_credit)):0;
        rData.payment_ratio = this.payment_ratio;
        var bar3 = new Promise((resolve, reject) => {
          let forfeitDefObj = JSON.parse(JSON.stringify(this.forfeitDefObj));
          let popped  = forfeitDefObj.pop();
          var bar = new Promise((resolve, reject) => {
            forfeitDefObj.forEach((r:any,index:any,array:any)  =>  {
              r.forfeit_amt = parseFloat(this.curencyFormatRemove(r.forfeit_amt))
              r.jail_day_amt = parseFloat(this.curencyFormatRemove(r.jail_day_amt))
              r.total_amt = parseFloat(this.curencyFormatRemove(r.total_amt))
              r.total_pay = parseFloat(this.curencyFormatRemove(r.total_pay))
              r.pay_amt = parseFloat(this.curencyFormatRemove(r.pay_amt))
            });
          });
          if(bar){
            rData.forfeitDefObj = forfeitDefObj;
          }
          
          console.log(this.receiptDetailObj);
          let receiptDetailObj = JSON.parse(JSON.stringify(this.receiptDetailObj));
          let popped2  = receiptDetailObj.pop();
          var bar2 = new Promise((resolve, reject) => {
            receiptDetailObj.forEach((r:any,index:any,array:any)  =>  {
              console.log(r.cash_amt);
              r.cash_amt = parseFloat(this.curencyFormatRemove(r.cash_amt))
              r.cheque_amt = parseFloat(this.curencyFormatRemove(r.cheque_amt))
              r.credit_amt = parseFloat(this.curencyFormatRemove(r.credit_amt))
              r.rcv_amt = parseFloat(this.curencyFormatRemove(r.rcv_amt))
            });
          });

          if(bar2){
            rData.receiptDetailObj = receiptDetailObj;
          }
        });
        if(bar3){
          console.log(rData)
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/saveData', rData).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){
                  //-----------------------------//
                  confirmBox.setMessage(getDataOptions.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      //this.result.notice_running = getDataOptions.notice_running;
                      this.result.receipt_running = getDataOptions.receipt_running;
                      this.searchData(3);
                      if(this.editReceipt)
                        this.loginEdit = 0;
                      if(type==2)
                        this.printReport(1);
                      console.log("save:"+this.editReceipt+""+this.loginEdit)
                    }
                    subscription.unsubscribe();
                  });
                  //-----------------------------//
              }else{
                //-----------------------------//
                  confirmBox.setMessage(getDataOptions.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                    }
                    subscription.unsubscribe();
                  });
                  
                //-----------------------------//
              }

            },
            (error) => {}
          )
        }
      }
    }



    saveCheckData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.check.check_no){
        confirmBox.setMessage('กรุณาป้อนเลขที่เช็ค');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        var cData = $.extend({},this.check);
        cData.run_id = this.dataHead.run_id?this.dataHead.run_id:0;
        cData.userToken  = this.userData.userToken;
        cData.check_type  = 1;
        cData.receipt_running = this.result.receipt_running?this.result.receipt_running:0;
        console.log(cData)
        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/saveCheckList', cData).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
                //-----------------------------//
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.check = [];
                    //this.searchDataCheck();
                    this.searchData(3);
                  }
                  subscription.unsubscribe();
                });
                //-----------------------------//
            }else{
              //-----------------------------//
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                  }
                  subscription.unsubscribe();
                });
                
              //-----------------------------//
            }

          },
          (error) => {}
        )
      }
    }

    searchDataCheck(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var student = JSON.stringify({
        "receipt_running" : this.result.receipt_running?this.result.receipt_running:0,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/checkListData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              //-----------------------------//
              this.checkListObj = getDataOptions.data;
              this.dtTriggerCheck.next(null);
              //-----------------------------//
          }else{
            //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.checkListObj = [];
                  this.dtTriggerCheck.next(null);
                }
                subscription.unsubscribe();
              });
            //-----------------------------//
          }

        },
        (error) => {}
      )
    }

    saveCreditData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.credit.card_type){
        confirmBox.setMessage('กรุณาเลือกประเภทบัตร');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(!this.credit.card_no){
        confirmBox.setMessage('กรุณาป้อนเลขที่บัตร');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        var cData = $.extend({},this.credit);
        cData.card_type = cData.card_type.toString();
        cData.run_id = this.dataHead.run_id?this.dataHead.run_id:0;
        cData.userToken  = this.userData.userToken;
        cData.receipt_running = this.result.receipt_running?this.result.receipt_running:0;
        console.log(cData)
        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/saveCreditCard', cData).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
                //-----------------------------//
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.credit = [];
                    this.searchData(3);
                    //this.searchDataCredit();
                  }
                  subscription.unsubscribe();
                });
                //-----------------------------//
            }else{
              //-----------------------------//
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                  }
                  subscription.unsubscribe();
                });
                
              //-----------------------------//
            }

          },
          (error) => {}
        )
      }
    }

    searchDataCredit(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var student = JSON.stringify({
        "receipt_running" : this.result.receipt_running?this.result.receipt_running:0,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/creditCardData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              //-----------------------------//
              this.creditObj = getDataOptions.data;
              this.dtTriggerCredit.next(null);
              //-----------------------------//
          }else{
            //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.creditObj = [];
                  this.dtTriggerCredit.next(null);
                }
                subscription.unsubscribe();
              });
            //-----------------------------//
          }

        },
        (error) => {}
      )
    }

    searchDataForfeitDef(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var student = JSON.stringify({
        "receipt_running" : this.result.receipt_running?this.result.receipt_running:0,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/forfeitDefData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              //-----------------------------//
              this.forfeitDefObj = getDataOptions.data;
              this.dtTriggerFof.next(null);
              //-----------------------------//
          }else{
            //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.forfeitDefObj = [];
                  this.dtTriggerFof.next(null);
                }
                subscription.unsubscribe();
              });
            //-----------------------------//
          }

        },
        (error) => {}
      )
    }

    delCheck(index:any){
      //this.delType = 1;
      this.delIndex = index;
      this.clickOpenMyModalComponent(13);
    }
    editCheck(index:any){
      this.SpinnerService.show();
      this.visibleCheck = false;
      this.check = [];
      setTimeout(() => {
        this.check = JSON.parse(JSON.stringify(this.checkListObj[index]));
        this.SpinnerService.hide();
      }, 500);
    }
    visibleCheckList(){
      this.visibleCheck = this.visibleCheck?false:true;
    }
    delCredit(index:any){
      //this.delType = 1;
      this.delIndex = index;
      this.clickOpenMyModalComponent(14);
    }
    editCredit(index:any){
      this.SpinnerService.show();
      this.visibleCredit = false;
      this.credit = [];
      setTimeout(() => {
        this.credit = JSON.parse(JSON.stringify(this.creditObj[index]));
        this.SpinnerService.hide();
      }, 500);
    }
    visibleCreditCard(){
      this.visibleCredit = this.visibleCredit?false:true;
    }
    delForfeitDef(index:any){
      //this.delType = 1;
      this.delIndex = index;
      this.clickOpenMyModalComponent(15);
    }
    delReceiptDetail(index:any){
      
      this.delIndex = index;
      this.clickOpenMyModalComponent(16);
    }
    delReceipt(index:any){
      console.log(this.result);
      this.delIndex = index;
      this.clickOpenMyModalComponent(17);
    }
    delReceiptRecord(index:any){
      console.log(this.result);
      this.delIndex = index;
      this.clickOpenMyModalComponent(18);
    }

    refreshPage(){
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      location.replace(winURL+'ffn0400')
      window.location.reload();
    }


    printReport(type:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.result.receipt_running){
        confirmBox.setMessage('กรุณาเลือกใบเสร็จก่อนการพิมพ์ทุกครั้ง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        if(type==1){
          var rptName = 'rfn1100';
          var paramData ='{}';
          var paramData = JSON.stringify({
            "preceipt_running" : this.result.receipt_running ? this.result.receipt_running : '0',
          });
          console.log(paramData)
        }else if(type==2){
          var rptName = 'rffn1200';
          var paramData ='{}';
          var paramData = JSON.stringify({
            "preceipt_running" : this.result.receipt_running ? this.result.receipt_running : '0',
            "psize" : 2,
            "ptype" : 1,
            "pprint_flag" : 1
          });
          console.log(paramData)
        }else if(type==3){
          var rptName = 'rffn1200';
          var paramData ='{}';
          var paramData = JSON.stringify({
            "preceipt_running" : this.result.receipt_running ? this.result.receipt_running : '0',
            "psize" : 2,
            "ptype" : 1,
            "pprint_flag" : 2
          });
          console.log(paramData)
        }
        // alert(paramData);return false;
        this.editReceipt = 1;
        this.loginEdit = 0;
        this.printReportService.printReport(rptName,paramData);
      }
    }

    printReportIndex(index:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.result.receipt_running){
        confirmBox.setMessage('กรุณาเลือกใบเสร็จก่อนการพิมพ์ทุกครั้ง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
      var rptName = 'rfn1100';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "preceipt_running" : this.receiptDetailData[index].receipt_running ? this.receiptDetailData[index].receipt_running : '0',
        });
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }
    }

    prfn1200Page(type:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.result.receipt_running){
        confirmBox.setMessage('กรุณาเลือกใบเสร็จก่อนการพิมพ์ทุกครั้ง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        let winURL = window.location.href.split("/#/")[0]+"/#/";
        //var name = 'win_'+Math.ceil(Math.random()*1000);
        var name = 'prfn1200';
        console.log(winURL+'prfn1200?receipt_running='+this.result.receipt_running+"&run_id="+this.dataHead.run_id+"&pprint_flag="+type)
        myExtObject.OpenWindowMaxName(winURL+'prfn1200?receipt_running='+this.result.receipt_running+"&run_id="+this.dataHead.run_id+"&pprint_flag="+type,name);
      }
    }
    ffn1600Page(){
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      //var name = 'win_'+Math.ceil(Math.random()*1000);
      var name = 'ffn1600';
      //console.log(winURL+'ffn1600?run_id='+this.dataHead.run_id)
      myExtObject.OpenWindowMaxName(winURL+'ffn1600?run_id='+this.dataHead.run_id,name);
    }

    cancelCheck(event:any){
      console.log(event)
      if(event==true)
        this.cCheck['checked'] = false;
      else
        this.cCheck['checked'] = true;
    }


}







