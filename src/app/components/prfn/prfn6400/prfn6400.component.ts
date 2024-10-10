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
  selector: 'app-prfn6400,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prfn6400.component.html',
  styleUrls: ['./prfn6400.component.css']
})

export class Prfn6400Component implements AfterViewInit, OnInit, OnDestroy {
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
  dep_id:any;
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
  getCaseType:any;
  selCaseType:any;
  selCaseId:any;
  pguar_title:any;
  getPgroupId:any;
  getRcvFlag:any;
  pflag:any="";
  getFlag:any;
  pprint:any="";
  pprint_by:any;
  getPprint_by:any;
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

  @ViewChild('prfn6400',{static: true}) prfn6400 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
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
      },
      (error) => {}
    )

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
      this.result.preceipt_type_id = 0;
      this.changeRcvFlag(this.result.preceipt_type_id);
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
    },
    (error) => {}
  )
  this.getFlag = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'ศาลนี้'},{id:'2',text:'ศาลอื่น'}];
  this.getPprint_by = [{id:'1',text:'PDF'},{id:'3',text:'Excel'}];
  this.result.pflag = '0';
  this.pprint_by = '1';
  this.result.ptoday = this.result.ptoday = myExtObject.curDate();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prfn6400"
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
      });
  }

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
      if(name=='pdep_code'){
        var student = JSON.stringify({
          "table_name" : "pdepartment",
          "field_id" : "dep_code",
          "field_name" : "dep_name",
          "condition" : " AND dep_code='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.length){
              this.result.dep_name = productsJson[0].fieldNameValue;
            }else{
              this.result.pdep_code = '';
              this.result.dep_name = '';
            }
            },
            (error) => {}
          )
      }else if(name=='pdep_code2'){
        var student = JSON.stringify({
          "table_name" : "pdepartment",
          "field_id" : "dep_code",
          "field_name" : "dep_name",
          "condition" : " AND dep_code='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.length){
              this.result.dep_name2 = productsJson[0].fieldNameValue;
            }else{
              this.result.pdep_code2 = '';
              this.result.dep_name2 = '';
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

    changeCaseType(caseType:any){
      this.selCaseType = caseType;
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
          },
          (error) => {}
        )
      });
      return promise;
      }

      closeModal(){
        this.loadModalListComponent = false;
      }

      loadMyModalComponent(){
        $(".modal-backdrop").remove();
        if(this.modalType==1){
          $("#exampleModal").find(".modal-content").css("width","800px");
          var student = JSON.stringify({
            "table_name" : "pdepartment",
            "field_id" : "dep_code",
            "field_name" : "dep_name",
            "search_id" : "",
            "search_desc" : "",
            "userToken" : this.userData.userToken});
          this.listTable='pdepartment';
          this.listFieldId='dep_code';
          this.listFieldName='dep_name';
          this.listFieldNull='';
  
          this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
            (response) =>{
              console.log(response)
              this.list = response;
                this.loadModalListComponent = true;
            },
            (error) => {}
          )
  
        }else if(this.modalType==2){
          var student = JSON.stringify({
            "table_name" : "pdepartment",
            "field_id" : "dep_code",
            "field_name" : "dep_name",
            "search_id" : "",
            "search_desc" : "",
            "userToken" : this.userData.userToken});
          this.listTable='pdepartment';
          this.listFieldId='dep_code';
          this.listFieldName='dep_name';
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

  receiveFuncListData(event:any){
        console.log(event)
        if(this.modalType==1){
          this.result.pdep_code=event.fieldIdValue;
          this.result.dep_name=event.fieldNameValue;
        }else if(this.modalType==2){
          this.result.pdep_code2=event.fieldIdValue;
          this.result.dep_name2=event.fieldNameValue;
        }this.closebutton.nativeElement.click();
  }

  printReport(type:any){
    var psize=0;
    if(type==1){//พิมพ์รายงาน
      psize=1;
      // var rptName = 'rud0500';
    }else if(type==2){//พิมพ์รายงาน (แบบย่อ)
      psize=2;
    }
    var rptName = 'rfn6400';
      // For no parameter : paramData ='{}'
    var paramData ='{}';
      // For set parameter to report
    var paramData = JSON.stringify({
      //"pcase_type" : this.selCaseType,

        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',

        "pprint" : this.result.pprint==true ? '1': '0',

        "preceipt_type_id" : this.result.preceipt_type_id ? this.result.preceipt_type_id.toString() : '',
        "pgroup_id" : this.result.pgroup_id ? this.result.pgroup_id.toString() : '',

        "pdep_code" : this.result.pdep_code ? this.result.pdep_code.toString() : '',

        "pflag" : this.result.pflag ? this.result.pflag.toString() : '',

        "ptoday" : this.result.ptoday ? myExtObject.conDate(this.result.ptoday) : '',

        'psize' : type.toString(),
       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
  }

}






