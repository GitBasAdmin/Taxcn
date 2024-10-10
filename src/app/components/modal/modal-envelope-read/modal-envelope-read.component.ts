import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { NgbModal, NgbModalRef ,NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash"
@Component({
  selector: 'app-modal-envelope-read',
  templateUrl: './modal-envelope-read.component.html',
  styleUrls: ['./modal-envelope-read.component.css']
})
export class ModalEnvelopeReadComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() run_id: number;
  @Input() app_seq: number;
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  masterSelect:boolean = false;
  formList: FormGroup;
  sessData:any;
  userData:any;
  getDocTitle:any;
  result2:any = [];
  itemsTmp:any = [];
  popIndex:any;
  reload:any;
  public loadModalConfComponent2:boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private ngbModal: NgbModal,
    public activeModal: NgbActiveModal,
  ) { 
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //alert(99)
    let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      //======================== pappoint_by ======================================
      if(this.userData.userLevel=='A')
        var student = JSON.stringify({
          "table_name" : "pdoc_title",
          "field_id": "LISTAGG(doc_title_id, '')",
          "field_name" : "doc_title",
          "condition" : " AND in_out=2 GROUP BY doc_title",
          "order_by": "doc_title ASC",
          "userToken" : this.userData.userToken
        });
      else
        var student = JSON.stringify({
          "table_name" : "pdoc_title",
          "field_id": "LISTAGG(doc_title_id, '')",
          "field_name" : "doc_title",
          "condition" : " AND in_out=2 AND dep_user='"+this.userData.depCode+"' GROUP BY doc_title",
          "order_by": "doc_title ASC",
          "userToken" : this.userData.userToken
        });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getDocTitle = getDataOptions;
          this.result2.real_doc_title = this.getDocTitle[0].fieldNameValue;
        },
        (error) => {}
      )
        console.log(this.run_id+":"+this.app_seq)
    this.showDataList();
  }

  delTitleRead(i:any){
    const modalRef: NgbModalRef = this.ngbModal.open(ModalConfirmComponent)
    modalRef.closed.subscribe((data) => {
      if(data) {
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการลบข้อมูล');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
         layoutType: DialogLayoutDisplay.DANGER
        })
        confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){
            var student = JSON.stringify({
              "log_remark" : data,
              "run_seq": this.items[i].run_seq,
              "case_running": this.items[i].case_running,
              "userToken" : this.userData.userToken
            });
            console.log(student)
            this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/delCaseDoc', student).subscribe(
              (response) =>{
                let getDataOptions : any = JSON.parse(JSON.stringify(response));
                console.log(getDataOptions)
                //this.reload = 1;
                this.showDataList();
              },
              (error) => {}
            );
          }
        })
      }
    })
    /*this.openbutton.nativeElement.click();*/
  }

  loadMyModalComponent(){
    $("#exampleModal3").find(".modal-content").css("width","650px");
      this.loadModalConfComponent2 = true;
  }

  cancelTiltRead(){
    this.result2.real_doc_title = this.getDocTitle[0].fieldNameValue;
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
    $('body').find(".tblForm").closest(".modal-content").css("width","800px");
  }

  
  ChildTestCmp(){
    /*
    var dataObj=[];
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
            if(ele.index == true){
              dataObj.push(this.items[index]);
            }
      });
    });
    if(bar){
      return dataObj;
      //console.log(dataObj)
    }
    */
    var saveArray = [];
    var student = this.difference(this.items,this.itemsTmp);
    saveArray = $.grep(student,function(n:any){ return n == 0 || n });
    var dataTmp=[];
    var bar = new Promise((resolve, reject) => {
      for(var i=0;i<saveArray.length;i++){
        dataTmp.push(this.items[saveArray[i]]);
      } 
    });
    if(bar){
      return dataTmp
    }
   
  }

  saveData(){
    var saveArray = [];
    var student = this.difference(this.items,this.itemsTmp);
    saveArray = $.grep(student,function(n:any){ return n == 0 || n });
    var dataTmp=[];
    var bar = new Promise((resolve, reject) => {
      for(var i=0;i<saveArray.length;i++){
        dataTmp.push(this.items[saveArray[i]]);
      } 
    });
    if(bar){
      dataTmp.forEach((ele, index, array) => {
          if(ele.sel==false){
            ele.sel = 0;
          }else{
            ele.sel = 1;
          }
      });
      var dataSave = [];
      dataSave['userToken'] = this.userData.userToken;
      dataSave['data'] = dataTmp;
      var data = $.extend({},dataSave)
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/saveMapCase', data ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){
                //this.getAppRunning();
                this.reload = 1;
                this.showDataList();
              }
              subscription.unsubscribe();
            });
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){}
              subscription.unsubscribe();
            });
          }
        },
        (error) => {}
      );
    }
  }
  showDataList(){

      var student = JSON.stringify({
        "run_id": this.run_id,
        "app_seq": this.app_seq,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0130/popupMapCase', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.items = getDataOptions.data;
          this.itemsTmp = JSON.parse(JSON.stringify(getDataOptions.data));
        },
        (error) => {}
      );
  }

  difference(object:any, base:any) {
    return transform(object, (result:any, value, key) => {
      if (!isEqual(value, base[key])) {
        //result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
        result[key] = isObject(value) && isObject(base[key]) ? key : null;
        //result[key] = key;
      }
    });
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    console.log(this.items[index])
    this.onClickList.emit(this.items[index])
  }

  creatDocNo(){
    console.log(this.items[this.popIndex])
    var student = JSON.stringify({
      "run_id": this.run_id,
      "real_doc_title": this.result2.real_doc_title.$ngOptionLabel,
      "app_seq": this.items[this.popIndex].app_seq,
      "case_running": this.items[this.popIndex].case_running,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCO/API/CORRESP/popupCaseDoc/saveCaseDoc', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        //this.reload = 1;
        this.showDataList();
      },
      (error) => {}
    );
  }

  pClose(pop:any){
    pop.close()
  }
  pOpen(pop:any){
    pop.open()
  }
  
  closeModal(){

  }
  submitModalForm(){

  }


}
