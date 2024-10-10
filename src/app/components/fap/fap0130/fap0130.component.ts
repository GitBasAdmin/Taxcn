import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter    } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { PrintReportService } from 'src/app/services/print-report.service';
import { NgbModal, NgbModalRef   } from '@ng-bootstrap/ng-bootstrap';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
} from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { ModalEnvelopeReadComponent } from '../../modal/modal-envelope-read/modal-envelope-read.component';
import { ModalAttachWitnessComponent } from '../../modal/modal-attach-witness/modal-attach-witness.component';

@Component({
  selector: 'app-fap0130,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fap0130.component.html',
  styleUrls: ['./fap0130.component.css']
})


export class Fap0130Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  
  getStatus:any;
  getAppointTable:any;
  getAppointBy:any;
  getLitType:any;

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
  dataWitness:any = [];
  dataWitdraw:any = [];
  rawWitness:any = [];
  rawWitdraw:any = [];
  fileToUpload1:File;
  fileToUpload2:File;
  rowWitIndex:any;
  rowWitType:any;
  rowWitFile:any;
  lit_witness:any;
  rowWitdrawIndex:any;
  app_running:any;
 
  myExtObject: any;
  tableAppointment:any;
  modalType:any;
  runId:any;
  buttonDelApp: boolean = false;
  

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalComponent: boolean = false;
	public loadModalConfComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadModalEnvolopeReadComponent: boolean = false;
  public loadModalAppComponent: boolean = false;
  public loadModalJudgeGroupComponent: boolean = false;
  public loadModalJudgeGroupSigleComponent: boolean = false;
  public loadModalJudgeAssociateComponent: boolean = false;
  public loadModalLitComponent: boolean = false;
  public loadModalAttWitnessComponent: boolean = false;
  public loadModalConcComponent: boolean = false;

 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public masterSelect: boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  @ViewChild( ModalEnvelopeReadComponent ) child2: ModalEnvelopeReadComponent ; 
  @ViewChild( ModalAttachWitnessComponent ) child3: ModalAttachWitnessComponent ; 
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
      this.app_running = params['app_running'];
      if(typeof this.app_running !='undefined')
        this.getAppRunning('');
    });
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      //======================== pappoint_by ======================================
      var student = JSON.stringify({
        "table_name" : "pappoint_status",
        "field_id" : "status_id",
        "field_name" : "status_name",
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getStatus = getDataOptions;
        },
        (error) => {}
      )
      //======================== pappoint_table ======================================
      var student = JSON.stringify({
        "table_name" : "pappoint_table",
        "field_id" : "table_id",
        "field_name" : "table_name",
        "order_by" : " NVL(table_order,999) ASC,NVL(table_id,999) ASC",
         "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.getAppointTable = getDataOptions;
        },
        (error) => {}
      )
      //======================== pappoint_by======================================
      var student = JSON.stringify({
        "table_name" : "pappoint_by",
        "field_id" : "appoint_by_id",
        "field_name" : "appoint_by_name",
         "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getAppointBy = getDataOptions;
        },
        (error) => {}
      )
      //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getLitType = getDataOptions;
      },
      (error) => {}
    )
      
      
      if(this.successHttp()){
        this.setDefPage();
        this.setDefWitness();
        this.setDefWitdraw();
      }
        
    }

    setDefPage(){
      this.result = [];
      this.result.num = 1;
      this.result.mor_time = '09.00';
      this.result.eve_time = '13.00';
      this.result.night_time = '16.30';
      this.result.judge_by = 1;
      this.result.app_by = 1;
      //this.callCalendarApp();
    }

    setDefWitness(){
      this.rawWitness = [];
      this.rawWitness.rlit_type = 1;
    }

    setDefWitdraw(){
      this.rawWitdraw = [];
      this.rawWitdraw.wtype = 1;
      this.rawWitdraw.show_flag = 1;
      this.rawWitdraw.investigate_flag = 1;
      this.rawWitdraw.pay_date = myExtObject.curDate();
      this.rawWitdraw.pay_by = 3;
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
      this.result[obj] = date;
    }
    directiveDate2(date:any,obj:any){
      this.rawWitdraw[obj] = date;
    }
    getAppRunning(type:any){//1คือไม่ต้องกำหนด run_id ใหม่
      var student = JSON.stringify({
        "split_app" : "1",
        "app_running" : this.app_running?this.app_running:this.result.app_running,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiAP/API/APPOINT/getAppointData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions);
          this.receiveFuncAppData(getDataOptions.data[0]);
          //this.dataHead.run_id = getDataOptions[0].run_id;
        if(!type)
          this.runId = {'run_id' : getDataOptions.data[0].run_id,'counter' : Math.ceil(Math.random()*10000)}
        },
        (error) => {}
      )
    }
//===================================================================================================== modal ======================================================================
closeModal(){
  this.loadModalComponent = false;
  this.loadModalConfComponent = false;
  this.loadModalJudgeComponent = false;
  this.loadModalEnvolopeReadComponent = false;
  this.loadModalAppComponent = false;
  this.loadModalJudgeGroupComponent = false;
  this.loadModalJudgeGroupSigleComponent = false;
  this.loadModalJudgeAssociateComponent = false;
  this.loadModalLitComponent = false;
  this.loadModalAttWitnessComponent = false;
  this.loadModalConcComponent = false;
}

