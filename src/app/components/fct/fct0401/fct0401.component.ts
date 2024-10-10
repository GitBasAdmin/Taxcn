import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map, } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
// import { viewClassName } from '@angular/compiler';
// import { isNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-fct0401,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0401.component.html',
  styleUrls: ['./fct0401.component.css']
})


export class Fct0401Component implements AfterViewInit, OnInit, OnDestroy {

  title: any;

  posts: any;
  std_id: any;
  std_prov_name: any;
  delList: any = [];
  search: any;
  masterSelected: boolean;
  checklist: any;
  checklist2: any;
  sessData: any;
  userData: any;
  myExtObject: any;
  programName: string;

  Datalist: any;
  defaultCaseType: any;

  result: any = [];
  fileToUpload1: File = null;
  getDep: any;
  getPosition: any;
  getJudgeRoom: any;
  getFromCourt: any;
  getToCourt: any;

  hid_court_type: any;
  getProv: any;
  getAmphur: any;
  edit_amphur_id: any;
  edit_tambon_id: any;
  getTambon: any;
  getPostNo: any;
  tambon_id: any;
  amphur_id: any;
  prov_id: any;
  post_no: any;
  run_judge_id: any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  // @ViewChild('prov_id',{static: true}) prov_id : ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('fct0401', { static: true }) fct0401: ElementRef;


