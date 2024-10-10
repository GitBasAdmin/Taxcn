import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map , } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
import { AuthService } from 'src/app/auth.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
declare var myExtObject: any;
@Component({
  selector: 'app-fct9908,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct9908.component.html',
  styleUrls: ['./fct9908.component.css']
})




export class Fct9908Component implements AfterViewInit, OnInit, OnDestroy {
  title = 'datatables';

  posts:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  myExtObject: any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  selectedData: any;
  selData:any;
  dep_code:any;
  sessData:any;
  userData:any;
  programName:string;
  result:any = [];
  fileToUpload: File = null;
  private anyData: any;
  private anyDataForm: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  //public select2Data: Array<Select2OptionData>;

  @ViewChild('fct9908',{static: true}) fct9908 : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild(NgSelectComponent) ngSelect: NgSelectComponent;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('status') status : NgSelectComponent;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,

  ){}

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();

      this.http.get('/'+this.userData.appName+'ApiCT/API/fct9908?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.length)
              this.posts.forEach((x : any ) => x.defaultValue = false);
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
        "url_name" : "fct9908"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          console.log(getDataAuthen)
        },
        (error) => {}
      )

      this.selData = [{id:99,text:'ทั้งหมด'},{id:0,text:'อยู่'},{id:1,text:'ย้าย'}];
      this.setDefPage();

      /*
      let table = $('#example').DataTable({
        drawCallback: () => {
          $('.paginate_button.next').on('click', () => {
            this.nextButtonClickEvent();
          });
          $('.paginate_button.previous').on('click', () => {
            this.previousButtonClickEvent();
          });
          $('.paginate_button:not(.next,.previous)').on('click', () => {
            this.buttonClickEvent();
          });
        },
      });
      */

  }

  setDefPage(){
    this.result.move_flag = 0;
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
    const ele = this.result[name];
    if (ele) {
      ele.focus();
    }
  }



  checkUncheckAll() {
    var length = $("body").find('.dataTables_length').find('select').val();
    console.log(length)
    // for (var i = 0; i < length; i++) {
    //   this.checklist[i].defaultValue = this.masterSelected;
    // }

    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].defaultValue = this.masterSelected;
    }


    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.defaultValue == true;
      })
    this.getCheckedItemList();
  }

  uncheckAll() {
    /*
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].defaultValue = false;
    }
    this.masterSelected = false;
    */
    window.location.reload();
  }

  ClearAll(){
    window.location.reload();
  }


  getCheckedItemList(){
    this.delValue = "";
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].defaultValue){
        if(this.delValue!='')
          this.delValue+=','
        this.delValue+=this.checklist[i].off_id;
      }
    }
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
    if(!this.result.off_id){
      confirmBox.setMessage('กรุณาระบุรหัสเจ้าหน้าที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('off_id');
        }
        subscription.unsubscribe();
      });
    // }else if(!this.result.move_flag){
    //   confirmBox.setMessage('กรุณาระบุสถานะ');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success==true){
    //       //this.SpinnerService.hide();
    //     }
    //     subscription.unsubscribe();
    //   });
    }else if(!this.result.off_name){
      confirmBox.setMessage('กรุณาระบุชื่อเจ้าหน้าที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('off_name');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.dep_code){
      confirmBox.setMessage('กรุณาระบุหน่วยงาน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('dep_code');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.post_id){
      confirmBox.setMessage('กรุณาระบุตำแหน่ง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if(this.result.move_flag == 99){
      confirmBox.setMessage('กรุณาระบุสถานะ');
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
      //var formData: any = new FormData();
      //formData.append("move_flag", this.form.get('move_flag')?);
      var formData = new FormData();
      this.result['edit_off_id'] = this.result.hid_off_id,
      this.result['userToken'] = this.userData.userToken;
      formData.append('signature', this.fileToUpload);
      formData.append('data', JSON.stringify($.extend({}, this.result)));
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }
      /*
      let pmove_flag:any;
      if(this.result.move_flag!=0){
        pmove_flag = 1;
      }else{
        pmove_flag =null;
      }
      var student = JSON.stringify({
        "off_id" : this.result.off_id,
        "off_name" : this.result.off_name,
        "edit_off_id" : this.result.hid_off_id,
        "move_flag" : pmove_flag,
        "post_id" : this.result.post_id,
        "post_name" : this.result.post_name,
        "dep_code" : this.result['dep_code'],
        "dep_name" : this.result.dep_name,
        "userToken" : this.userData.userToken
      });
      console.log(student);
      this.SpinnerService.show();
      */

      //if(this.result.hid_off_id){
        this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct9908/saveData', formData).subscribe(
          (response) =>{
            console.log(response)
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            console.log(alertMessage)
            if(alertMessage.result==0){

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

              confirmBox.setMessage(alertMessage.error);
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
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      /*}else{
        this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct9908/saveJson', formData ).subscribe(
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
              // this.form.reset();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
      */
    }

  }




  editData(val :any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();
    this.http.get('/'+this.userData.appName+'ApiCT/API/fct9908/edit?edit_off_id='+val+'&userToken='+this.userData.userToken+':angular').subscribe(edit => {
      console.log(edit)
      this.SpinnerService.hide();
      let productsJson = JSON.parse(JSON.stringify(edit));
      console.log(productsJson);
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
        this.result = productsJson.data[0];
        this.result.hid_off_id = this.result.off_id;
      //this.form.patchValue({"off_id": productsJson.data[0]['off_id']});
      //this.form.patchValue({"hid_off_id": productsJson.data[0]['off_id']});
      //this.form.patchValue({"off_name": productsJson.data[0]['off_name']});
      //console.log(productsJson.data[0]['move_flag'])
      //if(productsJson.data[0]['move_flag']!=null && productsJson.data[0]['move_flag']!= 0){
        //this.selectedData = productsJson.data[0]['move_flag'];
       //}else{
        //this.selectedData = null;
        //this.status.select(this.status.itemsList.findByLabel('อยู่'));
      //}
      // if(this.selectedData = '0'){
      //   this.status.select(this.status.itemsList.findByLabel('อยู่'));
      // }
      //this.form.patchValue({"dep_code": productsJson.data[0]['dep_code']});
      //this.form.patchValue({"dep_name": productsJson.data[0]['dep_name']});
      //this.form.patchValue({"post_id": productsJson.data[0]['post_id']});
      //this.form.patchValue({"post_name": productsJson.data[0]['post_name']});

        // var sel = this.selData;
        // for (var x = 0; x < sel.length; x++) {
        //   if(sel[x].id == productsJson.data[0]['move_flag']){
        //     this.ngSelect.select(this.ngSelect.itemsList.findByLabel(this.selData[x].text));
        //   }
        // }

        //this.setFocus('url');
      }
    });
  }

  searchData() {

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "off_id" : this.result.off_id,
      "off_name" : this.result.off_name,
      "move_flag" : this.result.move_flag,
      "post_id" : this.result.post_id,
      "dep_code" : this.result['dep_code'],
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9908/search', student , {headers:headers}).subscribe(
      posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.length)
              this.posts.forEach((x : any ) => x.defaultValue = false);
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


    loadMyChildComponent(val:any){

      if(val==1){
        var student = JSON.stringify({"table_name" : "pdepartment", "field_id" : "dep_code","field_name" : "dep_name","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
        this.listTable='pdepartment';
        this.listFieldId='dep_code';
        this.listFieldName='dep_name';
        this.listFieldNull='';
      }else{
        var student = JSON.stringify({"table_name" : "pposition", "field_id" : "post_id","field_name" : "post_name","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
        this.listTable='pposition';
        this.listFieldId='post_id';
        this.listFieldName='post_name';
        this.listFieldNull='';
      }

      //console.log(student)

       let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
       //var student = JSON.stringify({"table_name" : this.form.get("table_name")?.value, "field_id" : this.form.get("field_id")?.value,"field_name" : this.form.get("field_name")?.value});
       //console.log(student)

       this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
           (response) =>{
             this.list = response;
             this.loadModalComponent = false;
             this.loadComponent = true;
             $("#exampleModal").find(".modal-body").css("height","auto");
             console.log(response)
           },
           (error) => {}
         )

    }


    receiveFuncListData(event:any){
        console.log(event)
          this.result[this.listFieldId]=event.fieldIdValue;
          this.result[this.listFieldName]=event.fieldNameValue;
        this.closebutton.nativeElement.click();
    }

    loadMyModalComponent(){
      this.loadComponent = false;
      this.loadModalComponent = true;
      $("#exampleModal").find(".modal-body").css("height","100px");
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
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student , {headers:headers}).subscribe(
          posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));
            console.log(productsJson)
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
                  this.SpinnerService.show();
                  this.http.get('/'+this.userData.appName+'ApiCT/API/fct9908/delete?delete_off_id='+this.delValue+'&userToken='+this.userData.userToken+':angular').subscribe(del => {
                  console.log(del);
                  this.closebutton.nativeElement.click();
                  this.ngOnInit();
                  $("button[type='reset']")[0].click();
                  this.SpinnerService.hide();
                });
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
                if (resp.success==true){
                 }
                subscription.unsubscribe();
              });
            }
          },
          (error) => {}
        );
      

      }

    }

    tabChange(val:any){
      if(val==1){
        this.listTable = "pdepartment";
        this.listFieldId = "dep_code";
        this.listFieldName = "dep_name";
      }else{
        this.listTable = "pposition";
        this.listFieldId = "post_id";
        this.listFieldName = "post_name";
      }
      this.SpinnerService.show();
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "table_name": this.listTable,
        "field_id": this.listFieldId,
        "field_name": this.listFieldName,
        "search_id":this.result[this.listFieldId],
        "search_desc":'',
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        datalist => {

          let productsJson = JSON.parse(JSON.stringify(datalist));
          if(productsJson.length){
            this.result[this.listFieldName]=productsJson[0].fieldNameValue;
            this.SpinnerService.hide();
          }else{
            this.SpinnerService.hide();
            this.result[this.listFieldId]="";
            this.result[this.listFieldName]="";

            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('ไม่พบข้อมูล');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.setFocus(this.listFieldId);
                }
                subscription.unsubscribe();
              });

          }

        },
        (error) => {}
      );

    }


    printReport(){
      var rptName = 'rct9908';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
      // var paramData = JSON.stringify({
      //   "prea_id" : this.rea_id.nativeElement["rea_id,
      //   "prea_desc" : this.rea_id.nativeElement["rea_desc
      // });

      this.printReportService.printReport(rptName,paramData);
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

    onFileChange(e:any) {
      if(e.target.files.length){
        this.fileToUpload = e.target.files[0];
        var fileName = e.target.files[0].name;
        $(e.target).parent('div').find('label').html(fileName);
      }else{
        $(e.target).parent('div').find('label').html('');
      }
    }

    delFile(off_id:any){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ยืนยันการลบลายเซ็น');
          confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
          // Choose layout color type
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                
                var student = JSON.stringify({
                  "edit_off_id": this.result.edit_off_id,
                  "userToken" : this.userData.userToken
                });
                console.log(student)
                this.http.post('/'+this.userData.appName+'ApiCT/API/fct9908/delSignature', student).subscribe(
                  posts => {
                    let productsJson : any = JSON.parse(JSON.stringify(posts));
                    this.posts = productsJson.data;
                    console.log(productsJson)
                    if(productsJson.result==1){
                      confirmBox.setMessage(productsJson.error);
                      confirmBox.setButtonLabels('ตกลง');
                      confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                        if (resp.success==true){
                          this.editData(this.result.edit_off_id);
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
                        if (resp.success==true){
                        }
                        subscription.unsubscribe();
                      });
                    }
                  },
                  (error) => {this.SpinnerService.hide();}
                );
              }
              subscription.unsubscribe();
            });
    }

    openSign(index:any){
      const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
      var student = JSON.stringify({
        "off_id": this.posts[index].off_id,
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9908/getSignature', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          if(productsJson.result==1){
            myExtObject.OpenWindowMaxName(productsJson.url);
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
        },
        (error) => {this.SpinnerService.hide();}
      );
      //let winURL = window.location.href.split("/#/")[0]+"/#/";
      //myExtObject.OpenWindowMaxName(winURL+this.userData.appName+'ApiCT/API/fct9908/openSignature?off_id='+this.posts[index].off_id+'&userToken='+this.userData.userToken+':angular');
    }
}



