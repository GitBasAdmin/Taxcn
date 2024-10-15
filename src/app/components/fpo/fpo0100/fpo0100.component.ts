import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList,ViewEncapsulation,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { Fpo0100NoticeComponent } from '@app/components/fpo/fpo0100-notice/fpo0100-notice.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import {
  CanActivateFn, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
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
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
import * as _ from "lodash"
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fpo0100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fpo0100.component.html',
  styleUrls: ['./fpo0100.component.css']
})

export class Fpo0100Component implements AfterViewInit,AfterContentInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  getParty:any;
  getAssign:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  accuData$:Observable<any>;
  NoticeData$:Observable<any>;
  postData$:Observable<any>;
  postData:any = [];
  dataHead:any = [];
  dataSource:any = [];
  runId:any;
  hold_id:any;
  getHold:any;
  myExtObject: any;
  items:any;
  appItems:any = [];
  conObj:any =[];
  result:any = [];
  delTypeApp: any;
  delAppIndex: any;
  caseCateFlag:any;
  windowRef:any;
  dataEdit:any;
 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalComponent: boolean = false;
  masterSelect:boolean = false;
  masterSelect2:boolean = false;
  @Output() sendDataPostEdit = new EventEmitter<{data:any,counter:any}>();
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
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService,
    private router: Router,
    private route: ActivatedRoute,
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
      searching : false
    };
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    /* this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id']){
        alert(params['run_id'])
        this.runId = {'run_id' : params['run_id'],'counter' : Math.ceil(Math.random()*10000)}
      }
    }); */
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id']){
        this.runId = params['run_id'];
      }
    });
    //======================== passign_stat_condition ======================================
    var student = JSON.stringify({
      "table_name" : "passign_stat_condition",
      "field_id" : "condition_id",
      "field_name" : "condition_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAssign = getDataOptions;
        this.getAssign.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        
      },
      (error) => {}
    )
    //======================== phold_reason ======================================
    var student = JSON.stringify({
      "table_name" : "phold_reason",
      "field_id" : "hold_id",
      "field_name" : "hold_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getHold = getDataOptions;
        
      },
      (error) => {}
    )
    this.getParty = [{fieldIdValue:0,fieldNameValue: '-'},{fieldIdValue:1,fieldNameValue: 'ฝ่ายเดียว'},{fieldIdValue:1,fieldNameValue: 'สองฝ่าย'}];
   
    //this.asyncObservable = this.makeObservable('Async Observable');
    // this.successHttp();
    this.setDefPage()
  }

  setDefPage(){
    this.result = [];
    this.result.post_time = 1;
    // this.result.post_start = myExtObject.curDate();
    this.runPost();
  }

  runPost(){
      if(this.postData.length){
        const item = this.postData.reduce((prev:any, current:any) => (+prev.post_seq > +current.post_seq) ? prev : current)
        this.result.item = item.post_seq+1;
      }else{
        this.result.item = 1;
      }
  }

  assignDate(event:any){
    if(!this.result.pk_day)
      this.result.pk_day=this.result.days_amount;//จำนวนวันออกหมายขัง	

    if(event.target.value && this.dataHead.run_id && this.result.post_start){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "post_start" : this.result.post_start,
        "pk_day" : event.target.value,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiPO/API/POST/fpo0100/nextPostDate', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)  
          if(getDataOptions.result==1){
            this.result.from_date = getDataOptions.from_date;
            this.result.next_post_date = getDataOptions.next_post_date;
            this.result.post_end = getDataOptions.post_end;
          }else{
            this.result.from_date = this.result.next_post_date = this.result.post_end = null;
          }
        },
        (error) => {}
      )
    }
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  // successHttp() {
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Content-Type','application/json');
  //   var authen = JSON.stringify({
  //     "userToken" : this.userData.userToken,
  //     "url_name" : "fpo0100"
  //   });
  //   let promise = new Promise((resolve, reject) => {
  //     //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
  //     //this.http.get(apiURL)
  //     this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
  //       .toPromise()
  //       .then(
  //         res => { // Success
  //         //this.results = res.json().results;
  //         let getDataAuthen : any = JSON.parse(JSON.stringify(res));
  //         console.log(getDataAuthen)
  //         this.programName = getDataAuthen.programName;
  //         this.defaultCaseType = getDataAuthen.defaultCaseType;
  //         this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
  //         this.defaultTitle = getDataAuthen.defaultTitle;
  //         this.defaultRedTitle = getDataAuthen.defaultRedTitle;
  //           resolve(res);
  //         },
  //         msg => { // Error
  //           reject(msg);
  //         }
  //       );
  //   });
  //   return promise;
  // } 

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
  ngAfterContentInit() : void{
    myExtObject.callCalendar();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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

 
/*   fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    this.dataSource = JSON.parse(JSON.stringify(event));
    this.getObjAppData();
    this.getConData();
    this.getCaseCateFlag();
    if(this.dataHead.buttonSearch==1){
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      console.log(this.runId)
    }
  }
 */

  
  onSearch = (data:any) => {
    console.log(data)
    if(data) {
      /* this.router.navigate([],{
        queryParams: { run_id: data.run_id },
        queryParamsHandling: 'merge',
        relativeTo: this.route
      });  */
      location.replace(window.location.href.split("/#/")[0]+"/#/fpo0100?run_id="+data.run_id);
      this.dataHead = data;
      if((this.runId && this.runId != this.dataHead.run_id) || typeof this.runId =='undefined')
        this.runId = this.dataHead.run_id;
    }else{
      this.dataHead = [];
    }
    //this.loadData1();
    this.loadData2('');
    this.loadNoticeData('');
  }

  difference(object:any, base:any) {
    return transform(object, (result:any, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
      }
    });
  }

  delAppData(type:any){
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.appItems.forEach((ele, index, array) => {
        if(ele.appRunning == true){
          del++;
        }
      });
    });
    if(bar){
      if(del){
        this.delTypeApp = type;
        this.openbutton.nativeElement.click();
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

  loadMyModalComponent(){
    //$(".modal-backdrop").remove();
    this.loadModalComponent = true;  //password confirm
    $("#exampleModal").find(".modal-body").css("height","100px");
    $("#exampleModal").css({"background":"rgba(51,32,0,.4)"});
  }

  closeModal(){
    this.loadModalComponent = false; //popup
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
            if(this.delTypeApp=='delApp'){
            confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
          }else if(this.delTypeApp=='cAppoint'){//=========ยกเลิกวันนัดที่เลือก
            confirmBox2.setTitle('ต้องการยกเลิกข้อมูลใช่หรือไม่?');
            confirmBox2.setMessage('ยืนยันการยกเลิกนัดที่เลือก');
          }else if(this.delTypeApp=='ccAppoint'){//=========ยกเลิกการยกเลิกวันนัดที่เลือก
            confirmBox2.setTitle('ต้องการยกเลิกข้อมูลใช่หรือไม่?');
            confirmBox2.setMessage('ยืนยันการยกเลิกการยกเลิกวันนัดที่เลือก');
          }
            confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');

            // Choose layout color type
            confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  var dataDel = [],dataTmp=[];
                  dataDel['run_id'] = this.dataHead.run_id;
                  dataDel['log_remark'] = chkForm.log_remark;
                  dataDel['userToken'] = this.userData.userToken;

                  if(this.delTypeApp=='delApp'){//======================= นัดความ
                    var bar = new Promise((resolve, reject) => {
                      this.appItems.forEach((ele, index, array) => {
                            if(ele.appRunning == true){
                              dataTmp.push(this.appItems[index]);
                            }
                        });
                    });
                    
                    if(bar){
                      dataDel['data'] = dataTmp;
                      var data = $.extend({}, dataDel);
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/deleteAllAppointDataByDate', data ).subscribe(
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
                        (error) => {}
                      )
                    }
                  }else if(this.delTypeApp=='cAppoint'){//=========ยกเลิกวันนัดที่เลือก
                    var bar = new Promise((resolve, reject) => {
                      this.appItems.forEach((ele, index, array) => {
                            if(ele.appRunning == true){
                              dataTmp.push(this.appItems[index]);
                            }
                        });
                    });
                    
                    if(bar){
                      dataDel['data'] = dataTmp;
                      var data = $.extend({}, dataDel);
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/cancelAppointByDate', data ).subscribe(
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
                        (error) => {}
                      )
                    }
                  }else if(this.delTypeApp=='ccAppoint'){//=========ยกเลิกการยกเลิกวันนัดที่เลือก
                    var bar = new Promise((resolve, reject) => {
                      this.appItems.forEach((ele, index, array) => {
                            if(ele.appRunning == true){
                              dataTmp.push(this.appItems[index]);
                            }
                        });
                    });
                    
                    if(bar){
                      
                      let headers = new HttpHeaders();
                      headers = headers.set('Content-Type','application/json');
                      dataDel['data'] = dataTmp;
                      var data = $.extend({}, dataDel);
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/cancelCancelAppointByDate', data ).subscribe(
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
                        (error) => {}
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

  saveData(){
    if(typeof this.dataHead != 'undefined'){
      this.SpinnerService.show();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
        if(this.dataHead.hold_id){
          var holdObj = this.getHold.filter((x:any) => x.fieldIdValue === this.dataHead.hold_id)
          if(holdObj.length)
            this.dataHead.hold_name = holdObj[0].fieldNameValue;
        }
        //var student = this.difference(this.dataHead,this.dataSource);
        
        var student= [];
        student['party'] = this.dataHead.party;
        student['con_app'] = this.dataHead.con_app;
        student['case_judge_id'] = this.dataHead.case_judge_id;
        student['case_judge_name'] = this.dataHead.case_judge_name;
        student['case_judge_date'] = this.dataHead.case_judge_date;
        student['case_judge_gid'] = this.dataHead.case_judge_gid;
        student['case_judge_gname'] = this.dataHead.case_judge_gname;
        student['old_judge_id'] = this.dataHead.old_judge_id;
        student['old_judge_name'] = this.dataHead.old_judge_name;
        student['case_judge_gid2'] = this.dataHead.case_judge_gid2;
        student['case_judge_gname2'] = this.dataHead.case_judge_gname2;
        student['hold_id'] = this.dataHead.hold_id;
        student['case_judge_aid'] = this.dataHead.case_judge_aid;
        student['case_judge_aname'] = this.dataHead.case_judge_aname;
        student['case_judge_adate'] = this.dataHead.case_judge_adate;
        student['pros_total'] = this.dataHead.pros_total;
        student['pros_appoint_day'] = this.dataHead.pros_appoint_day;
        student['accu_total'] = this.dataHead.accu_total;
        student['accu_appoint_day'] = this.dataHead.accu_appoint_day;
        student['other_total'] = this.dataHead.other_total;
        student['other_appoint_day'] = this.dataHead.other_appoint_day;
        student['run_id'] = this.dataHead.run_id;
        student['userToken'] = this.userData.userToken;
        delete student['case_status']
        student = $.extend({},student);
        console.log(student)
        //return false;
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/updateCaseData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){

                //-----------------------------//
                confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
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

  getCaseCateFlag(){
      var student = JSON.stringify({
        "table_name": "pcase_cate",
        "field_id": "case_cate_id",
        "field_name": "case_cate_name",
        "field_name2": "case_flag",
        "condition": " AND case_type='"+this.dataHead.case_type+"' AND case_cate_id='"+this.dataHead.case_cate_id+"'",
        "userToken" : this.userData.userToken
      });
      //console.log("fCaseStat :"+student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(getDataOptions.length)
            this.caseCateFlag = getDataOptions[0].fieldNameValue2;
          else
            this.caseCateFlag = null;
          console.log(this.caseCateFlag)
        },
        (error) => {}
      )
  }

  getConData(){
    if(this.dataHead.conObj.length){
      this.conObj = this.dataHead.conObj;
      this.rerender();
    }
  }

  getObjAppData(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "run_id" : this.dataHead.run_id,
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/getAppointData', student , {headers:headers}).subscribe(
      datalist => {
        this.items = datalist;
        console.log(this.items)
        if(this.items.data.length){
          this.items.data.forEach((x : any ) => x.appRunning = false);
          this.appItems = this.items.data;
          this.rerender();
          this.SpinnerService.hide();
        }else{
          this.appItems = [];
          this.rerender();
          this.SpinnerService.hide();
        }
      },
      (error) => {this.SpinnerService.hide();}
    );
  }

  
  tabChangeSelect(objName:any,objData:any,event:any,type:any){
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      console.log(objData)
      if(val.length!=0){
        this.dataHead[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
      }
    }else{
      this.dataHead[objName] = null;
      this[objName] = null;
    }
  }

  openLink(type:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    console.log(winURL)
    if(type==1){
      if(this.dataHead.run_id)
        myExtObject.OpenWindowMaxName(winURL+'fap0110?run_id='+this.dataHead.run_id,'fap0110');
      else
        myExtObject.OpenWindowMaxName(winURL+'fap0110','fap0110');
    }
      
    if(type==2){
      if(this.dataHead.run_id)
        myExtObject.OpenWindowMaxName(winURL+'fap0111?run_id='+this.dataHead.run_id,'fap0111');
      else
        myExtObject.OpenWindowMaxName(winURL+'fap0111','fap0111');
    }
      
    if(type==3){
      if(this.dataHead.run_id)
        myExtObject.OpenWindowMaxName(winURL+'case_judge?run_id='+this.dataHead.run_id,'case_judge');
      else
        myExtObject.OpenWindowMaxName(winURL+'case_judge','case_judge');
    }
      
  }

  editData(index:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    myExtObject.OpenWindowMaxName(winURL+'fpo0110?run_id='+this.dataHead.run_id+'&lit_running='+this.dataHead.accuObj[index].lit_running,'fpo0110');
  }

  openConcWindow(){
    let winURL = window.location.href.split("/#/")[0]+"/#/case-conciliate";
    console.log(winURL)
    var name='';
		if(name=='')
			name='win_'+Math.ceil(Math.random()*1000);
    if(this.dataHead.run_id )
      window.open(winURL+"?run_id="+this.dataHead.run_id,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
   else
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
    
  }

  cancelAppData(type:any){
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.appItems.forEach((ele, index, array) => {
        if(ele.appRunning == true){
          del++;
        }
      });
    });
    if(bar){
      if(del){
        if(type==1)
          this.delTypeApp = 'cAppoint';
        else
          this.delTypeApp = 'ccAppoint';
        this.openbutton.nativeElement.click();
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

  cancelResultAppData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var del = 0;
    var dataDel = [],dataTmp=[];
    var bar = new Promise((resolve, reject) => {
      this.appItems.forEach((ele, index, array) => {
        if(ele.appRunning == true){
          del++;
          dataTmp.push(this.appItems[index]);
        }
      });
    });
    if(bar){
      if(del){
        const confirmBox2 = new ConfirmBoxInitializer();
        confirmBox2.setTitle('ต้องการยกเลิกข้อมูลใช่หรือไม่?');
        confirmBox2.setMessage('ยืนยันการยกเลิกผลการพิจารณาคดีวันนัดที่เลือก');
        confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox2.setConfig({
            layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //======================================================
          dataDel['data'] = dataTmp;
          dataDel['run_id'] = this.dataHead.run_id;
          dataDel['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataDel);
          console.log(data)
          this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/cancelAppointResultByDate', data ).subscribe(
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
            (error) => {}
          )
          //======================================================
        }
        subscription2.unsubscribe();
          });
      }else{
        
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

  assignRoom(){
    var del = 0;
    var app_running = [];
    var bar = new Promise((resolve, reject) => {
      this.appItems.forEach((ele, index, array) => {
        if(ele.appRunning == true){
          del++;
          app_running.push(ele);
        }
      });
    });
    if(bar){
      if(del){
        let winURL = window.location.href.split("/#/")[0]+"/#/popup_room?app_running="+JSON.stringify(app_running);
        myExtObject.OpenWindowMaxDimensionName(winURL,500,1200,'popup_room');
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องการกำหนด');
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

  printReport(type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.dataHead.run_id){
      confirmBox.setMessage('กรุณาค้นหาเลขคดีก่อนพิมพ์');
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
        var rptName = 'rap3200';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHead.run_id ? this.dataHead.run_id : '0',
          "ptype_date" : myExtObject.conDate(myExtObject.curDate()),
        });
        console.log(paramData)
      }
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }
  }

  printReportIndex(i:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var data:any;
    this.NoticeData$.subscribe((res:any)=>{
      data = res;
   })
   console.log(data)
        // var rptName = 'rap3200';
        var rptName = 'rno0800';
        var paramData ='{}';
        var paramData = JSON.stringify({
          "prun_id" : this.dataHead.run_id ? this.dataHead.run_id : '0',
          "ppost_seq" : data[i].post_seq ? data[i].post_seq : '',
          "pitem" : data[i].item ? data[i].item : '',
          "pnotice_date" : myExtObject.conDate(myExtObject.curDate()),
          "psize" : 1,
          "ppage" : 1
        });
        console.log(paramData)
      
      // return false;
      this.printReportService.printReport(rptName,paramData);
  }

  printWord(type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.dataHead.run_id){
      confirmBox.setMessage('กรุณาค้นหาเลขคดีก่อนพิมพ์');
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
        "run_id" : this.dataHead.run_id ? this.dataHead.run_id : '0',
        "form_type" : 2,
        "form_id" : 111,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/openReport', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              myExtObject.OpenWindowMax(getDataOptions.file);
          }else{
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
          }
    
        },
        (error) => {}
      )
    }
  }

  delWord(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
    confirmBox.setMessage('ลบไฟล์ WORD');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

    // Choose layout color type
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //============================================
            const confirmBox2 = new ConfirmBoxInitializer();
            confirmBox2.setTitle('ยืนยันการลบข้อมูล');
            confirmBox2.setMessage('ยืนยันการลบไฟล์ WORD อีกครั้ง');
            confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
        
            // Choose layout color type
            confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  var student = JSON.stringify({
                    "file_name" : 'form_ap-'+this.dataHead.run_id+'.doc',
                    "userToken" : this.userData.userToken
                  });
                  console.log(student)
                  this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/deleteFile', student ).subscribe(
                    (response) =>{
                      let getDataOptions : any = JSON.parse(JSON.stringify(response));
                      console.log(getDataOptions)
                      const confirmBox3 = new ConfirmBoxInitializer();
                      confirmBox3.setTitle('ข้อความแจ้งเตือน');
                      if(getDataOptions.result==1){
          
                          //-----------------------------//
                          confirmBox3.setMessage('ลบไฟล์ WORD เรียบร้อยแล้ว');
                          confirmBox3.setButtonLabels('ตกลง');
                          confirmBox3.setConfig({
                              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              //this.searchNotice(1);
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
          //============================================
        }
        subscription.unsubscribe();
    }); 
  }

  

  openLiteData(){
    //alert(this.dataHead.run_id)
    if(this.dataHead.run_id){
      let winURL = this.authService._baseUrl;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+"fpo0110";
      console.log(winURL)
      var name='';
      if(name=='')
        name='win_'+Math.ceil(Math.random()*1000);
      if(this.dataHead.run_id)
        this.windowRef= window.open(winURL+"?run_id="+this.dataHead.run_id,name, "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width="+screen.availWidth+",height="+screen.availHeight);
      else
        this.windowRef= window.open(winURL,name, "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width="+screen.availWidth+",height="+screen.availHeight);
      //console.log(this.windowRef)
    }
  }

  loadData1(){//ผู้ต้องหา
    if(this.dataHead.accuObj.length){
      var bar = new Promise((resolve, reject) => {
        this.dataHead.accuObj.forEach((x : any ) => x.seqAccu = false);
        if(this.postData.length){
          var item = this.postData.reduce((prev:any, current:any) => (+prev.post_seq > +current.post_seq) ? prev : current)
          this.dataHead.accuObj.forEach((x : any ) => x.post_seq = item.post_seq);
        }
      });
      if(bar){
        this.accuData$ = of(this.dataHead.accuObj); 
        /* setTimeout(() => {
          this.rerender();
        }, 300); */
      }
        
    }else{
      this.accuData$ = of();
      /* setTimeout(() => {
        this.rerender();
      }, 300); */
    }

  }


  loadData2(type:any){
    this.dataEdit = null;
    var student = JSON.stringify({
      "run_id" : this.dataHead.run_id ? this.dataHead.run_id : '0',
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiPO/API/POST/fpo0100/getPostData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions, getDataOptions.result=='1')
        if(getDataOptions.result=='1'){
            var bar = new Promise((resolve, reject) => {
              getDataOptions.data.forEach((x : any ) => x.seqPost = false);
            });
            if(bar){
              if(getDataOptions.data.length >0)
                this.postData$ = of(getDataOptions.data); 
              else  
                this.postData$ = of();
              this.postData = getDataOptions.data;

              //วันที่ยื่น
              if(getDataOptions.data.length >0)
                this.result.post_start = getDataOptions.data[getDataOptions.data.length-1].next_post_date;
              else
                this.result.post_start = myExtObject.curDate();

              this.loadData1();
              this.runPost();
              if(type){
                setTimeout(() => {
                  // this.rerender();//12/9/2565
                }, 300);
              }
            }
        }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.postData$ = of();
                this.postData = [];
                this.loadData1();
                this.runPost();
              }
              subscription.unsubscribe();
            });
        }
  
      },
      (error) => {}
    )
  }

  delAccuData(){
    const modalRef = this.ngbModal.open(ModalConfirmComponent,{ windowClass: 'fpo0100-conf'})
    modalRef.componentInstance.types = "1"
    modalRef.closed.subscribe((data) => {
      if(data) {
        var log_remark = data;
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER
        })
        confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            var dataDel = [],dataTmp=[];
            dataDel['run_id'] = this.dataHead.run_id;
            dataDel['log_remark'] = log_remark;
            dataDel['userToken'] = this.userData.userToken;
            var bar = new Promise((resolve, reject) => {
              this.dataHead.accuObj.forEach((ele, index, array) => {
                    if(ele.seqAccu == true){
                      dataTmp.push(this.dataHead.accuObj[index]);
                    }
                });
            });
            
            if(bar){
              dataDel['data'] = dataTmp;
              var data = $.extend({}, dataDel);
              console.log(data)
              this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/deleteAllLitigantData', data ).subscribe(
                (response) =>{
                  let alertMessage : any = JSON.parse(JSON.stringify(response));
                  console.log(alertMessage)
                  const confirmBox2 = new ConfirmBoxInitializer();
                  confirmBox2.setTitle('ข้อความแจ้งเตือน');
                  if(alertMessage.result==0){
                    confirmBox2.setMessage(alertMessage.error);
                    confirmBox2.setButtonLabels('ตกลง');
                    confirmBox2.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){}
                      subscription2.unsubscribe();
                    });
                  }else{
                    confirmBox2.setMessage(alertMessage.error);
                    confirmBox2.setButtonLabels('ตกลง');
                    confirmBox2.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){
                        //this.masterSelect  = false;
                        location.reload();              
                      }
                      subscription2.unsubscribe();
                    });
                    
                  }
                },
                (error) => {}
              )
            }
          }
        })
      }
    })
  }

  loadNoticeData(type:any){
    var student = JSON.stringify({
      "run_id" : this.dataHead.run_id ? this.dataHead.run_id : '0',
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiPO/API/POST/fpo0100/getNoticeData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result=='1'){
            //myExtObject.OpenWindowMax(getDataOptions.file);
            if(getDataOptions.data.length >0)
              this.NoticeData$ = of(getDataOptions.data); 
            else
              this.NoticeData$ = of();
            console.log(type)
            if(type){
              setTimeout(() => {
                this.rerender();
              }, 300);
            }

        }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.NoticeData$ = of();
                
                if(type){
                  setTimeout(() => {
                    this.rerender();
                  }, 300);
                }
              }
              subscription.unsubscribe();
            });
        }
  
      },
      (error) => {}
    )
  }

  reloadPage(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    location.replace(winURL+'fpo0100')
    window.location.reload();
  }
  

  editNoticeData(i:any){
    var data:any;
    this.NoticeData$.subscribe((res:any)=>{
      data = res;
   })

    const modalRef = this.ngbModal.open(Fpo0100NoticeComponent,{ windowClass: 'fpo0100-class'})
    data[i].ptitle = this.dataHead.ptitle;
    data[i].pid = this.dataHead.pid;
    data[i].pyy = this.dataHead.pyy;
    modalRef.componentInstance.data = data[i];
    modalRef.closed.subscribe((data) => {
      if(data) {
        //==========================================
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        this.http.post('/'+this.userData.appName+'ApiPO/API/POST/fpo0100/editNoticeData', data ).subscribe(
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
                    this.loadNoticeData('');
                    // this.loadNoticeData(1);
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
                  if (resp.success==true){}
                  subscription.unsubscribe();
                });
              //-----------------------------//
            }
    
          },
          (error) => {}
        )
        //==========================================
      }
    })
  }

  delNoticeData(i:any){
    const modalRef = this.ngbModal.open(ModalConfirmComponent,{ windowClass: 'fpo0100-conf'})
    modalRef.componentInstance.types = "1"
    modalRef.closed.subscribe((data) => {
      if(data) {
        var log_remark = data;
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER
        })
        confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            var dataDel = [],dataTmp=[];
            dataDel['run_id'] = this.dataHead.run_id;
            dataDel['log_remark'] = log_remark;
            dataDel['userToken'] = this.userData.userToken;
            var delData:any;
            var bar = new Promise((resolve, reject) => {
                this.NoticeData$.subscribe((res:any)=>{
                  delData = res;
              })
            });
            dataTmp.push(delData[i]);
            
            if(bar){
              dataDel['data'] = dataTmp;
              var data = $.extend({}, dataDel);
              console.log(data)
              this.http.post('/'+this.userData.appName+'ApiPO/API/POST/fpo0100/deleteNotice', data ).subscribe(
                (response) =>{
                  let alertMessage : any = JSON.parse(JSON.stringify(response));
                  console.log(alertMessage)
                  const confirmBox2 = new ConfirmBoxInitializer();
                  confirmBox2.setTitle('ข้อความแจ้งเตือน');
                  if(alertMessage.result==0){
                    confirmBox2.setMessage(alertMessage.error);
                    confirmBox2.setButtonLabels('ตกลง');
                    confirmBox2.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){}
                      subscription2.unsubscribe();
                    });
                  }else{
                    confirmBox2.setMessage(alertMessage.error);
                    confirmBox2.setButtonLabels('ตกลง');
                    confirmBox2.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){
                        //this.masterSelect  = false;
                        // this.loadNoticeData(1);              
                        this.loadNoticeData('');              
                      }
                      subscription2.unsubscribe();
                    });
                    
                  }
                },
                (error) => {}
              )
            }
          }
        })
      }
    })
  }

  savePost(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.from_date){
      confirmBox.setMessage('ระบุนับแต่วันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.post_end){
      confirmBox.setMessage('ระบุครบวันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.next_post_date){
      confirmBox.setMessage('ระบุยื่นครั้งต่อไป');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      /* var student= [];
        student['post_time'] = this.result.post_time;
        student['item'] = this.result.item;
        student['post_start'] = this.result.post_start;
        student['days_amount'] = this.result.days_amount;
        student['pk_day'] = this.result.pk_day;
        student['from_date'] = this.result.from_date;
        student['post_end'] = this.result.post_end;
        student['next_post_date'] = this.result.next_post_date;
        student['run_id'] = this.dataHead.run_id;
        student['userToken'] = this.userData.userToken;
        student = $.extend({},student); */
        this.result.post_time = 1;
        var student = $.extend({},this.result);
        student.run_id = this.dataHead.run_id;
        student.userToken = this.userData.userToken;
        console.log(student)
        //return false;
        this.http.post('/'+this.userData.appName+'ApiPO/API/POST/fpo0100/savePost', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){

                //-----------------------------//
                confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.setDefPage();
                    this.loadData2(1);
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

  editPost(i:any){
    this.SpinnerService.show();
    setTimeout(() => {
      //this.result = [];
      var post_time = this.result.post_time;
      this.result = this.postData[i];
      this.dataEdit = this.postData[i];
      this.result.edit_post_seq = this.result.post_seq;
      this.result.post_time = post_time;
      this.SpinnerService.hide();
      //console.log(this.result)
    }, 500);
  }

  delPost(){
    const modalRef = this.ngbModal.open(ModalConfirmComponent,{ windowClass: 'fpo0100-conf'})
    modalRef.componentInstance.types = "1"
    modalRef.closed.subscribe((data) => {
      if(data) {
        var log_remark = data;
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER
        })
        confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            var dataDel = [],dataTmp=[];
            dataDel['run_id'] = this.dataHead.run_id;
            dataDel['log_remark'] = log_remark;
            dataDel['userToken'] = this.userData.userToken;
            var bar = new Promise((resolve, reject) => {
              this.postData.forEach((ele, index, array) => {
                    if(ele.seqPost == true){
                      dataTmp.push(this.postData[index]);
                    }
                });
            });
            
            if(bar){
              dataDel['data'] = dataTmp;
              var data = $.extend({}, dataDel);
              console.log(data)
              this.http.post('/'+this.userData.appName+'ApiPO/API/POST/fpo0100/deletePost', data ).subscribe(
                (response) =>{
                  let alertMessage : any = JSON.parse(JSON.stringify(response));
                  console.log(alertMessage)
                  const confirmBox2 = new ConfirmBoxInitializer();
                  confirmBox2.setTitle('ข้อความแจ้งเตือน');
                  if(alertMessage.result==0){
                    confirmBox2.setMessage(alertMessage.error);
                    confirmBox2.setButtonLabels('ตกลง');
                    confirmBox2.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){}
                      subscription2.unsubscribe();
                    });
                  }else{
                    confirmBox2.setMessage(alertMessage.error);
                    confirmBox2.setButtonLabels('ตกลง');
                    confirmBox2.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){
                        //this.masterSelect  = false;
                        this.loadData2(1);          
                      }
                      subscription2.unsubscribe();
                    });
                    
                  }
                },
                (error) => {}
              )
            }
          }
        })
      }
    })
  }

  genNotice(i:any){
    var student = this.dataHead.accuObj[i];
    student.notice_type_id = 8;
    student.run_id = this.dataHead.run_id;
    student.userToken = this.userData.userToken;
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiPO/API/POST/fpo0100/saveNoticeData', student ).subscribe(
      (response) =>{
        let alertMessage : any = JSON.parse(JSON.stringify(response));
        console.log(alertMessage)
        const confirmBox2 = new ConfirmBoxInitializer();
        confirmBox2.setTitle('ข้อความแจ้งเตือน');
        if(alertMessage.result==0){
          confirmBox2.setMessage(alertMessage.error);
          confirmBox2.setButtonLabels('ตกลง');
          confirmBox2.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription2.unsubscribe();
          });
        }else{
          confirmBox2.setMessage(alertMessage.error);
          confirmBox2.setButtonLabels('ตกลง');
          confirmBox2.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              //this.masterSelect  = false;
              // this.loadData2(1);//12/9/2565     
              this.loadNoticeData('');     
            }
            subscription2.unsubscribe();
          });
          
        }
      },
      (error) => {}
    )
  }

  directiveDate = (event: any) => {
    const { value, name } = event.target
    this.result[name] = value;
  }

  tabChangeInput(name:any,event:any){

  }

}