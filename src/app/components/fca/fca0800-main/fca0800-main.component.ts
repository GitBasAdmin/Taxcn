import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-fca0800-main',
  templateUrl: './fca0800-main.component.html',
  styleUrls: ['./fca0800-main.component.css']
})
export class Fca0800MainComponent implements AfterViewInit, OnInit, OnDestroy {
  sendHead:any;
  tab:any;
  run_id:any;
  widthSet:any;
  @Input() set runId(runId: string) {
    this.run_id = runId;
  }
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100
    console.log(getDataHead)
    this.sendHead = getDataHead;
  }
  @Output() onClickListData = new EventEmitter<{data:any,counter:any,run_id:any,event:any}>();//ส่งไปเรียก fju0100
  @Output() onChangeTab = new EventEmitter<any>();
  constructor(
  ) { }

  ngOnInit(): void {
    
    
  }

  ngAfterViewInit(): void {

  }
    
  ngOnDestroy(): void {
    
  }

  assignWidth(obj:any){
    console.log(obj.index)
    if(obj.index==0)
      this.widthSet="100%";
    else if(obj.index==1)
      this.widthSet="100%";
    else if(obj.index==2)
      this.widthSet="100%";
    else if(obj.index==3)
      this.widthSet="100%";
    else if(obj.index==4)
      this.widthSet="100%";
  }

  callDataHead(objData:any){//วิ่งไปเรียก fju0100
    console.log(objData)
    var data = objData.data;
    var counter = objData.counter;
    var run_id = objData.run_id;
    var event = objData.event;
    this.onClickListData.emit({data,counter,run_id,event});
  }

  activeTab(tab:any){
    tab.run_id = this.run_id;
    this.tab = tab;
  }


}
