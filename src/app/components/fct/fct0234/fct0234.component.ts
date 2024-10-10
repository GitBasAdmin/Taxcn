import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

import {ActivatedRoute} from '@angular/router';
import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmFfnComponent } from '../../modal/modal-confirm-ffn/modal-confirm-ffn.component';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import * as $ from 'jquery';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
declare var myExtObject: any;

@Component({
  selector: 'app-fct0234,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0234.component.html',
  styleUrls: ['./fct0234.component.css']
})


export class Fct0234Component implements AfterViewInit, OnInit, OnDestroy {

  title: any;

  posts: any;
  judge: any = [];
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
  dep_code: any;
  dep_name: any;
  Datalist: any;
  defaultCaseType: any;

  result: any = [];
  resultTmp: any = [];
  dataHeadValue: any = [];


  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldNull: any;
  public listFieldType: any;


  dtOptions: DataTables.Settings = {};;
  alleOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerData: Subject<any> = new Subject<any>();


  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('form_id', { static: true }) form_id: ElementRef;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;

  public loadModalComponent: boolean = false;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService
  ) {
    this.masterSelected = false
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}]
    };

    this.alleOptions = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.setDefault();

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0234', student).subscribe(posts => {
    let productsJson: any = JSON.parse(JSON.stringify(posts));
    this.posts = productsJson.data;

      if (productsJson.result == 1) {
        this.checklist = this.posts;
        if (productsJson.data.length)
          this.posts.forEach((x: any) => x.edit0234 = false);
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

    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fct0234"
    });
    this.http.post('/' + this.userData.appName + 'Api/API/authen', authen).subscribe(
      (response) => {
        let getDataAuthen: any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => { }
    )
  }

  setDefault() {
    this.result=[];
    this.dataHeadValue = [];
    this.dataHeadValue.push({
      'edit_index_id':'0',
      'index_id': '0',
      'index_item': 1,
      'index_desc': '',
    });
  }

  addData(index: any) {
    if ((this.dataHeadValue.length - 1) == index) {
      this.resultTmp = JSON.parse(JSON.stringify(this.dataHeadValue));
      this.dataHeadValue = [];
      this.dataHeadValue = JSON.parse(JSON.stringify(this.resultTmp));
      this.dataHeadValue.push({
        'edit_index_item':'0',
        'index_id': '0',
        'index_item': this.dataHeadValue.length + 1,
        'index_desc': '',
      });
    }
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
    });
    this.dtTrigger.next(null);
    this.dtTriggerData.next(null);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtTriggerData.next(null);
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerData.unsubscribe();
  }

  setFocus(name: any) {
    const ele = this.form_id.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0234 = this.masterSelected;
    }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.edit0234 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0234 = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  ClearAll() {
    window.location.reload();
  }

  getCheckedItemList() {
    var del = "";
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

  loadMyModalComponent() {
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "100px");
  }

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.result.index_name) {
      confirmBox.setMessage('กรุณาระบุประเภทสารบาญสำนวน');
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

      let tmp=[];
      for (let index = 0; index < this.dataHeadValue.length; index++) {
        if(this.dataHeadValue[index].edit_index_item>0 || this.dataHeadValue[index].index_desc)
          tmp.push(this.dataHeadValue[index]);      
      }

      var student = JSON.stringify({
        "edit_index_id": this.result.edit_index_id ? this.result.edit_index_id : 0,
        "index_id": this.result.index_id ? this.result.index_id : 0,
        "index_name": this.result.index_name,
        "data": tmp,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0234/saveJson', student).subscribe(
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
              if (resp.success == true) {}
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
                this.ngOnInit();
                //this.getSetUp(alertMessage.index_id);
                this.getData();
                
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { }
      )
    }
  }

  editData(index: any) {
    this.SpinnerService.show();
    this.result = this.posts[index];
    this.result.index_id = this.posts[index].index_id;
    this.result.index_name = this.posts[index].index_name;

    if(this.result.index_id){
      this.getSetUpDetail(this.result.index_id);
    }
    
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  getSetUp(index_id:any){
    if(index_id){
      var student = JSON.stringify({
        "index_id": index_id,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0234', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
        if (productsJson.result == 1) {
          this.result = productsJson.data[0];
          if(productsJson.data[0].index_id)
            this.getSetUpDetail(productsJson.data[0].index_id);
        }
      });
    }
  }

  getSetUpDetail(index_id:any){
    this.dataHeadValue=[];
    if(index_id){
      var student = JSON.stringify({
        "index_id": index_id,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0234/getSetupDetail', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
        if (productsJson.result == 1) {
          this.dataHeadValue = productsJson.data;
          this.dataHeadValue.push({
            'edit_index_item':'0',
            'index_id': '0',
            'index_item': this.dataHeadValue.length + 1,
            'index_desc': '',
          });
          // this.rerender();
          
        }else{
          this.dataHeadValue.push({
            'edit_index_item':'0',
            'index_id': '0',
            'index_item': this.dataHeadValue.length + 1,
            'index_desc': '',
          });
          // this.rerender();
        }
      });
    }
  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    var student = JSON.stringify({
      // "judge_id": parseInt(this.rawDep.judge_id),
      // "judge_name": this.rawDep.judge_name,
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0234/search', student).subscribe(
      posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;

        if (productsJson.result == 1) {
          this.checklist = this.posts;
          this.checklist2 = this.posts;
          if (productsJson.length)
            this.posts.forEach((x: any) => x.edit0234 = false);
          this.dtTrigger.next(null);
          // this.rerender();
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
      return item.edit0234 == false;
    })
    // console.log("isChecked", isChecked);
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
      this.openbutton.nativeElement.click();
    }
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }


  loadMyChildComponent() {
    // this.loadComponent = true;
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
        "user_running": this.userData.userRunning,
        "password": chkForm.password,
        "log_remark": chkForm.log_remark,
        "userToken": this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson: any = JSON.parse(JSON.stringify(posts));
          if (productsJson.result == 1) {
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                var dataDel = [], dataTmp = [];
                var bar = new Promise((resolve, reject) => {
                  this.posts.forEach((ele, index, array) => {
                    if (ele.edit0234 == true) {
                      dataTmp.push(this.posts[index]);
                    }
                  });
                });
                if (bar) {
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0234/deleteSetup', data).subscribe(
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
        },
        (error) => { }
      );
    }
  }

  printReport() {
    var rptName = 'rct0234';

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprov_id" : this.prov_id.nativeElement["prov_id"].value,
    //   "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    // });
    this.printReportService.printReport(rptName, paramData);
  }

  getData() {
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0234', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      this.posts = productsJson.data;
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        if (productsJson.data.length)
          this.posts.forEach((x: any) => x.edit0234 = false);
        this.rerender();
      } else {
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
          }
          subscription.unsubscribe();
        });
      }
      this.SpinnerService.hide();
    });
  }

  delSetupDetail(index: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ต้องการลบข้อมูลใช่หรือไม่?');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) {
        subscription.unsubscribe();

        var student = JSON.stringify({
          "index_id": parseInt(this.dataHeadValue[index].index_id),
          "index_item": parseInt(this.dataHeadValue[index].index_item),
          "edit_index_item": parseInt(this.dataHeadValue[index].edit_index_item),
          "userToken": this.userData.userToken
        });
        this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0234/deleteSetupDetail', student).subscribe(
          posts => {
            let productsJson: any = JSON.parse(JSON.stringify(posts));
            if (productsJson.result == 1) {
              this.getSetUpDetail(this.dataHeadValue[index].index_id);
            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      }
    });
  }

  closeModal() {
    this.loadModalComponent = false;
  }

  closeWin(){
    window.close();
  }
}