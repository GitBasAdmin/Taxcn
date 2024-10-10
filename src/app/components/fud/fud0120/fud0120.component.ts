import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable,ViewChildren,Input, QueryList,Output,EventEmitter,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { NgbModal, NgbModalRef ,NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';
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
interface Window { angularFunc: any; }
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fud0120',
  templateUrl: './fud0120.component.html',
  styleUrls: ['./fud0120.component.css']
})


export class Fud0120Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  @Input() run_id :any;
  @Input() appeal_running :any;
  @Input() send_item :any;
 


  sessData:any;
  userData:any;
  programName:any;
  programId:any;

  result:any = [];
  tmpResult:any = [];
  appealData:any = [];
  myExtObject:any;
  modalType:any;
  delIndex:any;

  getDep:any;
  pdep_code:any;
  ptype:any;
  masterTmp:any;
  getAssign:any;
  //run_id:any;
  //send_item:any;
  //appeal_running:any;
  getLitType:any;
  event:any;

  getPostHead:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalJudgeComponent : boolean = false;
  public loadModalLitComponent : boolean = false;
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
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
    public activeModal: NgbActiveModal,
  ){ }

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
      if(params['run_id'])
        this.run_id = params['run_id'];
      if(params['appeal_running'])
        this.appeal_running = params['appeal_running'];
      if(params['send_item'])
      this.send_item = params['send_item'];
    });

      this.successHttp();
      this.setDefPage();
  }

  setDefPage(){
    this.result=[];
    this.result.send_date = myExtObject.curDate();
    this.result.lit_type = 1;
    this.result.judge_order = 3;
    this.litType();
    this.getData();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fud0120"
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

  litType(){
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    console.log(student)
     this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getLitType = getDataOptions;
      },
      (error) => {}
      )
  }

  runSeq(dataObj:any){
    console.log(dataObj)
    if(dataObj.length){
      const item = dataObj.reduce((prev:any, current:any) => (+prev.send_item > +current.send_item) ? prev : current)
      this.result.send_item = item.send_item+1;
    }else{
      this.result.send_item = 1;
    }
  }

  getData(){
    var student = JSON.stringify({
      "appeal_running" : this.appeal_running,
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0120/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result==1){
            
            //-----------------------------//
            if(getDataOptions.data.length){
              this.appealData = getDataOptions.data;
              this.runSeq(getDataOptions.data);
              if(this.send_item)
                this.editData(0,2);
            }else{
              this.appealData = [];
              this.runSeq([]);
              this.dtTrigger.next(null);
            }
            //-----------------------------//
        }else{
          //-----------------------------//
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          //-----------------------------//
        }

      },
      (error) => {}
    )
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
      if(this.modalType==1 || this.modalType==2 ){
        $("#exampleModal").find(".modal-content").css("width","800px");
        if(this.modalType==1){
          this.listTable='1';
        }else{
          this.listTable='2';
        }
        this.loadModalLitComponent = true;
        this.loadModalConfComponent = false;
        this.loadModalJudgeComponent = false;
      }else if(this.modalType==3){
        $("#exampleModal").find(".modal-content").css("width","650px");
        this.loadModalLitComponent = false;
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
        )
      }else if(this.modalType==4){
        /*
        $("#exampleModal").find(".modal-content").css({"width":"600px"});
        this.loadModalLitComponent = false;
        this.loadModalConfComponent = true;
        this.loadModalJudgeComponent = false;
        */
        const modalRef: NgbModalRef = this.ngbModal.open(ModalConfirmComponent,{ centered: true,windowClass: "center-modal" })
        modalRef.closed.subscribe((data) => {
          if(data) {
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูล');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.DANGER
            })
            confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                var student = JSON.stringify({
                  "log_remark" : data,
                  "appeal_running" : this.appealData[this.delIndex].appeal_running,
                  "send_item" : this.appealData[this.delIndex].send_item,
                  "userToken" : this.userData.userToken
                });
                console.log(student)
                this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0130/delExtendNotice', student).subscribe(
                  (response) =>{
                    let getDataOptions : any = JSON.parse(JSON.stringify(response));
                    console.log(getDataOptions)
                    this.getData();
                    this.setDefPage();
                    this.event = 1;
                  },
                  (error) => {}
                );
              }
            })
          }
        })
      }

      if(this.modalType==999){
        this.loadModalLitComponent = true;
        this.loadModalConfComponent = false;
        this.loadModalJudgeComponent = false;
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
          },
          (error) => {}
        )
      }
    }

    closeModal(){
      this.loadModalJudgeComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalConfComponent = false;
    }
    closeModal2(){
      if(this.event)
        this.activeModal.close(1)
      else
        this.activeModal.close();
    }



    receiveFuncListData(event:any){
      console.log(event)
      if(this.modalType==1){
        if(typeof event.fieldIdValue !='undefined'){
          this.result.send_person_item = event.fieldIdValue;
          this.result.send_person_name = event.fieldNameValue;
          this.result.lit_type = event.fieldNameValue2;
        }else{
          this.result.lit_type = event.lit_type;
          this.result.send_person_item = event.seq;
          var lit_name = event.lit_type_desc2?event.lit_name+" "+event.lit_type_desc2:event.lit_name;
          this.result.send_person_name = lit_name;
        }
      }else if(this.modalType==2){
        this.result.lit_type = event.lit_type;
          this.result.send_person_item = event.seq;
          var lit_name = event.lit_type_desc2?event.lit_name+" "+event.lit_type_desc2:event.lit_name;
          this.result.send_person_name = lit_name;
      }
      this.closebutton.nativeElement.click();
    }
    receiveJudgeListData(event:any){
      console.log(event)
      this.result.judge_order_id=event.judge_id;
      this.result.judge_order_name=event.judge_name;
      this.closebutton.nativeElement.click();
    }

    tabChangeInput(name:any,event:any){
      if(name=='judge_order_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.judge_order_name = productsJson[0].fieldNameValue;
          }else{
            this.result.judge_order_id = '';
            this.result.judge_order_name = '';
          }
          },
          (error) => {}
        )
      }else if(name=='send_person_item'){
        //console.log(this.dataHead.run_id +":"+ this.result.lit_type)
        if(this.run_id && this.result.lit_type){
          var student = JSON.stringify({
            "run_id": this.run_id,
            "lit_type": this.result.lit_type,
            "seq":event.target.value,
            "userToken" : this.userData.userToken
          }); 
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/popupLitName', student ).subscribe(
            (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.data.length){
              this.result.send_person_name = productsJson.data[0].lit_name+" "+productsJson.data[0].lit_type_desc2;
            }else{
              this.result.send_person_item = '';
              this.result.send_person_name = '';
              
            }
            },
            (error) => {}
          )
        }
      }
    }



    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }


    closeWin(){
      /*
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      if(this.run_id && this.appeal_running){
        var url = 'fud0100?run_id='+this.run_id+'&appeal_running='+this.appeal_running;
        window.opener.myExtObject.openerReloadUrl(url);
      }else
        window.opener.myExtObject.openerReloadUrl('fud0100');
      window.close();
      */
      window.opener.myExtObject.openerReloadOutSide('callFuncFromOutside');
      //console.log(Window)
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
                });
                console.log(paramData)
                // alert(paramData);return false;
                this.printReportService.printReport(rptName,paramData);

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
                if(this.modalType==4){
                  //console.log(this.delIndex)
                  const confirmBox2 = new ConfirmBoxInitializer();
                  confirmBox2.setTitle('ยืนยันการลบข้อมูล');
                  confirmBox2.setMessage('ต้องการลบข้อมูล ใช่หรือไม่');
                  confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
                   
                    confirmBox2.setConfig({
                        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                        if (resp.success==true){
                          var student = JSON.stringify({
                            "appeal_running" : this.appealData[this.delIndex].appeal_running,
                            "send_item" : this.appealData[this.delIndex].send_item,
                            "userToken" : this.userData.userToken
                          });
                          console.log(student)
                          this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0120/deleteData', student).subscribe(
                            (response) =>{
                              let getDataOptions : any = JSON.parse(JSON.stringify(response));
                              console.log(getDataOptions)
                              const confirmBox3 = new ConfirmBoxInitializer();
                              confirmBox3.setTitle('ข้อความแจ้งเตือน');
                              if(getDataOptions.result==1){
                                  //-----------------------------//
                                  confirmBox3.setMessage('ลบข้อมูลเรียบร้อยแล้ว');
                                  confirmBox3.setButtonLabels('ตกลง');
                                  confirmBox3.setConfig({
                                      layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.getData();
                                      this.setDefPage();
                                    }
                                    subscription3.unsubscribe();
                                  });
                                  //-----------------------------//
                  
                              }else{
                                //-----------------------------//
                                  confirmBox3.setMessage(getDataOptions.error);
                                  confirmBox3.setButtonLabels('ตกลง');
                                  confirmBox3.setConfig({
                                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.SpinnerService.hide();
                                    }
                                    subscription3.unsubscribe();
                                  });
                                //-----------------------------//
                              }
                  
                            },
                            (error) => {}
                          )
                        }
                        subscription2.unsubscribe();
                    });   
                }
                this.closebutton.nativeElement.click();
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

    saveData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var rData = $.extend({},this.result);
      rData.userToken = this.userData.userToken;
      if(!this.result.appeal_running)
        rData.appeal_running = this.appeal_running;
      console.log(rData)
      this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0120/saveData', rData ).subscribe(
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
                  this.getData();
                  this.event = 1;
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

    delData(i:any){
        this.delIndex = i;
        this.clickOpenMyModalComponent(4);
    }

    editData(i:any,type:any){
      this.SpinnerService.show();
      this.result = [];
      setTimeout(() => {
        //this.appealData[i].edit_send_item = this.appealData[i].send_item;
        if(type==1)
          this.result = JSON.parse(JSON.stringify(this.appealData[i]));
        else{
          var fine = this.appealData.filter((x:any) => x.send_item === parseInt(this.send_item));
          console.log(fine)
            if(fine.length){
              this.result = fine[0];
            }
        }
        this.SpinnerService.hide();
      }, 500);
    }

    keyPressNumbersWithDecimal(event) {
      var charCode = (event.which) ? event.which : event.keyCode;
      if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      }
      return true;
    }
    keyPressNumbers(event) {
      var charCode = (event.which) ? event.which : event.keyCode;
      // Only Numbers 0-9
      if ((charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    }

}







