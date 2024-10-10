import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2,Input,Output,EventEmitter,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
declare var myExtObject: any;
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import { PopupStatComponent } from '@app/components/modal/popup-stat/popup-stat.component';
import { NgbModal, NgbModalRef   } from '@ng-bootstrap/ng-bootstrap';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fst2410,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fst2410.component.html',
  styleUrls: ['./fst2410.component.css']
})


export class Fst2410Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';
  toPage1 = 'fst2410';
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
  selData:any;
  numColumn:any;
  modalType:any;
  result:any=[];
  caseTypeStat:any;
  data:any=[];
  selMonth:any;
  sGroup:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;



  private globalFlag = -1;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal
  ){
    this.masterSelected = false
  }

  ngOnInit(): void {

    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

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
      "url_name" : "fst2410"
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
          this.getCaseType();
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
    this.posts=[];this.result=[];this.data=[];
    this.result.stat_mon = '0';
    this.result.stat_date = myExtObject.curDate();
    this.result.off_id = this.userData.userCode;
    this.result.off_name = this.userData.offName;
    this.result.off_post = this.userData.postName;
    this.result.sign_id = this.userData.directorId;
    this.result.sign_name = this.userData.directorName;
    this.result.sign_post = this.userData.directorPostName;
    this.result.report_judge_id = this.userData.headJudgeId;
    this.result.report_judge_name = this.userData.headJudgeName;
    this.result.report_judge_post = this.userData.headJudgePost;

    // this.result.case_type_stat = 2;
    this.result.stat_year = myExtObject.curYear();
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

  getCaseType(){
    var student = JSON.stringify({
      "table_name" : "pcase_type_stat",
      "field_id" : "case_type_stat",
      "field_name" : "case_type_stat_desc",
      "condition" : "AND case_type='2'",
      "userToken" : this.userData.userToken
    });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.caseTypeStat = getDataOptions;
          if(getDataOptions.length > 0){
            this.result.case_type_stat = getDataOptions[0].fieldIdValue;
          }else{
            this.result.case_type_stat = '';
          }
        },
        (error) => {}
      )
  }

  ngAfterContentInit() : void{
    myExtObject.callCalendar();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  clickOpenMyModalComponent(type :any){
    this.modalType=type;
    this.openbutton.nativeElement.click();
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
    this.closebutton.nativeElement.click();
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

  assignValue(num:any){
    if((num == undefined) || (num == "") || (num == null))
      return 0;
    else
      return parseInt(num);
  }

  getData () {
    var student = JSON.stringify({
      "case_type" : 2,
      "case_type_stat" : this.result.case_type_stat,
      "stat_mon" : this.result.stat_mon,
      "stat_year" : this.result.stat_year,
      "userToken" : this.userData.userToken
    });
    console.log(student)

    this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2410/getStatData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.data.length > 0){

          this.posts=getDataOptions;
        }else{
          this.posts =[];
        }
      },
      (error) => {}
    )
  }

  buttProcess(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.stat_mon){
      confirmBox.setMessage('กรุณาเลือกเดือนสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.stat_year){
      confirmBox.setMessage('กรุณาเลือกปีสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else{

      this.SpinnerService.show();
      var student = JSON.stringify({
        "case_type" : 2,
        "case_type_stat" : this.result.case_type_stat,
        "stat_mon" : this.result.stat_mon,
        "stat_year" : this.result.stat_year,
        "userToken" : this.userData.userToken
        });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiST/API/STAT/fst2410/getStatData', student ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
            this.posts=[];
            if(alertMessage.result==1){
                this.posts=alertMessage;
                console.log(this.posts.data);
                this.SpinnerService.hide();
            }else{
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
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
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }


  searchData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.stat_mon){
      confirmBox.setMessage('กรุณาเลือกเดือนสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.stat_year){
      confirmBox.setMessage('กรุณาเลือกปีสถิติ');
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

      var student = JSON.stringify({
        "case_type" : 2,
        "case_type_stat" : this.result.case_type_stat,
        "stat_mon" : this.result.stat_mon,
        "stat_year" : this.result.stat_year,
        "userToken" : this.userData.userToken
        });

      this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2410', student ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          console.log(alertMessage);
              this.posts=[];
              if(alertMessage.result==1){
                this.posts=alertMessage;
                console.log(this.posts.data);
              }
              this.SpinnerService.hide();

        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  saveForm(){
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

      this.SpinnerService.show();

      var dataTmp = [];
      dataTmp['data'] = this.posts.data;
      dataTmp['case_type'] = 2;
      dataTmp['case_type_stat'] = this.result.case_type_stat;
      dataTmp['stat_mon'] = this.result.stat_mon;
      dataTmp['stat_year'] = this.result.stat_year;
      dataTmp['userToken'] = this.userData.userToken;
      var data = $.extend({}, dataTmp);
      this.http.disableLoading().post('/'+this.userData.appName+'ApiST/API/STAT/fst2410/saveData', data ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==0){
              this.SpinnerService.hide();
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
              this.SpinnerService.hide();
              confirmBox.setMessage('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
              });
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  curencyFormat(n:any,d:any) {
		return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	}
  curencyFormatChange(n:any,d:any) {
    var number = n.target.value;
		return parseFloat(number).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	}

  submitModalForm(){
  }

  printReport(){
    var rptName = 'rst2410';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "pcase_type" :'2',
      "pcase_type_stat" : this.result.case_type_stat.toString(),
      "pstat_mon" : this.result.stat_mon ? this.result.stat_mon.length == 1 ? '0'+this.result.stat_mon.toString() : this.result.stat_mon.toString() : '',
      "pstat_year" : this.result.stat_year ? this.result.stat_year.toString() : '',
      "poff_name" : this.result.off_name,
      "poff_post" : this.result.off_post,
      "psign_name" : this.result.sign_name,
      "psign_post" : this.result.sign_post

    });
    console.log("paramData->",paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  ClearAll(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    location.replace(winURL+this.toPage1)
    window.location.reload();
  }


  ev(flag:any){
    if(flag != this.globalFlag){
      this.dtTrigger.next(null);
      this.globalFlag = flag;
    }
  }


  showCaseAll(item:any){
    if(item){
      const modalRef: NgbModalRef = this.ngbModal.open(PopupStatComponent,{ windowClass: 'my-class'})
      modalRef.componentInstance.items = item
    }
  }

  confirmData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.posts.case_type_stat || !this.posts.stat_mon || !this.posts.stat_year || !this.posts.create_user){
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
            "case_type" : 2,
            "case_type_stat" : this.posts.case_type_stat,            
            "stat_mon" : this.posts.stat_mon,
            "stat_year" : this.posts.stat_year,
            "userToken" : this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2410/confirmData', student).subscribe(
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
                    this.posts.confirm_user=alertMessage.confirm_user;
                    this.posts.confirm_date=alertMessage.confirm_date;
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

    if(!this.posts.case_type_stat || !this.posts.stat_mon || !this.posts.stat_year || !this.posts.create_user){
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
            "case_type" : 2,
            "case_type_stat" : this.posts.case_type_stat,            
            "stat_mon" : this.posts.stat_mon,
            "stat_year" : this.posts.stat_year,
            "userToken" : this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2410/cancelData', student).subscribe(
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
                    this.posts.confirm_user="";
                    this.posts.confirm_date="";
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
