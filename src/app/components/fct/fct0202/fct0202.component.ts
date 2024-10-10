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
import { NgSelectComponent } from '@ng-select/ng-select';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';

@Component({
  selector: 'app-fct0202,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0202.component.html',
  styleUrls: ['./fct0202.component.css']
})


export class Fct0202Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';
  posts: any;
  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  search: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  delValue: any;
  sessData: any;
  userData: any;
  programName: string;
  selectedCasetype: any = 'แพ่ง';
  selectedCaseFlag: number;
  getCaseType: any;
  selCaseType: any;
  getCaseFlag: any; selCaseFlag: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('fct0202', { static: true }) fct0202: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  //@ViewChild(NgSelectComponent) ngSelect: NgSelectComponent;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  //@ViewChild('sCaseFlag') sCaseFlag : NgSelectComponent;

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
      order: [[2, 'asc']]
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    this.http.get('/' + this.userData.appName + 'ApiCT/API/fct0202?userToken=' + this.userData.userToken + ':angular').subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      console.log(productsJson)
      this.posts = productsJson.data;
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        if (productsJson.data.length)
          this.posts.forEach((x: any) => x.editCaseCateId = false);
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
      "url_name": "fct0202"
    });
    this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers }).subscribe(
      (response) => {
        let getDataAuthen: any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        console.log(getDataAuthen)
      },
      (error) => { }
    )


    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name": "pcase_type",
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "order_by": "case_type ASC",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        console.log(getDataOptions)
        // this.selCaseType = this.getCaseType.find((o:any) => o.fieldIdValue === this.userData.defaultCaseType).fieldNameValue;
        this.selCaseType = this.getCaseType.filter((x: any) => x.fieldIdValue === this.userData.defaultCaseType)[0].fieldIdValue;
        //console.log(this.getCaseType)
        //console.log(this.userData.defaultCaseType)
        //console.log(this.selCaseType)
      },
      (error) => { }
    )

    this.getCaseFlag = [{ id: 1, text: 'ไกล่เกลี่ย' }, { id: 2, text: 'ประเด็น' }, { id: 3, text: 'สมานฉันท์' }, { id: 4, text: 'คดีศาลอื่น' }, { id: 5, text: 'คลีนิคจิตสังคม' }, { id: 6, text: 'บังคับคดีแทน' }, { id: 7, text: 'ชันสูตรพลิกศพ' }, { id: 8, text: 'คดีคุ้มครองสิทธิฯ' }, { id: 9, text: 'คัดถ่ายคำพิพากษา' }];

    //------------------ รหัสมาตราฐาน --------------------------
    var student = JSON.stringify({
      "table_name": "std_pcase_cate",
      "field_id": "std_id",
      "field_name": "std_code",
      "field_name2": "std_case_cate_name",
      "search_id": "", "search_desc": "",
      "userToken": this.userData.userToken
    });
    this.listTable = 'std_pcase_cate';
    this.listFieldId = 'std_id';
    this.listFieldName = 'std_code';
    this.listFieldName2 = 'std_case_cate_name';
    this.listFieldNull = '';
    //console.log(student)

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupStd', student, { headers: headers }).subscribe(
      (response) => {
        this.list = response;
        //console.log(response)
      },
      (error) => { }
    )
    //--------------------------------end รหัสมาตราฐาน---------------------
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
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  setFocus(name: any) {
    const ele = this.fct0202.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editCaseCateId = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.editCaseCateId == true;
    })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editCaseCateId = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  getCheckedItemList() {
    var del = "";
    this.delValue = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function (e, i) {
        if ($(this).prop("checked") == true) {
          if (del != '')
            del += ','
          del += $(this).val();
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
        this.delValue=del;
      })
    }, 100);
    
  }

  ClearAll() {
    window.location.reload();
  }


  loadMyModalComponent() {
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "100px");
  }


  /*uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
  }*/

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.fct0202.nativeElement["case_cate_id"].value) {
      confirmBox.setMessage('กรุณาระบุรหัสประเภทคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          //this.SpinnerService.hide();
          this.setFocus('case_cate_id');
        }
        subscription.unsubscribe();
      });

    } else if (!this.fct0202.nativeElement["case_cate_name"].value) {
      confirmBox.setMessage('กรุณาระบุประเภทคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          //this.SpinnerService.hide();
          this.setFocus('case_cate_name');
        }
        subscription.unsubscribe();
      });
    } else {


      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      if (this.fct0202.nativeElement["no_edit_flag"].checked == true) {
        var inputChk = 1;
      } else {
        var inputChk = 0;
      }
      var student = JSON.stringify({
        "edit_case_cate_id": this.fct0202.nativeElement["hid_case_cate_id"].value,
        "case_cate_id": this.fct0202.nativeElement["case_cate_id"].value,
        "case_cate_name": this.fct0202.nativeElement["case_cate_name"].value,
        "case_type": this.selCaseType,
        "case_flag": this.selCaseFlag,
        "std_id": this.fct0202.nativeElement["std_id"].value,
        "no_edit_flag": inputChk,
        "userToken": this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      if (this.fct0202.nativeElement["hid_case_cate_id"].value) {
        this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0202/updateJson', student, { headers: headers }).subscribe(
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
                  //this.SpinnerService.hide();
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
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              this.ngOnInit();
              //this.form.reset();
              // $("button[type='reset']")[0].click();

            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      } else {
        this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0202/saveJson', student, { headers: headers }).subscribe(
          (response) => {
            let alertMessage: any = JSON.parse(JSON.stringify(response));
            console.log(alertMessage)
            if (alertMessage.result == 0) {
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
            } else {
              this.SpinnerService.hide();
              confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  $("button[type='reset']")[0].click();
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              this.ngOnInit();
              //this.form.reset();
              // $("button[type='reset']")[0].click();

            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      }
    }

  }


  editData(val: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();
    //console.log('/'+this.userData.appName+'ApiCT/API/fct0202/edit?edit_case_cate_id='+val+'&userToken='+this.userData.userToken+':angular')
    this.http.get('/' + this.userData.appName + 'ApiCT/API/fct0202/edit?edit_case_cate_id=' + val + '&userToken=' + this.userData.userToken + ':angular').subscribe(edit => {
      //console.log(edit)
      this.SpinnerService.hide();
      let productsJson = JSON.parse(JSON.stringify(edit));
      console.log(productsJson)
      if (productsJson.result == 0) {
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
      } else {
        this.selCaseType = productsJson.data[0]['case_type'];
        this.renderer.setProperty(this.fct0202.nativeElement['hid_case_cate_id'], 'value', productsJson.data[0]['edit_case_cate_id']);
        this.renderer.setProperty(this.fct0202.nativeElement['case_cate_id'], 'value', productsJson.data[0]['case_cate_id']);
        this.renderer.setProperty(this.fct0202.nativeElement['case_cate_name'], 'value', productsJson.data[0]['case_cate_name']);
        this.renderer.setProperty(this.fct0202.nativeElement['std_id'], 'value', productsJson.data[0]['std_id']);
        if (this.list.filter((x: any) => x.fieldIdValue === productsJson.data[0]['std_id']).length > 0) {
          this.renderer.setProperty(this.fct0202.nativeElement['std_case_cate_name'], 'value', this.list.filter((x: any) => x.fieldIdValue === parseInt(productsJson.data[0]['std_id']))[0].fieldNameValue2);
        }
        if (this.getCaseFlag.filter((x: any) => x.id === productsJson.data[0]['case_flag']).length > 0) {
          this.selCaseFlag = productsJson.data[0]['case_flag'];
        }
        //
        /*
        var sel = this.getCaseType;
        for (var x = 0; x < sel.length; x++) {
          if(sel[x].fieldIdValue == productsJson.data[0]['case_type']){
            this.ngSelect.select(this.ngSelect.itemsList.findByLabel(this.getCaseType[x].fieldNameValue));
          }
        }
 
        var sel2 = this.selCaseFlag;
        for (var x = 0; x < sel2.length; x++) {
          if(sel2[x].id == productsJson.data[0]['case_flag']){
            this.sCaseFlag.select(this.sCaseFlag.itemsList.findByLabel(this.selCaseFlag[x].text));
          }
        }
        */
        if (productsJson.data[0]['no_edit_flag']) {
          this.fct0202.nativeElement["no_edit_flag"].checked = true;
        } else {
          this.fct0202.nativeElement["no_edit_flag"].checked = false;
        }
        this.setFocus('case_cate_id');
      }
    });
  }


  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (this.fct0202.nativeElement["no_edit_flag"].checked == true) {
      var inputChk = 1;
    } else {
      var inputChk = 0;
    }
    var student = JSON.stringify({
      "edit_case_cate_id": this.fct0202.nativeElement["hid_case_cate_id"].value,
      "case_cate_id": this.fct0202.nativeElement["case_cate_id"].value ? this.fct0202.nativeElement["case_cate_id"].value : 0,
      "case_cate_name": this.fct0202.nativeElement["case_cate_name"].value ? this.fct0202.nativeElement["case_cate_name"].value : '',
      "case_type": this.selCaseType ? this.selCaseType : 0,
      "case_flag": this.selCaseFlag  ? this.selCaseFlag : 0,
      "std_id": this.fct0202.nativeElement["std_id"].value ? this.fct0202.nativeElement["std_id"].value : 0,
      // "no_edit_flag": inputChk,
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0202/search', student, { headers: headers }).subscribe(
      posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
        console.log(productsJson)
        if (productsJson.result == 1) {
          this.checklist = this.posts;
          if (productsJson.length)
            this.posts.forEach((x: any) => x.editCaseType = false);
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
    this.fct0202.nativeElement[this.listFieldId].value = event.fieldIdValue;
    this.fct0202.nativeElement[this.listFieldName2].value = event.fieldNameValue2;
    this.closebutton.nativeElement.click();
  }

  loadMyChildComponent() {
    this.loadComponent = true;
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
          //this.SpinnerService.hide();
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
          //this.SpinnerService.hide();
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
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      this.http.post('/' + this.userData.appName + 'Api/API/checkPassword', student, { headers: headers }).subscribe(
        posts => {
          let productsJson: any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          if (productsJson.result == 1) {
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

            // Choose layout color type
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            this.delValue = $("body").find("input[name='delValue']").val();
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.SpinnerService.show();
                this.http.get('/' + this.userData.appName + 'ApiCT/API/fct0202/delete?delete_case_cate_id=' + this.delValue + '&userToken=' + this.userData.userToken + ':angular').subscribe(del => {
                  console.log(del);
                  this.closebutton.nativeElement.click();
                  this.ngOnInit();
                  this.SpinnerService.hide();
                });
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
    var rptName = 'rct0202';

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pcase_type" : this.fct0202.nativeElement["case_type"].value,
    //   "pcase_type_desc" : this.fct0202.nativeElement["case_type_desc"].value
    // });

    this.printReportService.printReport(rptName, paramData);
  }

  loadTableComponent(val: any) {
    this.loadModalComponent = false;
    this.loadComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "auto");
  }

  tabChange(obj: any) {
    if (obj.target.value) {
      this.renderer.setProperty(this.fct0202.nativeElement['std_case_cate_name'], 'value', this.list.find((x: any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue2);
    } else {
      this.fct0202.nativeElement['std_id'].value = "";
      this.fct0202.nativeElement['std_case_cate_name'].value = "";
    }
  }

  closeModal() {
    $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
  }
}