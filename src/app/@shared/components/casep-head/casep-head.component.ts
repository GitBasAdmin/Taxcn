import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, Input, Output, ViewEncapsulation, EventEmitter, AfterContentInit, OnChanges, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { NgSelectComponent } from '@ng-select/ng-select';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { Observable, of, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { DatalistReturnMultipleComponent } from '@app/components/modal/datalist-return-multiple/datalist-return-multiple.component';
import { ModalReturnAlleComponent } from '@app/components/modal/modal-return-alle/modal-return-alle.component';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { SaveRemarkModel } from '@app/components/fdo/models/save-remark-model';
import { PrintReportService } from '@app/services/print-report.service';

declare var myExtObject: any;
interface Allegation {
  alle_seq: number,
  alle_id: number,
  alle_running: number,
  alle_name: string,
  create_dep_name: string,
  create_user: string,
  create_date: string
}
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-casep-head',
  templateUrl: './casep-head.component.html',
  styleUrls: ['./casep-head.component.scss']
})


export class CasepHeadComponent implements AfterViewInit, OnInit, OnDestroy, AfterContentInit, OnChanges {

  //@ViewChild(TemplateRef, { static: true }) foo!: TemplateRef;
  sessData: any;
  userData: any;
  getTitle: any;
  getRank: any;
  caseNoLast: any;

  selCourt: any;
  selCaseCate: any;
  selCaseStatus: any;

  hCaseType: any;

  myExtObject: any;
  run_id: any;
  eventSearch = 0;
  refLogin: any = 0;

  groupObj: any = [];
  postMapObj: any = [];
  prosObj: any = [];
  accuObj: any = [];
  reqObj: any = [];
  oppObj: any = [];
  alle: any = [];
  items: any = [];
  list: any = [];
  dataHead: any = [];
  dataHeadTmp: any = [];
  dataEditPost: any;

  currentRoute: string;

  masterSelAlle: boolean = false;
  buttonDelAlle: boolean = false;

