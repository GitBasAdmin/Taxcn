import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { PrintReportService } from 'src/app/services/print-report.service';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { ModalEnvelopeComponent } from '../../modal/modal-envelope/modal-envelope.component';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


pdfMake.fonts = {
  'Roboto' : {
    normal: `Roboto-Regular.ttf`,
    bold: `Roboto-Medium.ttf`,
    italics: `Roboto-Italic.ttf`,
    bolditalics: `Roboto-MediumItalic.ttf`
  },
  'THSarabunNew' : {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew Italic.ttf',
    bolditalics: 'THSarabunNew BoldItalic.ttf'
  }
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fap0110,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fap0110.component.html',
  styleUrls: ['./fap0110.component.css']
})

export class Fap0110Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  
  getMonthTh:any;
  getJudgeBy:any;
  getAppointBy:any;selAppointBy:any;
  getAppointTable:any;
  getAppBy:any;
  years:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;

  param:any = [];
  result:any = [];
  _result:any = [];
  __result:any = [];
  dataHead:any = [];
  dataAppointment:any = [];
  dataSaveTmp:any = [];
  myExtObject: any;
  tableAppointment:any;
  modalType:any;
  runId:any;
  getCourt:any;
  displayTable:any;
  displayTableColor:any;
  buttonDelApp: boolean = false;
  appCourt: boolean = false;
  showTab: boolean = false;
  thisTab = 0;

  dStart1: boolean = true;
  dStart2: boolean = true;
  dStart3: boolean = true;
  dStart4: boolean = true;
  dNum1: boolean = true;
  dNum2: boolean = true;
  dNum3: boolean = true;
  dNum4: boolean = true;
  dTime_mor1: boolean = true;
  dTime_mor2: boolean = true;
  dTime_mor3: boolean = true;
  dTime_mor4: boolean = true;
  dMor_time1: boolean = true;
  dMor_time2: boolean = true;
  dMor_time3: boolean = true;
  dMor_time4: boolean = true;
  dTime_eve1: boolean = true;
  dTime_eve2: boolean = true;
  dTime_eve3: boolean = true;
  dTime_eve4: boolean = true;
  dEve_time1: boolean = true;
  dEve_time2: boolean = true;
  dEve_time3: boolean = true;
  dEve_time4: boolean = true;
  dWithdraw_doc1: boolean = true;
  dWithdraw_doc2: boolean = true;
  dWithdraw_doc3: boolean = true;
  dWithdraw_doc4: boolean = true;
  dTxt_lang1: boolean = true;
  dTxt_lang2: boolean = true;
  dTxt_lang3: boolean = true;
  dTxt_lang4: boolean = true;
  dPwd_over1: boolean = true;
  dPwd_over2: boolean = true;
  dPwd_over3: boolean = true;
  dPwd_over4: boolean = true;
  

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalComponent: boolean = false;
	public loadModalConfComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadModalEnvolopeComponent: boolean = false;

 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public masterSelect: boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  @ViewChild( ModalEnvelopeComponent ) child2: ModalEnvelopeComponent ; 
  @ViewChild('monthTh') monthTh : NgSelectComponent;

  @ViewChild('time_mor1',{static: true}) time_mor1 : ElementRef;
  @ViewChild('time_mor2',{static: true}) time_mor2 : ElementRef;
  @ViewChild('time_mor3',{static: true}) time_mor3 : ElementRef;
  @ViewChild('time_mor4',{static: true}) time_mor4 : ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private activatedRoute: ActivatedRoute,
  ){ }
   
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
      searching : false,
      destroy : true
    };
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id'])
        this.runId = this.dataHead.run_id = params['run_id'];
      //if(typeof this.runId !='undefined')
        //this.getObjAppData();
    });
      //this.asyncObservable = this.makeObservable('Async Observable');
      //======================== pappoint_by ======================================
      var student = JSON.stringify({
        "table_name" : "pappoint_by",
        "field_id" : "appoint_by_id",
        "field_name" : "appoint_by_name",
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getAppointBy = getDataOptions;
          this._result.judge_by = this.getAppointBy[0].fieldIdValue;
        },
        (error) => {}
      )
      //======================== pappoint_table ======================================
      var student = JSON.stringify({
        "table_name" : "pappoint_table",
        "field_id" : "table_id",
        "field_name" : "table_name",
        "condition" : " AND table_type='1'",
        "order_by" : " NVL(table_order,999) ASC,NVL(table_id,999) ASC",
         "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.getAppointTable = getDataOptions;
          this.result.table_id = this.getAppointTable[0].fieldIdValue;

        },
        (error) => {}
      )

      this.getMonthTh = [{"fieldIdValue": '01', "fieldNameValue": "มกราคม"},{"fieldIdValue": '02', "fieldNameValue": "กุมภาพันธ์"},{"fieldIdValue": '03',"fieldNameValue": "มีนาคม"},{ "fieldIdValue": '04',"fieldNameValue": "เมษายน"},{"fieldIdValue": '05',"fieldNameValue": "พฤษภาคม"},{"fieldIdValue": '06',"fieldNameValue": "มิถุนายน"},{"fieldIdValue": '07',"fieldNameValue": "กรกฎาคม"},{"fieldIdValue": '08',"fieldNameValue": "สิงหาคม"},{"fieldIdValue": '09',"fieldNameValue": "กันยายน"},{"fieldIdValue": '10',"fieldNameValue": "ตุลาคม"},{"fieldIdValue": '11',"fieldNameValue": "พฤศจิกายน"},{"fieldIdValue": '12',"fieldNameValue": "ธันวาคม"}];
      this.getAppBy = [{"fieldIdValue": 1, "fieldNameValue": "1 ศูนย์นัดความ"},{"fieldIdValue": 2, "fieldNameValue": "2 ผู้พิพากษา"},{"fieldIdValue": 3,"fieldNameValue": "3 ศูนย์ไกล่เกลี่ย"}];
      this._result.app_by = this.getAppBy[0].fieldIdValue;
      if(this.successHttp()){
        this.setDefPage();
        this.setDefPage2();
      }
        
    }

    setDefPage(){
      this.result = [];
      if(typeof this.getAppointTable !='undefined')
        this.result.table_id = this.getAppointTable[0].fieldIdValue;
      this.result.month = myExtObject.curMonth().toString();
      this.result.year = myExtObject.curYear().toString();
      this.showTab = false;
      
    }

    setDefPage2(){
      this._result.room_id = this._result.room_desc = '';
      if(typeof this.getAppointBy !='undefined')
        this._result.judge_by = this.getAppointBy[0].fieldIdValue;
      if(typeof this.getAppBy !='undefined')
        this._result.app_by = this.getAppBy[0].fieldIdValue;

      this.__result = [];
      this.__result.time_mor0 = this.__result.time_mor1 = this.__result.time_mor2 = this.__result.time_mor3 = this.__result.time_mor4 = '1';
      this.__result.time_eve0 = this.__result.time_eve1 = this.__result.time_eve2 = this.__result.time_eve3 = this.__result.time_eve4 = '1';
      this.__result.mor_time0 = this.__result.mor_time1 = this.__result.mor_time2 = this.__result.mor_time3 = this.__result.mor_time4 = '09.00';
      this.__result.eve_time0 = this.__result.eve_time1 = this.__result.eve_time2 = this.__result.eve_time3 = this.__result.eve_time4 = '13.30';
      this.__result.start0 = myExtObject.curDate();
      this.dStart1 = this.dStart2 = this.dStart3 = this.dStart4 = true;
      this.dNum1 = this.dNum2 = this.dNum3 = this.dNum4 = true;
      this.dTime_mor1 = this.dTime_mor2 = this.dTime_mor3 = this.dTime_mor4 = true;
      this.dMor_time1 = this.dMor_time2 = this.dMor_time3 = this.dMor_time4 = true;
      this.dTime_eve1 = this.dTime_eve2 = this.dTime_eve3 = this.dTime_eve4 = true;
      this.dEve_time1 = this.dEve_time2 = this.dEve_time3 = this.dEve_time4 = true;
      this.dWithdraw_doc1 = this.dWithdraw_doc2 = this.dWithdraw_doc3 = this.dWithdraw_doc4 = true;
      this.dTxt_lang1 = this.dTxt_lang2 = this.dTxt_lang3 = this.dTxt_lang4 = true;
      this.dPwd_over1 = this.dPwd_over2 = this.dPwd_over3 = this.dPwd_over4 = true;
    }
    setDisFormLoop(rows:any){
      var student = [];
      student['table_id'] = this.result.table_id;
      student['userToken'] = this.userData.userToken;
      var app = [];
      var _bar = new Promise((resolve, reject) => {
        for(var i=parseInt(rows);i<5;i++){
          var start = 'start'+i;
          var num = 'num'+i;
          if(this.__result[start] && this.__result[num]){
            app.push({
              'start' : this.__result[start],
              'num' : this.__result[num]?this.__result[num]:1,
            })
          }
        }
      });
      if(_bar){
        student['data'] = app;
        student = $.extend({},student);
        console.log(student)
        const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
      
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0110/reAppointDate', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              //-----------------------------//
              for(var i=0;i<getDataOptions.appoint_date.length;i++){
                var start = 'start'+(i+(rows+1));
                this.__result[start] = getDataOptions.appoint_date[i].date_appoint;
              }
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
    setDisForm1(){
      if(this.__result.start0 && this.__result.app_id0 && this.__result.num0){
        if((this.__result.time_mor0 && this.__result.time_eve0) || (!this.__result.time_mor0 && this.__result.time_eve0)){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          var student = JSON.stringify({
            "date_appoint" : this.__result.start0,
            "table_id" : this.result.table_id,
            "num" : this.__result.num0,
            "userToken" : this.userData.userToken
          });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0110/nextAppointDate', student ).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){
                  //-----------------------------//
                  this.__result.start1 = getDataOptions.appoint_date;
                  this.__result.num1 = 1 ;
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
        }else{
          this.__result.start1 = this.__result.start0;
          this.time_mor1.nativeElement.checked = false;
          this.__result.num1 = 1 ;
        }
        
        this.dStart1 = false;
        this.dNum1 = false;
        this.dTime_mor1 = false;
        this.dMor_time1 =  false;
        this.dTime_eve1 = false;
        this.dEve_time1 = false;
        this.dWithdraw_doc1 = false;
        this.dTxt_lang1 = false;
        this.dPwd_over1 = false;
      }
    }
    setDisForm2(){
      if(this.__result.start1 && this.__result.app_id1 && this.__result.num1){
        if((this.__result.time_mor1 && this.__result.time_eve1) || (!this.__result.time_mor1 && this.__result.time_eve1)){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          var student = JSON.stringify({
            "date_appoint" : this.__result.start1,
            "table_id" : this.result.table_id,
            "num" : this.__result.num1,
            "userToken" : this.userData.userToken
          });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0110/nextAppointDate', student ).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){
                  //-----------------------------//
                  this.__result.start2 = getDataOptions.appoint_date;
                  this.__result.num2 = 1 ;
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
        }else{
          this.__result.start2 = this.__result.start1;
          this.time_mor2.nativeElement.checked = false;
          this.__result.num2 = 1 ;
        }
        this.dStart2 = false;
        this.dNum2 = false;
        this.dTime_mor2 = false;
        this.dMor_time2 =  false;
        this.dTime_eve2 = false;
        this.dEve_time2 = false;
        this.dWithdraw_doc2 = false;
        this.dTxt_lang2 = false;
        this.dPwd_over2 = false;
      }
    }
    setDisForm3(){
      if(this.__result.start2 && this.__result.app_id2 && this.__result.num2){
        if((this.__result.time_mor2 && this.__result.time_eve2) || (!this.__result.time_mor2 && this.__result.time_eve2)){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          var student = JSON.stringify({
            "date_appoint" : this.__result.start2,
            "table_id" : this.result.table_id,
            "num" : this.__result.num2,
            "userToken" : this.userData.userToken
          });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0110/nextAppointDate', student ).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){
                  //-----------------------------//
                  this.__result.start3 = getDataOptions.appoint_date;
                  this.__result.num3 = 1 ;
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
        }else{
          this.__result.start3 = this.__result.start2;
          this.time_mor3.nativeElement.checked = false;
          this.__result.num3 = 1 ;
        }
      this.dStart3 = false;
      this.dNum3 = false;
      this.dTime_mor3 = false;
      this.dMor_time3 =  false;
      this.dTime_eve3 = false;
      this.dEve_time3 = false;
      this.dWithdraw_doc3 = false;
      this.dTxt_lang3 = false;
      this.dPwd_over3 = false;
      }
    }

    setDisForm4(){
      if(this.__result.start3 && this.__result.app_id3 && this.__result.num3){
        if((this.__result.time_mor3 && this.__result.time_eve3) || (!this.__result.time_mor3 && this.__result.time_eve3)){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          var student = JSON.stringify({
            "date_appoint" : this.__result.start3,
            "table_id" : this.result.table_id,
            "num" : this.__result.num3,
            "userToken" : this.userData.userToken
          });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0110/nextAppointDate', student ).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){
                  //-----------------------------//
                  this.__result.start4 = getDataOptions.appoint_date;
                  this.__result.num4 = 1 ;
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
        }else{
          this.__result.start4 = this.__result.start3;
          this.time_mor4.nativeElement.checked = false;
          this.__result.num4 = 1 ;
        }
        this.dStart4 = false;
        this.dNum4 = false;
        this.dTime_mor4 = false;
        this.dMor_time4 =  false;
        this.dTime_eve4 = false;
        this.dEve_time4 = false;
        this.dWithdraw_doc4 = false;
        this.dTxt_lang4 = false;
        this.dPwd_over4 = false;
      }
    }

    callCalendarApp(){
      this.SpinnerService.show();
      if(this.param.year){
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var student = JSON.stringify({
          "table_id" : this.param.table_id,
          "month" : this.param.month,
          "year" : this.param.year,
          "userToken" : this.userData.userToken,
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0111/genCalendar', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            //console.log(productsJson)
            if(productsJson.result==1){
              var bar = new Promise((resolve, reject) => {
                this.tableAppointment = productsJson.data.replace(/\\/g, '');
                console.log(this.tableAppointment)
                let winURL = this.authService._baseUrl;
                winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+"case-conciliate";
                setTimeout(() => {
                  $("body").find(".appTable").find("tr td").each(function(){
                    console.log($(this).attr("onclick","window.open('"+winURL+"',1,'height=400,width=800,resizable,scrollbars,status')"));
                  })
                }, 500);
              });
              if(bar){
                this.SpinnerService.hide();
              }
            }else{
              this.tableAppointment = productsJson.data.replace(/\\/g, '');
            }
            
          },
          (error) => {}
        )
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาระบุปี');
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
      }
    }

    async successHttp() {

    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fap0110"
    });
    console.log(authen)
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen)
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

    directiveDate(date:any,obj:any){
      this.__result[obj] = date;
      if(obj=='start0' || obj=='start1' || obj=='start2' || obj=='start3' || obj=='start4'){
        if(obj=='start0')
          this.checkHoliday(this.__result[obj],obj,0)
        if(obj=='start1')
          this.checkHoliday(this.__result[obj],obj,1)
        if(obj=='start2')
          this.checkHoliday(this.__result[obj],obj,2)
        if(obj=='start3')
          this.checkHoliday(this.__result[obj],obj,3)
        if(obj=='start4')
          this.checkHoliday(this.__result[obj],obj,4)
      }
    }
  
  checkHoliday(date:any,obj:any,rows:any){
    if(date){
      var student = JSON.stringify({
        "table_id" : this.result.table_id,
        "date_appoint" : date,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0110/checkValidDate', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          //console.log(productsJson)
          if(productsJson.result==0){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.__result[obj] = '';
              }
              subscription.unsubscribe();
            });
          }else{
            this.setDisFormLoop(rows);
          }
        },
        (error) => {}
      )
    }
  }
