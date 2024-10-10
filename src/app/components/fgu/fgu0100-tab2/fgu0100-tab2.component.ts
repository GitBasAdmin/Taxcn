import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,AfterContentInit,ViewChildren, QueryList,ViewEncapsulation   } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';

declare var myExtObject: any;
@Component({
  selector: 'app-fgu0100-tab2',
  templateUrl: './fgu0100-tab2.component.html',
  styleUrls: ['./fgu0100-tab2.component.css']
})
export class Fgu0100Tab2Component implements OnInit {
  dtOptions2: DataTables.Settings = {};
  dtTrigger_2: Subject<any> = new Subject<any>();
  sendEditData:any = [];
  myExtObject: any;
  dataHeadValue:any = [];
  masterSelected:boolean;
  viewInit:any;
  dataHead:any;
  sessData:any;
  userData:any;
  checklist:any;
  getAssetType:any;
  checkedList:any;
  result:any = [];
  GuarantorData:any = [];
  AssetData:any = [];
  modalType:any;
  GuarantorObj:any = [];
  GuarantorDataObj:any = [];
  GuarassetObj:any = [];
  GuarassetDataObj:any = [];
  GuardocData1:any = [];
  GuardocData2:any = [];
  GuardocData3:any = [];
  GuardocData4:any = [];
  delIndex:any;
  delType:any;
  resultTab2:any = [];
  run_id:any;
  getFormRunning:any;
  doc_file_name: any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalConfComponent: boolean = false;
  public loadGuarAssetComponent: boolean = false;
  public loadModalListComponent = false;
  @Output() onClickList = new EventEmitter<any>();
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100
    //console.log(getDataHead)
    this.dataHead = getDataHead;
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
    private printReportService: PrintReportService,
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

