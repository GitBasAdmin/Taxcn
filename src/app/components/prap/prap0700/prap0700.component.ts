import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prap0700,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prap0700.component.html',
  styleUrls: ['./prap0700.component.css']
})


export class Prap0700Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
  //form: FormGroup;
  title = 'datatables';

  
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  selectedCasetype:any='แพ่ง';
  getCaseType:any;
  selCaseType:any;
  selCaseId:any;

  hid_branch_type:any;
  hid_case_type_stat:any;
  hid_title:any;
  getCaseCate:any;
  getTitle:any;
  getTime:any;
  getFlag2:any;
  getLevelRoom:any;
  getLevelRoom2:any;

  result:any = [];
  modalType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListComponent: boolean = false;

  @ViewChild('prap0700',{static: true}) prap0700 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;
  @ViewChild('sCaseStat') sCaseStat : NgSelectComponent;
  @ViewChild('sTitle') sTitle : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService
  ){  }

  ngOnInit(): void {


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
       //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "order_by" : "case_type ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.selCaseType = this.userData.defaultCaseType;

        //console.log(this.getCaseType)
        //console.log(this.userData.defaultCaseType)
        //console.log(this.selCaseType)
      },
      (error) => {}
    )
    //----------------------end pcase_type -------------------
    this.getTime = [{id:'',text:'ทั้งวัน'},{id:'am',text:'เช้า'},{id:'pm',text:'บ่าย'},{id:'ampm',text:'เช้า-บ่าย'},{id:'zm',text:'เย็น'}];
    this.getFlag2 = [{id:'1',text:'ติดหน้าศาล'},{id:'5',text:'ติดหน้าศาล(แบบย่อ)'},{id:'7',text:'ติดหน้าศาล(บรรทัดเดียว)'},
    //{id:'2',text:'จ่ายสำนวน'},
    {id:'8',text:'จ่ายสำนวน (บรรทัดเดียว)'},{id:'3',text:'หลังวันนัด'},{id:'4',text:'หลังวันนัด(ไม่พิมพ์รายงานกระบวน)'},{id:'6',text:'เตรียมสำนวน(แบบย่อ)'},];
    // this.getLevelRoom = [{id:'1',text:'1'},{id:'2',text:'2'},{id:'3',text:'3'},{id:'4',text:'4'}];
       //======================== getLevelRoom ======================================
       var student = JSON.stringify({
        "table_name" : "plevel_room",
        "field_id" : "level_room_id",
        "field_name" : "level_room_desc",
        "order_by" : "level_room_id ASC",
      });
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getLevelRoom = getDataOptions;
          console.log(this.getLevelRoom);
        },
        (error) => {}
      )
    // this.getLevelRoom2 = [{id:'1',text:'1'},{id:'2',text:'2'},{id:'3',text:'3'},{id:'4',text:'4'}];

    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.result.start_date = myExtObject.curDate();
    this.result.prpt_type = 1;
    this.getCaseCate = [];
    this.getTitle = [];
    // this.result.plevel_room = 1;
    // this.result.plevel_room2 = 1;
    this.result.ptime = '';
    this.result.pflag2 = '1';
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prap0700"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
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
      });}

 ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ClearAll(){
      window.location.reload();
    }

    changeCaseType(caseType:any){
      this.sCaseStat.clearModel();
      this.sTitle.clearModel();
      this.fCaseTitle(caseType);
    }
  
     changeTitle(caseType:number,type:any){
      this.title = '';
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title_id",
        "field_name": "title",
        "field_name2": "title_eng",
        "condition": " AND case_type="+caseType+ " And title_flag=1",
        "order_by":" title_id ASC",
        "userToken" : this.userData.userToken
      });
      console.log("fTitle :"+student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getTitle = getDataOptions;
        },
        (error) => {}
      )
      });
      return promise;
    }
  
    fCaseTitle(case_type:any){
      //========================== ptitle ====================================
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": "AND title_flag='1' AND case_type='"+case_type+"'",
        "order_by": " order_id ASC",
        "userToken" : this.userData.userToken
      });
  
  
      //console.log("fCaseTitle")
  
      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            this.getTitle = getDataOptions;
            this.fCaseStat(case_type,getDataOptions[0].fieldIdValue);
          },
          (error) => {}
        )
  
  
  
      });
      return promise;
    }

    fCaseStat(caseType:any,title:any){
      var student = JSON.stringify({
        "table_name": "pcase_cate",
        "field_id": "case_cate_id",
        "field_name": "case_cate_name",
        "condition": " AND case_type='"+caseType+"'",
        "order_by":" case_cate_id ASC",
        "userToken" : this.userData.userToken
      });
      //console.log("fCaseStat :"+student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseCate = getDataOptions;
        },
        (error) => {}
      )
      });
      return promise;
    }

    tabChangeInput(name:any,event:any){
      if(name=='ptable'){
        var student = JSON.stringify({
          "table_name" : "pappoint_table",
          "field_id" : "table_id",
          "field_name" : "table_name",
          "condition" : " AND table_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.length){
              this.result.ptable_name = productsJson[0].fieldNameValue;
            }else{
              this.result.ptable = '';
              this.result.ptable_name = '';
            }
            },
            (error) => {}
          )
      }
    }

    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      this.openbutton.nativeElement.click();
  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.ptable=event.fieldIdValue;
      this.result.ptable_name=event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  closeModal(){
    this.loadModalListComponent = false;
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pappoint_table",
        "field_id" : "table_id",
        "field_name" : "table_name",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pappoint_table';
      this.listFieldId='table_id';
      this.listFieldName='table_name';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            this.loadModalListComponent = true;
        },
        (error) => {}
      )

    }
  }

    printReport(){

      var rptName = 'rap0700';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "prpt_type" : this.result.prpt_type ? this.result.prpt_type.toString() : '',
        "pflag" : this.result.pflag ? this.result.pflag.toString() : '',
        "pflag2" : this.result.pflag2 ? this.result.pflag2.toString() : '',
        "ptitle" : this.result.ptitle ? this.result.ptitle.toString() : '',
        "prun_id" : this.result.prun_id ? this.result.prun_id.toString() : '',
        "pdate_start" : myExtObject.conDate($("#txt_date_start").val()),
        "pdate_end" : myExtObject.conDate($("#txt_date_end").val()),
        "ptime" : this.result.ptime ? this.result.ptime.toString() : '',
        "plevel_room" : this.result.plevel_room ? this.result.plevel_room.toString() : '',
        "plevel_room2" : this.result.plevel_room2 ? this.result.plevel_room2.toString() : '',
        "ptable_id" : this.result.ptable ? this.result.ptable.toString() : '0',
        "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
        "pcase_cate_id" : this.result.pcase_cate_id ? this.result.pcase_cate_id.toString() : '',

        // "BaseDir" : this.result.BaseDir ? this.result.BaseDir.toString() : '',
        // "BaseQR" : this.result.BaseQR ? this.result.BaseQR.toString() : '',
        // "pcourt_running" : this.result.pcourt_running ? this.result.pcourt_running.toString() : '',
        // "puser_name" : this.result.puser_name ? this.result.puser_name.toString() : '',
        // "puser_post" : this.result.puser_post ? this.result.puser_post.toString() : '',
        // "pcourt_name" : this.result.pcourt_name ? this.result.pcourt_name.toString() : '',
        // "pshort_court_name" : this.result.pshort_court_name ? this.result.pshort_court_name.toString() : '',
       });

       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

}






