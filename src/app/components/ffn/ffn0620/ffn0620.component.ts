import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import {ActivatedRoute} from '@angular/router';
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { CaseService,Case } from 'src/app/services/case.service.ts';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import * as $ from 'jquery';
import * as _ from "lodash"
declare var myExtObject: any;

@Component({
  selector: 'app-ffn0620,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './ffn0620.component.html',
  styleUrls: ['./ffn0620.component.css']
})


export class Ffn0620Component implements AfterViewInit, OnInit, OnDestroy {

  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  result:any =  [];
  receiptType:any;
  paybackTitle:any;
  myExtObject: any;
  modalType:any;
  visibleRpt: boolean = false;
  getCaseType:any;
  getPtitle:any;
  getTitle:any;
  getRedTitle:any;
  noticeRptData:any = [];
  noticeRptDataTmp:any = [];
  noticeRptDataForm:any = [];
  checkData:any = [];
  paybackData:any = [];
  receiptIndex:any;
  sum_fee:any;
  sum_feex:any;
  sum_feey:any;
  delIndex:any;
  payback_running:any;
  serarchType:any;//1ค้นจากในรายงาน,2ค้นเลขอ้างอิง

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldName3:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadModalRecComponent : boolean = false;
  public loadPopupPrintChequeComponent : boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('cancel_flag',{static: true}) cancel_flag : ElementRef;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private caseService:CaseService,
    private printReportService: PrintReportService,
  ){ }
   
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy:true
    };

    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[0,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy:true
    };
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      this.payback_running = params['payback_running'];
      //this.searchRefNo(3);
    });

    var student = JSON.stringify({
      "table_name" : "preceipt_type",
      "field_id" : "receipt_type_id",
      "field_name" : "receipt_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.receiptType = getDataOptions;
      },
      (error) => {}
    )

    var student = JSON.stringify({
      "table_name" : "ppayback_title",
      "field_id" : "ref_title",
      "field_name" : "ref_title",
      "order_by" : " pay_type ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.paybackTitle = getDataOptions;
      },
      (error) => {}
    )

    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseType")
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getCaseType = getDataOptions;
      },
      (error) => {}
    )

    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "ptitle",
      "field_id" : "title",
      "field_name" : "title",
      "condition" : "AND special_case IN (1,2,6)",
      "order_by" : " title DESC",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseType")
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getPtitle = getDataOptions;
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
      "url_name" : "ffn0620"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
          this.defaultCaseType = getDataAuthen.defaultCaseType;
          this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
          this.defaultTitle = getDataAuthen.defaultTitle;
          this.defaultRedTitle = getDataAuthen.defaultRedTitle;
          if(!this.payback_running){
            this.setDefPage(1);
          }else{
            this.searchRefNo(3);
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

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTrigger.next(null);
  }
      
 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
     }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

 setDefPage(type:any){
  this.result = [];
  this.noticeRptData = this.noticeRptDataTmp = this.paybackData = this.checkData = [];
  this.noticeRptDataForm = [];
  this.result.pay_type = 1;
  if(type==1){
    setTimeout(() => {
      this.result.ref_title = this.result.ctfin_title = this.paybackTitle[0].fieldIdValue; 
      this.noticeRptDataForm.push({
        'rRunning' : true,
        'items' : 1,
        'case_type' : this.userData.defaultCaseType,
        'title' : this.userData.defaultTitle,
        'red_title' : this.userData.defaultRedTitle,
        'ptitle' : this.getPtitle[0].fieldIdValue,
        'book_no' : null,
        'disabled' : true
      });
      this.rerender();
      this.changeCaseType(0);
    }, 500);
  }else{
    this.result.ref_title = this.result.ctfin_title = this.paybackTitle[0].fieldIdValue; 
    this.noticeRptDataForm.push({
      'rRunning' : true,
      'items' : 1,
      'case_type' : this.userData.defaultCaseType,
      'title' : this.userData.defaultTitle,
      'red_title' : this.userData.defaultRedTitle,
      'ptitle' : this.getPtitle[0].fieldIdValue,
      'book_no' : null,
      'disabled' : true
    });
    this.rerender();
    this.changeCaseType(0);
    location.replace(window.location.href.split("/#/")[0]+"/#/ffn0620");
  }
  this.noticeRptDataTmp = JSON.parse(JSON.stringify(this.noticeRptDataForm)); 
  this.result.ref_yy = this.result.ctfin_yy = myExtObject.curYear(); 
  this.result.pay_date = myExtObject.curDate();
  this.sum_feex = this.sum_feey = this.sum_fee = 0;
 }

 changeCaseType(i:any){
  if(this.userData.defaultCaseType == this.noticeRptDataForm[i].case_type)
    this.noticeRptDataForm[i].title = this.userData.defaultTitle;
  else 
    this.noticeRptDataForm[i].title = this.getTitle[0].fieldIdValue;
  this.noticeRptDataForm[i].id = '';
  this.noticeRptDataForm[i].yy = '';

  if(this.userData.defaultCaseType == this.noticeRptDataForm[i].case_type)
    this.noticeRptDataForm[i].red_title = this.userData.defaultRedTitle;
  else 
    this.noticeRptDataForm[i].red_title = this.getRedTitle[0].fieldIdValue;
  this.noticeRptDataForm[i].red_id = '';
  this.noticeRptDataForm[i].red_yy = '';

  this.noticeRptDataForm[i].ptitle = this.getPtitle[0].fieldIdValue;
  this.noticeRptDataForm[i].pid = '';
  this.noticeRptDataForm[i].pyy = '';
    //========================== ptitle ====================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='"+this.noticeRptDataForm[i].case_type+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getTitle = getDataOptions;

        if(this.noticeRptDataForm[i].case_type == this.userData.defaultCaseType)
          this.noticeRptDataForm[i].title = this.userData.defaultTitle;
        else
          this.noticeRptDataForm[i].title = this.getTitle[0].fieldIdValue;

      },
      (error) => {}
    )

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='2' AND case_type='"+this.noticeRptDataForm[i].case_type+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.getRedTitle = getDataOptions;
          
          if(this.noticeRptDataForm[i].case_type == this.userData.defaultCaseType)
            this.noticeRptDataForm[i].red_title = this.userData.defaultRedTitle;
          else
            this.noticeRptDataForm[i].red_title = this.getRedTitle[0].fieldIdValue;
            
        },
        (error) => {}
      )


 }

 runId(){
   //if(!this.result.ref_id){
    var student = JSON.stringify({
      "ref_title" : this.result.ref_title,
      "ref_yy" : this.result.ref_yy,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0620/runRefNo', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result==1 && getDataOptions.ref_id){
          this.result.ref_id = getDataOptions.ref_id;
        }else{
          this.result.ref_id = '';
        }
      },
      (error) => {}
    )
   //}
 }

 directiveDate(date:any,obj:any){
  this.result[obj] = date;
}


