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
  selector: 'app-fct9901,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct9901.component.html',
  styleUrls: ['./fct9901.component.css']
})


export class Fct9901Component implements AfterViewInit, OnInit, OnDestroy {

  title:any;
  posts:any = [];
  std_id:any;
  std_prov_name:any;
  delList:any=[];
  search:any;
  masterSelected:boolean;
  checklist:any;
  checklist2:any;
  sessData:any;
  userData:any;
  myExtObject:any;
  programName:string;

  Datalist:any;
  //------
  result:any=[];
  getCaseCateGroup:any;
  getStdId:any;
  getStatGroup:any;
  getSubGroupId:any;
  getPenaltyType:any;
  getSuffererStatId:any;
  setReadonly:any;
  max_alle:any;
  //
  getCourtType:any;
  getCourtPart:any;
  getGenNotice:any;
  getNumWitness:any;
  getAlertType:any;
  getPrintReceipt:any;
  getPrintCover:any;
  getTouchFlag:any;
  getDepLoginFlag:any;
  getNoticeTypeDate:any;
  getPrintGuardef:any;
  fileToUpload1: File = null;
  modalType:any;
  getProv:any;
  getAmphur:any;edit_amphur_id:any;
  getTambon:any;edit_tambon_id:any;
  getPostNo:any;

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
  @ViewChild('sProv') sProv : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
  @ViewChild('numGenCase',{static: true}) numGenCase : ElementRef;
  @ViewChild('courtName',{static: true}) courtName : ElementRef;
  
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent : boolean = false; //popup judge
  
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
      columnDefs: [{"targets": 'no-sort',"orderable": false}]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.setDefault();
    this.getData();
    //======================== authen ======================================
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fct9901"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
       // console.log(getDataAuthen)
      },
      (error) => {}
    )
    //======================== pcourt_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt_type",
      "field_id" : "court_type_id",
      "field_name" : "court_type_name",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourtType = getDataOptions;
      },
      (error) => {}
    )
     //======================== pprovince ======================================
     var student = JSON.stringify({
      "table_name" : "pprovince",
      "field_id" : "prov_id",
      "field_name" : "prov_name",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getProv = getDataOptions;
      },
      (error) => {}
    )

    this.getCourtPart = [{fieldIdValue:'',fieldNameValue: ''}];
    for(var i=1;i<=10;i++){
      this.getCourtPart.push({fieldIdValue:i,fieldNameValue: i});
    }

    this.getGenNotice = [{fieldIdValue:1,fieldNameValue: 'ใช้รหัสเดิม'}, {fieldIdValue:2,fieldNameValue: 'run รหัสใหม่'}];
    this.getNumWitness = [{fieldIdValue:1,fieldNameValue: 'ต่อคน'}, {fieldIdValue:2,fieldNameValue: 'ต่อกลุ่ม'}];
    this.getAlertType = [{fieldIdValue:1,fieldNameValue: 'แจ้งเตือนเฉพาะพยาน'}, {fieldIdValue:2,fieldNameValue: 'แจ้งเตือนคู่ความทุกคน'}];
    this.getPrintReceipt = [{fieldIdValue:1,fieldNameValue: 'พิมเครื่องเดียว'}, {fieldIdValue:2,fieldNameValue: 'พิมพ์แยกเครื่อง'}];
    this.getPrintCover = [{fieldIdValue:1,fieldNameValue: 'barcode'}, {fieldIdValue:2,fieldNameValue: 'qr-code'}];
    this.getTouchFlag = [{fieldIdValue:0,fieldNameValue: ''}, {fieldIdValue:1,fieldNameValue: 'Mouse'}, {fieldIdValue:2,fieldNameValue: 'Touchtsreen'}];
    this.getDepLoginFlag = [{fieldIdValue:'',fieldNameValue: 'ไม่เลือก'}, {fieldIdValue:1,fieldNameValue: 'เฉพาะวันหยุด'}, {fieldIdValue:2,fieldNameValue: 'ทุกวัน'}];
    this.getNoticeTypeDate = [{fieldIdValue:'',fieldNameValue: ''}, {fieldIdValue:1,fieldNameValue: 'วันที่บันทึก'}, {fieldIdValue:2,fieldNameValue: 'พิมพ์วันที่ออกแดง'}];
    this.getPrintGuardef = [{fieldIdValue:0,fieldNameValue: 'ไม่พิมพ์ลงชื่อผู้ประกัน'}, {fieldIdValue:1,fieldNameValue: 'พิมพ์ลงชื่อผู้ประกัน'}, {fieldIdValue:2,fieldNameValue: 'พิมพ์ลงชื่อผู้ประกันและจำเลย'}];
  }

  setDefault(){
    this.result.court_running = 0;
    this.result.edit_court_running = 0;

    this.result.court_type_id = 1;
    this.result.gen_notice_no = 1;
    this.result.alert_type = 1;
    this.result.print_receipt_flag = 1;
    this.result.send_notice_flag = 1;
    this.result.print_cover_flag = 1;
    this.result.dep_login_flag = '';
    this.result.print_guardef = 0;
    this.result.qrcode_accept = null;
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
    const ele = this.result.num_gen_case.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0212 = this.masterSelected;
      }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0212 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0212 = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  ClearAll(){
    window.location.reload();
  }

  getCheckedItemList(){
    var del = "";
    // var del2 = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function(e,i){
        if($(this).prop("checked")==true){
          if(del!='')
            del+=','
          del+=$(this).val();
          alert(del);
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
       })
    }, 100);
  }

  onFileChange(e:any,type:any) {
    if(e.target.files.length){
      this.fileToUpload1 = e.target.files[0];
      var fileName = e.target.files[0].name;
      $(e.target).parent('div').find('label').html(fileName);
    }else{
      this.fileToUpload1 =  null;
      $(e.target).parent('div').find('label').html('');
    }
  }

  clickOpenFile(){
    var student = JSON.stringify({
      "court_running" : this.result.court_running,
      "userToken" : this.userData.userToken
    });
    //console.log(student);
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9901/getImage', student).subscribe(posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        // console.log(productsJson)
        if(productsJson.result==1){
          if(productsJson.url.length)
            myExtObject.OpenWindowMax(productsJson.url);
        }
    });
  }

  clickDeleteFile(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ต้องการลบ QR Code ใช่หรือไม่');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      // Choose layout color type
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.SpinnerService.show();

          var student = JSON.stringify({
          "court_running" : this.result.court_running,
          "userToken" : this.userData.userToken
          });
          // console.log("delete word student=>", student);  
          this.http.disableLoading().post('/'+this.userData.appName+'ApiCT/API/fct9901/deleteImage', student).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              // console.log("delete word alertMessage=>", alertMessage)
              if(alertMessage.result==0){
                this.SpinnerService.hide();
                confirmBox.setMessage('ข้อความแจ้งเตือน');
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
                  if (resp.success==true){ }
                  this.fileToUpload1 =  null;
                  this.result.qrcode_accept =  '';
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

  // save update Data
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    // if(!this.result.court_id){
    //   confirmBox.setMessage('กรุณาระบุรหัสศาล');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success==true){}
    //     subscription.unsubscribe();
    //   });
    // }else 
    if(!this.result.court_name){
      confirmBox.setMessage('กรุณาระบุชื่อศาล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.courtName.nativeElement.focus();
        }
        subscription.unsubscribe();
      });
    }else  if(this.result.c_lan == 1 && (!this.result.num_gen_case) || ((this.result.num_gen_case) && (this.result.num_gen_case < 1))){
      confirmBox.setMessage('กรุณาระบุสำเนาข้อมูลได้ไม่เกิน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.numGenCase.nativeElement.focus();
        }
        subscription.unsubscribe();
      });
    }else  if((this.result.num_gen_case)&&(this.result.num_gen_case > 100)){
      confirmBox.setMessage('สำเนาข้อมูลได้ไม่เกิน 100 คดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.numGenCase.nativeElement.focus();
        }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      if(!this.result.std_id)
        this.result.std_id = 0;

      var formData = new FormData();
      this.result['userToken'] = this.userData.userToken;
      formData.append('file', this.fileToUpload1);
      formData.append('data', JSON.stringify($.extend({}, this.result)));
      // console.log("formfile=>", formData.get('data'));
      this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct9901/saveData', formData ).subscribe(
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
                  $("button[type='reset']")[0].click();
                }
                subscription.unsubscribe();
              });
              this.ngOnInit();
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  editData(index:any){
    this.SpinnerService.show();
    // console.log(this.posts[index]);
    this.result = this.posts[index];
    this.result.edit_court_running = this.posts[index]['court_running'];
    if(this.result.dep_login_flag ==0)
      this.result.dep_login_flag = '';
    if(this.result.notice_type_date ==0)
      this.result.notice_type_date = '';

    if(this.result.court_province){
      this.changeProv(this.result.court_province,'');
    }
    else{
      this.sAmphur.clearModel();
      this.sTambon.clearModel();
    }
  
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  setValue(obj:any){
    if(obj == null)
      return 0;
    else
      return obj;
  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();

      var student = JSON.stringify({
      "court_id" : this.result.court_id,
      "std_id" : this.result.std_id,
      "court_name" : this.result.court_name,
      "court_type_id" : this.result.court_type_id ? this.result.court_type_id : 0,
      "court_eng" : this.result.court_eng,
      "short_court_name" : this.result.short_court_name,
      "court_part" : this.result.court_part? this.result.court_part : 0,
      "tax_id" : this.result.tax_id,
      "director" : this.result.director,
      "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiCT/API/fct9901/search', student ).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit0212 = false);
              this.rerender();
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
        },
        (error) => {this.SpinnerService.hide();}
      );
  }

  confirmBox() {
    this.modalType = "delete";

    var isChecked = this.posts.every(function(item:any) {
      return item.edit0212 == false;
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
                var dataDel = [],dataTmp=[];
                var bar = new Promise((resolve, reject) => {
                  this.posts.forEach((ele, index, array) => {
                        if(ele.edit0212 == true){
                          dataTmp.push(this.posts[index]);
                        }
                    });
                });
                if(bar){
                  this.SpinnerService.show();
                  dataDel['log_remark'] = chkForm.log_remark;
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  // console.log("delete=>", data);
                  this.http.disableLoading().post('/'+this.userData.appName+'ApiCT/API/fct9901/deleteDataSelect', data ).subscribe(
                  (response) =>{
                    let alertMessage : any = JSON.parse(JSON.stringify(response));
                    if(alertMessage.result==0){
                      this.SpinnerService.hide();
                    }else{
                      this.SpinnerService.hide();
                      this.closebutton.nativeElement.click();
                      $("button[type='reset']")[0].click();
                      this.getData();
                    }
                  },
                  (error) => {this.SpinnerService.hide();}
                )
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

  tabChangeSelect(objName:any, event:any){
    if(objName == 'std_id'){
      var student = JSON.stringify({
        "table_name" : "std_pcourt",
        "field_id" : "std_id",
        "field_name" : "std_court_name",
        "condition" : " AND std_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getDataStd', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.std_name = productsJson[0].fieldNameValue;
          }else{
            this.result.std_id = null;
            this.result.std_name = "";
          }
        },
        (error) => {}
      )
    }else if(objName == 'check_off_name' || objName == 'paid_off_name' || objName == 'approved_off_name1' || objName == 'approved_off_name2'){
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
    }
  }

  clickOpenMyModalComponent(type:any){
    this.modalType=type;
    this.openbutton.nativeElement.click();
  }

 loadMyModalComponent(){
    if(this.modalType==0){
      var student = JSON.stringify({
        "table_name"  : "std_pcourt",
        "field_id"    : "std_id",
        "field_name"  : "std_code",
        "field_name2"  : "std_court_name",
        "userToken"   : this.userData.userToken
      });
      this.listTable = "std_pcourt";
      this.listFieldId = "std_id";
      this.listFieldName = "std_code";
      this.listFieldName2 = "std_court_name";
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadComponent = true;
          this.loadModalComponent = false; //password confirm
          this.loadModalJudgeComponent = false;
          $("#exampleModal").find(".modal-content").css("width","800px");
        },
        (error) => {}
      )
    }else if(this.modalType==1 || this.modalType==2 || this.modalType==4 || this.modalType==6){
      var student = JSON.stringify({
        "table_name"  : "pofficer",
        "field_id"    : "off_id",
        "field_name"  : "off_name",
        "userToken"   : this.userData.userToken
      });
      this.listTable = "pofficer";
      this.listFieldId = "off_id";
      this.listFieldName = "off_name";
      this.listFieldName2 = "";
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadComponent = true;
          this.loadModalComponent = false; //password confirm
          this.loadModalJudgeComponent = false;

          $("#exampleModal").find(".modal-content").css("width","800px");
        },
        (error) => {}
      )
    }else if(this.modalType==3 || this.modalType==5){
      var student = JSON.stringify({
        "cond":2,
        "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.listFieldType=JSON.stringify({"type":2});

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadComponent = false;
          this.loadModalComponent = false; //password confirm
          this.loadModalJudgeComponent = true;

         let productsJson : any = JSON.parse(JSON.stringify(response));
         if(productsJson.data.length){
           this.list = productsJson.data;
         }else{
           this.list = [];
         }
        },
        (error) => {}
      )
    }else if(this.modalType == "delete"){
      this.loadComponent = false;
      this.loadModalComponent = true;
      this.loadModalJudgeComponent = false;

      $("#exampleModal").find(".modal-content").css("width","600px");
    }
  }


  receiveFuncListData(event:any){
    if(this.modalType==0){
      this.result.std_id = event.fieldIdValue;
      this.result.std_name = event.fieldNameValue2;
    }else if(this.modalType==1){
      this.result.check_off_id = event.fieldIdValue;
      this.result.check_off_name = event.fieldNameValue;
    }else if(this.modalType==2){
      this.result.paid_off_id = event.fieldIdValue;
      this.result.paid_off_name = event.fieldNameValue;
    }else if(this.modalType==3 || this.modalType==4){
      this.result.approved_off_id1 = event.fieldIdValue;
      this.result.approved_off_name1 = event.fieldNameValue;
    }else if(this.modalType==5 || this.modalType==6){
      this.result.approved_off_id2 = event.fieldIdValue;
      this.result.approved_off_name2 = event.fieldNameValue;
    }

    this.closebutton.nativeElement.click();
  }

  receiveJudgeListData(event:any){
    if(this.modalType==3){
      this.result.approved_off_id1 = event.judge_id;
      this.result.approved_off_name1 = event.judge_name;
    }else if(this.modalType==5){
      this.result.approved_off_id2 = event.judge_id;
      this.result.approved_off_name2 = event.judge_name;
    }

    this.closebutton.nativeElement.click();
  }

  closeModal(){
    this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadModalJudgeComponent = false;

    $('.modal')
    .find("input[type='text'],input[type='password'],textarea,select")
    .val('')
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();
  }

  getData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });
    // console.log("student=>",student);
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9901', student).subscribe(posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
        // console.log(productsJson.data);
        if(productsJson.result==1){
          this.checklist = this.posts;
          if(productsJson.data.length)
            this.posts.forEach((x : any ) => x.edit0212 = false);
          this.rerender();
        }else{
          confirmBox.setMessage(productsJson.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.posts = [];
            }
            subscription.unsubscribe();
          });
        }
        this.SpinnerService.hide();
    });
  }

  printReport(){
    var rptName = 'rct9901';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "case_type" : this.result.case_type,
      "case_cate_group" : this.result.case_cate_group,
      "alle_id" : this.result.alle_id,
      "stat_group" : this.result.stat_group,
      "sub_group_id" : this.result.sub_group_id,
      "alle_name" : this.result.alle_name
    });
    this.printReportService.printReport(rptName,paramData);
  }

  printQrCode(){
    var rptName = 'rct9901_1';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      // "pcourt_running" : this.result.court_running,
    });
    this.printReportService.printReport(rptName,paramData);
  }

  //startDate , endDate
  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  changeProv(province:any,type:any){
    this.result.court_province=province;
  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "condition" : " AND prov_id='"+province+"'",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAmphur = getDataOptions;
        setTimeout(() => {
          if(this.result.court_ampheur){
            this.changeAmphur(this.result.court_ampheur,type);
          }
        }, 100);
      },
      (error) => {}
    )
    if(typeof province=='undefined' || type==1){
      this.sAmphur.clearModel();
      this.sTambon.clearModel();
      this.result.court_ampheur = "";
      this.result.tambon_id = "";
    }
  }
  
  changeAmphur(Amphur:any,type:any){
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.result.court_province+"'",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTambon = getDataOptions;
      },
      (error) => {}
    )
    if(typeof Amphur=='undefined' || type==1){
      this.sTambon.clearModel();
      this.result.tambon_id="";
    }
  }
  
  changeTambon(Tambon:any,type:any){
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "field_name2" : "post_code",
      "condition" : " AND tambon_id='"+Tambon+"' AND amphur_id='"+this.result.court_ampheur+"' AND prov_id='"+this.result.court_province+"'",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(this.result.court_tambon){
            setTimeout(() => {
            this.result.post_no = getDataOptions[0].fieldNameValue2;
         }, 100);
        }
      },
      (error) => {}
    )
    if(typeof Tambon=='undefined'){
      this.result.post_no = "";
    }
  }
     
}
