import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter,ViewEncapsulation } from '@angular/core';
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
import { NgbModal, NgbModalRef   } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { ModalEnvelopeComponent } from '../../modal/modal-envelope/modal-envelope.component';
import { Fap0150Component } from '../../fap/fap0150/fap0150.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fap0111,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fap0111.component.html',
  styleUrls: ['./fap0111.component.css']
})


export class Fap0111Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  
  getMonthTh:any;
  getJudgeBy:any;
  getAppointBy:any;selAppointBy:any;
  getAppointTable:any;
  selAppointTable:any;
  selTableId:any;
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
  dataHead:any = [];
  dataAppointment:any = [];
  dataSaveTmp:any = [];
  myExtObject: any;
  tableAppointment:any;
  modalType:any;
  runId:any;
  case_running:any;
  getCourt:any;
  buttonDelApp: boolean = false;
  appCourt: boolean = false;
  

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
  public loadModalJudgeGroupComponent: boolean = false;

 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public masterSelect: boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('date_appoint',{static: true}) date_appoint : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  @ViewChild( ModalEnvelopeComponent ) child2: ModalEnvelopeComponent ; 
  @ViewChild('monthTh') monthTh : NgSelectComponent;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private activatedRoute: ActivatedRoute,
    private ngbModal: NgbModal,
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
      if(params['run_id']){
        this.runId = this.dataHead.run_id = params['run_id'];
      }
      if(params['case_running'])
        this.case_running = this.dataHead.case_running = params['case_running'];
      if(typeof this.runId !='undefined')
        this.getObjAppData();
    });
      //this.asyncObservable = this.makeObservable('Async Observable');
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      //======================== pappoint_by ======================================
      var student = JSON.stringify({
        "table_name" : "pappoint_by",
        "field_id" : "appoint_by_id",
        "field_name" : "appoint_by_name",
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.getAppointBy = getDataOptions;
          this.selAppointBy = this.getAppointBy.find((x:any) => x.fieldIdValue === this.getAppointBy[0].fieldIdValue).fieldNameValue
        },
        (error) => {}
      )
      
      //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_running",
      "field_name" : "court_name",
      "field_name2" : "court_id",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
      },
      (error) => {}
    )
      

      this.getMonthTh = [{"fieldIdValue": '01', "fieldNameValue": "มกราคม"},{"fieldIdValue": '02', "fieldNameValue": "กุมภาพันธ์"},{"fieldIdValue": '03',"fieldNameValue": "มีนาคม"},{ "fieldIdValue": '04',"fieldNameValue": "เมษายน"},{"fieldIdValue": '05',"fieldNameValue": "พฤษภาคม"},{"fieldIdValue": '06',"fieldNameValue": "มิถุนายน"},{"fieldIdValue": '07',"fieldNameValue": "กรกฎาคม"},{"fieldIdValue": '08',"fieldNameValue": "สิงหาคม"},{"fieldIdValue": '09',"fieldNameValue": "กันยายน"},{"fieldIdValue": '10',"fieldNameValue": "ตุลาคม"},{"fieldIdValue": '11',"fieldNameValue": "พฤศจิกายน"},{"fieldIdValue": '12',"fieldNameValue": "ธันวาคม"}];
      this.getAppBy = [{"fieldIdValue": 1, "fieldNameValue": "1 ศูนย์นัดความ"},{"fieldIdValue": 2, "fieldNameValue": "2 ผู้พิพากษา"},{"fieldIdValue": 3,"fieldNameValue": "3 ศูนย์ไกล่เกลี่ย"}];

      if(this.successHttp()){
        this.setDefPage();
        this.setDefPage2();
      }
        
    }

    setDefPage(){
      this.param = [];
      // this.param.table_id = 3;
      // this.param.table_id = this.selTableId;//
      this.param.month = myExtObject.curMonth().toString();
      this.param.year = myExtObject.curYear().toString();
    }

    setDefPage2(){
      this.result = [];
      this.result.num = 1;
      this.result.mor_time = '09.00';
      this.result.eve_time = '13.00';
      this.result.night_time = '16.30';
      this.result.judge_by = 1;
      this.result.app_by = 1;
 
      if(this.dataHead.run_id && !this.dataHead.own_new_flag){
        this.result.judge_id = this.dataHead.case_judge_id;
        this.result.judge_name = this.dataHead.case_judge_name;
        this.result.judge_gid = this.dataHead.case_judge_gid;
        this.result.judge_gname = this.dataHead.case_judge_gname;
        this.result.judge_gid2 = this.dataHead.case_judge_gid2;
        this.result.judge_gname2 = this.dataHead.case_judge_gname2;
        this.result.judge_gid3 = this.dataHead.case_judge_gid3;
        this.result.judge_gname3 = this.dataHead.case_judge_gname3;
        this.result.room_id = this.dataHead.room_id;
        this.result.room_desc = this.dataHead.room_desc;
      }
      //alert(this.dataSaveTmp.length)
      if(this.dataSaveTmp.length){
        this.result.app_id = this.dataSaveTmp[0].app_id;
        this.result.app_name = this.dataSaveTmp[0].app_name;
      }
      
      this.checkCourt(this.result.judge_by);
      this.dataSaveTmp = [];

      //======================== pappoint_table ======================================
      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "condition": this.userData.userLevel=='A'?" AND table_type='2'":" AND table_type='2' AND EXISTS(SELECT * FROM pappoint_table_department WHERE pappoint_table_department.table_id=pappoint_table.table_id AND pappoint_table_department.dep_id=55)",
        "order_by": " NVL(table_order,999) ASC,NVL(table_id,999) ASC",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getAppointTable = getDataOptions;
          //----M---
          var fine3 = this.getAppointTable.filter((x:any) => x.fieldIdValue === 3);
          if(fine3.length > 0)
          this.param.table_id =fine3[0].fieldIdValue;
          else if(this.getAppointTable.length > 0)
          this.param.table_id = this.getAppointTable[0].fieldIdValue;
          this.callCalendarApp();
          //-------

         /*  var fine = this.getAppointTable.filter((x:any) => x.fieldIdValue === 4);
          if(fine.length)
            this.selAppointTable = fine[0].fieldNameValue; */
        },
        (error) => {}
      )
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
                //console.log(this.tableAppointment)
                let winURL = this.authService._baseUrl;
                winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+"case-conciliate";
                var month = this.param.month;
                var year = this.param.year;
                /*
                setTimeout(() => {
                  $("body").find(".appTable").find("tr td").each(function(){
                    if(!$(this).find('div').first().hasClass("div_holiday")){
                      var string = new String($(this).find('div.div_day b').html()) 
                      var day = string.length==1?'0'+string:string;
                      $(this).find('div.div_day').attr("onclick","$('body').find('.date_appoint').val('"+day+'/'+month+'/'+year+"');$('body').find('.date_appoint').click()");
                      //$('body').find('.date_appoint').trigger('click');
                    }
                    //$(this).find('div.div_app').attr("onclick","window.open('"+winURL+"',1,'height=400,width=800,resizable,scrollbars,status');");
                  });
                }, 500);
                */
                    setTimeout(() => {
                    const spanEl = document.querySelectorAll<HTMLSpanElement>(".appTextGreen");
                    var modal = this.ngbModal;
                      for (let i = 0; i < spanEl.length; i++) {
                        spanEl[i].addEventListener("click", event =>  {
                          var day = this.pad(spanEl[i].parentElement.closest('div').previousElementSibling.querySelector('b').innerHTML, 2,'')
                          const modalRef: NgbModalRef = modal.open(Fap0150Component,{ windowClass: 'my-class'})
                          modalRef.componentInstance.table_id = this.param.table_id
                          modalRef.componentInstance.date_appoint = day+'/'+this.param.month+'/'+this.param.year
                        });
                      }
                    }, 1000);
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

    assignDate(){
      alert(99)
    }

    async successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fap0111"
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
    console.log('promise',promise);
    return promise;
  }

  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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
      this.result[obj] = date;
    }