  @ViewChild('crudModal') crudModal: ElementRef;
  //@ViewChild('file1',{static: true}) file1: ElementRef;
  @ViewChild('inputFile') myInputVariable: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  //-----new
  @ViewChild('sProv') sProv: NgSelectComponent;
  @ViewChild('sAmphur') sAmphur: NgSelectComponent;
  @ViewChild('sTambon') sTambon: NgSelectComponent;
  public loadModalComponent: boolean = false;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2
  ) {
    this.masterSelected = false
    // this.masterSelected2 = false
  }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [[2, 'asc']]
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0401', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      this.posts = productsJson.data;
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        if (productsJson.data.length)
          this.posts.forEach((x: any) => x.edit0401 = false);
        this.rerender();
      } else {
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
      }
      this.SpinnerService.hide();
    });

    this.runJudgeId();
    //======================== authen ======================
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fct0401"
    });
    this.http.post('/' + this.userData.appName + 'Api/API/authen', authen).subscribe(
      (response) => {
        let getDataAuthen: any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => { }
    )

    //======================== pprovince =================
    var student = JSON.stringify({
      "table_name": "pprovince",
      "field_id": "prov_id",
      "field_name": "prov_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getProv = getDataOptions;
      },
      (error) => { }
    )
    //======================== pposition ==================
    var student = JSON.stringify({
      "table_name": "pposition",
      "field_id": "post_id",
      "field_name": "post_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getPosition = getDataOptions;
      },
      (error) => { }
    )

    //======================== popup pposition ==============
    var student = JSON.stringify({
      "table_name": "pposition",
      "field_id": "post_id",
      "field_name": "post_name",
      "userToken": this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
      (response) => {
        this.list = response;
        this.listTable = "pposition";
        this.listFieldId = "post_id";
        this.listFieldName = "post_name";
      },
      (error) => { }
    )

    //======================== pjudge_room ==================
    var student = JSON.stringify({
      "table_name": "pjudge_room",
      "field_id": "room_id",
      "field_name": "room_desc",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getJudgeRoom = getDataOptions;
      },
      (error) => { }
    )

    //======================== getFromCourt pcourt =================
    var student = JSON.stringify({
      "table_name": "pcourt",
      "field_id": "court_running",
      "field_name": "court_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getFromCourt = getDataOptions;
      },
      (error) => { }
    )

    //======================== getToCourt pcourt ==================
    var student = JSON.stringify({
      "table_name": "pcourt",
      "field_id": "court_running",
      "field_name": "court_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getToCourt = getDataOptions;
      },
      (error) => { }
    )

  }

  runJudgeId() {
    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0401/runJudgeId', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      if (productsJson.result == 1) {
        this.run_judge_id = productsJson.judge_id;
      }
    });
  }

  searchDataCond(cond: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    var student = JSON.stringify({
      "cond": cond,
      "userToken": this.userData.userToken
    });
    // console.log("student=>",student);

    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0401', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      this.posts = productsJson.data;

      // console.log("productsJson=>", productsJson.data);
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        if (productsJson.data.length)
          this.posts.forEach((x: any) => x.edit0401 = false);
        this.rerender();
      } else {
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
      }
    });
  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    var student = JSON.stringify({
      "judge_name": this.result.judge_name,
      "short_judge_name": this.result.short_judge_name,
      "position": this.result.position,
      "room_id": this.result.room_id,
      "tel_no": this.result.tel_no,
      "office_room": this.result.office_room,
      "gen_no": this.result.gen_no ? this.result.gen_no : 0,
      "start_date": this.result.start_date,
      "end_date": this.result.end_date,
      "head_level_flag": this.result.head_level_flag ? 1 : 0,
      "from_court": this.result.from_court ? this.result.from_court : 0,
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0401/search', student).subscribe(posts => {
        let productsJson: any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;

        if (productsJson.result == 1) {
          this.checklist = this.posts;
          if (productsJson.data.length)
            this.posts.forEach((x: any) => x.edit0401 = false);
          this.rerender();
        } else {
          confirmBox.setMessage(productsJson.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) { }
            subscription.unsubscribe();
          });
        }
      },
      (error) => { this.SpinnerService.hide(); }
    );
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  setFocus(name: any) {
    const ele = this.fct0401.nativeElement[name];
    // console.log("name=>", this.fct0401.nativeElement);
    // console.log("ele=>", ele);
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0401 = this.masterSelected;
    }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.edit0401 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0401 = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  ClearAll() {
    window.location.reload();
  }

  getCheckedItemList() {
    var del = "";
    // var del2 = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function (e, i) {
        if ($(this).prop("checked") == true) {
          if (del != '')
            del += ','
          del += $(this).val();
          alert(del);
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
      })
    }, 100);

  }

  receiveFuncListData(event: any) {
    this.result.post_id = event.fieldIdValue;
    this.result.position = event.fieldNameValue;
    this.closebutton.nativeElement.click();
    // console.log(event)
  }

  loadMyModalComponent() {
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "100px");
  }


  // save update Data
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.result.judge_name) {
      confirmBox.setMessage('กรุณาระบุชื่อผู้พิพากษา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.setFocus('judgName');
        }
        subscription.unsubscribe();
      });
    } else if (!this.result.short_judge_name) {
      confirmBox.setMessage('กรุณาระบุชื่อย่อ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.setFocus('shortJudgeName');
        }
        subscription.unsubscribe();
      });
    } else if (!this.result.post_id) {
      confirmBox.setMessage('กรุณาระบุตำแหน่ง1');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.setFocus('postId');
        }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();

      var formData = new FormData();
      this.result['userToken'] = this.userData.userToken;

      formData.append('file', this.fileToUpload1);
      formData.append('data', JSON.stringify($.extend({}, this.result)));
      // console.log("formData=>", formData);
      this.http.disableHeader().post('/' + this.userData.appName + 'ApiCT/API/fct0401/saveData', formData).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          // console.log("alertMessage=>", alertMessage);
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();
            confirmBox.setMessage('ข้อความแจ้งเตือน');
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                $("button[type='reset']")[0].click();
              }
              subscription.unsubscribe();
            });
            this.ngOnInit();
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }


  editData(index: any) {
    this.SpinnerService.show();
    this.result.edit_judge_id = this.posts[index]['judge_id'];
    this.result.judge_id = this.posts[index]['judge_id'];
    this.result.judge_name = this.posts[index]['judge_name'];
    this.result.short_judge_name = this.posts[index]['short_judge_name'];
    this.result.post_id = this.posts[index]['post_id'];
    this.result.position = this.posts[index]['position'];
    this.result.position2 = this.posts[index]['position2'];
    this.result.position3 = this.posts[index]['position3'];
    this.result.position4 = this.posts[index]['position4'];
    this.result.head_level_flag = this.posts[index]['head_level_flag'];
    this.result.skip_assign_flag = this.posts[index]['skip_assign_flag'];
    this.result.gen_no = this.posts[index]['gen_no'];
    this.result.room_id = this.posts[index]['room_id'];
    this.result.room_desc = this.posts[index]['room_desc'];
    this.result.from_court = this.posts[index]['from_court'];
    this.result.to_court = this.posts[index]['to_court'];
    this.result.start_date = this.posts[index]['start_date'];
    this.result.end_date = this.posts[index]['end_date'];
    this.result.old_judge_id = this.posts[index]['old_judge_id'];
    this.result.address = this.posts[index]['address'];
    this.result.addr_no = this.posts[index]['addr_no'];
    this.result.moo = this.posts[index]['moo'];
    this.result.soi = this.posts[index]['soi'];
    this.result.road = this.posts[index]['road'];
    this.result.post_no = this.posts[index]['post_no'];
    this.result.tel_no = this.posts[index]['tel_no'];
    this.result.office_room = this.posts[index]['office_room'];
    this.result.remark = this.posts[index]['remark'];

    this.result.prov_id = this.posts[index]['prov_id'];
    this.result.amphur_id = this.posts[index]['amphur_id'];
    this.result.tambon_id = this.posts[index]['tambon_id'];
    if (this.result.prov_id) {
      this.changeProv(this.result.prov_id, '');
    }
    else {
      this.sAmphur.clearModel();
      this.sTambon.clearModel();
    }

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  confirmBox() {
    var isChecked = this.posts.every(function (item: any) {
      return item.edit0401 == false;
    })

    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ไม่พบเงื่อนไข?');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการลบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      this.openbutton.nativeElement.click();
    }
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  loadMyChildComponent() {
    this.loadComponent = true;
  }

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
      this.http.disableLoading().post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
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
              if (resp.success==true){
                var dataDel = [], dataTmp = [];
                var bar = new Promise((resolve, reject) => {
                  this.posts.forEach((ele, index, array) => {
                    if (ele.edit0401 == true) {
                      dataTmp.push(this.posts[index]);
                    }
                  });
                });
                if (bar) {
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0401/deleteDataSelect', data).subscribe(
                    (response) => {
                      let alertMessage: any = JSON.parse(JSON.stringify(response));
                      if (alertMessage.result == 0) {
                        this.SpinnerService.hide();
                      } else {
      
                        this.closebutton.nativeElement.click();
                        $("button[type='reset']")[0].click();
                        this.getData();
                      }
                    },
                    (error) => { this.SpinnerService.hide(); }
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

  printReport() {
    var rptName = 'rct0401';
    // For no parameter : paramData ='{}'
    var paramData = '{}';
    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprov_id" : this.prov_id.nativeElement["prov_id"].value,
    //   "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    // });
    this.printReportService.printReport(rptName, paramData);
  }

  loadTableComponent() {
    this.loadModalComponent = false;
    this.loadComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "auto");
  }

  closeModal() {
    this.loadModalComponent = false;
    this.loadComponent = false;
    $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
  }


  getData() {
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0401', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      //console.log(productsJson)
      this.posts = productsJson.data;
      //console.log(this.posts);
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        // this.checklist2 = this.posts;
        if (productsJson.data.length)
          this.posts.forEach((x: any) => x.edit0401 = false);
        this.rerender();
      } else {
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
      }
      this.SpinnerService.hide();
    });
  }

  onFileChange(e: any, type: any) {
    if (e.target.files.length) {
      this.fileToUpload1 = e.target.files[0];
      var fileName = e.target.files[0].name;

      // console.log("fileToUpload1=>", this.fileToUpload1);
      // console.log("fileName=>", fileName);
      $(e.target).parent('div').find('label').html(fileName);
    } else {
      this.fileToUpload1 = null;
      $(e.target).parent('div').find('label').html('');
    }
  }

  clickOpenFile(index: any) {
    var student = JSON.stringify({
      "judge_id": this.posts[index].judge_id,
      "userToken": this.userData.userToken
    });
    //console.log(student);
    this.http.post('/' + this.userData.appName + 'ApiCT/API/fct0401/getSignature', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      // console.log(productsJson)
      if (productsJson.result == 1) {
        if (productsJson.url.length)
          myExtObject.OpenWindowMax(productsJson.url);
      }
    });
  }

  tabChange(obj: any) {
    let find_id = this.list.find((x: any) => x.fieldIdValue === parseInt(obj.target.value));
    if (typeof find_id != 'undefined') {
      this.result.position = this.list.find((x: any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue;
    } else {
      this.result.position = "";
    }
  }

  tabChangeSelect(objName: any, objData: any, event: any, type: any) {
    if (typeof event != 'undefined') {

      if (type == 1) {
        var val = objData.filter((x: any) => x.fieldIdValue === event.target.value);
      } else if (type == 2) {
        var val = objData.filter((x: any) => x.fieldIdValue == event.target.value);
      } else if (type == 3 || type == 4) {
        var val = objData.filter((x: any) => x.fieldIdValue === event);
      }
      if (val.length != 0) {

        this.result[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
        if (objName == "prov_id") {
          this.changeProv(event.target.value, type);
        } else if (objName == "amphur_id") {
          this.changeAmphur(event.target.value, type);
        } else if (objName == "tambon_id") {
          this.changeTambon(event.target.value, type);
        }
      } else {
        this.clearData(objName, type);
      }
    } else {
      this.clearData(objName, type);
    }
  }

  clearData(objName: any, type: any) {
    if (type == 1 || type == 4) {
      this.result[objName] = "";
      this[objName] = "";
    } else {
      this.result[objName] = null;
      this[objName] = null;
    }
  }

  //startDate , endDate
  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  changeProv(province: any, type: any) {
    this.result.prov_id = province;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "table_name": "pamphur",
      "field_id": "amphur_id",
      "field_name": "amphur_name",
      "condition": " AND prov_id='" + province + "'",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getAmphur = getDataOptions;
        setTimeout(() => {
          if (this.result.amphur_id) {
            this.changeAmphur(this.result.amphur_id, type);
          }
        }, 100);
      },
      (error) => { }
    )
    if (typeof province == 'undefined') {
      // if(typeof province=='undefined' || type==1){
      this.sAmphur.clearModel();
      this.sTambon.clearModel();
      this.result.prov_id = "";
      this.result.amphur_id = "";
      this.result.tambon_id = "";
    }
  }

  changeAmphur(Amphur: any, type: any) {
    // console.log("changeAmphur=>",Amphur,type);
    this.result.amphur_id = Amphur;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "table_name": "ptambon",
      "field_id": "tambon_id",
      "field_name": "tambon_name",
      "condition": " AND amphur_id='" + Amphur + "' AND prov_id='" + this.result.prov_id + "'",
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getTambon = getDataOptions;
        setTimeout(() => {
          // if(this.edit_tambon_id)
          //   this.result.tambon_id = this.edit_tambon_id;
        }, 100);
      },
      (error) => { }
    )
    if (typeof Amphur == 'undefined') {
      this.sTambon.clearModel();
      this.result.amphur_id = "";
      this.result.tambon_id = "";
    }
  }

  changeTambon(Tambon: any, type: any) {
    //  console.log("changeTambon=>",Tambon,type);
    this.result.tambon_id = Tambon;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var student = JSON.stringify({
      "table_name": "ptambon",
      "field_id": "tambon_id",
      "field_name": "tambon_name",
      "field_name2": "post_code",
      "condition": " AND tambon_id='" + Tambon + "' AND amphur_id='" + this.result.amphur_id + "' AND prov_id='" + this.result.prov_id + "'",
      "userToken": this.userData.userToken
    });
    //console.log(student);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getPostNo = getDataOptions;
        if (this.result.tambon_id) {
          setTimeout(() => {
            this.result.post_no = this.getPostNo.find((o: any) => o.fieldIdValue === this.result.tambon_id).fieldNameValue2;
          }, 100);
        }
      },
      (error) => { }
    )
    // if(typeof Tambon=='undefined' || type==1){
    if (typeof Tambon == 'undefined') {
      this.result.post_no = "";
    }
  }
}