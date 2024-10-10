import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { catchError, map , } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { ModalReceiptComponent } from '../../modal/modal-receipt/modal-receipt.component';
import { PrintReportService } from '@app/services/print-report.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
  CanDeactivate, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
}from '@angular/router'

@Component({
  selector: 'app-fkb0700,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkb0700.component.html',
  styleUrls: ['./fkb0700.component.css']
})


export class Fkb0700Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';

  toPage1:any="fkb0700";
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  dataHead:any = [];
  runId:any;
  alertRunning:any;
  result:any = [];
  modalType:any;
  cancelTypeFlag:any;
  logRemark:any;
  indexDelete:any;
  sLitType:any;

  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;

  getOfficer:any;
  getAlertDep:any;
 
  item:any=[];
  dateTr:any=2;
  getDep:any;

  no_case_flag:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public listFieldSelect:any;
  

  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;//password confirm
  public loadMutipleComponent : boolean = false; 
  
 
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  dataHeadValue: any;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private activatedRoute : ActivatedRoute
  ){ }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['alert_running']){
        this.result.alert_running = params['alert_running'];
        this.assignData();
      }

      if(params['run_id']){
        this.runId = params['run_id'];
        this.dataHead.run_id = params['run_id'];
      }
    });
    this.setDefForm();//--set default
    this.getData();


    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkb0700"
    });
    this.http.disableLoading().post('/'+this.userData.appName+'Api/API/authen', authen).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        this.defaultCaseType = getDataAuthen.defaultCaseType;
        this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
        this.defaultTitle = getDataAuthen.defaultTitle;
        this.defaultRedTitle = getDataAuthen.defaultRedTitle;
      },
      (error) => {}
    )

    //======================== pdepartment หน่วยงานที่บันทึก ======================================
    var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "field_name2" : "print_dep_name",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
        this.getDep.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
    
    this.getOfficerList(this.userData.depCode);
    this.getAlertDep=[{fieldIdValue:"",fieldNameValue: 'เลือกหน่วยงานที่เตือน'},{fieldIdValue:1,fieldNameValue: 'เตือนหน่วยงานนี้'},{fieldIdValue:2,fieldNameValue: 'เตือนหน่วยงานอื่น'}];
    
  }

  getOfficerList(dep_code:any){
    this.result.off_id = "";
    this.result.off_name = "";
    //======================== pofficer ======================================
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "condition" : " AND dep_code="+dep_code,
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOfficer = getDataOptions;
      },
      (error) => {}
    )
  }

  setDefForm(){
    this.runAlertRunning();//run alert_running
    this.result =[];
    // this.runId = "";
    this.result.alert_running = 0;
    this.result.alert_type = 1;//ทั้งหน่วยงาน
    this.result.alert_dep = "";
    this.result.alert_search_case = false;
    this.result.alert_login = false;
    this.result.alert_touch_screen = false;
    this.result.no_case_flag = false;
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
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
    if(obj == "alert_date")
      this.result.alert_time = 9;
  }

  closeModal(){
    this.loadModalComponent = false; //password confirm
    this.loadComponent = false;
    this.loadMutipleComponent = false;//
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  toggleDate(){
    if(this.dateTr== 1)
      this.dateTr = 2;
    else
      this.dateTr = 1;
  }

  checkBoxAlert(obj:any){
    //เตือนตอนค้นหาเลขคดี => alert_search_case
    if(obj == "alert_search_case"){
      this.result.alert_search_case = !this.result.alert_search_case;

      if(this.result.alert_search_case){
        this.result.alert_touch_screen = false;
        this.result.start_date = "";
        this.result.end_date = "";
      }
    }

    //เตือนตอน login  => alert_login
    if(obj == "alert_login"){
      this.result.alert_login = !this.result.alert_login;
      if(this.result.alert_login){
        this.result.alert_touch_screen = false;
        this.result.start_date = "";
        this.result.end_date = "";
      }
    }

    //เตือนที่ Touch Screen   => alert_touch_screen
    if(obj == "alert_touch_screen"){
      this.result.alert_touch_screen = !this.result.alert_touch_screen;

      if(this.result.alert_touch_screen){
        this.result.alert_search_case = false;
        this.result.alert_login = false;

        this.result.alert_type = 1;
        this.result.off_id = "";
        this.result.off_name = "";
        
      }
    }

     //ไม่ระบุเลขคดี => no_case_flag
    if((obj == "no_case_flag")){
      this.result.no_case_flag = !this.result.no_case_flag;
    }
  }

  //assignDefault ทั้งหน่วยงาน 
  assignDefault(){
    if((this.result.alert_type == 2) && (this.result.alert_dep == 1 || this.result.dep_id == this.userData.depCode)){
      this.result.off_id = this.userData.userCode;
      this.result.off_name = this.userData.offName;
    }else{
      this.result.off_id = "";
      this.result.off_name = "";
    }
  }

  assignDep(even:any){
    if(even == 2){
      this.result.dep_id = this.userData.depCode;
      this.result.dep_name = this.userData.depName;
    }else{
      this.result.dep_id = "";
      this.result.dep_name = "";
    }
  }

  tabChangeSelect(objId:any,objName:any,objData:any,event:any,type:any){
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      if(val.length!=0){
        this.result[objId] = val[0].fieldIdValue;
        this.result[objName] = val[0].fieldNameValue;
        if(objId == "dep_id")
          this.getOfficerList(this.result.dep_id);
        if((objId == "off_id") || (objId == "off_name"))
          this.result.alert_type = 2;
      }else{
        this.result[objId] = null;
        this.result[objName] = null;
        if((objId == "off_id") || (objId == "off_name"))
          this.result.alert_type = 1;
      }
    }else{
        this.result[objId] = null;
        this.result[objName] = null;
    }
  }

  clickOpenMyModalComponent(type:any){
    this.modalType=type;
    this.openbutton.nativeElement.click();
  }
  
  loadMyModalComponent(){
    if(this.modalType==1){
      var student = JSON.stringify({
        "table_name" : "pdepartment",
        "field_id" : "dep_code",
        "field_name" : "dep_name",
        "userToken" : this.userData.userToken
      });
      this.listTable='pdepartment';
      this.listFieldId='dep_code';
      this.listFieldName='dep_name';
      this.listFieldName2="";
      this.listFieldCond="";
      this.listFieldSelect=this.result.dep_id;

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;

          this.loadModalComponent = false; //password confirm
          this.loadComponent = false;
          this.loadMutipleComponent = true;
          $("#exampleModal").find(".modal-content").css("width","800px");
        },
        (error) => {}
      )
    }else{
      this.loadModalComponent = true; //password confirm
      this.loadComponent = false;
      this.loadMutipleComponent = false;
      $("#exampleModal").find(".modal-content").css("width","600px");
    } 
 }

 //-----popup 
  receiveFuncListData(event:any){
    this.result.dep_id = event.fieldIdValue;
    this.result.dep_name = event.fieldNameValue;
    this.result.alert_type = 1;
    this.getOfficerList(this.result.dep_id);

    this.closebutton.nativeElement.click();
  }

  curencyFormat(n:any,d:any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  replaceFormat(val:any) {
    if (val !== undefined && val !== null) 
      return val.replace(/ |_/g, '');
  }

  //-----head ข้อมูลเลขคดี
  fnDataHead(event:any){
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
    }
  }

  //save insert update
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    
    if(!this.result.alert_subject){
      confirmBox.setMessage('กรุณาระบุข้อมูลหัวข้อการแจ้งเตือน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if((!this.result.num_day) && (this.result.alert_time != 9)){
      confirmBox.setMessage('กรุณาระบุเงื่อนไขวันที่เตือนไปอีกกี่วัน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.alert_dep){
      confirmBox.setMessage('กรุณาระบุเลือกข้อมูลหน่วยงานที่เตือน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if((this.result.alert_dep) &&((this.result.alert_type == 2)) && (!this.result.dep_id) && (!this.result.off_id)){
      confirmBox.setMessage('กรุณาเลือกข้อมูลหน่วยงานที่เตือน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){

        }
        subscription.unsubscribe();
      });
    }else if(!this.result.alert_time){
      confirmBox.setMessage('กรุณาเลือกเงื่อนไขการเตือน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    // }else if(!this.result.no_case_flag && !this.dataHead.run_id){
    //   confirmBox.setMessage('กรุณาเลือกเลขคดีที่ต้องการให้เตือน');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success==true){
    //     }
    //     subscription.unsubscribe();
    //   });
    }else if(this.result.alert_search_case && !this.dataHead.run_id){
      confirmBox.setMessage('กรุณาเลือกเลขคดีที่ต้องการให้เตือน');
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

      if(this.result.no_case_flag){
        this.dataHead.run_id = "";
      }

      if(this.result.dep_id == null)
        this.result.dep_id = "";

      var student = JSON.stringify({
        "alert_running" : this.result.alert_running,
        "item" : this.result.item,
        "run_id" : this.dataHead.run_id,
        "alert_subject" : this.result.alert_subject,
        "alert_seq" : this.result.alert_seq,
        "alert_time" : this.result.alert_time,
        "alert_date" : this.result.alert_date,
        "num_day" : this.result.num_day,
        "alert_search_case" : this.result.alert_search_case,
        "alert_login" : this.result.alert_login,
        "alert_touch_screen" : this.result.alert_touch_screen,
        "start_date" : this.result.start_date,
        "end_date" : this.result.end_date,
        "no_case_flag" : this.result.no_case_flag,
        "alert_dep" : this.result.alert_dep,
        "dep_list" : this.result.dep_id.toString(),
        "alert_type" : this.result.alert_type,
        "off_id" : this.result.off_id,
        "alert_result" : this.result.alert_result,
        "alert_end" : this.result.alert_end,
        "alert_report" : this.result.alert_report,
        "userToken" : this.userData.userToken
        }); 
        // console.log("student=>", student);

      this.http.disableLoading().post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0700/saveData', student).subscribe(
        (response) =>{
          
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          // console.log("alertMessage=>", alertMessage);
            if(alertMessage.result==0){
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
                  this.result.alert_running = alertMessage.alert_running;
                  this.result.item = alertMessage.alert_running;
                  this.assignData();
                  this.getData();
                }
                subscription.unsubscribe();
              });
            }
        },
        (error) => {
          this.SpinnerService.hide();
        }
      )
    }
  }

  deleteData(index:any){ 
    const confirmBox = new ConfirmBoxInitializer();
    this.indexDelete=index;
    this.modalType="deleteRow";
    this.openbutton.nativeElement.click();
  }

  buttonNew(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    location.replace(winURL+this.toPage1)
    window.location.reload();
  }

  ClearAll(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    location.replace(winURL+this.toPage1)
    window.location.reload();
  }

  editData(index:any){
    this.SpinnerService.show();

    // this.dataHead.run_id  = this.posts[index]['run_id'];
    // if(this.posts[index]['run_id'])
      this.runId = this.posts[index]['run_id'];
    this.result.item  = this.posts[index]['alert_running'];
    this.result.alert_running  = this.posts[index]['alert_running'];
    this.dataHead.run_id  = this.posts[index]['run_id'];
    this.result.alert_subject  = this.posts[index]['alert_subject'];
    this.result.alert_time_desc  = this.posts[index]['alert_time_desc'];
    this.result.alert_seq  = this.posts[index]['alert_seq'];
    this.result.alert_time  = this.posts[index]['alert_time'];
    this.result.alert_date  = this.posts[index]['alert_date'];
    this.result.num_day  = this.posts[index]['num_day'];
    this.result.alert_search_case  = this.posts[index]['alert_search_case'];
    this.result.alert_login  = this.posts[index]['alert_login'];
    this.result.alert_touch_screen  = this.posts[index]['alert_touch_screen'];
    this.result.start_date  = this.posts[index]['start_date'];
    this.result.end_date  = this.posts[index]['end_date'];
    this.result.no_case_flag  = this.posts[index]['no_case_flag'];
    this.result.alert_dep  = this.posts[index]['alert_dep'];
    this.result.dep_id  = this.replaceFormat(this.posts[index]['dep_list']);
    this.result.dep_name  = this.posts[index]['dep_name'];
    this.result.alert_type  = this.posts[index]['alert_type'];
    this.result.off_id  = this.posts[index]['off_id'];
    this.result.off_name  = this.posts[index]['off_name'];
    this.result.alert_end  = this.posts[index]['alert_end'];
    this.result.alert_report  = this.posts[index]['alert_report'];

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  assignData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    // this.SpinnerService.show();

    var student = JSON.stringify({
      "alert_running" : parseInt(this.result.alert_running),
      "userToken" : this.userData.userToken
    });
    // console.log("student=>", student);
  this.http.disableLoading().post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0700', student).subscribe(
    posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));
      
      if(productsJson.result==1){
        
        this.result = productsJson.data[0];
        // if(this.result.run_id)
          this.runId =this.result.run_id;
        this.dataHead.run_id  = this.result.run_id;
        this.result.item  = this.result.alert_running;
        this.result.dep_id  = this.replaceFormat(this.result.dep_list);

      }
      // this.SpinnerService.hide();
      /*else{
        this.SpinnerService.hide();
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
        });
      }*/
    });

    
    // this.SpinnerService.show();
    // let index:any;
    // for(var i = 0; i < this.posts.length; i++){
    //  if(this.posts[i]['alert_running'] == this.alertRunning )
    //     index = i;
    // }

    // if(index >=0){
    //   if(this.posts[index]['run_id'])
    //     this.runId = this.posts[index]['run_id'];
    //   this.result.item  = this.posts[index]['alert_running'];
    //   this.result.alert_running  = this.posts[index]['alert_running'];
    //   this.dataHead.run_id  = this.posts[index]['run_id'];
    //   this.result.alert_subject  = this.posts[index]['alert_subject'];
    //   this.result.alert_time_desc  = this.posts[index]['alert_time_desc'];
    //   this.result.alert_seq  = this.posts[index]['alert_seq'];
    //   this.result.alert_time  = this.posts[index]['alert_time'];
    //   this.result.alert_date  = this.posts[index]['alert_date'];
    //   this.result.num_day  = this.posts[index]['num_day'];
    //   this.result.alert_search_case  = this.posts[index]['alert_search_case'];
    //   this.result.alert_login  = this.posts[index]['alert_login'];
    //   this.result.alert_touch_screen  = this.posts[index]['alert_touch_screen'];
    //   this.result.start_date  = this.posts[index]['start_date'];
    //   this.result.end_date  = this.posts[index]['end_date'];
    //   this.result.no_case_flag  = this.posts[index]['no_case_flag'];
    //   this.result.alert_dep  = this.posts[index]['alert_dep'];
    //   this.result.dep_id  = this.replaceFormat(this.posts[index]['dep_list']);
    //   this.result.dep_name  = this.posts[index]['dep_name'];
    //   this.result.alert_type  = this.posts[index]['alert_type'];
    //   this.result.off_id  = this.posts[index]['off_id'];
    //   this.result.off_name  = this.posts[index]['off_name'];
    //   this.result.alert_end  = this.posts[index]['alert_end'];
    //   this.result.alert_report  = this.posts[index]['alert_report'];
    // }

    // setTimeout(() => {
    //   this.SpinnerService.hide();
    // }, 500);

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
      this.SpinnerService.show();
      var student = JSON.stringify({
        "user_running" : this.userData.userRunning,
        "password" : chkForm.password,
        "log_remark" : chkForm.log_remark,
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          if(productsJson.result==1){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

            // Choose layout color type
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                if(this.indexDelete >= 0){
                  var dataDel = [],dataTmp=[];
                  var bar = new Promise((resolve, reject) => {
                      dataTmp.push(this.posts[this.indexDelete]);
                  });
                  if(bar){
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data']= dataTmp;
                    var data = $.extend({}, dataDel);
                      // console.log("dataDel", data);
                    this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0700/deleteData', data).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();
                      }else{
                        this.modalType="";
                        this.closebutton.nativeElement.click();

                        this.ngOnInit();
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

  getData(){
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    // this.SpinnerService.show();

    var student = JSON.stringify({
      "userLevel" : this.userData.userLevel,//
      "depCode" : this.userData.depCode,//
      "userToken" : this.userData.userToken
    });
    // console.log("student=>", student);
  this.http.disableLoading().post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0700', student).subscribe(
    posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));
      this.posts = productsJson.data;
      // console.log("productsJson=>", productsJson.data);
      if(productsJson.result==1){

        var bar = new Promise((resolve, reject) => {
          productsJson.data.forEach((ele, index, array) => {
                if(ele.alert_time == 1){
                  productsJson.data[index]['alert_time_desc'] = ele.alert_time_desc + ele.alert_date1 + ele.num_day1;
                }else if(ele.alert_time == 9){
                  productsJson.data[index]['alert_time_desc'] = ele.alert_time_desc + ele.active_alert_date;
                }else{
                  productsJson.data[index]['alert_time_desc'] = ele.alert_time_desc + ele.num_day1;
                }
            });
        });
        //parameter
        // if(this.alertRunning){
        //   this.assignData();
        // }
        this.checklist = this.posts;
        this.rerender();
      }/*else{
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
        });
      }*/
      // this.SpinnerService.hide();
    });
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
  

  runAlertRunning(){
    // console.log(this.alertRunning);
    if(!this.result.alert_running){
      var student = JSON.stringify({
        "userToken" : this.userData.userToken
      });

      this.http.disableLoading().post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0700/runAlertRunning', student).subscribe(posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        if(productsJson.result==1){
          this.result.item=productsJson.alert_running;
          // this.result.alert_running=productsJson.alert_running;
        }
      });
    }
  }

  searchData(){
    var student = JSON.stringify({
      "dep_code" : this.result.dep_code,
      "start_create_date" : this.result.start_create_date,
      "end_create_date" : this.result.end_create_date,
      "userLevel" : this.userData.userLevel,
      "depCode" : this.userData.depCode,
      "userToken" : this.userData.userToken
    });
    // console.log("searchData student=>", student);
    this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0700/search', student).subscribe(posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));
      // console.log("getData=>",productsJson)
      this.posts = productsJson.data;

      if(productsJson.result==1){
        var bar = new Promise((resolve, reject) => {
          productsJson.data.forEach((ele, index, array) => {
                if(ele.alert_time == 1){
                  productsJson.data[index]['alert_time_desc'] = ele.alert_time_desc + ele.alert_date1 + ele.num_day1;
                }else if(ele.alert_time == 9){
                  productsJson.data[index]['alert_time_desc'] = ele.alert_time_desc + ele.active_alert_date;
                }else{
                  productsJson.data[index]['alert_time_desc'] = ele.alert_time_desc + ele.num_day1;
                }
            });
        });
        this.checklist = this.posts;
        this.rerender();
      }
    });
  }
}

