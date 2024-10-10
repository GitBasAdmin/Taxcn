import { Component, OnInit , ViewChild ,Input,Output,EventEmitter, ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList,Renderer2   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map , } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fgu0195,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fgu0195.component.html',
  styleUrls: ['./fgu0195.component.css']
})


export class Fgu0195Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';

  posts:any;
  delList:any=[];
  result:any=[];
  search:any;
  procData: any = [];
  fileToUpload0: File = null;
  fileToUpload1: File = null;
  fileToUpload2: File = null;
  attach_file:any = []; s_file:any = [];
  del_file:any = [];
  masterSelected:boolean;
  masterSelected2:boolean;
  checklist:any;
  checklist2:any;
  checkedList:any;
  delValue:any;
  delValue2:any;
  sessData:any;
  userData:any;
  absentDate1:any;
  absentDate2:any;
  myExtObject:any;
  programName:string;
  guarantor_id:any;
  guar_name:any;
  license_no:any;
  addr_no:any;
  address:any;
  moo:any;
  soi:any;
  road:any;
  tambon_id:any;
  amphur_id:any;
  prov_id:any;
  tel:any;
  post_no:any;
  id_card:any;
  age:any;
  email:any;
  mobile_no:any;
  book_account:any;
  bank_id:any;
  bank_branch:any;
  expire_date:any;
  remark:any;
  conc_type:any;
  con_type:any;
  getConcType:any;
  getConType:any;
  getBank:any;
  hid_guarman_item:any;
  hid_asset_item:any;
  birth_date:any;
  cancel_date:any;
  due_date:any;
  exp_date:any;
  getProv:any;
  getInter:any;
  getNation:any;
  getGuarantor:any;
  inter_id:any;
  nation_id:any;
  occ_id:any;
  order_id:any;
  dataHead:any;
  modalType:any;
  getAsset:any;
  AssetItemObj:any;
  GuarantorObj:any = [];
  GuarantorDataObj:any = [];
  getAmphur:any;edit_amphur_id:any;
  getTambon:any;edit_tambon_id:any;
  getPostNo:any;
  getOrder:any;
  getOccu:any;
  getTitle:any;
  GuarmanItemObj:any;
  run_id:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldName2:any;
  public listFieldCond:any;


  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  // @ViewChild('guarantor_id',{static: true}) guarantor_id : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
  public loadModalComponent: boolean = false;
  public loadModalConfComponent : boolean = false;
  public loadFgu0195Component : boolean = false;
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100
    console.log(getDataHead);
    this.dataHead = getDataHead;
  }

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
  ){
    this.masterSelected = false
    // this.masterSelected2 = false
  }

  ngOnInit(): void {

    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy : true
    };

    this.activatedRoute.queryParams.subscribe(params => {

      this.result.run_id = params['run_id'];
      this.run_id = params['run_id'];
      this.result.guar_running = params['guar_running'];
      this.result.guarman_item = params['guarman_item'];
      this.result.asset_type = params['asset_type'];
      this.result.asset_item = params['asset_item'];
     });

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    if(!this.result.asset_type){
      this.result.asset_type = 9;
    }
    this.guarRantorData();

    // const confirmBox = new ConfirmBoxInitializer();
    // confirmBox.setTitle('ข้อความแจ้งเตือน');
    // var student = JSON.stringify({
    //   "guar_running": this.result.guar_running,
    //   // "guar_running" : 4691,
    //   "userToken" : this.userData.userToken
    // });
    //   console.log('getGuarantorData==>',student);
    //   this.SpinnerService.show();
    //   this.http.disableLoading().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0195/getGuarantorData', student).subscribe(
    //     (response) =>{
    //       let productsJson : any = JSON.parse(JSON.stringify(response));
    //       console.log(productsJson)
    //       this.posts = productsJson.data;
    //       console.log(this.posts);
    //       if(productsJson.result==1){
    //         this.checklist = this.posts;
    //         // this.checklist2 = this.posts;
    //         // if(productsJson.data.length)
    //         //   this.posts.forEach((x : any ) => x.edit0110 = false);
    //         // this.rerender();
    //       }else{
    //         confirmBox.setMessage(productsJson.error);
    //         confirmBox.setButtonLabels('ตกลง');
    //         confirmBox.setConfig({
    //             layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //         });
    //         const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //           if (resp.success==true){}
    //           subscription.unsubscribe();
    //         });
    //       }
    //       this.SpinnerService.hide();
    //   },
    //   (error) => {}
    // );

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fgu0195"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          console.log(getDataAuthen)
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
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTitle = getDataOptions;
        // this.getOrder.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        //console.log(this.getJudge)
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
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getProv = getDataOptions;
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
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
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
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getInter = getDataOptions;
    this.getInter.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
  },
  (error) => {}
)
//======================== poccupation ======================================
var student = JSON.stringify({
  "table_name" : "poccupation",
  "field_id" : "occ_id",
  "field_name" : "occ_desc",
  "userToken" : this.userData.userToken
});
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getOccu = getDataOptions;
    this.getOccu.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
  },
  (error) => {}
)
this.getAssetId();
if(this.result.guarman_item){
  this.getAssetItem();
}
  }

  getGuarantorId(){
    var student = JSON.stringify({
      "guar_running": this.result.guar_running ? this.result.guar_running : '',
    //  "guar_running" : 4691,
     "userToken" : this.userData.userToken
    });
    console.log('getGuarantorId==>',student);
    this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0140/runItem', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getGuarantor = getDataOptions;
        console.log(this.getGuarantor)
        this.result.guarman_item = this.getGuarantor.guarman_item;
        //this.result.guarantor = this.getGuarantor.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
  }

  getGuarmanItem(){
    var student = JSON.stringify({
     "guar_running": this.result.guar_running ? this.result.guar_running : '',
    //  "guar_running" : 4691,
     "guarman_item" : this.result.guarman_item? this.result.guarman_item : '',
     "userToken" : this.userData.userToken
    });
    console.log('getGuarmanItem==>',student);
    this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0140/getGuarantorData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.GuarmanItemObj = getDataOptions.data;
        console.log('GuarmanItemObj==>',this.GuarmanItemObj)
        this.result.guarman_item = this.GuarmanItemObj[0].guarman_item;
        console.log('GuarmanItem==>>',this.result.guarman_item)
        this.AssignData(this.GuarmanItemObj);
        //this.result.guarantor = this.getGuarantor.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
  }

  guarRantorData(){
    // alert('guarRantorData');
     var student = JSON.stringify({
       "guar_running": this.result.guar_running,
       "userToken" : this.userData.userToken
     });
     console.log(student)
     let promise = new Promise((resolve, reject) => {
       this.http.disableLoading().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/getGuarantorData', student).subscribe(
       (response) =>{
         let getDataOptions : any = JSON.parse(JSON.stringify(response));
         console.log('guarRantorData==>',getDataOptions);
         if(getDataOptions.result==1){
            this.GuarantorObj = getDataOptions;
            this.GuarantorDataObj = [];
            this.GuarantorDataObj = getDataOptions.data;
            console.log('GuarantorObj==>',this.GuarantorObj);
            console.log('GuarantorDataObj==>',this.GuarantorDataObj);
            this.rerender();
            this.result.guarman_item = this.GuarantorDataObj[0].guarman_item;
            this.result.guar_name = this.GuarantorDataObj[0].guar_name;
         }else{
          this.GuarantorDataObj = [];
         }
       },
       (error) => {}
     )
     });
     return promise;
 }

  getAssetId(){
    var student = JSON.stringify({
      "guar_running": this.result.guar_running ? this.result.guar_running : '',
      "guarman_item" : this.result.guarman_item ? this.result.guarman_item : 1,
      "userToken" : this.userData.userToken
    });
    console.log('getAssetId==>',student);
    this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/ASSET/runAssetItem', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAsset = getDataOptions;
        console.log(this.getAsset)
        // this.result.guarman_item = this.getAsset.guarman_item;
        //this.result.guarantor = this.getAsset.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
  }

  getAssetItem(){
    var student = JSON.stringify({
     "guar_running": this.result.guar_running ? this.result.guar_running : '',
     "guarman_item" : this.result.guarman_item? this.result.guarman_item : 1,
     "asset_item" : this.result.asset_item,
     "userToken" : this.userData.userToken
    });
    console.log('getAssetItem==>',student);
    this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/ASSET/getAssetData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.AssetItemObj = getDataOptions.data;
        console.log('AssetItemObj==>',this.AssetItemObj)
        this.result.guarman_item = this.AssetItemObj[0].guarman_item;
        console.log('GuarmanItem==>>',this.result.guarman_item)
        this.AssignData(this.AssetItemObj);
        //this.result.guarantor = this.getAsset.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
  }

  tabChangeGuar(objName:any,objData:any,event:any,type:any){
    // alert(event.target.value);
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.guarman_item === parseInt(event.target.value)) ;
      }else{
          var val = objData.filter((x:any) => x.guar_name === event);
      }
      console.log(objData)
      //console.log(event.target.value)
      console.log(val);
      if(val.length!=0){
        this.result.guarman_item = val[0].guarman_item;
        this.result.guar_name = val[0].guar_name;
      }else{
        this.result.guarman_item = '';
        this.result.guar_name = '';
       }
    }else{
      this.result.guarman_item = '';
      this.result.guar_name = '';
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
  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //   // Destroy the table first
  //   dtInstance.destroy();
  //   // Call the dtTrigger to rerender again
  //   this.dtTrigger.next(null);
  //     });}

 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
    }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

  setFocus(name:any) {
    const ele = name;
    if (ele) {
      ele.focus();
    }
  }

  setFocusId(val:any,type:any){
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

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0110 = this.masterSelected;
      }

    // for (var i = 0; i < this.checklist2.length; i++) {
    //   this.checklist2[i].editNoticeId = this.masterSelected2;
    //     }
    //this.getCheckedItemList();

  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
}

  goToPage(toPage:any){
    let winURL = window.location.href;
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+toPage;
    //alert(winURL);
    window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1800,height=600");
    //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  }

  loadMyModalComponent(){
    // alert(this.modalType);
    $(".modal-backdrop").remove();
    if(this.modalType==1){
      $("#exampleModaltab1").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
          "table_name" : "pcase_litigant",
          "field_id" : "seq",
          "field_name" : "name",
          "field_name2" : "lit_type",
          "condition" : " AND run_id = " + this.run_id,
          "userToken" : this.userData.userToken
        });
      this.listTable='pcase_litigant';
      this.listFieldId='seq';
      this.listFieldName='name';
      this.listFieldName2='lit_type';
      this.listFieldCond="";
      }else if(this.modalType==2){
        $("#exampleModaltab1").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
            "table_name" : "pcase_litigant",
            "field_id" : "seq",
            "field_name" : "name",
            "field_name2" : "lit_type",
            "condition" : " AND lit_type = " + this.result.def_type + " AND run_id = " + this.run_id,
            "userToken" : this.userData.userToken
          });
        this.listTable='pcase_litigant';
        this.listFieldId='seq';
        this.listFieldName='name';
        this.listFieldName2='lit_type';
        this.listFieldCond="";
    }else if(this.modalType==3){
        $("#exampleModaltab1").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
            "table_name" : "pguarantor_detail",
            "field_id" : "guarantor_id",
            "field_name" : "guar_name",
            "field_name2" : "guar_title",
            "condition" : " AND pro_flag = 1",
            "userToken" : this.userData.userToken
          });
        this.listTable='pguarantor_detail';
        this.listFieldId='guarantor_id';
        this.listFieldName= 'guar_name';
        this.listFieldName2='guar_title';
        this.listFieldCond=" AND pro_flag = 1";
      }else if(this.modalType==4){
        $("#exampleModaltab1").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
            "table_name" : "pbank",
            "field_id" : "bank_id",
            "field_name" : "bank_name",
            "userToken" : this.userData.userToken
          });
        this.listTable='pbank';
        this.listFieldId='bank_id';
        this.listFieldName= 'bank_name';
        this.listFieldName2='';
        this.listFieldCond="";
    }else if(this.modalType==20){
        this.loadModalComponent = false;
        this.loadComponent = false;
        this.loadModalConfComponent = true;
        $("#exampleModaltab1").find(".modal-content").css("width","650px");
        $("#exampleModaltab1").find(".modal-body").css("height","auto");
        $("#exampleModaltab1").css({"background":"rgba(51,32,0,.4)"});
    }
    if(this.modalType==1 || this.modalType==2 || this.modalType==3 || this.modalType==4){
      console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
        (response) =>{
          // alert('xxxxxx')
          console.log(response)
          this.list = response;
            this.loadModalComponent = false;
            this.loadModalConfComponent = false;
            this.loadComponent = true;
        },
        (error) => {}
      )
      $("#exampleModaltab1").find(".modal-body").css("height","auto");
      $("#exampleModaltab1").css({"background":"rgba(51,32,0,.4)"});

    }

  }
  /*
  getlist(index:any){
    alert(index)
    this.delList[index]['edit_guarman_item']  =  this.posts[index]['edit_guarman_item']
    console.log(this.delList);
  }*/
  tabChangeSelect(objName:any,objData:any,event:any,type:any){
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      console.log(objData)
      //console.log(event.target.value)
      //console.log(val)
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


  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0110 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0110 = false;
    }
    // for (var i = 0; i < this.checklist2.length; i++) {
    //   this.checklist2[i].editNoticeId = false;
    // }
    this.masterSelected = false;
    // this.masterSelected2 = false;
    $("body").find("input[name='delValue']").val('');
    // $("body").find("input[name='delValue2']").val('');
  }

  ClearAll(){
    this.result = [];
    // window.location.reload();
    // this.getAssetId();
  }

  AddNew(){
    this.hid_asset_item = '';
    this.hid_guarman_item = '';
    this.result.edit_guarman_item = '';
    this.result.edit_asset_item = '';
    this.result.asset_amt = '';
    this.result.remark = '';
  }


  getCheckedItemList(){
    var del = "";
    // var del2 = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function(e,i){
        if($(this).prop("checked")==true){
          if(del!='')
            del+=','
          del+=$(this).val();
          alert(del);
          // if(del2!='')
          //   del2+=','
          // del2+=$(this).closest("td").find("input[id^='hid_notice_id']").val();
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
        // $("body").find("input[name='delValue2']").val(del2);
       })
    }, 100);

  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.listTable=='pguarantor_detail'){
      // this.result.guarman_item = event.fieldIdValue;
      this.result.guarman_name = event.fieldNameValue;
    }else if(this.listTable =='pbank'){
      this.result.gbank_id = event.fieldIdValue;
      this.result.bank_name = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }
