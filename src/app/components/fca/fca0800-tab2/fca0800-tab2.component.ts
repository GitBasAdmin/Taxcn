import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,ViewChildren, QueryList    } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
declare var myExtObject: any;
@Component({
  selector: 'app-fca0800-tab2',
  templateUrl: './fca0800-tab2.component.html',
  styleUrls: ['./fca0800-tab2.component.css']
})
export class Fca0800Tab2Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject: any;
  headData:any;
  caseTypeValue:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild('labelImport',{static: true}) labelImport : ElementRef;
  @Input() set getTab(getTab: any) {//รับจาก fju0100-main
    if(typeof getTab !='undefined' && getTab.index==1){
      myExtObject.callCalendar();
    }
  }
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100-main
    console.log(getDataHead)
    if(typeof getDataHead !='undefined'){
      this.headData = getDataHead;
      this.caseTypeValue = this.headData.case_type;
      //this.getAppealJudgeData(0);
    }
  }
  fileToUpload: File = null;
  constructor() { }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };
  }



  ngAfterViewInit(): void {
    //this.dtTrigger.next(null);
    }
    
  ngOnDestroy(): void {
      //this.dtTrigger.unsubscribe();
    }

    onFileChange(e: Event) {
      /*
      this.labelImport.nativeElement.innerText = Array.from(files)
        .map(f => f.name)
        .join(', ');
      this.fileToUpload = files.item(0);
      */
      console.log(e.target)
    }

    import(): void {
      console.log('import ' + this.fileToUpload.name);
    }

}
