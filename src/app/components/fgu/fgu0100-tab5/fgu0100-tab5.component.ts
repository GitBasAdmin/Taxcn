import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, Input, Output, EventEmitter, AfterContentInit, ViewChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from '@app/services/print-report.service';
declare var myExtObject: any;
@Component({
  selector: 'app-fgu0100-tab5',
  templateUrl: './fgu0100-tab5.component.html',
  styleUrls: ['./fgu0100-tab5.component.css']
})
export class Fgu0100Tab5Component implements AfterViewInit, OnInit, OnDestroy, AfterContentInit {
  result: any = [];
  resultTmp: any = [];
  sendEditData: any = [];
  appealData: any = [];
  appealDataTmp: any = [];
  viewInit: any;
  dataHead: any;
  sessData: any;
  userData: any;
  myExtObject: any;
  appealType: any;
  getResult: any;
  delIndex: any;
  getPrint: any;
  modalType: any;
  run_id: any;
  public dataSendHead: any
  getFormRunning1: any;
  getFormRunning2: any;
  getFormRunning3: any;
  dataHeadValue: any = [];
  req_file_name: any; con_file_name: any; doc_file_name: any;


  dtOptions2: DataTables.Settings = {};
  dtTrigger_2: Subject<any> = new Subject<any>();
  public loadModalConfComponent: boolean = false;
  @Input() set getTab(getTab: any) {//รับจาก fju0100-main
    if (typeof getTab != 'undefined' && getTab.tabIndex == 3) {
      myExtObject.callCalendar();
    }
    console.log(getTab)
  }

  @Input() set getDataHead(getDataHead: any) {//รับจาก fgu0100
    console.log(getDataHead)
    if (typeof getDataHead != 'undefined') {
      this.dataSendHead = getDataHead;
      this.setDefPage();
      if (this.dataSendHead.run_id) {
        this.dataHeadValue.run_id = this.dataSendHead.run_id;
        this.result.run_id = this.dataHeadValue.run_id;
        this.run_id = this.dataHeadValue.run_id;
        this.result.guar_running = this.dataSendHead.guar_running;
        this.req_file_name = this.dataSendHead.req_file_name;
        this.con_file_name = this.dataSendHead.con_file_name;
        this.doc_file_name = this.dataSendHead.doc_file_name;
        console.log('RunId==>', this.result.run_id);
      }
    }
  }

