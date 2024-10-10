import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import {MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'app-fsc0200-main',
  templateUrl: './fsc0200-main.component.html',
  styleUrls: ['./fsc0200-main.component.css']
})
export class Fsc0200MainComponent implements OnInit {
  sendHead:any;
  tab:any;
  run_id:any;
  @Input() set runId(runId: string) {
    this.run_id = runId;
  }
  @Input() set getDataHead(getDataHead: any) {//รับจาก fsc0200
    console.log('getDataHead Main==>' ,getDataHead)
    this.sendHead = getDataHead;
  }
  @Output() onClickListData = new EventEmitter<{data:any,counter:any,run_id:any,event:any}>();//ส่งไปเรียก fsc0200
  @Output() onChangeTab = new EventEmitter<any>();
  @ViewChild('tabGroup',{static: true}) tabGroup : ElementRef;
  constructor(
  ) { }

  ngOnInit(): void {
    this.tabGroup['_indexToSelect'] = 0;
  }

  callDataHead(objData:any){//วิ่งไปเรียก fsc0200
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
