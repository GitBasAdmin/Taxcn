import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,NgModule,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PrintReportService } from 'src/app/services/print-report.service';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgbModal, NgbModalRef   } from '@ng-bootstrap/ng-bootstrap';
import { PopupStatComponent } from '@app/components/modal/popup-stat/popup-stat.component';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fci0900,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fci0900.component.html',
  styleUrls: ['./fci0900.component.css']
})


export class Fci0900Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  getCaseType:any;selCaseType:any;
  getMonthTh:any;
  getCaseStat:any;

  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  caseType:any;
  form:any=[];
  result:any=[];
  myExtObject: any;
  toPage:any='prci2100';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild('sCaseStat') sCaseStat : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
  ){}

  ngOnInit(): void {
  
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };
    this.result.conc_deposit = '0.00';
    this.result.case_deposit = '0.00';
    this.form.stat_year = myExtObject.curYear();
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
   let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
     //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "order_by": " case_type ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.form.case_type = this.userData.defaultCaseType;
        this.caseType = this.form.case_type;
        this.changeCaseType(this.form.case_type,1);
      },
      (error) => {}
    )


    this.getMonthTh = [{"fieldIdValue": '1', "fieldNameValue": "มกราคม"},
    {"fieldIdValue": '2', "fieldNameValue": "กุมภาพันธ์"},
    {"fieldIdValue": '3',"fieldNameValue": "มีนาคม"},
    { "fieldIdValue": '4',"fieldNameValue": "เมษายน"},
    {"fieldIdValue": '5',"fieldNameValue": "พฤษภาคม"},
    {"fieldIdValue": '6',"fieldNameValue": "มิถุนายน"},
    {"fieldIdValue": '7',"fieldNameValue": "กรกฎาคม"},
    {"fieldIdValue": '8',"fieldNameValue": "สิงหาคม"},
    {"fieldIdValue": '9',"fieldNameValue": "กันยายน"},
    {"fieldIdValue": '10',"fieldNameValue": "ตุลาคม"},
    {"fieldIdValue": '11',"fieldNameValue": "พฤศจิกายน"},
    {"fieldIdValue": '12',"fieldNameValue": "ธันวาคม"}];
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();

  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/
  changeCaseType(caseType:any,type:any){
    this.form.case_type_stat = null;
    //======================== pcase_type_stat ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type_stat",
      "field_id" : "case_type_stat",
      "field_name" : "case_type_stat_desc",
      "condition" : " AND case_type='"+caseType+"'",
      "userToken" : this.userData.userToken
    });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseStat = getDataOptions;
        this.form.case_type_stat = getDataOptions[0].fieldIdValue;
        if(type==2){
          this.result = [];
          this.result.conc_deposit = '0.00';
          this.result.case_deposit = '0.00';
        }
      },
      (error) => {}
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fca0300"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
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


  searchData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.form.stat_mon){
      confirmBox.setMessage('กรุณาเลือกเดือนสถิติ');
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
    }else if(!this.form.stat_year){
      confirmBox.setMessage('กรุณาเลือกปีสถิติ');
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
      this.SpinnerService.show();
      var dataTmp= this.form;
      dataTmp['userToken'] = this.userData.userToken;
      var data = $.extend({}, dataTmp);
      console.log(data)
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiCI/API/CONC/fci0900', data , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          if(alertMessage.result==0){
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else{
            this.result=alertMessage.data[0];
            this.result.conc_deposit = this.curencyFormat(this.result.conc_deposit,2);
            this.result.case_deposit = this.curencyFormat(this.result.case_deposit,2);
            this.result.case_new_20_txt = this.result.case_new_20_txt.replace(",", "<br>");
            console.log(this.result)
            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  processData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.form.stat_mon){
      confirmBox.setMessage('กรุณาเลือกเดือนสถิติ');
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
    }else if(!this.form.stat_year){
      confirmBox.setMessage('กรุณาเลือกปีสถิติ');
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
      this.SpinnerService.show();
      var dataTmp= this.form;
      dataTmp['userToken'] = this.userData.userToken;
      var data = $.extend({}, dataTmp);
      console.log(data)
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiCI/API/CONC/fci0900/process', data , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          if(alertMessage.result==0){
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else{
            this.result=alertMessage.data[0];
            this.result.conc_deposit = this.curencyFormat(this.result.conc_deposit,2);
            this.result.case_deposit = this.curencyFormat(this.result.case_deposit,2);
            console.log(this.result)
            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  saveData(){
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
      var dataTmp= this.form;
      var dataTmp2 = this.result;
      dataTmp['userToken'] = this.userData.userToken;
      var data = $.extend({}, dataTmp,dataTmp2);
      console.log(data)
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiCI/API/CONC/fci0900/save', data , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          if(alertMessage.result==0){
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else{
            this.result=alertMessage.data[0];
            this.result.conc_deposit = this.curencyFormat(this.result.conc_deposit,2);
            this.result.case_deposit = this.curencyFormat(this.result.case_deposit,2);
            console.log(this.result)
            confirmBox.setMessage('จัดเก็บข้อมูลสถิติเรียบร้อยแล้ว');
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
        (error) => {this.SpinnerService.hide();}
      )

  }

  curencyFormat(n:any,d:any) {
		return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	}
  curencyFormatChange(n:any,d:any) {
    var number = n.target.value;
		return parseFloat(number).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	}


  goToPage(case_type:string){
    let winURL = window.location.href;
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?pcase_type='+case_type;
    //alert(winURL);
    window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
    //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  }

  printReport(){

    var rptName = 'rci0900';
    var rptResult = $.extend({},this.form);

    if(rptResult['userToken'])
      delete rptResult['userToken'];
    // var paramData = rptResult;
    var paramData ='{}';

    // For set parameter to report
     var paramData = JSON.stringify({
          "pcase_type" : this.form.case_type,
          "pstat_mon" : this.form.stat_mon,
          "pstat_year" : this.form.stat_year,
          "pcase_type_stat" : this.form.case_type_stat,
       //  "pdate_start" : myExtObject.conDate($("#txt_date_start").val()),
      //  "pdate_end" : myExtObject.conDate($("#txt_date_end").val()),
     });
      console.log(paramData)
    this.printReportService.printReport(rptName,paramData);

  }

cal1(){
  this.result.case_conc_total = parseInt(this.result.case_conc_new) + parseInt(this.result.case_conc_old);
  this.calHold();
}
cal2(){
	this.result.case_total = parseInt(this.result.case_cancel) + parseInt(this.result.case_agree);
}
calHold(){
  this.result.case_conc_hold = parseInt(this.result.case_conc_total) - parseInt(this.result.case_conc_finish) - parseInt(this.result.case_conc_no_finish);
}

showCaseAll(item:any){
  if(item){
    const modalRef: NgbModalRef = this.ngbModal.open(PopupStatComponent,{ windowClass: 'my-class'})
    modalRef.componentInstance.items = item
  }
}

}







