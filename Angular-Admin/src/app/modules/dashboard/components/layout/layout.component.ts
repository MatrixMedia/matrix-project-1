import {AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, AfterContentInit} from '@angular/core';
import { CommunityModalComponent } from 'src/app/shared/components/community-modal/community-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { CommunityService } from 'src/app/shared/services/community.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { communities } from 'src/app/shared/typedefs/custom.types';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CommonService } from '../../services/common.service';
import { paramService } from 'src/app/shared/params/params';
import { NotificationService } from 'src/app/shared/services/notification.service';
//import { ViewComponent } from '../../modules/active-members/view/view.component';
import { log } from 'console';
import { FormControl, FormGroup } from '@angular/forms';
declare var window:any;
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})


  export class LayoutComponent implements OnInit,OnChanges, AfterContentInit {

  @ViewChild("sidebar") sidebar!:ElementRef<HTMLDivElement>;
  @ViewChild("sidebarToggleBtn") sidebarToggleBtn!: ElementRef<HTMLButtonElement>;

  menuList!: any;
  currentRoute!: string;
  $modal: any;
  communities!: Array<communities>;
  communityId!:any;
  length!: number;
  comId!: any;
  data: any;
  image: any;
  searchForm!: FormGroup;
  searchData: any;
  announcements: any;
  events: any;
  groups: any;
  videos: any;
  communityfeedbacks: any;
  search: any;
  sub: any;
  notificationDetails: any;
  ShowComingNotificaton: boolean = false;
  notificationLength: number = 0;
  hasNewNotifications: boolean = false;
  comName!:string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private communityService: CommunityService,
    private StorageService: StorageService,
    private alertService: AlertService,
    private commonService: CommonService,
    private paramService:paramService,
    private notificationService: NotificationService
    //private viewComponent: ViewComponent
  ){
  }
  // get hasNewNotifications(): boolean {
  //   // Return true if there are new notifications
  //   return this.notificationService.hasNewNotifications();
  // }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.paramService.updatecurrentRoute(this.currentRoute);
    this.paramService.currentRoute.subscribe(data => {
      this.currentRoute = data;
      //console.log('this.currentRoute',this.currentRoute);
    });




   //console.log('currentRoute----', this.currentRoute);
    this.menuList = [
      {
        normalIcon: 'assets/images/side_menu_icon_1.png',
        activeIcon: 'assets/images/side_menu_icon_1_active.png',
        routerLink: '/dashboard',
        routerLinkActiveClass: 'active',
        content: [
          {
              text: 'Dashboard',
              routerLink: '/dashboard'
          },
        ],
      },
      {
        normalIcon: 'assets/images/side_menu_icon_4.png',
        activeIcon: 'assets/images/side_menu_icon_4_active.png',
        routerLink: '/community-management',
        routerLinkActiveClass: 'active',
        content: [
          {
              text: 'Community Management',
              routerLink: '/community-management/profile-edit'
          },
        ],
      },
      {
        normalIcon: 'assets/images/side_menu_icon_2.png',
        activeIcon: 'assets/images/side_menu_icon_2_active.png',
        routerLink: '/active-members',
        routerLinkActiveClass: 'active',
        content: [
          {
              text: 'Members',
              routerLink: '/active-members'
          },
        ],
      },

      {
        normalIcon: 'assets/images/side_menu_icon_3.png',
        activeIcon: 'assets/images/side_menu_icon_3_active.png',
        routerLink: '/groups',
        routerLinkActiveClass: 'active',
        content: [
          {
              text: 'Groups',
              routerLink: '/groups'
          },
        ],
      },
      {
        normalIcon: 'assets/images/side_menu_icon_5.png',
        activeIcon: 'assets/images/side_menu_icon_5_active.png',
        routerLink: '/events',
        routerLinkActiveClass: 'active',
        content: [
          {
              text: 'Events',
              routerLink: '/events'
          },
        ],
      },

    /*  {
        text: '',
        normalIcon: 'assets/images/side_menu_icon_5.png',
        activeIcon: 'assets/images/side_menu_icon_5_active.png',
        routerLink: '#',
        routerLinkActiveClass: 'active',
        content: [
          {
            text: 'Sub Menu 01',
            normalIcon: '',
            activeIcon: '',
            routerLink: '#'
          },
          {
            text: 'Sub Menu 02',
            normalIcon: '',
            activeIcon: '',
            routerLink: '#'
          },
          {
            text: 'Sub Menu 03',
            normalIcon: '',
            activeIcon: '',
            routerLink: '#'
          }
        ]
      },*/
      {
        normalIcon: 'assets/images/side_menu_icon_6.png',
        activeIcon: 'assets/images/side_menu_icon_6_active.png',
        routerLink: '/announcements',
        routerLinkActiveClass: 'active',
        content: [
          {
              text: 'Announcement',
              routerLink: '/announcements'
          },
        ],
      },
      {
        normalIcon: 'assets/images/side_menu_icon_7.png',
        activeIcon: 'assets/images/side_menu_icon_7_active.png',
        routerLink: '/message',
        routerLinkActiveClass: 'active',
        content: [
          {
              text: 'Emails & Messages',
              routerLink: '/message'
          },
        ],
      },
      {
        normalIcon: 'assets/images/side_menu_icon_8.png',
        activeIcon: 'assets/images/side_menu_icon_8_active.png',
        routerLink: '/blog',
        routerLinkActiveClass: 'active',
        content: [
          {
              text: 'Blog',
              routerLink: '/blog'
          },
        ],
      },
      {
        normalIcon: 'assets/images/side_menu_icon_9.png',
        activeIcon: 'assets/images/side_menu_icon_9_active.png',
        routerLink: '/login-user',
        routerLinkActiveClass: 'active',
        content: [
          {
              text: 'Logged in users',
              routerLink: '/login-user'
          },
        ],
      },
    ];
    this.communitityList();
    this.commonService.getImage().subscribe((data) => {
      this.image = data ? data : this.StorageService.getLocalStorageItem('communitylogo');
    });
    this.generateSearchForm();
    this.commonService.get().subscribe(()=>{
      this.clearSearch();
    })
   }

   ngAfterContentInit()
   {

   }

   ngOnChanges(changes: SimpleChanges): void {
    this.commonService.getImage().subscribe((data) => {
      this.image = data;
    })
   }
   generateSearchForm(){
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    })
   }

   removeClass(routerLink : any)
   {
      //console.log(this.router.url);
      this.currentRoute = routerLink;
      this.paramService.updatecurrentRoute(this.currentRoute);
   }

  logout(){
    this.authService.logout();
  }

  viewProfile(){
    const userId = this.StorageService.getLocalStorageItem('userId');
    //console.log("userId......",userId);
    //return;
    this.paramService.updatecurrentRoute('/active-members/my-profile/' + userId);
    this.router.navigateByUrl('/active-members/my-profile/' + userId);
    //this.viewComponent.getActiveMemberDetails(1);
  }

  editProfile(){
    //this.removeClass('community-management/profile-edit');
    this.paramService.updatecurrentRoute('/community-management/profile-edit');
    this.router.navigateByUrl('/community-management/profile-edit');
  }

  switchCommunity(id:any,logoImage:any){
    this.$modal.hide();
    this.communityService.switchCommunity(id);
    this.currentRoute = "/dashboard";
    this.commonService.sendValue(id);
    this.commonService.sendImage(logoImage);
  }

  switchCommunityOpenModal(){
    if(this.communities?.length === 1){
      this.alertService.error("You have connected to only one communtity");
      return;
    }
    else{
      this.$modal = new window.bootstrap.Modal(
        document.getElementById("switchingCommunitity")
      );
      if(!this.StorageService.getLocalStorageItem('communtityId')){
        this.StorageService.removeLocalItem('communtityId');
      }
      this.communitityList();
      this.$modal.show();
    }
  }

  showNotification() {
    this.ShowComingNotificaton = false;
    this.notificationList();
    this.loaderService.show();
    setTimeout(() => {
        this.loaderService.hide();
        this.$modal = new window.bootstrap.Modal(
        document.getElementById("notficationCommunitity")
        );
        this.$modal.show();
        this.loaderService.hide();
    }, 1000);

  }

  communitityList(){
    this.loaderService.show();
    this.apolloClient.setModule('switchOrganizationList').queryData().subscribe((response: GeneralResponse) => {
      if(response.error) {
        this.alertService.error(response.message);
        return;
      }
      else{
        this.loaderService.hide();
        //console.log("response........",response);
        this.communities = response.data;
        this.comName = this.communities[0].communityName ? this.communities[0].communityName : this.StorageService.getLocalStorageItem('communityName');
        //console.log(this.communities);
        this.communityId =  this.communities[0].id;
        this.length = this.communities?.length;
        this.comId = this.StorageService.getLocalStorageItem('communtityId');
        this.commonService.sendData(this.StorageService.getLocalStorageItem('communtityId'));
      }
    });
  }

  globalSearch(){
    this.router.navigateByUrl('/search/global');
    this.paramService.updatecurrentRoute('/search/global');
    const searchData = this.searchForm.value.search ? this.searchForm.value.search.trim() : '';
    const params:any = {}
      params['data'] = {
        search :searchData ? searchData : ''
      }
    this.loaderService.show();
    if ( this.sub && !this.sub.closed ) {
      this.sub.unsubscribe();
    }
    this.sub = this.apolloClient.setModule('myCommunityDotNetGlobalSearch').queryData(params).subscribe((response: GeneralResponse) => {
      if(response.error) {
        this.alertService.error(response.message);
        return;
      } else {
        this.commonService.sendData(response.data);
        //console.log("groupSearchData......",response.data);
      }
    })
    this.loaderService.hide();
  }

  feedbackSearch(){
    this.paramService.updatecurrentRoute('/message/feedback/'+this.searchForm.value.search);
    this.router.navigateByUrl('/message/feedback/'+this.searchForm.value.search);
  }

  announcementSearch(){
    this.paramService.updatecurrentRoute('/announcements/list/'+this.searchForm.value.search);
    this.router.navigateByUrl('/announcements/list/'+this.searchForm.value.search);
  }

  groupSearch(){
    this.paramService.updatecurrentRoute('/groups/list/'+this.searchForm.value.search);
    this.router.navigateByUrl('/groups/list/'+this.searchForm.value.search);
  }

  EventSearch(){
    this.paramService.updatecurrentRoute('/events/list/'+this.searchForm.value.search);
    this.router.navigateByUrl('/events/list/'+this.searchForm.value.search);
  }

  clearSearch(){
    this.searchForm.controls['search'].setValue('');
    this.globalSearch();
  }

  notificationList(){
    const params:any = {};
    params['data'] = {
      deviceType: "web",
      domains: ".net",
      page: null,
      search: null
    }
    this.loaderService.show();
    this.apolloClient.setModule('getAllNotifications').queryData(params).subscribe((response: GeneralResponse) => {
      if(response.error) {
        this.alertService.error(response.message);
        return;
      } else {
        this.notificationDetails = response.data.notifications;
        this.notificationLength = this.notificationDetails.length;
        //console.log("notificationDetails....",this.notificationDetails.length);
        }
    });

    this.loaderService.hide();
    this.hasNewNotifications = false;
  }

  getMessage(event:any){
    //console.log("hii...",event);

    //this.notificationList();
    this.hasNewNotifications = true;
  }
}
