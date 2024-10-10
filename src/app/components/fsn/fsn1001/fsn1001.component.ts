import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
// import { ActivatedRoute } from '@angular/router';
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
} from '@angular/router';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';

declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fsn1001,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fsn1001.component.html',
  styleUrls: ['./fsn1001.component.css']
})


export class Fsn1001Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType:any;selCaseType:any;
  getDateType:any;selDateType:any;
  getJudge:any;
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
  numCase:any;
  numLit:any;
  retPage:any;
  myExtObject:any;
  toPage:any="ffn0620";
  asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  judge_id:any;
  judge_name:any;
  stype:any;

  receipt_running:any;
  sub_type_id:any;
  receipt_type_id:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  // @ViewChild('fsn1001',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

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
      destroy: true,
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };
    // this.activatedRoute.queryParams.subscribe(params => {
    //   if(params['program'])
    //     this.retPage = params['program'];
    // });

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.receipt_running = params['receipt_running'];
      this.sub_type_id = params['sub_type_id'];
      this.receipt_type_id = params['receipt_type_id'];
      if(typeof this.receipt_running !='undefined')
        this.LoadData();


    });
    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type','application/json');

    //  //======================== pcase_type ======================================
    //  var student = JSON.stringify({
    //   "table_name" : "pcase_type",
    //   "field_id" : "case_type",
    //   "field_name" : "case_type_desc",
    //   "order_by": " case_type ASC",
    //   "userToken" : this.userData.userToken
    // });
    // //console.log(student)
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getCaseType = getDataOptions;
    //     this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();

    //   },
    //   (error) => {}
    // )


  //   var student = JSON.stringify({
  //     "cond":2,
  //     "userToken" : this.userData.userToken
  //   });
  // this.listTable='pjudge';
  // this.listFieldId='judge_id';
  // this.listFieldName='judge_name';
  // this.listFieldNull='';
  // this.listFieldType=JSON.stringify({"type":2});

//console.log(student)

