import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fkn0500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0500.component.html',
  styleUrls: ['./fkn0500.component.css']
})


export class Fkn0500Component implements AfterViewInit, OnInit,AfterContentInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables'; 
  
  getCaseType:any;selCaseType:any;
  getTitle:any;
  getCaseCate:any;
  getCaseStatus:any;
  getPersType:any;
  getLitType:any;
  getCardType:any;
  getStatus:any;
  getCourt:any;
  getOccupation:any;
  getNation:any;
  getInter:any;

  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  myExtObject:any;
  court_id:any;
  idCard0:any;
  idCard1:any;
  idCard2:any;
  idCard3:any;
  idCard4:any;
  idCard0_0:any;
  idCard1_1:any;
  idCard2_2:any;
  idCard3_3:any;
  idCard4_4:any;
  occ_id:any;
  nation_id:any;
  inter_id:any;
  occ_id1:any;
  nation_id1:any;
  inter_id1:any;
  numCase:any;
  numLit:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  retPage:any = 'fmg0200';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild('sCardType') sCardType : NgSelectComponent;
  @ViewChild('CardType2') sCardType2 : NgSelectComponent;
  @ViewChild('LitType2') LitType2 : NgSelectComponent;
  @ViewChild('PersType2') PersType2 : NgSelectComponent;
  @ViewChild('Status2') Status2 : NgSelectComponent;
  
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
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
        this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();
        
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
        //console.log(getDataOptions)
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
        this.getOccupation.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
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
        this.getNation = getDataOptions;
        this.getNation.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
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
        this.getInter.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getLitType = getDataOptions;
      },
      (error) => {}
    )
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
        this.getStatus = getDataOptions;
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

    this.result.con_flag = true;
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

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

  changePersType(val:any){
    if(val==2){
      $("body").find(".cardtype").removeClass('disabled'); 
    }else{
      $("body").find(".cardtype").addClass('disabled');
      this.sCardType.clearModel();
    }
  }

  clearDis(){
    if($("body").find("input.chkDis").prop("checked")==true){
      $("body").find(".card_type1").removeClass('disabled'); 
      $("body").find(".lit_type1").removeClass('disabled'); 
      $("body").find(".accu_type1").removeClass('disabled'); 
      $("body").find(".status1").removeClass('disabled'); 
      $("body").find(".name1").removeAttr("readonly");
      $("body").find(".id_card1").removeAttr("readonly");
      $("body").find(".occ_id1").removeClass('disabled'); 
      $("body").find(".inter_id1").removeClass('disabled'); 
      $("body").find(".nation_id1").removeClass('disabled');
      $("body").find(".occ_id1_text").removeAttr("readonly");
      $("body").find(".inter_id1_text").removeAttr("readonly");
      $("body").find(".nation_id1_text").removeAttr("readonly");
    }else{
      $("body").find(".card_type1").addClass('disabled'); 
      $("body").find(".lit_type1").addClass('disabled'); 
      $("body").find(".accu_type1").addClass('disabled'); 
      $("body").find(".status1").addClass('disabled'); 
      $("body").find(".name1").attr("readonly","readonly");
      $("body").find(".id_card1").attr("readonly","readonly");
      $("body").find(".occ_id1").addClass('disabled'); 
      $("body").find(".inter_id1").addClass('disabled'); 
      $("body").find(".nation_id1").addClass('disabled');
      $("body").find(".occ_id1_text").attr("readonly","readonly");
      $("body").find(".inter_id1_text").attr("readonly","readonly");
      $("body").find(".nation_id1_text").attr("readonly","readonly");
    }
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
    
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterContentInit() : void{
    this.result.cFlag = 1;
    myExtObject.callCalendar();
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
      }
    }else{
      this.result[objName] = null;
      this[objName] = null;
    }
  }

  searchData(){
    console.log(this.result.case_date1)
    console.log(this.result)
    // if(!this.result.name &&!this.result.id && !this.idCard0 && !this.idCard1 && !this.idCard2 && !this.idCard3 && !this.idCard4 && !this.result.inter_id && !this.result.nation_id &&!this.result.case_date1 && !this.result.case_date2){
    if(!this.result.name &&!this.result.id_card){
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
		}else if((!this.result.case_date1 || !this.result.case_date2) && (this.result.inter_id || this.result.nation_id)){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('เลือกวันที่ยื่นฟ้อง');
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
      /*
      if(jsonTmp.admit_flag== 0) delete jsonTmp.admit_flag;
      if(jsonTmp.case_level== 0) delete jsonTmp.case_level;
      if(jsonTmp.case_yes_no== 0) delete jsonTmp.case_yes_no;
      if(jsonTmp.customer_flag== 0) delete jsonTmp.customer_flag;
      if(jsonTmp.guar_pros== 0) delete jsonTmp.guar_pros;
      if(jsonTmp.prosType== 0) delete jsonTmp.prosType;
      jsonTmp['userToken'] = this.userData.userToken;
      */
      //console.log(jsonTmp)
     /* if(jsonTmp.card_type==1){
        jsonTmp.id_card = this.idCard0+this.idCard1+this.idCard2+this.idCard3+this.idCard4;
      }
      if(jsonTmp.card_type1==1){
        jsonTmp.id_card1 = this.idCard0_0+this.idCard1_1+this.idCard2_2+this.idCard3_3+this.idCard4_4;
      }*/

      var student = jsonTmp; 
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fkn0500', student , {headers:headers}).subscribe(
        (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.result==1){
              /*
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
              
              bar.then(() => {
                //this.dataSearch = productsJson.data;
                //console.log(this.dataSearch)
              });
              */
              this.dataSearch = [];
              this.dataSearch = productsJson.data;
              this.numCase = productsJson.num_case;
              this.numLit = productsJson.num_lit;
              //this.dtTrigger.next(null);
              this.rerender();
              console.log(this.dataSearch)
            }else{
              this.dataSearch = [];
              this.numCase = 0;
              this.numLit = 0;
              this.rerender();
            }
            console.log(productsJson)
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

  exportAsXLSX(): void {
    if(this.dataSearch){
      var excel =  JSON.parse(JSON.stringify(this.dataSearch));
      console.log(excel)
  
      var data = [];var extend = [];
      var bar = new Promise((resolve, reject) => {
        
        for(var i = 0; i < excel.length; i++){


          for(var x=0;x<29;x++){
            if(x==0)
              data.push(excel[i]['case_type_desc']);         
            if(x==1)
              data.push(excel[i]['post_no']);    
            if(x==2)
              data.push(excel[i]['black_no']);   
            if(x==3)
              data.push(excel[i]['red_no']);
            if(x==4)
              data.push(excel[i]['case_date']);
            if(x==5)
              data.push(excel[i]['alle_desc']);
            if(x==6)
              data.push(excel[i]['pros_desc']);
            if(x==7)
              data.push(excel[i]['accu_desc']);
            if(x==8)
              data.push(excel[i]['lit_type_desc']);
            if(x==9)
              data.push(excel[i]['seq']);
            if(x==10)
              data.push(excel[i]['title']);
            if(x==11)
              data.push(excel[i]['name']);
            if(x==12)
              data.push(excel[i]['status_desc']);
            if(x==13)
              data.push(excel[i]['pers_type_desc']);
            if(x==14)
              data.push(excel[i]['card_type_name']);
            if(x==15)
              data.push(excel[i]['id_card']);
            if(x==16)
              data.push(excel[i]['age']);
              if(x==17)
              data.push(excel[i]['inter_name']);
              if(x==18)
              data.push(excel[i]['nation_name']);
              if(x==19)
              data.push(excel[i]['occ_desc']);
              if(x==20)
              data.push(excel[i]['tel_no']);
              if(x==21)
              data.push(excel[i]['email']);
              if(x==22)
              data.push(excel[i]['address']);
              if(x==23)
              data.push(excel[i]['moo']);
              if(x==24)
              data.push(excel[i]['soi']);
              if(x==25)
              data.push(excel[i]['road']);
              if(x==26)
              data.push(excel[i]['tambon_name']);
              if(x==27)
              data.push(excel[i]['amphur_name']);
              if(x==27)
              data.push(excel[i]['prov_name']);
          }
          
        
          extend[i] = $.extend([], data)
          data = [];
          //extend[i] = Object.values(data)
        }
      });
      if(bar){
        var objExcel = [];
        objExcel['numCase'] = this.numCase;
        objExcel['numLit'] = this.numLit;
        objExcel['data'] = extend;
        console.log(objExcel)
        this.excelService.exportAsExcelFile(objExcel,'fkn0500' ,this.programName);
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


  onOpenAttachFile(runId:any){
    let winURL = this.authService._baseUrl.substring(0, this.authService._baseUrl.indexOf("#") + 1) + '/' + 'fca0230';
    myExtObject.OpenWindowMax(winURL+'?run_id='+runId);
  }
    

}







