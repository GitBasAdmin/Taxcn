import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren,QueryList,Output,EventEmitter   } from '@angular/core';
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
  selector: 'app-fkb0600,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkb0600.component.html',
  styleUrls: ['./fkb0600.component.css']
})


export class Fkb0600Component implements AfterViewInit, OnInit, OnDestroy {
  getCaseType:any;selCaseType:any;
  getTitle:any;selTitle:any;
  getRedTitle:any;selRedTitle:any;
  getInOut:any;selInOut:any;
  getCourt:any;selCourt:any;

  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  checkedList:any=[];

  result:any = [];
  resultTmp:any = [];
  result2:any = [];
  dataHead:any = [];
  dataNotice:any = [];
  dataNoticeHistorical:any = [];
  modalType:any;
  myExtObject: any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  public caseObservable$: Observable<Case>;

  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  public loadModalNoticeComponent: boolean = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

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
      searching : false
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
      searching : false
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
        //this.selCaseType = this.getCaseType.find((x : any ) => x.fieldIdValue === this.userData.defaultCaseType).fieldNameValue;
        this.changeCaseType(this.userData.defaultCaseType);
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
        this.selCourt = this.getCourt.find((x : any ) => x.fieldIdValue === this.userData.courtId).fieldNameValue;
        //console.log(getDataOptions)
      },
      (error) => {}
    )
    this.getInOut = [{fieldIdValue:0,fieldNameValue: 'ทั้งหมด'},{fieldIdValue:1,fieldNameValue: 'ในเขต'},{fieldIdValue:2,fieldNameValue: 'ข้ามเขต'}];
    this.selInOut = this.getInOut.find((x:any) => x.fieldIdValue === 0).fieldNameValue

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.dataHead = [];
    this.result.case_type = this.userData.defaultCaseType;
    this.changeCaseType(this.result.case_type);
    this.result.sdate = myExtObject.curDate();
    this.result.stime = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
    this.result.send_flag = this.resultTmp['send_flag'];
    this.result.dep_id = this.resultTmp['dep_id'];
    this.result.dep_name = this.resultTmp['dep_name'];
    this.getNoticeNo(this.userData.courtId);

    this.result2.sdate = this.result2.edate = myExtObject.curDate();
    this.result2.stime = '05.00';
    this.result2.etime = '20.00';
    this.result2.cond = '0';
    this.searchNoticeHistoricalData();
  }

  getNoticeNo(courrId:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(courrId && !this.result.run_id){
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

  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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
        var title = this.getTitle.filter((x:any) => x.fieldNameValue2 === 1) ;
        if(title.length!=0){
          this.result.title = title[0].fieldNameValue;
        }
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
        var title = this.getRedTitle.filter((x:any) => x.fieldNameValue2 === 1) ;
        if(title.length!=0){
          this.result.red_title = title[0].fieldNameValue;
        }
      },
      (error) => {}
    )
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

  printReport(type:any){
    this.ListData();
    if(this.checkedList.length < 1){
      return(false);
    }

    var rptName = 'rfkb0600';
    var printaddr;
    if(type==1){
      printaddr = '0';
    }else{
      printaddr = '1';
    }

    // For no parameter : paramData ='{}'
    var paramData ='{}';
    var pnotice_running = [...new Set(this.checkedList)];
    // For set parameter to report
    var paramData = JSON.stringify({
      "pcond" :  this.result2.cond ? this.result2.cond : '',
      "ptime_start" :  this.result2.stime,
      "ptime_end" :  this.result2.etime,
      "pdate_start" : myExtObject.conDate(this.result2.sdate),
      "pdate_end" : myExtObject.conDate(this.result2.edate),
      "pprint_addr" : printaddr,
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
      }
    }else{

    }
  }

  searchNotice(type:any){
    const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.dep_id && typeof this.result.send_flag==='undefined'){
      confirmBox.setMessage('กรุณาระบุปลายทาง');
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
        if(typeof this.result.send_flag==='undefined'){
          var student = JSON.stringify({
            "notice_court_running": this.result.notice_court_running,
            "notice_no": this.result.notice_no,
            "notice_yy": this.result.notice_yy,
            "event_type": 1,
            "dep_id": this.result.dep_id,
            "send_flag" : this.result.send_flag,
            "userToken" : this.userData.userToken
          });
        }else{
          var student = JSON.stringify({
            "notice_court_running": this.result.notice_court_running,
            "notice_no": this.result.notice_no,
            "notice_yy": this.result.notice_yy,
            "send_flag" : this.result.send_flag,
            "event_type": 1,
            "userToken" : this.userData.userToken
          });
        }

      }else{
        if(typeof this.result.send_flag==='undefined'){
          var student = JSON.stringify({
            "barcode" : this.result.barcode,
            "dep_id": this.result.dep_id,
            "send_flag" : this.result.send_flag,
            "event_type" : 1,
            "userToken" : this.userData.userToken
          });
        }else{
          var student = JSON.stringify({
            "barcode" : this.result.barcode,
            "send_flag" : this.result.send_flag,
            "event_type" : 1,
            "userToken" : this.userData.userToken
          });
        }

      }

        console.log(student)
        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0600/insertHistoricalFromBarcode', student , {headers:headers}).subscribe(
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
           this.result.dep_name = '';
           this.result.dep_name = '';
         }
         },
         (error) => {}
       )
    }
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    if(this.modalType==2 && !this.dataHead.run_id){
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
      this.openbutton.nativeElement.click();
    }
  }

  closeModal(){
    this.loadModalComponent = false;
    this.loadModalConfComponent = false;
    this.loadModalNoticeComponent = false;
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

            const confirmBox2 = new ConfirmBoxInitializer();
            confirmBox2.setTitle('ต้องการยกเลิกข้อมูลใช่หรือไม่?');
            confirmBox2.setMessage('ยืนยันการยกเลิกข้อมูลที่เลือก');
            confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
            confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
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
                      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0600/cancelHistoricalData', data , {headers:headers}).subscribe(
                        (response) =>{
                          let alertMessage : any = JSON.parse(JSON.stringify(response));
                          console.log(alertMessage)
                          if(alertMessage.result==0){
                            const confirmBox3 = new ConfirmBoxInitializer();
                            confirmBox3.setMessage(alertMessage.error);
                            confirmBox3.setButtonLabels('ตกลง');
                            confirmBox3.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.SpinnerService.hide();
                              }
                              subscription3.unsubscribe();
                            });
                          }else{
                            const confirmBox3 = new ConfirmBoxInitializer();
                            confirmBox3.setMessage(alertMessage.error);
                            confirmBox3.setButtonLabels('ตกลง');
                            confirmBox3.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.searchNoticeHistoricalData();
                                this.SpinnerService.hide();
                              }
                              subscription3.unsubscribe();
                            });
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
                    }

                }
                subscription2.unsubscribe();
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

      if(this.modalType==1){
        this.loadModalComponent = true;
        this.loadModalConfComponent = false;
        this.loadModalNoticeComponent = false;
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
    }if(this.modalType==2){
      this.loadModalComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalNoticeComponent = true;
      $("#exampleModal").find(".modal-content").css("width","850px");
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNoticeData', student , {headers:headers}).subscribe(
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
    }else if(this.modalType==3){
      this.loadModalComponent = false;
      this.loadModalConfComponent = true;
      this.loadModalNoticeComponent = false;
    }
  }

  searchNoticeData(){
    var student = JSON.stringify({
      "run_id" : this.dataHead.run_id,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0600/getNoticeData', student , {headers:headers}).subscribe(
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

  searchNoticeHistoricalData(){
    this.SpinnerService.show();
    var student = JSON.stringify({
      "cond" : this.result2.cond,
      "sdate" : this.result2.sdate,
      "edate" : this.result2.edate,
      "stime" : this.result2.stime,
      "etime" : this.result2.etime,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0600/getHistoricalData', student , {headers:headers}).subscribe(
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

  directiveDate(date:any,obj:any){
    this.result2[obj] = date;
  }
  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.dep_id=event.fieldIdValue;
      this.result.dep_name=event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  receiveFuncNoticeData(event:any){
    this.result.dep_id=event.fieldIdValue;
    this.result.dep_name=event.fieldNameValue;
    this.closebutton.nativeElement.click();
  }

  saveData(){
    console.log(this.result.send_flag)
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.dep_id && typeof this.result.send_flag==='undefined'){
      confirmBox.setMessage('กรุณาระบุปลายทาง');
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
      dataSave['send_flag'] = this.result.send_flag;
      dataSave['event_type'] = 1;
      if(typeof this.result.send_flag==='undefined')
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
          this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0600/insertHistoricalData', data , {headers:headers}).subscribe(
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
                    this.resultTmp["send_flag"] = this.result.send_flag;
                    this.resultTmp["dep_id"] = this.result.dep_id;
                    this.resultTmp["dep_name"] = this.result.dep_name;
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
        this.clickOpenMyModalComponent(3);
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

  assignDep(event:any){
    if(event==true){
      this.result.dep_id = '';
      this.result.dep_name = '';
    }else{
      this.result.dep_id = this.resultTmp.dep_id;
      this.result.dep_name = this.resultTmp.dep_name;
    }
  }

}