//  this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
//      (response) =>{
//        let productsJson :any = JSON.parse(JSON.stringify(response));
//        if(productsJson.data.length){
//          this.list=productsJson.data;
//          console.log(this.list)
//        }else{
//           this.list = [];
//        }
//       //  this.list = response;
//       // console.log('xxxxxxx',response)
//      },
//      (error) => {}
//    )

     //======================== pjudge ======================================
    //  var student = JSON.stringify({
    //   "table_name" : "pjudge",
    //   "field_id" : "judge_id",
    //   "field_name" : "judge_name",
    //   "userToken" : this.userData.userToken
    // });
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getJudge = getDataOptions;
    //     this.getJudge.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
    //   },
    //   (error) => {}
    // )
    // // this.getConResult = [{id:'',text:''},{id: '1',text: 'จำหน่ายคดี'},{id: '2',text: 'สำเร็จ'},{id: '3',text: 'ไม่สำเร็จ'}];
    //    this.getDateType = [{id:'1',text:'วันที่ออกแดงตั้งแต่'},{id:'2',text:'วันที่แจ้งการอ่านตั้งแต่'}];
    //    this.result.stype = '1';

       //this.asyncObservable = this.makeObservable('Async Observable');
      // this.successHttp();
      // this.LoadData();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fsn1001"
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
          // this.defaultCaseType = getDataAuthen.defaultCaseType;
          // this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
          // this.defaultTitle = getDataAuthen.defaultTitle;
          // this.defaultRedTitle = getDataAuthen.defaultRedTitle;
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
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ngAfterContentInit() : void{
      this.result.cFlag = 1;
      myExtObject.callCalendar();
    }

    loadMyModalComponent(){
      this.loadComponent = false;
      this.loadModalComponent = true;
      $("#exampleModal").find(".modal-body").css("height","100px");
    }


    closeModal(){
      $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
    }

    loadTableComponent(val:any){
      this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadModalJudgeComponent = true;
      $("#exampleModal").find(".modal-body").css("height","auto");
   }

  //  tabChange(obj:any){
  //    if(obj.target.value){
  //      this.renderer.setProperty(this.req_title_id.nativeElement['dep_name'],'value', this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue);
  //    }else{
  //      this.req_title_id.nativeElement['dep_use'].value="";
  //      this.req_title_id.nativeElement['dep_name'].value="";
  //    }
  //  }

    // tabChangeSelect(objName:any,objData:any,event:any,type:any){
    //   if(typeof objData!='undefined'){
    //     if(type==1){
    //       var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
    //     }else{
    //         var val = objData.filter((x:any) => x.fieldIdValue === event);
    //     }
    //     console.log(objData)
    //     //console.log(event.target.value)
    //     //console.log(val)
    //     if(val.length!=0){
    //       this.result[objName] = val[0].fieldIdValue;
    //       this[objName] = val[0].fieldIdValue;
    //     }
    //   }else{
    //     this.result[objName] = null;
    //     this[objName] = null;
    //   }
    // }

    // tabChangeInput(name:any,event:any){
    //   let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type','application/json');
    //   if(name=='judge_id'){
    //     var student = JSON.stringify({
    //       "table_name" : "pjudge",
    //       "field_id" : "judge_id",
    //       "field_name" : "judge_name",
    //       "condition" : " AND judge_id='"+event.target.value+"'",
    //       "userToken" : this.userData.userToken
    //     });
    //     console.log(student)
    //   this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //       (response) =>{
    //         let productsJson : any = JSON.parse(JSON.stringify(response));

    //         if(productsJson.length){
    //           this.result.judge_name = productsJson[0].fieldNameValue;
    //         }else{
    //           this.result.judge_id = null;
    //           this.result.judge_name = '';
    //         }
    //       },
    //       (error) => {}
    //     )
    //   }
    // }

    receiveJudgeListData(event:any){
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
      this.closebutton.nativeElement.click();
    }

    // searchData(){
    //   console.log(this.result)
    //   if(!this.result.case_type &&
    //     !this.result.judge_id &&
    //     !this.result.stype &&
    //     !this.result.judging_sdate &&
    //     !this.result.judging_edate &&
    //     !this.result.cond1 &&
    //     !this.result.cond2 &&
    //     !this.result.cond3){
    //       const confirmBox = new ConfirmBoxInitializer();
    //       confirmBox.setTitle('ข้อความแจ้งเตือน');
    //       confirmBox.setMessage('ป้อนเงื่อนไขเพื่อค้นหา');
    //       confirmBox.setButtonLabels('ตกลง');
    //       confirmBox.setConfig({
    //           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //       });
    //       const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //         if (resp.success==true){this.SpinnerService.hide();}
    //         subscription.unsubscribe();
    //       });
    //   }else if(!this.result.judging_sdate && !this.result.judging_edate){
    //     const confirmBox = new ConfirmBoxInitializer();
    //     confirmBox.setTitle('ข้อความแจ้งเตือน');
    //     confirmBox.setMessage('เลือกวันที่แจ้งการอ่าน และ/หรือ วันที่ออกแดงให้ครบ');
    //     confirmBox.setButtonLabels('ตกลง');
    //     confirmBox.setConfig({
    //         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //     });
    //     const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //       if (resp.success==true){this.SpinnerService.hide();}
    //       subscription.unsubscribe();
    //     });
    //   }else{
    //     this.SpinnerService.show();
    //     this.tmpResult = this.result;
    //     var jsonTmp = $.extend({}, this.tmpResult);
    //     jsonTmp['userToken'] = this.userData.userToken;
    //     /*
    //     if(jsonTmp.admit_flag== 0) delete jsonTmp.admit_flag;
    //     if(jsonTmp.case_level== 0) delete jsonTmp.case_level;
    //     if(jsonTmp.case_yes_no== 0) delete jsonTmp.case_yes_no;
    //     if(jsonTmp.customer_flag== 0) delete jsonTmp.customer_flag;
    //     if(jsonTmp.guar_pros== 0) delete jsonTmp.guar_pros;
    //     if(jsonTmp.prosType== 0) delete jsonTmp.prosType;
    //     jsonTmp['userToken'] = this.userData.userToken;
    //     */
    //     //console.log(jsonTmp)
    //     // if(jsonTmp.card_type==1){
    //     //   jsonTmp.id_card = this.idCard0+this.idCard1+this.idCard2+this.idCard3+this.idCard4;
    //     // }
    //     // if(jsonTmp.card_type1==1){
    //     //   jsonTmp.id_card1 = this.idCard0_0+this.idCard1_1+this.idCard2_2+this.idCard3_3+this.idCard4_4;
    //     // }

    //     var student = jsonTmp;
    //     console.log(student)
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type','application/json');

    //     this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fsn1001', student , {headers:headers}).subscribe(
    //       (response) =>{
    //           let productsJson : any = JSON.parse(JSON.stringify(response));
    //           if(productsJson.result==1){
    //             /*
    //             var bar = new Promise((resolve, reject) => {
    //               productsJson.data.forEach((ele, index, array) => {
    //                     if(ele.indict_desc != null){
    //                       if(ele.indict_desc.length > 47 )
    //                         productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
    //                     }
    //                     if(ele.deposit != null){
    //                       productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
    //                     }
    //                 });
    //             });

    //             bar.then(() => {
    //               //this.dataSearch = productsJson.data;
    //               //console.log(this.dataSearch)
    //             });
    //             */
    //             this.dataSearch = productsJson.data;
    //             // this.numCase = productsJson.num_case;
    //             // this.numLit = productsJson.num_lit;
    //             //this.dtTrigger.next(null);
    //             this.rerender();
    //             console.log(this.dataSearch)
    //           }else{
    //             this.dataSearch = [];
    //             this.rerender();
    //             // this.numCase = 0;
    //             // this.numLit = 0;
    //           }
    //           console.log(productsJson)
    //           this.SpinnerService.hide();
    //       },
    //       (error) => {}
    //     )

    //   }
    // }
    LoadData() {
      //  alert("xxxx");
      this.posts = [];
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

        this.SpinnerService.show();
        // let headers = new HttpHeaders();
        // headers = headers.set('Content-Type','application/json');
        // if(this.prov_id.nativeElement["default_value"].checked==true){
        //   var inputChk = 1;
        // }else{
        //   var inputChk = 0;
        // }
        var student = JSON.stringify({
            "receipt_running" : this.receipt_running,
            "receipt_type_id" : this.receipt_type_id,
            "sub_type_id" : this.sub_type_id,
            "userToken" : this.userData.userToken
        });
        console.log(student);
        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/fsn1001', student ).subscribe(
          posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));

              this.posts = productsJson.data;
              // this.posts.release_date =  myExtObject.callCalendarSet('posts.release_date');
            console.log(productsJson)
            if(productsJson.result==1){

              var bar = new Promise((resolve, reject) => {
                productsJson.data.forEach((ele, index, array) => {

                      if(ele.description != null){
                        let text = productsJson.data[index]['description'];
                        let result = text.substr(0,text.lastIndexOf(" "));
                        let result2 = text.split(" ").pop();
                        productsJson.data[index]['result']  = result;
                        productsJson.data[index]['result2'] = result2;
                      }


                  });
              });

              this.dataSearch = productsJson.data;
              console.log(this.dataSearch);
              // alert(this.dataSearch.length);
              this.checklist = this.posts;
              // this.checklist2 = this.posts;
                if(productsJson.length)
                  this.posts.forEach((x : any ) => x.edit3001 = false);

              this.rerender();
              setTimeout(() => {
                myExtObject.callCalendar();
              }, 500);
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
              this.SpinnerService.hide();

          },
          (error) => {this.SpinnerService.hide();}
        );
         }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    CloseWindow(){
        window.close();
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    // exportAsXLSX(): void {
    //   if(this.dataSearch){
    //     var excel =  JSON.parse(JSON.stringify(this.dataSearch));
    //     console.log(excel)
    //     var data = [];var extend = [];
    //     var bar = new Promise((resolve, reject) => {

    //       for(var i = 0; i < excel.length; i++){
    //         // if(excel[i]['title'] && excel[i]['id'] && excel[i]['yy'])
    //         //   excel[i]['case_no'] = excel[i]['title']+excel[i]['id']+'/'+excel[i]['yy'];
    //         // else
    //         //   excel[i]['case_no'] = "";
    //         // if(excel[i]['red_title'] && excel[i]['red_title'] && excel[i]['red_title'])
    //         //   excel[i]['red_no']  = excel[i]['red_title']+excel[i]['red_id']+'/'+excel[i]['red_yy'];
    //         // else
    //         //   excel[i]['red_no'] = "";
    //         // if(excel[i]['date_appoint'])
    //         //   excel[i]['dateAppoint'] = excel[i]['date_appoint']+"  "+excel[i]['time_appoint'];
    //         // else
    //         //   excel[i]['dateAppoint'] = "";
    //         // if(excel[i]['old_red_no'])
    //         //   excel[i]['oldCaseNo'] = excel[i]['old_case_no']+" ("+excel[i]['old_red_no']+")";
    //         // else
    //         //   excel[i]['oldCaseNo'] = excel[i]['old_case_no'];

    //         for(var x=0;x<17;x++){
    //           if(x==0)
    //             data.push(excel[i]['red_no']);
    //           if(x==1)
    //             data.push(excel[i]['case_no']);
    //           if(x==2)
    //             data.push(excel[i]['case_date']);
    //           if(x==3)
    //             data.push(excel[i]['judging_date']);
    //           if(x==4)
    //             data.push(excel[i]['result_desc']);
    //           if(x==5)
    //             data.push(excel[i]['judge_name']);
    //           if(x==6)
    //             data.push(excel[i]['judge_order_type']);
    //           // if(x==7)
    //           //   data.push(excel[i]['accu_desc']);
    //           // if(x==8)
    //           //   data.push(excel[i]['alle_desc']);
    //           // if(x==9)
    //           //   data.push(excel[i]['indict_desc']);
    //           // if(x==10)
    //           //   data.push(excel[i]['amphur_name']);
    //           // if(x==12)
    //           //   data.push(excel[i]['deposit']);
    //           // if(x==12)
    //           //   data.push(excel[i]['guar_pros_desc']);
    //           // if(x==13)
    //           //   data.push(excel[i]['judge_name']);
    //           // if(x==14)
    //           //   data.push(excel[i]['oldCaseNo']);
    //           // if(x==15)
    //           //   data.push(excel[i]['admit_desc']);
    //           // if(x==17)
    //           //   data.push(excel[i]['transfer_court_name']);
    //         }

    //         extend[i] = $.extend([], data)
    //         data = [];
    //         //extend[i] = Object.values(data)
    //       }
    //     });
    //     if(bar){
    //       var objExcel = [];
    //       // objExcel['deposit'] = this.deposit;
    //       objExcel['data'] = extend;
    //       console.log(objExcel)
    //       this.excelService.exportAsExcelFile(objExcel,'fsn1001' ,this.programName);
    //     }

    //   }else{
    //     const confirmBox = new ConfirmBoxInitializer();
    //     confirmBox.setTitle('ข้อความแจ้งเตือน');
    //     confirmBox.setMessage('กรุณาค้นหาข้อมูล');
    //     confirmBox.setButtonLabels('ตกลง');
    //     confirmBox.setConfig({
    //         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //     });
    //     const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //       if (resp.success==true){}
    //       subscription.unsubscribe();
    //     });
    //   }
    // }

    goToPage(payback_running:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?payback_running='+payback_running;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1450,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }


  //   retToPage(run_id:any){
  //    let winURL = this.authService._baseUrl;
  //   // winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.retPage;
  //   //let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/'+this.retPage;
  //   myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  // }

}







