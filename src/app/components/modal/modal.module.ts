import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { ModalRoutingModule } from '@app/components/modal/modal-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { ModalConfirmFfnComponent } from '@app/components/modal/modal-confirm-ffn/modal-confirm-ffn.component';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component';
import { ModalJudgeMultipleComponent } from '@app/components/modal/modal-judge-multiple/modal-judge-multiple.component';
import { ModalJudgeGroupSigleComponent } from '@app/components/modal/modal-judge-group-sigle/modal-judge-group-sigle.component';
import { ModalJudgeAssociateComponent } from '@app/components/modal/modal-judge-associate/modal-judge-associate.component';
import { ModalOrganizationComponent } from '@app/components/modal/modal-organization/modal-organization.component';
import { ModalAppointmentComponent } from '@app/components/modal/modal-appointment/modal-appointment.component';
import { ModalAppointmentJudgeComponent } from '@app/components/modal/modal-appointment-judge/modal-appointment-judge.component';
import { ModalJudgeGroupComponent } from '@app/components/modal/modal-judge-group/modal-judge-group.component';
import { ModalReceiptComponent } from '@app/components/modal/modal-receipt/modal-receipt.component';
import { PopupReceiptComponent } from '@app/components/modal/popup-receipt/popup-receipt.component';
import { PopupRoomComponent } from '@app/components/modal/popup-room/popup-room.component';
import { PopupCourtRemarkComponent } from '@app/components/modal/popup-court-remark/popup-court-remark.component';
import { ModalEnvelopeComponent } from '@app/components/modal/modal-envelope/modal-envelope.component';
import { ModalEnvelopeReadComponent } from '@app/components/modal/modal-envelope-read/modal-envelope-read.component';
import { ModalWitnessComponent } from '@app/components/modal/modal-witness/modal-witness.component';
import { ModalGuarantorFfnComponent } from '@app/components/modal/modal-guarantor-ffn/modal-guarantor-ffn.component';
import { PopupListTableComponent } from '@app/components/modal/popup-list-table/popup-list-table.component';
import { PopupListFieldsComponent } from '@app/components/modal/popup-list-fields/popup-list-fields.component';
import { CaseCopyComponent } from '@app/components/modal/case-copy/case-copy.component';
import { CaseCopyAlleComponent } from '@app/components/modal/case-copy-alle/case-copy-alle.component';
import { AddressCopyComponent } from '@app/components/modal/address-copy/address-copy.component';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { DatalistReturnOrgComponent } from '@app/components/modal/datalist-return-org/datalist-return-org.component';
import { DatalistConciliateComponent } from '@app/components/modal/datalist-conciliate/datalist-conciliate.component';
import { ModalCaseLitigant } from '@app/components/modal/modal-case-litigant/modal-case-litigant.component';
import { ModalLitigantComponent } from '@app/components/modal/modal-litigant/modal-litigant.component';
import { ModalReturnReceiptComponent } from '@app/components/modal/modal-return-receipt/modal-return-receipt.component';
import { DatalistReturnMultipleComponent } from '@app/components/modal/datalist-return-multiple/datalist-return-multiple.component';
import { DatalistReturnMultipleDepComponent } from '@app/components/modal/datalist-return-multiple-dep/datalist-return-multiple-dep.component';
import { DatalistReqLawyerComponent } from '@app/components/modal/datalist-req-lawyer/datalist-req-lawyer.component';
import { DatalistLawyerComponent } from '@app/components/modal/datalist-lawyer/datalist-lawyer.component';
import { AlertSearchComponent } from '@app/components/modal/alert-search/alert-search.component';
import { ModalAppointmentNextComponent } from '@app/components/modal/modal-appointment-next/modal-appointment-next.component';
import { ModalAppResultComponent } from '@app/components/modal/modal-appoint-result/modal-appoint-result.component';
import { PopupPrintChequetComponent } from '@app/components/modal/popup-print-cheque/popup-print-cheque.component';
import { PopupCourtBankComponent } from '@app/components/modal/popup-court-bank/popup-court-bank.component';
import { PopupListAppealComponent } from '@app/components/modal/popup-list-appeal/popup-list-appeal.component';
import { PopupStatComponent } from '@app/components/modal/popup-stat/popup-stat.component';
import { DatalistReturnCatchComponent } from '@app/components/modal/datalist-return-catch/datalist-return-catch.component';
import { CaseCopyGuarComponent } from '@app/components/modal/case-copy-guar/case-copy-guar.component';
import { ModalGuarAppealComponent } from '@app/components/modal/modal-guar-appeal/modal-guar-appeal.component';
import { PopupGuardefComponent } from '@app/components/modal/popup-guardef/popup-guardef.component';
import { PopupMapReceiptComponent } from '@app/components/modal/popup-map-receipt/popup-map-receipt.component';
import { ModalJudgePatyComponent } from '@app/components/modal/modal-judge-party/modal-judge-party.component';
import { ModalAttachFileComponent } from '@app/components/modal/modal-attach-file/modal-attach-file.component';
import { ModalReadTextComponent } from '@app/components/modal/modal-read-text/modal-read-text.component';
import { AssignAllComponent } from '@app/components/modal/assign-all/assign-all.component';
import { SendDocComponent } from '@app/components/modal/send-doc/send-doc.component';
import { ModalIndictBandComponent } from '@app/components/modal/modal-indict-band/modal-indict-band.component';
import { ModalReturnAlleComponent } from '@app/components/modal/modal-return-alle/modal-return-alle.component';
import { ModalNoticeReceiptComponent } from '@app/components/modal/modal-notice-receipt/modal-notice-receipt.component';
import { ModalNoticeLitigantComponent } from '@app/components/modal/modal-notice-litigant/modal-notice-litigant.component';
import { ModalNoticeComponent } from '@app/components/modal/modal-notice/modal-notice.component';
import { ModalAttachWitnessComponent } from '@app/components/modal/modal-attach-witness/modal-attach-witness.component';
import { AddCaseComponent } from '@app/components/modal/add-case/add-case.component';
import { PopupDocAppointmentComponent } from '@app/components/modal/popup-doc-appointment/popup-doc-appointment.component';
import { PopupListDocumentComponent } from '@app/components/modal/popup-list-document/popup-list-document.component';
import { PrintSendNoticeComponent } from '@app/components/modal/print-send-notice/print-send-notice.component';
import { PopupAttachJudgeComponent } from '@app/components/modal/popup-attach-judge/popup-attach-judge.component';
import { SwitchSendNoticeComponent } from '@app/components/modal/switch-send-notice/switch-send-notice.component';
import { PopupCaseAppointmentComponent } from '@app/components/modal/popup-case-appointment/popup-case-appointment.component';
import { PopupSendDocComponent } from '@app/components/modal/popup-send-document/popup-send-document.component';
import { PopupListReturnMappingComponent } from '@app/components/modal/popup-list-return-mapping/popup-list-return-mapping.component';
import { DatalistReturnMultipleSubtypeComponent } from '@app/components/modal/datalist-return-multiple-subtype/datalist-return-multiple-subtype.component';
import { DatalistReturnSeekComponent } from '@app/components/modal/datalist-return-seek/datalist-return-seek.component';
import { PopupDittoComponent } from '@app/components/modal/popup-ditto/popup-ditto.component';
import { DatalistLastNoticeComponent } from '@app/components/modal/datalist-last-notice/datalist-last-notice.component';

