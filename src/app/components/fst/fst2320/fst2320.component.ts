import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy, Injectable, Renderer2, Input, Output, EventEmitter, ViewEncapsulation  } from '@angular/core';
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
  selector: 'app-fst2320,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fst2320.component.html',
  styleUrls: ['./fst2320.component.css']
})


export class Fst2320Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  toPage1 = 'fst2320';
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
  result2:any=[];
  data:any=[];
  resultOld:any=[];
  NewData:boolean;
  getCaseType:any;
  cTypeData:any;
  cType:any;
  case_new:any=[];
  judge_order:any=[];
  finish_agree:any=[];
  judge_cancel:any=[];
  judge_dispense:any=[];
  judge_dispense_other:any=[];
  judge_other:any=[];
  judge_total:any=[];

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  asyncObservable: Observable<string>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadJudgeComponent: boolean = false;

  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService,
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
    console.log(this.userData)

    this.successHttp();
    this.setDefForm();

    //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "condition" : "AND case_type=2 ",
      "order_by": " case_type ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        console.log( this.getCaseType,this.userData.defaultCaseType)
        this.result.case_type = this.getCaseType.filter((x:any) => x.fieldIdValue === this.userData.defaultCaseType).fieldIdValue;
        this.caseTypeStat();
      },
      (error) => {}
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fst2320"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
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

  setDefForm(){
    this.posts = [];
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
    this.NewData = false;
    this.getLastData();
  }

  caseTypeStat(){
    var student = JSON.stringify({
      "table_name" : "pcase_type_stat",
      "field_id" : "case_type_stat",
      "field_name" : "case_type_stat_desc",
      "condition" : "AND case_type='"+this.result.case_type+"'",
      "order_by": " case_type_stat ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.cType = getDataOptions;
        console.log(this.cType);
      },
      (error) => {}
    )
  }

  getLastData(){
    this.SpinnerService.show();
    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiST/API/STAT/fst2320/getLastData', student).subscribe(
      (response) => {
        let alertMessage: any = JSON.parse(JSON.stringify(response));
        if (alertMessage.result == 1) {
          var data = alertMessage;
          this.resultOld.create_date=data.create_date;
          this.resultOld.stat_date=data.stat_date;

          this.resultOld.old_data=alertMessage.old_data;
        }else{
          this.resultOld = [];
        }
      },
      (error) => { this.SpinnerService.hide(); }
    )
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}

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

  clickOpenMyModalComponent(type:any){
    this.modalType=type;
    this.openbutton.nativeElement.click();

  }

  loadMyModalComponent(){
    console.log("loadMyModalComponent", this.modalType);
    if(this.modalType == 1 || this.modalType == 2 || this.modalType == 3){
      if(this.modalType == 1 || this.modalType == 2){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "userToken" : this.userData.userToken
      });
      this.listTable='pofficer';
      this.listFieldId='off_id';
      this.listFieldName='off_name';
      this.listFieldName2='';
      this.listFieldCond="";
      }else if(this.modalType == 3){
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "field_name2" : "post_id",
          "userToken" : this.userData.userToken
        });
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldName2='';
        this.listFieldCond="";
      }
      console.log(this.modalType, student);
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;

          this.loadComponent = true;
          this.loadModalComponent = false;
          this.loadJudgeComponent = false;
        },
        (error) => {}
      )

    } if(this.modalType == 4){
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldName2 = "position";
      this.listFieldType = JSON.stringify({ "type": 2 });

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
          } else {
            this.list = [];
          }
          this.loadComponent = false;
          this.loadModalComponent = false;
          this.loadJudgeComponent = true;
        },
        (error) => { }
      )
    }else{
      this.loadComponent = false;
      this.loadModalComponent = true;
      this.loadJudgeComponent = false;
    }
  }

  receiveFuncListData(event:any){
    console.log(event);
    if(this.modalType == 1 ){
      this.result.off_id = event.fieldIdValue;
      this.result.off_name = event.fieldNameValue;
      this.getPost(event.fieldNameValue2,this.modalType);
    }else if(this.modalType == 2 ){
      this.result.sign_id = event.fieldIdValue;
      this.result.sign_name = event.fieldNameValue;
      this.getPost(event.fieldNameValue2,this.modalType);
    }else if (this.modalType == 3){
      this.result.report_judge_id = event.fieldIdValue;
      this.result.report_judge_name = event.fieldNameValue;
      this.getPost(event.fieldNameValue2,this.modalType);
    }
    this.closebutton.nativeElement.click();
  }

  receiveFuncJudgeListData(event: any) {
    this.result2.judge_id = event.judge_id;
    this.result2.judge_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  getPost(post_id:any,modalType:any){
    console.log('getPost', post_id);
    if(post_id){
      var student = JSON.stringify({
        "table_name" : "pposition",
        "field_id" : "post_id",
        "field_name" : "post_name",
        "condition" : " AND post_id='"+post_id+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
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
    this.loadJudgeComponent = false;
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
    }else if(objId == "report_judge_id" || objId == "judge_id"){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "field_name2" : "post_id",
        "condition" : " AND judge_id='"+event.target.value+"' ",
        "userToken" : this.userData.userToken
      });
    }
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.length){
          this.result[objId] = getDataOptions[0].fieldIdValue;
          this.result[objName] = getDataOptions[0].fieldNameValue;

          if(objId == "off_id")
            this.getPost(getDataOptions[0].fieldNameValue2,1);
          else if(objId == "sign_id")
            this.getPost(getDataOptions[0].fieldNameValue2,2);
          else if(objId == "report_judge_id")
            this.getPost(getDataOptions[0].fieldNameValue2,3);
        }else{
          this.result[objId] = "";
          this.result[objName] = "";
        }
      },
      (error) => {}
    )
  }

  tabChangeSelect2(objId:any,objName:any,objPost:any, event:any){
    if(objId == "judge_id"){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "field_name2" : "post_id",
        "condition" : " AND judge_id='"+event.target.value+"' ",
        "userToken" : this.userData.userToken
      });
    }
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.length){
          this.result2[objId] = getDataOptions[0].fieldIdValue;
          this.result2[objName] = getDataOptions[0].fieldNameValue;
        }else{
          this.result2[objId] = "";
          this.result2[objName] = "";
        }
      },
      (error) => {}
    )
  }

  changeData(event:any,i:any,j:any){

    this.posts.data[i].stat_data[j].judge_total = this.assignValue(this.posts.data[i].stat_data[j].judge_order) + this.assignValue(this.posts.data[i].stat_data[j].finish_agree) +
    this.assignValue(this.posts.data[i].stat_data[j].judge_cancel) + this.assignValue(this.posts.data[i].stat_data[j].judge_dispense) +
    this.assignValue(this.posts.data[i].stat_data[j].judge_other)+  this.assignValue(this.posts.data[i].stat_data[j].judge_dispense_other);
  }

  changeDataNew(i:any){

    this.judge_total[i] = this.assignValue(this.judge_order[i]) + this.assignValue(this.finish_agree[i]) +
    this.assignValue(this.judge_cancel[i]) + this.assignValue(this.judge_dispense[i]) +
    this.assignValue(this.judge_other[i])+this.assignValue(this.judge_dispense_other[i]);
  }

  assingData(productsJson :any){
    this.posts = productsJson;
    this.data = productsJson.data;

    this.judge_total =[];
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].stat_data.length; j++) {
        this.posts.data[i].stat_data[j].judge_total = this.assignValue(this.data[i].stat_data[j].judge_order) + this.assignValue(this.data[i].stat_data[j].finish_agree) +
        this.assignValue(this.data[i].stat_data[j].judge_cancel) + this.assignValue(this.data[i].stat_data[j].judge_dispense) +
        this.assignValue(this.data[i].stat_data[j].judge_other)+ this.assignValue(this.data[i].stat_data[j].judge_dispense_other);
      }
    }


    if(productsJson.data.length)
        this.posts.data.forEach((x : any ) => x.edit2320 = false);
    console.log(this.posts);
    this.checklist = this.posts.data;

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  searchData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.stat_date){
      confirmBox.setMessage('กรุณาเลือกวันที่สถิติ');
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
        "case_type" : this.result.case_type,
        "stat_date" : this.result.stat_date,
        "userToken" : this.userData.userToken
        });
      this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2320', student ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==1){
              this.assingData(alertMessage);
              // this.SpinnerService.hide() ปิดที่ assingData
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  buttProcess(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.stat_date){
      confirmBox.setMessage('กรุณาเลือกวันที่สถิติ');
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
        "case_type" : this.result.case_type,
        "stat_date" : this.result.stat_date,
        "userToken" : this.userData.userToken
        });
      this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2320/getStatData', student ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==1){
              this.assingData(alertMessage);
              // this.SpinnerService.hide() ปิดที่ assingData
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

  buttNew(){
    this.NewData = true;
  }

  saveForm(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.stat_date){
      confirmBox.setMessage('กรุณาเลือกวันที่สถิติ');
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
      if(this.result2.judge_id){
        var tmp=[];

        for (let i = 0; i < this.cType.length; i++) {
          tmp[i]={
            "case_type_stat" : this.cType[i].fieldIdValue,
            "case_type_stat_desc" : this.cType[i].fieldNameValue,
            "case_new" : this.case_new[i] ? this.case_new[i] : null,
            "judge_order" : this.judge_order[i] ? this.judge_order[i] : null,
            "finish_agree" : this.finish_agree[i] ? this.finish_agree[i] : null,
            "judge_cancel" : this.judge_cancel[i] ? this.judge_cancel[i] : null,
            "judge_dispense" : this.judge_dispense[i] ? this.judge_dispense[i] : null,
            "judge_dispense_other" : this.judge_dispense_other[i] ? this.judge_dispense_other[i] : null,
            "judge_other" : this.judge_other[i] ? this.judge_other[i] : null
          };
        }

        var student = {
          "judge_id" : this.result2.judge_id,
          "judge_name" : this.result2.judge_name,
          "stat_data" : tmp
        };
        this.posts.data.push(student);
        this.NewData = false;
      }

      var dataTmp = [];
      dataTmp['data'] = this.posts.data;
      dataTmp['stat_date'] = this.result.stat_date;
      dataTmp['case_type']=  this.result.case_type;
      dataTmp['userToken'] = this.userData.userToken;
      var data = $.extend({}, dataTmp);
      this.http.disableLoading().post('/'+this.userData.appName+'ApiST/API/STAT/fst2320/saveData', data ).subscribe(
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
                if (resp.success==true){

                  this.searchData();
                }
                subscription.unsubscribe();
              });
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  assignValue(num:any){
    if((num == undefined) || (num == "") || (num == null))
      return 0;
    else
      return parseInt(num);
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit2320 == true;
    })
  }

  confirmBox() {
    var isChecked = this.posts.data.every(function(item:any) {
      return item.edit2320 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if(isChecked==true){
      confirmBox.setTitle('ไม่พบเงื่อนไข?');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการลบ');
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

  submitModalForm(){
    console.log(this.posts.data);
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
        if (resp.success==true){}
        subscription.unsubscribe();
      });

    }else if(!chkForm.log_remark){
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
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
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  if (resp.success==true){
                    var dataDel = this.posts,dataTmp=[];
                    var bar = new Promise((resolve, reject) => {
                    this.posts.data.forEach((ele, index, array) => {
                      console.log(ele.edit2320);
                        if(ele.edit2320 == true){
                          dataTmp.push(this.posts.data[index]);
                        }
                      });
                    });
                    if(bar){
                      delete dataDel.error;
                      delete dataDel.result;
                      dataDel['userToken'] = this.userData.userToken;
                      dataDel['data'] = dataTmp;
                      var data = $.extend({}, dataDel);
                     console.log(JSON.stringify(data));
                     this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2320/deleteData', data ).subscribe(
                      (response) =>{
                        this.closebutton.nativeElement.click();
                        let alertMessage : any = JSON.parse(JSON.stringify(response));
                        if(alertMessage.result==0){
                          this.SpinnerService.hide();
                        }else{
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              this.searchData();
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

  printReport(){
    var rptName = 'rst2320';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "pcourt_running" : this.userData.courtRunning,
      "pstat_date" : this.result.stat_date ? myExtObject.conDate(this.result.stat_date) : '',
      "pcase_type" : this.result.case_type.toString(),
      "poff_name" : this.result.off_name,
      "poff_post" : this.result.off_post,
      "psign_name" : this.result.sign_name,
      "psign_post" : this.result.sign_post,
      "preport_judge_name" : this.result.report_judge_name,
      "preport_judge_post" : this.result.report_judge_post,
      "pprint_remark" : this.result.pprint_remark,
      "pprint_remark2" : this.result.pprint_remark2,

    });
    console.log("paramData->",paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  ClearAll(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    location.replace(winURL+this.toPage1)
    window.location.reload();
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

    if(!this.posts.case_type || !this.posts.stat_date || !this.posts.create_user){
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
            "case_type" : this.posts.case_type,
            "stat_date" : this.posts.stat_date,
            "userToken" : this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2320/confirmData', student).subscribe(
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

    if(!this.posts.case_type || !this.posts.stat_date || !this.posts.create_user){
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
            "case_type" : this.posts.case_type,
            "stat_date" : this.posts.stat_date,
            "userToken" : this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2320/cancelData', student).subscribe(
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