  @Input() set sendEdit(sendEdit: any) {//รับจาก fgu0100
    console.log(sendEdit)

    if (typeof sendEdit != 'undefined') {
      var tmp = sendEdit.data;
      console.log(tmp)
      this.dataHeadValue.run_id = tmp.data[0].run_id;
      this.result.run_id = tmp.data[0].run_id;
      this.run_id = tmp.data[0].run_id;
      this.result.guar_running = tmp.data[0].guar_running;
      this.req_file_name = tmp.data[0].req_file_name;
      this.con_file_name = tmp.data[0].con_file_name;
      this.doc_file_name = tmp.data[0].doc_file_name;

    }
  }

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
  ) { }

  ngOnInit(): void {
    this.dtOptions2 = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true
    };

    $("mat-tab-content-0-3").css("height", "450px");

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.getPrint = [{ id: '1', text: 'PDF' }];
    // this.getPrint = [{ id: '1', text: 'PDF' }, { id: '2', text: 'WORD' }];//พี่จูบอกว่าให้แสดงแต่ pdf

    // getFormRunning
    var student = JSON.stringify({
      "table_name": "pword_form",
      "field_id": "form_running",
      "field_name": "form_name",
      "condition": "  AND form_type=13 ",
      "order_by": "form_running ASC ",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getFormRunning1 = getDataOptions;
        this.result.form_running1 = this.getFormRunning1[0].fieldIdValue;
      },
      (error) => { }
    )

    var student = JSON.stringify({
      "table_name": "pword_form",
      "field_id": "form_running",
      "field_name": "form_name",
      "condition": "  AND form_type=10 ",
      "order_by": "form_running ASC ",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getFormRunning2 = getDataOptions;
        this.result.form_running2 = this.getFormRunning2[0].fieldIdValue;
      },
      (error) => { }
    )

    var student = JSON.stringify({
      "table_name": "pword_form",
      "field_id": "form_running",
      "field_name": "form_name",
      "condition": "  AND form_type=18 ",
      "order_by": "form_running ASC ",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getFormRunning3 = getDataOptions;
        this.result.form_running3 = this.getFormRunning3[0].fieldIdValue;
      },
      (error) => { }
    )

    this.setDefPage();
  }


  setDefPage() {
    this.result.end_by = '1';
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      //console.log(dtElement.dtInstance)
      if (dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
    });
    this.dtTrigger_2.next(null);
  }

  ngAfterViewInit(): void {
    this.dtTrigger_2.next(null);
    this.viewInit = 1;
  }
  ngAfterContentInit(): void {

  }

  ngOnDestroy(): void {
    this.dtTrigger_2.unsubscribe();
  }


  openWindow(type: any) {
    // var name="";
    // if(type==1){
    //   name = 'prgu0300?'+'guar_running='+(this.result.guar_running?this.result.guar_running:0)+
    //   '&run_id='+(this.result.run_id?this.result.run_id:0)+
    //   '&pitem=0';
    // }else if(type==2){
    //   name = 'prgu0400?'+'guar_running='+(this.result.guar_running?this.result.guar_running:0)+
    //   '&run_id='+(this.result.run_id?this.result.run_id:0)+
    //   '&pitem=0';
    // }else if(type==3){
    //   name = 'prgu0410?'+'guar_running='+(this.result.guar_running?this.result.guar_running:0)+
    //   '&run_id='+(this.result.run_id?this.result.run_id:0)+
    //   '&sub_type=1&pitem=0';
    // }

    // console.log(type,name);
    // let winURL = window.location.href.split("/#/")[0]+"/#/";
    // myExtObject.OpenWindowMaxName(winURL+name);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.result.guar_running) {
      confirmBox.setMessage('ไม่พบข้อมูลสัญญาประกัน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if ((type == 1 && !this.result.form_running1) || (type == 2 && !this.result.form_running2) || (type == 3 && !this.result.form_running3)) {
      confirmBox.setMessage('กรุณาเลือกแบบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {

      if (type == 1) {
        var student = JSON.stringify({
          "form_type": 13,
          "form_running": this.result.form_running1 ? this.result.form_running1 : '',
          "guar_running": this.result.guar_running ? this.result.guar_running : '',
          "userToken": this.userData.userToken
        });

      } else if (type == 2) {
        var student = JSON.stringify({
          "form_type": 10,
          "form_running": this.result.form_running2 ? this.result.form_running2 : '',
          "guar_running": this.result.guar_running ? this.result.guar_running : '',
          "userToken": this.userData.userToken
        });
      } else if (type = 3) {
        var student = JSON.stringify({
          "form_type": 18,
          "form_running": this.result.form_running3 ? this.result.form_running3 : '',
          "guar_running": this.result.guar_running ? this.result.guar_running : '',
          "userToken": this.userData.userToken
        });
      }
      this.SpinnerService.show();
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/openGuarDoc', student).subscribe(
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
                ;
              }
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();
            this.getData();
            myExtObject.OpenWindowMax(alertMessage.file);
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  getData() {
    var student = JSON.stringify({
      "guar_running": this.result.guar_running,
      "userToken": this.userData.userToken
    });
    console.log(student)

    this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/getGuaranteeData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log('guarRantorData==>', getDataOptions);
        if (getDataOptions.result == 1) {
          console.log('getData----' + getDataOptions.data[0]);
          this.req_file_name = getDataOptions.data[0].req_file_name;
          this.con_file_name = getDataOptions.data[0].con_file_name;
          this.doc_file_name = getDataOptions.data[0].doc_file_name;
        }
      },
      (error) => { }
    )
  }

  clickOpenFile(file: any) {
    var student = JSON.stringify({
      "file_name": file,
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/openFile', student).subscribe(
      (response) => {
        let alertMessage: any = JSON.parse(JSON.stringify(response));
        if (alertMessage.result == 1) {
          myExtObject.OpenWindowMax(alertMessage.file);
        }
      },
      (error) => { }
    )
  }

  delData(file: any, type: any) {
    if (file) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการลบไฟล์ Word');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          subscription.unsubscribe();
          
          var student = JSON.stringify({
            "file_name": file,
            "userToken": this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/deleteFile', student).subscribe(
            (response) => {
              let alertMessage: any = JSON.parse(JSON.stringify(response));
              if (alertMessage.result == 0) {
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success == true) { }
                  subscription.unsubscribe();
                });
              } else {
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success == true) {
                    this.getData();
                  }
                  subscription.unsubscribe();

                  /*if(type==1){
                    this.req_file_name ='';
                  }else if(type==2){
                    this.con_file_name ='';
                  }else if(type==3){
                    this.doc_file_name ='';
                  }*/
                });
              }
            },
            (error) => { this.SpinnerService.hide(); }
          )
        }else{
          subscription.unsubscribe();
        }
        
      });
    } else {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบไฟล์ Word');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      }
      );
    }

  }

  printReport(type: any) {
    var rptName = 'rgu0500';
    var paramData = '{}';
    var paramData = JSON.stringify({
      "pguar_running": this.result.guar_running ? this.result.guar_running : 0,
      "pprint_judge": type,
      "pprint_by": 1
    });

    console.log(paramData);
    this.printReportService.printReport(rptName, paramData);
  }
}
