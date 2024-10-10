import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FctRoutingModule } from '@app/components/fct/fct-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 
import { MatTooltipModule } from '@angular/material/tooltip';

import { Fct0218Component } from './fct0218/fct0218.component';
import { Fct9993Component } from './fct9993/fct9993.component';
import { Fct9994Component } from './fct9994/fct9994.component';
import { Fct0226Component } from './fct0226/fct0226.component';
import { Fct0227Component } from './fct0227/fct0227.component';
import { Fct9908Component } from './fct9908/fct9908.component';
import { Fct9905Component } from './fct9905/fct9905.component';
import { Fct9906Component } from './fct9906/fct9906.component';
import { Fct9996Component } from './fct9996/fct9996.component';
import { Fct9992Component } from './fct9992/fct9992.component';
import { Fct0242Component } from './fct0242/fct0242.component';
import { Fct0232Component } from './fct0232/fct0232.component';
import { Fct0412Component } from './fct0412/fct0412.component';
import { Fct0418Component } from './fct0418/fct0418.component';
import { Fct0220Component } from './fct0220/fct0220.component';
import { Fct0416Component } from './fct0416/fct0416.component';
import { Fct0230Component } from './fct0230/fct0230.component';
import { Fct0231Component } from './fct0231/fct0231.component';
import { Fct0246Component } from './fct0246/fct0246.component';
import { Fct0202Component } from './fct0202/fct0202.component';
import { Fct0203Component } from './fct0203/fct0203.component';
import { Fct0305Component } from './fct0305/fct0305.component';
import { Fct0301Component } from './fct0301/fct0301.component';
import { Fct0302Component } from './fct0302/fct0302.component';
import { Fct0313Component } from './fct0313/fct0313.component';
import { Fct0314Component } from './fct0314/fct0314.component';
import { Fct0317Component } from './fct0317/fct0317.component';
import { Fct0801Component } from './fct0801/fct0801.component';
import { Fct0805Component } from './fct0805/fct0805.component';
import { Fct0811Component } from './fct0811/fct0811.component';
import { Fct0812Component } from './fct0812/fct0812.component';
import { Fct0110Component } from './fct0110/fct0110.component';
import { Fct0208Component } from './fct0208/fct0208.component';
import { Fct0209Component } from './fct0209/fct0209.component';
import { Fct0318Component } from './fct0318/fct0318.component';
import { Fct0404Component } from './fct0404/fct0404.component';
import { Fct0405Component } from './fct0405/fct0405.component';
import { Fct0421Component } from './fct0421/fct0421.component';
import { Fct0425Component } from './fct0425/fct0425.component';
import { Fct0430Component } from './fct0430/fct0430.component';
import { Fct0434Component } from './fct0434/fct0434.component';
import { Fct0435Component } from './fct0435/fct0435.component';
import { Fct0437Component } from './fct0437/fct0437.component';
import { Fct0444Component } from './fct0444/fct0444.component';
import { Fct0445Component } from './fct0445/fct0445.component';
import { Fct0508Component } from './fct0508/fct0508.component';
import { Fct0509Component } from './fct0509/fct0509.component';
import { Fct0601Component } from './fct0601/fct0601.component';
import { Fct0707Component } from './fct0707/fct0707.component';
import { Fct0225Component } from './fct0225/fct0225.component';
import { Fct0223Component } from './fct0223/fct0223.component';
import { Fct0210Component } from './fct0210/fct0210.component';
import { Fct0229Component } from './fct0229/fct0229.component';
import { Fct0502Component } from './fct0502/fct0502.component';
import { Fct0503Component } from './fct0503/fct0503.component';
import { Fct0108Component } from './fct0108/fct0108.component';
import { Fct0204Component } from './fct0204/fct0204.component';
import { Fct0510Component } from './fct0510/fct0510.component';
import { Fct0511Component } from './fct0511/fct0511.component';
import { Fct0504Component } from './fct0504/fct0504.component';
import { Fct0710Component } from './fct0710/fct0710.component';
import { Fct0711Component } from './fct0711/fct0711.component';
import { Fct0411Component } from './fct0411/fct0411.component';
import { Fct9903Component } from './fct9903/fct9903.component';
import { Fct9907Component } from './fct9907/fct9907.component';
import { Fct9909Component } from './fct9909/fct9909.component';
import { Fct0219Component } from './fct0219/fct0219.component';
import { Fct6800Component } from './fct6800/fct6800.component';
import { Fct0701Component } from './fct0701/fct0701.component';
import { Fct4102Component } from './fct4102/fct4102.component';
import { Fct0709Component } from './fct0709/fct0709.component';
import { Fct0228Component } from './fct0228/fct0228.component';
import { Fct0201Component } from './fct0201/fct0201.component';
import { Fct0211Component } from './fct0211/fct0211.component';
import { Fct0212Component } from './fct0212/fct0212.component';
import { Fct0213Component } from './fct0213/fct0213.component';
import { Fct0240Component } from './fct0240/fct0240.component';
import { Fct0410Component } from './fct0410/fct0410.component';
import { Fct0501Component } from './fct0501/fct0501.component';
import { Fct0205Component } from './fct0205/fct0205.component';
import { Fct0206Component } from './fct0206/fct0206.component';
import { Fct0207Component } from './fct0207/fct0207.component';
import { Fct0234Component } from './fct0234/fct0234.component';
import { Fct0235Component } from './fct0235/fct0235.component';
import { Fct0237Component } from './fct0237/fct0237.component';
import { Fct0320Component } from './fct0320/fct0320.component';
import { Fct0450Component } from './fct0450/fct0450.component';
import { Fct0803Component } from './fct0803/fct0803.component';
import { Fct0804Component } from './fct0804/fct0804.component';
import { Fct0813Component } from './fct0813/fct0813.component';
import { Fct0109Component } from './fct0109/fct0109.component';
import { Fct0406Component } from './fct0406/fct0406.component';
import { Fct0407Component } from './fct0407/fct0407.component';
import { Fct0443Component } from './fct0443/fct0443.component';
import { Fct0417Component } from './fct0417/fct0417.component';
import { Fct0401Component } from './fct0401/fct0401.component';
import { Fct0101Component } from './fct0101/fct0101.component';
import { Fct0713Component } from './fct0713/fct0713.component';
import { Fct0902Component } from './fct0902/fct0902.component';
import { Fct0904Component } from './fct0904/fct0904.component';
import { Fct0907Component } from './fct0907/fct0907.component';
import { Fct4002Component } from './fct4002/fct4002.component';
import { Fct0807Component } from './fct0807/fct0807.component';
import { Fct9988Component } from './fct9988/fct9988.component';
import { Fct9916Component } from './fct9916/fct9916.component';
import { Fct0461Component } from './fct0461/fct0461.component';
import { Fct0304Component } from './fct0304/fct0304.component';
import { Fct9901Component } from './fct9901/fct9901.component';
import { Fct9902Component } from './fct9902/fct9902.component';
import { Fct0423Component } from './fct0423/fct0423.component';
import { Fct0702Component } from './fct0702/fct0702.component';
import { Fct9991Component } from './fct9991/fct9991.component';
import { Fct0706Component } from './fct0706/fct0706.component';
import { Fct0426Component } from './fct0426/fct0426.component';
import { Fct0409Component } from './fct0409/fct0409.component';
import { Fct0505Component } from './fct0505/fct0505.component';
import { Fct9910Component } from './fct9910/fct9910.component';
import { Fct0315Component } from './fct0315/fct0315.component';
import { Fct0316Component } from './fct0316/fct0316.component';
import { Fct9987Component } from './fct9987/fct9987.component';
import { Fct9985Component } from './fct9985/fct9985.component';
import { Fct9986Component } from './fct9986/fct9986.component';
import { Fct0214Component } from './fct0214/fct0214.component';
import { Fct0215Component } from './fct0215/fct0215.component';
import { Fct9995Component } from './fct9995/fct9995.component';


