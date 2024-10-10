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
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';

@Component({
  selector: 'app-fct9993',
  templateUrl: './fct9993.component.html',
  styleUrls: ['./fct9993.component.css']
})

export class Fct9993Component implements AfterViewInit, OnInit, OnDestroy {
  form: FormGroup;
  title = 'datatables';
  
  posts:any;
  getOptions:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFormRetId:any;
  public listFormRetName:any;
  public listFormRetName2:any;
  public listFieldNull:any;
  public listFieldType:any;
  search:any;
  masterSelected:boolean;
  queryMasterSelected:boolean;
  insertMasterSelected:boolean;
  updateMasterSelected:boolean;
  deleteMasterSelected:boolean;
  printMasterSelected:boolean;
  checklist:any;
  checkedList:any;
  checkMatch:any;
  getData:any;
  getType:any;
  getDepCode:any;
  delValue:any;
  selectedData:any= 'พนักงาน';
  selData:any;
  dep_code:any;
  sessData:any;
  userData:any;
  cType = 1;
  cCopy:number;
  programName:string;
  selParentId:number;
  modalType:any;
  getDep:any;
  assDep:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public loadComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadAssignAllComponent: boolean = false;

  //public select2Data: Array<Select2OptionData>;

  @ViewChild('fct9993',{static: true}) fct9993 : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild(NgSelectComponent) ngSelect: NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
  ){
    this.masterSelected = false,
    this.form = this.formBuilder.group({
      user_id: [''],
      type: [''],
      off_name: [''],
      dname: [''],
      dname2: [''],
      assUser:[''],
      assName:[''],
      user_running:[''],
      assign_user_running:['']
    })
  }