closeModal(){
  this.loadModalComponent = false;
  this.loadModalConfComponent = false;
  this.loadModalJudgeComponent = false;
  this.loadModalRecComponent = false;
  this.loadPopupPrintChequeComponent = false;
  if(this.modalType==11){
    if(!this.result.cFlag)
      this.cancel_flag.nativeElement.checked = false;
  }
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
        "user_running" : this.userData.userRunning,
        "password" : chkForm.password,
        "log_remark" : chkForm.log_remark,
        "userToken" : this.userData.userToken
      });

      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student ).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          if(productsJson.result==1){
            if(this.modalType==7){//ข้อมูลการสั่งจ่าย
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูลรายการสั่งจ่ายเงิน');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              // Choose layout color type
              confirmBox2.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  
                  this.SpinnerService.show();
                  let headers = new HttpHeaders();
                  headers = headers.set('Content-Type','application/json');
                  
                  var dataDel = [];
                      dataDel['log_remark'] = chkForm.log_remark;
                      dataDel['payback_running'] = this.result.payback_running;
                      dataDel['userToken'] = this.userData.userToken;

                      var data = $.extend({}, dataDel);
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0620/delPayback', data ).subscribe(
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
                            confirmBox.setMessage(alertMessage.error);
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.setDefPage(2);
                              }
                              subscription.unsubscribe();
                            });
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
                      
  
                }
                subscription2.unsubscribe();
              });
            }else if(this.modalType==8){//ข้อมูลในรายงาน
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูล');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              // Choose layout color type
              confirmBox2.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  
                  this.SpinnerService.show();
                  let headers = new HttpHeaders();
                  headers = headers.set('Content-Type','application/json');
                  
                  var dataDel = [];
                      dataDel['log_remark'] = chkForm.log_remark;
                      dataDel['returnReceiptObj'] = [this.noticeRptData[this.delIndex]];
                      dataDel['userToken'] = this.userData.userToken;

                      var data = $.extend({}, dataDel);
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0620/delReturnReceipt', data ).subscribe(
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
                            confirmBox.setMessage(alertMessage.error);
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.reloadNewPage();
                                //this.setDefPage(2);
                              }
                              subscription.unsubscribe();
                            });
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
                }
                subscription2.unsubscribe();
              });
            }else if(this.modalType==9){//ข้อมูลเช็ค
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูล');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              // Choose layout color type
              confirmBox2.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  
                  this.SpinnerService.show();
                  let headers = new HttpHeaders();
                  headers = headers.set('Content-Type','application/json');
                  
                  var dataDel = [];
                      dataDel['log_remark'] = chkForm.log_remark;
                      dataDel['checkListObj'] = [this.checkData[this.delIndex]];
                      dataDel['userToken'] = this.userData.userToken;

                      var data = $.extend({}, dataDel);
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0620/delCheckList', data ).subscribe(
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
                            confirmBox.setMessage(alertMessage.error);
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.reloadNewPage();
                                //this.setDefPage(2);
                              }
                              subscription.unsubscribe();
                            });
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
                }
                subscription2.unsubscribe();
              });
            }else if(this.modalType==10){//ข้อมูลผู้รับเงิน
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูล');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              // Choose layout color type
              confirmBox2.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  
                  this.SpinnerService.show();
                  let headers = new HttpHeaders();
                  headers = headers.set('Content-Type','application/json');
                  
                  var dataDel = [];
                      dataDel['log_remark'] = chkForm.log_remark;
                      dataDel['paybackRcvObj'] = [this.paybackData[this.delIndex]];
                      dataDel['userToken'] = this.userData.userToken;

                      var data = $.extend({}, dataDel);
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0620/delPaybackRcv', data ).subscribe(
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
                            confirmBox.setMessage(alertMessage.error);
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.reloadNewPage();
                                //this.setDefPage(2);
                              }
                              subscription.unsubscribe();
                            });
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
                }
                subscription2.unsubscribe();
              });
            }else if(this.modalType==11){
              this.result.cFlag = 1;
              this.closebutton.nativeElement.click();
            }
            
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

