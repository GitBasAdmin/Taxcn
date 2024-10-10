import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,QueryList,ViewChildren   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import {ExcelService} from '../../../services/excel.service.ts';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fap0700,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fap0700.component.html',
  styleUrls: ['./fap0700.component.css']
})


export class Fap0700Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';
  
  getCaseType:any; 
  getCaseCate:any;
  getTitle:any;

  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  myExtObject: any;
  result:any = [];
  modalType:any;
  getAppBy:any;
  tmpResult:any = [];
  dataSearch:any = [];
  retPage:any = 'fmg0200';

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadConfirmComponent = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('sCaseType') sCaseType : NgSelectComponent;
  @ViewChild('sCaseCate') sCaseCate : NgSelectComponent;
  @ViewChild('sTitle') sTitle : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
  ){ }
   
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true
    };
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "order_by": " case_type ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.result.c_type = this.userData.defaultCaseType;
        this.changeCaseType(this.userData.defaultCaseType);
      },
      (error) => {}
    )
    this.getAppBy = [{fieldIdValue:1,fieldNameValue: '1 ศูนย์นัดความ'},{fieldIdValue:2,fieldNameValue: '2 ผู้พิพากษา'},{fieldIdValue:3,fieldNameValue: '3 ศูนย์ไกล่เกลี่ย'}];
      //this.asyncObservable = this.makeObservable('Async Observable');
    this.successHttp();
    
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/
  changeCaseType(caseType:any){
    this.sCaseCate.clearModel();this.sTitle.clearModel();
    //======================== pcase_cate ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_cate",
      "field_id" : "case_cate_id",
      "field_name" : "case_cate_name",
      "condition" : " AND case_type='"+caseType+"'",
      "order_by" : " case_cate_id ASC",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getCaseCate = getDataOptions;
        this.changeTitle(caseType);
        
      },
      (error) => {}
    )
  }

  changeTitle(caseType:any){

    //========================== ptitle ====================================    
 
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND title_flag='1' AND case_type='"+caseType+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });
    console.log(student);

    //console.log("fCaseTitle")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getTitle = getDataOptions;
        },
        (error) => {}
      )
    });
    return promise;
 
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fap0700"
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
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTrigger.next(null);
  }
      
 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
     }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ngAfterContentInit() : void{
      myExtObject.callCalendar();
    }


    tabChangeInput(name:any,event:any){
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      if(name=='table_id'){
        var student = JSON.stringify({
          "table_name" : "pappoint_table",
          "field_id" : "table_id",
          "field_name" : "table_name",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
       this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
           (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
              this.result.table_name = productsJson[0].fieldNameValue;
            }else{
              this.result.table_id = null;
              this.result.table_name = '';
            }
           },
           (error) => {}
         )
      }
    }

    clickOpenMyModalComponent(type:any){
      if(type==1){
        this.modalType = type;
      }
      this.openbutton.nativeElement.click();
    }

    loadMyModalComponent(){
      if(this.modalType==1){
        $("#exampleModal").find(".modal-content").css("width","800px");
        var student = JSON.stringify({
          "table_name" : "pappoint_table",
           "field_id" : "table_id",
           "field_name" : "table_name",
           "search_id" : "",
           "search_desc" : "",
           "userToken" : this.userData.userToken});
        this.listTable='pappoint_table';
        this.listFieldId='table_id';
        this.listFieldName='table_name';
        this.listFieldNull='';
      }
      if(this.modalType==1){
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
            if(this.modalType==1 || this.modalType==5){
              this.loadModalComponent = true;  
              this.loadComponent = false;
              this.loadConfirmComponent = false;
            }
          },
          (error) => {}
        )
      }
    }

    closeModal(){
      this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadConfirmComponent = false;
    }

    submitModalForm(){

    }

    
  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1 ){
      this.result.table_id = event.fieldIdValue;
      this.result.table_name = event.fieldNameValue;
    }
    
    this.closebutton.nativeElement.click();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  searchData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.start_date || !this.result.end_date){
      confirmBox.setMessage('ป้อนข้อมูลวันที่ต้องการค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){this.SpinnerService.hide();}
        subscription.unsubscribe();
      });
		}else{
			this.SpinnerService.show();
      this.tmpResult = this.result;
      var jsonTmp = $.extend({}, this.tmpResult);
      //if(jsonTmp.admit_flag== 0) delete jsonTmp.admit_flag;
      //if(jsonTmp.case_level== 0) delete jsonTmp.case_level;
      jsonTmp['userToken'] = this.userData.userToken;
      var student = jsonTmp; 
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0700', student , {headers:headers}).subscribe(
        (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.result==1){
              this.dataSearch = [];
              var bar = new Promise((resolve, reject) => {
                productsJson.data.forEach((ele, index, array) => {

                });
              });
              console.log(bar)
              if(bar){
                this.dataSearch = productsJson.data;
                this.rerender();
                //this.dtTrigger.next(null);
                console.log(this.dataSearch)
              }
              
            }else{
              this.dataSearch = [];
              this.rerender();
            }
            //console.log(productsJson)
            this.SpinnerService.hide();
        },
        (error) => {}
      )
		}
  }

  retToPage(run_id:any){
    let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/fmg0200';
    myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  }

  exportAsXLSX(): void {
    if(this.dataSearch){
      var excel =  JSON.parse(JSON.stringify(this.dataSearch));
      console.log(excel)
      var data = [];var extend = [];
      var bar = new Promise((resolve, reject) => {
        
        for(var i = 0; i < excel.length; i++){

          for(var x=0;x<10;x++){
            if(x==0)
              data.push(excel[i]['case_no']);         
            if(x==1)
              data.push(excel[i]['red_no']);    
            if(x==2)
              data.push(excel[i]['table_name']);   
            if(x==3)
              data.push(excel[i]['app_seq']);
            if(x==4)
              data.push(excel[i]['date_appoint']);
            if(x==5)
              data.push(excel[i]['time_appoint']);
            if(x==6)
              data.push(excel[i]['room_id']);
            if(x==7)
              data.push(excel[i]['app_name']);
            if(x==8)
              data.push(excel[i]['delay_name']);
            if(x==9)
              data.push(excel[i]['date_appoint_next']);
          }
        
          extend[i] = $.extend([], data)
          data = [];
          //extend[i] = Object.values(data)
        }
      });
      if(bar){
        var objExcel = [];
        objExcel['data'] = extend;
        console.log(objExcel)
        this.excelService.exportAsExcelFile(objExcel,'fap0700' ,this.programName);
      }
        
    }else{
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นหาข้อมูล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
  }

}