    var student = JSON.stringify({
      "table_name" : "pword_form",
      "field_id" : "form_running",
      "field_name" : "form_name",
      "condition" : "  AND form_type=13 ",
      "order_by" : "form_running ASC ",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getFormRunning = getDataOptions;
        this.result.form_running = this.getFormRunning[0].fieldIdValue;
      },
      (error) => {}
    )
    //this.rerender();
    this.setDefPage();
  }

  setDefPage(){
    this.AssetType();
    this.result.asset_type = 8;
    this.result.asset_type_name = 'ไม่มีหลักประกัน';
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

  ngOnDestroy(): void {
      this.dtTrigger_2.unsubscribe();
    }

  getSendEditData(obj:any){
    console.log(obj)
    if(typeof obj =='undefined')
      this.sendEditData = [];
    else{
      if(obj.data[0].guar_running!=0){
        this.sendEditData = [obj];
        this.result.guar_running = obj.data[0].guar_running;
        this.result.run_id = obj.data[0].run_id;
        this.guarRantorData();
        this.guarAssetData();
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

    console.log('SendEditData==>',this.sendEditData)
  }

  AssetType(){
    var student = JSON.stringify({
      "table_name" : "passet_type",
      "field_id" : "asset_type",
      "field_name" : "asset_type_name",
      "order_by" : " asset_type ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        // getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ไม่มีหลักประกัน'});
        console.log(getDataOptions)
        this.getAssetType = getDataOptions;
        // if(!this.result.to_court)
        //   this.result.to_court = getDataOptions[0].fieldIdValue;
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
         this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/getGuarantorData', student).subscribe(
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

              var bar = new Promise((resolve, reject) => {
                getDataOptions.data.forEach((ele, index, array) => {

                      if(ele.id_card != null){
                        getDataOptions.data[index]['id_card'] = this.idcardFormat(ele.id_card);
                      }
                  });
              });
            // this.req_file_name = getDataOptions.data[0].req_file_name;
            // this.con_file_name = getDataOptions.data[0].con_file_name;
            // this.doc_file_name = getDataOptions.data[0].doc_file_name;
             // this.getHeadNew();
             // this.sendCaseData.emit(this.headnew);
           }else{
            this.GuarantorDataObj = [];
           }
         },
         (error) => {}
       )
       });
       return promise;
   }

   guarAssetData(){
    // alert('guarAssetData');
     var student = JSON.stringify({
       "guar_running": this.result.guar_running,
       "userToken" : this.userData.userToken
     });
     console.log(student)
     let promise = new Promise((resolve, reject) => {
       this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/getAssetData', student).subscribe(
       (response) =>{
         let getDataOptions : any = JSON.parse(JSON.stringify(response));
         console.log('guarAssetData==>',getDataOptions);
         if(getDataOptions.result==1){
            this.GuarassetObj = getDataOptions;
            this.GuarassetDataObj = [];
            this.GuardocData1 = [];
            this.GuardocData2 = [];
            this.GuardocData3 = [];
            this.GuardocData4 = [];
            this.GuarassetDataObj = getDataOptions.data;
            this.GuardocData1 = this.GuarassetDataObj[0].doc_data1;
            this.GuardocData2 = this.GuarassetDataObj[0].doc_data2;
            this.GuardocData3 = this.GuarassetDataObj[0].doc_data3;
            this.GuardocData4 = this.GuarassetDataObj[0].doc_data4;
            this.checklist = this.GuarassetDataObj;
            console.log('GuarassetObj==>',this.GuarassetObj);
            console.log('GuarassetDataObj==>',this.GuarassetDataObj);
            console.log('GuarDocData1',this.GuardocData1);
            console.log('GuarDocData2',this.GuardocData2);
            console.log('GuarDocData3',this.GuardocData3);
            console.log('GuarDocData4',this.GuardocData4);
            this.rerender();
           // this.getHeadNew();
           // this.sendCaseData.emit(this.headnew);
           var bar = new Promise((resolve, reject) => {
            getDataOptions.data.forEach((ele, index, array) => {

                  if(ele.asset_amt != null){
                    getDataOptions.data[index]['asset_amt'] = this.curencyFormat(ele.asset_amt,2);
                  }
                  // if(ele.run_id != null){
                  //   this.pgrcv_running.push(ele.run_id);
                  // }
              });
          });

          bar.then(() => {
            // this.dataSearch = productsJson.data;
            //console.log(this.dataSearch)
          });

          if(bar){
            // this.dataSearch = productsJson.data;
            // this.deposit = this.curencyFormat(productsJson.deposit,2);
            // this.rerender();
          }
         }else{
          this.GuarassetDataObj = [];
          this.GuardocData1 = [];
          this.GuardocData2 = [];
          this.GuardocData3 = [];
          this.GuardocData4 = [];
         }
       },
       (error) => {}
     )
     });
     return promise;
 }

  getCheckedItemList(){
    var del = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function(e,i){
        if($(this).prop("checked")==true){
          if(del!='')
            del+=','
          del+=$(this).val();
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
      })
    }, 100);
  }

  AssignDataTab2(obj:any){
    console.log(obj);
    var objData = obj;
   if(obj.lit_running){
     if(objData.def_type){
       this.result.def_type = objData.def_type;
     }else{
       this.result.def_type = 2;
     }
     this.result.run_id = this.dataHeadValue.run_id;
     this.result.seq = objData.seq;
     this.result.def_no = objData.def_no;
     this.result.def_name = objData.def_name;
     this.result.release_type = objData.release_type;
     this.result.send_date = objData.send_date;
     this.result.guar_cost = objData.guar_cost;
     this.result.guar_no = objData.guar_no;
     this.result.guar_yy = objData.guar_yy;
     this.result.guar_permit = objData.guar_permit;
     this.result.status = objData.status;
     this.result.permit_reason = objData.permit_reason;
     this.result.judge_id = objData.judge_id;
     this.result.judge_name = objData.judge_name;
     this.result.remark_lit = objData.remark_lit;
     this.resultTab2.run_id = this.dataHeadValue.run_id;
     this.resultTab2.seq = this.result.seq;
     this.resultTab2.guar_running = this.result.guar_running;
     this.resultTab2.def_type = this.result.def_type;
     this.resultTab2.def_no = this.result.def_no;
     this.resultTab2.def_name = this.result.def_name;
     this.resultTab2.release_type = this.result.release_type;
     this.resultTab2.send_date = this.result.send_date;
     this.resultTab2.guar_cost = this.result.guar_cost;
     this.resultTab2.status = this.result.status;
     this.resultTab2.permit_reason = this.result.permit_reason;
     this.resultTab2.judge_id = this.result.judge_id;
     this.resultTab2.judge_name = this.result.judge_name;
     this.resultTab2.guar_order = this.result.guar_order;
     this.resultTab2.guar_permit = this.result.guar_permit;
     this.resultTab2.remark_lit = this.result.remark_lit;
   }
 }

 AssignResultTab2(obj:any){
   console.log(obj);
   var objData = obj;
  if(this.result.def_name){
   //  alert('AssignResultTab2');
    this.resultTab2.run_id = this.result.run_id;
    this.resultTab2.seq = this.result.seq;
    this.resultTab2.guar_running = this.result.guar_running;
    this.resultTab2.def_type = this.result.def_type;
    this.resultTab2.def_no = this.result.def_no;
    this.resultTab2.def_name = this.result.def_name;
    this.resultTab2.release_type = this.result.release_type;
    this.resultTab2.send_date = this.result.send_date;
    this.resultTab2.guar_cost = this.result.guar_cost;
    this.resultTab2.status = this.result.status;
    this.resultTab2.permit_reason = this.result.permit_reason;
    this.resultTab2.judge_id = this.result.judge_id;
    this.resultTab2.judge_name = this.result.judge_name;
    this.resultTab2.guar_order = this.result.guar_order;
    this.resultTab2.guar_permit = this.result.guar_permit;
    this.resultTab2.remark_lit = this.result.remark_lit;
  }
 }

 receiveFuncListData(event:any){
   if(this.modalType==1 || this.modalType==2){
     this.guarRantorData();
  }else if(this.modalType==3){
    if(typeof event.fieldIdValue !='undefined'){
      this.result.asset_type = event.fieldIdValue;
      this.result.asset_type_name = event.fieldNameValue;
    }
  }

  this.closebutton.nativeElement.click();
}

