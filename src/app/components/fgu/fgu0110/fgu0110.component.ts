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
  selector: 'app-fgu0110,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fgu0110.component.html',
  styleUrls: ['./fgu0110.component.css']
})


export class Fgu0110Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';

  posts:any;
  delList:any=[];
  result:any=[];
  search:any;
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
  public loadFgu0110Component : boolean = false;
  // @Input() set guarRunning(guarRunning: any) {//รับ guar_running จาก fgu0100_tab2
  //   console.log(guarRunning)
  //   if(typeof guarRunning !='undefined'){
  //     this.result.guar_running = guarRunning;
  //   }
  // }
  // @Input() set runId(runId: any) {//รับ runId จาก fgu0100_tab2
  //   console.log(runId)
  //   if(typeof runId !='undefined'){
  //     this.result.run_id = runId;
  //   }
  // }
  // @Input() set guarmanItem(guarmanItem: any) {//รับ guarmanItem จาก fgu0100_tab2
  //   console.log(guarmanItem)
  //   if(typeof guarmanItem !='undefined'){
  //     this.result.guarman_Item = guarmanItem;
  //   }
  // }
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
   });

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "guar_running": this.result.guar_running,
      // "guar_running" : 4691,
      "userToken" : this.userData.userToken
    });
      console.log('getGuarantorData==>',student);
      this.SpinnerService.show();
      this.http.disableLoading().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0110/getGuarantorData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            // if(productsJson.data.length)
            //   this.posts.forEach((x : any ) => x.edit0110 = false);
            // this.rerender();
          // }else{
          //   confirmBox.setMessage(productsJson.error);
          //   confirmBox.setButtonLabels('ตกลง');
          //   confirmBox.setConfig({
          //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          //   });
          //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          //     if (resp.success==true){}
          //     subscription.unsubscribe();
          //   });
          }
          this.SpinnerService.hide();
      },
      (error) => {}
    );

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fgu0110"
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
if(this.result.guarman_item==0){
   this.getGuarantorId();
}
if(this.result.guarman_item){
  this.getGuarmanItem();
  // setTimeout(() => {
  //     if(this.GuarmanItemObj[0]){
  //         alert('55555')
  //         this.AssignData(this.GuarmanItemObj);
  //       }
  // }, 500);
}
  }

  getGuarantorId(){
    var student = JSON.stringify({
      "guar_running": this.result.guar_running ? this.result.guar_running : '',
    //  "guar_running" : 4691,
     "userToken" : this.userData.userToken
    });
    console.log('getGuarantorId==>',student);
    this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0110/runItem', student).subscribe(
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
    this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0110/getGuarantorData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.GuarmanItemObj = getDataOptions.data;
        console.log('GuarmanItemObj==>',this.GuarmanItemObj)
        if(!this.result.guarman_item){
          this.result.guarman_item = this.GuarmanItemObj[0].guarman_item;
        }
        console.log('GuarmanItem==>>',this.result.guarman_item)
        this.AssignData(this.GuarmanItemObj);
        //this.result.guarantor = this.getGuarantor.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
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
    }else if(this.modalType==20){
        this.loadModalComponent = false;
        this.loadComponent = false;
        this.loadModalConfComponent = true;
        $("#exampleModaltab1").find(".modal-content").css("width","650px");
        $("#exampleModaltab1").find(".modal-body").css("height","auto");
        $("#exampleModaltab1").css({"background":"rgba(51,32,0,.4)"});
    }
    if(this.modalType==1 || this.modalType==2 || this.modalType==3){
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
    window.location.reload();
    this.getGuarantorId();
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
      this.result.guarantor_id = event.fieldIdValue;
      this.result.guar_name = event.fieldNameValue;
      this.result.guar_title = event.fieldNameValue2;
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

    // if(!this.result.license_no){
    //   confirmBox.setMessage('กรุณาระบุทะเบียนใบอนุญาต');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success==true){
    //       //this.SpinnerService.hide();
    //       $("input[name='license_no']")[0].focus();
    //     }
    //     subscription.unsubscribe();
    //   });
    // }else
    if(!this.result.guar_name){
      confirmBox.setMessage('กรุณาระบุชื่อสกุลนายประกัน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='guar_name']")[0].focus();
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

    // if(this.guarantor_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }


    //  if(this.all_day_flag==true){
    //      var inputchk = 1;
    //  }else{
    //      var inputchk = 0;
    //  }
    console.log(this.result.due_date);
    console.log(this.result.cancel_date);
    console.log(this.result.exp_date);

      var student = JSON.stringify({
      "run_id" : this.result.run_id,
      "guar_running" : this.result.guar_running,
      "edit_guarman_item" : this.hid_guarman_item,
      "guarman_item" : this.result.guarman_item,
      "guarantor_id" : this.result.guarantor_id,
      "guar_title" : this.result.guar_title,
      "guar_name" : this.result.guar_name,
      "co_guar" : this.result.co_guar,
      "guar_asset" : this.result.guar_asset,
      "accu" : this.result.accu,
      "id_card" : this.result.id_card_0 + this.result.id_card_1 + this.result.id_card_2 + this.result.id_card_3 + this.result.id_card_4,
      "occ_id" : this.occ_id,
      "inter_id" : this.result.inter_id,
      "nation_id" : this.result.nation_id,
      "address" : this.result.address,
      "addr" : this.result.addr,
      "moo" : this.result.moo,
      "soi" : this.result.soi,
      "road" : this.result.road,
      "tambon_id" : this.tambon_id,
      "amphur_id" : this.amphur_id,
      "prov_id" : this.prov_id,
      "tel" : this.result.tel,
      "email" : this.result.email,
      "post_code" : this.result.post_code,
      "guar_b_date" : this.result.guar_b_date,
      "guar_age" : this.result.guar_age,
      "guar_relation" : this.result.guar_relation,
      "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      if(this.hid_guarman_item){
        this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0110/saveData', student ).subscribe(
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
                  this.getData();
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
        this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0110/saveData', student ).subscribe(
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
               this.ngOnInit();
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
      this.hid_guarman_item  = this.posts[index]['edit_guarman_item'];
      this.result.guarantor_id = this.posts[index]['guarantor_id'];
      this.result.guar_title = this.posts[index]['guar_title'];
      this.result.guar_name = this.posts[index]['guar_name'];
      this.result.co_guar = this.posts[index]['co_guar'];
      this.result.guar_asset = this.posts[index]['guar_asset'];
      this.result.id_card = this.posts[index]['id_card'];
      if(this.posts[index]['id_card']){
        this.result.id_card_0 = this.posts[index]['id_card'].substring(0, 1);
        this.result.id_card_1 = this.posts[index]['id_card'].substring(1, 5);
        this.result.id_card_2 = this.posts[index]['id_card'].substring(5, 10);
        this.result.id_card_3 = this.posts[index]['id_card'].substring(10, 12);
        this.result.id_card_4 = this.posts[index]['id_card'].substring(12, 13);
       }
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
      this.result.guarman_item = objData[0].guarman_item;
      this.result.accu = objData[0].accu;
      // this.hid_guarman_item  = objData[0].edit_guarman_id;
      this.hid_guarman_item = objData[0].edit_guarman_item;
      this.result.guarantor_id = objData[0].guarantor_id;
      this.result.guar_title = objData[0].guar_title;
      this.result.guar_name = objData[0].guar_name;
      this.result.co_guar = objData[0].co_guar;
      this.result.guar_asset = objData[0].guar_asset;
      this.result.id_card = objData[0].id_card;
      if(objData[0].id_card){
        this.result.id_card_0 = objData[0].id_card.substring(0, 1);
        this.result.id_card_1 = objData[0].id_card.substring(1, 5);
        this.result.id_card_2 = objData[0].id_card.substring(5, 10);
        this.result.id_card_3 = objData[0].id_card.substring(10, 12);
        this.result.id_card_4 = objData[0].id_card.substring(12, 13);
       }
      this.inter_id = objData[0].inter_id;
      this.nation_id = objData[0].nation_id;
      this.occ_id = objData[0].occ_id;
      if((this.inter_id == '0') || (!this.inter_id)){
        this.inter_id = '';
        this.result.inter_id = '';
      }else{
        this.result.inter_id = objData[0].inter_id.toString();
      }
      if((this.nation_id == '0') || (!this.nation_id)){
        this.nation_id = '';
        this.result.nation_id = '';
      }else{
        this.result.nation_id = objData[0].nation_id.toString();
      }
      if((this.occ_id == '0') || (!this.occ_id)){
        this.occ_id = '';
        this.result.occ_id = '';
      }else{
        this.result.occ_id = objData[0].occ_id.toString();
      }
      this.result.address = objData[0].address;
      this.result.addr = objData[0].addr;
      this.result.moo = objData[0].moo;
      this.result.soi = objData[0].soi;
      this.result.road = objData[0].road;
      // this.tambon_id = this.posts[index]['tambon_id'];
      // this.amphur_id = this.posts[index]['amphur_id'];
      this.prov_id = objData[0].prov_id;
      if(this.prov_id)
      this.changeProv(this.prov_id,'');
       else{
        this.sAmphur.clearModel();
        this.sTambon.clearModel();
        }
      this.edit_amphur_id = objData[0].amphur_id;
      this.edit_tambon_id = objData[0].tambon_id;
      this.result.tel = objData[0].tel;
      this.result.email = objData[0].email;
      this.result.post_code = objData[0].post_code;
      this.result.guar_b_date = objData[0].guar_b_date;
      this.result.guar_age = objData[0].guar_age;
      this.result.guar_relation = objData[0].guar_relation;

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
      this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0110/search', student , {headers:headers}).subscribe(
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
                          if(ele.edit0110 == true){
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
                   this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0110/deleteSelect', data , {headers:headers}).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();

                      }else{

                        this.closebutton.nativeElement.click();
                        $("button[type='reset']")[0].click();
                        this.getData();
                        // confirmBox.setMessage(alertMessage.error);
                        // confirmBox.setButtonLabels('ตกลง');
                        // confirmBox.setConfig({
                        //     layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        // });
                        // const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                        //   if (resp.success==true){
                        //     this.closebutton.nativeElement.click();
                        //     this.getData();
                        //   }
                        //   subscription.unsubscribe();
                        // });

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
    var rptName = 'rgu0110';

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
  window.opener.document.getElementById('reload').click();
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
      this.http.get('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0110?userToken='+this.userData.userToken+':angular').subscribe(posts => {
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

}







