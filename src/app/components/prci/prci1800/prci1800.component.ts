import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
} from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';

declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-prci1800',
  templateUrl: './prci1800.component.html',
  styleUrls: ['./prci1800.component.css']
})


export class Prci1800Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  sessData:any;
  userData:any;
  programName:any;
  programId:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;

  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  myExtObject:any;
  modalType:any;
  delIndex:any;

  getDep:any;
  pdep_code:any;
  ptype:any;
  masterTmp:any;
  getAssign:any;
  run_id:any;
  app_seq:any;
  case_no:any;
  red_no:any;
  getPostHead:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalJudgeComponent : boolean = false;
  public loadModalComponent : boolean = false;
  public loadModalConfComponent : boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private authService: AuthService,
    private ngbModal: NgbModal,
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true,
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);



    this.activatedRoute.queryParams.subscribe(params => {
      this.run_id = params['run_id'];
      this.app_seq = params['app_seq'];
      this.case_no = params['case_no'];
      this.red_no = params['red_no'];
    });


      this.successHttp();
      this.setDefPage();
  }

  setDefPage(){
    this.result=[];
    this.result.pchk4 = 1;
    this.result.pprint_by = 1;
    this.result.type_date = myExtObject.curDate();
    this.getCaseData();
    this.getPost();
  }

  getCaseData(){
    this.result.black_no = this.case_no;
    this.result.red_no = this.red_no;
    //======================== pcase_type ======================================
    /*
    var student = JSON.stringify({
      "table_name" : "pcase",
      "condition" : " AND run_id='"+this.run_id+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getAllRecData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)

        this.result.black_no = getDataOptions[0].title+getDataOptions[0].id+"/"+getDataOptions[0].yy;
        if(getDataOptions[0].red_id)
          this.result.red_no = getDataOptions[0].red_title+getDataOptions[0].red_id+"/"+getDataOptions[0].red_yy;
        else
          this.result.red_no = '';
      },
      (error) => {}
    )
    */
  }

  getPost(){
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase",
      "condition" : " AND run_id='"+this.run_id+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCI/API/CONC/prci1800', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getPostHead = getDataOptions;
        this.result.ppost_to = getDataOptions.ppost_to;
        //this.result.puser_approve_id = getDataOptions.puser_approve_id+this.userData.courtName;
        this.result.puser_approve_id = getDataOptions.puser_approve_id;
        this.result.puser_approve = getDataOptions.puser_approve;
        this.result.ppost_approve = getDataOptions.ppost_approve+this.userData.courtName;
      },
      (error) => {}
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prci1800"
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

    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      // this.openbutton.nativeElement.click();
      this.loadMyModalComponent();
    }
    
    loadMyModalComponent(){
      if(this.modalType==1 || this.modalType==2 || this.modalType==4 || this.modalType==5){
        $("#exampleModal").find(".modal-content").css("width","650px");
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
        this.listFieldCond="";
      }else if(this.modalType==3){
        $("#exampleModal").find(".modal-content").css("width","650px");
        /*this.loadModalComponent = false;
        this.loadModalConfComponent = false;
        this.loadModalJudgeComponent = true;
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
        )*/
        const modalRef: NgbModalRef = this.ngbModal.open(ModalJudgeComponent,{ size: 'lg', backdrop: 'static' })
        modalRef.componentInstance.value1 = "pjudge"
        modalRef.componentInstance.value2 = "judge_id"
        modalRef.componentInstance.value3 = "judge_name"
        modalRef.componentInstance.value4 = ''
        modalRef.componentInstance.types = "1"
        modalRef.componentInstance.value5 = JSON.stringify({"type":1})

        modalRef.result.then((item: any) => {
          if(item) {
            if(this.modalType==3){
              this.result.puser_approve_id=item.judge_id;
              this.result.puser_approve=item.judge_name;
              this.result.ppost_approve=item.full_post_name;//ตำแหน่ง
            }
            // this.getPosition(1,item.post_id,'ppost_approve');
          }
        }).catch((error: any) => {
          console.log(error)
        })
      }else if(this.modalType==99){
        $("#exampleModal").find(".modal-content").css({"width":"600px"});
        this.loadModalComponent = false;
        this.loadModalConfComponent = true;
        this.loadModalJudgeComponent = false;
      }

      if(this.modalType==1 || this.modalType==2 || this.modalType==4 || this.modalType==5){
        this.loadModalComponent = true;
        this.loadModalConfComponent = false;
        this.loadModalJudgeComponent = false;
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;

            const modalRef = this.ngbModal.open(DatalistReturnComponent,{ size: 'lg', backdrop: 'static' })
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "pofficer"
            modalRef.componentInstance.value2 = "off_id"
            modalRef.componentInstance.value3 = "off_name"
            modalRef.componentInstance.value4 = "post_id"
            modalRef.componentInstance.types = "1"

            modalRef.result.then((item: any) => {
              if(item){
                if(this.modalType==1){
                  this.result.puser_check_id=item.fieldIdValue;
                  this.result.puser_check=item.fieldNameValue;
                  this.getPosition(1,item.fieldNameValue2,'ppost_check');
                }else if(this.modalType==2){
                  this.result.ppresent_id=item.fieldIdValue;
                  this.result.ppresent_name=item.fieldNameValue;
                  this.getPosition(1,item.fieldNameValue2,'ppresent_to');
                }else if(this.modalType==4){
                  this.result.puser_approve_id=item.fieldIdValue;
                  this.result.puser_approve=item.fieldNameValue;
                  this.getPosition(1,item.fieldNameValue2,'ppost_approve');
                }else if(this.modalType==5){
                  this.result.puser_pay_id=item.fieldIdValue;
                  this.result.puser_pay=item.fieldNameValue;
                  this.getPosition(1,item.fieldNameValue2,'ppost_pay');
                }
              }
            })
          },
          (error) => {}
        )
      }
    }

    closeModal(){
      this.loadModalJudgeComponent = false;
      this.loadModalComponent = false;
      this.loadModalConfComponent = false;
    }

    receiveFuncListData(event:any){
      if(this.modalType==1){
        this.result.puser_check_id=event.fieldIdValue;
        this.result.puser_check=event.fieldNameValue;
        this.getPosition(1,event.fieldNameValue2,'ppost_check');
      }else if(this.modalType==2){
        this.result.ppresent_id=event.fieldIdValue;
        this.result.ppresent_name=event.fieldNameValue;
        this.getPosition(1,event.fieldNameValue2,'ppresent_to');
      }else if(this.modalType==4){
        this.result.puser_approve_id=event.fieldIdValue;
        this.result.puser_approve=event.fieldNameValue;
        this.getPosition(1,event.fieldNameValue2,'ppost_approve');
      }else if(this.modalType==5){
        this.result.puser_pay_id=event.fieldIdValue;
        this.result.puser_pay=event.fieldNameValue;
        this.getPosition(1,event.fieldNameValue2,'ppost_pay');
      }

      this.closebutton.nativeElement.click();
    }
    receiveJudgeListData(event:any){
      console.log(event)
      if(this.modalType==3){
        this.result.puser_approve_id=event.judge_id;
        this.result.puser_approve=event.judge_name;
      }
      this.getPosition(1,event.post_id,'ppost_approve');
      this.closebutton.nativeElement.click();
    }

    tabChangeInput(name:any,event:any){
      if(name=='puser_check_id'){
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "field_name2" : "post_id",
          "condition" : " AND off_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
                this.result.puser_check = productsJson[0].fieldNameValue;
                this.getPosition(1,productsJson[0].fieldNameValue2,'ppost_check');
            }else{
                this.result.puser_check_id = '';
                this.result.puser_check = ''; 
            }
          },
          (error) => {}
        )
      }else if(name=='ppresent_id'){
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "field_name2" : "post_id",
          "condition" : " AND off_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
                this.result.ppresent_name = productsJson[0].fieldNameValue;
                this.getPosition(1,productsJson[0].fieldNameValue2,'ppresent_to');
            }else{
                this.result.ppresent_id = '';
                this.result.ppresent_name = '';
            }
          },
          (error) => {}
        )
      }else if(name=='puser_approve_id'){
        if(this.modalType==3){
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
              if(productsJson.length){
                  this.result.puser_approve = productsJson[0].fieldNameValue;
                  this.getPosition(2,productsJson[0].fieldNameValue2,'ppost_approve');
              }else{
                  this.result.puser_approve_id = '';
                  this.result.puser_approve = '';
              }
            },
            (error) => {}
          )
        }else{
          var student = JSON.stringify({
            "table_name" : "pofficer",
            "field_id" : "off_id",
            "field_name" : "off_name",
            "field_name2" : "post_id",
            "condition" : " AND off_id='"+event.target.value+"'",
            "userToken" : this.userData.userToken
          });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
            (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.length){
                  this.result.puser_approve = productsJson[0].fieldNameValue;
                  this.getPosition(1,productsJson[0].fieldNameValue2,'ppost_approve');
              }else{
                  this.result.puser_approve_id = '';
                  this.result.puser_approve = '';
              }
            },
            (error) => {}
          )
        }

      }else if(name=='puser_pay_id'){
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "field_name2" : "post_id",
          "condition" : " AND off_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.length){
                this.result.puser_pay = productsJson[0].fieldNameValue;
                this.getPosition(1,productsJson[0].fieldNameValue2,'ppost_pay');
            }else{
                this.result.puser_pay_id = '';
                this.result.puser_pay = '';
            }
          },
          (error) => {}
        )
      }
    }



    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }


    closeWin(){
      if(this.run_id)
        window.opener.myExtObject.openerReloadRunId(this.run_id);
      else
        window.opener.myExtObject.openerReloadRunId(0);
      window.close();
    }

    printReport(type:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
          if(type==1){
              var rptName = 'rap2100';
              // For no parameter : paramData ='{}'
              var paramData ='{}';
              // rap2100.jsp?pcourt_running=107&prun_id=150662&papp_seq=
                var paramData = JSON.stringify({
                  "pcourt_running" : this.userData.courtRunning,
                  "prun_id" : this.run_id,
                  "papp_seq" : this.app_seq
                });
                console.log(paramData)
                // alert(paramData);return false;
                this.printReportService.printReport(rptName,paramData);

          }else if(type==2 || type==3 || type==4 || type==5){

              var rptName = 'rci0300';
              if(type==5){
                rptName = 'rci0330';
              }
              // For no parameter : paramData ='{}'
              //let paramData = [];
              if(type==2 || type==5)
                this.result.pflag=1;
              else if(type==3)
                this.result.pflag=2;
              else if(type==4)
                this.result.pflag=3;
              if(typeof this.result.pchk_type_date =='undefined' || !this.result.pchk_type_date || this.result.pchk_type_date==false)
                this.result.pchk_type_date = '';
              else
                this.result.pchk_type_date = '1';
              if(typeof this.result.pchk_pay_date =='undefined' || !this.result.pchk_pay_date || this.result.pchk_pay_date==false)
                this.result.pchk_pay_date = '';
              else
                this.result.pchk_pay_date = '1';
              if(typeof this.result.type_date =='undefined')
                this.result.type_date = '';
              else{
                var cDate = this.result.type_date;
                this.result.ptype_date = myExtObject.conDate(this.result.type_date);
              }
              if(typeof this.result.pchk4 =='undefined')
                this.result.pchk4 = '';
              if(typeof this.result.pchk5 =='undefined')
                this.result.pchk5 = '';
              if(typeof this.result.pchk5 =='undefined')
                this.result.pchk5 = '';
              if(typeof this.result.puser_check_id =='undefined')
                this.result.puser_check_id = '';
              if(typeof this.result.puser_check =='undefined')
                this.result.puser_check = '';
              if(typeof this.result.ppost_check =='undefined')
                this.result.ppost_check = '';
              if(typeof this.result.ppresent_id =='undefined')
                this.result.ppresent_id = '';
              if(typeof this.result.ppresent_name =='undefined')
                this.result.ppresent_name = '';
              if(typeof this.result.ppresent_to =='undefined')
                this.result.ppresent_to = '';
              if(typeof this.result.puser_approve_id =='undefined')
                this.result.puser_approve_id = '';
              if(typeof this.result.puser_approve =='undefined')
                this.result.puser_approve = '';
              if(typeof this.result.ppost_approve =='undefined')
                this.result.ppost_approve = '';
              // else
              //   this.result.ppost_approve = this.result.ppost_approve+this.userData.courtName;
              if(typeof this.result.puser_pay_id =='undefined')
                this.result.puser_pay_id = '';
              if(typeof this.result.puser_pay =='undefined')
                this.result.puser_pay = '';
              if(typeof this.result.ppost_pay =='undefined')
                this.result.ppost_pay = '';
              if(typeof this.result.pprint_by =='undefined')
                this.result.pprint_by = '';
              this.result.puser_code = this.userData.userCode;
              this.result.prun_id = this.run_id;
              this.result.papp_seq = this.app_seq;
              let paramData = JSON.stringify($.extend({},this.result));
                console.log(paramData)
                // alert(paramData);return false;
                this.printReportService.printReport(rptName,paramData);
              if(cDate)
                this.result.type_date = cDate;
          }

    }


    getPre(val:any){
      if(val==1){
        this.result.pchk5 = null;
        this.result.ppost_to = this.getPostHead.ppost_to;
        this.result.ppost_to_copy = this.getPostHead.ppost_to;
      }else{
        this.result.pchk4 = null;
        this.result.ppost_to = this.getPostHead.ppost_approve+this.userData.courtName;
        this.result.ppost_to_copy = this.getPostHead.ppost_approve+this.userData.courtName;
      }
    }

    getPosition(type:any,value:any,post:any){
      console.log(value)
      var student = JSON.stringify({
        "table_name" : "pposition",
        "field_id" : "post_id",
        "field_name" : "post_name",
        "condition" : " AND post_id='"+value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.length){
              this.result[post] = productsJson[0].fieldNameValue;
          }else{
              this.result[post] = '';
          }
        },
        (error) => {}
      )
    }

    submitModalForm(){

    }

}