//   receiveFuncListData(event:any){
//     console.log(event)
//     if(this.listTable=='pjudge'){
//       this.guarantor_id=event.fieldIdValue;
//       this.judge_name=event.fieldNameValue;
//     }else{
//       this.absent_type=event.fieldIdValue;
//       this.absent_desc=event.fieldNameValue;
//     }

//     this.closebutton.nativeElement.click();
// }

  // loadMyModalComponent(){
  //   this.loadComponent = false;
  //   this.loadModalComponent = true;
  //   $("#exampleModal").find(".modal-body").css("height","100px");
  // }
  /*uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
  }*/

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.guarman_item){
      confirmBox.setMessage('กรุณาระบุนายประกัน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='guarman_item']")[0].focus();
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.asset_amt){
      confirmBox.setMessage('กรุณาระบุจำนวนเงินประกัน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='asset_amt']")[0].focus();
        }
        subscription.unsubscribe();
      });

    // }else if(!this.result.tel){
    //   confirmBox.setMessage('กรุณาระบุหมายเลขโทรศัพท์');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success==true){
    //       //this.SpinnerService.hide();
    //       $("input[name='tel']")[0].focus();
    //     }
    //     subscription.unsubscribe();
    //   });
    }else{
      var formData = new FormData();
      this.result['userToken'] = this.userData.userToken;
      console.log(this.result);
      //formData.append('file', this.fileToUpload1);
      formData.append('data', JSON.stringify($.extend({}, this.result)));

       console.log('FormData==>',formData);
      this.SpinnerService.show();
      if(this.hid_guarman_item){
        this.http.disableHeader().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/ASSET/saveAssetData', formData ).subscribe(
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
                if (resp.success==true){
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
            }else{
              this.SpinnerService.hide();
              confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  // $("button[type='reset']")[0].click();
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              // this.ngOnInit();
              //this.form.reset();
               // $("button[type='reset']")[0].click();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }else{
        this.http.disableHeader().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/ASSET/saveAssetData', formData ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            console.log(alertMessage)
            if(alertMessage.result==0){
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
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
              this.SpinnerService.hide();
              confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  // $("button[type='reset']")[0].click();
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              // this.ngOnInit();
              //this.form.reset();
               // $("button[type='reset']")[0].click();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    }

  }


  editData(index:any){
    console.log(this.posts[index])
    this.SpinnerService.show();
      this.result.guarman_item = this.posts[index]['guarman_item'];
      this.result.accu = this.posts[index]['accu'];
      // this.hid_guarantor_id  = this.posts[index]['edit_guarman_item'];
      this.result.guarantor_id = this.posts[index]['guarantor_id'];
      this.result.guar_title = this.posts[index]['guar_title'];
      this.result.guar_name = this.posts[index]['guar_name'];
      this.result.co_guar = this.posts[index]['co_guar'];
      this.result.guar_asset = this.posts[index]['guar_asset'];
      this.result.id_card = this.posts[index]['id_card'];
      this.inter_id = this.posts[index]['inter_id'];
      this.nation_id = this.posts[index]['nation_id'];
      this.occ_id = this.posts[index]['occ_id'];
      if((this.inter_id == '0') || (!this.inter_id)){
        this.inter_id = '';
        this.result.inter_id = '';
      }else{
        this.result.inter_id = this.posts[index]['inter_id'].toString();
      }
      if((this.nation_id == '0') || (!this.nation_id)){
        this.nation_id = '';
        this.result.nation_id = '';
      }else{
        this.result.nation_id = this.posts[index]['nation_id'].toString();
      }
      if((this.occ_id == '0') || (!this.occ_id)){
        this.occ_id = '';
        this.result.occ_id = '';
      }else{
        this.result.occ_id = this.posts[index]['occ_id'].toString();
      }
      this.result.address = this.posts[index]['address'];
      this.result.addr = this.posts[index]['addr'];
      this.result.moo = this.posts[index]['moo'];
      this.result.soi = this.posts[index]['soi'];
      this.result.road = this.posts[index]['road'];
      // this.tambon_id = this.posts[index]['tambon_id'];
      // this.amphur_id = this.posts[index]['amphur_id'];
      this.prov_id = this.posts[index]['prov_id'];
      if(this.prov_id)
      this.changeProv(this.prov_id,'');
       else{
        this.sAmphur.clearModel();
        this.sTambon.clearModel();
        }
      this.edit_amphur_id = this.posts[index]['amphur_id'];
      this.edit_tambon_id = this.posts[index]['tambon_id'];
      this.result.tel = this.posts[index]['tel'];
      this.result.email = this.posts[index]['email'];
      this.result.post_code = this.posts[index]['post_code'];
      this.result.guar_b_date = this.posts[index]['guar_b_date'];
      this.result.guar_age = this.posts[index]['guar_age'];
      this.result.guar_relation = this.posts[index]['guar_relation'];

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  AssignData(obj:any){
    console.log(obj);
    var objData = obj;
      this.hid_guarman_item  = objData[0].edit_guarman_item;
      this.hid_asset_item  = objData[0].edit_asset_item;
      this.result = objData[0];
      console.log('Result==>',this.result);

     setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.guarantor_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var student = JSON.stringify({
        "guarantor_id" : this.guarantor_id,
        "guar_name" : this.guar_name,
        "license_no" : this.license_no,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0195/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit0110 = false);
              this.rerender();
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
            this.SpinnerService.hide();

        },
        (error) => {this.SpinnerService.hide();}
      );

  }


  confirmBox() {
    //this.delValue = $("body").find("input[name='delValue']").val();
    // this.delValue2 = $("body").find("input[name='delValue2']").val();
    // alert(this.delValue2);
    var isChecked = this.posts.every(function(item:any) {
      return item.edit0110 == false;
    })

    const confirmBox = new ConfirmBoxInitializer();
    if(isChecked==true){
      confirmBox.setTitle('ไม่พบเงื่อนไข?');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการลบ');
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

  goToLink(url: string){
    window.open(url, "_blank");
  }


  // loadMyChildComponent(){
  //   this.loadComponent = true;
  // }

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
                  var dataDel = [],dataTmp=[];
                  var bar = new Promise((resolve, reject) => {
                    this.posts.forEach((ele, index, array) => {
                          if(ele.edit0190 == true){
                            dataTmp.push(this.posts[index]);
                          }
                      });
                  });
                  if(bar){
                      //console.log(dataTmp)
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type','application/json');
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                   console.log(data)
                   this.http.post('/'+this.userData.appName+'ApiGU/GUARANTEE/ASSET/deleteAssetData', data , {headers:headers}).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();

                      }else{

                        this.closebutton.nativeElement.click();
                        $("button[type='reset']")[0].click();
                        this.getData();

                      }
                    },
                    (error) => {this.SpinnerService.hide();}
                  )
                  }
                }
                subscription.unsubscribe();
              });
    }
  }


  printReport(val:any,guar_running:any){
    var rptName = 'rgu0195';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "pflag_cancel" : val,
     });

    this.printReportService.printReport(rptName,paramData);
  }

  loadTableComponent(val:any){
    this.loadModalComponent = false;
    this.loadComponent = true;
    $("#exampleModal").find(".modal-body").css("height","auto");
 }

