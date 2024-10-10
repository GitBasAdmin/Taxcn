import { StringIterator } from "lodash"

export class SearchDTOModel {
  History: HistoryDTOModel
  Material: MaterialDTOModel
  Table: Array<TableDTOModel>
}

export class HistoryDTOModel {
  backrcv_id: string
  backrcv_name: string
  card_edate: string
  card_sdate: string
  card_type: string
  court_id: string
  create_date: string
  create_dep_code: number
  create_user: string
  create_user_id: string
  dep_code: number
  dep_name: string
  doc_desc: string
  receipt_from: string
  doc_no: string
  event_type:number
  history_running: number
  id_card: string
  issued_by: string
  item: string
  judge_id: string
  judge_name: string
  lit_item: string
  lit_type: number
  material_running: number
  open_date: string
  open_time: string
  open_total: number
  openfor_desc: string
  openfor_id: number
  p_flag: string
  file_name : string
  protest_name: string
  rcv_name: string
  remark: string
  ret_card_id: string
  ret_card_type: number
  return_card_edate: string
  return_card_sdate: string
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
  scourt_name: string
  take_off: number
  take_off_date: string
  take_off_mess: string
  take_off_name: string
  to_court_id: string
  to_court_name: string
  return_material_date: string
  return_material_time: string
  return_material_user_id: number
  return_material_user_name: string
  return_material_item: number
  return_material_desc: string
  update_date: string
  update_dep_code: number
  update_user: string
  update_user_id: string
  useropen_id: string
  useropen_name: string
  userreturn_id: string
  userreturn_name: string
  rcv_date: string
  rcv_time: string
  rcv_user_id: number
  rcv_user_name: string
  rcv_remark: string
  return_addition: string
}

export class MaterialDTOModel {
  case_id: number
  case_title: string
  case_yy: number
  material_running: number
  remark: string
  run_id: number
  backrcv_id:string
  backrcv_name:string
  card_edate:string
  card_sdate:string
  card_type:string
  case_no:string
  create_date:string
  create_dep_code:number
  create_dep_name:string
  create_user:string
  create_user_id:string
  dep_code:number
  dep_name:string
  doc_desc:string
  doc_no:string
  event_type:number
  event_type_name:string
  id_card:string
  issued_by:string
  item:string
  judge_id:string
  lit_item:string
  lit_type:number
  off_name:string
  open_date:string
  open_time:string
  open_total:number
  openfor_desc:string
  openfor_id:number
  p_flag:string
  file_name :string
  protest_name:string
  rcv_name:string
  ret_card_id:string
  ret_card_type:number
  return_card_edate:string
  return_card_sdate:string
  return_date:string
  return_desc:string
  return_flag:string
  return_name:string
  return_time:string
  return_total:number
  retuser_name:string
  room_id:string
  scourt_flag:string
  scourt_id:string
  take_off:number
  take_off_date:string
  take_off_mess:string
  take_off_name:string
  to_court_id:string
  return_material_date:string
  return_material_time:string
  return_material_user_id:number
  return_material_user_name:string
  return_material_item:number
  return_material_desc:string
  update_date:string
  update_dep_code:number
  update_dep_name:string
  update_user:string
  update_user_id:string
  useropen_id:string
  userreturn_id:string
  userreturn_name:string
  rcv_date: string
  rcv_time: string
  rcv_user_id: number
  rcv_user_name: string
  rcv_remark: string
  return_addition: string
}

export class TableDTOModel {
  backrcv_id: string
  backrcv_name: string
  card_edate: string
  card_sdate: string
  card_type: string
  case_no: string
  create_date: string
  create_dep_code: number
  create_dep_name: string
  create_user: string
  create_user_id: string
  dep_code: number
  dep_name: string
  doc_desc: string
  doc_no: string
  event_type: number
  event_type_name: string
  history_running: number
  id_card: string
  issued_by: string
  item: string
  judge_id: string
  lit_item: string
  lit_type: number
  material_running: number
  off_name: string
  open_date: string
  open_time: string
  open_total: number
  openfor_desc: string
  openfor_id: number
  p_flag: string
  file_name : string
  protest_name: string
  rcv_name: string
  remark: string
  ret_card_id: string
  ret_card_type: number
  return_card_edate: string
  return_card_sdate: string
  return_date: string
  return_desc: string
  return_flag: string
  return_name: string
  return_time: string
  return_total: number
  retuser_name: string
  room_id: string
  run_id: number
  scourt_flag: string
  scourt_id: string
  take_off: number
  take_off_date: string
  take_off_mess: string
  take_off_name: string
  to_court_id: string
  return_material_date: string
  return_material_time: string
  return_material_user_id: number
  return_material_user_name: string
  return_material_item: number
  return_material_desc: string
  update_date: string
  update_dep_code: number
  update_dep_name: string
  update_user: string
  update_user_id: string
  useropen_id: string
  userreturn_id: string
  userreturn_name: string
  rcv_date: string
  rcv_time: string
  rcv_user_id: number
  rcv_user_name: string
  rcv_remark: string
  return_addition: string
}

