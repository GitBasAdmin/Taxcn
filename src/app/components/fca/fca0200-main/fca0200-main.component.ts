import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ContentChild,Input,Output,EventEmitter  } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';

import { Fca0200HeadComponent } from '@app/components/fca/fca0200-head/fca0200-head.component';
import {Observable,of, Subject  } from 'rxjs';
@Component({
  selector: 'app-fca0200-main',
  templateUrl: './fca0200-main.component.html',
  styleUrls: ['./fca0200-main.component.css'],
})
export class Fca0200MainComponent implements AfterViewInit, OnInit, OnDestroy {
  widthSet:any;
  sendCaseCateId:any;
  sendCaseCateName:any;
  sendCaseType:any;
  sendCaseCateFlag:any;
  sendDataHead:any;
  sendCourtFee:any;
  sendCourtProv:any;
  sendCallTab1:any;
  sendLoginCase:any;
  items$: Observable<any[]>;
  @Output() viewLoaded = new EventEmitter();
  @Output() onUpdateCase = new EventEmitter<any>();
  @Output() onInsertCase = new EventEmitter<any>();
  @Output() onChangeActive = new EventEmitter<any>();
  @Output() onReloadCase = new EventEmitter<any>();
  //@Input() caseCateId: number;
  @Input() set caseCateId(caseCateId: number) {
    this.sendCaseCateId = caseCateId;
  }
  @Input() set caseType(caseType: number) {
    this.sendCaseType = caseType;
  }
  @Input() set caseCateName(caseCateName: number) {
    this.sendCaseCateName = caseCateName;
  }
  @Input() set caseCateFlag(caseCateFlag: number) {
    this.sendCaseCateFlag = caseCateFlag;
  }

  @Input() set dataHead(dataHead: any) {
    this.sendDataHead = dataHead;
    console.log(this.sendDataHead)
  }
  @Input() set courtFee(courtFee: any) {
    this.sendCourtFee = courtFee;
  }
  @Input() set courtProv(courtProv: any) {
    this.sendCourtProv = courtProv;
  }
  @Input() set callTab1(callTab1: any) {
    this.sendCallTab1 = callTab1;
    console.log(this.sendCallTab1)
  }
  @Input() set loginCase(loginCase: any) {
    this.sendLoginCase = loginCase;
  }
  
  constructor(
    private fca0200Head : Fca0200HeadComponent,
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewLoaded.next(true);
    }, 1000);
    
  }
    
  ngOnDestroy(): void {
    
  }



  /*getCaseCateId(val:any){
    alert(val)
  }*/

  assignWidth(obj:any){
    console.log(obj.index)
    if(obj.index==0){
      this.widthSet="100%";
      $("body").find("#sidebar").css("display","");
    }else if(obj.index==1){
      this.widthSet="100%";
      $("body").find("#sidebar").css("display","none");
    }else if(obj.index==2){
      this.widthSet="100%";
      $("body").find("#sidebar").css("display","none");
    }else if(obj.index==3){
      this.widthSet="100%";
    }else if(obj.index==4){
      this.widthSet="100%";
    }
  }

  receiveObjData(objData:any){
    console.log(objData)
    this.onUpdateCase.emit(objData);
  }
  receiveObjData2(objData:any){
    console.log(objData)
    this.onInsertCase.emit(objData);
  }
  receiveObjData3(objData:any){
    console.log(objData)
    this.onChangeActive.emit(objData);
  }
  receiveObjData4(objData:any){
    console.log(objData)
    this.onReloadCase.emit(objData);
  }


}
