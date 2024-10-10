import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,ViewChildren, QueryList  } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerService } from "ngx-spinner";
import { NgSelectComponent } from '@ng-select/ng-select';
declare var myExtObject: any;
@Component({
  selector: 'app-fsc0200-tab2',
  templateUrl: './fsc0200-tab2.component.html',
  styleUrls: ['./fsc0200-tab2.component.css']
})
export class Fsc0200Tab2Component implements AfterViewInit, OnInit, OnDestroy {

  result:any = [];
  resultTmp:any = [];
  appealData:any = [];
  appealDataTmp:any = [];
  catchDatatab2:any = [];
  caseDataObj2:any = [];
  catchNoData2:any = [];
  catchDataObj2:any = [];
  accuDataTmp2:any = [];
  caseDataTmp2:any = [];
  getOff:any;
  getInter:any;
  getNation:any;
  inter_id:any;
  nation_id:any;
  getProv:any;
  getAmphur:any;
  getTambon:any;
  prov_id:any;
  amphur_id:any;
  tambon_id:any;

  myExtObject: any;
  sessData:any;
  getPersTitle:any;
  userData:any;
  headData:any;
  getOrder:any;
  getResult:any;
  getCno:any=[];
  Cnoindex:any;
  CnoSeq:any;
  getResultFlag:any;
  modalType:any;
  delIndex:any;
  caseTypeValue:any;
  getPostNo:any;
  edit_tambon_id:any;
  edit_amphur_id:any;
  edit_prov_id:any;

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
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
  @Input() set getTab(getTab: any) {//รับจาก fsc0200-main
    if(typeof getTab !='undefined' && getTab.index==1){
      myExtObject.callCalendar();
      console.log('GETCNO==>',this.getCno);
      if(this.getCno.length == 0){
        this.getCnoList();
      }
      console.log('GETCNO==>',this.getCno);
    }
  }
  @Input() set getDataHead(getDataHead: any) {//รับจาก fsc0200-main
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
      this.catchDataObj2 = this.caseDataObj2.catch_data;
      if(this.catchDataObj2){
        this.catchNoData2 = this.catchDataObj2[0].catch_no_data;
      }

      console.log('caseDataObj2==>',this.caseDataObj2);
      console.log('caseDataTmp2==>',this.caseDataTmp2);
      console.log('catchDataObj2==>',this.catchDataObj2);
      console.log('catchNoData2==>',this.catchNoData2);
      this.getCno =[];
      this.result.c_no = '';
      for(let i= 0; i < this.catchNoData2.length; i++){
        this.getCno.push({id: this.catchNoData2[i].c_seq,text: this.catchNoData2[i].c_no,idx: i});
      }

      this.setDefPage();
      if(this.sAmphur)
        this.sAmphur.clearModel();
      if(this.sTambon)
        this.sTambon.clearModel();
      // this.getCno = $.extend({}, this.getCno);
      console.log(this.getCno);
      // this.catchNoData2.array.forEach(element => {
      //   this.getCno.push()
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

    //======================== pprovince ======================================
    var student = JSON.stringify({
      "table_name" : "pprovince",
      "field_id" : "prov_id",
      "field_name" : "prov_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getProv = getDataOptions;
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


     //======================== ppers_title ======================================
     var student = JSON.stringify({
      "table_name" : "ppers_title",
      "field_id" : "pers_title_no",
      "field_name" : "pers_title",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getPersTitle = getDataOptions;
      },
      (error) => {}
    )

    //======================== pnation ======================================
 var student = JSON.stringify({
  "table_name" : "pnation",
  "field_id" : "nation_id",
  "field_name" : "nation_name",
  "userToken" : this.userData.userToken
});
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getNation = getDataOptions;
    this.getNation.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
  },
  (error) => {}
)
//======================== pinter ======================================
var student = JSON.stringify({
  "table_name" : "pinter",
  "field_id" : "inter_id",
  "field_name" : "inter_name",
  "userToken" : this.userData.userToken
});
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getInter = getDataOptions;
    this.getInter.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
  },
  (error) => {}
)
    this.getResultFlag = [{id: 1,text: 'จับได้'},{id: 3,text: 'อื่นๆ'}];
    // this.getCno = [{id:'1', text: '1'}];
    this.setDefPage();

  }

  setDefPage(){
    this.result = [];
    this.nation_id = '';
    this.inter_id = '';
    this.result.id_card_0 = '';
    this.result.id_card_1 = '';
    this.result.id_card_2 = '';
    this.result.id_card_3 = '';
    this.result.id_card_4 = '';
    this.result.id_card = '';
    this.prov_id= '';
    this.amphur_id= '';
    this.tambon_id= '';
    this.edit_prov_id= '';
    this.edit_amphur_id= '';
    this.edit_tambon_id= '';

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
    console.log('catchDatatab2==>',this.catchDatatab2);
    this.result.c_no = this.catchDatatab2[index].c_no;
    this.result.def_title = this.catchDatatab2[index].def_title?parseInt(this.catchDatatab2[index].def_title):'';
    this.result.def_name = this.catchDatatab2[index].def_name;
    this.nation_id = this.catchDatatab2[index].nation_id;
    this.result.nation_id = this.catchDatatab2[index].nation_name;
    this.inter_id = this.catchDatatab2[index].inter_id;
    this.result.inter_id = this.catchDatatab2[index].inter_name;
    this.result.address = this.catchDatatab2[index].address;
    this.result.addr_no = this.catchDatatab2[index].addr_no;
    this.result.moo = this.catchDatatab2[index].moo;
    this.result.soi = this.catchDatatab2[index].soi;
    this.result.road = this.catchDatatab2[index].road;
    this.edit_prov_id = this.catchDatatab2[index].prov_id;
    this.prov_id = this.catchDatatab2[index].prov_id;
    this.result.prov_id = this.catchDatatab2[index].prov_id;
    this.result.prov_name = this.catchDatatab2[index].prov_name;
    this.edit_amphur_id = this.catchDatatab2[index].amphur_id;
    this.result.amphur_id = this.catchDatatab2[index].amphur_id;
    this.result.amphur_name = this.catchDatatab2[index].amphur_name;
    this.edit_tambon_id = this.catchDatatab2[index].tambon_id;
    this.result.tambon_id = this.catchDatatab2[index].tambon_id;
    this.result.tambon_name = this.catchDatatab2[index].tambon_name;
    this.result.post_code = this.catchDatatab2[index].post_code;
    this.result.result_date = this.catchDatatab2[index].result_date;
    this.result.case_due = this.catchDatatab2[index].case_due;
    this.result.casedate_from = this.catchDatatab2[index].casedate_from;
    this.result.casedate_to = this.catchDatatab2[index].casedate_to;

    if(this.catchDatatab2[0].result_flag){
      this.result.result_flag = this.catchDatatab2[index].result_flag;
    }
    this.result.other_desc = this.catchDatatab2[index].other_desc;

    if(this.result.c_no){
      var CnoObj = this.getCno.filter((x:any) => x.text === this.result.c_no);
      console.log(CnoObj);
      if(CnoObj.length!=0){
        this.result.c_seq = CnoObj[0].id;
      }
      //console.log(this.result.c_no);
      //console.log(this.result.c_seq);
    }

    if(this.catchDatatab2[index].input_result_user_id){
      this.result.input_result_user_id = this.catchDatatab2[index].input_result_user_id;
      this.result.input_result_user = this.catchDatatab2[index].input_result_user;
    }else{
      this.loadOfficer();
    }

    if(this.catchDatatab2[index].id_card){
      this.result.id_card_0 = this.catchDatatab2[index].id_card.substring(0, 1);
      this.result.id_card_1 = this.catchDatatab2[index].id_card.substring(1, 5);
      this.result.id_card_2 = this.catchDatatab2[index].id_card.substring(5, 10);
      this.result.id_card_3 = this.catchDatatab2[index].id_card.substring(10, 12);
      this.result.id_card_4 = this.catchDatatab2[index].id_card.substring(12, 13);
      this.result.idCard = this.catchDatatab2[index].id_card;
    }

    if(this.result.prov_id)
      this.changeProv(this.result.prov_id,'')

  }

  // saveData(objHead:any){

  //   this.caseDataObj2 = objHead;
  //   this.caseDataTmp2 = this.caseDataObj.data;
  //   // this.catchDataobj = this.caseDataObj.noticecatchNo_data;
  //   // this.accuDataTmp = JSON.stringify(this.caseDataObj.accuObj);
  //   // this.alleDataTmp = this.caseDataObj.alle_data;
  //   console.log('ObjHead==>', objHead);
  //   console.log('caseData==>',this.caseDataObj2);
  //   console.log('caseDataTmp==>',this.caseDataTmp2);
  //   // console.log('catchData==>',this.catchDataobj);
  //   // console.log(this.caseDataTmp[0].alle_desc);

  //   //============================== head ==================================================
  //   this.result["run_id"] = objHead.run_id;
  //   this.result["case_type"] = objHead.case_type;
  //   this.result["red_title"] = objHead.red_title;

  // }

  tabChangeSelect(objName:any,objData:any,event:any,type:any){
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      // console.log(objData)
      // console.log(event.target.value)
      // console.log(val)
      // console.log(val[0].fieldIdValue);
      if(val.length!=0){
        this.result[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
      }else{
        this.result[objName] = null;
        this[objName] = null;
      }
    }else{
      this.result[objName] = null;
      this[objName] = null;
    }
  }


  changeProv(province:any,type:any){
    //alert("จังหวัด :"+province)
    if(province){
      this.result.prov_id = province;
      //this.sAmphur.handleClearClick();//this.sTambon.handleClearClick();//this.sSubDisTric.handleClearClick();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "table_name" : "pamphur",
        "field_id" : "amphur_id",
        "field_name" : "amphur_name",
        "condition" : " AND prov_id='"+province+"'",
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getAmphur = getDataOptions;
          console.log(this.getAmphur)
          setTimeout(() => {
            if(this.edit_amphur_id){
              this.amphur_id = this.edit_amphur_id;
              this.result.amphur_id = this.edit_amphur_id;
              this.changeAmphur(this.amphur_id,type);
            }
          }, 100);

        },
        (error) => {}
      )
      if(typeof province=='undefined' || type==1){
        this.sAmphur.clearModel();
        this.sTambon.clearModel();
      }
    }
  }

  changeAmphur(Amphur:any,type:any){
    //alert("อำเภอ :"+Amphur)
    //this.sTambon.handleClearClick();//this.sSubDisTric.handleClearClick();
    if(this.prov_id && Amphur){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "table_name" : "ptambon",
        "field_id" : "tambon_id",
        "field_name" : "tambon_name",
        "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.prov_id+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getTambon = getDataOptions;
          console.log(this.getTambon)
          setTimeout(() => {
            if(this.edit_tambon_id)
              this.tambon_id = this.edit_tambon_id;
              this.result.tambon_id = this.edit_tambon_id;
          }, 100);
        },
        (error) => {}
      )
      if(typeof Amphur=='undefined' || type==1){
        this.sTambon.clearModel();
      }
    }
  }

  changeTambon(Tambon:any,type:any){
     //alert("ตำบล :"+Tambon)
    //this.sTambon.handleClearClick();//this.sSubDisTric.handleClearClick();
    if(this.amphur_id && this.prov_id && Tambon){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "table_name" : "ptambon",
        "field_id" : "tambon_id",
        "field_name" : "tambon_name",
        "field_name2" : "post_code",
        "condition" : " AND tambon_id='"+Tambon+"' AND amphur_id='"+this.amphur_id+"' AND prov_id='"+this.prov_id+"'",
        "userToken" : this.userData.userToken
      });
      //console.log(student);
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getPostNo = getDataOptions;
          console.log(this.getPostNo);
          setTimeout(() => {
            this.result.post_code = this.getPostNo.find((o:any) => o.fieldIdValue === this.tambon_id).fieldNameValue2;
          }, 100);
        },
        (error) => {}
      )
      if(typeof Tambon=='undefined' || type==1){
        this.result.post_code = '';
      }
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

  getcatchDatatab2(value:any){

    if(value){
      var CnoObj = this.getCno.filter((x:any) => x.text === value);
      console.log(CnoObj);
      if(CnoObj.length!=0){
        this.Cnoindex = CnoObj[0].idx;
        this.CnoSeq = CnoObj[0].id;
        console.log('CnoIndex==>',this.Cnoindex);
      }
    }
    // alert(value);
    console.log(this.headData);
    if(this.headData.result == 1){
          var student = JSON.stringify({
          "run_id" : this.headData.data[0].run_id,
          "c_seq" : this.CnoSeq,
          "c_no" : value,
          "userToken" : this.userData.userToken
        });
        console.log(student)

        this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/getNoticeCatchDataTab2', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.data.length){
              this.catchDatatab2 = getDataOptions.data;
              this.loadData(0);
            }else{
              this.catchDatatab2 = [];
            }
          },
          (error) => {}
        );
    }else{
      this.catchDatatab2 = [];
    }
  }

  savecatchDatatab2(){
    // alert(value);
    if(this.result.c_no){
    console.log(this.headData);
    if(this.headData.result == 1){
          var student = JSON.stringify({
          "run_id" : this.headData.data[0].run_id,
          "c_seq" : this.result.c_seq,
          "c_no" : this.result.c_no,
          "def_title" : this.result.def_title,
          "def_name" : this.result.def_name,
          "inter_id" : this.inter_id,
          "inter_name" : this.result.inter_id,
          "nation_id" : this.nation_id,
          "nation_name" : this.result.nation_id,
          "id_card_0" : this.result.id_card_0,
          "id_card_1" : this.result.id_card_1,
          "id_card_2" : this.result.id_card_2,
          "id_card_3" : this.result.id_card_3,
          "id_card_4" : this.result.id_card_4,
          "address" : this.result.address,
          "addr_no" : this.result.addr_no,
          "moo" : this.result.moo,
          "soi" : this.result.soi,
          "road" : this.result.road,
          "prov_id" : this.result.prov_id,
          "amphur_id" : this.amphur_id,
          "tambon_id" : this.tambon_id,
          "post_code" : this.result.post_code,
          "case_due" : this.result.case_due,
          "casedate_from" : this.result.casedate_from,
          "casedate_to" : this.result.casedate_to,
          "result_date" : this.result.result_date,
          // "result_time" : this.result.result_time,
          "result_flag" : this.result.result_flag,
          "other_desc" : this.result.other_desc,
          "input_result_user_id" : this.result.input_result_user_id,
          "input_result_user" : this.result.input_result_user,
          "userToken" : this.userData.userToken
        });
        console.log(student)

        this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/updateNoticeCatchNo', student ).subscribe(
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
                confirmBox.setMessage('จัดเก็บข้อมูลแล้ว');
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
      this.catchDatatab2 = [];
    }
  }else{
    this.getMessage('เลือกเลขที่หมายจับก่อน');
   }
  }

  countDate(event:any){
    if(event==9){
      if(this.result.case_due){
        var date = this.result.casedate_from;
        console.log(this.result.casedate_from);
        var stringDate = this.stringToDate(date);
        console.log(stringDate);
        this.result.casedate_to = stringDate;
        }
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

  stringToDate(dateString) {
    if (!dateString) {
        return new Date();
    }
    var nday,nmonth,nyear;
    var dateList = dateString.split("/");
    var day = parseInt(dateList[0], 10);
    var month = parseInt(dateList[1], 10);
    var year = parseInt(dateList[2], 10);
    var sday = day.toString();
    console.log('Day==>',sday);
    if(sday.length == 1){
      nday = '0' + day;
    }else{
      nday = day;
    }
    if(month.toString.length == 1){
      nmonth = '0' + month;
    }else{
      nmonth = month;
    }
    nyear = year + parseInt(this.result.case_due);
    return (nday + '/' + nmonth + '/' + nyear);
}

setFocus(val:any,type:any){
  // alert(val.target.value);
  if(type==1 && val.target.value.length==1){
    $("input[id='id1']")[0].focus();
  }else if(type==2 && val.target.value.length==4){
    $("input[id='id2']")[0].focus();
  }else if(type==3 && val.target.value.length==5){
    $("input[id='id3']")[0].focus();
  }else if(type==4 && val.target.value.length==2){
    $("input[id='id4']")[0].focus();
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
    if(this.sAmphur)
      this.sAmphur.clearModel();
    if(this.sTambon)
      this.sTambon.clearModel();
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

  getCnoList(){
    var student = JSON.stringify({
      "title" : this.result.title,
      "id" : this.result.id,
      "yy" : this.result.yy,
      "case_type" : this.result.case_type,
      "court_id" : this.result.court_id,
      "userToken" : this.userData.userToken
    });
    console.log(student);
    this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0200/getNoticeCatchDataTab2', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.catchNoData2 = getDataOptions.data;
        for(let i= 0; i < this.catchNoData2.length; i++){
          this.getCno.push({id: this.catchNoData2[i].s_seq,text: this.catchNoData2[i].s_no,idx: i});
        }
      },
      (error) => {}
    )
  }


}
