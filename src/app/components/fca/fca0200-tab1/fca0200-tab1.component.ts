import { Component, OnInit, ViewChild, ViewChildren, ElementRef, AfterViewInit, AfterContentInit, OnDestroy, Injectable, Input, Output, EventEmitter, ComponentFactoryResolver, QueryList } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerService } from "ngx-spinner";
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { transform, isEqual, isObject, differenceBy } from 'lodash';
import * as _ from "lodash"
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';

import { PrintReportService } from 'src/app/services/print-report.service';
declare var myExtObject: any;
import * as $ from 'jquery';
import 'datatables.net';
import {
  CanActivateFn, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
  NavigationError, Routes
} from '@angular/router';
import { Fca0200Component } from '../fca0200/fca0200.component';
import { Fca0130Component } from '../fca0130/fca0130.component';

import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { ModalReturnAlleComponent } from '@app/components/modal/modal-return-alle/modal-return-alle.component';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component';
import { DatalistReturnMultipleComponent } from '@app/components/modal/datalist-return-multiple/datalist-return-multiple.component';
import { DatalistReturnOrgComponent } from '@app/components/modal/datalist-return-org/datalist-return-org.component';

interface Allegation {
  alle_seq: number,
  alle_id: number,
  alle_running: number,
  alle_name: string,
  create_dep_name: string,
  create_user: string,
  create_date: string
}
interface Appointment {
  app_running: number,
  app_seq: number,
  date_appoint: string,
  time_appoint: string,
  table_name: string,
  app_name: string,
  judge_name: string,
  room_desc: string,
  delay_name: string,
  create_dep_name: string,
  create_user: string,
  create_date: string
}
interface Deposit {
  edit_lit_type: number,
  lit_type: number,
  lit_type_desc: string,
  edit_seq: number,
  seq: number,
  deposit: string,
  court_fee: string
}
interface prosLit {
  lit_running: number,
  seq: number,
  title: string,
  name: number,
  card_type_name: string,
  lit_type_desc: string,
  id_card: string,
  status_desc: string,
  image_name: string,
  create_user: string,
  create_date: string,
  update_user: string,
  update_date: string,
  revoke_flag: number
}
interface accuDesc {
  lit_running: number,
  seq: number,
  title: string,
  name: number,
  card_type_desc: string,
  card_type_name: string,
  id_card: string,
  status_desc: string,
  image_name: string,
  create_user: string,
  create_date: string,
  update_user: string,
  update_date: string,
  revoke_flag: number
}
interface litDesc {
  lit_running: number,
  seq: number,
  title: string,
  name: number,
  card_type_name: string,
  lit_type_desc: string,
  id_card: string,
  status_desc: string,
  image_name: string,
  create_user: string,
  create_date: string,
  update_user: string,
  update_date: string,
  revoke_flag: number
}
interface otherDesc {
  lit_running: number,
  seq: number,
  title: string,
  name: number,
  card_type_name: string,
  lit_type_desc: string,
  id_card: string,
  status_desc: string,
  image_name: string,
  create_user: string,
  create_date: string,
  update_user: string,
  update_date: string,
  revoke_flag: number
}

const routes: Routes = [{
  path: '',
  redirectTo: '/fca0200',
  pathMatch: 'full'
},
{
  path: 'fca0200',
  component: Fca0200Component,
},
{
  path: 'fca0130',
  component: Fca0130Component
}
];
@Component({
  selector: 'app-fca0200-tab1',
  templateUrl: './fca0200-tab1.component.html',
  styleUrls: ['./fca0200-tab1.component.css']
})

export class Fca0200Tab1Component implements AfterViewInit, OnInit, OnDestroy, AfterContentInit {
  sessData: any;
  userData: any;


  getCourt: any;
  getIndict: any;//selIndict='ปกติ';
  getCustomer: any;//selCustomer='โจทก์เป็นผู้ประกอบการ';
  getLitType: any; selLitType = 'โจทก์';
  getFee: any;
  getResult: any;//selResult='รับฟ้อง';
  getJudge: any;
  getCourtProv: any;//selCourtProv:any;
  getCourtAmphur: any;
  getCourtTambon: any;
  getCourtSubDisTric: any;
  getPers: any; selPers: any;
  getPersTitle: any; selPersTitle: any; selPersName: any;
  getPolice: any;
  getOrder: any;
  getAppList: any;
  getAppTable: any;

  propChanges: any;
  myExtObject: any;
  delTypeApp: any;
  delAppIndex: any;
  delDepIndex: any;

  caseCateIdValue: any;
  caseCateNameValue: any;
  caseTypeValue: any;
  caseCateFlagValue: any;
  courtFeeValue: any;
  courtProvValue: any;
  dataHeadValue: any = [];
  dataAppValue: any;
  dataSource: any;
  counter = 0;
  delValue: any;
  alleId: any;
  alleSeq: any;
  items: any;
  addressOrg: any = [];
  rawDep: any = { lit_type: 1, seq: 1, deposit: '0.00', court_fee: '0.00' };
  valActiveHead = {
    deposit: '',
  }

  masterSelPros: boolean = false;
  buttonDelPros: boolean = false;
  masterSelAccu: boolean = false;
  buttonDelAccu: boolean = false;
  masterSelLit: boolean = false;
  buttonDelLit: boolean = false;
  masterSelOther: boolean = false;
  buttonDelOther: boolean = false;
  masterSelAlle: boolean = false;
  buttonDelAlle: boolean = false;

  getDataDep$: Observable<Deposit[]>;
  getDataAlle$: Observable<Allegation[]>;
  getDataApp$: Observable<Appointment[]>;
  getDataPros$: Observable<prosLit[]>;//โจทก์
  getDataAccu$: Observable<accuDesc[]>;//จำเลย
  getDataLit$: Observable<litDesc[]>;//คู่ความอื่น
  getDataOther$: Observable<otherDesc[]>;//ผู้เกี่ยวข้อง

  retDataHead: any;
  visibleApp: boolean = false;
  windowRef = null;
  refCaseNo: any;
  refLogin: any;
  editApp: any;
  modalType: any;

  public loadComponent: boolean = false; //popup
  public loadModalComponent: boolean = false; //password confirm
  public loadModalAlleComponent: boolean = false; //popup alle
  public loadModalJudgeComponent: boolean = false; //popup judge
  public loadModalMultiComponent: boolean = false;
  public loadDataListOrgComponent: boolean = false;
  //public loadModalConcComponent : boolean = false; //popup conciliate


  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldType: any;
  public listFieldCond: any;

  private _itemList = [];

  dtOptions: DataTables.Settings = {};
  alleOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerPros: Subject<any> = new Subject<any>();
  dtTriggerAccu: Subject<any> = new Subject<any>();
  dtTriggerLit: Subject<any> = new Subject<any>();
  dtTriggerOther: Subject<any> = new Subject<any>();
  dtTriggerApp: Subject<any> = new Subject<any>();
  dtTriggerDep: Subject<any> = new Subject<any>();
  dtTriggerAlle: Subject<any> = new Subject<any>();
  dtTriggerConc: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('sCourtProv') sCourtProv: NgSelectComponent;
  @ViewChild('sCourtAmphur') sCourtAmphur: NgSelectComponent;
  //@ViewChild('sCourtTambon') sCourtTambon : NgSelectComponent;
  //@ViewChild('sCourtSubDisTric') sCourtSubDisTric : NgSelectComponent;
  @ViewChild('sLitType') sLitType: NgSelectComponent;
  @ViewChild('sPers') sPers: NgSelectComponent;
  @ViewChild('sPersTitle') sPersTitle: NgSelectComponent;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @Output() onUpdateCase = new EventEmitter<{ data: any, counter: any }>();
  @Output() onCaseInsert = new EventEmitter<{ data: any, counter: any }>();
  @Output() onChangeActive = new EventEmitter<{ data: any, counter: any }>();
  @Output() onReloadCase = new EventEmitter<{ data: any, counter: any }>();

  @Input() set caseCateId(caseCateId: number) {
    this.caseCateIdValue = caseCateId;
  }
  @Input() set caseType(caseType: number) {
    this.caseTypeValue = caseType;
  }
  @Input() set caseCateName(caseCateName: number) {
    this.caseCateNameValue = caseCateName;
  }
  @Input() set caseCateFlag(caseCateFlag: number) {
    this.caseCateFlagValue = caseCateFlag;
  }

  @Input() set courtFee(courtFee: number) {
    this.courtFeeValue = courtFee;
    console.log(this.courtFeeValue)
    this.dataHeadValue.fee_id = this.courtFeeValue;
    //this.dfCourtFee(this.courtFeeValue)
  }
  @Input() set courtProv(courtProv: string) {
    this.courtProvValue = courtProv;
    //console.log(this.courtProvValue)
    if (typeof this.dataHeadValue != 'undefined' && typeof this.courtProvValue != 'undefined') {
      this.dataHeadValue.zone_prov_id = this.courtProvValue.fieldIdValue;
      this.dataHeadValue.zone_amphur_id = this.courtProvValue.fieldNameValue;
      if (!this.dataHeadValue.zone_amphur_id)
        this.sCourtAmphur.clearModel();
      //this.dataHeadValue.zone_tambon_id = this.courtProvValue.fieldNameValue2;
      //if(!this.dataHeadValue.zone_tambon_id)
      //this.sCourtTambon.clearModel();
      //this.sCourtSubDisTric.clearModel();
      this.changeProv(this.dataHeadValue.zone_prov_id, '')
    }
    /*
    if(this.courtProvValue=='getDataTab1'){
      var counter = this.counter+1;
      var data:any = this.dataHeadValue;
      console.log(counter)
      this.onCaseInsert.emit({data});
    }*/
  }
  @Input() set callTab1(callTab1: number) {
    var counter = this.counter++;
    var data = this.dataHeadValue;
    if (callTab1) {
      this.onCaseInsert.emit({ data, counter });
    }
  }
  @Input() set loginCase(loginCase: number) {
    this.refLogin = loginCase;
  }

  @Input() set dataHead(dataHead: any) {
    //==================== นัดความ ===============//
    this.dataAppValue = [];
    this.dataAppValue.appoint_table = null;//รางนัด
    this.dataAppValue.appoint_date = null;//วันนัด
    this.dataAppValue.appoint_mor = '09.00';
    this.dataAppValue.appoint_eve = '13.30';
    this.dataAppValue.appoint_night = '16.30';
    if (dataHead) {
      this.dataHeadValue = [];
      this.dataHeadValue = JSON.parse(JSON.stringify(dataHead));
      console.log(this.dataHeadValue)
      this.dataSource = JSON.parse(JSON.stringify(dataHead));
      if (this.dataHeadValue.zone_prov_id)
        this.changeProv(this.dataHeadValue.zone_prov_id, '')

      if (this.dataHeadValue.deposit > 0) {
        this.dataHeadValue.deposit = this.curencyFormat(this.dataHeadValue.deposit, 2);
        this.dataSource.deposit = this.curencyFormat(this.dataHeadValue.deposit, 2);
      }

      if (this.dataHeadValue.future_court_fee > 0) {
        this.dataHeadValue.future_court_fee = this.curencyFormat(this.dataHeadValue.future_court_fee, 2);
      }

      if (this.dataHeadValue.court_fee > 0) {
        this.dataHeadValue.court_fee = this.curencyFormat(this.dataHeadValue.court_fee, 2);
        this.dataSource.court_fee = this.curencyFormat(this.dataHeadValue.court_fee, 2);
      }

      this.dataHeadValue.req_id = this.dataHeadValue.req_id ? parseInt(this.dataHeadValue.req_id): '';

      this.dataHeadValue.con_court_level = 1;//ไกล่เกลี่ยชั้น
      this.dataHeadValue.con_status = 2;//ขั้นตอน


      if (this.dataHeadValue.depObj == null) {
        this.dataHeadValue.depObj = [];
        this.dataSource.depObj = [];
      } else {
        this.rawDep = { lit_type: '', seq: '', deposit: '0.00', court_fee: '0.00' };
        //this.sLitType.clearModel();
        for (var i = 0; i < this.dataHeadValue.depObj.length; i++) {
          this.dataHeadValue.depObj[i].deposit = this.curencyFormat(this.dataHeadValue.depObj[i].deposit, 2);
          this.dataHeadValue.depObj[i].court_fee = this.curencyFormat(this.dataHeadValue.depObj[i].court_fee, 2);

          this.dataSource.depObj[i].deposit = this.curencyFormat(this.dataSource.depObj[i].deposit, 2);
          this.dataSource.depObj[i].court_fee = this.curencyFormat(this.dataSource.depObj[i].court_fee, 2);
        }
      }
      console.log(this.dataHeadValue.depObj)
      if (this.dataHeadValue.prosObj != null)
        this.dataHeadValue.prosObj.forEach((x: any) => x.seqPros = false);
      if (this.dataHeadValue.accuObj != null)
        this.dataHeadValue.accuObj.forEach((x: any) => x.seqAccu = false);
      if (this.dataHeadValue.litObj != null)
        this.dataHeadValue.litObj.forEach((x: any) => x.seqLit = false);
      if (this.dataHeadValue.otherObj != null)
        this.dataHeadValue.otherObj.forEach((x: any) => x.seqOther = false);
      if (this.dataHeadValue.alleObj != null)
        this.dataHeadValue.alleObj.forEach((x: any) => x.seqAlle = false);


      if (this.dataHeadValue.appObj == null) {
        this.dataHeadValue.appObj = [];
      }

      this.getDataDep$ = of(this.dataHeadValue.depObj);//ทุนทรัพย์
      this.getDataAlle$ = of(this.dataHeadValue.alleObj);//ฐานความผิด
      this.getDataApp$ = of(this.dataHeadValue.appObj);//นัดความ
      this.getDataPros$ = of(this.dataHeadValue.prosObj);//โจทก์
      this.getDataAccu$ = of(this.dataHeadValue.accuObj);//จำเลย
      this.getDataLit$ = of(this.dataHeadValue.litObj);//คู่ความอื่น
      this.getDataOther$ = of(this.dataHeadValue.otherObj);//ผู้เกี่ยวข้อง
      this.dtTrigger.next('');
      //==================== data service ==========//
      //console.log(this.dataService.callMyMethod(this.dataHeadValue))

      //console.log(this.getDataDep$)
      if (this.dataHeadValue.alleObj) {
        this.runAlleSeq(this.dataHeadValue.alleObj);
      } else {
        this.alleSeq = 1;
      }
      this.refCaseNo = this.dataHeadValue.title + this.dataHeadValue.id + this.dataHeadValue.yy;
    }
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public dataService: DataService,
    private SpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private printReportService: PrintReportService,
    private activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    console.log(this.userData)
    //console.log(myExtObject.conDate('16/11/2564'))
    //console.log(myExtObject.curencyFormat('54236582',2));
    this.dataHead = [];
    //this.dataHeadValue = [];
    //============= set defalut data ==============//
    this.dataHeadValue.guar_pros = 1;
    this.dataHeadValue.deposit = '0.00';
    this.dataHeadValue.court_fee = '0.00';
    this.dataHeadValue.zone_amphur_id = this.userData.courtAmphurId;
    this.dataHeadValue.zone_tambon_id = this.userData.courtTambonId;
    this.dataHeadValue.con_court_level = 1;//ไกล่เกลี่ยชั้น
    this.dataHeadValue.con_status = 2;//ขั้นตอน
    this.dataHeadValue.order_judge_gid = null;
    this.dataHeadValue.case_order_desc = null;
    console.log(this.dataHeadValue.depObj)
    if (!this.dataHeadValue.depObj.length) {
      this.dataHeadValue.depObj = [];
      this.dataSource.depObj = [];
    } else {
      this.rawDep = { lit_type: '', seq: '', deposit: '0.00', court_fee: '0.00' };
      this.sLitType.clearModel();
    }

    this.getDataDep$ = of(this.dataHeadValue.depObj);//ทุนทรัพย์
    this.getDataAlle$ = of(this.dataHeadValue.alleObj);//ฐานความผิด
    if (this.dataHeadValue.alleObj) {
      this.runAlleSeq(this.dataHeadValue.alleObj);
    } else {
      this.alleSeq = 1;
    }
    this.getDataApp$ = of(this.dataHeadValue.appObj);//นัดความ
    this.getDataPros$ = of(this.dataHeadValue.prosObj);//โจทก์
    this.getDataAccu$ = of(this.dataHeadValue.accuObj);//จำเลย
    this.getDataLit$ = of(this.dataHeadValue.litObj);//คู่ความอื่น
    this.getDataOther$ = of(this.dataHeadValue.otherObj);//ผู้เกี่ยวข้อง

    //==================== นัดความ ===============//
    this.dataAppValue = [];
    this.dataAppValue.appoint_table = null;//รางนัด
    this.dataAppValue.appoint_date = null;//วันนัด
    this.dataAppValue.appoint_mor = '09.00';
    this.dataAppValue.appoint_eve = '13.30';
    this.dataAppValue.appoint_night = '16.30';
    //=============================================//
    this.dtOptions = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [[2, 'asc']],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true
    };

