import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { AlertService } from 'src/app/shared/services/alert.service';
import { communities } from 'src/app/shared/typedefs/custom.types';
import { CommunityService } from 'src/app/shared/services/community.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CommonService } from '../../services/common.service';
import { paramService } from 'src/app/shared/params/params';
import { ActivatedRoute, Router } from '@angular/router';
declare var window:any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnChanges {
  $modal: any;
  communities!: Array<communities>;
  communityId!:any;
  communityName:any;
  comName!: string;
  getCommunitiesCount: any;
  getAnnouncement: any;
  getEvent: any;
  announcementTitle!:string;
  announcementDesc: any;
  eventTitle!:string;
  eventType!:string;
  eventCreateDate!:string;
  eventEndDate!:string;
  eventDescription!:string;
  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private alertService: AlertService,
    private communityService: CommunityService,
    private StorageService: StorageService,
    private commonService: CommonService,
    private paramService: paramService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){
  }

  ngOnInit(): void {
    this.openCommunityModal();
    this.getmyCommunityDashboardList();
    this.commonService.getValue().subscribe((comId)=>{
      this.getmyCommunityDashboardList(comId);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
   // this.communitityList();
  }

  
  openCommunityModal(){
    this.loaderService.show();
    this.communitityList();
    setTimeout(() => {
     if(this.communities?.length === 1){
       this.StorageService.setLocalStorageItem('communtityId',this.StorageService.getLocalStorageItem('communtityId'));
       this.commonService.sendValue(this.StorageService.getLocalStorageItem('communtityId'));
       this.communityService.switchCommunity(this.communityId);
       this.commonService.sendImage(this.communities[0].logoImage ? this.communities[0].logoImage : 'assets/images/event-activity-01.jpg');
     }
     else if(!this.communities?.length){
       this.authService.logout();
     }
     else{    
       this.$modal = new window.bootstrap.Modal(
         document.getElementById("chooseCommunitity")
       );
       if(!this.StorageService.getLocalStorageItem('communtityId')){
         this.$modal.show();
       }
     }
     this.loaderService.hide();
    }, 2000);
   }

  switchCommunity(id:any,logoImage:any){
    this.$modal.hide();
    this.communityService.switchCommunity(id);
    this.commonService.sendValue(id);
    this.commonService.sendImage(logoImage);
  }

  communitityList(){
    this.loaderService.show();
    this.apolloClient.setModule('switchOrganizationList').queryData().subscribe((response: GeneralResponse) => {
      this.loaderService.hide();
      this.communities = response.data;
      this.communityId =  this.communities[0].id;
      this.commonService.getValue().subscribe((element) => {
        const cname = this.communities.filter((val)=> val.id === element);
        this.communityName = cname[0]?.communityName;
        if(this.communityName !== undefined || null){
          this.StorageService.setLocalStorageItem('communityName',this.communityName);
        }
        this.communityName = this.StorageService.getLocalStorageItem('communityName');
      });
     });
   }

   getmyCommunityDashboardList(comId:any = null){
    // console.log("comId111....",comId);
    
    // console.log("communityId1111......",this.StorageService.getLocalStorageItem('communtityId'));
    const params:any = {}
      params['data'] = {
        id: comId ? comId : this.StorageService.getLocalStorageItem('communtityId')
      }
    this.loaderService.show();
    this.apolloClient.setModule('getmyCommunityDashboardList').queryData(params).subscribe((response: GeneralResponse) => {    
      this.loaderService.hide();
      if(response?.error) {
        this.alertService.error(response.message);
      } else {
        this.getCommunitiesCount = response?.data?.myCommunitieDasboard;
        this.getAnnouncement = response?.data?.announcements;
        this.getEvent = response?.data?.events;
      }
    });
  }

  showDescription(title: any,desc:any) {
    this.announcementTitle = title ? title : 'N/A';
    this.announcementDesc = desc ? desc : 'N/A';
    this.$modal = new window.bootstrap.Modal(
      document.getElementById("announcementDescription")
    );
    this.$modal.show();
  }

  viewAnnouncements(){
    this.paramService.updatecurrentRoute('/announcements');
    this.router.navigateByUrl('/announcements');
  }

  viewEvents(){
    this.paramService.updatecurrentRoute('/events');
    this.router.navigateByUrl('/events');
  }

  getDay(dayValue :any){
    let dateNew = dayValue, ordinal = 'th';
    if (dateNew == 2 || dateNew == 22) ordinal = 'nd';
    if (dateNew == 3 || dateNew == 23) ordinal = 'rd';
    if (dateNew == 21 || dateNew == 1 || dateNew == 31) ordinal = 'st';
    return dateNew + ' ' +ordinal;
  }

  showEvent(item:any){
    //console.log("item.......",item);
    this.eventTitle = item?.title;
    this.eventDescription = item?.description;
    this.eventType = item?.type;
    this.eventCreateDate = item?.date.to;
    this.eventEndDate = item?.date.from;
    this.$modal = new window.bootstrap.Modal(
      document.getElementById("eventDetails")
    );
    this.$modal.show();
  }
}
