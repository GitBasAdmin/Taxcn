import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component';

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
  selector: 'app-prci1900,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prci1900.component.html',
  styleUrls: ['./prci1900.component.css']
})


export class Prci1900Component implements AfterViewInit, OnInit, OnDestroy {
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
  pid:any;
  pjudge_id:any;
  programName:any;
  getDep:any;
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
  getStatType:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListComponent: boolean = false;//popup ธรรมดา
  public loadModalJudgeComponent: boolean = false;//popup ผู้พิพากษา

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prci1900',{static: true}) prci1900 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
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
        this.getStatType = [{id:'1',text:'ผู้ประนอม'},{id:'2',text:'ผู้พิพากษา'}];
        this.result.pstat_type = '1';
}

tabChangeSelect(objName:any,objData:any,event:any,type:any){
  if(typeof objData!='undefined'){
    if(type==1){
      var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
    }else{
        var val = objData.filter((x:any) => x.fieldIdValue === event);
    }
    console.log(objData)
    //console.log(event.target.value)
    //console.log(val)
    if(val.length!=0){
      this.result[objName] = val[0].fieldIdValue;
      this[objName] = val[0].fieldIdValue;
    }else{
      this.result[objName] = null;
      this[objName] = null;
    }
  }else{
    this.result[objName] = null;
    this[objName] = null;
  }
}

changeContentType(val:any){
  this.result.pid = '';
  this.result.pstat_name = '';  
}



  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prci1900"
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

      var rptName = 'rci1900';


      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
      if(this.result.pstat_type==1){
       var paramData = JSON.stringify({
         "pdate_start" : myExtObject.conDate(this.result.txtStartDate),
         "pdate_end" : myExtObject.conDate(this.result.txtEndDate),
         "pid" : this.result.pid,
         "pjudge_id" : '',
         "pstat_type" : this.result.pstat_type,
       });
      }else{
        var paramData = JSON.stringify({
          "pdate_start" : myExtObject.conDate(this.result.txtStartDate),
          "pdate_end" : myExtObject.conDate(this.result.txtEndDate),
          "pid" : '',
          "pjudge_id" : this.result.pid,
          "pstat_type" : this.result.pstat_type,
        });
      }
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    changeCaseType(caseType:any){
       this.selCaseType = caseType;
     }

    tabChangeInput(name:any,event:any){
      if(this.result.pstat_type==1){
        var student = JSON.stringify({
          "table_name" : "pconciliate",
          "field_id" : "conciliate_id",
          "field_name" : "conciliate_name",
          "condition" : " AND conciliate_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.pstat_name = productsJson[0].fieldNameValue;
          }else{
            this.result.pid = '';
            this.result.pstat_name = '';
          }
          },
          (error) => {}
        )
      }else if(this.result.pstat_type==2){
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.pstat_name = productsJson[0].fieldNameValue;
          }else{
            this.result.pstat_id = '';
            this.result.pstat_name = '';
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
      if(this.modalType==1){
        $("#exampleModal").find(".modal-content").css("width","800px");
        var student = JSON.stringify({
          "table_name" : "pconciliate",
          "field_id" : "conciliate_id",
          "field_name" : "conciliate_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pconciliate';
        this.listFieldId='conciliate_id';
        this.listFieldName='conciliate_name';
        this.listFieldNull='';

        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
              // this.loadModalListComponent = true;
              // this.loadModalJudgeComponent = false;
            
              const modalRef = this.ngbModal.open(DatalistReturnComponent,{ size: 'lg', backdrop: 'static' })
              modalRef.componentInstance.items = this.list
              modalRef.componentInstance.value1 = "pconciliate"
              modalRef.componentInstance.value2 = "conciliate_id"
              modalRef.componentInstance.value3 = "conciliate_name"
              modalRef.componentInstance.types = "1"

              modalRef.result.then((item: any) => {
                if(item){
                  this.result.pid=item.fieldIdValue;
                  this.result.pstat_name=item.fieldNameValue;
                }
              })
          },
          (error) => {}
        )

      }else if(this.modalType==2){
        var student = JSON.stringify({
          "cond":2,
          "userToken" : this.userData.userToken});
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldNull='';
        this.listFieldType=JSON.stringify({"type":2});
        this.loadModalListComponent = false;
        this.loadModalJudgeComponent = true;
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
          (response) =>{
           let productsJson : any = JSON.parse(JSON.stringify(response));
           if(productsJson.data.length){
             this.list = productsJson.data;
             console.log(this.list)
           }else{
             this.list = [];
           }

           const modalRef: NgbModalRef = this.ngbModal.open(ModalJudgeComponent,{ size: 'lg', backdrop: 'static' })
            modalRef.componentInstance.value1 = "pjudge"
            modalRef.componentInstance.value2 = "judge_id"
            modalRef.componentInstance.value3 = "judge_name"
            modalRef.componentInstance.value4 = ''
            modalRef.componentInstance.types = "1"
            modalRef.componentInstance.value5 = JSON.stringify({"type":1})

            modalRef.result.then((item: any) => {
              if(item) {
                this.result.pid=item.judge_id;
              this.result.pstat_name=item.judge_name;
            }
          }).catch((error: any) => {
            console.log(error)
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
        this.result.pid=event.fieldIdValue;
        this.result.pstat_name=event.fieldNameValue;
      }
      this.closebutton.nativeElement.click();
    }
    receiveJudgeListData(event:any){
      this.result.pid=event.judge_id;
      this.result.pstat_name=event.judge_name;
      this.closebutton.nativeElement.click();
    }
    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }


}






