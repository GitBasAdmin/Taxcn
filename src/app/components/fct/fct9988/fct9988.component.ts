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
import * as $ from 'jquery';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
declare var myExtObject: any;

@Component({
  selector: 'app-fct9988,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct9988.component.html',
  styleUrls: ['./fct9988.component.css']
})

export class Fct9988Component implements AfterViewInit, OnInit, OnDestroy {
  title = 'datatables';
  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  posts: any;
  search: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  delValue: any;
  sessData: any;
  userData: any;
  programName: string;
  result: any=[];
  getMoType: any;
  hid_mo_date: any;
  mo_date: any;
  myExtObject:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('pers_type', { static: true }) pers_type: ElementRef;
  @ViewChild('program_id', { static: true }) program_id: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  public loadModalComponent: boolean = false;

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
      order: []
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9988', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      this.posts = productsJson.data;
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        if (productsJson.data.length){
          this.posts.forEach((x: any) => x.edit9988 = false);
          this.posts.forEach((ele, index, array) => {
            if(ele.mo_type==1)
              ele.mo_type_desc = 'เพิ่ม';
            else if(ele.mo_type==2)
              ele.mo_type_desc = 'แก้ไข';
            else if(ele.mo_type==3)
              ele.mo_type_desc = 'ข้อผิดพลาด';
          });
        }
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

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fct9988"
    });
    this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers }).subscribe(
      (response) => {
        let getDataAuthen: any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        console.log(getDataAuthen)
      },
      (error) => { }
    )

    this.getMoType = [{ fieldIdValue: 0, fieldNameValue: '' }, { fieldIdValue: 1, fieldNameValue: 'เพิ่ม' }, { fieldIdValue: 2, fieldNameValue: 'แก้ไข' }, { fieldIdValue: 3, fieldNameValue: 'ข้อผิดพลาด' }];
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  loadMyModalComponent() {
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "100px");
  }

  loadTableComponent(val: any) {
    var student = JSON.stringify({
      "table_name": "pprogram",
      "field_id": "program_id",
      "field_name": "program_name",
      "field_name2": "url_name",
      "search_id": "", "search_desc": "",
      "userToken": this.userData.userToken
    });
    this.listTable = 'pprogram';
    this.listFieldId = 'program_id';
    this.listFieldName = 'program_name';
    this.listFieldName2 = 'url_name';
    this.listFieldNull = '';
    //console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student, { headers: headers }).subscribe(
      (response) => {
        this.list = response;
        this.loadModalComponent = false;
        this.loadComponent = true;
        $("#exampleModal").find(".modal-body").css("height", "auto");
        console.log(response)
      },
      (error) => { }
    )
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
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9988', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      console.log(productsJson)
      this.posts = productsJson.data;
      console.log(this.posts);
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        if (productsJson.data.length){
          this.posts.forEach((x: any) => x.edit9988 = false);
          this.posts.forEach((ele, index, array) => {
            if(ele.mo_type==1)
              ele.mo_type_desc = 'เพิ่ม';
            else if(ele.mo_type==2)
              ele.mo_type_desc = 'แก้ไข';
            else if(ele.mo_type==3)
              ele.mo_type_desc = 'ข้อผิดพลาด';
          });
        }
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

  setFocus(name: any) {
    const ele = this.program_id.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit9988 = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.edit9988 == true;
    })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit9988 = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  ClearAll() {
    window.location.reload();
  }

  tabChange(val: any) {

    var student = JSON.stringify({
      "table_name": "pprogram",
      "field_id": "program_id",
      "field_name": "program_name",
      "condition": " AND program_id ="+this.result.program_id,
      "search_desc": '',
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      datalist => {
        let productsJson = JSON.parse(JSON.stringify(datalist));
        if (productsJson.length) {
          this.result.program_name = productsJson[0].fieldNameValue;
        } else {
          this.result.program_id = "";
          this.result.program_name = "";
        }
      },
      (error) => { }
    );
  }

  getCheckedItemList() {
    var del = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function (e, i) {
        if ($(this).prop("checked") == true) {
          if (del != '')
            del += ','
          del += $(this).val();
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
      })
    }, 100);
  }

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.result.mo_date) {
      confirmBox.setMessage('กรุณาระบุวัน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });

    } else if (!this.result.program_id) {
      confirmBox.setMessage('กรุณาระบุโปรแกรมที่ปรับปรุงแก้ไข');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });

    } else if (!this.result.mo_desc) {
      confirmBox.setMessage('กรุณาระบุข้อมูลรายละเอียดคำสั่งคำร้อง');
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
        "edit_mo_running": this.result.edit_mo_running ?  this.result.edit_mo_running : 0,
        "mo_running": this.result.mo_running ?  this.result.mo_running : 0,
        "program_id": this.result.program_id,
        "mo_type": this.result.mo_type,
        "mo_date": this.result.mo_date,
        "mo_desc": this.result.mo_desc,        
        "remark": this.result.remark,
        "userToken": this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
        this.http.post('/' + this.userData.appName + 'ApiCT/API/fct9988/saveJson', student).subscribe(
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
                }
                subscription.unsubscribe();
              });
            } else {
              this.SpinnerService.hide();
              confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
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
              this.ngOnInit();
            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
    }
  }


  editData(index:any){
    this.SpinnerService.show();

    this.result.edit_mo_running  = this.posts[index]['edit_mo_running'];
    this.result.mo_running  = this.posts[index]['mo_running'];
    this.result.program_id  = this.posts[index]['program_id'];
    this.result.program_name  = this.posts[index]['program_name'];
    this.result.mo_type  = this.posts[index]['mo_type'] ? parseInt(this.posts[index]['mo_type']) : '';
    this.result.mo_date  = this.posts[index]['mo_date'];
    this.result.mo_desc = this.posts[index]['mo_desc'];
    this.result.remark = this.posts[index]['remark'];

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }


  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    var student = JSON.stringify({
      "program_id": this.program_id.nativeElement["program_id"].value,
      "mo_desc": this.program_id.nativeElement["mo_desc"].value,
      "remark": this.program_id.nativeElement["remark"].value,
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct9988/search', student).subscribe(
      posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
        console.log(productsJson)
        if (productsJson.result == 1) {
          this.checklist = this.posts;
          if (productsJson.length)
            this.posts.forEach((x: any) => x.edit9988 = false);
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
    this.delValue = $("body").find("input[name='delValue']").val();
    const confirmBox = new ConfirmBoxInitializer();
    if (!this.delValue) {
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
      this.openbutton.nativeElement.click();
    }
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  receiveFuncListData(event: any) {
    console.log(event)
    this.result.program_id=event.fieldIdValue;
    this.result.program_name=event.fieldNameValue;

    this.closebutton.nativeElement.click();
  }

  loadMyChildComponent() {
    this.loadComponent = true;
  }

  submitModalForm() {
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
                        if(ele.edit9988 == true){
                          dataTmp.push(this.posts[index]);
                        }
                    });
                });
                if(bar){
                  this.SpinnerService.show();

                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  this.http.disableLoading().post('/'+this.userData.appName+'ApiCT/API/fct9988/deleteSelect', data ).subscribe(
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

  printReport() {
    var rptName = 'rct9988';

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprogram_id" : this.program_id.nativeElement["program_id"].value,
    //   "pmo_desc" : this.program_id.nativeElement["mo_desc"].value
    // });

    this.printReportService.printReport(rptName, paramData);
  }
}