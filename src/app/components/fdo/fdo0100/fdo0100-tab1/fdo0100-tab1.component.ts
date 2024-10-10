import { AfterViewInit, Component, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, EventEmitter,ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { DataModel } from '../../models/get-data-model';
import { MeterialTableModel, SearchMaterialModel } from '../../models/get-search-material-model';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { FdoService } from '../../service/fdo.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnModelComponent } from '../../modal/datalist-return-model/datalist-return-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilities } from '@app/@shared/utilities';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalPrintComponent } from '../../modal/modal-print/modal-print.component';
import { ModalPrintCoverComponent } from '../../modal/modal-print-cover/modal-print-cover.component';
declare var myExtObject: any;
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fdo0100-tab1',
  templateUrl: './fdo0100-tab1.component.html',
  styleUrls: ['./fdo0100-tab1.component.css']
})
export class Fdo0100Tab1Component implements OnInit, AfterViewInit, OnDestroy {
  @Input() public formData: FormGroup;

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  private subscription: Subscription
  public dataCase: DataModel[]
  public dataReqType: DataModel[]
  public dataKeep: DataModel[]
  private run_id: string | number
  public dataSearchMaterial: SearchMaterialModel
  editMaterialData:any;

  public dtOptions2: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 99999,
    processing: true,
    columnDefs: [{"targets": 'no-sort',"orderable": false}],
    order:[[2,'asc']],
    lengthChange : false,
    info : false,
    paging : false,
    searching : false
  };
  public dtTrigger: Subject<any> = new Subject<any>();
  private condition: ConditionType = ConditionType.Defualt
  private allow: AllowChange = AllowChange.None

  constructor(
    private _fdo: FdoService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
  ) {
    const item: string[] = ["ซอง", "กล่อง", "ตู้", "ปึก", "แฟ้ม", "เล่ม"]
    this.dataKeep = []
    item.forEach((text: string) => {
      this.dataKeep.push({fieldIdValue: text, fieldNameValue: text})
    })
  }

  ngOnInit(): void {
    
    this.formData.controls['lit_type'].valueChanges.subscribe((value) => {
      if(value && this.condition == ConditionType.Defualt && this.allow == AllowChange.Allow) {
        this._fdo.getRunItem({lit_type: value, run_id: Number(this.run_id)}).subscribe((response: any) => {
          //console.log(response)
          const runItem = response.result.item
          this.formData.controls['item'].setValue(runItem)
        this._fdo.getData({
          table_name: "pmaterial_req_type",
          field_id: "req_type_id",
          field_name: "req_doc_title",
        }).subscribe((response: any) => {
          const index = response?.findIndex(x => x.fieldIdValue == value)
          this.formData.controls['doc_no'].setValue(response[index]?.fieldNameValue || "")
        })
      })
      } else if(value && this.run_id && this.allow == AllowChange.Allow) {
        this._fdo.getRunItem({lit_type: value, run_id: Number(this.run_id)}).subscribe((response: any) => {
          //console.log(response)
          const runItem = response.result.item
          this.formData.controls['item'].setValue(runItem)
          this._fdo.getData({
            table_name: "pmaterial_req_type",
            field_id: "req_type_id",
            field_name: "req_doc_title",
          }).subscribe((response: any) => {
            this.formData.controls['doc_no'].setValue(`${response[value-1]?.fieldNameValue}${runItem}` || "")
          })
        })
      }
      else if(!value) {
        this.formData.controls['doc_no'].setValue("")
      }
    })

    this._fdo.getData({
      table_name: "PMATERIAL_TITLE",
      field_id: "CASE_TITLE",
      field_name: "CASE_TITLE",
      order_by: " case_title_id ASC"
    }).subscribe((response: any) => {
      this.dataCase = response
    })

    this._fdo.getData({
      table_name: "pmaterial_req_type",
      field_id: "req_type_id",
      field_name: "req_type_name"
    }).subscribe((response: any) => {
      this.dataReqType = response
    })

    this.route.queryParams.subscribe((item: any) => {
      console.log(item)
      if(item.run_id) {
        this.allow = AllowChange.None
        this.run_id = item.run_id
        this._fdo.getMaterial(
          {
            run_id: item.run_id
          }
        ).subscribe((response: any) => {
          this.dataSearchMaterial = new SearchMaterialModel()
          this.dataSearchMaterial = response.result
          console.log(this.dataSearchMaterial)
          this.setDateAfterLoad()
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
  }

  onSearch = () => {
    const confirm$:ConfirmBoxInitializer = new ConfirmBoxInitializer()
    confirm$.setTitle('ข้อความแจ้งเตือน')
    confirm$.setButtonLabels('ตกลง');
    if(!this.formData.controls['case_title'].value) {
      confirm$.setMessage('กรุณาระบุคำนำหน้า')
      confirm$.openConfirmBox$().subscribe()
      return
    } else if(!this.formData.controls['case_id'].value) {
      confirm$.setMessage('ป้อนเลขที่เอกสาร')
      confirm$.openConfirmBox$().subscribe()
      return
    }

    this._fdo.getSearchMaterial(
      {
        case_title: this.formData.controls['case_title'].value,
        case_id: this.formData.controls['case_id'].value,
        case_yy: this.formData.controls['case_yy'].value
      }
    ).subscribe((response: any) => {
      console.log(response.result)
      this.dataSearchMaterial = response.result

      if(!this.dataSearchMaterial?.meterial?.run_id) {
        confirm$.setMessage('ไม่พบข้อมูล')
        confirm$.openConfirmBox$().subscribe()
        return
      }
      this.condition = ConditionType.Search
      this.setDateAfterLoad()
    })
  }

  

  setDateAfterLoad = () => {
    this.allow = AllowChange.None
    const { case_id, case_title, case_yy, burn_date, req_user_name, req_dep_name, remark, material_running, req_user_id, run_id } = this.dataSearchMaterial.meterial
    this.formData.controls['burn_date'].setValue(burn_date)
    //this.formData.controls['req_user_id'].setValue(req_user_id)
    //this.formData.controls['req_user_name'].setValue(req_user_name)
    //this.formData.controls['req_dep_name'].setValue(req_dep_name)
    //this.formData.controls['req_dep_code'].setValue("");
    this.formData.controls['material_running'].setValue(material_running)
    this.formData.controls['material_remark'].setValue(remark)
    this.formData.controls['run_id'].setValue(run_id)
    this.formData.controls['case_id'].setValue(case_id)
    this.formData.controls['case_title'].setValue(case_title)
    this.formData.controls['case_yy'].setValue(case_yy || new Date().getFullYear()+543)

    const { item, keep_in, page_no, keep_date, lit_type, due_return, wad_no, doc_no,material_item,receipt_from} = this.dataSearchMaterial.meterial_detail
    this.formData.controls['remark'].setValue(this.dataSearchMaterial.meterial_detail.remark)
    this.formData.controls['lit_type'].setValue(lit_type)
    this.formData.controls['due_return'].setValue(due_return)
    this.formData.controls['doc_no'].setValue(doc_no)
    this.formData.controls['keep_in'].setValue(keep_in)
    this.formData.controls['wad_no'].setValue(wad_no)
    this.formData.controls['page_no'].setValue(page_no)
    this.formData.controls['doc_desc'].setValue(wad_no)
    this.formData.controls['receipt_from'].setValue(receipt_from)
    this.formData.controls['open_date'].setValue(wad_no)
    this.formData.controls['item'].setValue(item||1)
    this.formData.controls['material_item'].setValue(material_item)
    this.formData.controls['keep_date'].setValue(keep_date || myExtObject.curDate())
    if(this.dataSearchMaterial.table.length > 0) {
      this.rerender()
    }
    this._fdo.getData({
      table_name: 'pdepartment',
      field_id: 'dep_code',
      field_name: 'dep_name'
    }).subscribe((response: any) => {
      const data: DataModel[] = response
      if(data.length > 0) {
        this.formData.controls['req_dep_code'].setValue(data.find(x => x.fieldNameValue == req_dep_name)?.fieldIdValue)
      }
    }, (_) => {

    }, () => {
      this.condition = ConditionType.Defualt
      this.allow = AllowChange.Allow
    })

    if(this.condition != ConditionType.Defualt) {
      this.router.navigate([], {
        queryParams: { run_id: run_id },
        queryParamsHandling: 'merge',
        relativeTo: this.route
      })
    }
    this.condition = ConditionType.Defualt
    this.allow = AllowChange.Allow
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

  runId() {
    if(!this.formData.controls['case_id'].value) {
      this.subscription = this._fdo.getRunCaseId({
        case_title: this.formData.controls['case_title'].value,
        case_yy: this.formData.controls['case_yy'].value ?? new Date().getFullYear()+543
      }).subscribe((response: any) => {
        this.formData.controls['case_id'].setValue(response.result.case_id)
      })
    }
  }

  openReqUser() {
    // pofficer
    const modalRef = this.modalService.open(DatalistReturnModelComponent)
    modalRef.componentInstance.value1 = "pofficer"
    modalRef.componentInstance.value2 = "off_id"
    modalRef.componentInstance.value3 = "off_name"

    modalRef.result.then((item: any) => {
      if(item){
        this.formData.controls['req_user_id'].setValue(item.fieldIdValue)
        this.formData.controls['req_user_name'].setValue(item.fieldNameValue)
      }
    })
  }

  openReqDep() {
    const modalRef = this.modalService.open(DatalistReturnModelComponent)
    modalRef.componentInstance.value1 = "pdepartment"
    modalRef.componentInstance.value2 = "dep_code"
    modalRef.componentInstance.value3 = "dep_name"

    modalRef.result.then((item: any) => {
      if(item){
        this.formData.controls['req_dep_code'].setValue(item.fieldIdValue)
        this.formData.controls['req_dep_name'].setValue(item.fieldNameValue)
      }
    })

  }

  saveRemark() {
    if(!this.dataSearchMaterial?.meterial) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('คุณไม่มีสิทธิ์แก้ไขข้อมูล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      confirmBox.openConfirmBox$().subscribe()

      return
    }

    if(!this.formData.controls['case_yy'].value || this.formData.controls['case_yy'].value<=999){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุปีเลขเอกสารแยกเก็บ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      confirmBox.openConfirmBox$().subscribe()
      return
    }

    const { case_yy, material_running, run_id } = this.dataSearchMaterial?.meterial
    if(run_id) {
      this._fdo.saveRemark(
        {
          material_running: material_running,
          remark: this.formData.controls['material_remark'].value//,
          // case_yy: case_yy
        }
      ).subscribe((response: any) => {
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        confirmBox.openConfirmBox$().subscribe()
      })
    }
  }

  onDelMaterial = (item: MeterialTableModel) => {
    const modalRef: NgbModalRef = this.modalService.open(ModalConfirmComponent)
    modalRef.closed.subscribe((data) => {
      if(data) {
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER
        })
        confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){
            this._fdo.delMaterial({
              material_running: item.material_running,
              material_item: item.material_item
            }).subscribe((response: any) => {
              this.onLoadDataAfterSave(null)
              this.addNewDocument();
            })
          }
        })
      }
    })
  }

  onDelCaseMaterial = () => {
    
    const modalRef: NgbModalRef = this.modalService.open(ModalConfirmComponent)
    modalRef.closed.subscribe((data) => {
      if(data) {
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER
        })
        confirmBox.openConfirmBox$().subscribe(resp => {
          if(resp.success==true){
            this._fdo.delCaseMaterial({
              run_id: Number(this.run_id)
            }).subscribe((response: any) => {
              this.onLoadDataAfterSave(null)
              this.addNewDocument();
            })
          }
        })
      }
    })
  }

  onSave = () => {
    if(!this.run_id) {
      return
    }

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
    });

    if(!this.formData.controls['case_yy'].value || this.formData.controls['case_yy'].value<=999){
      confirmBox.setMessage('กรุณาระบุปีเลขเอกสารแยกเก็บ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if(resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if(this.condition == ConditionType.Add || this.condition == ConditionType.Defualt) {
      console.log(this.formData.controls['due_return'].value)
      this._fdo.insertMaterial({
        material_running: this.formData.controls['material_running'].value,
        remark: this.formData.controls['material_remark'].value,
        case_yy: this.formData.controls['case_yy'].value,
        req_user_id: '',//this.formData.controls['req_user_id'].value,
        req_dep_code: '',//this.formData.controls['req_dep_code'].value,
        burn_date: this.formData.controls['burn_date'].value,
        // flag_burn: this.formData.controls['flag_burn'].value,
        item: this.formData.controls['item'].value,
        lit_type: this.formData.controls['lit_type'].value,
        doc_no: this.formData.controls['doc_no'].value,
        keep_date: this.formData.controls['keep_date'].value,
        due_return: (this.formData.controls['due_return'].value == false || typeof this.formData.controls['due_return'].value =='undefined')? "0" : "1",
        doc_desc: this.formData.controls['doc_desc'].value,
        receipt_from : this.formData.controls['receipt_from'].value,
        return_date: null,
        wad_no: this.formData.controls['wad_no'].value,
        keep_in: this.formData.controls['keep_in'].value,
        page_no: this.formData.controls['page_no'].value,
        remark_detail: this.formData.controls['remark'].value,
        case_title: this.formData.controls['case_title'].value,
        case_id: this.formData.controls['case_id'].value,
        run_id: this.run_id.toString()
      }).subscribe((response: any) => {
        if(response?.result.includes('SUCCESS')) {
          confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
          confirmBox.openConfirmBox$().subscribe()
          this.onLoadDataAfterSave({'material_item':response?.material_item,'material_running' : response?.material_running})
        }else {
          confirmBox.setMessage('พบข้อผิดพลาด');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          confirmBox.openConfirmBox$().subscribe()
        }
      }, (error) => {

      }, ()=> {
        this.condition == ConditionType.Defualt
      })
    } else {
      const { return_date } = this.dataSearchMaterial?.meterial
      this._fdo.updateMaterial({
        material_running: this.formData.controls['material_running'].value,
        remark: this.formData.controls['material_remark'].value,
        case_yy: this.formData.controls['case_yy'].value,
        req_user_id: '',//this.formData.controls['req_user_id'].value,
        req_dep_code: '',//this.formData.controls['req_dep_code'].value,
        burn_date: this.formData.controls['burn_date'].value,
        // flag_burn: this.formData.controls['flag_burn'].value,
        item: this.formData.controls['item'].value,
        lit_type: this.formData.controls['lit_type'].value,
        doc_no: this.formData.controls['doc_no'].value,
        keep_date: this.formData.controls['keep_date'].value,
        due_return: this.formData.controls['due_return'].value == false ? "0" : "1",
        doc_desc: this.formData.controls['doc_desc'].value,
        receipt_from : this.formData.controls['receipt_from'].value,
        return_date: return_date,
        wad_no: this.formData.controls['wad_no'].value,
        keep_in: this.formData.controls['keep_in'].value,
        page_no: this.formData.controls['page_no'].value,
        remark_detail: this.formData.controls['remark'].value,
        case_title: this.formData.controls['case_title'].value,
        case_id: this.formData.controls['case_id'].value,
        run_id: this.run_id.toString(),
        material_item:this.formData.controls['material_item'].value,
      }).subscribe((response: any) =>{
        if(response?.result.includes('SUCCESS')) {
          confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
          confirmBox.openConfirmBox$().subscribe()
          this.onLoadDataAfterSave({'material_item':response?.material_item,'material_running' : response?.material_running})
        }else {
          confirmBox.setMessage('พบข้อผิดพลาด');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          confirmBox.openConfirmBox$().subscribe()
        }
      }, (error) => {

      }, ()=> {
        this.condition == ConditionType.Defualt
      })
    }
  }

  onLoadDataAfterSave = (type:any) => {
    this._fdo.getMaterial(
      {
        run_id: Number(this.run_id)
      }
    ).subscribe((response: any) => {
      this.dataSearchMaterial = response.result
      this.rerender()
      if(type){
        this.onLoadDataEditAfterSave(type.material_item,type.material_running);
      }
    })
  }
  onLoadDataEditAfterSave=(material_item:any,material_running:any)=>{
    //console.log(this.dataSearchMaterial)
    this.onEditMaterial(material_item,material_running);
  }
  onCancel = () => {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onEditMaterial = (item: MeterialTableModel,running:any) => {
    this.allow = AllowChange.None
    var params:any;
    if(item.case_title){
      params = {
        case_title: item.case_title,
        case_id: item.case_id,
        case_yy: item.case_yy,
        material_item: item.material_item
      }
    }else{
      params = {
        material_item: item,
        material_running: running
      }
    }
    
    this._fdo.getMaterial(params).subscribe((response: any) => {
      console.log(response.result)
      let dataGetMaterial: SearchMaterialModel = response.result
      if(dataGetMaterial.meterial.material_running){
        this.editMaterialData = params?params:{}
      }
      const { burn_date, req_user_name, req_dep_name, remark, material_running, req_user_id, return_date } = dataGetMaterial.meterial
      this.formData.controls['burn_date'].setValue(burn_date)
      //this.formData.controls['req_user_id'].setValue(req_user_id)
      //this.formData.controls['req_user_name'].setValue(req_user_name)
      //this.formData.controls['req_dep_name'].setValue(req_dep_name)
      // this.formData.controls['req_dep_code'].setValue("");
      this.formData.controls['material_running'].setValue(material_running)
      this.formData.controls['material_remark'].setValue(remark)
      // this.formData.controls['run_id'].setValue(run_id)

      const { item, keep_in, page_no, keep_date, lit_type, due_return, wad_no, doc_no, doc_desc,material_item,receipt_from } = dataGetMaterial.meterial_detail
      this.formData.controls['remark'].setValue(dataGetMaterial.meterial_detail.remark)
      this.formData.controls['lit_type'].setValue(lit_type)
      this.formData.controls['due_return'].setValue(due_return == "1" ? true : false)
      this.formData.controls['doc_no'].setValue(doc_no)
      this.formData.controls['keep_in'].setValue(keep_in)
      this.formData.controls['wad_no'].setValue(wad_no)
      this.formData.controls['page_no'].setValue(page_no)
      this.formData.controls['doc_desc'].setValue(doc_desc)
      this.formData.controls['open_date'].setValue(return_date)
      this.formData.controls['item'].setValue(item)
      this.formData.controls['keep_date'].setValue(keep_date)
      this.formData.controls['material_item'].setValue(material_item)
      this.formData.controls['receipt_from'].setValue(receipt_from)
      this._fdo.getData({
        table_name: 'pdepartment',
        field_id: 'dep_code',
        field_name: 'dep_name'
      }).subscribe((response: any) => {
        const data: DataModel[] = response
        if(data.length > 0) {
          this.formData.controls['req_dep_code'].setValue(data.find(x => x.fieldNameValue == this.formData.controls['req_dep_name'].value)?.fieldIdValue)
        }
      })
      this.condition = ConditionType.Edit
      this.allow = AllowChange.Allow
    })
  }

  addNewDocument = () => {
    if(this.condition == ConditionType.Add){
      return
    }else{
      this.allow = AllowChange.None
      const newDateToThai = ():string => {
        let currentDate: Date = new Date()

        let dd = currentDate.getDate()
        let mm = currentDate.getMonth()+1
        let yy = currentDate.getFullYear()+543

        return `${Utilities._to2digit(dd)}/${Utilities._to2digit(mm)}/${yy}`
      }

      if(this.run_id && this.formData.controls['lit_type'].value) {
        this._fdo.getRunItem({lit_type: this.formData.controls['lit_type'].value, run_id: Number(this.run_id)}).subscribe((response: any) => {
          const runItem = response.result.item
          this.formData.controls['item'].setValue(runItem)
          this._fdo.getData({
            table_name: "pmaterial_req_type",
            field_id: "req_type_id",
            field_name: "req_doc_title",
          }).subscribe((response: any) => {
            this.formData.controls['doc_no'].setValue(`${response[this.formData.controls['lit_type'].value-1]?.fieldNameValue}${runItem}` || "")
          })
        })
      } else {
        let item: number = this.formData.controls['item'].value || 0
        this.formData.controls['item'].setValue(item += 1)
      }
      this.formData.controls['burn_date'].setValue("")
      this.formData.controls['material_remark'].setValue("")
      this.formData.controls['keep_in'].setValue("")
      this.formData.controls['wad_no'].setValue("")
      this.formData.controls['page_no'].setValue("")
      this.formData.controls['remark'].setValue("")
      this.formData.controls['open_date'].setValue("")
      this.formData.controls['doc_desc'].setValue("")
      this.formData.controls['open_date'].setValue("")
      this.formData.controls['keep_date'].setValue(newDateToThai())
      this.condition = ConditionType.Add
      this.allow = AllowChange.Allow
    }
    
  }

  directiveDate = (event: any) => {
    const { value, name } = event.target
    this.formData.controls[name].setValue(value)
  }

  printReport = (type:any) =>{
    const { material_running } = this.dataSearchMaterial?.meterial
    if(type==1){
      var rptName = 'rfdo0100';
      var paramData ='{}';
      var paramData = JSON.stringify({
        "pmat_running" : material_running ? material_running : '',
        "plit_type" : '',
        "pid_start" : '',
        "pid_end" : '',
      });
      console.log(paramData)
      this.printReportService.printReport(rptName,paramData);
    }else if(type==2){
      const modalRef: NgbModalRef = this.ngbModal.open(ModalPrintComponent)
      const { material_running,case_id,case_title,case_yy} = this.dataSearchMaterial?.meterial
      modalRef.componentInstance.doc_no = case_title+case_id+"/"+case_yy
      modalRef.componentInstance.material_running = material_running
    }else if(type==3){
      /* const modalRef: NgbModalRef = this.ngbModal.open(ModalPrintCoverComponent,{ windowClass: 'my-class'})
      modalRef.componentInstance.run_id = this.run_id ? this.run_id : '' */
      // var rptName = 'rdo1600';
      var rptName = 'prdo1600';
      var paramData ='{}';
      var paramData = JSON.stringify({
        "run_id" : this.run_id ? this.run_id : '',
      });
      console.log(paramData)
      // this.printReportService.printReport(rptName,paramData);
    
      let runId = this.run_id ? this.run_id : '';
      let winURL = window.location.href.split("/#/")[0]+"/#/";
       myExtObject.OpenWindowMaxName(winURL+'prdo1600?run_id='+runId,'prdo1600');
    
    }
  }
}


enum ConditionType {
  Defualt = 0,
  Search = 1,
  Add = 2,
  Edit = 3
}

enum AllowChange {
  None = 0,
  Allow = 1
}