//===================================================================================================== modal ======================================================================
closeModal(){
  this.loadModalComponent = false;
  this.loadModalConfComponent = false;
  this.loadModalJudgeComponent = false;
  this.loadModalEnvolopeComponent = false;
  this.loadModalJudgeGroupComponent = false;
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
          const confirmBox2 = new ConfirmBoxInitializer();
          confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
          confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
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
                                this.getObjAppData();
                              }
                              subscription.unsubscribe();
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
  }else if(this.modalType==6){
    this.result.judge_gid = event.judge_id;
    this.result.judge_gname = event.judge_name;
  }else if(this.modalType==7){
    this.result.judge_gid2 = event.judge_id;
    this.result.judge_gname2 = event.judge_name;
  }else if(this.modalType==8){
    this.result.judge_gid3 = event.judge_id;
    this.result.judge_gname3 = event.judge_name;
  }
  this.closebutton.nativeElement.click();
}

receiveFuncListData(event:any){
  console.log(event)
  if(this.modalType==1){
    this.result.app_id=event.fieldIdValue;
    this.result.app_name=event.fieldNameValue;
  }else if(this.modalType==3){
    this.result.room_id=event.fieldIdValue;
    this.result.room_desc=event.fieldNameValue;
  }
  this.closebutton.nativeElement.click();
}