tabChangeInput(name:any,event:any){
  if(name=='mng_id'){
    this.modalType=1;
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "field_name2" : "post_id",
      "condition" : " AND off_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.result.mng_name = productsJson[0].fieldNameValue;
        this.getPost(productsJson[0].fieldNameValue2);
      }else{
        this.result.mng_id = '';
        this.result.mng_name = '';
      }
      },
      (error) => {}
    )
  }else if(name=='judge_id'){
    this.modalType=2;
    var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "field_name2" : "post_id",
      "condition" : " AND judge_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.result.judge_name = productsJson[0].fieldNameValue;
        this.getPost(productsJson[0].fieldNameValue2);
      }else{
        this.result.judge_id = '';
        this.result.judge_name = '';
      }
      },
      (error) => {}
    )
  }else if(name=='usermng_id'){
    this.modalType=3;
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
        this.result.usermng_name = productsJson[0].fieldNameValue;
      }else{
        this.result.usermng_id = '';
        this.result.usermng_name = '';
      }
      },
      (error) => {}
    )
  }else if(name=='to_dep'){
    this.modalType=4;
    var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "condition" : " AND dep_code='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.result.to_dep_name = productsJson[0].fieldNameValue;
      }else{
        this.result.to_dep = '';
        this.result.to_dep_name = '';
      }
      },
      (error) => {}
    )
  }

}
clickOpenMyModalComponent(type:any){
  if((type==5) && !this.noticeRptDataForm[this.receiptIndex].run_id){
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
    if(this.modalType==11){
      if(!this.result.cFlag && this.result.payback_running)
        this.openbutton.nativeElement.click();
    }else{
      this.openbutton.nativeElement.click();
    }
  }
}
loadMyModalComponent(){
  $("#exampleModal").find(".modal-dialog").css({"left":"0px","top":"0px"});
  if(this.modalType==1 || this.modalType==3){
    $("#exampleModal").find(".modal-content").css("width","650px");
    $("#exampleModal").find(".modal-content").css("margin","100px !important");
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "field_name2" : "post_id",
      "userToken" : this.userData.userToken
    });    
    this.listTable='pofficer';
    this.listFieldId='off_id';
    this.listFieldName='off_name';
    this.listFieldCond="";
  }else if(this.modalType==2){
    $("#exampleModal").find(".modal-content").css("width","650px");
    $("#exampleModal").find(".modal-content").css("margin","100px !important");
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = true;
    this.loadModalRecComponent = false;
    this.loadPopupPrintChequeComponent = false;
    this.loadModalComponent = false;
    var student = JSON.stringify({
      "cond":2,
      "userToken" : this.userData.userToken
    });
    this.listTable='pjudge';
    this.listFieldId='judge_id';
    this.listFieldName='judge_name';
    this.listFieldNull='';
    this.listFieldType=JSON.stringify({"type":2});
    console.log(student)
    let headers = new HttpHeaders();
   headers = headers.set('Content-Type','application/json');
   
   this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
       (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.data.length){
          this.list = productsJson.data;
          console.log(this.list)
        }else{
          this.list = [];
        }
       },
       (error) => {}
     )
  }if(this.modalType==4){
    $("#exampleModal").find(".modal-content").css("width","650px");
    $("#exampleModal").find(".modal-content").css("margin","100px !important");
    var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "userToken" : this.userData.userToken
    });    
    this.listTable='pdepartment';
    this.listFieldId='dep_code';
    this.listFieldName='dep_name';
    this.listFieldCond="";
  }if(this.modalType==5){
    $("#exampleModal").find(".modal-content").css({"width":screen.width-100+'px',"margin":"100px auto !important"});
    //alert(this.receiptIndex)
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalRecComponent = true;
    this.loadPopupPrintChequeComponent = false;
    this.loadModalComponent = false;
    myExtObject.openModalDraggable($("#exampleModal"));
  }else if(this.modalType==6){
    $("#exampleModal").find(".modal-content").css("width","650px");
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalRecComponent = false;
    this.loadPopupPrintChequeComponent = true;
    this.loadModalComponent = false;
  }else if(this.modalType==7 || this.modalType==8 || this.modalType==9 || this.modalType==10 || this.modalType==11){
    $("#exampleModal").find(".modal-content").css("width","650px");
    this.loadModalConfComponent = true;
    this.loadModalJudgeComponent = false;
    this.loadModalRecComponent = false;
    this.loadPopupPrintChequeComponent = false;
    this.loadModalComponent = false;
  }

  if(this.modalType==1 || this.modalType==3 || this.modalType==4){
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
      (response) =>{
        console.log(response)
        this.list = response;
          this.loadModalConfComponent = false;
          this.loadModalJudgeComponent = false;
          this.loadModalRecComponent = false;
          this.loadPopupPrintChequeComponent = false;
          this.loadModalComponent = true;
      },
      (error) => {}
    )
  }
}

