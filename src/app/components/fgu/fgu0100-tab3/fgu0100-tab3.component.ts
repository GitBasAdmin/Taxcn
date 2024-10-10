import { Component, OnInit , ViewChild ,NgZone, ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,AfterContentInit,ViewChildren, QueryList,ViewEncapsulation   } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { tap, map, catchError,startWith } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerService } from "ngx-spinner";
import { PrintReportService } from '@app/services/print-report.service';
declare var myExtObject: any;

@Component({
  selector: 'app-fgu0100-tab3',
  templateUrl: './fgu0100-tab3.component.html',
  styleUrls: ['./fgu0100-tab3.component.css']
})
export class Fgu0100Tab3Component implements AfterViewInit,AfterContentInit, OnInit, OnDestroy {
  sendEditData: any = [];
  myExtObject: any;
  viewInit: any;
  dataSendHead: any;
  sessData: any;
  userData: any;
  result: any = [];
  dataHeadValue: any = [];
  AppealReqData: any = [];
  run_id: any;
  guar_running: any;
  modalType: any;
  delIndex: any;
  getNoticeBy: any;
  getPayType: any;
  GuarantorDataObj: any = [];
  getForfeit: any = [];
  getMonth: any = [];
  getYear: any = [];
  receiptData: any = [];
  masterSelected: boolean;
  checklist: any;

  public loadModalConfComponent: boolean = false;
  public loadPopupGuardefComponent: boolean = false;
  public loadPopupMapReceiptComponent: boolean = false;

  @Input() set getTab(getTab: any) {//รับจาก fju0100-main
    if (typeof getTab != 'undefined' && getTab.tabIndex == 2) {
      myExtObject.callCalendar();
    }
    console.log(getTab)
  }

  @Input() set getDataHead(getDataHead: any) {//รับจาก fgu0100
    console.log("tab3-getDataHead----"+getDataHead)

    if(typeof getDataHead !='undefined'){
      this.dataSendHead = getDataHead;
      this.setDefPage();
      if(this.dataSendHead.run_id){
        this.dataHeadValue.run_id = this.dataSendHead.run_id;
        this.result.run_id = this.dataHeadValue.run_id;
        this.run_id = this.dataHeadValue.run_id;
        this.guar_running = this.dataSendHead.guar_running;
        this.result.guar_running = this.dataSendHead.guar_running;
        console.log('RunId==>',this.result.run_id);
      }
    }
    console.log(this.result.guar_running);
    if(this.guar_running){
      this.guarRantorData();//ผู้ชำระค่าปรับ
      this.getForfeitData();
      this.getForfeitDetail(1);
    }
  }

