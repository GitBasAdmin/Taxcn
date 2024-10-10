import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-popup-print-cheque',
  templateUrl: './popup-print-cheque.component.html',
  styleUrls: ['./popup-print-cheque.component.css']
})
export class PopupPrintChequetComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Output() onClickList = new EventEmitter<any>();
  
  sessData:any;
  userData:any;
  getPersType:any;
  result:any = [];
  getPcase:any;
  getPdate:any;
  getPbank:any;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) { 

  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.getPcase =  [ {fieldIdValue:0,fieldNameValue: 'ไม่พิมพ์เลขคดี'}, {fieldIdValue:1,fieldNameValue: 'พิมพ์เลขคดีดำ'}, {fieldIdValue:2,fieldNameValue: 'พิมพ์เลขคดีแดง'}, {fieldIdValue:3,fieldNameValue: 'พิมพ์รวมใบใบเสร็จ'}];
    this.getPdate =  [ {fieldIdValue:0,fieldNameValue: 'ไม่พิมพ์วันที่'}, {fieldIdValue:1,fieldNameValue: 'พิมพ์วันที่ภาษาไทย'}, {fieldIdValue:2,fieldNameValue: 'พิมพ์วันที่ภาษาอังกฤษ'}];
    this.getPbank =  [ {fieldIdValue:2,fieldNameValue: 'กรุงไทย'}, {fieldIdValue:3,fieldNameValue: 'กสิกรไทย'}, {fieldIdValue:1,fieldNameValue: 'ออมสิน'}, {fieldIdValue:4,fieldNameValue: 'การเกษตร'}];
    this.result.ppay = 1;
    this.result.pmark = 1;
    this.result.pline = 1;
    this.result.pcase = 2;
    this.result.pdate = 1;
    this.result.pbank = 2;
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  onClickListData(): void {
    var student = $.extend({},this.result);
    this.onClickList.emit(student)
  }

}
