import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,ViewChildren, QueryList  } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerService } from "ngx-spinner";
// import { ThrowStmt } from '@angular/compiler';
import { get } from 'https';
declare var myExtObject: any;
@Component({
  selector: 'app-fsc0100-tab2',
  templateUrl: './fsc0100-tab2.component.html',
  styleUrls: ['./fsc0100-tab2.component.css']
})
export class Fsc0100Tab2Component implements AfterViewInit, OnInit, OnDestroy {

  result:any = [];
  hResult:any = [];
  resultTmp:any = [];
  appealData:any = [];
  appealDataTmp:any = [];
  seekDatatab2:any = [];
  caseDataObj2:any = [];
  seekNoData2:any = [];
  seekDataObj2:any = [];
  accuDataTmp2:any = [];
  caseDataTmp2:any = [];
  getOff:any;

  myExtObject: any;
  sessData:any;
  userData:any;
  headData:any;
  getOrder:any;
  getResult:any;
  getSno:any=[];
  getResultFlag:any;
  modalType:any;
  delIndex:any;
  caseTypeValue:any;
  Snoindex:any;
  SnoSeq:any;

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
  @Input() set getTab(getTab: any) {//รับจาก fsc0100-main
    if(typeof getTab !='undefined' && getTab.index==1){
      myExtObject.callCalendar();
      console.log('GETSNO==>',this.getSno);
      if(this.getSno.length == 0){
        this.getSnoList();
      }
      console.log('GETSNO==>',this.getSno);
      // this.loadData(0);
    }
  }
  @Input() set getDataHead(getDataHead: any) {//รับจาก fsc0100-main
    console.log(getDataHead)
    console.log(typeof(getDataHead));
    if(typeof getDataHead !='undefined'){
      // alert('ooooo');
      this.result.title = getDataHead.title;
      this.result.id = getDataHead.id;
      this.result.yy = getDataHead.yy;
      this.result.case_type = getDataHead.case_type;
      this.result.court_id = getDataHead.court_id;
      this.headData = getDataHead;
      console.log('headData==>',this.headData);
      this.caseDataObj2 = this.headData;
      this.caseDataTmp2 = this.caseDataObj2.data;
      this.seekDataObj2 = this.caseDataObj2.seek_data;
      if(this.seekDataObj2){
        this.seekNoData2 = this.seekDataObj2[0].seek_no_data;
      }

      console.log('caseDataObj2==>',this.caseDataObj2);
      console.log('caseDataTmp2==>',this.caseDataTmp2);
      console.log('seekDataObj2==>',this.seekDataObj2);
      console.log('seekNoData2==>',this.seekNoData2);
      this.getSno =[];
      for(let i= 0; i < this.seekNoData2.length; i++){
        this.getSno.push({id: this.seekNoData2[i].s_seq,text: this.seekNoData2[i].s_no,idx: i});
      }
      // this.getIncourt = [{id: 1,text: 'ในเขต'},{id: 2,text: 'นอกเขต'}];
      // this.getSno = $.extend({}, this.getSno);
      console.log(this.getSno);
      // this.seekNoData2.array.forEach(element => {
      //   this.getSno.push()
      // });
      // this.caseTypeValue = this.headData.case_type;
      // this.getAppealJudgeData(0);
    }
  }
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
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
          this.result.input_result_user_id =  Off[0].fieldIdValue;
          this.result.input_result_user = Off[0].fieldNameValue;
        }
      },
      (error) => {}
    )
     this.getResultFlag = [{id: 1,text: 'ค้นพบ'},{id: 2,text: 'ค้นไม่พบ'},{id: 3,text: 'ไม่ได้ค้น บ้านปิดล๊อค'},{id: 4,text: 'ไม่ได้ค้น อื่นๆ'}];
    // this.getSno = [{id:'1', text: '1'}];
    this.setDefPage();

  }

  setDefPage(){
    this.result = [];

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

  loadOfficer(){
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
          this.result.input_result_user_id =  Off[0].fieldIdValue;
          this.result.input_result_user = Off[0].fieldNameValue;
        }
      },
      (error) => {}
    )
  }

  loadData(index:any){
    console.log('seekDatatab2==>',this.seekDatatab2);
    this.result.seek_place = this.seekDatatab2[index].seek_place;
    this.result.result_date = this.seekDatatab2[index].result_date;
    this.result.result_time = this.seekDatatab2[index].result_time;
    if(this.seekDatatab2[index].result_flag > 0){
      this.result.result_flag = this.seekDatatab2[index].result_flag;
    }else{
      this.result.result_flag = '';
    }
    this.result.other_desc = this.seekDatatab2[0].other_desc;

    if(this.result.s_no){
      var SnoObj = this.getSno.filter((x:any) => x.text === this.result.s_no);
      console.log(SnoObj);
      if(SnoObj.length!=0){
        this.result.s_seq = SnoObj[0].id;
      }
      console.log(this.result.s_no);
      console.log(this.result.s_seq);
    }
    // this.result.s_seq =  this.seekDatatab2[0].s_seq;
    if(this.seekDatatab2[index].input_result_user_id){
      this.result.input_result_user_id = this.seekDatatab2[index].input_result_user_id;
      this.result.input_result_user = this.seekDatatab2[index].input_result_user;
    }else{
      this.loadOfficer();
    }

  }

  // saveData(objHead:any){

  //   this.caseDataObj2 = objHead;
  //   this.caseDataTmp2 = this.caseDataObj.data;
  //   // this.seekDataobj = this.caseDataObj.noticeseekNo_data;
  //   // this.accuDataTmp = JSON.stringify(this.caseDataObj.accuObj);
  //   // this.alleDataTmp = this.caseDataObj.alle_data;
  //   console.log('ObjHead==>', objHead);
  //   console.log('caseData==>',this.caseDataObj2);
  //   console.log('caseDataTmp==>',this.caseDataTmp2);
  //   // console.log('seekData==>',this.seekDataobj);
  //   // console.log(this.caseDataTmp[0].alle_desc);

  //   //============================== head ==================================================
  //   this.result["run_id"] = objHead.run_id;
  //   this.result["case_type"] = objHead.case_type;
  //   this.result["red_title"] = objHead.red_title;

  // }

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

