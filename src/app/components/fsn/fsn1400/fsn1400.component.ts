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

@Component({
  selector: 'app-fsn1400,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fsn1400.component.html',
  styleUrls: ['./fsn1400.component.css']
})


export class Fsn1400Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';

  posts:any;
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
  court_id:any;
  getCourt:any;
  getProv:any;
  prov_id:any;
  amphur_id:any;
  tambon_id:any;
  getAmphur:any;
  edit_amphur_id:any;
  getTambon:any;
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
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
  @ViewChild('file1',{static: true}) file1: ElementRef;
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
    this.result.seq_no=null;

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fsn1400"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
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
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
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
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOfficer = getDataOptions;
      },
      (error) => {}
    )

    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "field_name2" : "court_running",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        console.log(this.getCourt)
        // var court = this.getCourt.filter((x:any) => x.fieldIdValue === this.userData.courtId) ;
        // if(court.length!=0){
        //   this.result.court_id = this.court_id = court[0].fieldIdValue;
        // }
      },
      (error) => {}
    )
  }

  tabChangeSelect(objName:any,objData:any,event:any,type:any){
    // alert(objName)
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
     // if(objName=='zone_id'){
     //   this.changeAmphur(val[0].fieldIdValue,1);
   }else{
     this.result[objName] = null;
     this[objName] = null;
   }
   }else{
     // alert(val);
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
    const ele = name;
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit1400 = this.masterSelected;
      }
  }

  isAllSelected() {

    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit1400 == true;
    })

  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit1400 = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  ClearAll(){
    window.location.reload();
  }

  receiveFuncListData(event:any){
    console.log(event)
  }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }


  // submitForm() {
  //   const confirmBox = new ConfirmBoxInitializer();
  //   confirmBox.setTitle('ข้อความแจ้งเตือน');

  //   if(!this.result.prov_id){
  //     confirmBox.setMessage('กรุณาระบุจังหวัด');
  //     confirmBox.setButtonLabels('ตกลง');
  //     confirmBox.setConfig({
  //         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  //     });
  //     const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
  //       // if (resp.success==true){
  //       //   this.setFocus('prov_id');
  //       // }
  //       subscription.unsubscribe();
  //     });

  //   }else if(!this.result.off_id){
  //     confirmBox.setMessage('กรุณาระบุผุ้เดินหมายเขตนี้');
  //     confirmBox.setButtonLabels('ตกลง');
  //     confirmBox.setConfig({
  //         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  //     });
  //     const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
  //       // if (resp.success==true){
  //       //   this.setFocus('off_id');
  //       // }
  //       subscription.unsubscribe();
  //     });
  //   }else{
  //     this.SpinnerService.show();
  //     let headers = new HttpHeaders();
  //     headers = headers.set('Content-Type','multipart/form-data');

  //     var formData = new FormData();
  //     this.result['userToken'] = this.userData.userToken;
  //     this.result['off_name'] = this.getOfficer.find((o:any) => o.fieldIdValue === this.result.off_id).fieldNameValue;//ng-selec assign off_name
  //     //formData.append('image', this.image);
  //     formData.append('data', JSON.stringify($.extend({}, this.result)));
  //     this.http.disableHeader().post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1400/saveData', formData ).subscribe(
  //     //this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1400/saveData', formData ).subscribe(
  //       (response) =>{
  //         let alertMessage : any = JSON.parse(JSON.stringify(response));
  //           if(alertMessage.result==0){
  //             this.SpinnerService.hide();
  //             confirmBox.setMessage(alertMessage.error);
  //             confirmBox.setButtonLabels('ตกลง');
  //             confirmBox.setConfig({
  //                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  //             });
  //             const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
  //               if (resp.success==true){
  //                 // this.SpinnerService.hide();
  //               }
  //               subscription.unsubscribe();
  //             });
  //           }else{
  //             this.SpinnerService.hide();
  //             confirmBox.setMessage('ข้อความแจ้งเตือน');
  //             confirmBox.setMessage(alertMessage.error);
  //             confirmBox.setButtonLabels('ตกลง');
  //             confirmBox.setConfig({
  //                 layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
  //             });
  //             const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
  //               if (resp.success==true){
  //                 $("button[type='reset']")[0].click();
  //               }
  //               subscription.unsubscribe();
  //             });
  //             this.ngOnInit();
  //           }
  //       },
  //       (error) => {this.SpinnerService.hide();}
  //     )
  //   }
  // }


  searchData() {
    if(!this.result.court_id &&
          !this.result.prov_id &&
          !this.result.amphur_id &&
          !this.result.tambon_id
          ){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('ป้อนเงื่อนไขเพื่อค้นหา');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
    }else{
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');

      var student = JSON.stringify({
        "court_id" : this.result.court_id,
        "prov_id" : this.result.prov_id,
        "amphur_id" : this.result.amphur_id,
        "tambon_id" : this.result.tambon_id,
        "moo" : this.result.moo,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1400', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
         console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit1400 = false);
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
  }


  confirmBox() {
    var isChecked = this.posts.every(function(item:any) {
      return item.edit1400 == false;
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
                          if(ele.edit1400 == true){
                            dataTmp.push(this.posts[index]);
                          }
                      });
                  });
                  if(bar){
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type','application/json');
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    //console.log("data=>", data);
                    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1400/deleteDataSelect', data , {headers:headers}).subscribe(
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
                }
                subscription.unsubscribe();

              });
    }
  }

  printReport(){
    var rptName = 'rsn4200';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pconciliate_id" : this.conciliate_id.nativeElement["conciliate_id"].value,
    //   "pendnotice_desc" : this.conciliate_id.nativeElement["endnotice_desc"].value
    // });

    this.printReportService.printReport(rptName,paramData);
  }

  loadTableComponent(val:any){
    this.loadModalComponent = false;
    this.loadComponent = true;
    $("#exampleModal").find(".modal-body").css("height","auto");
  }

  changeProv(province:any,type:any){
    //alert("จังหวัด :"+province)
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
          if(this.edit_amphur_id&&!this.result.amphur_id)
            this.result.amphur_id = this.edit_amphur_id;
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

  changeAmphur(Amphur:any,type:any){
    //alert("อำเภอ :"+Amphur)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.result.prov_id+"'",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTambon = getDataOptions;
        setTimeout(() => {
          if(this.edit_tambon_id)
            this.result.tambon_id = this.edit_tambon_id;
        }, 100);
      },
      (error) => {}
    )
    if(typeof Amphur=='undefined' || type==1){
      this.sTambon.clearModel();
    }
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
      let headers1 = new HttpHeaders();
      headers1 = headers1.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1400/getData', student , {headers:headers1}).subscribe(posts => {
      //this.http.get('/'+this.userData.appName+'APINO/API/fsn1400?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit1400 = false);
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
  //upload image
  onFileChange(e:any,type:any) {

    if(e.target.files.length){
      this.fileToUpload1 = e.target.files[0];
      var fileName = e.target.files[0].name;
      $(e.target).parent('div').find('label').html(fileName);
    }else{
      $(e.target).parent('div').find('label').html('');
    }
  }

  
  delFile(req_running:any,type:any){
    this.file_running = req_running;
    this.file_type = type;
    this.openbutton.nativeElement.click();
  }

  directiveDate(date:any,obj:any){
    this[obj] = date;
    console.log(date)
  }
}