//===================================================================================================== modal ======================================================================
closeModal(){
  this.loadModalComponent = false;
  this.loadModalConfComponent = false;
  this.loadModalJudgeComponent = false;
  this.loadModalEnvolopeComponent = false;
}

submitModalFormEnvelope(){
  var dataObj = this.child2.ChildTestCmp();
  if(dataObj.length){
    var hcase_no = '',case_running = '';
    var bar = new Promise((resolve, reject) => {
      dataObj.forEach((ele, index, array) => {
          if(index!=0){
            if(ele.hcase_no1)
              hcase_no += ','+ele.case_desc+"("+ele.hcase_no1+")";
            else
              hcase_no += ','+ele.case_desc;
            case_running += ','+ele.case_running;
          }else{
            if(ele.hcase_no1)
              hcase_no += ele.case_desc+"("+ele.hcase_no1+")";
            else
              hcase_no += ele.case_desc;
            case_running = ele.case_running;
          }
      });
    });
    if(bar){
      this.result.map_case = hcase_no;
      this.result.case_running = case_running.toString();
    }
  }else{
    //this.result.map_case = hcase_no;
    //this.result.case_running = case_running;
  }
  
  this.closebutton.nativeElement.click();
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
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
        if(productsJson.result==1){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
          confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
          confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
          // Choose layout color type
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                
                this.SpinnerService.show();
                let headers = new HttpHeaders();
                headers = headers.set('Content-Type','application/json');
                
                var dataDel = [],dataTmp=[];
                    dataDel['log_remark'] = chkForm.log_remark;
                    dataDel['userToken'] = this.userData.userToken;
                    var bar = new Promise((resolve, reject) => {
                      this.dataAppointment.forEach((ele, index, array) => {
                            if(ele.aRunning == true){
                              dataTmp.push(this.dataAppointment[index]);
                            }
                        });
                    });
                    
                    if(bar){
                      this.SpinnerService.show();
                      let headers = new HttpHeaders();
                      headers = headers.set('Content-Type','application/json');
                      dataDel['data'] = dataTmp;
                      var data = $.extend({}, dataDel);
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/deleteAllAppointDataByDate', data , {headers:headers}).subscribe(
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
                                this.SpinnerService.hide();
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
                              }
                              subscription.unsubscribe();
                            });
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
                    }

              }
              subscription.unsubscribe();
            });
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

