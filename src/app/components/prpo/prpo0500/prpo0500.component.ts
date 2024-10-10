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
  selector: 'app-prpo0500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prpo0500.component.html',
  styleUrls: ['./prpo0500.component.css']
})


export class Prpo0500Component implements AfterViewInit, OnInit, OnDestroy {
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

  result:any=[];
  getAssetTitle:any;
  modalType:any;
  getGroup:any;
  getCondition:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListComponent: boolean = false;//popup ธรรมดา

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prpo0500',{static: true}) prpo0500 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private ngbModal: NgbModal,
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

    //======================== getAssetTitle ======================================
    var Json = JSON.stringify({
      "table_name" : "ptitle",
      "field_id" : "title",
      "field_name" : "title",
      "condition" : " AND special_case in (1,2,6)",
      "userToken" : this.userData.userToken
    });
      console.log(Json);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json , {headers:headers}).subscribe(
      (response) =>{
        console.log('xxxxxxxxxxx'+response);
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
        this.getAssetTitle = getDataOptions;
      },
      (error) => {}
    )

    //----------------------end pcase_type -------------------
    this.getGroup = [{id:'1',text:'คำนำหน้าคดี'},{id:'2',text:'ผู้ร้อง'},{id:'3',text:'ผู้ร้อง(แยกแผ่น,แสดงชื่อเจ้าของสำนวน)'}];
    this.getCondition = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'ไม่รวมคดีฟ้องแล้ว'}];
    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.result.ptitle = 0;
    this.result.pgroup = '1';
    this.result.pcondition = '1';
    this.result.psize = 1;
    this.result.txtStartDate = this.result.txtStartDate = myExtObject.curDate();
    this.result.txtEndDate = this.result.txtEndDate = myExtObject.curDate();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  tabChangeInput(name:any,event:any){
    if(name=='pstatus'){
      var student = JSON.stringify({
        "table_name" : "paccu_status",
        "field_id" : "status_id",
        "field_name" : "status_desc",
        "condition" : " AND status_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.pstatus_name = productsJson[0].fieldNameValue;
          }else{
            this.result.pstatus = '';
            this.result.pstatus_name = '';
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
        "table_name" : "paccu_status",
        "field_id" : "status_id",
        "field_name" : "status_desc",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='paccu_status';
      this.listFieldId='status_id';
      this.listFieldName='status_desc';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            // this.loadModalListComponent = true;
            const modalRef = this.ngbModal.open(DatalistReturnComponent, { size: 'lg', backdrop: 'static' })
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "paccu_status"
            modalRef.componentInstance.value2 = "status_id"
            modalRef.componentInstance.value3 = "status_desc"
            modalRef.componentInstance.types = "1"

            modalRef.result.then((item: any) => {
              if (item) {
                this.result.pstatus=item.fieldIdValue;
                this.result.pstatus_name=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      )
    }
  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.pstatus=event.fieldIdValue;
      this.result.pstatus_name=event.fieldNameValue;
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
      "url_name" : "prpo0500"
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


    printReport(){

      var rptName = 'rpo0500';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "psize" : this.result.psize ? this.result.psize.toString() : '',
        "title" : this.result.ptitle ? this.result.ptitle.toString() : '',
        "pstatus" : this.result.pstatus ? this.result.pstatus.toString() : '0',
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pgroup" : this.result.pgroup ? this.result.pgroup.toString() : '',
        "pcondition" : this.result.pcondition ? this.result.pcondition.toString() : '',
        "ptitle" : this.result.ptitle ? this.result.ptitle.toString() : '',
       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    changeCaseType(caseType:any){
      this.selCaseType = caseType;
    }



}