@NgModule({
  declarations: [
    Fct0218Component,
    Fct9993Component,
    Fct9994Component,
    Fct0226Component,
    Fct0227Component,
    Fct9908Component,
    Fct9905Component,
    Fct9906Component,
    Fct9996Component,
    Fct9992Component,
    Fct0242Component,
    Fct0232Component,
    Fct0418Component,
    Fct0412Component,
    Fct0220Component,
    Fct0416Component,
    Fct0220Component,
    Fct0230Component,
    Fct0231Component,
    Fct0246Component,
    Fct0202Component,
    Fct0203Component,
    Fct0305Component,
    Fct0301Component,
    Fct0302Component,
    Fct0313Component,
    Fct0314Component,
    Fct0317Component,
    Fct0801Component,
    Fct0805Component,
    Fct0811Component,
    Fct0812Component,
    Fct0110Component,
    Fct0208Component,
    Fct0209Component,
    Fct0318Component,
    Fct0404Component,
    Fct0405Component,
    Fct0421Component,
    Fct0425Component,
    Fct0430Component,
    Fct0434Component,
    Fct0435Component,
    Fct0437Component,
    Fct0444Component,
    Fct0445Component,
    Fct0508Component,
    Fct0509Component,
    Fct0601Component,
    Fct0707Component,
    Fct0225Component,
    Fct0223Component,
    Fct0210Component,
    Fct0229Component,
    Fct0502Component,
    Fct0503Component,
    Fct0108Component,
    Fct0204Component,
    Fct0510Component,
    Fct0511Component,
    Fct0504Component,
    Fct0710Component,
    Fct0711Component,
    Fct0411Component,
    Fct9903Component,
    Fct9907Component,
    Fct9909Component,
    Fct6800Component,
    Fct0701Component,
    Fct4102Component,
    Fct0709Component,
    Fct0228Component,
    Fct0219Component,
    Fct0211Component,
    Fct0212Component,
    Fct0213Component,
    Fct0240Component,
    Fct0410Component,
    Fct0501Component,
    Fct0201Component,
    Fct0205Component,
    Fct0206Component,
    Fct0207Component,
    Fct0234Component,
    Fct0235Component,
    Fct0237Component,
    Fct0320Component,
    Fct0450Component,
    Fct0803Component,
    Fct0804Component,
    Fct0813Component,
    Fct0109Component,
    Fct0406Component,
    Fct0407Component,
    Fct0443Component,
    Fct0417Component,
    Fct0401Component,
    Fct0101Component,
    Fct0713Component,
    Fct0902Component,
    Fct0904Component,
    Fct0907Component,
    Fct4002Component,
    Fct0807Component,
    Fct9988Component,
    Fct9916Component,
    Fct0461Component,
    Fct0304Component,
    Fct9902Component,
    Fct9901Component,
    Fct0423Component,
    Fct0702Component,
    Fct9991Component,
    Fct0706Component,
    Fct0426Component,
    Fct0409Component,
    Fct0505Component,
    Fct9910Component,
    Fct0315Component,
    Fct0316Component,
    Fct9985Component,
    Fct9986Component,
    Fct9987Component,
    Fct0214Component,
    Fct0215Component,
    Fct9995Component,
  ],
  imports: [
    CommonModule,
    FctRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule,
    CaseModule,
    NgSelectModule,
    MatTooltipModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class FctModule { }