receiveFuncEnvelopeData(event:any){

}

receiveFuncReceiptData(event:any){

}

receiveFuncNoticeReceiptData(event:any){

}

receiveJudgeListData(event:any){
  if(this.modalType==2){
    this.result.judge_id = event.judge_id;
    this.result.judge_name = event.judge_name;
  }
  this.closebutton.nativeElement.click();
}

receiveFuncListData(event:any){
  console.log(event)
  if(this.modalType==1){
    this._result.room_id=event.fieldIdValue;
    this._result.room_desc=event.fieldNameValue;
  }else if(this.modalType==2){
    this._result.to_court_id=event.fieldIdValue;
    this._result.to_court_name=event.fieldNameValue;
  }else if(this.modalType==3){
    this.__result.app_id0=event.fieldIdValue;
    this.__result.app_name0=event.fieldNameValue;
    this.__result.num0 = 1;
  }else if(this.modalType==4){
    this.__result.app_id1=event.fieldIdValue;
    this.__result.app_name1=event.fieldNameValue;
    this.setDisForm1();
  }else if(this.modalType==5){
    this.__result.app_id2=event.fieldIdValue;
    this.__result.app_name2=event.fieldNameValue;
    this.setDisForm2();
  }else if(this.modalType==6){
    this.__result.app_id3=event.fieldIdValue;
    this.__result.app_name3=event.fieldNameValue;
    this.setDisForm3();
  }else if(this.modalType==7){
    this.__result.app_id4=event.fieldIdValue;
    this.__result.app_name4=event.fieldNameValue;
    this.setDisForm4();
  }
  this.closebutton.nativeElement.click();
}

