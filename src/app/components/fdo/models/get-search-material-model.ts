export class GetSearchMaterialModel {
  case_title?: string
  case_id?: number
  case_yy?: number
  material_running?: number
  material_item?: number
  run_id?: number
}

export class SearchMaterialModel{
  meterial_detail: MaterilDetailModel
  meterial: MeterialModel
  table: Array<MeterialTableModel>
}

export class MeterialTableModel {
  item: number
  keep_date: string
  doc_no: string
  case_title: string
  keep_in:string
  create_dep_name: string
  page_no: string
  material_running: number
  edit_material_item: number
  update_date: string
  due_return: string
  wad_no: string
  update_user: string
  update_dep_name: string
  material_item: number
  case_id: number
  doc_desc: string
  receipt_from : string
  create_user: string
  create_date: string
  case_yy: number
  lit_type_desc: string


  //tab2
  backrcv_name: string
  card_edate: string
  card_sdate: string
  card_type: string
  case_no: string
  court_running: number
  create_dep_code: number
  create_user_id: string
  dep_code: number
  dep_name: string
  event_type: number
  event_type_display: string
  history_running: number
  id_card: string
  issued_by: string
  judge_id: string
  judge_name: string
  lit_item: string
  lit_type: number
  off_name: string
  open_date: string
  open_date_num: string
  open_time: string
  open_total: string
  openfor_desc: string
  openfor_id: number
  p_flag: string
  protest_name: string
  rcv_name: string
  remark: string
  ret_card_id: string
  ret_card_type: number
  return_card_edate: string
  return_card_sdate: string
  return_material_date: string
  return_material_time: string
  return_material_user_name: string
  return_material_desc: string
  return_date: string
  return_desc: string
  return_flag: string
  return_name: string
  return_time: string
  return_total: number
  retuser_name: string
  room_id: string
  scourt_flag: string
  scourt_id: string
  take_off: number
  take_off_date: string
  take_off_mess: string
  take_off_name: string
  to_court_id: string
  update_dep_code: number
  update_user_id: string
  useropen_id: string
  userreturn_id: string
  userreturn_name: string
}

export class MeterialModel {
  req_user_name: string
  req_dep_name: string
  case_title: string
  remark: string
  material_running: number
  case_id: number
  create_user: string
  create_date: string
  create_dep_code2: number
  case_yy: number
  req_user_id: string
  burn_date: string
  return_date: string
  create_dep_code: number
  run_id: number
}

export class MaterilDetailModel {
  due_return: string
  wad_no: string
  lit_type: number
  item: number
  keep_date: string
  doc_no: string
  keep_in: string
  doc_desc: string
  remark: string
  page_no: string
  material_item:number
  receipt_from:string
}