  @Input() set sendEdit(sendEdit: any) {//รับจาก fgu0100
    console.log("tab3-sendEdit----"+sendEdit)
    
    if(typeof sendEdit !='undefined'){
      var tmp = sendEdit.data;
      this.result.run_id = tmp.data[0].run_id;
      this.run_id = tmp.data[0].run_id;
      this.result.guar_running = tmp.data[0].guar_running;
      this.guar_running = tmp.data[0].guar_running;
      if(this.guar_running){
        this.guarRantorData();//ผู้ชำระค่าปรับ
        this.getForfeitData();
        this.getForfeitDetail(1);
      }
    }
  }

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger_1: Subject<any> = new Subject<any>();
  dtTrigger_2: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
  ) {
    this.masterSelected = false
  }

  ngOnInit(): void {
    this.dtOptions1 = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true
    };

    this.dtOptions2 = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.getNoticeBy = [{ fieldIdValue: 'รับหมายเอง', fieldNameValue: 'รับหมายเอง' }, { fieldIdValue: 'ปิดหมาย', fieldNameValue: 'ปิดหมาย' }];
    this.getPayType = [{ fieldIdValue: 1, fieldNameValue: 'ชำระครั้งเดียว' }, { fieldIdValue: 2, fieldNameValue: 'ผ่อนชำระ' }, { fieldIdValue: 3, fieldNameValue: 'บังคับคดี' }];
    this.getMonth = [{fieldIdValue: 0, fieldNameValue: ""},{fieldIdValue: 1, fieldNameValue: "มกราคม"},{fieldIdValue: 2, fieldNameValue: "กุมภาพันธ์"},{fieldIdValue: 3,fieldNameValue: "มีนาคม"},
    {fieldIdValue: 4,fieldNameValue: "เมษายน"},{fieldIdValue: 5,fieldNameValue: "พฤษภาคม"},
    {fieldIdValue: 6,fieldNameValue: "มิถุนายน"},{fieldIdValue: 7,fieldNameValue: "กรกฎาคม"},
    {fieldIdValue: 8,fieldNameValue: "สิงหาคม"},{fieldIdValue: 9,fieldNameValue: "กันยายน"},
    {fieldIdValue: 10,fieldNameValue: "ตุลาคม"},{fieldIdValue: 11,fieldNameValue: "พฤศจิกายน"},
    {fieldIdValue: 12,fieldNameValue: "ธันวาคม"}];
    
    let i=0;
    let year = myExtObject.curYear()-4;
    for (let index = 0; index < 14; index++) {
      this.getYear[index]={ fieldIdValue: year+index, fieldNameValue: year+index };
    }
    this.getYear.unshift({fieldIdValue:0,fieldNameValue: ''});

    this.setDefPage();
  }

  setDefPage() {
    console.log("setDefPage");
    this.result =[]; this.AppealReqData=[];
    this.result.n_type3 = 2;
    this.result.notice_by = 'รับหมายเอง';
    this.result.pay_type = 1;
    this.result.forfeit_amt = '0.00';
    this.result.discount_amt = '0.00';
    this.result.paid_amt = '0.00';
    this.result.month1=1;
    this.result.month2=1;
    this.result.edit_forfeit_se = 0;
  }

  clickPayTime(){

    console.log('clickPayTime');
    this.result.pay_time = 1;
    this.getCalendar();
  }


  changePtype(){
    
  }

  setDate(){
    if(this.result.refrain_flag)
      this.result.create_refrain_date = myExtObject.curDate();
    else
      this.result.create_refrain_date = "";
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
    });
    this.dtTrigger_1.next(null);
    this.dtTrigger_2.next(null);
  }

  ngAfterViewInit(): void {
    this.dtTrigger_1.next(null);
    this.dtTrigger_2.next(null);
    myExtObject.callCalendar();
  }

  ngAfterContentInit() : void{
  }

  getCalendar(){
    myExtObject.callCalendar();
  }

  curencyFormat(n: any, d: any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  curencyFormatRemove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, "");
    } else {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger_1.unsubscribe();
    this.dtTrigger_2.unsubscribe();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  delData(i: any) {
    this.delIndex = i;
    this.clickOpenMyModalComponent(2);
  }

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  runForfeitSeq() {
    if(this.guar_running){
      var student = JSON.stringify({
        "guar_running": this.guar_running,
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/runForfeitSeq', student).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          console.log(alertMessage)
          if (alertMessage.result == 1) {
            this.result.forfeit_seq = alertMessage.forfeit_seq;
          }else{
            this.result.forfeit_seq = '';
          }
        },
        (error) => { }
      )
    }
  }

  // ผู้ชำระค่าปรับ
  guarRantorData() {
    var student = JSON.stringify({
      "guar_running": this.guar_running,
      "userToken": this.userData.userToken
    });
    console.log(student)
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/getGuarantorData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log('guarRantorData==>', getDataOptions);
        if (getDataOptions.result == 1) {
          this.GuarantorDataObj = [];
          this.GuarantorDataObj = getDataOptions.data;
          this.rerender();
        } else {
          this.GuarantorDataObj = [];
        }
      },
      (error) => { }
    )
  }

  getForfeitData() {
    console.log('getForfeitData'+this.guar_running);
    var student = JSON.stringify({
      "guar_running": this.guar_running,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/getForfeitData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if (getDataOptions.result == 1) {
          this.getForfeit = [];
          this.getForfeit = getDataOptions.data;
        }else{
          this.getForfeit = [];
        }
      },
      (error) => { }
    )
  }

  getForfeitDetail(type:any) {
    console.log('getForfeitDetail'+type);
    
    if(type==1){
      var student = JSON.stringify({
        "guar_running": this.guar_running,
        "userToken": this.userData.userToken
      });

      this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/getForfeitData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if (getDataOptions.result == 1) {
            // assign data
            this.getCalendar();
            var max_item=getDataOptions.data.length-1;
            this.result = getDataOptions.data[max_item];

            this.result.forfeit_amt = this.curencyFormat(this.result.forfeit_amt ? this.result.forfeit_amt : 0 , 2);
            this.result.discount_amt = this.curencyFormat(this.result.discount_amt ? this.result.discount_amt : 0 , 2);
            this.result.paid_amt = this.curencyFormat(this.result.paid_amt ? this.result.paid_amt : 0 , 2);
            this.result.amt_time = this.curencyFormat(this.result.amt_time ? this.result.amt_time : 0 , 2);

            if(getDataOptions.data[max_item].pay_data.length>0){
              this.AppealReqData = getDataOptions.data[max_item].pay_data;
              this.checklist = getDataOptions.data[max_item].pay_data;
              console.log(this.AppealReqData);
              this.rerender();
            }else{
              this.AppealReqData = [];
              this.rerender();
            }
          // }else{
          //   // this.AppealReqData = [];
          //   const confirmBox = new ConfirmBoxInitializer();
          //   confirmBox.setTitle('ข้อความแจ้งเตือน');
          //   confirmBox.setMessage(getDataOptions.error);
          //   confirmBox.setButtonLabels('ตกลง');
          //   confirmBox.setConfig({
          //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          //   });
          //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          //     if(resp.success==true){
          //     }
          //     subscription.unsubscribe();
          //   });
          }
        },
        (error) => { }
      )
    }else if(type==2){
      var student = JSON.stringify({
        "guar_running": this.guar_running,
        "forfeit_seq": this.result.forfeit_seq,
        "userToken": this.userData.userToken
      });
      console.log(student);
      this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/getForfeitData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if (getDataOptions.result == 1) {
            // assign data
            this.getCalendar();
            this.result = getDataOptions.data[0];
            this.result.forfeit_amt = this.curencyFormat(this.result.forfeit_amt ? this.result.forfeit_amt : 0 , 2);
            this.result.discount_amt = this.curencyFormat(this.result.discount_amt ? this.result.discount_amt : 0 , 2);
            this.result.paid_amt = this.curencyFormat(this.result.paid_amt ? this.result.paid_amt : 0 , 2);
            this.result.amt_time = this.curencyFormat(this.result.amt_time ? this.result.amt_time : 0 , 2);
            
            if(getDataOptions.data[0].pay_data.length>0){
              this.AppealReqData = getDataOptions.data[0].pay_data;
              this.checklist = getDataOptions.data[0].pay_data;
              console.log(this.AppealReqData);
              this.rerender();
            }else{
              this.AppealReqData = [];
              this.rerender();
            }
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { }
      )
    }
  }

  editData(index:any){
    this.guar_running = this.getForfeit[index].guar_running;
    this.result.guar_running = this.getForfeit[index].guar_running;
    this.result.forfeit_seq = this.getForfeit[index].forfeit_seq;
    this.getForfeitDetail(2);
  }

  loadMyModalComponent() {
    $(".modal-backdrop").remove();
    if (this.modalType == 1) {
      this.loadModalConfComponent = false;
      this.loadPopupGuardefComponent = true;
      this.loadPopupMapReceiptComponent = false;
      
      $("#exampleModal3").find(".modal-content").css("width", "650px");
      $("#exampleModal3").find(".modal-content").css("width", "650px");
      $("#exampleModal3").find(".modal-body").css("height", "auto");
      $("#exampleModal3").css({ "background": "rgba(51,32,0,.4)" });
    }else  if (this.modalType == 4) {
      this.loadModalConfComponent = false;
      this.loadPopupGuardefComponent = false;
      this.loadPopupMapReceiptComponent = true;

      $("#exampleModal3").find(".modal-content").css("width", "650px");
      $("#exampleModal3").find(".modal-content").css("width", "650px");
      $("#exampleModal3").find(".modal-body").css("height", "auto");
      $("#exampleModal3").css({ "background": "rgba(51,32,0,.4)" });
    } else {
      this.loadModalConfComponent = true;
      this.loadPopupGuardefComponent = false;
      this.loadPopupMapReceiptComponent = false;

      $("#exampleModal3").find(".modal-content").css("width", "650px");
      $("#exampleModal3").find(".modal-content").css("width", "650px");
      $("#exampleModal3").find(".modal-body").css("height", "auto");
      $("#exampleModal3").css({ "background": "rgba(51,32,0,.4)" });
    }
  }

  receiveGuarGefData(event){
    console.log(event);
    this.result.item_no = parseInt(event.item_no)
    this.result.def_name = event.def_name
    this.result.forfeit_type = event.def_type;
    this.closebutton.nativeElement.click();
  }

  receiveMapReceiptData(event){
    console.log(event);
    this.receiptData = [];
    if(event.rreceipt_no){
      this.receiptData = event;
      this.saveReceiptData();
    }
  }

  saveReceiptData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.run_id) {
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    }else if (!this.guar_running) {
      confirmBox.setMessage('ไม่พบข้อมูลสัญญาประกัน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();

      this.receiptData["run_id"] = this.run_id;
      this.receiptData["forfeit_seq"] = this.result.forfeit_seq;
      this.receiptData["guar_running"] = this.guar_running;
      this.receiptData["time_send"] = 0;
      var  data=[($.extend({}, this.receiptData))];
      var student = JSON.stringify({
        "data" : data,
        "userToken" : this.userData.userToken
     });

      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/saveMapReceipt', student).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          console.log(alertMessage)
          if (alertMessage.result == 0) {
            this.closebutton.nativeElement.click();
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
              }
              subscription.unsubscribe();
            });
          } else {
            this.closebutton.nativeElement.click();
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.getForfeitData();
                this.getForfeitDetail(2);
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { }
      )
    }
  }

  saveData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.run_id) {
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    }else if (!this.guar_running) {
      confirmBox.setMessage('ไม่พบข้อมูลสัญญาประกัน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();

      if(this.result.ptype==1){
        this.result.month1 = ''; this.result.year1 = '';

        this.result.month2 = ''; this.result.year2 = '';
  
        this.result.other_detail = '';
      }else if(this.result.ptype==2){
        this.result.pay_dd1 = ''; this.result.pay_dd2 = ''; this.result.start_due = '';
  
        this.result.month2 = ''; this.result.year2 = '';
  
        this.result.other_detail = '';
      }else if(this.result.ptype==3){
        this.result.pay_dd1 = ''; this.result.pay_dd2 = ''; this.result.start_due = '';
  
        this.result.month1 = ''; this.result.year1 = '';
  
        this.result.other_detail = '';
      }else if(this.result.ptype==4){
        this.result.pay_dd1 = ''; this.result.pay_dd2 = ''; this.result.start_due = '';
  
        this.result.month1 = ''; this.result.year1 = '';
  
        this.result.month2 = ''; this.result.year2 = '';
      }

      this.result["run_id"] = this.run_id;
      this.result["guar_running"] = this.guar_running;
      this.result["forfeit_amt"] = this.result.forfeit_amt ? parseFloat(this.curencyFormatRemove(this.result.forfeit_amt)) : 0;
      this.result["discount_amt"] = this.result.discount_amt ? parseFloat(this.curencyFormatRemove(this.result.discount_amt)) : 0;
      this.result["paid_amt"] = this.result.paid_amt ? parseFloat(this.curencyFormatRemove(this.result.paid_amt)) : 0;
      this.result["amt_time"] = this.result.amt_time ? parseFloat(this.curencyFormatRemove(this.result.amt_time)) : 0;

      var  data=[($.extend({}, this.result))];
      var student = JSON.stringify({
        "data" : data,
        "userToken" : this.userData.userToken
     });

      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/saveForfeitData', student).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          console.log(alertMessage)
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
              }
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.result.guar_running = alertMessage.guar_running;
                this.guar_running = alertMessage.guar_running;
                this.result.forfeit_seq = alertMessage.forfeit_seq;
                this.getForfeitData();
                this.getForfeitDetail(2);
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { }
      )
    }
  }

  //ลบข้อมูลการปรับ
  deleteForfeitData(){
    this.clickOpenMyModalComponent(5);   
  }

  //ลบข้อมูลที่เลือก
  deleteData(){
    this.clickOpenMyModalComponent(3);    
  }

  //เลือกข้อมูลใบเสร็จ
  selectReceipt(){
    this.clickOpenMyModalComponent(4);   
  }


  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0100 = this.masterSelected;
    }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.edit0100 == true;
    })
  }

  //ลบข้อมุลที่เลือก
  submitModalForm() {
    var chkForm = JSON.parse(this.child.ChildTestCmp());

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!chkForm.password) {
      confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          //this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });

    } else if (!chkForm.log_remark) {
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          //this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    } else {
      var student = JSON.stringify({
        "user_running" : this.userData.userRunning,
        "password" : chkForm.password,
        "log_remark" : chkForm.log_remark,
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/taxcApi/API/checkPassword', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          if(productsJson.result==1){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){
                if(this.modalType==3){
                  var dataDel = [], dataTmp = [];
                  var bar = new Promise((resolve, reject) => {
                    console.log(this.AppealReqData);
                    this.AppealReqData.forEach((ele, index, array) => {
                      if (ele.edit0100 == true) {
                        dataTmp.push(this.AppealReqData[index]);
                      }
                    });
                  });
                  if (bar) {
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/deleteForfeitPayData', data).subscribe(
                      (response) => {
                        let alertMessage: any = JSON.parse(JSON.stringify(response));
                        if (alertMessage.result == 0) {
                          this.closebutton.nativeElement.click();

                          const confirmBox = new ConfirmBoxInitializer();
                          confirmBox.setTitle('ข้อความแจ้งเตือน');
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if(resp.success==true){
                            }
                            subscription.unsubscribe();
                          });
                        } else {
                          this.closebutton.nativeElement.click();

                          const confirmBox = new ConfirmBoxInitializer();
                          confirmBox.setTitle('ข้อความแจ้งเตือน');
                          confirmBox.setMessage(alertMessage.error);
                          confirmBox.setButtonLabels('ตกลง');
                          confirmBox.setConfig({
                              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                            if(resp.success==true){
                              this.getForfeitData();
                              this.getForfeitDetail(1);
                            }
                            subscription.unsubscribe();
                          });
                        }
                      },
                      (error) => { this.SpinnerService.hide(); }
                    )
                  }
                }else if(this.modalType==5){
                  var  data=[($.extend({}, this.result))];
                  var student = JSON.stringify({
                    "data" : data,
                    "userToken" : this.userData.userToken
                  });                  
                  this.http.post('/' + this.userData.appName + 'ApiGU/API/GUARANTEE/fgu0100/deleteForfeitData ', student).subscribe(
                    (response) => {
                      let alertMessage: any = JSON.parse(JSON.stringify(response));
                      if (alertMessage.result == 0) {
                        this.closebutton.nativeElement.click();

                        const confirmBox = new ConfirmBoxInitializer();
                        confirmBox.setTitle('ข้อความแจ้งเตือน');
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if(resp.success==true){
                            this.getForfeitData();
                            this.getForfeitDetail(1);
                          }
                          subscription.unsubscribe();
                        });
                      } else {
                        this.closebutton.nativeElement.click();

                        const confirmBox = new ConfirmBoxInitializer();
                        confirmBox.setTitle('ข้อความแจ้งเตือน');
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if(resp.success==true){
                            this.getForfeitData();
                            this.getForfeitDetail(1);
                          }
                          subscription.unsubscribe();
                        });
                      }
                    },
                    (error) => { this.SpinnerService.hide(); }
                  )
                } 
              }
              subscription.unsubscribe();
            });
          }else{
            const confirmBox = new ConfirmBoxInitializer();
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

  closeModal() {
    this.loadModalConfComponent = false;
    this.loadPopupGuardefComponent = false;
  }

  reloadTab() {

  }

  newData() {
    this.setDefPage();
    this.runForfeitSeq();
    // if(typeof this.dataSendHead !='undefined'){
    //   if(this.dataSendHead.run_id){
    //     this.dataHeadValue.run_id = this.dataSendHead.run_id;
    //     this.result.run_id = this.dataHeadValue.run_id;
    //     this.run_id = this.dataHeadValue.run_id;
    //     this.guar_running = this.dataSendHead.guar_running;
    //     this.result.guar_running = this.dataSendHead.guar_running;
    //     this.runForfeitSeq();
    //   }
    // }
  }

  ClearAll() {
    // window.location.reload();
    // this.setDefPage();
    if(this.guar_running){
      this.guarRantorData();//ผู้ชำระค่าปรับ
      this.getForfeitData();
      this.getForfeitDetail(1);
    }
  }
}