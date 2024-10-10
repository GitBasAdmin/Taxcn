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
  selector: 'app-fct0212,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0212.component.html',
  styleUrls: ['./fct0212.component.css']
})


export class Fct0212Component implements AfterViewInit, OnInit, OnDestroy {

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
  getCaseType:any;
  getCaseCateGroup:any;
  getStdId:any;
  getStatGroup:any;
  getSubGroupId:any;
  getPenaltyType:any;
  getSuffererStatId:any;
  setReadonly:any;
  max_alle:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('sCaseCateGroup') sCaseCateGroup : NgSelectComponent;
  @ViewChild('sStatGroup') sStatGroup : NgSelectComponent;
  @ViewChild('sSubGroupId') sSubGroupId : NgSelectComponent;

  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadCaseCopyAlleComponent: boolean = false;
  
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
      "url_name" : "fct0212"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
       // console.log(getDataAuthen)
      },
      (error) => {}
    )
    
     //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
      },
      (error) => {}
    )
    //======================== palle_sufferer ======================================
    var student = JSON.stringify({
      "table_name" : "palle_sufferer",
      "field_id" : "sufferer_stat_id",
      "field_name" : "sufferer_name",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getSuffererStatId = getDataOptions;
      },
      (error) => {}
    )

    this.getPenaltyType = [{fieldIdValue:1,fieldNameValue: '1-โทษประหารชีวิต'},
                          {fieldIdValue:2,fieldNameValue: '2-จำคุกเกิน 10 ปี แต่ไม่ประหารชีวิต'},
                          {fieldIdValue:3,fieldNameValue: '3-นอกเหนือจาก 1 และ 2'}];
    
  }

  setDefault(){
    this.result.case_type = '';
    this.result.std_name = '';
    this.result.user_select =1;


    this.result.edit_alle_id = 0;
    this.result.edit_case_type =0;
    this.result.edit_case_cate_group = 0;

    if(this.userData.userLevel != 'A' && this.result.alle_id){
      this.setReadonly = true;
    } else{
      this.setReadonly = false;
    }
  }

  runAlleId(event:any){
    if(this.result.case_type && this.result.case_cate_group){
      var student = JSON.stringify({
        "case_type" : this.result.case_type,
        "case_cate_group" : this.result.case_cate_group,
        "userToken" : this.userData.userToken
      });

      this.http.disableLoading().post('/'+this.userData.appName+'ApiCT/API/fct0212/runAlleId', student).subscribe(posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        if(productsJson.result==1){
          this.max_alle=productsJson.alle_id;
        }
      });
    }else{
      this.max_alle='';
    }
  }
  //ความ
  changeCaseType(event:any, type:any){
    var student = JSON.stringify({
      "table_name" : "pcase_cate_group",
      "field_id" : "case_cate_group",
      "field_name" : "case_cate_group_name",
      "condition" : " AND valid_flag='Y' "+"AND case_type='"+event+"'",
      "userToken" : this.userData.userToken
    });

    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCateGroup = getDataOptions;
      },
      (error) => {}
    )
    if(typeof event=='undefined' || type==1){
      this.sCaseCateGroup.clearModel();
      this.sStatGroup.clearModel();
      this.sSubGroupId.clearModel();
    }
  }

  //ประเภทคดีหลัก
  changeCateGroup(event:any, type:any){
    this.runAlleId(event);

    var student = JSON.stringify({
      "table_name" : "pstat_group_master",
      "field_id" : "stat_group",
      "field_name" : "group_name",
      "condition" : " AND case_type='"+this.result.case_type+"' AND case_cate_group='"+event+"' ",
      "userToken" : this.userData.userToken
    });

    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getStatGroup = getDataOptions;
        if(getDataOptions.length > 0){
          this.getStatGroup.forEach((x : any ) => x.fieldNameValue = x.fieldIdValue+" "+x.fieldNameValue);
        }
      },
      (error) => {}
    )
    if(typeof event=='undefined' || type==1){
      this.sStatGroup.clearModel();
      this.sSubGroupId.clearModel();
    }
  }

  //รหัสกลุ่มสถิติ
  changeStatGroup(event:any, type:any){
    var student = JSON.stringify({
      "table_name" : "pstat_group",
      "field_id" : "sub_group_id",
      "field_name" : "sub_group_name",
      "condition" : " AND case_type='"+this.result.case_type+"' AND stat_group='"+event+"' ",
      "userToken" : this.userData.userToken
    });
    // console.log("student", student);

    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getSubGroupId = getDataOptions;
        if(getDataOptions.length > 0){
          this.getSubGroupId.forEach((x : any ) => x.fieldNameValue = x.fieldIdValue+" "+x.fieldNameValue);
        }
      },
      (error) => {}
    )
    if(typeof event=='undefined' || type==1){
      this.sSubGroupId.clearModel();
    }
  }

  tabChangeSelect(objName:any,event:any){
    if(objName == "std_id"){
      var student = JSON.stringify({
        "table_name" : "std_pallegation",
        "field_id" : "std_id",
        "field_name" : "std_alle_name",
        "condition" : " AND std_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student).subscribe(
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
    }
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

  // save update Data
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if((this.userData.offName != "ADMINISTRATOR") && (this.result.sub_group_id != 9)){
      confirmBox.setMessage('เพิ่มเติม/แก้ไขได้เฉพาะรหัสกลุ่มสถิติ ข้อ 4 "ข้อหาอื่นในคดี" และรหัสกลุ่มสถิติย่อย ข้อ 9 "ข้อหาในคดี(โปรดระบุ)');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.alle_id){
      confirmBox.setMessage('กรุณาระบุรหัสฐานความผิด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.case_type){
      confirmBox.setMessage('กรุณาระบุความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.case_cate_group){
      confirmBox.setMessage('กรุณาระบุประเภทคดีหลัก');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.alle_name){
      confirmBox.setMessage('กรุณาระบุฐานความผิดออกสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.stat_group){
      confirmBox.setMessage('กรุณาระบุรหัสกลุ่มสถิต');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.sub_group_id){
      confirmBox.setMessage('กรุณาระบุรหัสกลุ่มสถิติย่อย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.stat_id){
      confirmBox.setMessage('กรุณาระบุลงถิติข้อ');
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
      this.result['userToken'] = this.userData.userToken;
      var student = $.extend({},this.result);
      // console.log("student=>",student);
      this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct0212/saveData', student ).subscribe(
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

    this.result = this.posts[index];

    this.result.edit_alle_id = this.posts[index]['alle_id'];
    this.result.edit_case_type =this.posts[index]['case_type'];
    this.result.edit_case_cate_group = this.posts[index]['case_cate_group'];
    if(this.result.std_id == 0)
      this.result.std_id = "";
    if(this.result.case_type){
      this.changeCaseType(this.result.case_type,'');
    }
    if(this.result.case_cate_group){
      this.changeCateGroup(this.result.case_cate_group,'');
    }
    if(this.result.stat_group){
      this.changeStatGroup(this.result.stat_group,'');
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
      "case_type" : this.result.case_type ? this.setValue(this.result.case_type) : 0,
      "case_cate_group" : this.result.case_cate_group ? this.setValue(this.result.case_cate_group) : 0,
      "alle_id" : this.result.alle_id ? this.setValue(this.result.alle_id) : 0,
      "stat_group" : this.result.stat_group ? this.setValue(this.result.stat_group) : 0,
      "sub_group_id" : this.result.sub_group_id ? this.setValue(this.result.sub_group_id) : 0,
      "alle_name" : this.result.alle_name,
      "std_id" : this.result.std_id ? this.setValue(this.result.std_id) : 0,
      "order_no" : this.result.order_no ? this.setValue(this.result.order_no) : 0,
      "penalty_type" : this.result.penalty_type ? this.setValue(this.result.penalty_type) : 0,
      "sufferer_stat_id" : this.result.sufferer_stat_id ? this.setValue(this.result.sufferer_stat_id) : 0,

      "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiCT/API/fct0212/search', student ).subscribe(
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
                  this.http.disableLoading().post('/'+this.userData.appName+'ApiCT/API/fct0212/deleteDataSelect', data ).subscribe(
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

  loadMyChildComponent(){
    this.loadComponent = true;
  }

  printReport(){
    var rptName = 'rct0212';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "case_type" : this.result.case_type ? this.result.case_type : "",
      "case_cate_group" : this.result.case_cate_group ? this.result.case_cate_group : "",
      "alle_id" : this.result.alle_id ? this.result.alle_id : "",
      "stat_group" : this.result.stat_group ? this.result.stat_group : "",
      "sub_group_id" : this.result.sub_group_id ? this.result.sub_group_id : "",
      "alle_name" : this.result.alle_name  ? this.result.alle_name : ""
    });
    console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  loadTableComponent(){
    this.openbutton.nativeElement.click();
    var student = JSON.stringify({
      "table_name" : "std_pallegation",
      "field_id" : "std_id",
      "field_name" : "std_alle_code",
      "field_name2" : "std_alle_name",
      "search_id" : "","search_desc" : "",
      "userToken" : this.userData.userToken
    });
    this.listTable='std_pallegation';
    this.listFieldId='std_id';
    this.listFieldName='std_alle_code';
    this.listFieldName2='std_alle_name';
    this.listFieldNull='';
    //console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student , {headers:headers}).subscribe(
     (response) =>{
       this.list = response;
       // console.log(response)
     },
     (error) => {}
    )

    this.loadComponent = true;
    this.loadModalComponent = false;
    this.loadCaseCopyAlleComponent = false;
    $("#exampleModal").find(".modal-body").css("height","auto");
 }

 loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    this.loadCaseCopyAlleComponent = false;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }

  loadCaseCopyAlle(){
    this.openbutton.nativeElement.click();
    this.loadComponent = false;
    this.loadModalComponent = false;
    this.loadCaseCopyAlleComponent = true;
    $("#exampleModal").find(".modal-body").css("height","auto");
    $("#exampleModal").find(".modal-content").css("width","700px");

  }

  receiveFuncListData(event:any){
    this.result.std_id = event.fieldIdValue;
    this.result.std_name = event.fieldNameValue2;
    this.closebutton.nativeElement.click();
  }

  receiveCopyAllData(event:any){
    // console.log("receiveCopyAllData", event)
    this.copyCaseCopyAlle(event);
    this.closebutton.nativeElement.click();

  }

  copyCaseCopyAlle(event:any){
    var chkForm = JSON.parse(event);
    // console.log(chkForm,chkForm.case_type1);


    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!chkForm.case_type1){
      confirmBox.setMessage('กรุณาป้อนจาก ความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });

    }else if(!chkForm.case_cate_group1){
      confirmBox.setMessage('กรุณาป้อนจาก ประเภทคดีหลัก');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if(!chkForm.case_type2){
      confirmBox.setMessage('กรุณาป้อนให้กับ ความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if(!chkForm.case_cate_group2){
      confirmBox.setMessage('กรุณาป้อนให้กับ ประเภทคดีหลัก');
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
      chkForm['userToken'] = this.userData.userToken;
      var student = $.extend({},chkForm);
      // console.log("student=>",student);
      this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct0212/copyData', student ).subscribe(
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
                  this.SpinnerService.hide();
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
    }
    
  }

  closeModal(){
    this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadCaseCopyAlleComponent = false;

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
    
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct0212', student).subscribe(posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
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

  tabChange(obj:any){
    let find_id = this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value));
     if(typeof find_id != 'undefined'){
       this.result.position = this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue;
     }else{
       this.result.position="";
     }
   }

  //startDate , endDate
  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }
}
