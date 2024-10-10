export class GetDataModel {
  table_name: string
  field_id: string
  field_name: string
  condition?: string
  order_by?: string
  userToken?: string
}

export class DataModel {
  fieldIdValue: number | string
  fieldNameValue: string
  case_title?: string
  case_title_2?: string
  order_field?: string
}
