import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiveMembersRoutingModule } from './active-members-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrackComponent } from './track/track.component';

@NgModule({
  declarations: [
    ListComponent,
    ViewComponent,
    TrackComponent
  ],
  imports: [
    CommonModule,
    ActiveMembersRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ActiveMembersModule { }
