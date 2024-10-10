import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList,Output,EventEmitter    } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
} from '@angular/router';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;


@Component({
  selector: 'app-fkn0200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0200.component.html',
  styleUrls: ['./fkn0200.component.css']
})


export class Fkn0200Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';
  
  getEventType:any;
  getSendFlag:any;
  result:any = [];
  result2:any = [];
  dataHead:any = [];
  dataGroup:any = [];
  dataHistorical:any = [];
  modalType:any;
  runId:any;
  depCodeAfter:any;

  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  myExtObject: any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
 
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  grouptOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalJudgeComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  masterSelect:boolean = false;
  masterSelect2:boolean = false;

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
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute
  ){ }
   
  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };

    this.grouptOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[1,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy: true
    };

    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    
    this.activatedRoute.queryParams.subscribe(params => {
      this.runId = params['run_id'];
      if(this.runId>0){
        this.getHistoricalData(0);
      }
    });

    this.getEventType = [{fieldIdValue:1,fieldNameValue: 'ส่งสำนวน'},{fieldIdValue:3,fieldNameValue: 'ให้ยืมสำนวน'}];
    this.getSendFlag = [{fieldIdValue:1,fieldNameValue: 'สำนวน'},{fieldIdValue:2,fieldNameValue: 'กากสำนวน'}];
    
    this.successHttp();
    this.runMaster();
    this.setDefPage();
    this.getHistoricalData(0);
  }

  setDefPage(){
    this.result.event_type = 1;
    this.result.send_flag = 1;
    this.result.event_date = myExtObject.curDate();
    this.result.event_time = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
    
    this.result2.sdep_id = this.userData.depCode;
    this.result2.sdep_name = this.userData.depName;
    this.result2.sdate1 = myExtObject.curDate();
    this.result2.sdate2 = myExtObject.curDate();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fca0200"
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
     }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }
  directiveDate2(date:any,obj:any){
    this.result2[obj] = date;
  }

  ngAfterContentInit() : void{
    myExtObject.callCalendar();
  }

  runMaster(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken
    });

    this.http.get('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/runMaster?userToken='+this.userData.userToken+':angular').subscribe(
      (response) =>{
          let getRunning : any = JSON.parse(JSON.stringify(response));
            console.log(getRunning)
            if(getRunning.result==1){
              this.result.run_no = getRunning.run_no;
              this.result.run_yy = getRunning.run_yy;
            }else{
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(getRunning.error);
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

  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  closeModal(){
    this.loadModalJudgeComponent = false;
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
            confirmBox.setTitle('ต้องการยกเลิกข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการยกเลิกข้อมูลที่เลือก');
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
                    if(this.modalType==8){
                      var dataDel = [],dataTmp=[];
                      dataDel['log_remark'] = chkForm.log_remark;
                      dataDel['userToken'] = this.userData.userToken;
                      var bar = new Promise((resolve, reject) => {
                        this.dataHistorical.forEach((ele, index, array) => {
                              if(ele.hRunning == true){
                                dataTmp.push(this.dataHistorical[index]);
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
                        this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/cancelHistoricalData', data , {headers:headers}).subscribe(
                          (response) =>{
                            let alertMessage : any = JSON.parse(JSON.stringify(response));
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
                                  this.getHistoricalData(1);
                                  if(this.dataHead.run_id)
                                    this.getGroupData();
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

  receiveJudgeListData(event:any){
    this.result.judge_id = event.judge_id;
    this.result.judge_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  receiveFuncListData(event:any){
    if(this.modalType==1){
      this.result.dep_id=event.fieldIdValue;
      this.result.dep_name=event.fieldNameValue;
      if(this.result.master_running && (event.fieldIdValue!=this.depCodeAfter)){
        this.getMaster(2);
      }
    }else if(this.modalType==3){
      this.result.reason_id=event.fieldIdValue;
      this.result.reason=event.fieldNameValue;
    }else if(this.modalType==4){
      this.result.reason_id=event.fieldIdValue;
      this.result.reason=event.fieldNameValue;
    }else if(this.modalType==5){
      this.result.reason=this.result.reason+event.fieldNameValue;
    }else if(this.modalType==6){
      this.result2.sdep_id=event.fieldIdValue;
      this.result2.sdep_name=event.fieldNameValue;
    }else if(this.modalType==7){
      this.result2.sdep_id2=event.fieldIdValue;
      this.result2.sdep_name2=event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    if(this.modalType==1 || this.modalType==6 || this.modalType==7){
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
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = true;
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
        "table_name" : "prea_sendcase",
         "field_id" : "rea_id",
         "field_name" : "rea_desc",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='prea_sendcase';
      this.listFieldId='rea_id';
      this.listFieldName='rea_desc';
      this.listFieldNull='';
    }else if(this.modalType==4){
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
      this.listFieldNull='';
    }else if(this.modalType==5){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pofficer",
         "field_id" : "off_id",
         "field_name" : "off_name",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='pofficer';
      this.listFieldId='off_id';
      this.listFieldName='off_name';
      this.listFieldNull='';
    }else if(this.modalType==8){
      this.loadModalComponent = false;  
      this.loadModalConfComponent = true;
      this.loadModalJudgeComponent = false;
    }

    if(this.modalType==1 || this.modalType==3 || this.modalType==4 || this.modalType==5 || this.modalType==6 || this.modalType==7){
      this.loadModalComponent = true;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
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
    if(name=='dep_id'){
      console.log(this.result.master_running +':'+event.target.value+'!='+this.depCodeAfter)
      if(this.result.master_running && (event.target.value!=this.depCodeAfter)){
        this.getMaster(2);
      }
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
            this.result.dep_id = null;
            this.result.dep_name = '';
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
            this.result.judge_id = null;
            this.result.judge_name = '';
          }
         },
         (error) => {}
       )
    }else if(name=='reason_id'){
      var student = JSON.stringify({
        "table_name" : "prea_sendcase",
         "field_id" : "rea_id",
         "field_name" : "rea_desc",
        "condition" : " AND rea_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));

          if(productsJson.length){
            this.result.reason = productsJson[0].fieldNameValue;
          }else{
            this.result.reason_id = null;
            this.result.reason = '';
          }
         },
         (error) => {}
       )
    }else if(name=='sdep_id'){
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
            this.result2.sdep_name = productsJson[0].fieldNameValue;
          }else{
            this.result2.sdep_id = '';
            this.result2.sdep_name = '';
          }
         },
         (error) => {}
       )
    }else if(name=='sdep_id2'){
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
            this.result2.sdep_name2 = productsJson[0].fieldNameValue;
          }else{
            this.result2.sdep_id2 = '';
            this.result2.sdep_name2 = '';
          }
         },
         (error) => {}
       )
    }
  }

  fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      if(!this.result.master_running){
        this.result = [];
        //this.result.run_id = this.runId =this.dataHead.run_id;
        this.result.run_id = this.dataHead.run_id;
        this.runMaster();
        this.setDefPage();
      }
      this.getGroupData();
      this.getHistoricalData(0);
    }else if(this.dataHead.barcodeEnter==1){
      this.saveData();
    }
  }

  getGroupData(){
    if(this.dataHead.run_id){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "event_type" : '1,3',
        "send_flag" : this.result.send_flag ? this.result.send_flag : 1,
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/checkCaseLocation', student , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            //===================================================================
            var student = JSON.stringify({
              "run_id" : this.dataHead.run_id,
              "userToken" : this.userData.userToken
            });
            console.log(student)
            let headers = new HttpHeaders();
             headers = headers.set('Content-Type','application/json');
            this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/getGroupData', student , {headers:headers}).subscribe(
              (response) =>{
                let productsJson : any = JSON.parse(JSON.stringify(response));
                console.log(productsJson)
                if(productsJson.data.length){
                  this.dataGroup = productsJson.data;
                  this.dataGroup.forEach((x : any ) => x.gRunning = true);
                  this.rerender();
                  this.masterSelect = true;
                }else{
                  this.dataGroup = [];
                  this.rerender();
                  this.masterSelect = false;
                }
              },
              (error) => {}
            )
            //===================================================================
          }else{
            this.dataGroup = [];
            this.rerender();
            this.masterSelect = false;
          }
        },
        (error) => {}
      )
    }
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }

  updateData(index:any){

    if(this.dataHistorical[index].history_running){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "history_running" : this.dataHistorical[index].history_running,
        "reason" : this.dataHistorical[index].reason,
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/updateHistoricalData', student , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.SpinnerService.hide();
                this.getHistoricalData(0);
              }
              subscription.unsubscribe();
            });
          }else{
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
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

  saveData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.run_no || !this.result.run_no){
      confirmBox.setMessage('กรุณาระบุเลขอ้างอิง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.dep_id){
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
      var dataDel = [],dataTmp=[];
      var dataGroup = JSON.parse(JSON.stringify(this.dataGroup));
      if(this.dataHead.barcodeEnter==1){
        dataDel['barcode'] = this.dataHead.barcode;
        var api = '/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/insertHistoricalFromBarcode';
      }else{
        dataDel['run_id'] = this.dataHead.run_id;
        var api = '/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/insertHistoricalData';
      }
      dataDel['run_no'] = this.result.run_no;
      dataDel['run_yy'] = this.result.run_yy;
      dataDel['event_type'] = this.result.event_type;
      dataDel['send_flag'] = this.result.send_flag;
      dataDel['event_date'] = this.result.event_date;
      dataDel['event_time'] = this.result.event_time;
      dataDel['dep_id'] = this.result.dep_id;
      dataDel['dep_name'] = this.result.dep_name;
      dataDel['judge_id'] = this.result.judge_id;
      dataDel['judge_name'] = this.result.judge_name;
      dataDel['reason_id'] = this.result.reason_id;
      dataDel['reason'] = this.result.reason;
      dataDel['master_running'] = this.result.master_running;
      dataDel['userToken'] = this.userData.userToken;

      this.depCodeAfter = this.result.dep_id;//เก็บปลายทางว่าส่งไปไหน

      var bar = new Promise((resolve, reject) => {
        dataGroup.forEach((ele, index, array) => {
          if(ele.gRunning == true){
            ele.send_flag = parseInt(ele.send_flag);
            delete ele.gRunning;
            dataTmp.push(dataGroup[index]);
          }
        });
      });
      if(bar){
        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        dataDel['group_data'] = dataTmp;
        var data = $.extend({}, dataDel);
        console.log(data)
        this.http.post(api, data , {headers:headers}).subscribe(
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
              if(!this.dataHead.barcodeEnter){
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    //================================================================
                    this.runId = {'run_id' : 0,'counter' : Math.ceil(Math.random()*10000)}
                    this.result.master_running = alertMessage.master_running;
                    this.getHistoricalData(0);
                    this.searchRunNo(2);
                    this.dataHead = [];
                    this.dataGroup = [];this.masterSelect = false;
                    this.SpinnerService.hide();
                    //================================================================
                  }
                  subscription.unsubscribe();
                });
              }else{
                //================================================================
                this.runId = {'run_id' : 0,'counter' : Math.ceil(Math.random()*10000)}
                this.result.master_running = alertMessage.master_running;
                this.getHistoricalData(0);
                this.searchRunNo(2);
                this.dataHead = [];
                this.dataGroup = [];this.masterSelect = false;
                this.SpinnerService.hide();
                //================================================================
              }
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    }
  }

  getHistoricalData(type:any){
    if(type==0){
      var student = JSON.stringify({
        "event_type" : '1,3',
        "userToken" : this.userData.userToken
      });
    }else{
      var student = JSON.stringify({
        "srun_no" : this.result2.srun_no,
        "srun_yy" : this.result2.srun_yy,
        "sdep_id" : this.result2.sdep_id,
        "sdep_name" : this.result2.sdep_name,
        "sdep_id2" : this.result2.sdep_id2,
        "sdep_name2" : this.result2.sdep_name2,
        "sdate1" : this.result2.sdate1,
        "sdate2" : this.result2.sdate2,
        "event_type" : '1,3',
        "userToken" : this.userData.userToken
      });
    }
    console.log(student)
    if(type==1)
      this.SpinnerService.show();
    let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/getHistoricalData', student , {headers:headers}).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.data.length){
          this.dataHistorical = productsJson.data;
          this.dataHistorical.forEach((x : any ) => x.hRunning = false);
          this.rerender();
          this.SpinnerService.hide();
          this.masterSelect2 = false;
        }else{
          this.dataHistorical = [];
          this.rerender();
          this.SpinnerService.hide();
          this.masterSelect2 = false;
        }
      },
      (error) => {}
    )
  }

  afterForm(){
    //var run_no = this.result.run_no;
    //var run_yy = this.result.run_yy;
    //var dep_id = this.result.dep_id;
    //fkn0200/getMasterData
  }

  cancelData(){
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataHistorical.forEach((ele, index, array) => {
        if(ele.hRunning == true){
          del++;
        }
      });
    });
    if(bar){
      if(del){
        this.clickOpenMyModalComponent(8);
        //this.openbutton.nativeElement.click();
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องการลบ');
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

  searchRunNo(type:any){
    
    const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.run_no || !this.result.run_no){
      confirmBox.setMessage('กรุณาระบุเลขอ้างอิง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      if(type==1)
        this.SpinnerService.show();
        if(type==1){
          var student = JSON.stringify({
            "run_no" : this.result.run_no,
            "run_yy" : this.result.run_yy,
            "userToken" : this.userData.userToken
          });
        }else{
          var student = JSON.stringify({
            "master_running" : this.result.master_running,
            "userToken" : this.userData.userToken
          });
        }
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/getMasterData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
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
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              this.SpinnerService.hide();
            }else{
              this.result.run_no = productsJson.run_no;
              this.result.run_yy = productsJson.run_yy;
              this.result.master_running = productsJson.master_running;
              this.result.dep_id = productsJson.dep_id;
              this.result.dep_name = productsJson.dep_name;
              this.SpinnerService.hide();
            }
          },
          (error) => {}
        )
    }
    
  }

  getMasterButton(type:any){
    if(this.result.master_running){
      this.SpinnerService.show();
      var student = JSON.stringify({
        "master_running" : this.result.master_running,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/getMasterData', student , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(!productsJson.dep_name){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('คุณได้สร้างเลขอ้างอิงใหม่ไปแล้ว');
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
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ยืนยันการสร้างเลขอ้างอิง');
            confirmBox.setMessage('ต้องการสร้างเลขที่อ้างอิงส่งสำนวนใหม่ ใช่หรือไม่');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.confMaster(type);
              }else{
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {}
      )
    }else{
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ยืนยันการสร้างเลขอ้างอิง');
      confirmBox.setMessage('ต้องการสร้างเลขที่อ้างอิงส่งสำนวนใหม่ ใช่หรือไม่');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.confMaster(type);
        }
        subscription.unsubscribe();
      });
    }
  }
  getMaster(type:any){
    if(this.result.master_running){
      this.SpinnerService.show();
      var student = JSON.stringify({
        "master_running" : this.result.master_running,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/getMasterData', student , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(!productsJson.dep_name){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('คุณได้สร้างเลขอ้างอิงใหม่ไปแล้ว');
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
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('คุณเปลี่ยนหน่วยงานปลายทาง ระบบจะทำการเปลี่ยนเลขอ้างอิงให้อัตโนมัติ');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.confMaster(type);
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {}
      )
    }else{
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('คุณเปลี่ยนหน่วยงานปลายทาง ระบบจะทำการเปลี่ยนเลขอ้างอิงให้อัตโนมัติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.confMaster(type);
        }
        subscription.unsubscribe();
      });
    }
    
  }

  confMaster(type:any){
    //this.SpinnerService.show();
    var student = JSON.stringify({
      "event_type" : this.result.event_type,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0200/saveMaster', student , {headers:headers}).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
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
              this.SpinnerService.hide();
            }else{
              this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
        }else{
          this.result.run_no = productsJson.run_no;
          this.result.run_yy = productsJson.run_yy;
          if(type==2)
            this.result.master_running = productsJson.master_running;
          else
            this.result.master_running = '';
          this.SpinnerService.hide();
        }
      },
      (error) => {}
    )
  }

  gotoLink(){
    let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/prkn0100?ptype=1';
    myExtObject.OpenWindowMaxDimension(winURL,600,screen.width-100);
  }


}







