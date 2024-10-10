import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-modal-witness',
  templateUrl: './modal-witness.component.html',
  styleUrls: ['./modal-witness.component.css']
})
export class ModalWitnessComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() value1: number;//ข้อความ
  @Output() txtMessage = new EventEmitter<any>();
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  
  sessData:any;
  userData:any;
  result:any = [];

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) { 

  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    console.log("value1", this.value1);
    this.result.message=this.value1;
    
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  ChildTestCmp(){
    return this.result.message;
  }

  

}
