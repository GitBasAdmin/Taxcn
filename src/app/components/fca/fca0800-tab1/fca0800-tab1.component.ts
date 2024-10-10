import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,ViewChildren, QueryList   } from '@angular/core';
import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import { isContext } from 'vm';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
declare var myExtObject: any;

@Component({
  selector: 'app-fca0800-tab1',
  templateUrl: './fca0800-tab1.component.html',
  styleUrls: ['./fca0800-tab1.component.css']
})
export class Fca0800Tab1Component implements OnInit {
  sessData:any;
  userData:any;
  getCaseLevel:any;
  getCaseResult:any;
  modalType:any;
  counter=1;
  result:any = [];
  result2:any = [];
  _result:any = [];
  caseDataObj:any = [];
  caseDataObjTmp:any = [];
  getDataAlle:any = [];//ฐานความผิด
  getDataPros:any = [];//โจทก์
  getDataAccu:any = [];//จำเลย
  getDataLit:any = [];//คู่ความอื่น
  getDataOther:any = [];//ผู้เกี่ยวข้อง
  myExtObject: any;
  delTypeApp:any;
  alleSeq:any;
  alleId:any;
  alleIndex:any;
  dtOptions: DataTables.Settings = {};
  
  dtTriggerAlle: Subject<any> = new Subject<any>();
  dtTriggerPros: Subject<any> = new Subject<any>();
  dtTriggerAccu: Subject<any> = new Subject<any>();
  dtTriggerLit: Subject<any> = new Subject<any>();
  dtTriggerOther: Subject<any> = new Subject<any>();

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListMultiComponent: boolean = false;
  public loadModalListComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  masterSelPros:boolean = false;
  buttonDelPros:boolean = false;
  masterSelAccu:boolean = false;
  buttonDelAccu:boolean = false;
  masterSelLit:boolean = false;
  buttonDelLit:boolean = false;
  masterSelOther:boolean = false;
  buttonDelOther:boolean = false;

  


  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @Output() onClickListData = new EventEmitter<{data:any,counter:any,run_id:any,event:any}>();
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100-main
    if(typeof getDataHead !='undefined'){
      console.log(getDataHead)
      this.result = [];
      this.caseDataObjTmp = [];
      this.getDataAlle = [];
      this.getDataPros = [];
      this.getDataAccu = [];
      this.getDataLit = [];
      this.getDataOther = [];
      this.caseDataObjTmp = $.extend([],getDataHead);
      this.result = getDataHead;
      
      
      if(getDataHead.caseEvent==1){
        var _bar = new Promise((resolve, reject) => {
          if(parseFloat(this.result.deposit)>0){
            this._result.deposit = this.curencyFormat(this.result.deposit,2);
          }else{
            this._result.deposit = null;
          }
          this._result.guar_pros = this.result.guar_pros;
          this._result.case_level  = this.result.case_level;
          this._result.alle_desc = this.result.alle_desc;
          this._result.case_result = this.result.case_result;
          this._result.order_judge_id = this.result.order_judge_id;
          this._result.order_judge_name = this.result.order_judge_name;
          this._result.order_judge_date = this.result.order_judge_date;
          this._result.remark = this.result.remark;
          this._result.case_judge_id = this.result.case_judge_id;
          this._result.case_judge_name = this.result.case_judge_name;
          this._result.case_judge_date = this.result.case_judge_date;

          if(this.result.prosObj!=null)
            this.result.prosObj.forEach((x : any ) => x.seqPros = false);
          if(this.result.accuObj!=null)
            this.result.accuObj.forEach((x : any ) => x.seqAccu = false);
          if(this.result.litObj!=null)
            this.result.litObj.forEach((x : any ) => x.seqLit = false);
          if(this.result.otherObj!=null)
            this.result.otherObj.forEach((x : any ) => x.seqOther = false);
        });
        if(_bar){
          this.rerender();
        }
      }else{
        this.saveData(getDataHead);
      }
    }
  }
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private printReportService: PrintReportService,
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
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
    //======================== pcase_result ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_result",
      "field_id" : "result_id",
      "field_name" : "result_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseResult = getDataOptions;
        
      },
      (error) => {}
    )
    //this.rerender();
    this.getCaseLevel = [{fieldIdValue:1,fieldNameValue: 'ปกติ'},{fieldIdValue:2,fieldNameValue: 'ยกเว้นค่าธรรมเนียม'}];
    this.setDefPage();
    $('body').find(".mat-tab-label-container").css("display","none");
  }

  setDefPage(){
    this.result = [];
    this.result.dispute = 1;
    this.result.deposit = '0.00';
    this.result.guar_pros = 1;
    this.result.case_level = 1;
    this.result.case_result = 1;
  }


  rerender(): void {
    var bar = new Promise((resolve, reject) => {
      this.dtElements.forEach((dtElement: DataTableDirective) => {
        //console.log(dtElement.dtInstance)
        //console.log(dtElement.dtInstance["__zone_symbol__value"]["context"][0].sTableId)
        if(dtElement.dtInstance)
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            if(dtInstance["context"][0].sTableId=='tableAlle'){
              var bar2 = new Promise((resolve, reject) => {
                dtInstance.destroy();  
              });
              if(bar2){
                this.getDataAlle = this.caseDataObjTmp.alleObj;//ฐานความผิด
                if(this.caseDataObjTmp.run_id && this.caseDataObjTmp.alleObj.length)
                  this.runAlleSeq(this.getDataAlle);
                else
                  this.alleSeq = 1;
                this.dtTriggerAlle.next(null); 
              }
            }  
            if(dtInstance["context"][0].sTableId=='tablePros'){
              var bar2 = new Promise((resolve, reject) => {
                dtInstance.destroy();  
              });
              if(bar2){
                this.getDataPros = this.caseDataObjTmp.prosObj;//โจทก์
                this.dtTriggerPros.next(null); 
              }
            }    
            if(dtInstance["context"][0].sTableId=='tableAccu'){
              var bar2 = new Promise((resolve, reject) => {
                dtInstance.destroy();  
              });
              if(bar2){
                this.getDataAccu = this.caseDataObjTmp.accuObj;//โจทก์
                this.dtTriggerAccu.next(null); 
              }
            } 
            if(dtInstance["context"][0].sTableId=='tableLit'){
              var bar2 = new Promise((resolve, reject) => {
                dtInstance.destroy();  
              });
              if(bar2){
                this.getDataLit = this.caseDataObjTmp.litObj;//โจทก์
                this.dtTriggerLit.next(null); 
              }
            } 
            if(dtInstance["context"][0].sTableId=='tableOther'){
              var bar2 = new Promise((resolve, reject) => {
                dtInstance.destroy();  
              });
              if(bar2){
                this.getDataOther = this.caseDataObjTmp.otherObj;//โจทก์
                this.dtTriggerOther.next(null); 
              }
            } 
        });
      });
    });
  }

  rerenderPros(): void {
    console.log("rerenderPros")
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          if(dtInstance["context"][0].sTableId=='tablePros'){
            var bar2 = new Promise((resolve, reject) => {
              dtInstance.destroy();  
            });
            if(bar2){
              this.getDataPros = this.caseDataObjTmp.prosObj;//โจทก์
              //this.dtTrigger.next(null); 
              this.dtTriggerPros.next(null); 
            }
          }        
      });
    });
  }

  rerenderAccu(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          if(dtInstance["context"][0].sTableId=='tableAccu'){
            var bar2 = new Promise((resolve, reject) => {
              dtInstance.destroy();  
            });
            if(bar2){
              this.getDataAccu = this.caseDataObjTmp.accuObj;//โจทก์
              //this.dtTrigger.next(null); 
              this.dtTriggerAccu.next(null); 
            }
          }        
      });
    });
  }

  rerenderLit(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          if(dtInstance["context"][0].sTableId=='tableLit'){
            var bar2 = new Promise((resolve, reject) => {
              dtInstance.destroy();  
            });
            if(bar2){
              this.getDataLit = this.caseDataObjTmp.litObj;//โจทก์
              //this.dtTrigger.next(null); 
              this.dtTriggerLit.next(null); 
            }
          }        
      });
    });
  }

  rerenderOther(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          if(dtInstance["context"][0].sTableId=='tableOther'){
            var bar2 = new Promise((resolve, reject) => {
              dtInstance.destroy();  
            });
            if(bar2){
              this.getDataOther = this.caseDataObjTmp.otherObj;//โจทก์
              //this.dtTrigger.next(null); 
              this.dtTriggerOther.next(null); 
            }
          }          
      });
    });
  }


  ngAfterViewInit(): void {
    this.dtTriggerAlle.next(null);
    this.dtTriggerPros.next(null);
    this.dtTriggerAccu.next(null);
    this.dtTriggerLit.next(null);
    this.dtTriggerOther.next(null);
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTriggerAlle.unsubscribe();
    this.dtTriggerPros.unsubscribe();
    this.dtTriggerAccu.unsubscribe();
    this.dtTriggerLit.unsubscribe();
    this.dtTriggerOther.unsubscribe();
  }

  

  callDataHead(){
    var data = 1;
    var counter = this.counter++;
    var run_id = '';
    if(this.result.run_id)
      run_id =  this.result.run_id;
    var event = 1;
    this.onClickListData.emit({data,counter,run_id,event});
  }

  closeModal(){
    this.loadModalListMultiComponent = false;
    this.loadModalListComponent = false;
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
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
          //
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
          //
        }
        subscription.unsubscribe();
      });
    }else{
        var dataDel = [],dataTmp=[];
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
                    if(this.modalType==6){
                      const confirmBox = new ConfirmBoxInitializer();
                      confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
                      confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
                      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
                      confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){
                        var dataDel = [],dataTmp=[];
                        dataDel['run_id'] = this.result.run_id;
                        dataDel['log_remark'] = chkForm.log_remark;
                        dataDel['userToken'] = this.userData.userToken;

                        if(this.delTypeApp=='delPros'){//======================= โจทก์
                          var bar = new Promise((resolve, reject) => {
                            this.result.prosObj.forEach((ele, index, array) => {
                                  if(ele.seqPros == true){
                                    dataTmp.push(this.result.prosObj[index]);
                                  }
                              });
                          });
                          
                          if(bar){
                            let headers = new HttpHeaders();
                            headers = headers.set('Content-Type','application/json');
                            dataDel['data'] = dataTmp;
                            var data = $.extend({}, dataDel);
                            console.log(data)
                            this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/deleteAllLitigantData', data , {headers:headers}).subscribe(
                              (response) =>{
                                let alertMessage : any = JSON.parse(JSON.stringify(response));
                                if(alertMessage.result==0){
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
                                  confirmBox.setMessage(alertMessage.error);
                                  confirmBox.setButtonLabels('ตกลง');
                                  confirmBox.setConfig({
                                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.closebutton.nativeElement.click();
                                      var data = 1;
                                      var counter = this.counter++;
                                      var run_id = this.result.run_id;
                                      var event = 2;
                                      this.onClickListData.emit({data,counter,run_id,event});
                                    }
                                    subscription.unsubscribe();
                                  });
                                  
                                }
                              },
                              (error) => {}
                            )
                          }
                        }else if(this.delTypeApp=='delAccu'){//======================= จำเลย
                          var bar = new Promise((resolve, reject) => {
                            this.result.accuObj.forEach((ele, index, array) => {
                                  if(ele.seqAccu == true){
                                    dataTmp.push(this.result.accuObj[index]);
                                  }
                              });
                          });
                          
                          if(bar){
                            
                            let headers = new HttpHeaders();
                            headers = headers.set('Content-Type','application/json');
                            dataDel['data'] = dataTmp;
                            var data = $.extend({}, dataDel);
                            console.log(data)
                            this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/deleteAllLitigantData', data , {headers:headers}).subscribe(
                              (response) =>{
                                let alertMessage : any = JSON.parse(JSON.stringify(response));
                                if(alertMessage.result==0){
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
                                  confirmBox.setMessage(alertMessage.error);
                                  confirmBox.setButtonLabels('ตกลง');
                                  confirmBox.setConfig({
                                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.closebutton.nativeElement.click();
                                      var data = 1;
                                      var counter = this.counter++;
                                      var run_id = this.result.run_id;
                                      var event = 2;
                                      this.onClickListData.emit({data,counter,run_id,event});
                                    }
                                    subscription.unsubscribe();
                                  });
                                  
                                }
                              },
                              (error) => {}
                            )
                          }
                        }else if(this.delTypeApp=='delLit'){//======================= ผู้เกี่ยวข้อง
                          var bar = new Promise((resolve, reject) => {
                            this.result.litObj.forEach((ele, index, array) => {
                                  if(ele.seqLit == true){
                                    dataTmp.push(this.result.litObj[index]);
                                  }
                              });
                          });
                          
                          if(bar){
                            
                            let headers = new HttpHeaders();
                            headers = headers.set('Content-Type','application/json');
                            dataDel['data'] = dataTmp;
                            var data = $.extend({}, dataDel);
                            console.log(data)
                            this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/deleteAllLitigantData', data , {headers:headers}).subscribe(
                              (response) =>{
                                let alertMessage : any = JSON.parse(JSON.stringify(response));
                                if(alertMessage.result==0){
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
                                  confirmBox.setMessage(alertMessage.error);
                                  confirmBox.setButtonLabels('ตกลง');
                                  confirmBox.setConfig({
                                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.closebutton.nativeElement.click();
                                      var data = 1;
                                      var counter = this.counter++;
                                      var run_id = this.result.run_id;
                                      var event = 2;
                                      this.onClickListData.emit({data,counter,run_id,event});
                                    }
                                    subscription.unsubscribe();
                                  });
                                  
                                }
                              },
                              (error) => {}
                            )
                          }
                        }else if(this.delTypeApp=='delOther'){//======================= อื่นๆ
                          var bar = new Promise((resolve, reject) => {
                            this.result.otherObj.forEach((ele, index, array) => {
                                  if(ele.seqOther == true){
                                    dataTmp.push(this.result.otherObj[index]);
                                  }
                              });
                          });
                          
                          if(bar){
                            
                            let headers = new HttpHeaders();
                            headers = headers.set('Content-Type','application/json');
                            dataDel['data'] = dataTmp;
                            var data = $.extend({}, dataDel);
                            console.log(data)
                            this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/deleteAllLitigantData', data , {headers:headers}).subscribe(
                              (response) =>{
                                let alertMessage : any = JSON.parse(JSON.stringify(response));
                                if(alertMessage.result==0){
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
                                  confirmBox.setMessage(alertMessage.error);
                                  confirmBox.setButtonLabels('ตกลง');
                                  confirmBox.setConfig({
                                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.closebutton.nativeElement.click();
                                      var data = 1;
                                      var counter = this.counter++;
                                      var run_id = this.result.run_id;
                                      var event = 2;
                                      this.onClickListData.emit({data,counter,run_id,event});
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
                      subscription.unsubscribe();
                      });
                    }else if(this.modalType==8){
                      var dataDel = [],dataTmp=[];
                      dataDel['run_id'] = this.result.run_id;
                      dataDel['log_remark'] = chkForm.log_remark;
                      dataDel['userToken'] = this.userData.userToken;
                      dataTmp.push(this.result.alleObj[this.alleIndex]);
                      dataDel['data'] = dataTmp;
                      var data = $.extend({}, dataDel);
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/deleteAllAllegationData', data , {headers:headers}).subscribe(
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
                            confirmBox.setMessage('ลบข้อมูลฐานความผิดเรียบร้อยแล้ว');
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                var data = 1;
                                var counter = this.counter++;
                                var run_id = this.result.run_id;
                                var event = 2;
                                this.onClickListData.emit({data,counter,run_id,event});
                              }
                              subscription.unsubscribe();
                            });
                            
                          }
                        },
                        (error) => {}
                      )
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

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    if(this.modalType==2)
      this.caseDataObj.case_type = $("body").find(".case_type").attr("ng-reflect-model");
    this.openbutton.nativeElement.click();
  }
  delLitData(type:any){
    this.delTypeApp = type;
    this.clickOpenMyModalComponent(6);
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==2){
      $("#exampleModal2").find(".modal-content").css("width","800px");
      this.loadModalListMultiComponent = true;
      this.loadModalListComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
        
        var student = JSON.stringify({
          "table_name" : "pallegation_cover",
          "field_id" : "alle_id",
          "field_name" : "alle_name",
          "search_id" : "",
          "search_desc" : "",
          "condition" : " AND case_type='"+this.caseDataObj.case_type+"'",
          "userToken" : this.userData.userToken});
        this.listTable='pallegation_cover';
        this.listFieldId='alle_id';
        this.listFieldName='alle_name';
        this.listFieldNull='';
        this.listFieldCond=" AND case_type='"+this.caseDataObj.case_type+"'";
        
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
          },
          (error) => {}
        ) 
    }else if(this.modalType==3){
      this.loadModalListMultiComponent = false;
      this.loadModalListComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = true;
      var student = JSON.stringify({
        "cond":2,
        "assign_date":myExtObject.curDate(),
        "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.listFieldType=JSON.stringify({
        "type":1,
        "assign_date":myExtObject.curDate()});
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
          (response) =>{
           let productsJson : any = JSON.parse(JSON.stringify(response));
           if(productsJson.data.length){
             this.list = productsJson.data;
           }else{
             this.list = [];
           }
          },
          (error) => {}
        )
    }else if(this.modalType==4 || this.modalType==5){
      this.loadModalListMultiComponent = false;
      this.loadModalListComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = true;
      var student = JSON.stringify({
        "cond":2,
        "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.listFieldType=JSON.stringify({"type":2});
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
          (response) =>{
           let productsJson : any = JSON.parse(JSON.stringify(response));
           if(productsJson.data.length){
             this.list = productsJson.data;
           }else{
             this.list = [];
           }
          },
          (error) => {}
        )
    }else if(this.modalType==6 || this.modalType==8){
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalConfComponent = true;
      this.loadModalListMultiComponent = false;
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
    }else if(this.modalType==7){
      $("#exampleModal").find(".modal-content").css("width","750px");
      this.loadModalConfComponent = false;
      this.loadModalListMultiComponent = false;
      this.loadModalListComponent = true;
      this.loadModalJudgeComponent = false;
      var student = JSON.stringify({
        "table_name" : "pallegation",
         "field_id" : "alle_id",
         "field_name" : "alle_name",
         "field_name2" : "alle_running",
         "search_id" : "",
         "search_desc" : "",
         "condition" : " AND case_type='"+this.result.case_type+"' AND case_cate_group='"+this.result.case_cate_group+"' AND user_select=1",
         "userToken" : this.userData.userToken});
        this.listTable='pallegation';
        this.listFieldId='alle_id';
        this.listFieldName='alle_name';
        this.listFieldNull='';
        this.listFieldCond=" AND case_type='"+this.result.case_type+"' AND case_cate_group='"+this.result.case_cate_group+"' AND user_select=1";
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
          },
          (error) => {}
        ) 
    }

  }

  receiveJudgeListData(event:any){
    if(this.modalType==3 || this.modalType==4){
      this.result.order_judge_id=event.judge_id;
      this.result.order_judge_name=event.judge_name;
    }else if(this.modalType==5){
      this.result.case_judge_id=event.judge_id;
      this.result.case_judge_name=event.judge_name;
    }
    this.closebutton.nativeElement.click();
  }

  receiveFuncListData(event:any){
    console.log(event)
    var data = [event];
    if(this.modalType==7){
      this.insertAlle(data);
    }else if(this.modalType==2){
      this.result.alle_id=event.fieldIdValue;
      this.result.alle_desc=event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  tabChangeInput(name:any,event:any){
    if(name=='alle_id'){
      var student = JSON.stringify({
        "table_name" : "pallegation_cover",
        "field_id" : "alle_id",
        "field_name" : "alle_name",
        "condition" : " AND alle_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.alle_name = productsJson[0].fieldNameValue;
        }else{
          this.result.alle_id = '';
          this.result.alle_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='order_judge_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
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
    }else if(name=='case_judge_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.case_judge_name = productsJson[0].fieldNameValue;
        }else{
          this.result.case_judge_id = '';
          this.result.case_judge_name = '';
        }
        },
        (error) => {}
      )
    }
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  saveData(objHead:any){
    this.caseDataObj = objHead;

    const confirm$:ConfirmBoxInitializer = new ConfirmBoxInitializer();
    confirm$.setTitle('ข้อความแจ้งเตือน')
    confirm$.setButtonLabels('ตกลง');
    if(objHead.caseEvent==2){//จัดเก็บ
      this.result2 = [];
      this.result2.caseEvent = this.caseDataObj.caseEvent;
      this.result2.case_cate_id = this.caseDataObj.case_cate_id;
      this.result2.case_date = this.caseDataObj.case_date;
      this.result2.case_status = this.caseDataObj.case_status;
      this.result2.case_type = this.caseDataObj.case_type;
      this.result2.court_id = this.caseDataObj.court_id;
      this.result2.end_case = this.caseDataObj.end_case;
      this.result2.id = this.caseDataObj.id;
      this.result2.judging_date = this.caseDataObj.judging_date;
      this.result2.red_running = this.caseDataObj.judgeObj[0].red_running;
      this.result2.red_id = this.caseDataObj.red_id;
      this.result2.red_title = this.caseDataObj.red_title;
      this.result2.red_yy = this.caseDataObj.red_yy;
      this.result2.title = this.caseDataObj.title;
      this.result2.yy = this.caseDataObj.yy;
      this.result2.disable_run_case = 1;
      this.result2.userToken = this.userData.userToken;
      this.result2.run_id = this.caseDataObj.run_id ? this.caseDataObj.run_id : '0';
      

      if(!this.caseDataObj.case_date){
        confirm$.setMessage('ป้อนข้อมูลวันที่รับฟ้อง');
        confirm$.openConfirmBox$().subscribe();
        return
      }else if(this.caseDataObj.red_yy && (parseInt(this.caseDataObj.red_yy)<parseInt(this.caseDataObj.yy))){
        confirm$.setMessage('ปีเลขคดีแดงต้องมากกว่าหรือเท่ากับเลขคดีดำ');
        confirm$.openConfirmBox$().subscribe();
        return
      }else if(this.caseDataObj.run_id && ((this.caseDataObjTmp.title+this.caseDataObjTmp.id+this.caseDataObjTmp.yy) != (this.caseDataObj.title+this.caseDataObj.id+this.caseDataObj.yy)) && !this.caseDataObj.log_remark){
        confirm$.setMessage('คุณไม่สามารถแก้ไขเลขคดีได้ ถ้าต้องการแก้ไขกรุณา login เพื่อเปลี่ยนเลขคดี');
        confirm$.openConfirmBox$().subscribe();
        return
      }else if(this.caseDataObj.length && this.caseDataObj.judgeObj.length && ((this.caseDataObjTmp.judgeObj[0].red_title+this.caseDataObjTmp.judgeObj[0].red_id+this.caseDataObjTmp.judgeObj[0].red_yy) != (this.caseDataObj.red_title+this.caseDataObj.red_id+this.caseDataObj.red_yy)) && !this.caseDataObj.log_remark){
        confirm$.setMessage('คุณไม่สามารถแก้ไขเลขคดีได้ ถ้าต้องการแก้ไขกรุณา login เพื่อเปลี่ยนเลขคดี');
        confirm$.openConfirmBox$().subscribe();
        return
      }else if(this.caseDataObj.yy && (parseInt(this.caseDataObj.yy) != parseInt(this.caseDataObj.case_date.split('/')[2]))){
        confirm$.setMessage('ปีของวันที่รับฟ้อง ต้องตรงกันกับปีของหมายเลขคดีดำ');
        confirm$.openConfirmBox$().subscribe();
        return
      }
      //let dataMerge = Object.assign(this.caseDataObj, this.result);
      //console.log(dataMerge)
      console.log(this.result.deposit)
      if(this._result.deposit && this._result.deposit.indexOf(',')!=-1){
        this.result2.deposit = this.curencyFormatRemove(this._result.deposit).toString();
      }else if(this._result.deposit && this._result.deposit.indexOf(',')==-1){
        this.result2.deposit = this._result.deposit;
      }else{
        this.result2.deposit = null;
      }
      this.result2.guar_pros = this._result.guar_pros;
      this.result2.case_level  = this._result.case_level;
      this.result2.alle_desc = this._result.alle_desc;
      this.result2.case_result = this._result.case_result;
      this.result2.order_judge_id = this._result.order_judge_id;
      this.result2.order_judge_name = this._result.order_judge_name;
      this.result2.order_judge_date = this._result.order_judge_date;
      this.result2.remark = this._result.remark;
      this.result2.case_judge_id = this._result.case_judge_id;
      this.result2.case_judge_name = this._result.case_judge_name;
      this.result2.case_judge_date = this._result.case_judge_date;

      var student = $.extend({},this.result2);
      console.log(student)
      
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0800/saveCaseData', student).subscribe(
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
                  var data = 1;
                  var counter = this.counter++;
                  var run_id = getDataOptions.run_id;
                  var event = 2;
                  this.onClickListData.emit({data,counter,run_id,event});
                  //this.caseDataObj.log_remark = null;
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

  buttonNew(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    console.log(winURL+'fca0800')
    location.replace(winURL+'fca0800')
    window.location.reload();
  }

  resetPage(){
    if(this.caseDataObjTmp.run_id){
      var data = 1;
      var counter = this.counter++;
      var run_id = this.caseDataObjTmp.run_id;
      var event = 2;
      this.onClickListData.emit({data,counter,run_id,event});
    }else{
      window.location.reload();
    }
  }

  editLitData(running:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/fca0130";
    var name='';
		if(name=='')
			name='win_'+Math.ceil(Math.random()*1000);
    window.open(winURL+"?run_id="+this.result.run_id+"&lit_running="+running, "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width="+screen.availWidth+",height="+screen.availHeight);
  }

  openLitWindow(type:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/fca0130";
    console.log(winURL)
    var name='';
		if(name=='')
			name='win_'+Math.ceil(Math.random()*1000);
    if(this.result.run_id && type)
      window.open(winURL+"?run_id="+this.result.run_id+"&lit_type="+type,name, "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width="+screen.availWidth+",height="+screen.availHeight);
    else if (this.result.run_id && !type)
      window.open(winURL+"?run_id="+this.result.run_id,name, "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width="+screen.availWidth+",height="+screen.availHeight);
    else
      window.open(winURL,type, "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width="+screen.availWidth+",height="+screen.availHeight);
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
    if(child=='seqPros'){
      if(this[master]==true){
        if(obj.length)
          this.buttonDelPros = true;
      }else{
        this.buttonDelPros = false;
      }
    }
    if(child=='seqAccu'){
      if(this[master]==true){
        if(obj.length)
          this.buttonDelAccu = true;
      }else{
        this.buttonDelAccu = false;
      }
    }
    if(child=='seqLit'){
      if(this[master]==true){
        if(obj.length)
          this.buttonDelLit = true;
      }else{
        this.buttonDelLit = false;
      }
    }
    if(child=='seqOther'){
      if(this[master]==true){
        if(obj.length)
          this.buttonDelOther = true;
      }else{
        this.buttonDelOther = false;
      }
    }

  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
    var isChecked = obj.every(function(item:any) {
      return item[child] == false;
    })
    if(child=='seqPros'){
      if(isChecked==true){
        this.buttonDelPros = false;
      }else{
        this.buttonDelPros = true;
      }
    }
    if(child=='seqAccu'){
      if(isChecked==true){
        this.buttonDelAccu = false;
      }else{
        this.buttonDelAccu = true;
      }
    }
    if(child=='seqLit'){
      if(isChecked==true){
        this.buttonDelLit = false;
      }else{
        this.buttonDelLit = true;
      }
    }
    if(child=='seqOther'){
      if(isChecked==true){
        this.buttonDelOther = false;
      }else{
        this.buttonDelOther = true;
      }
    }

  }

  changeInputData(event:any,table:any,type:any){
    if(table=='pallegation' && type==1){
      //this.SpinnerService.show();
      if(event.target.value){
        let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "table_name" : "pallegation",
        "field_id" : "alle_id",
        "field_name" : "alle_name",
        "field_name2" : "alle_running",
        "search_id" : "",
        "search_desc" : "",
        "condition" : " AND case_type='"+this.result.case_type+"' AND case_cate_group='"+this.result.case_cate_group+"' AND user_select='1' AND alle_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken});
        console.log(student);
        
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
          (response) =>{
            this.list = response;
            if(this.list.length){
              this.insertAlle(this.list);
            }else{
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage('ไม่พบรหัสฐานความผิดนี้ในระบบ');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.alleId = '';
                }
                subscription.unsubscribe();
              });
            }
            console.log(this.list)
          },
          (error) => {}
        )
      }
    }
  }

  insertAlle(event:any){
    var data = event[0];
    //console.log(data.fieldIdValue+":"+data.fieldNameValue+":"+data.fieldNameValue2)
    var student = JSON.stringify({
      "run_id" : this.result.run_id,
      "alle_running" : event[0].fieldNameValue2,
      "alle_id" : event[0].fieldIdValue,
      "alle_seq" : this.alleSeq,
      "alle_name" : event[0].fieldNameValue,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/insertAllegation', student , {headers:headers}).subscribe(
      (response) =>{
        let alertMessage : any = JSON.parse(JSON.stringify(response));
        if(alertMessage.result==0){
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
          //this.getObjAlleData();
          confirmBox.setMessage('จัดเก็บฐานความผิดเรียบร้อยแล้ว');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              var data = 1;
              var counter = this.counter++;
              var run_id = this.result.run_id;
              var event = 2;
              this.onClickListData.emit({data,counter,run_id,event});
            }
            subscription.unsubscribe();
          });
          
        }
      },
      (error) => {}
    )
  }

  runAlleSeq(dataObj:any){
    if(dataObj){
      const item = dataObj.reduce((prev:any, current:any) => (+prev.alle_seq > +current.alle_seq) ? prev : current)
      this.alleSeq = item.alle_seq+1;
    }
  }

  curencyFormat(n:any,d:any) {
		return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	}
  curencyFormatRemove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, ""); 
    } else {
      return "";
    }
  }

  printReport(type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.run_id){
      confirmBox.setMessage('กรุณาค้นหาเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(type==1){
      var rptName = 'rca0200';
      var paramData ='{}';
      var paramData = JSON.stringify({
        "prun_id" : this.result.run_id,
        "pcase_flag" : this.result.case_flag,
        "pprint_app" : 1,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName,paramData);
    }else if(type==2){
      var rptName = 'rca0120';
      var paramData ='{}';
      var paramData = JSON.stringify({
        "prun_id" : this.result.run_id,
        "pcase_flag" : this.result.case_flag,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName,paramData);
    }else if(type==3){
      var rptName = 'rca0200_A4';
      var paramData ='{}';
      var paramData = JSON.stringify({
          "prun_id" : this.result.run_id,
          "pcase_flag" : this.result.case_flag,
          "pprint_app" : 1,
          "pprint_by" : 1,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName,paramData);
    }else if(type==4){
      var rptName = 'rca0120_A4';
      var paramData ='{}';
      var paramData = JSON.stringify({
          "prun_id" : this.result.run_id,
          "pcase_flag" : this.result.case_flag,
          "pprint_by" : 1,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName,paramData);
    }
  }




}