submitModalAttWitness(){
  var dataObj = this.child3.ChildTestCmp();
  if(dataObj.name){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();
    let headers = new HttpHeaders();
    //headers = headers.set('Content-Type','multipart/form-data');
    //headers = headers.append('enctype', 'multipart/form-data');
    var formData = new FormData();
    formData.append('report_running', this.dataWitness[this.rowWitIndex].report_running);
    if(this.rowWitFile==1)
      formData.append('file_type', 'app');
    else
      formData.append('file_type', 'wit');
    formData.append('userToken', this.userData.userToken);
    formData.append('file', dataObj);
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
    }
    this.http.disableHeader().post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/uploadReport', formData).subscribe(
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
              if(this.rowWitFile==1){
                this.dataWitness[this.rowWitIndex].file1 = 1;
              }else{
                this.dataWitness[this.rowWitIndex].file2 = 1;
              }
              
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
              this.SpinnerService.hide();}
            subscription.unsubscribe();
          });
        }
      },
      (error) => {this.SpinnerService.hide();}
    )
  }
  this.closebutton.nativeElement.click();
}

submitModalFormEnvelope(){
  var dataObj = this.child2.saveData();
  /*
  if(dataObj.length){
    var hcase_no = '',case_running = '';
    var bar = new Promise((resolve, reject) => {
      dataObj.forEach((ele, index, array) => {
          if(index!=0){
            hcase_no += ','+ele.hcase_no1;
            case_running += ','+ele.case_running;
          }else{
            hcase_no = ele.hcase_no1;
            case_running = ele.case_running;
          }
      });
    });
    if(bar){
      this.result.map_case = hcase_no;
      this.result.case_running = case_running;
      //getAppRunning
    }
  }else{
    //this.result.map_case = hcase_no;
    //this.result.case_running = case_running;

  }*/
  
  //this.closebutton.nativeElement.click();
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
                  if(this.modalType==100){
                    var student = JSON.stringify({
                    "report_running" : this.dataWitness[this.rowWitIndex].report_running,
                    "log_remark" : chkForm.log_remark,
                    "userToken" : this.userData.userToken});
                    console.log(student)
                    this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/deleteReport', student , {headers:headers}).subscribe(
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
                              this.getWitnessData();
                            }
                            subscription.unsubscribe();
                          });
                        }
                      },
                      (error) => {this.SpinnerService.hide();}
                    )
                  }else if(this.modalType==101){
                    var student = JSON.stringify({
                      "comp_running" : this.dataWitdraw[this.rowWitdrawIndex].comp_running,
                      "log_remark" : chkForm.log_remark,
                      "userToken" : this.userData.userToken});
                      console.log(student)
                      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/deleteCompens', student , {headers:headers}).subscribe(
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
                                this.getWitdrawData();
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

receiveFuncEnvelopeReadData(event:any){
  console.log(event)
  var chkForm = JSON.parse(this.child.ChildTestCmp());
}
receiveJudgeAssociateData(event:any){
  this.result.judge_aid=event.judge_id;
  this.result.judge_aid=event.judge_name;
}
receiveJudgeGroupSigleListData(event:any){
  console.log(event)
  if(this.modalType==7){
    this.result.judge_gid=event.judge_id;
    this.result.judge_gname=event.judge_name;
  }else if(this.modalType==8){
    this.result.judge_gid2=event.judge_id;
    this.result.judge_gname2=event.judge_name;
  }else if(this.modalType==23){
    this.result.judge_gid3=event.judge_id;
    this.result.judge_gname3=event.judge_name;
  }
  this.closebutton.nativeElement.click();
}
receiveJudgeGroupListData(event:any){
  console.log(event)
  this.result.judge_id=event.judge_id1;
  this.result.judge_name=event.judge_name1;

  this.result.judge_gid=event.judge_id2;
  this.result.judge_gname=event.judge_name2;
  this.closebutton.nativeElement.click();
}


receiveFuncAppData(event:any){
  
  this.result = [];
  this.result = event;
  if(this.result.judge_id)
    this.getJudgeName(this.result.judge_id,'judge_name');
  if(this.result.judge_gid)
    this.getJudgeName(this.result.judge_gid,'judge_gname');
  if(this.result.judge_gid2)
    this.getJudgeName(this.result.judge_gid2,'judge_gname2');
  if(this.result.judge_gid3)
    this.getJudgeName(this.result.judge_gid3,'judge_gname3');
  this.getWitnessData();
  this.getWitdrawData();
  this.closebutton.nativeElement.click();
}

public getJudgeName(judge_id:any,field_name:any){
  if(judge_id){
    var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "condition" : " AND judge_id='"+judge_id+"'",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.length){
          this.result[field_name] = getDataOptions[0].fieldNameValue;
        }else{
          this.result[field_name] = '';
        }
        
      },
      (error) => {}
    )
  }
  //return judge_name;
}

receiveFuncReceiptData(event:any){
  if(this.modalType==12){
    this.result.delay_id = event.judge_id;
    this.result.delay_name = event.judge_name;
  }else if(this.modalType==12){
    this.result.delay_id = event.judge_id;
    this.result.delay_name = event.judge_name;
  }else if(this.modalType==13){
    this.result.result_id = event.judge_id;
    this.result.result_name = event.judge_name;
  }
}

receiveFuncLitData(event:any){
  if(Number.isInteger(this.rowWitIndex)==true){
    this.dataWitness[this.rowWitIndex].rseq = event.seq;
    this.dataWitness[this.rowWitIndex].rlit_name = event.lit_name+" "+event.lit_type_desc2;
  }else{
    this.rawWitness.rseq = event.seq;
    this.rawWitness.rlit_name = event.lit_name+" "+event.lit_type_desc2;
  }
  this.closebutton.nativeElement.click();
}

