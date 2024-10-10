import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map , } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service'
import {Observable,of, Subject  } from 'rxjs';

@Component({
  selector: 'app-fst2400,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fst2400.component.html',
  styleUrls: ['./fst2400.component.css']
})


export class Fst2400Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  toPage1 = 'fst2400';
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  myExtObject:any;
  modalType:any;
  result:any=[];
  resultProc:any=[];
  data:any=[];
  sendCaseData:any;
  selData:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;

  asyncObservable: Observable<string>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  
  @ViewChild('openbutton3',{static: true}) openbutton3 : ElementRef;
  @ViewChild('closebutton3',{static: true}) closebutton3 : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  // @Output() sendCaseData = new EventEmitter<any>();
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService,
    private renderer: Renderer2,
  ){ }
  
   
  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    // console.log(this.userData);
    this.successHttp();
    this.setDefForm();

    this.selData = [
      {fieldIdValue: '0',fieldNameValue: '----ประจำเดือน----'},
      {fieldIdValue: '1',fieldNameValue: 'มกราคม'},
      {fieldIdValue: '2',fieldNameValue: 'กุมภาพันธ์'},
      {fieldIdValue: '3',fieldNameValue: 'มีนาคม'},
      {fieldIdValue: '4',fieldNameValue: 'เมษายน'},
      {fieldIdValue: '5',fieldNameValue: 'พฤษภาคม'},
      {fieldIdValue: '6',fieldNameValue: 'มิถุนายน'},
      {fieldIdValue: '7',fieldNameValue: 'กรกฎาคม'},
      {fieldIdValue: '8',fieldNameValue: 'สิงหาคม'},
      {fieldIdValue: '9',fieldNameValue: 'กันยายน'},
      {fieldIdValue: '10',fieldNameValue: 'ตุลาคม'},
      {fieldIdValue: '11',fieldNameValue: 'พฤศจิกายน'},
      {fieldIdValue: '12',fieldNameValue: 'ธันวาคม'}
    ];
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fst2400"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          // console.log(getDataAuthen)
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

  setDefForm(){
    this.data.search_data = 0;
    this.data.save_data = 0;
    this.data.process_data = 0;
    this.result.stat_mon = '0';
    this.result.off_id = this.userData.userCode;
    this.result.off_name = this.userData.offName;
    this.result.off_post = this.userData.postName;
    this.result.sign_id = this.userData.directorId;
    this.result.sign_name = this.userData.directorName;
    this.result.sign_post = this.userData.directorPostName;
    this.result.report_judge_id = this.userData.headJudgeId;
    this.result.report_judge_name = this.userData.headJudgeName;
    this.result.report_judge_post = this.userData.headJudgePost;
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

  ngAfterContentInit() : void{
    this.result.cFlag = 1;
    myExtObject.callCalendar();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  searchData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.result.stat_mon || this.result.stat_mon==0) {
      confirmBox.setMessage('กรุณาระบุเดือนสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });
    }else if (!this.result.stat_year) {
      confirmBox.setMessage('กรุณาระบุปีสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });
    } else {
      this.result.search_data = 1;
      this.result.submit_data = null;
      this.result.process_data = null;
      this.sendCaseData={'sendData' : this.result,'counter' : Math.ceil(Math.random()*10000)};
    }
  }

  submitForm(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.result.stat_mon || this.result.stat_mon==0) {
      confirmBox.setMessage('กรุณาระบุเดือนสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });
    }else if (!this.result.stat_year) {
      confirmBox.setMessage('กรุณาระบุปีสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });
    } else {
      this.result.search_data = null;
      this.result.submit_data = 1;
      this.result.process_data = null;
      this.sendCaseData={'sendData' : this.result,'counter' : Math.ceil(Math.random()*10000)};
    }
  }

  processForm(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.result.stat_mon || this.result.stat_mon==0) {
      confirmBox.setMessage('กรุณาระบุเดือนสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });
    }else if (!this.result.stat_year) {
      confirmBox.setMessage('กรุณาระบุปีสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });
    } else {
      this.result.search_data = null;
      this.result.submit_data = null;
      this.result.process_data = 1;
      this.sendCaseData={'sendData' : this.result,'counter' : Math.ceil(Math.random()*10000)};
    }
  }

  clickOpenMyModalComponent(type :any){
    this.modalType=type;
    this.openbutton3.nativeElement.click();

  }

  loadMyModalComponent(){
    if(this.modalType == 1 || this.modalType == 2){
      if(this.modalType == 1 || this.modalType == 2){
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "userToken" : this.userData.userToken
        });
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
      }
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadComponent = true;
          this.loadModalComponent = false;
        },
        (error) => {}
      )
    }else{
      this.loadComponent = false;
      this.loadModalComponent = true;
    }
  }

  receiveFuncListData(event:any){
    if(this.modalType == 1 ){
      this.result.off_id = event.fieldIdValue;
      this.result.off_name = event.fieldNameValue;

      this.getId(event.fieldIdValue,this.modalType);
    }else if(this.modalType == 2 ){
      this.result.sign_id = event.fieldIdValue;
      this.result.sign_name = event.fieldNameValue;

      this.getId(event.fieldIdValue,this.modalType);
    }
    this.closebutton3.nativeElement.click();
  }

  getId(id:any, type:any){
    if(type == 1 || type == 2 ){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "condition" : " AND off_id='"+id+"' ",
        "userToken" : this.userData.userToken
      });
    }else if (type == 3){
      var student = JSON.stringify({
        "table_name" : "pjudge", 
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "field_name2" : "post_id",
        "condition" : " AND judge_id='"+id+"' ",
        "userToken" : this.userData.userToken
      });
    }
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(getDataOptions.length){
          this.getPost(getDataOptions[0].fieldNameValue2,type);
        }
      },
      (error) => {}
    )
  }

  getPost(post_id:any,modalType:any){
    if(post_id){
      var student = JSON.stringify({
        "table_name" : "pposition",
        "field_id" : "post_id",
        "field_name" : "post_name",
        "condition" : " AND post_id='"+post_id+"'",
        "userToken" : this.userData.userToken
      });
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(modalType == 1){
              if(productsJson.length){
                this.result.off_post = productsJson[0].fieldNameValue;
              }else{
                this.result.off_post = '';
              }
            }else if(modalType == 2){
              if(productsJson.length){
                this.result.sign_post = productsJson[0].fieldNameValue+this.userData.courtName;
              }else{
                this.result.sign_post = '';
              }
            }else if(modalType == 3){
              if(productsJson.length){
                this.result.report_judge_post = productsJson[0].fieldNameValue+this.userData.courtName;
              }else{
                this.result.report_judge_post = '';
              }
            }
          },
          (error) => {}
        )
    }else{
      if(modalType == 1)
        this.result.off_post = '';
      else if(modalType == 2)
        this.result.sign_post = '';
      else if(modalType == 3)
        this.result.report_judge_post = '';
    }
  }

  closeModal(){
    this.loadComponent = false;
    this.loadModalComponent = false;
  }

  tabChangeSelect(objId:any,objName:any,objPost:any, event:any){
    if(objId == "off_id" || objId == "sign_id"){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "condition" : " AND off_id='"+event.target.value+"' ",
        "userToken" : this.userData.userToken
      });
    }
    // console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(getDataOptions.length){
          this.result[objId] = getDataOptions[0].fieldIdValue;
          this.result[objName] = getDataOptions[0].fieldNameValue;

          if(objId == "off_id")
            this.getPost(getDataOptions[0].fieldNameValue2,1);
          else if(objId == "sign_id")
            this.getPost(getDataOptions[0].fieldNameValue2,2);
        }else{
          this.result[objId] = "";
          this.result[objName] = "";
        }
      },
      (error) => {}
    )
  }

  printReport(){
    var rptName = 'rst2400';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    var paramData = JSON.stringify({
      "pcourt_running" : this.userData.courtRunning,
      "pstat_mon" : this.result.stat_mon != 0 ? this.result.stat_mon :'',
      "pstat_year" : this.result.stat_year ? this.result.stat_year :'',
      "pcase_type" : 2,
      "poff_name" : this.result.off_name,
      "poff_post" : this.result.off_post,
      "psign_name" : this.result.sign_name,
      "psign_post" : this.result.sign_post,
    });
    
    console.log("paramData->",paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  ClearAll(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    location.replace(winURL+this.toPage1)
    window.location.reload();
  }

  closeWindow(){
    if(window.close() == undefined){
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
    }
    else
      window.close();
  }

  receiveEventData(event:any){
     console.log(event.data)
    var data = event.data
    if(this.result.stat_year){
      this.resultProc.stat_mon = data.stat_mon;
      this.resultProc.stat_year = data.stat_year;
      this.resultProc.create_user = data.create_user;
      this.resultProc.create_date = data.create_date;
      this.resultProc.update_user = data.update_user;
      this.resultProc.update_date = data.update_date;
      this.resultProc.create_dep_name = data.create_dep_name;
      this.resultProc.confirm_user = data.confirm_user;
      this.resultProc.confirm_date = data.confirm_date;
    }else{
      this.resultProc = [];
    }
  }

  confirmData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.resultProc.stat_mon || !this.resultProc.stat_year || !this.resultProc.create_user){
      confirmBox.setMessage('กรุณาประมวลผลและจัดเก็บ ก่อนการยืนยันข้อมูลส่งผู้บริหารตรวจ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      confirmBox.setMessage('ยืนยันข้อมูลส่งผู้บริหารตรวจ');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.SpinnerService.show();
          
          var student = JSON.stringify({
            "case_type": 2,
            "stat_mon" : this.result.stat_mon,
            "stat_year" : this.result.stat_year,
            "userToken" : this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2400/confirmData', student).subscribe(
            (response) => {
              let alertMessage: any = JSON.parse(JSON.stringify(response));
              if (alertMessage.result == 1) {
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.SpinnerService.hide();
                    this.resultProc.confirm_user=alertMessage.confirm_user;
                    this.resultProc.confirm_date=alertMessage.confirm_date;
                  }
                  subscription.unsubscribe();
                });
              }else{
                this.SpinnerService.hide();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                  }
                  subscription.unsubscribe();
                });
              }
            },
            (error) => { this.SpinnerService.hide(); }
          )
        }
        subscription.unsubscribe();
      });
    }
    
  }

  cancelData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.resultProc.stat_mon || !this.resultProc.stat_year || !this.resultProc.create_user){
      confirmBox.setMessage('กรุณาประมวลผลและจัดเก็บ ก่อนการยืนยันข้อมูลส่งผู้บริหารตรวจ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      confirmBox.setMessage('ยืนยันยกเลิกยืนยันข้อมูล');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        subscription.unsubscribe();
        if (resp.success==true){

          this.SpinnerService.show();

          var student = JSON.stringify({
            "case_type": 2,
            "stat_mon" : this.result.stat_mon,
            "stat_year" : this.result.stat_year,
            "userToken" : this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2400/cancelData', student).subscribe(
            (response) => {
              let alertMessage: any = JSON.parse(JSON.stringify(response));
              if (alertMessage.result == 1) {
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.SpinnerService.hide();
                    this.resultProc.confirm_user="";
                    this.resultProc.confirm_date="";
                  }
                  subscription.unsubscribe();
                });
              }else{
                this.SpinnerService.hide();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                  }
                  subscription.unsubscribe();
                });
              }
            },
            (error) => { this.SpinnerService.hide(); }
          )
        }
      });
    }
  }
}