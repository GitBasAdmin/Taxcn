import { Component, OnInit, ViewChild, NgZone, ElementRef, AfterViewInit, OnDestroy, Injectable, Input, Output, EventEmitter, AfterContentInit, ViewChildren, QueryList, ViewEncapsulation,SimpleChanges  } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { tap, map, catchError, startWith } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerService } from "ngx-spinner";
import { PrintReportService } from '@app/services/print-report.service';
declare var myExtObject: any;


@Component({
  selector: 'app-fgu0100-tab1',
  templateUrl: './fgu0100-tab1.component.html',
  styleUrls: ['./fgu0100-tab1.component.css']
})
export class Fgu0100Tab1Component implements AfterViewInit, AfterContentInit, OnInit, OnDestroy {
  result: any = [];
  resultTab1: any = [];
  resultTmp: any = [];
  appData: any = [];
  asData: any = [];
  dataHeadValue: any = [];
  getDefType: any;
  getReleaseType: any;
  getAccuStatus: any;
  sessData: any;
  userData: any;
  appealSend: any;
  appealType: any;
  programName: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  myExtObject: any;
  modalType: any;
  delIndex: any;
  guarRunning: any;
  getGuarOrder: any;
  GuarDefObj: any = [];
  GuarDefDataObj: any = [];
  visibleApp: boolean = false;
  run_id: any;
  public dataSendHead: any

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldName3: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;


  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadModalLitigantComponent: boolean = false;

  @Output() onClickList = new EventEmitter<any>();
  //obsStates: Observable<any[]>;
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @Input() set getDataHead(getDataHead: any) {//รับจาก fgu0100
    console.log(getDataHead)
    this.dataSendHead = getDataHead;
    if (typeof getDataHead != 'undefined') {
      this.setDefPage();
      if (this.dataSendHead.run_id) {
        console.log(this.dataSendHead.run_id);
        this.dataHeadValue.run_id = this.dataSendHead.run_id;
        this.result.run_id = this.dataHeadValue.run_id;
        this.run_id = this.dataHeadValue.run_id;
        console.log('RunId==>', this.result.run_id);
      }
    }

    if (this.result.guar_running) {
      // alert('DataHead');
      this.guarDefData();
    } else {
      this.GuarDefDataObj = [];
    }

  }
  @Input() set sendEdit(sendEdit: any) {//รับจาก fgu0100
    console.log(sendEdit)
    if (typeof sendEdit != 'undefined')
      this.editData(sendEdit.data);
    console.log(this.result.guar_running)
    if (this.result.guar_running) {
      // alert('EditData');
      this.guarDefData();
    } else {
      this.GuarDefDataObj = [];
    }
  }