receiveRecListData(event:any){
  //alert(this.receiptIndex)
  console.log(event)
  this.noticeRptDataForm[this.receiptIndex].book_no = event.book_no;
  this.noticeRptDataForm[this.receiptIndex].rreceipt_no = event.rreceipt_no;
  this.noticeRptDataForm[this.receiptIndex].sub_type_id = event.sub_type_id;
  this.noticeRptDataForm[this.receiptIndex].sub_type_name = event.sub_type_name;
  this.noticeRptDataForm[this.receiptIndex].remark = event.remark;
  // this.noticeRptDataForm[this.receiptIndex].remain_amt = event.sum_fee;
  this.noticeRptDataForm[this.receiptIndex].sum_fee = event.sum_fee;
  this.noticeRptDataForm[this.receiptIndex].pay_amt = event.remain_amt;
  this.noticeRptDataForm[this.receiptIndex].receipt_item = event.item;

  this.noticeRptDataForm[this.receiptIndex].receipt_running = event.receipt_running;
  this.noticeRptDataForm[this.receiptIndex].receipt_type_id = event.receipt_type_id;
  this.sumNoticeRptForm(2);
  this.closebutton.nativeElement.click();
}

receiveFuncListData(event:any){
  if(this.modalType==1){
    this.result.mng_id = event.fieldIdValue;
    this.result.mng_name = event.fieldNameValue;
    this.getPost(event.fieldNameValue2);
  }else if(this.modalType==3){
    this.result.usermng_id = event.fieldIdValue;
    this.result.usermng_name = event.fieldNameValue;
  }else if(this.modalType==4){
    this.result.to_dep = event.fieldIdValue;
    this.result.to_dep_name = event.fieldNameValue;
  }
  this.closebutton.nativeElement.click();
}

receiveJudgeListData(event:any){
  this.result.judge_id = event.judge_id;
  this.result.judge_name = event.judge_name;
  this.getPost(event.post_id);
  this.closebutton.nativeElement.click();
}

receiveFuncPrintCheque(event:any){
  this.printCheque(event);
  this.closebutton.nativeElement.click();
}

printCheque(event:any){
var rptName = 'rfn0601';
var paramData = JSON.stringify({
 "ppayback_running" : this.result.payback_running,
 "pbook_no" : this.result.book_no,
 "pcheck_no" : this.result.check_no,
 "ppay" : event.ppay,
 "pmark" : event.pmark,
 "pcase" : event.pcase,
 "pdate" : event.pdate,
 "pbank" : event.pbank,
 "pline" : event.pline,
 "pline_unit" : event.pline_unit
});
console.log(paramData);
this.printReportService.printReport(rptName,paramData);
}

getPost(post_id:any){
  if(post_id){
    var student = JSON.stringify({
      "table_name" : "pposition",
      "field_id" : "post_id",
      "field_name" : "post_name",
      "condition" : " AND post_id='"+post_id+"'",
      "userToken" : this.userData.userToken
    });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        console.log(this.modalType)
        if(productsJson.length){
          if(this.modalType==1)
            this.result.mng_post_name = productsJson[0].fieldNameValue;
          else if (this.modalType==2)
            this.result.judge_post_name = productsJson[0].fieldNameValue;
        }else{
          if(this.modalType==1)
            this.result.mng_post_name = '';
          else if (this.modalType==2)
            this.result.judge_post_name = '';
        }
        },
        (error) => {}
      )
  }
}

postJudgeName(checked:any){
  if(checked==true){
    this.result.judge_post_name = 'ผู้พิพากษา';
  }else{
    this.result.judge_post_name = '';
  }
}