receiveJudgeListData(event:any){
  if(this.modalType==6){
    this.result.judge_id = event.judge_id;
    this.result.judge_name = event.judge_name;
  }else if(this.modalType==7){
    this.result.judge_gid = event.judge_id;
    this.result.judge_gname = event.judge_name;
  }else if(this.modalType==8){
    this.result.judge_gid2 = event.judge_id;
    this.result.judge_gname2 = event.judge_name;
  }else if(this.modalType==23){
    this.result.judge_gid3 = event.judge_id;
    this.result.judge_gname3 = event.judge_name;
  }
  this.closebutton.nativeElement.click();
}

receiveFuncListData(event:any){
  console.log(event)
  if(this.modalType==2){
    this.result.room_id=event.fieldIdValue;
    this.result.room_desc=event.fieldNameValue;
  }else if(this.modalType==3){
    this.result.to_court_id=event.fieldIdValue;
    this.result.to_court_name=event.fieldNameValue;
  }else if(this.modalType==4){
    this.result.app_id=event.fieldIdValue;
    this.result.app_name=event.fieldNameValue;
  }else if(this.modalType==12){
    this.result.delay_id=event.fieldIdValue;
    this.result.delay_name=event.fieldNameValue;
  }else if(this.modalType==13){
    this.result.result_id=event.fieldIdValue;
    this.result.result_name=event.fieldNameValue;
  }else if(this.modalType==16){
    //console.log(this.rowWitIndex)
    if(Number.isInteger(this.rowWitIndex)==true){
      this.dataWitness[this.rowWitIndex].rform_id1=event.fieldIdValue;
      if(event.fieldNameValue2)
      this.dataWitness[this.rowWitIndex].rform_name1=event.fieldNameValue+'('+event.fieldNameValue+")";
      else
      this.dataWitness[this.rowWitIndex].rform_name1=event.fieldNameValue;
    }else{
      this.rawWitness.rform_id1=event.fieldIdValue;
      if(event.fieldNameValue2)
      this.rawWitness.rform_name1=event.fieldNameValue+'('+event.fieldNameValue+")";
      else
      this.rawWitness.rform_name1=event.fieldNameValue;
    }
  }else if(this.modalType==17){
    if(Number.isInteger(this.rowWitIndex)==true){
      this.dataWitness[this.rowWitIndex].rform_id2=event.fieldIdValue;
      if(event.fieldNameValue2)
      this.dataWitness[this.rowWitIndex].rform_name2=event.fieldNameValue+'('+event.fieldNameValue+")";
      else
      this.dataWitness[this.rowWitIndex].rform_name2=event.fieldNameValue;
    }else{
      this.rawWitness.rform_id2=event.fieldIdValue;
      if(event.fieldNameValue2)
      this.rawWitness.rform_name2=event.fieldNameValue+'('+event.fieldNameValue+")";
      else
      this.rawWitness.rform_name2=event.fieldNameValue;
    }
  }else if(this.modalType==19){
    this.rawWitdraw.comp_id = event.fieldIdValue;
    var name = event.fieldNameValue?event.fieldNameValue:'';
    var name2 = event.fieldNameValue2?event.fieldNameValue2:'';
    this.rawWitdraw.comp_name = name+name2;
  }else if(this.modalType==20 || this.modalType==21){

    this.result.form_id = event.fieldIdValue;
    this.result.form_desc = event.fieldNameValue;
  }else if(this.modalType==22){
    this.result.form_id2 = event.fieldIdValue;
    this.result.form_desc2 = event.fieldNameValue;
  }
  this.closebutton.nativeElement.click();
}

clickRowWit(index:any,type:any,file:any){
  //type : 1 คือ คลิกมาจาก record ที่เป็นข้อมูล
  //type : 2 คือ คลิกมาจาก record ที่่เป็น insert
  this.rowWitType = type;
  this.rowWitFile = file;
  if(type==2){
    this.rowWitIndex = '';
    this.lit_witness = parseInt(this.rawWitness.rlit_type);
  }else{
    this.rowWitIndex = index;
    this.lit_witness = parseInt(this.dataWitness[index].rlit_type);
  }
}
clickRowWit2(index:any){
  this.rowWitdrawIndex = index;
}
clickOpenMyModalComponent(type:any){
  var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
  if((type==9 || type==1 || type==14 || type==15 || type==19) && !run_id){
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
  }else if((type==10 || type==14) && !this.result.app_seq){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('กรุณาเลือกนัด');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }else{
    this.modalType = type;
    if(this.modalType!=14){
      this.openbutton.nativeElement.click();
    }else{
      const modalRef: NgbModalRef = this.ngbModal.open(ModalEnvelopeReadComponent)
      modalRef.componentInstance.run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id
      modalRef.componentInstance.app_seq = this.result.app_seq
      modalRef.closed.subscribe((data) => {
        this.getAppRunning(1)
      })
    }
  }
}


