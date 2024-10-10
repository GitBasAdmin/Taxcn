import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,AfterContentInit,ViewChildren, QueryList,ViewEncapsulation   } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
declare var myExtObject: any;
@Component({
  selector: 'app-fud0100-tab5',
  templateUrl: './fud0100-tab5.component.html',
  styleUrls: ['./fud0100-tab5.component.css']
})
export class Fud0100Tab5Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  result:any = [];
  resultTmp:any = [];
  sendEditData:any = [];
  appealData:any = [];
  appealDataTmp:any = [];
  viewInit:any;
  dataHead:any;
  sessData:any;
  userData:any;
  myExtObject: any;
  appealType:any;
  getResult:any;
  getHcourtOrder:any;
  getAppeal:any;
  delIndex:any;
  modalType:any;
  
  dtOptions2: DataTables.Settings = {};
  dtTrigger_2: Subject<any> = new Subject<any>();
  public loadModalConfComponent: boolean = false;
  @Input() set getTab(getTab: any) {//รับจาก fju0100-main
    if(typeof getTab !='undefined' && getTab.tabIndex==4){
      myExtObject.callCalendar();
    }
    console.log(getTab)
  }
  @Input() set getDataHead(getDataHead: any) {
    //console.log(getDataHead)
    this.dataHead = getDataHead;
    this.getAppealJudgeData(0);
  }
  @Input() set sendEdit(sendEdit: any) {
    //console.log(sendEdit)
    this.sendEditData = [];
    if(typeof sendEdit !='undefined')
      this.getSendEditData(sendEdit.data);
  }
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy:true
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pappeal_judge_result",
      "field_id" : "result_id",
      "field_name" : "result_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getResult = getDataOptions;
      },
      (error) => {}
    )

    //======================== phcourt_order_setup ======================================
    var student = JSON.stringify({
      "table_name" : "phcourt_order_setup",
      "field_id" : "order_id",
      "field_name" : "order_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        getDataOptions.unshift({fieldIdValue:'',fieldNameValue: ''});
        this.getHcourtOrder = getDataOptions;
        
      },
      (error) => {}
    )
    //this.rerender();
    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.result.court_level = 2;
    if(typeof this.dataHead !='undefined')
      this.result.end_casedate = this.dataHead.end_casedate;
      this.result.judging_date = myExtObject.curDate();
    this.getAppealType(2);
    if(this.appealData.length){
      this.result.all_item = this.appealData.length;
      this.result.judge_item = parseInt(this.appealData.length)+1;
      this.resultTmp.judge_item = parseInt(this.appealData.length)+1;
    }
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      //console.log(dtElement.dtInstance) 
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
      });
    });
    this.dtTrigger_2.next(null);
  }

  ngAfterViewInit(): void {
    this.dtTrigger_2.next(null);
    this.viewInit = 1;
    }
    ngAfterContentInit() : void{
      
    }
    
  ngOnDestroy(): void {
      this.dtTrigger_2.unsubscribe();
    }

    getSendEditData(obj:any){
      console.log(obj)
      if(typeof obj =='undefined')
        this.sendEditData = [];
      else{
        if(obj.appeal_running!=0){
          this.sendEditData = [obj];
          this.getAppealJudgeData(0);
        }
      }
      if(this.viewInit){
        this.dtTrigger_2.next(null);
        //console.log(this.sendEditData)
        //this.rerender();
        //alert(99)
        //console.log(this.dtElement.dtInstance["__zone_symbol__value"]["context"][0].DataTables_Table_2;
  
      }
        //this.rerender();
      
      console.log(this.sendEditData)
      this.setDefPage();
    }
    getAppealType(val:any){
      var student = JSON.stringify({
        "table_name" : "porder_type",
        "field_id" : "order_type",
        "field_name" : "order_type_name",
        "userToken" : this.getToken
      });
      console.log(student)
      this.http.post('/'+this.getRoot+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          getDataOptions.unshift({fieldIdValue:0,fieldNameValue:''});
          console.log(getDataOptions)
          this.appealType = getDataOptions;
          
        },
        (error) => {}
      )
    }
    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    
    saveData(){
      const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(typeof this.dataHead =='undefined'){
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
        var dataTmp=[];
        dataTmp.push({'appeal_running':this.sendEditData[0].appeal_running});        

        var student = $.extend({},this.result);
        student['run_id'] = this.dataHead.run_id;
        student['appeal_running'] = this.sendEditData[0].appeal_running;
        student['map_data'] = dataTmp;
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

    getAppealJudgeData(type:any){
      if(typeof this.dataHead !='undefined' && this.dataHead.run_id){
        this.sessData=localStorage.getItem(this.authService.sessJson);
        this.userData = JSON.parse(this.sessData);
        var student = JSON.stringify({
          "run_id" : this.dataHead.run_id,
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
                    this.result.appeal_desc = this.result.appeal_desc;
                  }
                }
              }
              this.appealDataTmp = JSON.stringify(getDataOptions.data);
              
            }else{
              this.result.judge_item = 1;
              this.resultTmp.judge_item = 1;
              this.appealData = [];
              this.result.all_item = 0;
            }
          },
          (error) => {}
        );
      }else{
        this.appealData = [];
        this.appealDataTmp = [];
        //this.rerender();
      }
    }

    delAppealData(i:any){
      this.delIndex = i;
      this.clickOpenMyModalComponent(1);
    }
    /*
    delData(i:any){
      this.delIndex = i;
      this.clickOpenMyModalComponent(1);
    }*/
  
    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      this.openbutton.nativeElement.click();
    }
    loadMyModalComponent(){
      $(".modal-backdrop").remove();
      if(this.modalType==1){
        $("#exampleModal3").find(".modal-content").css("width","650px");
          this.loadModalConfComponent = true;
          $("#exampleModal3").find(".modal-content").css("width","650px");
          $("#exampleModal3").find(".modal-body").css("height","auto");
          $("#exampleModal3").css({"background":"rgba(51,32,0,.4)"});
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
                            
                            if(this.modalType==1){
                              /*
                              var dataDel = [],dataTmp=[];
                              dataDel['log_remark'] = chkForm.log_remark;
                              dataDel['userToken'] = this.userData.userToken;
                              dataTmp.push(this.appealData[this.delIndex]);
                              dataDel['data'] = dataTmp;
                              var data = $.extend({}, dataDel);
                              console.log(data)*/
                              var student = this.appealData[this.delIndex];
                              student['log_remark'] = chkForm.log_remark;
                              student["userToken"] = this.userData.userToken;
                              this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/deleteAppealJudge', student).subscribe(
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
                                          this.getAppealJudgeData(0)
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
  
    closeModal(){
      this.loadModalConfComponent = false;
    }
    editAppealData(i:any,type:any){
      this.SpinnerService.show();
      this.result = [];
      if(type==1){
        this.result = $.extend([],this.appealData[i]);
        this.resultTmp = $.extend([],this.appealData[i]);
      }else{
        this.result = $.extend([],i);
        this.resultTmp = $.extend([],i);
      }
      this.result.all_item = this.appealData.length;

      this.getAppealList();

      setTimeout(() => {
        this.SpinnerService.hide();
      }, 500);
    }
    prevAppeal(){
      if(this.resultTmp.judge_item!=1){
        var indexObj = this.appealData.filter((x:any) => x.judge_item === parseInt(this.result.judge_item)-1);
        console.log(indexObj)
        if(indexObj.length)
          this.editAppealData(indexObj[0],2)
        
      }
    }

    getAppealList(){
      console.log(this.result.appeal_desc);
      if(typeof this.dataHead !='undefined' && this.dataHead.run_id && this.result.appeal_desc){
        this.sessData=localStorage.getItem(this.authService.sessJson);
        this.userData = JSON.parse(this.sessData);
        var student = JSON.stringify({
          "run_id" : this.dataHead.run_id,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/getAppealList', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.data.length){
              this.getAppeal = getDataOptions.data;
            }else{
              this.getAppeal = [];
            }
          },
          (error) => {}
        );
      }else{
        this.result.app_desc = '';
      }
    }
  
    nextAppeal(){
      if(this.resultTmp.judge_item<this.appealData.length){
        var indexObj = this.appealData.filter((x:any) => x.judge_item === parseInt(this.result.judge_item)+1);
        console.log(indexObj)
        if(indexObj.length)
          this.editAppealData(indexObj[0],2)
      }else{
        this.setDefPage();
      }
    }

    cancelData(){
      console.log(this.resultTmp.running)
      if(typeof this.resultTmp.running !='undefined'){
        this.editAppealData(this.resultTmp,2);
      }else{
        this.setDefPage();
      }
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
