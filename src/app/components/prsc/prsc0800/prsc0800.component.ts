import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';

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
  selector: 'app-prsc0800,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prsc0800.component.html',
  styleUrls: ['./prsc0800.component.css']
})


export class Prsc0800Component implements AfterViewInit, OnInit, OnDestroy {
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
  judgeHead:any;

  result:any = [];
  modalType:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prca0800',{static: true}) prca0800 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;
  @ViewChild('sCaseStat') sCaseStat : NgSelectComponent;
  @ViewChild('sTitleGroup') sTitleGroup : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
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
     //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "field_name2" : "post_id",
      "condition" : " AND post_id=1 AND (end_date IS NULL OR end_date>CURRENT_DATE)",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions);
        if(getDataOptions.length)
          this.judgeHead = getDataOptions[0];
        this.setDefPage();
      },
      (error) => {}
    )

    
  }

  setDefPage(){
    this.result = [];
    this.result.txtStartDate = this.result.txtEndDate = myExtObject.curDate();
    console.log(this.judgeHead)
    if(typeof this.judgeHead !='undefined' || this.judgeHead){
      
      //this.tabChangeInput('sign_id',this.judgeHead);
        this.result.sign_id = this.judgeHead.fieldIdValue;
        this.result.sign_name = this.judgeHead.fieldNameValue;
        this.getPost(this.judgeHead.fieldNameValue2,4);
    }
   
  }

  tabChangeInput(name:any,event:any){
    if(name=='sign_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "field_name2" : "post_id",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.sign_name = productsJson[0].fieldNameValue;
            this.getPost(productsJson[0].fieldNameValue2,4);
          }else{
            this.result.sign_id = '';
            this.result.sign_name = '';
          }
          },
          (error) => {}
        )
    }
  }

  getPost(post_id:any,modalType:any){
    if(post_id){
      var student = JSON.stringify({
        "table_name" : "pposition",
        "field_id" : "post_id",
        "field_name" : "post_name",
        "condition" : " AND post_id='"+post_id+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            if(modalType==2)
              this.result.poff_post = productsJson[0].fieldNameValue;
            else if (modalType==3)
              this.result.psign_post = productsJson[0].fieldNameValue;
            else if (modalType==4)
              this.result.sign_post = productsJson[0].fieldNameValue;
          }else{
            if(modalType==2)
              this.result.poff_post = '';
            else if (modalType==3)
              this.result.psign_post = '';
            else if (modalType==4)
              this.result.sign_post = '';
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

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==4){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "field_name2" : "post_id",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldName2='post_id';
      this.listFieldNull='';
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            // this.loadModalListComponent = true;
            // this.loadModalJudgeComponent = false;
            const modalRef = this.ngbModal.open(DatalistReturnComponent, { size: 'lg', backdrop: 'static' })
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "pjudge"
            modalRef.componentInstance.value2 = "judge_id"
            modalRef.componentInstance.value3 = "judge_name"
            modalRef.componentInstance.value4 = "post_id"
            modalRef.componentInstance.types = "1"
  
            modalRef.result.then((item: any) => {
              if (item) {
                this.result.sign_id = item.fieldIdValue;
                this.result.sign_name = item.fieldNameValue;
                this.getPost(item.fieldNameValue2, this.modalType);
              }
            })
          },
        (error) => {}
      )
    }
  }

  closeModal(){
    this.loadModalListComponent = false;
    this.loadModalJudgeComponent = false;
  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.pdep_code=event.fieldIdValue;
      this.result.dep_name=event.fieldNameValue;
    }else if(this.modalType==2){
      this.result.poff_id=event.fieldIdValue;
      this.result.poff_name=event.fieldNameValue;
      this.getPost(event.fieldNameValue2,this.modalType);
    }else if(this.modalType==3){
      this.result.psign_id=event.fieldIdValue;
      this.result.psign_name=event.fieldNameValue;
      this.getPost(event.fieldNameValue2,this.modalType);
    }else if(this.modalType==4){
      this.result.sign_id=event.fieldIdValue;
      this.result.sign_name=event.fieldNameValue;
      this.getPost(event.fieldNameValue2,this.modalType);
    }

    this.closebutton.nativeElement.click();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prsc0800"
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

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  printReport(){
    var rptName = 'rsc0800';
  // For no parameter : paramData ='{}'
    var paramData ='{}';
  // For set parameter to report
    var paramData = JSON.stringify({
      "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
      "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
      "sign_name" : this.result.sign_name ? this.result.sign_name : '',
      "sign_post" :this.result.sign_post ? this.result.sign_post : '',
      "psign_name" : this.result.sign_name ? this.result.sign_name : '',
      "psign_post" :this.result.sign_post ? this.result.sign_post : '',
      "ptitle" :this.result.ptitle ? this.result.ptitle : '',
    });
    console.log(paramData)
  // alert(paramData);return false;
    this.printReportService.printReport(rptName,paramData);
  }

  changeCaseType(caseType:any){
    this.selCaseType = caseType;
  }



}






