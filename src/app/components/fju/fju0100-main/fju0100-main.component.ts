import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import {MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'app-fju0100-main',
  templateUrl: './fju0100-main.component.html',
  styleUrls: ['./fju0100-main.component.css']
})
export class Fju0100MainComponent implements OnInit {
  sendHead:any;
  tab:any;
  run_id:any;
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
