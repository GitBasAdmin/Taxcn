import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map, } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
// import { viewClassName } from '@angular/compiler';
// import { isNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-fct0304,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0304.component.html',
  styleUrls: ['./fct0304.component.css']
})


export class Fct0304Component implements AfterViewInit, OnInit, OnDestroy {

  title: any;

  posts: any;
  std_id: any;
  std_prov_name: any;
  delList: any = [];
  search: any;
  masterSelected: boolean;
  checklist: any;
  checklist2: any;
  sessData: any;
  userData: any;
  myExtObject: any;
  programName: string;

  Datalist: any;
  defaultCaseType: any;

  result: any = [];
  modalType: any;
  getcaseType: any;

  

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('fct0304', { static: true }) fct0304: ElementRef;


  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2
  ) {
    this.masterSelected = false
  }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [[2, 'asc']]
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0304', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      this.posts = productsJson.data;
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        if (productsJson.data.length)
          this.posts.forEach((x: any) => x.edit0304 = false);
        this.rerender();
      } else {
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
      }
      this.SpinnerService.hide();
    });

    //======================== pcase_type =================
    var student = JSON.stringify({
      "table_name": "pcase_type",
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:'',fieldNameValue: 'ทุกประเภท'});
        this.getcaseType = getDataOptions;        
      },
      (error) => { }
    )

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


  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0304 = this.masterSelected;
    }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.edit0304 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0304 = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  ClearAll() {
    window.location.reload();
  }

  getCheckedItemList() {
    var del = "";
    // var del2 = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function (e, i) {
        if ($(this).prop("checked") == true) {
          if (del != '')
            del += ','
          del += $(this).val();
          alert(del);
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
      })
    }, 100);

  }

  receiveFuncListData(event: any) {
    if(this.modalType==1){
      this.result.summon_notice_type = event.fieldIdValue;
      this.result.summon_notice_type_name = event.fieldNameValue;
    }else  if(this.modalType==2){
      this.result.std_id = event.fieldIdValue;
      this.result.std_name = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  clickOpenMyModalComponent(type:any){
    this.modalType=type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent() {

    if(this.modalType==1){
      var student = JSON.stringify({
        "table_name": "psummon_notice_type",
        "field_id": "summon_notice_type",
        "field_name": "summon_notice_type_name",
        "userToken": this.userData.userToken
      });
      this.listTable = "psummon_notice_type";
      this.listFieldId = "summon_notice_type";
      this.listFieldName = "summon_notice_type_name";
      this.listFieldName2 ='';
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadComponent = true;
          this.loadModalComponent = false; //password confirm
        },
        (error) => {}
      )
    }else if(this.modalType==2){
      var student = JSON.stringify({
        "table_name": "std_pnotice_type",
        "field_id": "std_id",
        "field_name": "std_code",
        "field_name2": "std_notice_type_name",
        "userToken": this.userData.userToken
      });
      this.listTable = "std_pnotice_type";
      this.listFieldId = "std_id";
      this.listFieldName = "std_code";
      this.listFieldName2 = "std_notice_type_name";
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadComponent = true;
          this.loadModalComponent = false; //password confirm
        },
        (error) => {}
      )
    }else{
      this.loadComponent = false;
      this.loadModalComponent = true;
    }
  }

  tabChange(objName:any,event: any) {
    var student = JSON.stringify({
      "table_name": "psummon_notice_type",
      "field_id": "summon_notice_type",
      "field_name": "summon_notice_type_name",
      "condition": " AND summon_notice_type='" + event.target.value + "'",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.summon_notice_type_name = productsJson[0].fieldNameValue;
        }else{
          this.result.summon_notice_type = null;
          this.result.summon_notice_type_name = '';
        }
      },
      (error) => { }
    )
  }


  getStdPnotice(event:any){
    var student = JSON.stringify({
      "table_name": "std_pnotice_type",
      "field_id": "std_id",
      "field_name": "std_notice_type_name",
      "condition": " AND std_id='" + event + "'",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student).subscribe(
      (response) => {
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.std_name = productsJson[0].fieldNameValue;
        }else{
          this.result.std_id = null;
          this.result.std_name = '';
        }     
      },
      (error) => { }
    )
  }

  // save update Data
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.result.notice_type_id) {
      confirmBox.setMessage('กรุณาระบุรหัส');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });
    } else if (!this.result.notice_type_name) {
      confirmBox.setMessage('กรุณาระบุประเภทหมาย');
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

      this.result['userToken'] = this.userData.userToken;

      var student= JSON.stringify($.extend({}, this.result));
      this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0304/saveJson', student).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();
            confirmBox.setMessage('ข้อความแจ้งเตือน');
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                $("button[type='reset']")[0].click();
              }
              subscription.unsubscribe();
            });
            this.getData();
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }


  editData(index: any) {
    this.SpinnerService.show();
    
    this.result = JSON.parse(JSON.stringify(this.posts[index]));

    if(this.result.std_id)
      this.getStdPnotice(this.result.std_id);

    if(!this.result.case_type)
      this.result.case_type = "";
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    var student = JSON.stringify({
      "notice_type_id": this.result.notice_type_id,
      "notice_type_name": this.result.notice_type_name,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0304/search', student).subscribe(
      posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;

        if (productsJson.result == 1) {
          this.checklist = this.posts;
          this.checklist2 = this.posts;
          if (productsJson.length)
            this.posts.forEach((x: any) => x.edit0304 = false);
          this.rerender();
        } else {
          confirmBox.setMessage(productsJson.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) { }
            subscription.unsubscribe();
          });
        }
        this.SpinnerService.hide();

      },
      (error) => { this.SpinnerService.hide(); }
    );
  }

  confirmBox() {
    var isChecked = this.posts.every(function (item: any) {
      return item.edit0304 == false;
    })

    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ไม่พบเงื่อนไข?');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการลบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      this.modalType='';
      this.openbutton.nativeElement.click();
    }
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  submitModalForm() {
    var chkForm = JSON.parse(this.child.ChildTestCmp());

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!chkForm.password) {
      confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });

    } else if (!chkForm.log_remark) {
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
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
                var dataDel = [], dataTmp = [];
                var bar = new Promise((resolve, reject) => {
                  this.posts.forEach((ele, index, array) => {
                    if (ele.edit0304 == true) {
                      dataTmp.push(this.posts[index]);
                    }
                  });
                });
                if (bar) {
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0304/deleteSelect', data).subscribe(
                    (response) => {
                      let alertMessage: any = JSON.parse(JSON.stringify(response));
                      if (alertMessage.result == 0) {
                        this.SpinnerService.hide();
                      } else {
      
                        this.closebutton.nativeElement.click();
                        $("button[type='reset']")[0].click();
                        this.getData();
                      }
                    },
                    (error) => { this.SpinnerService.hide(); }
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

  printReport() {
    var rptName = 'rct0304';
    // For no parameter : paramData ='{}'
    var paramData = '{}';
    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprov_id" : this.prov_id.nativeElement["prov_id"].value,
    //   "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    // });
    this.printReportService.printReport(rptName, paramData);
  }

  closeModal() {
    this.loadModalComponent = false;
    this.loadComponent = false;
  }


  getData() {
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0304', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      this.posts = productsJson.data;
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        if (productsJson.data.length)
          this.posts.forEach((x: any) => x.edit0304 = false);
        this.rerender();
      } else {
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
      }
      this.SpinnerService.hide();
    });
  }
}