  public dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 99999,
    processing: true,
    columnDefs: [{ "targets": 'no-sort', "orderable": false }],
    order: [],
    lengthChange: false,
    info: false,
    paging: false,
    searching: false
  };
  public dtTrigger: Subject<any> = new Subject<any>();
  @Input() set sendDataPostEdit(sendDataPostEdit: any) {
    if (sendDataPostEdit) {
      this.dataEditPost = sendDataPostEdit;
    }
  }
  getDataAlle$: Observable<Allegation[]>;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('sCaseCate') sCaseCate: NgSelectComponent;
  @ViewChild('sRedTitle') sRedTitle: NgSelectComponent;
  @ViewChild('sCaseStatus') sCaseStatus: NgSelectComponent;
  @ViewChild('yy', { static: true }) yy: ElementRef;
  @ViewChild('id', { static: true }) id: ElementRef;
  @ViewChild('red_yy', { static: true }) red_yy: ElementRef;
  @ViewChild('red_id', { static: true }) red_id: ElementRef;

  @Output() sendCaseData = new EventEmitter<any>();

  /* @Input() set runId(runId: string) {
    console.log(runId)
    if(typeof runId === 'object'){
      this.setDefHead();
    }else{
      this.run_id=runId;
      if(typeof this.run_id != 'undefined' && this.run_id>0){
        this.eventSearch = 1
        this.sessData=localStorage.getItem(this.authService.sessJson);
        this.userData = JSON.parse(this.sessData);
        this.searchCaseNo(3,this.run_id); 
      }else{
        this.setDefHead();
      }
    }
  } */
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private ngbModal: NgbModal,
    private router: Router,
    private printReportService: PrintReportService,
  ) {
    this.currentRoute = activatedRoute.snapshot.routeConfig.path;
    //this.config.bindValue = 'value';
  }

  ngOnInit(): void {

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.selCourt = this.userData.courtName;
    this.dataHead = this.dataHeadTmp = [];
    //=============================================//

    //this.fCaseTitle();

    //======================== prankpolice ======================================
    var student = JSON.stringify({
      "table_name": "prankpolice",
      "field_id": "rank_name",
      "field_name": "rank_name",
      "condition": "AND rank_name NOT LIKE '%นา%'",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getRank = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => { }
    )


    //if(this.run_id && !this.eventSearch){
    //this.searchCaseNo(3,this.run_id);
    //}
    /* const url: string[] = this.router.url.split('/')
    url_name : url[url.length -1] */
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['run_id']) {
        if (typeof this.dataHead != 'undefined' && this.dataHead.run_id != params['run_id'])
          this.searchCaseNo(3, params['run_id']);
      } else {
        this.setDefHead();
      }
    });


    //==============================================================
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
    myExtObject.callCalendar();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes.runId.currentValue)
  }

  directiveDate = (event: any) => {
    const { value, name } = event.target
    this.dataHead[name] = value;
  }

  checkUncheckAll(obj: any, master: any, child: any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
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

    if (child == 'seqAlle') {
      if (isChecked == true) {
        this.buttonDelAlle = false;
      } else {
        this.buttonDelAlle = true;
      }
    }
  }

  setDefHead() {
    this.dataHead = this.dataHeadTmp = [];
    setTimeout(() => {
      this.dataHead.req_type = 2;
      this.fCaseTitle();
    }, 500);

  }

  barcodeEnter() {
    /* this.dataHead.barcodeEnter = 1;
    this.dataHead.buttonSearch = null;
    this.sendCaseData.emit(this.dataHead); */
  }

  fCaseTitle() {
    //========================== ptitle ====================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND special_case IN (1,2,6)",
      "order_by": " order_id ASC",
      "userToken": this.getToken
    });

    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getTitle = getDataOptions;
          if (!this.run_id) {
            this.dataHead.ptitle = this.getTitle[0].fieldIdValue;
            if (!this.dataHead.pyy)
              this.dataHead.pyy = myExtObject.curYear();
            this.runCaseNo();
          }

        },
        (error) => { }
      )

    });
    return promise;
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


  searchCaseNo(type: any, run_id: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var alert = 0;


    if (type == 1) {//เลขคดีดำ
      if (!this.dataHead.ptitle) {
        confirmBox.setMessage('กรุณาระบุคำนำหน้าคดีฝากขัง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
        alert++;
      } else if (!this.dataHead.pid) {
        confirmBox.setMessage('กรุณาระบุหมายเลขคดีฝากขัง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
            this.id.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      } else if (!this.dataHead.pyy) {
        confirmBox.setMessage('กรุณาระบุปีเลขคดีฝากขัง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
            this.yy.nativeElement.focus();
          }
          subscription.unsubscribe();
        });
        alert++;
      } else {
        var student = JSON.stringify({
          "case_type": 1,
          "title": this.dataHead.ptitle,
          "id": this.dataHead.pid,
          "yy": this.dataHead.pyy,
          "allData": 1,
          "court_id": this.userData.courtId,
          "url_name": "fca0200",
          "userToken": this.userData.userToken
        });
        var apiUrl = '/' + this.getRoot + 'ApiCA/API/CASE/dataFromTitle';
        console.log(student)
      }
    } else {
      var student = JSON.stringify({
        "run_id": run_id,
        "allData": 1,
        "userToken": this.userData.userToken
      });
      var apiUrl = '/' + this.getRoot + 'ApiCA/API/CASE/dataFromRunId';
      console.log(student)
    }

    if (!alert) {
      if (type != 3)
        this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      let promise = new Promise((resolve, reject) => {
        this.http.post(apiUrl, student, { headers: headers }).subscribe(
          (response) => {
            let getDataOptions: any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if (getDataOptions.data[0]) {
              this.dataHead = getDataOptions.data[0];
              if (getDataOptions.data[0].groupObj)
                this.groupObj = getDataOptions.data[0].groupObj;
              if (getDataOptions.data[0].postMapObj)
                this.postMapObj = getDataOptions.data[0].postMapObj;
              if (getDataOptions.data[0].prosObj)
                this.prosObj = getDataOptions.data[0].prosObj;
              if (getDataOptions.data[0].accuObj)
                this.accuObj = getDataOptions.data[0].accuObj;
              if (getDataOptions.data[0].reqObj)
                this.reqObj = getDataOptions.data[0].reqObj;
              if (getDataOptions.data[0].oppObj)
                this.oppObj = getDataOptions.data[0].oppObj;
              if (type == 1 || type == 2)
                this.dataHead.buttonSearch = 1;
              else
                this.dataHead.buttonSearch = null;
              //if(window.location.href.indexOf('fkb0100')==-1)
              this.dataHead.barcodeEnter = null;
              this.runAlleSeq(this.dataHead.alleObj ? this.dataHead.alleObj : []);
              if (this.dataHead.alleObj != null)
                this.dataHead.alleObj.forEach((x: any) => x.seqAlle = false);
              //else
                this.getDataAlle$ = of(this.dataHead.alleObj);//ฐานความผิด
              this.caseNoLast = null;

              this.dataHeadTmp = JSON.parse(JSON.stringify(this.dataHead));
              this.sendCaseData.emit(this.dataHead);
            }
            //console.log(this.dataHead)
            if (getDataOptions.result == 1) {
              this.SpinnerService.hide();
            } else {
              //-----------------------------//
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
              this.SpinnerService.hide();
            }

          },
          (error) => { }
        )
      });
    }
    //console.log(this.FunntionService.searchBackNo('','',''))
  }

  tabChangeSelect(objId: any, objName: any, event: any) {
    if (this.dataHead.req_type == 2) {
      var student = JSON.stringify({
        "table_name": "ppolice",
        "field_id": "police_id",
        "field_name": "police_name",
        "condition": " AND police_flag=1  AND police_id=" + this.dataHead.req_id + " ",
        "userToken": this.userData.userToken
      });
    } else {
      var student = JSON.stringify({
        "table_name": "ppers_setup",
        "field_id": "pers_no",
        "field_name": "pers_desc",
        "condition": " AND pers_type=6   AND pers_no=" + this.dataHead.req_id + " ",
        "userToken": this.userData.userToken
      });
    }

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        if (getDataOptions.length) {
          this.dataHead[objId] = getDataOptions[0].fieldIdValue;
          this.dataHead[objName] = getDataOptions[0].fieldNameValue;
        } else {
          this.dataHead[objId] = "";
          this.dataHead[objName] = "";
        }
      },
      (error) => { }
    )


  }

  runAlleSeq(dataObj: any) {
    //console.log(typeof dataObj)
    if (typeof dataObj != 'undefined' && dataObj.length) {
      const item = dataObj.reduce((prev: any, current: any) => (+prev.alle_seq > +current.alle_seq) ? prev : current)
      this.alle.alle_seq = item.alle_seq + 1;
    } else {
      this.alle.alle_seq = 1;
    }
  }

  openMyModal(type: any) {
    if (type == 1) {
      var student = JSON.stringify({
        "table_name": "pallegation",
        "field_id": "alle_id",
        "field_name": "alle_name",
        "field_name2": "alle_running",
        "search_id": "",
        "search_desc": "",
        "condition": " AND case_type='" + this.dataHead.case_type + "' AND case_cate_group='" + this.dataHead.case_cate_group + "' AND user_select=1",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
          modalRef.componentInstance.items = response
          modalRef.componentInstance.value1 = "pallegation"
          modalRef.componentInstance.value2 = "alle_id"
          modalRef.componentInstance.value3 = "alle_name"
          modalRef.componentInstance.value7 = " AND case_type='" + this.dataHead.case_type + "' AND case_cate_group='" + this.dataHead.case_cate_group + "' AND user_select=1"
          modalRef.componentInstance.types = 1
          modalRef.result.then((item: any) => {
            if (item) {
              console.log(item)
              this.insertAlle(item)
            }
          })
        },
        (error) => { }
      )
    } else if (type == 2) {
      var student = JSON.stringify({
        "table_name": "pallegation",
        "field_id": "alle_id",
        "field_name": "alle_name",
        "field_name2": "alle_running",
        "search_id": "",
        "search_desc": "",
        "condition": " AND case_type='" + this.dataHead.case_type + "' AND case_cate_group='" + this.dataHead.case_cate_group + "' AND user_select=1",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          const modalRef = this.ngbModal.open(ModalReturnAlleComponent, { windowClass: 'my-class' })
          modalRef.componentInstance.items = response
          modalRef.componentInstance.maxValue = this.alle.alle_seq
          modalRef.componentInstance.value1 = "pallegation"
          modalRef.componentInstance.value2 = "alle_id"
          modalRef.componentInstance.value3 = "alle_name"
          modalRef.componentInstance.value7 = " AND case_type='" + this.dataHead.case_type + "' AND case_cate_group='" + this.dataHead.case_cate_group + "' AND user_select=1"
          modalRef.componentInstance.types = "1"
          modalRef.result.then((item: any) => {
            if (item) {
              this.insertAlleAll(item)
            }
          })
        },
        (error) => { }
      )
    } else if (type == 3 || type == 4) {
      if (type == 3) {
        var student = JSON.stringify({
          "table_name": "ppolice",
          "field_id": "police_id",
          "field_name": "police_name",
          "search_id": "",
          "search_desc": "",
          "condition": " AND police_flag=1",
          "userToken": this.userData.userToken
        });
      } else {
        var student = JSON.stringify({
          "table_name": "ppolice",
          "field_id": "police_id",
          "field_name": "police_name",
          "search_id": "",
          "search_desc": "",
          "condition": " AND police_flag=2",
          "userToken": this.userData.userToken
        });
      }

      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
          modalRef.componentInstance.items = response
          modalRef.componentInstance.value1 = "ppolice"
          modalRef.componentInstance.value2 = "police_id"
          modalRef.componentInstance.value3 = "police_name"
          if (type == 3) {
            modalRef.componentInstance.value7 = " AND police_flag=1"
          } else {
            modalRef.componentInstance.value7 = " AND police_flag=2"
          }
          modalRef.componentInstance.types = 1
          modalRef.result.then((item: any) => {
            if (item) {
              console.log(item)
              this.dataHead.req_id = item.fieldIdValue;
              this.dataHead.req_name = item.fieldNameValue;
              this.dataHead.pros_desc = item.fieldNameValue;

            } else {
              this.dataHead.req_id = null;
              this.dataHead.req_name = null;
              this.dataHead.pros_desc = null;
            }
          })
        },
        (error) => { }
      )
    } else if (type == 5) {
      var student = JSON.stringify({
        "table_name": "ppers_setup",
        "field_id": "pers_no",
        "field_name": "pers_desc",
        "search_id": "",
        "search_desc": "",
        "condition": " AND pers_type=6",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
          modalRef.componentInstance.items = response
          modalRef.componentInstance.value1 = "ppers_setup"
          modalRef.componentInstance.value2 = "pers_no"
          modalRef.componentInstance.value3 = "pers_desc"
          modalRef.componentInstance.value7 = " AND pers_type=6"

          modalRef.componentInstance.types = 1
          modalRef.result.then((item: any) => {
            if (item) {
              console.log(item)
              this.dataHead.req_id = item.fieldIdValue;
              this.dataHead.req_name = item.fieldNameValue;
              this.dataHead.pros_desc = item.fieldNameValue;

            } else {
              this.dataHead.req_id = null;
              this.dataHead.req_name = null;
              this.dataHead.pros_desc = null;
            }
          })
        },
        (error) => { }
      )
    } else if (type == 6) {
      var student = JSON.stringify({
        "table_name": "pallegation",
        "field_id": "alle_id",
        "field_name": "post_indict_desc",
        "search_id": "",
        "search_desc": "",
        "condition": " AND case_cate_group=1",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          const modalRef = this.ngbModal.open(DatalistReturnMultipleComponent, { windowClass: 'my-class' })
          modalRef.componentInstance.items = response
          modalRef.componentInstance.value1 = "pallegation"
          modalRef.componentInstance.value2 = "alle_id"
          modalRef.componentInstance.value3 = "post_indict_desc"
          modalRef.componentInstance.value7 = " AND case_cate_group=1"
          modalRef.componentInstance.types = 1
          modalRef.result.then((item: any) => {
            if (item) {
              console.log(item)
              this.dataHead.tmp_id = item.fieldIdValue;
              this.dataHead.indict_desc = item.fieldNameValue;
            } else {
              this.dataHead.tmp_id = null;
              this.dataHead.indict_desc = null;
            }
          })
        },
        (error) => { }
      )
    } else if (type == 7) {
      var student = JSON.stringify({
        "cond": "2",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          console.log(response)
          let productsJson: any = JSON.parse(JSON.stringify(response));
          const modalRef = this.ngbModal.open(ModalJudgeComponent)
          modalRef.componentInstance.items = productsJson.data
          modalRef.componentInstance.value1 = "pjudge"
          modalRef.componentInstance.value2 = "judge_id"
          modalRef.componentInstance.value3 = "judge_name"
          modalRef.componentInstance.value5 = "{\"type\":2}"
          modalRef.componentInstance.types = 1
          modalRef.result.then((item: any) => {
            if (item) {
              console.log(item)
              this.dataHead.order_judge_id = item.judge_id;
              this.dataHead.order_judge_name = item.judge_name;
            } else {
              this.dataHead.order_judge_id = null;
              this.dataHead.order_judge_name = null;
            }
          })
        },
        (error) => { }
      )
    } else if (type == 8) {
      var student = JSON.stringify({
        "table_name": "ppost_remark",
        "field_id": "remark_id",
        "field_name": "remark_desc",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
          modalRef.componentInstance.items = response
          modalRef.componentInstance.value1 = "ppost_remark"
          modalRef.componentInstance.value2 = "remark_id"
          modalRef.componentInstance.value3 = "remark_desc"

          modalRef.componentInstance.types = 1
          modalRef.result.then((item: any) => {
            if (item) {
              console.log(item)
              this.dataHead.remark_id = item.fieldIdValue;
              this.dataHead.remark = item.fieldNameValue;
            } else {
              this.dataHead.remark_id = null;
              this.dataHead.remark = null;
            }
          })
        },
        (error) => { }
      )
    } else if (type == 9) {
      var student = JSON.stringify({
        "table_name": "pallegation_cover",
        "field_id": "alle_id",
        "field_name": "alle_name",
        "search_id": "",
        "search_desc": "",
        "condition": " AND case_type=1",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          const modalRef = this.ngbModal.open(DatalistReturnMultipleComponent, { windowClass: 'my-class' })
          modalRef.componentInstance.items = response
          modalRef.componentInstance.value1 = "pallegation_cover"
          modalRef.componentInstance.value2 = "alle_id"
          modalRef.componentInstance.value3 = "alle_name"
          modalRef.componentInstance.value7 = " AND case_type=1"
          modalRef.componentInstance.types = 1
          modalRef.result.then((item: any) => {
            if (item) {
              console.log(item)
              this.dataHead.alle_id = item.fieldIdValue;
              this.dataHead.alle_desc = item.fieldNameValue;
            } else {
              this.dataHead.alle_id = null;
              this.dataHead.alle_desc = null;
            }
          })
        },
        (error) => { }
      )
    }
  }

  confirmEditCase() {
    const modalRef = this.ngbModal.open(ModalConfirmComponent)
    modalRef.componentInstance.types = "1"
    modalRef.closed.subscribe((data) => {
      if (data) {
        var dataJson = data;
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการแก้ไขเลขคดีใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการแก้ไขเลขดคี');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER
        })
        confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
            this.refLogin = 1;
          }
        })
      }
    })
  }

  insertAlle(event: any) {
    console.log(event)
    // var data = event[0];
    var student = JSON.stringify({
      "run_id": this.dataHead.run_id,
      "alle_running": event.fieldNameValue2,
      "alle_id": event.fieldIdValue,
      "alle_seq": this.alle.alle_seq,
      "alle_name": event.fieldNameValue,
      "userToken": this.userData.userToken
    });
    console.log(student)

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/insertAllegation', student).subscribe(
      (response) => {
        console.log(response)
        let alertMessage: any = JSON.parse(JSON.stringify(response));
        if (alertMessage.result == 0) {
          confirmBox.setMessage(alertMessage.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              this.getObjAlleData();
              this.getAlleDesc();
            }
            subscription.unsubscribe();
          });
        } else {
          this.getObjAlleData();
          this.getAlleDesc();
        }
      },
      (error) => { this.SpinnerService.hide(); }
    )
  }

  insertAlleAll(event: any) {
    //this.SpinnerService.show();
    var data = event;
    var element = JSON.stringify({ 'run_id': this.dataHead.run_id, 'userToken': this.userData.userToken, data });
    console.log(element)

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/insertAllAllegation', element).subscribe(
      (response) => {
        console.log(response)
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
              this.getObjAlleData();
              this.getAlleDesc();
            }
            subscription.unsubscribe();
          });
        } else {
          this.getObjAlleData();
          this.getAlleDesc();
        }
      },
      (error) => { }
    )
  }

  getObjAlleData() {
    var student = JSON.stringify({
      "run_id": this.dataHead.run_id,
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.dataHead.alleObj = [];
    this.getDataAlle$ = of();
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/getAllegationData', student).subscribe(
      datalist => {
        this.items = datalist;
        if (this.items.data.length) {
          var bar = new Promise((resolve, reject) => {
            this.items.data.forEach((x: any) => x.seqAlle = false);
          });

          if (bar) {
            this.dataHead.alleObj = this.items.data;
            this.getDataAlle$ = of(this.dataHead.alleObj);
            this.buttonDelAlle = false;
            this.rerender();
            this.runAlleSeq(this.dataHead.alleObj);
          }
        } else {
          this.runAlleSeq([]);
        }
      },
      (error) => { }
    );
  }

  getAlleDesc() {
    var student = JSON.stringify({
      "table_name": "pcase",
      "field_id": "run_id",
      "field_name": "alle_desc",
      "condition": " AND run_id='" + this.dataHead.run_id + "'",
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        if (getDataOptions.length) {
          this.dataHead.alle_desc = getDataOptions[0].fieldNameValue;
        }
      },
      (error) => { }
    );
  }

  changeInputData(event: any, table: any, type: any) {
    if (table == 'pallegation' && type == 1) {
      if (event.target.value) {
        var student = JSON.stringify({
          "table_name": "pallegation",
          "field_id": "alle_id",
          "field_name": "alle_name",
          "field_name2": "alle_running",
          "search_id": "",
          "search_desc": "",
          "condition": " AND case_type='" + this.dataHead.case_type + "' AND case_cate_group='" + this.dataHead.case_cate_group + "' AND user_select='1' AND alle_id='" + event.target.value + "'",
          "userToken": this.userData.userToken
        });
        console.log(student);

        this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
          (response) => {
            this.list = response;
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
                  this.alle.alle_id1 = null;
                }
                subscription.unsubscribe();
              });
            }
            console.log(this.list)
            this.SpinnerService.hide();
          },
          (error) => { this.SpinnerService.hide(); }
        )
      }
    }
  }

  delAlleData() {
    const modalRef = this.ngbModal.open(ModalConfirmComponent)
    modalRef.componentInstance.types = "1"
    modalRef.closed.subscribe((data) => {
      if (data) {
        var log_remark = data;
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER
        })
        confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
            var dataDel = [], dataTmp = [];
            dataDel['run_id'] = this.dataHead.run_id;
            dataDel['log_remark'] = log_remark;
            dataDel['userToken'] = this.userData.userToken;
            var bar = new Promise((resolve, reject) => {
              this.dataHead.alleObj.forEach((ele, index, array) => {
                if (ele.seqAlle == true) {
                  dataTmp.push(this.dataHead.alleObj[index]);
                }
              });
            });

            if (bar) {
              dataDel['data'] = dataTmp;
              var data = $.extend({}, dataDel);
              console.log(data)
              this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteAllAllegationData', data).subscribe(
                (response) => {
                  let alertMessage: any = JSON.parse(JSON.stringify(response));
                  console.log(alertMessage)
                  const confirmBox2 = new ConfirmBoxInitializer();
                  confirmBox2.setTitle('ข้อความแจ้งเตือน');
                  if (alertMessage.result == 0) {
                    confirmBox2.setMessage(alertMessage.error);
                    confirmBox2.setButtonLabels('ตกลง');
                    confirmBox2.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if (resp.success == true) { }
                      subscription2.unsubscribe();
                    });
                  } else {
                    confirmBox2.setMessage(alertMessage.error);
                    confirmBox2.setButtonLabels('ตกลง');
                    confirmBox2.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if (resp.success == true) {
                        this.masterSelAlle = this.buttonDelAlle = false;
                        this.getObjAlleData();
                      }
                      subscription2.unsubscribe();
                    });

                  }
                },
                (error) => { }
              )
            }
          }
        })
      }
    })
  }

  saveData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var alert = 0;
    if (!this.dataHead.pid) {
      confirmBox.setMessage('กรุณาระบุหมายเลขฝากขัง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
      alert++;
    } else if (!this.dataHead.pyy) {
      confirmBox.setMessage('กรุณาระบุปีฝากขัง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
      alert++;
    } else if (!this.dataHead.req_name) {
      confirmBox.setMessage('กรุณาระบุชื่อผู้ร้อง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
      alert++;
    } else if (!this.dataHead.req_name) {
      confirmBox.setMessage('คุณยังไม่ป้อนจำนวนวันที่ฝากขังได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
      alert++;
    }

    if (!alert) {
      var data = [];
      //console.log(this.dataHeadTmp.ptitle+'!='+this.dataHead.ptitle+' || '+this.dataHeadTmp.pid+'!='+this.dataHead.pid+' || '+this.dataHeadTmp.pyy+'!='+this.dataHead.pyy+' && '+this.refLogin)
      //return
      if (this.dataHeadTmp.run_id) {
        if ((this.dataHeadTmp.ptitle != this.dataHead.ptitle || this.dataHeadTmp.pid != this.dataHead.pid || this.dataHeadTmp.pyy != this.dataHead.pyy) && !this.refLogin) {
          confirmBox.setMessage('ต้องการเปลียนหมายเลขคดีฝากขัง กรุณา login เพื่อเปลี่ยนเลขคดี');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) { }
            subscription.unsubscribe();
          });
        } else {
          data['case_type'] = 1;
          data['run_id'] = this.dataHead.run_id;
          data['title'] = this.dataHead.ptitle;
          data['id'] = this.dataHead.pid;
          data['yy'] = this.dataHead.pyy;
          data['req_type'] = this.dataHead.req_type ? this.dataHead.req_type : null;
          data['req_id'] = this.dataHead.req_id ? this.dataHead.req_id : null;
          data['req_name'] = this.dataHead.req_name ? this.dataHead.req_name : null;
          data['pros_desc'] = this.dataHead.req_name ? this.dataHead.req_name : null;
          data['pros_type'] = "ผู้ร้อง";
          data['case_date'] = this.dataHead.case_date ? this.dataHead.case_date : null;
          data['post_day'] = this.dataHead.post_day ? this.dataHead.post_day : null;
          data['alle_id'] = this.dataHead.alle_id ? this.dataHead.alle_id : null;
          data['alle_desc'] = this.dataHead.alle_desc ? this.dataHead.alle_desc : null;
          data['police_rank'] = this.dataHead.police_rank ? this.dataHead.police_rank : null;
          data['police_name'] = this.dataHead.police_name ? this.dataHead.police_name : null;
          data['sum'] = this.dataHead.sum ? this.dataHead.sum : null;
          data['post_day_other'] = this.dataHead.post_day_other ? this.dataHead.post_day_other : null;
          data['indict_desc'] = this.dataHead.indict_desc ? this.dataHead.indict_desc : null;
          data['order_judge_id'] = this.dataHead.order_judge_id ? this.dataHead.order_judge_id : null;
          data['order_judge_name'] = this.dataHead.order_judge_name ? this.dataHead.order_judge_name : null;
          data['order_judge_date'] = this.dataHead.order_judge_date ? this.dataHead.order_judge_date : null;
          data['remark_id'] = this.dataHead.remark_id ? this.dataHead.remark_id : null;
          data['remark'] = this.dataHead.remark ? this.dataHead.remark : null;
          data['take_flag'] = this.dataHead.take_flag ? this.dataHead.take_flag : null;
          data['case_cate_id'] = 1;
          data['court_id'] = this.userData.courtId;
          data['userToken'] = this.userData.userToken;
          var api = '/' + this.userData.appName + 'ApiCA/API/CASE/updateCaseData';
          this.saveDataCommit(data, api);
        }
      } else {
        data['case_type'] = 1;
        data['title'] = this.dataHead.ptitle;
        data['id'] = this.dataHead.pid;
        data['yy'] = this.dataHead.pyy;
        data['req_type'] = this.dataHead.req_type ? this.dataHead.req_type : null;
        data['req_id'] = this.dataHead.req_id ? this.dataHead.req_id : null;
        data['req_name'] = this.dataHead.req_name ? this.dataHead.req_name : null;
        data['pros_desc'] = this.dataHead.req_name ? this.dataHead.req_name : null;
        data['pros_type'] = "ผู้ร้อง";
        data['case_date'] = this.dataHead.case_date ? this.dataHead.case_date : null;
        data['post_day'] = this.dataHead.post_day ? this.dataHead.post_day : null;
        data['alle_id'] = this.dataHead.alle_id ? this.dataHead.alle_id : null;
        data['alle_desc'] = this.dataHead.alle_desc ? this.dataHead.alle_desc : null;
        data['police_rank'] = this.dataHead.police_rank ? this.dataHead.police_rank : null;
        data['police_name'] = this.dataHead.police_name ? this.dataHead.police_name : null;
        data['sum'] = this.dataHead.sum ? this.dataHead.sum : null;
        data['post_day_other'] = this.dataHead.post_day_other ? this.dataHead.post_day_other : null;
        data['indict_desc'] = this.dataHead.indict_desc ? this.dataHead.indict_desc : null;
        data['order_judge_id'] = this.dataHead.order_judge_id ? this.dataHead.order_judge_id : null;
        data['order_judge_name'] = this.dataHead.order_judge_name ? this.dataHead.order_judge_name : null;
        data['order_judge_date'] = this.dataHead.order_judge_date ? this.dataHead.order_judge_date : null;
        data['remark_id'] = this.dataHead.remark_id ? this.dataHead.remark_id : null;
        data['remark'] = this.dataHead.remark ? this.dataHead.remark : null;
        data['take_flag'] = this.dataHead.take_flag ? this.dataHead.take_flag : null;
        data['case_cate_id'] = 1;
        data['court_id'] = this.userData.courtId;
        data['userToken'] = this.userData.userToken;
        var api = '/' + this.userData.appName + 'ApiCA/API/CASE/insertCaseData';
        this.saveDataCommit(data, api);
      }
    }
  }

  saveDataCommit(json: any, api: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    console.log($.extend({}, json))
    this.http.post(api, $.extend({}, json)).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if (getDataOptions.result == 1) {
          if (getDataOptions.error) {
            //-----------------------------//
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.searchCaseNo(3, getDataOptions.run_id);
                this.refLogin = null;
              }
              subscription.unsubscribe();
            });
            //-----------------------------//
          } else {
            this.searchCaseNo(3, getDataOptions.run_id);
            this.refLogin = null;
          }

        } else {
          //-----------------------------//
          confirmBox.setMessage(getDataOptions.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              //this.dataHead.id = this.caseNoLast+1;
            }
            subscription.unsubscribe();
          });
          //-----------------------------//
        }

      },
      (error) => { }
    )
  }

  runCaseNo() {
    if (this.dataHead.ptitle && this.dataHead.pyy && !this.dataHead.run_id) {
      var student = JSON.stringify({
        "case_type": 1,
        "title": this.dataHead.ptitle,
        "yy": this.dataHead.pyy,
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/runCaseNo', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if (getDataOptions.result) {

            this.caseNoLast = getDataOptions.id.toString();
            if (!this.dataHead.pid)
              this.dataHead.pid = parseInt(getDataOptions.id) + 1;
          } else
            if (!this.dataHead.pid)
              this.caseNoLast = '';
        },
        (error) => { }
      )
    }
  }

  reloadPage() {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    location.replace(winURL + 'fpo0100')
    window.location.reload();
  }

  cancelPage() {
    if (!this.dataHead.run_id) {
      this.setDefHead();
    } else {
      this.searchCaseNo(3, this.dataHead.run_id);
    }
  }

  delCase() {
    if (this.dataHead.run_id) {

      const modalRef = this.ngbModal.open(ModalConfirmComponent)
      modalRef.componentInstance.types = "1"
      modalRef.closed.subscribe((data) => {
        if (data) {
          var dataJson = data;
          const confirmBox2 = new ConfirmBoxInitializer();
          confirmBox2.setTitle('ข้อความแจ้งเตือน');
          confirmBox2.setMessage('ยืนยันการลบเลขคดีฝากขังที่ ' + this.dataHead.ptitle + this.dataHead.pid + "/" + this.dataHead.pyy);
          confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
          confirmBox2.setConfig({
            layoutType: DialogLayoutDisplay.DANGER
          })
          const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              var data = $.extend({}, this.dataHead);
              console.log(data)
              this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/deleteCaseData', data).subscribe(
                (response) => {
                  let alertMessage: any = JSON.parse(JSON.stringify(response));
                  console.log(alertMessage)
                  if (alertMessage.result == 0) {
                    this.SpinnerService.hide();
                  } else {
                    const confirmBox = new ConfirmBoxInitializer();
                    confirmBox.setTitle('ข้อความแจ้งเตือน');
                    confirmBox.setMessage('ลบเลขคดี ' + this.dataHead.ptitle + this.dataHead.pid + "/" + this.dataHead.pyy + ' ออกจากระบบเรียบร้อยแล้ว');
                    confirmBox.setButtonLabels('ตกลง');
                    confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                      if (resp.success == true) {
                        this.reloadPage();
                      }
                      subscription.unsubscribe();
                    });

                  }
                },
                (error) => { }
              )
            }
            subscription2.unsubscribe();
          })
        }
      })
    }
  }


  printReport(type: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.dataHead.run_id) {
      confirmBox.setMessage('กรุณาค้นหาเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (this.dataHead.run_id && type == 1) {
      //rca0200_A4.jsp? prun_id =& pcase_flag =&pprint_app=1&pprint_by=2
      var rptName = 'rpo0101';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHead.run_id,
        "psize": 1,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHead.run_id && type == 2) {

      /* if(typeof this.dataEditPost =='undefined'){
        confirmBox.setMessage('กรุณาคลิกแก้ไขข้อมูลก่อนพิมพ์');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{ */
      var rptName = 'rpo0100';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHead.run_id,
        "ppage": 1,
        "psize": 1,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
      //}


    } else if (this.dataHead.run_id && type == 3) {
      //rca0200_A4.jsp? prun_id =& pcase_flag =&pprint_app=1&pprint_by=2
      var rptName = 'rpo0100_a4_form';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHead.run_id,
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    } else if (this.dataHead.run_id && type == 4) {
      //rca0200_A4.jsp? prun_id =& pcase_flag =&pprint_app=1&pprint_by=2
      var post_seq: any;
      var pnotice_date: any;
      if (typeof this.dataEditPost != 'undefined') {
        post_seq = this.dataEditPost.post_seq ? this.dataEditPost.post_seq : 1;
        pnotice_date = this.dataEditPost.post_start ? myExtObject.conDate(this.dataEditPost.post_start) : myExtObject.conDate(myExtObject.curDate());
      } else {
        post_seq = 1;
        pnotice_date = myExtObject.conDate(myExtObject.curDate());
      }
      var rptName = 'rno0800';
      var paramData = '{}';
      var paramData = JSON.stringify({
        "prun_id": this.dataHead.run_id,
        "ppost_seq": post_seq,
        "pitem": 0,
        "ppage": 1,
        "psize": 1,
        "pnotice_date": pnotice_date,
        "puser_name": this.userData.userName
      });
      console.log(paramData)
      this.printReportService.printReport(rptName, paramData);
    }
  }

  tabChangeInput(name: any, event: any) {
    if (name == 'alle_id') {
      var student = JSON.stringify({
        "table_name": "pallegation_cover",
        "field_id": "alle_id",
        "field_name": "alle_name",
        "condition": " AND case_type=1 AND alle_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.dataHead.alle_desc = productsJson[0].fieldNameValue;
          } else {
            this.dataHead.alle_id = '';
            this.dataHead.alle_desc = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'remark_id') {
      student = JSON.stringify({
        "table_name": "ppost_remark",
        "field_id": "remark_id",
        "field_name": "remark_desc",
        "condition": " AND remark_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.dataHead.remark = productsJson[0].fieldNameValue;
          } else {
            this.dataHead.remark_id = '';
            this.dataHead.remark = '';
          }
        },
        (error) => { }
      )
    }
  }
}