searchNoticeRunNoRPT(){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  if(this.result.run_no && this.result.run_yy){
    var student = JSON.stringify({
      "run_no" : this.result.run_no,
      "run_yy" : this.result.run_yy,
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0620/searchRunNo', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.data.length){
          var bar = new Promise((resolve, reject) => {
          this.noticeRptData = getDataOptions.data;
          this.noticeRptData.forEach((x : any ) => x.rRunning = true);
          });
          if(bar){
            this.noticeRptDataTmp = JSON.parse(JSON.stringify(this.noticeRptData));
            //this.noticeRptDataTmp.forEach((x : any ) => x.rNew = true);
            var item = this.noticeRptData.length+1;
            this.noticeRptDataForm.forEach((r:any,index:any,array:any)  =>  {
              r.items = item++;
            });
            this.serarchType = 1;
            this.sumNoticeRptForm(1);
            this.rerender();
          }
          
        }else{
          this.noticeRptData = [];
          this.sumNoticeRptForm(1);
          this.rerender();
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
  }else{
    confirmBox.setMessage('กรุณาระบุเลขอ้างอิงให้ครบถ้วน');
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

searchRefNo(type:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  
  if(type==1 && this.result.ref_id && this.result.ref_yy){
    if(this.result.ref_id && this.result.ref_yy){
      var student = JSON.stringify({
        "ref_title" : this.result.ref_title,
        "ref_id" : this.result.ref_id,
        "ref_yy" : this.result.ref_yy,
        "userToken" : this.userData.userToken
      });
      this.searchRefCommit(student,type);
    }else{
      confirmBox.setMessage('กรุณาระบุเลขอ้างอิงให้ครบถ้วน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
    
  }else if(type==2){
    if(this.result.ctfin_id && this.result.ctfin_yy){
      var student = JSON.stringify({
        "ctfin_title" : this.result.ctfin_title,
        "ctfin_id" : this.result.ctfin_id,
        "ctfin_yy" : this.result.ctfin_yy,
        "userToken" : this.userData.userToken
      });
      this.searchRefCommit(student,type);
    }else{
      confirmBox.setMessage('กรุณาระบุเลขอ้างอิงให้ครบถ้วน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
  }else if(type==3 && this.payback_running){
    var student = JSON.stringify({
      "payback_running" : this.payback_running,
      "userToken" : this.userData.userToken
    });
    this.searchRefCommit(student,type);
  }
}

searchRefCommit(json:any,type:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0620/getPaybackData', json ).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      console.log(getDataOptions)
      if(getDataOptions.data.length){
        var bar = new Promise((resolve, reject) => {
          //===========================================form สั่งจ่าย
          this.result = [];
          this.result = getDataOptions.data[0];
          if(!this.result.ctfin_title)
            this.result.ctfin_title = this.paybackTitle[0].fieldIdValue; 
          if(this.result.sum_cash)
            this.result.sum_cash = this.curencyFormat(this.result.sum_cash,2);
          if(this.result.sum_check)
            this.result.sum_check = this.curencyFormat(this.result.sum_check,2);
          //===========================================data ใบเสร็จ
          if(getDataOptions.data[0].returnReceiptObj.length){
            var _bar = new Promise((resolve, reject) => {
            
            this.noticeRptDataForm = getDataOptions.data[0].returnReceiptObj;
            //this.noticeRptDataForm.forEach((x : any ) => x.rRunning = true);
            this.noticeRptDataForm.forEach((r:any,index:any,array:any)  =>  {
              r.rRunning = true,
              r.items =  index+1
            });
            });
            if(_bar){
              //this.noticeRptDataTmp = JSON.parse(JSON.stringify(this.noticeRptDataForm));         
              this.sumNoticeRptForm(1);
            }
          }else{
            this.noticeRptDataForm = [];
            this.sumNoticeRptForm(1);
          }
            //===========================================data ข้อมูลเงื่อนไขในรายงาน
            //console.log(this.noticeRptDataForm.length)
            if(type==3){
              if(this.noticeRptDataForm.length){
                this.noticeRptDataForm.forEach((r:any,index:any,array:any)  =>  {
                  r.items =  index+1
                });
              }
              this.noticeRptDataForm.push({
                'rRunning' : true,
                'items' : this.noticeRptDataForm.length?this.noticeRptDataForm.length+1:1,
                'case_type' : this.userData.defaultCaseType,
                'title' : this.userData.defaultTitle,
                'red_title' : this.userData.defaultRedTitle,
                'ptitle' : this.getPtitle[0].fieldIdValue,
                'book_no' : null,
                'disabled' : true
              });

            }else{
              if(this.noticeRptDataForm.length){
                this.noticeRptDataForm.forEach((r:any,index:any,array:any)  =>  {
                  r.items =  index+1
                });
              }
              /*
              this.noticeRptDataForm.forEach((r:any,index:any,array:any)  =>  {
                r.items =  index+1
              });*/
              this.noticeRptDataForm.push({
                'rRunning' : true,
                'items' : this.noticeRptDataForm.length?this.noticeRptDataForm.length+1:1,
                'case_type' : this.userData.defaultCaseType,
                'title' : this.userData.defaultTitle,
                'red_title' : this.userData.defaultRedTitle,
                'ptitle' : this.getPtitle[0].fieldIdValue,
                'book_no' : null,
                'disabled' : true
              });
            }
            

           //===========================================data เช็ค
           if(getDataOptions.data[0].checkListObj.length){
            var __bar = new Promise((resolve, reject) => {
            this.checkData = getDataOptions.data[0].checkListObj;
            //this.checkData.forEach((x : any ) => x.cRunning = true);
            });
            if(__bar){

            }
          }else{
            this.checkData = [];
          }
          //===========================================data ผู้รับเงิน
          if(getDataOptions.data[0].paybackRcvObj.length){
            var ___bar = new Promise((resolve, reject) => {
            this.paybackData = getDataOptions.data[0].paybackRcvObj;
            //this.checkData.forEach((x : any ) => x.cRunning = true);
            });
            if(___bar){

            }
          }else{
            this.paybackData = [];
          }
        });
        if(bar){
          this.noticeRptDataTmp = JSON.parse(JSON.stringify(this.noticeRptDataForm)); 
          //console.log(9999)
          this.rerender();
          this.serarchType = 2;
          location.replace(window.location.href.split("/#/")[0]+"/#/ffn0620");
          /*
          var item = this.noticeRptData.length+1;
          this.noticeRptDataForm.forEach((r:any,index:any,array:any)  =>  {
            r.items = item++;
          });
          this.sumNoticeRptForm();
          this.rerender();
          */
        }
        
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


async searchCaseNo(type:any,i:any): Promise<void> {
  //type:any,all_data:any,run_id:any,case_type:any,title:any,id:any,yy:any
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var objCase = [];
  if(type==1){
    objCase["type"] = 1;
    objCase["case_type"] = this.noticeRptDataForm[i].case_type;
    objCase["all_data"] = 0;
    objCase["getJudgement"] = 0;
    objCase["run_id"] = 0;
    objCase["title"] = this.noticeRptDataForm[i].title;
    objCase["id"]= this.noticeRptDataForm[i].id;
    objCase["yy"]= this.noticeRptDataForm[i].yy;
    const cars = await this.caseService.searchCaseNo(objCase);
    console.log(cars)
    if(cars['result']==1){
      this.addNoticeRptForm(i);
      var result = JSON.parse(JSON.stringify(cars['data'][0]));
      this.noticeRptDataForm[i].run_id = result.run_id;
      if(result.red_title){
        this.noticeRptDataForm[i].red_title = result.red_title;
      }else{
        if(this.userData.defaultCaseType == this.noticeRptDataForm[i].case_type)
          this.noticeRptDataForm[i].red_title = this.userData.defaultRedTitle;
        else 
          this.noticeRptDataForm[i].red_title = this.getRedTitle[0].fieldIdValue;
      }
        this.noticeRptDataForm[i].red_id = result.red_id?result.red_id:'';
        this.noticeRptDataForm[i].red_yy = result.red_yy?result.red_yy:'';
    }else{
      confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.noticeRptDataForm[i].yy = '';
        }
        subscription.unsubscribe();
      });
    }
  }else if(type==2){
    objCase["type"] = 2;
    objCase["case_type"] = this.noticeRptDataForm[i].case_type;
    objCase["all_data"] = 0;
    objCase["getJudgement"] = 0;
    objCase["run_id"] = 0;
    objCase["title"] = this.noticeRptDataForm[i].red_title;
    objCase["id"]= this.noticeRptDataForm[i].red_id;
    objCase["yy"]= this.noticeRptDataForm[i].red_yy;
    const cars = await this.caseService.searchCaseNo(objCase);
    console.log(cars)
    if(cars['result']==1){
      this.addNoticeRptForm(i);
      var result = JSON.parse(JSON.stringify(cars['data'][0]));
      this.noticeRptDataForm[i].run_id = result.run_id;
      if(result.title){
        this.noticeRptDataForm[i].title = result.title;
      }else{
        if(this.userData.defaultCaseType == this.noticeRptDataForm[i].case_type)
          this.noticeRptDataForm[i].title = this.userData.defaultTitle;
        else 
          this.noticeRptDataForm[i].title = this.getTitle[0].fieldIdValue;
      }
      this.noticeRptDataForm[i].id = result.id?result.id:'';
      this.noticeRptDataForm[i].yy = result.yy?result.yy:'';
    }else{
      confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.noticeRptDataForm[i].red_yy = '';
        }
        subscription.unsubscribe();
      });
    }
  }else if(type==3){
    
    objCase["type"] = 3;
    //objCase["run_id"] = this.run_id;
    objCase["all_data"] = 0;
    objCase["getJudgement"] = 0;
    const cars = await this.caseService.searchCaseNo(objCase);
    console.log(cars)
    if(cars['result']==1){
      var result = JSON.parse(JSON.stringify(cars['data'][0]));
      this.noticeRptDataForm[i].run_id = result.run_id;
      this.addNoticeRptForm(i);
    }else{
      confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.setDefHead();
        }
        subscription.unsubscribe();
      });
    }
  }else if(type==4){
    objCase["type"] = 4;
    objCase["case_type"] = this.noticeRptDataForm[i].case_type;
    objCase["all_data"] = 0;
    objCase["getJudgement"] = 0;
    objCase["run_id"] = 0;
    objCase["ptitle"] = this.noticeRptDataForm[i].ptitle;
    objCase["pid"]= this.noticeRptDataForm[i].pid;
    objCase["pyy"]= this.noticeRptDataForm[i].pyy;
    const cars = await this.caseService.searchCaseNo(objCase);
    console.log(cars)
    if(this.userData.defaultCaseType == this.noticeRptDataForm[i].case_type)
      this.noticeRptDataForm[i].title = this.userData.defaultTitle;
    else 
      this.noticeRptDataForm[i].title = this.getTitle[0].fieldIdValue;
    this.noticeRptDataForm[i].id = '';
    this.noticeRptDataForm[i].yy = '';

    if(this.userData.defaultCaseType == this.noticeRptDataForm[i].case_type)
      this.noticeRptDataForm[i].red_title = this.userData.defaultRedTitle;
    else 
      this.noticeRptDataForm[i].red_title = this.getRedTitle[0].fieldIdValue;
    this.noticeRptDataForm[i].red_id = '';
    this.noticeRptDataForm[i].red_yy = '';
    if(cars['result']==1){
      var result = JSON.parse(JSON.stringify(cars['data'][0]));
      this.noticeRptDataForm[i].run_id = result.run_id;
      this.addNoticeRptForm(i);
    }else{
      confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.noticeRptDataForm[i].pyy = '';
        }
        subscription.unsubscribe();
      });
    }
  }
}




