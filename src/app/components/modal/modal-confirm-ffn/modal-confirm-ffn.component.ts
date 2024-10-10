import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
@Component({
  selector: 'app-modal-confirm-ffn',
  templateUrl: './modal-confirm-ffn.component.html',
  styleUrls: ['./modal-confirm-ffn.component.css']
})
export class ModalConfirmFfnComponent implements OnInit {
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  typePwd:boolean=false
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

  showInput(objName:any){
    this[objName] = !this[objName];
  }

  ChildTestCmp(){
    var student = JSON.stringify({
      "password" : this.modalForm.nativeElement["password"].value,
      "log_remark" : this.modalForm.nativeElement["log_remark"].value
    });
    return student;
  }
}
