import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';

// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prci4000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prci4000.component.html',
  styleUrls: ['./prci4000.component.css']
})


export class Prci4000Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject: any;
  //form: FormGroup;
  title = 'datatables';
  posts: any;
  search: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  delValue: any;
  sessData: any;
  userData: any;
  programName: any;

  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  getCaseCate: any;
  pcase_cate: any = "";
  getPgroupId: any;

  pcase_flag: any;
  proom_id: any;
  ppage: any;

  getPage: any;
  result: any = [];
  modalType: any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;
  public loadModalListComponent: boolean = false;//popup ธรรมดา

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prci4000', { static: true }) prci4000: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild('scasetypeid') scasetypeid: NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private ngbModal: NgbModal,
    private printReportService: PrintReportService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();

    this.result.pcase_flag = 1;
    this.getPage = [{ id: '1', text: 'พิมพ์' }, { id: '2', text: 'ไม่พิมพ์' }];
    this.result.ppage = '1';
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prci4000"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          res => { // Success
            //this.results = res.json().results;
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
            console.log(getDataAuthen)
            this.programName = getDataAuthen.programName;
            this.defaultCaseType = getDataAuthen.defaultCaseType;
            this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
            this.defaultTitle = getDataAuthen.defaultTitle;
            this.defaultRedTitle = getDataAuthen.defaultRedTitle;
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
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ClearAll() {
    window.location.reload();
  }

  printReport() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.result.txtStartDate) {
      confirmBox.setMessage('กรุณาระบุข้อมูล ตั้งแต่วันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (!this.result.txtEndDate) {
      confirmBox.setMessage('กรุณาระบุข้อมูล ถึงวันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      var rptName = 'rci4000';
      // For no parameter : paramData ='{}'
      var paramData = '{}';
      // For set parameter to report
      var paramData = JSON.stringify({
        "psel": this.result.psel ? this.result.psel.toString() : '',
        "pdate_start": this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end": this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pcon_id": this.result.pcon_id ? this.result.pcon_id.toString() : '',
        "ppage": this.result.ppage ? this.result.ppage.toString() : '',
        "pvalid_flag": this.result.pvalid_flag == true ? '1' : '0',
      });
      console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName, paramData);
    }
  }

  tabChangeInput(name: any, event: any) {
    if (name == 'pcon_id') {
      var student = JSON.stringify({
        "table_name": "pconciliate",
        "field_id": "conciliate_id",
        "field_name": "conciliate_name",
        "condition": " AND conciliate_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if (productsJson.length) {
            this.result.conciliate_name = productsJson[0].fieldNameValue;
          } else {
            this.result.pcon_id = '';
            this.result.conciliate_name = '';
          }
        },
        (error) => { }
      )
    }
  }

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    // this.openbutton.nativeElement.click();
    this.loadMyModalComponent();
  }

  loadMyModalComponent() {
    $(".modal-backdrop").remove();
    if (this.modalType == 1) {
      $("#exampleModal").find(".modal-content").css("width", "800px");
      var student = JSON.stringify({
        "table_name": "pconciliate",
        "field_id": "conciliate_id",
        "field_name": "conciliate_name",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pconciliate';
      this.listFieldId = 'conciliate_id';
      this.listFieldName = 'conciliate_name';
      this.listFieldNull = '';

      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
          // this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent, { size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pconciliate"
          modalRef.componentInstance.value2 = "conciliate_id"
          modalRef.componentInstance.value3 = "conciliate_name"
          modalRef.componentInstance.types = "1"

          modalRef.result.then((item: any) => {
            if (item) {
              this.result.pcon_id = item.fieldIdValue;
              this.result.conciliate_name = item.fieldNameValue;
            }
          })
        },
        (error) => { }
      )

    }
  }

  receiveFuncListData(event: any) {
    console.log(event)
    if (this.modalType == 1) {
      this.result.pcon_id = event.fieldIdValue;
      this.result.conciliate_name = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  closeModal() {
    this.loadModalListComponent = false;
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }
}