export class SearchModel {
  case_title?: string
  case_id?: number
  case_yy?: number
  srdo_type?: number
  barcode?: string
  history_running?: string
  run_id?: string
}

export class tabSearchModel {
  table_name? : string
  field_id? : string
  field_name? : string
  field_name2? : string
  field_name3? : string
  condition? : string
}

export class dataListModel {
  table_name? : string
  field_id? : string
  field_name? : string
  field_name2? : string
  field_name3? : string
  condition? : string
  search_id?:string
  search_desc:string
}

export class printWordModel {
  form_type? : number
  form_id? : string
  run_id? : number
  material_running? : number
  history_running? : number
}

export class delWordModel {
  file_name : string
}
