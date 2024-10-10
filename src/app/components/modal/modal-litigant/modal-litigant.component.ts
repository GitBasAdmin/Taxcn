import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-modal-litigant',
  templateUrl: './modal-litigant.component.html',
  styleUrls: ['./modal-litigant.component.css']
})
export class ModalLitigantComponent implements OnInit {

  litObj:any;
  litAddress:any='';
  @Input() set litigant(litigant:any){
    this.litObj = litigant;
    if(this.litObj.addr){
      this.litAddress = this.litObj.addr;
    }if(this.litObj.moo){
      this.litAddress = this.litAddress + ' หมู่' + this.litObj.moo;
    }if(this.litObj.soi){
      this.litAddress = this.litAddress + ' ซอย' + this.litObj.soi;
    }if(this.litObj.road){
      this.litAddress = this.litAddress + ' ถนน' + this.litObj.road;
    }if(this.litObj.tambon_name){
      if(this.litObj.prov_id==10){
         this.litAddress = this.litAddress + ' แขวง' + this.litObj.tambon_name;
      }else{
         this.litAddress = this.litAddress + ' ตำบล' + this.litObj.tambon_name;
      }
    }if(this.litObj.amphur_name){
      if(this.litObj.prov_id==10){
        this.litAddress = this.litAddress + ' เขต' + this.litObj.amphur_name;
      }else{
        this.litAddress = this.litAddress + ' อำเภอ' + this.litObj.amphur_name;
      }

    }if(this.litObj.prov_name){
      this.litAddress = this.litAddress + ' จังหวัด' + this.litObj.prov_name;
    }if(this.litObj.post_no){
      this.litAddress = this.litAddress + ' รหัสไปรษณีย์ ' + this.litObj.post_no;
    }

    console.log(this.litObj)
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
