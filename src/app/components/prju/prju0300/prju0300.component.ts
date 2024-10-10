import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnMultipleComponent } from '@app/components/modal/datalist-return-multiple/datalist-return-multiple.component';

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
  selector: 'app-prju0300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prju0300.component.html',
  styleUrls: ['./prju0300.component.css']
})


export class Prju0300Component implements AfterViewInit, OnInit, OnDestroy {
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
  selCaseType:any;
  selCaseId:any;

  getCaseType:any;
  getCaseCate:any;
  result:any = [];
  modalType:any;
  getMonth:any;
  getNation:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prju0300',{static: true}) prju0300 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;
  @ViewChild('sCaseStat') sCaseStat : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService,
    private ngbModal: NgbModal,
  ){  }

  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
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
      },
      (error) => {}
    )
    //----------------------end pcase_type -------------------

    this.getMonth = [{id:'0',text:'---เลือก---'},{id:'1',text:'มกราคม'},{id:'2',text:'กุมภาพันธ์'},{id:'3',text:'มีนาคม'},{id:'4',text:'เมษายน'},{id:'5',text:'พฤษภาคม'},{id:'6',text:'มิถุนายน'},{id:'7',text:'กรกฎาคม'},{id:'8',text:'สิงหาคม'},{id:'9',text:'กันยายน'},{id:'10',text:'ตุลาคม'},{id:'11',text:'พฤศจิกายน'},{id:'12',text:'ธันวาคม'}];
    this.getNation = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'ไทย'},{id:'2',text:'ต่างชาติ'}];
    this.setDefPage();
  }

  setDefPage(){
    this.result.pmonth = '0';
    this.result.pyear = myExtObject.curYear();
    this.result.pnation = '0';
  }

  changeCaseType(caseType:any){
    this.sCaseStat.clearModel();
    this.fCaseTitle(caseType);
  }
  
  fCaseTitle(case_type:any){
  //============ ptitle ============
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
    if(name=='ppenalty_id'){
      var student = JSON.stringify({
        "table_name" : "ppenalty",
        "field_id" : "penalty_id",
        "field_name" : "penalty_desc",
        "condition" : " AND penalty_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.length){
            this.result.ppenalty_desc = productsJson[0].fieldNameValue;
          }else{
            this.result.ptppenalty_idable = '';
            this.result.ppenalty_desc = '';
          }
        },
        (error) => {}
      )
    }
  }
    
    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      // this.openbutton.nativeElement.click();
      this.loadMyModalComponent();
    }
    
    closeModal(){
      this.loadModalListComponent = false;
    }
    
    loadMyModalComponent(){
      $(".modal-backdrop").remove();
      if(this.modalType==1){
        $("#exampleModal").find(".modal-content").css("width","800px");
        var student = JSON.stringify({
          "table_name" : "ppenalty",
        "field_id" : "penalty_id",
        "field_name" : "penalty_desc",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken
        });
        this.listTable='ppenalty';
        this.listFieldId='penalty_id';
        this.listFieldName='penalty_desc';
        this.listFieldNull='';
        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
            // this.loadModalListComponent = true;
            const modalRef = this.ngbModal.open(DatalistReturnMultipleComponent,{ size: 'lg', backdrop: 'static' })
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "ppenalty"
            modalRef.componentInstance.value2 = "penalty_id"
            modalRef.componentInstance.value3 = "penalty_desc"
            modalRef.componentInstance.types = "1"

            modalRef.result.then((item: any) => {
              if(item){
                this.result.ppenalty_id=item.fieldIdValue;
                this.result.ppenalty_desc=item.fieldNameValue;
                
              }
            })
          },
          (error) => {}
        )
      }
    }
    
  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prju0300"
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

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.ppenalty_id=event.fieldIdValue;
      this.result.ppenalty_desc=event.fieldNameValue;
    }
      this.closebutton.nativeElement.click();
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


  printReport(){
  var rptName = 'rju0300';
  // For no parameter : paramData ='{}'
  var paramData ='{}';
  // For set parameter to report
  var paramData = JSON.stringify({
  "pcase_type" : this.result.pcase_type ? this.result.pcase_type : '',
  "pcase_cate_id" : this.result.pcase_cate_id ? this.result.pcase_cate_id : '',
  "pmonth" : this.result.pmonth ? this.result.pmonth.toString() : '',
  "pyear" : this.result.pyear ? (this.result.pyear -543).toString() : '',
  "ppenalty_id" : this.result.ppenalty_id ? this.result.ppenalty_id.toString() : '0',
  "pdep_code" : this.result.pdep_code ? this.result.pdep_code : '',
  "pnation" : this.result.pnation ? this.result.pnation : '',
  });
  console.log(paramData);
  // alert(paramData);return false;
  this.printReportService.printReport(rptName,paramData);
  }
}






