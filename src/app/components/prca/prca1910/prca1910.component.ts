import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'app-prca1910,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prca1910.component.html',
  styleUrls: ['./prca1910.component.css']
})


export class Prca1910Component implements AfterViewInit, OnInit, OnDestroy {
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
  case_type:any;
  case_type_stat:any;
  getCaseTypeStat:any;
  getTitle:any;
  s_id:any;
  e_id:any;
  yy:any;
  pcheck:any;
  pcontent_type:any;
  getContentType:any;
  dep_id:any;
  result:any = [];
  getDep:any;
  getRedTitle:any;
  getCaseCate:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prca1910',{static: true}) prca1910 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;

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
      "case_type" : this.case_type,
      "case_type_stat" : this.case_type_stat,
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
    this.getContentType = [{id:'2',text:'หมายเลขคดี'},{id:'1',text:'วันนัด'}];

//======================== pdepartment ======================================
var student = JSON.stringify({
  "table_name" : "pdepartment",
  "field_id" : "dep_code",
  "field_name" : "dep_name",
  "field_name2" : "print_dep_name",
  "userToken" : this.userData.userToken
});
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getDep = getDataOptions;
    this.getDep.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
    console.log(this.getDep)
    // var Dep = this.getDep.filter((x:any) => x.fieldIdValue === this.userData.depCode.toString()) ;
    // if(Dep.length!=0){
    //   this.result.dep_id = this.dep_id = Dep[0].fieldIdValue;
    // }
  },
  (error) => {}
)
this.result.pcontent_type = '2';
this.result.pcheck = 1;
this.result.yy = myExtObject.curYear();

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
    // alert(val)
   if(val=='1'){
    //  alert('xxxx');
    setTimeout(() => {
      myExtObject.callCalendarSet('date_start');
      myExtObject.callCalendarSet('date_end');
     }, 200);
    this.result.title = '';
    this.result.s_id = '';
    this.result.e_id = '';
    this.result.yy = '';
   }else{
    this.result.date_start = '';
    this.result.date_end = '';
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
      "url_name" : "prca1910"
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


    // changeCaseType(caseType:any){
    //   this.selCaseType = caseType;
    // }

    changeCaseTypeStat(caseType:number,type:any){
      this.case_type_stat = '';
     var student = JSON.stringify({
       "table_name": "pcase_type_stat",
       "field_id": "case_type_stat",
       "field_name": "case_type_stat_desc",
       "field_name2": "display_column",
       "condition": " AND case_type="+caseType,
       "order_by":" order_id ASC",
       "userToken" : this.userData.userToken
     });
     console.log("fCaseTypeStat :"+student)
     let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
     let promise = new Promise((resolve, reject) => {
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
       (response) =>{
         let getDataOptions : any = JSON.parse(JSON.stringify(response));
         this.getCaseTypeStat = getDataOptions;
         if(type>0)
           this.case_type_stat = type;
         //this.fDefCaseStat(caseType,title);
       },
       (error) => {}
     )
     });
     return promise;
   }

   changeCaseType(val:any){
    //========================== ptitle ====================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='"+val+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='2' AND case_type='"+val+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    var student3 = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "condition": "AND case_type='"+val+"'",
      "order_by": " case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    //console.log("fCaseTitle")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getTitle = getDataOptions;
          //this.selTitle = this.fca0200Service.defaultTitle;
        },
        (error) => {}
      )

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getRedTitle = getDataOptions;
        },
        (error) => {}
      )

       this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student3 , {headers:headers}).subscribe(
        (response) =>{
         let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
     },
         (error) => {}
       )

    });
    return promise;
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
          if(type>0)
            this.title = type;
          //this.fDefCaseStat(caseType,title);
        },
        (error) => {}
      )
      });
      return promise;
    }

    CheckNull(obj:any){
      if(typeof(obj==='undefined')){
           obj = null;
      }
    }

    printReport(type:any){

      var rptName = 'rca1910';

      if(typeof(this.result.title)=='undefined'){
        this.result.title = '';
      }

      if(typeof(this.result.s_id)=='undefined'){
        this.result.s_id = '';
      }

      if(typeof(this.result.e_id)=='undefined'){
        this.result.e_id = '';
      }

      if(typeof(this.result.yy)=='undefined'){
        this.result.yy = '';
      }

      if(typeof(this.result.dep_id)=='undefined'){
        this.result.dep_id = '';
      }

      if(typeof(this.result.case_type)=='undefined'){
        this.result.case_type = '';
      }

      if(typeof($("#txt_date_start").val())=='undefined'){
        this.result.date_start = '';
      }else{
        this.result.date_start = myExtObject.conDate($("#txt_date_start").val());
      }

      if(typeof($("#txt_date_end").val())=='undefined'){
        this.result.date_end = '';
      }else{
        this.result.date_end = myExtObject.conDate($("#txt_date_end").val());
      }

      // if(this.pcheck==true){
      //   this.pcheck='1';
      // }else{
      //   this.pcheck='0';}
      // For no parameter : paramData ='{}'
      var paramData ='{}';
      var paramData2 = '{}';
          // For set parameter to report

        var paramData = JSON.stringify({
          "ptype" : this.result.pcontent_type ? this.result.pcontent_type.toString() : '',
          "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
          "pdate_start" : this.result.date_start,
          "pdate_end"   : this.result.date_end,
          "pdep_code" : this.result.dep_id ? this.result.dep_id.toString() : '',
          "ptitle" : this.result.title ? this.result.title.toString() : '',
          "pid_start" : this.result.s_id ? this.result.s_id.toString() : '',
          "pid_end" : this.result.e_id ? this.result.e_id.toString() : '',
          "pyear" : this.result.yy ? this.result.yy.toString() : '',
          "pflag_nored" : this.result.pcheck==true ? '1': '0',
          // "pflag" : '',
          "ptype2" : type.toString(),
       });


       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

}