addNoticeRptForm(i:any){
  var index = i+this.noticeRptData.length;
  console.log(i)
  //console.log((i+1)+":"+(this.noticeRptDataForm.length + this.noticeRptData.length))
  if((index+1)==(this.noticeRptDataForm.length + this.noticeRptData.length)){
    const item = this.noticeRptDataForm.reduce((prev:any, current:any) => (+prev.items > +current.items) ? prev : current)
    this.noticeRptDataForm.push({
      'rRunning' : true,
      'items' : item.items+1,
      'case_type' : this.userData.defaultCaseType,
      'title' : this.userData.defaultTitle,
      'red_title' : this.userData.defaultRedTitle,
      'ptitle' : this.getPtitle[0].fieldIdValue,
      'book_no' : null,
      'disabled' : true
    });
    this.noticeRptDataForm[i].disabled = false;
    //console.log(this.noticeRptDataForm)
    this.rerender();
  }
}

sumNoticeRptForm(type:any){
  var countData = this.noticeRptData.filter(item => item.book_no !== null).length;
  var countForm = this.noticeRptDataForm.filter(item => item.book_no !== null).length;
  this.sum_feex = countData+countForm;

  let sum_feey=0;
  let sum_fee=0;
  var bar = new Promise((resolve, reject) => {
    this.noticeRptData.forEach((r:any,index:any,array:any)  => {
      var s = this.curencyFormatRemove(r.sum_fee);
      // var s = this.curencyFormatRemove(r.remain_amt);
      var t = this.curencyFormatRemove(r.pay_amt);
      if(s)
        sum_feey = sum_feey + parseFloat(s);
      if(t)
        sum_fee = sum_fee + parseFloat(t);
      //sum_feey = sum_feey + parseFloat(this.curencyFormatRemove(r.remain_amt));
      //console.log(sum_feey)
    });
    this.noticeRptDataForm.forEach((r:any,index:any,array:any)  => {
      var s = this.curencyFormatRemove(r.sum_fee);
      // var s = this.curencyFormatRemove(r.remain_amt);
      var t = this.curencyFormatRemove(r.pay_amt);
      if(s)
        sum_feey = sum_feey + parseFloat(s);
      if(t)
        sum_fee = sum_fee + parseFloat(t);
      //sum_feey = sum_feey + parseFloat(this.curencyFormatRemove(r.remain_amt));
      //console.log(sum_feey)
    });
  });
  if(bar){
    this.sum_feey = this.curencyFormat(sum_feey,2);
    this.sum_fee = this.curencyFormat(sum_fee,2);
    if(type==2)
      this.result.sum_cash = this.sum_fee;
    //console.log(sum_feey);
  }
  //console.log(this.noticeRptData.map(pay => this.curencyFormatRemove(pay.remain_amt)).reduce((acc, amount) => acc + amount))
  //this.sum_feey = this.curencyFormat(this.noticeRptData.map(pay => parseFloat(this.curencyFormatRemove(pay.remain_amt))).reduce((acc, amount) => acc + amount),2);
  //this.sum_fee = this.curencyFormat(this.noticeRptData.map(pay => parseFloat(this.curencyFormatRemove(pay.pay_amt))).reduce((acc, amount) => acc + amount),2);
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

gotoCheckPage(){
  if(!this.result.payback_running){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ไม่พบรายการสั่งจ่ายเงิน กรุณาค้นหาข้อมูล');
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
    var name = 'ffn0420';
    var sum_fee = this.curencyFormatRemove(this.sum_fee);
    if(sum_fee.indexOf('.00')!=-1)
      sum_fee = sum_fee.split('.')[0];
    myExtObject.OpenWindowMaxName(winURL+'ffn0420?payback_running='+this.result.payback_running+"&run_id="+this.result.run_id+"&pay_flag=2&rcv_amt="+sum_fee,name);
  }
}

gotoReceiptPage(){
  if(!this.result.payback_running){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ไม่พบรายการสั่งจ่ายเงิน กรุณาค้นหาข้อมูล');
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
    var name = 'ffn0421';
    myExtObject.OpenWindowMaxName(winURL+'ffn0421?payback_running='+this.result.payback_running+"&run_id="+this.result.run_id+"&pay_flag=2&rcv_amt="+this.result.sum_check,name);
  }
}
difference(object:any, base:any) {
  return transform(object, (result:any, value, key) => {
    if (!isEqual(value, base[key])) {
      //result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
      result[key] = isObject(value) && isObject(base[key]) ? key : null;
      //result[key] = key;
    }
  });
}

saveData(){
  console.log(this.noticeRptDataTmp)
  console.log(this.noticeRptDataForm)
  var saveArray = [];
    var _bar = new Promise((resolve, reject) => {
      if(this.serarchType==1)
        var student = this.difference(this.noticeRptDataTmp,this.noticeRptData);
      else
        var student = this.difference(this.noticeRptDataTmp,this.noticeRptDataForm);
      saveArray = $.grep(student,function(n:any){ return n == 0 || n });
    });
    if(_bar){
      console.log(saveArray)
      console.log(this.serarchType)
      var dataSave = this.result;
      dataSave['sum_feex'] = this.curencyFormatRemove(this.sum_feex);
      dataSave['sum_feey'] = this.curencyFormatRemove(this.sum_feey);
      dataSave['sum_fee'] = this.curencyFormatRemove(this.sum_fee);
      dataSave['sum_cash'] = this.curencyFormatRemove(dataSave['sum_cash']);
      dataSave['sum_check'] = this.curencyFormatRemove(dataSave['sum_check']);
      delete dataSave['checkListObj'];
      delete dataSave['paybackRcvObj'];
      var dataTmp=[];
      dataSave['userToken'] = this.userData.userToken;
      var bar = new Promise((resolve, reject) => {
        if(this.serarchType==2){
          for(var i=0;i<saveArray.length;i++){
            dataTmp.push(this.noticeRptDataForm[saveArray[i]]);
          }
        }else{
          this.noticeRptData.forEach((ele, index, array) => {
              if(ele.rRunning == true){
                dataTmp.push(this.noticeRptData[index]);
              }
          });
          for(var i=0;i<this.noticeRptDataForm.length;i++){
            if(this.noticeRptDataForm[i].run_id)
              dataTmp.push(this.noticeRptDataForm[i]);
          }
        }
        
        
      });
      if(bar){
        dataSave['returnReceiptObj'] = dataTmp;
        var data = $.extend({}, dataSave);
        console.log(data)
        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0620/saveData', data ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.result.payback_running = getDataOptions.payback_running;
                  this.reloadNewPage();
                  //this.getObjAccuData();
                }
                subscription.unsubscribe();
              });
            }else{
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(getDataOptions.error);
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
  
}

