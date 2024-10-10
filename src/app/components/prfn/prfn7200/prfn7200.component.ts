import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { filter, takeUntil, takeWhile } from 'rxjs/operators';
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
  selector: 'app-prfn7200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prfn7200.component.html',
  styleUrls: ['./prfn7200.component.css']
})


export class Prfn7200Component implements AfterViewInit, OnInit, OnDestroy {
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
  getPgroupId:any;
  getRcvFlag:any;
  getPrintType:any;
  modalType:any;
  getPrintTypeName:any;

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

  @ViewChild('prfn7200',{static: true}) prfn7200 : ElementRef;
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
        // this.result.pgroup_id = 1;
        // this.result.pdata_type = '0';
        // this.result.ptype = '0';
      },
      (error) => {}
    )
    //this.getReceiptTypeId = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'ค่าธรรมเนียม'},{id:'2',text:'ค่าปรับ'},{id:'4',text:'เงินกลาง'},{id:'5',text:'เบ็ดเตล็ดอื่นๆ'}];
    
    this.getPrintType = [{id:'0',text:'พิมพ์รวม'},{id:'1',text:'พิมพ์แยกเลขอ้างอิง'}];
    this.getPrintTypeName = [{id:'0',text:'ผู้จัดทำ (ผู้พิมพ์)'},{id:'1',text:'ผู้ตรวจสอบ'}];
    this.setDefPage();
  }

  setDefPage(){
    this.result.pprint_type = '0';
    this.result.txtStartDate = this.result.txtStartDate = myExtObject.curDate();
    this.result.txtEndDate = this.result.txtEndDate = myExtObject.curDate();
    this.result.pprint_type_name = 'ผู้จัดทำ (ผู้พิมพ์)';

  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  tabChangeInput(name:any,event:any){
    if(name=='user_id'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.user_name = productsJson[0].fieldNameValue;
          }else{
            this.result.user_id = '';
            this.result.user_name = '';
          }
          },
          (error) => {}
        )
    }else if(name=='pprint_id2'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.length){
            this.result.pprint_name2 = productsJson[0].fieldNameValue;
          }else{
            this.result.pprint_id2 = '';
            this.result.pprint_name2 = '';
          }
          },
          (error) => {}
        )
    }else if(name=='pprint_id3'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.length){
            this.result.pprint_name3 = productsJson[0].fieldNameValue;
          }else{
            this.result.pprint_id3 = '';
            this.result.pprint_name3 = '';
          }
          },
          (error) => {}
        )
    }else if(name=='pprint_id3'){
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
      console.log(productsJson)
      if(productsJson.length){
      this.result.pprint_name3 = productsJson[0].fieldNameValue;
      }else{
      this.result.pprint_id3 = '';
      this.result.pprint_name3 = '';
      }
      },
      (error) => {}
      )
      }else if(name=='pprint_id4'){
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "condition" : " AND off_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.length){
              this.result.pprint_name4 = productsJson[0].fieldNameValue;
            }else{
              this.result.pprint_id4 = '';
              this.result.pprint_name4 = '';
            }
            },
            (error) => {}
          )
      }else if(name=='pprint_id4'){
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
        console.log(productsJson)
        if(productsJson.length){
        this.result.pprint_name4 = productsJson[0].fieldNameValue;
        }else{
        this.result.pprint_id4 = '';
        this.result.pprint_name4 = '';
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
    }if(this.modalType==4){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "search_id" : "",
      "search_desc" : "",
      "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='pjudge_id';
      this.listFieldName='pjudge_name';
      this.listFieldNull='';
      
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
      (response) =>{
      console.log(response)
      this.list = response;
      this.loadModalJudgeComponent = true;
      },
      (error) => {}
      )
    }if(this.modalType==5){
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
    }if(this.modalType==6){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "search_id" : "",
      "search_desc" : "",
      "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
      (response) =>{
      console.log(response)
      this.list = response;
      this.loadModalJudgeComponent = true;
      },
      (error) => {}
      )
    }
  }
  
  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.user_id=event.fieldIdValue;
      this.result.user_name=event.fieldNameValue;
    }else if(this.modalType==2){
      this.result.pprint_id2=event.fieldIdValue;
      this.result.pprint_name2=event.fieldNameValue;
    }else if(this.modalType==3){
      this.result.pprint_id3=event.fieldIdValue;
      this.result.pprint_name3=event.fieldNameValue;
    }else if(this.modalType==4){
      this.result.pprint_id3=event.fieldIdValue;
      this.result.pprint_name3=event.fieldNameValue;
    }else if(this.modalType==5){
      this.result.pprint_id4=event.fieldIdValue;
      this.result.pprint_name4=event.fieldNameValue;
    }else if(this.modalType==6){
      this.result.pprint_id4=event.fieldIdValue;
      this.result.pprint_name4=event.fieldNameValue;
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
      "url_name" : "prfn7200"
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

  changeCaseType(caseType:any){
    this.selCaseType = caseType;
  }

  printReport(type:any){

    if(type==1|| type==2 || type==3){
      var rptName = 'rfn7210';
      // For no parameter : paramData ='{}'
      var paramData ='{}';
      // For set parameter to report
      var paramData = JSON.stringify({
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "preceipt_type_id" : this.result.preceipt_type_id ? this.result.preceipt_type_id.toString() : '',
        "pgroup_id" : this.result.pgroup_id ? this.result.pgroup_id : '',
        "pprint_type" : this.result.pprint_type ? this.result.pprint_type.toString() : '',
        "pprint_type_name" : this.result.pprint_type_name ? this.result.pprint_type_name.toString() : '',
        "user_id" :this.result.puser_id ? this.result.puser_id : '',
        "user_name" :this.result.user_name ? this.result.user_name : '',
        "pprint_id1" :this.result.pprint_id1 ? this.result.pprint_id1 : '',
        "pprint_name1" :this.result.pprint_name1 ? this.result.pprint_name1 : '',
        "pprint_id2" :this.result.pprint_id2 ? this.result.pprint_id2 : '',
        "pprint_name2" :this.result.pprint_name2 ? this.result.pprint_name2 : '',
        "pprint_id3" :this.result.pprint_id3 ? this.result.pprint_id3 : '',
        "pprint_name3" :this.result.pprint_name3 ? this.result.pprint_name3 : '',
        "pprint_id4" :this.result.pprint_id4 ? this.result.pprint_id4 : '',
        "pprint_name4" :this.result.pprint_name4 ? this.result.pprint_name4 : '',
        "pprint_by" : this.result.pprint1 == true ? '0': '3',
        // "pprint2" : this.result.pprint2 == true ? '1': '0',
        // "pprint3" : this.result.pprint3 == true ? '1': '0',
        //"pprint_by" : this.result.pprint4 == true ? '1': '0',
      });

      console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }else if(type==4){
      var rptName = 'rfn7200';
      // For no parameter : paramData ='{}'
      var paramData ='{}';
      // For set parameter to report
      var paramData = JSON.stringify({
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "preceipt_type_id" : this.result.preceipt_type_id ? this.result.preceipt_type_id.toString() : '',
        "pgroup_id" : this.result.pgroup_id ? this.result.pgroup_id : '',
        "pprint_type" : this.result.pprint_type ? this.result.pprint_type.toString() : '',
        "pprint_type_name" : this.result.pprint_type_name ? this.result.pprint_type_name.toString() : '',
        "user_id" :this.result.puser_id ? this.result.puser_id : '',
        "user_name" :this.result.user_name ? this.result.user_name : '',
        "pprint_id1" :this.result.pprint_id1 ? this.result.pprint_id1 : '',
        "pprint_name1" :this.result.pprint_name1 ? this.result.pprint_name1 : '',
        "pprint_id2" :this.result.pprint_id2 ? this.result.pprint_id2 : '',
        "pprint_name2" :this.result.pprint_name2 ? this.result.pprint_name2 : '',
        "pprint_id3" :this.result.pprint_id3 ? this.result.pprint_id3 : '',
        "pprint_name3" :this.result.pprint_name3 ? this.result.pprint_name3 : '',
        "pprint_id4" :this.result.pprint_id4 ? this.result.pprint_id4 : '',
        "pprint_name4" :this.result.pprint_name4 ? this.result.pprint_name4 : '',
        // "pprint_by" : this.result.pprint1 == true ? '3': '0',
        // "pprint2" : this.result.pprint2 == true ? '1': '0',
        // "pprint3" : this.result.pprint3 == true ? '1': '0',
        "pprint_by" : this.result.pprint4 == true ? '0': '1',
      });

      console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }
  }

}






