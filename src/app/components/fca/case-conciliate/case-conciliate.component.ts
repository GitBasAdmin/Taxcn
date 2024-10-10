import { Component, OnInit,Input,Output,EventEmitter,ViewChild,AfterViewInit,AfterContentInit,ElementRef,ViewChildren, QueryList  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { DataTableDirective } from 'angular-datatables';
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
} from '@angular/router';
import {Observable,of, Subject  } from 'rxjs';
import * as $ from 'jquery';
declare var myExtObject: any;
@Component({
  selector: 'case-conciliate',
  templateUrl: './case-conciliate.component.html',
  styleUrls: ['./case-conciliate.component.css']
})
export class CaseConciliateComponent implements AfterViewInit,OnInit,AfterContentInit {
  sessData:any;
  userData:any;
  result:any = [];
  run_id:any;
  modalType:any;
  myExtObject: any;
  dataHistorical:any = [];
  eventType:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;


  public loadModalJudgeComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  public loadModalConcComponent : boolean = false; //popup conciliate
  masterSelect:boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']]
    };


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      this.run_id = params['run_id'];
      
      if(this.run_id>0){
        this.getData();
      }
    });
    this.setDefPage();
  }
  
  setDefPage(){
    this.result = [];
    this.run_id = this.run_id;
    this.result.conciliate_type = 2;
    this.eventType = '';
  }
 


  ngAfterContentInit() : void{
    myExtObject.callCalendar();
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

  tabChangeInput(name:any,event:any,type:any){
    let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
    if(name=='conciliate_id'){
      if(type==2){
        var student = JSON.stringify({
          "table_name" : "pconciliate",
          "field_id" : "conciliate_id",
          "field_name" : "conciliate_name",
          "condition" : " AND conciliate_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });   
      }else{
        var student = JSON.stringify({
          "table_name" : "pjudge",
           "field_id" : "judge_id",
           "field_name" : "judge_name",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
      }
      console.log(student)
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));

          if(productsJson.length){
            this.result.conciliate_name = productsJson[0].fieldNameValue;
          }else{
            this.result.conciliate_id = null;
            this.result.conciliate_name = '';
          }
         },
         (error) => {}
       )
    }else if(name=='conciliate_post_id'){
      var student = JSON.stringify({
        "table_name" : "pposition",
        "field_id" : "post_id",
        "field_name" : "post_name",
        "condition" : " AND post_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });   
      console.log(student)
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));

          if(productsJson.length){
            this.result.conciliate_post_name = productsJson[0].fieldNameValue;
          }else{
            this.result.conciliate_post_id = null;
            this.result.conciliate_post_name = '';
          }
         },
         (error) => {}
       )
    }
  }

  

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  closeModal(){
    this.loadModalJudgeComponent = false;
    this.loadModalComponent = false;
    this.loadModalConfComponent = false;
    this.loadModalConcComponent = false;
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
                    
                      this.SpinnerService.show();
                      let headers = new HttpHeaders();
                      headers = headers.set('Content-Type','application/json');
                    if(this.modalType==8){
                      var dataDel = [],dataTmp=[];
                      dataDel['log_remark'] = chkForm.log_remark;
                      dataDel['userToken'] = this.userData.userToken;
                      var bar = new Promise((resolve, reject) => {
                        this.dataHistorical.forEach((ele, index, array) => {
                              if(ele.cRunning == true){
                                dataTmp.push(this.dataHistorical[index]);
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
                        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/deleteAllConciliateData', data , {headers:headers}).subscribe(
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
                                  this.getData();
                                  this.SpinnerService.hide();
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
                if (resp.success==true){}
                subscription.unsubscribe();
              });
            }
          },
          (error) => {}
        );

    }
  }

  receiveJudgeListData(event:any){
    this.result.conciliate_id = event.judge_id;
    this.result.conciliate_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  receiveFuncListData(event:any){
    if(this.modalType==3){
      this.result.conciliate_post_id=event.fieldIdValue;
      this.result.conciliate_post_name=event.fieldNameValue;
    }
    if(this.modalType==2){
      this.result.conciliate_id=event.fieldIdValue;
      this.result.conciliate_name=event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
   
    if(this.modalType==2){
      $("#exampleModal").find(".modal-content").css("width","750px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalConcComponent = true;
      var student = JSON.stringify({"userToken" : this.userData.userToken});    
      console.log(student)
      let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
     
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupConciliate', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson){
            this.list = productsJson;
            console.log(this.list)
          }else{
            this.list = [];
          }
         },
         (error) => {}
       )
    }else if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalComponent = false;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = true;
      this.loadModalConcComponent = false;
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
    }else if(this.modalType==3){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pposition",
         "field_id" : "post_id",
         "field_name" : "post_name",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='pposition';
      this.listFieldId='post_id';
      this.listFieldName='post_name';
      this.listFieldNull='';
    }else if(this.modalType==8){
      this.loadModalComponent = false;  
      this.loadModalConfComponent = true;
      this.loadModalJudgeComponent = false;
      this.loadModalConcComponent = false;
    }

    if(this.modalType==3){
      this.loadModalComponent = true;  
      this.loadModalConfComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalConcComponent = false;
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

  saveData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.run_id){
      confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.conciliate_id){
      confirmBox.setMessage('กรุณาระบุผู้ประนอม');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
		}else if(!this.result.start_date){
      confirmBox.setMessage('กรุณาระบุวันที่เริ่ม');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
		}else{
      var dataDel = [];
      dataDel['run_id'] = this.run_id;
      dataDel['conciliate_type'] = this.result.conciliate_type;
      dataDel['conciliate_item'] = this.result.conciliate_item;
      dataDel['conciliate_id'] = this.result.conciliate_id;
      dataDel['conciliate_name'] = this.result.conciliate_name;
      dataDel['conciliate_post_id'] = this.result.conciliate_post_id;
      dataDel['conciliate_post_name'] = this.result.conciliate_post_name;
      dataDel['start_date'] = this.result.start_date;
      dataDel['end_date'] = this.result.end_date;
      dataDel['history_running'] = this.result.history_running;
      dataDel['userToken'] = this.userData.userToken;
     
       
        if(this.eventType==1){
          var api = 'updateConciliate';
        }else{
          var api = 'insertConciliate';
        }
        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var data = $.extend({}, dataDel);
        console.log(data)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/'+api, data , {headers:headers}).subscribe(
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
                  this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
            }else{
              confirmBox.setMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.getData();
                  this.setDefPage();
                  this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      
    }
  }

  getData(){
      var student = JSON.stringify({
        "run_id" : this.run_id,
        "userToken" : this.userData.userToken
      });

    console.log(student)
      this.SpinnerService.show();
    let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getConciliateData', student , {headers:headers}).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.data.length){
          this.dataHistorical = productsJson.data;
          this.dataHistorical.forEach((x : any ) => x.cRunning = false);
          this.runSeq(this.dataHistorical);
          this.rerender();
          this.SpinnerService.hide();
        }else{
          this.dataHistorical = [];
          this.runSeq(this.dataHistorical);
          this.rerender();
          this.SpinnerService.hide();
        }
      },
      (error) => {}
    )
  }

  runSeq(dataObj:any){
    console.log(dataObj)
    if(dataObj.length){
      const item = dataObj.reduce((prev:any, current:any) => (+prev.conciliate_item > +current.conciliate_item) ? prev : current)
      this.result.conciliate_item = item.conciliate_item+1;
    }else{
      this.result.conciliate_item = 1;
    }
  }

  editData(index:any){
    this.SpinnerService.show();
    this.eventType = 1;
    this.result = $.extend([],this.dataHistorical[index]);
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  delData(){
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataHistorical.forEach((ele, index, array) => {
        if(ele.cRunning == true){
          del++;
        }
      });
    });
    if(bar){
      if(del){
        this.modalType = 8;
        this.openbutton.nativeElement.click();
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องการลบ');
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
      }
    }
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }

  closeWin(){
    if(this.run_id)
      window.opener.myExtObject.openerReloadRunId(this.run_id);
    else
      window.opener.myExtObject.openerReloadRunId(0);
    window.close();
  }

}
