import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommunityMangementRoutingModule } from './community-mangement-routing.module';
import { GlobalSettingComponent } from './global-setting/global-setting.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    GlobalSettingComponent,
    ProfileEditComponent
  ],
  imports: [
    CommonModule,
    CommunityMangementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class CommunityMangementModule { }
