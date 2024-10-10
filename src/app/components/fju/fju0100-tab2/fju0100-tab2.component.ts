import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,ViewChildren, QueryList  } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerService } from "ngx-spinner"; 
import { PrintReportService } from 'src/app/services/print-report.service';
import {Observable,of, Subject  } from 'rxjs';
declare var myExtObject: any;
@Component({
  selector: 'app-fju0100-tab2',
  templateUrl: './fju0100-tab2.component.html',
  styleUrls: ['./fju0100-tab2.component.css']
})
export class Fju0100Tab2Component implements AfterViewInit, OnInit, OnDestroy {

  result:any = [];
  resultTmp:any = [];
  appealData:any = [];
  appealDataTmp:any = [];
  //appealDate:any = [];
  appealDate$:Observable<any>;
  myExtObject: any;
  sessData:any;
  userData:any;
  headData:any;
  getOrder:any;
  getResult:any;
  modalType:any;
  delIndex:any;
  caseTypeValue:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalConfComponent: boolean = false;
  public loadModalIndictComponent: boolean = false;
  public loadModalListComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadModalJudgeGroupComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  @Input() set getTab(getTab: any) {//รับจาก fju0100-main
    if(typeof getTab !='undefined' && getTab.index==1){
      myExtObject.callCalendar();
    }
  }
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100-main
    console.log(getDataHead)
    if(typeof getDataHead !='undefined'){
      this.headData = getDataHead;
      this.caseTypeValue = this.headData.case_type;
      if(this.headData.caseEvent==2){
        setTimeout(() => {
          this.getAppealJudgeData(0);
        }, 2500);
      }else{
        this.getAppealJudgeData(0);
      }
    }
  }
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy: true,
    };

    //======================== porder_type ======================================
    var student = JSON.stringify({
      "table_name" : "porder_type",
      "field_id" : "order_type",
      "field_name" : "order_type_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getOrder = getDataOptions;
      },
      (error) => {}
    )
    //======================== porder_type ======================================
    var student = JSON.stringify({
      "table_name" : "pappeal_judge_result",
      "field_id" : "result_id",
      "field_name" : "result_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getResult = getDataOptions;
      },
      (error) => {}
    )

    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.result.court_level = 1;
    if(this.appealData.length){
      this.result.all_item = this.appealData.length;
      this.result.judge_item = parseInt(this.appealData.length)+1;
      this.resultTmp.judge_item = parseInt(this.appealData.length)+1;
    }
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
      //this.dtTrigger.unsubscribe();
    }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  getAppealJudgeData(type:any){
    if(typeof this.headData !='undefined' && this.headData.run_id){
      this.sessData=localStorage.getItem(this.authService.sessJson);
      this.userData = JSON.parse(this.sessData);
      var student = JSON.stringify({
        "run_id" : this.headData.run_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/getAppealJudgeData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.appealData = getDataOptions.data;
            this.result.all_item = getDataOptions.data.length;
            
            var bar = new Promise((resolve, reject) => {
              this.appealData.forEach((ele, index, array) => {
                  if(ele.judge_desc && ele.judge_desc.length>25){
                    ele.judge_desc_short = ele.judge_desc.substring(0,25)+"...";
                  }
              });
            });
            if(bar){
              this.rerender();
              if(!type){
                const item = this.appealData.reduce((prev:any, current:any) => (+prev.judge_item > +current.judge_item) ? prev : current)
                this.result.judge_item = item.judge_item+1;
                this.resultTmp.judge_item = item.judge_item+1;
              }else{
                var indexObj = this.appealData.filter((x:any) => x.judge_item === type);
                console.log(indexObj)
                if(indexObj.length){
                  this.result = $.extend([],indexObj[0]);
                  this.resultTmp = $.extend([],indexObj[0]);
                  this.result.all_item = getDataOptions.data.length;
                }
              }
            }
            this.appealDataTmp = JSON.stringify(getDataOptions.data);
            
          }else{
            this.result.judge_item = 1;
            this.resultTmp.judge_item = 1;
            this.appealData = [];
            this.result.all_item = '';
          }
        },
        (error) => {}
      );
    }else{
      this.rerender();
    }
  }

  editData(index:any,type:any){
    this.SpinnerService.show();
    this.result = [];
    if(type==1){
      this.result = $.extend([],this.appealData[index]);
      this.resultTmp = $.extend([],this.appealData[index]);
    }else{
      this.result = $.extend([],index);
      this.resultTmp = $.extend([],index);
    }
    this.result.all_item = this.appealData.length;
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  delData(index:any){
    this.delIndex = index;
    this.clickOpenMyModalComponent(100);
  }

  prevAppeal(){
    if(this.resultTmp.judge_item!=1){
      var indexObj = this.appealData.filter((x:any) => x.judge_item === parseInt(this.result.judge_item)-1);
      console.log(indexObj)
      if(indexObj.length)
        this.editData(indexObj[0],2)
    }
  }

  nextAppeal(){
    if(this.resultTmp.judge_item<this.appealData.length){
      var indexObj = this.appealData.filter((x:any) => x.judge_item === parseInt(this.result.judge_item)+1);
      console.log(indexObj)
      if(indexObj.length)
        this.editData(indexObj[0],2)
    }else{
      this.setDefPage();
    }
  }

  cancelData(){
    console.log(this.resultTmp.running)
    if(typeof this.resultTmp.running !='undefined'){
      this.editData(this.resultTmp,2);
    }else{
      this.setDefPage();
    }
  }

  editDataInput(event:any){
    if(event.target.value){
      var indexObj = this.appealData.filter((x:any) => x.judge_item === parseInt(event.target.value));
      console.log(indexObj)
      if(indexObj.length){
        this.editData(indexObj[0],2)
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ไม่พบข้อมูลคำพิพากษาครั้งที่ '+event.target.value);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.setDefPage();
          }
          subscription.unsubscribe();
        });
      }
    }
  }

  getAppealDate(value:any){
    if(typeof this.headData !='undefined' && this.headData.run_id){
      if(value==2 || value==3){
        var student = JSON.stringify({
          "run_id" : this.headData.run_id,
          "court_level" : value,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        
        this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/getAppealList', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.data.length){
              this.appealDate$ = of(getDataOptions.data);          
            }else{
              this.appealDate$ = of();  
            }
          },
          (error) => {}
        );
      }
    }else{
      this.appealDate$ = of();  
    }
  }

  closeModal(){
    this.loadModalConfComponent = false;
    this.loadModalIndictComponent = false;
    this.loadModalListComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalJudgeGroupComponent = false;
  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==2){
      this.result.judge_desc = event.fieldNameValue2;
    }
    this.closebutton.nativeElement.click();
  }

  receiveJudgeListData(event:any){
    console.log(event)
    if(this.modalType==4){
      this.result.judge_id1=event.judge_id;
      this.result.judge_name1=event.judge_name;
    }else if(this.modalType==5){
      this.result.judge_id2=event.judge_id;
      this.result.judge_name2=event.judge_name;
    }else if(this.modalType==6){
      this.result.judge_id3=event.judge_id;
      this.result.judge_name3=event.judge_name;
    }else if(this.modalType==7){
      this.result.judge_id4=event.judge_id;
      this.result.judge_name4=event.judge_name;
    }
    this.closebutton.nativeElement.click();
  }

  receiveJudgeGroupListData(event:any){
    console.log(event)
    if(this.modalType==3){
      this.result.judge_id1=event.judge_id1;
      this.result.judge_name1=event.judge_name1;

      this.result.judge_id2=event.judge_id2;
      this.result.judge_name2=event.judge_name2;
    }
    this.closebutton.nativeElement.click();
  }

  receiveFuncIndictData(event:any){
    console.log(event)
    this.result.judge_desc = event.index.jbrand_desc
    this.closebutton.nativeElement.click();
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    console.log(this.headData)
    if((type==1) && typeof this.headData =='undefined'){
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
    }else{
      this.openbutton.nativeElement.click();
    }
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==100){
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalConfComponent = true;
      this.loadModalIndictComponent = false;
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
    }else if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "case_type" : this.caseTypeValue,
        "court_type_id" : this.headData.case_court_type,
        "search_desc" : "",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popupJband', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          this.loadModalConfComponent = false;
          this.loadModalIndictComponent = true;
          this.loadModalListComponent = false;
          this.loadModalJudgeComponent = false;
          this.loadModalJudgeGroupComponent = false;
          console.log(response)
        },
        (error) => {}
     )
    }else if(this.modalType==2){
      $("#exampleModal").find(".modal-content").css("width","700px");
      var student = JSON.stringify({
        "table_name" : "pjudge_brand",
        "field_id" : "jbrand_id",
        "field_name" : "jbrand_name",
        "field_name2" : "jbrand_desc",
        "search_id" : "",
        "search_desc" : "",
        "condition" : " AND case_type='"+this.headData.case_type+"'",
        "userToken" : this.userData.userToken});
      this.listTable='pjudge_brand';
      this.listFieldId='jbrand_id';
      this.listFieldName='jbrand_name';
      this.listFieldName2='jbrand_name2';
      this.listFieldNull='';
      this.listFieldCond=" AND case_type='"+this.headData.case_type+"'";
    }else if(this.modalType==3){
      $("#exampleModal").find(".modal-content").css({"width":"950px"});
      this.loadModalConfComponent = false;
      this.loadModalIndictComponent = false;
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = true;
    }else if(this.modalType==4 || this.modalType==5 || this.modalType==6 || this.modalType==7){
      $("#exampleModal").find(".modal-content").css({"width":"650px"});
      var student = JSON.stringify({
        "cond":2,
        "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.listFieldType=JSON.stringify({"type":2});
      this.loadModalConfComponent = false;
      this.loadModalIndictComponent = false;
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = true;
      this.loadModalJudgeGroupComponent = false;
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
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
    }
    console.log(student)
    if(this.modalType==2){
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;

          this.loadModalConfComponent = false;
          this.loadModalIndictComponent = false;
          this.loadModalListComponent = true;
          this.loadModalJudgeComponent = false;
          this.loadModalJudgeGroupComponent = false;

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
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
        if(productsJson.result==1){
          

                  if(this.modalType==100){
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
                      var student = this.appealData[this.delIndex];
                      student['log_remark'] = chkForm.log_remark;
                      student["userToken"] = this.userData.userToken;
                      console.log(student)
                      this.http.disableLoading().post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/deleteAppealJudge', student , {headers:headers}).subscribe(
                        (response) =>{
                          let alertMessage : any = JSON.parse(JSON.stringify(response));
                          console.log(alertMessage)
                          if(alertMessage.result==0){
                            const confirmBox = new ConfirmBoxInitializer();
                            confirmBox.setTitle('ข้อความแจ้งเตือน');
                            confirmBox.setMessage(alertMessage.error);
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription2 = confirmBox.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                              }
                              subscription2.unsubscribe();
                            });
                          }else{
                            const confirmBox = new ConfirmBoxInitializer();
                            confirmBox.setTitle('ข้อความแจ้งเตือน');
                            confirmBox.setMessage(alertMessage.error);
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription2 = confirmBox.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.getAppealJudgeData(0);
                              }
                              subscription2.unsubscribe();
                            });
                          }
                        },
                        (error) => {}
                      )
                    }
                    subscription.unsubscribe();
                    });
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

  tabChangeInput(name:any,event:any){
    if(name=="judge_id1"){
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
          this.result.judge_name1 = productsJson[0].fieldNameValue;
        }else{
          this.result.judge_id1 = '';
          this.result.judge_name1 = '';
        }
        },
        (error) => {}
      )
    }else if(name=="judge_id2"){
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
          this.result.judge_name2 = productsJson[0].fieldNameValue;
        }else{
          this.result.judge_id2 = '';
          this.result.judge_name2 = '';
        }
        },
        (error) => {}
      )
    }else if(name=="judge_id3"){
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
          this.result.judge_name3 = productsJson[0].fieldNameValue;
        }else{
          this.result.judge_id3 = '';
          this.result.judge_name3 = '';
        }
        },
        (error) => {}
      )
    }else if(name=="judge_id4"){
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
          this.result.judge_name4 = productsJson[0].fieldNameValue;
        }else{
          this.result.judge_id4 = '';
          this.result.judge_name4 = '';
        }
        },
        (error) => {}
      )
    }
  }

  saveData(){
    const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(typeof this.headData =='undefined'){
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.order_type){
      confirmBox.setMessage('กรุณาป้อนข้อมูลประเภทคำสั่ง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      var student = $.extend({},this.result);
      delete student.all_item;
      if(!student.running)
        student.running = 0;
      student['run_id'] = this.headData.run_id;
      student['userToken'] = this.userData.userToken;
      console.log(student)
      
      this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/saveAppealJudge', student ).subscribe(
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
                  //this.result.running = getDataOptions.notice_running;
                  this.getAppealJudgeData(getDataOptions.judge_item);
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
  }

  
printReport(judge_item:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');

  if(!this.headData.run_id){
    confirmBox.setMessage('กรุณาค้นหาเลขคดี');
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
    var rptName = 'rfmg0200';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "prun_id" : this.headData.run_id,
      "pjudge_item" : judge_item,
    });
    console.log(paramData)
    // alert(paramData);return false;
    this.printReportService.printReport(rptName,paramData);
  }
}

openLink(){
  let winURL = window.location.href.split("/#/")[0]+"/#/";
  console.log(winURL)
    if(this.headData.run_id)
      myExtObject.OpenWindowMaxName(winURL+'fno0900?run_id='+this.headData.run_id,'fno0900');
    else
      myExtObject.OpenWindowMaxName(winURL+'fno0900','fno0900');
}


}
