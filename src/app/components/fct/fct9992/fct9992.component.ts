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
// import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-fct9992',
  templateUrl: './fct9992.component.html',
  styleUrls: ['./fct9992.component.css']
})


export class Fct9992Component implements AfterViewInit, OnInit, OnDestroy {
  form: FormGroup;
  title = 'datatables';

  posts:any;
  public list:any;
  public listTable:any = 'pprogram_module';
  public listFieldId:any = 'module_id';
  public listFieldName:any = 'module_name';

  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  selectedData: number;
  selectedData2: number;
  selectedData3: number;
  selData:any;
  selData2:any;
  selData3:any;
  dep_code:any;
  sessData:any;
  userData:any;
  length:any;
  programName:string;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public loadComponent: boolean = false;
  //public select2Data: Array<Select2OptionData>;

  @ViewChild('fct9992',{static: true}) fct9992 : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('myselect') myselect : NgSelectComponent;
  @ViewChild('myselect2') myselect2 : NgSelectComponent;
  @ViewChild('myselect3') myselect3 : NgSelectComponent;
  //@ViewChild(NgSelectComponent) ngSelect: NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ){
    this.masterSelected = false,
    this.form = this.formBuilder.group({
      url: [''],
      hid_program_id: [''],
      program_name: [''],
      module_id: [''],
      module_name: [''],
      main_menu_flag : [''],
      valid_flag : [''],
      show_case_flag : [''],
      security : ['']
    })
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
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct9992?userToken='+this.userData.userToken+':angular').subscribe(posts => {
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
        "url_name" : "fct9992"
      });
      console.log(authen);
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          console.log(getDataAuthen)
        },
        (error) => {}
      )

      this.selData = [{id: 'F',text: 'Child menu'},{id: 'S',text: 'Sub menu'},{id: 'Y',text: 'Parent'}];
      this.selData2 = [{id: 'Y',text: 'ใช้งาน'},{id: 'N',text: 'ไม่ใช้งาน'}];
      this.selData3 = [{id: '1',text: 'admin'},{id: '2',text: 'บริษัทผู้ดูแลระบบ'}];
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
    const ele = this.fct9992.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }



  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].defaultValue = this.masterSelected;
      //console.log(i+":"+this.checklist.length)
      if(i+1==this.checklist.length){
        this.getCheckedItemList();
      }
    }

  }

  isAllSelected() {
    this.masterSelected = this.checklist.forEach((currentValue:any, index:any) => {
      return index.defaultValue == true;
    });
    this.getCheckedItemList();
  }

  uncheckAll() {

    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].defaultValue = false;
    }
    this.masterSelected = false;

  }

  ClearAll(){
    window.location.reload();
  }

  getCheckedItemList(){
    var del = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function(e,i){
        if($(this).prop("checked")==true){
          if(del!='')
            del+=','
          del+=$(this).val();
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
      })
    }, 100);
    /*
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].defaultValue){
        if(this.delValue!='')
          this.delValue+=','
        this.delValue+=this.checklist[i].program_id;
      }
    }*/
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

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(this.fct9992.nativeElement["show_case_flag"].checked==true){
      var inputChk = 1;
    }else{
      var inputChk = 0;
    }
    var student = JSON.stringify({
      "url_name" : this.fct9992.nativeElement["url"].value,
      "edit_program_id" : this.fct9992.nativeElement["hid_program_id"].value,
      "program_id" : this.fct9992.nativeElement["hid_program_id"].value,
      "program_name" : this.fct9992.nativeElement["program_name"].value,
      "main_menu_flag" : this.fct9992.nativeElement["main_menu_flag"].value,
      "security" : this.fct9992.nativeElement["security"].value,
      "valid_flag" : this.fct9992.nativeElement["valid_flag"].value,
      "module_id" : this.fct9992.nativeElement["module_id"].value,
      "module_name" : this.fct9992.nativeElement["module_name"].value,
      "show_case_flag" : inputChk,
      "userToken" : this.userData.userToken
    });
    console.log(student);
    this.SpinnerService.show();
    if(this.fct9992.nativeElement["hid_program_id"].value){
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9992/updateJson', student , {headers:headers}).subscribe(
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
            confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                //this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
            this.ngOnInit();
            this.form.reset();
            this.myselect.handleClearClick();
            this.myselect2.handleClearClick();
            this.myselect3.handleClearClick();
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }else{
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9992/saveJson', student , {headers:headers}).subscribe(
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
                //this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
            this.ngOnInit();
            this.form.reset();
            this.myselect.handleClearClick();
            this.myselect2.handleClearClick();
            this.myselect3.handleClearClick();
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }



  }


  editData(val :any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    this.SpinnerService.show();
    this.http.get('/'+this.userData.appName+'ApiCT/API/fct9992/edit?edit_program_id='+val+'&userToken='+this.userData.userToken+':angular').subscribe(edit => {
      console.log(edit)
      this.SpinnerService.hide();
      let productsJson = JSON.parse(JSON.stringify(edit));
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
        this.form.patchValue({"url": productsJson.data[0]['url_name']});
        this.form.patchValue({"hid_program_id": productsJson.data[0]['program_id']});
        this.form.patchValue({"program_name": productsJson.data[0]['program_name']});
        this.form.patchValue({"main_menu_flag": productsJson.data[0]['main_menu_flag']});
        this.form.patchValue({"security": productsJson.data[0]['security']});
        this.form.patchValue({"valid_flag": productsJson.data[0]['valid_flag']});
        this.form.patchValue({"module_id": productsJson.data[0]['module_id']});
        this.form.patchValue({"module_name": productsJson.data[0]['module_name']});
        if(productsJson.data[0]['show_case_flag']){
          this.fct9992.nativeElement["show_case_flag"].checked=true;
        }else{
          this.fct9992.nativeElement["show_case_flag"].checked=false;
        }

        var sel = this.selData;
        for (var x = 0; x < sel.length; x++) {
          if(sel[x].id == productsJson.data[0]['main_menu_flag']){
            this.myselect.select(this.myselect.itemsList.findByLabel(this.selData[x].text));
          }
        }
        var sel2 = this.selData2;
        for (var x = 0; x < sel2.length; x++) {
          if(sel2[x].id == productsJson.data[0]['valid_flag']){
            this.myselect2.select(this.myselect2.itemsList.findByLabel(this.selData2[x].text));
          }
        }
        var sel3 = this.selData3;
        for (var x = 0; x < sel3.length; x++) {
          if(sel3[x].id == productsJson.data[0]['security']){
            this.myselect3.select(this.myselect3.itemsList.findByLabel(this.selData3[x].text));
          }
        }
        this.setFocus('url');
      }
    });
  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(this.fct9992.nativeElement["show_case_flag"].checked==true){
      var inputChk = 1;
    }else{
      var inputChk = 0;
    }
    var student = JSON.stringify({
      "url_name" : this.fct9992.nativeElement["url"].value,
      "program_name" : this.fct9992.nativeElement["program_name"].value,
      "main_menu_flag" : this.fct9992.nativeElement["main_menu_flag"].value,
      "security" : this.fct9992.nativeElement["security"].value,
      "valid_flag" : this.fct9992.nativeElement["valid_flag"].value,
      "module_id" : this.fct9992.nativeElement['module_id'].value,
      "show_case_flag" : inputChk,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9992/search', student , {headers:headers}).subscribe(
      posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
        console.log(productsJson)
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
    //alert(this.delValue);
  if(!$("body").find("input[name='delValue']").val()){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
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
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
    confirmBox.setMessage('ยืนยันการลบข้อมูล');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

    // Choose layout color type
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    this.delValue = $("body").find("input[name='delValue']").val();
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.SpinnerService.show();
          this.http.get('/'+this.userData.appName+'ApiCT/API/fct9992/delete?delete_program_id='+this.delValue+'&userToken='+this.userData.userToken+':angular').subscribe(del => {
          console.log(del);
          this.ngOnInit();
          $("body").find("input[name='delValue']").val('');
          this.SpinnerService.hide();
        });
        }
        subscription.unsubscribe();
    });
  }

  }


    loadMyChildComponent(val:any){

      if(val==1){
        var student = JSON.stringify({"table_name" : "pdepartment", "field_id" : "dep_code","field_name" : "dep_name","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
        this.listTable='pdepartment';
        this.listFieldId='dep_code';
        this.listFieldName='dep_name';
      }else{
        var student = JSON.stringify({"table_name" : "pprogram_module", "field_id" : "module_id","field_name" : "module_name","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
        this.listTable='pprogram_module';
        this.listFieldId='module_id';
        this.listFieldName='module_name';
      }

      //console.log(student)

       let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
       //var student = JSON.stringify({"table_name" : this.form.get("table_name")?.value, "field_id" : this.form.get("field_id")?.value,"field_name" : this.form.get("field_name")?.value});
       //console.log(student)

       this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
           (response) =>{
             this.list = response;
             this.loadComponent = true;
             console.log(response)
           },
           (error) => {}
         )

        /*
         this.http.get('/'+this.userData.appName+'ApiCT/API/fct0218').subscribe(posts => {
          this.list = posts;                         // <<<---using ()=> syntax
          this.loadComponent = true;
          console.log(this.list)
          //this.persons = (data as any).data;
        });

        */

    }

    receiveFuncListData(event:any){
        console.log(event)
          this.fct9992.nativeElement[this.listFieldId].value=event.fieldIdValue;
          this.fct9992.nativeElement[this.listFieldName].value=event.fieldNameValue;
        this.closebutton.nativeElement.click();
    }

    tabChange(val:any){
      if(this.fct9992.nativeElement['module_id'].value=='' || this.fct9992.nativeElement['module_id'].value=='0'){
        this.fct9992.nativeElement['module_name'].value="";
      }else{


        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var student = JSON.stringify({
          "table_name": this.listTable,
          "field_id": this.listFieldId,
          "field_name": this.listFieldName,
          "search_id":this.fct9992.nativeElement[this.listFieldId].value,
          "search_desc":'',
          "userToken" : this.userData.userToken
        });
        //console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
          datalist => {

            let productsJson = JSON.parse(JSON.stringify(datalist));
            if(productsJson.length){
              this.fct9992.nativeElement[this.listFieldName].value=productsJson[0].fieldNameValue;
              this.SpinnerService.hide();
            }else{
              this.SpinnerService.hide();
              this.fct9992.nativeElement[this.listFieldId].value="";
              this.fct9992.nativeElement[this.listFieldName].value="";

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

    }


}




