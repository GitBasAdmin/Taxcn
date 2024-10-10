import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import {
  CanActivateFn, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
  NavigationError,Routes
} from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fca0220,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fca0220.component.html',
  styleUrls: ['./fca0220.component.css']
})


export class Fca0220Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {

  title = 'datatables';
  
  getCaseGroup:any;
  getCaseGroupAll:any;
  getCaseType:any;
  getBlackRedNo:any;;
  getCaseTitle1:any;
  getCaseTitle2:any;
  selCaseTitle:any;
  getCourt:any;
  selCurDate:any;
  myExtObject: any;
  runId:any;

  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  dataHead:any=[];
  dataSearch:any=[];
  result1:any=[];
  result2:any=[];
  run_id:any;
  modalType:any;
  court_id1:any;
  court_id2:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions2: DataTables.Settings = {};
  public loadComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  masterSelect:boolean = false;
  buttonDel:boolean = false;
  

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>; 
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute
  ){ }
   
  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    console.log(this.userData)

    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy:true
    };

    this.activatedRoute.queryParams.subscribe(params => {
      this.runId = this.run_id = params['run_id'];
      if(this.runId>0){
        this.searchDataRunId();
      }
    });
    
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');

    //======================== pcase_group_setup ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_group_setup",
      "field_id" : "group_type_id",
      "field_name" : "group_name",
      "order_by" : "group_type_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        var valObj = getDataOptions.filter((x:any) => x.fieldIdValue > 1);
        this.getCaseGroup = valObj;
        this.getCaseGroupAll = getDataOptions;
        this.result1.group_type1 = this.getCaseGroup[0].fieldIdValue;
        this.result2.group_type2 = this.getCaseGroup[0].fieldIdValue;
      },
      (error) => {}
    )
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
        this.result1.title_case_type1 = this.userData.defaultCaseType;
        this.result2.title_case_type2 = this.userData.defaultCaseType;
        //this.selCaseType = this.getCaseType.find((o:any) => o.fieldIdValue === this.userData.defaultCaseType).fieldNameValue;
        
      },
      (error) => {}
    )
    //======================== ptitle ======================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND title_flag=2 AND case_type=2",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseTitle1 = getDataOptions;
        this.getCaseTitle2 = getDataOptions;
        this.result1.title_group1 = this.userData.defaultTitle;
        this.result2.title_group2 = this.userData.defaultTitle;
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
        console.log(court)
        if(court.length!=0){
          this.result1.court_id1 = this.court_id1 = court[0].fieldIdValue;
          this.result2.court_id2 = this.court_id2 = court[0].fieldIdValue;
        }
      },
      (error) => {}
    )
    //======================== ดำ-แดง ======================================
    this.getBlackRedNo = [{fieldIdValue: 1,fieldNameValue: 'หมายเลขคดีดำ'},{fieldIdValue: 2,fieldNameValue: 'หมายเลขคดีแดง'}];
    this.setDefaultPage1();
    this.setDefaultPage2();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/
  setDefaultPage1(){
    this.result1.group_type1 = 2;
    this.result1.court_id1 = 1;
    this.result1.group_date1 = myExtObject.curDate(); 
    this.result1.case_rb1 = 1;
    this.court_id1 = this.userData.courtId;
    this.result1.court_id1 = this.userData.courtName;
    this.result1.title_case_type1 = this.userData.defaultCaseType;
    this.result1.case_rb1 = 1;
    this.result1.s_id_group1 = '';
    this.result1.e_id_group1 = '';
    this.result1.yy_group1 = '';
    this.changeCaseType(this.userData.defaultCaseType,1);
  }
  setDefaultPage2(){
    this.result2.group_type2 = 2;
    this.result2.court_id2 = 1;
    this.result2.group_date2 = myExtObject.curDate();
    this.result2.case_rb2 = 1;
    this.court_id2 = this.userData.courtId;
    this.result2.court_id2 = this.userData.courtName;
    this.result2.title_case_type2 = this.userData.defaultCaseType;
    this.result2.case_rb2 = 1;
    this.result2.id_group2 = '';
    this.result2.yy_group2 = '';
    this.changeCaseType(this.userData.defaultCaseType,2);
  }

  changeCaseType(val:any,type:any){
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
          console.log(getDataOptions)
          if(type==1){
            this.getCaseTitle1 = getDataOptions;
            
            this.fDefaultTitle(val,type)
          }else{
            this.getCaseTitle2 = getDataOptions;
            //this.result2.title_group2 = this.userData.defaultTitle;
            this.fDefaultTitle(val,type)
          }
        },
        (error) => {}
      )

    });
    return promise;
  }

  fDefaultTitle(caseType:any,type:any){
    //========================== ptitle ====================================    
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='"+caseType+"' AND default_value='1' AND title_flag='1'",
      "order_by":" title_id ASC",
      "userToken" : this.userData.userToken
    });


    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(getDataOptions.length){
          if(type==1)
            this.result1.title_group1 = getDataOptions[0].fieldIdValue;
          else
            this.result2.title_group2 = getDataOptions[0].fieldIdValue;
        }
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
      "url_name" : "fca0200"
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

    fnDataHead(event:any){
      console.log(event)
      this.dataHead = event;
      if(this.dataHead.buttonSearch==1){
        //this.run_id = this.runId = this.dataHead.run_id;
        this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
        this.run_id = this.dataHead.run_id;
        this.searchDataRunId();
        this.setDefaultPage1();
        this.setDefaultPage2();
      }
    }

  searchDataRunId(){
    //this.SpinnerService.show();
      var student = JSON.stringify({
        "run_id" : this.run_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0220/caseGroupData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.result == 1){
              this.dataSearch = productsJson.data;   
              if(this.dataSearch.length){
                this.dataSearch.forEach((x : any ) => x.appRunning = false);
                this.rerender();
                this.SpinnerService.hide();
                this.buttonDel = false;
              }else{
                this.dataSearch = [];
                this.rerender();
                this.SpinnerService.hide();
                this.buttonDel = false;
              }  
            }else{
              this.dataSearch = [];
              this.SpinnerService.hide();
              this.buttonDel = false;
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
    if(child=='appRunning'){
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
    if(child=='appRunning'){
      if(isChecked==true){
        this.buttonDel = false;
      }else{
        this.buttonDel = true;
      }
    }
  }


  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }
  loadMyModalComponent(){
    if(this.modalType==1){
      this.loadModalConfComponent = true;  //password confirm
      this.loadComponent = false;
      $("#exampleModal").find(".modal-content").css("width","650px");
      //$("#exampleModal").find(".modal-body").css("height","100px");
      //$("#exampleModal").css({"background":"rgba(51,32,0,.4)"});
    }
    
  }

  closeModal(){
    this.loadModalConfComponent = false; //confirm
    this.loadComponent = false;//popup return
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
                  dataDel['log_remark'] = chkForm.log_remark;
                  dataDel['userToken'] = this.userData.userToken;


                    var bar = new Promise((resolve, reject) => {
                      this.dataSearch.forEach((ele, index, array) => {
                            if(ele.appRunning == true){
                              dataTmp.push(this.dataSearch[index]);
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
                      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0220/deleteSelect', data , {headers:headers}).subscribe(
                        (response) =>{
                          let alertMessage : any = JSON.parse(JSON.stringify(response));
                          if(alertMessage.result==0){
                            this.SpinnerService.hide();
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
                                this.runId = {'run_id' : this.run_id,'counter' : Math.ceil(Math.random()*10000)}
                                this.closebutton.nativeElement.click();
                                this.searchDataRunId();
                              }
                              subscription.unsubscribe();
                            });
                            
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
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
                if (resp.success==true){}
                subscription.unsubscribe();
              });
            }
          },
          (error) => {}
        );

    }
    
  }

  tabChangeSelect(objName:any,objData:any,event:any,type:any,result:any){
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
        if(result==1)
          this.result1[objName] = val[0].fieldIdValue;
        else
        this.result2[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
      }
    }else{
      this.result1[objName] = null;
      this.result2[objName] = null;
      this[objName] = null;
    }
  }

  directiveDate(date:any,obj:any,result:any){
    if(result==1)
      this.result1[obj] = date;
    else
    this.result2[obj] = date;
  }

  saveResult1(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.run_id){
      confirmBox.setMessage('กรุณาค้นหาเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result1.court_id1){
      confirmBox.setMessage('กรุณาระบุคดีของศาล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result1.s_id_group1 || !this.result1.e_id_group1 || !this.result1.yy_group1){
      confirmBox.setMessage('กรุณาระบุเลขที่คดีให้ครบถ้วน');
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
      this.result1['userToken'] = this.userData.userToken;
      this.result1['run_id'] = this.run_id;
      this.result1['court_id1'] = this.court_id1;
      var data = $.extend({},this.result1);
      console.log(data)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0220/saveCaseGroup', data , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            this.searchDataRunId();
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.SpinnerService.hide();
                this.setDefaultPage1();
                this.runId = {'run_id' : this.run_id,'counter' : Math.ceil(Math.random()*10000)}
                //this.runId = this.run_id;
              }
              subscription.unsubscribe();
            });
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
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
    console.log(this.result1)
  }
  saveResult2(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.run_id){
      confirmBox.setMessage('กรุณาค้นหาเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result2.court_id2){
      confirmBox.setMessage('กรุณาระบุคดีของศาล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result2.id_group2 || !this.result2.yy_group2){
      confirmBox.setMessage('กรุณาระบุเลขที่คดีให้ครบถ้วน');
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
      this.result2['userToken'] = this.userData.userToken;
      this.result2['run_id'] = this.run_id;
      this.result2['court_id2'] = this.court_id2;
      var data = $.extend({},this.result2);
      console.log(data)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0220/saveAddCaseGroup', data , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            this.searchDataRunId();
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.SpinnerService.hide();
                this.setDefaultPage2();
                this.runId = {'run_id' : this.run_id,'counter' : Math.ceil(Math.random()*10000)}
                //this.runId = this.run_id;
              }
              subscription.unsubscribe();
            });
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
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
    console.log(this.result2)
  }

  changeTypeGroup(index:any){
    this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var dataSend = [];
      dataSend['data'] = [this.dataSearch[index]];
      dataSend['userToken'] = this.userData.userToken;
      var data = $.extend({}, dataSend);
      //var data = dataSend;
      console.log(data)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0220/updateCaseGroup', data , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            this.searchDataRunId();
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
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







