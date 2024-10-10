import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2   } from '@angular/core';
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
import { PopupCourtRemarkComponent } from '../../modal/popup-court-remark/popup-court-remark.component';
import { PrintReportService } from 'src/app/services/print-report.service';

@Component({
  selector: 'app-fsn1410,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fsn1410.component.html',
  styleUrls: ['./fsn1410.component.css']
})


export class Fsn1410Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';

  posts:any=[];
  delList:any=[];
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

  modelType:any;
  getCourt:any;
  getProv:any;
  getAmphur:any;
  getTambon:any;
  edit_prov_id:any;
  edit_amphur_id:any;
  edit_tambon_id:any;
  getOfficer:any;

  result:any=[];
  items:any = [];
  image:any;
  fileToUpload1: File = null;
  file_running:any;
  file_type:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadCourtRemarkComponent: boolean = false;

  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild( PopupCourtRemarkComponent ) remark: PopupCourtRemarkComponent ;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
  @ViewChild('courtName') courtName : ElementRef;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2
  ){
    this.masterSelected = false
    // this.masterSelected2 = false
  }

  ngOnInit(): void {


    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']]
    };

    this.result.seq_no=0;
    this.posts = [];

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    // console.log("this.userData=>", this.userData);

    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fsn1410"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => {}
    )
    //========================  pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "field_name2" : "court_province",
      "field_name3" : "court_running",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
       // console.log("getCourt",this.getCourt);
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
    //======================== pofficer ======================================
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOfficer = getDataOptions;
      },
      (error) => {}
    )
  }

  setDefForm(){
    let court_running = this.result.court_running;
    let court_id = this.result.court_id;
    let court_name = this.result.court_name;
    let prov_id = this.result.prov_id;
    let prov_name = this.result.prov_name;
    let remark = this.result.remark;
    // let amphur_id = this.result.amphur_id;
    // let tambon_id = this.result.tambon_id;
    this.result = [];
    this.posts = [];
    this.result.court_running = court_running;
    this.result.court_id = court_id;
    this.result.court_name = court_name;
    this.result.prov_id = prov_id;
    this.result.prov_name = prov_name;
    this.result.remark = remark;

    this.edit_amphur_id = "";
    this.edit_tambon_id = "";
    // this.result.amphur_id = amphur_id;
    // this.result.tambon_id = tambon_id;
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}

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

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit1410 = this.masterSelected;
      }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit1410 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit1410 = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  ClearAll(){
    window.location.reload();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
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

  receiveFuncListData(event:any){
    // this.closebutton.nativeElement.click();
  }

  loadMyModalComponent(){
    if(this.modelType == 1){
      //บันทึกข้อมูลหมายเหตุศาล
      this.listFieldId = this.result.court_running;

      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadCourtRemarkComponent = true;
      $("#exampleModal").find(".modal-content").css("width","750px");
    }else{
      this.loadComponent = false;
      this.loadModalComponent = true;
      this.loadCourtRemarkComponent = false;
      $("#exampleModal").find(".modal-body").css("height","100px");
    }
  }

  clickOpenCourtRemarkComponent(type:any){
    if(! this.result.court_running){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุศาล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      this.modelType = type;
      this.openbutton.nativeElement.click();
    }
  }

  closeModal(){
    this.loadComponent = false;
    this.loadModalComponent = false;
    this.loadCourtRemarkComponent = false;

    $('.modal')
    .find("input[type='text'],input[type='password'],textarea,select")
    .val('')
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();
  }

  tabChangeSelect(objName:any,objData:any,event:any,type:any){
    // console.log("event.target.value", "=>",event);
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
      }else{
          var val = objData.filter((x:any) => x.fieldNameValue3 === event);
      }
      // console.log("val=>",val)
      if(val.length!=0){
        this.result.court_id = val[0].fieldIdValue;
        this.result.court_name = val[0].fieldNameValue;
        this.result.court_running = val[0].fieldNameValue3
        if(val[0].fieldNameValue2){
          this.result.prov_id = val[0].fieldNameValue2;
          this.result.prov_name = val[0].fieldNameValue2;
          this.changeProv(this.result.prov_id,'');
        }else{
          this.result.prov_id = null;
          this.result.prov_name = null;
        }
      }else{
        this.result.court_id = null;
      this.result.court_name = null;
      }
    }else{
      this.result.court_id = null;
      this.result.court_name = null;
    }
  }

  tabChangeSelect2(objName:any,objData:any,event:any,type:any){
    // console.log("tabChangeSelect2", "=>",event);
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      // console.log("val=>",val)
      if(val.length!=0){
        this.result.prov_id = val[0].fieldIdValue;
        this.result.prov_name = val[0].fieldIdValue;

        if(objName=="prov_id"){
          this.changeProv(event.target.value,1);
        }else if( objName=="prov_name"){
          this.changeProv(event,1);
        }
      }else{
        this.result.prov_id = null;
        this.result.prov_name = null;
      }
    }else{
      this.result.prov_id = null;
      this.result.prov_name = null;
    }
  }

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.court_name){
      confirmBox.setMessage('กรุณาระบุข้อมูลศาล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('prov_id');
        }
        subscription.unsubscribe();
      });

    }else if(!this.result.prov_name){
      confirmBox.setMessage('กรุณาระบุจังหวัด');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('off_id');
        }
        subscription.unsubscribe();
      });
    // }else if(!this.result.amphur_id){
    //   confirmBox.setMessage('กรุณาระบุอำเภอ');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success==true){
    //       // this.setFocus('off_id');
    //     }
    //     subscription.unsubscribe();
    //   });
    // }else if(!this.result.tambon_id){
    //   confirmBox.setMessage('กรุณาระบุตำบล');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success==true){
    //       // this.setFocus('off_id');
    //     }
    //     subscription.unsubscribe();
    //   });
    }else{
      this.SpinnerService.show();

      if(this.result.prov_id){
        this.result.prov_name= this.getProv.find((o:any) => o.fieldIdValue === this.result.prov_id).fieldNameValue;
      }
      if(this.result.amphur_id){
        this.result.amphur_name= this.getAmphur.find((o:any) => o.fieldIdValue === this.result.amphur_id).fieldNameValue;
      }
      if(this.result.tambon_id){
        this.result.tambon_name = this.getTambon.find((o:any) => o.fieldIdValue === this.result.tambon_id).fieldNameValue;
      }
      if(!this.result.moo){
        this.result.moo = null;
      }

     var student = JSON.stringify({
        "seq_no" : this.result.seq_no,
        "court_running": this.result.court_running,
        "court_id": this.result.court_id,
        "prov_id": this.result.prov_id,
        "prov_name": this.result.prov_name,
        "amphur_id": this.result.amphur_id,
        "amphur_name": this.result.amphur_name,
        "tambon_id": this.result.tambon_id,
        "tambon_name": this.result.tambon_name,
        "moo": this.result.moo,
        "amtsentnotice": this.curencyFormatRemove(this.result.amtsentnotice),
        "start_date": this.result.start_date,
        "end_date": this.result.end_date,
        "remark": this.result.remark,
        "userToken" : this.userData.userToken
      });
    //  console.log("student=>", student);
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1410/saveJson', student ).subscribe(
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
                  // this.SpinnerService.hide();
                }
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
                if (resp.success==true){
                  // $("button[type='reset']")[0].click();
                }
                subscription.unsubscribe();
              });
              this.getData();
              }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  //บันทึกข้อมูลหมายเหตุศาล
  submitCourtRemark(){
    this.modelType = "";
    var remark = JSON.parse(this.remark.ChildTestCmp());

    this.openbutton.nativeElement.click();

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(this.result.court_running){
      this.SpinnerService.show();

      var student = JSON.stringify({
        "court_running": remark.court_running,
        "notice_amt_remark": remark.notice_amt_remark,
        "userToken" : this.userData.userToken
      });
    //  console.log("submitCourtRemark student=>", student);
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1410/updateCourtRemark', student ).subscribe(
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
                subscription.unsubscribe();
              });
            }else{
              this.SpinnerService.hide();
              confirmBox.setMessage("ข้อมูลหมายเหตุศาล "+alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){}
                subscription.unsubscribe();
              });
              this.getData();
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  editData(index:any){
    // console.log("editData", this.posts[index]['amtsentnotice'])
    this.SpinnerService.show();

    this.result.seq_no = this.posts[index]['seq_no'];
    this.result.court_running  = this.posts[index]['court_running'];
    this.result.court_id  = this.posts[index]['court_id'];
    this.result.notice_amt_remark  = this.posts[index]['notice_amt_remark'];
    this.result.prov_id  = this.posts[index]['prov_id'];
    this.result.prov_name  = this.posts[index]['prov_name1'];
    this.result.amphur_id  = this.posts[index]['amphur_id'];
    this.result.tambon_id  = this.posts[index]['tambon_id'];
    this.result.moo  = this.posts[index]['moo'];
    this.result.amtsentnotice  = this.posts[index]['amtsentnotice'];
    this.result.start_date  = this.posts[index]['start_date'];
    this.result.end_date  = this.posts[index]['end_date'];
    this.result.remark  = this.posts[index]['remark'];

    if(this.result.prov_id){
      if(!this.posts[index]['amphur_id'])
        this.sAmphur.clearModel();
      if(!this.posts[index]['tambon_id'])
        this.sTambon.clearModel();

      this.changeProv(this.result.prov_id,'');
    }
    else{
      this.sAmphur.clearModel();
      this.sTambon.clearModel();
    }
    this.edit_amphur_id = this.posts[index]['amphur_id'];
    this.edit_tambon_id = this.posts[index]['tambon_id'];

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  searchData() {
    // console.log("searchData court_running=>", this.result.court_running);
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.court_running){
      confirmBox.setMessage('กรุณาระบุศาลที่ต้องการค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('prov_id');
        }
        subscription.unsubscribe();
      });

    }else{
      var student = JSON.stringify({
        "court_running": this.result.court_running,
        "prov_id" : this.result.prov_id,
        "amphur_id" : this.result.amphur_id,
        "tambon_id" : this.result.tambon_id,
        "userToken" : this.userData.userToken
      });
      // console.log("student",student);

      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1410/search', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
        // console.log("productsJson=>", productsJson);
          if(productsJson.result==1){
            var bar = new Promise((resolve, reject) => {
              productsJson.data.forEach((ele, index, array) => {
                  if(ele.amtsentnotice != null){
                    productsJson.data[index]['amtsentnotice'] = this.curencyFormat(ele.amtsentnotice, 2);
                  }
                });
            });
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit1410 = false);
              this.rerender();
          }
        },
        (error) => {}
      );
    }
  }


  confirmBox() {
    var isChecked = this.posts.every(function(item:any) {
      return item.edit1410 == false;
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
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
         // console.log(productsJson)
          if(productsJson.result==1){
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
                      if(ele.edit1410 == true){
                        dataTmp.push(this.posts[index]);
                      }
                    });
                });
                if(bar){
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  // console.log("data=>", data);
                  this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1410/deleteDataSelect', data ).subscribe(
                  (response) =>{
                    let alertMessage : any = JSON.parse(JSON.stringify(response));
                    if(alertMessage.result==0){
                      this.SpinnerService.hide();
                    }else{
                      this.closebutton.nativeElement.click();
                      this.getData();
                    }
                  },
                  (error) => {this.SpinnerService.hide();}
                  )
                }
              } subscription.unsubscribe();
              });
            }else{
              confirmBox.setMessage(productsJson.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                 }
                subscription.unsubscribe();
              });
            }
          }, (error) => {}
        );
    }
  }

  //กำหนดค่านำหมาย/หมายเหตุให้กับข้อมูลที่เลือก
  assignData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ต้องการกำหนดค่านำหมาย/หมายเหตุให้กับข้อมูลที่เลือก');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

    // Choose layout color type
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
         // console.log(" this.posts=>",  this.posts);
          var dataDel = [],dataTmp=[];
          var bar = new Promise((resolve, reject) => {
            this.posts.forEach((ele, index, array) => {
              if(ele.edit1410 == true){

                var student = {
                  "seq_no" : this.posts[index].seq_no,
                  "court_running" : this.posts[index].court_running,
                  "prov_id" : this.posts[index].prov_id,
                  "tambon_id" : this.posts[index].tambon_id,
                  "amtsentnotice" : this.result.assign_amt,
                  "remark" : this.result.assign_remark,
                };
                dataTmp.push(student);
              }
            });
          });
          if(bar){
            dataDel['userToken'] = this.userData.userToken;
            dataDel['data'] = dataTmp;
            var data = $.extend({}, dataDel);
           // console.log("data=>", data);
            this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1410/assignData', data ).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              if(alertMessage.result==0){
                this.SpinnerService.hide();
              }else{
                this.closebutton.nativeElement.click();
                this.getData();
              }
            },(error) => {this.SpinnerService.hide();}
            )
          }
        } subscription.unsubscribe();
      });
  }

  printReport(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.court_running){
      confirmBox.setMessage('กรุณาเลือกศาลก่อนสั่งพิมพ์');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });

    }else{
      var rptName = 'rsn1410';
      // For no parameter : paramData ='{}'
      var paramData ='{}';
      // For set parameter to report
      // console.log("searchData court_running=>", this.result.court_running);

      // var paramData = JSON.stringify({
      //   "pcourt_id" : this.result.court_running ? this.result.court_running : ""
      // });

      var paramData = JSON.stringify({
        "pcourt_running" : this.result.court_running ? parseInt(this.result.court_running) : "",
        "pcourt_id" : this.result.court_id ? this.result.court_id : ""
      });
      console.log("paramData=>",paramData);
      this.printReportService.printReport(rptName,paramData);
    }
  }

  loadTableComponent(val:any){
    this.loadComponent = true;
    this.loadModalComponent = false;
    this.loadCourtRemarkComponent = false;

    $("#exampleModal").find(".modal-body").css("height","auto");
  }

  changeProv(province:any,type:any){//จังหวัด

    var student = JSON.stringify({
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "condition" : " AND prov_id='"+province+"'",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAmphur = getDataOptions;
        setTimeout(() => {
          if(this.edit_amphur_id&&!this.result.amphur_id){
            this.result.amphur_id = this.edit_amphur_id;
          }

          if(this.edit_amphur_id){
            this.changeAmphur(this.result.amphur_id,type);
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

  changeAmphur(Amphur:any,type:any){//อำเภอ
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.result.prov_id+"'",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTambon = getDataOptions;
        setTimeout(() => {
          if(this.edit_tambon_id){
            this.result.tambon_id = this.edit_tambon_id;
          }
        }, 100);
      },
      (error) => {}
    )
    if(typeof Amphur=='undefined' || type==1){
      this.sTambon.clearModel();
    }
  }

  getData(){
    this.setDefForm();//
    // console.log("searchData court_running=>", this.result.court_running);

    var student = JSON.stringify({
      "court_running": this.result.court_running,
      "prov_id" : this.result.prov_id,
      "amphur_id" : this.result.amphur_id,
      "tambon_id" : this.result.tambon_id,
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1410/search', student).subscribe(posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));
      // console.log(productsJson)
      this.posts = productsJson.data;
      if(productsJson.result==1){
        var bar = new Promise((resolve, reject) => {
          productsJson.data.forEach((ele, index, array) => {
            if(ele.amtsentnotice != null){
              productsJson.data[index]['amtsentnotice'] = this.curencyFormat(ele.amtsentnotice, 2);
            }
          });
        });

        this.checklist = this.posts;
        if(productsJson.data.length)
          this.posts.forEach((x : any ) => x.edit1410 = false);
        this.rerender();
      }
    });
  }

  importData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ยืนยัน');
    confirmBox.setMessage('ระหว่างการนำเข้าอัตราค่านำหมาย จะไม่สามารถใช้ข้อมูลอัตราค่านำหมายได้ กรุณาดำเนินการนอกเวลาราชการ');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.INFO // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
      }
      subscription.unsubscribe();
    });

  }
}
