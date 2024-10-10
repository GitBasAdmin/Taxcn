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
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalJudgeComponent } from '../../modal/modal-judge/modal-judge.component';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prst6400,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prst6400.component.html',
  styleUrls: ['./prst6400.component.css']
})


export class Prst6400Component implements AfterViewInit, OnInit, OnDestroy {
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
  public loadModalComponent : boolean = false;
  public loadModalJudgeComponent : boolean = false; //popup judge

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prst6400',{static: true}) prst6400 : ElementRef;
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
    //----------------------end pcase_type -------------------
  }



  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prst6400"
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
    
    tabChangeInput(name:any,event:any){
      if(name=='preport_judge_id'){
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
              this.result.preport_judge_name = productsJson[0].fieldNameValue;
            }else{
              this.result.preport_judge_id = '';
              this.result.preport_judge_name = '';
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

    loadMyModalComponent(){
      $(".modal-backdrop").remove();
      if(this.modalType==1){
        var student = JSON.stringify({
          "cond":2,
          "userToken" : this.userData.userToken});
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldNull='';
        this.listFieldType=JSON.stringify({"type":2});
  
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
          (response) =>{
            this.list = response;
            this.loadComponent = false;
            this.loadModalComponent = false; //password confirm
            this.loadModalJudgeComponent = true;
  
           let productsJson : any = JSON.parse(JSON.stringify(response));
           if(productsJson.data.length){
             this.list = productsJson.data;
           }else{
             this.list = [];
           }
          },
          (error) => {}
        )
      }
    }

    onOpenJudge = () => {
      const modalRef: NgbModalRef = this.ngbModal.open(ModalJudgeComponent,{ size: 'lg', backdrop: 'static' })
      modalRef.componentInstance.value1 = "pjudge"
      modalRef.componentInstance.value2 = "judge_id"
      modalRef.componentInstance.value3 = "judge_name"
      modalRef.componentInstance.value4 = ''
      modalRef.componentInstance.types = "1"
      modalRef.componentInstance.value5 = JSON.stringify({"type":2})

      modalRef.result.then((item: any) => {
        if(item) {
          this.result.preport_judge_id = item.judge_id;
          this.result.preport_judge_name = item.judge_name;
        }
      }).catch((error: any) => {
        console.log(error)
      })
    }

    receiveJudgeListData(event:any){
      this.result.preport_judge_id = event.judge_id;
      this.result.preport_judge_name = event.judge_name;
      this.closebutton.nativeElement.click();
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    assignReportChk(event:any){
      if(event==true){
        this.result.preport_judge_id = this.userData.headJudgeId;
        this.result.preport_judge_name = this.userData.headJudgeName;
        this.result.preport_judge_post = this.userData.headJudgePost;
      }else{
        this.result.preport_judge_id = '';
        this.result.preport_judge_name = '';
        this.result.preport_judge_post = '';
      }
    }

    receiveFuncListData(event:any){
      console.log(event)
      if(this.modalType==1){
        this.result.preport_judge_id=event.fieldIdValue;
        this.result.preport_judge_name=event.fieldNameValue;
      }

      this.closebutton.nativeElement.click();
    }

    closeModal(){
      this.loadModalJudgeComponent = false;
    }

    printReport(){

      var rptName = 'rst6400';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "pjudge_id" :this.result.preport_judge_id ? this.result.preport_judge_id : '',
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
       });

       console.log(paramData)
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    changeCaseType(caseType:any){
      this.selCaseType = caseType;
    }



}






