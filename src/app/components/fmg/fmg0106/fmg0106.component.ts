import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, OnDestroy, ViewChildren, QueryList, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PrintReportService } from 'src/app/services/print-report.service';
// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';
import { ExcelService } from '../../../services/excel.service.ts';
import { ActivatedRoute } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { stubFalse } from 'lodash';
import { copyFileSync } from 'fs';
declare var myExtObject: any;
// import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
@Component({
  selector: 'app-fmg0106,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg0106.component.html',
  styleUrls: ['./fmg0106.component.css']
})

export class Fmg0106Component implements AfterViewInit, OnInit, OnDestroy, AfterContentInit {
  //form: FormGroup;
  title = 'datatables';
  getCaseType: any;
  getRedTitle: any;
  getMaterial: any;
  sessData: any;
  userData: any;
  programName: any;
  authenData: any;
  result: any = [];
  dataSearch: any = [];
  itemsTmp: any = [];
  myExtObject: any;
  modalType: any;
  modalIndex: any;
  getAppoint: any;
  count: any;
  masterSelected1: boolean;
  masterSelected2: boolean;
  masterSelected3: boolean;
  checklist: any;
  delValue: any;
  JudgeGroup: any;
  Text: any;
  runId: any;
  order_no: any;

  party_data: any;//ผู้พิพากษาในองค์คณะ
  assign_data: any;//ข้อมูลการจ่าย

  deposit_level1: any;
  deposit_level2: any;
  deposit_level3: any;


  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldName3: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;



