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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fkn0710,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0710.component.html',
  styleUrls: ['./fkn0710.component.css']
})


export class Fkn0710Component implements AfterViewInit, OnInit, OnDestroy {

  title:any;

  posts:any;
  std_id:any;
  std_prov_name:any;
  delList:any=[];
  search:any;
  masterSelected:boolean;
  masterSelected2:boolean;
  checklist:any;
  checklist2:any;
  checkedList:any;
  delValue:any;
  delValue2:any;
  sessData:any;
  userData:any;
  myExtObject:any;
  programName:string;
  dep_code:any;
  dep_name:any;

  //---
  result:any = [];
  s_file:any = [];
  del_file:any = [];
  attach_file:any = [];
  fileToUpload0: File = null;
  fileToUpload1: File = null;
  fileToUpload2: File = null;
  fileToUpload3: File = null;
  fileToUpload4: File = null;
  modalType:any;
  getDep:any;
  getOff:any;
  getJudge:any;
  getValue:any;
  toPage1:any="fkn0720";//
  toPage2:any="fkn0730";//
  mail_no:any;
  action:any;
  



  getRcvFlag:any;
  getDataType:any;
  getPgroupId:any;
  getFineType:any;
  
  edit_sub_type_id:any;
  edit_receipt_type_id:any;
  //--
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public listFieldSelect:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
 
