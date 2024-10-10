import { Component, OnInit,Input,Output,EventEmitter,ViewChild,AfterViewInit,AfterContentInit,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { PrintReportService } from 'src/app/services/print-report.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnModelComponent } from '../../modal/datalist-return-model/datalist-return-model.component';
import * as $ from 'jquery';
@Component({
  selector: 'app-modal-print-cover',
  templateUrl: './modal-print-cover.component.html',
  styleUrls: ['./modal-print-cover.component.css']
})
export class ModalPrintCoverComponent implements AfterViewInit,OnInit,AfterContentInit {
  sessData:any;
  userData:any;
  result:any = [];
  getLitType:any;

  @Output() onCopyData = new EventEmitter<any>();
  @Input() doc_no: string;
  @Input() material_running: string;//ชื่อตาราง
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  
  formList: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    public activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "pmaterial_req_type",
      "field_id" : "req_type_id",
      "field_name" : "req_type_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getLitType = getDataOptions;
        this.result.lit_type = 1;
      },
      (error) => {}
    )

    
    
  }

  openPrint(){
    const modalRef = this.ngbModal.open(DatalistReturnModelComponent)
    modalRef.componentInstance.value1 = "pmaterial_cover"
    modalRef.componentInstance.value2 = "mat_cover_id"
    modalRef.componentInstance.value3 = "mat_cover_name"

    modalRef.result.then((item: any) => {
      if(item){
        this.result.mat_cover_name=item.fieldIdValue;
        //this.formData.controls['req_user_name'].setValue(item.fieldNameValue)
      }
    })
  }

  ngAfterViewInit(): void {

  }
  reloadPage(){
    this.result = [];
    console.log(this.result)
  }
  ngAfterContentInit() : void{

  }
 

  printReport(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    var rptName = 'rfdo0100';
    var paramData ='{}';
    var paramData = JSON.stringify({
      "pmat_running" : this.material_running ? this.material_running : '',
      "plit_type" : this.result.lit_type,
      "pid_start" : this.result.pid_start,
      "pid_end" : this.result.pid_end,
    });
    console.log(paramData)
    this.printReportService.printReport(rptName,paramData);
  }

}
