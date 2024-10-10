import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { ModalMaterialComponent } from '@app/components/fdo/modal/modal-material/modal-material.component';

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
import { CaseService,Case } from 'src/app/services/case.service.ts';
// import { analyzeAndValidateNgModules } from '@angular/compiler';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;
import {
  CanDeactivate, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
}from '@angular/router'

@Component({
  selector: 'app-prdo1600,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prdo1600.component.html',
  styleUrls: ['./prdo1600.component.css']
})


export class Prdo1600Component implements AfterViewInit, OnInit, OnDestroy {
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
  getCaseTitle:any;
  s_id:any;
  yy:any;
  result:any = [];
  hResult:any = [];
  prosObj:any = [];
  accuObj:any = [];
  runIdObj:any;
  run_id:any;
  

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

  @ViewChild('prdo1600',{static: true}) prdo1600 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;
  @ViewChild('s_id',{static: true}) numGenCase : ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService,
    private caseService:CaseService,
    private ngbModal: NgbModal,
    private activatedRoute : ActivatedRoute,
    private route: ActivatedRoute,
  ){  }

  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //this.asyncObservable = this.makeObservable('Async Observable');
    this.successHttp();

    this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id']){
        this.run_id = params['run_id'];
        this.hResult.run_id = params['run_id'];

        this.searchCaseNo(3);
      }
    });

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

    var student = JSON.stringify({
      "table_name" : "pmaterial_title",
      "field_id" : "case_title",
      "field_name" : "case_title",
      "order_by" : "case_title_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseTitle = getDataOptions;
      },
      (error) => {}
    )
    //----------------------end pcase_type -------------------
    // this.result.papp_date = this.result.papp_date = myExtObject.curDate();
  }

  
  tabChangeInput(name:any,event:any){
    if(name=='pdep_code'){
      var student = JSON.stringify({
        "table_name" : "pmaterial_cover",
        "field_id" : "mat_cover_id",
        "field_name" : "mat_cover_name",
        // "condition" : " AND dep_code='"+event.target.value+"'",
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
            this.result.premark = '';
          }
          },
          (error) => {}
        )
    }
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.loadMyModalComponent();
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pmaterial_cover",
        "field_id" : "mat_cover_id",
        "field_name" : "mat_cover_name",
        "search_id" : "",
        "search_desc" : "",
        //"condition" : " AND dep_code='"+this.userData.depCode+"'",
        "userToken" : this.userData.userToken});
      this.listTable='pmaterial_cover';
      this.listFieldId='mat_cover_id';
      this.listFieldName='mat_cover_name';
      this.listFieldNull='';
      this.listFieldCond="";

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            //this.loadModalListComponent = true;
            const modalRef = this.ngbModal.open(DatalistReturnComponent,{ size: 'lg', backdrop: 'static' })
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "pmaterial_cover"
            modalRef.componentInstance.value2 = "mat_cover_id"
            modalRef.componentInstance.value3 = "mat_cover_name"
            modalRef.componentInstance.types = "1"

            modalRef.result.then((item: any) => {
              if(item){
                this.result.pdep_code=item.fieldIdValue;
                this.result.premark=item.fieldNameValue;
                
              }
            })
        },
        (error) => {}
      )
    }
  }

  onOpenMaterial = () => {
    const modalRef = this.ngbModal.open(ModalMaterialComponent,{ size: 'lg', backdrop: 'static' })
    modalRef.componentInstance.run_id = this.hResult.run_id
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if(item){
        console.log(item)
        this.result.premark = item.receipt_from;
        this.result.pdetail2 = item.lit_type_desc;
        this.result.pdetail1 = item.doc_no;
        this.result.ppage = item.page_no;
      }
    }).catch((error: any) => {
    })
  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.pdep_code=event.fieldIdValue;
      this.result.premark=event.fieldNameValue;
    }this.closebutton.nativeElement.click();
  }

  closeModal(){
    this.loadModalListComponent = false;
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prdo1600"
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


  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.hResult.id && !this.hResult.yy){
      confirmBox.setMessage('กรุณาระบุเลขที่คดีให้ครบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.result.setFocus('s_id');
        }
        subscription.unsubscribe();
      });

    }else{
      this.printReport;
    }

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
      this.selCaseType = caseType;
    }

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
        },
        (error) => {}
      )
      });
      return promise;
    }

    async searchCaseNo(type: any): Promise<void> {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var objCase = [];
      if (type == 1) {
        objCase["type"] = 1;
        objCase["case_type"] = this.hResult.case_type;
        objCase["title"] = this.hResult.title;
        objCase["id"] = this.hResult.id;
        objCase["yy"] = this.hResult.yy;
        const cars = await this.caseService.searchCaseNo(objCase);
        console.log(cars)
        if (cars) {
          if (cars['result'] == 1) {
            this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
            this.hResult.txtPros = this.hResult.pros_desc;
            this.hResult.txtAccu = this.hResult.accu_desc;
            this.getMaterial();
            console.log(this.hResult.run_id)
            //if (!this.hResult.red_title)
            //  this.hResult.red_title = this.userData.defaultRedTitle;
            //if (this.result.run_seq && this.hResult.run_id)
              //this.btnSaveCase();
            this.hResult.caseEvent = 1;//ค้นข้อมูล
          } else {
            confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                //this.btnSaveCase();
              }
              subscription.unsubscribe();
            });
          }
        }
      }else if(type==3){
        objCase["type"] = 3;
        objCase["run_id"] = this.hResult.run_id;
        objCase["all_data"] = 1;
        objCase["getJudgement"] = 1;
        const cars = await this.caseService.searchCaseNo(objCase);
        // console.log(cars)
        if(cars['result']==1){
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
          this.hResult.txtPros = this.hResult.pros_desc;
          this.hResult.txtAccu = this.hResult.accu_desc;
          this.getMaterial();
          //if(!this.hResult.red_title)
           // this.hResult.red_title = this.userData.defaultRedTitle;
          //if(!this.hResult.red_yy)
            //this.hResult.red_yy = myExtObject.curYear();
          //this.fCaseType();
          this.hResult.caseEvent = 1;//ค้นข้อมูล
          //this.sendCaseData.emit(this.hResult);
        }else{
          confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              //this.setDefHead();
            }
            subscription.unsubscribe();
          });
        }
      }
    }

    getMaterial(){
      var student = JSON.stringify({
        "run_id":this.hResult.run_id,
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiDO/API/KEEPB/fdo0100/getMaterial', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions);

          var data =getDataOptions.result;
          console.log(data);
          this.result.case_title=data.meterial.case_title;
          this.result.case_id=data.meterial.case_id;
          this.result.case_yy=data.meterial.case_yy;
        },
        (error) => {}
      );
    }

    searchMaterial(){
      var student = JSON.stringify({
        "case_id":this.result.case_id,
        "case_title":this.result.case_title,
        "case_yy":this.result.case_yy,
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiDO/API/KEEPB/fdo0100/searchMaterial', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions);

          var data =getDataOptions.result;
          console.log(data);
          this.result.material_running=data.meterial.material_running;
          this.hResult.run_id=data.meterial.run_id;
          this.searchCaseNo(3);
        },
        (error) => {}
      );
    }


    printReport(pprint:any){
      var rptName = 'rdo1600';
      if(typeof(this.hResult.title)=='undefined'){
        this.hResult.title = '';
      }
      if(typeof(this.hResult.id)=='undefined'){
        this.hResult.id = '';
      }
      if(typeof(this.hResult.yy)=='undefined'){
        this.hResult.yy = '';
      }
      // For no parameter : paramData ='{}'
      var paramData ='{}';
      // For set parameter to report
       var paramData = JSON.stringify({
        "case_type" : this.hResult.case_type ? this.hResult.case_type.toString() : '',
        "title" : this.hResult.title ? this.hResult.title.toString() : '',
        "prun_id" : this.hResult.run_id ? this.hResult.run_id.toString() : '',
        "yy" : this.hResult.yy ? this.hResult.yy.toString() : '',
        "txtPros" : this.hResult.txtPros ? this.hResult.txtPros.toString() : '',
        "txtAccu" : this.hResult.txtAccu ? this.hResult.txtAccu.toString() : '',
        "case_title" : this.result.case_title ? this.result.case_title.toString() : '',
        "case_id" : this.result.case_id ? this.result.case_id.toString() : '',
        "case_yy" : this.result.case_yy ? this.result.case_yy.toString() : '',
        "ppage" : this.result.ppage ? this.result.ppage.toString() : '',
        "premark" : this.result.premark ? this.result.premark.toString() : '',
        "premark1" : this.result.premark1 ? this.result.premark1.toString() : '',
        "premark2" : this.result.premark2 ? this.result.premark2.toString() : '',
        "pdetail1" : this.result.pdetail1 ? this.result.pdetail1.toString() : '',
        "pdetail2" : this.result.pdetail2 ? this.result.pdetail2.toString() : '',
        "papp_date" : this.result.papp_date ? myExtObject.conDate(this.result.papp_date) : '',
        "pprint" : pprint.toString(),
       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

}






