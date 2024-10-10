import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit  } from '@angular/core';
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
  selector: 'app-prsn1100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prsn1100.component.html',
  styleUrls: ['./prsn1100.component.css']
})


export class Prsn1100Component implements AfterViewInit, OnInit, OnDestroy ,AfterContentInit{
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
  getCaseType:any;
  selCaseType:any;
  selCaseId:any;
  getProv:any;
  getAmphur:any;

  result:any = [];
  modalType:any;
  getFlag:any;
  getType:any;
  getNoMoney:any;
  getInoutFlag:any;
  getSendBy:any;
  getSendAmt:any;
  getPrintFlag:any;
  getOrder2:any;

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

  @ViewChild('prsn1100',{static: true}) prsn1100 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;

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
    //======================== pprovince ======================================
    var student = JSON.stringify({
      "table_name" : "pprovince",
      "field_id" : "prov_id",
      "field_name" : "prov_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        this.getProv = getDataOptions;
      },
      (error) => {}
    )
    //----------------------end pcase_type -------------------
    
    this.getFlag = [{id:'1',text:'วันที่จ่ายหมาย'},{id:'2',text:'วันที่จ่ายให้ผู้เดินหมาย'},{id:'3',text:'วันที่บันทึกผลหมาย'}];
    this.getType = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'ยังไม่รายงานผล'},{id:'2',text:'รายงานผลแล้ว'}];
    this.getNoMoney = [{id:'0',text:'ทัั้งหมด'},{id:'1',text:'หมายศาล'},{id:'2',text:'หมายนำ'}];
    this.getInoutFlag = [{id:'0',text:'ทัั้งหมด'},{id:'1',text:'หมายในเขต'},{id:'2',text:'หมายข้ามเขต'}];
    this.getSendBy = [{id:'0',text:'ทัั้งหมด'},{id:'1',text:'ไปรษณีย์'},{id:'2',text:'เจ้าหน้าที่'},{id:'3',text:'คู่ความส่งเอง'},{id:'4',text:'หนังสือนำส่ง'}];
    this.getSendAmt = [{id:'0',text:'ทัั้งหมด'},{id:'1',text:'เฉพาะมีค่านำหมาย'}];
    this.getPrintFlag = [{id:'1',text:'1.ผู้รับหมาย'},{id:'2',text:'2.ผู้เดินหมาย'}];
    this.getOrder2 = [{id:'1',text:'จังหวัด/อำเภอ'},{id:'2',text:'เลขคดีดำ'}];
    
  }

  setDefPage(){
    this.result = [];
    //this.result.txtStartDate = this.result.txtStartDate = myExtObject.curDate();
    //this.result.txtEndDate = this.result.txtEndDate = myExtObject.curDate();
    this.result.pflag = '1';
    this.result.ptype = '0';
    this.result.pno_money = '0';
    this.result.pinout_flag = '0';
    this.result.psend_by = '0';
    this.result.psend_amt = '0';
    this.result.pprint_flag = '1';
    this.result.porder2 = '1';
    this.result.pcase_type = this.userData.defaultCaseType;
  }

  tabChangeInput(name:any,event:any){
    if(name=='prov_id'){
    var student = JSON.stringify({
    "table_name" : "pprovince",
    "field_id" : "prov_id",
    "field_name" : "prov_name",
    "condition" : " AND prov_id='"+event.target.value+"'",
    "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
    (response) =>{
    let productsJson : any = JSON.parse(JSON.stringify(response));
    console.log(productsJson)
    if(productsJson.length){
    this.result.prov_name = productsJson[0].fieldNameValue;
    }else{
    this.result.prov_id = '';
    this.result.prov_name = '';
    }
    },
    (error) => {}
    )
    }else if(name=='amphur_id'){
      var student = JSON.stringify({
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "condition" : " AND amphur_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
      let productsJson : any = JSON.parse(JSON.stringify(response));
      console.log(productsJson)
      if(productsJson.length){
      this.result.amphur_name = productsJson[0].fieldNameValue;
      }else{
      this.result.amphur_id = '';
      this.result.amphur_name = '';
      }
      },
      (error) => {}
      )
      }else if(name=='prcv_off_id'){ //ผู้รับหมาย
        var student = JSON.stringify({
        "table_name" : "psentnotice_officer",
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
        this.result.rcvuser_name = productsJson[0].fieldNameValue;
        }else{
        this.result.prcv_off_id = '';
        this.result.rcvuser_name = '';
        }
        },
        (error) => {}
        )
        }else if(name=='user_id'){ //ผู้เดินหมาย
          var student = JSON.stringify({
          "table_name" : "psentnotice_officer",
          "field_id" : "user_id",
          "field_name" : "user_name",
          "condition" : " AND user_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
          });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.length){
          this.result.user_name = productsJson[0].fieldNameValue;
          }else{
          this.result.user_id = '';
          this.result.user_name = '';
          }
          },
          (error) => {}
          )
          }else if(name=='puser_send_id'){ //ผู้จ่ายหมาย
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
            this.result.puser_send_name = productsJson[0].fieldNameValue;
            }else{
            this.result.puser_send_id = '';
            this.result.puser_send_name = '';
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
    "table_name" : "pprovince",
    "field_id" : "prov_id",
    "field_name" : "prov_name",
    "search_id" : "",
    "search_desc" : "",
    "userToken" : this.userData.userToken});
    this.listTable='pprovince';
    this.listFieldId='prov_id';
    this.listFieldName='prov_name';
    this.listFieldNull='';
    this.listFieldCond="";
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
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "search_id" : "",
      "search_desc" : "",
      "userToken" : this.userData.userToken});
      this.listTable='pamphur';
      this.listFieldId='amphur_id';
      this.listFieldName='amphur_name';
      this.listFieldNull='';
      this.listFieldCond="";
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
      (response) =>{
      console.log(response)
      this.list = response;
      this.loadModalListComponent = true;
      },
      (error) => {}
      )
  //ผู้รับหมาย
      }if(this.modalType==3 || this.modalType==4){
        $("#exampleModal").find(".modal-content").css("width","800px");
        if(this.result.prov_id && this.result.amphur_id){
          var student = JSON.stringify({
            "table_name" : "psentnotice_officer",
            "field_id" : "off_id",
            "field_name" : "off_name",
            "condition" : " AND prov_id='"+this.result.prov_id+"' AND amphur_id='"+this.result.amphur_id+"'",
            "userToken" : this.userData.userToken});
        }else if(this.result.prov_id && !this.result.amphur_id){
          var student = JSON.stringify({
            "table_name" : "psentnotice_officer",
            "field_id" : "off_id",
            "field_name" : "off_name",
            "condition" : " AND prov_id='"+this.result.prov_id+"'",
            "userToken" : this.userData.userToken});
        }else{
          var student = JSON.stringify({
            "table_name" : "psentnotice_officer",
            "field_id" : "off_id",
            "field_name" : "off_name",
            "userToken" : this.userData.userToken});
        }
        
        this.listTable='psentnotice_officer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
        this.listFieldNull='';
        if(this.result.prov_id && this.result.amphur_id){
          this.listFieldCond=" AND prov_id='"+this.result.prov_id+"' AND amphur_id='"+this.result.amphur_id+"'";
        }else if(this.result.prov_id && !this.result.amphur_id){
          this.listFieldCond=" AND prov_id='"+this.result.prov_id+"'";
        }else{
          this.listFieldCond="";
        }
        
        this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
        console.log(response)
        this.list = response;
        this.loadModalListComponent = true;
        },
        (error) => {}
        )
  //ผู้เดินหมาย
        /*}if(this.modalType==4){
          $("#exampleModal").find(".modal-content").css("width","800px");
          var student = JSON.stringify({
          "table_name" : "psentnotice_officer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
          this.listTable='psentnotice_officer';
          this.listFieldId='off_id';
          this.listFieldName='off_name';
          this.listFieldNull='';
          this.listFieldCond="";
          this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
          (response) =>{
          console.log(response)
          this.list = response;
          this.loadModalListComponent = true;
          },
          (error) => {}
          )*/
  //ผู้จ่ายหมาย
          }if(this.modalType==5){
            $("#exampleModal").find(".modal-content").css("width","800px");
            var student = JSON.stringify({
            "table_name" : "pofficer",
            "field_id" : "off_id",
            "field_name" : "off_name",
            "search_id" : "",
            "search_desc" : "",
            "userToken" : this.userData.userToken});
            this.listTable='pofficer';
            this.listFieldId='off_id';
            this.listFieldName='off_name';
            this.listFieldNull='';
            this.listFieldCond="";
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
    this.result.prov_id=event.fieldIdValue;
    this.result.prov_name=event.fieldNameValue;
    }else if(this.modalType==2){
      this.result.amphur_id=event.fieldIdValue;
      this.result.amphur_name=event.fieldNameValue;
  //ผู้รับหมาย
      }else if(this.modalType==3){
        this.result.prcv_off_id=event.fieldIdValue;
        this.result.rcvuser_name=event.fieldNameValue;
  //ผู้เดินหมาย
        }else if(this.modalType==4){
          this.result.user_id=event.fieldIdValue;
          this.result.user_name=event.fieldNameValue;
  //ผู้จ่ายหมาย
          }else if(this.modalType==5){
            this.result.puser_send_id=event.fieldIdValue;
            this.result.puser_send_name=event.fieldNameValue;
            }
    this.closebutton.nativeElement.click();
    }
    
  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prsn1100"
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

  changeProv(province:any,type:any){
    this.sAmphur.clearModel();
    var student = JSON.stringify({
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "condition" : " AND prov_id='"+province+"'",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAmphur = getDataOptions;  
      },
      (error) => {}
    )
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
     ngAfterContentInit(): void{
      console.log(888)
      this.setDefPage();
    }
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ClearAll(){
      window.location.reload();
    }


    printReport(type:any){

      var rptName = 'rsn1100';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        'prpt_type' : type,
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pcase_type" : this.result.pcase_type ? this.result.pcase_type.toString() : '',
        "pno_money" : this.result.pno_money ? this.result.pno_money.toString() : '',
        "psend_by" : this.result.psend_by ? this.result.psend_by.toString() : '',
        "prov_id" : this.result.prov_id ? this.result.prov_id.toString() : '',
        "amphur_id" : this.result.amphur_id ? this.result.amphur_id.toString() : '',
        "user_id" : this.result.user_id ? this.result.user_id.toString() : '',
        "prcv_off_id" : this.result.prcv_off_id ? this.result.prcv_off_id.toString() : '',
        "pflag" : this.result.pflag ? this.result.pflag.toString() : '',
        "pinout_flag" : this.result.pinout_flag ? this.result.pinout_flag.toString() : '',
        "pown_court" : this.result.pown_court ? this.result.pown_court.toString() : '',
        "porder1" : this.result.porder1 ? this.result.porder1.toString() : '',
        "porder2" : this.result.porder2 ? this.result.porder2.toString() : '',
        "ppost_type" : this.result.ppost_type ? this.result.ppost_type.toString() : '',
        "ptype" : this.result.ptype ? this.result.ptype.toString() : '',
        "pprint_flag" : this.result.pprint_flag ? this.result.pprint_flag.toString() : '',
        "puser_send_id" : this.result.puser_send_id ? this.result.puser_send_id.toString() : '',
        "psend_amt" : this.result.psend_amt ? this.result.psend_amt.toString() : '',
       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    changeCaseType(caseType:any){
      this.selCaseType = caseType;
    }



}






