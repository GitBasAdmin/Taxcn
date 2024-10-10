import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { CaseService,Case } from 'src/app/services/case.service.ts';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';

@Component({
  selector: 'app-fno2300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fno2300.component.html',
  styleUrls: ['./fno2300.component.css']
})


export class Fno2300Component implements AfterViewInit, OnInit, OnDestroy {
  getCaseType:any;
  getTitle:any;selTitle:any;
  getRedTitle:any;selRedTitle:any;
  getInOut:any;
  getCourt:any;
  checkedList:any=[];
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  result:any = [];
  result2:any = [];
  resultTmp:any = [];
  dataHead:any = [];
  dataNotice:any = [];
  dataNoticeHistorical:any = [];
  modalType:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private caseService:CaseService,
    private printReportService: PrintReportService,
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
    this.dtOptions2 = {
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
      },
      (error) => {}
    )
     //======================== pcourt ======================================
     var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )
    this.getInOut = [{fieldIdValue:0,fieldNameValue: 'ทั้งหมด'},{fieldIdValue:1,fieldNameValue: 'ในเขต'},{fieldIdValue:2,fieldNameValue: 'ข้ามเขต'}];

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.dataHead = [];
    this.result.sdate = myExtObject.curDate();
    this.result.stime = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
    this.result.inout_flag = 0;
    this.result.court_id = this.userData.courtId;
    this.result.case_type = this.userData.defaultCaseType;this.changeCaseType(this.userData.defaultCaseType);
    this.result.dep_id = this.resultTmp['dep_id'];
    this.result.dep_name = this.resultTmp['dep_name'];

    this.result2.s_date = myExtObject.curDate();
    this.result2.stime = '06.00';
    this.result2.etime = '18.00';

    this.getNoticeNo(this.userData.courtId);
    this.searchNoticeHistoricalData();
  }
  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  getNoticeNo(courrId:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(courrId){
      var student = JSON.stringify({
        "table_name" : "pcourt",
         "field_id" : "std_id",
         "field_name" : "court_name",
        "condition" : " AND court_id='"+courrId+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.notice_court_running = productsJson[0].fieldIdValue;
            this.result.notice_yy = myExtObject.curYear();
          }else{
            this.result.notice_court_running = '';
            this.result.notice_yy = '';
          }
         },
         (error) => {}
       )
    }
  }
  changeCaseType(caseType:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "field_name2": "default_value",
      "condition": "AND title_flag='1' AND case_type='"+caseType+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        this.getTitle = getDataOptions;
        this.result.title = this.getTitle.find((x : any ) => x.fieldNameValue2 === 1).fieldNameValue;
      },
      (error) => {}
    )

    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "field_name2": "default_value",
      "condition": "AND title_flag='2' AND case_type='"+caseType+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        this.getRedTitle = getDataOptions;
        this.result.red_title = this.getRedTitle.find((x : any ) => x.fieldNameValue2 === 1).fieldNameValue;
      },
      (error) => {}
    )
  }

  printReport(type:any){
    this.ListData();
    if(this.checkedList.length < 1){
      return(false);
    }

    var rptName = 'rfno2300';

    // For no parameter : paramData ='{}'
    var paramData ='{}';
    var pnotice_running = [...new Set(this.checkedList)];
    // For set parameter to report
    var paramData = JSON.stringify({
      "ptime_start" :  this.result2.stime,
      "ptime_end" :  this.result2.etime,
      "pevent_date" : myExtObject.conDate(this.result2.s_date),
      "pprint_type" : type.toString(),
      "poff_id" : this.userData.userCode,
    });
    console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }


  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fno2300"
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
    myExtObject.callCalendar();
    }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  tabChangeInput(name:any,event:any){
    let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
    if(name=='dep_id'){
      var student = JSON.stringify({
        "table_name" : "pdepartment",
         "field_id" : "dep_code",
         "field_name" : "dep_name",
        "condition" : " AND dep_code='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.dep_name = productsJson[0].fieldNameValue;
        }else{
          this.result.dep_id = '';
          this.result.dep_name = '';
        }
        },
        (error) => {}
      )
    }
  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.dep_id=event.fieldIdValue;
      this.result.dep_name=event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  loadMyModalComponent(){
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pdepartment",
         "field_id" : "dep_code",
         "field_name" : "dep_name",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='pdepartment';
      this.listFieldId='dep_code';
      this.listFieldName='dep_name';
      this.listFieldNull='';
    }else if(this.modalType==2){
      this.loadModalComponent = false;
      this.loadModalConfComponent = true;
    }
    if(this.modalType==1 ){
      this.loadModalComponent = true;
      this.loadModalConfComponent = false;
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

  closeModal(){
    this.loadModalComponent = false;
    this.loadModalConfComponent = false;
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
                    this.dataNoticeHistorical.forEach((ele, index, array) => {
                          if(ele.hRunning == true){
                            dataTmp.push(this.dataNoticeHistorical[index]);
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
                    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno2300/cancelHistoricalData', data , {headers:headers}).subscribe(
                      (response) =>{
                        let alertMessage : any = JSON.parse(JSON.stringify(response));
                        console.log(alertMessage)
                        if(alertMessage.result==0){
                          const confirmBox2 = new ConfirmBoxInitializer();
                          confirmBox2.setMessage(alertMessage.error);
                          confirmBox2.setButtonLabels('ตกลง');
                          confirmBox2.setConfig({
                              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              this.closebutton.nativeElement.click();
                              this.SpinnerService.hide();
                            }
                            subscription2.unsubscribe();
                          });
                        }else{
                          const confirmBox2 = new ConfirmBoxInitializer();
                          confirmBox2.setMessage(alertMessage.error);
                          confirmBox2.setButtonLabels('ตกลง');
                          confirmBox2.setConfig({
                              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              this.closebutton.nativeElement.click();
                              this.searchNoticeHistoricalData();
                              this.SpinnerService.hide();
                            }
                            subscription2.unsubscribe();
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

  searchNotice(type:any){
    const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.dep_id){
      confirmBox.setMessage('กรุณาระบุปลายทาง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.sdate || !this.result.stime){
      confirmBox.setMessage('กรุณาวันที่และเวลาที่ส่งให้ครบถ้วน');
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
        var student = JSON.stringify({
          "notice_court_running": this.result.notice_court_running,
          "notice_no": this.result.notice_no,
          "notice_yy": this.result.notice_yy,
          "event_type": 1,
          "dep_id": this.result.dep_id,
          "sdate": this.result.sdate,
          "stime": this.result.stime,
          "userToken" : this.userData.userToken
        });
      }else if(type==2){
        var student = JSON.stringify({
          "barcode" : this.result.barcode,
          "dep_id": this.result.dep_id,
          "sdate": this.result.sdate,
          "stime": this.result.stime,
          "event_type" : 1,
          "userToken" : this.userData.userToken
        });
      }else{
        var student = JSON.stringify({
          "case_barcode" : this.result.cbarcode,
          "dep_id": this.result.dep_id,
          "sdate": this.result.sdate,
          "stime": this.result.stime,
          "event_type" : 1,
          "userToken" : this.userData.userToken
        });
      }
        console.log(student)
        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno2300/insertHistoricalFromBarcode', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.result==1){
              confirmBox.setMessage(productsJson.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.setDefPage();
                  this.SpinnerService.hide();
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
                if (resp.success==true){
                  this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
            }
          },
          (error) => {}
        )
    }
  }

  directiveDate(date:any,obj:any){
   this.result2[obj] = date;
  }

  ListData(){
    // alert('xxxxx');
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var print = 0;
    this.checkedList = [];
    var bar = new Promise((resolve, reject) => {
    this.dataNoticeHistorical.forEach((ele, index, array) => {
      if(ele.notice_running){
        print++;
        console.log(ele.notice_running);
        this.checkedList.push(ele.notice_running.toString());
        console.log(this.checkedList);
     }
    });
  });

  if(bar){
    if (!print) {
      confirmBox.setMessage('ไม่มีข้อมูลที่ต้องการพิมพ์');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
        if (resp.success == true) {
          //  this.result.setFocus('barcode');
        }
        subscription.unsubscribe();
      });
    }
    }
  }

  searchNoticeHistoricalData(){
    this.SpinnerService.show();
    var student = JSON.stringify({
      "s_date" : this.result2.s_date,
      "stime" : this.result2.stime,
      "etime" : this.result2.etime,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno2300/getHistoricalData', student , {headers:headers}).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        this.SpinnerService.hide();
        if(productsJson.result==1){
          this.dataNoticeHistorical = productsJson.data;
          this.dataNoticeHistorical.forEach((x : any ) => x.hRunning = false);
        }else{
          this.dataNoticeHistorical = [];
        }
      },
      (error) => {}
    )
  }

  searchNoticeData(){
    var student = JSON.stringify({
      "run_id" : this.dataHead.run_id,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno2300/getNoticeData', student , {headers:headers}).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.result==1){
          this.dataNotice = productsJson.data;
          this.dataNotice.forEach((x : any ) => x.nRunning = false);
        }else{
          this.dataNotice = [];
        }
      },
      (error) => {}
    )
  }


  async searchCaseNo(type:any): Promise<void> {
    //type:any,all_data:any,run_id:any,case_type:any,title:any,id:any,yy:any
    var objCase = [];
    if(type==1){
      objCase["type"] = 1;
      objCase["case_type"] = this.result.case_type;
      objCase["all_data"] = 0;
      objCase["run_id"] = 0;
      objCase["title"] = this.result.title;
      objCase["id"]= this.result.id;
      objCase["yy"]= this.result.yy;
      objCase["userToken"] = this.userData.userToken;
      const cars = await this.caseService.searchCaseNo(objCase);
      console.log(cars)
      if(cars['result']==1){
        this.dataHead = JSON.parse(JSON.stringify(cars['data'][0]));
        console.log(this.dataHead)
        if(this.dataHead.red_title){
          this.result.red_title = this.dataHead.red_title;
          this.result.red_id = this.dataHead.red_id;
          this.result.red_yy = this.dataHead.red_yy;
        }
        this.searchNoticeData();
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage(cars['error']);
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
    }else{
      objCase["type"] = 2;
      objCase["case_type"] = this.result.case_type;
      objCase["all_data"] = 0;
      objCase["run_id"] = 0;
      objCase["title"] = this.result.red_title;
      objCase["id"]= this.result.red_id;
      objCase["yy"]= this.result.red_yy;
      objCase["userToken"] = this.userData.userToken;
      const cars = await this.caseService.searchCaseNo(objCase);
      console.log(cars)
      if(cars['result']==1){
        this.dataHead = JSON.parse(JSON.stringify(cars['data'][0]));
        console.log(this.dataHead)
        if(this.dataHead.title){
          this.result.title = this.dataHead.title;
          this.result.id = this.dataHead.id;
          this.result.yy = this.dataHead.yy;
        }
        this.searchNoticeData();
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage(cars['error']);
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
    }
  }

  saveData(){
    console.log(this.result.send_flag)
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.dep_id){
      confirmBox.setMessage('กรุณาระบุปลายทาง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.sdate || !this.result.stime){
      confirmBox.setMessage('กรุณาวันที่ส่งและเวลาส่งให้ครบถ้วน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      var dataSave = [],dataTmp=[];
      dataSave['event_type'] = 1;
      dataSave['dep_id'] = this.result.dep_id;
      dataSave['userToken'] = this.userData.userToken;
      var bar = new Promise((resolve, reject) => {
        this.dataNotice.forEach((ele, index, array) => {
            if(ele.nRunning == true){
              dataTmp.push(this.dataNotice[index]);
            }
        });
      });

      if(bar){
        if(!dataTmp.length){
          confirmBox.setMessage('กรุณาคลิกเลือกข้อมูล');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
        }else{
          this.SpinnerService.show();
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type','application/json');
          dataSave['data'] = dataTmp;
          var data = $.extend({}, dataSave);
          console.log(data)
          this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno2300/insertHistoricalData', data , {headers:headers}).subscribe(
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
                    this.SpinnerService.hide();
                    this.resultTmp["dep_id"] = this.result.dep_id;
                    this.resultTmp["dep_name"] = this.result.dep_name;
                    this.resultTmp["sdate"] = this.result.sdate;
                    this.resultTmp["stime"] = this.result.stime;
                    this.setDefPage();
                  }
                  subscription.unsubscribe();
                });
              }
            },
            (error) => {this.SpinnerService.hide();}
          )
        }
      }
    }
  }

  cancelData(){
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataNoticeHistorical.forEach((ele, index, array) => {
        if(ele.hRunning == true){
          del++;
        }
      });
    });
    if(bar){
      if(del){
        this.clickOpenMyModalComponent(2);
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องการยกเลิก');
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
  }



}







