import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,ViewChildren, QueryList   } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { DialogLayoutDisplay,ConfirmBoxInitializer,ToastNotificationInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { Fsc0200HeadComponent } from '../fsc0200-head/fsc0200-head.component';
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
import * as _ from "lodash"
import { data } from 'jquery';
// import { timeStamp } from 'console';
declare var myExtObject: any;
@Component({
  selector: 'app-fsc0200-tab1',
  templateUrl: './fsc0200-tab1.component.html',
  styleUrls: ['./fsc0200-tab1.component.css']
})
export class Fsc0200Tab1Component implements OnInit ,AfterViewInit{
  myExtObject: any;
  result:any = [];
  result2:any = [];
  datas:any = [];
  counter=1;
  CheckNew:any = 1;
  modalType:any;
  modalIndex:any;
  sessData:any;
  userData:any;
  newCno:any=0;
  getRankPolice:any;
  getOff:any;
  chkAlle:any = 0;
  //dataFormObj:any = [];
  headDataObj:any = [];
  dataAlleObj:any = [];
  caseDataObj:any = [];
  catchNoData:any = [];
  catchDataObj:any = [];
  accuDataTmp:any = [];
  caseDataTmp:any = [];
  alleDataTmp:any = [];
  objJudgeTmp:any;
  logRemarkEditRed:any;
  delIndexAlle:any;
  delIndexCatch:any;
  getOcourt:any;
  getIncourt:any;
  getCatch:any;


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
  // @ViewChild('jcalendar') jcalendar : QueryList<ElementRef>;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  // @ViewChild( Fsc0200HeadComponent,{static: true} ) head: Fsc0200HeadComponent;
  @ViewChild('0200Head', {static : true}) Head : Fsc0200HeadComponent;
  @Output() onClickListData = new EventEmitter<{data:any,counter:any,run_id:any,event:any}>();
  @Output() sendCaseData = new EventEmitter<any>();
  @Input() set getDataHead(getDataHead: any) {//รับจาก fsc0200-main
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
//======================== prankpolice ======================================
var student = JSON.stringify({
  "table_name" : "prankpolice",
  "field_id" : "rank_id",
  "field_name" : "rank_name",
  "userToken" : this.userData.userToken
});
//console.log(student)
this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getRankPolice = getDataOptions;
  },
  (error) => {}
)
     //======================== pofficer ======================================
     var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "field_name2" : "dep_code",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOff = getDataOptions;
        console.log(this.getOff)
        var Off = this.getOff.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
        if(Off.length!=0){
          this.result.issue_id =  Off[0].fieldIdValue;
          this.result.issue_name = Off[0].fieldNameValue;
        }
      },
      (error) => {}
    )
    this.getOcourt = [{id: 1,text: 'อนุญาต'},{id: 2,text: 'ยกเลิก/เพิกถอน'},{id: 3,text: 'ยกคำร้อง'}];
    this.getIncourt = [{id: 1,text: 'ในเขต'},{id: 2,text: 'นอกเขต'}];
    // this.catchNoData[0].inout_flag = 1;
    this.result2.inout_flag = 1;
    //this.rerender();
    this.setDefPage();


      // console.log('Head==>',this.Head.hResult['title']);
    // console.log('hRequestTitle==>',this.head.hResult[0]);
    // console.log('hRequestId==>',this.head.hResult.id)
    // console.log('hRequestYY==>',this.head.hResult.yy)
    // console.log('hRequestCasetype==>',this.head.hResult.case_type)
  }

  // AfterViewInit(){
  //   console.log('hRequestTitle==>',this.head.hResult.title);
  //   console.log('hRequestId==>',this.head.hResult.id)
  //   console.log('hRequestYY==>',this.head.hResult.yy)
  //   console.log('hRequestCasetype==>',this.head.hResult.case_type)
  // }

  setDefPage(){
    this.result = [];
    console.log('tab1==> ',this.getDataHead);
    this.result.send_date = myExtObject.curDate();
    this.result.send_time = this.getTime();
    // this.result.judging_date = myExtObject.curDate();
    // this.result.judge_deposit = '0.00';
  }


  getTime(){
    var time = new Date();
    var cursecond = time.getSeconds();
    var scursecond = cursecond.toString();
    var minutes = time.getMinutes();
    var sminutes = minutes.toString();
    var hours = time.getHours();
    var shours = hours.toString();
    console.log(typeof(cursecond))
      // return((shours.length==1 ? "0"+shours : shours) +":"+(sminutes.length==1 ? "0"+sminutes : sminutes)+":"+(scursecond.length==1 ? "0"+scursecond : scursecond)); //xx:xx:xx
      return((shours.length==1 ? "0"+shours : shours) +":"+(sminutes.length==1 ? "0"+sminutes : sminutes)); //xx:xx
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
      if(this.result.run_id)
        run_id =  this.result.run_id;
      var event = 1;
      this.onClickListData.emit({data,counter,run_id,event});
    }
  }


  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  // directiveDateObj(index:any,obj:any){
  //   console.log(index);
  //   console.log(obj);
  //   this.catchNoData[index][obj] = this.jcalendar.get(index).nativeElement.value;
  // }

  callCalendarSet(){
    myExtObject.callCalendar();
  }

  directiveDateArry(date:any,obj:any,index:any){
    console.log(date.target.value)
    this.catchNoData[index][obj] = date.target.value;
  }

  clickOpenMyModalComponentIndex(type:any,index:any){
    this.modalType = type;
    this.modalIndex = index;
    this.openbutton.nativeElement.click();
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    if((type==22 || type==11 ) && !this.result.run_id){
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
    this.listFieldName2="";
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
      "table_name" : "ppolice",
      "field_id" : "police_id",
      "field_name" : "police_name",
      "search_id" : "",
      "search_desc" : "",
      "condition" : " AND police_flag = 1",
        "userToken" : this.userData.userToken});
      this.listTable='ppolice';
      this.listFieldId='police_id';
      this.listFieldName='police_name';
      this.listFieldCond=" AND police_flag = 1";
    }else if(this.modalType==19){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
      "table_name" : "ppolice",
      "field_id" : "police_id",
      "field_name" : "police_name",
      "search_id" : "",
      "search_desc" : "",
      "condition" : " AND police_flag = 2",
        "userToken" : this.userData.userToken});
      this.listTable='ppolice';
      this.listFieldId='police_id';
      this.listFieldName='police_name';
      this.listFieldCond=" AND police_flag = 2";
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
    }else if(this.modalType==5 || this.modalType==6 || this.modalType==8 || this.modalType==9 || this.modalType==10){
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
    }else if(this.modalType==11 || this.modalType==22){
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
      this.listFieldName2='alle_running';
      this.listFieldCond=" AND user_select='1' AND case_type='"+this.result.case_type+"' AND case_cate_group='"+this.result.case_cate_group+"'";
    }else if(this.modalType==12 || this.modalType==15 || this.modalType==23 || this.modalType==24){
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
    }else if(this.modalType==20){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pofficer';
      this.listFieldId='off_id';
      this.listFieldName='off_name';
      this.listFieldCond="";
   }else if(this.modalType==16){
    $("#exampleModal").find(".modal-content").css("width","650px");
    var student = JSON.stringify({
      "table_name" : "ppolice",
      "field_id" : "police_id",
      "field_name" : "police_name",
      "search_id" : "",
      "search_desc" : "",
      "condition" : " AND police_flag = 1",
      "userToken" : this.userData.userToken});
      this.listTable='ppolice';
      this.listFieldId='police_id';
      this.listFieldName='police_name';
    this.listFieldCond="";
  }else if(this.modalType==17){
    $("#exampleModal").find(".modal-content").css("width","650px");
    var student = JSON.stringify({
      "table_name" : "ppolice",
      "field_id" : "police_id",
      "field_name" : "police_name",
      "search_id" : "",
      "search_desc" : "",
      "condition" : " AND police_flag = 2",
      "userToken" : this.userData.userToken});
    this.listTable='ppolice';
    this.listFieldId='police_id';
    this.listFieldName='police_name';
    this.listFieldCond="";
  }
    console.log(student)
    if(this.modalType==1 || this.modalType==2 || this.modalType==3 || this.modalType==11 || this.modalType==13 || this.modalType==14 || this.modalType==19 || this.modalType==20 || this.modalType==22){
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          if(this.modalType==1 || this.modalType==22 ){
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
    if(name=='issue_id'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.issue_name = productsJson[0].fieldNameValue;
        }else{
          this.result.issue_id = '';
          this.result.issue_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='police_id'){
      var student = JSON.stringify({
        "table_name" : "ppolice",
        "field_id" : "police_id",
        "field_name" : "police_name",
        "condition" : " AND police_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.police_name = productsJson[0].fieldNameValue;
        }else{
          this.result.police_id = '';
          this.result.police_name = '';
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
    }else if(name=="judge_id"){
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
          this.result.judge_name = productsJson[0].fieldNameValue;
        }else{
          this.result.judge_id = '';
          this.result.judge_name = '';
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
    }else if(name=="alle_id"){
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
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.alle_name = productsJson[0].fieldNameValue;
          }
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
                this.result.alle_id = '';
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

  getAlle(caseType:any,title:any){
    var student = JSON.stringify({
      "run_id" : this.result.run_id,
      "alle_running" : "",
      "alle_id" : "",
      "alle_seq" : "",
      "alle_name" : "",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseStat :"+student)
       let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/insertAllegation', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        // this.getCaseCate = getDataOptions;
        // this.fDefCaseStat(caseType,title);
      },
      (error) => {}
    )
    });
    return promise;
  }

  countDateArry(event:any,index:any){
    if(event==9){
      if(this.catchNoData[index].case_due){
        this.getCalDateArry(this.catchNoData[index].casedate_from,this.catchNoData[index].case_due,index);
        }
      }
  }

  getCalDateArry(date:any,daynum:any,index:any){
    var student = JSON.stringify({
      "casedate_from" : date,
      "case_due" : parseInt(daynum),
      "userToken" : this.userData.userToken
    });
    console.log("getCalDate==> :"+student)
       let promise = new Promise((resolve, reject) => {
    this.http.disableLoading().post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/dateFormat', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions);
          if(getDataOptions.result==1){
            var CaseDateTo = getDataOptions.casedate_to;
            this.catchNoData[index].casedate_to = this.stringToDate(CaseDateTo);
          }
      },
      (error) => {}
    )
    });
    return promise;
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
        if(resp.success==true){
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
        if(resp.success==true){
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
                      const confirmBox2 = new ConfirmBoxInitializer();
                      confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
                      confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
                      confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
                      // Choose layout color type
                      confirmBox2.setConfig({
                          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if(resp.success==true){
                        var student = this.alleDataTmp[this.delIndexAlle];
                        student["userToken"] = this.userData.userToken;
                        delete student["jRunning"];
                        console.log(student)
                        this.http.disableLoading().post('/'+this.userData.appName+'ApiCA/API/CASE/deleteAllegation', student , {headers:headers}).subscribe(
                          (response) =>{
                            let alertMessage : any = JSON.parse(JSON.stringify(response));
                            console.log(alertMessage)
                            if(alertMessage.result==0){
                              const confirmBox3 = new ConfirmBoxInitializer();
                              confirmBox3.setTitle('ข้อความแจ้งเตือน');
                              confirmBox3.setMessage(alertMessage.error);
                              confirmBox3.setButtonLabels('ตกลง');
                              confirmBox3.setConfig({
                                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                              });
                              const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                if(resp.success==true){
                                  this.closebutton.nativeElement.click();
                                }
                                subscription3.unsubscribe();
                              });
                            }else{
                              this.closebutton.nativeElement.click();
                              this.getObjAlleData();
                            }
                          },
                          (error) => {}
                        )
                      }
                      subscription2.unsubscribe();
                      });
                    }else if(this.modalType==23){
                      console.log(this.modalType);
                      const confirmBox2 = new ConfirmBoxInitializer();
                      confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
                      confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
                      confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
                      // Choose layout color type
                      confirmBox2.setConfig({
                          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if(resp.success==true){
                        var dataDel = [],dataTmp=[];
                        var bar = new Promise((resolve, reject) => {
                          this.catchNoData.forEach((ele, index, array) => {
                                // if(ele.edit0102 == true){
                                if(ele.c_seq == this.delIndexCatch){
                                  dataTmp.push(this.catchNoData[index]);
                                }
                            });
                        });
                        if(bar){
                            //console.log(dataTmp)
                          // dataDel['run_id'] = this.result.del_id;
                          dataDel['case_type'] = this.result.case_type;
                          dataDel['case_cate_id'] = this.result.case_cate_id ? this.result.case_cate_id : 1;
                          dataDel['title'] = this.result.title;
                          dataDel['id'] = this.result.id;
                          dataDel['yy'] = this.result.yy;
                          dataDel['court_id'] = this.userData.courtId;
                          dataDel['num_nofrom'] = this.result.num_nofrom;
                          dataDel['userToken'] = this.userData.userToken;
                          // dataDel['log_remark'] = chkForm.log_remark;
                          dataDel['data'] = dataTmp;
                          var data = $.extend({}, dataDel);
                         console.log(data);
                         console.log(JSON.stringify(data));
                        //  return false;
                         this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/delNoticeCatchNo', data ).subscribe(
                          (response) =>{
                            let alertMessage : any = JSON.parse(JSON.stringify(response));
                            if(alertMessage.result==0){
                              // this.SpinnerService.hide();

                            }else{

                             this.closebutton.nativeElement.click();
                              //$("button[type='reset']")[0].click();
                              const confirmBox3 = new ConfirmBoxInitializer();
                              confirmBox3.setTitle('ข้อความแจ้งเตือน');
                              confirmBox3.setMessage(alertMessage.error);
                              confirmBox3.setButtonLabels('ตกลง');
                              confirmBox3.setConfig({
                                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                              });
                              const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                if(resp.success==true){
                                  this.searchCatchData();
                                  // this.rerender();
                                  // this.closebutton.nativeElement.click();
                                  // this.searchData(2);
                                }
                                subscription3.unsubscribe();
                              });

                            }
                          },
                          (error) => {}
                        )
                        }
                      }
                      subscription2.unsubscribe();
                      });
                    }else if(this.modalType==15){
                      this.logRemarkEditRed = chkForm.log_remark;
                      this.closebutton.nativeElement.click();
                    }else if(this.modalType==24){
                      console.log(this.modalType);
                      const confirmBox2 = new ConfirmBoxInitializer();
                      confirmBox2.setTitle('ต้องการลบข้อมูลหมายจับใช่หรือไม่?');
                      confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
                      confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
                      // Choose layout color type
                      confirmBox2.setConfig({
                          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if(resp.success==true){
                        var dataDel = [],dataTmp=[];
                        var bar = new Promise((resolve, reject) => {
                          // this.catchNoData.forEach((ele, index, array) => {
                          //       // if(ele.edit0102 == true){
                          //       if(ele.c_seq == this.delIndexCatch){
                          //         dataTmp.push(this.catchNoData[index]);
                          //       }
                          //   });
                        });
                        if(bar){
                          this.closebutton.nativeElement.click();
                          var student = JSON.stringify({
                          "run_id" : this.result.run_id,
                          "userToken" : this.userData.userToken
                      });
                        console.log(student);
                          this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/delNoticeCatch', student ).subscribe(
                          (response) =>{
                            let alertMessage : any = JSON.parse(JSON.stringify(response));
                            if(alertMessage.result==1){
                              console.log(alertMessage);
                              const confirmBox3 = new ConfirmBoxInitializer();
                              confirmBox3.setTitle('ข้อความแจ้งเตือน');
                              confirmBox3.setMessage(alertMessage.error);
                              confirmBox3.setButtonLabels('ตกลง');
                              confirmBox3.setConfig({
                                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                              });
                              const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                if(resp.success==true){
                                  window.location.reload();
                                }
                                subscription3.unsubscribe();
                              });

                          }else{
                              const confirmBox3 = new ConfirmBoxInitializer();
                              confirmBox3.setTitle('ข้อความแจ้งเตือน');
                              confirmBox3.setMessage(alertMessage.error);
                              confirmBox3.setButtonLabels('ตกลง');
                              confirmBox3.setConfig({
                                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                              });
                              const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                if(resp.success==true){}
                                subscription3.unsubscribe();
                              });

                          }
                          },
                          (error) => {}
                        )
                        }
                      }
                      subscription2.unsubscribe();
                      });
                    }
            }else{
              confirmBox.setMessage(productsJson.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if(resp.success==true){}
                subscription.unsubscribe();
              });
            }
          },
          (error) => {}
        );

    }
  }

  runCaseNo(){
    console.log(this.result.id);
    if(!this.result.id){
    if(this.result.title && this.result.yy && this.result.case_type){
      var student = JSON.stringify({
        "case_type": this.result.case_type,
        "title": this.result.title,
        "yy": this.result.yy,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/runCaseNo', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(getDataOptions.result==1){

            this.result.id = getDataOptions.id + 1;
          }
        },
        (error) => {}
      )
      });
      return promise;
    }
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
    console.log(this.modalType);
    if(this.modalType==1){
      this.result.cost_payer_id=event.fieldIdValue;
      this.result.cost_payer=event.fieldNameValue;
    }else if(this.modalType==20){
      this.result.issue_id=event.fieldIdValue;
      this.result.issue_name=event.fieldNameValue;
    }else if(this.modalType==3 || this.modalType==19){
      this.result.police_id=event.fieldIdValue;
      this.result.police_name=event.fieldNameValue;
    }else if(this.modalType==11){
      this.insertAlle([event]);
      if(this.chkAlle==1){
        this.result.alle_desc = this.result.alle_desc? this.result.alle_desc + ',' + event.fieldNameValue : event.fieldNameValue;
      }
    }else if(this.modalType==22){
      // this.result.alle_id=event.fieldIdValue;
      this.result.alle_desc = this.result.alle_desc? this.result.alle_desc + ',' + event.fieldNameValue : event.fieldNameValue;
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
      this.result.judge_id=event.judge_id;
      this.result.judge_name=event.judge_name;
    }else if(this.modalType==9){
      this.result.judge_id2=event.judge_id;
      this.result.judge_name2=event.judge_name;
    }else if(this.modalType==10){
      this.result.judge_id3=event.judge_id;
      this.result.judge_name3=event.judge_name;
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
    console.log(objHead);
    this.headDataObj = objHead;
    if(this.headDataObj.data){
      this.caseDataTmp = this.caseDataObj.data;
      this.catchDataObj = this.caseDataObj.catch_data;
    }
   if(objHead.new == 0 || this.headDataObj.catch_data){
  //  if(this.headDataObj){
      this.caseDataObj = objHead;
      this.caseDataTmp = this.caseDataObj.data;
      this.catchDataObj = this.caseDataObj.catch_data;

    // if(objHead.catch_data){
    //   this.catchNoData = this.catchDataObj[0].catch_no_data;
    //   this.alleDataTmp = this.catchDataObj[0].alle_data;
    //   setTimeout(() => {
    //     this.callCalendarSet();
    //   }, 500);
    // }

    if(objHead.catch_data.length > 0){
      setTimeout(() => {
        this.callCalendarSet();
      }, 500);

      if(objHead.catch_data[0].catch_no_data.length)
        this.catchNoData = this.catchDataObj[0].catch_no_data;
      else
        this.catchNoData = [];
      if(objHead.catch_data[0].alle_data.length)
        this.alleDataTmp = this.catchDataObj[0].alle_data;
      else
        this.alleDataTmp = [];
    }else{
      this.catchNoData = this.alleDataTmp = [];
    }

    // }

    // this.accuDataTmp = JSON.stringify(this.caseDataObj.accuObj);
    // this.alleDataTmp = this.caseDataObj.catch_data.alle_data;
    // this.result.title =
    console.log('ObjHead==>', objHead);
    console.log('caseDataObj==>',this.caseDataObj);
    console.log('caseDataTmp==>',this.caseDataTmp);
    console.log('catchDataObj==>',this.catchDataObj);
    console.log('catchNoData==>',this.catchNoData);
    console.log('alleDataTmp==>',this.alleDataTmp);


    // console.log(this.caseDataTmp[0].alle_desc);

    //============================== head ==================================================
    // this.result["run_id"] = objHead.run_id;
    // this.result["case_type"] = objHead.case_type;
    // this.result["red_title"] = objHead.red_title;
    // this.result["red_id"] = objHead.red_id;
    // this.result["red_yy"] = objHead.red_yy;
    // if(objHead.judge_stat_flag)
    //   this.result["judge_stat_flag"] = 1;
    // this.result['userToken'] = this.userData.userToken;
    // this.result['log_remark'] = this.logRemarkEditRed;

    //============================== tab1 ==================================================
    if(this.caseDataTmp.length != 0){
    this.result.case_type = this.caseDataTmp[0].case_type;
    this.result.case_cate_group = this.caseDataTmp[0].case_cate_group;
    this.result.alle_seq = this.alleDataTmp.length + 1;
    }

    if(objHead.catch_data){
    this.result.alle_desc = this.catchDataObj[0].alle_desc;
    this.result.due_date = this.catchDataObj[0].due_date;
    this.result.id = this.catchDataObj[0].id;
    this.result.inout_flag = this.catchDataObj[0].inout_flag;
    this.result.issue_id = this.catchDataObj[0].issue_id;
    this.result.issue_name = this.catchDataObj[0].off_name;
    this.result.judge_id = this.catchDataObj[0].judge_id;
    this.result.judge_name = this.catchDataObj[0].judge_name;
    this.result.off_name = this.catchDataObj[0].off_name;
    this.result.police_id = this.catchDataObj[0].police_id;
    this.result.police_name = this.catchDataObj[0].police_name;
    this.result.r_name = this.catchDataObj[0].r_name;
    this.result.r_title = this.catchDataObj[0].r_title;
    this.result.rcv_name = this.catchDataObj[0].rcv_name;
    this.result.remark = this.catchDataObj[0].remark;
    this.result.report_result_date = this.catchDataObj[0].report_resut_date;
    this.result.report_result_day = this.catchDataObj[0].report_result_day;
    this.result.req_id = this.catchDataObj[0].req_id;
    this.result.req_name = this.catchDataObj[0].req_name;
    if(this.catchDataObj[0].req_title){
      this.result.req_title = parseInt(this.catchDataObj[0].req_title);
    }
    this.result.result_date = this.catchDataObj[0].result_date;
    this.result.result_flag = this.catchDataObj[0].result_flag;
    this.result.result_time = this.catchDataObj[0].result_time;
    this.result.run_id = this.catchDataObj[0].run_id;
    this.result.s_id = this.catchDataObj[0].s_id;
    this.result.s_title = this.catchDataObj[0].s_title;
    this.result.s_type = this.catchDataObj[0].s_type;
    this.result.s_yy = this.catchDataObj[0].s_yy;
    this.result.search_send_desc = this.catchDataObj[0].search_send_desc;
    this.result.catch_date = this.catchDataObj[0].catch_date;
    this.result.catch_date_to = this.catchDataObj[0].catch_date_to;
    this.result.catch_place = this.catchDataObj[0].catch_place;
    this.result.catch_time = this.catchDataObj[0].catch_time;
    this.result.catch_time_to = this.catchDataObj[0].catch_time_to;
    this.result.send_date = this.catchDataObj[0].send_date;
    this.result.send_record_to = this.catchDataObj[0].send_record_to;
    this.result.send_time = this.catchDataObj[0].send_time;
    this.result.sno_from = this.catchDataObj[0].sno_from;
    this.result.sno_to = this.catchDataObj[0].sno_to;
    this.result.max_no = this.catchDataObj[0].max_no;
    this.result.total = this.catchDataObj[0].total;
    this.result.title = this.catchDataObj[0].title;
    this.result.yy = this.catchDataObj[0].yy;
    this.result.update_date = this.catchDataObj[0].update_date;
    this.result.update_dep_code = this.catchDataObj[0].update_dep_code;
    this.result.update_dep_name = this.catchDataObj[0].update_dep_name;
    this.result.update_user = this.catchDataObj[0].update_user;
    this.result.update_user_id = this.catchDataObj[0].update_user_id;
    }
  }else{
    // this.result.title = this.headDataObj[0].title;
    // this.result.id = this.headDataObj[0].id;
    // this.result.yy = this.headDataObj[0].yy;
    // this.result.case_type = this.headDataObj[0].case_type;
    // this.result.case_cate_id = this.headDataObj[0].case_cate_id;
    // this.result.num_nofrom = this.headDataObj[0].numm_noform;
    // this.CheckNew = 0;
    if(this.headDataObj){
      console.log('headDataobj==>',this.headDataObj);
      if(this.CheckNew == 1){
      this.result.title = this.headDataObj[0].title;
      this.result.id = this.headDataObj[0].id;
      this.result.yy = this.headDataObj[0].yy;
      this.result.case_type = this.headDataObj[0].case_type;
      this.result.case_cate_id = this.headDataObj[0].case_cate_id;
      this.result.num_nofrom = this.headDataObj[0].numm_noform;
      }

    }
    this.CheckNew = 0;
  }

    if(this.catchNoData.length > 0){
      this.result2.c_no = this.catchNoData[0].c_no;
      this.result2.inout_flag = this.catchNoData[0].inout_flag;
      this.result2.c_no_cancel = this.catchNoData[0].c_no_cancel;
      this.result2.c_no_reason = this.catchNoData[0].c_no_reason;
    }
    setTimeout(() => {
      //this.rerender();
    }, 500);

}

  getNewCno(index:any){
    if(!this.catchNoData[index].c_no){
       this.newCno = this.newCno + 1;
       this.catchNoData[index].c_no = this.result.max_no + this.newCno;
    }
  }

  delNewCno(index:any){
    if(!this.catchNoData[index].c_no){
      if(this.newCno > 0){
        this.newCno = this.newCno - 1;
      }
     //  this.catchNoData[index].c_no = this.result.max_no + this.newCno;
    }
  }

  saveTab(){
    var dataDel = [],dataTmp=[];
    var bar = new Promise((resolve, reject) => {
    // this.catchNoData.forEach((ele, index, array) => {
    //  // if(ele.edit0102 == true){
    //  if(ele.c_seq == this.delIndexAlle){
    //    dataTmp.push(this.catchNoData[index]);
    //   }
    //     });
      });
        if(bar){
          //console.log(dataTmp)
          dataDel['case_type'] = this.result.case_type;
          dataDel['case_cate_id'] = this.result.case_cate_id ? this.result.case_cate_id : 1;
          dataDel['title'] = this.result.title;
          dataDel['id'] = this.result.id;
          dataDel['yy'] = this.result.yy;
          dataDel['num_nofrom'] = this.result.num_nofrom;
          dataDel['court_id'] = this.userData.courtId;
          // dataDel['num_nofrom'] = this.result.num_nofrom;
          // if(this.getCatch){
          //   console.log('Oldddddddddddd');
          //   dataDel['data'] = this.getCatch.data;
          //   dataDel['catch_no_data'] = this.getCatch.catch_data[0].catch_no_data;
          // }else{
          //   console.log('Newwwwwwwwwwwwww');
          //   dataTmp.push({send_date: myExtObject.curDate(),send_time: this.getTime()});
          //   dataDel['data'] = dataTmp;
          //   dataDel['catch_no_data'] = [];
          // }


          dataDel['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataDel);
          console.log(data);
          console.log(JSON.stringify(data));
          // return false;
          this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/saveNoticeCatch', data ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
             if(alertMessage.result==0){
                         // this.SpinnerService.hide();

              }else{
                          // this.closebutton.nativeElement.click();
                          //$("button[type='reset']")[0].click();
                          const confirmBox = new ConfirmBoxInitializer();
                          confirmBox.setTitle('ข้อความแจ้งเตือน');
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              this.closebutton.nativeElement.click();
                              // this.searchData(2);
                            }
                            subscription.unsubscribe();
                          });

                        }
                      },
                      (error) => {}
                    )
                    }
   }

     saveNoticeCatch(){
       // if(this.result.title || this.result.id || this.result.yy){
          var dataDel = [],dataTmp=[];
          var bar = new Promise((resolve, reject) => {
          // this.catchNoData.forEach((ele, index, array) => {
          //  // if(ele.edit0102 == true){
          //  if(ele.c_seq == this.delIndexAlle){
          //    dataTmp.push(this.catchNoData[index]);
          //   }
          //     });
            });
              if(bar){
                //console.log(dataTmp)
                dataDel['run_id'] = this.result.run_id;

                // console.log('hResult==>',this.Head.hResult.case_type);
                dataDel['case_type'] = this.result.case_type;
                dataDel['case_cate_id'] = this.result.case_cate_id ? this.result.case_cate_id : 1;
                dataDel['title'] = this.result.title;
                dataDel['id'] = this.result.id;
                dataDel['yy'] = this.result.yy;
                dataDel['court_id'] = this.userData.courtId;
                dataDel['num_nofrom'] = this.result.num_nofrom ? parseInt(this.result.num_nofrom) : 1;
                if(this.result.run_id){
                  console.log('Oldddddddddddd');
                  console.log(this.caseDataObj);
                  dataTmp.push($.extend({}, this.result));
                  // dataDel['data'] = this.caseDataObj.data;
                  dataDel['data'] = dataTmp;
                  dataDel['catch_no_data'] = this.caseDataObj.catch_data[0].catch_no_data;
                }else{
                  console.log('Newwwwwwwwwwwwww');
                  this.CheckNew = 0;
                  dataTmp.push({send_date: myExtObject.curDate(),send_time: this.getTime()});
                  dataDel['data'] = dataTmp;
                  dataDel['catch_no_data'] = [];
                }
                dataDel['userToken'] = this.userData.userToken;
                var data = $.extend({}, dataDel);
                console.log(data);
                console.log(JSON.stringify(data));
                // return false;
                this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/saveNoticeCatch', data ).subscribe(
                (response) =>{
                  let alertMessage : any = JSON.parse(JSON.stringify(response));
                   if(alertMessage.result==0){
                               // this.SpinnerService.hide();

                    }else{
                               // this.closebutton.nativeElement.click();
                                //$("button[type='reset']")[0].click();
                                const confirmBox = new ConfirmBoxInitializer();
                                confirmBox.setTitle('ข้อความแจ้งเตือน');
                                confirmBox.setMessage(alertMessage.error);
                                confirmBox.setButtonLabels('ตกลง');
                                confirmBox.setConfig({
                                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                                });
                                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                  if (resp.success==true){
                                  console.log(alertMessage);
                                    this.searchCatchData();
                                    // this.closebutton.nativeElement.click();
                                    // this.searchCatchData();
                                    // this.searchData(2);
                                  }
                                  subscription.unsubscribe();
                                });

                              }
                            },
                            (error) => {}
                          )
                    }
              //  }
          }

          getMessage(message:any){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(message);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }

          searchCatchData(){
            if(this.result.title && this.result.id && this.result.yy){
              var student = JSON.stringify({
                "case_type": this.result.case_type,
                "title": this.result.title,
                "id" : this.result.id,
                "yy": this.result.yy.toString(),
                "court_id" : this.userData.courtId,
                "userToken" : this.userData.userToken
              });
              console.log(student)
              let promise = new Promise((resolve, reject) => {
                this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/getnoticeCatchDataTab1', student).subscribe(
                (response) =>{
                  let getDataOptions : any = JSON.parse(JSON.stringify(response));
                  console.log(getDataOptions);
                  if(getDataOptions.result==1){
                    this.getCatch = getDataOptions;
                    this.sendCaseData.emit(this.getCatch);
                    // this.hResult.red_id = getDataOptions.red_id;
                    console.log('getCatch==>',this.getCatch);
                    this.loadHead();
                    this.saveData(this.getCatch);
                  }else{
                    this.getMessage(getDataOptions.error);
                  }
                },
                (error) => {}
              )
              });
              return promise;
            }
          }

          loadHead(){
            this.result.case_cate_id = this.getCatch.data[0].case_cate_id;
            this.result.case_cate_name = this.getCatch.data[0].case_cate_name;
            if(this.getCatch.data[0].sno_from){
              this.result.nofrom = this.getCatch.catch_data[0].sno_from ? this.getCatch.catch_data[0].sno_from : '';
              this.result.num_nofrom = this.getCatch.catch_data[0].total ? this.getCatch.catch_data[0].total : 1;
            }
          }

   saveCatchNo(index:any,sseq:any){
      // alert(index);
      // alert(this.catchNoData[index].c_no);
      // alert(sseq);
      if(this.catchNoData[index].c_no){
      var dataDel = [],dataTmp=[];
      var bar = new Promise((resolve, reject) => {
        this.catchNoData.forEach((ele, index, array) => {
              // if(ele.edit0102 == true){
                console.log(ele.c_seq);
              if(ele.c_seq == sseq){
                dataTmp.push(this.catchNoData[index]);
              }
          });
      });
          if(bar){
            //console.log(dataTmp)
            dataDel['case_type'] = this.result.case_type;
            dataDel['case_cate_id'] = this.result.case_cate_id ? this.result.case_cate_id : 1;
            dataDel['title'] = this.result.title;
            dataDel['id'] = this.result.id;
            dataDel['yy'] = this.result.yy;
            dataDel['court_id'] = this.userData.courtId;
            // dataDel['num_nofrom'] = this.result.num_nofrom;
            // if(this.getCatch){
            //   console.log('Oldddddddddddd');
            //   dataDel['data'] = this.getCatch.data;
            //   dataDel['catch_no_data'] = this.getCatch.catch_data[0].catch_no_data;
            // }else{
            //   console.log('Newwwwwwwwwwwwww');
            //   dataTmp.push({send_date: myExtObject.curDate(),send_time: this.getTime()});

            //   dataDel['catch_no_data'] = [];
            // }
            dataDel['data'] = dataTmp;
            dataDel['userToken'] = this.userData.userToken;
            var data = $.extend({}, dataDel);
            console.log(data);
            console.log(JSON.stringify(data));
            // return false;
            this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/saveNoticeCatchNo', data ).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
               if(alertMessage.result==0){
                           // this.SpinnerService.hide();

                }else{
                            // this.closebutton.nativeElement.click();
                            //$("button[type='reset']")[0].click();
                            const confirmBox = new ConfirmBoxInitializer();
                            confirmBox.setTitle('ข้อความแจ้งเตือน');
                            confirmBox.setMessage(alertMessage.error);
                            confirmBox.setButtonLabels('ตกลง');
                            confirmBox.setConfig({
                                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.callDataHead();
                                // this.searchCatchData();
                                // this.searchData(2);
                              }
                              subscription.unsubscribe();
                            });

                          }
                        },
                        (error) => {}
                      )
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

  goToPage(toPage:any){
    let winURL = window.location.href;
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+toPage;
    //alert(winURL);
    window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1800,height=600");
    //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
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

  stringToDate(dateString) {
    if (!dateString) {
        return new Date();
    }
    var nday,nmonth,nyear;
    var dateList = dateString.split("/");
    var day = parseInt(dateList[0], 10);
    var month = parseInt(dateList[1], 10);
    var year = parseInt(dateList[2], 10);
    if(day.toString.length == 1){
      nday = '0' + day;
    }else{
      nday = day;
    }
    if(month.toString.length == 1){
      nmonth = '0' + month;
    }else{
      nmonth = month;
    }
    // nyear = year + parseInt(this.result.report_result_day);
    return (nday + '/' + nmonth + '/' + year);
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
    this.http.disableLoading().post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/insertAllegation', student ).subscribe(
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
              this.chkAlle = 0;
              this.getObjAlleData();
            }
            subscription.unsubscribe();
          });
        }else{
          const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('จัดเก็บข้อมูลฐานความผิดแล้ว');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.chkAlle = 1;
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
    if(this.result.run_id){
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getAllegationData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.dataAlleObj = getDataOptions.data;
            console.log(this.dataAlleObj);
            this.alleDataTmp = this.dataAlleObj;
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
            this.alleDataTmp = this.dataAlleObj;
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

  delCatchData(index:any){
    this.delIndexCatch = index;
    this.clickOpenMyModalComponent(23);
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
          this.rerender();
        }
      },
      (error) => {}
    );
  }

  accuReset(){
    this.caseDataObj.accuObj = JSON.parse(this.accuDataTmp);
    this.rerender();
  }

  buttonNew(){
    // let winURL = window.location.href.split("/#/")[0]+"/#/";
    // console.log(winURL+'fsc0200')
    // location.replace(winURL+'fsc0200')
    window.location.reload();
    setTimeout(() => {
      console.log(this.result.id);
      this.runCaseNo();
    }, 500);
  }

  delNoticeCatch(){

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
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ต้องการลบข้อมูลหมายจับใช่หรือไม่?');
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
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/delNoticeCatch', student ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          if(alertMessage.result==1){
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  window.location.reload();
                }
                subscription.unsubscribe();
              });
                // this.caseDataObj = [];
                // //this.accuDataTmp = [];
                // //this.dataAlleObj = [];
                // this.delIndexAlle = null;
                // // this.onClickListData.emit({data,counter,run_id,event});

                // this.setDefPage();

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
  }

  resetPage(){
    window.location.reload();
    // if(this.result.run_id){
    //   var data = 1;
    //   var counter = this.counter++;
    //   var run_id = this.result.run_id;
    //   var event = 2;
    //   this.onClickListData.emit({data,counter,run_id,event});
    // }else{
    //   window.location.reload();
    // }
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



}