  @ViewChild('fkn0710',{static: true}) fkn0710 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadMutipleComponent: boolean = false;
  public loadJudgeMutipleComponent: boolean = false;
  

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute
  ){
    this.masterSelected = false
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
        this.mail_no = params['mail_id'];
        this.action = params['action'];
    });
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    
    this.result.to = 6;
    this.result.need_know = 1;

    if(this.mail_no && this.action){
      this.getMailMessage();
    }

      
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fkn0710"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          // console.log(getDataAuthen)
        },
        (error) => {}
      )

    //===========================================================
    var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "field_name2" : "print_dep_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
        this.getDep.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )

    //===========================================================
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOff = getDataOptions;
        this.getOff.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )

    //=============================================================
    var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getJudge = getDataOptions;
        this.getJudge.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
  }

  getMailMessage(){
    //getMailMessage
    var student = JSON.stringify({
      "mail_id" : this.mail_no,
      "action" : this.action,
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0710/getMailMessage', student ).subscribe(posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));
      // console.log("productsJson", productsJson)
      if(productsJson.result==1){
        this.result = productsJson.data[0];
        this.result.to = 6;
        this.result.need_know = 1;
      }else
        this.result=[];
    });

  // getAttachFile
    var student = JSON.stringify({
      "mail_no" : this.mail_no,
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0710/getAttachFile', student ).subscribe(posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));
      this.attach_file = productsJson.data;
    });

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  clickOpenFile(index:any){

    var name = this.attach_file[index].attach_file;
    let winURL = window.location.host;

    if(this.attach_file[index].pdf_flag)
      winURL = winURL+'/'+this.userData.appName+"ApiKN/API/KEEPN/fkn0730/openPdf";
    else
      winURL = winURL+'/'+this.userData.appName+"ApiKN/API/KEEPN/fkn0730/openAttach";
    myExtObject.OpenWindowMax("http://"+winURL+'?mail_no='+this.result.mail_no+"&file_name="+name);
  }

  curencyFormat(n:any,d:any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
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

  setFocus(name:any) {
    name.focus();
  }

  ClearAll(){
    window.location.reload();
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  tabChangeSelect(objId:any,objName:any, event:any){
    
    var val:any="";
    if(this.result.to == 2)
      val = this.getDep.filter((x:any) => x.fieldIdValue === event.target.value) ;
    else if(this.result.to == 5)
      val = this.getJudge.filter((x:any) => x.fieldIdValue === event.target.value) ;
    else if(this.result.to == 6)
      val = this.getOff.filter((x:any) => x.fieldIdValue === event.target.value) ;

    if(val.length!=0){
      this.result[objId] = val[0].fieldIdValue;
      this.result[objName] = val[0].fieldNameValue;

    }else{
        this.result[objId] = null;
        this.result[objName] = null;
    }
  }

  assignDefault(even:any){
    this.result.to_id = "";
    this.result.to_name = "";
  }

  counter(i: number) {
    return new Array(i);
  }

  onFileChange(even:any,Name:any, index:any) {
    this[Name] =null;

    if(even.target.files.length){
      this[Name] = even.target.files[0];
      var fileName = even.target.files[0].name;
      $(even.target).parent('div').find('label').html(fileName);
    }else{
      this[Name] =  null;
      $(even.target).parent('div').find('label').html('');
    }
  }

  //popup multiple
  clickOpenMyModalComponent(type:any){
    this.modalType = 1;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    
    if(this.modalType==1){
      if(this.result.to == 1 || this.result.to == 3 || this.result.to == 4  || this.result.to == 6){
         //เจ้าหน้าที่
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "userToken" : this.userData.userToken
        });
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';

        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
            this.list = response;
  
            this.loadModalComponent = false; //password confirm
            this.loadComponent = false;
            this.loadMutipleComponent = true;
            this.loadJudgeMutipleComponent = false;
            $("#exampleModal").find(".modal-content").css("width","800px");
          },
          (error) => {}
        )
      }else  if(this.result.to == 2){
        // กลุ่มงาน
        var student = JSON.stringify({
          "table_name" : "pdepartment",
          "field_id" : "dep_code",
          "field_name" : "dep_name",
          "userToken" : this.userData.userToken
        });
        this.listTable='pdepartment';
        this.listFieldId='dep_code';
        this.listFieldName='dep_name';

        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
            this.list = response;
  
            this.loadModalComponent = false; //password confirm
            this.loadComponent = false;
            this.loadMutipleComponent = true;
            this.loadJudgeMutipleComponent = false;
            $("#exampleModal").find(".modal-content").css("width","800px");
          },
          (error) => {}
        )

      }else if(this.result.to == 5){
        //ผู้พิพากษา
        var student = JSON.stringify({
          "cond":2,
          "userToken" : this.userData.userToken
        });
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldType=JSON.stringify({"type":2});
        this.listFieldSelect=this.result.to_id;

        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
          (response) =>{
            let productsJson :any = JSON.parse(JSON.stringify(response));
            if(productsJson.data.length){
              this.list=productsJson.data;
              console.log(this.list)
            }else{
               this.list = [];
            }
            this.loadModalComponent = false; //password confirm
            this.loadComponent = false;
            this.loadMutipleComponent = false;
            this.loadJudgeMutipleComponent = true;
            $("#exampleModal").find(".modal-content").css("width","800px");
          },
          (error) => {}
        )
      }
    }else{
      this.loadModalComponent = true; //password confirm
      this.loadComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeMutipleComponent = false;
      $("#exampleModal").find(".modal-content").css("width","600px");
    } 
  }

  receiveFuncListData(event:any){
    this.result.to_id = event.fieldIdValue;
    this.result.to_name = event.fieldNameValue;
    this.closebutton.nativeElement.click();
  }

  receiveFuncJudgeListData(event:any){
    this.result.to_id = event.judge_id;
    this.result.to_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  // save update Data
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.to_id &&(this.result.to ==2 || this.result.to ==5 || this.result.to == 6)){
      confirmBox.setMessage('กรุณาระบุถึง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else  if(!this.result.to_name && (this.result.to ==2 || this.result.to ==5 || this.result.to == 6)){
      confirmBox.setMessage('กรุณาระบุถึง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else  if(!this.result.subject ){
      confirmBox.setMessage('กรุณาระบุเรื่อง');
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
        "mail_id" : this.result.mail_no,
        "action" : this.action,
        "mail_from" : this.userData.userRunning,
        "need_know" : this.result.need_know,
        "subject" : this.result.subject,
        "message" : this.result.message,
        "mail_to" : this.result.to,
        "to_id" : this.result.to_id.toString(),
        "userToken" : this.userData.userToken
      });

      var formData = new FormData();
      if(this.fileToUpload0 != null)
        formData.append('attach_0', this.fileToUpload0);
      if(this.fileToUpload0 != null)
        formData.append('attach_1', this.fileToUpload1);
      if(this.fileToUpload0 != null)
        formData.append('attach_2', this.fileToUpload2);
      if(this.fileToUpload0 != null)
        formData.append('attach_3', this.fileToUpload3);
      if(this.fileToUpload0 != null)
        formData.append('attach_4', this.fileToUpload4);

      for(var i=0;i<5;i++){
        console.log(this.attach_file[i]);
        if(this.del_file[i])
          this.attach_file[i]=null;
        if(typeof this.attach_file[i] == 'undefined')
          this.attach_file[i] = null;
        if(this.attach_file[i] != null)
          formData.append('org_attach_'+i, this.attach_file[i].attach_file);
      }

      formData.append('userToken', this.userData.userToken);
      formData.append('data', student);
      // console.log("formData=>", formData.get('data'));
      this.http.disableHeader().post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0710/sendMail', formData ).subscribe(
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
              if (resp.success==true){
                // this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          }else{
            this.SpinnerService.hide();
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
            this.buttonMailAll();//go to fkn0720
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  submitModalForm(){
  }

  closeModal(){
    this.loadModalComponent = false; //password confirm
    this.loadComponent = false;
    this.loadMutipleComponent = false;
    this.loadJudgeMutipleComponent = false;

    $('.modal')
    .find("input[type='text'],input[type='password'],textarea,select")
    .val('')
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();
  }

  buttonMailAll(){
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage1;
      window.location.href =winURL;
  }
}