returnData(value:any){
  alert(value);
}

//  isAllSelected() {
//   this.masterSelected = this.checklist.every(function(item:any) {
//       return item.edit0100 == true;
//   })
// }

uncheckAll() {
  for (var i = 0; i < this.checklist.length; i++) {
    this.checklist[i].edit0100 = false;
  }
}
  // checkUncheckAll() {
  //   for (var i = 0; i < this.checklist.length; i++) {
  //     this.checklist[i].edit0100 = this.masterSelected;
  //   }
  //   // this.getCheckedItemList();
  // }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
    this.getCheckedItemList();
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
    this.getCheckedItemList();
  }

  // loadMyModalComponent(){
  //   if(this.modalType==1){
  //     $("#exampleModal").find(".modal-content").css("width","800px");
  //     this.loadModalLitComponent = true;
  //   }else if(this.modalType==2){
  //     $("#exampleModal").find(".modal-content").css("width","800px");
  //     this.loadModalAppResultComponent = true;
  //   }
  // }

  // clickOpenMyModalComponent(type:any,indexObj:any){
  //   if(type==1){
  //     // this.litIndex = indexObj;
  //   }else if(type==2){
  //     //  this.appIndex = indexObj;
  //   }
  //   this.modalType = type;
  //   this.openbutton.nativeElement.click();
  // }

  gotoFcoPage(assetType:any,assetItem:any,guarmanItem:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = 'fco0400';
    if(this.sendEditData.length)
      myExtObject.OpenWindowMaxName(winURL+'fco0400?run_id='+this.result.run_id+'&guar_running='+this.result.guar_running+'&ast_type='+assetType+'&ast_item='+assetItem+'&guarman_item='+guarmanItem,name);
  }

  gotoFcoPageSeq(runSeq:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = 'fco0400';
    if(this.sendEditData.length)
      myExtObject.OpenWindowMaxName(winURL+'fco0400?run_seq='+runSeq);
  }

  gotoFgu0500(assetType:any,assetItem:any,guarmanItem:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = 'fco0400';
    if(this.sendEditData.length)
      myExtObject.OpenWindowMaxName(winURL+'fco0400?run_id='+this.result.run_id+'&guar_running='+this.result.guar_running+'&ast_type='+assetType+'&ast_item='+assetItem+'&guarman_item='+guarmanItem,name);
  }

  assetPage(assetType:any){
    if(assetType==0){
      this.gotoFguPage('fgu0120');
    }else if(assetType==1){
      this.gotoFguPage('fgu0180');
    }else if(assetType==2){
      this.gotoFguPage('fgu0130');
    }else if(assetType==3){//เงินสด
      this.gotoFguPage('fgu0190');
    }else if(assetType==4){
      this.gotoFguPage('fgu0150');
    }else if(assetType==5){
      this.gotoFguPage('fgu0140');
    }else if(assetType==6){
      this.gotoFguPage('fgu0170');
    }else if(assetType==7){
      this.gotoFguPage('fgu0160');
    }else if(assetType==8){
      this.gotoFguPage('fgu0120');
    }else if(assetType==9){
      this.gotoFguPage('fgu0195');
    }else if(assetType==10){
      this.gotoFguPage('fgu0196');
    }else if(assetType==11){
      this.gotoFguPage('fgu0197');
    }
  }

  assetPageItem(guarmanItem:any,assetType:any,assetItem:any){
    console.log(guarmanItem + '-' + assetType + '-' + assetItem)
    if(assetType==0){
      this.gotoFguPageItem('fgu0120',guarmanItem,assetType,assetItem);
    }else if(assetType==1){
      this.gotoFguPageItem('fgu0180',guarmanItem,assetType,assetItem);
    }else if(assetType==2){
      this.gotoFguPageItem('fgu0130',guarmanItem,assetType,assetItem);
    }else if(assetType==3){
      this.gotoFguPageItem('fgu0190',guarmanItem,assetType,assetItem);
    }else if(assetType==4){
      this.gotoFguPageItem('fgu0150',guarmanItem,assetType,assetItem);
    }else if(assetType==5){
      this.gotoFguPageItem('fgu0140',guarmanItem,assetType,assetItem);
    }else if(assetType==6){
      this.gotoFguPageItem('fgu0170',guarmanItem,assetType,assetItem);
    }else if(assetType==7){
      this.gotoFguPageItem('fgu0160',guarmanItem,assetType,assetItem);
    }else if(assetType==8){
      this.gotoFguPageItem('fgu0120',guarmanItem,assetType,assetItem);
    }else if(assetType==9){
      this.gotoFguPageItem('fgu0195',guarmanItem,assetType,assetItem);
    }else if(assetType==10){
      this.gotoFguPageItem('fgu0196',guarmanItem,assetType,assetItem);
    }else if(assetType==11){
      this.gotoFguPageItem('fgu0197',guarmanItem,assetType,assetItem);
    }
  }

  gotoFgu0110(guarmanItem:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = 'fgu0110';
    console.log('sendEditData==>',this.sendEditData[0].data);
    if(this.sendEditData.length)
    this.result.run_id = this.sendEditData[0].data[0].run_id;
      myExtObject.OpenWindowMaxName(winURL+'fgu0110?run_id='+this.result.run_id+'&guar_running='+this.result.guar_running+'&guarman_item='+guarmanItem,name);
  }

  gotoFguPage(page:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = page;
    console.log('sendEditData==>',this.sendEditData[0].data);
    if(this.sendEditData.length)
    this.result.run_id = this.sendEditData[0].data[0].run_id;
      myExtObject.OpenWindowMaxName(winURL+name+'?run_id='+this.result.run_id+'&guar_running='+this.result.guar_running,name);
  }

  gotoFguPageItem(page:any,guarmanItem:any,assetType:any,assetItem:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = page;
    console.log('sendEditData==>',this.sendEditData[0].data);
    if(this.sendEditData.length)
    this.result.run_id = this.sendEditData[0].data[0].run_id;
      myExtObject.OpenWindowMaxName(winURL+name+'?run_id='+this.result.run_id+'&guar_running='+this.result.guar_running+'&guarman_item='+guarmanItem+'&asset_type='+assetType+'&asset_item='+assetItem,name);
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

  // loadDataGuar(val:any){
  //   const confirmBox = new ConfirmBoxInitializer();
  //     confirmBox.setTitle('ข้อความแจ้งเตือน');
  //   if(typeof this.dataHead !='undefined'){
  //     var student = JSON.stringify({
  //       "run_id" : this.dataHead.run_id?this.dataHead.run_id:0,
  //       "guar_running" : this.sendEditData[0].guar_running,
  //       "n_type" : val?val:this.result.n_type1,
  //       "userToken" : this.userData.userToken
  //     });
  //     console.log(student)
  //     this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fgu0100/getAppealRequest', student ).subscribe(
  //       (response) =>{
  //         let getDataOptions : any = JSON.parse(JSON.stringify(response));
  //         console.log(getDataOptions)
  //         if(getDataOptions.result==1){
  //             //-----------------------------//
  //               this.AppealReqData = getDataOptions.data;
  //               this.rerender();
  //             //-----------------------------//
  //         }else{
  //           //-----------------------------//
  //             confirmBox.setMessage(getDataOptions.error);
  //             confirmBox.setButtonLabels('ตกลง');
  //             confirmBox.setConfig({
  //                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  //             });
  //             const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
  //               if(resp.success==true){
  //                 this.AppealReqData = [];
  //                 this.rerender();
  //               }
  //               subscription.unsubscribe();
  //             });
  //           //-----------------------------//
  //         }

  //       },
  //       (error) => {}
  //     )
  //   }
  // }

  delData(i:any,type:any){
    this.delIndex = i;
    this.delType = type;
    //alert(this.delIndex+'--'+this.delType);
    if(this.delType==3){
      if(this.result.guar_running){
        // alert('xxxxx');
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        var del = 0;
        var bar = new Promise((resolve, reject) => {
        this.GuarassetDataObj.forEach((ele, index, array) => {
          if(ele.edit0100 == true){
            del++;
          }
        });
      });

        if(bar){
        if (!del) {
          confirmBox.setMessage('เลือกข้อมูลหลักประกันที่ต้องการลบ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
            if (resp.success == true) {
               // this.result.setFocus('barcode');
            }
            subscription.unsubscribe();
          });

        }else{
          this.clickOpenMyModalComponent(1,'');
        }
      }
      }
    }else{
      this.clickOpenMyModalComponent(1,'');
    }

  }

  clickOpenMyModalComponent(type:any,obj:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==1){
      $("#exampleModal3").find(".modal-content").css("width","650px");
        this.loadModalConfComponent = true;
        this.loadGuarAssetComponent = false;
        this.loadModalListComponent = false;
        $("#exampleModal3").find(".modal-content").css("width","650px");
        $("#exampleModal3").find(".modal-body").css("height","auto");
        $("#exampleModal3").css({"background":"rgba(51,32,0,.4)"});
    }else if(this.modalType==2){
      this.loadModalConfComponent = false;
      this.loadGuarAssetComponent = true;
      this.loadModalListComponent = false;
      $("#exampleModal5").find(".modal-content").css("width","800px");
      $("#exampleModal5").find(".modal-body").css("height","1200px");
    }else if(this.modalType==3){
      var student = JSON.stringify({
        "table_name" : "passet_type",
        "field_id" : "asset_type",
        "field_name" : "asset_type_name",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='passet_type';
      this.listFieldId='asset_type';
      this.listFieldName='asset_type_name';
      this.listFieldNull='';
    }
    console.log(student)
    if(this.modalType==3 ){
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          this.loadModalConfComponent = false;
          this.loadGuarAssetComponent = false;
          this.loadModalListComponent = true;
          $("#exampleModal5").find(".modal-content").css("width","800px");
          $("#exampleModal5").find(".modal-body").css("height","1200px");
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
                        if(resp.success==true){

                          if(this.modalType==1){
                            if(this.delType==1){
                            var dataDel = [],dataTmp=[];
                            dataDel['log_remark'] = chkForm.log_remark;
                            dataDel['userToken'] = this.userData.userToken;
                            dataTmp.push(this.GuarantorDataObj[this.delIndex]);
                            dataDel['data'] = dataTmp;
                            var data = $.extend({}, dataDel);
                            console.log('DelGuarantorData==>',JSON.stringify(data));
                            this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/deleteGuarantorData', data).subscribe(
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
                                        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                                    });
                                    const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                      if(resp.success==true){
                                        this.guarRantorData();
                                        //this.setDefPage();
                                        // this.loadData(this.result.n_type1)
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
                                      if(resp.success==true){
                                        this.SpinnerService.hide();
                                      }
                                      subscription3.unsubscribe();
                                    });
                                  //-----------------------------//
                                }

                              },
                              (error) => {}
                            )
                           }else{
                            var dataDel = [],dataTmp=[];
                            dataDel['log_remark'] = chkForm.log_remark;
                            dataDel['userToken'] = this.userData.userToken;
                            if(this.delType==2){
                              dataTmp.push(this.GuarassetDataObj[this.delIndex]);
                            }else if(this.delType==3){
                              var bar = new Promise((resolve, reject) => {
                              this.GuarassetDataObj.forEach((ele, index, array) => {
                                    if(ele.edit0100 == true){
                                      dataTmp.push(this.GuarassetDataObj[index]);
                                    }
                                });
                            });
                            }
                            dataDel['data'] = dataTmp;
                            var data = $.extend({}, dataDel);
                            console.log('DelAssetData==>',JSON.stringify(data));
                            this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/ASSET/deleteAssetData', data).subscribe(
                              (response) =>{
                                let getDataOptions : any = JSON.parse(JSON.stringify(response));
                                console.log(getDataOptions)
                                const confirmBox3 = new ConfirmBoxInitializer();
                                confirmBox3.setTitle('ข้อความแจ้งเตือน');
                                if(getDataOptions.result==1){
                                    this.guarAssetData();
                                    //-----------------------------//
                                  //   confirmBox3.setMessage('ลบข้อมูลเรียบร้อยแล้ว');
                                  //   confirmBox3.setButtonLabels('ตกลง');
                                  //   confirmBox3.setConfig({
                                  //       layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                                  //   });
                                  //   const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                  //     if(resp.success==true){
                                  //       this.guarAssetData();
                                  //  }
                                  //     subscription3.unsubscribe();
                                  //   });
                                    //-----------------------------//

                                }else{
                                  //-----------------------------//
                                    confirmBox3.setMessage(getDataOptions.error);
                                    confirmBox3.setButtonLabels('ตกลง');
                                    confirmBox3.setConfig({
                                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                    });
                                    const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                      if(resp.success==true){
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
                  if(resp.success==true){}
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
    this.loadGuarAssetComponent = false;
  }

  onClickListData(data:any): void {
    this.onClickList.emit(data)
  }

 reloadTab(){
    this.onClickListData({'run_id':this.dataHead.run_id,'guar_running':this.result.guar_running});
  }

  // fkb0100Page(i:any){
  //   let winURL = window.location.href.split("/#/")[0]+"/#/";
  //   //var name = 'win_'+Math.ceil(Math.random()*1000);
  //   var name = 'fkb0100';
  //   //console.log(winURL+'ffn1600?run_id='+this.dataHead.run_id)fkb0100.php?run_id=150662&req_running=24381
  //   myExtObject.OpenWindowMaxName(winURL+'fkb0100?run_id='+this.dataHead.run_id+'&req_running='+this.AppealReqData[i].req_running,name);
  // }

  closeWin(){
    // if(this.run_id)
    //   window.opener.myExtObject.openerReloadRunId(this.run_id);
    // else
    //   window.opener.myExtObject.openerReloadRunId(0);
    window.close();
  }

  cancelAsset(){
    if(this.result.guar_running){
    // alert('xxxxx');
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var del = 0;
    var bar = new Promise((resolve, reject) => {
    this.GuarassetDataObj.forEach((ele, index, array) => {
      if(ele.edit0100 == true){
        del++;
      }
    });
  });

    if(bar){
    if (!del) {
      confirmBox.setMessage('เลือกข้อมูลหลักประกันที่ต้องการยกเลิก');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
        if (resp.success == true) {
           // this.result.setFocus('barcode');
        }
        subscription.unsubscribe();
      });

    } else {
      // alert('ooooo');
      var dataTmp = [],dataSave = [];
      var bar = new Promise((resolve, reject) => {
        this.GuarassetDataObj.forEach((ele, index, array) => {
              if(ele.edit0100 == true){
                dataTmp.push(this.GuarassetDataObj[index]);
              }
          });
      });
      if(bar){
        dataSave['data'] = dataTmp;
        dataSave['userToken'] = this.userData.userToken;
        var data = $.extend({}, dataSave);
        console.log(JSON.stringify(data));
      // this.SpinnerService.show();

      this.SpinnerService.hide();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการยกเลิกหลักประกันที่เลือกใช่ไหม');
      confirmBox.setButtonLabels('ตกลง','ยกเลิก');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });

      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
          this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/cancelGuarAsset', data ).subscribe(response => {
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });

            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
            // alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล');
            //  $("button[type='reset']")[0].click();
           //this.ngOnInit();
           this.masterSelected = false;
           this.guarAssetData();
          //  this.sumClick = '';
          });
        // }else{
        //   alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
        }
        subscription.unsubscribe();
      });
      }
    }
    }
  }
  }

  cancelCancelAsset(){
    if(this.result.guar_running){
    // alert('xxxxx');
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var del = 0;
    var bar = new Promise((resolve, reject) => {
    this.GuarassetDataObj.forEach((ele, index, array) => {
      if(ele.edit0100 == true){
        del++;
      }
    });
  });

    if(bar){
    if (!del) {
      confirmBox.setMessage('เลือกข้อมูลหลักประกันที่ต้องการยกเลิกการยกเลิก');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
        if (resp.success == true) {
           // this.result.setFocus('barcode');
        }
        subscription.unsubscribe();
      });

    } else {
      // alert('ooooo');
      var dataTmp = [],dataSave = [];
      var bar = new Promise((resolve, reject) => {
        this.GuarassetDataObj.forEach((ele, index, array) => {
              if(ele.edit0100 == true){
                dataTmp.push(this.GuarassetDataObj[index]);
              }
          });
      });
      if(bar){
        dataSave['data'] = dataTmp;
        dataSave['userToken'] = this.userData.userToken;
        var data = $.extend({}, dataSave);
        console.log(JSON.stringify(data));
      // this.SpinnerService.show();

      this.SpinnerService.hide();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการยกเลิกการยกเลิกหลักประกันที่เลือกใช่ไหม');
      confirmBox.setButtonLabels('ตกลง','ยกเลิก');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });

      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
          this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/cancelCancelGuarAsset', data ).subscribe(response => {
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });

            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
            // alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล');
            //  $("button[type='reset']")[0].click();
           //this.ngOnInit();
           this.masterSelected = false;
           this.guarAssetData();
          //  this.sumClick = '';
          });
        // }else{
        //   alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
        }
        subscription.unsubscribe();
      });
      }
    }
    }
   }
  }

  curencyFormat(n:any,d:any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }//100000 เป็น 100,000.00


  curencyFormatRevmove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, "").slice(.00, -3); ;
    } else {
      return "";
    }
  } // 1

  idcardFormat(val:any){
    if (val !== undefined && val !== null) {
      return val.substring(0, 1) + '-' + val.substring(1, 5) + '-' + val.substring(5, 10) + '-' + val.substring(10, 12) + '-' + val.substring(12, 13);
    } else {
      return "";
    }
  }

  goToPage(toPage:any,guar_running:any){
    let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+toPage+'?run_id='+this.result.run_id+'&keep_running='+guar_running;
    //alert(winURL);
    window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1800,height=600");
    //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  }

  tabChangeInput(name:any,event:any){
    if(name=='asset_type'){
      // alert(event.target.value)
      var student = JSON.stringify({
        "table_name" : "passet_Type",
        "field_id" : "asset_type",
        "field_name" : "asset_type_name",
        "condition" : " AND asset_type='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          this.result.asset_type_name = productsJson[0].fieldNameValue;
        }else{
          this.result.asset_type = '';
          this.result.asset_type_name = '';
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
    }
  }

  clickOpenFile(file:any){
    var student = JSON.stringify({
    "file_name" : file,
    "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/openFile', student).subscribe(
      (response) =>{
        let alertMessage : any = JSON.parse(JSON.stringify(response));
        if(alertMessage.result==1){
          myExtObject.OpenWindowMax(alertMessage.file);
        }
      },
      (error) => {}
    )
  }

  delFile(file:any,type:any){
    if(file){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการลบไฟล์ Word');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if(resp.success==true){
          var student = JSON.stringify({
          "file_name" : file,
          "userToken" : this.userData.userToken
          });
          this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/deleteFile', student).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              if(alertMessage.result==0){
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if(resp.success==true){}
                  subscription.unsubscribe();
                });
              }else{
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if(resp.success==true){}
                  subscription.unsubscribe();
                  if(type==1){
                    // this.req_file_name ='';
                  }else if(type==2){
                    // this.con_file_name ='';
                  }else if(type==3){
                    // this.doc_file_name ='';
                  }
                });
              }
            },
            (error) => {this.SpinnerService.hide();}
            )
          }
          subscription.unsubscribe();
          });
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ไม่พบไฟล์ Word');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){}
          subscription.unsubscribe();
      }
      );
    }

  }

  openWindow(type:any){
    // var name="";
    // if(type==1){
    //   name = 'prgu0300?'+'guar_running='+(this.result.guar_running?this.result.guar_running:0)+
    //   '&run_id='+(this.result.run_id?this.result.run_id:0)+
    //   '&pitem=0';
    // }else if(type==2){
    //   name = 'prgu0400?'+'guar_running='+(this.result.guar_running?this.result.guar_running:0)+
    //   '&run_id='+(this.result.run_id?this.result.run_id:0)+
    //   '&pitem=0';
    // }else if(type==3){
    //   name = 'prgu0410?'+'guar_running='+(this.result.guar_running?this.result.guar_running:0)+
    //   '&run_id='+(this.result.run_id?this.result.run_id:0)+
    //   '&sub_type=1&pitem=0';
    // }

    // console.log(type,name);
    // let winURL = window.location.href.split("/#/")[0]+"/#/";
    // myExtObject.OpenWindowMaxName(winURL+name);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.guar_running){
      confirmBox.setMessage('ยังไม่ได้เลือกข้อมูลคำร้องประกัน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){}
        subscription.unsubscribe();
      });
    // }else if((type==1 && !this.result.form_running1) || (type==2 && !this.result.form_running2) || (type==3 && !this.result.form_running3)){
    //   confirmBox.setMessage('กรุณาเลือกแบบ');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if(resp.success==true){}
    //     subscription.unsubscribe();
    //   });
    }else {

      if(type==1){
        var student = JSON.stringify({
        "form_type" : 16,
        "form_running" : this.result.form_running1 ? this.result.form_running1 : '',
        "guar_running" : this.result.guar_running ? this.result.guar_running : '',
        "userToken" : this.userData.userToken
        });

      // }else if(type==2){
      //   var student = JSON.stringify({
      //     "form_type" : 10,
      //     "form_running" : this.result.form_running2 ? this.result.form_running2 : '',
      //   "guar_running" : this.result.guar_running ? this.result.guar_running : '',
      //     "userToken" : this.userData.userToken
      //     });
      // }else if(type=3){
      //   var student = JSON.stringify({
      //     "form_type" : 18,
      //     "form_running" : this.result.form_running3 ? this.result.form_running3 : '',
      //     "guar_running" : this.result.guar_running ? this.result.guar_running : '',
      //     "userToken" : this.userData.userToken
      //     });
      }
      this.SpinnerService.show();
      this.http.disableLoading().post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/openGuarDoc', student).subscribe(
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
              if(resp.success==true){;
              }
              subscription.unsubscribe();
            });
          }else{
            this.SpinnerService.hide();
            this.getData();
            myExtObject.OpenWindowMax(alertMessage.file);
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  getData(){
    var student = JSON.stringify({
      "guar_running": this.result.guar_running,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/getGuaranteeData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log('guarRantorData==>',getDataOptions);
        if(getDataOptions.result==1){
            console.log('getData----'+getDataOptions.data);
            // this.req_file_name = getDataOptions.data[0].req_file_name;
            // this.con_file_name = getDataOptions.data[0].con_file_name;
            // this.doc_file_name = getDataOptions.data[0].doc_file_name;
        }
      },
      (error) => {}
    )
    });
  }


}