  public masterSelBurn: boolean = false;
  public masterSelBurn2: boolean = false;
  public masterSelBurn3: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public loadComponent: boolean = false;
  // public loadModalComponent: boolean = false;
  public loadMutipleComponent: boolean = false;
  public loadJudgeComponent: boolean = false;
  public loadModalAttachFileComponent: boolean = false;
  public loadModalJudgeGroupComponent: boolean = false;
  public loadModalReadTextComponent: boolean = false;
  public loadModalJudgePatyComponent: boolean = false;


  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  // @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChildren('jcalendar') jcalendar: QueryList<ElementRef>;
  @ViewChildren('icalendar') icalendar: QueryList<ElementRef>;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private printReportService: PrintReportService,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
  ) {
    this.masterSelected1 = false
    this.masterSelected2 = false
    this.masterSelected3 = false
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    // console.log(this.sessData);
    // console.log(this.userData);

    this.successHttp();

    this.setDefPage();
  }

  setDefPage() {
    this.result = [];
    this.getAppoint = [];
    this.result.data = 2;
    this.result.date_type = 2;
    // this.result.sdate = myExtObject.curDate();
    // this.result.edate = myExtObject.curDate();
    // this.searchData();
    this.getMaxJudgeAssign();

  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fmg0106"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          res => { // Success
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
            this.authenData = getDataAuthen;
            console.log(getDataAuthen)
            this.programName = getDataAuthen.programName;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
  }

  ngAfterContentInit(): void {
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  callCalendarSet() {
    myExtObject.callCalendar();
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  clearData() {
    this.result.sdate1="";
    this.result.edate1="";
  }

  assingDate(){
    this.result.sdate1=myExtObject.curDate();
    this.result.edate1=myExtObject.curDate();
  }

  getMaxJudgeAssign() {

    $(".form_assignment").html("");

    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });

    this.http.disableLoading().post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0106/getMaxJudgeLevelAssignment', student).subscribe(
      datalist => {
        let productsJson: any = JSON.parse(JSON.stringify(datalist));

        this.deposit_level1="<td>กลุ่มที่ 1 จ่ายถึงท่าน (-)</td>";
        this.deposit_level2="<td>กลุ่มที่ 2 จ่ายถึงท่าน (-)</td>";
        this.deposit_level3="<td>กลุ่มที่ 3 จ่ายถึงท่าน (-)</td>";
      
        if (productsJson.result==1) {
          productsJson.assign_data.forEach((ele, index1, array) => {
            if(ele.deposit_level == 1){
              ele.judge_party.forEach((ele2, index2, array) => {
                if(ele2.judge_id)
                  this.deposit_level1="<td>กลุ่มที่ 1  จ่ายถึงท่าน ("+ele2.judge_id+ " " + ele2.judge_name + ")</td>";
              });

              
            }else if(ele.deposit_level == 2){
              ele.judge_party.forEach((ele2, index2, array) => {
                if(ele2.judge_id)
                  this.deposit_level2="<td>กลุ่มที่ 2  จ่ายถึงท่าน ("+ele2.judge_id+ " " + ele2.judge_name + ")</td>";
              });
            }else if(ele.deposit_level == 3){
              ele.judge_party.forEach((ele2, index2, array) => {
                if(ele2.judge_id)
                  this.deposit_level3="<td>กลุ่มที่ 3  จ่ายถึงท่าน ("+ele2.judge_id+ " " + ele2.judge_name + ")</td>";
              });
            }
          });
        }

        let tmp = "<tr>" + this.deposit_level1+ "</tr>"+
        "<tr>" + this.deposit_level2+ "</tr>"+
        "<tr>" + this.deposit_level3+ "</tr>";

        setTimeout(() => {
          $(".form_assignment").html(tmp);
        }, 300);

      },
      (error) => { }
    );
  }

  directiveDateObj(index: any, obj: any) {
    if (obj == "assign_date")
      this.dataSearch[index][obj] = this.jcalendar.get(index).nativeElement.value;
    else
      this.dataSearch[index][obj] = myExtObject.curDate();

  }

  checkUncheckAll(type: any) {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0101 = this.masterSelected2;

      if (this.checklist[i].edit0101)
        this.dataSearch[i].case_judge_date = myExtObject.curDate();
      else
        this.dataSearch[i].case_judge_date = '';
    }

    this.getCheckedItemList(type);
  }

  isAllSelected(type: any, index: any) {
    if (type == 0) {
      this.masterSelected1 = this.checklist.every(function (item: any) {
        return item.skip_assign_auto == true;
      })
    } else if (type == 1) {
      this.masterSelected2 = this.checklist.every(function (item: any) {
        return item.edit0101 == true;
      })

      this.assignDate(index);

    } else if (type == 2) {
      this.masterSelected3 = this.checklist.every(function (item: any) {
        return item.own_new_flag == true;
      })
    }
    this.getCheckedItemList(type);
  }

  assignDate(index: any) {
    console.log(index,);
    if (this.checklist[index].edit0101)
      this.dataSearch[index].case_judge_date = myExtObject.curDate();
    else
      this.dataSearch[index].case_judge_date = '';
  }

  uncheckAll(type: any) {
    if (type == 0) {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].skip_assign_auto = this.masterSelected1;
      }

      this.masterSelected1 = false;
      $("body").find("input[name='delValue']").val('');
    } else if (type == 1) {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].edit0101 = this.masterSelected2;
      }

      this.masterSelected2 = false;
      $("body").find("input[name='delValue']").val('');
    } else if (type == 2) {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].own_new_flag = this.masterSelected3;
      }

      this.masterSelected3 = false;
      $("body").find("input[name='delValue']").val('');
    }
  }

  getCheckedItemList(type: any) {
    if (type == 0) {
      this.delValue = "";
      for (var i = 0; i < this.checklist.length; i++) {
        if (this.checklist[i].skip_assign_auto) {
          if (this.delValue != '')
            this.delValue += ','
          this.delValue += this.checklist[i].skip_assign_auto;
        }
      }
    } else if (type == 1) {
      this.delValue = "";
      for (var i = 0; i < this.checklist.length; i++) {
        if (this.checklist[i].edit0101) {
          if (this.delValue != '')
            this.delValue += ','
          this.delValue += this.checklist[i].edit0101;
        }
      }
    } else if (type == 2) {
      this.delValue = "";
      for (var i = 0; i < this.checklist.length; i++) {
        if (this.checklist[i].own_new_flag) {
          if (this.delValue != '')
            this.delValue += ','
          this.delValue += this.checklist[i].own_new_flag;
        }
      }
    }
  }

  saveDataSelect(type: any) {
    var isChecked = this.dataSearch.every(function (item: any) {
      return item.edit0101 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการจัดเก็บ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      var dataVal = [], dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
          if (ele.edit0101 == true) {
            dataTmp.push(this.dataSearch[index]);
          }
        });
      });
      if (bar) {
        dataVal['userToken'] = this.userData.userToken;
        dataVal['type'] = type;//type=1 จัดเก็บเฉพาะที่เลือก
        dataVal['data'] = dataTmp;
        if(type==2)
          dataVal['edit_flag'] = 1;//type=2 แก้ไขจ่ายสำนวนผิด
        else if(type==3)
          dataVal['edit_transfer'] = 1;//type=3 แก้ไขโอนสำนวน

        var data = $.extend({}, dataVal);

        this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0106/saveData', data).subscribe(
          (response) => {
            let alertMessage: any = JSON.parse(JSON.stringify(response));
            if (alertMessage.result == 0) {
              this.SpinnerService.hide();
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
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
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.searchData();
                  this.getMaxJudgeAssign();
                }
                subscription.unsubscribe();
              });
            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      }
    }
  }

  getAppointData(runId) {
    console.log("runId-" + runId);
    if (runId) {
      var student = JSON.stringify({
        "run_id": runId,
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiAP/API/APPOINT/getAppointData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          this.getAppoint = [];
          this.getAppoint = getDataOptions.data;
        },
        (error) => { }
      )
    }
  }

  curencyFormat(n: any, d: any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if ((this.result.data==1 || this.result.data==2) && (!this.result.sdate || !this.result.edate)) {
    // if ((this.result.sdate && !this.result.edate) || (!this.result.sdate && this.result.edate) ) {
      confirmBox.setMessage('กรุณาระบุ วันที่นัด ก่อนการค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    }else if (this.result.data==3 && ((!this.result.sdate1 || !this.result.edate1) && (!this.result.sdate || !this.result.edate))  ) {
        confirmBox.setMessage('กรุณาระบุ วันที่ ก่อนการค้นหา');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
    } else {

      // this.getMaxJudgeAssign();

      this.result["userToken"] = this.userData.userToken
      var student = $.extend({}, this.result);

      this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0106/searchData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.masterSelBurn = this.masterSelBurn2 = this.masterSelBurn3 = false;
          if (getDataOptions.result == 1) {
            this.dataSearch = getDataOptions.data;
            var bar = new Promise((resolve, reject) => {
              this.dataSearch.forEach((ele, index, array) => {
                ele.case_judge_id = ele.judge_id;
                ele.deposit = ele.deposit ? this.curencyFormat(ele.deposit, 2) : '';
                ele.edit0101 = false;
              });
            });
            if (bar) {
              if (this.dataSearch.length > 0)
                this.order_no = this.dataSearch.length
              else
                this.order_no = '';

              this.checklist = this.dataSearch;
              this.rerender();
              setTimeout(() => {
                this.callCalendarSet();
              }, 500);
            }
          } else {
            this.dataSearch = this.itemsTmp = [];
            this.rerender();

            this.SpinnerService.hide();
          }
        },
        (error) => { }
      )
    }
  }

  receiveFuncListData(event: any) {
    console.log(event);
    if (this.modalType == 1) {
      this.result.table_id = event.fieldIdValue;
      this.result.ptable_name = event.fieldNameValue;
    } else if (this.modalType == 4) {
      this.result.oid = event.fieldIdValue;
      this.result.oname = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  receiveFuncJudgeListData(event: any) {
    console.log(this.modalType, event);
    if (this.modalType == 2) {
      this.result.sjudge_id = event.judge_id;
      this.result.sjudge_name = event.judge_name;
    } else if (this.modalType == 3) {
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
    } else if (this.modalType == 4) {
      this.result.oid = event.judge_id;
      this.result.oname = event.judge_name;
    } else if (this.modalType == 5) {
      this.dataSearch[this.result.index].case_judge_id = event.judge_id;
      this.dataSearch[this.result.index].case_judge_name = event.judge_name;
      this.dataSearch[this.result.index].room_id = event.room_id;


      // this.dataSearch[this.result.index].assign_date = myExtObject.curDate();
      // วันที่จ่าย ให้เป็นวันที่ อธ. จ่ายให้องค์คณะ 
      this.dataSearch[this.result.index].assign_date = this.dataSearch[this.result.index].party_assign_date;

      this.dataSearch[this.result.index].case_judge_date = myExtObject.curDate();

    } else if (this.modalType == 6) {
      this.dataSearch[this.result.index].case_judge_gid = event.judge_id;
      this.dataSearch[this.result.index].case_judge_gname = event.judge_name;
    } else if (this.modalType == 7) {
      this.dataSearch[this.result.index].case_judge_gid2 = event.judge_id;
      this.dataSearch[this.result.index].case_judge_gname2 = event.judge_name;
    } else if (this.modalType == 8) {
      this.dataSearch[this.result.index].case_judge_gid3 = event.judge_id;
      this.dataSearch[this.result.index].case_judge_gname3 = event.judge_name;
    }
    this.closebutton.nativeElement.click();
  }

  closeModal() {
    // this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadMutipleComponent = false;
    this.loadJudgeComponent = false;
    this.loadModalJudgeGroupComponent = false;
    this.loadModalAttachFileComponent = false;
  }

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent() {
    if (this.modalType == 1) {

      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pappoint_table';
      this.listFieldId = 'table_id';
      this.listFieldName = "table_name";
      this.listFieldName2 = '';
      this.listFieldCond = "";
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          this.list = response;

          // this.loadModalComponent = false;
          this.loadComponent = false;
          this.loadMutipleComponent = true;
          this.loadJudgeComponent = false;
          this.loadModalJudgeGroupComponent = false;
          this.loadModalReadTextComponent = false;
          this.loadModalAttachFileComponent = false;
          this.loadModalJudgePatyComponent = false;

          $("#exampleModal").find(".modal-content").css("width", "650px");
        },
        (error) => { }
      )
    } else if (this.modalType == 2 || this.modalType == 3) {
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldName2 = '';
      this.listFieldCond = '';
      this.listFieldType = JSON.stringify({ "type": 2 });

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
          } else {
            this.list = [];
          }
          // this.loadModalComponent = false;
          this.loadComponent = false;
          this.loadMutipleComponent = false;
          this.loadJudgeComponent = true;
          this.loadModalJudgeGroupComponent = false;
          this.loadModalReadTextComponent = false;
          this.loadModalAttachFileComponent = false;
          this.loadModalJudgePatyComponent = false;

        },
        (error) => { }
      )

    } else if (this.modalType == 4) {
      if (this.result.uFlag == 'o') {
        var student = JSON.stringify({
          "table_name": "pofficer",
          "field_id": "off_id",
          "field_name": "off_name",
          "userToken": this.userData.userToken
        });
        this.listTable = 'pofficer';
        this.listFieldId = 'off_id';
        this.listFieldName = 'off_name';
        this.listFieldName2 = '';
        this.listFieldCond = "";

        this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
          (response) => {
            this.list = response;
            // this.loadModalComponent = false;
            this.loadComponent = true;
            this.loadJudgeComponent = false;
            this.loadModalJudgeGroupComponent = false;
            this.loadModalReadTextComponent = false;
            this.loadModalAttachFileComponent = false;
            this.loadModalJudgePatyComponent = false;

          },
          (error) => { }
        )
      } else if (this.result.uFlag == 'j') {
        var student = JSON.stringify({
          "cond": 2,
          "userToken": this.userData.userToken
        });
        this.listTable = 'pjudge';
        this.listFieldId = 'judge_id';
        this.listFieldName = 'judge_name';
        this.listFieldName2 = "position";
        this.listFieldType = JSON.stringify({ "type": 2 });

        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
          (response) => {
            let productsJson: any = JSON.parse(JSON.stringify(response));
            if (productsJson.data.length) {
              this.list = productsJson.data;
            } else {
              this.list = [];
            }

            // this.loadModalComponent = false;
            this.loadComponent = false;
            this.loadMutipleComponent = false;
            this.loadJudgeComponent = true;
            this.loadModalJudgeGroupComponent = false;
            this.loadModalReadTextComponent = false;
            this.loadModalAttachFileComponent = false;
            this.loadModalJudgePatyComponent = false;

          },
          (error) => { }
        )
      }
    } else if (this.modalType == 8) {
      $("#exampleModal").find(".modal-content").css({ "width": "900px" });
      this.loadComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalReadTextComponent = true;
      this.loadModalAttachFileComponent = false;
      this.loadModalJudgePatyComponent = false;


    } else if (this.modalType == 9) {
      $("#exampleModal").find(".modal-content").css({ "width": "950px" });
      // this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalReadTextComponent = false;
      this.loadModalAttachFileComponent = true;
      this.loadModalJudgePatyComponent = false;
    }
  }

  loadTableComponentArry(type: any, index: any) {
    this.openbutton.nativeElement.click();
    this.modalType = type;
    this.result.index = index;

    if (this.modalType == 5 || this.modalType == 6 || this.modalType == 7 || this.modalType == 8) {
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldName2 = "position";
      this.listFieldType = JSON.stringify({ "type": 2 });

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
          } else {
            this.list = [];
          }

          // this.loadModalComponent = false;
          this.loadComponent = false;
          this.loadMutipleComponent = false;
          this.loadJudgeComponent = true;
          this.loadModalJudgeGroupComponent = false;
          this.loadModalAttachFileComponent = false;
          this.loadModalJudgePatyComponent = false;

        },
        (error) => { }
      )
    } else if (this.modalType == 1) {
      this.listFieldType = JSON.stringify({ "type": 2 });
      $("#exampleModal").find(".modal-content").css({ "width": "650px" });
      this.modalType = '';
      this.listFieldType = this.dataSearch[this.result.index].party_id;
      // this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadModalJudgeGroupComponent = true;
      this.loadModalAttachFileComponent = false;
      this.loadModalJudgePatyComponent = false;


    } else if (this.modalType == 10) {
      $("#exampleModal").find(".modal-content").css({ "width": "650px" });
      this.loadComponent = false;
      this.loadMutipleComponent = false;
      this.loadJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
      this.loadModalAttachFileComponent = false;
      this.loadModalReadTextComponent = false;
      this.loadModalJudgePatyComponent = true;

    }
  }

  receiveJudgePartyArry(event: any) {
    console.log(event);
    var index = this.result.index;
    this.dataSearch[index]['party_id'] = event.party_id;
    this.dataSearch[index]['judge_name'] = event.judge_name;

    if (this.dataSearch[this.result.index].party_id)
      this.dataSearch[this.result.index].party_assign_date = myExtObject.curDate();

    this.checklist[this.result.index].edit0101 = true;

    this.closebutton.nativeElement.click();
  }

  receiveJudgeGroupListArry(event: any) {
    console.log(event);
    var index = this.result.index;
    this.dataSearch[index]['case_judge_id'] = event.judge_id1;
    this.dataSearch[index]['case_judge_name'] = event.judge_name1;
    this.dataSearch[index]['room_id'] = event.room_id;

    this.dataSearch[index]['case_judge_gid'] = event.judge_id2;
    this.dataSearch[index]['case_judge_gname'] = event.judge_name2;

    if (this.dataSearch[this.result.index].case_judge_id) {
      // this.dataSearch[this.result.index].assign_date = myExtObject.curDate();
      // วันที่จ่าย ให้เป็นวันที่ อธ. จ่ายให้องค์คณะ 
      this.dataSearch[this.result.index].assign_date = this.dataSearch[this.result.index].party_assign_date;
      this.dataSearch[this.result.index].case_judge_date = myExtObject.curDate();
    }
    this.dataSearch[this.result.index].edit0101 = true;

    this.closebutton.nativeElement.click();
  }

  changeParty(index: any) {
    if (!this.dataSearch[index].party_id) {
      this.dataSearch[index].judge_name = "";
      this.dataSearch[index].party_assign_date = "";
    }
  }

  tabChange(name: any, event: any) {
    if (name == 'table_id') {
      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "condition": " AND table_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));

          if (productsJson.length) {
            this.result.ptable_name = productsJson[0].fieldNameValue;
          } else {
            this.result.table_id = null;
            this.result.ptable_name = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'sjudge_id' || name == 'judge_id') {

      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "condition": " AND judge_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));

          if (productsJson.length) {
            if (name == 'sjudge_id') {
              this.result.sjudge_name = productsJson[0].fieldNameValue;
            } else if (name == 'judge_id') {
              this.result.judge_name = productsJson[0].fieldNameValue;
            }
          } else {
            if (name == 'sjudge_id') {
              this.result.sjudge_id = null;
              this.result.sjudge_name = '';
            } else if (name == 'judge_id') {
              this.result.judge_id = null;
              this.result.judge_name = '';
            }
          }
        },
        (error) => { }
      )
    }
  }

  tabChangeInputArry(index: any, name: any, event: any, type: any) {
    this.modalType = type;
    if (name == 'case_judge_id' || name == 'case_judge_gid' || name == 'case_judge_gid2' || name == 'case_judge_gid3') {
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "condition": " AND judge_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          this.dataSearch[index]['edit0101'] = true;
          if (productsJson.length) {
            if (name == 'case_judge_id') {
              this.dataSearch[index]['case_judge_name'] = productsJson[0].fieldNameValue;
              // this.dataSearch[index].assign_date = myExtObject.curDate();
              // วันที่จ่าย ให้เป็นวันที่ อธ. จ่ายให้องค์คณะ 
              this.dataSearch[index].assign_date = this.dataSearch[index].party_assign_date;

              this.dataSearch[index].case_judge_date = myExtObject.curDate();
            } else if (name == 'case_judge_gid') {
              this.dataSearch[index]['case_judge_gname'] = productsJson[0].fieldNameValue;
            } else if (name == 'case_judge_gid2') {
              this.dataSearch[index]['case_judge_gname2'] = productsJson[0].fieldNameValue;
            } else if (name == 'case_judge_gid3') {
              this.dataSearch[index]['case_judge_gname3'] = productsJson[0].fieldNameValue;
            }
          } else {
            if (name == 'case_judge_id') {
              this.dataSearch[index]['case_judge_id'] = null;
              this.dataSearch[index]['case_judge_name'] = '';
              this.dataSearch[index].assign_date = '';
              this.dataSearch[index].case_judge_date = '';
            } else if (name == 'case_judge_gid') {
              this.dataSearch[index]['case_judge_gid'] = null;
              this.dataSearch[index]['case_judge_gname'] = '';
            } else if (name == 'case_judge_gid2') {
              this.dataSearch[index]['case_judge_gid2'] = null;
              this.dataSearch[index]['case_judge_gname2'] = '';
            } else if (name == 'case_judge_gid3') {
              this.dataSearch[index]['case_judge_gid3'] = null;
              this.dataSearch[index]['case_judge_gname3'] = '';
            }


          }
        },
        (error) => { }
      )
    }
  }

  retToPage(type: any, name: any) {
    console.log(type);
    if (type == 1) {
      let winURL = this.authService._baseUrl.substring(0, this.authService._baseUrl.indexOf("#") + 1) + '/' + 'fmg0101';
      myExtObject.OpenWindowMax(winURL);
      console.log(winURL);
    } else if (type == 2) {
      let winURL = this.authService._baseUrl.substring(0, this.authService._baseUrl.indexOf("#") + 1) + '/' + 'fmg0200';
      myExtObject.OpenWindowMax(winURL + '?run_id=' + name);
      console.log(winURL + '?run_id=' + name);
    } else if (type == 3) {
      let winURL = this.authService._baseUrl.substring(0, this.authService._baseUrl.indexOf("#") + 1) + '/' + 'fmg2100';
      myExtObject.OpenWindowMax(winURL + '?date_appoint=' + myExtObject.conDate(name));
      console.log(winURL);
    } else if (type == 4) {
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      console.log(this.authenData)
      if (this.authenData.userFlag == 'j')
        myExtObject.OpenWindowMaxName(winURL + 'judge_appoint?judge_id=' + this.authenData.userCode + '&judge_name=' + this.authenData.offName);
      else
        myExtObject.OpenWindowMaxName(winURL + 'judge_appoint');
    }
  }

  printPlew() {
    var isChecked = this.dataSearch.every(function (item: any) {
      return item.edit0101 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกข้อมูลคดีที่ต้องการพิมพ์ปลิว');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      var dataVal = [], dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
          if (ele.edit0101 == true) {
            dataTmp.push(this.dataSearch[index].run_id);
          }
        });
      });
      if (bar) {
        var rptName = 'rca2100';
        var paramData = '{}';
        var paramData = JSON.stringify({
          "pdate_appoint": myExtObject.conDate(myExtObject.curDate()),
          "judge_name": '',
          "ptype": '',
          "proom": '',
          "pgroup": '',
          "prun_id": dataTmp.toString(),
          "pprint_type": '',
          "pprint_by": 1,

        });
        console.log(paramData);
        this.printReportService.printReport(rptName, paramData);
      }
    }
  }
  //ไฟล์แนบสำนวน
  onOpenAttachFile(run_id: any) {
    this.runId = run_id
    this.clickOpenMyModalComponent(9);
  }

  //ใจความฟ้อง
  onOpenReadText(text: any) {
    this.Text = text
    this.clickOpenMyModalComponent(8);
  }

  printRpt() {
    var rptName = 'rfmg0106';

    // For no parameter : paramData ='{}'
    var paramData = '{}';
    var pcon = '';
    // For set parameter to report
    var paramData = JSON.stringify({
      "pcondition": this.result.pcon,
      "pquery": this.result.pquery ? this.result.pquery : ''
    });
    console.log(paramData);

    this.printReportService.printReport(rptName, paramData);
  }

  importAssignment() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0106/importAssignment', student).subscribe(
      datalist => {
        let productsJson: any = JSON.parse(JSON.stringify(datalist));
        console.log(productsJson)
        if (productsJson.result == 0) {
          this.SpinnerService.hide();
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
        } else {
          this.SpinnerService.hide();

          confirmBox.setMessage(productsJson.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
            }
            subscription.unsubscribe();
          });
        }
      },
      (error) => { }
    );
  }

  getJudgePartyIndex(obj: any, judge_id: any): number {
    // console.log(obj)
    let tmp: number = 0;
    var bar = new Promise((resolve, reject) => {
      if (obj.length) {
        // console.log(obj)
        obj.forEach((ele, index, array) => {
          // console.log(ele.judge_id == judge_id,index === obj.length - 1,index,ele.judge_id ,judge_id)
          if (ele.judge_id == judge_id) {
            if (index === obj.length - 1)
              tmp = 0;
            else
              tmp = parseInt(index + 1);
          }
          if (index === obj.length - 1) resolve(null);
        });
      } else { resolve(null) }
    });
    if (bar) {
      // console.log(tmp)
      return tmp;
    } else {
      // console.log(tmp)
      return tmp;
    }
  }

  assignAutoJudgeParty() {
    var isChecked = this.dataSearch.every(function (item: any) {
      return item.edit0101 == false;
    })
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกข้อมูลคดีที่ต้องจ่ายสำนวน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();
      var bar = new Promise((resolve, reject) => {
        var student = JSON.stringify({
          "skip_assign_auto": 1,
          "userToken": this.userData.userToken
        });
        // console.log(student)
        this.http.disableLoading().post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0106/getJudgePartyData', student).subscribe(
          datalist => {
            let productsJson: any = JSON.parse(JSON.stringify(datalist));
            console.log(productsJson)
            if (productsJson.party_data.length) {
              this.party_data = productsJson.party_data;
              // console.log(this.party_data)
              //-----------------------------------------------------------------
              this.http.disableLoading().post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg0106/getMaxJudgeLevelAssignment', student).subscribe(
                datalist => {
                  let productsJson: any = JSON.parse(JSON.stringify(datalist));
                  // console.log(productsJson)
                  if (productsJson.assign_data.length) {
                    this.assign_data = productsJson.assign_data;
                    // console.log(this.assign_data)
                    resolve(null);
                  }
                },
                (error) => { }
              );
              //---------------------------------------------------------------
            }(error) => { }
          },
          (error) => { }
        );
      });
      bar.then(() => {
        this.dataSearch.forEach((ele, index, array) => {
          var tmp_level = [];
          var tmp_party_id = "";
          var tmp_party_id_index = 0;
          var tmp_judge_id = "";
          // console.log(ele.deposit_level)
          if (ele.edit0101 == true) {
            var bar = new Promise((resolve, reject) => {
              tmp_party_id = this.dataSearch[index]['deposit_level'];
              tmp_level = this.assign_data[parseInt(ele.deposit_level) - 1].judge_party;
              tmp_level.forEach((e, i, array) => {
                // if (tmp_party_id == e.party_id) {
                  tmp_judge_id = e.judge_id;//หาคนจ่ายล่าสุด
                  tmp_party_id_index = i;
                // }
              });
            });
            if (bar) {
              
              // console.log(this.party_data,tmp_party_id , tmp_judge_id,tmp_party_id_index);
              // console.log(this.getJudgePartyIndex(this.party_data[parseInt(tmp_party_id) - 1].judge_id, tmp_judge_id));
              let judge_id_index=this.getJudgePartyIndex(this.party_data, tmp_judge_id);  
              // console.log(judge_id_index);
              // console.log(parseInt(this.party_data[judge_id_index].judge_id), this.party_data[judge_id_index].judge_name);

              this.assign_data[parseInt(ele.deposit_level) - 1].judge_party[tmp_party_id_index].judge_id = parseInt(this.party_data[judge_id_index].judge_id);
              this.assign_data[parseInt(ele.deposit_level) - 1].judge_party[tmp_party_id_index].judge_name = this.party_data[judge_id_index].judge_name;

              // console.log(this.assign_data);

              var tmp_judge_party = this.party_data[judge_id_index].judge_party;
              // console.log(tmp_judge_party);

              //จัดเก็บ รหัสคณะลง pcase
              this.dataSearch[index]['party_id'] = this.party_data[judge_id_index].party_id.toString();
              this.dataSearch[index]['party_assign_date'] = myExtObject.curDate();

              // วันที่จ่ายสำนวน ให้เป็นวันที่ จ่ายให้องค์คณะ            
              this.dataSearch[index].assign_date = this.dataSearch[index].party_assign_date;

              //ผู้พิพากษาเจ้าของสำนวน
              this.dataSearch[index]['case_judge_id'] = parseInt(this.party_data[judge_id_index].judge_id);
              this.dataSearch[index]['case_judge_name'] = this.party_data[judge_id_index].judge_name;


              let judge_gid_index=this.getJudgePartyIndex(this.party_data[judge_id_index].judge_party, parseInt(this.party_data[judge_id_index].judge_id));
              // console.log(judge_gid_index); 

              //องค์คณะที่ 1
              if(this.party_data[parseInt(tmp_party_id) - 1].judge_party.length>=2){
                if (judge_gid_index < this.party_data[parseInt(tmp_party_id) - 1].judge_party.length) {
                  this.dataSearch[index]['case_judge_gid'] = parseInt(tmp_judge_party[judge_gid_index].judge_id);
                  this.dataSearch[index]['case_judge_gname'] = tmp_judge_party[judge_gid_index].judge_name;
                }else{
                  let tmp = judge_gid_index - this.party_data[parseInt(tmp_party_id) - 1].judge_party.length
                  this.dataSearch[index]['case_judge_gid'] = parseInt(tmp_judge_party[tmp].judge_id);
                  this.dataSearch[index]['case_judge_gname'] = tmp_judge_party[tmp].judge_name;
                }
              }else{
                this.dataSearch[index]['case_judge_gid'] = "";
                  this.dataSearch[index]['case_judge_gname'] = "";
              }

              //องค์คณะที่ 2
              if((this.party_data[parseInt(tmp_party_id) - 1].judge_party.length>=3)  && (ele.deposit_level !=1)){//ถ้า deposit_level=1 ไม่ต้องจ่ายองค์ 2
                if (judge_gid_index+1 < this.party_data[parseInt(tmp_party_id) - 1].judge_party.length) {
                  this.dataSearch[index]['case_judge_gid2'] = parseInt(tmp_judge_party[judge_gid_index+1].judge_id);
                  this.dataSearch[index]['case_judge_gname2'] = tmp_judge_party[judge_gid_index+1].judge_name;
                }else{
                  let tmp = judge_gid_index+1 - this.party_data[parseInt(tmp_party_id) - 1].judge_party.length
                  this.dataSearch[index]['case_judge_gid2'] = parseInt(tmp_judge_party[tmp].judge_id);
                  this.dataSearch[index]['case_judge_gname2'] = tmp_judge_party[tmp].judge_name;
                }
              }else{
                this.dataSearch[index]['case_judge_gid2'] = "";
                  this.dataSearch[index]['case_judge_gname2'] = "";
              }

              //องค์คณะที่ 3
              if(this.party_data[parseInt(tmp_party_id) - 1].judge_party.length>=4){
                if (judge_gid_index+2 < this.party_data[parseInt(tmp_party_id) - 1].judge_party.length) {
                  this.dataSearch[index]['case_judge_gid3'] = tmp_judge_party[judge_gid_index+2].judge_id;
                  this.dataSearch[index]['case_judge_gname3'] = tmp_judge_party[judge_gid_index+2].judge_name;
                }else{
                  let tmp = judge_gid_index+2 - this.party_data[parseInt(tmp_party_id) - 1].judge_party.length
                  // console.log("3-"+tmp+":"+tmp_judge_party[tmp].judge_id+ tmp_judge_party[tmp].judge_name)
                  this.dataSearch[index]['case_judge_gid3'] = tmp_judge_party[tmp].judge_id;
                  this.dataSearch[index]['case_judge_gname3'] = tmp_judge_party[tmp].judge_name;
                }
              }else{
                this.dataSearch[index]['case_judge_gid3'] = "";
                this.dataSearch[index]['case_judge_gname3'] = "";
              }
              this.SpinnerService.hide();
              //----------------------------------------------------------------------------
              //----------------------------------------------------------------------------
            } else {
              this.SpinnerService.hide();
            }
          }
        });

        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ทำการกำหนดเจ้าของสำนวนให้อัตโนมัติแล้ว กรุณาตรวจสอบและจัดเก็บอีกครั้ง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });

      })
    }
  }

  
  showObj(e: any) {
    setTimeout(() => {
      $('body').find('.xdsoft_datetimepicker').each(function () {
        if ($(this).css("display") === "block") {
          $(this).css("left", e.pageX - 100)
        }
      });
    }, 200);
  }

  clearAll() {
    window.location.reload();
  }

  openNav() {
  }

  closeNav() {
  }
}