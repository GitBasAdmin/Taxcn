import { Component, OnInit , ViewChild , ElementRef,EventEmitter,AfterViewInit,OnDestroy,Injectable,Input,Output,ViewEncapsulation   } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from "ngx-spinner"; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
import { SpeechToTextComponent } from '@app/components/speech/speec-to-text/speech-to-text.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash"
declare var myExtObject: any;
import { ModalIndictBandComponent } from '@app/components/modal/modal-indict-band/modal-indict-band.component';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fca0200-tab2',
  templateUrl: './fca0200-tab2.component.html',
  styleUrls: ['./fca0200-tab2.component.css']
})
export class Fca0200Tab2Component implements AfterViewInit, OnInit, OnDestroy {
  dataHeadValue:any;
  caseTypeValue:any;
  sessData:any;
  userData:any;
  listTable:any;
  listFieldId:any;
  listFieldName:any;
  listFieldNull:any;
  modalType:any;
  counter = 0;
  dataSource:any;
  fileToUpload: File = null;
  myExtObject: any;
  indict_file:any;
  public list:any;
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild('labelImport',{static: true}) labelImport : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('file1',{static: true}) file1: ElementRef;
  @Output() onUpdateCase = new EventEmitter<{data:any,counter:any}>();
  @Input() set dataHead(dataHead:any) {
    if(dataHead){
      this.dataHeadValue = [];
      this.fileToUpload = null;
      this.file1.nativeElement.value = "";
      this.dataHeadValue=JSON.parse(JSON.stringify(dataHead));
      this.dataSource = JSON.parse(JSON.stringify(dataHead));
      this.indict_file = this.dataHeadValue.indict_file;
      /*if(this.dataHeadValue.indict_file)
        $('body').find('.custom-file-input').parent('div').find('label').html(this.dataHeadValue.indict_file);
      else
        $('body').find('.custom-file-input').parent('div').find('label').html('');*/
      console.log(this.dataHeadValue)
    }
  }
  @Input() set caseType(caseType: number) {
    this.caseTypeValue=caseType;
  }

  
  
  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };
    this.dataHeadValue=[];
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
  }



  ngAfterViewInit(): void {
    //this.dtTrigger.next('');
    }
    
  ngOnDestroy(): void {
      //this.dtTrigger.unsubscribe();
    }

  onFileChange(e:any) {
    /*
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
    */
    if(e.target.files.length){
      this.fileToUpload = e.target.files[0];
      var fileName = e.target.files[0].name;
      this.indict_file = fileName;
      //$(e.target).parent('div').find('label').html(fileName);
    }else{
      this.indict_file = '';
      //$(e.target).parent('div').find('label').html('');
    }
  }

    import(): void {
      console.log('import ' + this.fileToUpload.name);
    }

    loadMyModalComponent(){
      this.loadComponent = true;
      //$("#exampleModal-2").find(".modal-body").css("height","100px");
    }

    /*loadMyChildComponent(val:any){
      this.SpinnerService.show();
      $(".modal-backdrop").remove();
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      if(val==1){

        var student = JSON.stringify({
          "case_type" : this.caseTypeValue,
          "court_type_id" : 0,
          "search_desc" : "",
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJband', student , {headers:headers}).subscribe(
          (response) =>{
            this.list = response;
            this.loadComponent = false;
            this.loadModalComponent = true;
            this.modalType = 1;
            $("#exampleModal-2").find(".modal-body").css({"height":"auto"});
            $("#exampleModal-2").css({"background":"rgba(51,32,0,.4)"});
            console.log(response)
            this.SpinnerService.hide();
          },
          (error) => {}
       )

      }else{

        var student = JSON.stringify({
          "case_type" : this.caseTypeValue,
          "court_type_id" : 0,
          "search_desc" : "",
          "userToken" : this.userData.userToken
        });
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupIndict', student , {headers:headers}).subscribe(
          (response) =>{
            this.list = response;
            this.loadComponent = false;
            this.loadModalComponent = true;
            this.modalType = 2;
            $("#exampleModal-2").find(".modal-body").css({"height":"auto"});
            $("#exampleModal-2").css({"background":"rgba(51,32,0,.4)"});
            console.log(response)
            this.SpinnerService.hide();
          },
          (error) => {}
       )
      }

    }*/

    changeInput(event:any){
      this.SpinnerService.show();
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "case_type" : this.caseTypeValue,
        "court_type_id" : 0,
        "search_id" : event.target.value,
        "search_desc" : "",
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJband', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(getDataOptions.length){
            this.dataHeadValue.jbrand_id = getDataOptions[0].jbrand_id;
            this.dataHeadValue.indict_desc = getDataOptions[0].indict_desc;
            this.dataHeadValue.pinalty_desc = getDataOptions[0].pinalty_desc;
          }
          
          this.SpinnerService.hide();
        },
        (error) => {}
     )
    }

    receiveFuncListData(event:any){
      console.log(event)
      if(event.type==1){
        this.dataHeadValue.jbrand_id = event.index.jbrand_id;
        this.dataHeadValue.indict_desc = event.index.indict_desc;
        this.dataHeadValue.pinalty_desc = event.index.pinalty_desc;
      }else{
        this.dataHeadValue.jbrand_id = event.index.ibrand_id;
        this.dataHeadValue.indict_desc = event.index.ibrand_name;
      }
      // this.closebutton.nativeElement.click();
    }

    onClickSaveData(data:any,counter:any): void {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.dataHeadValue.run_id){
        confirmBox.setMessage('กรุณาระบุค้นหาเลขคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        /*
        data = this.difference(data,this.dataSource);
        if(_.isEmpty(data)){
          confirmBox.setMessage('กรุณาแก้ไขข้อมูลก่อนการจัดเก็บ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
             layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if(resp.success==true){}
            subscription.unsubscribe();
          });
        }else{
          */
          //counter = this.counter+1;
          //data['run_id'] = this.dataHeadValue.run_id;
          //data['userToken'] = this.userData.userToken;
          //this.onUpdateCase.emit({data,counter});
        //}
        var formData = new FormData();
        formData.append('run_id', this.dataHeadValue.run_id);
        formData.append('file', this.fileToUpload);
        formData.append('jbrand_id', this.dataHeadValue.jbrand_id?this.dataHeadValue.jbrand_id:null);
        formData.append('indict_desc', this.dataHeadValue.indict_desc?this.dataHeadValue.indict_desc:null);
        formData.append('pinalty_desc', this.dataHeadValue.pinalty_desc?this.dataHeadValue.pinalty_desc:null);
        formData.append('userToken', this.userData.userToken);
    //formData.append('data','{"court_running":6,"req_running":23420,"run_id":145031,"appeal_running":null,"req_no":1,"req_yy":2564,"req_id":1,"req_desc":"คำร้อง","subject_id":null,"subject_name":"ขอขยายระยะเวลาอุทธรณ์ ครั้งที่ 3","date_rcv":"06/01/2564","rcv_time":"15:10:43","rcv_req":"00030","rcv_dep_code":2,"req_type":"1  ","sequence":"1","req_name":"ธนาคารออมสิน โจทก์","req_attach":null,"req_attach_date":null,"dep_code_submit":2,"user_submit_order":"00030","submit_date":"06/01/2564","submit_time":"15:10","dep_code_return":2,"user_return_order":"00030","return_date":"07/01/2564","return_time":"08:57","order_id":38,"order_date":"07/01/2564","order_time":"08:58:55","req_order":"ครั้งที่ 3 - อนุญาตขยายระยะเวลายื่นอุทธรณ์ให้แก่โจทก์  จนถึงวันที่ 8 กุมภาพันธ์ 2564","sms_order":null,"sms_flag":null,"order_judge_id":null,"order_judge_name":null,"judge_id":"69","send_date":null,"send_time":null,"send_to":null,"send_for":null,"remark":null,"file_exists":null,"check_flag":null,"check_user_id":null,"check_user_name":null,"check_date":null,"court_level":1,"due_date":null,"order_attach":null,"attach_date":null,"order_flag":null,"print_flag":null,"open_flag":null,"user_type_date":"07/01/2564 08:57:43","user_type_order":"00030","user_type_dep_code":2,"web_running":null,"create_dep_code":2,"create_user_id":"00030","create_user":"นางสาวมะลิ  แสงหล้า","create_date":"07/01/2564 08:59:08","update_dep_code":19,"update_user_id":"99999","update_user":"ADMINISTRATOR","update_date":"16/12/2564 13:42:37","request_no":"1/2564","date_flag":null,"judge_name":"นายคำปุน   ภูธรศรี","dep_code":null,"dep_name":null,"rcv_req_name":"เจ้าหน้าที่-00030","user_type_order_name":"นางสาวมะลิ  แสงหล้า","user_submit_name":"เจ้าหน้าที่-00030","user_return_name":"เจ้าหน้าที่-00030","dep_return_name":"งานรับฟ้อง","dep_submit_name":"งานรับฟ้อง","create_dep_name":"งานรับฟ้อง","update_dep_name":"บริษัทฯ ผู้ดูแลระบบ","rcv_dep_name":"งานรับฟ้อง","user_type_dep_name":"งานรับฟ้อง","order_name":"ขยายยื่นอุทธรณ์"}')
      
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }
     
      this.http.disableHeader().post('/'+this.userData.appName+'ApiCA/API/CASE/updateIndictDesc', formData ).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
        next: (v) => {
          let productsJson : any = JSON.parse(JSON.stringify(v));
          console.log(productsJson)
          if(productsJson.result==1){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){this.loadData();}
              subscription.unsubscribe();
            });
            
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){}
              subscription.unsubscribe();
            });
          }
        },     // nextHandler
      });
      }
      
    }

    loadData(){
      var student = JSON.stringify({
        "run_id": this.dataHeadValue.run_id,
        "allData" : 0,
        "url_name" : 'fca0200',
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/dataFromRunId', student ).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
        next: (v) => {
          let productsJson : any = JSON.parse(JSON.stringify(v));
          console.log(productsJson)
          if(productsJson.result==1){
            this.dataHeadValue = [];
            this.fileToUpload = null;
            this.file1.nativeElement.value = "";
            this.dataHeadValue=JSON.parse(JSON.stringify(productsJson.data[0]));
            this.dataSource = JSON.parse(JSON.stringify(productsJson.data[0]));
            this.indict_file = this.dataHeadValue.indict_file;
            /*if(this.dataHeadValue.indict_file)
              $('body').find('.custom-file-input').parent('div').find('label').html(this.dataHeadValue.indict_file);
            else
              $('body').find('.custom-file-input').parent('div').find('label').html('');*/
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){}
              subscription.unsubscribe();
            });
          }
        },     // nextHandler
      });
    }

    difference(object:any, base:any) {
      return transform(object, (result:any, value, key) => {
        if (!isEqual(value, base[key])) {
          result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
        }
      });
    }

    clickOpenFile(){
      //ApiCA/API/CASE/getIndictFile 
      //post json run_id, userToken มา มันจะ return path ไป window.open เหมือนหมาย
      var student = JSON.stringify({
        "run_id": this.dataHeadValue.run_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/getIndictFile ', student ).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
        next: (v) => {
          let productsJson : any = JSON.parse(JSON.stringify(v));
          console.log(productsJson)
          if(productsJson.result==1){
            myExtObject.OpenWindowMax(productsJson.file);
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){}
              subscription.unsubscribe();
            });
          }
        },     // nextHandler
      });
    }

    delIndictFile(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ต้องการลบไฟล์ WORD ข้อมูลใช่หรือไม่?');
      confirmBox.setMessage('ยืนยันการลบไฟล์ WORD ที่เลือก');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
       layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
          this.SpinnerService.show();
          var student = JSON.stringify({
            "run_id": this.dataHeadValue.run_id,
            "userToken" : this.userData.userToken
          });
          console.log(student)
          this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/delIndictFile', student ).subscribe({
            complete: () => { }, // completeHandler
            error: (e) => { this.SpinnerService.hide(); },    // errorHandler 
            next: (v) => {
              let productsJson : any = JSON.parse(JSON.stringify(v));
              console.log(productsJson)
              if(productsJson.result==1){
                this.loadData();
                this.SpinnerService.hide();
              }else{
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(productsJson.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                   layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if(resp.success==true){
                    
                    this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
              }
            },     // nextHandler
          });
        }
        subscription.unsubscribe();
      });
    }

    closeModal(){
      $('.modal')
			.find("input[type='text'],input[type='password'],textarea")
			.val('')
			.end()
			.find("input[type=checkbox], input[type=radio]")
			.prop("checked", "")
			.end()
      .find("select")
			.val('0')
			.end()
    }

    openVoice(){
      const modalRef = this.ngbModal.open(SpeechToTextComponent,{ windowClass: 'speech-class'})
      modalRef.closed.subscribe((res) => {
        if(res) {
          this.dataHeadValue.indict_desc=res;
        }
      })
    }

    loadMyChildComponent(val:any){
      this.SpinnerService.show();
      if(val==1){
        var student = JSON.stringify({
          "case_type" : this.caseTypeValue,
          "court_type_id" : 0,
          "search_desc" : "",
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJband', student).subscribe({
          complete: () => { }, // completeHandler
          error: (e) => { console.error(e) },    // errorHandler 
          next: (v) => {
            this.list = v;
            this.modalType = 1;
            this.onOpenJudge(v);
            this.SpinnerService.hide();
          },     // nextHandler
        });
      }else{
        var student = JSON.stringify({
          "case_type" : this.caseTypeValue,
          "court_type_id" : 0,
          "search_desc" : "",
          "userToken" : this.userData.userToken
        });
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupIndict', student).subscribe({
          complete: () => { }, // completeHandler
          error: (e) => { console.error(e) },    // errorHandler 
          next: (v) => {
            this.list = v;
            this.modalType = 2;
            this.onOpenJudge(v);
            this.SpinnerService.hide();
          },     // nextHandler
        });
      }
    }

    // <app-modal-indict-band *ngIf="loadModalComponent" [items]=list [value1]=modalType [value2]=caseTypeValue (onClickList)="receiveFuncListData($event)" class="modal_app"></app-modal-indict-band>
    onOpenJudge = (list: any) => {
      const modalRef: NgbModalRef = this.ngbModal.open(ModalIndictBandComponent)
      modalRef.componentInstance.value1 = this.modalType
      modalRef.componentInstance.value2 = this.caseTypeValue
      modalRef.componentInstance.items = list
      modalRef.componentInstance.types = 1
      modalRef.result.then((item: any) => {
        if (item) {
          console.log(item)
          if(item.type==1){
            this.dataHeadValue.jbrand_id = item.index.jbrand_id;
            this.dataHeadValue.indict_desc = item.index.indict_desc;
            this.dataHeadValue.pinalty_desc = item.index.pinalty_desc;
          }else{
            this.dataHeadValue.jbrand_id = item.index.ibrand_id;
            this.dataHeadValue.indict_desc = item.index.ibrand_name;
          }
        }
      }).catch((error: any) => {
        console.log(error)
      })
    }

}
