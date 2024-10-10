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
  selector: 'app-fct0407,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0407.component.html',
  styleUrls: ['./fct0407.component.css']
})


export class Fct0407Component implements AfterViewInit, OnInit, OnDestroy {

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
  docto_desc:any;
  addr_no:any;
  address:any;
  moo:any;
  soi:any;
  road:any;
  tambon_id:any;
  amphur_id:any;
  prov_id:any;
  tel_no:any;
  post_code:any;
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
  getTranslator:any;
  getBank:any;
  name:any;
  docto_id:any;
  hid_docto_id:any;
  getProv:any;
  getAmphur:any;edit_amphur_id:any;
  getTambon:any;edit_tambon_id:any;
  getPostNo:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  // @ViewChild('conciliate_id',{static: true}) conciliate_id : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
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

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0407?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0407 = false);
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

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fct0407"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          console.log(getDataAuthen)
        },
        (error) => {}
      )

    //   //======================== pjudge ======================================
    // var student = JSON.stringify({
    //   "table_name" : "pjudge",
    //   "field_id" : "conciliate_id",
    //   "field_name" : "judge_name",
    //   "field_name2" : "short_judge_name",
    //   "userToken" : this.userData.userToken
    // });
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getJudge = getDataOptions;
    //     this.getJudge.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
    //     //console.log(this.getJudge)
    //   },
    //   (error) => {}
    // )
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



    // //======================== pbank ======================================
    // var Json = JSON.stringify({
    //   "table_name" : "pbank",
    //   "field_id" : "bank_id",
    //   "field_name" : "bank_name",
    //   "userToken" : this.userData.userToken
    // });
    //   console.log(Json);
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json , {headers:headers}).subscribe(
    //   (response) =>{
    //     console.log('xxxxxxxxxxx'+response);
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getBank = getDataOptions;
    //     // this.getBank.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
    //   },
    //   (error) => {}
    // )



       // this.getxxx = [{id:'',text:''},{id: '1',text: 'ผู้ประนอม'},{id: '2',text: 'ผู้ให้คำปรึกษา'},{id: '3',text: '3'},{id: '4',text: '4'}];
       //this.getConcType = [{id:'',text:''},{id: '1',text: 'ผู้ประนอม'},{id: '2',text: 'ผู้ให้คำปรึกษา'}];
      //  this.getTranslator =  [{id: '1',text: 'ทะเบียนล่าม'},{id: '2',text: 'นักจิตวิทยา'},{id: '3',text: 'นักสังคมสงเคราะห์'},{id: '4',text: 'ผู้เชี่ยวชาญ'}];

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
      this.checklist[i].edit0407 = this.masterSelected;
      }

    // for (var i = 0; i < this.checklist2.length; i++) {
    //   this.checklist2[i].editNoticeId = this.masterSelected2;
    //     }
    //this.getCheckedItemList();

  }
  /*
  getlist(index:any){
    alert(index)
    this.delList[index]['edit_conciliate_id']  =  this.posts[index]['edit_conciliate_id']
    console.log(this.delList);
  }*/

  isAllSelected() {

    this.masterSelected = this.checklist.every(function(item:any) {

        return item.edit0407 == true;
    })

  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0407 = false;
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
        // $("body").find("input[name='delValue2']").val(del2);
       })
    }, 100);

  }

  receiveFuncListData(event:any){
    console.log(event)
  }
//   receiveFuncListData(event:any){
//     console.log(event)
//     if(this.listTable=='pjudge'){
//       this.conciliate_id=event.fieldIdValue;
//       this.judge_name=event.fieldNameValue;
//     }else{
//       this.absent_type=event.fieldIdValue;
//       this.absent_desc=event.fieldNameValue;
//     }

