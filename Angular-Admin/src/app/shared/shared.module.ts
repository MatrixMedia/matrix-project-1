import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { GraphQLModule, MaterialModule } from './modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ApolloClientService } from './services/apollo-client.service';
import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { CommunityService } from './services/community.service';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CommunityModalComponent } from './components/community-modal/community-modal.component';
// import {IvyCarouselModule} from 'angular-responsive-carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TruncatePipe } from './custom-pipe/truncate.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SafePipe } from './custom-pipe/safe.pipe';
import {SharedService} from './services/shared.service';
import { CKEditorModule } from 'ckeditor4-angular';
import { NotificationService } from './services/notification.service';
import { FirstnamePipe } from './custom-pipe/firstname.pipe';
import { CustomTimeFormatPipePipe } from './custom-pipe/custom-time-format-pipe.pipe';
import { MultiDropDownComponent } from './components/multi-drop-down/multi-drop-down.component';
@NgModule({
  declarations: [
    LoaderComponent,
    PaginationComponent,
    CommunityModalComponent,
    TruncatePipe,
    SafePipe,
    FirstnamePipe,
    CustomTimeFormatPipePipe,
    MultiDropDownComponent,
  ],
  imports: [
    CommonModule,
    GraphQLModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    // IvyCarouselModule,
    CarouselModule,
    ImageCropperModule,
    CKEditorModule,


  ],
  exports:[
    GraphQLModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    LoaderComponent,
    PaginationComponent,
    // IvyCarouselModule,
    CarouselModule,
    TruncatePipe,
    SafePipe,
    ImageCropperModule,
    CKEditorModule,
    FirstnamePipe,
    CustomTimeFormatPipePipe,

  ],
  providers:[
    ApolloClientService,
    AlertService,
    AuthService,
    StorageService,
    CommunityService,
    DatePipe,
    SharedService,
    NotificationService
  ]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: []
    }
  }
}
