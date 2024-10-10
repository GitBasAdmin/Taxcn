import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef,ViewEncapsulation } from '@angular/core';
import{Clipboard} from '@angular/cdk/clipboard'
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-popup-stat',
  templateUrl: './popup-stat.component.html',
  styleUrls: ['./popup-stat.component.css']
})
export class PopupStatComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];

  sessData:any;
  userData:any;
  result:any = [];

  constructor(private clipboard: Clipboard) { 

  }

  ngOnInit(): void {
    if(this.items){
      var item = this.items.split(',');
      if(item.length){
        for(var i=0;i<item.length;i++){
          this.result.push({"case":item[i]})
        }
      }
      console.log(this.result)
    }
  }

  ngAfterViewInit(): void {
    
  }

  copyData(event: HTMLDivElement){
    console.log(event)
    if(this.clipboard.copy(event.innerText)){
      alert('copy ข้อมูลทั้งหมดเรียบร้อยแล้ว')
    }
    /*
    if (navigator.clipboard) {
      navigator.clipboard.writeText(event.innerText).then(() => {
        alert('copy ข้อมูลทั้งหมดเรียบร้อยแล้ว')
      }, (error) => {
        console.log(error)
      });
    } else {
      console.log('Browser do not support Clipboard API')
    }
    */
  }
  
}