loadMyModalComponent(){
  var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
  if(this.modalType==1){
    $("#exampleModal").find(".modal-content").css("width","800px");
    this.loadModalComponent = false;  
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalEnvolopeReadComponent = false;
    this.loadModalAppComponent = true;
    this.loadModalJudgeGroupComponent = false;
    this.loadModalJudgeGroupSigleComponent = false;
    this.loadModalJudgeAssociateComponent = false;
    this.loadModalLitComponent = false;
    this.loadModalAttWitnessComponent = false;
    this.loadModalConcComponent = false;
  }else if(this.modalType==2){
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
  }else if(this.modalType==3){
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
  }else if(this.modalType==4){
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
  }else if(this.modalType==5){
    $("#exampleModal").find(".modal-content").css({"width":"950px"});
    this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalEnvolopeReadComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalJudgeGroupComponent = true;
      this.loadModalJudgeGroupSigleComponent = false;
      this.loadModalJudgeAssociateComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalAttWitnessComponent = false;
      this.loadModalConcComponent = false;
  }else if(this.modalType==6 || this.modalType==7 || this.modalType==8 || this.modalType==23){
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = true;
      this.loadModalEnvolopeReadComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalJudgeGroupSigleComponent = false;
      this.loadModalJudgeAssociateComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalAttWitnessComponent = false;
      this.loadModalConcComponent = false;
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
       /*
  }else if(this.modalType==7 || this.modalType==8){
    /*
    $("#exampleModal").find(".modal-content").css("width","650px");
    this.loadModalComponent = false;  
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalEnvolopeReadComponent = false;
    this.loadModalAppComponent = false;
    this.loadModalJudgeGroupComponent = false;
    this.loadModalJudgeGroupSigleComponent = true;
    this.loadModalJudgeAssociateComponent = false;
    this.loadModalLitComponent = false;
    this.loadModalAttWitnessComponent = false;
    this.loadModalConcComponent = false;
    
  }else if(this.modalType==9 || this.modalType==10 || this.modalType==11){
    $("#exampleModal").find(".modal-content").css("width","650px");
    this.loadModalComponent = false;  
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalEnvolopeReadComponent = false;
    this.loadModalAppComponent = false;
    this.loadModalJudgeGroupComponent = false;
    this.loadModalJudgeGroupSigleComponent = false;
    this.loadModalJudgeAssociateComponent = true;
    this.loadModalLitComponent = false;
    this.loadModalAttWitnessComponent = false;
    this.loadModalConcComponent = false;
    if(this.modalType==9)
      this.listFieldType=JSON.stringify({"type":1,"run_id":this.dataHead.run_id});
    else if(this.modalType==10)
      this.listFieldType=JSON.stringify({"type":2,"date_appoint":this.result.date_appoint});
    else if(this.modalType==11)
      this.listFieldType=JSON.stringify({"type":3});
  */
  }else if(this.modalType==12){
    $("#exampleModal").find(".modal-content").css("width","650px");
    var student = JSON.stringify({
      "table_name" : "pappoint_delay",
       "field_id" : "delay_id",
       "field_name" : "delay_name",
       "search_id" : "",
       "search_desc" : "",
       "userToken" : this.userData.userToken});
    this.listTable='pappoint_delay';
    this.listFieldId='delay_id';
    this.listFieldName='delay_name';
    this.listFieldCond="";
  }else if(this.modalType==13){
    $("#exampleModal").find(".modal-content").css("width","650px");
    var student = JSON.stringify({
      "table_name" : "pappoint_result",
       "field_id" : "result_id",
       "field_name" : "result_name",
       "search_id" : "",
       "search_desc" : "",
       "userToken" : this.userData.userToken});
    this.listTable='pappoint_result';
    this.listFieldId='result_id';
    this.listFieldName='result_name';
    this.listFieldCond="";
  }else if(this.modalType==14){//ซองที่อ่าน
    $("#exampleModal").find(".modal-content").css("width","850px");
    console.log(this.result)
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalEnvolopeReadComponent = true;
      this.loadModalAppComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalJudgeGroupSigleComponent = false;
      this.loadModalJudgeAssociateComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalAttWitnessComponent = false;
      this.loadModalConcComponent = false;
      
  }else if(this.modalType==15){//คู่ความในคดี
    $("#exampleModal").find(".modal-content").css("width","850px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalEnvolopeReadComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalJudgeGroupSigleComponent = false;
      this.loadModalJudgeAssociateComponent = false;
      this.loadModalLitComponent = true;
      this.loadModalAttWitnessComponent = false;
      this.loadModalConcComponent = false;
      
  }else if(this.modalType==16){
    $("#exampleModal").find(".modal-content").css("width","650px");
    var student = JSON.stringify({
      "table_name" : "pword_form",
       "field_id" : "form_id",
       "field_name" : "form_name",
       "field_name2" : "form_add",
       "search_id" : "",
       "search_desc" : "",
       "condition" : " AND form_type='1'",
       "userToken" : this.userData.userToken});
    this.listTable='pword_form';
    this.listFieldId='form_id';
    this.listFieldName='form_name';
    this.listFieldName2='form_add';
    this.listFieldCond="";
  }else if(this.modalType==17){
    $("#exampleModal").find(".modal-content").css("width","650px");
    var student = JSON.stringify({
      "table_name" : "pword_form",
       "field_id" : "form_id",
       "field_name" : "form_name",
       "field_name2" : "form_add",
       "search_id" : "",
       "search_desc" : "",
       "condition" : " AND form_type='5'",
       "userToken" : this.userData.userToken});
    this.listTable='pword_form';
    this.listFieldId='form_id';
    this.listFieldName='form_name';
    this.listFieldName2='form_add';
    this.listFieldCond="";
  }else if(this.modalType==18){
    $("#exampleModal").find(".modal-content").css("width","650px");
    this.loadModalComponent = false;  
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalEnvolopeReadComponent = false;
    this.loadModalAppComponent = false;
    this.loadModalJudgeGroupComponent = false;
    this.loadModalJudgeGroupSigleComponent = false;
    this.loadModalJudgeAssociateComponent = false;
    this.loadModalLitComponent = false;
    this.loadModalAttWitnessComponent = true;
    this.loadModalConcComponent = false;
  }else if(this.modalType==19){
    if(this.rawWitdraw.wtype==3.1){
      $("#exampleModal").find(".modal-content").css("width","650px");
    var student = JSON.stringify({
      "table_name" : "pcase_litigant",
       "field_id" : "seq",
       "field_name" : "title",
       "field_name2" : "name",
       "search_id" : "",
       "search_desc" : "",
       "condition" : " AND run_id='"+run_id+"' AND lit_type= '11' AND lit_type2 = '1'",
       "userToken" : this.userData.userToken});
    this.listTable='pcase_litigant';
    this.listFieldId='seq';
    this.listFieldName='title';
    this.listFieldName2='name';
    this.listFieldCond=" AND run_id='"+run_id+"' AND lit_type= '11' AND lit_type2 = '1'";
    }else if(this.rawWitdraw.wtype==3.2){
      $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pcase_litigant",
           "field_id" : "seq",
           "field_name" : "title",
           "field_name2" : "name",
           "search_id" : "",
           "search_desc" : "",
           "condition" : " AND run_id='"+run_id+"' AND lit_type= '11' AND lit_type2 = '2'",
           "userToken" : this.userData.userToken});
        this.listTable='pcase_litigant';
        this.listFieldId='seq';
        this.listFieldName='title';
        this.listFieldName2='name';
        this.listFieldCond=" AND run_id='"+run_id+"' AND lit_type= '11' AND lit_type2 = '2'";
        
    }else if(this.rawWitdraw.wtype==4){
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalEnvolopeReadComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalJudgeGroupSigleComponent = false;
      this.loadModalJudgeAssociateComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalAttWitnessComponent = false;
      this.loadModalConcComponent = true;
      var student = JSON.stringify({"userToken" : this.userData.userToken});    
      console.log(student)
      let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
     
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupConciliate', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson){
            this.list = productsJson;
            console.log(this.list)
          }else{
            this.list = [];
          }
         },
         (error) => {}
       )
    }
  }else if(this.modalType==20){
    $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pword_form",
           "field_id" : "form_id",
           "field_name" : "form_name",
           "field_name2" : "form_add",
           "search_id" : "",
           "search_desc" : "",
           "condition" : " AND form_type = '1' AND dep_use='"+this.userData.depCode+"'",
           "userToken" : this.userData.userToken});
        this.listTable='pword_form';
        this.listFieldId='form_id';
        this.listFieldName='form_name';
        this.listFieldName2='form_add';
        this.listFieldCond="";
  }else if(this.modalType==21){
    $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pword_form",
          "field_id" : "form_id",
          "field_name" : "form_name",
          "field_name2" : "form_add",
          "search_id" : "",
          "search_desc" : "",
           "condition" : " AND form_type = '1'",
           "userToken" : this.userData.userToken});
          this.listTable='pword_form';
          this.listFieldId='form_id';
          this.listFieldName='form_name';
          this.listFieldName2='form_add';
        this.listFieldCond=" AND form_type = '1'";
  }else if(this.modalType==22){
    $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pword_form",
          "field_id" : "form_id",
          "field_name" : "form_name",
          "field_name2" : "form_add",
          "search_id" : "",
          "search_desc" : "",
           "condition" : " AND form_type = '5'",
           "userToken" : this.userData.userToken});
          this.listTable='pword_form';
          this.listFieldId='form_id';
          this.listFieldName='form_name';
          this.listFieldName2='form_add';
        this.listFieldCond=" AND form_type = '5'";
  }else if(this.modalType==100 || this.modalType==101){
    $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = true;
      this.loadModalJudgeComponent = false;
      this.loadModalEnvolopeReadComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalJudgeGroupSigleComponent = false;
      this.loadModalJudgeAssociateComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalAttWitnessComponent = false;
      this.loadModalConcComponent = false;
  }

  if(this.modalType==2 || this.modalType==3 || this.modalType==4 || this.modalType==12 || this.modalType==13 || this.modalType==16 || this.modalType==17 || (this.modalType==19 && this.rawWitdraw.wtype!=4) || this.modalType==20 || this.modalType==21 || this.modalType==22){
    this.loadModalComponent = true;
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalEnvolopeReadComponent = false;
    this.loadModalAppComponent = false;
    this.loadModalJudgeGroupComponent = false;
    this.loadModalJudgeGroupSigleComponent = false;
    this.loadModalJudgeAssociateComponent = false;
    this.loadModalLitComponent = false;
    this.loadModalAttWitnessComponent = false;
    this.loadModalConcComponent = false;
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

tabChangeLitIndex(event:any,index:any,litType:any){
  var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
   if(Number.isInteger(index)==true){
    var student = JSON.stringify({
      "table_name" : "pcase_litigant",
       "field_id" : "lit_running",
       "field_name" : "title",
       "field_name2" : "name",
       "condition" : " AND run_id='"+run_id+"' AND seq='"+event.target.value+"' AND lit_type='"+litType+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.dataWitness[index].rlit_name = productsJson[0].fieldNameValue+productsJson[0].fieldNameValue2;
      }else{
        this.dataWitness[index].rseq = '';
        this.dataWitness[index].rlit_name = '';
      }
      },
      (error) => {}
    )
  }else{
    var student = JSON.stringify({
      "table_name" : "pcase_litigant",
       "field_id" : "lit_running",
       "field_name" : "title",
       "field_name2" : "name",
       "condition" : " AND run_id='"+run_id+"' AND seq='"+event.target.value+"' AND lit_type='"+litType+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.rawWitness.rlit_name = productsJson[0].fieldNameValue+productsJson[0].fieldNameValue2;
      }else{
        this.rawWitness.rseq = '';
        this.rawWitness.rlit_name = '';
      }
      },
      (error) => {}
    )
  }
}
tabChangeInput(name:any,event:any){
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
        this.result.room_desc = productsJson[0].fieldNameValue;
      }else{
        this.result.room_id = '';
        this.result.room_desc = '';
      }
      },
      (error) => {}
    )
  }else if(name=='app_id'){
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
  }else if(name=='judge_aid'){
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
        this.result.judge_aname = productsJson[0].fieldNameValue;
      }else{
        this.result.judge_aid = '';
        this.result.judge_aname = '';
      }
      },
      (error) => {}
    )
  }else if(name=='delay_id'){
    var student = JSON.stringify({
      "table_name" : "pappoint_delay",
       "field_id" : "delay_id",
       "field_name" : "delay_name",
      "condition" : " AND delay_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.result.delay_name = productsJson[0].fieldNameValue;
      }else{
        this.result.delay_id = '';
        this.result.delay_name = '';
      }
      },
      (error) => {}
    )
  }else if(name=='result_id'){
    var student = JSON.stringify({
      "table_name" : "pappoint_result",
       "field_id" : "result_id",
       "field_name" : "result_name",
      "condition" : " AND result_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });    
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      if(productsJson.length){
        this.result.result_name = productsJson[0].fieldNameValue;
      }else{
        this.result.result_id = '';
        this.result.result_name = '';
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
  if(this.dataHead.buttonSearch==1){
    this.setDefPage();
    this.getObjAppData();
    this.result.run_id = this.dataHead.run_id;
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
  this.SpinnerService.show();
  this.result =  $.extend({},this.dataAppointment[index]);
  setTimeout(() => {
    this.SpinnerService.hide();
  }, 500);
}

getObjAppData(){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
  var student = JSON.stringify({
    "run_id" : run_id,
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
                this.rerender();
                this.SpinnerService.hide();
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
              this.dataAppointment = [];
              this.rerender();
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

saveData(){
  if(!this.result.app_running){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('กรุณาเลือกนัด');
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
    //student['run_id'] = this.dataHead.run_id;
    student['userToken'] = this.userData.userToken;
    console.log(student)
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/updateAppoint', student , {headers:headers}).subscribe(
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
                  //this.getObjAppData();
                  this.result.notice_running = getDataOptions.notice_running;
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
  confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
  var dataCancel = $.extend({},this.dataAppointment[index]);
  if(this.dataAppointment[index].cancel_flag){
    confirmBox.setMessage('ต้องการยกเลิกการยกเลิกนัด');
    var message = 'ยกเลิกการยกเลิกนัดเรียบร้อยแล้ว';
    dataCancel.cancel_flag = null;
    dataCancel.cancel_reason = null;
    dataCancel.cancel_date = null;
  }else{
    confirmBox.setMessage('ต้องการยกเลิกนัด');
    var message = 'ยกเลิกนัดเรียบร้อยแล้ว';
    dataCancel.cancel_flag = 1;
    dataCancel.cancel_reason = 'ยกเลิกนัด';
    dataCancel.cancel_date = myExtObject.curDate();
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
        this.dataAppointment[index].cRunning = false;
      }
      subscription.unsubscribe();
    });
}

printReport(type:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
  if(!run_id){
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
      "prun_id" : run_id,
      "ptype_date" : myExtObject.conDate(myExtObject.curDate()),
      "ptype" : type
    });
    console.log(paramData)
    // alert(paramData);return false;
    this.printReportService.printReport(rptName,paramData);
  }
}

saveWitnessData(index:any,type:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
  if(Number.isInteger(this.rowWitIndex)==true){//แก้ไข
    //this.dataWitness[this.rowWitIndex]
    if(!run_id){
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
    }else if(!this.dataWitness[this.rowWitIndex].rseq){
      confirmBox.setMessage('กรุณาเลือกคู่ความ');
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
      var student = [];
        student['data'] = [$.extend({},this.dataWitness[this.rowWitIndex])];
        student['run_id'] = run_id;
        student['app_seq'] = this.result.app_seq;
        student['userToken'] = this.userData.userToken;
        student = $.extend({},student);
        console.log(student)
      this.saveWitnessDataCommit(student);
    }
  }else{//เพิ่มใหม่
    //this.rawWitness
    if(!run_id){
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
    }else if(!this.rawWitness.rseq){
      confirmBox.setMessage('กรุณาเลือกคู่ความ');
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
      var student = [];
        student['data'] = [$.extend({},this.rawWitness)];
        student['run_id'] = run_id;
        student['app_seq'] = this.result.app_seq;
        student['userToken'] = this.userData.userToken;
        student = $.extend({},student);
        console.log(student)
      this.saveWitnessDataCommit(student);
    }
  }
}

saveWitnessDataCommit(objData:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  this.SpinnerService.show();
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type','application/json');
  console.log(objData)
  this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/saveReport', objData , {headers:headers}).subscribe(
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
              this.getWitnessData();
              this.setDefWitness();
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

getWitnessData(){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
  var student = JSON.stringify({
    "run_id" : run_id || this.result.run_id,
    "app_seq" : this.result.app_seq,
    "userToken" : this.userData.userToken
  });
  console.log(student)
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type','application/json');
  this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/getReportData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      console.log(getDataOptions)
      if(getDataOptions.result==1){
          //-----------------------------//
              this.dataWitness = getDataOptions.data;
              var bar = new Promise((resolve, reject) => {this.dataWitness.forEach((x : any ) => x.wRunning = false);});
              if(bar){
                this.rerender();
                this.SpinnerService.hide();
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
              this.dataWitness = [];
              this.rerender();
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

saveWitdrawData(){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
  if(this.rawWitdraw.wtype==1){
    this.rawWitdraw.compens_type =1;
    this.rawWitdraw.witness_type = null;
  }else if(this.rawWitdraw.wtype==2){
    this.rawWitdraw.compens_type =2;
    this.rawWitdraw.witness_type = null;
  }else if(this.rawWitdraw.wtype==3.1){
    this.rawWitdraw.compens_type =3;
    this.rawWitdraw.witness_type = 1;
  }else if(this.rawWitdraw.wtype==3.2){
    this.rawWitdraw.compens_type =3;
    this.rawWitdraw.witness_type = 2;
  }else if(this.rawWitdraw.wtype==4){
    this.rawWitdraw.compens_type =4;
    this.rawWitdraw.witness_type = null;
  }else if(this.rawWitdraw.wtype==5){
    this.rawWitdraw.compens_type =5;
    this.rawWitdraw.witness_type = null;
  }
  if(this.rawWitdraw.comp_running){//แก้ไข
    //this.dataWitness[this.rowWitIndex]
    if(!run_id){
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
    }else if(!this.result.app_seq){
      confirmBox.setMessage('กรุณาเลือกนัด');
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
    }else if(!this.rawWitdraw.comp_name){
      confirmBox.setMessage('กรุณาระบุชื่อ');
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
      var student = [];
        if(!this.rawWitdraw.pay_amt)
          this.rawWitdraw.pay_amt = null;
        if(!this.rawWitdraw.veh_amt)
          this.rawWitdraw.veh_amt = null;
        student['data'] = [$.extend({},this.rawWitdraw)];
        student['run_id'] = run_id;
        student['app_seq'] = this.result.app_seq;
        student['userToken'] = this.userData.userToken;
        student = $.extend({},student);
        console.log(student)
      this.saveWitdrawDataCommit(student);
    }
  }else{//เพิ่มใหม่
    //this.rawWitness
    if(!run_id){
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
    }else if(!this.result.app_seq){
      confirmBox.setMessage('กรุณาเลือกนัด');
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
    }else if(!this.rawWitdraw.comp_name){
      confirmBox.setMessage('กรุณาระบุชื่อ');
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
      var student = [];
        this.rawWitdraw.comp_running = 0;
        if(!this.rawWitdraw.pay_amt)
          this.rawWitdraw.pay_amt = null;
        if(!this.rawWitdraw.veh_amt)
          this.rawWitdraw.veh_amt = null;
        student['data'] = [$.extend({},this.rawWitdraw)];
        student['run_id'] = run_id;
        student['app_seq'] = this.result.app_seq;
        
        student['userToken'] = this.userData.userToken;
        student = $.extend({},student);
        console.log(student)
      this.saveWitdrawDataCommit(student);
    }
  }
}

saveWitdrawDataCommit(objData:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  this.SpinnerService.show();
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type','application/json');
  console.log(objData)
  this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/saveCompens', objData , {headers:headers}).subscribe(
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
              this.getWitdrawData();
              this.setDefWitdraw();
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

getWitdrawData(){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
  var student = JSON.stringify({
    "run_id" : run_id,
    "app_seq" : this.result.app_seq,
    "userToken" : this.userData.userToken
  });
  console.log(student)

  let headers = new HttpHeaders();
  headers = headers.set('Content-Type','application/json');
  this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/getCompensData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      console.log(getDataOptions)
      if(getDataOptions.result==1){
          //-----------------------------//
              this.dataWitdraw = getDataOptions.data;
              var bar = new Promise((resolve, reject) => {this.dataWitdraw.forEach((x : any ) => x.cRunning = false);});
              if(bar){
                this.rerender();
                this.SpinnerService.hide();
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
              this.dataWitdraw = [];
              this.rerender();
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

editWitdraw(index:any){
  console.log(this.dataWitdraw[index])
  this.SpinnerService.show();
  setTimeout(() => {
    var bar = new Promise((resolve, reject) => {
      if(this.dataWitdraw[index].compens_type=='1'){
        this.dataWitdraw[index].wtype=="1";
      }else if(this.dataWitdraw[index].compens_type=='2'){
        this.dataWitdraw[index].wtype ="2";
      }else if(this.dataWitdraw[index].compens_type=='3' && this.dataWitdraw[index].witness_type=='1'){
        this.dataWitdraw[index].wtype ="3.1";
      }else if(this.dataWitdraw[index].compens_type=='3' && this.dataWitdraw[index].witness_type=='2'){
        this.dataWitdraw[index].wtype ="3.2";
      }else if(this.dataWitdraw[index].compens_type=='4'){
        this.dataWitdraw[index].wtype ="4";
      }else if(this.dataWitdraw[index].compens_type=='5'){
        this.dataWitdraw[index].wtype ="5";
      }
    });
    if(bar){
      this.rawWitdraw = $.extend([],this.dataWitdraw[index]);
      this.SpinnerService.hide();
    }
  }, 500);
  
}

printWord(index:any,type:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  if(type==1)
    var fileType = 'app';
  else
    var fileType = 'wit';
  var student = JSON.stringify({
    "report_running" : this.dataWitness[index].report_running,
    "file_type" : fileType,
    "userToken" : this.userData.userToken
  });
  console.log(student)
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type','application/json');
  this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/openReport ', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      console.log(getDataOptions)
      if(getDataOptions.result==1){
          //-----------------------------//
          myExtObject.OpenWindowMax(getDataOptions.file);
          if(type==1)
            this.dataWitness[index].file1 = getDataOptions.file.split('=').pop();
          else
            this.dataWitness[index].file2 = getDataOptions.file.split('=').pop();
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

printAppWord(wType:any,pType:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
  if(!run_id){
    const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
  }else if(!this.result.app_seq){
    const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกนัด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
  }else if((wType==1 && pType==2 && !this.result.form_id) || (wType==2 && pType==2 && !this.result.form_id2)){
    const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกแบบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
  }else{
    if(wType==1)
      var fileType = 'app';
    else
      var fileType = 'wit';
    if(pType==1){
      var form_id = 0;
    }else{
      if(wType==1)
        var form_id = parseInt(this.result.form_id);
      else
        var form_id = parseInt(this.result.form_id2);
    }
    var student = JSON.stringify({
      "app_running" : this.result.app_running,
      "run_id" : this.result.run_id,
      "app_seq" : this.result.app_seq,
      "file_type" : fileType,
      "form_id" : form_id,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/openReport ', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result==1){
            //-----------------------------//
            myExtObject.OpenWindowMax(getDataOptions.file);
            if(wType==1){
              this.result.attach_1 = getDataOptions.file.split('=').pop();
              this.result.form_id = '';
              this.result.form_desc = '';
            }else{
              this.result.attach_2 = getDataOptions.file.split('=').pop();
              this.result.form_id2 = '';
              this.result.form_desc2 = '';
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

  delWord(index:any,type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    //confirmBox.setTitle('ต้องการลบไฟล์ WORD ใช่หรือไม่?');
    confirmBox.setMessage('ยืนยันการลบไฟล์ WORD');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
        //========================================================================================================
        if(type==1)
          var fileType = 'app';
        else
          var fileType = 'wit';
        var student = JSON.stringify({
          "report_running" : this.dataWitness[index].report_running,
          "file_type" : fileType,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/deleteReportFile ', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
                //-----------------------------//
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    if(type==1)
                      this.dataWitness[index].file1 = null;
                    else
                      this.dataWitness[index].file2 = null;
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
        //========================================================================================================
      }
      subscription.unsubscribe();
    });

  }

  delAppWord(type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    //confirmBox.setTitle('ต้องการลบไฟล์ WORD ใช่หรือไม่?');
    confirmBox.setMessage('ยืนยันการลบไฟล์ WORD');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
        //========================================================================================================
        if(type==1)
          var fileType = 'app';
        else
          var fileType = 'wit';
        var student = JSON.stringify({
          "app_running" : this.result.app_running,
          "file_type" : fileType,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/deleteAppReportFile ', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
                //-----------------------------//
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    if(type==1)
                      this.result.attach_1 = null;
                    else
                      this.result.attach_2 = null;
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
        //========================================================================================================
      }
      subscription.unsubscribe();
    });

  }

  changeWtype(){
    if(this.rawWitdraw.wtype==1 || this.rawWitdraw.wtype==2 || this.rawWitdraw.wtype==5){
      if(this.rawWitdraw.wtype==1)
        this.rawWitdraw.tran_lang = '';
      this.result.comp_id = '';
    }else if(this.rawWitdraw.wtype==4 && this.dataHead.conObj.length){
      this.rawWitdraw.comp_id = this.dataHead.conObj[0].conciliate_id;
      this.rawWitdraw.comp_name = this.dataHead.conObj[0].conciliate_name;
    }
  }

  onFileChange(e:any,type:any) {
    if(!this.result.app_seq){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกนัด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      if(e.target.files.length){
        if(type==1){
          this.fileToUpload1 = e.target.files[0];
          $(e.target).parent('div').find('label').html(e.target.files[0].name);
          var formData = new FormData();
          formData.append('app_running', this.result.app_running);
          formData.append('app_seq', this.result.app_seq);
          formData.append('run_id', this.result.run_id);
          formData.append('file_type', 'app');
          formData.append('file', e.target.files[0]);
          formData.append('userToken', this.userData.userToken);
          
          for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
          }
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          this.http.disableHeader().post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/uploadAppReport', formData).subscribe(
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
                    this.result.attach_1 = 1;
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
            (error) => {this.SpinnerService.hide();}
          )
        }else if(type==2){
          this.fileToUpload2 = e.target.files[0];
          $(e.target).parent('div').find('label').html(e.target.files[0].name);
          var formData = new FormData();
          formData.append('app_running', this.result.app_running);
          formData.append('app_seq', this.result.app_seq);
          formData.append('run_id', this.result.run_id);
          formData.append('file_type', 'wit');
          formData.append('file', e.target.files[0]);
          formData.append('userToken', this.userData.userToken);
          
          for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
          }
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          this.http.disableHeader().post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/uploadAppReport', formData).subscribe(
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
                    this.result.attach_2 = 1;
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
            (error) => {this.SpinnerService.hide();}
          )
        }
      }
    }
    
  }

  openNewLink(){
    var run_id = this.result.run_id?this.result.run_id:this.dataHead.run_id;
    if(!this.result.app_seq){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกนัด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      //let winURL = window.location.host;
      //myExtObject.OpenWindowMaxName("http://"+winURL+'/#/prci1800?run_id='+this.dataHead.run_id+'&app_seq='+this.result.app_seq,'prci1800');
      if(run_id){
        if(this.dataHead.red_id)
          myExtObject.OpenWindowMaxName(winURL+'prci1800?run_id='+run_id+"&case_no="+this.dataHead.title+this.dataHead.id+"/"+this.dataHead.yy+"&red_no="+this.dataHead.red_title+this.dataHead.red_id+"/"+this.dataHead.red_yy+'&app_seq='+this.result.app_seq,'prci1800');
        else
          myExtObject.OpenWindowMaxName(winURL+'prci1800?run_id='+run_id+"&case_no="+this.dataHead.title+this.dataHead.id+"/"+this.dataHead.yy+'&app_seq='+this.result.app_seq,'prci1800');
      }else
        myExtObject.OpenWindowMaxName(winURL+'prci1800','prci1800');

    }
  }

  closeWin(){
    var run_id = this.result.run_id?this.result.run_id:run_id;
    if(this.runId)
      window.opener.myExtObject.openerReloadRunId(run_id);
    else
      window.opener.myExtObject.openerReloadRunId(0);
    window.close();
  }


}

