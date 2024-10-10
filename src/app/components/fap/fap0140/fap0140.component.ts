import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
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
import { PrintReportService } from 'src/app/services/print-report.service';
// import { viewClassName } from '@angular/compiler';

@Component({
  selector: 'app-fap0140,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fap0140.component.html',
  styleUrls: ['./fap0140.component.css']
})


export class Fap0140Component implements AfterViewInit, OnInit, OnDestroy {

  title:any;

  posts:any;
  std_id:any;
  std_prov_name:any;
  delList:any=[];
  dataSearch:any=[];
  search:any;
  masterSelected:boolean;
  checklist:any;
  checklist2:any;
  sessData:any;
  userData:any;
  myExtObject:any;
  programName:string;
  dep_code:any;
  dep_name:any;
  getMonthTh:any;
  getDep:any;
  getOff:any;
  dep_id:any;
  off_id:any;
  getTableId:any;
  Datalist:any;
  defaultCaseType:any;
   //------
  result:any=[];
  fileToUpload1: File = null;
  // dataHead:any = [];
  // run_id:any;
  // reqRunning:any;
  items:any = [];
  // getReq:any;
  // req_id:any;
  // modalType:any;


  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  masterSelect:boolean = false;
  // @ViewChild('prov_id',{static: true}) prov_id : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('form_id',{static: true}) form_id : ElementRef;
  @ViewChild('form_desc',{static: true}) form_desc : ElementRef;


  @ViewChild('crudModal') crudModal: ElementRef;
  //@ViewChild('file1',{static: true}) file1: ElementRef;
  @ViewChild('inputFile') myInputVariable: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;

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

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    // const confirmBox = new ConfirmBoxInitializer();
    // confirmBox.setTitle('ข้อความแจ้งเตือน');

    // var student = JSON.stringify({
    //   "userToken" : this.userData.userToken
    // });

    //   this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0140/getData', student).subscribe(posts => {
    //   let productsJson : any = JSON.parse(JSON.stringify(posts));
    //   this.posts = productsJson.data;
    //   // this.items = productsJson.data;
    //   // console.log("items", this.items);
    //   console.log("productsJson=>", posts);

