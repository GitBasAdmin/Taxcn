import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError,startWith } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import {ActivatedRoute} from '@angular/router';

declare var myExtObject: any;

@Component({
  selector: 'app-ffn0421,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './ffn0421.component.html',
  styleUrls: ['./ffn0421.component.css']
})

export class Ffn0421Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
  sessData:any;
  userData:any;
  programName:any;
  getLitType:any;
  getCardType:any;
  result:any = [];
  items:any = [];
  itemsTmp:any = [];
  checkList:any = [];
  delIndex:any;
  modalType:any;
  queryParams:any;

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldName3:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  public loadModalLitComponent: boolean = false;
  public loadModalBankComponent: boolean = false;
  public loadPopupPrintChequeComponent : boolean = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChildren('attachFile') attachFile: QueryList<ElementRef>;
  @ViewChild('cancel_flag',{static: true}) cancel_flag : ElementRef;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ){  }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy : true,
      retrieve: true,
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      this.queryParams = {
        "run_id" : params['run_id'],
        "payback_running" : params['payback_running'],
        "pay_flag" : params['pay_flag'],
        "rcv_amt" : params['rcv_amt'],
        "payback_rcv_running" : params['payback_rcv_running']
      }

      this.loadData();
      //console.log(this.queryParams)
    });
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
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
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:null,fieldNameValue: ''});
        console.log(getDataOptions)
        this.getCardType = getDataOptions;
      },
      (error) => {}
    )

    this.successHttp();
    this.setDefPage();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "ffn0421"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  setDefPage(){
    this.result = [];
    this.result.payback_rcv_type = 1;
  }

  clear_rcv_name(checked:any){
    if(checked==true)
      this.result.rcv_name = this.result.pay_name;
    else
    this.result.rcv_name = '';
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.destroy();
    this.dtTrigger.next(null);
      });}

 ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ClearAll(){
      window.location.reload();
    }

    clickOpenMyModalComponent(type:any){
      if(type==1111){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(type==1 && !this.result.pay_to){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาเลือกจ่ายเงินให้แก่');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        this.modalType = type;
        this.openbutton.nativeElement.click();
      }
    }

    loadMyModalComponent(){
      if(this.modalType==1 || this.modalType==2){
        $("#exampleModal").find(".modal-content").css("width","800px");
        if(this.modalType==1){
          this.listTable='3';
        }else{
          this.listTable='2';
        }
        this.loadModalComponent = false;  
        this.loadModalConfComponent = false;
        this.loadModalLitComponent = true;
        this.loadModalBankComponent = false;
        this.loadPopupPrintChequeComponent = false;
      }else if(this.modalType==3){
        $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pcourt",
           "field_id" : "court_id",
           "field_name" : "court_name",
           "field_name2" : "court_running",
           "condition" : "",
          "userToken" : this.userData.userToken
        });    
        this.listTable='pcourt';
        this.listFieldId='court_id';
        this.listFieldName='court_name';
        this.listFieldName2='court_running';
        this.listFieldCond="";
      }else if(this.modalType==4){
        $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "ppublishing_house",
           "field_id" : "publishing_id",
           "field_name" : "publishing_rcv",
           "condition" : "",
            "userToken" : this.userData.userToken
        });    
        this.listTable='ppublishing_house';
        this.listFieldId='publishing_id';
        this.listFieldName='publishing_rcv';
        this.listFieldCond="";
      }else if(this.modalType==5){
        $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pbank",
           "field_id" : "bank_id",
           "field_name" : "bank_name",
           "condition" : "",
            "userToken" : this.userData.userToken
        });    
        this.listTable='pbank';
        this.listFieldId='bank_id';
        this.listFieldName='bank_name';
        this.listFieldCond="";
      }else if(this.modalType==6){
        $("#exampleModal").find(".modal-content").css("width","950px");
        this.loadModalComponent = false;  
        this.loadModalConfComponent = false;
        this.loadModalLitComponent = false;
        this.loadModalBankComponent = true;
        this.loadPopupPrintChequeComponent = false;
      }

      if(this.modalType==3 || this.modalType==4 || this.modalType==5){
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
            this.loadModalComponent = true;  
            this.loadModalConfComponent = false;
            this.loadModalLitComponent = false;
            this.loadModalBankComponent = false;
            this.loadPopupPrintChequeComponent = false;
          },
          (error) => {}
        )
      }
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

          this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student ).subscribe(
            posts => {
              let productsJson : any = JSON.parse(JSON.stringify(posts));
              console.log(productsJson)
              if(productsJson.result==1){
                if(this.modalType==7){
                  const confirmBox2 = new ConfirmBoxInitializer();
                  confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
                  confirmBox2.setMessage('ยืนยันการลบข้อมูล');
                  confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
                  // Choose layout color type
                  confirmBox2.setConfig({
                      layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      
                      this.SpinnerService.show();
                      let headers = new HttpHeaders();
                      headers = headers.set('Content-Type','application/json');
                      
                      var dataDel = [],dataTmp=[];
                          dataDel['log_remark'] = chkForm.log_remark;
                          dataDel['userToken'] = this.userData.userToken;
                          dataTmp.push(this.itemsTmp[this.delIndex]);
                          dataDel['data'] = dataTmp;
                          var data = $.extend({}, dataDel);
                          console.log(data)
                          this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0421/delData', data ).subscribe(
                            (response) =>{
                              let alertMessage : any = JSON.parse(JSON.stringify(response));
                              console.log(alertMessage)
                              if(alertMessage.result==0){
                                confirmBox.setMessage(alertMessage.error);
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
                              }else{
                                confirmBox.setMessage(alertMessage.error);
                                confirmBox.setButtonLabels('ตกลง');
                                confirmBox.setConfig({
                                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                });
                                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                  if (resp.success==true){
                                    this.closebutton.nativeElement.click();
                                    this.setDefPage();
                                    this.loadData();
                                  }
                                  subscription.unsubscribe();
                                });
                              }
                            },
                            (error) => {this.SpinnerService.hide();}
                          )
                          
      
                    }
                    subscription2.unsubscribe();
                  });
                }else{
                  //console.log(this.cancel_flag)
                  this.cancel_flag.nativeElement.checked = true;
                  this.result.log_remark = chkForm.log_remark;
                  this.closebutton.nativeElement.click();
                }
                
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

    receiveFuncListData(event:any){
      console.log(event)
      if(this.modalType==1 || this.modalType==2){
        var title = event.title?event.title:'';
        this.result.pay_name = title+event.lit_name;
        this.result.item = event.seq;
        if(this.modalType==2)
          this.result.pay_to = event.lit_type;
      }else if(this.modalType==3 || this.modalType==4){
        this.result.pay_name = event.fieldNameValue;
      }else if(this.modalType==5){
        this.result.bank_id = event.fieldIdValue;
        this.result.bank_name = event.fieldNameValue;
      }
      this.closebutton.nativeElement.click();
    }

    receiveBankListData(event:any){
      this.result.bank_id =  event.bank_id;
      this.result.bank_name =  event.bank_name;
      this.result.book_account = event.book_account;
      this.result.bankbranch = event.bankbranch;
      this.closebutton.nativeElement.click();
    }

    receiveFuncPrintCheque(event:any){
       this.printCheque(event);
       this.closebutton.nativeElement.click();
    }

  printCheque(event:any){
    var rptName = 'rfn0601';
    var paramData = JSON.stringify({
      "ppayback_running" : this.queryParams.ppayback_running,
      "pbook_no" : this.result.book_no,
      "pcheck_no" : this.result.check_no,
      "ppay" : event.ppay,
      "pmark" : event.pmark,
      "pcase" : event.pcase,
      "pdate" : event.pdate,
      "pbank" : event.pbank,
      "pline" : event.pline,
      "pline_unit" : event.pline_unit
    });
    console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }

    closeModal(){
      this.loadModalComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalBankComponent = false;
      this.loadPopupPrintChequeComponent = false;
    }

    tabChangeInput(name:any,event:any){
      if(name=='item'){
        if(this.queryParams.run_id && event.target.value && this.result.pay_to){
          var student = JSON.stringify({
            "table_name" : "pcase_litigant",
            "field_id" : "lit_running",
            "field_name" : "title",
            "field_name2" : "name",
            "condition" : " AND run_id='"+this.queryParams.run_id+"' AND seq='"+event.target.value+"' AND lit_type='"+this.result.pay_to+"'",
            "userToken" : this.userData.userToken
          });    
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/getAllRecData', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
              if(productsJson.length){
                var title = productsJson[0].title?productsJson[0].title:'';
                this.result.pay_name = title+productsJson[0].name;
              }else{
                this.result.item = '';
                this.result.pay_name = '';
              }
            },
            (error) => {}
          )
        }
      }else if(name=='bank_id'){
        var student = JSON.stringify({
          "table_name" : "pbank",
          "field_id" : "bank_id",
          "field_name" : "bank_name",
          "condition" : " AND bank_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.bank_name = productsJson[0].fieldNameValue;
          }else{
            this.result.bank_id = '';
            this.result.bank_name = '';
          }
          },
          (error) => {}
        )
      }
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }
    
    printReport(){
      var rptName = 'rct9996';
      var paramData ='{}';
       var paramData = JSON.stringify({
         "pprint_by" : '2'
       });
      this.printReportService.printReport(rptName,paramData);
    }

    loadData(){
      if(this.queryParams.payback_running){
        var student = JSON.stringify({
          "payback_running" : this.queryParams.payback_running,
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0421/getData', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            console.log(alertMessage)
            if(alertMessage.result==1){
              if(alertMessage.data.length){
                this.items = alertMessage.data;
                this.itemsTmp = JSON.parse(JSON.stringify(alertMessage.data));
                //this.dtTrigger.next(null);
                if(this.queryParams.payback_rcv_running){
                  var filter = this.items.filter((x:any) => x.payback_rcv_running === parseInt(this.queryParams.payback_rcv_running));
                  if(filter.length)
                    this.editData(filter[0],1);
                }
                this.rerender();
              }else{
                this.items = [];
                //this.dtTrigger.next(null);
                this.rerender();
              }
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
                  this.items = [];
                  this.itemsTmp = [];
                  //this.dtTrigger.next(null);
                  this.rerender();
                }
                subscription.unsubscribe();
              });
            }
          },
          (error) => {}
        )

        //====================== เช็ค ==========================
        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0620/checkListData', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            console.log(alertMessage)
            this.checkList = alertMessage.data;
          },
          (error) => {}
        )

      }else{
        this.items = [];
        this.itemsTmp = [];
        //this.dtTrigger.next(null);
        this.rerender();
      }
    }

    saveData(){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.result.payback_rcv_amt){
        confirmBox.setMessage('ท่านยังไม่ได้กรอกจำนวนเงิน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        this.saveDataCommit();
      }
    }

    saveDataCommit(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var student = $.extend({},this.result);
      student['run_id'] = this.queryParams.run_id;
      student['payback_running'] = this.queryParams.payback_running;
      student['pay_flag'] = this.queryParams.pay_flag;
      student['userToken'] = this.userData.userToken;
      console.log(student)
        
      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0421/saveData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){

              //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.setDefPage();
                  this.loadData();
                  this.removeParam("payback_rcv_running", window.location.href);
                }
                subscription.unsubscribe();
              });
              //-----------------------------//

          }else{
            //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  
                }
                subscription.unsubscribe();
              });
            //-----------------------------//
          }

        },
        (error) => {}
      )
      
    }

    editData(i:any,type:any){
      
      if(type==2){
        this.SpinnerService.show();
        setTimeout(() => {
          this.result = this.itemsTmp[i];
          this.result.payback_rcv_type = this.result.payback_rcv_type?parseInt(this.result.payback_rcv_type):null;
          this.result.pay_to = this.result.pay_to?parseInt(this.result.pay_to):null;
          this.result.rcv_card = this.result.rcv_card?parseInt(this.result.rcv_card):null;
          this.SpinnerService.hide();
          this.removeParam("payback_rcv_running", window.location.href);
        }, 300);
      }else{
        this.result = i;
        this.result.payback_rcv_type = this.result.payback_rcv_type?parseInt(this.result.payback_rcv_type):null;
        this.result.pay_to = this.result.pay_to?parseInt(this.result.pay_to):null;
        this.result.rcv_card = this.result.rcv_card?parseInt(this.result.rcv_card):null;
      }
      
    }

    delData(i:any){
      this.delIndex = i;
      this.clickOpenMyModalComponent(7);
      this.removeParam("payback_rcv_running", window.location.href);
    }

    confirmCancel(checked:any){
      if(checked==true){
        if(!this.result.check_running){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('กรุณาคลิกแก้ไขข้อมูลเช็คที่ต้องการยกเลิก');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.cancel_flag.nativeElement.checked = false;
            }
            subscription.unsubscribe();
          });
        }else{
          this.clickOpenMyModalComponent(8);
        }
      }
      
    }

    closeWin(){
      if(this.queryParams.run_id)
        window.opener.myExtObject.openerReloadName('payback_running',this.queryParams.payback_running);
      else
        window.opener.myExtObject.openerReloadName('payback_running','');
      window.close();
    }

    removeParam(key:any, sourceURL:any) {
      var rtn = sourceURL.split("?")[0],
          param:any,
          params_arr = [],
          queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
      if (queryString !== "") {
          params_arr = queryString.split("&");
          for (var i = params_arr.length - 1; i >= 0; i -= 1) {
              param = params_arr[i].split("=")[0];
              if (param === key) {
                  params_arr.splice(i, 1);
              }
          }
          if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
      }
      //return rtn;
      location.replace(rtn);
    }
    
}






