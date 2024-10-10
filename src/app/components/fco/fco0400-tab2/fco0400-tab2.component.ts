import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter   } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { NgSelectComponent } from '@ng-select/ng-select';
import { AuthService } from 'src/app/auth.service';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { PrintReportService } from 'src/app/services/print-report.service';

@Component({
  selector: 'app-fco0400-tab2',
  templateUrl: './fco0400-tab2.component.html',
  styleUrls: ['./fco0400-tab2.component.css']
})
export class Fco0400Tab2Component implements OnInit {
  title = 'datatables';
  posts:any;
  std_id:any;
  std_prov_name:any;
  delList:any=[];
  search:any;
  masterSelected:boolean;
  checklist:any;
  checklist2:any;
  sessData:any;
  userData:any;
  programName:string;

  run_id:any;
  run_seq:any;
  court_id:any;
  result:any=[];
  getPrintDocno:any;
  getPostType:any;
  getProv:any;
  getAmphur:any;
  getTambon:any;
  getPostNo:any;
  edit_prov_id:any;
  edit_amphur_id:any;
  edit_tambon_id:any;
  modalType:any;
  caseDataValue:any;

  public courtId:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public listFieldSelect:any;

  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild('sProv') sProv : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
  @ViewChild('openbutton2',{static: true}) openbutton2 : ElementRef;
  @ViewChild('closebutton2',{static: true}) closebutton2 : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @Input() set caseData(caseData: any) {
    // console.log(caseData)
    if(caseData){
      this.caseDataValue = [];
      this.caseDataValue=JSON.parse(JSON.stringify(caseData));
      
      this.getData( this.caseDataValue);
      this.ngOnInit();
    }
  }
  @Output() sendUpdateCase = new EventEmitter<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadReqLawyerComponent : boolean = false;
  public loadModalCaseLitComponent : boolean = false;
  public loadPopupListDocComponent : boolean = false;
  
  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
  ){
    this.masterSelected = false
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.setDefPage();
    if(this.caseDataValue)
      this.getData(this.caseDataValue);
    //======================== authen ======================================
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fco0400"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => {}
    )
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
    
    this.getPrintDocno = [{fieldIdValue:1,fieldNameValue: 'พิมพ์เลขหนังสือบนซอง'}, {fieldIdValue:2,fieldNameValue: 'ไม่พิมพ์เลขหนังสือบนซอง'}];
    this.getPostType = [{fieldIdValue:0,fieldNameValue: '----------เลือก---------'},{fieldIdValue:1,fieldNameValue: 'ลงทะเบียน'}, {fieldIdValue:2,fieldNameValue: 'รับรอง'}, {fieldIdValue:3,fieldNameValue: 'EMS'}, {fieldIdValue:4,fieldNameValue: 'รับประกัน'}, {fieldIdValue:5,fieldNameValue: 'พกง'}, {fieldIdValue:6,fieldNameValue: 'ไปรษณีย์ตอบรับ'}];
  }

  setDefPage(){
    // console.log(this.result);
    this.result.post_type=1;
    this.result.pprint_docno=1;
  }

  getData(dataObject:any){
    // console.log(dataObject);
    this.run_id = dataObject.run_id;
    this.run_seq = dataObject.run_seq;
    this.courtId = dataObject.court_id;
    this.result = dataObject;
    if(!this.result.doc_no && typeof this.result.doc_no != 'undefined' )
      this.result.doc_no = this.result.real_doc_title + this.result.real_doc_id + '/' + this.result.real_doc_yy;
    if (this.result.prov_id) {
      this.changeProv(this.result.prov_id, '');
    }else if(this.result.courtsend_running){
      var student = JSON.stringify({
        "courtsend_running" : this.result.courtsend_running,
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiCO/API/CORRESP/fco0400/getAddress', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          if(productsJson.result==1){
            let getAdress = productsJson.data[0];
            
            if(!this.result.post_no)
              this.result.post_no = getAdress.post_no;
            if(!this.result.prov_id)
              this.result.prov_id = getAdress.court_province;
            if(!this.result.amphur_id)
              this.result.amphur_id = getAdress.court_ampheur;
            if (!this.result.tambon_id)
              this.result.tambon_id = getAdress.court_tambon;
            if (!this.result.prov_name)
              this.result.prov_name = getAdress.prov_name;
            if (!this.result.amphur_name)
              this.result.amphur_name = getAdress.amphur_name;
            if (!this.result.tambon_name)
              this.result.tambon_name = getAdress.tambon_name;
            if (!this.result.address)
              this.result.address = getAdress.court_address;
            if (!this.result.addr_no)
              this.result.addr_no = getAdress.addr_no;
            if (!this.result.moo)
              this.result.moo = getAdress.moo;
            if (!this.result.soi)
              this.result.soi = getAdress.soi;
            if (!this.result.road)
              this.result.road = getAdress.road;
            
            if (this.result.prov_id) {
              this.changeProv(getAdress.court_province, '');
            }
            else {
              this.sAmphur.clearModel();
              this.sTambon.clearModel();
            }
          }
      });
    }else {
      this.sAmphur.clearModel();
      this.sTambon.clearModel();
    }
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });
  }

  ngAfterViewInit(): void {
  this.dtTrigger.next(null);
  }
    
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  clickOpenMyModalComponent(type:any){
    if(type == 5 && !this.result.run_id){
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
      this.modalType=type;
      this.openbutton2.nativeElement.click();
    }
  }

  loadMyModalComponent(){
    if(this.modalType == 1){//เลขที่หนังสือส่ง
      $(".modal-backdrop").remove();
      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadReqLawyerComponent = false;
      this.loadModalCaseLitComponent = false;
      this.loadPopupListDocComponent = true;
      $("#exampleModal-2").find(".modal-content").css("width","500px");
      $("#exampleModal-2").find(".modal-body").css("height","auto");
      $("#exampleModal-2").css({"background":"rgba(51,32,0,.4)"});
    }else if(this.modalType == 2){
      $(".modal-backdrop").remove();
      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadReqLawyerComponent = true;
      this.loadModalCaseLitComponent = false;
      this.loadPopupListDocComponent = false;
      
      $("#exampleModal-2").find(".modal-content").css("width","950px");
      $("#exampleModal-2").find(".modal-body").css("height","auto");
      $("#exampleModal-2").css({"background":"rgba(51,32,0,.4)"});

    }else if(this.modalType == 3 || this.modalType == 4){
      if(this.modalType == 3){
        var student = JSON.stringify({
          "table_name" : "pad_judge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "userToken" : this.userData.userToken});
        this.listTable='pad_judge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldName2='';
        this.listFieldCond="";
      }else if(this.modalType == 4){
        var student = JSON.stringify({
          "table_name" : "pconciliate",
          "field_id" : "conciliate_id",
          "field_name" : "conciliate_name",
          "userToken" : this.userData.userToken});
        this.listTable='pconciliate';
        this.listFieldId='conciliate_id';
        this.listFieldName='conciliate_name';
        this.listFieldName2='';
        this.listFieldCond="";
      }
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;
          $(".modal-backdrop").remove();
          this.loadComponent = true;
          this.loadModalComponent = false;
          this.loadReqLawyerComponent = false;
          this.loadModalCaseLitComponent = false;
          this.loadPopupListDocComponent = false;
          $("#exampleModal-2").find(".modal-content").css("width","650px");
          $("#exampleModal-2").find(".modal-body").css("height","auto");
          $("#exampleModal-2").css({"background":"rgba(51,32,0,.4)"});
        },
        (error) => {}
      )
    }else if(this.modalType == 5){
      if(this.result.run_id){
        this.listTable='2';
        $(".modal-backdrop").remove();
        this.loadComponent = false;
        this.loadModalComponent = false;
        this.loadReqLawyerComponent = false;
        this.loadModalCaseLitComponent = true;
        this.loadPopupListDocComponent = false;
        $("#exampleModal-2").find(".modal-content").css("width","auto");
        $("#exampleModal-2").find(".modal-body").css("height","auto");
        $("#exampleModal-2").css({"background":"rgba(51,32,0,.4)"});
      }
    }else if(this.modalType == 'deleteRow'){
      $(".modal-backdrop").remove();
      this.loadComponent = false;
      this.loadModalComponent = true;
      this.loadReqLawyerComponent = false;
      this.loadModalCaseLitComponent = false;
      this.loadPopupListDocComponent = false;
      $("#exampleModal-2").find(".modal-content").css("width","650px");
      $("#exampleModal-2").find(".modal-body").css("height","auto");
      $("#exampleModal-2").css({"background":"rgba(51,32,0,.4)"});
    }
  }

  receiveFuncListData(event:any){
    // console.log(event);
    if(this.modalType == 3 || this.modalType == 4){
      this.result.docto_id = event.fieldIdValue;
      this.result.docto_desc = event.fieldNameValue;
    }
    this.closebutton2.nativeElement.click();
  }

  receiveReqLawyeData(event:any){//modalType 2
    // console.log(event);
    this.result.docto_id = event.lawyer_id;
    this.result.docto_desc = event.lawyer_name;

    this.assignAdress(event);
    
    this.closebutton2.nativeElement.click();
  }

  receiveFuncModalListData(event:any){//modalType 5
    console.log(event);
    this.result.docto_id = event.seq;
    this.result.docto_desc = event.lit_name;

    this.assignAdress(event);

    this.closebutton2.nativeElement.click();
  }

  receiveFuncListDocData(event:any){//modalType 1
    // console.log(event);
    this.result.doc_no = event.real_doc_no;
    this.closebutton2.nativeElement.click();
  }

  assignAdress(event:any){
    this.result.addr_no = event.addr_no;
    this.result.moo = event.moo;
    this.result.soi = event.soi;
    this.result.road = event.road;
    this.result.prov_id = event.prov_id;
    this.result.prov_name = event.prov_name;
    this.result.amphur_id = event.amphur_id;
    this.result.amphur_name = event.amphur_name;
    this.result.tambon_id = event.tambon_id;
    this.result.tambon_name = event.tambon_name;
    this.result.post_no = event.post_no;	
  }

  closeModal(){
    this.loadComponent = false;
    this.loadModalComponent = false;
    this.loadReqLawyerComponent = false;
    this.loadModalCaseLitComponent = false;
    this.loadPopupListDocComponent = false;

    
  }

  submitForm() {//จัดเก็บข้อมูล
    this.sendUpdateCase.emit({'onUpdateCase' : false});
    if(this.result.run_seq){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();

      this.result['real_doc_id'] = this.result.real_doc_id ? this.result.real_doc_id : 0;
      this.result['court_id'] = this.result.court_id ? this.result.court_id.toString() : '';
      this.result['in_out'] = 2;
      this.result['userToken'] = this.userData.userToken;
      var tmpData = ($.extend({}, this.result))
      tmpData["case_data"] = [];

      // console.log(tmpData)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiCO/API/CORRESP/fco0400/saveDoc', tmpData ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==0){
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                this.sendUpdateCase.emit({'onUpdateCase' : false});
                subscription.unsubscribe();
              });
            }else{
              this.SpinnerService.hide();
              confirmBox.setMessage('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                this.sendUpdateCase.emit({'onUpdateCase' : true});
                subscription.unsubscribe();
              });
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  submitModalForm(){

  }

  printReport(size:any){
    var rptName = 'rco0500';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "prun_doc_title" : this.result.run_doc_title,
      "prun_doc_id" : this.result.run_doc_id,
      "prun_doc_yy" : this.result.run_doc_yy,
      "prun_seq" : this.result.run_seq,
      "psize" : size,
      "pprint_docno" : this.result.pprint_docno
    });
    console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  printReport2(flag:any){
    var rptName = 'rco0600';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "pflag" : flag,
      "prun_seq" : this.result.run_seq,
      "ppage" : flag
    });
    console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  printReport3(flag:any){
    var rptName = 'rco0610';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "pflag" : flag,
      "prun_seq" : this.result.run_seq,
      "ppage" : flag
    });
    console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  ClearAll(){
    window.location.reload();
  }

  changeProv(province:any,type:any){
    this.result.prov_id=province;
    var student = JSON.stringify({
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "condition" : " AND prov_id='"+province+"'",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAmphur = getDataOptions;
        setTimeout(() => {
          if(this.result.amphur_id){
            this.changeAmphur(this.result.amphur_id,type);
          }
        }, 100);
      },
      (error) => {}
    )
    if(typeof province=='undefined'){
      // if(typeof province=='undefined' || type==1){
      this.sAmphur.clearModel();
      this.sTambon.clearModel();
      this.result.prov_id = "";
      this.result.amphur_id = "";
      this.result.tambon_id = "";
    }
  }
    
  changeAmphur(Amphur:any,type:any){
    this.result.amphur_id=Amphur;
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.result.prov_id+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTambon = getDataOptions;
      },
      (error) => {}
    )
    if(typeof Amphur=='undefined'){
      this.sTambon.clearModel();
      this.result.amphur_id="";
      this.result.tambon_id="";
    }
  }
    
  changeTambon(Tambon:any,type:any){
    this.result.tambon_id=Tambon;
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "field_name2" : "post_code",
      "condition" : " AND tambon_id='"+Tambon+"' AND amphur_id='"+this.result.amphur_id+"' AND prov_id='"+this.result.prov_id+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student);
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getPostNo = getDataOptions;
          // console.log(this.getPostNo);

        if(this.result.tambon_id){
            setTimeout(() => {
            this.result.post_no = this.getPostNo[0].fieldNameValue2;
          }, 100);
        }
      },
      (error) => {}
    )
    // if(typeof Tambon=='undefined' || type==1){
    if(typeof Tambon=='undefined'){
      this.result.post_no = "";
    }
  }

}
