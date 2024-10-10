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
  selector: 'app-fmg1204,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg1204.component.html',
  styleUrls: ['./fmg1204.component.css']
})


export class Fmg1204Component implements AfterViewInit, OnInit, OnDestroy {
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
  toPage:any="fmg0200";
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
  // @ViewChild('fmg1204',{static: true}) case_type : ElementRef;
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
      this.result.case_cate_id = params['case_cate_id'];
      this.result.ctype = params['ctype'];
      this.result.dtype = params['dtype'];
      this.result.dcolumn = params['dcolumn'];
      this.result.sdate = params['sdate'];
      this.result.edate = params['edate'];
      if(typeof this.result.case_cate_id !='undefined')
        this.LoadData();


    });

  }


  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fmg1204"
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

    //     this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fmg1204', student , {headers:headers}).subscribe(
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
            "case_cate_id" : this.result.case_cate_id,
            "c_type" : this.result.ctype,
            "dtype" : this.result.dtype,
            "dcolumn" : this.result.dcolumn,
            "sdate" : this.result.sdate,
            "edate" : this.result.edate,
            "userToken" : this.userData.userToken
        });
        console.log(student);
        this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg1204', student ).subscribe(
          posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));

              this.posts = productsJson.data;
              // this.posts.release_date =  myExtObject.callCalendarSet('posts.release_date');
            console.log(productsJson)
            if(productsJson.result==1){

              var bar = new Promise((resolve, reject) => {
                productsJson.data.forEach((ele, index, array) => {
                  if(ele.deposit != null){
                     productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
                  }
                 });
                 this.result.case_cate_name = productsJson.case_cate_name;
                 this.result.case_num = productsJson.data.length;
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


    goToPage(run_id:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?run_id='+run_id;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1800,height=1200");
      // myExtObject.OpenWindowMax(winURL);
    }


  //   retToPage(run_id:any){
  //    let winURL = this.authService._baseUrl;
  //   // winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.retPage;
  //   //let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/'+this.retPage;
  //   myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  // }

}







