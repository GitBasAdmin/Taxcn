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
  selector: 'app-fkn0730,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0730.component.html',
  styleUrls: ['./fkn0730.component.css']
})


export class Fkn0730Component implements AfterViewInit, OnInit, OnDestroy {

  attachment:any;
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
  mail_no:any;
  result:any = [];
  s_file:any = [];
  fileToUpload1: File = null;
  fileToUpload2: File = null;
  fileToUpload3: File = null;
  fileToUpload4: File = null;
  fileToUpload5: File = null;
  toPage1:any="fkn0710";
  toPage2:any="fkn0720";
  

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
 
  @ViewChild('fkn0730',{static: true}) fkn0730 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('receipt_type_id',{static: true}) receipt_type_id : ElementRef;
  @ViewChild('sub_type_id',{static: true}) sub_type_id : ElementRef;
  @ViewChild('sub_type_name',{static: true}) sub_type_name : ElementRef;

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
    });

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.getData();//mail_opened = "Y"
    //==============authen==============
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkn0730"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => {}
    )
  }
  
  getData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(this.mail_no){
      this.SpinnerService.show();

      var student = JSON.stringify({
        "mail_no" : this.mail_no,
        "userToken" : this.userData.userToken
      });
      // console.log("student=>", student);
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0730', student ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          // console.log("productsJson", productsJson)
            if(productsJson.result==0){
              this.SpinnerService.hide();
              confirmBox.setMessage(productsJson.error);
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
              if(productsJson.result==1){
                this.result = productsJson.data[0];
                // console.log("result", this.result)
                // if(productsJson.data[0]['message']){
                  var message="";
                  if(productsJson.data[0]['message'])
                    message = productsJson.data[0]['message'].replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
                  this.result.message = message;
                  this.getDataAttachment();
                // }
              }
              this.SpinnerService.hide();
            }
        },
        (error) => {}
      )
    }
  }

  getDataAttachment(){
    if(this.mail_no){
      var student = JSON.stringify({
        "mail_no" : this.mail_no,
        "userToken" : this.userData.userToken
      });
      // console.log("student=>", student);
      this.http.disableLoading().post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0730/getDataAttachment', student ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          this.attachment = productsJson.data;
          // console.log(this.attachment);
          if(productsJson.result==1){
          }
        },
        (error) => {}
      )
    }
  }

  clickOpenFile(index:any){
    // console.log( this.attachment[index]);
    var name = this.attachment[index].attach_file;
    let winURL = window.location.host;

    if(this.attachment[index].pdf_flag)
      winURL = winURL+'/'+this.userData.appName+"ApiKN/API/KEEPN/fkn0730/openPdf";
    else
      winURL = winURL+'/'+this.userData.appName+"ApiKN/API/KEEPN/fkn0730/openAttach";
    myExtObject.OpenWindowMax("http://"+winURL+'?mail_no='+this.result.mail_no+"&file_name="+name);
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

  onFileChange(even:any,Name:any, index:any) {

    this[Name] =null;

    if(even.target.files.length){
      this[Name] = even.target.files[0];
      var fileName = even.target.files[0].name;
      $(even.target).parent('div').find('label').html(fileName);
    }else{
      this.fileToUpload1 =  null;
      $(even.target).parent('div').find('label').html('');
    }
  }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }

  receiveFuncListData(event:any){
    this.closebutton.nativeElement.click();
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
      this.http.disableLoading().post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
      posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          // console.log(productsJson)
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
                subscription.unsubscribe();
                this.result.userToken = this.userData.userToken;
                var data = ($.extend({}, this.result));
                
                // console.log("data=>",data);
                this.http.disableLoading().post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0730/deleteData', data).subscribe(
                (response) =>{
                  let alertMessage : any = JSON.parse(JSON.stringify(response));
                  // console.log("delete=>",alertMessage.result)
                  if(alertMessage.result==0){
                    this.SpinnerService.hide();
                  }else{
                    this.closebutton.nativeElement.click();
                    const confirmBox = new ConfirmBoxInitializer();
                    confirmBox.setTitle('ข้อความแจ้งเตือน');
                    confirmBox.setMessage(alertMessage.error);
                    confirmBox.setButtonLabels('ตกลง');
                    confirmBox.setConfig({
                        layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){}
                      subscription.unsubscribe();
                      this.goToPage();
                    });
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

  closeModal(){
    this.loadModalComponent = false; //password confirm
    this.loadComponent = false;
    this.loadMutipleComponent = false;
    this.loadJudgeMutipleComponent = false;
  }

  mailDelete(){
    this.openbutton.nativeElement.click();
  }

  mailReply(){//fkn0710
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage1+"?mail_id="+this.mail_no+"&action=reply";
    window.location.href =winURL;
  }

  mailForward(){//fkn0710
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage1+"?mail_id="+this.mail_no+"&action=forward";
    window.location.href =winURL;
  }

  goToPage(){//fkn0720
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage2+"?mail_id="+this.mail_no;
    window.location.href =winURL;

  }
}