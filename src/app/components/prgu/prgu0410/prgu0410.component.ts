import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef, AfterViewInit, OnDestroy, Injectable, ViewChildren, QueryList, Renderer2 } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prgu0410,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prgu0410.component.html',
  styleUrls: ['./prgu0410.component.css']
})


export class Prgu0410Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';

  posts: any;
  delList: any = [];
  result: any = [];
  search: any;
  masterSelected: boolean;
  masterSelected2: boolean;
  checklist: any;
  checklist2: any;
  checkedList: any;
  delValue: any;
  delValue2: any;
  sessData: any;
  userData: any;
  absentDate1: any;
  absentDate2: any;
  myExtObject: any;
  programName: string;
  dataHead: any;
  run_id: any;
  modalType: any;
  getFormRunning: any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldNull: any;
  public listFieldName2: any;
  public listFieldCond: any;


  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  // @ViewChild('guarantor_id',{static: true}) guarantor_id : ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChild('sAmphur') sAmphur: NgSelectComponent;
  @ViewChild('sTambon') sTambon: NgSelectComponent;
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  public loadFrgu0410Component: boolean = false;
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100
    console.log(getDataHead);
    this.dataHead = getDataHead;
  }

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
  ) {
    this.masterSelected = false
    // this.masterSelected2 = false
  }

  ngOnInit(): void {

    this.dtOptions = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true
    };

    this.activatedRoute.queryParams.subscribe(params => {
      this.result.run_id = params['run_id'];
      this.run_id = params['run_id'];
      this.result.guar_running = params['guar_running'];
      this.result.guarman_item = params['guarman_item'];
    });

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    if(this.result.guar_running){
      var student = JSON.stringify({
        "run_id": this.result.run_id,
        "guar_running": this.result.guar_running,
        "userToken": this.userData.userToken
      });
      this.SpinnerService.show();
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/prgu0410/getGuarantorData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          this.posts = productsJson.data;
          this.SpinnerService.hide();
        },
        (error) => { }
      );
    }

    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prgu0410"
    });
    this.http.post('/' + this.userData.appName + 'Api/API/authen', authen).subscribe(
      (response) => {
        let getDataAuthen: any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        console.log(getDataAuthen)
      },
      (error) => { }
    )

    // getFormRunning
    var student = JSON.stringify({
      "table_name" : "pword_form",
      "field_id" : "form_running",
      "field_name" : "form_name",
      "condition" : "  AND form_type=18 ",
      "order_by" : "form_running ASC ",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getFormRunning = getDataOptions;
      },
      (error) => {}
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
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  setFocus(name: any) {
    const ele = name;
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0110 = this.masterSelected;
    }
  }

  clickOpenMyModalComponent(type: any) {
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent() {
    this.loadModalComponent = false;
    this.loadModalConfComponent = false;
    this.loadComponent = true;
  }

  ClearAll() {
    window.location.reload();
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  printReport(val: any, guar_running: any) {
    var rptName = 'rrgu0410';

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "pflag_cancel": val,
    });

    this.printReportService.printReport(rptName, paramData);
  }

  openWord(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.result.subject_id) {
      confirmBox.setMessage('คุณยังไม่เลือกเรื่อง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();

      var student = JSON.stringify({
        "guar_running": this.result.guar_running,
        "run_id": this.result.run_id,
        "sub_type": 1,
        "userToken": this.userData.userToken
      });

      this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/open_guar_doc', student).subscribe(
        (response) => {
          let alertMessage:any = JSON.parse(JSON.stringify(response));
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
            myExtObject.OpenWindowMax(alertMessage.file);
            this.result.file_data = alertMessage.file;
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  deleteWord(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ลบไฟล์ word');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    if (resp.success == true) {
      subscription.unsubscribe();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ยืนยันการลบไฟล์ word อีกครั้ง');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription2 = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) {
        subscription2.unsubscribe();

        var student = JSON.stringify({
          "guar_running": this.result.guar_running,
          "run_id": this.result.run_id,
          "sub_type": 1,
          "userToken": this.userData.userToken
        });
        this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/deleteWord', student).subscribe(
          (response) =>{
            let alertMessage :any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==0){
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
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
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
                this.result.file_data ='';
              });
            }
          },
          (error) => {}
          )
        }
      });  
    }
    subscription.unsubscribe();
    });
  }

  submitModalForm(){

  }

  receiveFuncListData(event:any){

  }

  closeWin() {
    if (this.run_id)
      window.opener.myExtObject.openerReloadRunId(this.run_id);
    else
      window.opener.myExtObject.openerReloadRunId(0);
    window.close();
  }


  closeModal() {
    this.loadComponent = false;
    this.loadModalComponent = false;
    this.loadModalConfComponent = false;
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
    console.log(date)
  }
}