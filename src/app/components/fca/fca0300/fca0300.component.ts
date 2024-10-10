import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PrintReportService } from 'src/app/services/print-report.service';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import {ExcelService} from '../../../services/excel.service.ts';
import { ActivatedRoute } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fca0300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fca0300.component.html',
  styleUrls: ['./fca0300.component.css']
})


export class Fca0300Component implements AfterViewInit,AfterContentInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  getCaseType:any;selCaseType:any;
  getCaseSpecial:any;selCaseSpecial:any;
  getCaseCate:any;
  getCaseStatus:any;
  getTitle:any;
  getRedTitle:any;
  getCondFlag:any;
  getCustomerFlag:any;
  getIndict:any;
  getAdmit:any;
  getPolice:any;
  getProsType:any;
  getEfile:any;selEfile:any;
  getCourt:any;
  getCaseTypeStat:any;
  getCourtZone:any;
  getCourtAmphur:any
  getCourtTambon:any;
  getCourtSubdistrict:any;
  sessData:any;
  userData:any;
  programName:any;
  court_id:any;
  case_type_stat:any;
  old_court_id:any;
  zone_id:any;
  transfer_court_id:any;
  zone_tambon_id:any;
  zone_subdistrict_id:any;
  alle_id:any;
  alle_name:any;
  req_id:any;
  deposit:any;
  order_judge_name:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  result:any = [];
  dataSearch:any = [];
  myExtObject:any;
  tmpResult:any = [];
  retPage:any = 'fmg0200';
  courtProv:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  public loadModalComponent = false; //password confirm
  public loadModalJudgeComponent : boolean = false; //popup judge
  public loadModalAlleComponent : boolean = false; //popup judge
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  
  @ViewChild('sZone') sZone : NgSelectComponent;
  //@ViewChild('sZoneTambon') sZoneTambon : NgSelectComponent;
  //@ViewChild('sZoneSubdistrict') sZoneSubdistrict : NgSelectComponent;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute
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
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['program'])
        this.retPage = params['program'];
    });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.dataSearch.deposit = "0.00";
    
    this.successHttp();
    
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
        this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();
      },
      (error) => {}
    )
    //======================== pcase_special ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_special",
      "field_id" : "special_id",
      "field_name" : "special_case",
      "order_by" : "order_no ASC, special_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseSpecial = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "field_name2" : "court_running",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        console.log(this.getCourt)
        var court = this.getCourt.filter((x:any) => x.fieldIdValue === this.userData.courtId) ;
        if(court.length!=0){
          this.result.court_id = this.court_id = court[0].fieldIdValue;
        }
      },
      (error) => {}
    )
    //======================== pcase_cate ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_cate",
      "field_id" : "case_cate_id",
      "field_name" : "case_cate_name",
      "order_by" : "case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;   
      },
      (error) => {}
    )
    //======================== pcase_type_stat ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type_stat",
      "field_id" : "case_type_stat",
      "field_name" : "case_type_stat_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        
        this.getCaseTypeStat = getDataOptions;
        this.getCaseTypeStat.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        console.log(this.getCaseTypeStat)
      },
      (error) => {}
    )
    //======================== pcase_status ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_status",
      "field_id" : "case_status_id",
      "field_name" : "case_status",
      "order_by" : "order_no ASC, case_status_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseStatus = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )
    //======================== ppolice ======================================
    var student = JSON.stringify({
      "table_name" : "ppolice",
      "field_id" : "police_id",
      "field_name" : "police_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getPolice = getDataOptions;
        this.getPolice.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        //console.log(getDataOptions)
      },
      (error) => {}
    )
    
     //======================== pcourt_zone ======================================
     /*
     var student = JSON.stringify({
      "table_name" : "pcourt_zone",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "field_name2" : "prov_id",
      "userToken" : this.userData.userToken
    });
    
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourtZone = getDataOptions;
        console.log(this.getCourtZone)
        //this.getCourtZone.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        //console.log(getDataOptions)
      },
      (error) => {}
    )
    */
    
     //======================== pcase_status_indictment ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_status_indictment",
      "field_id" : "indict_id",
      "field_name" : "indict_status",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
        this.getIndict = getDataOptions;
        this.result.case_level = this.getIndict.find((x:any) => x.fieldIdValue === 0).fieldIdValue;
      },
      (error) => {}
    )
    this.getCondFlag = [{fieldIdValue:1,fieldNameValue: 'ทั้งหมด'},{fieldIdValue:2,fieldNameValue: 'คดีค้าง'}];
    this.getCustomerFlag = [{fieldIdValue:0,fieldNameValue: 'เลือกประเภท'},{fieldIdValue:1,fieldNameValue: 'โจทก์เป็นผู้บริโภค'},{fieldIdValue:2,fieldNameValue: 'โจทก์เป็นผู้ประกอบการ'}];
    this.getAdmit = [{fieldIdValue:0,fieldNameValue: 'ทั้งหมด'},{fieldIdValue:1,fieldNameValue: 'รับสารภาพ'},{fieldIdValue:2,fieldNameValue: 'ปฏิเสธ'}];
    this.getProsType = [{fieldIdValue:0,fieldNameValue: 'ทั้งหมด'},{fieldIdValue:1,fieldNameValue: 'พนักงานอัยการเป็นโจทก์'},{fieldIdValue:2,fieldNameValue: 'ราษฎรฟ้องกันเอง'}];
    this.getEfile = [{fieldIdValue:0,fieldNameValue: 'คดีทั้งหมด(รวมคดีที่ยื่นฟ้อง e-filing)'},{fieldIdValue:1,fieldNameValue: 'เฉพาะคดีที่ยื่นฟ้อง e-filing'},{fieldIdValue:2,fieldNameValue: 'ไม่รวมคดีที่ยื่นฟ้อง e-filing'}];
    this.result.efile = 0;
    this.result.case_flag = 1 ;

    this.changeCourt(this.userData.courtId,'');
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

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
    this.dtTrigger.next(null);    
    
  }

  ngAfterContentInit() : void{
    this.result.guar_pros = 0;
    this.result.case_yes_no = 0;
    this.result.cond_flag = this.getCondFlag.find((x:any) => x.fieldIdValue === 1).fieldIdValue;
    this.result.customer_flag = this.getCustomerFlag.find((x:any) => x.fieldIdValue === 0).fieldIdValue;
    
    this.result.admit_flag = this.getAdmit.find((x:any) => x.fieldIdValue === 0).fieldIdValue;
    this.result.prosType = this.getProsType.find((x:any) => x.fieldIdValue === 0).fieldIdValue;
    myExtObject.callCalendar();
  }
    
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
        if(objName=='zone_id'){
          this.changeAmphur(val[0].fieldIdValue,1);
        }
      }else{
        this.result[objName] = null;
        this[objName] = null;
      }
    }
  }

  changeCourt(event:any,type:any){
    if(typeof event === 'object')
      event = event.target.value;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_province",
      "field_name" : "court_name",
      "condition" : " AND court_id='"+event+"'",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)

        if(getDataOptions.length==1){
          this.changeProv(getDataOptions[0].fieldIdValue,1);
          this.courtProv = getDataOptions[0].fieldIdValue;
        }else{
          this.sZone.clearModel();
          //this.sZoneTambon.clearModel();
          //this.sZoneSubdistrict.clearModel();
          this.getCourtZone = [];
        }

        
        
      },
      (error) => {}
    )
  }

  changeProv(province:any,type:any){
    
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "condition" : " AND prov_id='"+province+"'",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourtZone = getDataOptions;        
      },
      (error) => {}
    )

  }

  changeAmphur(event:any,type:any){
    if(typeof event === 'object')
      event = event.target.value;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "condition" : " AND prov_id='"+this.courtProv+"' AND amphur_id='"+event+"'",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getCourtAmphur = getDataOptions;
        if(type==1){
            this.zone_id = event;
            this.result.zone_id = event;

          //this.sZoneTambon.clearModel();
          //this.sZoneSubdistrict.clearModel();
        }
      },
      (error) => {}
    )
    
  }
  
  changeTambon(tambon:any,type:any){
    if(typeof tambon === 'object')
      tambon = tambon.target.value;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "psubdistrict",
      "field_id" : "subdistrict_id",
      "field_name" : "subdistrict_name",
      "condition" : " AND tambon_id='"+tambon+"' AND amphur_id='"+this.result.zone_tambon_id+"' AND prov_id='"+this.courtProv+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourtTambon = getDataOptions;     
        if(type==1){
          this.zone_tambon_id = tambon;
          this.result.zone_tambon_id = tambon;
          //this.sZoneSubdistrict.clearModel();
        }  
      },
      (error) => {}
    )
  }

  loadMyModalAlleComponent(){
    $(".modal-backdrop").remove();
    this.loadModalComponent = false; //password confirm
    this.loadModalJudgeComponent = false; //popup judge
    this.loadModalAlleComponent = true;
    $("#exampleModal-3").find(".modal-body").css("height","auto");
    $("#exampleModal-3").css({"background":"rgba(51,32,0,.4)"});
console.log(this.result.case_type +":"+ this.result.case_cate_id)
    if(this.result.case_type && this.result.case_cate_id){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "table_name" : "pcase_cate_map_group",
        "field_id" : "case_cate_group",
        "field_name" : "case_cate_id",
        "field_name2" : "case_type",
        "condition" : " AND case_type='"+this.result.case_type+"' AND case_cate_id='"+this.result.case_cate_id+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(getDataOptions.length){
            var student = JSON.stringify({
              "table_name" : "pallegation",
               "field_id" : "alle_id",
               "field_name" : "alle_name",
               "field_name2" : "alle_running",
               "search_id" : "",
               "search_desc" : "",
               "condition" : " AND case_type='"+this.result.case_type+"' AND case_cate_group='"+getDataOptions[0].fieldIdValue+"' AND user_select=1",
               "userToken" : this.userData.userToken});
              this.listTable='pallegation';
              this.listFieldId='alle_id';
              this.listFieldName='alle_name';
              this.listFieldNull="";
              this.listFieldCond=" AND case_type='"+this.result.case_type+"' AND case_cate_group='"+getDataOptions[0].fieldIdValue+"' AND user_select=1";
              console.log(student)
              this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
                (response) =>{
                  this.list = response;
                  console.log(response)
                },
                (error) => {}
              )
          }else{
            this.list = [];
          }
          console.log(getDataOptions)
        },
        (error) => {}
      )
        
    }else{
      this.list = [];
    }
  }

  loadMyModalJudgeComponent(val:any){
    
    $(".modal-backdrop").remove();
    this.loadModalComponent = false; //password confirm
    this.loadModalAlleComponent = false;
    this.loadModalJudgeComponent = true; //popup judge
    $("#exampleModal-3").find(".modal-body").css("height","auto");
    $("#exampleModal-3").css({"background":"rgba(51,32,0,.4)"});

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
      
  }

  tabChangeInput(name:any,event:any){
    if(name=='order_judge_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
    console.log(student)
    let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
     
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));

          if(productsJson.length){
            this.order_judge_name = productsJson[0].fieldNameValue;
          }else{
            this.result.order_judge_id = null;
            this.order_judge_name = '';
          }
         },
         (error) => {}
       )
    }
  }

  submitModalForm(){
     
  }

  receiveJudgeListData(event:any){
    this.result.order_judge_id = event.judge_id;
    this.order_judge_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  receiveFuncListData(event:any){
    //this.fct9908.nativeElement[this.listFieldId].value=event.fieldIdValue;
    //this.fct9908.nativeElement[this.listFieldName].value=event.fieldNameValue;
    if(this.listTable=='pallegation'){
      this.result.alle_id=event.fieldIdValue;
      this.alle_name=event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  closeModal(){
    this.loadModalJudgeComponent = false; //popup judge
    this.loadModalComponent = false;
    this.loadModalAlleComponent = false;
  }

  searchData(){
    
    if(!this.result.yy && 
      !this.result.red_yy && 
      !this.result.scase_date && 
      !this.result.ecase_date && 
      !this.result.sjudging_date && 
      !this.result.customer_flag && 
      !this.result.ejudging_date && 
      !this.result.order_judge_id && 
      !this.result.old_id && 
      !this.result.old_red_id && 
      !this.result.old_court_id && 
      !this.result.hred_no){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ป้อนเงื่อนไขเพื่อค้นหา');
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
      if(jsonTmp.admit_flag== 0) delete jsonTmp.admit_flag;
      if(jsonTmp.case_level== 0) delete jsonTmp.case_level;
      if(jsonTmp.case_yes_no== 0) delete jsonTmp.case_yes_no;
      if(jsonTmp.customer_flag== 0) delete jsonTmp.customer_flag;
      if(jsonTmp.guar_pros== 0) delete jsonTmp.guar_pros;
      if(jsonTmp.prosType== 0) delete jsonTmp.prosType;
      if(!jsonTmp.sdeposit || !jsonTmp.edeposit){
        delete jsonTmp.sdeposit;delete jsonTmp.edeposit;
      }

      jsonTmp['userToken'] = this.userData.userToken;
      //console.log(jsonTmp)

      var student = jsonTmp; 
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0300', student , {headers:headers}).subscribe(
        (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.result==1){
              this.dataSearch = [];
              var bar = new Promise((resolve, reject) => {
                productsJson.data.forEach((ele, index, array) => {
                      if(ele.indict_desc != null){
                        if(ele.indict_desc.length > 47 )
                          productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
                      }
                      if(ele.deposit != null){
                        productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
                      }
                  });
              });
              console.log(bar)
              if(bar){
                this.dataSearch = productsJson.data;
                this.deposit = this.curencyFormat(productsJson.deposit,2);
                this.rerender();
                //this.dtTrigger.next(null);
                console.log(this.dataSearch)
              }
              /*
              bar.then(() => {
                this.dataSearch = productsJson.data;
                this.deposit = this.curencyFormat(productsJson.deposit,2);
                this.dtTrigger.next(null);
                console.log(this.dataSearch)
              });*/
              
            }else{
              this.dataSearch = [];
              this.deposit = 0;
              this.rerender();
            }
            //console.log(productsJson)
            this.SpinnerService.hide();
        },
        (error) => {}
      )

    }
      
    
  }

  curencyFormat(n:any,d:any) {
		return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	}

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  printReport(){
    var rptName = 'rca0300';
    var bar = new Promise((resolve, reject) => {
    if(this.result['scase_date'])
      this.result['scase_date'] = myExtObject.conDate(this.result['scase_date']);
    if(this.result['ecase_date'])
      this.result['ecase_date'] = myExtObject.conDate(this.result['ecase_date']);
    if(this.result['sjudging_date'])
      this.result['sjudging_date'] = myExtObject.conDate(this.result['sjudging_date']);
    if(this.result['ejudging_date'])
      this.result['ejudging_date'] = myExtObject.conDate(this.result['ejudging_date']);
    });
    if(bar){
    var paramData = $.extend({},this.result);
    console.log(paramData)
    this.printReportService.printReport(rptName,paramData);
    }
  }

  exportAsXLSX(): void {
    if(this.dataSearch){
      var excel =  JSON.parse(JSON.stringify(this.dataSearch));
      console.log(excel)
      var data = [];var extend = [];
      var bar = new Promise((resolve, reject) => {
        
        for(var i = 0; i < excel.length; i++){
          if(excel[i]['title'] && excel[i]['id'] && excel[i]['yy'])
            excel[i]['case_no'] = excel[i]['title']+excel[i]['id']+'/'+excel[i]['yy'];
          else
            excel[i]['case_no'] = "";
          if(excel[i]['red_title'] && excel[i]['red_title'] && excel[i]['red_title'])
            excel[i]['red_no']  = excel[i]['red_title']+excel[i]['red_id']+'/'+excel[i]['red_yy'];
          else
            excel[i]['red_no'] = "";
          if(excel[i]['date_appoint'])
            excel[i]['dateAppoint'] = excel[i]['date_appoint']+"  "+excel[i]['time_appoint'];
          else
            excel[i]['dateAppoint'] = "";
          if(excel[i]['old_red_no'])
            excel[i]['oldCaseNo'] = excel[i]['old_case_no']+" ("+excel[i]['old_red_no']+")";
          else 
            excel[i]['oldCaseNo'] = excel[i]['old_case_no'];

          for(var x=0;x<17;x++){
            if(x==0)
              data.push(excel[i]['case_type_desc']);         
            if(x==1)
              data.push(excel[i]['case_no']);    
            if(x==2)
              data.push(excel[i]['case_date']);   
            if(x==3)
              data.push(excel[i]['red_no']);
            if(x==4)
              data.push(excel[i]['judging_date']);
            if(x==5)
              data.push(excel[i]['dateAppoint']);
            if(x==6)
              data.push(excel[i]['pros_desc']);
            if(x==7)
              data.push(excel[i]['accu_desc']);
            if(x==8)
              data.push(excel[i]['alle_desc']);
            if(x==9)
              data.push(excel[i]['indict_desc']);
            if(x==10)
              data.push(excel[i]['amphur_name']);
            if(x==12)
              data.push(excel[i]['deposit']);
            if(x==12)
              data.push(excel[i]['guar_pros_desc']);
            if(x==13)
              data.push(excel[i]['judge_name']);
            if(x==14)
              data.push(excel[i]['oldCaseNo']);
            if(x==15)
              data.push(excel[i]['admit_desc']);
            if(x==17)
              data.push(excel[i]['transfer_court_name']);
          }
        
          extend[i] = $.extend([], data)
          data = [];
          //extend[i] = Object.values(data)
        }
      });
      if(bar){
        var objExcel = [];
        objExcel['deposit'] = this.deposit;
        objExcel['data'] = extend;
        console.log(objExcel)
        this.excelService.exportAsExcelFile(objExcel,'fca0300' ,this.programName);
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

  retToPage(run_id:any){
    //let winURL = this.authService._baseUrl;
    //winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.retPage;
    let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/'+this.retPage;
    myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  }


}