delData(){
  if(this.result.payback_running){
    this.clickOpenMyModalComponent(7);
  }
}
delDataIndex(i:any,modalType:any){
  this.delIndex = i;
  this.clickOpenMyModalComponent(modalType);
}

reloadNewPage(){
  if(this.result.payback_running){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    window.location.replace(winURL+'/ffn0620?payback_running='+this.result.payback_running);
    location.reload();
  }else{
    this.setDefPage(2);
  }
}

printReport(type:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');

  if(!this.result.payback_running){
    confirmBox.setMessage('ไม่พบรายการสั่งจ่ายเงิน กรุณาค้นหาข้อมูล');
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
    if(type==1){
      var rptName = 'rfn2120';
      var paramData ='{}';
      var paramData = JSON.stringify({
        "ppayback_running" : this.result.payback_running,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName,paramData);
    }else if(type==2){
      var student = JSON.stringify({
        "form_type" : 8,
        "form_id" : 2,
        "run_id" : this.result.run_id,
        "payback_running" : this.result.payback_running,
        "user_running" : this.userData.userRunning,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/openReport', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1 && getDataOptions.file){
            myExtObject.OpenWindowMax(getDataOptions.file);
            this.result.file_exists = 1;
            this.result.file_name = getDataOptions.file.split('file_name=')[1];
          }
          
        },
        (error) => {}
      )
    }else if(type==3){
      var rptName = 'rfn2100';
      var paramData ='{}';
      var paramData = JSON.stringify({
        "ppayback_running" : this.result.payback_running,
        "pposition" : this.userData.postName,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName,paramData);
    }else if(type==4){
      var rptName = 'rfn2110';
      var paramData ='{}';
      var paramData = JSON.stringify({
        "ppayback_running" : this.result.payback_running,
        "pposition" : this.userData.postName,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName,paramData);
    }

    // alert(paramData);return false;
    
  }
}

editCheck(i:any){
  let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = 'ffn0420';
    myExtObject.OpenWindowMaxName(winURL+'ffn0420?payback_running='+this.result.payback_running+"&run_id="+this.result.run_id+"&check_running="+this.checkData[i].check_running,name);
}

editPayback(i:any){
  let winURL = window.location.href.split("/#/")[0]+"/#/";
  var name = 'ffn0421';
  myExtObject.OpenWindowMaxName(winURL+'ffn0421?payback_running='+this.result.payback_running+"&run_id="+this.result.run_id+"&payback_rcv_running="+this.paybackData[i].payback_rcv_running,name);
}

delWord(){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ต้องการลบไฟล์ใบรับของกลาง(A4) ใช่หรือไม่?');
  confirmBox.setMessage('ยืนยันการลบ File');
  confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
  // Choose layout color type
  confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
  });
  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    if (resp.success==true){
      //=======================================
      const confirmBox2 = new ConfirmBoxInitializer();
      confirmBox2.setTitle('ต้องการลบไฟล์ใบรับของกลาง(A4) ใช่หรือไม่?');
      confirmBox2.setMessage('ยืนยันการลบไฟล์ word อีกครั้ง');
      confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
      // Choose layout color type
      confirmBox2.setConfig({
          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //===================================
          var student = JSON.stringify({
            "file_name" : this.result.file_name,
            "userToken" : this.userData.userToken
          });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/deleteFile', student).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){
                confirmBox.setMessage('ลบไฟล์ใบรับของกลาง(A4) เรียบร้อยแล้ว');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.result.file_exists = this.result.file_name = null;
                  }
                  subscription.unsubscribe();
                });
                
              }
            },
            (error) => {}
          )
          //===================================
        }
        subscription2.unsubscribe();
      });
      //=======================================
    }
    subscription.unsubscribe();
  });
}

}







