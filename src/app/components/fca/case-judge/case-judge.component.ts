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
  selector: 'app-case-judge',
  templateUrl: './case-judge.component.html',
  styleUrls: ['./case-judge.component.css']
})


export class CaseJudgeComponent implements AfterViewInit, OnInit, OnDestroy {
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
  pRun_id:any;
  case_judge_id:any;
  own_new_flag:any;
  save_flag:boolean;

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
  public loadModalJudgeGroupComponent : boolean = false;

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
    this.dataSearch.deposit = "0.00";
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

    this.activatedRoute.queryParams.subscribe(params => {
      this.pRun_id = params['run_id'];
      this.result.run_id = params['run_id'];
      this.case_judge_id = params['case_judge_id'];
      this.own_new_flag = params['own_new_flag'];
      //console.log(this.pRun_id)
      this.setDefPage();
    });
    
     //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "passign_stat_condition",
      "field_id" : "condition_id",
      "field_name" : "condition_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAssign = getDataOptions;
      },
      (error) => {}
    )

      this.successHttp();
      this.setDefPage();
  }

  setDefPage(){
    this.result=[];
    this.result.run_id = this.pRun_id;
    this.result.assign_type = 5;
    this.result.start_date = this.result.assign_date = myExtObject.curDate();
    this.save_flag=false;
    this.searchData();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "case_judge"
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
          this.programId = getDataAuthen.programId;
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
      this.result.cFlag = 1;
      myExtObject.callCalendar();
    }

    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      this.openbutton.nativeElement.click();
    }
    loadMyModalComponent(){
      if(this.modalType==1){
        $("#exampleModal").find(".modal-content").css({"width":"950px"});
        this.loadModalComponent = false;  
        this.loadModalConfComponent = false;
        this.loadModalJudgeComponent = false;
        this.loadModalJudgeGroupComponent = true;
      }else if(this.modalType==2 || this.modalType==3 || this.modalType==4 || this.modalType==5){
        $("#exampleModal").find(".modal-content").css("width","650px");
        this.loadModalComponent = false;  
        this.loadModalConfComponent = false;
        this.loadModalJudgeComponent = true;
        this.loadModalJudgeGroupComponent = false;
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
      }else if(this.modalType==99){
        $("#exampleModal").find(".modal-content").css({"width":"600px"});
        this.loadModalComponent = false;  
        this.loadModalConfComponent = true;
        this.loadModalJudgeComponent = false;
        this.loadModalJudgeGroupComponent = false;
      }
    }

    changeAssign(event:any){

    }

    closeModal(){
      this.loadModalJudgeComponent = false;
      this.loadModalComponent = false;
      this.loadModalConfComponent = false;
      this.loadModalJudgeGroupComponent = false;
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
          var dataDel = this.dataSearch[this.delIndex];
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
  
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
  
              // Choose layout color type
              confirmBox2.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    var data = JSON.stringify({
                      "history_running" : dataDel.history_running,
                      "userToken" : this.userData.userToken
                    });
                    console.log(data)
                    this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/delCaseJudgeData', data , {headers:headers}).subscribe(
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
                              this.SpinnerService.hide();
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
                              this.searchData();
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
      this.closebutton.nativeElement.click();
    }
    receiveJudgeListData(event:any){
      console.log(event)
      if(this.modalType==2){
        this.result.judge_id=event.judge_id;
        this.result.judge_name=event.judge_name;
      }else if(this.modalType==3){
        this.result.judge_id_1=event.judge_id;
        this.result.judge_name_1=event.judge_name;
      }else if(this.modalType==4){
        this.result.judge_id_2=event.judge_id;
        this.result.judge_name_2=event.judge_name;
      }else if(this.modalType==5){
        this.result.judge_id_3=event.judge_id;
        this.result.judge_name_3=event.judge_name;
      }
      this.closebutton.nativeElement.click();
    }
    receiveJudgeGroupListData(event:any){
      console.log(event)
      this.result.judge_id=event.judge_id1;
      this.result.judge_name=event.judge_name1;

      this.result.judge_id_1=event.judge_id2;
      this.result.judge_name_1=event.judge_name2;
      this.closebutton.nativeElement.click();
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
        }else{
          this.result[objName] = null;
          this[objName] = null;
        }
      }
    }

    tabChangeInput(name:any,event:any){
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        if(name=='judge_id' || name=='judge_id_1' || name=='judge_id_2' || name=='judge_id_3'){
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
                if(name=='judge_id'){
                  this.result.judge_name = productsJson[0].fieldNameValue;
                }else if(name=='judge_id_1'){
                  this.result.judge_name_1 = productsJson[0].fieldNameValue;
                }else if(name=='judge_id_2'){
                  this.result.judge_name_2 = productsJson[0].fieldNameValue;
                }else if(name=='judge_id_3'){
                  this.result.judge_name_3 = productsJson[0].fieldNameValue;
                }

              }else{
                if(name=='judge_id'){
                  this.result.judge_id = '';
                  this.result.judge_name = '';
                }else if(name=='judge_id_1'){
                  this.result.judge_id1 = '';
                  this.result.judge_name_1 = '';
                }else if(name=='judge_id_2'){
                  this.result.judge_id2 = '';
                  this.result.judge_name_2 = '';
                }else if(name=='judge_id_3'){
                  this.result.judge_id3 = '';
                  this.result.judge_name_3 = '';
                }
              }
            },
            (error) => {}
          )
      }
    }

    searchData(){
      if(this.result.run_id || this.pRun_id){
        this.SpinnerService.show();
        var student = JSON.stringify({
          "run_id":this.result.run_id?this.result.run_id:this.pRun_id,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/getCaseJudgeData', student , {headers:headers}).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              console.log(productsJson);
              if(productsJson.result==1){
                this.dataSearch = productsJson.data;
                this.dataSearch.forEach((x : any ) => x.jRunning = false);
                this.rerender();
              }else{
                this.dataSearch = [];
                this.rerender();
              }
              this.SpinnerService.hide();
          },
          (error) => {}
        )
      }
    }

    saveData(){

      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
  
        
      if(!this.result.judge_id && !this.result.judge_id_1 && !this.result.judge_id_2 && !this.result.judge_id_3){
        confirmBox.setMessage('กรุณาป้อนข้อมูลผู้พิพากษา');
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
      }else if(this.result.judge_name=='' && this.result.judge_name_1=='' && this.result.judge_name_2=='' && this.result.judge_name_3==''){
        confirmBox.setMessage('กรุณาป้อนข้อมูลผู้พิพากษาที่มีอยู่ในระบบเท่านั้น');
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
      }else if(this.result.start_date==''){
        confirmBox.setMessage('กรุณาป้อนข้อมูลวันที่เริ่ม');
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
      // }else if( this.userData.userLevel !='A' && myExtObject.conDate(this.result.start_date) < myExtObject.conDate(myExtObject.curDate())){
      //   //รายการแก้ไขที่ 74
      //   confirmBox.setMessage('ไม่สามารถระบุวันที่เริ่มปฏิบัติหน้าที่ย้อนหลังได้ กรุณาติดต่อเจ้าหน้าที่ผู้ดูแลระบบ');
      //   confirmBox.setButtonLabels('ตกลง');
      //   confirmBox.setConfig({
      //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      //   });
      //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      //     if (resp.success==true){
      //     }
      //     subscription.unsubscribe();
      //   });
      }else{
        this.save_flag=true;
        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var student = $.extend({},this.result);
        student['run_id'] = this.result.run_id;
        student['userToken'] = this.userData.userToken;
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/insertCaseJudge', student , {headers:headers}).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              console.log(productsJson);
              if(productsJson.result==1){
                confirmBox.setMessage(productsJson.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.save_flag=false;
                    this.SpinnerService.hide();
                    this.setDefPage();
                    this.searchData();
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
                    this.save_flag=false;
                    this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
              }
              
          },
          (error) => {}
        )
      }
    }

    delAppData(index:any){
      console.log(myExtObject.conDate(this.dataSearch[index].start_date), myExtObject.conDate(myExtObject.curDate()));
      ////รายการแก้ไขที่ 74
      if( this.userData.userLevel !='A' && myExtObject.conDate(this.dataSearch[index].start_date) < myExtObject.conDate(myExtObject.curDate())){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ไม่สามารถลบเจ้าของสำนวนย้อนหลังได้ กรุณาติดต่อเจ้าหน้าที่ผู้ดูแลระบบ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
          }
          subscription.unsubscribe();
        });
      }else{
        this.delIndex = index;
        this.clickOpenMyModalComponent(99);
      }
    }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }


    closeWin(){
      if(this.pRun_id)
        window.opener.myExtObject.openerReloadRunId(this.pRun_id);
      else
        window.opener.myExtObject.openerReloadRunId(0);
      window.close();
    }

    
    

}







