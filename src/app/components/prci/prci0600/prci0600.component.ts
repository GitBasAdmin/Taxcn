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
  selector: 'app-prci0600,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prci0600.component.html',
  styleUrls: ['./prci0600.component.css']
})


export class Prci0600Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
  //form: FormGroup;
  ptitle = 'datatables';
  red_title = 'datatables';
  pcase_cate_id:any;

  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  dep_id:any;
  getTitle:any;
  getRedTitle:any;
  getCaseType:any;
  result:any = [];
  tmpResult:any = [];
  programName:any;
  getDep:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  selectedCasetype:any='แพ่ง';
  getCaseCate:any;
  selCaseType:any;
  selCaseId:any;
  pguar_title:any;
  getPgroupId:any;
  getRcvFlag:any;
  pcase_type_stat:any;
  getCaseTypeStat:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prci0600',{static: true}) prci0600 : ElementRef;
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
        this.result.chk = 1;

        //console.log(this.getCaseType)
        //console.log(this.userData.defaultCaseType)
        //console.log(this.selCaseType)
      },
      (error) => {}
    )
    //----------------------end pcase_type -------------------

       //======================== preceipt_type ======================================
var student = JSON.stringify({
  "table_name" : "preceipt_type",
  "field_id" : "receipt_type_id",
  "field_name" : "receipt_type_desc",
  "order_by": " receipt_type_id ASC",
  "userToken" : this.userData.userToken
});
//console.log(student)
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
  (response) =>{

    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getRcvFlag = getDataOptions;
    console.log(this.getRcvFlag);
    //this.result.rcv_flag = $("body").find("ng-select#rcv_flag span.ng-value-label").html();
    this.result.rcv_flag = 4;
    this.changeRcvFlag(this.result.rcv_flag);
    // this.result.pgroup_id = 1;
    // this.result.pdata_type = '0';
    // this.result.ptype = '0';
  },
  (error) => {}
)

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

  //======================== getCaseTypeStat======================================
var Json = JSON.stringify({
	"table_name" : "pcase_type_stat",
	"field_id" : "case_type_stat",
	"field_name" : "case_type_stat_desc",
	"userToken" : this.userData.userToken
});
console.log(Json);
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json ,
{headers:headers}).subscribe(
	(response) =>{console.log('xxxxxxxxxxx'+response);
		let getDataOptions : any = JSON.parse(JSON.stringify(response));
		this.getCaseTypeStat=getDataOptions;},
	(error) => {}
)
  }
  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prci0600"
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

      if(myExtObject.conDate($("#txt_date_start").val())=='' || myExtObject.conDate($("#txt_date_end").val())==''){
        alert('กรุณาระบุข้อมูลวันที่ให้ครบถ้วน');
        return(false);
      }

      var rptName = 'rci0600';


      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({

        "pdate_start" : myExtObject.conDate($("#txt_date_start").val()),
        "pdate_end" : myExtObject.conDate($("#txt_date_end").val()),
        "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
        "pcase_flag" : this.result.chk ? this.result.chk.toString() : '',
        "pcase_cate_id" : this.result.pcase_cate_id ? this.result.pcase_cate_id : '',
        "pcase_type_stat" : this.result.pcase_type_stat ? this.result.pcase_type_stat : '',
        "ptitle" : this.result.ptitle ? this.result.ptitle : '',
        "pred_title" : this.result.red_title ? this.result.red_title : '',
        });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    // changeCaseType(caseType:any){
    //   this.selCaseType = caseType;
    // }



    changeCaseType(val:any){
      //========================== ptitle ====================================
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": "AND title_flag='1' AND EXISTS(SELECT * FROM pcase_cate WHERE ptitle.case_cate_id=pcase_cate.case_cate_id AND pcase_cate.case_flag=1) AND case_type='"+val+"'",
        "order_by": " order_id ASC",
        "userToken" : this.userData.userToken
      });

      var student2 = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": "AND title_flag='2' AND EXISTS(SELECT * FROM pcase_cate WHERE ptitle.case_cate_id=pcase_cate.case_cate_id AND pcase_cate.case_flag=1) AND case_type='"+val+"'",
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

    changeRcvFlag(val:any){
      // alert(val);
      //========================== preceipt_map_group ====================================
      var student = JSON.stringify({
        "receipt_type_id": val,
        "userToken" : this.userData.userToken
      });

      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/getReceiptGroup', student , {headers:headers}).subscribe(
          (response) =>{
            //console.log(response);
            //console.log(JSON.stringify(response));
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions.data)
            for(var i=0;i<getDataOptions.data.length;i++){
              getDataOptions.data[i]['fieldIdValue'] = getDataOptions.data[i]['group_id'];
              delete getDataOptions.data[i]['group_id'];
              getDataOptions.data[i]['fieldNameValue'] = getDataOptions.data[i]['group_desc'];
              delete getDataOptions.data[i]['group_desc'];
             }
            this.getPgroupId = getDataOptions.data;
            if(val>=1){
              this.result.pgroup_id = this.getPgroupId[0].fieldIdValue;
            }else{
              this.result.pgroup_id = 0;
            }

            //this.MapGroup = (1,5,7);
            //alert(this.MapGroup);
            //this.selTitle = this.fca0200Service.defaultTitle;
          },
          (error) => {}
        )
      });
      return promise;
      }

}