//   getSeekData(){
//     if(this.hResult.title && this.hResult.id && this.hResult.yy){
//       var student = JSON.stringify({
//         "case_type": this.hResult.case_type,
//         "title": this.hResult.title,
//         "id" : this.hResult.id,
//         "yy": this.hResult.yy.toString(),
//         "court_id" : this.userData.courtId,
//         "userToken" : this.userData.userToken
//       });
//       console.log(student)
//       let promise = new Promise((resolve, reject) => {
//         this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0100/getNoticeSeekDataTab1', student).subscribe(
//         (response) =>{
//           let getDataOptions : any = JSON.parse(JSON.stringify(response));
//           console.log(getDataOptions);
//           if(getDataOptions.result==1){
//             this.getSeek = getDataOptions;
//             this.sendCaseData.emit(this.getSeek);
//             // this.hResult.red_id = getDataOptions.red_id;
//             console.log('getSeek==>',this.getSeek);
//             this.loadHead();
//           }else{
//             this.getMessage(getDataOptions.error);
//           }
//         },
//         (error) => {}
//       )
//       });
//       return promise;
//     }
//   }

//   loadHead(){
//     if(this.getSeek.seek_data){
//      this.hResult.run_id = this.getSeek.seek_data[0].run_id;
//      this.hResult.case_cate_id = this.getSeek.data[0].case_cate_id;
//      this.hResult.case_cate_name = this.getSeek.data[0].case_cate_name;

