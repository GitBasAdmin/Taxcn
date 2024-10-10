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
// import { viewClassName } from '@angular/compiler';

@Component({
  selector: 'app-fct9910,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct9910.component.html',
  styleUrls: ['./fct9910.component.css']
})


export class Fct9910Component implements AfterViewInit, OnInit, OnDestroy {

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

  Datalist:any;
  defaultCaseType:any;


  result:any = [];
  edit_pass:any;
  edit_flag:any;
  typeOldPwd:boolean=false;
  typePwd:boolean=false;
  typeRePwd:boolean=false;
  typeReceiptPassword:boolean=false;
  typeReReceiptPassword:boolean=false;
  //---

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  //set focus
  @ViewChild('user_login',{static: true}) user_login : ElementRef;
  @ViewChild('user_id',{static: true}) user_id : ElementRef;
  

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
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.setDefForm();
    this.getData();

    //======================== authen ======================================
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fct9910"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => {}
    )
  }

  setDefForm(){
    this.edit_pass = 1;
    this.edit_flag = false;
    this.result.username = "";
    this.result.old_pwd = "";
    this.result.pwd = "";
    this.result.repwd = "";
    this.result.receipt_password = "";
    this.result.re_receipt_password = "";

    this.typeOldPwd =false;
    this.typePwd =false;
    this.typeRePwd =false;
    this.typeReceiptPassword =false;
    this.typeReReceiptPassword =false;
  }

  showInput(objName:any){
    this[objName] = !this[objName];
  }

  getData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    var student = JSON.stringify({
      "user_running" : this.userData.userRunning,
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9991', student).subscribe(
      posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
        // console.log("productsJson=>", posts);
        if(productsJson.result==1){
          // this.result = productsJson.data[0];
          this.result.user_login = productsJson.data[0].user_login;
          this.result.user_running = productsJson.data[0].user_running;
          this.result.opwd = productsJson.data[0].user_password;
          this.result.username = productsJson.data[0].user_login;

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

  setFocus(name:any) {
    const ele = name;
    //console.log('ele : ' , ele);
    if (ele) {
      ele.focus();
    }
  }

  convDate(date:any){
    if(date){
      var dateArray = date.split('/');
      return dateArray[2]+dateArray[1]+dateArray[0];
    }else
      return '';
  }

  setDateNum(name:any){
    // this.alertMessage(name);
    var date = new Date();
    date = name.split('/');
    var dd = date[0];
    var mm = date[1];
    var yyyy = date[2];
    return dd+'/'+mm+"/"+yyyy;
  }

  ClearAll(){
    window.location.reload();
  }

  receiveFuncListData(event:any){
    this.closebutton.nativeElement.click();
  }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }

  alertMessage(text:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage(text);
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

  submitForm(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.username){
      this.alertMessage('กรุณาป้อนชื่อเข้าใช้งาน');
      // return false;
    }else if(!this.result.opwd){
      this.alertMessage('ยืนยันรหัสผ่านเดิมไม่ถูกต้อง');
      // return false;
    }else if( this.result.pwd != this.result.repwd ){
        this.alertMessage('ยืนยันรหัสผ่านไม่ถูกต้อง');//
        // return false;
    }else if((!this.result.pwd)&&(!this.result.receipt_password)){
      this.alertMessage('ตั้งค่ารหัสผ่าน');//
      // return false;
    }else if((this.result.receipt_password)&&(this.result.receipt_password != this.result.re_receipt_password)){
        this.alertMessage('ยืนยันรหัสผ่านไม่ถูกต้อง');//
        // return false;
    }else{

      var student = JSON.stringify({
        "user_running" : this.userData.userRunning,
        "password" : this.result.old_pwd,
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
      posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          if(productsJson.result==0){
            this.alertMessage('ยืนยันรหัสผ่านเดิมไม่ถูกต้อง');     
          }else{
                var student = JSON.stringify({
                  "user_running" : this.userData.userRunning,
                  "password" : this.result.pwd,
                  "userToken" : this.userData.userToken
                });
            
                this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
                posts => {
                    let productsJson : any = JSON.parse(JSON.stringify(posts));
                    if(productsJson.result==1){
                      confirmBox.setMessage('คุณต้องการใช้รหัสผ่านเดิม');
                      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
                      confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                        if (resp.success==true){
                          this.savaData();
                        }
                        subscription.unsubscribe();
                      });
                    }else{
                      this.savaData();
                    }
                },
                (error) => {}
              );
          }
        },
      (error) => {}
      );
    }
  }

  savaData() {
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    var data = {
      "user_running": this.result.user_running,
      "user_login": this.result.username,
      "userToken" : this.userData.userToken
    };

    if(this.result.pwd){
      data["user_password"] = this.result.pwd;
    }
    if(this.result.receipt_password){
      data["receipt_password"] = this.result.receipt_password;
    }
    var student = JSON.stringify(data)
    // console.log("SAVE student=>", student);
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9910/saveData', student ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          if(alertMessage.result==0){
            
            confirmBox.setMessage(alertMessage.error);
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
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
            this.ngOnInit();
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  loadTableComponent(val:any){
    this.loadComponent = true;
    this.loadModalComponent = false;

    $("#exampleModal").find(".modal-body").css("height","auto");
 }

  closeModal(){
    $('.modal')
    .find("input[type='text'],input[type='password'],textarea,select")
    .val('')
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();
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
}
