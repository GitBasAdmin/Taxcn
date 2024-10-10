import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map , } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';

@Component({
  selector: 'app-fst2420,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fst2420.component.html',
  styleUrls: ['./fst2420.component.css']
})


export class Fst2420Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';
  toPage1 = 'fst2420';
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
 
  getCaseType:any;
  data:any=[];
  cType:any;cTypeHead:any;
  case_new2:any=[];
  sum_case_new2=[];

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
  
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadJudgeComponent: boolean = false;
  
  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2
  ){
    this.masterSelected = false
    // this.masterSelected2 = false
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
   //======================== pcase_type ======================================
   var student = JSON.stringify({
    "table_name" : "pcase_type",
    "field_id" : "case_type",
    "field_name" : "case_type_desc",
    // "condition" : "AND case_type=2 ",
    "order_by": " case_type ASC",
    "userToken" : this.userData.userToken
  });
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getCaseType = getDataOptions;
      this.result.case_type = this.getCaseType.filter((x:any) => x.fieldIdValue === this.userData.defaultCaseType)[0].fieldIdValue;
      this.caseTypeStat();
    },
    (error) => {}
  )
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
      "url_name" : "fst2420"
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
    this.result=[];this.data=[];this.sum_case_new2=[];this.posts=[];
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
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
  }

  caseTypeStat(){
    var student = JSON.stringify({
      "table_name" : "pcase_type_stat",
      "field_id" : "case_type_stat",
      "field_name" : "case_type_stat_desc",
      "order_by": " case_type_stat ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.cType = JSON.parse(JSON.stringify(response));
        this.cTypeHead = getDataOptions;
        this.cTypeHead.unshift({fieldIdValue:1,fieldNameValue: 'เขต/อำเภอ'});
        this.cTypeHead.unshift({fieldIdValue:0,fieldNameValue: 'จังหวัด'});
        
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

  clickOpenMyModalComponent(type:any){
    this.modalType=type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    // console.log("loadMyModalComponent", this.modalType);
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
      // console.log(this.modalType, student);
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
    // console.log(event);
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
    this.result.judge_id = event.judge_id;
    this.result.judge_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  getPost(post_id:any,modalType:any){
    // console.log('getPost', post_id);
    if(post_id){
      var student = JSON.stringify({
        "table_name" : "pposition",
        "field_id" : "post_id",
        "field_name" : "post_name",
        "condition" : " AND post_id='"+post_id+"'",
        "userToken" : this.userData.userToken
      });
        // console.log(student)
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
    // console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        // console.log(getDataOptions)
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

  assignValue(num:any){
    if((num == undefined) || (num == "") || (num == null))
      return 0;
    else
      return parseInt(num);
  }

  changeData(event:any,i:any,j:any){
    // console.log(i, j);
    this.sum_case_new2[j] = 0;
    for (let index = 0; index < this.posts.data.length; index++) {
      this.sum_case_new2[j] +=  this.assignValue(this.posts.data[index].stat_data[j].case_new2); 
    }
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
        "stat_mon" : this.result.stat_mon,
        "stat_year" : this.result.stat_year,
        "userToken" : this.userData.userToken
        });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiST/API/STAT/fst2420/getStatData', student ).subscribe(
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
              this.sum_case_new2 =[];
              this.posts=alertMessage;
              this.data=alertMessage.data;

              for (let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < this.data[i].stat_data.length; j++) {
                  this.sum_case_new2[j] = this.assignValue(this.sum_case_new2[j]) + this.assignValue(this.data[i].stat_data[j].case_new2); 
                }
              }
              this.SpinnerService.hide();
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  submitForm(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    // console.log(this.posts);
    this.posts['userToken'] = this.userData.userToken;
    var data =  this.posts;
    this.http.disableLoading().post('/'+this.userData.appName+'ApiST/API/STAT/fst2420/saveData', data ).subscribe(
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
                this.result.stat_mon = alertMessage.stat_mon;
                this.result.stat_year = alertMessage.stat_year;
              }
              subscription.unsubscribe();
            });
          }
      },
      (error) => {this.SpinnerService.hide();}
    )
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
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      var student = JSON.stringify({
        "stat_mon" : parseInt(this.result.stat_mon),
        "stat_year" : parseInt(this.result.stat_year),
        "userToken" : this.userData.userToken
        });
      this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2420', student ).subscribe(
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
              this.sum_case_new2 =[];
              this.posts=alertMessage;
              this.data=alertMessage.data;

              for (let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < this.data[i].stat_data.length; j++) {
                  this.sum_case_new2[j] = this.assignValue(this.sum_case_new2[j]) + this.assignValue(this.data[i].stat_data[j].case_new2); 
                }
              }
              this.SpinnerService.hide();
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

  confirmBox() {
    var isChecked = this.posts.every(function(item:any) {
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
  }

  printReport(type:any){
    var rptName = 'rst2420';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "pcourt_running" : this.userData.courtRunning,
      "ptype" : type,
      "pcase_type" : '',
      "pstat_mon" : parseInt(this.result.stat_mon),
      "pstat_year" : parseInt(this.result.stat_year),
      "pcourt_type_id" : parseInt(this.userData.courtTypeId),
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

  confirmData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.posts.stat_mon || !this.posts.stat_year || !this.posts.create_user){
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
            "stat_mon" : this.posts.stat_mon,
            "stat_year" : this.posts.stat_year,
            "userToken" : this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2420/confirmData', student).subscribe(
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

    if(!this.posts.stat_mon || !this.posts.stat_year || !this.posts.create_user){
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
            "stat_mon" : this.posts.stat_mon,
            "stat_year" : this.posts.stat_year,
            "userToken" : this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2420/cancelData', student).subscribe(
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
