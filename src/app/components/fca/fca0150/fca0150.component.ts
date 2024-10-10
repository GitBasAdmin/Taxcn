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
  CanActivateFn, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
  NavigationError,Routes
} from '@angular/router';
import {Observable,of, Subject  } from 'rxjs';
import * as $ from 'jquery';
declare var myExtObject: any;
@Component({
  selector: 'app-fca0150',
  templateUrl: './fca0150.component.html',
  styleUrls: ['./fca0150.component.css']
})
export class Fca0150Component implements AfterViewInit,OnInit,AfterContentInit {
  sessData:any;
  userData:any;
  result:any = [];
  run_id:any;
  modalType:any;
  modalRes:any;
  modalRes2:any;
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



  public loadModalComponent: boolean = false;
  public loadModalLitComponent: boolean = false;

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
    //this.setDefPage();
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
    this.loadModalComponent = false;
    this.loadModalLitComponent = false;
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
    console.log(event)
    if(this.modalType==1){
      this.result[this.modalRes] = event.lit_name;
      this.result[this.modalRes2] = event.lit_type_desc;
    }
    if(this.modalType==2){
      this.result[this.modalRes] = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  clickOpenMyModalComponent(type:any,result:any,result2:any){
    this.modalType = type;
    this.modalRes = result;
    this.modalRes2 = result2;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
   
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","750px");
      this.listTable='2';
      this.loadModalComponent = false;  
      this.loadModalLitComponent = true;
    }else if(this.modalType==2){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "plit_type",
         "field_id" : "lit_type",
         "field_name" : "lit_type_desc",
         "search_id" : "",
         "search_desc" : "",
         "condition" : " AND (lit_flag NOT IN ('g') OR lit_flag IS NULL)",
         "userToken" : this.userData.userToken});
      this.listTable='plit_type';
      this.listFieldId='lit_type';
      this.listFieldName='lit_type_desc';
      this.listFieldNull='';
      this.listFieldCond=" AND (lit_flag NOT IN ('g') OR lit_flag IS NULL)";
      console.log(student)
    }

    if(this.modalType==2){
      this.loadModalComponent = true;  
      this.loadModalLitComponent = false;
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

  

  getData(){
    var student = JSON.stringify({
      "run_id": this.run_id,
      "userToken" : this.userData.userToken
    });

    console.log(student)
      this.SpinnerService.show();
    let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/dataFromRunId', student , {headers:headers}).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.data[0]){
          this.result = productsJson.data[0];
          this.result.case_no = productsJson.data[0].title+productsJson.data[0].id+'/'+productsJson.data[0].yy;
          this.SpinnerService.hide();
        }else{
          this.result = [];
          this.SpinnerService.hide();
        }
      },
      (error) => {}
    )
  }

  updateCaseData(){
    //console.log(dataObject);return false;

      this.SpinnerService.show();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        
        var student = [];
        student['rpt_pros_desc'] = this.result.rpt_pros_desc;
        student['rpt_pros_type'] = this.result.rpt_pros_type;
        student['rpt_litigant_desc2'] = this.result.rpt_litigant_desc2;
        student['rpt_litigant_type2'] = this.result.rpt_litigant_type2;
        student['rpt_litigant_desc1'] = this.result.rpt_litigant_desc1;
        student['rpt_litigant_type1'] = this.result.rpt_litigant_type1;
        student['rpt_litigant_desc3'] = this.result.rpt_litigant_desc3;
        student['rpt_litigant_type3'] = this.result.rpt_litigant_type3;
        student['rpt_accu_desc'] = this.result.rpt_accu_desc;
        student['rpt_accu_type'] = this.result.rpt_accu_type;
        student['run_id'] = this.result.run_id;
        student['userToken'] = this.userData.userToken;
        student = $.extend({},student);
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/updateCaseData', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
              
                //-----------------------------//
                confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.SpinnerService.hide();
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
                    this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
              //-----------------------------//
              this.SpinnerService.hide();
            }

          },
          (error) => {}
        )
    
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
