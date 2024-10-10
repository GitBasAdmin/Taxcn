import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, ignoreElements, map , } from 'rxjs/operators';
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
  selector: 'app-fct0426,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0426.component.html',
  styleUrls: ['./fct0426.component.css']
})


export class Fct0426Component implements AfterViewInit, OnInit, OnDestroy {

  title:any;

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
  myExtObject:any;
  programName:string;

  Datalist:any;
  result:any=[];
  headObj:any=[];
  getsFormType:any;
  getsDepUse:any;
  getContentType:any;
  dataValue:any = [];
  fileToUpload1: File = null;
  dataDeleteSelect:any=[];


  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
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
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      processing: true,
      searching : false,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.setDefault();

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });

    if(this.userData.userLevel != 'A')
      student['dep_use'] = this.userData.depCode;

    this.http.post('/'+this.userData.appName+'ApiCT/API/fct0426', student).subscribe(posts => {
    let productsJson : any = JSON.parse(JSON.stringify(posts));
    this.posts = productsJson.data;
    //console.log("productsJson=>", productsJson.data);
    if(productsJson.result==1){
      var bar = new Promise((resolve, reject) => {
        productsJson.data.forEach((ele, index, array) => {
                if(ele.dep_use == null){
                  productsJson.data[index]['dep_use'] = 0; 
                }
            });
       });
      this.checklist = this.posts;
      if(productsJson.data.length)
        this.posts.forEach((x : any ) => x.edit0426 = false);
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

    //======================== authen ======================================
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fct0426"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        console.log(getDataAuthen)
      },
      (error) => {}
    )
    //======================== sFormType =====================================
    this.getsFormType = [{fieldIdValue:1,fieldNameValue: 'รายงานกระบวน'}, 
    {fieldIdValue:2,fieldNameValue: 'รายงานเจ้าหน้าที่'},
    {fieldIdValue:3,fieldNameValue: 'ประกาศ'},
    // {fieldIdValue:4,fieldNameValue: 'หมาย'},
    {fieldIdValue:5,fieldNameValue: 'คำให้การพยาน'},
    {fieldIdValue:6,fieldNameValue: 'ปฏิบัติงานพิเศษ'},
    {fieldIdValue:8,fieldNameValue: 'ใบรับเงิน/สิ่งของ'},
    {fieldIdValue:10,fieldNameValue: 'สัญญาประกัน'},
    {fieldIdValue:13,fieldNameValue: 'คำร้องขอปล่อยชั่วคราว'},
    {fieldIdValue:9,fieldNameValue: 'อื่นๆ'},
    {fieldIdValue:11,fieldNameValue: 'คำพิพากษา'},
    {fieldIdValue:12,fieldNameValue: 'บันทึกข้อความ'},
    {fieldIdValue:14,fieldNameValue: 'คำพิพากษารับสารภาพ'},
    {fieldIdValue:15,fieldNameValue: 'เวรปฏิบัติการ'},
    {fieldIdValue:16,fieldNameValue: 'คำร้องขอถอนประกัน'},
    {fieldIdValue:17,fieldNameValue: 'คำให้การจำเลย'},
    {fieldIdValue:18,fieldNameValue: 'หนังสือแนบท้ายสัญญา'}];

    //======================== pword_form ======================================
    var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "order_by": " dep_code ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ใช้ทุกแผนก'});
        this.getsDepUse = getDataOptions;
      },
      (error) => {}
    )
  }

  setDefault(){
    this.result=[];
    this.headObj.sform_type = 1;
    this.headObj.sdep_use = 0;
    this.result.form_type = 1;
    this.result.dep_use = 0;
    $('s_file').parent('div').find('label').html('');
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
    // const ele = this.fct0426.nativeElement[name];
    // console.log("name=>", this.fct0426.nativeElement);
    // console.log("ele=>", ele);
    // if (ele) {
    //   ele.focus();
    // }
  }


  ClearAll(){
    window.location.reload();
  }

  //startDate , endDate
  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  receiveFuncListData(event:any){
    this.result.post_id = event.fieldIdValue;
    this.result.position = event.fieldNameValue;
    this.closebutton.nativeElement.click();
    // console.log(event)
  }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }
  
  // save update Data
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.form_name){
      confirmBox.setMessage('กรุณาระบุชื่อแบบรายงาน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        // if (resp.success==true){
        //   this.setFocus('form_name');
        // }
        subscription.unsubscribe();
      });
    }else  if(!this.result.form_type){
      confirmBox.setMessage('กรุณาระบุประเภท');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        // if (resp.success==true){
        //   this.setFocus('form_type');
        // }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      if(this.result.dep_use == 0)
        this.result.dep_use = null;

      var formData = new FormData();
      this.result['number_format'] = 2;
      this.result['userToken'] = this.userData.userToken;
      formData.append('file', this.fileToUpload1);
      formData.append('data', JSON.stringify($.extend({}, this.result)));
      // console.log("formData=>", formData.get('data'));
      // console.log("formfile=>", formData.get('file'));
      this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct0426/saveData', formData ).subscribe(
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
              this.ngOnInit();
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  editData(column:any, index:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(column == "form_name" && !this.posts[index]['form_name']){
      confirmBox.setMessage('กรุณาระบุชื่อแบบรายงาน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        // if (resp.success==true){
        //   this.setFocus('form_name');
        // }
        subscription.unsubscribe();
      });
    }else  if(column == "form_type" && !this.posts[index]['form_type']){
      confirmBox.setMessage('กรุณาระบุประเภท');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        // if (resp.success==true){
        //   this.setFocus('form_type');
        // }
        subscription.unsubscribe();
      });
    }else  if(column == "dep_use" && this.posts[index]['dep_use']== null){
      confirmBox.setMessage('กรุณาระบุแผนกที่ใช้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        // if (resp.success==true){
        //   this.setFocus('form_type');
        // }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      var student = [];
      student["form_running"] =this.posts[index]['form_running'];
      student["form_id"] =this.posts[index]['form_id'];

      if(column == "form_type"){
        student["form_type"] = this.posts[index][column];
      }else if(column == "dep_use"){
        if(this.posts[index][column] == 0){
          student["dep_use"] = null;
        }else{
          student["dep_use"] = this.posts[index][column];
        }
      }else if(column == "form_name"){
        student["form_name"] = this.posts[index][column];
      }else if(column == "form_add"){
        student["form_add"] = this.posts[index][column];
      }
      
      student["userToken"] =this.userData.userToken;
  
      var formData = new FormData();
      formData.append('file', this.fileToUpload1);
      formData.append('data', JSON.stringify($.extend({}, student)));
      // console.log("formData=>", formData.get('data'));
      // console.log("formfile=>", formData.get('file'));
      this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct0426/saveData', formData ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          // console.log("result=>", alertMessage.result);
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
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  if(column == "form_type" || column == "dep_use" || column == "s_file")
                    this.ngOnInit();
                }
                subscription.unsubscribe();
              });
              
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  onFileChange(e:any,type:any, index:any) {
    this.fileToUpload1 =null;

    if(e.target.files.length){
      this.fileToUpload1 = e.target.files[0];
      var fileName = e.target.files[0].name;
      $(e.target).parent('div').find('label').html(fileName);
    }else{
      this.fileToUpload1 =  null;
      $(e.target).parent('div').find('label').html('');
    }
    if(type=='s_file')
      this.editData('s_file', index);
  }

  clickOpenFile(index:any){
    let winURL = window.location.host;
    winURL = winURL+'/'+this.userData.appName+"ApiCT/API/fct0426/openGeneralForm";
    myExtObject.OpenWindowMax("http://"+winURL+'?form_running='+this.posts[index].form_running);
  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();
    
      var student = JSON.stringify({
      "form_type" : this.headObj.sform_type,
      "dep_use" : this.headObj.sdep_use,
      "userToken" : this.userData.userToken
      });

      if(this.userData.userLevel != 'A')
        student['dep_use'] = this.userData.depCode;

      // console.log("searchData=>",student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0426/search', student ).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          
          if(productsJson.result==1){

            var bar = new Promise((resolve, reject) => {
              productsJson.data.forEach((ele, index, array) => {
                      if(ele.dep_use == null){
                        productsJson.data[index]['dep_use'] = 0; 
                      }
                  });
             });

            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit0426 = false);
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
      return item.edit0426 == false;
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


  loadMyChildComponent(){
    this.loadComponent = true;
  }

  deleteData(index:any){ 
    // console.log("deleteData=>", this.posts[index]);
    this.dataDeleteSelect=[];
    this.dataDeleteSelect = this.posts[index];
    const confirmBox = new ConfirmBoxInitializer();
    // console.log("dataDeleteSelect=>", this.dataDeleteSelect);

    this.openbutton.nativeElement.click();
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

                var data = this.dataDeleteSelect;
                data["userToken"] = this.userData.userToken;
                // console.log("data=>",data)
                this.http.post('/'+this.userData.appName+'ApiCT/API/fct0426/deleteData', data).subscribe(
                (response) =>{
                  let alertMessage : any = JSON.parse(JSON.stringify(response));
                  // console.log("delete=>",alertMessage.result)

                  if(alertMessage.result==0){
                    this.SpinnerService.hide();
                  }else{

                    this.closebutton.nativeElement.click();
                    // $("button[type='reset']")[0].click();
                    this.ngOnInit();
                  }
                },
                (error) => {this.SpinnerService.hide();}
                )
              }
              subscription.unsubscribe();
            });
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

  printReport(){
    var rptName = 'rct0426';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprov_id" : this.prov_id.nativeElement["prov_id"].value,
    //   "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    // });
    this.printReportService.printReport(rptName,paramData);
  }

  loadTableComponent(){
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

  getData(){
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();

      var student = JSON.stringify({
        "userToken" : this.userData.userToken
      });
      if(this.userData.userLevel != 'A')
        student['dep_use'] = this.userData.depCode; 
      
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0426', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          //console.log(productsJson)
          this.posts = productsJson.data;
          //console.log(this.posts);
          if(productsJson.result==1){
            var bar = new Promise((resolve, reject) => {
              productsJson.data.forEach((ele, index, array) => {
                      if(ele.dep_use == null){
                        productsJson.data[index]['dep_use'] = 0; 
                      }
                  });
             });

            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0426 = false);
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

  closeWindow(){
    if(window.close() == undefined){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบหน้าจอหลัก ไม่สามารถปิดหน้าจอได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
    else
      window.close();
  }
}