//      if(this.getSeek.seek_data[0].sno_from){
//        this.hResult.nofrom = this.getSeek.seek_data[0].sno_from ? this.getSeek.seek_data[0].sno_from : '';
//        this.hResult.num_nofrom = this.getSeek.seek_data[0].total ? this.getSeek.seek_data[0].total : '';
//      }
//    }
//  }

  getseekDatatab2(value:any){
    // alert(value);
    // this.s_no = value;
    // console.log(this.s_no);
    if(value){
      var SnoObj = this.getSno.filter((x:any) => x.text === value);
      console.log(SnoObj);
      if(SnoObj.length!=0){
        this.Snoindex = SnoObj[0].idx;
        this.SnoSeq = SnoObj[0].id;
        console.log('SnoIndex==>',this.Snoindex);
      }
    }
    console.log(this.headData);
    if(this.headData.result == 1){
          var student = JSON.stringify({
          "run_id" : this.headData.data[0].run_id,
          "s_seq" : this.SnoSeq,
          "s_no" : value,
          "userToken" : this.userData.userToken
        });
        console.log(student)

        this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0100/getNoticeSeekDataTab2', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.data.length){
              this.seekDatatab2 = getDataOptions.data;
              this.loadData(0);
            }else{
              this.seekDatatab2 = [];
            }
          },
          (error) => {}
        );
    }else{
      this.seekDatatab2 = [];
    }
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

  saveseekDatatab2(){
    // alert(value);
    console.log(this.result)
    if(this.result.s_no){
    console.log(this.headData);
    if(this.headData.result == 1){
          var student = JSON.stringify({
          "run_id" : this.headData.data[0].run_id,
          "s_seq" : this.result.s_seq,
          "s_no" : this.result.s_no,
          "seek_place" : this.result.seek_place,
          "result_date" : this.result.result_date,
          "result_time" : this.result.result_time,
          "result_flag" : this.result.result_flag,
          "other_desc" : this.result.other_desc,
          "input_result_user_id" : this.result.input_result_user_id,
          "input_result_user" : this.result.input_result_user,
          "userToken" : this.userData.userToken
        });
        console.log(student)

        this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0100/updateNoticeSeekNo', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==0){
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  // this.getObjAlleData();
                }
                subscription.unsubscribe();
              });
            }else{
              const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    // this.getObjAlleData();
                  }
                  subscription.unsubscribe();
                });

            }
          },
          (error) => {}
        );
    }else{
      this.seekDatatab2 = [];
    }
   }else{
    this.getMessage('เลือกเลขที่หมายค้นก่อน');
   }
  }

  resetPage(){
    if(this.result.run_id){
      var data = 1;
      // var counter = this.counter++;
      var run_id = this.result.run_id;
      var event = 2;
      // this.onClickListData.emit({data,counter,run_id,event});
    }else{
      // window.location.reload();
      this.setDefPage();
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
    }else if(this.modalType==7){
      this.result.input_result_user_id = event.fieldIdValue;
      this.result.input_result_user = event.fieldNameValue;
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
    }else if(this.modalType==7){
      $("#exampleModal").find(".modal-content").css("width","700px");
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
    }else if(this.modalType==3){
      $("#exampleModal").find(".modal-content").css({"width":"950px"});
      this.loadModalConfComponent = false;
      this.loadModalIndictComponent = false;
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeGroupComponent = true;
    }else if(this.modalType==4 || this.modalType==5 || this.modalType==6){
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
    if(this.modalType==2 || this.modalType==7){
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
                      student["userToken"] = this.userData.userToken;
                      console.log(student)
                      this.http.disableLoading().post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/deleteAppealJudge', student , {headers:headers}).subscribe(
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
                                this.getAppealJudgeData(0);
                              }
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
    if(name=="input_result_user_id"){
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
          this.result.input_result_user = productsJson[0].fieldNameValue;
        }else{
          this.result.input_result_user_id = '';
          this.result.input_result_user = '';
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

  getSnoList(){
    var student = JSON.stringify({
      "title" : this.result.title,
      "id" : this.result.id,
      "yy" : this.result.yy,
      "case_type" : this.result.case_type,
      "court_id" : this.result.court_id,
      "userToken" : this.userData.userToken
    });
    console.log(student);
    this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0100/getNoticeSeekDataTab2', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.seekNoData2 = getDataOptions.data;
        for(let i= 0; i < this.seekNoData2.length; i++){
          this.getSno.push({id: this.seekNoData2[i].s_seq,text: this.seekNoData2[i].s_no,idx: i});
        }
        // if(getDataOptions.length > 0){
        // this.getSno = getDataOptions.data;
        // }
      },
      (error) => {}
    )
  }


}
