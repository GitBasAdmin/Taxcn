import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,ViewChildren,OnDestroy,Injectable,AfterContentInit, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PrintReportService } from 'src/app/services/print-report.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
/* import { DatalistReturnMultipleComponent } from '@app/components/modal/datalist-return-multiple/datalist-return-multiple.component';
import { ModalReturnAlleComponent } from '@app/components/modal/modal-return-alle/modal-return-alle.component';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component'; */
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';

import {
  CanActivateFn, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
  NavigationError,Routes
} from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
import * as _ from "lodash";
import * as $ from 'jquery';
declare var myExtObject: any;

// import { ConfirmBoxClass } from '@costlydeveloper/ngx-awesome-popup/ngx-awesome-popup/types/confirm-box/core/model';
interface litigant {
  lit_running : number,
  seq : number,
  title : string,
  name : number,
  card_type_name : string,
  lit_type_desc : string,
  id_card : string,
  card_type : number,
  status_desc : string,
  image_name : string,
  license_no : string,
  address: string,
  sex: number,
  gender: string,
  age: number,
  inter_name: string,
  nation_name: string,
  occ_desc: string,
  tel_no: string,
  fax_no: string,
  email: string,
  addres: string,
  addr_no: string,
  moo: string,
  soi: string,
  road: string,
  near_to: string,
  tambon_name: string,
  amphur_name: string,
  prov_name: string,
  send_amt:string,
  notice_amt_remark:string,
  addr_no_eng: string,
  moo_eng: string,
  soi_eng: string,
  road_eng: string,
  near_to_eng: string,
  tambon_name_eng: string,
  amphur_name_eng: string,
  prov_name_eng: string,
  revoke_flag:number,
  create_dep_name: string,
  create_user: string,
  create_date: string,
  update_dep_name: string,
  update_user: string,
  update_date: string
}

@Component({
  selector: 'app-fpo0110,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fpo0110.component.html',
  styleUrls: ['./fpo0110.component.css']
})