clickOpenMyModalComponent(type:any){
  this.modalType = type;
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  if(this.modalType==4 && (!this.__result.start0 || !this.__result.app_id0 || !this.__result.num0)){
      confirmBox.setMessage('กรุณาระบุรายละเอียดแถวก่อนหน้าให้เรียบร้อย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
  }else if(this.modalType==5 && (!this.__result.start1 || !this.__result.app_id1 || !this.__result.num1)){
      confirmBox.setMessage('กรุณาระบุรายละเอียดแถวก่อนหน้าให้เรียบร้อย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
  }else if(this.modalType==6 && (!this.__result.start2 || !this.__result.app_id2 || !this.__result.num2)){
      confirmBox.setMessage('กรุณาระบุรายละเอียดแถวก่อนหน้าให้เรียบร้อย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
  }else if(this.modalType==7 && (!this.__result.start3 || !this.__result.app_id3 || !this.__result.num3)){
      confirmBox.setMessage('กรุณาระบุรายละเอียดแถวก่อนหน้าให้เรียบร้อย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
  }else{
    this.openbutton.nativeElement.click();
  }
  
}

loadMyModalComponent(){
  if(this.modalType==1){
    $("#exampleModal").find(".modal-content").css("width","650px");
    var student = JSON.stringify({
      "table_name" : "pjudge_room",
       "field_id" : "room_id",
       "field_name" : "room_desc",
       "search_id" : "",
       "search_desc" : "",
       "userToken" : this.userData.userToken});
    this.listTable='pjudge_room';
    this.listFieldId='room_id';
    this.listFieldName='room_desc';
    this.listFieldCond="";
  }else if(this.modalType==2){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pcourt",
         "field_id" : "court_id",
         "field_name" : "court_name",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='pcourt';
      this.listFieldId='court_id';
      this.listFieldName='court_name';
      this.listFieldCond="";
  }else if(this.modalType==3 || this.modalType==4 || this.modalType==5 || this.modalType==6 || this.modalType==7){
    $("#exampleModal").find(".modal-content").css("width","650px");
    var student = JSON.stringify({
      "table_name" : "pappoint_list",
       "field_id" : "app_id",
       "field_name" : "app_name",
       "search_id" : "",
       "search_desc" : "",
       "userToken" : this.userData.userToken});
    this.listTable='pappoint_list';
    this.listFieldId='app_id';
    this.listFieldName='app_name';
    this.listFieldCond="";
}

  if(this.modalType==1 || this.modalType==2 || this.modalType==3 || this.modalType==4 || this.modalType==5 || this.modalType==6 || this.modalType==7){
    this.loadModalComponent = true;
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalEnvolopeComponent = false;
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
      (response) =>{
        console.log(response)
        this.list = response;
      },
      (error) => {}
    )
  }
}

tabChangeInput(obj:any,name:any,event:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  let headers = new HttpHeaders();
   headers = headers.set('Content-Type','application/json');
  if(name=='room_id'){
    var student = JSON.stringify({
      "table_name" : "pjudge_room",
      "field_id" : "room_id",
      "field_name" : "room_desc",
      "condition" : " AND room_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this[obj]['room_desc'] = productsJson[0].fieldNameValue;
      }else{
        this[obj]['room_id'] = '';
        this[obj]['room_desc'] = '';
      }
      },
      (error) => {}
    )
  }else if(name=='to_court_id'){
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "condition" : " AND court_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this[obj]['to_court_name'] = productsJson[0].fieldNameValue;
      }else{
        this[obj]['to_court_id'] = '';
        this[obj]['to_court_name'] = '';
      }
      },
      (error) => {}
    )
  }else if(name=='app_id0'){
    var student = JSON.stringify({
      "table_name" : "pappoint_list",
      "field_id" : "app_id",
      "field_name" : "app_name",
      "condition" : " AND app_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this[obj]['app_name0'] = productsJson[0].fieldNameValue;
        this.__result.num0 = 1;
      }else{
        this[obj]['app_id0'] = '';
        this[obj]['app_name0'] = '';
      }
      },
      (error) => {}
    )
  }else if(name=='app_id1'){
    if((!this.__result.start0 || !this.__result.app_id0 || !this.__result.num0)){
      confirmBox.setMessage('กรุณาระบุรายละเอียดแถวก่อนหน้าให้เรียบร้อย');
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
        "table_name" : "pappoint_list",
        "field_id" : "app_id",
        "field_name" : "app_name",
        "condition" : " AND app_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this[obj]['app_name1'] = productsJson[0].fieldNameValue;
          this.setDisForm1();
        }else{
          this[obj]['app_id1'] = '';
          this[obj]['app_name1'] = '';
        }
        },
        (error) => {}
      )
    }
    
  }else if(name=='app_id2'){
    if((!this.__result.start1 || !this.__result.app_id1 || !this.__result.num1)){
      confirmBox.setMessage('กรุณาระบุรายละเอียดแถวก่อนหน้าให้เรียบร้อย');
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
        "table_name" : "pappoint_list",
        "field_id" : "app_id",
        "field_name" : "app_name",
        "condition" : " AND app_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this[obj]['app_name2'] = productsJson[0].fieldNameValue;
          this.setDisForm2();
        }else{
          this[obj]['app_id2'] = '';
          this[obj]['app_name2'] = '';
        }
        },
        (error) => {}
      )
    }
  }else if(name=='app_id3'){
    if((!this.__result.start2 || !this.__result.app_id2 || !this.__result.num2)){
      confirmBox.setMessage('กรุณาระบุรายละเอียดแถวก่อนหน้าให้เรียบร้อย');
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
        "table_name" : "pappoint_list",
        "field_id" : "app_id",
        "field_name" : "app_name",
        "condition" : " AND app_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this[obj]['app_name3'] = productsJson[0].fieldNameValue;
          this.setDisForm3();
        }else{
          this[obj]['app_id3'] = '';
          this[obj]['app_name3'] = '';
        }
        },
        (error) => {}
      )
    }
  }else if(name=='app_id4'){
    if((!this.__result.start3 || !this.__result.app_id3 || !this.__result.num3)){
      confirmBox.setMessage('กรุณาระบุรายละเอียดแถวก่อนหน้าให้เรียบร้อย');
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
        "table_name" : "pappoint_list",
        "field_id" : "app_id",
        "field_name" : "app_name",
        "condition" : " AND app_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this[obj]['app_name4'] = productsJson[0].fieldNameValue;
          this.setDisForm4();
        }else{
          this[obj]['app_id4'] = '';
          this[obj]['app_name4'] = '';
        }
        },
        (error) => {}
      )
    }
  } 
}


