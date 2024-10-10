import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,ViewChildren, QueryList   } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { DialogLayoutDisplay,ConfirmBoxInitializer,ToastNotificationInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
import * as _ from "lodash"
import { data } from 'jquery';
import { timeStamp } from 'console';
declare var myExtObject: any;
@Component({
  selector: 'app-fju0100-tab1',
  templateUrl: './fju0100-tab1.component.html',
  styleUrls: ['./fju0100-tab1.component.css']
})
export class Fju0100Tab1Component implements OnInit {
  myExtObject: any;
  result:any = [];
  counter=1;
  modalType:any;
  modalIndex:any;
  sessData:any;
  userData:any;
  getPenalty:any;
  //dataFormObj:any = [];
  dataAlleObj:any = [];
  caseDataObj:any = [];
  caseDataObjTmp:any = [];
  accuDataTmp:any = [];
  objJudgeTmp:any;
  logRemarkEditRed:any;
  delIndexAlle:any;
  
  
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalConfComponent: boolean = false;
  public loadModalListMultiComponent: boolean = false;
  public loadModalListComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadModalJudgeGroupComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 
  @Output() onClickListData = new EventEmitter<{data:any,counter:any,run_id:any,event:any}>();
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100-main
    if(typeof getDataHead !='undefined'){
      this.saveData(getDataHead);
    }
  }
  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy : true
    };

    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };

     //======================== pappoint_by ======================================
     var student = JSON.stringify({
      "table_name" : "ppenalty",
      "field_id" : "penalty_id",
      "field_name" : "penalty_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getPenalty = getDataOptions;
      },
      (error) => {}
    )
    //this.rerender();
    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.result.judging_date = myExtObject.curDate();
    this.result.judge_deposit = '0.00';
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
    myExtObject.callCalendar();
  }
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }
  callDataHead(){
    if(!this.result.run_id){
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
      var data = 1;
      var counter = this.counter++;
      var run_id = '';
      if(this.result.red_running)
        run_id =  this.result.run_id;
      var event = 1;
      this.onClickListData.emit({data,counter,run_id,event});
    }
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  clickOpenMyModalComponentIndex(type:any,index:any){
    this.modalType = type;
    this.modalIndex = index;
    this.openbutton.nativeElement.click();
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    if((type==2 || type==11) && !this.result.run_id){
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
    }else if((type==15 || type==16) && !this.result.red_running){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบข้อมูลเลขคดีแดง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      if(type!=16){
        this.openbutton.nativeElement.click();
      }else{//ลบเลขแดง
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ลบข้อมูลเลขแดง?');
        confirmBox.setMessage('การลบเลขแดงย้อนหลังจะมีผลกับสถิติ ดังนั้นให้ผู้ลบแจ้งให้ผู้ที่ทำสถิติด้วย ซึ่งในระบบจะมีการเก็บรายการว่าใครเป็นคนลบเลขคดีแดง');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        // Choose layout color type
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.openbutton.nativeElement.click();
        }
        subscription.unsubscribe();
        });
      }
    }
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "plit_type",
        "field_id" : "lit_type",
        "field_name" : "lit_type_desc",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pappoint_table';
      this.listFieldId='table_id';
      this.listFieldName='table_name';
      this.listFieldNull='';
    }else if(this.modalType==2){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pjudge_result",
        "field_id" : "result_id",
        "field_name" : "result_desc",
        "search_id" : "",
        "search_desc" : "",
        "condition" : " AND case_type='"+this.result.case_type+"'",
        "userToken" : this.userData.userToken});
      this.listTable='pjudge_result';
      this.listFieldId='result_id';
      this.listFieldName='result_desc';
      this.listFieldCond=" AND case_type='"+this.result.case_type+"'";
    }else if(this.modalType==3){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pjudge_finish",
        "field_id" : "finish_id",
        "field_name" : "finish_desc",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pjudge_finish';
      this.listFieldId='finish_id';
      this.listFieldName='finish_desc';
      this.listFieldCond="";
    }else if(this.modalType==4){
      if(typeof this.result.case_date=='undefined'){
        var caseDate = myExtObject.curDate();
      }else{
        if(this.result.case_date)
          var caseDate = this.result.case_date;
        else
          var caseDate:any = '';
      }
      var student = JSON.stringify({
        "cond":2,
        "assign_date":caseDate,
        "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.listFieldType=JSON.stringify({
        "type":1,
        "assign_date":caseDate});
        this.loadModalConfComponent = false;
        this.loadModalListMultiComponent = false;
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
    }else if(this.modalType==5 || this.modalType==6 || this.modalType==8 || this.modalType==9 || this.modalType==10 || this.modalType==17){
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
      this.loadModalListMultiComponent = false;
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
    }else if(this.modalType==7){
      $("#exampleModal").find(".modal-content").css({"width":"950px"});
      this.loadModalConfComponent = false;
      this.loadModalListMultiComponent = false;
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = true;
    }else if(this.modalType==11){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pallegation",
        "field_id" : "alle_id",
        "field_name" : "alle_name",
        "field_name2" : "alle_running",
        "search_id" : "",
        "search_desc" : "",
        "condition" : " AND user_select='1' AND case_type='"+this.result.case_type+"' AND case_cate_group='"+this.result.case_cate_group+"'",
        "userToken" : this.userData.userToken});
      this.listTable='pallegation';
      this.listFieldId='alle_id';
      this.listFieldName='alle_name';
      this.listFieldCond=" AND user_select='1' AND case_type='"+this.result.case_type+"' AND case_cate_group='"+this.result.case_cate_group+"'";
    }else if(this.modalType==12 || this.modalType==15 || this.modalType==16){
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalConfComponent = true;
      this.loadModalListMultiComponent = false;
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = false;
    }else if(this.modalType==13){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pinter",
        "field_id" : "inter_id",
        "field_name" : "inter_name",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pinter';
      this.listFieldId='inter_id';
      this.listFieldName='inter_name';
      this.listFieldCond="";
    }else if(this.modalType==14){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "poccupation",
        "field_id" : "occ_id",
        "field_name" : "occ_desc",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='poccupation';
      this.listFieldId='occ_id';
      this.listFieldName='occ_desc';
      this.listFieldCond="";
    }
    console.log(student)
    if(this.modalType==1 || this.modalType==2 || this.modalType==3 || this.modalType==11 || this.modalType==13 || this.modalType==14){
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          if(this.modalType==1 ){
            this.loadModalConfComponent = false;
            this.loadModalListMultiComponent = true;
            this.loadModalListComponent = false;
            this.loadModalJudgeComponent = false;
            this.loadModalJudgeGroupComponent = false;
          }else{
            this.loadModalConfComponent = false;
            this.loadModalListMultiComponent = false;
            this.loadModalListComponent = true;
            this.loadModalJudgeComponent = false;
            this.loadModalJudgeGroupComponent = false;
          }
        },
        (error) => {}
      )
    }
  }

  tabChangeInput(name:any,event:any){
    if(name=='result_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge_result",
        "field_id" : "result_id",
        "field_name" : "result_desc",
        "condition" : " AND result_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.result_desc = productsJson[0].fieldNameValue;
        }else{
          this.result.result_id = '';
          this.result.result_desc = '';
        }
        },
        (error) => {}
      )
    }else if(name=='finish_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge_finish",
        "field_id" : "finish_id",
        "field_name" : "finish_desc",
        "condition" : " AND finish_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.finish_desc = productsJson[0].fieldNameValue;
        }else{
          this.result.finish_id = '';
          this.result.finish_desc = '';
        }
        },
        (error) => {}
      )
    }else if(name=='order_judge_id'){
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
          this.result.order_judge_name = productsJson[0].fieldNameValue;
          this.result.order_judge_date = myExtObject.curDate();
        }else{
          this.result.order_judge_id = '';
          this.result.order_judge_name = '';
          this.result.order_judge_date = '';
        }
        },
        (error) => {}
      )
    }else if(name=="judge_id1"){
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
    }else if(name=="alle_id1"){
      var student = JSON.stringify({
        "table_name" : "pallegation",
        "field_id" : "alle_id",
        "field_name" : "alle_name",
        "field_name2" : "alle_running",
        "condition" : " AND user_select='1' AND case_type='"+this.result.case_type+"' AND case_cate_group='"+this.result.case_cate_group+"' AND alle_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;
          if(this.list.length){
            this.insertAlle(this.list);
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('ไม่พบรหัสฐานความผิดนี้ในระบบ');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.result.alle_id1 = '';
              }
              subscription.unsubscribe();
            });
          }
          console.log(this.list)
        },
        (error) => {}
      )
    }else if(name=="inter_id"){
      var student = JSON.stringify({
        "table_name" : "pinter",
        "field_id" : "inter_id",
        "field_name" : "inter_name",
        "condition" : " AND inter_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.caseDataObj.accuObj[this.modalIndex].inter_name = productsJson[0].fieldNameValue;
        }else{
          this.caseDataObj.accuObj[this.modalIndex].inter_id = '';
          this.caseDataObj.accuObj[this.modalIndex].inter_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=="occu_id"){
      var student = JSON.stringify({
        "table_name" : "poccupation",
        "field_id" : "occ_id",
        "field_name" : "occ_desc",
        "condition" : " AND occ_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.length){
          this.caseDataObj.accuObj[this.modalIndex].occ_desc = productsJson[0].fieldNameValue;
        }else{
          this.caseDataObj.accuObj[this.modalIndex].occ_id = '';
          this.caseDataObj.accuObj[this.modalIndex].occ_desc = '';
        }
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
            

                    if(this.modalType==12){
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
                        var student = this.dataAlleObj[this.delIndexAlle];
                        student["userToken"] = this.userData.userToken;
                        delete student["jRunning"];
                        console.log(student)
                        this.http.disableLoading().post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/deleteAllegation', student , {headers:headers}).subscribe(
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
                              this.closebutton.nativeElement.click();
                              this.getObjAlleData(); 
                            }
                          },
                          (error) => {}
                        )
                      }
                      subscription.unsubscribe();
                      });
                    }else if(this.modalType==15){
                      this.logRemarkEditRed = chkForm.log_remark;
                      this.closebutton.nativeElement.click();
                    }else if(this.modalType==16){
                      this.delJudgement(chkForm.log_remark);
                      //this.closebutton.nativeElement.click();
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

  closeModal(){
    this.loadModalConfComponent = false;
    this.loadModalListMultiComponent = false;
    this.loadModalListComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalJudgeGroupComponent = false;
  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.cost_payer_id=event.fieldIdValue;
      this.result.cost_payer=event.fieldNameValue;
    }else if(this.modalType==2){
      this.result.result_id=event.fieldIdValue;
      this.result.result_desc=event.fieldNameValue;
    }else if(this.modalType==3){
      this.result.finish_id=event.fieldIdValue;
      this.result.finish_desc=event.fieldNameValue;
    }else if(this.modalType==11){
      this.insertAlle([event]);
    }else if(this.modalType==13){
      this.caseDataObj.accuObj[this.modalIndex].inter_id=event.fieldIdValue;
      this.caseDataObj.accuObj[this.modalIndex].inter_name=event.fieldNameValue;
    }else if(this.modalType==14){
      this.caseDataObj.accuObj[this.modalIndex].occ_id=event.fieldIdValue;
      this.caseDataObj.accuObj[this.modalIndex].occ_desc=event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  receiveJudgeListData(event:any){
    if(this.modalType==4 || this.modalType==5){
      this.result.order_judge_id=event.judge_id;
      this.result.order_judge_name=event.judge_name;
      this.result.order_judge_date = myExtObject.curDate();
    }else if(this.modalType==6){
      this.result.case_judge_aid=event.judge_id;
      this.result.case_judge_aname=event.judge_name;
    }else if(this.modalType==8){
      this.result.judge_id1=event.judge_id;
      this.result.judge_name1=event.judge_name;
    }else if(this.modalType==9){
      this.result.judge_id2=event.judge_id;
      this.result.judge_name2=event.judge_name;
    }else if(this.modalType==10){
      this.result.judge_id3=event.judge_id;
      this.result.judge_name3=event.judge_name;
    }else if(this.modalType==17){
      this.result.judge_id4=event.judge_id;
      this.result.judge_name4=event.judge_name;
    }
    
    this.closebutton.nativeElement.click();
  }

  receiveJudgeGroupListData(event:any){
    console.log(event)
    if(this.modalType==7){
      this.result.judge_id1=event.judge_id1;
      this.result.judge_name1=event.judge_name1;

      this.result.judge_id2=event.judge_id2;
      this.result.judge_name2=event.judge_name2;
    }
    this.closebutton.nativeElement.click();
  }

  saveData(objHead:any){
      
      this.caseDataObj = objHead;
      this.caseDataObjTmp = JSON.parse(JSON.stringify(objHead));
      this.accuDataTmp = JSON.stringify(this.caseDataObj.accuObj);
      console.log(this.caseDataObj)
      //============================== head ==================================================
      this.result["run_id"] = objHead.run_id;
      this.result["case_type"] = objHead.case_type;
      this.result["red_title"] = objHead.red_title;
      this.result["red_id"] = objHead.red_id;
      this.result["red_yy"] = objHead.red_yy;
      if(objHead.judge_stat_flag)
        this.result["judge_stat_flag"] = 1;
      this.result['userToken'] = this.userData.userToken;
      this.result['log_remark'] = this.logRemarkEditRed;
      
      //============================== tab1 ==================================================
      this.result.case_date = objHead.case_date;
      this.result.case_judge_id = objHead.case_judge_id;
      this.result.case_judge_name = objHead.case_judge_name;
      this.result.case_judge_gid = objHead.case_judge_gid;
      this.result.case_judge_gname = objHead.case_judge_gname;
      this.result.case_judge_gid2 = objHead.case_judge_gid2;
      this.result.case_judge_gname2 = objHead.case_judge_gname2;
      this.result.case_judge_gid3 = objHead.case_judge_gid3;
      this.result.case_judge_gname3 = objHead.case_judge_gname3;
      this.result.case_cate_group = objHead.case_cate_group;
      this.result.alle_descx = objHead.alle_desc;

      //ตอนค้นเลขคดีดำมา เพื่อออกเลขคดีแดง ต้องเอาทุนทรัพย์จาก หน้ารับฟ้องมาลง
      this.result.judge_deposit = objHead.deposit ? this.curencyFormat(objHead.deposit,2) : '0.00';
      

      if(objHead.caseEvent==1){//ค้นหา
        this.result["order_judge_id"] = objHead.order_judge_id;
        this.result["order_judge_name"] = objHead.order_judge_name;
        this.result["order_judge_date"] = objHead.order_judge_date;
        
        if(objHead.judgeObj.length){//ออกแดงแล้ว update
          var judge = objHead.judgeObj[0];
          this.dataAlleObj = judge.alleObj;
          if(this.dataAlleObj.length){
            this.runAlleSeq(this.dataAlleObj);
            this.dataAlleObj.forEach((x : any ) => x.jRunning = true);
          }else{
            this.result.alle_seq = 1;
          }
          this.result.red_running = judge.red_running;
          this.result.judging_date = judge.judging_date;
          this.result.due_date = judge.due_date;
          this.result.end_casedate = judge.end_casedate;
          this.result.judge_deposit = this.curencyFormat(judge.judge_deposit,2);
          this.result.cost_payer = judge.cost_payer;
          this.result.result_id = judge.result_id;
          this.result.result_desc = judge.result_desc;
          this.result.print_judge_flag = judge.print_judge_flag;
          this.result.judge_pages = judge.judge_pages;
          this.result.edit_pages = judge.edit_pages;
          this.result.due_send_draft = judge.due_send_draft;
          this.result.due_print_judge = judge.due_print_judge;
          this.result.finish_id = judge.finish_id;
          this.result.finish_desc = judge.finish_desc;
          this.result.copy_date = judge.copy_date;
          this.result.chk_update_dss_date = judge.chk_update_dss_date;
          this.result.update_dss_date = judge.update_dss_date;
          this.result.judge_id1 = judge.judge_id1;
          this.result.judge_name1 = judge.judge_name1;
          this.result.judge_id2 = judge.judge_id2;
          this.result.judge_name2 = judge.judge_name2;
          this.result.judge_id3 = judge.judge_id3;
          this.result.judge_name3 = judge.judge_name3;
          this.result.judge_id4 = judge.judge_id4;
          this.result.judge_name4 = judge.judge_name4;
          this.result.remark = judge.remark;
          this.result.con_result = judge.con_result;
        }else{//ยังไม่ได้ออกแดง insert
          if(objHead.alleObj && objHead.alleObj.length){
            this.dataAlleObj = objHead.alleObj;
            this.dataAlleObj.forEach((x : any ) => x.jRunning = false);
            this.runAlleSeq(this.dataAlleObj);
          }
          this.result.red_running = 0;
          this.result.judging_date = myExtObject.curDate();
          //this.result.due_date = '';
          //this.result.end_casedate = '';
          this.fillDueDate(myExtObject.curDate());
          if(objHead.deposit)
            this.result.judge_deposit = this.curencyFormat(objHead.deposit,2);
          else
            this.result.judge_deposit = '';
          this.result.cost_payer = '';
          this.result.result_id = '';
          this.result.result_desc = '';
          this.result.print_judge_flag = '';
          this.result.judge_pages = '';
          this.result.edit_pages = '';
          this.result.due_send_draft = '';
          this.result.due_print_judge = '';
          this.result.finish_id = '';
          this.result.finish_desc = '';
          this.result.copy_date =  '';
          this.result.chk_update_dss_date = '';
          this.result.update_dss_date =  '';
          if(objHead.case_judge_id){
            this.result.judge_id1 = objHead.case_judge_id;
            this.result.judge_name1 = objHead.case_judge_name;
          }else{
            this.result.judge_id1 = '';
            this.result.judge_name1 = '';
          }
          
          this.result.judge_id2 = '';
          this.result.judge_name2 = '';
          this.result.judge_id3 = '';
          this.result.judge_name3 = '';
          this.result.judge_id4 = '';
          this.result.judge_name4 = '';
          this.result.remark = '';
          this.result.con_result = '';
        }
      }
      
      if(objHead.caseEvent==2){//จัดเก็บ
        //console.log(objHead.judgeObj[0].red_title+objHead.judgeObj[0].red_id+objHead.judgeObj[0].red_yy+"!="+objHead.red_title+objHead.red_id+objHead.red_yy);

        if(this.result.judge_deposit){
          this.result.judge_deposit = this.curencyFormatRemove(this.result.judge_deposit).toString();
        }else{
          this.result.judge_deposit = null;
        }

        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');

          if(!this.result.red_title || !this.result.red_id || !this.result.red_yy){
            confirmBox.setMessage('กรุณาระบุหมายเลขคดีแดงให้ครบถ้วน');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else if(this.result.red_running && (objHead.judgeObj[0].red_title+objHead.judgeObj[0].red_id+objHead.judgeObj[0].red_yy) != (objHead.red_title+objHead.red_id+objHead.red_yy) && !this.logRemarkEditRed){
            confirmBox.setMessage('กรุณา lonin เพื่อเปลี่ยนเลขคดีแดง');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else if(!this.result.judging_date){
            confirmBox.setMessage('กรุณาป้อนข้อมูลวันที่ออกแดง');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else if(this.result.red_yy != this.result.judging_date.split('/')[2]){
            confirmBox.setMessage('ปีของวันที่ออกแดง ต้องตรงกันกับปีของหมายเลขคดีแดง');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          
          }else{
            var alertWarning = [];
            var _bar = new Promise((resolve, reject) => {
              if(!this.result.result_id){
                alertWarning.push('ยังไม่ได้ป้อนข้อมูลผลคำพิพากษา');
              }
              if(!this.result.order_judge_id){
                alertWarning.push('ยังไม่ได้ป้อนข้อมูลผู้พิพากษารับฟ้อง');
              }
              if(!this.result.order_judge_date){
                alertWarning.push('ยังไม่ได้ป้อนข้อมูลวันทีสั่ง');
              }
              if(!this.result.judge_id1){
                alertWarning.push('ยังไม่ได้ป้อนข้อมูลผู้พิพากษาที่ตัดสิน');
              }
            });

            if(_bar){
              //console.log(alertWarning.toString())
              if(!this.result.red_running){
                this.result.alleObj = this.dataAlleObj;
              }
              if(alertWarning.length){
                confirmBox.setMessage(alertWarning.toString());
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    var dataSave = $.extend({},this.result);
                    console.log(dataSave);
                    this.saveDataCommit(dataSave);
                  }
                  subscription.unsubscribe();
                });
              }else{
                var dataSave = $.extend({},this.result);
                console.log(dataSave)
                this.saveDataCommit(dataSave);
              }
            }
          }

          
    }
  }

  saveDataCommit(json:any){
    const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/saveJudgement', json).subscribe(
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
                this.result.red_running = getDataOptions.red_running;
                var data = 1;
                var counter = this.counter++;
                var run_id = this.result.run_id;
                var event = 2;
                this.onClickListData.emit({data,counter,run_id,event});
                this.logRemarkEditRed = null;
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

  curencyFormat(n:any,d:any) {
		return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	}
  curencyFormatRemove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, ""); 
    } else {
      return "";
    }
  }

  changeCurency(type:any,name:any,event:any){
    console.log(parseInt(event.target.value))
    var valInt = this.curencyFormatRemove(event.target.value);
    console.log(valInt)
    if(parseFloat(valInt)>0){
      this.result[name] = this.curencyFormat(valInt,2);
    }
  }

  insertAlle(event:any){
    var data = event[0];
    //console.log(data.fieldIdValue+":"+data.fieldNameValue+":"+data.fieldNameValue2)
    var student = JSON.stringify({
      "run_id" : this.result.run_id,
      "alle_running" : event[0].fieldNameValue2,
      "alle_id" : event[0].fieldIdValue,
      "alle_seq" : this.result.alle_seq,
      "alle_name" : event[0].fieldNameValue,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.http.disableLoading().post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/insertAllegation', student ).subscribe(
      (response) =>{
        let alertMessage : any = JSON.parse(JSON.stringify(response));
        if(alertMessage.result==0){
          confirmBox.setMessage(alertMessage.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.getObjAlleData();
            }
            subscription.unsubscribe();
          });
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
                this.getObjAlleData();
              }
              subscription.unsubscribe();
            });
          
        }
      },
      (error) => {}
    )
  }

  getObjAlleData(){
    var student = JSON.stringify({
      "run_id" : this.result.run_id,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    if(this.result.red_running){
      this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/getAllegationData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.dataAlleObj = getDataOptions.data;
            this.dataAlleObj.forEach((x : any ) => x.jRunning = true);
            this.runAlleSeq(this.dataAlleObj);
            this.rerender();
          }else{
            this.dataAlleObj = [];
            this.rerender();
          }
        },
        (error) => {}
      );
    }else{
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getAllegationData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.dataAlleObj = getDataOptions.data;
            this.dataAlleObj.forEach((x : any ) => x.jRunning = true);
            this.runAlleSeq(this.dataAlleObj);
            this.rerender();
          }else{
            this.dataAlleObj = [];
            this.rerender();
          }
        },
        (error) => {}
      );
    }
  }

  runAlleSeq(dataObj:any){
    if(dataObj){
      const item = dataObj.reduce((prev:any, current:any) => (+prev.alle_seq > +current.alle_seq) ? prev : current)
      this.result.alle_seq = item.alle_seq+1;
      this.result.alle_id1 = '';
    }
  }

  delAlleData(index:any){
    this.delIndexAlle = index;
    this.clickOpenMyModalComponent(12);
  }

  saveAccu(){
    //console.log(JSON.parse(this.accuDataTmp))
    //console.log(this.caseDataObj.accuObj)
    var saveArray = [];
    var _bar = new Promise((resolve, reject) => {
      var student = this.difference(this.caseDataObj.accuObj,JSON.parse(this.accuDataTmp));
      saveArray = $.grep(student,function(n:any){ return n == 0 || n });
    });
    
    if(_bar && saveArray.length>0){
      
      var dataSave = [],dataTmp=[];
      dataSave['run_id'] = this.result.run_id;
      dataSave['userToken'] = this.userData.userToken;
      var bar = new Promise((resolve, reject) => {
        for(var i=0;i<saveArray.length;i++){
          dataTmp.push(this.caseDataObj.accuObj[saveArray[i]]);
        }
      });

      if(bar){
        dataSave['data'] = dataTmp;
        var data = $.extend({}, dataSave);
        console.log(data)
        
        this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/savePenalty', data ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.getObjAccuData();
                }
                subscription.unsubscribe();
              });
            }else{
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
            }
          },
          (error) => {}
        );
      }
    }else{
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ยังไม่ได้แก้ไขข้อมูลคู่ความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
  }
  difference(object:any, base:any) {
    return transform(object, (result:any, value, key) => {
      if (!isEqual(value, base[key])) {
        //result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
        result[key] = isObject(value) && isObject(base[key]) ? key : null;
        //result[key] = key;
      }
    });
  }

  getObjAccuData(){
    this.caseDataObj.accuObj=[];
    this.accuDataTmp =[];
    var student = JSON.stringify({
      "run_id" : this.result.run_id,
      "lit_type" : 2,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getLitigantData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.data.length){
          this.caseDataObj.accuObj = getDataOptions.data;
          this.accuDataTmp = JSON.stringify(getDataOptions.data);
          console.log(this.caseDataObj.accuObj)
          this.rerender();
        }
      },
      (error) => {}
    );
  }

  accuReset(){
    this.caseDataObj.accuObj=[];
    this.caseDataObj.accuObj = JSON.parse(this.accuDataTmp);
    this.rerender();
  }

  buttonNew(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    console.log(winURL+'fju0100')
    location.replace(winURL+'fju0100')
    window.location.reload();
  }

  delJudgement(remark:any){

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ต้องการลบข้อมูลเลขแดงใช่หรือไม่?');
    confirmBox.setMessage('ยืนยันการลบข้อมูล');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    // Choose layout color type
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    if (resp.success==true){
      this.closebutton.nativeElement.click();
      var student = JSON.stringify({
        "run_id" : this.result.run_id,
        "log_remark" : remark,
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/deleteJudgement', student ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          if(alertMessage.result==1){

                this.caseDataObj = [];
                //this.accuDataTmp = [];
                //this.dataAlleObj = [];
                this.objJudgeTmp = null;
                this.logRemarkEditRed = null;
                this.delIndexAlle = null;
  
                var data = 1;
                var counter = this.counter++;
                var run_id = this.result.run_id;
                var event = 2;
                this.onClickListData.emit({data,counter,run_id,event});
  
                this.setDefPage();
              
          }else{
              confirmBox.setMessage(alertMessage.error);
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
      )
    }
      subscription.unsubscribe();
    });
   
  }
  
  resetPage(){
    if(this.result.run_id){
      var data = 1;
      var counter = this.counter++;
      var run_id = this.result.run_id;
      var event = 2;
      this.onClickListData.emit({data,counter,run_id,event});
    }else{
      window.location.reload();
    }
  }

  fillDueDate(date:any){
    var arrLastDay = [];
    var today = new Date();
			for(var i=1;i<=12;i++){
				var lastDayOfMonth = new Date(today.getFullYear(), i, 0).getDate();
			  arrLastDay.push(lastDayOfMonth);
			}
      console.log(arrLastDay)
    if(date){
		var arrDate = date.split("/");
		var day = arrDate[0];
		var month = arrDate[1];
		var year = arrDate[2];
    console.log(day + "/" + month + "/" + year)
		month++;
		if(month>12){ 
			month = 1;
			year++;
		}
    
			if(day > arrLastDay[month-1]) day = arrLastDay[month-1];
			if(month<10) month = "0" + month;
				this.result.due_date = day + "/" + month + "/" + year;
				this.result.end_casedate = day + "/" + month + "/" + year;
		}

  }

  checkDssDate(event:any){
    if(event == true){
      this.result.update_dss_date = myExtObject.curDate();
    }else{
      this.result.update_dss_date = '';
    }
  }

  changeDeposit(event:any){
    if(event==3 || event==1){
      this.result.judge_deposit = 0;
    }else{
      if(this.caseDataObjTmp.deposit){
        this.result.judge_deposit = this.curencyFormat(this.caseDataObjTmp.deposit,2);
      }else{
        this.result.judge_deposit = 0;
      }

    }
  }


  

}
