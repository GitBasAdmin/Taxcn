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
  selector: 'app-prfn6100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prfn6100.component.html',
  styleUrls: ['./prfn6100.component.css']
})


export class Prfn6100Component implements AfterViewInit, OnInit, OnDestroy {
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
  getPprintBy:any;
  getReceiptTypeId:any;
  getGroupId:any;
  modalType:any;

  getPgroupId:any;
  getRcvFlag:any;

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

  @ViewChild('prfn6100',{static: true}) prfn6100 : ElementRef;
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
    //----------------------end pcase_type -------------------
    this.getPprintBy = [{id:'1',text:'PDF'},{id:'3',text:'Excel'}];
    //this.getReceiptTypeId = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'ค่าธรรมเนียม'},{id:'2',text:'ค่าปรับ'},{id:'4',text:'เงินกลาง'},{id:'5',text:'เบ็ดเตล็ดอื่นๆ'}];
    //this.getGroupId = [];
    
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
    this.result.preceipt_type_id = 4;
    this.changeRcvFlag(this.result.preceipt_type_id);
    // this.result.pgroup_id = 1;
    // this.result.pdata_type = '0';
    // this.result.ptype = '0';
    },
    (error) => {}
)


    this.setDefPage();
  }

  setDefPage(){
    this.result.pprint_by = '1';
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  tabChangeInput(name:any,event:any){
    if(name=='pcreate_user_id'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.off_name = productsJson[0].fieldNameValue;
          }else{
            this.result.pcreate_user_id = '';
            this.result.off_name = '';
          }
          },
          (error) => {}
        )
    }else if(name=='poff_id'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.poff_name = productsJson[0].fieldNameValue;
            this.getPost(productsJson[0].fieldNameValue2,2);
          }else{
            this.result.poff_id = '';
            this.result.poff_name = '';
          }
          },
          (error) => {}
        )
    }else if(name=='psign_id'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.psign_name = productsJson[0].fieldNameValue;
            this.getPost(productsJson[0].fieldNameValue2,3);
          }else{
            this.result.psign_id = '';
            this.result.psign_name = '';
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

  closeModal(){
    this.loadModalListComponent = false;
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pofficer';
      this.listFieldId='off_id';
      this.listFieldName='off_name';
      this.listFieldName2='post_id';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            this.loadModalListComponent = true;
        },
        (error) => {}
      )
    }if(this.modalType==2){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pofficer';
      this.listFieldId='off_id';
      this.listFieldName='off_name';
      this.listFieldName2='post_id';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            this.loadModalListComponent = true;
        },
        (error) => {}
      )
    }if(this.modalType==3){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pofficer';
      this.listFieldId='off_id';
      this.listFieldName='off_name';
      this.listFieldName2='post_id';
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
      this.result.pcreate_user_id=event.fieldIdValue;
      this.result.off_name=event.fieldNameValue;
    }else if(this.modalType==2){
      this.result.poff_id=event.fieldIdValue;
      this.result.poff_name=event.fieldNameValue;
      this.getPost(event.fieldNameValue2,this.modalType);
    }else if(this.modalType==3){
      this.result.psign_id=event.fieldIdValue;
      this.result.psign_name=event.fieldNameValue;
      this.getPost(event.fieldNameValue2,this.modalType);
    }

    this.closebutton.nativeElement.click();
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
          // if(productsJson.length){
          //   this.result.post_name = productsJson[0].fieldNameValue;
          //   //ตรงนี้เมื่อต้องตาเพิ่มตำแหน่งใน form แล้ว เปลี่ยนชื่อให้ตรง
          // }else{
          //   this.result.post_name = '';
          //   //ตรงนี้เมื่อต้องตาเพิ่มตำแหน่งใน form แล้ว เปลี่ยนชื่อให้ตรง
          // }
          if(productsJson.length){
            if(modalType==2)
              this.result.post_name = productsJson[0].fieldNameValue;
            else if (modalType==3)
              this.result.psign_post = productsJson[0].fieldNameValue;
          }else{
            if(modalType==2)
              this.result.post_name = '';
            else if (modalType==3)
              this.result.psign_post = '';
          }
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
      "url_name" : "prfn6100"
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
this.selCaseType = caseType;
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

  printReport(){
    var rptName = 'rfn6100';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "psub_type_id" : this.result.psub_type_id ? this.result.psub_type_id.toString() : '',
      "pprint_by" : this.result.pprint_by ? this.result.pprint_by.toString() : '',
      "preceipt_type_id" : this.result.preceipt_type_id ? this.result.preceipt_type_id.toString() : '',
      "pgroup_id" : this.result.pgroup_id ? this.result.pgroup_id.toString() : '',
      "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
      "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',

      "pcreate_user_id" : this.result.pcreate_user_id ? this.result.pcreate_user_id.toString() : '',
      "off_name" : this.result.off_name ? this.result.off_name.toString() : '',

      "poff_id" : this.result.poff_id ? this.result.poff_id.toString() : '',
      "poff_name" : this.result.poff_name ? this.result.poff_name.toString() : '',
      "poff_post" : this.result.post_name ? this.result.post_name.toString() : '',
      
      "psign_id" : this.result.psign_id ? this.result.psign_id.toString() : '',
      "psign_name" : this.result.psign_name ? this.result.psign_name.toString() : '',
      "psign_post" : this.result.psign_post ? this.result.psign_post.toString() : '',
    
      
    });
    console.log(paramData);
    // alert(paramData);return false;
    this.printReportService.printReport(rptName,paramData);
    }
}






