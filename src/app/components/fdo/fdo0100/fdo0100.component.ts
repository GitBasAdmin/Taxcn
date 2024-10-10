
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataFromTitleModel } from '../models/data-from-title-model';
import { MeterialTableModel, SearchMaterialModel } from '../models/get-search-material-model';
import { FdoService } from '../service/fdo.service';
import { Utilities } from '@shared/utilities';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fdo0100',
  templateUrl: './fdo0100.component.html',
  styleUrls: ['./fdo0100.component.css']
})
export class Fdo0100Component implements OnInit {
  defaultCaseType:any;
  widthSet:any;
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  // public dataResult: SearchMaterialModel
  // public dataTab2: Array<MeterialTableModel>
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  public formInfomation: FormGroup
  public run_id: any

  constructor(
    private _fdo: FdoService,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.onCreateForm()
  }

  ngOnInit(): void {
    if(!!!this.defaultCaseType) {
      this._fdo.getAuthen({"url_name" : "fca0200"})
      .subscribe((responose: any) => {
        this.defaultCaseType = responose.defaultCaseType;
      })
    }
    this.route.queryParams.subscribe((item: any) => {
      if(item.run_id) {
        this.run_id = item.run_id
      }
    })
  }

  onCreateForm() {
    const newDateToThai = ():string => {
      let currentDate: Date = new Date()

      let dd = currentDate.getDate()
      let mm = currentDate.getMonth()+1
      let yy = currentDate.getFullYear()+543

      return `${Utilities._to2digit(dd)}/${Utilities._to2digit(mm)}/${yy}`
    }
    this.formInfomation = this._fb.group({
      inforCase: this._fb.group({
        case_title: new FormControl(""),
        case_id: new FormControl(""),
        case_yy: new FormControl(""),
      }),
      infoDetail: this._fb.group({
        run_id: new FormControl(""),
        case_title: new FormControl(""),
        case_id: new FormControl(""),
        case_yy: new FormControl(new Date().getFullYear()+543, Validators.compose([Validators.pattern(/[0-9]+/)])),
        burn_date: new FormControl(""),
        material_remark: new FormControl(""),
        req_user_id: new FormControl(""),
        req_user_name: new FormControl(""),
        req_dep_code: new FormControl(""),
        req_dep_name: new FormControl(""),
        lit_type: new FormControl(""),
        material_running: new FormControl(""),
        due_return: new FormControl(false),
        keep_date: new FormControl(newDateToThai()),
        doc_no: new FormControl(""),
        keep_in: new FormControl(""),
        wad_no: new FormControl(""),
        page_no: new FormControl(""),
        doc_desc: new FormControl(""),
        receipt_from : new FormControl(""),
        remark: new FormControl(""),
        open_date: new FormControl(""),
        item: new FormControl(1, Validators.compose([Validators.pattern(/[0-9]+/)])),
        material_item: new FormControl(""),
      })
    })
  }

  get infoDetail() {
    return this.formInfomation.get('infoDetail') as FormGroup;
  }

  assignWidth(obj:any){
    if(obj.index==0)
      this.widthSet="100%";
    else if(obj.index==1)
      this.widthSet="3350px";
    else if(obj.index==2)
      this.widthSet="3050px";
      else if(obj.index==3)
      this.widthSet="3050px";
    else if(obj.index==4)
      this.widthSet="100%";
  }

  onSearch = (data: DataFromTitleModel) => {
    console.log(data)
    if(data) {
      this.router.navigate([],
        {
          queryParams: { run_id: data.run_id },
          queryParamsHandling: 'merge',
          relativeTo: this.route
        })
      // this.infoDetail.controls['run_id'].setValue(data.run_id)
    }
  }

}