  /*ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    if (changes['sendEdit'] && changes['sendEdit'].currentValue) {
      const sendEditValue = changes['sendEdit'].currentValue;
      
      if (sendEditValue.data && sendEditValue.data.data && sendEditValue.data.data[0]) {
        const tmp = sendEditValue.data.data[0];
        
        if (tmp.guar_running) {
          this.guarDefData();
        } else {
          this.GuarDefDataObj = [];
        }
      }
    } else {
      console.log('sendEdit is undefined or does not have the expected structure');
    }
  }*/
  


  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
    private _ngZone: NgZone,
    private printReportService: PrintReportService,
  ) {
    (<any>window).angularFunc = { callFuncFromOutside: this.callFuncFromOutside, zone: _ngZone };
    document.addEventListener('click', this.printMousePos, true);
  }
  printMousePos(e: any) {
    //console.log( "pageX: " + e.pageX +",pageY: " + e.pageY );
    setTimeout(() => {
      $('body').find('.ng-dropdown-panel.ng-select-top').css({ 'bottom': e.pageY + 'px' });
    }, 100);
  }
  callFuncFromOutside() {
    console.log('run')
    console.log(this.result)
    //console.log({'run_id':this.dataSendHead.run_id,'guar_running':this.result.guar_running});
    //this.onClickListData({'run_id':this.dataSendHead.run_id,'guar_running':this.result.guar_running});
  }
  ngOnInit(): void {
    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.dtOptions2 = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false
    };

    console.log(window)
    if (typeof this.dataSendHead == 'undefined')
      this.setDefPage();

  }

  setDefPage() {
    this.result = [];
    // this.result.app_type_id = 0;

    this.DefType();
    this.ReleaseType();
    this.GuarOrder();
    this.AccuStatus();
    this.result.def_type = 2;
    this.result.guar_cost = '0.00';
    this.result.guar_permit = 2;
    this.result.send_date = myExtObject.curDate();
    // this.result.appeal_type = 1;
    // this.getAppealType(1,2);
    // this.result.close_by = 0;
    // this.result.send_by = 0;

    // this.runSeq();
    //console.log(999)
  }

  checkCenter() {
    confirm('การตรวจสอบข้อมูลจากส่วนกลางจะใช้เวลาประมวลผล 5 -10 วินาที');
  }

  DefType() {
    var student = JSON.stringify({
      "table_name": "plit_type",
      "field_id": "lit_type",
      "field_name": "lit_type_desc",
      "order_by": " lit_type ASC",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getDefType = getDataOptions;
        // if(!this.result.to_court)
        //   this.result.to_court = getDataOptions[0].fieldIdValue;
      },
      (error) => { }
    )
  }

  ReleaseType() {
    var student = JSON.stringify({
      "table_name": "prelease_type",
      "field_id": "release_type_id",
      "field_name": "release_type_name",
      "order_by": " release_type_id ASC",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getReleaseType = getDataOptions;
        // if(!this.result.to_court)
        //   this.result.to_court = getDataOptions[0].fieldIdValue;
      },
      (error) => { }
    )
  }

  GuarOrder() {
    var student = JSON.stringify({
      "table_name": "pguar_order",
      "field_id": "order_id",
      "field_name": "order_name",
      "order_by": " order_id ASC",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getGuarOrder = getDataOptions;
        // if(!this.result.to_court)
        //   this.result.to_court = getDataOptions[0].fieldIdValue;
      },
      (error) => { }
    )
  }

  AccuStatus() {
    var student = JSON.stringify({
      "table_name": "paccu_status",
      "field_id": "status_id",
      "field_name": "status_desc",
      "order_by": " status_id ASC",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getAccuStatus = getDataOptions;
        // if(!this.result.to_court)
        //   this.result.to_court = getDataOptions[0].fieldIdValue;
      },
      (error) => { }
    )
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
    });
    this.dtTrigger.next(null);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }
  ngAfterContentInit(): void {
    //console.log(88)
    myExtObject.callCalendar();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  guarDefData() {
    // if(!this.result.id){
    // console.log(this.result.guar_title);
    // console.log(this.result.guar_yy);
    //  if(this.result.guar_title && this.result.guar_yy){
    // alert('runGuarlast');
    this.GuarDefDataObj = [];
    var student = JSON.stringify({
      "guar_running": this.result.guar_running,
      "userToken": this.userData.userToken
    });
    console.log(student)

    let promise = new Promise((resolve, reject) => {
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/guarDefData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          if (getDataOptions.result == 1) {
            console.log(getDataOptions);
            this.GuarDefObj = getDataOptions;
            this.GuarDefDataObj = getDataOptions.data;
            console.log('GuarDefObj==>', this.GuarDefObj);
            console.log('GuarDefDataObj==>', this.GuarDefDataObj);

            this.rerender();

            var bar = new Promise((resolve, reject) => {
              getDataOptions.data.forEach((ele, index, array) => {

                if (ele.guar_cost != null) {
                  getDataOptions.data[index]['guar_cost_format'] = this.curencyFormat(ele.guar_cost, 2);
                }
                // if(ele.run_id != null){
                //   this.pgrcv_running.push(ele.run_id);
                // }
              });
            });

            bar.then(() => {

              // this.dataSearch = productsJson.data;
              //console.log(this.dataSearch)
            });

            if (bar) {
              // this.dataSearch = productsJson.data;
              // this.dataS = productsJson;
              // this.deposit = this.curencyFormat(productsJson.deposit,2);
              // this.rerender();
              //this.dtTrigger.next(null);
              // console.log(this.dataSearch)
            }

            // this.getHeadNew();
            // this.sendCaseData.emit(this.headnew);
          }
        },
        (error) => { }
      )
    });
    return promise;
    //  }
    //  }
  }

  ChangeStatus(val: any) {
    if (val == 1) {
      this.result.status = 2;
    } else {
      this.result.status = '';
    }
  }

  saveTab1() {
    // alert(this.guarRunning);
    if (this.guarRunning) {
      this.result.guar_running = this.guarRunning;
      console.log('GuarDefDataObj==>', this.GuarDefDataObj);
      this.AssignResultTab1(this.GuarDefDataObj);
      // if(this.result.title || this.result.id || this.result.yy){
      var dataDel = [], dataTmp = [];
      var bar = new Promise((resolve, reject) => {
        // this.seekNoData.forEach((ele, index, array) => {
        //  // if(ele.edit0102 == true){
        //  if(ele.s_seq == this.delIndexAlle){
        //    dataTmp.push(this.seekNoData[index]);
        //   }
        //     });
      });
      if (bar) {
        //console.log(dataTmp)
        // dataDel['run_id'] = this.result.run_id;
        // // console.log('hResult==>',this.Head.hResult.case_type);
        // dataDel['case_type'] = this.result.case_type;
        // dataDel['case_cate_id'] = this.result.case_cate_id ? this.result.case_cate_id : 1;
        // dataDel['title'] = this.result.title;
        // dataDel['id'] = this.result.id;
        // dataDel['yy'] = this.result.yy;
        // dataDel['court_id'] = this.userData.courtId;
        // dataDel['num_nofrom'] = this.result.num_nofrom ? parseInt(this.result.num_nofrom) : 1;
        if (this.result.guar_running) {
          console.log('Oldddddddddddd');
          // console.log(this.caseDataObj);
          this.result.guar_cost = this.curencyFormatRevmove(this.result.guar_cost);
          this.resultTab1.run_id = this.run_id
          dataTmp.push($.extend({}, this.resultTab1));
          // dataDel['data'] = this.caseDataObj.data;
          dataDel['data'] = dataTmp;
          // dataDel['data'] = this.caseDataObj.data;
          // dataDel['seek_no_data'] = this.caseDataObj.seek_data[0].seek_no_data;
        } else {
          console.log('Newwwwwwwwwwwwww');
          // dataTmp.push({send_date: myExtObject.curDate(),send_time: this.getTime()});
          this.resultTab1.run_id = this.run_id
          dataTmp.push($.extend({}, this.resultTab1));
          dataDel['data'] = dataTmp;

          // dataDel['seek_no_data'] = [];
        }

        dataDel['guar_running'] = this.result.guar_running ? this.result.guar_running : '';
        dataDel['userToken'] = this.userData.userToken;
        var data = $.extend({}, dataDel);
        console.log(data);
        console.log(JSON.stringify(data));
        // return false;
        this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/saveDefData', data).subscribe(
          (response) => {
            let alertMessage: any = JSON.parse(JSON.stringify(response));
            if (alertMessage.result == 0) {
              this.getMessage(alertMessage.error);
              // this.SpinnerService.hide();

            } else {
              // this.closebutton.nativeElement.click();
              //$("button[type='reset']")[0].click();
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  console.log(alertMessage);
                  this.guarDefData();
                  this.ClearTab1();
                  this.onClickList.emit({ 'run_id': this.run_id, 'guar_running': alertMessage.guar_running });
                  // this.closebutton.nativeElement.click();
                  // this.searchSeekData();
                  // this.searchData(2);
                }
                subscription.unsubscribe();
              });

            }
          },
          (error) => { }
        )
      }
      //  }

    } else {
      this.getMessage('ยังไม่ได้เลือกข้อมูลเลขที่คำร้อง');
    }
  }

  getAppealType(val: any, type: any) {
    //type 1คลิกจากหน้าจอ
    if (type == 1) {
      if (val == 3 || val == 4)
        this.result.to_court = 2;
      else
        this.result.to_court = this.appealSend[0].fieldIdValue;
    }
    var student = JSON.stringify({
      "table_name": "pappeal_type",
      "field_id": "app_type_id",
      "field_name": "app_type_name",
      "condition": " AND appeal_type='" + val + "'",
      "userToken": this.getToken
    });
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({ fieldIdValue: 0, fieldNameValue: '' });
        console.log(getDataOptions)
        this.appealType = getDataOptions;

      },
      (error) => { }
    )
  }

  getAppData() {
    if (typeof this.dataSendHead != 'undefined')
      this.appData = this.dataSendHead.appObj ? this.dataSendHead.appObj : [];
    else
      this.appData = [];
  }

  closeModal() {
    this.loadModalComponent = false;
    this.loadModalConfComponent = false;
    this.loadModalJudgeComponent = false;
  }

  ClearAll() {
    window.location.reload();
  }

  ClearTab1() {
    this.setDefPage();
  }

  receiveJudgeListData(event: any) {
    if (this.modalType == 4) {
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
      // this.result.order_judge_date = myExtObject.curDate();
    }
    this.closebutton.nativeElement.click();
  }

  receiveFuncListData(event: any) {
    if (this.modalType == 1) {
      this.result.def_type = event.lit_type;
      this.result.def_no = event.seq;
      this.result.def_name = event.lit_name;
    } else if (this.modalType == 2) {
      this.result.def_type = event.fieldNameValue3;
      this.result.def_no = event.fieldIdValue;
      this.result.def_name = event.fieldNameValue;
    } else if (this.modalType == 3) {
      if (typeof event.fieldIdValue != 'undefined') {
        // this.result.fee_id = event.fieldIdValue;
        this.result.permit_reason = event.fieldNameValue;
      }
    }
    this.closebutton.nativeElement.click();
  }


  getMessage(message: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage(message);
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) { }
      subscription.unsubscribe();
    });
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
      this.http.post('/' + this.userData.appName + 'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson: any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          if (productsJson.result == 1) {
            if (this.modalType == 20) {
              //console.log(this.delIndex)
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ยืนยันการลบข้อมูล');
              confirmBox2.setMessage('ต้องการลบข้อมูล ใช่หรือไม่');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');

              confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  if (this.modalType == 20) {
                    var student = JSON.stringify({
                      "data": [{ "guar_running": this.GuarDefDataObj[this.delIndex].guar_running, "item_no": this.GuarDefDataObj[this.delIndex].item_no }],
                      "userToken": this.userData.userToken
                    });
                    console.log(student)
                    this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/delDefData', student).subscribe(
                      (response) => {
                        let getDataOptions: any = JSON.parse(JSON.stringify(response));
                        console.log(getDataOptions)
                        const confirmBox3 = new ConfirmBoxInitializer();
                        confirmBox3.setTitle('ข้อความแจ้งเตือน');
                        if (getDataOptions.result == 1) {
                          //-----------------------------//
                          confirmBox3.setMessage('ลบข้อมูลเรียบร้อยแล้ว');
                          confirmBox3.setButtonLabels('ตกลง');
                          confirmBox3.setConfig({
                            layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                            if (resp.success == true) {
                              this.ClearTab1();
                              if (!this.result.guar_running) {
                                this.result.guar_running = this.GuarDefDataObj[this.delIndex].guar_running;
                              }
                              if (!this.result.run_id) {
                                this.result.run_id = this.run_id;
                              }
                              this.guarDefData();
                              //this.setDefPage();
                              // this.loadAsData();
                            }
                            subscription3.unsubscribe();
                          });
                          //-----------------------------//

                        } else {
                          //-----------------------------//
                          confirmBox3.setMessage(getDataOptions.error);
                          confirmBox3.setButtonLabels('ตกลง');
                          confirmBox3.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                            if (resp.success == true) {
                              this.SpinnerService.hide();
                            }
                            subscription3.unsubscribe();
                          });
                          //-----------------------------//
                        }

                      },
                      (error) => { }
                    )
                  }

                }
                subscription2.unsubscribe();
              });

            }
            this.closebutton.nativeElement.click();
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

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent() {
    $(".modal-backdrop").remove();
    if (this.modalType == 1) {
      $("#exampleModaltab1").find(".modal-content").css("width", "650px");
      var student = JSON.stringify({
        "table_name": "pcase_litigant",
        "field_id": "seq",
        "field_name": "name",
        "field_name2": "lit_type",
        "condition": " AND run_id = " + this.run_id,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pcase_litigant';
      this.listFieldId = 'seq';
      this.listFieldName = 'name';
      this.listFieldName2 = 'lit_type';
      this.listFieldCond = "";
    } else if (this.modalType == 2) {
      $("#exampleModaltab1").find(".modal-content").css("width", "650px");
      var student = JSON.stringify({
        "table_name": "pcase_litigant",
        "field_id": "seq",
        "field_name": "CONCAT(title || name , '') AS fieldNameValue",
        "field_name3": "lit_type",
        "condition": " AND lit_type = " + this.result.def_type + " AND run_id = " + this.run_id + " ",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pcase_litigant';
      this.listFieldId = 'seq';
      this.listFieldName = "CONCAT(title || name , '') AS fieldNameValue";
      this.listFieldName2 = '';
      this.listFieldName3 = 'lit_type';
      this.listFieldCond = " AND lit_type = " + this.result.def_type + " AND run_id = " + this.run_id + " ";
    } else if (this.modalType == 3) {
      $("#exampleModaltab1").find(".modal-content").css("width", "650px");
      var student = JSON.stringify({
        "table_name": "pguar_order",
        "field_id": "order_id",
        "field_name": "order_name",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pguar_order';
      this.listFieldId = 'order_id';
      this.listFieldName = 'order_name';
      this.listFieldCond = "";
    } else if (this.modalType == 4) {
      $("#exampleModal_main").find(".modal-content").css({ "width": "650px" });
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldNull = '';
      this.listFieldType = JSON.stringify({ "type": 2 });
      this.loadModalJudgeComponent = true;
      this.loadModalComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalLitigantComponent = false;
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
            console.log(this.list)
          } else {
            this.list = [];
          }
        },
        (error) => { }
      )
    } else if (this.modalType == 20) {
      this.loadModalComponent = false;
      this.loadModalConfComponent = true;
      this.loadModalJudgeComponent = false;
      this.loadModalLitigantComponent = false;
      $("#exampleModaltab1").find(".modal-content").css("width", "650px");
      $("#exampleModaltab1").find(".modal-body").css("height", "auto");
      $("#exampleModaltab1").css({ "background": "rgba(51,32,0,.4)" });
    }
    if (this.modalType == 2 || this.modalType == 3) {
      console.log(student)
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
          this.loadModalComponent = true;
          this.loadModalConfComponent = false;
          this.loadModalLitigantComponent = false;
        },
        (error) => { }
      )
      $("#exampleModaltab1").find(".modal-body").css("height", "auto");
      $("#exampleModaltab1").css({ "background": "rgba(51,32,0,.4)" });

    } else if (this.modalType == 1) {
      console.log(student)
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
          this.loadModalComponent = false;
          this.loadModalConfComponent = false;
          this.loadModalLitigantComponent = true;
        },
        (error) => { }
      )
      $("#exampleModaltab1").find(".modal-body").css("height", "auto");
      $("#exampleModaltab1").css({ "background": "rgba(51,32,0,.4)" });
    }

  }

  tabChangeInput(name: any, event: any) {
    if (name == 'fee_id') {
      var student = JSON.stringify({
        "table_name": "pcourt_fee",
        "field_id": "seq",
        "field_name": "fee_desc",
        "condition": " AND seq='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.fee_desc = productsJson[0].fieldNameValue;
          } else {
            this.result.fee_id = '';
            this.result.fee_desc = '';
          }
        },
        (error) => { }
      )
    } else if (name == "judge_id") {
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "condition": " AND judge_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.judge_name = productsJson[0].fieldNameValue;
          } else {
            this.result.judge_id = '';
            this.result.judge_name = '';
          }
        },
        (error) => { }
      )
    }
  }

  editData(obj: any) {
    console.log(obj)
    // if(obj.data[0].guar_running){
    //   console.log(obj.data[0].guar_running);
    // }
    if (typeof obj != 'undefined') {
      this.dataHeadValue.run_id = obj.data[0].run_id;
      this.result.run_id = obj.data[0].run_id;
      this.run_id = obj.data[0].run_id;
      this.result.guar_running = obj.data[0].guar_running;
      this.guarRunning = obj.data[0].guar_running;
      console.log('GuarRunning==>', this.result.guar_running);
      console.log(obj.data[0].run_id);
      if (obj.guar_running == 0) {
        this.setDefPage();
      } else {
        //this.SpinnerService.show();
        setTimeout(() => {
          this.result = JSON.parse(JSON.stringify(obj.data));
          console.log('Result==>', this.result);
          // this.result.appeal_type = this.result.appeal_type?parseInt(this.result.appeal_type):this.result.appeal_type;
          this.resultTmp = JSON.parse(JSON.stringify(this.result));
          console.log('ResultTmp==>', this.resultTmp);
          // this.result.guar_running = this.result[0].guar_running;
          // this.getAppealType(this.result.appeal_type,2);
          if (!this.result.guar_running) {
            this.result.guar_running = this.resultTmp[0].guar_running;
            console.log('ไม่มี guar_running');
          }
          console.log('GuarRunning==>', this.result.guar_running);
          //this.appData = this.result.app_data?this.result.app_data:[];
          // this.asData = this.result.send_data?this.result.send_data:[];
          if (this.result.guar_running) {
            // alert('ResultEditData');
            this.guarDefData();
          }

          this.rerender();
          //this.SpinnerService.hide();
        }, 200);
      }
    }
  }

  AssignDataTab1(obj: any) {
    console.log(obj);
    var objData = obj;
    if (obj.lit_running) {
      if (objData.def_type) {
        this.result.def_type = objData.def_type;
      } else {
        this.result.def_type = 2;
      }
      this.result.run_id = this.dataHeadValue.run_id;
      this.result.seq = objData.seq;
      this.result.def_no = objData.def_no;
      this.result.def_name = objData.def_name;
      this.result.release_type = objData.release_type;
      this.result.send_date = objData.send_date;
      // this.result.guar_cost = objData.guar_cost;
      this.result.guar_cost = objData.guar_cost_format;
      this.result.guar_no = objData.guar_no;
      this.result.guar_yy = objData.guar_yy;
      this.result.guar_permit = objData.guar_permit;
      this.result.status = objData.status;
      this.result.permit_reason = objData.permit_reason;
      this.result.judge_id = objData.judge_id;
      this.result.judge_name = objData.judge_name;
      this.result.remark_lit = objData.remark_lit;
      this.result.item_no = objData.item_no ? objData.item_no : 0;

      this.resultTab1.run_id = this.run_id;//this.dataHeadValue.run_id;
      this.resultTab1.seq = this.result.seq;
      this.resultTab1.item_no = objData.item_no ? objData.item_no : 0;
      this.resultTab1.guar_running = this.result.guar_runnin
      this.resultTab1.def_type = this.result.def_type;
      this.resultTab1.def_no = this.result.def_no;
      this.resultTab1.def_name = this.result.def_name;
      this.resultTab1.release_type = this.result.release_type;
      this.resultTab1.send_date = this.result.send_date;
      this.resultTab1.guar_cost = this.result.guar_cost;
      this.resultTab1.status = this.result.status;
      this.resultTab1.permit_reason = this.result.permit_reason;
      this.resultTab1.judge_id = this.result.judge_id;
      this.resultTab1.judge_name = this.result.judge_name;
      this.resultTab1.guar_order = this.result.guar_order;
      this.resultTab1.guar_permit = this.result.guar_permit;
      this.resultTab1.remark_lit = this.result.remark_lit;
    }
  }

  AssignResultTab1(obj: any) {
    console.log(obj);
    var objData = obj;
    if (this.result.def_name) {
      //  alert('AssignResultTab1');
      this.resultTab1.run_id = this.result.run_id;
      this.resultTab1.seq = this.result.seq;
      this.resultTab1.guar_running = this.result.guar_running;
      this.resultTab1.def_type = this.result.def_type;
      this.resultTab1.def_no = this.result.def_no;
      this.resultTab1.def_name = this.result.def_name;
      this.resultTab1.release_type = this.result.release_type;
      this.resultTab1.send_date = this.result.send_date;
      this.resultTab1.guar_cost = this.result.guar_cost;
      this.resultTab1.status = this.result.status;
      this.resultTab1.permit_reason = this.result.permit_reason;
      this.resultTab1.judge_id = this.result.judge_id;
      this.resultTab1.judge_name = this.result.judge_name;
      this.resultTab1.guar_order = this.result.guar_order;
      this.resultTab1.guar_permit = this.result.guar_permit;
      this.resultTab1.remark_lit = this.result.remark_lit;
      this.resultTab1.item_no = this.result.item_no ? this.result.item_no : 0;
    }
  }

  reloadData() {
    if (this.resultTmp.length)
      this.result = JSON.parse(JSON.stringify(this.resultTmp));
    else
      this.setDefPage();
  }

  diffToDate() {
    if (this.result.case_send_date && this.result.hsend_date) {
      var student = JSON.stringify({
        "case_send_date": this.result.case_send_date,
        "hsend_date": this.result.hsend_date,
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUD/API/APPEAL/fgu0100/calOverDate', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          if (getDataOptions.over_day) {
            this.result.overdue = getDataOptions.over_day;
          } else {
            this.result.overdue = null;
          }
        },
        (error) => { }
      )
    }
  }


  loadAsData() {
    var student = JSON.stringify({
      "guar_running": this.result.guar_running,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUD/API/APPEAL/fgu0120/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if (getDataOptions.result == 1) {

          //-----------------------------//
          if (getDataOptions.data.length) {
            this.asData = getDataOptions.data;
            this.rerender();
          } else {
            this.asData = [];
            this.rerender();
          }
          //-----------------------------//
        } else {
          //-----------------------------//
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage(getDataOptions.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) { }
            subscription.unsubscribe();
          });
          //-----------------------------//
        }

      },
      (error) => { }
    )
  }

  saveData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (typeof this.dataSendHead != 'undefined' && !this.dataSendHead.run_id) {
      //-----------------------------//
      confirmBox.setMessage('กรุณาค้นหาข้อมูลคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
      //-----------------------------//
    } else if (!this.result.start_date) {
      //-----------------------------//
      confirmBox.setMessage('กรุณาป้อนข้อมูลคดีเริ่มวันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
      //-----------------------------//
    } else {
      if (this.result.app_type_id == 0)
        this.result.app_type_id = null;
      if (this.result.close_by == 0)
        this.result.close_by = null;
      if (this.result.send_by == 0)
        this.result.send_by = null;
      if (!this.result.run_id)
        this.result.run_id = this.dataSendHead.run_id;
      this.result.appeal_type = this.result.appeal_type.toString();
      this.result.userToken = this.userData.userToken;

      var data = $.extend({}, this.result);
      console.log(data);
      //return false;
      this.http.post('/' + this.userData.appName + 'ApiUD/API/APPEAL/fgu0100/saveData', data).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if (getDataOptions.result == 1) {
            //-----------------------------//
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                //this.result.notice_running = getDataOptions.notice_running;
                this.result.guar_running = getDataOptions.guar_running;
                data.guar_running = getDataOptions.guar_running;
                this.onClickListData(data);
              }
              subscription.unsubscribe();
            });
            //-----------------------------//
          } else {
            //-----------------------------//
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
              }
              subscription.unsubscribe();
            });

            //-----------------------------//
          }

        },
        (error) => { }
      )
    }
  }

  onClickListData(data: any): void {
    this.onClickList.emit(data)
  }
  reloadTab() {
    this.onClickListData({ 'run_id': this.dataSendHead.run_id, 'guar_running': this.result.guar_running });
  }

  visibleAppointment() {
    this.visibleApp = this.visibleApp ? false : true;
  }

  openSendPage(index: any) {

    let winURL = window.location.href.split("/#/")[0] + "/#/";
    var name = 'fgu0120';
    if (typeof index === 'object')
      myExtObject.OpenWindowMaxName(winURL + 'webcam?run_id=' + this.dataSendHead.run_id + '&guar_running=' + this.result.guar_running + '&send_item=' + index.send_item, name);
    else
      myExtObject.OpenWindowMaxName(winURL + 'webcam?run_id=' + this.dataSendHead.run_id + '&guar_running=' + this.result.guar_running, name);

    /*
         const modalRef: NgbModalRef = this.ngbModal.open(Fgu0120Component,{ windowClass: 'my-class'})
         modalRef.componentInstance.run_id = this.dataSendHead.run_id
         modalRef.componentInstance.guar_running = this.result.guar_running
         modalRef.componentInstance.send_item = index.send_item
         modalRef.closed.subscribe((data) => {
           if(data)
             this.onClickListData({'run_id':this.dataSendHead.run_id,'guar_running':this.result.guar_running});
           //this.getAppRunning(1)
         })
       */
  }

  fap0111Page() {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    //var name = 'win_'+Math.ceil(Math.random()*1000);
    var name = 'fap0111';
    //console.log(winURL+'ffn1600?run_id='+this.dataHead.run_id)fkb0100.php?run_id=150662&req_running=24381
    myExtObject.OpenWindowMaxName(winURL + 'fap0111?run_id=' + this.dataSendHead.run_id, name);
  }
  fap0130Page(i: any) {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    //var name = 'win_'+Math.ceil(Math.random()*1000);
    var name = 'fap0130';
    //console.log(winURL+'ffn1600?run_id='+this.dataHead.run_id)fkb0100.php?run_id=150662&req_running=24381
    //myExtObject.OpenWindowMaxName(winURL+'fap0130?run_id='+this.dataSendHead.run_id+'&app_seq='+this.appData[i].app_seq,name);
    myExtObject.OpenWindowMaxName(winURL + 'fap0130?app_running=' + this.appData[i].app_running, name);
  }

  delData(type: any, i: any) {
    //1คือผู้ยื่นอุทธรณ์/ฎีกา,2คือ
    this.delIndex = i;
    this.clickOpenMyModalComponent(20);
  }

  runSeq() {
    if (typeof this.dataSendHead != 'undefined') {
      var student = JSON.stringify({
        "run_id": this.dataSendHead.run_id,
        "userToken": this.getToken
      });
      this.http.post('/' + this.userData.appName + 'ApiUD/API/APPEAL/fgu0100/runItem', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.result.appeal_item = getDataOptions.appeal_item;
          this.resultTmp = JSON.parse(JSON.stringify(this.result));
        },
        (error) => { }
      )
    } else
      this.resultTmp = JSON.parse(JSON.stringify(this.result));
  }

  private get getToken(): string {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let userData: any
    if (sessData) {
      userData = JSON.parse(sessData)
    }
    return userData?.userToken || ""
  }

  private get getRoot(): string {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let rootData: any
    if (sessData) {
      rootData = JSON.parse(sessData)
    }
    return rootData?.appName || ""
  }

  printReport(val: any, guar_running: any, def_no: any) {
    var rptName = 'rgu2700';

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "pguar_running": guar_running.toString(),
      "pdef_no": def_no.toString(),
    });
    console.log(paramData);
    this.printReportService.printReport(rptName, paramData);
  }

  curencyFormat(n: any, d: any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }//100000 เป็น 100,000.00


  curencyFormatRevmove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, "").slice(.00, -3);;
    } else {
      return "";
    }
  } // 1

}