export class Fpo0110Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
 
  getPersType:any;//selPersType=2;
  getCardType:any;//selCardType=1;
  getPersTitle:any;selPersTitle:any;
  getProv:any;selProv:any;
  getAmphur:any;selAmphur:any;
  getTambon:any;selTambon:any;
  getInter:any;//selInter:'ไทย';
  getOccupation:any;//selOccupation='รับจ้าง';
  getNation:any;selNation:any;
  getStatus:any;selStatus:'ไม่ระบุ';
  getSex:any;
  getLitType:any;
  getLitType2:any;
  dataLitigant:any = [];
  dataSource:any=[];
  getCourtAmphur:any;
  getCourtTambon:any;
  getPostCode:any;
  getSendAmt:any;
  title:any;
  idCard:any;
  idCard0:any;
  idCard1:any;
  idCard2:any;
  idCard3:any;
  idCard4:any;
  modalType:any;
  editType:any;
  persType:any;
  
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  items:any;
  dataHead:any = [];
  c_title:any;
  c_id:any;
  c_yy:any;
  counter=0;
  myExtObject: any;
  asyncObservable: Observable<string>;
  runId:any;
  run_id:any;
  program:any;
  litType:any;
  litRunning :any;
  litFlag:any;
 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  //runId = parseInt(this.route.snapshot.paramMap.get('run_id'));
  //litType = parseInt(this.route.snapshot.paramMap.get('lit_type'));
  //litRunning = parseInt(this.route.snapshot.paramMap.get('lit_running'));
  public loadModalComponent: boolean = false;
  public loadCopyComponent: boolean = false;
  public loadDataListOrgComponent: boolean = false;
  public loadReqLawyerComponent: boolean = false;
  public loadLawyerComponent: boolean = false;
  public loadComponent: boolean = false;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldName3:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  masterSelect:boolean = false;
  buttonDel:boolean = false;
  getDataLitigant$: Observable<[litigant]>;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('sProv') sProv : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
  @ViewChild('selSex') selSex : NgSelectComponent;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
  ){ }
   
  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };

    this.activatedRoute.queryParams.subscribe(params => {

      this.program = params['program'];
      this.runId = params['run_id'];
      this.litType = 9;
      this.litRunning = params['lit_running'];
      if(this.runId>0){
        this.getLitData();
        this.getCaseRecord();
      }
      if(!this.litRunning){
        this.setDefaultPage();
      }else{
        this.editData(this.litRunning);
      }

    });
     
    
    
    this.successHttp();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
      //======================== pcard_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcard_type",
      "field_id" : "card_type_id",
      "field_name" : "card_type_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCardType = getDataOptions;
      },
      (error) => {}
    )
     //======================== pnation ======================================
     var student = JSON.stringify({
      "table_name" : "pnation",
      "field_id" : "nation_id",
      "field_name" : "nation_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getNation = getDataOptions;
      },
      (error) => {}
    )
    //======================== pinter ======================================
    var student = JSON.stringify({
      "table_name" : "pinter",
      "field_id" : "inter_id",
      "field_name" : "inter_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getInter = getDataOptions;
      },
      (error) => {}
    )
    //======================== poccupation ======================================
    var student = JSON.stringify({
      "table_name" : "poccupation",
      "field_id" : "occ_id",
      "field_name" : "occ_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOccupation= getDataOptions;
        //console.log(this.getOccupation)
      },
      (error) => {}
    )
    //======================== paccu_status ======================================
    var student = JSON.stringify({
      "table_name" : "paccu_status",
      "field_id" : "status_id",
      "field_name" : "status_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ไม่ระบุ'});
        this.getStatus = getDataOptions;
        
      },
      (error) => {}
    )
     //======================== ppers_type ======================================
     var student = JSON.stringify({
      "table_name" : "ppers_type",
      "field_id" : "pers_type",
      "field_name" : "pers_type_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getPersType = getDataOptions;
        //this.dataLitigant.pers_type = this.litType
      },
      (error) => {}
    )
      //======================== ppers_title ======================================
    var student = JSON.stringify({
      "table_name" : "ppers_title",
      "field_id" : "pers_title_no",
      "field_name" : "pers_title",
      "field_name2" : "pers_sex",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getPersTitle = getDataOptions;
      },
      (error) => {}
    )
    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "field_name2" : "lit_flag",
      "condition" : " AND NVL(lit_flag,0) NOT IN('g')",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getLitType = getDataOptions;
      },
      (error) => {}
    )
    //======================== plit_type2 ======================================
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'เลือกประเภทคู่ความ'});
        this.getLitType2 = getDataOptions;
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
    //======================== เพศ	 ======================================
    this.getSex = [{fieldIdValue: '1',fieldNameValue: 'ชาย'},{fieldIdValue: '2',fieldNameValue: 'หญิง'}];
    
    
      

  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fpo0110"
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

  setDefaultPage(){
    this.dataLitigant = [];
    this.idCard0='';this.idCard1='';this.idCard2='';this.idCard3='';this.idCard4='';this.idCard='';
  //============= set defalut data ==============//
  this.dataLitigant.pers_type = 2;
  this.dataLitigant.card_type = 1;
  this.dataLitigant.inter_id = 1;
  this.dataLitigant.occ_id = 14;
  if(this.litType){
    this.dataLitigant.lit_type = this.litType;
  }else{
    this.dataLitigant.lit_type = null;
    this.dataLitigant.seq = 1;
  }
  this.dataLitigant.send_amt = '0.00';
  this.dataLitigant.country_id = 1;
  this.dataLitigant.status = 0;
  this.dataLitigant.notice_remark_flag = false;
  this.runSeq(9);
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

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
    if(child=='lRunning'){
      if(this[master]==true){
        this.buttonDel = true;
      }else{
        this.buttonDel = false;
      }
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
    var isChecked = obj.every(function(item:any) {
      return item[child] == false;
    })
    if(child=='lRunning'){
      if(isChecked==true){
        this.buttonDel = false;
      }else{
        this.buttonDel = true;
      }
    }
  }

    directiveDate(date:any,obj:any){
        this.dataLitigant[obj] = date;
    }
  
    calAge(bdate:any){
      if(bdate){
        var assing_date = bdate.substr(0, 2);
        var assing_month = bdate.substr(3, 2);
        var assing_year = bdate.substr(6, 4);
        var today = new Date();	
        var birthDate = new Date(assing_month+'/'+assing_date+'/'+(parseInt(assing_year)-543));
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        this.dataLitigant.age = age;
      }
				  
    }

    clickOpenMyModal(type:any){
      if(type==1 || type==4){
        var student = JSON.stringify({
          "table_name" : "pjail",
           "field_id" : "jail_id",
           "field_name" : "jail_name",
           "field_name2" : "notice_to",
           "search_id" : "",
           "search_desc" : "",
           "condition" : "",
           "userToken" : this.userData.userToken});
           console.log(student)
           this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
            (response) =>{
              console.log(response)
              const modalRef = this.ngbModal.open(DatalistReturnComponent)
              modalRef.componentInstance.items = response
              modalRef.componentInstance.value1 = "pjail"
              modalRef.componentInstance.value2 = "jail_id"
              modalRef.componentInstance.value3 = "jail_name"
              modalRef.componentInstance.value6 = "notice_to"
              modalRef.componentInstance.types = 1
              modalRef.result.then((item: any) => {
                if(item){
                  if(type==1){
                    this.dataLitigant.notice_to = this.dataLitigant.imprison_id = item.fieldIdValue;
                    this.dataLitigant.noticeto_name = this.dataLitigant.imprison_name = item.fieldNameValue;
                    this.dataLitigant.noticeto_position = item.fieldNameValue2;   
                    
                    this.dataLitigant.status = 1;
                  }else{
                    this.dataLitigant.imprison_id = item.fieldIdValue;
                    this.dataLitigant.imprison_name = item.fieldNameValue;                     
                  }
                }
              })
            },
            (error) => {}
          )
      }else if(type==2 || type==5){
        var student = JSON.stringify({
          "table_name" : "ppolice",
           "field_id" : "police_id",
           "field_name" : "police_name",
           "field_name2" : "position_name",
           "search_id" : "",
           "search_desc" : "",
           "condition" : "",
           "userToken" : this.userData.userToken});
           console.log(student)
           this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
            (response) =>{
              console.log(response)
              const modalRef = this.ngbModal.open(DatalistReturnComponent)
              modalRef.componentInstance.items = response
              modalRef.componentInstance.value1 = "ppolice"
              modalRef.componentInstance.value2 = "police_id"
              modalRef.componentInstance.value3 = "police_name"
              modalRef.componentInstance.value6 = "position_name"
              modalRef.componentInstance.types = 1
              modalRef.result.then((item: any) => {
                if(item){
                  if(type==2){
                    this.dataLitigant.notice_to = this.dataLitigant.imprison_id = item.fieldIdValue;
                    this.dataLitigant.noticeto_name = this.dataLitigant.imprison_name = item.fieldNameValue;
                    this.dataLitigant.noticeto_position = item.fieldNameValue2;
                  }else{
                    this.dataLitigant.imprison_id = item.fieldIdValue;
                    this.dataLitigant.imprison_name = item.fieldNameValue;
                  }
                }
              })
            },
            (error) => {}
          )
      }else if(type==3 || type==6){
        var student = JSON.stringify({
          "table_name" : "phospital",
           "field_id" : "hospital_id",
           "field_name" : "hospital_name",
           "search_id" : "",
           "search_desc" : "",
           "condition" : "",
           "userToken" : this.userData.userToken});
           console.log(student)
           this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
            (response) =>{
              console.log(response)
              const modalRef = this.ngbModal.open(DatalistReturnComponent)
              modalRef.componentInstance.items = response
              modalRef.componentInstance.value1 = "phospital"
              modalRef.componentInstance.value2 = "hospital_id"
              modalRef.componentInstance.value3 = "hospital_name"
              modalRef.componentInstance.types = 1
              modalRef.result.then((item: any) => {
                if(item){
                  if(type==3){
                    this.dataLitigant.notice_to  = item.fieldIdValue;
                    this.dataLitigant.noticeto_name = item.fieldNameValue;
                  }else{
                    this.dataLitigant.imprison_id = item.fieldIdValue;
                    this.dataLitigant.imprison_name = item.fieldNameValue;
                  }
                }
              })
            },
            (error) => {}
          )
      }
    }

    getCaseRecord(){
      var run_id = this.runId?this.runId:this.dataHead.run_id;
      var student = JSON.stringify({
        "table_name" : "pcase",
        "condition" : " AND run_id='"+run_id+"'",
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getAllRecData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          if(getDataOptions.length){
            this.c_title = getDataOptions[0].title;
            this.c_id = getDataOptions[0].id;
            this.c_yy = getDataOptions[0].yy;
          }
        },
        (error) => {}
      );
    }
  

  getLitData(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(this.runId){
      var student = JSON.stringify({
        "run_id" : this.runId,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getLitigantData', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          this.buttonDel = false;
          console.log(this.items)
          if(this.items.data.length){
            this.items.data.forEach((x : any ) => x.lRunning = false);
            this.getDataLitigant$ = of(this.items.data);

            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      );
    }else if(this.dataHead.run_id){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getLitigantData', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          this.buttonDel = false;
          console.log(this.items)
          if(this.items.data.length){
            this.items.data.forEach((x : any ) => x.lRunning = false);
            this.getDataLitigant$ = of(this.items.data);
            this.rerender();
            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      );
    }
    
  }
  onClickSaveData(data:any,event:any): void {
    //var case_type = this.dataHead.case_type;
    var name = (typeof data.name == "undefined" || data.name == null) ? '' : data.name;
    var seq = (typeof data.seq == "undefined" || data.seq == null) ? 0 : data.seq;
    var lit_type = 9;
    var pers_type = (typeof data.pers_type == "undefined" || data.pers_type == null) ? 0 : data.pers_type;
    var occ_id = (typeof data.occ_id == "undefined" || data.occ_id == null) ? 0 : data.occ_id;
    var sex = (typeof data.sex == "undefined" || data.sex == null) ? 0 : data.sex;
    var age = (typeof data.age == "undefined" || data.age == null) ? 0 : data.age;
    var inter_id = (typeof data.inter_id == "undefined" || data.inter_id == null) ? 0 : data.inter_id;
    var prov_id = (typeof data.prov_id == "undefined" || data.prov_id == null) ? 0 : data.prov_id;
    var amphur_id = (typeof data.amphur_id == "undefined" || data.amphur_id == null) ? 0 : data.amphur_id;
    var tambon_id = (typeof data.tambon_id == "undefined" || data.tambon_id == null) ? 0 : data.tambon_id;
    var alert = 0;
    if(data.pers_type != 2)
      data.card_type=null;
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(name==''){
			confirmBox.setMessage('กรุณาป้อนข้อมูลชื่อคู่ความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
      alert++;
		}else if(seq==0){
      confirmBox.setMessage('กรุณาป้อนลำดับที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
      alert++;
    }else if(lit_type==10){
      var occ = this.getOccupation.filter((x:any) => x.fieldIdValue === occ_id) ;
      if(occ.length!=0){
        var strOcc = occ[0].fieldNameValue;
        if(strOcc.indexOf('ทนาย')<0){
          confirmBox.setMessage('ข้อมูลอาชีพจะต้องเป็นทนายความ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }
      }
    }else if((lit_type==2)&&(pers_type==2)){
      
      if(sex==0){
				confirmBox.setMessage('คุณยังไม่ได้ระบุข้อมูลเพศ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
			}
      if(age==0){
				if(pers_type!='1'){
          confirmBox.setMessage('คุณยังไม่ป้อนข้อมูลอายุ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
				}
        if(inter_id==0){
          confirmBox.setMessage('คุณยังไม่ป้อนข้อมูลสัญชาติ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }
        if(prov_id==0){
          confirmBox.setMessage('คุณยังไม่ป้อนข้อมูลจังหวัด');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }
        if(amphur_id==0){
          confirmBox.setMessage('คุณยังไม่ป้อนข้อมูลอำเภอ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }
        if(tambon_id==0){
          confirmBox.setMessage('คุณยังไม่ป้อนข้อมูลตำบล');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }
			}
    }
      //console.log(data)
      //console.log(this.dataSource)
    //if(!alert){
      if(data.lit_running){
        var dataUpdate = this.difference(data,this.dataSource);
        if(_.isEmpty(data)){
          confirmBox.setMessage('กรุณาแก้ไขข้อมูลก่อนการจัดเก็บ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
        }else{
          //console.log('แก้ไข');
          if((lit_type==1)||(lit_type==2)||(lit_type==3)||(lit_type==4)){
            if((age!=0) && (age<18)){
              if(pers_type!='1'){
                confirmBox.setMessage('ผู้ต้องหาอายุต่ำกว่า 18 ปี ต้องยื่นฟ้องที่ศาลเยาวชน');
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
          dataUpdate['userToken'] = this.userData.userToken;
          dataUpdate['lit_running'] = data.lit_running;
          dataUpdate['lit_type'] = data.lit_type;
          dataUpdate['run_id'] = data.run_id;
          dataUpdate['seq'] = parseInt(data['seq']);
          var val = this.getPersTitle.filter((x:any) => x.fieldIdValue === data.title);
            if(val.length!=0){
              dataUpdate['title'] = val[0].fieldNameValue;
            }
          if(data.card_type==1){
            dataUpdate['id_card'] = this.idCard0+this.idCard1+this.idCard2+this.idCard3+this.idCard4;
          }else{
            dataUpdate['id_card'] = this.idCard;
          }
          if(isNaN(dataUpdate['id_card']))
            delete dataUpdate['id_card'];
          if(parseInt(dataUpdate.send_amt)<1)
            delete dataUpdate['send_amt'];
          if(this.dataLitigant.license_no)
            dataUpdate['license_no'] = this.dataLitigant.license_no;
          //console.log(dataUpdate);
          this.saveLitData(dataUpdate,2,event);
        }
        
      }else{
        //console.log('บันทึก');
        if((lit_type==1)||(lit_type==2)||(lit_type==3)||(lit_type==4)){
          if((age!=0) && (age<18)){
            if(pers_type!='1'){
              confirmBox.setMessage('ผู้ต้องหาอายุต่ำกว่า 18 ปี ต้องยื่นฟ้องที่ศาลเยาวชน');
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
        data['userToken'] = this.userData.userToken;
        data['seq'] = parseInt(data['seq']);
        data['lit_type'] = data.lit_type;
        data['run_id'] = this.dataHead.run_id?this.dataHead.run_id:this.runId;
        var val = this.getPersTitle.filter((x:any) => x.fieldIdValue === data.title);
            if(val.length!=0){
              data['title'] = val[0].fieldNameValue;
            }
        if(data.card_type==1){
          data['id_card'] = this.idCard0+this.idCard1+this.idCard2+this.idCard3+this.idCard4;
        }else{
          data['id_card'] = this.idCard;
        }
        if(isNaN(data['id_card']))
          delete data['id_card'];
        if(parseInt(data.send_amt)<1)
          delete data['send_amt'];
        if(this.dataLitigant.license_no)
          data['license_no'] = this.dataLitigant.license_no;
        //console.log(data);
        this.saveLitData(data,1,event);
      }
    //}
    
  }

  saveLitData(obj:any,type:any,event:any){
    console.log(obj)
    this.editType = null;
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(type==1){
      $.extend({}, obj);
      obj = $.extend({}, obj);
      console.log(obj)

      this.SpinnerService.show();
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/insertLitigant', JSON.stringify(obj) , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          //console.log(alertMessage)
          if(alertMessage.result==0){
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else{
            //this.SpinnerService.hide();
            //this.sendDataToParent(obj.run_id);
            this.dataLitigant.lit_running = alertMessage.lit_running;
            //this.genNotice();
            this.editData(alertMessage.lit_running)
            this.getLitData();
            confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                if(event==1)
                  this.clearForm();//this.reloadNewPage();//location.reload();
                // else
                //   this.runId = this.dataHead.run_id;
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }else{
      this.SpinnerService.show();
      console.log(obj);
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/updateLitigant', JSON.stringify(obj) , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          console.log(alertMessage)
          if(alertMessage.result==0){
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else{
            this.SpinnerService.hide();
            //this.sendDataToParent(obj.run_id);
            this.getLitData();
            confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                //this.rerender();
                if(event==1)
                  this.clearForm();//this.reloadNewPage();//location.reload();
                // else
                //   this.runId = this.dataHead.run_id;
              }
              subscription.unsubscribe();
            });
            
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }
  difference(object:any, base:any) {
    return transform(object, (result:any, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
      }
    });
  }
  splitCard(card:any){
    if(card){
      var idCard = [];
      idCard[0] = card.substring(0, 1);
      idCard[1] = card.substring(1, 5);
      idCard[2] = card.substring(5, 10);
      idCard[3] = card.substring(10, 12);
      idCard[4] = card.substring(12, 13);
      return idCard[0]+"-"+idCard[1]+"-"+idCard[2]+"-"+idCard[3]+"-"+idCard[4];
    }else{
      return '';
    }
  }
  editData(running:any){
    this.editType = 1;
    this.idCard0='';this.idCard1='';this.idCard2='';this.idCard3='';this.idCard4='';
    this.SpinnerService.show();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "lit_running" : running,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getLitigant', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.dataSource = JSON.parse(JSON.stringify(response));
        this.dataLitigant = getDataOptions;
        if(getDataOptions.sex)
          this.dataLitigant.sex = getDataOptions.sex.toString();
        if(this.dataLitigant.id_card){
          this.idCard0 = this.dataLitigant.id_card.substring(0, 1);
          this.idCard1 = this.dataLitigant.id_card.substring(1, 5);
          this.idCard2 = this.dataLitigant.id_card.substring(5, 10);
          this.idCard3 = this.dataLitigant.id_card.substring(10, 12);
          this.idCard4 = this.dataLitigant.id_card.substring(12, 13);
          this.idCard = this.dataLitigant.id_card;
        }
        this.title = '';
        console.log(this.dataLitigant)
        if(this.dataLitigant.prov_id)
          this.changeProv(this.dataLitigant.prov_id,'')
        this.SpinnerService.hide();
      },
      (error) => {this.SpinnerService.hide();}
    )
  }

  changeLitType(event:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(this.dataSource && this.dataSource.lit_running && this.dataSource.lit_type==2 && this.dataLitigant.lit_type==10){
			this.SpinnerService.hide();
      confirmBox.setMessage('ไม่สามารถเปลี่ยนจำเลยเป็นทนายได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.dataLitigant.lit_type = 2;
        }
        subscription.unsubscribe();
      });
    }else{
      this.getLitFlag(event,1);
    }
    if(this.dataLitigant.lit_type==8){
      this.dataLitigant.pers_type = 1;
      this.idCard ='';this.idCard0='';this.idCard1='';this.idCard2='';this.idCard3='';this.idCard4='';
    }else if(this.dataLitigant.lit_type!=8){
      this.dataLitigant.pers_type = 2;
      this.dataLitigant.card_type = 1;
      this.idCard ='';
    }
  }

  getLitFlag(event:any,type:any){
    var litFlag = this.getLitType.filter((x:any) => x.fieldIdValue === parseInt(event));
    console.log(litFlag)
    
    if(litFlag.length && litFlag[0].fieldNameValue2){
      if(litFlag[0].fieldNameValue2=='a'){
        this.dataLitigant.occ_id = 6;
      }
      this.litFlag = litFlag[0].fieldNameValue2;
      if(type==1)//ถ้าเลือกประเภทคู่ความเอง
        this.dataLitigant.lit_type2 = this.getLitType2[0].fieldIdValue;
      
        if(this.dataLitigant.name){
          var name = this.dataLitigant.name?this.dataLitigant.name:'';
          var n = parseInt(name.indexOf(litFlag[0].fieldNameValue));
          console.log(n)
          var new_name = '';
          if(n>=0){
            new_name = this.dataLitigant.name.substring(0, n);
          }else{
            new_name = this.dataLitigant.name;
          }
          console.log(new_name)
          if(this.litFlag){
            var litFlag2 = this.getLitType2.filter((x:any) => x.fieldIdValue === parseInt(this.dataLitigant.lit_type2));
            //console.log(this.getLitType2)
            //console.log(this.dataLitigant.lit_type2)
            //console.log(litFlag2)
            
            if(litFlag2.length){
              
              if(new_name){
                if(this.dataLitigant.lit_type_seq){
                  new_name=new_name.trimEnd()+' '+litFlag[0].fieldNameValue+litFlag2[0].fieldNameValue+"ที่ "+this.dataLitigant.lit_type_seq;
                }else{
                  new_name=new_name.trimEnd()+' '+litFlag[0].fieldNameValue+litFlag2[0].fieldNameValue;
                }
              }else{
                if(this.dataLitigant.lit_type_seq){
                  new_name=litFlag[0].fieldNameValue+litFlag2[0].fieldNameValue+"ที่ "+this.dataLitigant.lit_type_seq;
                }else{
                  new_name=litFlag[0].fieldNameValue+litFlag2[0].fieldNameValue;
                }
              }
              
            }
            this.dataLitigant.name = new_name;
          }
          
        }else{
          var litFlag2 = this.getLitType2.filter((x:any) => x.fieldIdValue === parseInt(this.dataLitigant.lit_type2));
          if(litFlag2.length)
            this.dataLitigant.name = litFlag[0].fieldNameValue+litFlag2[0].fieldNameValue;
        }
        /*
      if(this.dataLitigant.name){
          var name = this.dataLitigant.name?this.dataLitigant.name:'';
          var n = parseInt(name.indexOf(litFlag[0].fieldNameValue));
          console.log(n)
          var new_name = '';
          if(n>=0){
            new_name = this.dataLitigant.name.substring(0, n);
          }else{
            new_name = this.dataLitigant.name;
          }
          console.log(new_name)
          
          if(this.dataLitigant.lit_type_seq){
            new_name=new_name+' '+litFlag[0].fieldNameValue+this.dataLitigant.lit_type2+"ที่ "+this.dataLitigant.lit_type_seq;
          }else{
            new_name=new_name+' '+litFlag[0].fieldNameValue+this.dataLitigant.lit_type2;
          }
 
      }else{
        this.dataLitigant.name = litFlag[0].fieldNameValue+this.dataLitigant.lit_type2;
      }
      */
    }else{
      this.litFlag = null;
      this.dataLitigant.lit_type2 = null;
    }
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
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAmphur = getDataOptions;
        setTimeout(() => {
          if(this.dataLitigant.amphur_id)
            this.changeAmphur(this.dataLitigant.amphur_id,type);
        }, 100);
        
      },
      (error) => {}
    )
    if(typeof province=='undefined' || type==1){
      this.sAmphur.clearModel();
      this.sTambon.clearModel();
      this.dataLitigant.post_no = '';
    }
  }

  changeAmphur(Amphur:any,type:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.dataLitigant.prov_id+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTambon = getDataOptions;       
      },
      (error) => {}
    )
    if(typeof Amphur=='undefined' || type==1){
      this.sTambon.clearModel();
      this.dataLitigant.post_no = '';
    }
  }

  changeTambon(Tambon:any,type:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "post_code",
      "condition" : " AND prov_id='"+this.dataLitigant.prov_id+"' AND amphur_id='"+this.dataLitigant.amphur_id+"' AND tambon_id='"+Tambon+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getPostCode = getDataOptions;
        console.log(this.getPostCode)
        if(this.getPostCode.length){
          this.dataLitigant.post_no = this.getPostCode[0].fieldNameValue;
        }
        this.amtSentNotice(this.dataLitigant.prov_id,this.dataLitigant.amphur_id,this.dataLitigant.tambon_id,this.dataLitigant.moo,this.dataHead.case_court_type);
      },
      (error) => {}
    )
  }

  amtSentNotice(prov:any,amphur:any,tambon:any,moo:any,court_type:any){
    if(typeof moo== 'undefined')
      moo = '';
    if(typeof court_type== 'undefined')
      court_type = '';
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "prov_id" : prov,
        "amphur_id" : amphur,
        "tambon_id" : tambon,
        "moo" : moo,
        "case_court_type" : court_type,
        "userToken" : this.userData.userToken
      });
      console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNoticeAmt', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getSendAmt = getDataOptions;
        console.log(getDataOptions)
        if(this.getSendAmt.result==1 && this.getSendAmt.data.length){
          this.dataLitigant.notice_amt_remark = this.getSendAmt.data[0].notice_amt_remark;
          this.dataLitigant.send_amt = this.getSendAmt.data[0].amtsentnotice;
        }else{
          this.dataLitigant.notice_amt_remark = '';
          this.dataLitigant.send_amt = '0.00';
        }
      },
      (error) => {}
    )
    //console.log(prov+":"+amphur+":"+tambon+":"+moo+":"+court_type)
  }

  /* fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    this.c_title = this.dataHead.ptitle;
    this.c_id = this.dataHead.pid;
    this.c_yy = this.dataHead.pyy;
    //console.log(this.dataHead.buttonSearch)
    if(this.dataHead.buttonSearch==1){
      
      let winURL = this.authService._baseUrl;
      winURL = winURL.substring(0,winURL.lastIndexOf("#")+1)+"/fpo0110/";
      //location.href=winURL+'?run_id='+this.dataHead.run_id;
      location.replace(winURL+'?run_id='+this.dataHead.run_id);
      //this.runId = this.dataHead.run_id;

    }
    this.dataHead.buttonSearch = null;
  } */

  

  runSeq(type:any){
    
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "run_id" : this.runId,
        "lit_type" : type,
        "userToken" : this.userData.userToken
      });
      console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/nextLitigantSeq', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(getDataOptions.result==1){
          this.dataLitigant.seq = getDataOptions.data[0].seq;
        }
      },
      (error) => {}
    )
  }

  checkPers(event:any){
    console.log(event);
    if(event!=2){
      this.dataLitigant.title = this.title = '';
      this.idCard0='';this.idCard1='';this.idCard2='';this.idCard3='';this.idCard4='';
    }else{
      this.idCard = '';
    }
    
  }

  changePersType(event:any,type:any){
    if(type==1){
      var sex = this.getPersTitle.filter((x:any) => x.fieldIdValue === parseInt(event.target.value)) ;
    }else{
        var sex = this.getPersTitle.filter((x:any) => x.fieldIdValue === event);
    }

      if(sex[0].fieldNameValue2){
        this.dataLitigant.sex = sex[0].fieldNameValue2.toString();
      }else{
        this.dataLitigant.sex = null;
      }
  }

  tabChangeSelect(objName:any,objData:any,event:any,type:any){
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === parseInt(event.target.value)) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      console.log(objData)
      //console.log(event.target.value)
      console.log(val)
      if(val.length!=0){
        this.dataLitigant[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
      }
      }else{
        this.dataLitigant[objName] = null;
        this[objName] = null;
      }
  }

  closeWin(){
    var run_id = this.runId?this.runId:this.dataHead.run_id;
    console.log(run_id)
    if(run_id)
      window.opener.myExtObject.openerReloadRunId(run_id);
    else
      window.opener.myExtObject.openerReloadRunId(0);
    window.close();
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    if(this.modalType==1){
      this.loadModalComponent = true;  //password confirm
      this.loadCopyComponent = false;
      this.loadDataListOrgComponent = false;
      this.loadReqLawyerComponent = false;
      this.loadLawyerComponent = false;
      this.loadComponent = false;
      $("#exampleModal").find(".modal-content").css("width","650px");
      //$("#exampleModal").find(".modal-body").css("height","100px");
      //$("#exampleModal").css({"background":"rgba(51,32,0,.4)"});
    }else if(this.modalType==2){
      $("#exampleModal").find(".modal-content").css("width","800px");
      this.loadModalComponent = false;  //password confirm
      this.loadCopyComponent = true;
      this.loadDataListOrgComponent = false;
      this.loadReqLawyerComponent = false;
      this.loadLawyerComponent = false;
      this.loadComponent = false;
    }else if(this.modalType==3){
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.persType = this.dataLitigant.pers_type;
      this.loadModalComponent = false;
      this.loadCopyComponent = false;
      this.loadDataListOrgComponent = true;
      this.loadReqLawyerComponent = false;
      this.loadLawyerComponent = false;
      this.loadComponent = false;
    }else if(this.modalType==4){
      $("#exampleModal").find(".modal-content").css("width","1050px");
      this.loadModalComponent = false;
      this.loadCopyComponent = false;
      this.loadDataListOrgComponent = false;
      this.loadReqLawyerComponent = false;
      this.loadLawyerComponent = true;
      this.loadComponent = false;
    }else if(this.modalType==5){
      $("#exampleModal").find(".modal-content").css("width","1050px");
      this.loadModalComponent = false;
      this.loadCopyComponent = false;
      this.loadDataListOrgComponent = false;
      this.loadReqLawyerComponent = true;
      this.loadLawyerComponent = false;
      this.loadComponent = false;
    }else if(this.modalType==6){
      $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
            "table_name" : "pprovince",
            "field_id" : "prov_id",
            "field_name" : "prov_name",
            "order_by" : " prov_name ASC ",
            "userToken" : this.userData.userToken
          });
        this.listTable='pprovince';
        this.listFieldId='prov_id';
        this.listFieldName='prov_name';
        this.listFieldCond="";
    }

    if(this.modalType==6){
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          this.loadModalComponent = false;
          this.loadCopyComponent = false;
          this.loadDataListOrgComponent = false;
          this.loadReqLawyerComponent = false;
          this.loadLawyerComponent = false;
          this.loadComponent = true;
        },
        (error) => {}
      )
    }
  }

  closeModal(){
    this.loadModalComponent = false; //password confirm
    this.loadCopyComponent = false;
    this.loadDataListOrgComponent = false;
    this.loadReqLawyerComponent = false;
    this.loadLawyerComponent = false;
    this.loadComponent = false;
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
                  var dataDel = [],dataTmp=[];
                  dataDel['run_id'] = this.dataHead.run_id;
                  dataDel['log_remark'] = chkForm.log_remark;
                  dataDel['userToken'] = this.userData.userToken;

                  if(this.modalType=='1'){
                    var bar = new Promise((resolve, reject) => {
                      this.items.data.forEach((ele, index, array) => {
                            if(ele.lRunning == true){
                              dataTmp.push(this.items.data[index]);
                            }
                        });
                    });
                    
                    if(bar){
                      this.SpinnerService.show();
                      let headers = new HttpHeaders();
                      headers = headers.set('Content-Type','application/json');
                      dataDel['data'] = dataTmp;
                      var data = $.extend({}, dataDel);
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/deleteAllLitigantData', data , {headers:headers}).subscribe(
                        (response) =>{
                          let alertMessage : any = JSON.parse(JSON.stringify(response));
                          if(alertMessage.result==0){
                            this.SpinnerService.hide();
                          }else{
                            confirmBox.setMessage(alertMessage.error);
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.getLitData();
                                this.runId = this.dataHead.run_id;
                              }
                              subscription.unsubscribe();
                            });
                            
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
                    }
                  }
                  
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
                if (resp.success==true){
                  this.closebutton.nativeElement.click();
                }
                subscription.unsubscribe();
              });
            }
          },
          (error) => {}
        );

    }
    
  }

  searchIdCard(){
    if(this.idCard0 && this.idCard1 && this.idCard2 && this.idCard3 && this.idCard4){
      var idCard = this.idCard0+this.idCard1+this.idCard2+this.idCard3+this.idCard4;
      if(idCard.length==13){
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var dataDel = [];
        dataDel['id_card'] = this.idCard0+this.idCard1+this.idCard2+this.idCard3+this.idCard4;
        dataDel['userToken'] = this.userData.userToken;
        var data = $.extend({}, dataDel);
        console.log(data)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/findLitigant', data , {headers:headers}).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            if(this.editType){
              alertMessage.data[0].run_id = this.dataLitigant.run_id;
              alertMessage.data[0].lit_running = this.dataLitigant.lit_running;
              alertMessage.data[0].lit_type = this.dataLitigant.lit_type;
              alertMessage.data[0].seq = this.dataLitigant.seq;
              alertMessage.data[0].id_card = this.dataLitigant.id_card;
              alertMessage.data[0].pers_type = this.dataLitigant.pers_type;
              alertMessage.data[0].card_type = this.dataLitigant.card_type;
            }else{
              alertMessage.data[0].run_id = this.dataHead.run_id;
              alertMessage.data[0].lit_running = this.dataLitigant.lit_running;
              alertMessage.data[0].lit_type = this.dataLitigant.lit_type;
              alertMessage.data[0].seq = this.dataLitigant.seq;
              alertMessage.data[0].id_card = this.dataLitigant.id_card;
              alertMessage.data[0].pers_type = this.dataLitigant.pers_type;
              alertMessage.data[0].card_type = this.dataLitigant.card_type;
            }
            if(alertMessage.result==1){
              let getDataOptions : any = JSON.parse(JSON.stringify(alertMessage.data[0]));
              this.dataLitigant = getDataOptions;
              if(this.dataLitigant.id_card){
                this.idCard0 = this.dataLitigant.id_card.substring(0, 1);
                this.idCard1 = this.dataLitigant.id_card.substring(1, 5);
                this.idCard2 = this.dataLitigant.id_card.substring(5, 10);
                this.idCard3 = this.dataLitigant.id_card.substring(10, 12);
                this.idCard4 = this.dataLitigant.id_card.substring(12, 13);
                this.idCard = this.dataLitigant.id_card;
              }
              this.title = '';
              console.log(this.dataLitigant)
              if(this.dataLitigant.prov_id)
                this.changeProv(this.dataLitigant.prov_id,'')
              this.SpinnerService.hide();
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    }
  }

  reloadNewPage(){
    this.idCard0='';this.idCard1='';this.idCard2='';this.idCard3='';this.idCard4='';
    let winURL = this.authService._baseUrl;
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+"fpo0110";
    var href = '';
    if(this.program && this.runId){
      href = winURL+"?program="+this.program+'&run_id='+this.runId+'&lit_type='+this.dataLitigant.lit_type+'&v='+Math.ceil(Math.random()*1000);
    }if(!this.program && this.runId){
      href = winURL+"?run_id="+this.runId+'&lit_type='+this.dataLitigant.lit_type+'&v='+Math.ceil(Math.random()*1000);
    }else{
      href = winURL+'?v='+Math.ceil(Math.random()*1000);
    }
    console.log(href)
    location.href = href;
    //window.location.reload();
  }

  clearForm(){
    this.setDefaultPage();
  }

  printReport(type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.runId){
      confirmBox.setMessage('กรุณาค้นหาเลขคดี');
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
      var rptName = 'rca2000';
      // For no parameter : paramData ='{}'
      var paramData ='{}';
      // For set parameter to report
      var paramData = JSON.stringify({
        "prun_id" : this.dataHead.run_id,
        "ptype" : type
      });
      console.log(paramData)
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }
  }

  receiveFuncListData(event:any){
    //console.log(event)
    if(this.modalType==6){
        this.dataLitigant.name = this.dataLitigant.name+event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  receiveFuncLawyerData(event:any){
    console.log(event)
    this.dataLitigant.address = event.address;
    //this.dataLitigant.addr_no = event.addr_no;
    this.dataLitigant.moo = event.moo;
    this.dataLitigant.soi = event.soi;
    this.dataLitigant.road = event.road;
    //this.dataLitigant.near_to = event.near_to;
    this.dataLitigant.prov_id = event.prov_id;
    //this.dataLitigant.prov_name = event.prov_name;
    this.dataLitigant.amphur_id = event.amphur_id;
    //this.dataLitigant.amphur_name = event.amphur_name;
    this.dataLitigant.tambon_id = event.tambon_id;
    //this.dataLitigant.tambon_name = event.tambon_name;
    this.dataLitigant.post_no = event.post_code;
    //this.dataLitigant.send_amt = event.send_amt;
    //this.dataLitigant.notice_amt_remark = event.notice_amt_remark;
    //this.dataLitigant.country_id = event.country_id;
    this.dataLitigant.license_no = event.license_no;
    this.dataLitigant.srevoke_date = event.cancel_date;
    this.dataLitigant.revoke_date = event.due_date;
    if(typeof this.dataLitigant.prov_id !='undefined' || this.dataLitigant.prov_id !='' || this.dataLitigant.prov_id != null){
      this.changeProv(this.dataLitigant.prov_id,'');
    }
    if(this.dataLitigant.lit_type==10){
      this.dataLitigant.name = event.lawyer_name+" ทนาย";
      this.getLitFlag(10,2);
    }

    this.closebutton.nativeElement.click();
  }

  receiveCopyData(event:any){
    console.log(event)
    this.dataLitigant.address = event[0].address;
    this.dataLitigant.addr_no = event[0].addr_no;
    this.dataLitigant.moo = event[0].moo;
    this.dataLitigant.soi = event[0].soi;
    this.dataLitigant.road = event[0].road;
    this.dataLitigant.near_to = event[0].near_to;
    this.dataLitigant.prov_id = event[0].prov_id;
    //this.dataLitigant.prov_name = event.prov_name;
    this.dataLitigant.amphur_id = event[0].amphur_id;
    //this.dataLitigant.amphur_name = event.amphur_name;
    this.dataLitigant.tambon_id = event[0].tambon_id;
    //this.dataLitigant.tambon_name = event.tambon_name;
    this.dataLitigant.post_no = event[0].post_no;
    this.dataLitigant.send_amt = event[0].send_amt;
    this.dataLitigant.notice_amt_remark = event[0].notice_amt_remark;
    this.dataLitigant.country_id = event[0].country_id;
    if(typeof this.dataLitigant.prov_id !='undefined' || this.dataLitigant.prov_id !='' || this.dataLitigant.prov_id != null){
      this.changeProv(this.dataLitigant.prov_id,'');
    }
      //this.changeProv(this.dataLitigant.prov_id,'')
    this.closebutton.nativeElement.click();
  }

  receivePersData(event:any){
    console.log(event)
    this.dataLitigant.name = event[0].pers_desc;
    this.dataLitigant.address = event[0].address;
    this.dataLitigant.addr_no = event[0].addr_no;
    this.dataLitigant.moo = event[0].moo;
    this.dataLitigant.soi = event[0].soi;
    this.dataLitigant.road = event[0].road;
    this.dataLitigant.near_to = event[0].near_to;
    this.dataLitigant.prov_id = event[0].prov_id;
    this.dataLitigant.amphur_id = event[0].amphur_id;
    this.dataLitigant.tambon_id = event[0].tambon_id;
    this.dataLitigant.post_no = event[0].post_code;
    this.dataLitigant.country_id = event[0].country_id;
    if(typeof this.dataLitigant.prov_id !='undefined' || this.dataLitigant.prov_id !='' || this.dataLitigant.prov_id != null){
      this.changeProv(this.dataLitigant.prov_id,'');
    }
    this.amtSentNotice(this.dataLitigant.prov_id,this.dataLitigant.amphur_id,this.dataLitigant.tambon_id,this.dataLitigant.moo,this.dataHead.case_court_type);
      //this.changeProv(this.dataLitigant.prov_id,'')
    this.closebutton.nativeElement.click();
  }

  genNotice(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.dataLitigant.lit_running){
      confirmBox.setMessage('กรุณาเลือกคู่ความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "lit_running" : this.dataLitigant.lit_running,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/genFirstNotice', student , {headers:headers}).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          if(alertMessage.result==0){
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
          }else{
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  openNoticeAmt(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    myExtObject.OpenWindowMaxName(winURL+'fsn1400?prov_id='+this.dataLitigant.prov_id+'&amphur_id='+this.dataLitigant.amphur_id+'&tambon_id='+this.dataLitigant.tambon_id,'fsn1400');
  }

  newData(){
    // this.ngOnInit();
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var run_id = this.runId?this.runId:this.dataHead.run_id;
    console.log(run_id)
    if(run_id)
      location.replace(winURL+'fpo0110?run_id='+run_id)
    else
      location.replace(winURL+'fpo0110')
    window.location.reload();
  }

  clearData(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var run_id = this.runId?this.runId:this.dataHead.run_id;
    console.log(run_id)
    if(run_id)
      location.replace(winURL+'fpo0110?run_id='+run_id)
    else
      location.replace(winURL+'fpo0110')
    window.location.reload();
  }
}









