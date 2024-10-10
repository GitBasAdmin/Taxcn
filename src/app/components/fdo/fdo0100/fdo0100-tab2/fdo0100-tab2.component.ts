import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MeterialTableModel } from '../../models/get-search-material-model';
import { FdoService } from '../../service/fdo.service';
@Component({
  selector: 'app-fdo0100-tab2',
  templateUrl: './fdo0100-tab2.component.html',
  styleUrls: ['./fdo0100-tab2.component.css']
})
export class Fdo0100Tab2Component implements OnInit, AfterViewInit, OnDestroy {
  public dataItem: Array<MeterialTableModel>
  public dtOptions2: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 99999,
    processing: true,
    columnDefs: [{"targets": 'no-sort',"orderable": false}],
    order:[[0,'desc']],
    lengthChange : false,
    info : false,
    paging : false,
    searching : false
  };
  public dtTrigger: Subject<any> = new Subject<any>();
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  constructor(
    private route: ActivatedRoute,
    private _fdo: FdoService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((item: any) => {
      if(item.run_id) {
        this._fdo.getHistory(item.run_id).subscribe((response: any) => {
          this.dataItem = response.result
          this.dataItem.forEach((ele, index, array) => {
            ele['open_date_num']="";
            if(ele.open_date != null){
              ele['open_date_num'] = this.convDate(ele.open_date);

            }
        });

          console.log(this.dataItem)
          if(this.dataItem) {
            this.rerender()
          }
        })
      }
    })
  }

  convDate(date:any){
    if(date){
      var dateArray = date.split('/');
      return dateArray[2]+dateArray[1]+dateArray[0];
    }else
      return '';
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
      });
    });
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

}