changeProv(province:any,type:any){
  //alert("จังหวัด :"+province)
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
      setTimeout(() => {
        if(this.edit_amphur_id)
          this.amphur_id = this.edit_amphur_id;
        if(this.edit_amphur_id){
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

changeAmphur(Amphur:any,type:any){
  //alert("อำเภอ :"+Amphur)
  //this.sTambon.handleClearClick();//this.sSubDisTric.handleClearClick();
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type','application/json');
  var student = JSON.stringify({
    "table_name" : "ptambon",
    "field_id" : "tambon_id",
    "field_name" : "tambon_name",
    "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.prov_id+"'",
    "userToken" : this.userData.userToken
  });
  //console.log(student)
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getTambon = getDataOptions;
      setTimeout(() => {
        if(this.edit_tambon_id)
          this.tambon_id = this.edit_tambon_id;
      }, 100);
    },
    (error) => {}
  )
  if(typeof Amphur=='undefined' || type==1){
    this.sTambon.clearModel();
  }
}

changeTambon(Tambon:any,type:any){
   //alert("ตำบล :"+Tambon)
  //this.sTambon.handleClearClick();//this.sSubDisTric.handleClearClick();
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

closeWin(){
  // if(this.run_id)
  //   window.opener.myExtObject.openerReloadRunId(this.run_id);
  // else
  //   window.opener.myExtObject.openerReloadRunId(0);
  window.opener.document.getElementById('reloadAsset').click();
  window.close();
}


// closeModal(){
//   window.close();
//   // this.loadModalAlertComponent = false;
// }
closeModal(){
  this.loadComponent = false;
  this.loadModalComponent = false;
  this.loadModalConfComponent = false;
}

  getData(){
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      this.http.get('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0195?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0110 = false);
            this.rerender();
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
          this.SpinnerService.hide();
      });
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
    console.log(date)
  }

  clickOpenFile1() {
    var pdf_flag1 = this.result.attach_file1.search('.pdf');
    var pdf_flag2 = this.result.attach_file1.search('.PDF');
    // console.log(pdf_flag1, pdf_flag2);
    let winURL = window.location.host;
    if ((pdf_flag1) > 0 || (pdf_flag2 > 0))
      winURL = winURL + '/'+this.userData.appName+"ApiCO/API/CORRESP/fco0300/opendDocPdf";
    else
      winURL = winURL + '/'+this.userData.appName+"ApiCO/API/CORRESP/fco0300/openDocAttach";

    myExtObject.OpenWindowMax("http://" + winURL + '?run_seq=' + this.result.run_seq + "&file_name=" + this.result.attach_file1+ "&doc_word=1");
  }

  clickOpenFile(index:any){

    var name = this.attach_file[index].attach_file;
    let winURL = window.location.host;

    if(this.attach_file[index].pdf_flag)
      winURL = winURL+'/'+this.userData.appName+"ApiKN/API/KEEPN/fkn0730/openPdf";
    else
      winURL = winURL+'/'+this.userData.appName+"ApiKN/API/KEEPN/fkn0730/openAttach";
    myExtObject.OpenWindowMax("http://"+winURL+'?mail_no='+this.result.mail_no+"&file_name="+name);
  }

  counter(i: number) {
    return new Array(i);
  }

  onFileChange(even:any,Name:any, index:any) {
    this[Name] =null;

    if(even.target.files.length){
      this[Name] = even.target.files[0];
      var fileName = even.target.files[0].name;
      $(even.target).parent('div').find('label').html(fileName);
    }else{
      this[Name] =  null;
      $(even.target).parent('div').find('label').html('');
    }
  }

}