receiveJudgeGroupListData(event:any){
  this.result.judge_id=event.judge_id1;
  this.result.judge_name=event.judge_name1;

  this.result.judge_gid=event.judge_id2;
  this.result.judge_gname=event.judge_name2;
  this.closebutton.nativeElement.click();
}

clickOpenMyModalComponent(type:any){
  this.modalType = type;
  this.openbutton.nativeElement.click();
}

loadMyModalComponent(){
  if(this.modalType==1){
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
  }else if(this.modalType==2 || this.modalType==6 || this.modalType==7 || this.modalType==8){
    $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = true;
      this.loadModalEnvolopeComponent = false;
      this.loadModalJudgeGroupComponent = false;
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
  }else if(this.modalType==3){
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
  }else if(this.modalType==4){
    $("#exampleModal").find(".modal-content").css("width","850px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalEnvolopeComponent = true;
      this.loadModalJudgeGroupComponent = false;
  }else if(this.modalType==5){
    $("#exampleModal").find(".modal-content").css("width","950px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalEnvolopeComponent = false;
      this.loadModalJudgeGroupComponent = true;
  }else if(this.modalType==100){
    $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = true;
      this.loadModalJudgeComponent = false;
      this.loadModalEnvolopeComponent = false;
      this.loadModalJudgeGroupComponent = false;
  }

  if(this.modalType==1 || this.modalType==3){
    this.loadModalComponent = true;
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalEnvolopeComponent = false;
    this.loadModalJudgeGroupComponent = false;
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

tabChangeInput(name:any,event:any){
  let headers = new HttpHeaders();
   headers = headers.set('Content-Type','application/json');
  if(name=='app_id'){
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
        this.result.app_name = productsJson[0].fieldNameValue;
      }else{
        this.result.app_id = '';
        this.result.app_name = '';
      }
      },
      (error) => {}
    )
  }else if(name=='judge_id'){
    var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "condition" : " AND judge_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.result.judge_name = productsJson[0].fieldNameValue;
      }else{
        this.result.judge_id = '';
        this.result.judge_name = '';
      }
      },
      (error) => {}
    )
  }else if(name=='judge_gid'){
    var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "condition" : " AND judge_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.result.judge_gname = productsJson[0].fieldNameValue;
      }else{
        this.result.judge_gid = '';
        this.result.judge_gname = '';
      }
      },
      (error) => {}
    )
  }else if(name=='judge_gid2'){
    var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "condition" : " AND judge_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.result.judge_gname2 = productsJson[0].fieldNameValue;
      }else{
        this.result.judge_gid2 = '';
        this.result.judge_gname2 = '';
      }
      },
      (error) => {}
    )
  }else if(name=='judge_gid3'){
    var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "condition" : " AND judge_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.result.judge_gname3 = productsJson[0].fieldNameValue;
      }else{
        this.result.judge_gid3 = '';
        this.result.judge_gname3 = '';
      }
      },
      (error) => {}
    )
  }else if(name=='room_id'){
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
        this.result.room_desc = productsJson[0].fieldNameValue;
      }else{
        this.result.room_id = '';
        this.result.room_desc = '';
      }
      },
      (error) => {}
    )
} 
}


