import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-modal-appoint-result',
  templateUrl: './modal-appoint-result.component.html',
  styleUrls: ['./modal-appoint-result.component.css']
})
export class ModalAppResultComponent implements OnInit {

  appObj:any;
  litAddress:any='';
  @Input() set appresult(appresult:any){
    this.appObj = appresult;

    console.log(this.appObj)
  }
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;

  formList: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService
  ) {
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {

  }

  ChildTestCmp(){
    var student = JSON.stringify({
      "password" : this.modalForm.nativeElement["password"].value,
      "log_remark" : this.modalForm.nativeElement["log_remark"].value
    });
    return student;
  }
}
