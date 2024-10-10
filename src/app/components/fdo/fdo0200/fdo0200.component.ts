import { Component, OnInit, QueryList, ViewChildren, AfterViewInit,EventEmitter,ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FdoService } from '@app/components/fdo/service/fdo.service';
import { Fdo200Service } from '@app/components/fdo/service/fdo200.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DataModel } from '../models/get-data-model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Utilities } from '@shared/utilities';
import { DatalistReturnModelComponent } from '../modal/datalist-return-model/datalist-return-model.component';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { ModalMaterialComponent } from '../modal/modal-material/modal-material.component';
import { ModalConfirmFdoComponent } from '../modal/modal-confirm-fdo/modal-confirm-fdo.component';
import { ConfirmBoxInitializer, DialogLayoutDisplay } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from '@app/auth.service';
import { DataFromTitleModel } from '../models/data-from-title-model';
import { DataTableDirective } from 'angular-datatables';
import { SearchDTOModel, TableDTOModel } from '../models/fdo0200/search-dtomodel';
import { switchMap } from 'rxjs/operators';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component';
import { ModalConfirmComponent } from '../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import { DatalistReturnMultipleComponent } from '../../modal/datalist-return-multiple/datalist-return-multiple.component';
declare var myExtObject: any;
import * as $ from 'jquery';
interface State {
  searchTerm: string;
}
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fdo0200',
  templateUrl: './fdo0200.component.html',
  styleUrls: ['./fdo0200.component.css']
})
export class Fdo0200Component implements OnInit, AfterViewInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  myExtObject: any;
  public defaultCaseType:any;
  public dtOptions2: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 99999,
    processing: true,
    columnDefs: [{"targets": 'no-sort',"orderable": false}],
    order:[],
    lengthChange : false,
    info : false,
    paging : false,
    searching : false,
    destroy:true
  };
  public dtTrigger: Subject<any> = new Subject<any>();
  private _litType: BehaviorSubject<DataModel[]> = new BehaviorSubject<DataModel[]>([])
  private _cardType: BehaviorSubject<DataModel[]> = new BehaviorSubject<DataModel[]>([])
  private _case: BehaviorSubject<DataModel[]> = new BehaviorSubject<DataModel[]>([])
  private _dataTable: BehaviorSubject<TableDTOModel[]> = new BehaviorSubject<TableDTOModel[]>([])
  // private dataTable: Array<TableDTOModel> = new Array<TableDTOModel>()
  public _state: State = {
    searchTerm: '',
  };
  private _search$ = new Subject<void>();
  public form: FormGroup
  public srdo_type: FormControl = new FormControl("1")
  // public srdo_type: FormControl = new FormControl("2")
  public run_id: any
  public edit_flag: boolean//add
  public edit_return_flag: boolean//add
  public edit_chk_flag: boolean//add
  public edit_rcv_flag: boolean//add
  public dep_code: any//add
  public user_level: any//add
  private dataResponse: SearchDTOModel

  constructor(
    private _fdo: FdoService, private _fdo0200: Fdo200Service,
    private route: ActivatedRoute,
    private ngbModal: NgbModal,
    private authService: AuthService,
    private router: Router,
    private printReportService: PrintReportService,
    ) {
    this.onCreateForm()
    this.srdo_type.valueChanges.subscribe((value) => {
      if(this.run_id) {
        this.onLoadDataAfterSave()
      }
    })

    this.form.controls['event_type'].valueChanges.subscribe((value) => {
      if(value == 4) {
        let dataUser = this.getDataUser()
        this.form.controls['chk'].setValue(true)
        //คืนคู่ความ
        this._fdo.getData({
          table_name: 'plit_type', field_id: 'lit_type', field_name: 'lit_type_desc'
        }).subscribe((response : any) => {
          this._litType.next(response)
          this.form.controls['lit_type'].setValue(response[0].fieldIdValue)
        })

        //ประเภทบัตร
        this._fdo.getData({
          table_name: 'pcard_type', field_id: 'card_type_id', field_name: 'card_type_name'
        }).subscribe((response: any) => {
          this._cardType.next(response)
          this.form.controls['ret_card_type'].setValue(response[0].fieldIdValue)
          this.form.controls['take_off_name'].setValue(dataUser.depName)
        })
      } else {
        this.form.controls['chk'].setValue(false)
      }
    })

    this.form.controls['chk'].valueChanges.subscribe((value) => {
      if(value) {
        let dataUser = this.getDataUser()
        this.form.controls['return_date'].setValue(this.newDateToThai())
        this.form.controls['return_time'].setValue(this.newCurretTime())
        this.form.controls['userreturn_id'].setValue(dataUser?.userCode)
        this.form.controls['userreturn_name'].setValue(dataUser?.offName)
      } else {
        this.form.controls['return_date'].setValue("")
        this.form.controls['return_time'].setValue("")
        this.form.controls['userreturn_id'].setValue("")
        this.form.controls['userreturn_name'].setValue("")
      }
    })

    this.form.controls['open_total'].valueChanges.subscribe((value) => {
      console.log(value)
      if(value){
          this.form.controls['doc_desc'].setValue("เบิกทั้งหมด")
      }else{
          this.form.controls['doc_desc'].setValue('')
      }
    })

    this.form.controls['take_off'].valueChanges.subscribe((value) => {
      //const { take_off_name, take_off_date } = this.dataResponse.History
      let dataUser = this.getDataUser()
      if(value){
        if(this.form.controls['event_type'].value==4){
          this.form.controls['take_off_name'].setValue(dataUser?.offName)
        }else{
          this.form.controls['take_off_name'].setValue(dataUser?.offName)
          this.form.controls['take_off_date'].setValue(this.newDateToThai())
        }
      }else{
        if(this.form.controls['event_type'].value==4){
          this.form.controls['take_off_name'].setValue('')
        }else{
          this.form.controls['take_off_name'].setValue('')
          this.form.controls['take_off_date'].setValue('')
        }
      }
    })
  }

  ngOnInit(): void {
    if(!!!this.defaultCaseType) {
      this._fdo.getAuthen({"url_name" : "fca0200"})
      .subscribe((responose: any) => {
        this.defaultCaseType = responose.defaultCaseType;
        this.route.queryParams.subscribe((item) => {
          if(item.run_id) {
            this.run_id = item.run_id
            this._fdo0200.getSearch({
              srdo_type: Number(this.srdo_type.value ||0),
              run_id: this.run_id
            }).subscribe((response: any) => {
              console.log(response)
              this.dataResponse = response.result
              this.setValue()
            })
          }
        })
      })
    } else {
      this.route.queryParams.subscribe((item) => {
        if(item.run_id) {
          this.run_id = item.run_id
          this._fdo0200.getSearch({
            srdo_type: Number(this.srdo_type.value ||0),
            run_id: this.run_id
          }).subscribe((response: any) => {
            console.log(response)
            this.dataResponse = response.result
            this.setValue()
          })
        }
      })
    }
    this._fdo.getData({
      table_name: "PMATERIAL_TITLE",
      field_id: "CASE_TITLE",
      field_name: "CASE_TITLE",
      order_by: " case_title_id ASC"
    }).subscribe((response: any) => {
      this._case.next(response)
    })

    let dataUser = this.getDataUser()
    this.form.controls['take_off_name'].setValue(dataUser?.offName)
  }

  ngAfterViewInit(): void {
    this.rerender()
  }

  private getDataUser = () => {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let userData: any

    if(sessData) {
      userData = JSON.parse(sessData)
    }

    //add
    this.dep_code = userData.depCode;
    this.user_level = userData.userLevel;
    return userData
  }

  onCreateForm = () => {
    this.edit_flag=false;
    this.edit_return_flag=true;
    this.edit_chk_flag=true;
    this.edit_rcv_flag=true;
    
    this.form = new FormGroup({
      event_type: new FormControl("1"),
      mbarcode: new FormControl(""),
      lit_type: new FormControl(""),
      case_title: new FormControl(""),
      // case_title: new FormControl("ก"),
      case_id: new FormControl(""),
      case_yy: new FormControl(new Date().getFullYear()+543, Validators.compose([Validators.pattern(/[0-9]+/)])),
      open_total: new FormControl(false),
      material_remark: new FormControl(""),
      dep_code: new FormControl(""),
      create_user_id: new FormControl(""),//add
      create_dep_code: new FormControl(""),//add
      dep_name: new FormControl({value: "", disabled: true}),
      useropen_id: new FormControl(""),
      useropen_name: new  FormControl({value: "", disabled: true}),
      judge_id: new FormControl(""),
      judge_name: new  FormControl({value: "", disabled: true}),
      court_id: new FormControl(""),
      to_court_name: new  FormControl({value: "", disabled: true}),
      room_id: new FormControl(""),
      open_date: new FormControl(this.newDateToThai()),
      open_time: new FormControl(this.newCurretTime()),
      openfor_id: new FormControl(""),
      openfor_desc: new FormControl(""),
      doc_desc: new FormControl(""),
      receipt_from: new FormControl(""),
      remark: new FormControl(""),
      take_off: new FormControl(false),
      chk: new FormControl(false),
      chk1: new FormControl(false),
      chk2: new FormControl(false),
      take_off_name: new FormControl({value: "", disabled: true}),
      take_off_date: new FormControl(this.newDateToThai()),
      rcv_user_id1: new FormControl(""),
      rcv_name: new FormControl(""),
      p_flag: new FormControl(""),
      return_date: new FormControl(""),
      return_time: new FormControl(""),
      userreturn_id: new FormControl(""),
      userreturn_name: new FormControl({value: "", disabled: true}),
      return_total: new FormControl(false),
      return_desc: new FormControl(""),
      lit_item: new FormControl(""),
      retuser_name: new FormControl(""),
      ret_card_type: new FormControl(""),
      ret_card_id: new FormControl(""),
      issued_by: new FormControl(""),
      return_card_sdate: new FormControl(""),
      return_card_edate: new FormControl(""),
      material_running: new FormControl(""),
      history_running: new FormControl(""),
      file_name: new FormControl(""),
      return_material_date:new FormControl(""),
      return_material_time:new FormControl(""),
      return_material_user_id:new FormControl(""),
      return_material_user_name:new FormControl(""),
      return_addition:new FormControl(""),
      return_material_item:new FormControl(""),
      return_material_desc:new FormControl(""),

      //new
      rcv_date:new FormControl(""),
      rcv_time:new FormControl(""),
      rcv_user_id:new FormControl(""),
      rcv_user_name:new FormControl(""),
      rcv_remark:new FormControl(""),
    })
  }

  private newDateToThai = ():string => {
    let currentDate: Date = new Date()

    let dd = currentDate.getDate()
    let mm = currentDate.getMonth()+1
    let yy = currentDate.getFullYear()+543

    return `${Utilities._to2digit(dd)}/${Utilities._to2digit(mm)}/${yy}`
  }

  private newCurretTime = (): string => {
    let currentDate: Date = new Date()
    return `${Utilities._to2digit(currentDate.getHours())}:${Utilities._to2digit(currentDate.getMinutes())}:${Utilities._to2digit(currentDate.getSeconds())}`
  }

  onOpenDep = () => {
    const modalRef = this.ngbModal.open(DatalistReturnComponent)
    modalRef.componentInstance.value1 = "pdepartment"
    modalRef.componentInstance.value2 = "dep_code"
    modalRef.componentInstance.value3 = "dep_name"
    modalRef.componentInstance.value9 = 1
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if(item){
        this.form.controls['dep_code'].setValue(item.fieldIdValue)
        this.form.controls['dep_name'].setValue(item.fieldNameValue)
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  onOpenUser = () => {
    const modalRef = this.ngbModal.open(DatalistReturnComponent)
    modalRef.componentInstance.value1 = "pofficer"
    modalRef.componentInstance.value2 = "off_id"
    modalRef.componentInstance.value3 = "off_name"
    modalRef.componentInstance.value9 = 1
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if(item){
        this.form.controls['useropen_id'].setValue(item.fieldIdValue)
        this.form.controls['useropen_name'].setValue(item.fieldNameValue)
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  onOpenFor = () => {
    const modalRef = this.ngbModal.open(DatalistReturnComponent)
    modalRef.componentInstance.value1 = "popen_reason"
    modalRef.componentInstance.value2 = "openfor_id"
    modalRef.componentInstance.value3 = "openfor_desc"
    modalRef.componentInstance.value9 = 1
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if(item){
        this.form.controls['openfor_id'].setValue(item.fieldIdValue)
        this.form.controls['openfor_desc'].setValue(item.fieldNameValue)
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  onOpenCourt = () => {
    const modalRef = this.ngbModal.open(DatalistReturnComponent)
    modalRef.componentInstance.value1 = "pcourt"
    modalRef.componentInstance.value2 = "court_id"
    modalRef.componentInstance.value3 = "court_name"
    modalRef.componentInstance.value9 = 1
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if(item){
        this.form.controls['court_id'].setValue(item.fieldIdValue)
        this.form.controls['to_court_name'].setValue(item.fieldNameValue)
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  onOpenReceiveDoc = () => {
    const modalRef = this.ngbModal.open(DatalistReturnComponent)
    modalRef.componentInstance.value1 = "pofficer"
    modalRef.componentInstance.value2 = "off_id"
    modalRef.componentInstance.value3 = "off_name"
    modalRef.componentInstance.value9 = 1
    modalRef.componentInstance.types = 1
    modalRef.result.then((item: any) => {
      if(item){
        this.form.controls['rcv_user_id1'].setValue(item.fieldIdValue)
        this.form.controls['rcv_name'].setValue(item.fieldNameValue)
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  onSearchFromHeader = (data: DataFromTitleModel) => {
    if(data) {
      this.router.navigate([],
      {
        queryParams: { run_id: data.run_id },
        queryParamsHandling: 'merge',
        relativeTo: this.route
      })
    }
  }

  onOpenJudge = () => {
    const modalRef: NgbModalRef = this.ngbModal.open(ModalJudgeComponent)
    modalRef.componentInstance.value1 = "pjudge"
    modalRef.componentInstance.value2 = "judge_id"
    modalRef.componentInstance.value3 = "judge_name"
    modalRef.componentInstance.value4 = ''
    modalRef.componentInstance.types = 1
    modalRef.componentInstance.value5 = JSON.stringify({"type":99})
    modalRef.result.then((item: any) => {
      if(item) {
        this.form.controls['judge_id'].setValue(item.judge_id)
        this.form.controls['judge_name'].setValue(item.judge_name)
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  onOpenMaterial = () => {
    const modalRef = this.ngbModal.open(ModalMaterialComponent)
    modalRef.componentInstance.run_id = this.run_id;
    modalRef.result.then((item: any) => {
      if(item){
        console.log(item)
        //this.form.controls['court_id'].setValue(item.fieldIdValue)
        this.form.controls['doc_desc'].setValue(item.fieldNameValue)
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  onOpenConfirmFdo = (type:any) => {
    const modalRef = this.ngbModal.open(ModalConfirmFdoComponent, { size : 'dialog'})
    modalRef.componentInstance.type = type;
    if(type==2)
      modalRef.componentInstance.return_addition =  this.form.controls['return_addition'].value;
    modalRef.result.then((item: any) => {
      if(item){
        console.log(item)
        if(type==1){
          this.form.controls['rcv_date'].setValue( myExtObject.curDate())
          this.form.controls['rcv_time'].setValue(this.newCurretTime())
          this.form.controls['rcv_user_id'].setValue(item.userCode)
          this.form.controls['rcv_user_name'].setValue(item.offName)
          this.form.controls['rcv_remark'].setValue(item.remark)
          this.form.controls['return_material_desc'].setValue(this.form.controls['doc_desc'].value);
          this.onSave();
          
        }else if(type==2){
          this.form.controls['return_material_date'].setValue(myExtObject.curDate())
          this.form.controls['return_material_time'].setValue(this.newCurretTime())
          this.form.controls['return_material_user_id'].setValue(item.userCode)
          this.form.controls['return_material_user_name'].setValue(item.offName)
          this.form.controls['return_addition'].setValue(item.remark)
          this.onSave();
        }
      }
    }).catch((error: any) => {
      console.log(error)
    })
  }

  onOpenLitigant = () =>{
    if(this.run_id){
      const modalRef = this.ngbModal.open(DatalistReturnComponent)
      modalRef.componentInstance.value1 = "pcase_litigant"
      modalRef.componentInstance.value2 = "seq"
      modalRef.componentInstance.value3 = "CONCAT(NVL(title,''),name) AS fieldNameValue"
      modalRef.componentInstance.value7 = " AND run_id='"+this.run_id+"' AND lit_type='"+this.form.controls['lit_type'].value+"'"
      modalRef.componentInstance.value9 = 1
    modalRef.componentInstance.types = 1
      modalRef.result.then((item: any) => {
        console.log(item)
        if(item){
          this.form.controls['lit_item'].setValue(item.fieldIdValue)
          this.form.controls['retuser_name'].setValue(item.fieldNameValue)
        }
      }).catch((error: any) => {
        console.log(error)
      })
    }
  }

  onSearch = () => {
    const confirm$:ConfirmBoxInitializer = new ConfirmBoxInitializer()
    confirm$.setTitle('ข้อความแจ้งเตือน')
    confirm$.setButtonLabels('ตกลง');
    if(!this.form.controls['case_title'].value) {
      confirm$.setMessage('กรุณาระบุคำนำหน้า')
      confirm$.openConfirmBox$().subscribe()
      return
    } else if(!this.form.controls['case_id'].value) {
      confirm$.setMessage('ป้อนเลขที่เอกสาร')
      confirm$.openConfirmBox$().subscribe()
      return
    }

    this._fdo0200.getSearch({
      case_title: this.form.controls['case_title'].value,
      case_id: this.form.controls['case_id'].value,
      case_yy: this.form.controls['case_yy'].value,
      srdo_type: Number(this.srdo_type.value ||0),
      // run_id: this.run_id //edit ค้นหา เลขที่เอกสาร
    }).subscribe((response: any) => {
      console.log(response)
      if(response.result.Material){
        this.dataResponse = response.result
        this.setValue()
        const { run_id } = this.dataResponse.Material
        if(run_id) {
          this.router.navigate(
            [],
            {
              queryParams: { run_id: run_id },
              relativeTo: this.route,
              queryParamsHandling: 'merge'
            }
          )
        }
      }else{
        //edit ค้นหาเลขที่เอกสาร
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ไม่พบข้อมูล');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING
        })
        confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
          }
        })
      }
    })
  }

  onPrint = (item: TableDTOModel) => {
    //window.open(`http://bizascorp.thddns.net:8840/cims/rpt/rdo0700.jsp?phistory_running=${item.history_running}`)
    //const { material_running } = this.dataSearchMaterial?.meterial
      var rptName = 'rdo0700';
      var paramData ='{}';
      var paramData = JSON.stringify({
        "phistory_running" : item.history_running ? item.history_running : '',
      });
      console.log(paramData)
      this.printReportService.printReport(rptName,paramData);
    
    
  }
  onPrintWord = () => {
    const { material_running,history_running,event_type } = this.dataResponse.History
    this._fdo0200.getPrintWord({
      form_type : 7,
      form_id : 'form_do_A4',
      material_running : material_running,
      history_running : history_running,
      run_id: this.run_id
    }).subscribe((response: any) => {
      if(response.file){
        myExtObject.OpenWindowMax(response.file);
        var eventType:any = event_type
        this.onEdit(eventType,history_running)
      }
    })
  }

  onDelWord = () => {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ต้องการลบไฟล์ Word ใช่หรือไม่?');
    confirmBox.setMessage('ยืนยันการลบไฟล์ข้อมูล');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER
    })
    confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
        const { file_name,event_type,history_running } = this.dataResponse.History
        this._fdo0200.getDelWord({
          file_name: file_name,
        }).subscribe((response: any) => {
          var eventType:any = event_type
          this.onEdit(eventType,history_running)
        })
      }
    })
  }


  setValue = () => {
    
    this.form.controls['chk2'].setValue(false);
    this.form.controls['chk1'].setValue(false);
    this.form.controls['chk'].setValue(false);

    const { case_id, case_title, case_yy, material_running, remark, run_id } = this.dataResponse?.Material
    this.form.controls['case_id'].setValue(case_id)
    this.form.controls['case_title'].setValue(case_title)
    this.form.controls['case_yy'].setValue(case_yy)
    this.form.controls['material_remark'].setValue(remark)
    this.form.controls['material_running'].setValue(material_running)

    const { dep_code, dep_name, useropen_id, useropen_name,create_user_id,create_dep_code,
      judge_id, judge_name, room_id, open_date, open_time,
      openfor_id, openfor_desc, court_id, to_court_name, doc_desc, p_flag,
      take_off, take_off_name, take_off_date, rcv_name,rcv_date, rcv_time, rcv_user_id, rcv_user_name, rcv_remark, return_date, return_time, userreturn_id, return_total, return_desc, userreturn_name,history_running,event_type,receipt_from,open_total,file_name,return_material_date,return_material_time,return_material_user_id,return_material_user_name,return_addition,return_material_item,return_material_desc } = this.dataResponse.History

    this.form.controls['dep_code'].setValue(dep_code)
    this.form.controls['create_user_id'].setValue(create_user_id)
    this.form.controls['create_dep_code'].setValue(create_dep_code)
    this.form.controls['dep_name'].setValue(dep_name)
    this.form.controls['useropen_id'].setValue(useropen_id)
    this.form.controls['useropen_name'].setValue(useropen_name)
    this.form.controls['judge_id'].setValue(judge_id == '0' ? '' : judge_id)
    this.form.controls['judge_name'].setValue(judge_name)
    this.form.controls['room_id'].setValue(room_id)
    this.form.controls['open_total'].setValue(open_total == 1 ? true : false)
    this.form.controls['open_date'].setValue(open_date || myExtObject.curDate())
    this.form.controls['open_time'].setValue(open_time || myExtObject.curHour()+':'+myExtObject.curMinutes()+':'+myExtObject.curSeconds())
    this.form.controls['openfor_id'].setValue(openfor_id == 0 ? '' : openfor_id)
    this.form.controls['openfor_desc'].setValue(openfor_desc)
    this.form.controls['court_id'].setValue(court_id)
    this.form.controls['to_court_name'].setValue(to_court_name)
    this.form.controls['doc_desc'].setValue(doc_desc)
    this.form.controls['receipt_from'].setValue(receipt_from)
    this.form.controls['p_flag'].setValue(p_flag)
    this.form.controls['remark'].setValue(this.dataResponse.History.remark)
    this.form.controls['take_off'].setValue(take_off == 1 ? true : false)
    this.form.controls['take_off_name'].setValue(take_off_name)
    this.form.controls['take_off_date'].setValue(take_off_date)
    this.form.controls['rcv_name'].setValue(rcv_name)
    this.form.controls['return_date'].setValue(return_date ? return_date : "")
    this.form.controls['return_time'].setValue(return_time ? return_time : "")
    this.form.controls['userreturn_id'].setValue(userreturn_id)
    this.form.controls['userreturn_name'].setValue(userreturn_name)
    this.form.controls['return_total'].setValue(return_total)
    this.form.controls['return_desc'].setValue(return_desc)
    this.form.controls['history_running'].setValue(history_running)
    this.form.controls['file_name'].setValue(file_name)
    this.form.controls['return_material_date'].setValue(return_material_date ? return_material_date : "")
    this.form.controls['return_material_time'].setValue(return_material_time ? return_material_time : "")
    this.form.controls['return_material_user_id'].setValue(return_material_user_id)
    this.form.controls['return_material_user_name'].setValue(return_material_user_name)
    this.form.controls['return_addition'].setValue(return_addition)
    this.form.controls['return_material_item'].setValue(return_material_item)
    this.form.controls['return_material_desc'].setValue(return_material_desc)
    //new
    this.form.controls['rcv_date'].setValue(rcv_date)
    this.form.controls['rcv_time'].setValue(rcv_time)
    this.form.controls['rcv_user_id'].setValue(rcv_user_id)
    this.form.controls['rcv_user_name'].setValue(rcv_user_name)
    this.form.controls['rcv_remark'].setValue(rcv_remark)
    //this.form.controls['event_type'].setValue(event_type)
  
    this._search$.pipe(
      switchMap(() => this._search()),
    ).subscribe(result => {
      this._dataTable.next(result.result);
    });
    this._search$.next();

  }

  onReset = () => {
    this.onCreateForm()
    let dataUser = this.getDataUser()
    this.form.controls['take_off_name'].setValue(dataUser?.offName)

    const { case_id, case_yy, case_title } = this.dataResponse.Material
    this.form.controls['case_id'].setValue(case_id)
    this.form.controls['case_title'].setValue(case_title)
    // this.form.controls['case_id'].setValue(case_id || "ก")
    // this.form.controls['case_title'].setValue(case_title || "ก")
    this.form.controls['case_yy'].setValue(case_yy || new Date().getFullYear()+543)
    this._search$.pipe(
      switchMap(() => this._search()),
    ).subscribe(result => {
      this._dataTable.next(result.result);
    });
    this._search$.next()
   
  }

  onSave = () => {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.run_id) {
      // เลือกเอกสารแยกเก็บก่อนบันทึกการเบิก/คืน
      const confirm$:ConfirmBoxInitializer = new ConfirmBoxInitializer()
      confirm$.setTitle('ข้อความแจ้งเตือน')
      confirm$.setButtonLabels('ตกลง');
      confirm$.setMessage('เลือกเอกสารแยกเก็บก่อนบันทึกการเบิก/คืน')
      confirm$.openConfirmBox$().subscribe()
      return
    }
    if(!this.form.controls['open_date'].value || !this.form.controls['open_time'].value){
      const confirm$2:ConfirmBoxInitializer = new ConfirmBoxInitializer()
      confirm$2.setTitle('ข้อความแจ้งเตือน')
      confirm$2.setButtonLabels('ตกลง');
      confirm$2.setMessage('กรุณาระบุวันที่เบิก(ส่งไป)เอกสาร/เวลาที่เบิก ให้ครบถ้วน');
      confirm$2.openConfirmBox$().subscribe()
      return
    }
    

    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    let ObjSave: any = {}
    //judge_id='' assign  0  because api not update
    if(!this.form.controls['judge_id'].value)
        this.form.controls['judge_id'].setValue(0)
    // if(this.form.controls['history_running'].value=="")
    // console.log(this.form.controls['rcv_date'].value);
    // if(this.form.controls['rcv_date'].value=="" || this.form.controls['rcv_date'].value==null)
    //   this.form.controls['return_material_desc'].setValue(this.form.controls['doc_desc'].value);
 
    Object.assign(ObjSave,this.form.getRawValue())
    Object.keys(ObjSave).forEach(value => {
      if(typeof(ObjSave[value]) == 'boolean') {
        ObjSave[value] = ObjSave[value] == false ? 0 : 1
      }
      if(ObjSave[value] == undefined) {
        ObjSave[value] = ""
      }
    })
    // console.log(ObjSave)
    if(this.form.controls['mbarcode'].value) {
      this._fdo0200.saveByMBarcode({...ObjSave, run_id: this.run_id}).subscribe((response: any) => {
        if(response?.result.includes('SUCCESS')) {
          confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
          confirmBox.openConfirmBox$().subscribe()
          //this.onLoadDataAfterSave()
          this.onEdit(ObjSave.event_type,response.history_running)
        }else {
          confirmBox.setMessage('พบข้อผิดพลาด');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          confirmBox.openConfirmBox$().subscribe()
        }
      })
    } else {
      this._fdo0200.saveOpen({...ObjSave, run_id: this.run_id}).subscribe((response: any) => {
        console.log(response)
        if(response?.result.includes('SUCCESS')) {
          confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
          confirmBox.openConfirmBox$().subscribe()
          //this.onLoadDataAfterSave()
          console.log("SUCCESS",ObjSave.event_type,response.history_running);
          this.onEdit(ObjSave.event_type,response.history_running)
        }else {
          confirmBox.setMessage('พบข้อผิดพลาด');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          confirmBox.openConfirmBox$().subscribe()
        }
      })
    }
  }

  onLoadDataAfterSave = () => {
    this._fdo0200.getSearch({
      case_title: this.form.controls['case_title'].value,
      case_id: this.form.controls['case_id'].value,
      case_yy: this.form.controls['case_yy'].value,
      srdo_type: Number(this.srdo_type.value ||0),
      run_id: this.run_id
    }).subscribe((response: any) => {
      console.log(response)
      this.dataResponse = response.result
      this.setValue();
      this._search$.next()
    })
  }

  onEdit = (item: TableDTOModel,running:any) => {
    let event_type:any;
    var params:any;
    if(typeof item =="object"){
      event_type = item.event_type?item.event_type:'';
      params = {
        srdo_type: Number(this.srdo_type.value ||0),
        run_id: item.run_id.toString(),
        history_running: item.history_running.toString(),
      }
    }else{
      event_type = item?item:'';
      params = {
        srdo_type: Number(this.srdo_type.value ||0),
        run_id: this.run_id.toString(),
        history_running: running.toString(),
      }
    }
    if(event_type)
      this.form.controls['event_type'].setValue(event_type.toString())
    else
      this.form.controls['event_type'].setValue(null)
    
    console.log(params)
    this._fdo0200.getSearch(params).subscribe((response: any) => {
      console.log(response)
      this.dataResponse = response.result
      this.setValue()

      //แสดงปุ่ม จะเปิดให้คลิกเมื่อผู้ใช้งานเป็นหน่วยงานที่ให้เบิกเอกสารเท่านั้น
      // 1 เบิก, 4 รายการรับคืน หน่วยงานบันทึกแก้ไขได้
      // 2 รายการรับไป, 3 รายการส่งคืน หน่วยงานบันทึกแก้ไขไม่ได้
      // 3 รายการส่งคืน->เอกสารส่งเพิ่มเติม หน่วยงานที่บันทึกแก้ไขไม่ได้ หน่วยงานอื่นแก้ได้หมด
      if(this.form.controls['create_dep_code'].value!=this.getDataUser().depCode){
        this.edit_flag=true;
      }else{
        this.edit_flag=false;
      }

      //หมายเหตุรับเอกสารไป
      if(this.form.controls['create_dep_code'].value==this.getDataUser().depCode || this.form.controls['create_dep_code'].value==undefined){
        this.edit_rcv_flag=true;
      }else {
       if((this.form.controls['return_material_date'].value!='' && this.form.controls['return_material_time'].value!='')||(this.form.controls['return_date'].value!='' && this.form.controls['return_time'].value!='')){
         // ถ้ายังไม่มีวันที่ และเวลาส่งคืนให้เปิด key in ได้ แต่ถ้ามีวันที่และเวลาส่งคืนแล้ว ช่องนี้ปิดห้ามแก้ไข
         this.edit_rcv_flag=true;
       }else{
         this.edit_rcv_flag=false; 
       }
     }

      //เอกสารส่งเพิ่มเติม  หน่วยงานบันทึกแก้ไขไม่ได้
      if(this.form.controls['create_dep_code'].value==this.getDataUser().depCode || this.form.controls['create_dep_code'].value==undefined){
         this.edit_return_flag=true;
      }else {
        if(/*(this.form.controls['return_material_date'].value!='' && this.form.controls['return_material_time'].value!='')||*/(this.form.controls['return_date'].value!='' && this.form.controls['return_time'].value!='')){
          // ถ้ายังไม่มีวันที่ และเวลาส่งคืนให้เปิด key in ได้ แต่ถ้ามีวันที่และเวลาส่งคืนแล้ว ช่องนี้ปิดห้ามแก้ไข
          this.edit_return_flag=true;
        }else{
          this.edit_return_flag=false; 
        }
      }

      //flag วันที่รับไป วันที่ส่งคืน
      // ถ้ายังมีวันที่วันที่รับคืน  ช่องนี้ปิดห้ามแก้ไข
      if(this.form.controls['create_dep_code'].value==this.getDataUser().depCode || this.form.controls['create_dep_code'].value==undefined){
        this.edit_chk_flag=true;
      }else {
       if((this.form.controls['return_date'].value!='' && this.form.controls['return_time'].value!='')){
         this.edit_chk_flag=true;
       }else{
         this.edit_chk_flag=false; 
       }
     }
    })
  }

  directiveDate = (event: any) => {
    const { value, name } = event.target
    this.form.controls[name].setValue(value)
  }

  rerender = (): void => {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
      });
    });
    this.dtTrigger.next(null);
  }

  onOpenMomodal(type:any){
    const { material_running } = this.dataResponse.Material
    if(type==1){
      const modalRef = this.ngbModal.open(DatalistReturnModelComponent)
      modalRef.componentInstance.value1 = "pofficer"
      modalRef.componentInstance.value2 = "off_id"
      modalRef.componentInstance.value3 = "off_name"
      modalRef.result.then((item: any) => {
        if(item){
          this.form.controls['return_material_user_id'].setValue(item.fieldIdValue)
          this.form.controls['return_material_user_name'].setValue(item.fieldNameValue)
        }
      }).catch((error: any) => {
        console.log(error)
      })
    }else if(type==2 || type==3 ){
          
    const modalRef = this.ngbModal.open(ModalMaterialComponent,{ windowClass: 'my-class'})
    modalRef.componentInstance.run_id = this.run_id;
    modalRef.result.then((item: any) => {
      if(item){
        console.log(item)
        //this.form.controls['return_material_item'].setValue(item.fieldIdValue)
        if(type==2)
          this.form.controls['return_material_desc'].setValue(item.fieldNameValue)
        else
          this.form.controls['return_desc'].setValue(item.fieldNameValue)
      }
    }).catch((error: any) => {
      console.log(error)
    })
          /* this._fdo0200.getTabSearch({
            table_name : "pmaterial_detail",
            field_id : "material_item",
            field_name : "doc_desc",
            field_name2 : "doc_no",
            condition : " AND material_running='"+material_running+"'",
          }).subscribe((response: any) => {
              const modalRef = this.ngbModal.open(DatalistReturnMultipleComponent,{ windowClass: 'my-class'})
              modalRef.componentInstance.item = response;
              modalRef.componentInstance.value1 = "pmaterial_detail"
              modalRef.componentInstance.value2 = "material_item"
              modalRef.componentInstance.value3 = "doc_desc"
              modalRef.componentInstance.value6 = "doc_no"
              modalRef.componentInstance.value7 = " AND material_running='"+material_running+"'"
              modalRef.result.then((item: any) => {
                if(item){
                  this.form.controls['return_material_item'].setValue(item.fieldIdValue)
                  this.form.controls['return_material_desc'].setValue(item.fieldNameValue2)
                }
              }).catch((error: any) => {
                console.log(error)
              })
          }) */
    }
  }

  onDelMaterial = (item: any) => {
    const modalRef: NgbModalRef = this.ngbModal.open(ModalConfirmComponent)
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
          if (resp.success==true){
            this._fdo0200.delete({
              material_running: item.material_running,
              history_running: item.history_running,
            }).subscribe((response: any) => {
              // console.log(`delete success ::: `, response)
              this.onLoadDataAfterSave()
            })
          }
        })
      }
    })
  }

  assignRcvDate(checked:any){
    if(checked==true){
      let dataUser = this.getDataUser()
      this.form.controls['rcv_date'].setValue(myExtObject.curDate())
      this.form.controls['rcv_time'].setValue(this.newCurretTime())
      this.form.controls['rcv_user_id'].setValue(dataUser?.userCode)
      this.form.controls['rcv_user_name'].setValue(dataUser?.offName)
      this.form.controls['return_material_desc'].setValue(this.form.controls['doc_desc'].value);

    }else{
      this.form.controls['rcv_date'].setValue("")
      this.form.controls['rcv_time'].setValue("")
      this.form.controls['rcv_user_id'].setValue("")
      this.form.controls['rcv_user_name'].setValue("")
      this.form.controls['return_material_desc'].setValue("");
      if(!this.edit_chk_flag)
        this.edit_rcv_flag=false; 
      
    }
  }

  assignDate(checked:any){
    if(checked==true){
      let dataUser = this.getDataUser()
      this.form.controls['return_material_date'].setValue(myExtObject.curDate())
      this.form.controls['return_material_time'].setValue(this.newCurretTime())
      this.form.controls['return_material_user_id'].setValue(dataUser?.userCode)
      this.form.controls['return_material_user_name'].setValue(dataUser?.offName)
    }else{
      this.form.controls['return_material_date'].setValue("")
      this.form.controls['return_material_time'].setValue("")
      this.form.controls['return_material_user_id'].setValue("")
      this.form.controls['return_material_user_name'].setValue("")
    }
  }

  tabChangeInput(name:any,event:any){
    if(name=='dep_code'){
      this._fdo0200.getTabSearch({
        table_name : "pdepartment",
        field_id : "dep_code",
        field_name : "dep_name",
        condition : " AND dep_code='"+event.target.value+"'",
      }).subscribe((response: any) => {
          if(response.length){
            this.form.controls['dep_name'].setValue(response[0].fieldNameValue || "")
          }else{
            this.form.controls['dep_code'].setValue("")
            this.form.controls['dep_name'].setValue("")
          }
      })
    }else if(name=='useropen_id'){
      this._fdo0200.getTabSearch({
        table_name : "pofficer",
        field_id : "off_id",
        field_name : "off_name",
        condition : " AND off_id='"+event.target.value+"'",
      }).subscribe((response: any) => {
          if(response.length){
            this.form.controls['useropen_name'].setValue(response[0].fieldNameValue || "")
          }else{
            this.form.controls['useropen_id'].setValue("")
            this.form.controls['useropen_name'].setValue("")
          }
      })
    }else if(name=='judge_id'){
      this._fdo0200.getTabSearch({
        table_name : "pjudge",
        field_id : "judge_id",
        field_name : "judge_name",
        condition : " AND judge_id='"+event.target.value+"'",
      }).subscribe((response: any) => {
          if(response.length){
            this.form.controls['judge_name'].setValue(response[0].fieldNameValue || "")
          }else{
            this.form.controls['judge_id'].setValue("")
            this.form.controls['judge_name'].setValue("")
          }
      })
    }else if(name=='openfor_id'){
      this._fdo0200.getTabSearch({
        table_name : "popen_reason",
        field_id : "openfor_id",
        field_name : "openfor_desc",
        condition : " AND openfor_id='"+event.target.value+"'",
      }).subscribe((response: any) => {
          if(response.length){
            this.form.controls['openfor_desc'].setValue(response[0].fieldNameValue || "")
          }else{
            this.form.controls['openfor_id'].setValue("")
            this.form.controls['openfor_desc'].setValue("")
          }
      })
    }else if(name=='lit_item'){
      if(this.form.controls['lit_type'].value && this.run_id){
        this._fdo0200.getTabSearch({
          table_name : "pcase_litigant",
          field_id : "seq",
          field_name : "CONCAT(NVL(title,''),name) AS fieldNameValue",
          condition : " AND seq='"+event.target.value+"' AND lit_type='"+this.form.controls['lit_type'].value+"' AND run_id='"+this.run_id+"'",
        }).subscribe((response: any) => {
            if(response.length){
              this.form.controls['retuser_name'].setValue(response[0].fieldNameValue || "")
            }else{
              this.form.controls['lit_item'].setValue("")
              this.form.controls['retuser_name'].setValue("")
            }
        })
      }
    }else if(name=='return_material_user_id'){
      if(this.form.controls['return_material_user_id'].value){
        this._fdo0200.getTabSearch({
          table_name : "pofficer",
          field_id : "off_id",
          field_name : "off_name",
          condition : " AND off_id='"+event.target.value+"'",
        }).subscribe((response: any) => {
            if(response.length){
              this.form.controls['return_material_user_name'].setValue(response[0].fieldNameValue || "")
            }else{
              this.form.controls['return_material_user_id'].setValue("")
              this.form.controls['return_material_user_name'].setValue("")
            }
        })
      }
    }
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<any> {
    const { searchTerm } = this._state;
    let result = this.dataResponse.Table

    // result.filter(item => item)
    return of({result});
  }

  get dataLisType(): Observable<DataModel[]> {
    return this._litType.asObservable()
  }

  get dataCardType(): Observable<DataModel[]> {
    return this._cardType.asObservable()
  }

  get dataCase(): Observable<DataModel[]> {
    return this._case.asObservable()
  }

  get dataTable$() {
    return this._dataTable.asObservable()
  }
}
