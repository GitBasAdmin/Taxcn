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
  selector: 'app-fct0109,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0109.component.html',
  styleUrls: ['./fct0109.component.css']
})


export class Fct0109Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';

  posts:any;
  pers_type:any;
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
  pers_no:any;
  pers_desc:any;
  pers_desc_eng:any;
  id_card:any;
  inter_id:any;
  nation_id:any;
  no_delete_flag:any;
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
  email:any;
  remark:any;
  pers_running:any;
  getConcType:any;
  getConType:any;
  getPersType:any;
  hid_pers_running:any;
  getProv:any;
  getAmphur:any;edit_amphur_id:any;
  getTambon:any;edit_tambon_id:any;
  getPostNo:any;
  getNation:any;
  getInter:any;
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
  @ViewChild('sProv') sProv : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
  @ViewChild('sPersDesc',{static: true}) sPersDesc : ElementRef;
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

    if(this.pers_type){
this.SpinnerService.show();
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0109?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0109 = false);
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


      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fct0109"
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



    //======================== ppers_type ======================================
    var Json = JSON.stringify({
      "table_name" : "ppers_type",
      "field_id" : "pers_type",
      "field_name" : "pers_type_desc",
      "userToken" : this.userData.userToken
    });
      console.log(Json);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json , {headers:headers}).subscribe(
      (response) =>{
        //console.log('xxxxxxxxxxx'+response);
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getPersType = getDataOptions;
        // this.getBank.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
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


      // this.getxxx = [{id:'',text:''},{id: '1',text: 'ผู้ประนอม'},{id: '2',text: 'ผู้ให้คำปรึกษา'},{id: '3',text: '3'},{id: '4',text: '4'}];
      //  this.getConcType = [{id:'',text:''},{id: '1',text: 'ผู้ประนอม'},{id: '2',text: 'ผู้ให้คำปรึกษา'}];
      //  this.getConType =  [{id:'',text:''},{id: '1',text: 'ผู้ทรงคุณวุฒิ'},{id: '2',text: 'อาสาสมัคร'},{id: '3',text: 'เจ้าหน้าที่'}];

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
      if(this.posts[i].no_delete_flag != 1 || this.userData.userLevel == 'A')
        this.checklist[i].edit0109 = this.masterSelected;
      }

    // for (var i = 0; i < this.checklist2.length; i++) {
    //   this.checklist2[i].editNoticeId = this.masterSelected2;
    //     }
    //this.getCheckedItemList();

  }
  /*
  getlist(index:any){
    alert(index)
    this.delList[index]['edit_pers_running']  =  this.posts[index]['edit_pers_running']
    console.log(this.delList);
  }*/

  //========================== Get New Pers_no ==========================

  getNewPersNo(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var Jason = JSON.stringify({
      "pers_type" : this.pers_type,
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct0109/runPersNo', Jason , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions :any = JSON.parse(JSON.stringify(response));
      this.pers_no = getDataOptions.pers_no;
      // this.setFocus('sPersDesc');
      this.sPersDesc.nativeElement.focus();
    },
    (error) => {}
  )
  }


  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0109 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0109 = false;
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
       this[objName] = val[0].fieldIdValue;
      }
    }else{
      this[objName] = null;
    }
  }

  changePersType(perstype:any,type:any){

    if(perstype){
      this.clearData();
      this.searchData();
      this.getNewPersNo();
      this.sPersDesc.nativeElement.focus();
    }

  }

  clearData(){
    $("input[type=text]").val('');
    this.prov_id = null;
    if(this.prov_id==null){
      this.amphur_id=null;
      this.tambon_id=null;
      this.nation_id=null;
      this.inter_id=null;
    }
    // $("input[id=pers_desc]").fadeTo;
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

    if(!this.pers_type){
      confirmBox.setMessage('กรุณาระบุประเภทบุคคล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('pers_type');
        }
        subscription.unsubscribe();
      });

    }else if(!this.pers_desc){
      confirmBox.setMessage('กรุณาระบุชื่อบุคคล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('pers_desc');
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


     if(this.no_delete_flag==true){
         var inputchk = 1;
     }else{
         var inputchk = 0;
     }

      var student = JSON.stringify({
      "edit_pers_running" : this.hid_pers_running,
      "pers_running" : this.pers_running,
      "pers_type" : this.pers_type,
      "pers_no" : this.pers_no,
      "pers_desc" : this.pers_desc,
      "pers_desc_eng" : this.pers_desc_eng,
      "id_card" : this.id_card,
      "inter_id" : this.inter_id,
      "nation_id" : this.nation_id,
      "addr_no" : this.addr_no,
      "address" : this.address,
      "moo" : this.moo,
      "soi" : this.soi,
      "road" : this.road,
      "tambon_id" : this.tambon_id,
      "amphur_id" : this.amphur_id,
      "prov_id" : this.prov_id,
      "no_delete_flag" : inputchk,
      "tel_no" : this.tel_no,
      "post_code" : this.post_code,
      "remark" : this.remark,
      "email" : this.email,
      "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      if(this.hid_pers_running){
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0109/updateJson', student , {headers:headers}).subscribe(
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
                  // var perstype = this.pers_type;
                  // this.pers_type = null;
                  this.clearData();
                  // this.pers_type = perstype;
                  this.changePersType(this.pers_type,1);
                  //$("button[type='reset']")[0].click();
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
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0109/saveJson', student , {headers:headers}).subscribe(
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
                  // var perstype = this.pers_type;
                  // this.pers_type = null;
                  this.clearData();
                  // this.pers_type = perstype;
                  this.changePersType(this.pers_type,1)
                  //$("button[type='reset']")[0].click();
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
    // alert('/'+this.userData.appName+'ApiCT/API/fct0109/edit?edit_pers_running='+val+'&userToken='+this.userData.userToken+':angular')
    this.http.get('/'+this.userData.appName+'ApiCT/API/fct0109/edit?edit_pers_running='+val+'&userToken='+this.userData.userToken+':angular').subscribe(edit => {
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
        this.renderer.setProperty(this.conciliate_id.nativeElement['hid_pers_running'],'value', productsJson.data[0]['edit_pers_running']);
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
    //this.renderer.setProperty(this.conciliate_id.nativeElement['hid_pers_running'],'value', this.posts[index]['edit_pers_running']);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['conciliate_id'],'value', this.posts[index]['conciliate_id']);
      //this.judge_name = this.getJudge.filter((x:any) => x.fieldIdValue === this.posts[index]['conciliate_id']).fieldNameValue;
      this.hid_pers_running  = this.posts[index]['edit_pers_running'];
      this.pers_running = this.posts[index]['pers_running'];
      this.pers_no = this.posts[index]['pers_no'];
      this.pers_desc = this.posts[index]['pers_desc'];
      this.pers_desc_eng = this.posts[index]['pers_desc_eng'];
      this.id_card = this.posts[index]['id_card'];
      this.address = this.posts[index]['address'];
      this.addr_no = this.posts[index]['addr_no'];
      this.moo = this.posts[index]['moo'];
      this.soi = this.posts[index]['soi'];
      this.road = this.posts[index]['road'];
      this.tambon_id = this.posts[index]['tambon_id'];
      this.amphur_id = this.posts[index]['amphur_id'];
      if(this.posts[index]['inter_id'] != null){
        this.inter_id = this.posts[index]['inter_id'].toString();
      }else{
        this.inter_id = this.posts[index]['inter_id']
      }
      if(this.posts[index]['nation_id'] != null){
        this.nation_id = this.posts[index]['nation_id'].toString();
      }else{
        this.nation_id = this.posts[index]['nation_id']
      }

      this.prov_id = this.posts[index]['prov_id'];
      if(this.prov_id)
      this.changeProv(this.prov_id,'');
      else{
          this.sAmphur.clearModel();
          this.sTambon.clearModel();
          }
      this.edit_amphur_id = this.posts[index]['amphur_id'];
      this.edit_tambon_id = this.posts[index]['tambon_id'];
      this.tel_no = this.posts[index]['tel_no'];
      this.post_code = this.posts[index]['post_code'];
      this.email = this.posts[index]['email'];
      this.remark = this.posts[index]['remark'];
      // this.book_account = this.posts[index]['book_account'];
      // this.bank_id = this.posts[index]['bank_id'];
      // this.bank_branch = this.posts[index]['bank_branch'];
      // this.expire_date = this.posts[index]['expire_date'];
      // this.con_type = this.posts[index]['con_type'].toString();
      // this.conc_type = this.posts[index]['conc_type'].toString();


    //this.absent_desc = this.getAbsent.filter((x:any) => x.fieldIdValue === this.posts[index]['absent_type']).fieldNameValue;
    // this.renderer.setProperty(this.conciliate_id.nativeElement['absent_date1'],'value', this.posts[index]['absent_date']);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['absent_date2'],'value', this.posts[index]['absent_date']);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['time_start'],'value', this.posts[index]['time_start']);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['remark'],'value', this.posts[index]['remark']);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['judge_name'],'value', this.list.find((o:any) => o.fieldIdValue === this.posts[index]['conciliate_id']).fieldNameValue);
    // this.renderer.setProperty(this.conciliate_id.nativeElement['absent_desc'],'value', this.list.find((o:any) => o.fieldIdValue === this.posts[index]['absent_desc']).fieldNameValue);

     if(this.posts[index]['no_delete_flag']){
      this.no_delete_flag = true;
     }else{
      this.no_delete_flag = false;
     }

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
        "pers_type" : this.pers_type,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0109/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit0109 = false);
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
      return item.edit0109 == false;
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
                          if(ele.edit0109 == true){
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
                   console.log("data= "+data)
                   this.http.post('/'+this.userData.appName+'ApiCT/API/fct0109/deleteSelect', data , {headers:headers}).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();

                      }else{
                        //$("button[type='reset']")[0].click();
                        //this.getData();
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            // this.closebutton.nativeElement.click();
                            // this.getData();
                        this.closebutton.nativeElement.click();
                        // var perstype = this.pers_type;
                        // this.pers_type = null;
                        this.clearData();
                        // this.pers_type = perstype;
                        this.changePersType(this.pers_type,1)
                          }
                          subscription.unsubscribe();
                        });

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
    var rptName = 'rct0109';

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
   if(this.prov_id && this.amphur_id && this.tambon_id){
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
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0109?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0109 = false);
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







