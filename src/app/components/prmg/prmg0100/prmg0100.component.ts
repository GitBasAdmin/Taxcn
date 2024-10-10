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
  selector: 'app-prmg0100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prmg0100.component.html',
  styleUrls: ['./prmg0100.component.css']
})


export class Prmg0100Component implements AfterViewInit, OnInit, OnDestroy {
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
  getDateType: any;

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
  public loadModalListComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prca0800', { static: true }) prca0800: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid: NgSelectComponent;
  @ViewChild('sCaseStat') sCaseStat: NgSelectComponent;
  @ViewChild('sTitleGroup') sTitleGroup: NgSelectComponent;

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
    this.getDateType = [{ id: '1', text: 'วันที่เป็นเจ้าของสำนวน' }, { id: '3', text: 'วันที่จ่ายสำนวน' }, { id: '2', text: 'วันนัด' }];
    this.setDefPage();
  }

  setDefPage() {
    this.result = [];
    this.result.pdate_type = '1';
    this.result.txtStartDate = this.result.txtEndDate = myExtObject.curDate();
    this.result.pdep_id = this.userData.depCode;
    this.result.dep_name = this.userData.depName;
    this.result.poff_id = this.userData.userCode;
    this.result.poff_name = this.userData.offName;
    this.result.porder = 1;
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  tabChangeInput(name: any, event: any) {
    if (name == 'pdep_id') {
      var student = JSON.stringify({
        "table_name": "pdepartment",
        "field_id": "dep_code",
        "field_name": "dep_name",
        "condition": " AND dep_code='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if (productsJson.length) {
            this.result.dep_name = productsJson[0].fieldNameValue;
          } else {
            this.result.pdep_id = '';
            this.result.dep_name = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'poff_id') {
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
            this.result.poff_name = productsJson[0].fieldNameValue;
          } else {
            this.result.poff_id = '';
            this.result.poff_name = '';
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

  closeModal() {
    this.loadModalListComponent = false;
  }

  getPost(post_id: any, modalType: any) {
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
            if (modalType == 2)
              this.result.poff_post = productsJson[0].fieldNameValue;
            else if (modalType == 3)
              this.result.psign_post = productsJson[0].fieldNameValue;
            else if (modalType == 4)
              this.result.preport_judge_post = productsJson[0].fieldNameValue;
          } else {
            if (modalType == 2)
              this.result.poff_post = '';
            else if (modalType == 3)
              this.result.psign_post = '';
            else if (modalType == 4)
              this.result.preport_judge_post = '';
          }
        },
        (error) => { }
      )
    }
  }

  loadMyModalComponent() {
    $(".modal-backdrop").remove();
    if (this.modalType == 1) {
      $("#exampleModal").find(".modal-content").css("width", "800px");
      var student = JSON.stringify({
        "table_name": "pdepartment",
        "field_id": "dep_code",
        "field_name": "dep_name",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pdepartment';
      this.listFieldId = 'dep_code';
      this.listFieldName = 'dep_name';
      this.listFieldNull = '';

      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
          // this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent, { size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pdepartment"
          modalRef.componentInstance.value2 = "dep_code"
          modalRef.componentInstance.value3 = "dep_name"
          modalRef.componentInstance.types = "1"

          modalRef.result.then((item: any) => {
            if (item) {
              if (this.modalType == 1) {
                this.result.pdep_code = item.fieldIdValue;
                this.result.dep_name = item.fieldNameValue;
              }
            }
          })
        },
        (error) => { }
      )

    } if (this.modalType == 2) {
      $("#exampleModal").find(".modal-content").css("width", "800px");
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
          const modalRef = this.ngbModal.open(DatalistReturnComponent, { size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pofficer"
          modalRef.componentInstance.value2 = "off_id"
          modalRef.componentInstance.value3 = "off_name"
          modalRef.componentInstance.value4 = "post_id"
          modalRef.componentInstance.types = "1"

          modalRef.result.then((item: any) => {
            if (item) {
              if (this.modalType == 2) {
                this.result.poff_id = item.fieldIdValue;
                this.result.poff_name = item.fieldNameValue;
                this.getPost(item.fieldNameValue2, this.modalType);
              }
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
      this.result.pdep_id = event.fieldIdValue;
      this.result.dep_name = event.fieldNameValue;
    } else if (this.modalType == 2) {
      this.result.poff_id = event.fieldIdValue;
      this.result.poff_name = event.fieldNameValue;
      this.getPost(event.fieldNameValue2, this.modalType);
    }
    this.closebutton.nativeElement.click();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prmg0100"
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


  printReport(type: any) {
    var ptype = 0;
    if (type == 1) {//พิมพ์รายงาน
      ptype = 1;
    } else if (type == 2) {////พิมพ์รายงานแนวนอน
      ptype = 2;
    } else if (type == 3) {////พิมพ์รายงาน(เครื่องพิมพ์บาร์โค๊ด)
      ptype = 3;
    } else if (type == 4) {////พิมพ์รายงาน(เครื่องพิมพ์บาร์โค๊ด 5x4 ซม.)
      ptype = 4;
    }
    var rptName = 'rmg0100';
    var paramData = '{}';
    var paramData = JSON.stringify({
      "pdate_type": this.result.pdate_type ? this.result.pdate_type.toString() : '',
      "pdate_start": this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
      "pdate_end": this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
      "pdep_id": this.result.pdep_id ? this.result.pdep_id : '',
      "poff_id": this.result.poff_id ? this.result.poff_id : '',
      "ptype": ptype,
      "porder": this.result.porder ? this.result.porder : '',
    });
    console.log(paramData)
    this.printReportService.printReport(rptName, paramData);
  }

  changeCaseType(caseType: any) {
    this.selCaseType = caseType;
  }

}