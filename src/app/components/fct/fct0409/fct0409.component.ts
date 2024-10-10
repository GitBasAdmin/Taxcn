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
import { ModalWitnessComponent } from '../../modal/modal-witness/modal-witness.component';
import { PrintReportService } from 'src/app/services/print-report.service';
// import { viewClassName } from '@angular/compiler';

@Component({
  selector: 'app-fct0409,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0409.component.html',
  styleUrls: ['./fct0409.component.css']
})


export class Fct0409Component implements AfterViewInit, OnInit, OnDestroy {

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
  modalType:any;
  list_dep_use:any;
  list_dep_use_name:any;
  modalIndex:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldSelect:any;
  public listMessage:any;
  
  


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadMutipleComponent : boolean = false; //popup SendList
  public loadWitnessComponent : boolean = false; //popup modal-witness
  

  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild( ModalWitnessComponent ) witness: ModalWitnessComponent ;

  

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

    this.result=[];
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    // console.log("this.userData", this.userData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiCT/API/fct0409', student).subscribe(posts => {
    let productsJson : any = JSON.parse(JSON.stringify(posts));
    this.posts = productsJson.data;
    // console.log("productsJson=>", productsJson.data);
    if(productsJson.result==1){
      var bar = new Promise((resolve, reject) => {
        productsJson.data.forEach((ele, index, array) => {
              if(ele.count_dep_use == null){
                productsJson.data[index]['dep_name1'] = "ใช่ร่วมกันทุกแผนก"; 

              }else if(ele.count_dep_use > 1){
                  productsJson.data[index]['dep_name1'] = "ใช่ทั้งหมด "+productsJson.data[index]['count_dep_use']+" แผนก"; 
              }else{
                productsJson.data[index]['dep_name1'] = ele.dep_name; 
              }

              productsJson.data[index]['witness_message_sub'] = "";
              if(ele.witness_message != null){
                productsJson.data[index]['witness_message_sub'] = productsJson.data[index]['witness_message'].substring(0, 56)+"..."; 
              }
          });
       });
    // console.log("productsJson=>", productsJson.data);

      this.checklist = this.posts;
      if(productsJson.data.length)
        this.posts.forEach((x : any ) => x.edit0409 = false);
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
      "url_name" : "fct0409"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        // console.log(getDataAuthen)
      },
      (error) => {}
    )
    var student = JSON.stringify({
      "table_name" : "pcontent_type",
      "field_id" : "content_type_id",
      "field_name" : "content_type_name",
      "order_by": " content_type_id ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:"",fieldNameValue: ''});
        this.getContentType = getDataOptions;
      },
      (error) => {}
    )
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
    // const ele = this.fct0409.nativeElement[name];
    // console.log("name=>", this.fct0409.nativeElement);
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
    this.list_dep_use = event.fieldIdValue.toString();
    this.list_dep_use_name = event.fieldNameValue;
    this.closebutton.nativeElement.click();
    // console.log("receiveFuncListData=>",event);
    if(this.modalType == 1)
      this.saveContentFormMapping();

  }

  saveContentFormMapping(){

    // console.log("data=>",student)
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();

    var student = JSON.stringify({
      "form_running" : this.posts[this.modalIndex].form_running,
      "dep_use" :  this.list_dep_use,
      "userToken" : this.userData.userToken
    });
    
    var formData = new FormData();
    formData.append('file', null);
    formData.append('data', student);
    // console.log("formfile=>", formData);
    // console.log("formfile=>", formData.get('data'));
    this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct0409/updateMappingData', formData ).subscribe(
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
                // $("button[type='reset']")[0].click();
              }
              subscription.unsubscribe();
            });
            this.ngOnInit();
          }
      },
      (error) => {this.SpinnerService.hide();}
    )
  }

  loadMyModalComponent(){
    // console.log("loadMyModalComponent==>",this.modalType);
    if(this.modalType==1){
      var student = JSON.stringify({
        "table_name" : "pdepartment",
        "field_id" : "dep_code",
        "field_name" : "dep_name",
        "userToken" : this.userData.userToken
      });

      this.listTable='pdepartment';
      this.listFieldId='dep_code';
      this.listFieldName='dep_name';
      this.listFieldNull="";
      this.listFieldCond="";
      this.listFieldSelect=this.posts[this.modalIndex].list_dep_use;

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;

          this.loadComponent = false;
          this.loadModalComponent = false;
          this.loadWitnessComponent = false;
          this.loadMutipleComponent = true;
        },
        (error) => {}
      )
    }else if(this.modalType==2){
      // console.log("type", this.posts[this.modalIndex].witness_message);
      this.listMessage =this.posts[this.modalIndex].witness_message;

      this.loadComponent = false;
      this.loadModalComponent = false;
      this.loadWitnessComponent = true;
      this.loadMutipleComponent = false;
      
    }else{
      this.loadComponent = false;
      this.loadModalComponent = true;
      this.loadWitnessComponent = false;
      this.loadMutipleComponent = false;
    }
    $("#exampleModal").find(".modal-content").css("width","690px");

  }

  clickOpenMyModalComponent(index:any,type:any){
    this.modalType=type;
    this.modalIndex=index;

    this.openbutton.nativeElement.click();
  }

  getDataWitness(){
    var message = this.witness.ChildTestCmp();
    // console.log("message=>", message);
    if(message){
      this.posts[this.modalIndex].witness_message = message;
      this.posts[this.modalIndex].witness_message_sub = message.substring(0, 56)+"...";
    }else{
      this.posts[this.modalIndex].witness_message = message;
      this.posts[this.modalIndex].witness_message_sub = message;
    }
    
    this.openbutton.nativeElement.click();
    this.closeModal();
    this.editData('witness_message', this.modalIndex);

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
        if (resp.success==true){
          // this.setFocus('form_name');
        }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      var formData = new FormData();
      this.result['number_format'] = 2;
      this.result['userToken'] = this.userData.userToken;
      formData.append('file', this.fileToUpload1);
      formData.append('data', JSON.stringify($.extend({}, this.result)));
      // console.log("formData=>", formData.get('data'));
      // console.log("formfile=>", formData.get('file'));
      this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct0409/saveData', formData ).subscribe(
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
      confirmBox.setMessage('กรุณาระบุชื่อเรื่อง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('form_name');
        }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      var student = [];
      student["form_running"] =this.posts[index]['form_running'];

      if(column == "form_name"){
        student["form_name"] = this.posts[index][column];
      }else if(column == "thing"){
        student["thing"] = this.posts[index][column];

      }else if(column == "thing2"){
        student["thing2"] = this.posts[index][column];

      }else if(column == "thing3"){
        student["thing3"] = this.posts[index][column];
      }else if(column == "content_type"){
        if(this.posts[index][column] == 0){
          student["content_type"] = null;
        }else{
          student["content_type"] = this.posts[index][column];
        }

        //content_type != แจ้งเตือนพยาน delete witness_message
        if(this.posts[index][column] != 5){
          this.posts[index]["witness_message"]="";
          this.posts[index]["witness_message_sub"]="";
          student["witness_message"] = "";
        }

      }else if(column == "report_to"){
        if(this.posts[index][column] == 0){
          student["report_to"] = null;
        }else{
          student["report_to"] = this.posts[index][column];
        }

      }else if(column == "form_add"){
        student["form_add"] = this.posts[index][column];
      }else if(column == "witness_message"){
        student["witness_message"] = this.posts[index][column];
      }
      
      student["userToken"] =this.userData.userToken;
  
      var formData = new FormData();
      formData.append('file', this.fileToUpload1);
      formData.append('data', JSON.stringify($.extend({}, student)));
      // console.log("formData=>", formData.get('data'));
      // console.log("formfile=>", formData.get('file'));
      this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct0409/saveData', formData ).subscribe(
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
                // $("button[type='reset']")[0].click();
              }
              subscription.unsubscribe();
            });
            if(column == "s_file"){
              this.ngOnInit();
            }
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
    // setTimeout(() => {
    //   this.SpinnerService.hide();
    // }, 500);
  }

  onFileChange(e:any,type:any, index:any) {
    this.fileToUpload1 =null;
    var fileName 
    if(e.target.files.length){
      this.fileToUpload1 = e.target.files[0];
      var fileName = e.target.files[0].name;
      $(e.target).parent('div').find('label').html(fileName);
    }else{
      this.fileToUpload1 =  null;
      $(e.target).parent('div').find('label').html('');
    }

    if(type=='s_file'){
      this.editData('s_file', index);
    }
      
  }

  clickOpenFile(index:any){
    let winURL = window.location.host;
    winURL = winURL+'/'+this.userData.appName+"ApiCT/API/fct0409/openGeneralForm";
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
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0409/search', student ).subscribe(
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
                this.posts.forEach((x : any ) => x.edit0409 = false);
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
      return item.edit0409 == false;
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

  deleteData(index:any,type:any){ 
    // console.log("deleteData=>", this.posts[index]);
    this.modalType=type;
    this.modalIndex=index;

    this.dataDeleteSelect=[];
    this.dataDeleteSelect = this.posts[index];

    const confirmBox = new ConfirmBoxInitializer();
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
                this.http.post('/'+this.userData.appName+'ApiCT/API/fct0409/deleteData', data).subscribe(
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
    var rptName = 'rct0409';

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

    
    this.loadComponent = true;
    this.loadModalComponent = false;
    this.loadMutipleComponent = false; //popup SendList
    this.loadWitnessComponent= false
    $("#exampleModal").find(".modal-body").css("height","auto");
 }

  closeModal(){
    this.loadComponent = false;
    this.loadModalComponent = false;
    this.loadWitnessComponent = false;
    this.loadMutipleComponent = false;
          

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
      
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0409', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          //console.log(productsJson)
          this.posts = productsJson.data;
          //console.log(this.posts);
          if(productsJson.result==1){
            var bar = new Promise((resolve, reject) => {
              productsJson.data.forEach((ele, index, array) => {
                    if(ele.count_dep_use == null){
                      productsJson.data[index]['dep_name1'] = "ใช่ร่วมกันทุกแผนก"; 
      
                    }else if(ele.count_dep_use > 1){
                        productsJson.data[index]['dep_name1'] = "ใช่ทั้งหมด "+productsJson.data[index]['count_dep_use']+" แผนก"; 
                    }else{
                      productsJson.data[index]['dep_name1'] = ele.dep_name; 
                    }
      
                    productsJson.data[index]['witness_message_sub'] = "";
                    if(ele.witness_message != null){
                      productsJson.data[index]['witness_message_sub'] = productsJson.data[index]['witness_message'].substring(0, 56)+"..."; 
                    }
                });
             });

            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0409 = false);
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
