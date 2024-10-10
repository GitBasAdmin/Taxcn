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
import { PrintReportService } from '@app/services/print-report.service';
import { NgSelectComponent } from '@ng-select/ng-select';
declare var myExtObject: any;
import {
  CanDeactivateFn, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
  NavigationError,Routes
}from '@angular/router'

@Component({
  selector: 'app-fju0800,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fju0800.component.html',
  styleUrls: ['./fju0800.component.css']
})


export class Fju0800Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';

  posts:any = [];
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  dataHead:any = [];
  result:any = [];
  checkObj:any = [];
  paybackObj:any = [];
  modalType:any;
  cancelTypeFlag:any;
  logRemark:any;
  indexDelete:any;
  myExtObject: any;
  sLitType:any;
  runId:any;
  run_id:any;
  case_court_type:any;
  add:any;
  disableBtn:any;

  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;


  getAttorneyType:any;
  getTypeId:any;
  getPermitFlag:any;
  getReceiveType:any;
  getBankId:any;
  getBankId2:any;

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

  public loadModalComponent: boolean = false;
  public loadComponent : boolean = false; 
  public loadPopupAttachJudgeComponent : boolean = false;
  public loadModalJudgeComponent : boolean = false;
  public loadModalJudgeGroupComponent : boolean = false;
  public loadModalJudgeGroupSigleComponent : boolean = false;
  
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
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    console.log(this.userData);

    this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id']){
        this.runId = params['run_id'];
      }
    });

    this.successHttp();
    this.setDefForm();
    this.getData();
  }

  successHttp() {
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fju0800"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen).toPromise().then(
          res => { // Success
          //this.results = res.json().results;
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
    this.result=[];
    this.result.judge_item = 0;
    this.result.print_date = myExtObject.curDate();
  }

   //-----head ข้อมูลเลขคดี
   fnDataHead(event:any){
    console.log(event.case_court_type, event);
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      this.run_id = event.run_id;
      this.case_court_type = event.case_court_type;
      this.ngOnInit();
    }
  }

  getData(){
    if(this.run_id){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      this.SpinnerService.show();

      var student = JSON.stringify({
        "run_id" : this.run_id,
        "userToken" : this.userData.userToken
      });
      // console.log("student=>", student);
      this.http.disableLoading().post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0800/getData', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log("getData=>",productsJson)
          
          console.log("getData=>",this.result)

          if(productsJson.result==1){
            if(productsJson.data.length > 0){
              this.result = productsJson.data[0];
              if(!productsJson.data[0].indict_desc)
                this.result.indict_desc=this.dataHead.indict_desc;
              else
                this.result.edit_pinalty_desc=productsJson.data[0].indict_desc;
                
              if(!productsJson.data[0].pinalty_desc)
                this.result.pinalty_desc=this.dataHead.pinalty_desc;
              else
                this.result.edit_pinalty_desc=productsJson.data[0].pinalty_desc;

              if(productsJson.data[0].judge_desc) 
                this.result.edit_pinalty_desc=productsJson.data[0].judge_desc;

              if(!productsJson.data[0].print_date) 
                this.result.print_date = myExtObject.curDate();


              if(this.userData.userLevel != "A"){
                if(this.userData.userFlag == "o" && (this.userData.depCode != this.result.create_dep_code) && !this.result.read_flag)
                  this.disableBtn=true;
              }else{
                this.disableBtn=false;
              }
             
              // if(productsJson.data[0].judge_item){
              //   const confirmBox1 = new ConfirmBoxInitializer();
              //   confirmBox1.setTitle('ข้อความแจ้งเตือน');
              //   confirmBox1.setMessage('คุณไม่มีสิทธิ์เข้าถึงร่างคำพิพากษาของคดีนี้เนื่องจากข้อมูลคำพิพากษาถูกบันทึกโดย'+productsJson.data[0].create_user+'แล้ว');
              //   confirmBox1.setButtonLabels('ตกลง');
              //   confirmBox1.setConfig({
              //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              //   });
              //   const subscription = confirmBox1.openConfirmBox$().subscribe(resp => {
              //     if (resp.success==true){
              //       this.goToPage();
              //     }
              //     subscription.unsubscribe();
              //   });
              // }
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
          this.SpinnerService.hide();
      });
    }
  }

  goToPage(){
  var toPage2="fju0800";
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+toPage2;
    window.location.href =winURL;
  }

  tabChangeSelect(objName:any, event:any){
    if(objName == 'judge_name' || objName == 'judge_gname1' || objName == 'judge_gname2'){
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "condition": " AND judge_id="+event.target.value,
        "userToken" : this.userData.userToken
      }); 
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result[objName] = productsJson[0].fieldNameValue;
          }else{
            this.result[objName] = "";
          }
        },
        (error) => {}
      )
    }else if(objName == 'assign_user_name' ){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result[objName] = productsJson[0].fieldNameValue;
          }else{
            this.result[objName] = "";
          }
        },
        (error) => {}
      )
    }else if(objName == 'form_name' ){
      var student = JSON.stringify({
        "table_name": "pword_form",
        "field_id": "form_running",
        "field_name": "CASE WHEN form_add IS NOT NULL THEN CONCAT(form_name || \'(\' || form_add || \')\', '') ELSE form_name END AS fieldNameValue",
        "condition": " AND form_type=14 AND form_running='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      }); 
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result[objName] = productsJson[0].fieldNameValue;
          }else{
            this.result[objName] = "";
          }
        },
        (error) => {}
      )
    }else if(objName == 'add_form_name' ){
      var student = JSON.stringify({
        "table_name": "pword_form",
        "field_id": "form_running",
        "field_name": "form_name",
        "condition": " AND form_type=14 AND form_running='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      }); 
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result[objName] = productsJson[0].fieldNameValue;
          }else{
            this.result[objName] = "";
          }
        },
        (error) => {}
      )
    }
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

  closeModal(){
    this.loadModalComponent = false; 
    this.loadComponent = false;
    this.loadPopupAttachJudgeComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalJudgeGroupComponent = false;
    this.loadModalJudgeGroupSigleComponent = false;
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  clickOpenMyModalComponent(type:any){
    this.modalType=type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){

    if(this.modalType==1){
      var student = JSON.stringify({
        "table_name": "pjudge_brand_accept",
        "field_id": "jbrand_id",
        "field_name": "subject_name",
        "field_name2": "indict_desc",
        "condition": " AND judge_id IS null AND court_type_id='"+this.case_court_type+"'",
        "userToken" : this.userData.userToken
      }); 

      this.listTable='pjudge_brand_accept';
      this.listFieldId='jbrand_id';
      this.listFieldName="subject_name";
      this.listFieldName2="indict_desc";
      this.listFieldCond=" AND judge_id IS null AND court_type_id='"+this.case_court_type+"'";

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(

        (response) =>{
          console.log(response)
          this.list = response;
          this.loadModalComponent = false; 
          this.loadComponent = true;
          this.loadPopupAttachJudgeComponent = false;
          this.loadModalJudgeComponent = false;
          this.loadModalJudgeGroupComponent = false;

          $("#exampleModal").find(".modal-content").css("width","800px");
        },
        (error) => {}
      )
    }else if(this.modalType==2){
      var student = JSON.stringify({
        "table_name": "pjudge_brand_accept",
        "field_id": "jbrand_id",
        "field_name": "jbrand_name",
        "condition": " AND judge_id="+this.result.judge_id,
        "userToken" : this.userData.userToken
      }); 

      this.listTable='pjudge_brand_accept';
      this.listFieldId='jbrand_id';
      this.listFieldName="jbrand_name";
      this.listFieldName2 = '',
      this.listFieldCond=" AND judge_id="+this.result.judge_id;

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(

        (response) =>{
          this.list = response;
          this.loadModalComponent = false; 
          this.loadComponent = true;
          this.loadPopupAttachJudgeComponent = false;
          this.loadModalJudgeComponent = false;
          this.loadModalJudgeGroupComponent = false;
          this.loadModalJudgeGroupSigleComponent = false;


          $("#exampleModal").find(".modal-content").css("width","800px");
        },
        (error) => {}
      )
    }else if(this.modalType==3){
      var student = JSON.stringify({
        "table_name": "pjudge_brand_accept",
        "field_id": "jbrand_id",
        "field_name": "jbrand_name",
        "condition": " AND judge_id IS null",
        "userToken" : this.userData.userToken
      }); 

      this.listTable='pjudge_brand_accept';
      this.listFieldId='jbrand_id';
      this.listFieldName="jbrand_name";
      this.listFieldName2 = '',
      this.listFieldCond="AND judge_id IS null ";

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(

        (response) =>{
          this.list = response;
          this.loadModalComponent = false; 
          this.loadComponent = true;
          this.loadPopupAttachJudgeComponent = false;
          this.loadModalJudgeComponent = false;
          this.loadModalJudgeGroupComponent = false;
          this.loadModalJudgeGroupSigleComponent = false;
          $("#exampleModal").find(".modal-content").css("width","800px");
        },
        (error) => {}
      )
    }else if(this.modalType==6 || this.modalType==9 || this.modalType==10){
      if(this.modalType==6 ){
        var student = JSON.stringify({
          "table_name": "pofficer",
          "field_id": "off_id",
          "field_name": "off_name",
          "userToken" : this.userData.userToken
        }); 
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName="off_name";
        this.listFieldName2 = '',
        this.listFieldCond="";
      }else if(this.modalType==9){
        var student = JSON.stringify({
          "table_name": "pword_form",
          "field_id": "form_running",
          "field_name": "CASE WHEN form_add IS NOT NULL THEN CONCAT(form_name || \'(\' || form_add || \')\', '') ELSE form_name END AS fieldNameValue",
          "condition": " AND form_type=14",
          "userToken" : this.userData.userToken
        }); 
        this.listTable='pword_form';
        this.listFieldId='form_running';
        this.listFieldName="CASE WHEN form_add IS NOT NULL THEN CONCAT(form_name || \'(\' || form_add || \')\', '') ELSE form_name END AS fieldNameValue";
        this.listFieldName2 = '',
        this.listFieldCond="AND form_type=14";
      }else if(this.modalType==10){
        var student = JSON.stringify({
          "table_name": "pword_form",
          "field_id": "form_running",
          "field_name": "form_name",
          "condition": " AND form_type=14",
          "userToken" : this.userData.userToken
        }); 
        this.listTable='pword_form';
        this.listFieldId='form_running';
        this.listFieldName="form_name";
        this.listFieldName2 = '',
        this.listFieldCond="AND form_type=14";
      }
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
        (response) =>{
          this.list = response;

          this.loadModalComponent = false; 
          this.loadComponent = true;
          this.loadPopupAttachJudgeComponent = false;
          this.loadModalJudgeComponent = false;
          this.loadModalJudgeGroupComponent = false;
          this.loadModalJudgeGroupSigleComponent = false;
          // $("#exampleModal").find(".modal-body").css("height","auto");
        },
        (error) => {}
      )
    }else if(this.modalType==4){

      this.loadModalComponent = false; 
      this.loadComponent = false;
      this.loadPopupAttachJudgeComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = true;
      this.loadModalJudgeGroupSigleComponent = false;
      $("#exampleModal").find(".modal-content").css("width","700px");

    }else if(this.modalType==5){

      var student = JSON.stringify({
        "cond":2,
        "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldName2 = '',
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

      this.loadModalComponent = false; 
      this.loadComponent = false;
      this.loadPopupAttachJudgeComponent = false;
      this.loadModalJudgeComponent = true;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalJudgeGroupSigleComponent = false;
      $("#exampleModal").find(".modal-content").css("width","700px");
    }else if(this.modalType==7 || this.modalType==8){
      this.loadModalComponent = false; 
      this.loadComponent = false;
      this.loadPopupAttachJudgeComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalJudgeGroupSigleComponent = true;
      $("#exampleModal").find(".modal-content").css("width","800px");
    }else if(this.modalType==11 || this.modalType==12){//แนบไฟล์
      this.loadModalComponent = false; 
      this.loadComponent = false;
      this.loadPopupAttachJudgeComponent = true;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalJudgeGroupSigleComponent = false;
      
      $("#exampleModal").find(".modal-body").css("height","auto");
    }else if(this.modalType == 'deleteRow'){
      this.loadModalComponent = true; 
      this.loadComponent = false;
      this.loadPopupAttachJudgeComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalJudgeGroupSigleComponent = false;
      $("#exampleModal").find(".modal-content").css("width","600px");
    }
 }

 popupAttachJudge(type:any){
  console.log(type)
  this.loadModalComponent = false; 
  this.loadComponent = false;
  this.loadPopupAttachJudgeComponent = true;
  this.loadModalJudgeComponent = false;
  this.loadModalJudgeGroupComponent = false;
  this.loadModalJudgeGroupSigleComponent = false;
  this.add = type;
  $("#exampleModal").find(".modal-body").css("height","auto");
}

 receiveFuncListData(event:any){
   console.log('receiveFuncListData',event);
   if(this.modalType==1){
    // this.result.indict_desc = event.fieldNameValue;
    this.result.jbrand_id_hide = event.fieldIdValue;
    this.result.jbrand_name_hide = event.fieldNameValue;
    this.getJbrandAll();
   }else if(this.modalType==6){
    this.result.assign_user_id = event.fieldIdValue;
    this.result.assign_user_name = event.fieldNameValue;
    this.submitForm();//
  }else if(this.modalType==2 || this.modalType==3){
    this.result.jbrand_id = event.fieldIdValue;
    this.result.jbrand_name = event.fieldNameValue;
  }else if(this.modalType==9){
    this.result.form_running = event.fieldIdValue;
    this.result.form_name = event.fieldNameValue;
    this.submitForm();//
  }else if(this.modalType==10){
    this.result.add_form_running = event.fieldIdValue;
    this.result.add_form_name = event.fieldNameValue;
    this.submitForm();//
  }
  this.closebutton.nativeElement.click();
 }

 receiveJudgeListData(event:any){
  console.log('receiveJudgeListData',event);
  this.result.judge_id = event.judge_id;
  this.result.judge_name = event.judge_name;
  this.closebutton.nativeElement.click();
  this.submitForm();//
 }

 receiveJudgeGroupListData(event:any){
  console.log('receiveJudgeGroupListData',event);
  this.result.judge_id = event.judge_id1;
  this.result.judge_name = event.judge_name1;

  this.result.judge_gid1 = event.judge_id2;
  this.result.judge_gname1 = event.judge_name2;

  this.closebutton.nativeElement.click();
  this.submitForm();//
 }

 receiveJudgeGroupSigleListData(event:any){
   if(this.modalType == 7){
    this.result.judge_gid1 = event.judge_id;
    this.result.judge_gname1 = event.judge_name;
   }else if(this.modalType == 8){
    this.result.judge_gid2 = event.judge_id;
    this.result.judge_gname2 = event.judge_name;
   }

  this.closebutton.nativeElement.click();
  this.submitForm();//
 }

 getJbrandAll(){
  var student = JSON.stringify({
    "table_name": "pjudge_brand_accept",
    "field_id": "indict_desc",
    "field_name": "jbrand_desc",
    "field_name2": "pinalty_desc",
    "condition": " AND court_type_id='"+this.case_court_type+"' AND jbrand_id='"+this.result.jbrand_id_hide+"'",
    "userToken" : this.userData.userToken
  }); 
  this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
    (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      console.log(productsJson);
      
      
        // var indict_desc = this.result.indict_desc.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
        // var judge_desc = this.result.judge_desc.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
        // var pinalty_desc = this.result.pinalty_desc.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');

      if(productsJson.length){
        console.log(productsJson[0].fieldIdValue, productsJson[0].fieldNameValue,productsJson[0].fieldNameValue2);
        
        if(!this.result.edit_indict_desc){
          this.result.indict_desc = productsJson[0].fieldIdValue;
        }
        if(!this.result.edit_judge_desc){
          this.result.judge_desc = "พิพากษาว่า "+ productsJson[0].fieldNameValue;
        }
        if(!this.result.edit_pinalty_desc){
          this.result.pinalty_desc = productsJson[0].fieldNameValue2;
        }
      }
    },
    (error) => {}
  )
 }

 importJudgeDesc(){
    this.result.judge_desc = "ดีงคำพิพากษา<br>มาจาก<br>คำพิพากษาย่อ";
 }

 printAttachJudge(add_id:any){
  let winURL = window.location.host;
  winURL = winURL+'/'+this.userData.appName+"ApiJU/API/JUDGEMENT/fju0800/openAttach";
  myExtObject.OpenWindowMax("http://"+winURL+'?run_id='+this.run_id+"&add_id="+add_id);
 }

 receiveAttachJudgeFile(event:any){
  console.log(event);
  if(this.modalType==11)//แนบไฟล์
    this.add=0;
  else if(this.modalType==12)
    this.add=1;

  var fileToUpload = event;
  this.closebutton.nativeElement.click();

  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');

  if(this.run_id && event){
    var student = JSON.stringify({
      "run_id" : this.run_id,
      "userToken" : this.userData.userToken
    });

    var formData = new FormData();
    if(this.add == 0){
      formData.append('attach', fileToUpload);
      formData.append('attach_add', null);
    }else if(this.add == 1){
      formData.append('attach', null);
      formData.append('attach_add', fileToUpload);
    }
    formData.append('data', student);
    // console.log("formData=>", formData);

    this.http.disableHeader().post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0800/attachJudge', formData ).subscribe(
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
              }
              subscription.unsubscribe();
            });
            this.ngOnInit();
          }
      },
      (error) => {this.SpinnerService.hide();}
    )
  }else{
    confirmBox.setMessage('กรุณาระบุข้อมูลคดีก่อนบันทึก');
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
 }

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    
    if(!this.run_id){
      confirmBox.setMessage('กรุณาระบุข้อมูลคดีก่อนบันทึก');
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
      
      this.result['run_id'] = this.run_id;
      this.result['userToken'] = this.userData.userToken;
      var student = $.extend({},this.result);
      
      console.log("student=>",student);

      this.http.disableLoading().post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0800/saveData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(getDataOptions.result==0){
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
          }else{
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
              this.getData();
            });
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }this.SpinnerService.hide();//ลบ
  }

  buttonDelete(){ 
    const confirmBox = new ConfirmBoxInitializer();
    // this.indexDelete=index;
    this.modalType="deleteRow";
    this.openbutton.nativeElement.click();
  }

  ClearAll(){
    window.location.reload();
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
        if (resp.success==true){ }
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
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          if(productsJson.result==1){
            const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ต้องการลบข้อมูลคำพิพากษารับสารภาพ?');
              confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
              confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
              // Choose layout color type
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                var data = this.result;
                data["userToken"] = this.userData.userToken;
                console.log(data);
                this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0800/deleteData', data).subscribe(
                (response) =>{
                  let alertMessage : any = JSON.parse(JSON.stringify(response));
                  if(alertMessage.result==0){
                    this.SpinnerService.hide();
                  }else{
                    this.closebutton.nativeElement.click();
                    this.modalType="";
                    this.indexDelete="";
                    this.ngOnInit();
                  }
                },
                  (error) => {this.SpinnerService.hide();}
                )
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

  delAttachJudge(add:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(add==0)
      confirmBox.setMessage('ต้องการลบไฟล์คำพิพากษา');
    else
      confirmBox.setMessage('ต้องการลบคำให้การ');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      // Choose layout color type
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        
        if (resp.success==true){

          var student = JSON.stringify({
          "run_id" : this.run_id,
          "add_id" : add,
          "userToken" : this.userData.userToken
          });
          // console.log("delete word student=>", student);  
          this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0800/deleteFile', student).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              // console.log("delete word alertMessage=>", alertMessage)
              if(alertMessage.result==0){
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
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
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                  }
                  this.getData();
                  subscription.unsubscribe();
                });
              }
            },
            (error) => {this.SpinnerService.hide();}
            )
          }
          subscription.unsubscribe();
      });
  }

  buttonCancle(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    location.replace(winURL+'fju0800')
    window.location.reload();
  }
}