//===================================================================================================== end modal ======================================================================
fnDataHead(event:any){
  console.log(event)
  this.dataHead = event;
  this.setDefPage();
    this.setDefPage2();
    this.getObjAppData();
  if(this.dataHead.buttonSearch==1){
    
    this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
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
  //console.log('host:'+window.location.href.substring(0,this.authService._baseUrl.indexOf("/#/")+3))
  //console.log('host:'+window.location.href.split("/#/")[0]+"/#/")

  //var link = "http://localhost:4200/#/fju0100";
  //let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/fap0130?app_running='+this.dataAppointment[index].app_running;
  //myExtObject.OpenWindowMaxName("http://"+winURL+'/'+this.userData.appName+'/#/fap0130?app_running='+this.dataAppointment[index].app_running);
  myExtObject.OpenWindowMaxName(winURL+'fap0130?app_running='+this.dataAppointment[index].app_running);
}

getObjAppData(){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var student = JSON.stringify({
    "run_id" : this.dataHead.run_id,
    "userToken" : this.userData.userToken
  });
  console.log(student)
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type','application/json');
  this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/getAppointData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      console.log(getDataOptions)
      if(getDataOptions.result==1){
          //-----------------------------//
         
              this.dataAppointment = getDataOptions.data;
              
              var bar = new Promise((resolve, reject) => {this.dataAppointment.forEach((x : any ) => x.aRunning = x.cRunning = false);});
              if(bar){
                var bar2 = new Promise((resolve, reject) => {
                  for (var x = 0; x < this.dataAppointment.length; x++) {
                    if(this.dataAppointment[x].cancel_flag==1){
                      this.dataAppointment[x].cRunning = true;
                    }
                  }
                });
                if(bar2){
                  this.rerender();
                  this.SpinnerService.hide();
                }
              }
              
            
          //-----------------------------//

      }else{
        //-----------------------------//
        /*
          confirmBox.setMessage(getDataOptions.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.dataAppointment = [];
              this.rerender();
              this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
          */
          this.SpinnerService.hide();
        //-----------------------------//
      }

    },
    (error) => {}
  )
}