@NgModule({
  declarations: [
    ModalConfirmComponent,
    ModalConfirmFfnComponent,
    ModalJudgeComponent,
    ModalJudgeMultipleComponent,
    ModalJudgeGroupSigleComponent,
    ModalJudgeAssociateComponent,
    ModalOrganizationComponent,
    ModalAppointmentComponent,
    ModalAppointmentJudgeComponent,
    ModalJudgeGroupComponent,
    ModalReceiptComponent,
    PopupReceiptComponent,
    PopupRoomComponent,
    PopupCourtRemarkComponent,
    ModalEnvelopeComponent,
    ModalEnvelopeReadComponent,
    ModalWitnessComponent,
    ModalGuarantorFfnComponent,
    PopupListTableComponent,
    PopupListFieldsComponent,
    CaseCopyComponent,
    CaseCopyAlleComponent,
    AddressCopyComponent,
    DatalistReturnComponent,
    DatalistReturnOrgComponent,
    DatalistConciliateComponent,
    ModalCaseLitigant,
    ModalLitigantComponent,
    ModalReturnReceiptComponent,
    DatalistReturnMultipleComponent,
    DatalistReturnMultipleDepComponent,
    DatalistReqLawyerComponent,
    DatalistLawyerComponent,
    AlertSearchComponent,
    ModalAppointmentNextComponent,
    ModalAppResultComponent,
    PopupPrintChequetComponent,
    PopupCourtBankComponent,
    PopupListAppealComponent,
    PopupStatComponent,
    DatalistReturnCatchComponent,
    CaseCopyGuarComponent,
    ModalGuarAppealComponent,
    PopupGuardefComponent,
    PopupMapReceiptComponent,
    ModalJudgePatyComponent,
    ModalAttachFileComponent,
    ModalReadTextComponent,
    AssignAllComponent,
    SendDocComponent,
    ModalIndictBandComponent,
    ModalReturnAlleComponent,
    ModalNoticeReceiptComponent,
    ModalNoticeLitigantComponent,
    ModalNoticeComponent,
    ModalAttachWitnessComponent,
    AddCaseComponent,
    PopupDocAppointmentComponent,
    PopupListDocumentComponent,
    PrintSendNoticeComponent,
    PopupAttachJudgeComponent,
    SwitchSendNoticeComponent,
    PopupCaseAppointmentComponent,
    PopupSendDocComponent,
    PopupListReturnMappingComponent,
    DatalistReturnMultipleSubtypeComponent,
    DatalistReturnSeekComponent,
    PopupDittoComponent,
    DatalistLastNoticeComponent
  ],
  imports: [
    CommonModule,
    ModalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatAutocompleteModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [ModalConfirmComponent,
    ModalConfirmFfnComponent,
    ModalJudgeComponent,
    ModalJudgeMultipleComponent,
    ModalJudgeGroupSigleComponent,
    ModalJudgeAssociateComponent,
    ModalOrganizationComponent,
    ModalAppointmentComponent,
    ModalAppointmentJudgeComponent,
    ModalJudgeGroupComponent,
    ModalReceiptComponent,
    PopupReceiptComponent,
    PopupRoomComponent,
    PopupCourtRemarkComponent,
    ModalEnvelopeComponent,
    ModalEnvelopeReadComponent,
    ModalWitnessComponent,
    ModalGuarantorFfnComponent,
    PopupListTableComponent,
    PopupListFieldsComponent,
    CaseCopyComponent,
    CaseCopyAlleComponent,
    AddressCopyComponent,
    DatalistReturnComponent,
    DatalistReturnOrgComponent,
    DatalistConciliateComponent,
    ModalCaseLitigant,
    ModalLitigantComponent,
    ModalReturnReceiptComponent,
    DatalistReturnMultipleComponent,
    DatalistReturnMultipleDepComponent,
    DatalistReqLawyerComponent,
    DatalistLawyerComponent,
    AlertSearchComponent,
    ModalAppointmentNextComponent,
    ModalAppResultComponent,
    PopupPrintChequetComponent,
    PopupCourtBankComponent,
    PopupListAppealComponent,
    PopupStatComponent,
    DatalistReturnCatchComponent,
    CaseCopyGuarComponent,
    ModalGuarAppealComponent,
    PopupGuardefComponent,
    PopupMapReceiptComponent,
    ModalJudgePatyComponent,
    ModalAttachFileComponent,
    ModalReadTextComponent,
    AssignAllComponent,
    SendDocComponent,
    ModalIndictBandComponent,
    ModalReturnAlleComponent,
    ModalNoticeReceiptComponent,
    ModalNoticeLitigantComponent,
    ModalNoticeComponent,
    ModalAttachWitnessComponent,
    AddCaseComponent,
    PopupDocAppointmentComponent,
    PopupListDocumentComponent,
    PrintSendNoticeComponent,
    PopupAttachJudgeComponent,
    SwitchSendNoticeComponent,
    PopupCaseAppointmentComponent,
    PopupSendDocComponent,
    PopupListReturnMappingComponent,
    DatalistReturnMultipleSubtypeComponent,
    DatalistReturnSeekComponent,
    PopupDittoComponent,
    DatalistLastNoticeComponent,
    MatAutocompleteModule] // ถ้าคุณต้องการใช้งานคอมโพเนนต์นี้ในโมดูลอื่น ๆ
})
export class ModalModule { }