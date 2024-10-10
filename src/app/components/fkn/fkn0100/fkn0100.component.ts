import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
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
  selector: 'app-fkn0100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0100.component.html',
  styleUrls: ['./fkn0100.component.css']
})


export class Fkn0100Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';
  
  getEventType:any;
  getSendFlag:any;
  result:any = [];
  result2:any = [];
  result3:any = [];
  tmpResult3:any = [];
  dataHead:any = [];
  dataGroup:any = [];
  dataHistorical:any = [];
  dataHistorical2:any = [];
  resultTemp:any;
  myExtObject: any;
  modalType:any;
  
  runId:any;


  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
 
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  grouptOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  masterSelect:boolean = false;
  masterSelect2:boolean = false;
  masterSelect3:boolean = false;
  buttonType:boolean = false;
 
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

    this.dtOptions3 = {
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
        this.searchData(2,2);
      }
    });

    this.getEventType = [{fieldIdValue:2,fieldNameValue: 'รับสำนวน'},{fieldIdValue:4,fieldNameValue: 'เบิกสำนวน'}];
    this.getSendFlag = [{fieldIdValue:1,fieldNameValue: 'สำนวน'},{fieldIdValue:2,fieldNameValue: 'กากสำนวน'}
    /* ,{fieldIdValue:3,fieldNameValue: 'อื่นๆ'}*/];
    
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.setDefPage();
  }

  setDefPage(){
    this.result.event_type = 2;
    this.result.send_flag = 1;
    this.result.dep_id = this.userData.depCode;
    this.result.dep_name = this.userData.depName;
    this.result.event_date = myExtObject.curDate();
    this.result.event_time = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');

    this.result3.run_yy = myExtObject.curYear();
    this.result3.porder = 0;
    this.getHistoricalData(2);
  }

  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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
  
  ngAfterContentInit() : void{
    myExtObject.callCalendar();
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

    directiveDate(date:any,obj:any){
      this.result2[obj] = date;
    }

    directiveDate3(date:any,obj:any){
      this.result3[obj] = date;
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
          this.clickOpenMyModalComponent(2);
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
                const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการยกเลิกข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการยกเลิกข้อมูลที่เลือก');
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
                      if(this.modalType==2){
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
                          this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/cancelHistoricalData', data , {headers:headers}).subscribe(
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

    getHistoricalData(type:any){
      if(type==0){
        var student = JSON.stringify({
          "event_type" : '2,4',
          "userToken" : this.userData.userToken
        });
      }else if(type==1){
        var student = JSON.stringify({
          "sdate1" : this.result2.sdate1,
          "sdate2" : this.result2.sdate2,
          "event_type" : '2,4',
          "userToken" : this.userData.userToken
        });
      }else{
        var student = JSON.stringify({
          "sdate1" : myExtObject.curDate(),
          "sdate2" : myExtObject.curDate(),
          "event_type" : '2,4',
          "userToken" : this.userData.userToken
        });
      }
      console.log(student)
      if(type==1)
        this.SpinnerService.show();
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/getHistoricalData', student , {headers:headers}).subscribe(
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

    getGroupData(){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "event_type" : '2,4',
        "send_flag" : this.result.send_flag ? this.result.send_flag : 1,
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/checkCaseLocation', student , {headers:headers}).subscribe(
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
              
              this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/getGroupData', student , {headers:headers}).subscribe(
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

    receiveFuncListData(event:any){
      if(this.modalType==1){
        this.result.reason_id=event.fieldIdValue;
        this.result.reason=event.fieldNameValue;
      }else if(this.modalType==3){
        this.result3.sDepCode=event.fieldIdValue;
        this.result3.sDepName=event.fieldNameValue;
      }
      this.closebutton.nativeElement.click();
    }

    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      this.openbutton.nativeElement.click();
    }

    loadMyModalComponent(){
      if(this.modalType==1 ){
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
      }else if(this.modalType==2){
        this.loadModalComponent = false;  
        this.loadModalConfComponent = true;
      }else if(this.modalType==3){
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
      }
  
      if(this.modalType==1 || this.modalType==3){
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
  
  
    tabChangeInput(name:any,event:any){
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      if(name=='reason_id'){
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
      }else if(name=='sDepCode'){
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
              this.result3.sDepName = productsJson[0].fieldNameValue;
            }else{
              this.result3.sDepCode = null;
              this.result3.sDepName = '';
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
        if(this.resultTemp){
          //alert(99)
          this.result = $.extend([],this.resultTemp);
        }else{
          this.result = [];
          this.setDefPage();
        }
        //this.result.run_id = this.runId = this.dataHead.run_id;
        this.result.run_id = this.dataHead.run_id;
        this.getGroupData();
        this.getHistoricalData(0);
      }else if(this.dataHead.barcodeEnter==1){
        this.saveData();
      }
    }

    saveData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.result.reason && this.result.event_type==4){
        confirmBox.setMessage('กรุณาระบุเหตุผล');
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
        if(this.buttonType==false){
          var dataGroup = JSON.parse(JSON.stringify(this.dataGroup));
          if(this.dataHead.barcodeEnter==1){
            dataDel['barcode'] = this.dataHead.barcode;
            //var api = '/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/insertHistoricalFromBarcode';
          }else{
            dataDel['run_id'] = this.dataHead.run_id;
            //var api = '/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/insertHistoricalData';
          }
          dataDel['event_type'] = this.result.event_type;
          dataDel['send_flag'] = this.result.send_flag;
          dataDel['event_date'] = this.result.event_date;
          dataDel['event_time'] = this.result.event_time;
          dataDel['dep_id'] = this.result.dep_id;
          dataDel['dep_name'] = this.result.dep_name;
          dataDel['reason_id'] = this.result.reason_id;
          dataDel['reason'] = this.result.reason;
          dataDel['userToken'] = this.userData.userToken;
        }else{
          var dataGroup = JSON.parse(JSON.stringify(this.dataHistorical2));
          dataDel['userToken'] = this.userData.userToken;
        }
          
        
        this.resultTemp = $.extend({},dataDel);
        
        if(this.buttonType==false){
          var bar = new Promise((resolve, reject) => {
            dataGroup.forEach((ele, index, array) => {
              if(ele.gRunning == true){
                ele.send_flag = parseInt(ele.send_flag);

                delete ele.gRunning;
                dataTmp.push(dataGroup[index]);
              }
            });
          });
        }else{
          var bar = new Promise((resolve, reject) => {
            dataGroup.forEach((ele, index, array) => {
              if(ele.mRunning == true){
                ele.send_flag = parseInt(ele.send_flag);
                delete ele.mRunning;
                dataTmp.push(dataGroup[index]);
              }
            });
          });
        }
      
        if(bar){
          this.SpinnerService.show();
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type','application/json');
          
         
          if(this.buttonType==false){
            dataDel['group_data'] = dataTmp;
            var data = $.extend({}, dataDel);
            //var api = '/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/insertHistoricalData';
            if(this.dataHead.barcodeEnter==1){
              var api = '/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/insertHistoricalFromBarcode';
            }else{
              var api = '/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/insertHistoricalData';
            }
          }else{
            dataDel['data'] = dataTmp;
            var data = $.extend({}, dataDel);
            //var api = '/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/insertHoldHistoricalData';
            if(this.dataHead.barcodeEnter==1){
              var api = '/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/insertHistoricalFromBarcode';
            }else{
              var api = '/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/insertHoldHistoricalData';
            }
          }
          
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
                      this.runId = {'run_id' : 0,'counter' : Math.ceil(Math.random()*10000)}
                      this.result.master_running = alertMessage.master_running;
                      //this.getGroupData();
                      this.getHistoricalData(0);
                      this.SpinnerService.hide();
                      this.searchData(1,2);
                      this.buttonType = false;
                    }
                    subscription.unsubscribe();
                  });
                }else{
                  this.runId = {'run_id' : 0,'counter' : Math.ceil(Math.random()*10000)}
                  this.result.master_running = alertMessage.master_running;
                  //this.getGroupData();
                  this.getHistoricalData(0);
                  this.SpinnerService.hide();
                  this.searchData(1,2);
                  this.buttonType = false;
                }
              }
            },
            (error) => {this.SpinnerService.hide();}
          )
        }
      }
    }

    assignDisType(){
      if(this.buttonType==false){
        this.buttonType=true;
        this.rerender();
      }else{
        this.buttonType=false;
        this.rerender();
      }
    }

    searchData(type:any,event:any){
      this.tmpResult3 = this.result3;
      var jsonTmp = $.extend({}, this.tmpResult3);
      jsonTmp['userToken'] = this.userData.userToken;
      if(!jsonTmp.run_no) delete jsonTmp.run_no,delete jsonTmp.run_yy;
      if(!jsonTmp.run_yy) delete jsonTmp.run_no,delete jsonTmp.run_yy;
      if(jsonTmp.porder==0) delete jsonTmp.porder;
      if(type==1){
        if(!jsonTmp['_sdate'] || !jsonTmp['_edate']){
          delete jsonTmp._sdate,jsonTmp._edate;
        }
      }else{
        delete jsonTmp.run_no;
        delete jsonTmp.run_yy;
        delete jsonTmp.sDepCode;
        delete jsonTmp.sDepName;
        jsonTmp['userToken'] = this.userData.userToken;
        this.result3._sdate = jsonTmp['_sdate'] = myExtObject.curDate();
        this.result3._edate = jsonTmp['_edate'] = myExtObject.curDate();
      }
      var student = jsonTmp; 
      console.log(student)

      if(type==2){//ปิดโหลด
        this.http.disableLoading().post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/getHistoricalHoldData', student ).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.data.length){
              this.dataHistorical2 = productsJson.data;
              this.dataHistorical2.forEach((x : any ) => x.mRunning = false);
              this.rerender();
              this.masterSelect3 = false;
            }else{
              this.dataHistorical2 = [];
              this.rerender();
              this.masterSelect3 = false;
            }
          },
          (error) => {}
        )
      }else{
        this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0100/getHistoricalHoldData', student ).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.data.length){
              this.dataHistorical2 = productsJson.data;
              this.dataHistorical2.forEach((x : any ) => x.mRunning = false);
              this.rerender();
              this.masterSelect3 = false;
            }else{
              this.dataHistorical2 = [];
              this.rerender();
              this.masterSelect3 = false;
            }
          },
          (error) => {}
        )
      }
      
    }

    gotoLink(){
      let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/prkn0100?ptype=2';
     myExtObject.OpenWindowMaxDimension(winURL,600,screen.width-100);
    }

    



}







