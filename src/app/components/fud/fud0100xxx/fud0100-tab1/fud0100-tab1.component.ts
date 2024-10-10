import { Component, OnInit , ViewChild ,NgZone, ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,AfterContentInit,ViewChildren, QueryList,ViewEncapsulation   } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { tap, map, catchError,startWith } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerService } from "ngx-spinner"; 
declare var myExtObject: any;


@Component({
  selector: 'app-fud0100-tab1',
  templateUrl: './fud0100-tab1.component.html',
  styleUrls: ['./fud0100-tab1.component.css']
})
export class Fud0100Tab1Component implements AfterViewInit,AfterContentInit, OnInit, OnDestroy {
  result:any = [];
  resultTmp:any = [];
  appData:any = [];
  asData:any = [];
  sessData:any;
  userData:any;
  appealSend:any;
  appealType:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  myExtObject: any;
  modalType:any;
  delIndex:any;
  visibleApp:boolean = false;
  public dataSendHead:any

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
  public loadModalAppealComponent: boolean = false;

  @Output() onClickList = new EventEmitter<any>();
  //obsStates: Observable<any[]>;
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100
    //console.log(getDataHead)
    this.dataSendHead = getDataHead;
    if(typeof getDataHead !='undefined')
      this.setDefPage();
    this.getAppData();
  }
  @Input() set sendEdit(sendEdit: any) {//รับจาก fju0100
    //console.log(sendEdit)
    if(typeof sendEdit !='undefined')
      this.editData(sendEdit.data);
  }

  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
    private _ngZone: NgZone
  ) {
    (<any>window).angularFunc  = {callFuncFromOutside: this.callFuncFromOutside, zone: _ngZone};
   }
   callFuncFromOutside(){
     console.log('run')
     console.log(this.result)
    //console.log({'run_id':this.dataSendHead.run_id,'appeal_running':this.result.appeal_running});
    //this.onClickListData({'run_id':this.dataSendHead.run_id,'appeal_running':this.result.appeal_running});
  }
  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };
    //this.rerender();
    //(<any>window).angularFunc = (<any>window).my || {};
    //(<any>window).angularFunc.namespace = (<any>window).my.namespace || {};
    //(<any>window).angularFunc.namespace.publicFunc = this.runThisFunctionFromOutside.bind(this);

    console.log(window)
    if(typeof this.dataSendHead =='undefined')
      this.setDefPage();

  }

  setDefPage(){
    this.result = [];
    this.result.app_type_id = 0;
    
    this.getApealSend();
    this.result.appeal_type = 1;
    this.getAppealType(1,2);
    this.result.close_by = 0;
    this.result.send_by = 0;
    this.result.start_date = myExtObject.curDate();
    this.runSeq();
    //console.log(999)
  }

  getApealSend(){
    var student = JSON.stringify({
      "table_name" : "pappeal_send_to",
      "field_id" : "send_to_id",
      "field_name" : "send_to_name",
      "order_by" : " NVL(order_no,999) ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.appealSend = getDataOptions;
        if(!this.result.to_court)
          this.result.to_court = getDataOptions[0].fieldIdValue;
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
  ngAfterContentInit() : void{
    //console.log(88)
    myExtObject.callCalendar();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  getAppealType(val:any,type:any){
      //type 1คลิกจากหน้าจอ
      if(type==1){
        if(val==3 || val==4)
          this.result.to_court = 2;
        else
          this.result.to_court = this.appealSend[0].fieldIdValue;
      }
    var student = JSON.stringify({
      "table_name" : "pappeal_type",
      "field_id" : "app_type_id",
      "field_name" : "app_type_name",
      "condition" : " AND appeal_type='"+val+"'",
      "userToken" : this.getToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue:''});
        console.log(getDataOptions)
        this.appealType = getDataOptions;
        
      },
      (error) => {}
    )
  }

  getAppData(){
    if(typeof this.dataSendHead !='undefined')
      this.appData = this.dataSendHead.appObj?this.dataSendHead.appObj:[];
    else
      this.appData = [];
  }

  closeModal(){
    this.loadModalComponent = false;
    this.loadModalConfComponent = false;
    this.loadModalAppealComponent = false;
  }

  receiveFuncListData(event:any){
    if(this.modalType==1){
      if(typeof event.fieldIdValue !='undefined'){
        this.result.fee_id = event.fieldIdValue;
        this.result.fee_desc = event.fieldNameValue;
      }
    }
    this.closebutton.nativeElement.click();
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
                if(this.modalType==2){
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
                          if(this.modalType==2){
                            var student = JSON.stringify({
                              "appeal_running" : this.asData[this.delIndex].appeal_running,
                              "send_item" : this.asData[this.delIndex].send_item,
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
                                        //this.setDefPage();
                                        this.loadAsData();
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

  clickOpenMyModalComponent(type:any){
      this.modalType = type;
      this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==1){
      $("#exampleModal2").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
          "table_name" : "pcourt_fee",
          "field_id" : "seq",
          "field_name" : "fee_desc",
          "userToken" : this.userData.userToken
        });
      this.listTable='pappoint_list';
      this.listFieldId='app_id';
      this.listFieldName='app_name';
      this.listFieldCond="";
    }else if(this.modalType==2){
        this.loadModalComponent = false;
        this.loadModalConfComponent = true;
        this.loadModalAppealComponent = false;
        $("#exampleModal2").find(".modal-content").css("width","650px");
        $("#exampleModal2").find(".modal-body").css("height","auto");
        $("#exampleModal2").css({"background":"rgba(51,32,0,.4)"});
    }
    if(this.modalType==1){
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            this.loadModalComponent = true;
            this.loadModalConfComponent = false;
            this.loadModalAppealComponent = false;
        },
        (error) => {}
      )
      $("#exampleModal2").find(".modal-body").css("height","auto");
      $("#exampleModal2").css({"background":"rgba(51,32,0,.4)"});
    
    }
    
  }

  tabChangeInput(name:any,event:any){
    if(name=='fee_id'){
      var student = JSON.stringify({
        "table_name" : "pcourt_fee",
        "field_id" : "seq",
        "field_name" : "fee_desc",
        "condition" : " AND seq='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.fee_desc = productsJson[0].fieldNameValue;
        }else{
          this.result.fee_id = '';
          this.result.fee_desc = '';
        }
        },
        (error) => {}
      )
    }
  }

  editData(obj:any){
    console.log(obj)
    if(typeof obj !='undefined'){
      if(obj.appeal_running == 0 ){
        this.setDefPage();
      }else{
        //this.SpinnerService.show();
        setTimeout(() => {
          this.result = JSON.parse(JSON.stringify(obj));
          this.result.appeal_type = this.result.appeal_type?parseInt(this.result.appeal_type):this.result.appeal_type;
          this.resultTmp = JSON.parse(JSON.stringify(this.result));
          this.getAppealType(this.result.appeal_type,2);
          //console.log(this.result)
          //this.appData = this.result.app_data?this.result.app_data:[];
          this.asData = this.result.send_data?this.result.send_data:[];
          this.rerender();
          //this.SpinnerService.hide();
        }, 200);
      }
    }
  }

  reloadData(){
    if(this.resultTmp.length)
      this.result = JSON.parse(JSON.stringify(this.resultTmp));
    else
      this.setDefPage();
  }

  diffToDate(){
    if(this.result.case_send_date && this.result.hsend_date){
      var student = JSON.stringify({
        "case_send_date" : this.result.case_send_date,
        "hsend_date" : this.result.hsend_date,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/calOverDate', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(getDataOptions.over_day){
            this.result.overdue = getDataOptions.over_day;
          }else{
            this.result.overdue = null;
          }
        },
        (error) => {}
      )
    }
  }


  loadAsData(){
    var student = JSON.stringify({
      "appeal_running" : this.result.appeal_running,
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0120/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result==1){
            
            //-----------------------------//
            if(getDataOptions.data.length){
              this.asData = getDataOptions.data;
              this.rerender();
            }else{
              this.asData = [];
              this.rerender();
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

  saveData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(typeof this.dataSendHead !='undefined' && !this.dataSendHead.run_id){
      //-----------------------------//
      confirmBox.setMessage('กรุณาค้นหาข้อมูลคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    //-----------------------------//
    }else if(!this.result.start_date){
      //-----------------------------//
      confirmBox.setMessage('กรุณาป้อนข้อมูลคดีเริ่มวันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    //-----------------------------//
    }else{
      if(this.result.app_type_id==0)
        this.result.app_type_id = null;
      if(this.result.close_by==0)
        this.result.close_by = null;
      if(this.result.send_by==0)
        this.result.send_by = null;
      if(!this.result.run_id)
        this.result.run_id = this.dataSendHead.run_id;
      this.result.appeal_type = this.result.appeal_type.toString();
      this.result.userToken = this.userData.userToken;
      
      var data = $.extend({},this.result);
      console.log(data);
      //return false;
      this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/saveData', data).subscribe(
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
                  //this.result.notice_running = getDataOptions.notice_running;
                  this.result.appeal_running = getDataOptions.appeal_running;
                  data.appeal_running = getDataOptions.appeal_running;
                  this.onClickListData(data);
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

  onClickListData(data:any): void {
    this.onClickList.emit(data)
  }
  reloadTab(){
    this.onClickListData({'run_id':this.dataSendHead.run_id,'appeal_running':this.result.appeal_running});
  }

  visibleAppointment(){
    this.visibleApp = this.visibleApp?false:true;
  }

  openSendPage(index:any){
    
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      var name = 'fud0120';
      if(typeof index === 'object')
        myExtObject.OpenWindowMaxName(winURL+'fud0120?run_id='+this.dataSendHead.run_id+'&appeal_running='+this.result.appeal_running+'&send_item='+index.send_item,name);
      else
        myExtObject.OpenWindowMaxName(winURL+'fud0120?run_id='+this.dataSendHead.run_id+'&appeal_running='+this.result.appeal_running,name);
    
   /*
        const modalRef: NgbModalRef = this.ngbModal.open(Fud0120Component,{ windowClass: 'my-class'})
        modalRef.componentInstance.run_id = this.dataSendHead.run_id
        modalRef.componentInstance.appeal_running = this.result.appeal_running
        modalRef.componentInstance.send_item = index.send_item  
        modalRef.closed.subscribe((data) => {
          if(data)
            this.onClickListData({'run_id':this.dataSendHead.run_id,'appeal_running':this.result.appeal_running});
          //this.getAppRunning(1)
        })
      */
  }

  fap0111Page(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    //var name = 'win_'+Math.ceil(Math.random()*1000);
    var name = 'fap0111';
    //console.log(winURL+'ffn1600?run_id='+this.dataHead.run_id)fkb0100.php?run_id=150662&req_running=24381
    myExtObject.OpenWindowMaxName(winURL+'fap0111?run_id='+this.dataSendHead.run_id,name);
  }
  fap0130Page(i:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    //var name = 'win_'+Math.ceil(Math.random()*1000);
    var name = 'fap0130';
    //console.log(winURL+'ffn1600?run_id='+this.dataHead.run_id)fkb0100.php?run_id=150662&req_running=24381
    //myExtObject.OpenWindowMaxName(winURL+'fap0130?run_id='+this.dataSendHead.run_id+'&app_seq='+this.appData[i].app_seq,name);
    myExtObject.OpenWindowMaxName(winURL+'fap0130?app_running='+this.appData[i].app_running,name);
  }

  delData(type:any,i:any){
    //1คือผู้ยื่นอุทธรณ์/ฎีกา,2คือ
    this.delIndex = i;
    this.clickOpenMyModalComponent(2);
  }

  runSeq(){
    if(typeof this.dataSendHead !='undefined'){
      var student = JSON.stringify({
        "run_id" : this.dataSendHead.run_id,
        "userToken" : this.getToken
      });
      this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/runItem', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.result.appeal_item = getDataOptions.appeal_item;
          this.resultTmp = JSON.parse(JSON.stringify(this.result));
        },
        (error) => {}
      )
    }else
      this.resultTmp = JSON.parse(JSON.stringify(this.result));
  }

  private get getToken(): string {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let userData: any
    if(sessData) {
      userData = JSON.parse(sessData)
    }
    return userData?.userToken || ""
  }

  private get getRoot(): string {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let rootData: any
    if(sessData) {
      rootData = JSON.parse(sessData)
    }
    return rootData?.appName || ""
  }
  

}
