import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewEncapsulation   } from '@angular/core';
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
import * as $ from 'jquery';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PrintReportService } from 'src/app/services/print-report.service';
declare var myExtObject: any;
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fst2600,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fst2600.component.html',
  styleUrls: ['./fst2600.component.css']
})


export class Fst2600Component implements AfterViewInit, OnInit, OnDestroy {
  form: FormGroup;
  title = 'datatables';

  posts:any;
  search:any;
  booleanValue:boolean = false;
  booleanValue2:boolean = false;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:string;
  myExtObject: any;

  //-----------------
  result:any = [];
  dataStat:any = [];
  getMonthTh:any;
  getYearTh:any = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('fst2600',{static: true}) fst2600 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('sCaseCate') sCaseCate : NgSelectComponent;
  @ViewChild('sTitle') sTitle : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService
  ){

  }

  ngOnInit(): void {

    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy: true
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    //const confirmBox = new ConfirmBoxInitializer();
    //confirmBox.setTitle('ข้อความแจ้งเตือน');

      //this.SpinnerService.show();
      /*this.http.get('/'+this.userData.appName+'ApiST/API/STAT/fst2600?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          // console.log("productsJson=>", productsJson.data);
          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit2600 = false);
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
      });*/

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fst2600"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          // console.log(getDataAuthen)
          this.result.sType = 1;
          this.searchData(1);
        },
        (error) => {}
      )

      this.getMonthTh = [{"fieldIdValue": '01', "fieldNameValue": "มกราคม"},
      {"fieldIdValue": '02', "fieldNameValue": "กุมภาพันธ์"},
      {"fieldIdValue": '03',"fieldNameValue": "มีนาคม"},
      {"fieldIdValue": '04',"fieldNameValue": "เมษายน"},
      {"fieldIdValue": '05',"fieldNameValue": "พฤษภาคม"},
      {"fieldIdValue": '06',"fieldNameValue": "มิถุนายน"},
      {"fieldIdValue": '07',"fieldNameValue": "กรกฎาคม"},
      {"fieldIdValue": '08',"fieldNameValue": "สิงหาคม"},
      {"fieldIdValue": '09',"fieldNameValue": "กันยายน"},
      {"fieldIdValue": '10',"fieldNameValue": "ตุลาคม"},
      {"fieldIdValue": '11',"fieldNameValue": "พฤศจิกายน"},
      {"fieldIdValue": '12',"fieldNameValue": "ธันวาคม"}];

      for(var y=(parseInt(myExtObject.curYear())-5);y<parseInt(myExtObject.curYear())+1;y++){
        this.getYearTh.push({"fieldIdValue": y, "fieldNameValue": y})
      }
      // this.result.stat_mon =parseInt(myExtObject.curMonth()).toString();
      this.result.stat_mon =myExtObject.curMonth().toString();
      this.result.stat_year = myExtObject.curYear().toString();

      }

      

  ngAfterContentInit() : void{
    
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
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

  setFocus(name:any) {
    const ele = this.fst2600.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }



  getCheckedItemList(){
    this.delValue = "";
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].edit2600){
        if(this.delValue!='')
          this.delValue+=','
        this.delValue+=this.checklist[i].edit2600;
      }
    }
  }

  ClearAll(){
    window.location.reload();
  }

  //save update
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.case_type){
      confirmBox.setMessage('กรุณาระบุประเภทความ');
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

    }else if(!this.result.case_type_stat){
      confirmBox.setMessage('กรุณาระบุประเภทความ');
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
    }else if(!this.result.case_title){
      confirmBox.setMessage('กรุณาระบุอักษรคำนำหน้าคดีดำ');
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
    }else{
      this.SpinnerService.show();

      if(this.result.con_flag == null || this.result.con_flag == ""){
        this.result.con_flag = 0;
      }

      var student = JSON.stringify({

        "case_type" : this.result.case_type,
        "case_type_stat" : this.result.case_type_stat,
        "case_title" : this.result.case_title,
        "con_flag" : this.result.con_flag,
        "title_type" : "B",
        "userToken" : this.userData.userToken
        });
      // console.log("student=>", student);
      //Update
      if(true){
        // console.log("update=>");
        this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2600/updateJson', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("alertMessage.result=>", alertMessage.result);
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
                this.ngOnInit();
              }
          },
          (error) => {this.SpinnerService.hide();}
        )

      }else{
        //Insert
        // console.log("save=>");
        this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2600/saveJson', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("alertMessage.result=>", alertMessage.result);
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
                this.ngOnInit();
              }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    }
  }

  editData(index:any) {

    // console.log("this.posts[index]['case_type_stat']=>",this.posts[index]['case_type_stat']);
    this.SpinnerService.show();
    
    this.result.case_type  = this.posts[index]['case_type'];
    this.result.case_type_stat  = this.posts[index]['case_type_stat'];
    this.result.case_title = this.posts[index]['case_title'];
    this.result.con_flag = this.posts[index]['con_flag'];

    if((this.posts[index]['con_flag']) == 0 || (this.posts[index]['con_flag'] == null)){
      this.result.con_flag = '';
    }else{
      this.result.con_flag = this.posts[index]['con_flag'];
    }

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }


  searchData(val:any) {
    if(val==1){
      this.booleanValue = false;
      this.booleanValue2 = false;
      //this.result.stat_mon =parseInt(myExtObject.curMonth()).toString();
      //this.result.stat_year = myExtObject.curYear().toString();
    }else{
      this.booleanValue2 = false;
      this.booleanValue = true;
      //this.result.stat_mon =parseInt(myExtObject.curMonth()).toString();
      //this.result.stat_year = myExtObject.curYear().toString();
    }
    this.dataStat = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();


      var student = JSON.stringify({
        "sType" : val,
        "stat_mon" : val==1?this.result.stat_mon:'',
        "stat_year" : this.result.stat_year.toString(),
        "userToken" : this.userData.userToken
      });
      console.log(student);
      this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2600', student ).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
            console.log(productsJson)
          if(productsJson.result==1){
            this.dataStat = productsJson.data;
            //console.log(this.dataStat.length)
            this.rerender();
            /*
            setTimeout(() => {
              $('body').find('.table-bordered').find('tbody tr td:first-child').not("[style*='display: none']" ).each(function(e){
                console.log($(this))
                //$(this).closest('tr').removeClass().addClass((e % 2 == 0) ? "even" : "odd");
                $(this).css('background-color','#000000 !important')
              });
            }, 1000);
            */
          }else{
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.rerender();
              }
              subscription.unsubscribe();
            });
          }
            this.SpinnerService.hide();
        },
        (error) => {this.SpinnerService.hide();}
      );
  }

  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  retToPage(obj:any,sub:any){
    console.log(obj)
    var student = sub;
    student.pstat_date =obj.stat_date ? myExtObject.conDate(obj.stat_date) :'';
    student.pstat_mon =obj.stat_mon ? this.pad(obj.stat_mon,2,'') :'';
    student.pstat_year =obj.stat_year ? obj.stat_year.toString() :'';
    student.userToken = this.userData.userToken;
    console.log($.extend({},student));//return false;
    student = $.extend({},student);
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2600/confirmStat', student ).subscribe(
      posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
        if(productsJson.result==1){
          /*confirmBox.setMessage(productsJson.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              */
              var paramData = JSON.stringify({
                "pcourt_running" : this.userData.courtRunning.toString(),
                "pstat_date" : obj.stat_date ? myExtObject.conDate(obj.stat_date) :'',
                "pstat_mon" : obj.stat_mon ? this.pad(obj.stat_mon,2,'') :'',
                "pstat_year" : obj.stat_year ? obj.stat_year :'',
                //"pstat_data" : sub,
                "poff_id" : this.userData.userCode,
                "poff_name" : this.userData.offName,
                "poff_post" : this.userData.postName,
                "psign_id" : this.userData.directorId,
                "psign_name" : this.userData.directorName,
                "psign_post" : this.userData.directorPostName,
                "preport_judge_id" : this.userData.headJudgeId,
                "preport_judge_name" : this.userData.headJudgeName,
                "preport_judge_post" : this.userData.headJudgePost,
                "pcase_type": sub.case_type ? sub.case_type.toString() : this.userData.defaultCaseType.toString(),
                "pcase_type_stat" : sub.case_type_stat ? sub.case_type_stat.toString() :'',
                "ptype" : sub.ptype ? sub.ptype.toString() :'',
                "pprint_remark":"","pprint_remark2":""
              });
          
              console.log(paramData)
              $("body").find("input[name='sType']:checked").trigger("click");
              this.printReportService.printReport(sub.stat_report.split('.')[0],paramData);
            /*}
            subscription.unsubscribe();
          });*/
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
          this.SpinnerService.hide();
      },
      (error) => {this.SpinnerService.hide();}
    );

    //let winURL = this.authService._baseUrl;
    //winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.retPage;
    //let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/'+this.retPage;
    //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  }


  confirmBox() {
    const confirmBox = new ConfirmBoxInitializer();
    if(!this.delValue){
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

  receiveFuncListData(event:any){
    // console.log(event)
  }

  loadMyChildComponent(){
    this.loadComponent = true;
  }

  //Delete
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
                          if(ele.edit2600 == true){
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
                    // console.log("data=>", data);
                    this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2600/deleteSelect', data ).subscribe((response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      // console.log("alertMessage=>", alertMessage.result)
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();
                      }else{
                        this.closebutton.nativeElement.click();
                        $("button[type='reset']")[0].click();
                        this.ngOnInit();
                        }
                      },
                      (error) => {this.SpinnerService.hide();}
                    )
                    }
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



  closeModal(){
    $('.modal')
    .find("input[type='text'],input[type='password'],textarea,select")
    .val('')
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();
  }


  

}