saveData(){
  if(!this.param.table_id){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ไม่พบข้อมูลการกำหนดประเภทตารางนัดของคดีประเภทและชั้นพิจารณานี้');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(!this.result.date_appoint){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('กรุณาเลือกวันที่นัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(!this.result.num){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('กรุณาระบุจำนวนวันนัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if((typeof this.result.app_mor =='undefined' || this.result.app_mor==false) && (typeof this.result.app_eve =='undefined' ||this.result.app_eve==false) && (typeof this.result.app_night =='undefined' ||this.result.app_night==false)){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('กรุณาเลือกเวลาที่นัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(!this.result.app_id){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('กรุณาเลือกเหตุที่นัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else if(!this.result.app_name){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('กรุณาเลือกประเภทนัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else{
    var student = $.extend({},this.result);
    if(typeof this.result.app_mor =='undefined' || this.result.app_mor==false){
      delete student.app_mor;delete student.mor_time;
    }else{
      student.app_mor = 1;
    }
    if(typeof this.result.app_eve =='undefined' ||this.result.app_eve==false){
      delete student.app_eve;delete student.eve_time;
    }else{
      student.app_eve = 1;
    }
    if(typeof this.result.app_night =='undefined' ||this.result.app_night==false){
      delete student.app_night;delete student.night_time;
    }else{
      student.app_night = 1;
    }
    /*
    if(this.result.judge_by!=2){
      delete student.to_court_id;
    }else{
      delete student.room_id;delete student.room_desc;
    }
    */

    
    student['run_id'] = this.dataHead.run_id;
    student['table_id'] = this.param.table_id;
    student['userToken'] = this.userData.userToken;
    console.log(student)
    this.dataSaveTmp = [student];
    console.log(this.dataSaveTmp)
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/insertAllAppoint', student , {headers:headers}).subscribe(
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
                  this.getObjAppData();
                  this.result.notice_running = getDataOptions.notice_running;
                  this.setDefPage2();
                  this.SpinnerService.hide();
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
                  this.SpinnerService.hide();
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

cancelData(index:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ต้องการยกเลิกข้อมูลใช่หรือไม่?');
  var dataCancel = $.extend({},this.dataAppointment[index]);
  if(this.dataAppointment[index].cancel_flag){
    confirmBox.setMessage('ต้องการยกเลิกการยกเลิกนัด');
    var message = 'ยกเลิกการยกเลิกนัดเรียบร้อยแล้ว';
    dataCancel.cancel_flag = null;
    dataCancel.cancel_reason = null;
    dataCancel.cancel_date = null;
    dataCancel.delay_id=null;
    dataCancel.delay_name=null;
  }else{
    confirmBox.setMessage('ต้องการยกเลิกนัด');
    var message = 'ยกเลิกนัดเรียบร้อยแล้ว';
    dataCancel.cancel_flag = 1;
    dataCancel.cancel_reason = 'ยกเลิกนัด';
    dataCancel.cancel_date = myExtObject.curDate();
    dataCancel.delay_id=99;
    dataCancel.delay_name="ยกเลิกนัด"
  }
  confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
  // Choose layout color type
  confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
  });
  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
        
        var student = [];
        student['data'] = [dataCancel];
        student['userToken'] = this.userData.userToken;
        student = $.extend({},student);
        console.log(student)
        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');

        this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/updateAllAppointDataByDate', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
  
                //-----------------------------//
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(message);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.getObjAppData();
                    this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
                //-----------------------------//
  
            }else{
              //-----------------------------//
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(getDataOptions.error);
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
              //-----------------------------//
            }
  
          },
          (error) => {}
        )
        

      }else{
        if(this.dataAppointment[index].cancel_flag)
          this.dataAppointment[index].cRunning = true;
        else
          this.dataAppointment[index].cRunning = false;
      }
      subscription.unsubscribe();
    });
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

judgeAppoint(){
  let winURL = window.location.href.split("/#/")[0]+"/#/";
  if(!this.dataHead.run_id)
    this.dataHead.run_id = '';
  if(!this.dataHead.case_judge_id)
    this.dataHead.case_judge_id = '';
  if(!this.dataHead.case_judge_name)
    this.dataHead.case_judge_name = '';
  myExtObject.OpenWindowMaxName(winURL+'judge_appoint?judge_id='+this.dataHead.case_judge_id+'&judge_name='+this.dataHead.case_judge_name+'&month='+this.param.month+'&year='+this.param.year,'judge_appoint');
}

closeWin(){
  if(typeof this.runId =='object')
      var run_id = this.runId.run_id;
    else
      var run_id = this.runId?this.runId:this.dataHead.run_id;
  if(run_id){
    
    if(window.opener.location.hash.indexOf('fju0600') !== -1 ){
      if(run_id && this.case_running)
        var url = 'fju0600?run_id='+run_id+'&case_running='+this.case_running;
      else if (run_id && !this.case_running)
        var url = 'fju0600?run_id='+run_id;
      else
        var url = 'fju0600';
      window.opener.myExtObject.openerReloadUrl(url);
    }else{
      if(run_id)
        window.opener.myExtObject.openerReloadRunId(run_id);
    }
    //console.log(window.opener.location.hash)
      /*
    if(run_id && this.case_running){
      var url = 'fud0100?run_id='+this.run_id+'&appeal_running='+this.appeal_running;
      window.opener.myExtObject.openerReloadUrl(url);
    }*/
    //window.opener.myExtObject.openerReloadRunId(this.runId);
  }else
    window.opener.myExtObject.openerReloadRunId(0);
  window.close();
}

}







