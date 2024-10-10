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
  selector: 'app-fct9994',
  templateUrl: './fct9994.component.html',
  styleUrls: ['./fct9994.component.css']
})


export class Fct9994Component implements AfterViewInit, OnInit, OnDestroy {
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
  selData:any;
  selData2:any;
  dep_code:any;
  sessData:any;
  userData:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public loadComponent: boolean = false;
  //public select2Data: Array<Select2OptionData>;

  @ViewChild('fct9994',{static: true}) fct9994 : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ){
    this.masterSelected = false,
    this.form = this.formBuilder.group({
      module_id: [''],
      hid_module_id: [''],
      module_name: [''],
      module_path: ['']
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
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct9994?userToken='+this.userData.userToken+':angular').subscribe(posts => {
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
    const ele = this.fct9994.nativeElement[name];    
    if (ele) {
      ele.focus();
    }
  }

  

  checkUncheckAll() {
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

  getCheckedItemList(){
    this.delValue = "";
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].defaultValue){
        if(this.delValue!='')
          this.delValue+=','
        this.delValue+=this.checklist[i].module_id;
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

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "module_id" : this.fct9994.nativeElement["module_id"].value,
      "edit_module_id" : this.fct9994.nativeElement["hid_module_id"].value,
      "module_name" : this.fct9994.nativeElement["module_name"].value,
      "module_path" : this.fct9994.nativeElement["module_path"].value,
      "userToken" : this.userData.userToken
    });
    console.log(student);
    this.SpinnerService.show(); 
    if(this.fct9994.nativeElement["hid_module_id"].value){
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9994/updateJson', student , {headers:headers}).subscribe(
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

          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }else{
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9994/saveJson', student , {headers:headers}).subscribe(
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
    this.http.get('/'+this.userData.appName+'ApiCT/API/fct9994/edit?edit_module_id='+val+'&userToken='+this.userData.userToken+':angular').subscribe(edit => {
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
        this.form.patchValue({"module_id": productsJson.data[0]['module_id']});
        this.form.patchValue({"hid_module_id": productsJson.data[0]['module_id']});
        this.form.patchValue({"module_name": productsJson.data[0]['module_name']});
        this.form.patchValue({"module_path": productsJson.data[0]['module_path']});

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
    var student = JSON.stringify({
      "module_id" : this.fct9994.nativeElement["module_id"].value,
      "module_name" : this.fct9994.nativeElement["module_name"].value,
      "module_path" : this.fct9994.nativeElement["module_path"].value,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9994/search', student , {headers:headers}).subscribe(
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
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
    confirmBox.setMessage('ยืนยันการลบข้อมูล');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

    // Choose layout color type
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });

    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.SpinnerService.show(); 
          this.http.get('/'+this.userData.appName+'ApiCT/API/fct9994/delete?delete_module_id='+this.delValue+'&userToken='+this.userData.userToken+':angular').subscribe(del => {
          console.log(del);
          this.ngOnInit();
          this.SpinnerService.hide();
        });
        }
        subscription.unsubscribe();
    });
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
         this.http.get('API/setup/fct0218').subscribe(posts => {
          this.list = posts;                         // <<<---using ()=> syntax
          this.loadComponent = true;
          console.log(this.list)
          //this.persons = (data as any).data;
        });
        
        */
        
    }

    receiveFuncListData(event:any){
        console.log(event)
          this.fct9994.nativeElement[this.listFieldId].value=event.fieldIdValue;
          this.fct9994.nativeElement[this.listFieldName].value=event.fieldNameValue;
        this.closebutton.nativeElement.click();
    }

    tabChange(val:any){
      this.SpinnerService.show(); 
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "table_name": this.listTable,
        "field_id": this.listFieldId,
        "field_name": this.listFieldName,
        "search_id":this.fct9994.nativeElement[this.listFieldId].value,
        "search_desc":'',
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        datalist => {
          
          let productsJson = JSON.parse(JSON.stringify(datalist));
          if(productsJson.length){
            this.fct9994.nativeElement[this.listFieldName].value=productsJson[0].fieldNameValue;
            this.SpinnerService.hide(); 
          }else{
            this.SpinnerService.hide();
            this.fct9994.nativeElement[this.listFieldId].value="";
            this.fct9994.nativeElement[this.listFieldName].value="";
            
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




