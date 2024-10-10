import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList   } from '@angular/core';
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
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
import { indexOf } from 'lodash';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fci0100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fci0100.component.html',
  styleUrls: ['./fci0100.component.css']
})


export class Fci0100Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';
  getCaseType:any;
  getCaseCate:any;
  getTitle:any;

  sessData:any;
  userData:any;
  programName:any;
  modalType:any;
  modalIndex:any;

  myExtObject: any;
  result:any= [];
  tmpResult:any = [];
  dataSearch:any = [];
  dataSource:any = [];
  rowsData:any;
 
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
  public loadModalJudgeComponent: boolean = false;
  public loadConfirmComponent: boolean = false;
  public loadModalMultiComponent: boolean = false;
  public loadModalConcComponent : boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('sCaseType') sCaseType : NgSelectComponent;
  @ViewChild('sCaseCate') sCaseCate : NgSelectComponent;
  @ViewChild('sTitle') sTitle : NgSelectComponent;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  @ViewChildren('jcalendar') jcalendar: QueryList<ElementRef>;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService
  ){ }
   
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
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
        
      },
      (error) => {}
    )
    
    this.result.date_type =1;
    this.result.case_cate_type =1;
    this.result.sdate =myExtObject.curDate();
    this.result.edate =myExtObject.curDate();
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
 
  }

  
  changeCaseType(event:any,type:any){
    this.sCaseCate.clearModel();this.sTitle.clearModel();
    //======================== pcase_cate ======================================
    console.log(event)
    if(type==1){
      var student = JSON.stringify({
        "table_name" : "pcase_cate",
        "field_id" : "case_cate_id",
        "field_name" : "case_cate_name",
        "condition" : " AND case_type='"+this.result.case_type+"' AND case_flag='"+event.target.value+"'",
        "order_by" : "case_cate_id ASC",
        "userToken" : this.userData.userToken
      });
    }else{
      var student = JSON.stringify({
        "table_name" : "pcase_cate",
        "field_id" : "case_cate_id",
        "field_name" : "case_cate_name",
        "condition" : " AND case_type='"+event+"' AND case_flag='"+this.result.case_cate_type+"'",
        "order_by" : "case_cate_id ASC",
        "userToken" : this.userData.userToken
      });
    }
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        console.log(response)
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
        this.changeTitle();
        
      },
      (error) => {}
    )
  }

  changeTitle(){
    console.log(this.getCaseCate)
    var val="";
    for (var i = 0; i < this.getCaseCate.length; i++) {
      if(i==0)
        val = "'"+this.getCaseCate[i].fieldIdValue+"'";
      else
        val = val+','+"'"+this.getCaseCate[i].fieldIdValue+"'";
    }
    console.log(val)
    //========================== ptitle ====================================    
 
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "  AND case_type='"+this.result.case_type+"' AND title_flag='"+this.result.case_cate_type+"' AND case_cate_id IN ("+val+") ",
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
      "url_name" : "fca0300"
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
    setTimeout(() => {
      this.ngAfterContentInit();
    }, 500);
    
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

  searchData(){
    this.SpinnerService.show();
    this.tmpResult = this.result;
    var jsonTmp = $.extend({}, this.tmpResult);
    jsonTmp['userToken'] = this.userData.userToken;
    var student = jsonTmp; 
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      
      this.http.post('/'+this.userData.appName+'ApiCI/API/CONC/fci0100', student , {headers:headers}).subscribe(
        (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.result==1){
              this.dataSearch = [];
              var bar = new Promise((resolve, reject) => {
                productsJson.data.forEach((ele:any, index:any, array:any) => {
                  if(!ele.conciliate_type2)
                    ele.conciliate_type2 = 2;
                });
              });
              if(bar){
                this.dataSearch = productsJson.data;
                this.dataSource = JSON.parse(JSON.stringify(this.dataSearch));
                this.rowsData = productsJson.data.length;
                this.rerender();
                console.log(this.dataSearch)
              }
            }else{
              this.dataSearch = [];
              this.dataSource = [];
              this.rowsData = '';
              this.rerender();
            }
            this.SpinnerService.hide();
        },
        (error) => {}
      )
  }

  difference(object:any, base:any) {
    return transform(object, (result:any, value, key) => {
      if (!isEqual(value, base[key])) {
        //result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
        result[key] = isObject(value) && isObject(base[key]) ? key : null;
        //result[key] = key;
      }
    });
  }

  saveData(){
        var student = this.difference(this.dataSearch,this.dataSource);
        var saveArray = $.grep(student,function(n:any){ return n == 0 || n });

        var dataSave = [],dataTmp=[];
          dataSave['userToken'] = this.userData.userToken;
          var bar = new Promise((resolve, reject) => {
            for(var i=0;i<saveArray.length;i++){
              dataTmp.push(this.dataSearch[saveArray[i]]);
            }
          });

          if(bar){
            this.SpinnerService.show();
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type','application/json');
            dataSave['data'] = dataTmp;
            var data = $.extend({}, dataSave);
            console.log(data)
            
            this.http.post('/'+this.userData.appName+'ApiCI/API/CONC/fci0100/saveData', data , {headers:headers}).subscribe(
              (response) =>{
                let alertMessage : any = JSON.parse(JSON.stringify(response));
                if(alertMessage.result==0){
                  const confirmBox = new ConfirmBoxInitializer();
                  confirmBox.setTitle('ข้อความแจ้งเตือน');
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      this.SpinnerService.hide();
                    }
                    subscription.unsubscribe();
                  });
                  
                }else{
                  const confirmBox = new ConfirmBoxInitializer();
                  confirmBox.setTitle('ข้อความแจ้งเตือน');
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      this.searchData();
                      //this.SpinnerService.hide();
                    }
                    subscription.unsubscribe();
                  });
                  
                }
              },
              (error) => {this.SpinnerService.hide();}
            )
            
            
          }
             
    
  }

  clickOpenMyModalComponent(type:any,index:any){
    this.modalType = type;
    this.modalIndex = index;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    if(this.modalType==1 || this.modalType==3 || this.modalType==6 || this.modalType==7){
      $("#exampleModal").find(".modal-content").css("width","650px");
        this.loadComponent = false;
        this.loadModalJudgeComponent = true;
        this.loadConfirmComponent = false;
        this.loadModalMultiComponent = false;
        this.loadModalConcComponent = false;
      var student = JSON.stringify({
        "cond":2,
        "userToken" : this.userData.userToken
      });
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.listFieldType=JSON.stringify({"type":2});
    
      console.log(student)
      let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
     
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.data.length){
            this.list = productsJson.data;
            console.log(this.list)
          }else{
            this.list = [];
          }
         },
         (error) => {}
       )
    }else if(this.modalType==2 || this.modalType==5){
      $("#exampleModal").find(".modal-content").css("width","600px");
      var student = JSON.stringify({"userToken" : this.userData.userToken});    
        console.log(student)
        let headers = new HttpHeaders();
       
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupConciliate', student).subscribe(
           (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson){
              this.list = productsJson;
              console.log(this.list)
            }else{
              this.list = [];
            }
           },
           (error) => {}
         )
        this.loadComponent = false;
        this.loadModalJudgeComponent = false;
        this.loadConfirmComponent = false;
        this.loadModalMultiComponent = false;
        this.loadModalConcComponent = true;
        /*var student = JSON.stringify({
          "table_name" : "pconciliate",
           "field_id" : "conciliate_id",
           "field_name" : "conciliate_name",
           "search_id" : "",
           "search_desc" : "",
           "userToken" : this.userData.userToken});
        this.listTable='pconciliate';
        this.listFieldId='conciliate_id';
        this.listFieldName='conciliate_name';
        this.listFieldNull='';*/
    }else if(this.modalType==4 || this.modalType==8){
      $("#exampleModal").find(".modal-content").css("width","600px");
        var student = JSON.stringify({
          "table_name" : "pposition",
          "field_id" : "post_id",
          "field_name" : "post_name",
           "search_id" : "",
           "search_desc" : "",
           "userToken" : this.userData.userToken});
        this.listTable='pposition';
        this.listFieldId='post_id';
        this.listFieldName='post_name';
        this.listFieldNull='';
    }

    if(this.modalType==4 || this.modalType==8){
      // if(this.modalType==2 || this.modalType==4 || this.modalType==5 || this.modalType==8){
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          if(this.modalType==4 || this.modalType==8){
            // if(this.modalType==2 || this.modalType==4 || this.modalType==5 || this.modalType==8){
            this.loadComponent = true;
            this.loadModalJudgeComponent = false;
            this.loadConfirmComponent = false;
            this.loadModalMultiComponent = false;
            this.loadModalConcComponent = false;
          }
        },
        (error) => {}
      )
    }

    
  
  }

  tabChangeInput(name:any,event:any,index:any){
    let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
    if(name=='sjudge_id'){
      $("#exampleModal").find(".modal-content").css("width","650px");

      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.dataSearch[index].sjudge_name = productsJson[0].fieldNameValue;
          }else{
            this.dataSearch[index].sjudge_id = null;
            this.dataSearch[index].sjudge_name = '';
          }
         },
         (error) => {}
       )
    }else if(name=='conciliate_id1'){
      if(this.dataSearch[index].conciliate_type1==2){//ผู้ประนอม
        var student = JSON.stringify({
          "table_name" : "pconciliate",
          "field_id" : "conciliate_id",
          "field_name" : "conciliate_name",
        "condition" : " AND conciliate_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.dataSearch[index].conciliate_name1 = productsJson[0].fieldNameValue;
          }else{
            this.dataSearch[index].conciliate_id1 = null;
            this.dataSearch[index].conciliate_name1 = '';
          }
         },
         (error) => {}
       )
      }else{//ผู้พิพากษา
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
       this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
           (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
              this.dataSearch[index].conciliate_name1 = productsJson[0].fieldNameValue;
            }else{
              this.dataSearch[index].conciliate_id1 = null;
              this.dataSearch[index].conciliate_name1 = '';
            }
           },
           (error) => {}
         )
      }
    }else if(name=='conciliate_post_id1'){
      var student = JSON.stringify({
        "table_name" : "pposition",
        "field_id" : "post_id",
        "field_name" : "post_name",
        "condition" : " AND post_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.dataSearch[index].conciliate_post_name1 = productsJson[0].fieldNameValue;
          }else{
            this.dataSearch[index].conciliate_post_id1 = null;
            this.dataSearch[index].conciliate_post_name1 = '';
          }
         },
         (error) => {}
       )
    }else if(name=='conciliate_id2'){
      if(this.dataSearch[index].conciliate_type2==2){//ผู้ประนอม
        var student = JSON.stringify({
          "table_name" : "pconciliate",
          "field_id" : "conciliate_id",
          "field_name" : "conciliate_name",
        "condition" : " AND conciliate_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.dataSearch[index].conciliate_name2 = productsJson[0].fieldNameValue;
          }else{
            this.dataSearch[index].conciliate_id2 = null;
            this.dataSearch[index].conciliate_name2 = '';
          }
         },
         (error) => {}
       )
      }else{//ผู้พิพากษา
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
       this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
           (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
              this.dataSearch[index].conciliate_name2 = productsJson[0].fieldNameValue;
            }else{
              this.dataSearch[index].conciliate_id2 = null;
              this.dataSearch[index].conciliate_name2 = '';
            }
           },
           (error) => {}
         )
      }
    }else if(name=='judge_id'){
      $("#exampleModal").find(".modal-content").css("width","650px");

      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.dataSearch[index].judge_name = productsJson[0].fieldNameValue;
          }else{
            this.dataSearch[index].judge_id = null;
            this.dataSearch[index].judge_name = '';
          }
         },
         (error) => {}
       )
    }else if(name=='post_id'){
      var student = JSON.stringify({
        "table_name" : "pposition",
        "field_id" : "post_id",
        "field_name" : "post_name",
        "condition" : " AND post_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.dataSearch[index].post_name = productsJson[0].fieldNameValue;
          }else{
            this.dataSearch[index].post_id = null;
            this.dataSearch[index].post_name = '';
          }
         },
         (error) => {}
       )
    }
  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1 ){
      this.dataSearch[this.modalIndex].sjudge_id = event.judge_id;
      this.dataSearch[this.modalIndex].sjudge_name = event.judge_name;
    }
    if(this.modalType==2){
      this.dataSearch[this.modalIndex].conciliate_id1 = event.fieldIdValue;
      this.dataSearch[this.modalIndex].conciliate_name1 = event.fieldNameValue;
    }
    if(this.modalType==3){
      this.dataSearch[this.modalIndex].conciliate_id1 = event.judge_id;
      this.dataSearch[this.modalIndex].conciliate_name1 = event.judge_name;
      this.dataSearch[this.modalIndex].conciliate_post_id1 = event.post_id;
      this.dataSearch[this.modalIndex].conciliate_post_name1 = event.post_name;
    }
    if(this.modalType==4){
      this.dataSearch[this.modalIndex].conciliate_post_id1 = event.fieldIdValue;
      this.dataSearch[this.modalIndex].conciliate_post_name1 = event.fieldNameValue;
    }
    if(this.modalType==5){
      this.dataSearch[this.modalIndex].conciliate_id2 = event.fieldIdValue;
      this.dataSearch[this.modalIndex].conciliate_name2 = event.fieldNameValue;
    }
    if(this.modalType==6){
      this.dataSearch[this.modalIndex].conciliate_id2 = event.judge_id;
      this.dataSearch[this.modalIndex].conciliate_name2 = event.judge_name;
    }
    if(this.modalType==7){
      this.dataSearch[this.modalIndex].judge_id = event.judge_id;
      this.dataSearch[this.modalIndex].judge_name = event.judge_name;
      this.dataSearch[this.modalIndex].post_id = event.post_id;
      this.dataSearch[this.modalIndex].post_name = event.post_name;
    }
    if(this.modalType==8){
      this.dataSearch[this.modalIndex].post_id = event.fieldIdValue;
      this.dataSearch[this.modalIndex].post_name = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  closeModal(){
    this.loadComponent = false;
        this.loadModalJudgeComponent = false;
        this.loadConfirmComponent = false;
        this.loadModalMultiComponent = false;
        this.loadModalConcComponent = false;
  }

  submitModalForm(){
    var chkForm = JSON.parse(this.child.ChildTestCmp());
    
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!chkForm.password){
      confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
      
    }else if(!chkForm.log_remark){
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    }else{
      
        var student = JSON.stringify({
          "user_running" : this.userData.userRunning,
          "password" : chkForm.password,
          "log_remark" : chkForm.log_remark,
          "userToken" : this.userData.userToken
        });
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student , {headers:headers}).subscribe(
          posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));
            console.log(productsJson)
          if(productsJson.result==1){
              const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

            // Choose layout color type
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){

                }
                subscription.unsubscribe();
              });
            }else{
              confirmBox.setMessage(productsJson.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
              });
            }
          },
          (error) => {}
        );

    }
    
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  directiveDateObj(index:any,obj:any){
    /*
    this.jcalendar.toArray().forEach((directive, index) => { 
      console.log(index); console.log(directive); 
      //console.log(directive[items].targets.value)
    })  
    */
    //console.log(this.jcalendar.get(index).nativeElement.value)
    this.dataSearch[index][obj] = this.jcalendar.get(index).nativeElement.value;
  }

  printReport(index:any){
    //rpt/rci0200.jsp?prun_id=150663&phjudge_name=&phpost_name=
    //console.log(this.dataSearch[index])
    
    var rptName = 'rci0200';
    //var rptResult = $.extend({},this.result);
    var rptResult = {};
    var bar = new Promise((resolve, reject) => {
      if(this.dataSearch[index].run_id)
        rptResult['prun_id'] = this.dataSearch[index].run_id;
      rptResult['phjudge_name'] = '';
      rptResult['phpost_name'] = '';
      });
      if(bar){
        if(rptResult['userToken'])
          delete rptResult['userToken'];
        var paramData = JSON.stringify(rptResult);
        console.log(paramData)
        this.printReportService.printReport(rptName,paramData);
      }  
  }
}