    //   if(productsJson.result==1){
    //     this.checklist = this.posts;
    //     // this.checklist2 = this.posts;
    //     if(productsJson.data.length)
    //       this.posts.forEach((x : any ) => x.edit0140 = false);
    //     this.rerender();
    //   }else{
    //     confirmBox.setMessage(productsJson.error);
    //     confirmBox.setButtonLabels('ตกลง');
    //     confirmBox.setConfig({
    //         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //     });
    //     const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //       if (resp.success==true){}
    //       subscription.unsubscribe();
    //     });
    //   }
    //     this.SpinnerService.hide();
    // });

    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fap0140"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        console.log(getDataAuthen)
      },
      (error) => {}
    )

     //======================== pdepartment ======================================
     var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "field_name2" : "print_dep_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
        this.getDep.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        console.log(this.getDep)
        // var Dep = this.getDep.filter((x:any) => x.fieldIdValue === this.userData.depCode.toString()) ;
        // if(Dep.length!=0){
        //   this.result.dep_id = this.dep_id = Dep[0].fieldIdValue;
        // }
      },
      (error) => {}
    )

       //======================== pappoint_table ======================================
    var Json = JSON.stringify({
      "table_name" : "pappoint_table",
      "field_id" : "table_id",
      "field_name" : "table_name",
      // "condition"  : "AND table_type = 2",
      "userToken" : this.userData.userToken
    });
      console.log(Json);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json ).subscribe(
      (response) =>{
        // console.log('xxxxxxxxxxx'+response);
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue:'ไม่เลือก'});
        this.getTableId = getDataOptions;
        // this.getTableId.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )

    this.getMonthTh = [{"fieldIdValue": '0', "fieldNameValue": "ทุกเดือน"},
    {"fieldIdValue": '1', "fieldNameValue": "มกราคม"},
    {"fieldIdValue": '2', "fieldNameValue": "กุมภาพันธ์"},
    {"fieldIdValue": '3',"fieldNameValue": "มีนาคม"},
    {"fieldIdValue": '4',"fieldNameValue": "เมษายน"},
    {"fieldIdValue": '5',"fieldNameValue": "พฤษภาคม"},
    {"fieldIdValue": '6',"fieldNameValue": "มิถุนายน"},
    {"fieldIdValue": '7',"fieldNameValue": "กรกฎาคม"},
    {"fieldIdValue": '8',"fieldNameValue": "สิงหาคม"},
    {"fieldIdValue": '9',"fieldNameValue": "กันยายน"},
    {"fieldIdValue": '10',"fieldNameValue": "ตุลาคม"},
    {"fieldIdValue": '11',"fieldNameValue": "พฤศจิกายน"},
    {"fieldIdValue": '12',"fieldNameValue": "ธันวาคม"}];

    this.result.month = parseInt(myExtObject.curMonth()).toString();
    this.result.year = myExtObject.curYear();
    this.result.alert_qty = 30;
    this.result.pw_qty = 35;
    this.result.appoint_qty = 40;
    this.result.table_id = 0;
  }

  AssignYear(event:any){
   if(event == 0){
      this.result.year2 = myExtObject.curYear();
    }else{
      this.result.year2 = '';
    }
  }

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
     //  alert(val.length);
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
    const ele = this.form_id.nativeElement[name];
    // console.log("name=>", name);
    // console.log("ele=>", ele);
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0140 = this.masterSelected;
      }

      //console.log("checkUncheckAll=>", this.checklist[i].edit0140);
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0140 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0140 = false;
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
       })
    }, 100);

  }

  receiveFuncListData(event:any){
    this.dep_code = event.fieldIdValue;
    this.dep_name = event.fieldNameValue;
    this.closebutton.nativeElement.click();
    console.log(event)
  }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }


  // save update Data
  submitForm(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var del = 0;
  var bar = new Promise((resolve, reject) => {
    this.dataSearch.forEach((ele, index, array) => {
      if(ele.edit0140 == true){
        del++;
      }
    });
  });
      //  alert(del);
    if(bar){

    if (!del) {
      confirmBox.setMessage('ไม่มีข้อมูลเปลี่ยนแปลง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
        if (resp.success == true) {
          //this.SpinnerService.hide();

        }
        subscription.unsubscribe();
      });

    } else {

      var dataTmp = [],dataSave = [];
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
              if(ele.edit0140 == true){
                dataTmp.push(this.dataSearch[index]);
              }
          });
      });
      if(bar){
        dataSave['data'] = dataTmp;
        dataSave['userToken'] = this.userData.userToken;
        var data = $.extend({}, dataSave);
        console.log(JSON.stringify(data));
      this.SpinnerService.show();

        this.http
          .post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0140/saveData', data, {

          })
          .subscribe(
            (response) => {
              let alertMessage: any = JSON.parse(JSON.stringify(response));
              console.log(alertMessage);
              if (alertMessage.result == 0) {
                this.SpinnerService.hide();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox
                  .openConfirmBox$()
                  .subscribe((resp) => {
                    if (resp.success == true) {
                      //this.SpinnerService.hide();
                    }
                    subscription.unsubscribe();
                  });
              } else {
                this.SpinnerService.hide();
                confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS, // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox
                  .openConfirmBox$()
                  .subscribe((resp) => {

                    if (resp.success == true) {
                      this.searchData();
                      // $("button[type='reset']")[0].click();
                      //this.SpinnerService.hide();
                    }
                    subscription.unsubscribe();
                  });
                //  this.ngOnInit();
                //this.form.reset();
                // $("button[type='reset']")[0].click();
              }
            },
            (error) => {
              this.SpinnerService.hide();
            }
          );
      // }
      }
    }
    }
  }

  genarateData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.table_id){
      confirmBox.setMessage('กรุณาระบุรหัส');
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
      this.SpinnerService.show();

      var formData = [];

      formData = this.result;
      console.log("formData=>", formData);
      var data = $.extend({},formData);
          data['userToken'] = this.userData.userToken;
      console.log(JSON.stringify(data));
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0140/generateData', data ).subscribe(
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
                  $("button[type='reset']")[0].click();
                }
                subscription.unsubscribe();
              });
              // this.ngOnInit();
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }


  editData(index:any){
    //console.log("editData index=>", index)
    // this.SpinnerService.show();
    this.result.edit_table_id  = this.posts[index]['table_id'];
    this.result.table_id  = this.posts[index]['table_id'];
    this.result.dep_id = this.posts[index]['dep_id'];
    this.result.month = this.posts[index]['appoint_date'].getMonth();
    this.result.year = this.posts[index]['appoint_date'].getFullYear();
    this.result.alert_qty = this.posts[index]['alert_qty'];
    this.result.pw_qty = this.posts[index]['pw_qty'];
    this.result.appoint_qty = this.posts[index]['appoint_qty'];
    //set display image file word
    // if(this.posts[index]['file_exists'])
    //   $("body").find("i[id='imgWord']").css("display", "");
    // else
    //   $("body").find("i[id='imgWord']").css("display", "none");


    // setTimeout(() => {
    //   this.SpinnerService.hide();
    // }, 500);

  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();

      var student = JSON.stringify({
      "table_id" : this.result.table_id,
      "dep_code" : this.result.dep_id,
      "month" : this.result.month,
      "year" : this.result.year,
      "year2" : this.result.year2,
      "userToken" : this.userData.userToken
      });
      console.log(student);
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0140/getData', student ).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(posts);

          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
            this.dataSearch = productsJson.data;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit0140 = false);
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
    var isChecked = this.posts.every(function(item:any) {
      return item.edit0140 == false;
    })

    // console.log("isChecked", isChecked);
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

  checkUpdate(index:any){
    this.dataSearch[index]['edit0140'] = true;
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
   }

   directiveDateArry(date:any,obj:any,index:any){
    console.log(date.target.value)
    this.dataSearch[index][obj] = date.target.value;
  }

  loadMyChildComponent(){
    this.loadComponent = true;
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
                          if(ele.edit0140 == true){
                            dataTmp.push(this.posts[index]);
                          }
                      });
                  });
                  if(bar){
                    // console.log("dataTmp=>", dataTmp);
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    // console.log("delete=>",data)
                   this.http.post('/'+this.userData.appName+'ApiCT/API/fap0140/deleteDataSelect', data ).subscribe(
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


  printReport(){
    var rptName = 'rap0140';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "ptable_id" : this.result.table_id ? this.result.table_id.toString() : '',
      "pdep_code" : this.result.dep_id ? this.result.dep_id : '',
      "pmonth" : this.result.month,
      "pyear" : this.result.year ? this.result.year : '',
      "pyear2" : this.result.year2 ? this.result.year2 : '',
    });
    console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  loadTableComponent(val:any){
    this.loadModalComponent = false;
    this.loadComponent = true;
    $("#exampleModal").find(".modal-body").css("height","auto");
 }

  closeModal(){
    $('.modal')
    .find("input[type='text'],input[type='password'],textarea,select")
    .val('')
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();
  }

  // displayImgWord(){

  // }

  getData(){
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();

      var student = JSON.stringify({
        "table_id" : this.result.table_id,
        "userToken" : this.userData.userToken
      });

      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0140/getData', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          //console.log(productsJson)
          this.posts = productsJson.data;
          //console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0140 = false);
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

  onFileChange(e:any,type:any) {
    if(e.target.files.length){
      this.fileToUpload1 = e.target.files[0];
      var fileName = e.target.files[0].name;

      // console.log("fileToUpload1=>", this.fileToUpload1);
      // console.log("fileName=>", fileName);
      $(e.target).parent('div').find('label').html(fileName);
    }else{
      this.fileToUpload1 =  null;
      $(e.target).parent('div').find('label').html('');
    }
  }

  clickOpenFile(index:any){
    let winURL = window.location.host;
    // console.log("index=>", index);
    // console.log("posts index=>", this.posts[index]);
    //console.log("index form_id=>", this.posts[index].form_id);

    winURL = winURL+'/'+this.userData.appName+"ApiCT/API/fap0140/openNoticeForm";
    myExtObject.OpenWindowMax("http://"+winURL+'?form_id='+this.posts[index].form_id);
  }

  runFormId(index:any){
    if(!index){
      var student = JSON.stringify({
        "userToken" : this.userData.userToken
      });

      this.http.post('/'+this.userData.appName+'ApiCT/API/fap0140/runFormId', student).subscribe(posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        //this.posts = productsJson.data;
        // console.log("productsJson.result=>", productsJson.result);
        // console.log("productsJson.result=>", productsJson.form_id);
        if(productsJson.result==1){
          this.result.form_id=productsJson.form_id;
        }
      });
    }
  }
}
