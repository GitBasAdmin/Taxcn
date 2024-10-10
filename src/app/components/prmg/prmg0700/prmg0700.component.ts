import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component';
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
  selector: 'app-prmg0700,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prmg0700.component.html',
  styleUrls: ['./prmg0700.component.css']
})

export class Prmg0700Component implements AfterViewInit, OnInit, OnDestroy {
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
  asyncObservable: Observable<string>;
  selectedCasetype: any = 'แพ่ง';
  getCaseType: any;
  selCaseType: any;
  selCaseId: any;
  result: any = [];
  getMonth: any;
  modalType: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;
  public loadModalListComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;//popup ผู้พิพากษา

  @ViewChild('prmg0700', { static: true }) prmg0700: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid: NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //this.asyncObservable = this.makeObservable('Async Observable');
    this.successHttp();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name": "pcase_type",
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "order_by": "case_type ASC",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.selCaseType = this.userData.defaultCaseType;
        //console.log(this.getCaseType)
        //console.log(this.userData.defaultCaseType)
        //console.log(this.selCaseType)
      },
      (error) => { }
    )
    //----------------------end pcase_type -------------------
    this.getMonth = [{ id: '1', text: 'มกราคม' }, { id: '2', text: 'กุมภาพันธ์' }, { id: '3', text: 'มีนาคม' }, { id: '4', text: 'เมษายน' }, { id: '5', text: 'พฤษภาคม' }, { id: '6', text: 'มิถุนายน' }, { id: '7', text: 'กรกฎาคม' }, { id: '8', text: 'สิงหาคม' }, { id: '9', text: 'กันยายน' }, { id: '10', text: 'ตุลาคม' }, { id: '11', text: 'พฤศจิกายน' }, { id: '12', text: 'ธันวาคม' }];
    this.result.pmonth = parseInt(myExtObject.curMonth()).toString();
    this.result.pyear = myExtObject.curYear();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prmg0700"
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

  tabChangeInput(name: any, event: any) {
    if (name == 'pcon_id') {
      var student = JSON.stringify({
        "table_name": "pofficer",
        "field_id": "off_id",
        "field_name": "off_name",
        "field_name2": "post_id",
        "condition": " AND off_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.psign_user = productsJson[0].fieldNameValue;
            this.getPost(productsJson[0].fieldNameValue2);
          } else {
            this.result.pcon_id = '';
            this.result.psign_user = '';
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

  loadMyModalComponent() {
    if (this.modalType == 1) {
      $("#exampleModal").find(".modal-content").css("width", "700px");
      var student = JSON.stringify({
        "table_name": "pofficer",
        "field_id": "off_id",
        "field_name": "off_name",
        "field_name2": "post_id",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pofficer';
      this.listFieldId = 'off_id';
      this.listFieldName = 'off_name';
      this.listFieldName2 = 'post_id';
      this.listFieldNull = '';
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
          // this.loadModalListComponent = true;
          // this.loadModalJudgeComponent = false;
          const modalRef = this.ngbModal.open(DatalistReturnComponent, { size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pofficer"
          modalRef.componentInstance.value2 = "off_id"
          modalRef.componentInstance.value3 = "off_name"
          modalRef.componentInstance.value4 = "post_id"
          modalRef.componentInstance.types = "1"
          modalRef.result.then((item: any) => {
            if (item) {
              this.result.pcon_id = item.fieldIdValue;
              this.result.psign_user = item.fieldNameValue;
              this.getPost(item.fieldNameValue2);
            }
          })
        },
        (error) => { }
      )

    } else if (this.modalType == 2) {
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = true;
      $("#exampleModal").find(".modal-content").css("width", "700px");
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldNull = '';
      this.listFieldType = JSON.stringify({ "type": 2 });

      console.log(student)

      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
            console.log(this.list)
            const modalRef = this.ngbModal.open(ModalJudgeComponent, { size: 'lg', backdrop: 'static' })
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "pjudge"
            modalRef.componentInstance.value2 = "judge_id"
            modalRef.componentInstance.value3 = "judge_name"
            modalRef.componentInstance.value4 = "post_id"
            modalRef.componentInstance.types = "1"
            modalRef.componentInstance.value5 = JSON.stringify({ "type": 1 })
            modalRef.result.then((item: any) => {
              if (item) {
                this.result.pcon_id = item.judge_id;
                this.result.psign_user = item.judge_name;
                this.getPost(item.post_id);
              }
            })
          }
        },
        (error) => { }
      )
    }
  }

  getPost(post_id: any) {
    if (post_id) {
      var student = JSON.stringify({
        "table_name": "pposition",
        "field_id": "post_id",
        "field_name": "post_name",
        "condition": " AND post_id='" + post_id + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.psign_position = productsJson[0].fieldNameValue;
            //ตรงนี้เมื่อต้องตาเพิ่มตำแหน่งใน form แล้ว เปลี่ยนชื่อให้ตรง
          } else {
            this.result.psign_position = '';
            //ตรงนี้เมื่อต้องตาเพิ่มตำแหน่งใน form แล้ว เปลี่ยนชื่อให้ตรง
          }
        },
        (error) => { }
      )
    }
  }

  receiveFuncListData(event: any) {
    console.log(event)
    if (this.modalType == 1) {
      this.result.pcon_id = event.fieldIdValue;
      this.result.psign_user = event.fieldNameValue;
      this.getPost(event.fieldNameValue2);
    } else if (this.modalType == 2) {
      this.result.pcon_id = event.judge_id;
      this.result.psign_user = event.judge_name;
      this.getPost(event.post_id);
    }
    this.closebutton.nativeElement.click();
  }

  closeModal() {
    this.loadModalListComponent = false;
    this.loadModalJudgeComponent = false;
  }


  printReport() {

    var rptName = 'rmg0700';

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "pmonth": this.result.pmonth ? this.result.pmonth.toString() : '',
      "pyear": this.result.pyear ? (this.result.pyear - 543).toString() : '',
      "psign_user": this.result.psign_user ? this.result.psign_user.toString() : '',
      "psign_position": this.result.psign_position ? this.result.psign_position.toString() : '',
      "premark": this.result.premark ? this.result.premark.toString() : '',
    });

    console.log(paramData)
    // alert(paramData);return false;
    this.printReportService.printReport(rptName, paramData);
  }

  changeCaseType(caseType: any) {
    this.selCaseType = caseType;
  }



}