ngOnInit(): void {
  
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    /*console.log(sessionStorage.getItem(this.authService.sessionStor))
    if(!sessionStorage.getItem(this.authService.sessionStor)){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณา login เข้าสู่ระบบก่อนการใช้งาน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.router.navigate(['/login']);
        }
        subscription.unsubscribe();
        return false;
      });
      
    }
    */
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']]/*,
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
      */
    };
    
    this.selData = [{id: '1',text: 'พนักงาน'},{id: '2',text: 'ผู้พิพากษา'},{id: '3',text: 'หน่วยงาน'}];
    this.posts=[];

    //==============================================================

    var student = JSON.stringify({
      "table_name" : "pprogram",
      "field_id" : "program_id",
      "field_name" : "program_name",
      "condition" : "AND main_menu_flag!='F'",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOptions = getDataOptions;
        this.rerender();
        //console.log(getDataOptions)
      },
      (error) => {this.SpinnerService.hide();}
    )
    
    //==============================================================
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fct9993"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        //console.log(getDataAuthen)
      },
      (error) => {}
    )
    
    //==============================================================

    var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
      },
      (error) => {this.SpinnerService.hide();}
    )
    
  

    
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
    this.fct9993.nativeElement['type'].value='1';
    }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }
 

  setFocus(name:any) {    
    const ele = this.fct9993.nativeElement[name];    
    if (ele) {
      ele.focus();
    }
  }

  
  //========================== checked All head 
  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit_program_id = this.masterSelected;
      this.checklist[i].query_flag = this.masterSelected;
      this.checklist[i].insert_flag = this.masterSelected;
      this.checklist[i].update_flag = this.masterSelected;
      this.checklist[i].delete_flag = this.masterSelected;
      this.checklist[i].print_flag = this.masterSelected;
      this.queryMasterSelected = this.masterSelected;
      this.insertMasterSelected = this.masterSelected;
      this.updateMasterSelected = this.masterSelected;
      this.deleteMasterSelected = this.masterSelected;
      this.printMasterSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  checkQuerySelected() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].query_flag = this.queryMasterSelected;
    }
  }
  checkInsertSelected() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].insert_flag = this.insertMasterSelected;
    }
  }
  checkUpdateSelected() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].update_flag = this.updateMasterSelected;
    }
  }
  checkDeleteSelected() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].delete_flag = this.deleteMasterSelected;
    }
  }
  checkPrintSelected() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].print_flag = this.printMasterSelected;
    }
  }
  //================================ check checked All
  isAllSelected(index:any) {
    this.masterSelected = this.checklist.every(function(item:any) {
        //return item.edit_program_id == true;
        //return true;
      })

      this.checklist[index].query_flag = this.checklist[index].selected;
      this.checklist[index].insert_flag = this.checklist[index].selected;
      this.checklist[index].update_flag = this.checklist[index].selected;
      this.checklist[index].delete_flag = this.checklist[index].selected;
      this.checklist[index].print_flag = this.checklist[index].selected;
      this.checklist[index].parent_id = '0';
    this.getCheckedItemList();
  }
  isAllQuerySelected() {
    this.queryMasterSelected = this.checklist.every(function(item:any) {
        return item.query_flag == true;
      })
  }
  isAllInsertSelected() {
    this.insertMasterSelected = this.checklist.every(function(item:any) {
        return item.insert_flag == true;
      })
  }
  
  isAllUpdateSelected() {
    this.updateMasterSelected = this.checklist.every(function(item:any) {
        return item.update_flag == true;
      })
  }
  isAllDeleteSelected() {
    this.deleteMasterSelected = this.checklist.every(function(item:any) {
        return item.delete_flag == true;
      })
  }
  isAllPrintSelected() {
    this.printMasterSelected = this.checklist.every(function(item:any) {
        return item.print_flag == true;
      })
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
    //console.log(this.posts.length);

    if(this.cCopy==1 && this.fct9993.nativeElement['assUser'].value){
      var element = JSON.stringify({
        'user_running':this.fct9993.nativeElement['user_running'].value,
        'assign_user_running':this.fct9993.nativeElement['assign_user_running'].value,
        'assign_off_name':this.fct9993.nativeElement['assName'].value,
        "userToken" : this.userData.userToken});
    }else if(this.cCopy==2 && this.assDep){
      var element = JSON.stringify({
        'user_running':this.fct9993.nativeElement['user_running'].value,
        'assign_dep_code':this.assDep,
        "userToken" : this.userData.userToken});
    }else{
      var data=[];
      for (var i = 0; i < this.posts.length; i++) {
        if(this.posts[i].selected){
          var selected = '1';
        }else{
          var selected = '0'; 
        }
        var court_running = this.posts[i].court_running;
        var user_id = this.posts[i].user_id1;
        var user_running =this.checkMatch[i].user_running1;
        var parent_id =this.posts[i].parent_id;
        var program_id =this.posts[i].program_id;
        var dep_code =this.posts[i].dep_code;
        var favorites_flag ='';//this.checkMatch[i].favorites_flag1;
        if(this.posts[i].query_flag==true){
          var query_flag = 'Y';
        }else{
          query_flag = this.checkMatch[i].query_flag1; 
        }
        if(this.posts[i].insert_flag==true){
          var insert_flag = 'Y';
        }else{
          insert_flag = this.checkMatch[i].insert_flag1; 
        }
        if(this.posts[i].update_flag==true){
          var update_flag = 'Y';
        }else{
          update_flag = this.checkMatch[i].update_flag1; 
        }
        if(this.posts[i].delete_flag==true){
          var delete_flag = 'Y';
        }else{
          delete_flag = this.checkMatch[i].delete_flag1; 
        }
        if(this.posts[i].print_flag==true){
          var print_flag = 'Y';
        }else{
          print_flag = this.checkMatch[i].print_flag1; 
        }

        var display_number =this.posts[i].display_number;
        var edit_user_running =this.posts[i].edit_user_running;
        var edit_program_id =this.posts[i].edit_program_id;
        var edit_dep_code = this.checkMatch[i].edit_dep_code1; 

        var dataForm = selected+':'+  
        court_running+':'+
        user_id+':'+
        user_running+':'+
        parent_id+':'+
        program_id+':'+
        dep_code+':'+
        favorites_flag+':'+
        query_flag+':'+
        insert_flag+':'+
        update_flag+':'+
        delete_flag+':'+
        print_flag+':'+
        display_number+':'+
        edit_user_running+':'+
        edit_program_id+':'+
        edit_dep_code;

        var dataMaster = this.checkMatch[i].selected1+':'+  
        this.checkMatch[i].court_running1+':'+
        this.checkMatch[i].user_id1+':'+
        this.checkMatch[i].user_running1+':'+
        this.checkMatch[i].parent_id1+':'+
        this.checkMatch[i].program_id1+':'+
        this.checkMatch[i].dep_code1+':'+
        this.checkMatch[i].favorites_flag1+':'+
        this.checkMatch[i].query_flag1+':'+
        this.checkMatch[i].insert_flag1+':'+
        this.checkMatch[i].update_flag1+':'+
        this.checkMatch[i].delete_flag1+':'+
        this.checkMatch[i].print_flag1+':'+
        this.checkMatch[i].display_number1+':'+
        this.checkMatch[i].edit_user_running1+':'+
        this.checkMatch[i].edit_program_id1+':'+
        this.checkMatch[i].edit_dep_code1;
        
        /*
        console.log('A:'+selected+':'+  
          court_running+':'+
          user_id+':'+
          user_running+':'+
          parent_id+':'+
          program_id+':'+
          dep_code+':'+
          favorites_flag+':'+
          query_flag+':'+
          insert_flag+':'+
          update_flag+':'+
          delete_flag+':'+
          print_flag+':'+
          display_number+':'+
          edit_user_running+':'+
          edit_program_id+':'+
          edit_dep_code);

          console.log('B:'+this.checkMatch[i].selected1+':'+  
          this.checkMatch[i].court_running1+':'+
          this.checkMatch[i].user_id1+':'+
          this.checkMatch[i].user_running1+':'+
          this.checkMatch[i].parent_id1+':'+
          this.checkMatch[i].program_id1+':'+
          this.checkMatch[i].dep_code1+':'+
          this.checkMatch[i].favorites_flag1+':'+
          this.checkMatch[i].query_flag1+':'+
          this.checkMatch[i].insert_flag1+':'+
          this.checkMatch[i].update_flag1+':'+
          this.checkMatch[i].delete_flag1+':'+
          this.checkMatch[i].print_flag1+':'+
          this.checkMatch[i].display_number1+':'+
          this.checkMatch[i].edit_user_running1+':'+
          this.checkMatch[i].edit_program_id1+':'+
          this.checkMatch[i].edit_dep_code1);
        */

         if(dataForm!=dataMaster){
            data.push({  
              selected: selected,  
              court_running: court_running,
              user_id : user_id,
              user_running : user_running,
              parent_id : parent_id,
              program_id : program_id,
              dep_code : dep_code,
              favorites_flag : favorites_flag,
              query_flag : query_flag,
              insert_flag : insert_flag,
              update_flag : update_flag,
              delete_flag : delete_flag,
              print_flag : print_flag,
              display_number : display_number,
              edit_user_running : edit_user_running,
              edit_program_id : edit_program_id,
              edit_dep_code : edit_dep_code
          });  
        }
      
      }
    
      if(this.getType==3){
        var element = JSON.stringify({'user_running':'0','dep_code':this.getDepCode,'userToken' : this.userData.userToken,data});
      }else{
        var element = JSON.stringify({'user_running':this.getData.user_running,'dep_code':this.getData.dep_code,'userToken' : this.userData.userToken,data});
      }
    }
    console.log(element)

    if((this.cCopy==1 && this.fct9993.nativeElement['assUser'].value) || (this.cCopy==2 && this.assDep)){
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9993/copyData', element ).subscribe(
        (response) =>{
          console.log(response)
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          //console.log(alertMessage)
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
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                //this.SpinnerService.hide();
                this.listFormRetId = 'user_id';
                this.listFormRetName='off_name';
                this.cCopy = 0;
                if(this.modalType==1){
                  this.receiveFuncListData({'fieldIdValue':this.fct9993.nativeElement['assUser'].value,'fieldNameValue':this.fct9993.nativeElement['assName'].value});
                }else{
                  this.fct9993.nativeElement['user_id'].value = this.fct9993.nativeElement['assUser'].value;
                  this.fct9993.nativeElement['off_name'].value = this.fct9993.nativeElement['assName'].value;
                  this.fct9993.nativeElement['user_running'].value = this.fct9993.nativeElement['assign_user_running'].value;
                  setTimeout(() => {
                    /* this.fct9993.nativeElement['assUser'].value='';
                    this.fct9993.nativeElement['assName'].value='';
                    this.fct9993.nativeElement['assign_user_running'].value=''; */
                    this.SpinnerService.hide();
                  }, 500);
                  
                  this.loadProgramData(2,0);//======= ผู้พิพากษา
                }
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }else{
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9993/saveJson', element ).subscribe(
        (response) =>{
          console.log(response)
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          //console.log(alertMessage)
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
            this.loadProgramData(this.fct9993.nativeElement['type'].value,1);
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
    this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993/edit?edit_off_id='+val+'&userToken='+this.userData.userToken+':angular').subscribe(edit => {
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

      this.form.patchValue({"off_id": productsJson.data[0]['off_id']});
      this.form.patchValue({"hid_off_id": productsJson.data[0]['off_id']});
      this.form.patchValue({"off_name": productsJson.data[0]['off_name']});
      this.form.patchValue({"dep_code": productsJson.data[0]['dep_code']});
      this.form.patchValue({"dep_name": productsJson.data[0]['dep_name']});
      this.form.patchValue({"post_id": productsJson.data[0]['post_id']});
      this.form.patchValue({"post_name": productsJson.data[0]['post_name']});

        var sel = this.selData;
        for (var x = 0; x < sel.length; x++) {
          if(sel[x].id == productsJson.data[0]['move_flag']){
            this.ngSelect.select(this.ngSelect.itemsList.findByLabel(this.selData[x].text));
          }
        }
        
        this.setFocus('url');
      }
    });
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
          this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993/delete?delete_off_id='+this.delValue+'&userToken='+this.userData.userToken+':angular').subscribe(del => {
          console.log(del);
          this.ngOnInit();
          this.SpinnerService.hide();
        });
        }
        subscription.unsubscribe();
    });
  }

  assignAll(){
    this.modalType = 3;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

    loadMyChildComponent(){
      var type = this.modalType;
      var val = this.fct9993.nativeElement['type'].value;
      if(type==1){
        if(val==1){
          var student = JSON.stringify({
            "table_name" : "pofficer",
             "field_id" : "off_id",
             "field_name" :"off_name",
             "search_id" : "",
             "search_desc" : "",
             "userToken" : this.userData.userToken
            });
          this.listTable='pofficer';
          this.listFieldId='off_id';
          this.listFieldName='off_name';
          this.listFieldName2='user_running';
          this.listFormRetId='user_id';
          this.listFormRetName='off_name';
          this.listFormRetName2='user_running';
        }else if(val==2){
          this.loadComponent = false;
          this.loadModalJudgeComponent = true;
          this.loadAssignAllComponent = false;
          var student = JSON.stringify({
            "cond":2,
            "userToken" : this.userData.userToken});
          this.listTable='pjudge';
          this.listFieldId='judge_id';
          this.listFieldName='judge_name';
          this.listFieldNull='';
          this.listFieldType=JSON.stringify({"type":2});
        console.log(student)
         this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student ).subscribe(
             (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.data.length){
                this.list = productsJson.data;
                console.log(this.list)
              }else{
                this.list = [];
              }
             },
             (error) => {}
           )
        
           var student = JSON.stringify({"table_name" : "pjudge", "field_id" : "judge_id","field_name" : "judge_name","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
          this.listTable='pjudge';
          this.listFieldId='judge_id';
          this.listFieldName='judge_name';
          this.listFormRetId='user_id';
          this.listFormRetName='off_name';

        }else{
          var student = JSON.stringify({"table_name" : "pdepartment", "field_id" : "dep_code","field_name" : "dep_name","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
          this.listTable='pdepartment';
          this.listFieldId='dep_code';
          this.listFieldName='dep_name';
          this.listFormRetId='user_id';
          this.listFormRetName='off_name';
        }
      }else if(type==2){
        if(val==1){
        var student = JSON.stringify({"table_name" : "pofficer", "field_id" : "off_id","field_name" : "user_running","field_name2" :"off_name","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
        var student = JSON.stringify({
          "table_name" : "pofficer",
           "field_id" : "off_id",
           "field_name" :"off_name",
           "search_id" : "",
           "search_desc" : "",
           "userToken" : this.userData.userToken
          });
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
        this.listFormRetId='assUser';
        this.listFormRetName='assName';
        this.listFormRetName2='assign_user_running';

        
        }else if(val==2){
          this.loadComponent = false;
          this.loadModalJudgeComponent = true;
          this.loadAssignAllComponent = false;
          var student = JSON.stringify({
            "cond":2,
            "userToken" : this.userData.userToken});
          this.listTable='pjudge';
          this.listFieldId='judge_id';
          this.listFieldName='judge_name';
          this.listFieldNull='';
          this.listFieldType=JSON.stringify({"type":2});
        console.log(student)
         this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student ).subscribe(
             (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.data.length){
                this.list = productsJson.data;
                console.log(this.list)
              }else{
                this.list = [];
              }
             },
             (error) => {}
           )
        
           var student = JSON.stringify({"table_name" : "pjudge", "field_id" : "judge_id","field_name" : "judge_name","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
          this.listTable='pjudge';
          this.listFieldId='judge_id';
          this.listFieldName='judge_name';
          this.listFormRetId='user_id';
          this.listFormRetName='off_name';
        }
      }else if(type==3){
        //AssignAll
        this.loadComponent = false;
        this.loadModalJudgeComponent = false;
        this.loadAssignAllComponent = true;
      }

      if(type!=3){
       console.log(student)
       if(val!=2){
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
            (response) =>{
              this.list = response;
              this.loadComponent = true;
              this.loadModalJudgeComponent = false;
              this.loadAssignAllComponent = false;
              console.log(response)
            },
            (error) => {}
          )
        }
      }
    }

    receiveAssignAllData(event:any){
      console.log(event)
      this.closebutton.nativeElement.click();
      this.btnAssignAllData(event);
    }

    closeModal() {
      this.loadComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadAssignAllComponent = false;
    }
  

    btnAssignAllData(event: any) {//กำหนดให้ทุกคน
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
  
      this.SpinnerService.show();
  
      event['userToken'] = this.userData.userToken;
      var student = $.extend({}, event);
  
      console.log("student=>", student)
      this.http.disableHeader().post('/' + this.userData.appName + 'ApiCT/API/fct9993/assignAll', student).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {}
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) { 
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }

    receiveFuncListData(event:any){
        console.log(event)
        
        if(this.listFormRetId=='user_id'){
          if(this.fct9993.nativeElement['type'].value==1){
            this.fct9993.nativeElement[this.listFormRetId].value=event.fieldIdValue;
            this.fct9993.nativeElement[this.listFormRetName].value=event.fieldNameValue;
            this.closebutton.nativeElement.click();
            this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993/getUser?user_flag=o&user_id='+event.fieldIdValue+'&userToken='+this.userData.userToken+':angular').subscribe(posts => {
              let productsJson : any = JSON.parse(JSON.stringify(posts));
              console.log(productsJson)
              if(productsJson.result==1){
                this.fct9993.nativeElement['dname'].value = productsJson.dep_name;
                this.fct9993.nativeElement['user_running'].value=productsJson.user_running;
                this.loadProgramData(1,0);//======== เจ้าหน้าที่ 
              }else{
                const confirmBox = new ConfirmBoxInitializer();
                  confirmBox.setTitle('ข้อความแจ้งเตือน');
                  confirmBox.setMessage(productsJson.error);
                    confirmBox.setButtonLabels('ตกลง');
                    confirmBox.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){
                        this.fct9993.nativeElement['user_running'].value="";
                      }
                      subscription.unsubscribe();
                    });
              }
            });
            
          }else if(this.fct9993.nativeElement['type'].value==2){
            this.loadProgramData(2,0);//======= ผู้พิพากษา
          }else{
            this.fct9993.nativeElement[this.listFormRetId].value=event.fieldIdValue;
            this.fct9993.nativeElement[this.listFormRetName].value=event.fieldNameValue;
            this.closebutton.nativeElement.click();
            this.loadProgramData(3,0);//======= หน่วยงาน
          }
        }else{//สำเนา
          this.http.disableLoading().get('/'+this.userData.appName+'ApiCT/API/fct9993/getUser?user_flag=o&user_id='+event.fieldIdValue+'&userToken='+this.userData.userToken+':angular').subscribe(posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));
            console.log(productsJson)
            if(productsJson.result==1){
              this.fct9993.nativeElement['assign_user_running'].value=productsJson.user_running;
              this.fct9993.nativeElement['dname2'].value = productsJson.dep_name;
              this.fct9993.nativeElement['assUser'].value=event.fieldIdValue;
              this.fct9993.nativeElement['assName'].value=event.fieldNameValue;
              this.closebutton.nativeElement.click();
            }else{
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(productsJson.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.fct9993.nativeElement['assign_user_running'].value="";
                  }
                  subscription.unsubscribe();
                });
            }
          });
        }
    }

    receiveJudgeListData(event:any){
      console.log(event)
      
      if(this.modalType==1){
        this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993/getUser?user_flag=j&user_id='+event.judge_id+'&userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          if(productsJson.result==1){
            this.fct9993.nativeElement['user_id'].value=event.judge_id;
            this.fct9993.nativeElement['off_name'].value=event.judge_name;
            this.fct9993.nativeElement['user_running'].value = productsJson.user_running;
            setTimeout(() => {
              this.loadProgramData(2,0);//======= ผู้พิพากษา
            }, 500);
            
          }
        })
      }else{
        this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993/getUser?user_flag=j&user_id='+event.judge_id+'&userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          if(productsJson.result==1){
            this.fct9993.nativeElement['assUser'].value=event.judge_id;
            this.fct9993.nativeElement['assName'].value=event.judge_name;
            this.fct9993.nativeElement['assign_user_running'].value = productsJson.user_running;
          }else{
            const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(productsJson.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.fct9993.nativeElement['assUser'].value="";
                    this.fct9993.nativeElement['assName'].value="";
                    this.fct9993.nativeElement['assign_user_running'].value="";
                  }
                  subscription.unsubscribe();
                });
          }
        })
      }
      this.closebutton.nativeElement.click();
      //this.loadProgramData(2,0);//======= ผู้พิพากษา
    }

    loadProgramData(sendType:any,complete:number){
      console.log(sendType+':'+complete)
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 30,
        processing: true,
        columnDefs: [{"targets": 'no-sort',"orderable": false}],
        order:[[2,'asc']]
      };
      this.getType = sendType;
      this.getDepCode = this.fct9993.nativeElement['user_id'].value;
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      this.SpinnerService.show(); 
      if(sendType==1){//======== เจ้าหน้าที่ 
        this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993/getUser?user_flag=o&user_id='+this.fct9993.nativeElement['user_id'].value+'&userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.getData = productsJson;
          if(productsJson.result==1){
            //this.fct9993.nativeElement['dname'].value = productsJson.dep_name;
            this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993?dep_code=0&user_running='+productsJson.user_running+'&userToken='+this.userData.userToken+':angular').subscribe(datas => {
              let programData : any = JSON.parse(JSON.stringify(datas));
              console.log(programData)
              this.posts = programData.data;
              this.checklist = this.posts;
              this.checkMatch = programData.data;
              var i;
              for(i = 0; i < this.checkMatch.length; i++){
                this.checkMatch[i].selected1 = this.checkMatch[i]['selected'];
                this.checkMatch[i].court_running1 = this.checkMatch[i]['court_running'];
                this.checkMatch[i].user_id1 = this.checkMatch[i]['user_id'];
                this.checkMatch[i].user_running1 = this.checkMatch[i]['user_running'];
                this.checkMatch[i].parent_id1 = this.checkMatch[i]['parent_id'];
                this.checkMatch[i].program_id1 = this.checkMatch[i]['program_id'];
                this.checkMatch[i].dep_code1 = this.checkMatch[i]['dep_code'];
                this.checkMatch[i].favorites_flag1 = '';//this.checkMatch[i]['favorites_flag'];
                this.checkMatch[i].query_flag1 = this.checkMatch[i]['query_flag'];
                this.checkMatch[i].insert_flag1 = this.checkMatch[i]['insert_flag'];
                this.checkMatch[i].update_flag1 = this.checkMatch[i]['update_flag'];
                this.checkMatch[i].delete_flag1 = this.checkMatch[i]['delete_flag'];
                this.checkMatch[i].print_flag1 = this.checkMatch[i]['print_flag'];
                this.checkMatch[i].display_number1 = this.checkMatch[i]['display_number'];
                this.checkMatch[i].edit_user_running1 = this.checkMatch[i]['edit_user_running'];
                this.checkMatch[i].edit_program_id1 = this.checkMatch[i]['edit_program_id'];
                this.checkMatch[i].edit_dep_code1 = this.checkMatch[i]['edit_dep_code'];
              }

              
              if(programData.length){
                this.posts.forEach((x : any ) => x.edit_program_id = true,(x : any ) => x.query_flag = true,(x : any ) => x.insert_flag = true,(x : any ) => x.update_flag = true,(x : any ) => x.delete_flag = true,(x : any ) => x.print_flag = true);

              }
              this.rerender();
              this.SpinnerService.hide();
              if(complete==1){
                if(this.cCopy==1 && this.fct9993.nativeElement['assUser'].value){
                  confirmBox.setMessage('สำเนาข้อมูลเรียบร้อยแล้ว');
                }else{
                  confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
                }
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
              }
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
            this.SpinnerService.hide();
          }
        });
      }else if(sendType==2 ){//======= ผู้พิพากษา
        if(this.modalType==1){
          console.log('/'+this.userData.appName+'ApiCT/API/fct9993/getUser?user_flag=j&user_id='+this.fct9993.nativeElement['user_id'].value+'&userToken='+this.userData.userToken+':angular')
          this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993/getUser?user_flag=j&user_id='+this.fct9993.nativeElement['user_id'].value+'&userToken='+this.userData.userToken+':angular').subscribe(posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));
            console.log(productsJson)
            this.getData = productsJson;
            if(productsJson.result==1){
              this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993?dep_code=0&user_running='+productsJson.user_running+'&userToken='+this.userData.userToken+':angular').subscribe(datas => {
                let programData : any = JSON.parse(JSON.stringify(datas));
                console.log(programData)
                this.posts = programData.data;
                this.checklist = this.posts;
                this.checkMatch = programData.data;
                var i;
                for(i = 0; i < this.checkMatch.length; i++){
                  this.checkMatch[i].selected1 = this.checkMatch[i]['selected'];
                  this.checkMatch[i].court_running1 = this.checkMatch[i]['court_running'];
                  this.checkMatch[i].user_id1 = this.checkMatch[i]['user_id'];
                  this.checkMatch[i].user_running1 = this.checkMatch[i]['user_running'];
                  this.checkMatch[i].parent_id1 = this.checkMatch[i]['parent_id'];
                  this.checkMatch[i].program_id1 = this.checkMatch[i]['program_id'];
                  this.checkMatch[i].dep_code1 = this.checkMatch[i]['dep_code'];
                  this.checkMatch[i].favorites_flag1 = '';//this.checkMatch[i]['favorites_flag'];
                  this.checkMatch[i].query_flag1 = this.checkMatch[i]['query_flag'];
                  this.checkMatch[i].insert_flag1 = this.checkMatch[i]['insert_flag'];
                  this.checkMatch[i].update_flag1 = this.checkMatch[i]['update_flag'];
                  this.checkMatch[i].delete_flag1 = this.checkMatch[i]['delete_flag'];
                  this.checkMatch[i].print_flag1 = this.checkMatch[i]['print_flag'];
                  this.checkMatch[i].display_number1 = this.checkMatch[i]['display_number'];
                  this.checkMatch[i].edit_user_running1 = this.checkMatch[i]['edit_user_running'];
                  this.checkMatch[i].edit_program_id1 = this.checkMatch[i]['edit_program_id'];
                  this.checkMatch[i].edit_dep_code1 = this.checkMatch[i]['edit_dep_code'];
                }
                if(programData.length){
                  this.posts.forEach((x : any ) => x.edit_program_id = true,(x : any ) => x.query_flag = true,(x : any ) => x.insert_flag = true,(x : any ) => x.update_flag = true,(x : any ) => x.delete_flag = true,(x : any ) => x.print_flag = true);

                }
                this.rerender();
                this.SpinnerService.hide();
                if(complete==1){
                  if(this.cCopy==1 && this.fct9993.nativeElement['assUser'].value){
                    confirmBox.setMessage('สำเนาข้อมูลเรียบร้อยแล้ว');
                  }else{
                    confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
                  }
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
                }
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
              this.SpinnerService.hide();
            }
          });
        }
      }else{//======= หน่วยงาน
        this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993?dep_code='+this.fct9993.nativeElement['user_id'].value+'&userToken='+this.userData.userToken+':angular').subscribe(datas => {
          let programData : any = JSON.parse(JSON.stringify(datas));
          console.log(programData)
          this.posts = programData.data;
          this.checklist = this.posts;
          this.checkMatch = programData.data;
              var i;
              for(i = 0; i < this.checkMatch.length; i++){
                this.checkMatch[i].selected1 = this.checkMatch[i]['selected'];
                this.checkMatch[i].court_running1 = this.checkMatch[i]['court_running'];
                this.checkMatch[i].user_id1 = this.checkMatch[i]['user_id'];
                this.checkMatch[i].user_running1 = this.checkMatch[i]['user_running'];
                this.checkMatch[i].parent_id1 = this.checkMatch[i]['parent_id'];
                this.checkMatch[i].program_id1 = this.checkMatch[i]['program_id'];
                this.checkMatch[i].dep_code1 = this.checkMatch[i]['dep_code'];
                this.checkMatch[i].favorites_flag1 = '';//this.checkMatch[i]['favorites_flag'];
                this.checkMatch[i].query_flag1 = this.checkMatch[i]['query_flag'];
                this.checkMatch[i].insert_flag1 = this.checkMatch[i]['insert_flag'];
                this.checkMatch[i].update_flag1 = this.checkMatch[i]['update_flag'];
                this.checkMatch[i].delete_flag1 = this.checkMatch[i]['delete_flag'];
                this.checkMatch[i].print_flag1 = this.checkMatch[i]['print_flag'];
                this.checkMatch[i].display_number1 = this.checkMatch[i]['display_number'];
                this.checkMatch[i].edit_user_running1 = this.checkMatch[i]['edit_user_running'];
                this.checkMatch[i].edit_program_id1 = this.checkMatch[i]['edit_program_id'];
                this.checkMatch[i].edit_dep_code1 = this.checkMatch[i]['edit_dep_code'];
              }
          if(programData.length){
            this.posts.forEach((x : any ) => x.edit_program_id = true,(x : any ) => x.query_flag = true,(x : any ) => x.insert_flag = true,(x : any ) => x.update_flag = true,(x : any ) => x.delete_flag = true,(x : any ) => x.print_flag = true);

          }
          this.rerender();
          this.SpinnerService.hide();
          if(complete==1){
            if(this.cCopy==1 && this.fct9993.nativeElement['assUser'].value){
              confirmBox.setMessage('สำเนาข้อมูลเรียบร้อยแล้ว');
            }else{
              confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
            }
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
          }
        });
      }
      
    }

    changeData(obj:any){
      if(obj==1){
        this.cType=1;
      }else if(obj==2){
        this.cType=2;
      }else if(obj==3){
        this.cType=3;
        this.cCopy=0;
      }
    }

    copyData(){
      this.cCopy=1;
    }
    copyData2(){
      this.cCopy=2;
    }

    tabChange(type:any){
      var val = this.fct9993.nativeElement['type'].value;
      //if(type==1){
        if(val==1){
          this.listTable = "pofficer";
          this.listFieldId = "off_id";
          this.listFieldName = "off_name";
          this.listFormRetName2 = "user_running";
        }else if(val==2){
          this.listTable = "pjudge";
          this.listFieldId = "judge_id";
          this.listFieldName = "judge_name";
        }else{
          this.listTable = "pdepartment";
          this.listFieldId = "dep_code";
          this.listFieldName = "dep_name";
        }
      /* }else{
        this.listTable = "pofficer";
        this.listFieldId = "off_id";
        this.listFieldName = "off_name";
        this.listFormRetName2 = "assign_user_running";
      } */
      this.SpinnerService.show(); 
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
       if(type==1){
        var student = JSON.stringify({
          "table_name": this.listTable,
          "field_id": this.listFieldId,
          "field_name": this.listFieldName,
          "search_id":this.fct9993.nativeElement['user_id'].value,
          "search_desc":'',
          "userToken" : this.userData.userToken
        });
        /* var student = JSON.stringify({
          "table_name" : "pjudge_room",
          "field_id" : "room_id",
          "field_name" : "room_desc",
          "condition" : " AND room_id='"+this.fct9993.nativeElement['user_id'].value+"'",
          "userToken" : this.userData.userToken
        });  */   
      }else{
        var student = JSON.stringify({
          "table_name": this.listTable,
          "field_id": this.listFieldId,
          "field_name": this.listFieldName,
          "search_id":this.fct9993.nativeElement['assUser'].value,
          "search_desc":'',
          "userToken" : this.userData.userToken
        });
      }
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
        datalist => {
          
          let productsJson = JSON.parse(JSON.stringify(datalist));
          console.log(productsJson)
          if(type==1){
            if(productsJson.length){
              this.fct9993.nativeElement['off_name'].value=productsJson[0].fieldNameValue;
              this.SpinnerService.hide(); 
              if(val==1){
                this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993/getUser?user_flag=o&user_id='+this.fct9993.nativeElement['user_id'].value+'&userToken='+this.userData.userToken+':angular').subscribe(posts => {
                  let productsJson2 : any = JSON.parse(JSON.stringify(posts));
                  console.log(productsJson2)
                  if(productsJson2.result==1){
                    this.fct9993.nativeElement[this.listFormRetName2].value=productsJson2.user_running;
                    this.fct9993.nativeElement['dname'].value = productsJson2.dep_name;
                    this.loadProgramData(1,0);
                  }else{
                      const confirmBox = new ConfirmBoxInitializer();
                      confirmBox.setTitle('ข้อความแจ้งเตือน');
                      confirmBox.setMessage(productsJson2.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            this.fct9993.nativeElement['user_running'].value="";
                          }
                          subscription.unsubscribe();
                        });
                  }
                });
                
              }else if(val==2){
                this.loadProgramData(2,0);
              }else{
              this.loadProgramData(3,0);
              }
            }else{
              this.SpinnerService.hide();
              this.fct9993.nativeElement['user_id'].value="";
              this.fct9993.nativeElement['off_name'].value="";
              
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(productsJson.error);
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
          }else{
            if(productsJson.length && this.fct9993.nativeElement['type'].value==1){

              this.fct9993.nativeElement['assName'].value=productsJson[0].fieldNameValue;
              this.http.get('/'+this.userData.appName+'ApiCT/API/fct9993/getUser?user_flag=o&user_id='+this.fct9993.nativeElement['assUser'].value+'&userToken='+this.userData.userToken+':angular').subscribe(posts => {
                let productsJson : any = JSON.parse(JSON.stringify(posts));
                console.log(productsJson)
                if(productsJson.result==1){
                  this.fct9993.nativeElement[this.listFormRetName2].value=productsJson.user_running;
                  this.fct9993.nativeElement['dname2'].value = productsJson.dep_name;
                }else{
                  const confirmBox = new ConfirmBoxInitializer();
                  confirmBox.setTitle('ข้อความแจ้งเตือน');
                  confirmBox.setMessage(productsJson.error);
                    confirmBox.setButtonLabels('ตกลง');
                    confirmBox.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){
                        this.fct9993.nativeElement['assign_user_running'].value="";
                      }
                      subscription.unsubscribe();
                    });
                }
              });
              this.SpinnerService.hide(); 
            }else if(productsJson.length && this.fct9993.nativeElement['type'].value==2){
              this.fct9993.nativeElement['assUser'].value=productsJson[0].fieldIdValue;
              this.fct9993.nativeElement['assName'].value=productsJson[0].fieldNameValue;
            }else{
              this.SpinnerService.hide();
              this.fct9993.nativeElement['assUser'].value="";
              this.fct9993.nativeElement['assName'].value="";
              
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage(productsJson.error);
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
          }
          
        },
        (error) => {}
      );
      
    }

    
}



