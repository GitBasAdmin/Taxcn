import { Component, OnInit,Input,Output,EventEmitter,ViewChild,AfterViewInit,AfterContentInit,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
declare var myExtObject: any;
@Component({
  selector: 'app-switch-send-notice',
  templateUrl: './switch-send-notice.component.html',
  styleUrls: ['./switch-send-notice.component.css']
})
export class SwitchSendNoticeComponent implements AfterViewInit,OnInit,AfterContentInit {
  sessData:any;
  userData:any;
  result:any = [];
  getCaseType:any=[];
  getCaseCateGroup:any =[];
  getCase:any;

  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;


  formList: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.result.run_yy = myExtObject.curYear();
    this.result.new_run_yy = myExtObject.curYear();
  }

  checkParam(){
    if(!this.result.run_no || !this.result.run_yy || !this.result.new_run_no || !this.result.new_run_yy ){
    //  alert('กรุณาระบุข้อมูลตั้งแต่วันที่ ถึงวันที่');
         this.getMessage();
         $("input[name='run_no']")[0].focus();
   }else{
    this.getMessageConfirm();

   }
}

getMessage(){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  confirmBox.setMessage('กรุณาระบุข้อมูล เลขที่อ้างอิงที่ต้องการสลับให้ครบถ้วน');
  confirmBox.setButtonLabels('ตกลง');
  confirmBox.setConfig({
     layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  });
  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    if(resp.success==true){}
    subscription.unsubscribe();
  });
}

getMessageConfirm(){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  confirmBox.setMessage('ต้องการสลับเลขที่อ้างอิงที่ '+this.result.run_no+'/'+this.result.run_yy+' เป็นเลขอ้างอิงที่ '+this.result.new_run_no+'/'+this.result.new_run_yy+' ใช่หรือไม่');
  confirmBox.setButtonLabels('ตกลง','ยกเลิก');
  confirmBox.setConfig({
     layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  });
  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    if(resp.success==true){
      this.getWithdrawRunno();
    }
    subscription.unsubscribe();
  });
}

getMessageResult(val){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  confirmBox.setMessage(val);
  confirmBox.setButtonLabels('ตกลง');
  confirmBox.setConfig({
     layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  });
  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    if(resp.success==true){}
    subscription.unsubscribe();
  });
}

checkWithdraw(type:any){
  console.log('checkwithdraw');
if(this.result.withdraw_running){
 this.printReport(type);
      console.log('printreport');
 }else{
       console.log('notprint');
 }
}

async getWithdrawRunno(){
   var student = JSON.stringify({
   "run_no" : this.result.run_no ? this.result.run_no : null,
   "run_yy" : this.result.run_yy ? this.result.run_yy : null,
   "new_run_no" : this.result.new_run_no ? this.result.new_run_no : null,
   "new_run_yy" : this.result.new_run_yy ? this.result.new_run_yy : null,
   "userToken" : this.userData.userToken
 });
 console.log(student);
 this.SpinnerService.show();
 // this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/prsn2100/printReport', student ).subscribe((response) =>{
  let getDataOptions : any;
  getDataOptions = await this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/prsn2100/switchRunNo', student ).toPromise()

     getDataOptions = JSON.parse(JSON.stringify(getDataOptions));
     this.getCase = getDataOptions;
     console.log(this.getCase);
     if(getDataOptions.result==0){
       this.SpinnerService.hide();
       const confirmBox = new ConfirmBoxInitializer();
       confirmBox.setTitle('ข้อความแจ้งเตือน');
       confirmBox.setMessage(getDataOptions.error);
       confirmBox.setButtonLabels('ตกลง');
       confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
       });
       const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
         if(resp.success==true){
           this.result.withdraw_running = '';
           this.result.run_no = '';
           this.result.new_run_no = '';
           console.log(this.result.withdraw_running);
           //this.SpinnerService.hide();
         }
         subscription.unsubscribe();
       });
     }else{
       this.result.withdraw_running = this.getCase.withdraw_running;
       console.log(this.result.withdraw_running);
       await this.getMessageResult(getDataOptions.error);
       // this.printReport(1);
     }
     // if(this.getCase.result == 1){
     //   this.result.withdraw_running = this.getCase.withdraw_running;
     // }else{
     //   //alert('ไม่พบข้อมูลที่ต้องการพิมพ์');
     //   this.getMessage();
     //   this.result.withdraw_running = '';
     // }

     // console.log(this.result.withdraw_running);

   // (error) => {this.SpinnerService.hide();}
 }

 printReport(type:any){

  var rptName = 'rsn3100';
  if(type==2){
    rptName = 'rsn3100V';
  }
  // For no parameter : paramData ='{}'
  var paramData ='{}';

  // For set parameter to report
   var paramData = JSON.stringify({
    "pown_court" : this.result.pown_court ? this.result.pown_court : '',
    "pwithdraw_running" : this.result.withdraw_running ? this.result.withdraw_running.toString() : '',
    "psize" : type ? type.toString() : '',
    "pcheck_name" : this.result.pcheck_name ? this.result.pcheck_name : '',
    "preport_name" : this.result.preport_name ? this.result.preport_name : '',
    "premark" : this.result.premark ? this.result.premark : '',
    "ptype2" : this.result.ptype2 ? this.result.ptype2 : '',
    "pdate_type" : this.result.pdate_type ? this.result.pdate_type : '',
    "psumary" : this.result.psumary ? this.result.psumary : '',

    "ppayee_name" : this.result.ppayee_name ? this.result.ppayee_name : '',
    "print_type" : this.result.print_type ? this.result.print_type : '',
    "pdep_code" : this.result.pdep_code ? this.result.pdep_code : '',
    "pdate_start" : this.result.pdate_start ? myExtObject.conDate(this.result.pdate_start) : '' ,
    "pdate_end" : this.result.pdate_end ? myExtObject.conDate(this.result.pdate_end) : '',
    "pno_money" : this.result.pno_money ? this.result.pno_money : '',
    "pinout_flag" : this.result.pinout_flag ? this.result.pinout_flag : '',
    "psend_by" : this.result.psend_by ? this.result.psend_by : '',
    "porder" : this.result.porder ? this.result.porder : '',

    "ptranfer_flag" : this.result.ptranfer_flag ? this.result.ptranfer_flag : '',
    "ps_officer_id" : this.result.ps_officer_id ? this.result.ps_officer_id : '',

    "pto_court" : this.result.pto_court ? this.result.pto_court : '',
    "passign_off_id" : this.result.passign_off_id ? this.result.passign_off_id : '',
    "pcheck_id" : this.result.pcheck_id ? this.result.pcheck_id : '',
    "ppayee_id" : this.result.ppayee_id ? this.result.ppayee_id : '',
    "pcheckbox" : this.result.checkbox ? this.result.checkbox : '',
   });
   console.log(paramData)
  // alert(paramData);return false;
  this.printReportService.printReport(rptName,paramData);
}

  ngAfterViewInit(): void {

  }
  ngAfterContentInit() : void{

  }
  ngOnDestroy(): void {

  }



}