//     this.closebutton.nativeElement.click();
// }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }
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

    if(!this.docto_id){
      confirmBox.setMessage('กรุณาระบุข้อมูลเรื่อง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('docto_id');
        }
        subscription.unsubscribe();
      });

    }else if(!this.docto_desc){
      confirmBox.setMessage('กรุณาระบุเรียน(ส่งหนังสือ)');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('docto_desc');
        }
        subscription.unsubscribe();
      });
    }else{


      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.conciliate_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }


    //  if(this.all_day_flag==true){
    //      var inputchk = 1;
    //  }else{
    //      var inputchk = 0;
    //  }

      var student = JSON.stringify({
      "edit_docto_id" : this.hid_docto_id,
      "docto_id" : this.docto_id,
      "docto_desc" : this.docto_desc,
      "addr_no" : this.addr_no,
      "address" : this.address,
      "moo" : this.moo,
      "soi" : this.soi,
      "road" : this.road,
      "tambon_id" : this.tambon_id,
      "amphur_id" : this.amphur_id,
      "prov_id" : this.prov_id,
      "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      if(this.hid_docto_id){
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0407/updateJson', student , {headers:headers}).subscribe(
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
                  $("button[type='reset']")[0].click();
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
      }else{
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0407/saveJson', student , {headers:headers}).subscribe(
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
                  $("button[type='reset']")[0].click();
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

/*
  editData(val :any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();
    // alert('/'+this.userData.appName+'ApiCT/API/fct0407/edit?edit_conciliate_id='+val+'&userToken='+this.userData.userToken+':angular')
    this.http.get('/'+this.userData.appName+'ApiCT/API/fct0407/edit?edit_conciliate_id='+val+'&userToken='+this.userData.userToken+':angular').subscribe(edit => {
      //console.log(edit)
      this.SpinnerService.hide();
      let productsJson = JSON.parse(JSON.stringify(edit));
      console.log(productsJson)
      if(productsJson.result==0){
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        this.renderer.setProperty(this.conciliate_id.nativeElement['hid_docto_id'],'value', productsJson.data[0]['edit_conciliate_id']);
        // this.renderer.setProperty(this.conciliate_id.nativeElement['hid_notice_id'],'value', productsJson.data[0]['edit_notice_id']);
        this.renderer.setProperty(this.conciliate_id.nativeElement['conciliate_id'],'value', productsJson.data[0]['conciliate_id']);
        this.renderer.setProperty(this.conciliate_id.nativeElement['endnotice_desc'],'value', productsJson.data[0]['endnotice_desc']);
        this.renderer.setProperty(this.conciliate_id.nativeElement['notice_id'],'value', productsJson.data[0]['notice_id']);
        this.renderer.setProperty(this.conciliate_id.nativeElement['notice_type_name'],'value', this.list.find((o:any) => o.fieldIdValue === productsJson.data[0]['notice_id']).fieldNameValue);
        // if(productsJson.data[0]['default_value']){
        //   this.conciliate_id.nativeElement["default_value"].checked=true;
        // }else{
        //   this.conciliate_id.nativeElement["default_value"].checked=false;
        // }
        this.setFocus('conciliate_id');
      }

    });
  }
*/
  editData(index:any){
    console.log(this.posts[index])
    this.SpinnerService.show();
    //this.renderer.setProperty(this.conciliate_id.nativeElement['hid_docto_id'],'value', this.posts[index]['edit_conciliate_id']);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['conciliate_id'],'value', this.posts[index]['conciliate_id']);
      //this.docto_desc = this.getTranslator.filter((x:any) => x.id === this.posts[index]['docto_desc']).text;
      this.hid_docto_id = this.posts[index]['edit_docto_id'];
      this.docto_id = this.posts[index]['docto_id'];
      this.docto_desc = this.posts[index]['docto_desc'].toString();
      this.addr_no = this.posts[index]['addr_no'];
      this.address = this.posts[index]['address'];
      this.moo = this.posts[index]['moo'];
      this.soi = this.posts[index]['soi'];
      this.road = this.posts[index]['road'];
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
    //this.absent_desc = this.getAbsent.filter((x:any) => x.fieldIdValue === this.posts[index]['absent_type']).fieldNameValue;
    // this.renderer.setProperty(this.conciliate_id.nativeElement['absent_date1'],'value', this.posts[index]['absent_date']);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['absent_date2'],'value', this.posts[index]['absent_date']);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['time_start'],'value', this.posts[index]['time_start']);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['remark'],'value', this.posts[index]['remark']);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['judge_name'],'value', this.list.find((o:any) => o.fieldIdValue === this.posts[index]['conciliate_id']).fieldNameValue);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['absent_desc'],'value', this.list.find((o:any) => o.fieldIdValue === this.posts[index]['absent_desc']).fieldNameValue);

    //  if(this.posts[index]['all_day_flag']){
    //   this.all_day_flag = true;
    //  }else{
    //   this.all_day_flag = false;
    //  }

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
      // if(this.conciliate_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var student = JSON.stringify({
        "edit_docto_id" : this.hid_docto_id,
        "docto_id"   : this.docto_id,
        "docto_desc" : this.docto_desc,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0407/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit0407 = false);
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
    //ngalert(this.delValue);
    var isChecked = this.posts.every(function(item:any) {
      return item.edit0407 == false;
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
                          if(ele.edit0407 == true){
                            dataTmp.push(this.posts[index]);
                          }
                      });
                  });
                  if(bar){
                    console.log(dataTmp+'xxxxxxxxxxxxxxxxxxx')
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type','application/json');
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                   console.log(JSON.stringify(data)+'ooooooooooooooo')
                   this.http.post('/'+this.userData.appName+'ApiCT/API/fct0407/deleteSelect', data , {headers:headers}).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();

                      }else{

                        this.closebutton.nativeElement.click();
                //        $("button[type='reset']")[0].click();
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


  printReport(){
    var rptName = 'rct0407';

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

//  tabChangeJudge(obj:any){
//    if(obj.target.value){
//      this.renderer.setProperty(this.conciliate_id.nativeElement['judge_name'],'value', this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue);
//    }else{
//      this.conciliate_id.nativeElement['conciliate_id'].value="";
//      this.conciliate_id.nativeElement['judge_name'].value="";
//    }
//  }

// tabChange(obj:any,type:any){
//   this.SpinnerService.show();
//   if(type==1){
//     var val = this.getJudge.filter((x:any) => x.fieldIdValue === obj.target.value) ;
//     if(val.length!=0){
//       this.judge_name = val[0].fieldNameValue;
//     }else{
//       this.conciliate_id = null;
//       this.judge_name = '';
//     }
//     setTimeout(() => {
//       this.SpinnerService.hide();
//     }, 200);

//   }else{
//     var val = this.getAbsent.filter((x:any) => x.fieldIdValue === obj.target.value) ;
//     if(val.length!=0){
//       this.absent_desc = val[0].fieldNameValue;
//     }else{
//       this.absent_type = null;
//       this.absent_desc = '';
//     }
//     setTimeout(() => {
//       this.SpinnerService.hide();
//     }, 200);
//   }

//   /*
//   let headers = new HttpHeaders();
//    headers = headers.set('Content-Type','application/json');
//   var student = JSON.stringify({
//     "table_name": this.listTable,
//     "field_id": this.listFieldId,
//     "field_name": this.listFieldName,
//     "search_id":this.conciliate_id.nativeElement[this.listFieldId].value,
//     "search_desc":'',
//     "userToken" : this.userData.userToken
//   });
//   //console.log(student)
//   this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
//     datalist => {

//       let productsJson = JSON.parse(JSON.stringify(datalist));
//       if(productsJson.length){
//         this.conciliate_id.nativeElement[this.listFieldName].value=productsJson[0].fieldNameValue;
//         this.SpinnerService.hide();
//       }else{
//         this.SpinnerService.hide();
//         this.conciliate_id.nativeElement[this.listFieldId].value="";
//         this.conciliate_id.nativeElement[this.listFieldName].value="";

//         const confirmBox = new ConfirmBoxInitializer();
//         confirmBox.setTitle('ข้อความแจ้งเตือน');
//         confirmBox.setMessage('ไม่พบข้อมูล');
//           confirmBox.setButtonLabels('ตกลง');
//           confirmBox.setConfig({
//               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
//           });
//           const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
//             if (resp.success==true){
//               this.setFocus(this.listFieldId);
//             }
//             subscription.unsubscribe();
//           });

//       }

//     },
//     (error) => {}
//   );
//     */
// }


// loadMyChildComponent(val:any){

//   if(val==1){
//     var student = JSON.stringify({"table_name" : "pjudge", "field_id" : "conciliate_id","field_name" : "judge_name","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
//     this.listTable='pjudge';
//     this.listFieldId='conciliate_id';
//     this.listFieldName='judge_name';
//     this.listFieldNull='';
//   }else{
//     var student = JSON.stringify({"table_name" : "pabsent_type", "field_id" : "absent_type","field_name" : "absent_desc","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
//     this.listTable='pabsent_type';
//     this.listFieldId='absent_type';
//     this.listFieldName='absent_desc';
//     this.listFieldNull='';
//   }

//   //console.log(student)

//    let headers = new HttpHeaders();
//    headers = headers.set('Content-Type','application/json');
//    //var student = JSON.stringify({"table_name" : this.form.get("table_name")?.value, "field_id" : this.form.get("field_id")?.value,"field_name" : this.form.get("field_name")?.value});
//    //console.log(student)

//    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
//        (response) =>{
//          this.list = response;
//          this.loadModalComponent = false;
//          this.loadComponent = true;
//          $("#exampleModal").find(".modal-body").css("height","auto");
//          console.log(response)
//        },
//        (error) => {}
//      )

// }

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
      if(this.tambon_id){
          setTimeout(() => {
        this.post_code = this.getPostNo.find((o:any) => o.fieldIdValue === this.tambon_id).fieldNameValue2;
      }, 100);
      }

    },
    (error) => {}
  )
  if(typeof Tambon=='undefined' || type==1){
    this.post_code = '';
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
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0407?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0407 = false);
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
    this[obj] = date;
    console.log(date)
  }

}