//===================================================================================================== end modal ======================================================================
fnDataHead(event:any){
  console.log(event)
  this.dataHead = event;
  if(this.dataHead.buttonSearch==1){
    this.setDefPage();
    this.setDefPage2();
    this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
    //this.getObjAppData();
  }else{
    //this.getNoticeData(0);
  }
}

checkUncheckAll(obj:any,master:any,child:any) {
  for (var i = 0; i < obj.length; i++) {
    obj[i][child] = this[master];
  }
  if(this[master]==true){
    this.buttonDelApp = true;
  }else{
    this.buttonDelApp = false;
  }
}

isAllSelected(obj:any,master:any,child:any) {
  this[master] = obj.every(function(item:any) {
    return item[child] == true;
  })
  var isChecked = obj.every(function(item:any) {
    return item[child] == false;
  })
  if(isChecked==true){
    this.buttonDelApp = false;
  }else{
    this.buttonDelApp = true;
  }
}

editData(index:any){
  let winURL = window.location.href.split("/#/")[0]+"/#/";
  myExtObject.OpenWindowMaxName(winURL+'fap0130?app_running='+this.dataAppointment[index].app_running);
}


saveData(){
  const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
  if(!this.dataHead.run_id){
    confirmBox.setMessage('กรูณาค้นหาข้อมูลคดี');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(!this.__result.start0){
    confirmBox.setMessage('คุณยังไม่เลือกวันนัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(!this.__result.app_id0){
    confirmBox.setMessage('คุณยังไม่กรอกสาเหตุการนัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(this.__result.app_id0 && !this.__result.num0){
    confirmBox.setMessage('คุณยังไม่ลงจำนวนวันนัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(!this.__result.app_id1 && !this.__result.app_id0){
    confirmBox.setMessage('คุณยังไม่ลงเหตุที่นัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(this.__result.app_id1 && !this.__result.num1){
    confirmBox.setMessage('คุณยังไม่ลงจำนวนวันนัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(!this.__result.app_id0 && !this.__result.app_id1 && !this.__result.app_id2){
    confirmBox.setMessage('คุณยังไม่กรอกสาเหตุการนัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(this.__result.app_id2 && !this.__result.num2){
      confirmBox.setMessage('คุณยังไม่ลงจำนวนวันนัด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
  }else{

    var student = [];
    student['run_id'] = this.dataHead.run_id;
    student['table_id'] = this.result.table_id;
    student['judge_by'] = this._result.judge_by;
    student['to_court_id'] = this._result.to_court_id ? this._result.to_court_id : '';
    student['app_by'] = this._result.app_by;
    student['room_id'] = this._result.room_id ? this._result.room_id : '';
    student['userToken'] = this.userData.userToken;
    var app = [];
    var _bar = new Promise((resolve, reject) => {
      for(var i=0;i<5;i++){
        var start = 'start'+i;
        var app_id = 'app_id'+i;
        var app_name = 'app_name'+i;
        var num = 'num'+i;
        var mor_time = 'mor_time'+i;
        var eve_time = 'eve_time'+i;
        var withdraw_doc = 'withdraw_doc'+i;
        var txt_lang = 'txt_lang'+i;
        var pwd_over = 'pwd_over'+i;
        if(this.__result[start] && this.__result[app_id] && this.__result[num]){
          app.push({
            start : this.__result[start],
            app_id : this.__result[app_id],
            app_name : this.__result[app_name],
            num : this.__result[num],
            mor_time : this.__result[mor_time],
            eve_time : this.__result[eve_time],
            withdraw_doc : this.__result[withdraw_doc],
            txt_lang : this.__result[txt_lang],
            pwd_over : this.__result[pwd_over],
          })
        }
      }
    });
    if(_bar){
      student['data'] = app;
      student = $.extend({},student);
      console.log(student)

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
      
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0110/insertAllAppoint', student ).subscribe(
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
                  this.showTab = true;
                  this.setDefPage2();
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



printReport(type:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');

  if(!this.dataHead.run_id){
    confirmBox.setMessage('กรุณาค้นหาเลขคดี');
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
    var rptName = 'rap3200';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "prun_id" : this.dataHead.run_id,
      "ptype_date" : myExtObject.conDate(myExtObject.curDate()),
      "ptype" : type
    });
    console.log(paramData)
    // alert(paramData);return false;
    this.printReportService.printReport(rptName,paramData);
  }
}

checkCourt(event:any){
  if(event==2){
    this.appCourt=true;
  }else{
    this.appCourt=false;
  }
}

activeTab(tab:any){
  console.log(tab)
  this.thisTab = tab;
  this.showTab = true;
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  if(tab==0){
    if(!this.result.year){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุปี');
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
        "table_id" : this.result.table_id,
        "month" : this.result.month,
        "year" : this.result.year,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0110/genAppointDisplayTable', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              //-----------------------------//
              this.displayTable = getDataOptions.data;
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
  }else{
    if(!this.result.year){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุปี');
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
        "table_id" : this.result.table_id,
        "month" : this.result.month,
        "year" : this.result.year,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0110/genAppointDisplayColorTable', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              //-----------------------------//
              this.displayTableColor = getDataOptions.data;
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
}

cMor(event:any,index:any){
  var time = 'mor_time'+index;

    if(event==true)
      this.__result[time] = '09.00';
    else
      this.__result[time] = '';
  
}
cEve(event:any,index:any){
  var time = 'eve_time'+index;

    if(event==true)
      this.__result[time] = '13.30';
    else
      this.__result[time] = '';
  
}

closeWin(){
  if(!window.opener){
    const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบหน้าจอหลัก ไม่สามารถปิดหน้าจอได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
  }else{
    if(typeof this.runId === 'object'){
      var run_id = this.runId['run_id'];
    }else{
      var run_id = this.runId;
    }
    if(run_id)
      window.opener.myExtObject.openerReloadRunId(run_id);
    else
      window.opener.myExtObject.openerReloadRunId(0);
    window.close();
  }
}

judgeAppoint(){
  let winURL = window.location.href.split("/#/")[0]+"/#/";
  if(!this.dataHead.run_id)
    this.dataHead.run_id = '';
  if(!this.dataHead.case_judge_id)
    this.dataHead.case_judge_id = '';
  if(!this.dataHead.case_judge_name)
    this.dataHead.case_judge_name = '';
  myExtObject.OpenWindowMaxName(winURL+'judge_appoint?judge_id='+this.dataHead.case_judge_id+'&judge_name='+this.dataHead.case_judge_name+'&month='+this.result.month+'&year='+this.result.year,'judge_appoint');
}

printColor(val:any){
  let winURL = window.location.href.split("/#/")[0]+"/#/";
  if(this.result.table_id && this.result.month && this.result.year){
    if(val==1)
      myExtObject.OpenWindowMaxName(winURL+'fap0110-color?table_id='+this.result.table_id+'&month='+this.result.month+'&month='+this.result.month+'&year='+this.result.year+'&type=1','fap0110Color');
    else
      myExtObject.OpenWindowMaxName(winURL+'fap0110-color?table_id='+this.result.table_id+'&month='+this.result.month+'&month='+this.result.month+'&year='+this.result.year+'&type=2','fap0110Color');
    
  }
  /* var student = JSON.stringify({
    "table_id" : this.result.table_id,
    "month" : this.result.month,
    "year" : this.result.year,
    "userToken" : this.userData.userToken
  });
  console.log(student)
  this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0111/genCalendar', student ).subscribe(
    (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      //console.log(productsJson)
      if(productsJson.result==1){
        var bar = new Promise((resolve, reject) => {
          this.tableAppointment = productsJson.data.replace(/\\/g, '');
          console.log(this.tableAppointment)
          let winURL = this.authService._baseUrl;
          winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+"case-conciliate";
          setTimeout(() => {
            $("body").find(".appTable").find("tr td").each(function(){
              console.log($(this).attr("onclick","window.open('"+winURL+"',1,'height=400,width=800,resizable,scrollbars,status')"));
            })
          }, 500);
        });
        if(bar){
          this.SpinnerService.hide();
        }
      }else{
        this.tableAppointment = productsJson.data.replace(/\\/g, '');
      }
      
    },
    (error) => {}
  ) */
}


}