    this.alleOptions = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true
    };

    //this.rerender();
    //console.log(this.authService._baseUrl)

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name": "pcourt",
      "field_id": "court_running",
      "field_name": "court_name",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getCourt = getDataOptions;
      },     // nextHandler
    });
    //======================== pcase_status_indictment ======================================
    var student = JSON.stringify({
      "table_name": "pcase_status_indictment",
      "field_id": "indict_id",
      "field_name": "indict_status",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getIndict = getDataOptions;
        this.dataHeadValue.case_level = 1;
        },     // nextHandler
      });
    //======================== สำหรับคดีผู้บริโภค	 ======================================
    this.getCustomer = [{ fieldIdValue: 1, fieldNameValue: 'โจทก์เป็นผู้บริโภค' }, { fieldIdValue: 2, fieldNameValue: 'โจทก์เป็นผู้ประกอบการ' }, { fieldIdValue: 3, fieldNameValue: 'โจทก์เป็นผู้มีอำนาจฟ้องแทนผู้บริโภค' }];
    this.dataHeadValue.customer_flag = 2;
    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name": "plit_type",
      "field_id": "lit_type",
      "field_name": "lit_type_desc",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          this.getLitType = getDataOptions;
        },     // nextHandler
      });
    //======================== pcourt_fee ======================================
    var student = JSON.stringify({
      "table_name": "pcourt_fee",
      "field_id": "seq",
      "field_name": "fee_desc",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
        //console.log(getDataOptions)
        this.getFee = getDataOptions;
        this.dataHeadValue.fee_id = this.courtFeeValue;
        },     // nextHandler
      });
    //======================== pcase_result ======================================
    var student = JSON.stringify({
      "table_name": "pcase_result",
      "field_id": "result_id",
      "field_name": "result_desc",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          //console.log(getDataOptions)
          this.getResult = getDataOptions;
          this.dataHeadValue.case_result = 1;
        },     // nextHandler
      });
    //======================== pjudge ======================================
    var student = JSON.stringify({
      "table_name": "pjudge",
      "field_id": "judge_id",
      "field_name": "judge_name",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getJudge = getDataOptions;
        },     // nextHandler
      });

    //======================== pprovince ======================================
    var student = JSON.stringify({
      "table_name": "pprovince",
      "field_id": "prov_id",
      "field_name": "prov_name",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getCourtProv = getDataOptions;
        this.dataHeadValue.zone_prov_id = this.userData.courtProvId;
        this.changeProv(this.userData.courtProvId, '');
        },     // nextHandler
      });

    //======================== ppers_type ======================================
    var student = JSON.stringify({
      "table_name": "ppers_type",
      "field_id": "pers_type",
      "field_name": "pers_type_desc",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getPers = getDataOptions;
        this.selPers = 2;
        },     // nextHandler
      });
    //======================== ppers_title ======================================
    var student = JSON.stringify({
      "table_name": "ppers_title",
      "field_id": "pers_title",
      "field_name": "pers_title",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          this.getPersTitle = getDataOptions;
        },     // nextHandler
      });
    //======================== ppolice ======================================
    var student = JSON.stringify({
      "table_name": "ppolice",
      "field_id": "police_id",
      "field_name": "police_name",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getPolice = getDataOptions;
        },     // nextHandler
      });
    //======================== pcase_req_order ======================================
    var student = JSON.stringify({
      "table_name": "pcase_req_order",
      "field_id": "req_order_id",
      "field_name": "req_order_name",
      "field_name2": "req_order_desc",
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getOrder = getDataOptions;
        },     // nextHandler
      });
    //======================== pappoint_list ======================================
    var student = JSON.stringify({
      "table_name": "pappoint_list",
      "field_id": "app_id",
      "field_name": "app_name",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getAppList = getDataOptions;
        },     // nextHandler
      });
    //======================== pappoint_table ======================================
    /* var student = JSON.stringify({
      "table_name" : "pappoint_table",
      "field_id" : "table_id",
      "field_name" : "table_name",
      "condition" : " AND table_type='2'",
      "order_by" : " NVL(table_order,999) ASC,NVL(table_id,999) ASC",
       "userToken" : this.userData.userToken
    }); */
    var student = JSON.stringify({
      "table_name": "pappoint_table",
      "field_id": "table_id",
      "field_name": "table_name",
      "condition": this.userData.userLevel == 'A' ? " AND table_type='2'" : " AND table_type='2' AND EXISTS(SELECT * FROM pappoint_table_department WHERE pappoint_table_department.table_id=pappoint_table.table_id AND pappoint_table_department.dep_id=55)",
      "order_by": " NVL(table_order,999) ASC,NVL(table_id,999) ASC",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      {
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getAppTable = getDataOptions;
        console.log(this.getAppTable)
        },     // nextHandler
      });
    //console.log(this.dataHeadValue)
  }

  setDefAppoint() {
    this.dataAppValue = [];
    this.editApp = null;
    $("body").find("input.chkAppoint").prop("checked", false);
    this.dataAppValue.appoint_table = null;//รางนัด
    this.dataAppValue.appoint_date = null;//วันนัด
    this.dataAppValue.appoint_mor = '09.00';
    this.dataAppValue.appoint_eve = '13.30';
    this.dataAppValue.appoint_night = '16.30';
  }

  rerender(): void {
    /*
    //console.log(this.dtElement)
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      console.log(this.dtElement)
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next('');
      });
      */
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
    });
    this.dtTrigger.next('');
    this.dtTriggerPros.next('');
    this.dtTriggerAccu.next('');
    this.dtTriggerLit.next('');
    this.dtTriggerOther.next('');
    this.dtTriggerApp.next('');
    this.dtTriggerDep.next('');
    this.dtTriggerAlle.next('');
    this.dtTriggerConc.next('');

  }
  /*
  rerenderPros(): void {
    console.log("rerenderPros")
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTriggerPros.next('');
    
  }
  rerenderAccu(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTriggerAccu.next('');
  }
  rerenderLit(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTriggerLit.next('');
  }
  rerenderOther(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTriggerOther.next('');
  }
  rerenderApp(): void {
    console.log("rerenderApp")
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTriggerApp.next('');
  }
  */
  ngAfterViewInit(): void {
    //console.log("ngAfterViewInit")
    myExtObject.callCalendar();
    this.dtTrigger.next('');
    this.dtTriggerPros.next('');
    this.dtTriggerAccu.next('');
    this.dtTriggerLit.next('');
    this.dtTriggerOther.next('');
    this.dtTriggerApp.next('');
    this.dtTriggerDep.next('');
    this.dtTriggerAlle.next('');
    this.dtTriggerConc.next('');
    //==================== data service ==========//
    setTimeout(() => {
      this.sLitType.clearModel();
      this.dataService.methodToPopulateDataResult($.extend({}, this.dataHeadValue));
    }, 1000);
  }
  ngAfterContentInit(): void {

  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerPros.unsubscribe();
    this.dtTriggerAccu.unsubscribe();
    this.dtTriggerLit.unsubscribe();
    this.dtTriggerOther.unsubscribe();
    this.dtTriggerApp.unsubscribe();
    this.dtTriggerDep.unsubscribe();
    this.dtTriggerAlle.unsubscribe();
    this.dtTriggerConc.unsubscribe();
  }

  trHide(val: any) {
    //this.trHide_1 = val;
    return (val);
  }

  visibleAppointment() {
    this.visibleApp = this.visibleApp ? false : true;
    //console.log(this.visibleApp)
  }

  goToLink(url: string) {
    let winURL = this.authService._baseUrl;
    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + "fca0130";
    //console.log(winURL)
    window.open(winURL, "_blank");
  }
  gotoUrl(url: any) {
    /*
    let winURL = this.authService._baseUrl;
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+"fca0200";
    location.href = winURL;
    window.location.reload();
    */
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    location.replace(winURL + 'fca0200')
    window.location.reload();
  }
  gotoCaseJudge() {
    if (!this.dataHeadValue.run_id) {
      //-----------------------------//
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นหาเลขคดี');
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
      let winURL = this.authService._baseUrl.substring(0, this.authService._baseUrl.indexOf("#") + 1) + '/case_judge?run_id=' + this.dataHeadValue.run_id;
      console.log(winURL)
      myExtObject.OpenWindowMaxDimension(winURL, 600, screen.width - 100);
    }
  }

  openLitWindow(type: any) {
    let winURL = this.authService._baseUrl;
    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + "fca0130";
    console.log(winURL)
    var name = '';
    if (name == '')
      name = 'win_' + Math.ceil(Math.random() * 1000);
    if (this.dataHeadValue.run_id && type)
      this.windowRef = window.open(winURL + "?run_id=" + this.dataHeadValue.run_id + "&lit_type=" + type, name, "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=" + screen.availWidth + ",height=" + screen.availHeight);
    else if (this.dataHeadValue.run_id && !type)
      this.windowRef = window.open(winURL + "?run_id=" + this.dataHeadValue.run_id, name, "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=" + screen.availWidth + ",height=" + screen.availHeight);
    else
      this.windowRef = window.open(winURL, type, "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=" + screen.availWidth + ",height=" + screen.availHeight);
    console.log(this.windowRef)
    //this.windowRef.addEventListener("message",this.receivemessage.bind(this), true);
  }

  openConcWindow() {
    let winURL = this.authService._baseUrl;
    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + "case-conciliate";
    console.log(winURL)
    var name = '';
    if (name == '')
      name = 'win_' + Math.ceil(Math.random() * 1000);
    if (this.dataHeadValue.run_id)
      this.windowRef = window.open(winURL + "?run_id=" + this.dataHeadValue.run_id, '_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
    else
      this.windowRef = window.open(winURL, '_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
    console.log(this.windowRef)
  }
  editLitData(running: any) {
    let winURL = this.authService._baseUrl;
    winURL = winURL.substring(0, winURL.lastIndexOf("/") + 1) + "fca0130";
    var name = '';
    if (name == '')
      name = 'win_' + Math.ceil(Math.random() * 1000);
    this.windowRef = window.open(winURL + "?run_id=" + this.dataHeadValue.run_id + "&lit_running=" + running, "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=" + screen.availWidth + ",height=" + screen.availHeight);
    //this.windowRef.addEventListener("message",this.receivemessage.bind(this), true);
  }

  assignCourtFee() {
    //ต้องการให้ป้อนค่าขึ้นศาลอนาคต ที่หน้าจอรับฟ้อง (ค่าdefault ตามที่ set ไว้)
    console.log(this.dataHeadValue.fee_flag);
    if (this.dataHeadValue.fee_flag) {
      var student = JSON.stringify({
        "table_name": "preceipt_sub_type",
        "field_id": "receipt_type_id",
        "field_name": "default_value",
        "condition": " AND receipt_type_id =1 AND sub_type_id =2 ",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          console.log(getDataOptions[0].fieldNameValue);
          this.dataHeadValue.future_court_fee = this.curencyFormat(getDataOptions[0].fieldNameValue ? getDataOptions[0].fieldNameValue : 0, 2);
        },     // nextHandler
      });
    } else {
      this.dataHeadValue.future_court_fee = '';
    }
  }

  /*
  receivemessage(evt:any){
    console.log(evt.data)
    //if(evt.data.run_id == this.dataHeadValue.run_id){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      //============== โจทก์ ===============================
      var student = JSON.stringify({
        "run_id" : this.dataHeadValue.run_id,
        "lit_type" : 1,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.items = [];
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getLitigantData', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          if(this.items.data.length){
            this.getDataPros$ = of();
            this.getDataPros$ = of(this.items.data);
            this.dtTrigger.next('');
            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      );
      //============== จำเลย ===============================
      var student = JSON.stringify({
        "run_id" : this.dataHeadValue.run_id,
        "lit_type" : 2,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getLitigantData', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          console.log(this.items)
          if(this.items.data.length){
            this.getDataAccu$ = of(this.items.data);
            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      );
      //============== คู่ความอื่น ===============================
      var student = JSON.stringify({
        "run_id" : this.dataHeadValue.run_id,
        "lit_type_flag" :3,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getOtherData', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          console.log(this.items)
          if(this.items.data.length){
            this.getDataLit$ = of(this.items.data);
            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      );
      //============== คู่ความที่เกี่ยวข้อง ===============================
      var student = JSON.stringify({
        "run_id" : this.dataHeadValue.run_id,
        "lit_type_flag" :4,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getOtherData', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          console.log(this.items)
          if(this.items.data.length){
            this.getDataOther$ = of(this.items.data);
            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      );
    //}
  }
  */


  /*
  submitUpdateCase(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.dataHeadValue){
      //-----------------------------//
      confirmBox.setMessage('กรุณาค้นหาเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){}
        subscription.unsubscribe();
      });
    //-----------------------------//
    }else{
      if(this.dataHeadValue.run_id){
  
    var dataTemp = [],data=[];
    dataTemp.push(this.dataHeadValue);
    var jsonStr1 = JSON.stringify(dataTemp);
    var obj = JSON.parse(jsonStr1);
    obj[0].transfer_date=$("body").find(".transfer_date").val();
    data.push(obj[0]);
    console.log(data)
  
  
      }else{
        //-----------------------------//
      confirmBox.setMessage('ไม่พบข้อมูลคดี ไม่สามารถจัดเก็บได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){}
        subscription.unsubscribe();
      });
    //-----------------------------//
      }
    }

  }*/

  tabChangeSelect(objName: any, objData: any, event: any, type: any) {
    if (type == 1)
      var judge = objData.filter((x: any) => x.fieldIdValue === parseInt(event.target.value));
    else
      var judge = objData.filter((x: any) => x.fieldIdValue === parseInt(event));
    if (judge.length != 0) {
      objName.order_judge_gid = judge[0].fieldIdValue;
    }
  }
  tabChangeSelect3(objName: any, objData: any, event: any, type: any) {
    if (type == 1)
      var judge = objData.filter((x: any) => x.fieldIdValue === parseInt(event.target.value));
    else
      var judge = objData.filter((x: any) => x.fieldIdValue === parseInt(event));
    if (judge.length != 0) {
      objName.appoint_id = judge[0].fieldIdValue;
    } else {
      objName.appoint_id = '';
    }
  }
  tabChangeSelect2(objName: any, objData: any, event: any, type: any) {
    if (type == 1)
      var judge = objData.filter((x: any) => x.fieldIdValue === parseInt(event.target.value));
    else
      var judge = objData.filter((x: any) => x.fieldIdValue === parseInt(event));
    if (judge.length != 0) {
      objName.case_order_id = judge[0].fieldIdValue;
      objName.case_order_desc = judge[0].fieldNameValue2;
    }
  }

  changeProv(province: any, type: any) {
    //alert("จังหวัด :"+province)
    //this.sCourtAmphur.handleClearClick();//this.sCourtTambon.handleClearClick();//this.sCourtSubDisTric.handleClearClick();
    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "table_name": "pamphur",
      "field_id": "amphur_id",
      "field_name": "amphur_name",
      "condition": " AND prov_id='" + province + "'",
      "userToken": this.userData.userToken
    });
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getCourtAmphur = getDataOptions;
        setTimeout(() => {
          if (this.dataHeadValue.zone_amphur_id)
            this.changeAmphur(this.dataHeadValue.zone_amphur_id, type);
        }, 100);
      },     // nextHandler
    });
    if (typeof province == 'undefined' || type == 1) {
      this.sCourtAmphur.clearModel();
      //this.sCourtTambon.clearModel();
      //this.sCourtSubDisTric.clearModel();
    }
  }

  changeAmphur(Amphur: any, type: any) {
    //alert("อำเภอ :"+Amphur)
    //this.sCourtTambon.handleClearClick();//this.sCourtSubDisTric.handleClearClick();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "table_name": "ptambon",
      "field_id": "tambon_id",
      "field_name": "tambon_name",
      "condition": " AND amphur_id='" + Amphur + "' AND prov_id='" + this.dataHeadValue.zone_prov_id + "'",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
        this.getCourtTambon = getDataOptions;
        setTimeout(() => {
          if (this.dataHeadValue.zone_tambon_id)
            this.changeTambon(this.dataHeadValue.zone_tambon_id, type);
        }, 100);
        },     // nextHandler
      });
    if (typeof Amphur == 'undefined' || type == 1) {
      //this.sCourtTambon.clearModel();
      //this.sCourtSubDisTric.clearModel();
    }
  }

  changeTambon(Tambon: any, type: any) {
    //alert("ตำบล :"+Tambon)
    //this.sCourtSubDisTric.clearModel()();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "table_name": "psubdistrict",
      "field_id": "subdistrict_id",
      "field_name": "subdistrict_name",
      "condition": " AND tambon_id='" + Tambon + "' AND amphur_id='" + this.dataHeadValue.zone_amphur_id + "' AND prov_id='" + this.dataHeadValue.zone_prov_id + "'",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(v));
          this.getCourtSubDisTric = getDataOptions;
        },     // nextHandler
      });
    if (typeof Tambon == 'undefined' || type == 1) {
      //this.sCourtSubDisTric.clearModel();
    }
  }

  curencyFormat(n: any, d: any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }
  curencyFormatRevmove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, "").slice(.00, -3);;
    } else {
      return "";
    }
  }
  curencyFormatRemove(val: number): string {
    //console.log(val)
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, "");
    } else {
      return '';
    }
  }


  onClickSaveData(data: any, counter: any): void {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (this.dataHeadValue.run_id) {
      var curTitle = $("body").find("ng-select#title span.ng-value-label").html() + ' ' + $("body").find("input#id").val() + " " + $("body").find("input#yy").val();
      console.log(this.refCaseNo.replace(/\s/g, '') + "!=" + curTitle.replace(/\s/g, '') + "&&" + this.refLogin)
      if (this.refCaseNo.replace(/\s/g, '') != curTitle.replace(/\s/g, '') && (typeof this.refLogin == 'undefined' || !this.refLogin)) {
        confirmBox.setMessage('ต้องการเปลียนหมายเลขคดีดำ กรุณา login เพื่อเปลี่ยนเลขคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
      } else {
        data = this.difference(data, this.dataSource);
        counter = this.counter + 1;
        data['run_id'] = this.dataHeadValue.run_id;
        if ((typeof this.refLogin != 'undefined' && this.refLogin)) {
          data['log_remark'] = this.refLogin.log_remark;
        }
        data['userToken'] = this.userData.userToken;

        /*if(this.dataHeadValue.depObj.length>0){
          data['depData'] = this.dataHeadValue.depObj;
          delete data['depObj'];
        }*/
        delete data['accuObj'];
        console.log(data);
        this.onUpdateCase.emit({ data, counter });
      }
    } else {
      //data = this.difference(data,this.dataSource);
      data = this.dataHeadValue;
      counter = this.counter + 1;
      //data['run_id'] = this.dataHeadValue.run_id;
      if ((typeof this.refLogin != 'undefined' && this.refLogin)) {
        data['log_remark'] = this.refLogin.log_remark;
      }

      data['userToken'] = this.userData.userToken;

      /*if(this.dataHeadValue.depObj.length>0){
        data['depData'] = this.dataHeadValue.depObj;
        delete data['depObj'];
      }*/
      delete data['accuObj'];
      console.log(data);
      this.onUpdateCase.emit({ data, counter });
    }


  }



  onClickInsertCase() {
    return this.dataSource;
    //return this.difference(this.dataHeadValue,this.dataSource);
    /*
    var student = JSON.stringify({
      "password" : this.dataHeadValue.deposit,
      "log_remark" : this.dataHeadValue.prov_id
    });
    return student;
    */
  }

  onClickSaveAppoint(): void {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.dataHeadValue.run_id) {
      confirmBox.setMessage('กรุณาระบุค้นหาเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (!this.dataAppValue.appoint_table) {
      confirmBox.setMessage('กรุณาเลือกประเภทนัด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (!this.dataAppValue.appoint_date) {
      confirmBox.setMessage('กรุณาเลือกวันที่นัด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (!this.editApp && $("body").find("input.appoint_mor").prop("checked") == false && $("body").find("input.appoint_eve").prop("checked") == false && $("body").find("input.appoint_night").prop("checked") == false) {
      confirmBox.setMessage('กรุณาระบุเวลานัด เช้า / บ่าย / ค่ำ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (!this.editApp && $("body").find("input.appoint_mor").prop("checked") == true && !this.dataAppValue.appoint_mor) {
      confirmBox.setMessage('กรุณาระบุเวลานัด เช้า');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (!this.editApp && $("body").find("input.appoint_eve").prop("checked") == true && !this.dataAppValue.appoint_eve) {
      confirmBox.setMessage('กรุณาระบุเวลานัด บ่าย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (!this.editApp && $("body").find("input.appoint_night").prop("checked") == true && !this.dataAppValue.appoint_night) {
      confirmBox.setMessage('กรุณาระบุเวลานัด ค่ำ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (this.editApp && !this.dataAppValue.time_appoint) {
      confirmBox.setMessage('กรุณาระบุเวลานัด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (!this.dataAppValue.app_id) {
      confirmBox.setMessage('กรุณาเลือกเหตุที่นัด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      if (!this.editApp) {
        var ele = (<HTMLInputElement[]><any>document.getElementsByClassName("chkAppoint"));
        var ele2 = (<HTMLInputElement[]><any>document.getElementsByClassName("inputAppoint"));
        var data = [];
        for (let i = 0; i < ele.length; i++) {
          if (ele[i].checked == true) {
            var tableId = this.getAppTable.filter((x: any) => x.fieldIdValue === parseInt(this.dataAppValue.appoint_table));
            if (tableId.length != 0) {
              this.dataAppValue.table_name = tableId[0].fieldNameValue;
            }
            data.push({
              court_running: this.userData.court_running,
              app_id: this.dataAppValue.app_id,
              app_name: this.dataAppValue.app_name,
              date_appoint: this.dataAppValue.appoint_date,
              time_appoint: ele2[i].value,
              table_id: this.dataAppValue.appoint_table,
              table_name: this.dataAppValue.table_name,
            });
          }
        }
      } else {
        var data = [];
        data.push({
          court_running: this.userData.court_running,
          app_id: this.dataAppValue.app_id,
          app_name: this.dataAppValue.app_name,
          date_appoint: this.dataAppValue.appoint_date,
          time_appoint: this.dataAppValue.time_appoint,
          table_id: this.dataAppValue.appoint_table,
          table_name: this.dataAppValue.table_name,
          app_running: this.dataAppValue.app_running
        });
      }
      //console.log()
      var element = JSON.stringify({ 'run_id': this.dataHeadValue.run_id, 'userToken': this.userData.userToken, data });
      console.log(element)
      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');

      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.http.post('/' + this.userData.appName + 'ApiAP/API/APPOINT/insertAppoint', element, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
        next: (v) => {
          //console.log(response)
          let alertMessage: any = JSON.parse(JSON.stringify(v));
          //console.log(alertMessage)
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
            this.dataAppValue.appoint_date = '';
            $("body").find("input.chkAppoint").prop("checked", false);
            if (this.editApp) {
              this.editApp = null;
              this.dataAppValue.appoint_mor = '09.00';
              this.dataAppValue.appoint_eve = '13.30';
              this.dataAppValue.appoint_night = '16.30';
            }
            this.getObjAppData();
          }
        },     // nextHandler
      });
    }
  }

  onClickSaveProsData(): void {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.selPers) {
      confirmBox.setMessage('กรุณาเลือกประเภทบุคคล');
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
    }/*else if(this.selPers==2 && !this.selPersTitle){
      confirmBox.setMessage('กรุณาเลือกคำนำหน้า');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
          //this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    }*/else if (!this.selPersName) {
      confirmBox.setMessage('กรุณาระบุ ชื่อ/ชื่อสกุล');
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
      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      if (this.selPers == 2) {
        var student = JSON.stringify({
          "run_id": this.dataHeadValue.run_id,
          "lit_type": 1,
          "pers_type": this.selPers,
          "title": this.selPersTitle,
          "name": this.selPersName,
          "userToken": this.userData.userToken
        });
      } else {
        if (this.addressOrg.length) {
          var student = JSON.stringify({
            "run_id": this.dataHeadValue.run_id,
            "lit_type": 1,
            "pers_type": this.selPers,
            "title": this.selPersTitle,
            "name": this.selPersName,
            "id_card": this.addressOrg[0].id_card,
            "address": this.addressOrg[0].address,
            "addr_no": this.addressOrg[0].addr_no,
            "moo": this.addressOrg[0].moo,
            "soi": this.addressOrg[0].soi,
            "road": this.addressOrg[0].road,
            "near_to": this.addressOrg[0].near_to,
            "prov_id": this.addressOrg[0].prov_id,
            "amphur_id": this.addressOrg[0].amphur_id,
            "tambon_id": this.addressOrg[0].tambon_id,
            "post_no": this.addressOrg[0].post_code,
            "country_id": this.addressOrg[0].country_id,
            "userToken": this.userData.userToken
          });
          this.addressOrg = [];
        } else {
          var student = JSON.stringify({
            "run_id": this.dataHeadValue.run_id,
            "lit_type": 1,
            "pers_type": this.selPers,
            "title": this.selPersTitle,
            "name": this.selPersName,
            "id_card": '',
            "address": '',
            "addr_no": '',
            "moo": '',
            "soi": '',
            "road": '',
            "near_to": '',
            "prov_id": '',
            "amphur_id": '',
            "tambon_id": '',
            "post_no": '',
            "country_id": '',
            "userToken": this.userData.userToken
          });
        }
      }

      console.log(student);
      this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/insertLitigant', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
        next: (v) => {
          console.log(v)
          let alertMessage: any = JSON.parse(JSON.stringify(v));
          //console.log(alertMessage)
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
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
            this.sPers.clearModel();
            if (this.selPers == 2)
              this.sPersTitle.clearModel();
            this.selPersName = '';
            this.getLitData(1);
            //============================ reload head ================================
            var counter = this.counter++;
            var data = { 'run_id': this.dataHeadValue.run_id };
            this.onReloadCase.emit({ data, counter });
            //========================================================================
          }
        },     // nextHandler
      });
    }
  }

  difference(object: any, base: any) {
    return transform(object, (result: any, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
      }
    });
  }

  openNav() {
    document.getElementById("sidebar").style.width = "auto";
    document.getElementById("sidebar-close").style.display = "block";
    document.getElementById("sidebar-open").style.display = "none";
    document.getElementById("form_button").style.display = "block";
  }

  closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("sidebar-close").style.display = "none";
    document.getElementById("sidebar-open").style.display = "block";
    document.getElementById("form_button").style.display = "none";
  }

  tabChangeInput(name: any, event: any) {
    if (name == 'alle_id') {
      var student = JSON.stringify({
        "table_name": "pallegation_cover",
        "field_id": "alle_id",
        "field_name": "alle_name",
        "condition": " AND case_type='" + this.dataHeadValue.case_type + "' AND alle_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.dataHeadValue.alle_desc = productsJson[0].fieldNameValue;
          } else {
            this.dataHeadValue.alle_id = '';
            this.dataHeadValue.alle_desc = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'sjudge_id') {
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
            this.dataHeadValue.sjudge_name = productsJson[0].fieldNameValue;
          } else {
            this.dataHeadValue.sjudge_id = '';
            this.dataHeadValue.sjudge_name = '';
          }
        },
        (error) => { }
      )
    }
  }
  receivePersData(event: any) {
    console.log(event)
    this.addressOrg = event;
    this.selPersName = event[0].pers_desc;
    // this.closebutton.nativeElement.click();
  }
  receiveFuncListData(event: any) {
    var data = [event];
    if (this.listTable == 'pallegation') {
      this.insertAlle(data[0]);
    }
    if (this.listTable == 'pappoint_list') {
      this.dataAppValue.app_id = event.fieldIdValue;
      this.dataAppValue.app_name = event.fieldNameValue;
    }
    console.log(event)
    if (this.modalType == 2) {
      this.dataHeadValue.sjudge_id = event.fieldIdValue;
      this.dataHeadValue.sjudge_name = event.fieldNameValue;
      this.getPost(event.fieldNameValue2, this.modalType);
    }
    //this.fct9908.nativeElement[this.listFieldId].value=event.fieldIdValue;
    //this.fct9908.nativeElement[this.listFieldName].value=event.fieldNameValue;
    // this.closebutton.nativeElement.click();
  }
  receiveFuncListMultiData(event: any) {

    if (this.modalType == 1) {
      this.dataHeadValue.alle_id = event.fieldIdValue;
      this.dataHeadValue.alle_desc = this.dataHeadValue.alle_desc + event.fieldNameValue;
    }
    // this.closebutton.nativeElement.click();
  }
  receiveJudgeListData(event: any) {
    this.dataHeadValue.order_judge_id = event.judge_id;
    this.dataHeadValue.order_judge_name = event.judge_name;
    this.dataHeadValue.order_judge_date = myExtObject.curDate();
    // this.closebutton.nativeElement.click();
  }
  receiveAlleData(event: any) {
    this.SpinnerService.show();
    var data = event;
    var element = JSON.stringify({ 'run_id': this.dataHeadValue.run_id, 'userToken': this.userData.userToken, data });
    console.log(element)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    //this.SpinnerService.show(); 
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/insertAllAllegation', element, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
        next: (v) => {
          console.log(v)
        let alertMessage: any = JSON.parse(JSON.stringify(v));
        //console.log(alertMessage)
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
              this.getObjAlleData();
              this.getAlleDesc();
            }
            subscription.unsubscribe();
          });
        } else {
          this.getObjAlleData();
          this.getAlleDesc();
        }
        },     // nextHandler
      });
    // this.closebutton.nativeElement.click();
  }

  changeInputData(event: any, table: any, type: any) {
    //alert(event.target.value)
    if (table == 'pallegation' && type == 1) {
      //this.SpinnerService.show();
      if (event.target.value) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        var student = JSON.stringify({
          "table_name": "pallegation",
          "field_id": "alle_id",
          "field_name": "alle_name",
          "field_name2": "alle_running",
          "search_id": "",
          "search_desc": "",
          "condition": " AND case_type='" + this.dataHeadValue.case_type + "' AND case_cate_group='" + this.dataHeadValue.case_cate_group + "' AND user_select='1' AND alle_id='" + event.target.value + "'",
          "userToken": this.userData.userToken
        });
        console.log(student);

        this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student, { headers: headers }).subscribe({
          complete: () => { }, // completeHandler
          error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
          next: (v) => {
            this.list = v;
            if (this.list.length) {
              this.insertAlle(this.list);
            } else {
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage('ไม่พบรหัสฐานความผิดนี้ในระบบ');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.alleId = '';
                }
                subscription.unsubscribe();
              });
            }
            console.log(this.list)
            this.SpinnerService.hide();
          },     // nextHandler
        });
      }
    } else if (table == 'pappoint_list' && type == 1) {
      var getVal = this.getAppList.filter((x: any) => x.fieldIdValue === parseInt(event.target.value));
      if (getVal.length != 0) {
        this.dataAppValue.app_name = getVal[0].fieldNameValue;
      }
    }
  }

  insertAlle(event: any) {
    console.log(event)
    //var data = event[0];
    //console.log(data.fieldIdValue+":"+data.fieldNameValue+":"+data.fieldNameValue2)
    var student = JSON.stringify({
      "run_id": this.dataHeadValue.run_id,
      "alle_running": event.fieldNameValue2,
      "alle_id": event.fieldIdValue,
      "alle_seq": this.alleSeq,
      "alle_name": event.fieldNameValue,
      "userToken": this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/insertAllegation', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
      next: (v) => {
        let alertMessage: any = JSON.parse(JSON.stringify(v));
        if (alertMessage.result == 0) {
          this.SpinnerService.hide();
          confirmBox.setMessage(alertMessage.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              this.getObjAlleData();
              this.getAlleDesc();
              //this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
        } else {
          this.getObjAlleData();
          this.getAlleDesc();
        }
      },     // nextHandler
    });
  }

  getAlleDesc() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "table_name": "pcase",
      "field_id": "run_id",
      "field_name": "alle_desc",
      "condition": " AND run_id='" + this.dataHeadValue.run_id + "'",
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        if (getDataOptions.length) {
          this.dataHeadValue.alle_desc = getDataOptions[0].fieldNameValue;
        }
      },     // nextHandler
    });
  }

  getObjAlleData() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    var student = JSON.stringify({
      "run_id": this.dataHeadValue.run_id,
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.dataHeadValue.alleObj = [];
    this.getDataAlle$ = of();
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/getAllegationData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
      next: (v) => {
        this.items = v;
        console.log(this.items)
        if (this.items.data.length) {
          var bar = new Promise((resolve, reject) => {
            this.items.data.forEach((x: any) => x.seqAlle = false);
          });

          if (bar) {
            this.dataHeadValue.alleObj = this.items.data;
            this.getDataAlle$ = of(this.dataHeadValue.alleObj);
            this.buttonDelAlle = false;
            this.rerender();
            this.runAlleSeq(this.dataHeadValue.alleObj);
            this.SpinnerService.hide();
          }
        } else {
          this.runAlleSeq([]);
        }
      },     // nextHandler
    });
  }

  getObjAppData() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "run_id": this.dataHeadValue.run_id,
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCA/API/APPOINT/getAppointData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
      next: (v) => {
        this.items = v;
        console.log(this.items)
        if (this.items.data.length) {
          this.dataHeadValue.appObj = this.items.data;
          this.getDataApp$ = of(this.items.data);
          this.rerender();
          this.SpinnerService.hide();
        } else {
          this.dataHeadValue.appObj = [];
          this.getDataApp$ = of();
          this.rerender();
          this.SpinnerService.hide();
        }
      },     // nextHandler
    });
  }

  getObjDepData() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "run_id": this.dataHeadValue.run_id,
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/getDepositData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
      next: (v) => {
        this.items = v;
        console.log(this.items)
        if (this.items.data.length) {
          this.dataHeadValue.depObj = this.items.data;
          this.getDataDep$ = of(this.items.data);
          this.dataHeadValue.depObj.forEach((r: any, index: any, array: any) => {
            r.deposit = this.curencyFormat(r.deposit, 2)
            r.court_fee = this.curencyFormat(r.court_fee, 2)
          });
          this.rerender();
          this.SpinnerService.hide();
        } else {
          this.dataHeadValue.depObj = [];
          this.getDataDep$ = of();
          this.rerender();
          this.SpinnerService.hide();
        }
      },     // nextHandler
    });
  }

  getLitData(litType: any) {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "run_id": this.dataHeadValue.run_id,
      "lit_type": litType,
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/getLitigantData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
      next: (v) => {
        this.items = v;
        console.log(this.items)

        if (this.items.data.length) {
          var bar = new Promise((resolve, reject) => {
            if (litType == 1)
              this.items.data.forEach((x: any) => x.seqPros = false);
            if (litType == 2)
              this.items.data.forEach((x: any) => x.seqAccu = false);
            if (litType == 3)
              this.items.data.forEach((x: any) => x.seqLit = false);
            if (litType == 4)
              this.items.data.forEach((x: any) => x.seqOther = false);
          });

          if (bar) {
            if (litType == 1) {
              //this.getDataPros$ = of();
              //$('#equictntbl').dataTable().fnDestroy();
              this.dataHeadValue.prosObj = this.items.data;
              this.getDataPros$ = of(this.items.data);
              this.buttonDelPros = this.masterSelPros = false;
              this.rerender();
            } else if (litType == 2) {
              this.dataHeadValue.accuObj = this.items.data;
              this.getDataAccu$ = of(this.items.data);
              this.buttonDelAccu = this.masterSelAccu = false;
              this.rerender();
            } else if (litType == 3) {
              this.dataHeadValue.litObj = this.items.data;
              this.getDataLit$ = of(this.items.data);
              this.buttonDelLit = this.masterSelLit = false;
              this.rerender();
            } else if (litType == 4) {
              this.dataHeadValue.otherObj = this.items.data;
              this.getDataOther$ = of(this.items.data);
              this.buttonDelOther = this.masterSelOther = false;
              this.rerender();
            }
            this.SpinnerService.hide();
          }

        } else {
          var bar = new Promise((resolve, reject) => {
            if (litType == 1)
              this.items.data.forEach((x: any) => x.seqPros = false);
            if (litType == 2)
              this.items.data.forEach((x: any) => x.seqAccu = false);
            if (litType == 3)
              this.items.data.forEach((x: any) => x.seqLit = false);
            if (litType == 4)
              this.items.data.forEach((x: any) => x.seqOther = false);
          });
          if (bar) {
            if (litType == 1) {
              this.dataHeadValue.prosObj = [];
              this.getDataPros$ = of();
              this.buttonDelPros = this.masterSelPros = false;
              this.rerender();
            } else if (litType == 2) {
              this.dataHeadValue.accuObj = [];
              this.getDataAccu$ = of();
              this.buttonDelAccu = this.masterSelAccu = false;
              this.rerender();
            } else if (litType == 3) {
              this.dataHeadValue.litObj = [];
              this.getDataLit$ = of();
              this.buttonDelLit = this.masterSelLit = false;
              this.rerender();
            } else if (litType == 4) {
              this.dataHeadValue.otherObj = [];
              this.getDataOther$ = of();
              this.buttonDelOther = this.masterSelOther = false;
              this.rerender();
            }
          }

          this.SpinnerService.hide();
        }
      },     // nextHandler
    });
  }

  delCaseNo(type: any) {
    if (!this.dataHeadValue.run_id) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบเลขคดีที่ต้องการลบ กรุณาค้นหาเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      this.delTypeApp = type;
      // this.openbutton.nativeElement.click();
      this.onOpenConfirm(1);
    }
  }

  delLitData(type: any) {
    this.delTypeApp = type;
    // this.openbutton.nativeElement.click();
    this.onOpenConfirm(1);
  }
  delAlleData(type: any) {
    this.delTypeApp = type;
    // this.openbutton.nativeElement.click();
    this.onOpenConfirm(1);
  }
  delDeposit(type: any, index: any) {
    this.delTypeApp = type;
    this.delDepIndex = index;
    // this.openbutton.nativeElement.click();
    this.onOpenConfirm(1);
  }
  delAppData(type: any, index: any) {
    this.delTypeApp = type;
    this.delAppIndex = index;
    // this.openbutton.nativeElement.click();
    this.onOpenConfirm(1);
  }

  editAppData(index: any) {
    this.SpinnerService.show();
    this.editApp = 1;
    this.visibleApp = true;
    this.dataAppValue = [];
    var dataAppValue = JSON.parse(JSON.stringify(this.dataHeadValue.appObj[index]));
    console.log(dataAppValue)
    this.dataAppValue.appoint_table = dataAppValue.table_id;
    this.dataAppValue.appoint_date = dataAppValue.date_appoint;
    this.dataAppValue.time_appoint = dataAppValue.time_appoint.split('-')[0];
    this.dataAppValue.app_id = dataAppValue.app_id;
    this.dataAppValue.app_name = dataAppValue.app_name;
    this.dataAppValue.app_running = dataAppValue.app_running;
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 200);
  }

  /*closeModal() {
    this.loadComponent = false; //popup
    this.loadModalComponent = false; //password confirm
    this.loadModalAlleComponent = false; //popup alle
    this.loadModalJudgeComponent = false; //popup judge
    this.loadModalMultiComponent = false;
    this.loadDataListOrgComponent = false;
    this.listFieldCond = null;
    //this.loadModalConcComponent = false; //popup conciliate
  }

  loadMyModalComponent() {
    $(".modal-backdrop").remove();
    this.loadComponent = false; //popup
    this.loadModalComponent = true;  //password confirm
    this.loadModalAlleComponent = false;//alle all
    this.loadModalJudgeComponent = false; //popup judge
    this.loadModalMultiComponent = false;
    this.loadDataListOrgComponent = false;
    //this.loadModalConcComponent = false; //popup conciliate
    $("#exampleModal-3").find(".modal-content").css("width", "650px");
    $("#exampleModal-3").find(".modal-body").css("height", "auto");
    $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
  }*/

  /*loadMyModalConcComponent() {
    $(".modal-backdrop").remove();
    this.loadComponent = false; //popup
    this.loadModalComponent = false;  //password confirm
    this.loadModalAlleComponent = false;//alle all
    this.loadModalJudgeComponent = false; //popup judge
    this.loadModalMultiComponent = false;
    this.loadDataListOrgComponent = false;
    //this.loadModalConcComponent = true; //popup conciliate
    $("#exampleModal-3").find(".modal-content").css({ "width": "1200px", "left": "-50%" });
    $("#exampleModal-3").find(".modal-body").css("height", "auto");
    $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
    myExtObject.openModalDraggable($("#exampleModal-3"));
  }*/

  /*loadMyModalJudgeComponent(val: any) {

    $(".modal-backdrop").remove();
    this.loadComponent = false; //popup
    this.loadModalComponent = false; //password confirm
    this.loadModalAlleComponent = false; //popup alle
    this.loadModalJudgeComponent = true; //popup judge
    this.loadModalMultiComponent = false;
    this.loadDataListOrgComponent = false;
    //this.loadModalConcComponent = false; //popup conciliate
    $("#exampleModal-3").find(".modal-content").css("width", "650px");
    $("#exampleModal-3").find(".modal-body").css("height", "auto");
    $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
    if (val == 1) {
      if (typeof this.dataHeadValue.case_date == 'undefined') {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = Number(today.getMonth() + 1);
        var yyyy = today.getFullYear() + 543;
        var caseDate: any = dd + '/' + mm + "/" + yyyy;
      } else {
        if (this.dataHeadValue.case_date)
          var caseDate: any = this.dataHeadValue.case_date;
        else
          var caseDate: any = '';
      }
      var student = JSON.stringify({
        "cond": 2,
        "assign_date": caseDate,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldNull = '';
      this.listFieldType = JSON.stringify({
        "type": 1,
        "assign_date": caseDate
      });
    } else {
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldNull = '';
      this.listFieldType = JSON.stringify({ "type": 2 });
    }
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupJudge', student, { headers: headers }).subscribe(
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
  }

  clickOpenMyModalComponent(type: any) {
    $(".modal-backdrop").remove();
    this.modalType = type;
    if (this.modalType == 1) {
      $("#exampleModal-3").find(".modal-content").css("width", "800px");
      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadModalAlleComponent = false;
      this.loadModalJudgeComponent = false; //popup judge
      this.loadModalMultiComponent = true;
      this.loadDataListOrgComponent = false;
      var student = JSON.stringify({
        "table_name": "pallegation_cover",
        "field_id": "alle_id",
        "field_name": "alle_name",
        "condition": " AND case_type='" + this.dataHeadValue.case_type + "'",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pallegation_cover';
      this.listFieldId = 'alle_id';
      this.listFieldName = 'alle_name';
      this.listFieldNull = '';
      this.listFieldCond = " AND case_type='" + this.dataHeadValue.case_type + "'";
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
        },
        (error) => { }
      )
    } else if (this.modalType == 2) {
      $("#exampleModal-3").find(".modal-content").css("width", "800px");
      this.loadComponent = true;
      this.loadModalComponent = false;
      this.loadModalAlleComponent = false;
      this.loadModalJudgeComponent = false; //popup judge
      this.loadModalMultiComponent = false;
      this.loadDataListOrgComponent = false;
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "field_name2": "post_id",
        "condition": " AND (end_date>=CURRENT_DATE OR end_date IS NULL)",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldName2 = 'post_id';
      this.listFieldNull = '';
      this.listFieldCond = " AND (end_date>=CURRENT_DATE OR end_date IS NULL)";
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
        },
        (error) => { }
      )
    } else if (this.modalType == 3) {
      $("#exampleModal-3").find(".modal-content").css("width", "800px");
      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadModalAlleComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalMultiComponent = false;
      this.loadDataListOrgComponent = true;
    }

  }

  loadMyChildComponent(val: any) {
    this.modalType = null;
    $(".modal-backdrop").remove();
    if (val == 1 || val == 2) {
      var student = JSON.stringify({
        "table_name": "pallegation",
        "field_id": "alle_id",
        "field_name": "alle_name",
        "field_name2": "alle_running",
        "search_id": "",
        "search_desc": "",
        "condition": " AND case_type='" + this.dataHeadValue.case_type + "' AND case_cate_group='" + this.dataHeadValue.case_cate_group + "' AND user_select=1",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pallegation';
      this.listFieldId = 'alle_id';
      this.listFieldName = 'alle_name';
      this.listFieldNull = '';
    } else if (val == 3) {
      var student = JSON.stringify({ "table_name": "pappoint_list", "field_id": "app_id", "field_name": "app_name", "search_id": "", "search_desc": "", "userToken": this.userData.userToken });
      this.listTable = 'pappoint_list';
      this.listFieldId = 'app_id';
      this.listFieldName = 'app_name';
      this.listFieldNull = '';
    } else {
      var student = JSON.stringify({ "table_name": "pposition", "field_id": "post_id", "field_name": "post_name", "search_id": "", "search_desc": "", "userToken": this.userData.userToken });
      this.listTable = 'pposition';
      this.listFieldId = 'post_id';
      this.listFieldName = 'post_name';
      this.listFieldNull = '';
    }

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    //var student = JSON.stringify({"table_name" : this.form.get("table_name")?.value, "field_id" : this.form.get("field_id")?.value,"field_name" : this.form.get("field_name")?.value});
    //console.log(student)

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student, { headers: headers }).subscribe(
      (response) => {
        this.list = response;
        if (val == 1 || val == 3) {//คลิก popup แรก ฐานความผิดสถิติ
          this.loadComponent = true;
          this.loadModalComponent = false;
          this.loadModalAlleComponent = false;
          this.loadModalJudgeComponent = false; //popup judge
          this.loadModalMultiComponent = false;
          this.loadDataListOrgComponent = false;
          $("#exampleModal-3").find(".modal-content").css("width", "600px");
        } else if (val == 2) {//คลิก popup ตัวที่สอง ฐานความผิดสถิติ
          this.loadModalAlleComponent = true;
          this.loadComponent = false;
          this.loadModalComponent = false;
          this.loadModalJudgeComponent = false; //popup alle
          this.loadModalMultiComponent = false;
          this.loadDataListOrgComponent = false;
          $("#exampleModal-3").find(".modal-content").css("width", "800px");
        } else {
          $("#exampleModal-3").find(".modal-content").css("width", "600px");
        }

        $("#exampleModal-3").find(".modal-body").css("height", "auto");
        $("#exampleModal-3").css({ "background": "rgba(51,32,0,.4)" });
        console.log(response)
      },
      (error) => { }
    )

  }*/

  getPost(post_id: any, modalType: any) {
    if (post_id) {
      var student = JSON.stringify({
        "table_name": "pposition",
        "field_id": "post_id",
        "field_name": "post_name",
        //"condition" : " AND post_id='"+post_id+"'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            if (modalType == 2) {
              if (post_id == 1)
                this.dataHeadValue.spost_name = productsJson[0].fieldNameValue + this.userData.courtName;
              else {
                //this.dataHeadValue.spost_name = "ผู้พิพากษาประจำศูนย์ไกล่เกลี่ย"+this.userData.courtName;
                var post = productsJson.filter((x: any) => x.fieldIdValue === post_id);
                if (post.length) {
                  this.dataHeadValue.spost_name = post[0].fieldNameValue + this.userData.courtName + '\nผู้พิพากษาประจำศูนย์ไกล่เกลี่ย' + this.userData.courtName;
                } else {
                  this.dataHeadValue.spost_name = 'ผู้พิพากษาประจำศูนย์ไกล่เกลี่ย' + this.userData.courtName;
                }
                //this.dataHeadValue.spost_name = post[0].fieldNameValue+"\nทำการแทน"+productsJson[0].fieldNameValue+this.userData.courtName;

              }
            }
          } else {
            if (modalType == 2)
              this.dataHeadValue.spost_name = '';
          }
        },
        (error) => { }
      )
    }
  }



  runAlleSeq(dataObj: any) {
    console.log(dataObj)
    if (dataObj.length) {
      const item = dataObj.reduce((prev: any, current: any) => (+prev.alle_seq > +current.alle_seq) ? prev : current)
      this.alleSeq = item.alle_seq + 1;
    } else {
      this.alleSeq = 1;
    }
  }

  submitModalForm(log_remark:any) {
    const confirmBox2 = new ConfirmBoxInitializer();
    confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
    if (this.delTypeApp == 'delCase') {
      confirmBox2.setMessage('ยืนยันการลบเลขคดี ' + this.dataHeadValue.title + this.dataHeadValue.id + "/" + this.dataHeadValue.yy);
    } else {
      confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
    }
    confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');

    // Choose layout color type
    confirmBox2.setConfig({
     layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) {
        var dataDel = [], dataTmp = [];
        dataDel['run_id'] = this.dataHeadValue.run_id;
        dataDel['log_remark'] = log_remark;
        dataDel['userToken'] = this.userData.userToken;

        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');

        if (this.delTypeApp == 'delPros') {//======================= โจทก์
          var bar = new Promise((resolve, reject) => {
            this.dataHeadValue.prosObj.forEach((ele, index, array) => {
              if (ele.seqPros == true) {
                dataTmp.push(this.dataHeadValue.prosObj[index]);
              }
            });
          });

          if (bar) {
            this.SpinnerService.show();
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            dataDel['data'] = dataTmp;
            var data = $.extend({}, dataDel);
            console.log(data)
            this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllLitigantData', data, { headers: headers }).subscribe({
              complete: () => { }, // completeHandler
              error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
              next: (v) => {
                let alertMessage: any = JSON.parse(JSON.stringify(v));
                if (alertMessage.result == 0) {
                  this.SpinnerService.hide();
                } else {
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                   layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success == true) {
                      // this.closebutton.nativeElement.click();
                      this.SpinnerService.hide();
                      this.getLitData(1);
                      //============================ reload head ================================
                      var counter = this.counter++;
                      var data = { 'run_id': this.dataHeadValue.run_id };
                      this.onReloadCase.emit({ data, counter });
                      //========================================================================
                    }
                    subscription.unsubscribe();
                  });

                }
              },     // nextHandler
            });
          }
        } else if (this.delTypeApp == 'delAccu') {//======================= จำเลย
          var bar = new Promise((resolve, reject) => {
            this.dataHeadValue.accuObj.forEach((ele, index, array) => {
              if (ele.seqAccu == true) {
                dataTmp.push(this.dataHeadValue.accuObj[index]);
              }
            });
          });

          if (bar) {
            this.SpinnerService.show();
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            dataDel['data'] = dataTmp;
            var data = $.extend({}, dataDel);
            console.log(data)
            this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllLitigantData', data, { headers: headers }).subscribe({
              complete: () => { }, // completeHandler
              error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
              next: (v) => {
                let alertMessage: any = JSON.parse(JSON.stringify(v));
                if (alertMessage.result == 0) {
                  this.SpinnerService.hide();
                } else {
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                   layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success == true) {
                      // this.closebutton.nativeElement.click();
                      this.SpinnerService.hide();
                      this.getLitData(2);
                      //============================ reload head ================================
                      var counter = this.counter++;
                      var data = { 'run_id': this.dataHeadValue.run_id };
                      this.onReloadCase.emit({ data, counter });
                      //========================================================================
                    }
                    subscription.unsubscribe();
                  });

                }
              },     // nextHandler
            });
          }
        } else if (this.delTypeApp == 'delLit') {//======================= ผู้เกี่ยวข้อง
          var bar = new Promise((resolve, reject) => {
            this.dataHeadValue.litObj.forEach((ele, index, array) => {
              if (ele.seqLit == true) {
                dataTmp.push(this.dataHeadValue.litObj[index]);
              }
            });
          });

          if (bar) {
            this.SpinnerService.show();
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            dataDel['data'] = dataTmp;
            var data = $.extend({}, dataDel);
            console.log(data)
            this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllLitigantData', data, { headers: headers }).subscribe({
              complete: () => { }, // completeHandler
              error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
              next: (v) => {
                let alertMessage: any = JSON.parse(JSON.stringify(v));
                console.log(alertMessage)
                if (alertMessage.result == 0) {
                  this.SpinnerService.hide();
                } else {
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                   layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success == true) {
                      // this.closebutton.nativeElement.click();
                      this.SpinnerService.hide();
                      this.getLitData(3);
                      //============================ reload head ================================
                      var counter = this.counter++;
                      var data = { 'run_id': this.dataHeadValue.run_id };
                      this.onReloadCase.emit({ data, counter });
                      //========================================================================
                    }
                    subscription.unsubscribe();
                  });

                }
              },     // nextHandler
            });
          }
        } else if (this.delTypeApp == 'delOther') {//======================= อื่นๆ
          var bar = new Promise((resolve, reject) => {
            this.dataHeadValue.otherObj.forEach((ele, index, array) => {
              if (ele.seqOther == true) {
                dataTmp.push(this.dataHeadValue.otherObj[index]);
              }
            });
          });

          if (bar) {
            this.SpinnerService.show();
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            dataDel['data'] = dataTmp;
            var data = $.extend({}, dataDel);
            console.log(data)
            this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllLitigantData', data, { headers: headers }).subscribe({
              complete: () => { }, // completeHandler
              error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
              next: (v) => {
                let alertMessage: any = JSON.parse(JSON.stringify(v));
                if (alertMessage.result == 0) {
                  this.SpinnerService.hide();
                } else {
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                   layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success == true) {
                      // this.closebutton.nativeElement.click();
                      this.SpinnerService.hide();
                      this.getLitData(4);
                      //============================ reload head ================================
                      var counter = this.counter++;
                      var data = { 'run_id': this.dataHeadValue.run_id };
                      this.onReloadCase.emit({ data, counter });
                      //========================================================================
                    }
                    subscription.unsubscribe();
                  });

                }
              },     // nextHandler
            });
          }
        } else if (this.delTypeApp == 'delApp') {//======================= นัดความ
          var bar = new Promise((resolve, reject) => {
            dataTmp.push(this.dataHeadValue.appObj[this.delAppIndex]);
          });

          if (bar) {
            this.SpinnerService.show();
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            dataDel['data'] = dataTmp;
            var data = $.extend({}, dataDel);
            console.log(data)
            this.http.post('/' + this.userData.appName + 'ApiAP/API/APPOINT/deleteAllAppointDataByDate', data, { headers: headers }).subscribe({
              complete: () => { }, // completeHandler
              error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
              next: (v) => {
                let alertMessage: any = JSON.parse(JSON.stringify(v));
                if (alertMessage.result == 0) {
                  this.SpinnerService.hide();
                } else {
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                   layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success == true) {
                      // this.closebutton.nativeElement.click();
                      this.SpinnerService.hide();
                      this.getObjAppData();
                    }
                    subscription.unsubscribe();
                  });

                }
              },     // nextHandler
            });
          }
        } else if (this.delTypeApp == 'delDep') {//======================= ทุนทรัพย์
          var bar = new Promise((resolve, reject) => {
            dataTmp.push(this.dataHeadValue.depObj[this.delDepIndex]);
            dataTmp[0]['court_type_id'] = this.userData.courtTypeId;
          });

          if (bar) {
            this.SpinnerService.show();
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            dataDel['data'] = dataTmp;
            var data = $.extend({}, dataDel);
            console.log(data)
            this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllDepositData', data, { headers: headers }).subscribe({
              complete: () => { }, // completeHandler
              error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
              next: (v) => {
                let alertMessage: any = JSON.parse(JSON.stringify(v));
                console.log(alertMessage)
                if (alertMessage.result == 0) {
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                   layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success == true) { this.SpinnerService.hide(); }
                    subscription.unsubscribe();
                  });
                } else {
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                   layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success == true) {
                      // this.closebutton.nativeElement.click();
                      if (alertMessage.deposit != null)
                        this.dataHeadValue.deposit = this.curencyFormat(alertMessage.deposit, 2);
                      if (alertMessage.court_fee != null)
                        this.dataHeadValue.court_fee = this.curencyFormat(alertMessage.court_fee, 2);
                      this.sumDeposit();
                      this.SpinnerService.hide();
                      this.getObjDepData();
                    }
                    subscription.unsubscribe();
                  });

                }
              },     // nextHandler
            });

          }
        } else if (this.delTypeApp == 'delAlle') {//======================= ฐานความผิด
          var bar = new Promise((resolve, reject) => {
            this.dataHeadValue.alleObj.forEach((ele, index, array) => {
              if (ele.seqAlle == true) {
                dataTmp.push(this.dataHeadValue.alleObj[index]);
              }
            });
          });

          if (bar) {
            this.SpinnerService.show();
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            dataDel['data'] = dataTmp;
            var data = $.extend({}, dataDel);
            console.log(data)
            this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllAllegationData', data, { headers: headers }).subscribe({
              complete: () => { }, // completeHandler
              error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
              next: (v) => {
                let alertMessage: any = JSON.parse(JSON.stringify(v));
                console.log(alertMessage)
                if (alertMessage.result == 0) {
                  this.SpinnerService.hide();
                } else {
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                   layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success == true) {
                      // this.closebutton.nativeElement.click();
                      this.SpinnerService.hide();
                      this.masterSelAlle = this.buttonDelAlle = false;
                      this.getObjAlleData();
                    }
                    subscription.unsubscribe();
                  });

                }
              },     // nextHandler
            });
          }
        } else if (this.delTypeApp == 'delCase') {//======================= เลขคดี
          this.SpinnerService.show();
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type', 'application/json');
          dataDel['data'] = dataTmp;
          var data = $.extend({}, dataDel);
          console.log(data)
          this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteCaseData', data, { headers: headers }).subscribe({
            complete: () => { }, // completeHandler
            error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
            next: (v) => {
              let alertMessage: any = JSON.parse(JSON.stringify(v));
              console.log(alertMessage)
              if (alertMessage.result == 0) {
                this.SpinnerService.hide();
              } else {
                confirmBox.setMessage('ลบเลขคดี ' + this.dataHeadValue.title + this.dataHeadValue.id + "/" + this.dataHeadValue.yy + ' ออกจากระบบเรียบร้อยแล้ว');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success == true) {
                    //this.closebutton.nativeElement.click();
                    this.SpinnerService.hide();
                    window.location.reload();
                  }
                  subscription.unsubscribe();
                });

              }
            },     // nextHandler
          });
        }
      }
      subscription2.unsubscribe();
    });
  }

  /*submitModalForm() {
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
            const confirmBox2 = new ConfirmBoxInitializer();
            confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            if (this.delTypeApp == 'delCase') {
              confirmBox2.setMessage('ยืนยันการลบเลขคดี ' + this.dataHeadValue.title + this.dataHeadValue.id + "/" + this.dataHeadValue.yy);
            } else {
              confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            }
            confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');

            // Choose layout color type
            confirmBox2.setConfig({
             layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                var dataDel = [], dataTmp = [];
                dataDel['run_id'] = this.dataHeadValue.run_id;
                dataDel['log_remark'] = chkForm.log_remark;
                dataDel['userToken'] = this.userData.userToken;

                if (this.delTypeApp == 'delPros') {//======================= โจทก์
                  var bar = new Promise((resolve, reject) => {
                    this.dataHeadValue.prosObj.forEach((ele, index, array) => {
                      if (ele.seqPros == true) {
                        dataTmp.push(this.dataHeadValue.prosObj[index]);
                      }
                    });
                  });

                  if (bar) {
                    this.SpinnerService.show();
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type', 'application/json');
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    console.log(data)
                    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllLitigantData', data, { headers: headers }).subscribe(
                      (response) => {
                        let alertMessage: any = JSON.parse(JSON.stringify(response));
                        if (alertMessage.result == 0) {
                          this.SpinnerService.hide();
                        } else {
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success == true) {
                              this.closebutton.nativeElement.click();
                              this.SpinnerService.hide();
                              this.getLitData(1);
                              //============================ reload head ================================
                              var counter = this.counter++;
                              var data = { 'run_id': this.dataHeadValue.run_id };
                              this.onReloadCase.emit({ data, counter });
                              //========================================================================
                            }
                            subscription.unsubscribe();
                          });

                        }
                      },
                      (error) => { this.SpinnerService.hide(); }
                    )
                  }
                } else if (this.delTypeApp == 'delAccu') {//======================= จำเลย
                  var bar = new Promise((resolve, reject) => {
                    this.dataHeadValue.accuObj.forEach((ele, index, array) => {
                      if (ele.seqAccu == true) {
                        dataTmp.push(this.dataHeadValue.accuObj[index]);
                      }
                    });
                  });

                  if (bar) {
                    this.SpinnerService.show();
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type', 'application/json');
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    console.log(data)
                    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllLitigantData', data, { headers: headers }).subscribe(
                      (response) => {
                        let alertMessage: any = JSON.parse(JSON.stringify(response));
                        if (alertMessage.result == 0) {
                          this.SpinnerService.hide();
                        } else {
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success == true) {
                              this.closebutton.nativeElement.click();
                              this.SpinnerService.hide();
                              this.getLitData(2);
                              //============================ reload head ================================
                              var counter = this.counter++;
                              var data = { 'run_id': this.dataHeadValue.run_id };
                              this.onReloadCase.emit({ data, counter });
                              //========================================================================
                            }
                            subscription.unsubscribe();
                          });

                        }
                      },
                      (error) => { this.SpinnerService.hide(); }
                    )
                  }
                } else if (this.delTypeApp == 'delLit') {//======================= ผู้เกี่ยวข้อง
                  var bar = new Promise((resolve, reject) => {
                    this.dataHeadValue.litObj.forEach((ele, index, array) => {
                      if (ele.seqLit == true) {
                        dataTmp.push(this.dataHeadValue.litObj[index]);
                      }
                    });
                  });

                  if (bar) {
                    this.SpinnerService.show();
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type', 'application/json');
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    console.log(data)
                    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllLitigantData', data, { headers: headers }).subscribe(
                      (response) => {
                        let alertMessage: any = JSON.parse(JSON.stringify(response));
                        console.log(alertMessage)
                        if (alertMessage.result == 0) {
                          this.SpinnerService.hide();
                        } else {
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success == true) {
                              this.closebutton.nativeElement.click();
                              this.SpinnerService.hide();
                              this.getLitData(3);
                              //============================ reload head ================================
                              var counter = this.counter++;
                              var data = { 'run_id': this.dataHeadValue.run_id };
                              this.onReloadCase.emit({ data, counter });
                              //========================================================================
                            }
                            subscription.unsubscribe();
                          });

                        }
                      },
                      (error) => { this.SpinnerService.hide(); }
                    )
                  }
                } else if (this.delTypeApp == 'delOther') {//======================= อื่นๆ
                  var bar = new Promise((resolve, reject) => {
                    this.dataHeadValue.otherObj.forEach((ele, index, array) => {
                      if (ele.seqOther == true) {
                        dataTmp.push(this.dataHeadValue.otherObj[index]);
                      }
                    });
                  });

                  if (bar) {
                    this.SpinnerService.show();
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type', 'application/json');
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    console.log(data)
                    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllLitigantData', data, { headers: headers }).subscribe(
                      (response) => {
                        let alertMessage: any = JSON.parse(JSON.stringify(response));
                        if (alertMessage.result == 0) {
                          this.SpinnerService.hide();
                        } else {
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success == true) {
                              this.closebutton.nativeElement.click();
                              this.SpinnerService.hide();
                              this.getLitData(4);
                              //============================ reload head ================================
                              var counter = this.counter++;
                              var data = { 'run_id': this.dataHeadValue.run_id };
                              this.onReloadCase.emit({ data, counter });
                              //========================================================================
                            }
                            subscription.unsubscribe();
                          });

                        }
                      },
                      (error) => { this.SpinnerService.hide(); }
                    )
                  }
                } else if (this.delTypeApp == 'delApp') {//======================= นัดความ
                  var bar = new Promise((resolve, reject) => {
                    dataTmp.push(this.dataHeadValue.appObj[this.delAppIndex]);
                  });

                  if (bar) {
                    this.SpinnerService.show();
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type', 'application/json');
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    console.log(data)
                    this.http.post('/' + this.userData.appName + 'ApiAP/API/APPOINT/deleteAllAppointDataByDate', data, { headers: headers }).subscribe(
                      (response) => {
                        let alertMessage: any = JSON.parse(JSON.stringify(response));
                        if (alertMessage.result == 0) {
                          this.SpinnerService.hide();
                        } else {
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success == true) {
                              this.closebutton.nativeElement.click();
                              this.SpinnerService.hide();
                              this.getObjAppData();
                            }
                            subscription.unsubscribe();
                          });

                        }
                      },
                      (error) => { this.SpinnerService.hide(); }
                    )
                  }
                } else if (this.delTypeApp == 'delDep') {//======================= ทุนทรัพย์
                  var bar = new Promise((resolve, reject) => {
                    dataTmp.push(this.dataHeadValue.depObj[this.delDepIndex]);
                    dataTmp[0]['court_type_id'] = this.userData.courtTypeId;
                  });

                  if (bar) {
                    this.SpinnerService.show();
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type', 'application/json');
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    console.log(data)
                    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllDepositData', data, { headers: headers }).subscribe(
                      (response) => {
                        let alertMessage: any = JSON.parse(JSON.stringify(response));
                        console.log(alertMessage)
                        if (alertMessage.result == 0) {
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success == true) { this.SpinnerService.hide(); }
                            subscription.unsubscribe();
                          });
                        } else {
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success == true) {
                              this.closebutton.nativeElement.click();
                              if (alertMessage.deposit)
                                this.dataHeadValue.deposit = this.curencyFormat(alertMessage.deposit, 2);
                              if (alertMessage.court_fee)
                                this.dataHeadValue.court_fee = this.curencyFormat(alertMessage.court_fee, 2);
                              this.sumDeposit();
                              this.SpinnerService.hide();
                              this.getObjDepData();
                            }
                            subscription.unsubscribe();
                          });

                        }
                      },
                      (error) => { this.SpinnerService.hide(); }
                    )
                  }
                } else if (this.delTypeApp == 'delAlle') {//======================= ฐานความผิด
                  var bar = new Promise((resolve, reject) => {
                    this.dataHeadValue.alleObj.forEach((ele, index, array) => {
                      if (ele.seqAlle == true) {
                        dataTmp.push(this.dataHeadValue.alleObj[index]);
                      }
                    });
                  });

                  if (bar) {
                    this.SpinnerService.show();
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type', 'application/json');
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    console.log(data)
                    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllAllegationData', data, { headers: headers }).subscribe(
                      (response) => {
                        let alertMessage: any = JSON.parse(JSON.stringify(response));
                        console.log(alertMessage)
                        if (alertMessage.result == 0) {
                          this.SpinnerService.hide();
                        } else {
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success == true) {
                              this.closebutton.nativeElement.click();
                              this.SpinnerService.hide();
                              this.masterSelAlle = this.buttonDelAlle = false;
                              this.getObjAlleData();
                            }
                            subscription.unsubscribe();
                          });

                        }
                      },
                      (error) => { this.SpinnerService.hide(); }
                    )
                  }
                } else if (this.delTypeApp == 'delCase') {//======================= เลขคดี
                  this.SpinnerService.show();
                  let headers = new HttpHeaders();
                  headers = headers.set('Content-Type', 'application/json');
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  console.log(data)
                  this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteCaseData', data, { headers: headers }).subscribe(
                    (response) => {
                      let alertMessage: any = JSON.parse(JSON.stringify(response));
                      console.log(alertMessage)
                      if (alertMessage.result == 0) {
                        this.SpinnerService.hide();
                      } else {
                        confirmBox.setMessage('ลบเลขคดี ' + this.dataHeadValue.title + this.dataHeadValue.id + "/" + this.dataHeadValue.yy + ' ออกจากระบบเรียบร้อยแล้ว');
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success == true) {
                            //this.closebutton.nativeElement.click();
                            this.SpinnerService.hide();
                            window.location.reload();
                          }
                          subscription.unsubscribe();
                        });

                      }
                    },
                    (error) => { this.SpinnerService.hide(); }
                  )
                }

              }
              subscription2.unsubscribe();
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

  }*/

  directiveDate(date: any, obj: any) {
    this.dataHeadValue[obj] = date;
  }
  directiveAppDate(date: any, obj: any) {
    this.dataAppValue[obj] = date;
  }

  changeDep(index: any, type: any, change: any) {
    //console.log(index+":"+type)
    //change 1คำนวณ 2ไม่คำนวณ
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (type == 1) {//แก้ไข
      if (this.dataHeadValue.depObj[index].lit_type && this.dataHeadValue.depObj[index].seq /* && parseFloat(this.dataHeadValue.depObj[index].deposit)>0 */) {
        var depIndex = JSON.parse(JSON.stringify(this.dataHeadValue.depObj[index]));
        console.log(depIndex)
        var lit_type_desc = this.getLitType.filter((x: any) => x.fieldIdValue === parseInt(depIndex.lit_type));
        if (lit_type_desc.length != 0) {
          depIndex.lit_type_desc = lit_type_desc[0].fieldNameValue;
        }
        if (!depIndex.edit_lit_type)
          depIndex.edit_lit_type = '';
        if (!depIndex.edit_seq)
          depIndex.edit_seq = '';
        depIndex.seq = parseInt(depIndex.seq);
        depIndex.deposit = depIndex.deposit ? depIndex.deposit.toString() : '0';
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        var student = JSON.stringify({
          "run_id": this.dataHeadValue.run_id,
          "deposit": depIndex.deposit,
          "fee_id": this.dataHeadValue.fee_id,
          "userToken": this.userData.userToken
        });
        console.log(student)
        if (change == 1) {
          this.http.disableLoading().post('/' + this.userData.appName + 'ApiCA/API/CASE/getFeeAmt', student, { headers: headers }).subscribe({
            complete: () => { }, // completeHandler
            error: (e) => { console.error(e) },    // errorHandler 
            next: (v) => {
              let productsJson: any = JSON.parse(JSON.stringify(v));
              console.log(productsJson)
              var dDep = [];
              if (productsJson.result == 1) {
                depIndex.court_fee = productsJson.data[0].fee_amout.toString();
                dDep.push(depIndex);
                dDep[0]['court_type_id'] = this.userData.courtTypeId;
                dDep[0]['userToken'] = this.userData.userToken;
                console.log(dDep[0])
                //===============================================================================================
                this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/saveDeposit', dDep[0]).subscribe(
                  posts => {
                    let resJsonData: any = JSON.parse(JSON.stringify(posts));
                    console.log(resJsonData)
                    if (resJsonData.result == 1) {
                      if (resJsonData.deposit !=  null)
                        this.dataHeadValue.deposit = this.curencyFormat(resJsonData.deposit, 2);
                      if (resJsonData.court_fee !=  null)
                        this.dataHeadValue.court_fee = this.curencyFormat(resJsonData.court_fee, 2);
                      this.sumDeposit();//เช็คศาลแขวง-ศาลจังหวัด
                      this.getObjDepData();
                    } else {
                      confirmBox.setMessage(resJsonData.error);
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
                //===============================================================================================
              } else {
                depIndex.court_fee = '0';
                dDep.push(depIndex);
                dDep[0]['deposit'] = dDep[0]['deposit'].toString();
                dDep[0]['court_type_id'] = this.userData.courtTypeId;
                dDep[0]['userToken'] = this.userData.userToken;
                console.log(dDep[0])
                //===============================================================================================
                this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/saveDeposit', dDep[0]).subscribe({
                  complete: () => { }, // completeHandler
                  error: (e) => { console.error(e) },    // errorHandler 
                  next: (v) => {
                    let resJsonData: any = JSON.parse(JSON.stringify(v));
                    console.log(resJsonData)
                    if (resJsonData.result == 1) {
                      if (resJsonData.deposit !=  null)
                        this.dataHeadValue.deposit = this.curencyFormat(resJsonData.deposit, 2);
                      if (resJsonData.court_fee !=  null)
                        this.dataHeadValue.court_fee = this.curencyFormat(resJsonData.court_fee, 2);
                      this.sumDeposit();//เช็คศาลแขวง-ศาลจังหวัด
                      this.getObjDepData();
                    } else {
                      confirmBox.setMessage(resJsonData.error);
                      confirmBox.setButtonLabels('ตกลง');
                      confirmBox.setConfig({
                       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                        if (resp.success == true) { }
                        subscription.unsubscribe();
                      });
                    }
                  },     // nextHandler
                });
                //===============================================================================================
              }
            },     // nextHandler
          });
        } else {
          var dDep = [];
          dDep.push(depIndex);
          dDep[0]['deposit'] = dDep[0]['deposit'].toString();
          dDep[0]['court_type_id'] = this.userData.courtTypeId;
          dDep[0]['userToken'] = this.userData.userToken;
          console.log(dDep[0])
          //===============================================================================================
          this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/saveDeposit', dDep[0]).subscribe({
            complete: () => { }, // completeHandler
            error: (e) => { console.error(e) },    // errorHandler 
            next: (v) => {
              let resJsonData: any = JSON.parse(JSON.stringify(v));
              console.log(resJsonData)
              if (resJsonData.result == 1) {
                if (resJsonData.deposit !=  null)
                  this.dataHeadValue.deposit = this.curencyFormat(resJsonData.deposit, 2);
                if (resJsonData.court_fee !=  null)
                  this.dataHeadValue.court_fee = this.curencyFormat(resJsonData.court_fee, 2);
                this.sumDeposit();//เช็คศาลแขวง-ศาลจังหวัด
                this.getObjDepData();
              } else {
                confirmBox.setMessage(resJsonData.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success == true) { }
                  subscription.unsubscribe();
                });
              }
            },     // nextHandler
          });
        }


      }
    } else {//เพิ่มใหม่
      if (this.rawDep.lit_type && this.rawDep.seq /* && parseFloat(this.rawDep.deposit)>0 */) {
        //console.log(this.dataHeadValue.depObj)
        var lit_type_desc = this.getLitType.filter((x: any) => x.fieldIdValue === parseInt(this.rawDep.lit_type));
        if (lit_type_desc.length != 0) {
          this.rawDep.lit_type_desc = lit_type_desc[0].fieldNameValue;
        }
        this.rawDep.edit_lit_type = '';
        this.rawDep.edit_seq = '';
        this.rawDep.seq = parseInt(this.rawDep.seq);
        this.rawDep.deposit = this.rawDep.deposit ? this.rawDep.deposit.toString() : '0';
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        var student = JSON.stringify({
          "run_id": this.dataHeadValue.run_id,
          "deposit": this.rawDep.deposit,
          "fee_id": this.dataHeadValue.fee_id,
          "userToken": this.userData.userToken
        });
        console.log(student)
        //if(change==1){
        this.http.disableLoading().post('/' + this.userData.appName + 'ApiCA/API/CASE/getFeeAmt', student, { headers: headers }).subscribe({
            complete: () => { }, // completeHandler
            error: (e) => { console.error(e) },    // errorHandler 
            next: (v) => {
              let productsJson: any = JSON.parse(JSON.stringify(v));
            console.log(productsJson)
            var dDep = [];
            if (productsJson.result == 1) {
              this.rawDep.court_fee = productsJson.data[0].fee_amout.toString();
              dDep.push(this.rawDep);
              dDep[0]['court_type_id'] = this.userData.courtTypeId;
              dDep[0]['run_id'] = this.dataHeadValue.run_id;
              dDep[0]['userToken'] = this.userData.userToken;
              console.log(dDep[0])
              //===============================================================================================
              this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/saveDeposit', dDep[0]).subscribe(
                posts => {
                  let resJsonData: any = JSON.parse(JSON.stringify(posts));
                  console.log(resJsonData)
                  if (resJsonData.result == 1) {
                    this.dataHeadValue.depObj.push(this.rawDep);
                    this.getDataDep$ = of(this.dataHeadValue.depObj);//ทุนทรัพย์
                    this.rawDep = { lit_type: '', seq: '', deposit: '0.00', court_fee: '0.00' };
                    this.sLitType.clearModel();
                    if (resJsonData.deposit !=  null)
                      this.dataHeadValue.deposit = this.curencyFormat(resJsonData.deposit, 2);
                    if (resJsonData.court_fee !=  null)
                      this.dataHeadValue.court_fee = this.curencyFormat(resJsonData.court_fee, 2);
                    this.sumDeposit();//เช็คศาลแขวง-ศาลจังหวัด
                    this.getObjDepData();
                  } else {
                    confirmBox.setMessage(resJsonData.error);
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
              //===============================================================================================
            } else {
              this.rawDep.court_fee = '0';
              dDep.push(this.rawDep);
              dDep[0]['deposit'] = dDep[0]['deposit'].toString();
              dDep[0]['court_type_id'] = this.userData.courtTypeId;
              dDep[0]['run_id'] = this.dataHeadValue.run_id;
              dDep[0]['userToken'] = this.userData.userToken;
              console.log(dDep[0])
              //===============================================================================================
              this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/saveDeposit', dDep[0]).subscribe(
                posts => {
                  let resJsonData: any = JSON.parse(JSON.stringify(posts));
                  console.log(resJsonData)
                  if (resJsonData.result == 1) {
                    this.dataHeadValue.depObj.push(this.rawDep);
                    this.getDataDep$ = of(this.dataHeadValue.depObj);//ทุนทรัพย์
                    this.rawDep = { lit_type: '', seq: '', deposit: '0.00', court_fee: '0.00' };
                    this.sLitType.clearModel();
                    if (resJsonData.deposit !=  null)
                      this.dataHeadValue.deposit = this.curencyFormat(resJsonData.deposit, 2);
                    if (resJsonData.court_fee !=  null)
                      this.dataHeadValue.court_fee = this.curencyFormat(resJsonData.court_fee, 2);
                    this.sumDeposit();//เช็คศาลแขวง-ศาลจังหวัด
                    this.getObjDepData();
                  } else {
                    confirmBox.setMessage(resJsonData.error);
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
              //===============================================================================================
            }
            },     // nextHandler
          });
        /* }else{
          var dDep = [];
          dDep.push(this.rawDep);
          dDep[0]['deposit'] = dDep[0]['deposit'].toString();
          dDep[0]['court_type_id'] = this.userData.courtTypeId;
          dDep[0]['run_id'] = this.dataHeadValue.run_id;
          dDep[0]['userToken'] = this.userData.userToken;
          console.log(dDep[0])
          //===============================================================================================
          this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/saveDeposit', dDep[0]).subscribe(
            posts => {
              let resJsonData : any = JSON.parse(JSON.stringify(posts));
              console.log(resJsonData)
              if(resJsonData.result==1){
                this.dataHeadValue.depObj.push(this.rawDep);
                this.getDataDep$ = of(this.dataHeadValue.depObj);//ทุนทรัพย์
                this.rawDep = {lit_type:'',seq:'',deposit:'0.00',court_fee:'0.00'};
                this.sLitType.clearModel();
                if(resJsonData.deposit)
                  this.dataHeadValue.deposit = this.curencyFormat(resJsonData.deposit,2);
                if(resJsonData.court_fee)
                  this.dataHeadValue.court_fee = this.curencyFormat(resJsonData.court_fee,2);
                this.sumDeposit();//เช็คศาลแขวง-ศาลจังหวัด
                this.getObjDepData();
              }else{
                confirmBox.setMessage(resJsonData.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                   layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if(resp.success==true){}
                  subscription.unsubscribe();
                });
              }
            },
            (error) => {}
          );
        } */
      }
    }
  }


  orderJudgeTab(event: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "table_name": "pjudge",
      "field_id": "judge_id",
      "field_name": "judge_name",
      "condition": " AND judge_id='" + event.target.value + "'",
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(v));
        console.log(getDataOptions)
        if (getDataOptions.length > 0) {
          this.dataHeadValue.order_judge_name = getDataOptions[0].fieldNameValue;
          this.dataHeadValue.order_judge_date = myExtObject.curDate();
        } else {
          this.dataHeadValue.order_judge_gid = '';
          this.dataHeadValue.order_judge_name = '';
        }
      },     // nextHandler
    });
  }



  checkUncheckAll(obj: any, master: any, child: any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
    if (child == 'seqPros') {
      if (this[master] == true) {
        this.buttonDelPros = true;
      } else {
        this.buttonDelPros = false;
      }
    }
    if (child == 'seqAccu') {
      if (this[master] == true) {
        this.buttonDelAccu = true;
      } else {
        this.buttonDelAccu = false;
      }
    }
    if (child == 'seqLit') {
      if (this[master] == true) {
        this.buttonDelLit = true;
      } else {
        this.buttonDelLit = false;
      }
    }
    if (child == 'seqOther') {
      if (this[master] == true) {
        this.buttonDelOther = true;
      } else {
        this.buttonDelOther = false;
      }
    }
    if (child == 'seqAlle') {
      if (this[master] == true) {
        this.buttonDelAlle = true;
      } else {
        this.buttonDelAlle = false;
      }
    }
  }

  isAllSelected(obj: any, master: any, child: any) {
    this[master] = obj.every(function (item: any) {
      return item[child] == true;
    })
    var isChecked = obj.every(function (item: any) {
      return item[child] == false;
    })
    if (child == 'seqPros') {
      if (isChecked == true) {
        this.buttonDelPros = false;
      } else {
        this.buttonDelPros = true;
      }
    }
    if (child == 'seqAccu') {
      if (isChecked == true) {
        this.buttonDelAccu = false;
      } else {
        this.buttonDelAccu = true;
      }
    }
    if (child == 'seqLit') {
      if (isChecked == true) {
        this.buttonDelLit = false;
      } else {
        this.buttonDelLit = true;
      }
    }
    if (child == 'seqOther') {
      if (isChecked == true) {
        this.buttonDelOther = false;
      } else {
        this.buttonDelOther = true;
      }
    }
    if (child == 'seqAlle') {
      if (isChecked == true) {
        this.buttonDelAlle = false;
      } else {
        this.buttonDelAlle = true;
      }
    }
  }

  /*
  uncheckAll() {
    for (var i = 0; i < this.dataSearch.length; i++) {
      this.dataSearch[i].editValue = false;
    }
    this.masterSelected = false;
  }
  */

  sumDeposit() {
    if (this.userData.courtTypeId == 1) {
      var counter = this.counter++;
      var vAtiveHead = JSON.parse(JSON.stringify(this.valActiveHead));
      vAtiveHead.deposit = this.curencyFormatRevmove(this.dataHeadValue.deposit ? this.dataHeadValue.deposit : 0);
      var data = vAtiveHead;
      this.onChangeActive.emit({ data, counter });
    }
  }

  printReport(type: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.dataHeadValue.run_id) {
      confirmBox.setMessage('กรุณาค้นหาเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (this.dataHeadValue.run_id && type == 1) {
      //rca0200_A4.jsp? prun_id =& pcase_flag =&pprint_app=1&pprint_by=2
      var rptName = 'rca0200_A4';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
        "pcase_flag": this.dataHeadValue.case_flag,
        "pprint_app": 1,
        "pprint_by": 1,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 2) {
      //rca0210.jsp?prun_id=147511&pcase_flag=&pprint_app=1&pprint_by=1
      var rptName = 'rca0210';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
        "pcase_flag": this.dataHeadValue.case_flag,
        "pprint_app": 1,
        "pprint_by": 1,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 3) {
      //rci0113_A4.jsp?prun_id=147511&pcase_flag=&pprint_by=1
      var rptName = 'rci0113_A4';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
        "pcase_flag": this.dataHeadValue.case_flag,
        "pprint_by": 1,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 4) {
      //rca0120_A4.jsp?prun_id=147511&pcase_flag=&pprint_by=1
      var rptName = 'rca0120_A4';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
        "pcase_flag": this.dataHeadValue.case_flag,
        "pprint_by": 1,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 5) {
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      if (this.dataHeadValue.run_id) {
        if (this.dataHeadValue.red_id)
          myExtObject.OpenWindowMaxName(winURL + 'prca2100?run_id=' + this.dataHeadValue.run_id + "&pprint_by=1&case_no=" + this.dataHeadValue.title + this.dataHeadValue.id + "/" + this.dataHeadValue.yy + "&red_no=" + this.dataHeadValue.red_title + this.dataHeadValue.red_id + "/" + this.dataHeadValue.red_yy, 'prca2100');
        else
          myExtObject.OpenWindowMaxName(winURL + 'prca2100?run_id=' + this.dataHeadValue.run_id + "&pprint_by=1&case_no=" + this.dataHeadValue.title + this.dataHeadValue.id + "/" + this.dataHeadValue.yy, 'prca2100');
      } else
        myExtObject.OpenWindowMaxName(winURL + 'prca2100?run_id=&pprint_by=1', 'prca2100');
    } else if (this.dataHeadValue.run_id && type == 6) {
      //rca0200b.jsp?prun_id=147511
      var rptName = 'rca0200b';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 7) {


    } else if (this.dataHeadValue.run_id && type == 8) {
      //rfn6510.jsp?prun_id=149089
      var rptName = 'rfn6510';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 9) {
      //rci3300.jsp?prun_id=149089
      var rptName = 'rci3300';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 10) {
      //rca0200_A4.jsp?prun_id=150662&pcase_flag=&pprint_app=1&pprint_by=2
      var rptName = 'rca0200_A4';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
        "pcase_flag": this.dataHeadValue.case_flag,
        "pprint_app": 1,
        "pprint_by": 2
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 11) {
      //rca0210.jsp?prun_id=150662&pcase_flag=&pprint_app=1&pprint_by=2
      var rptName = 'rca0210';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
        "pcase_flag": this.dataHeadValue.case_flag,
        "pprint_app": 1,
        "pprint_by": 2
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 12) {
      //rca0120_A4.jsp?prun_id=150662&pcase_flag=&pprint_by=2
      var rptName = 'rca0120_A4';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
        "pcase_flag": this.dataHeadValue.case_flag,
        "pprint_by": 2
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 13) {
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      if (this.dataHeadValue.run_id) {
        if (this.dataHeadValue.red_id)
          myExtObject.OpenWindowMaxName(winURL + 'prca2100?run_id=' + this.dataHeadValue.run_id + "&pprint_by=2&case_no=" + this.dataHeadValue.title + this.dataHeadValue.id + "/" + this.dataHeadValue.yy + "&red_no=" + this.dataHeadValue.red_title + this.dataHeadValue.red_id + "/" + this.dataHeadValue.red_yy, 'prca2100');
        else
          myExtObject.OpenWindowMaxName(winURL + 'prca2100?run_id=' + this.dataHeadValue.run_id + "&pprint_by=2&case_no=" + this.dataHeadValue.title + this.dataHeadValue.id + "/" + this.dataHeadValue.yy, 'prca2100');
      } else
        myExtObject.OpenWindowMaxName(winURL + 'prca2100?run_id=&pprint_by=2', 'prca2100');

    } else if (this.dataHeadValue.run_id && type == 14) {
      //rca2120.jsp?prun_id=150662
      var rptName = 'rca2120';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 15) {
      //rca0900.jsp?prun_id=150662&pcase_flag=&pprint_app=1&pdep_name=%BA%C3%D4%C9%D1%B7%CF%20%BC%D9%E9%B4%D9%E1%C5%C3%D0%BA%BA
      var rptName = 'rca0900';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
        "pcase_flag": this.dataHeadValue.case_flag,
        "pprint_app": 1,
        "pdep_name": this.userData.depName,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);

    } else if (this.dataHeadValue.run_id && type == 16) {
      //rca0900.jsp?prun_id=150662&pcase_flag=1&pprint_app=1&pdep_name=%BA%C3%D4%C9%D1%B7%CF%20%BC%D9%E9%B4%D9%E1%C5%C3%D0%BA%BA
      var rptName = 'rca0900';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
        "pcase_flag": this.dataHeadValue.case_flag,
        "pprint_app": 1,
        "pdep_name": this.userData.depName,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 17) {
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      if (this.dataHeadValue.run_id) {
        myExtObject.OpenWindowMaxName(winURL + 'fap0111?run_id=' + this.dataHeadValue.run_id, 'fap0111');
      } else
        myExtObject.OpenWindowMaxName(winURL + 'fap0111', 'fap0111');
    } else if (this.dataHeadValue.run_id && type == 18) {
      let winURL = window.location.href.split("/#/")[0] + "/#/";
      if (this.dataHeadValue.run_id) {
        myExtObject.OpenWindowMaxName(winURL + 'ffn0400?run_id=' + this.dataHeadValue.run_id, 'ffn0400');
      } else
        myExtObject.OpenWindowMaxName(winURL + 'ffn0400', 'ffn0400');
    } else if (this.dataHeadValue.run_id && type == 19) {
      var rptName = 'rca2000';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id,
        "ptype": 1
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHeadValue.run_id && type == 20) {
      var rptName = 'rca1000';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHeadValue.run_id
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    }
  }

  keyPressNumbersWithDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  addComma(event: any) {
    if (!event.target.value) {
      (event.target as HTMLInputElement).value = '0.00';
    } else {
      (event.target as HTMLInputElement).value = this.curencyFormat(event.target.value, 2);
    }
  }
  revComma(event: any) {
    //console.log(event.target.value.indexOf('.00'))
    //console.log(this.curencyFormatRemove(event.target.value))
    if (event.target.value.indexOf('.00') == -1)
      if (event.target.value.indexOf(',') != -1)
        (event.target as HTMLInputElement).value = this.curencyFormatRemove(event.target.value);
      else
        (event.target as HTMLInputElement).value = event.target.value;
    else {
      if (event.target.value == '0.00') {
        (event.target as HTMLInputElement).value = '';
      } else {
        var eVal = event.target.value.split('.')[0];
        (event.target as HTMLInputElement).value = this.curencyFormatRemove(eVal);
      }
    }
  }

  // <app-modal-confirm *ngIf="loadModalComponent" class="modal_app"></app-modal-confirm>
  onOpenConfirm = (type:any) => {
    const modalRef: NgbModalRef = this.ngbModal.open(ModalConfirmComponent)
    modalRef.componentInstance.types = type
    modalRef.closed.subscribe((item) => {
      if(item) {
        this.submitModalForm(item);
      }
    })
  }

  //<app-modal-judge *ngIf="loadModalJudgeComponent" [items]=list [value1]=listTable [value2]=listFieldId [value3]=listFieldName [value4]=listFieldNull [value5]=listFieldType (onClickList)="receiveJudgeListData($event)" class="modal_app"></app-modal-judge>
  //modal-judge
  onOpenJudge = (list: any) => {
    const modalRef: NgbModalRef = this.ngbModal.open(ModalJudgeComponent)
    modalRef.componentInstance.value1 = this.listTable
    modalRef.componentInstance.value2 = this.listFieldId
    modalRef.componentInstance.value3 = this.listFieldName
    modalRef.componentInstance.value4 = this.listFieldNull
    modalRef.componentInstance.value5 = this.listFieldType
    modalRef.componentInstance.items = list
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if (item) {
        console.log(item)
        this.dataHeadValue.order_judge_id = item.judge_id;
        this.dataHeadValue.order_judge_name = item.judge_name;
        this.dataHeadValue.order_judge_date = myExtObject.curDate();
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  //<app-datalist-return *ngIf="loadComponent" [items]=list [value1]=listTable [value2]=listFieldId [value3]=listFieldName [value4]=listFieldNull (onClickList)="receiveFuncListData($event)" class="modal_app"></app-datalist-return>
  //datalist-return
  onOpenDatalistReturn = (list: any) => {
    const modalRef: NgbModalRef = this.ngbModal.open(DatalistReturnComponent)
    modalRef.componentInstance.value1 = this.listTable
    modalRef.componentInstance.value2 = this.listFieldId
    modalRef.componentInstance.value3 = this.listFieldName
    modalRef.componentInstance.value4 = this.listFieldNull
    modalRef.componentInstance.value8 = this.listFieldName2
    modalRef.componentInstance.items = list
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if (item) {
        var data = [item];
        if (this.listTable == 'pallegation') {
          this.insertAlle(data[0]);
        }
        if (this.listTable == 'pappoint_list') {
          this.dataAppValue.app_id = item.fieldIdValue;
          this.dataAppValue.app_name = item.fieldNameValue;
        }
        if (this.modalType == 2) {
          this.dataHeadValue.sjudge_id = item.fieldIdValue;
          this.dataHeadValue.sjudge_name = item.fieldNameValue;
          this.getPost(item.fieldNameValue2, this.modalType);
        }
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }


  //<app-modal-return-alle *ngIf="loadModalAlleComponent" [items]=list [maxValue]=alleSeq [value1]=listTable [value2]=listFieldId [value3]=listFieldName [value4]=listFieldNull (onClickList)="receiveAlleData($event)" class="modal_app" class="modal_app"></app-modal-return-alle>
  //modal-return-alle
  onOpenReturnAlle = (list: any) => {
    const modalRef: NgbModalRef = this.ngbModal.open(ModalReturnAlleComponent)
    modalRef.componentInstance.value1 = this.listTable
    modalRef.componentInstance.value2 = this.listFieldId
    modalRef.componentInstance.value3 = this.listFieldName
    modalRef.componentInstance.value4 = this.listFieldNull
    modalRef.componentInstance.value8 = this.listFieldName2
    modalRef.componentInstance.items = list
    modalRef.componentInstance.maxValue = this.alleSeq
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if (item) {
        console.log(item)
        this.receiveAlleData(item);
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  //<app-datalist-return-multiple *ngIf="loadModalMultiComponent" [items]=list [value1]=listTable [value2]=listFieldId [value3]=listFieldName [value4]=listFieldNull [value7]=listFieldCond (onClickList)="receiveFuncListMultiData($event)" class="modal_app"></app-datalist-return-multiple>
  //datalist-return-multiple
  onOpenDatalistReturnMultiple = (list: any) => {
    const modalRef: NgbModalRef = this.ngbModal.open(DatalistReturnMultipleComponent)
    modalRef.componentInstance.value1 = this.listTable
    modalRef.componentInstance.value2 = this.listFieldId
    modalRef.componentInstance.value3 = this.listFieldName
    modalRef.componentInstance.value4 = this.listFieldNull
    modalRef.componentInstance.value7 = this.listFieldCond
    modalRef.componentInstance.items = list
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if (item) {
        console.log(item)
        if (this.modalType == 1) {
          this.dataHeadValue.alle_id = item.fieldIdValue;
          this.dataHeadValue.alle_desc = this.dataHeadValue.alle_desc + item.fieldNameValue;
        }
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }


  //<app-datalist-return-org *ngIf="loadDataListOrgComponent" [pers_type]="selPers" (onClickList)="receivePersData($event)" class="modal_app"></app-datalist-return-org>
  //datalist-return-org
  onOpenDatalistReturnOrg = () => {
    const modalRef: NgbModalRef = this.ngbModal.open(DatalistReturnOrgComponent)
    modalRef.componentInstance.pers_type = this.selPers
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if (item) {
        console.log(item)
        this.addressOrg = item;
        this.selPersName = item.pers_desc;
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }


  loadMyModalJudgeComponent(val: any) {
    if (val == 1) {
      if (typeof this.dataHeadValue.case_date == 'undefined') {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = Number(today.getMonth() + 1);
        var yyyy = today.getFullYear() + 543;
        var caseDate: any = dd + '/' + mm + "/" + yyyy;
      } else {
        if (this.dataHeadValue.case_date)
          var caseDate: any = this.dataHeadValue.case_date;
        else
          var caseDate: any = '';
      }
      var student = JSON.stringify({
        "cond": 2,
        "assign_date": caseDate,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldNull = '';
      this.listFieldType = JSON.stringify({
        "type": 1,
        "assign_date": caseDate
      });
    } else {
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldNull = '';
      this.listFieldType = JSON.stringify({ "type": 2 });
    }
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupJudge', student).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => {
        let productsJson: any = JSON.parse(JSON.stringify(v));
        if (productsJson.data.length) {
          this.list = productsJson.data;
          console.log(this.list)
        } else {
          this.list = [];
        }

        this.onOpenJudge(this.list);
      }
    });
  }

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    if (this.modalType == 1) {
      var student = JSON.stringify({
        "table_name": "pallegation_cover",
        "field_id": "alle_id",
        "field_name": "alle_name",
        "condition": " AND case_type='" + this.dataHeadValue.case_type + "'",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pallegation_cover';
      this.listFieldId = 'alle_id';
      this.listFieldName = 'alle_name';
      this.listFieldNull = '';
      this.listFieldCond = " AND case_type='" + this.dataHeadValue.case_type + "'";
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          this.list = v;
          this.onOpenDatalistReturnMultiple(this.list);
        }
      });
    } else if (this.modalType == 2) {
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "field_name2": "post_id",
        "condition": " AND (end_date>=CURRENT_DATE OR end_date IS NULL)",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldName2 = 'post_id';
      this.listFieldNull = '';
      this.listFieldCond = " AND (end_date>=CURRENT_DATE OR end_date IS NULL)";
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => {
        this.list = v;
        this.onOpenDatalistReturn(this.list);
        }
      });
    } else if (this.modalType == 3) {
      this.onOpenDatalistReturnOrg();
    }
  }

  loadMyChildComponent(val: any) {
    this.modalType = null;
    if (val == 1 || val == 2) {
      var student = JSON.stringify({
        "table_name": "pallegation",
        "field_id": "alle_id",
        "field_name": "alle_name",
        "field_name2": "alle_running",
        "search_id": "",
        "search_desc": "",
        "condition": " AND case_type='" + this.dataHeadValue.case_type + "' AND case_cate_group='" + this.dataHeadValue.case_cate_group + "' AND user_select=1",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pallegation';
      this.listFieldId = 'alle_id';
      this.listFieldName = 'alle_name';
      this.listFieldName2 = 'alle_running';
      this.listFieldNull = '';
    } else if (val == 3) {
      var student = JSON.stringify({ "table_name": "pappoint_list", "field_id": "app_id", "field_name": "app_name", "search_id": "", "search_desc": "", "userToken": this.userData.userToken });
      this.listTable = 'pappoint_list';
      this.listFieldId = 'app_id';
      this.listFieldName = 'app_name';
      this.listFieldNull = '';
    } else {
      var student = JSON.stringify({ "table_name": "pposition", "field_id": "post_id", "field_name": "post_name", "search_id": "", "search_desc": "", "userToken": this.userData.userToken });
      this.listTable = 'pposition';
      this.listFieldId = 'post_id';
      this.listFieldName = 'post_name';
      this.listFieldNull = '';
    }

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student,).subscribe({
      complete: () => { }, // completeHandler
      error: (e) => { console.error(e) },    // errorHandler 
      next: (v) => {
        this.list = v;
        if (val == 1 || val == 3) {//คลิก popup แรก ฐานความผิดสถิติ
          this.onOpenDatalistReturn(this.list);

        } else if (val == 2) {//คลิก popup ตัวที่สอง ฐานความผิดสถิติ
          this.onOpenReturnAlle(this.list);

        }
      }
    });
  }

}
