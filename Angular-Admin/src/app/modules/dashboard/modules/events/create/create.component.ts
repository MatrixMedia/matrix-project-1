import { Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ValidatorFn, AbstractControl, FormGroup, FormArray, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { CountryCodes } from 'src/app/shared/typedefs/custom.types';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { Item } from 'src/app/shared/components/multi-drop-down/multi-dropdown.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subscription } from 'rxjs';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AnyARecord } from 'dns';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})

export class CreateEventComponent implements OnDestroy {
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('memberInput') memberInput!: ElementRef<HTMLInputElement>;
  removeGroupSubscriber!: Subscription;
  announcer = inject(LiveAnnouncer);
  eventForm!: FormGroup;
  eventImage: string = '';
  logoImage: string = '';
  packageLogo: any = [''];
  eventId!: any;
  venueDetails : any = {
    firstAddressLine: '',
    secondAddressLine: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    phoneNo: '',
    phoneCode: ''
  };
  isDisabled : boolean = true;

  countryData! : Array<CountryCodes>; //any = [];
  stateData : any = [];

  filteredOptions!: Array<CountryCodes>;
  filteredOptions1!: Array<CountryCodes>;
  //countryCodes!: Array<CountryCodes>;
  selectedCountryCode!: CountryCodes;
  todayDate = new Date(Date.now() + ( 3600 * 1000 * 24));
  todate! : Date;
  rsvpEndTime! : Date;
  getFromDate!: any;
  openCropImageModal: boolean= false;
  imageChangedEvent: any;
  getFileName: any;
  croppedImage: any ;
  croppedPackageImage: any = [];
  openPackageCropImageModal: any = [false];
  openLogoCropImageModal: boolean= false;
  imageLogoChangedEvent: any;
  imagePackageChangedEvent: any = [];
  //getLogoFileName: any;
  croppedLogoImage: any;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  separatorKeysCodes1: number[] = [ENTER, COMMA];
  groupCtrl = new FormControl([]);
  memberCtrl= new FormControl([]);
  //filteredFruits: Observable<string[]>;
  getGroupData: any = [];
  getMemberData: any = [];
  groups: any = [];
  members: any = [];
  attandanceCount:number = 0;
  guestCount: number = 0;
  visitorsCount:number = 0;
  paymentStatusValue: any = "";
  paymentCategoryValue: any = "";
  groupDisabled: boolean = false;
  groupDataArray:any = [];
  memberDataArray:any = [];
  getCurrency: string = "";
  isPrivateInvitation: boolean = false;
  payPackage: any;
  index!:number;
  getMemberIndex!: number;
  getGroupIndex!: number;
  isShowWebVisitor: boolean = false;
  isShowMaxNumber: boolean = false;
  beforeDay:  any;
  currentDay: any
  createdtAt: any;
  showWebVisitors: boolean = false;
  isGroupRemove: boolean = false;
  constructor(
    private alertService: AlertService,
    private sharedService: SharedService,
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private formBuilder: FormBuilder,
    private validator: ValidatorService,
    private storageService: StorageService,
    private datePipe: DatePipe
)
{
  this.getCurrency = this.storageService.getLocalStorageItem('currency');
  this.currentDay = new Date().toISOString().split('T')[0];
 //console.log("currentDay2222.....",new Date());
  
}

  ngOnInit() : void
  {
    this.generateForm();
    this.getMemberList();
    this.getCommunityGroup();
    this.getCountryCodes();
    this.activatedRoute.paramMap.subscribe(params => {
      this.eventId = params.get('id');
    }); 
  }

  ngOnDestroy(): void {
    if(this.removeGroupSubscriber){
      this.removeGroupSubscriber.unsubscribe()
    }
  }
  generateForm()
  {
        // let payPackage:any = []
        // if(this.paymentCategoryValue === 'per_head'){
        //   payPackage = this.formBuilder.array([
        //     this.createPaymentPackage(),
        //   ])
        // }
        // else{
        //   payPackage = this.formBuilder.array([
        //     this.createPaymentPackage(),
        //     this.createPaymentPackage(),
        //     this.createPaymentPackage()
        //   ])
        // }
        // console.log("payPackage....",payPackage);
        
        this.eventForm = new FormGroup({
          title : new FormControl('', [Validators.required]),
          description : new FormControl('', [Validators.required]),
          image : new FormControl(''),
          logoImage : new FormControl(''),
          type : new FormControl('', [Validators.required]),
          firstAddressLine: new FormControl('', [Validators.required]),
          secondAddressLine: new FormControl(''),
          city: new FormControl('', [Validators.required]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipcode: new FormControl('', [Validators.required]),
          //countryCode:new FormControl('', [Validators.required]),
          //phone: new FormControl('',[Validators.required,this.validator.isEmpty,this.validator.isMobileNumber]),
          phoneCode: new FormControl('', [Validators.required]),
          phoneNo: new FormControl('',[Validators.required,this.validator.isEmpty,this.validator.isMobileNumber]),
         
          fromdate: new FormControl('', [Validators.required]),
          todate: new FormControl('', [Validators.required]),        
          
          fromtime: new FormControl('', [Validators.required]),
          totime: new FormControl('', [Validators.required]),
        
          invitationType: new FormControl('', [Validators.required]),
          rsvpEndTime: new FormControl('', [Validators.required]),
          restrictNumberAttendees: new FormControl(false),
          postEventAsCommunity: new FormControl(false), 
          attendeeListVisibilty: new FormControl(false),
          collectEventPhotos: new FormControl(false), 
          //numberOfMaxAttendees: new FormControl(null),
          groupCtrl:  new FormControl([]),
          memberCtrl: new FormControl([]),
          paymentStatus: new FormControl('Free'),
          paymentCategory: new FormControl(''),
          webvistorRestriction: new FormControl(false),
          paymentPackages: this.formBuilder.array([
            this.createPaymentPackages(),
            this.createPaymentPackages(),
            this.createPaymentPackages()
          ]),
          paymentPackage: this.formBuilder.array([
            this.createPaymentPackage()
          ]),
          webCount: new FormControl(0),
          attendanceCounts: new FormControl(0),
          numberOfMaxGuests: new FormControl(0),
      });

  }

  get paymentPackages() : FormArray {
    return this.eventForm.get('paymentPackages') as FormArray;
  }

  get paymentPackage() : FormArray {
    return this.eventForm.get('paymentPackage') as FormArray;
  }

  getEventDetails()
  {
    const params:any= {};
    params['getMyCommunityEventByIdId'] = this.eventId;
    let groupData : any = {};
    this.loaderService.show();
    this.apolloClient.setModule('getMyCommunityEventByID').mutateData(params).subscribe((response: any) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        groupData = response.data;
        if(groupData.venueDetails.country!='')
        {
          this.getState(groupData.venueDetails.country);
        }
        if(groupData.paymentStatus === 'Paid')
        {
          this.paymentSatusChanged('Paid');
        }
        
        if(groupData.invitationType === 'Private')
        {
          this.getInvitationTypeValues('Private');
        }
        if(groupData.paymentCategory === 'package_wise')
        {
          this.paymentCategoryChanged('package_wise');
          this.eventForm.setControl('paymentPackages',this.setPackagesForm(groupData.paymentPackages));
        }
        if(groupData.paymentCategory === 'per_head')
        {
          this.paymentCategoryChanged('per_head');
          this.eventForm.setControl('paymentPackage',this.setPackageForm(groupData.paymentPackages));
        }
        if(groupData.attendees.isRestricted){
          this.isShowMaxNumber = true;
        }
        if(groupData.attendees.webvistorRestriction){
          this.isShowWebVisitor = true;
        }
        this.getFromDate =  groupData.date.from ? this.sharedService.getDateFormat(groupData.date.from)  : this.todayDate;        
        this.rsvpEndTime = new Date(this.getFromDate);
        this.rsvpEndTime.setDate(this.rsvpEndTime.getDate() - 1);
        this.eventForm.patchValue({
          paymentStatus: groupData.paymentStatus ? groupData.paymentStatus : '',
          paymentCategory: groupData.paymentCategory ? groupData.paymentCategory : '',
          title : groupData.title ? groupData.title : '',
          description : groupData.description ? groupData.description : '',
          type : groupData.type ? groupData.type : '',
          firstAddressLine: groupData.venueDetails.firstAddressLine ? groupData.venueDetails.firstAddressLine : '',
          secondAddressLine: groupData.venueDetails.secondAddressLine ? groupData.venueDetails.secondAddressLine : '',
          city: groupData.venueDetails.city ? groupData.venueDetails.city : '',
          state: groupData.venueDetails.state ? groupData.venueDetails.state : '',
          country: groupData.venueDetails.country ? groupData.venueDetails.country : '',
          zipcode: groupData.venueDetails.zipcode ? groupData.venueDetails.zipcode : '',
          phoneCode : groupData.venueDetails.phoneCode ? groupData.venueDetails.phoneCode : '',
          phoneNo: groupData.venueDetails.phoneNo ? groupData.venueDetails.phoneNo : '',
          fromdate: groupData.date.from ? this.sharedService.getDateFormat(groupData.date.from) : '',
          todate: groupData.date.to ? this.sharedService.getDateFormat(groupData.date.to) : '',    
          fromtime: groupData.time.from ? this.sharedService.getTimeFormat(groupData.time.from) : '',
          totime: groupData.time.to ? this.sharedService.getTimeFormat(groupData.time.to) : '',
          invitationType: groupData.invitationType ? groupData.invitationType : '',
          rsvpEndTime: groupData.rsvpEndTime ? this.sharedService.getDateFormat(groupData.rsvpEndTime) : '',
          restrictNumberAttendees: groupData.attendees.isRestricted ? groupData.attendees.isRestricted : false,
          postEventAsCommunity: groupData.postEventAsCommunity ? groupData.postEventAsCommunity : false,
          attendeeListVisibilty:  groupData.attendees?.attendeesListVisibility === 'Host' ?  true : false,//true
          collectEventPhotos: groupData.attendees.mediaUploadByAttendees ? groupData.attendees.mediaUploadByAttendees : false,
          //numberOfMaxAttendees: groupData.attendees.numberOfMaxAttendees ? groupData.attendees.numberOfMaxAttendees : null,
          webvistorRestriction: groupData.attendees.webvistorRestriction ? groupData.attendees.webvistorRestriction : false,
          webCount: groupData.attendees?.numberOfMaxWebVisitors ? groupData.attendees?.numberOfMaxWebVisitors : null,
          attendanceCounts: groupData.attendees?.numberOfMaxAttendees ? groupData.attendees?.numberOfMaxAttendees : null,
          numberOfMaxGuests: groupData.attendees?.numberOfMaxGuests ? groupData.attendees?.numberOfMaxGuests : null,
        });
        // this.getMemberData = groupData.members ? memberArrayVal : [];
        // let memberArrayVal = 
        let memberArrayVal = groupData.members.map((element: any, index:number) => {
          this.selectedMembers(element);
          this.getmemberIndex(element.id);
          return {
            member: {
              members: {
                user: {
                  "phone": element?.phone,
                  "name": element?.name,
                }
              }
            }
          };
        });
        let groupArrayVal = groupData.groups.map((elementVal: any, index:number) => {
          // this.selectedGroup(elementVal.name+'('+ elementVal.id +')');
          this.selectedGroup(elementVal);
          this.getmemberGroup(elementVal.id);
          return {
            group: {
                  // "id": elementVal?.id,
                  "name": elementVal?.name,
            }
          };
        });
        //this.getMemberData = groupData.members ? memberArrayVal : [];
        //this.getGroupData = groupData.groups ? groupArrayVal : [];
        //this.members = groupData.members ? arrayVal : [];
        this.eventImage = groupData?.image;
        this.logoImage = groupData?.logoImage;
        //this.attandanceCount = groupData.attendees?.numberOfMaxAttendees;
        //this.visitorsCount = groupData.attendees?.numberOfMaxWebVisitors;
        this.beforeDay = new Date(groupData?.rsvpEndTime);
        this.beforeDay.setDate(this.beforeDay.getDate() - 1);
        this.createdtAt = new Date(groupData?.createdAt);
        this.createdtAt.setDate(this.createdtAt.getDate());
        //this.alertService.success(response.message);
      }
    });

  }

  //Use Angular DatePipe to format the date
  formatDate(date: Date | undefined): string {
    if (!date) {
      return '';
    }
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  setPackagesForm(packagesValue:any) : FormArray{
    const arrayData : FormArray = new FormArray<any>([]);
    if(packagesValue.length){
      packagesValue.forEach((element:any,index:number) => {
        const PackagesForm = this.formBuilder.group({
        currency: [this.getCurrency],
        packageName: [element?.packageName],
        packageRate: [element?.packageRate],
        packageLogo: [element?.packageLogo],
        earlyBirdDate: [this.formatDate(element?.earlyBirdDate)],
        earlyBirdRate: [element?.earlyBirdRate],
        });
        this.packageLogo[index] =  PackagesForm.value.packageLogo;
        arrayData.push(PackagesForm);
      });
    }
    return arrayData;
  }

  setPackageForm(packageValue:any) : FormArray{
    const packageArrayData : FormArray = new FormArray<any>([]);
    if(packageValue.length){
      packageValue.forEach((element:any) => {
        //console.log("element....",element);
        const PackageForm = this.formBuilder.group({
        //packageName: [element?.packageName],
        packageRate: [element?.packageRate],
        earlyBirdDate: [this.formatDate(element?.earlyBirdDate)],
        earlyBirdRate: [element?.earlyBirdRate],
        //packageLogo: [element?.packageLogo]
        })
        packageArrayData.push(PackageForm)
      });
    }
    return packageArrayData;
  }

  getmemberIndex(memberId:any){
    this.getMemberIndex = this.getMemberData.findIndex((val:any)=> val?.members?.user?.id === memberId);
    this.isMemberOptionDisabled(this.getMemberIndex);
  }

  getmemberGroup(groupId:any){
    this.getGroupIndex = this.getGroupData.findIndex((val:any)=> val?.id === groupId);
    this.isOptionDisabled(this.getGroupIndex);
  }

  getCountryCodes() {
    this.loaderService.show();
    this.apolloClient.setModule('getCountryCodes').queryData().subscribe((response: GeneralResponse) => {    
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        this.countryData = response.data;  
        this.filteredOptions = response.data;      
      }
    });
  }

  getStateDate(event: any)
  {
        //console.log(event.target.value);

        if(event.target.value != '')
        {
            const params= {
              data:{
                countryCode: event.target.value
              }
            }
            this.loaderService.show();
            this.apolloClient.setModule('getState').queryData(params).subscribe((response: GeneralResponse) => {
              this.loaderService.hide();
              if(response.error) {
                this.alertService.error(response.message);
              } else {
                this.stateData = response.data;
                this.eventForm.controls['firstAddressLine'].setValue('');
                this.eventForm.controls['secondAddressLine'].setValue('');
                this.eventForm.controls['state'].setValue('');
                this.eventForm.controls['zipcode'].setValue('');
                this.eventForm.controls['city'].setValue('');
              }
            });
        }
  }

  getState(country: any)
  {
        //console.log(event.target.value);

        if(country != '')
        {
            const params= {
              data:{
                countryCode: country
              }
            }
            this.loaderService.show();
            this.apolloClient.setModule('getState').queryData(params).subscribe((response: GeneralResponse) => {
              this.loaderService.hide();
              if(response.error) {
                this.alertService.error(response.message);
              } else {
                this.stateData = response.data;
              }
            });
        }
  }

saveData()
{
  if(this.eventForm.value.paymentStatus === '' || this.eventForm.value.paymentStatus === null){
    this.alertService.error("Payment status is required");
    return;
  }
  if(this.eventForm.value.paymentStatus === 'Paid' && this.eventForm.value.paymentCategory === '' || this.eventForm.value.paymentCategory=== null){
    this.alertService.error("Payment category is required");
    return;
  }
  if(this.eventForm.value.paymentPackage.length!= 0){
    if(this.eventForm.value.paymentCategory === 'per_head' && this.eventForm.value.paymentPackage[0].packageRate === '' || this.eventForm.value.paymentPackage[0].packageRate === null){
      this.alertService.error("Package rate is required");
      return;
    }
   if(this.eventForm.value.paymentCategory === 'per_head'){
    if(this.eventForm.value.paymentPackage[0].earlyBirdDate !== null && this.eventForm.value.paymentPackage[0].earlyBirdRate === null){
      this.alertService.error(`Package early bird rate is required`);
      return;
    }
    if(this.eventForm.value.paymentPackage[0].earlyBirdRate !== null && this.eventForm.value.paymentPackage[0].earlyBirdDate === null || this.eventForm.value.paymentPackage[0].earlyBirdDate === ""){
      this.alertService.error(`Package early bird date is required`);
      return;
    }
   }
    // if(this.eventForm.value.paymentCategory === 'per_head' && (this.eventForm.value.paymentPackage[0].earlyBirdDate !== null || this.eventForm.value.paymentPackage[0].earlyBirdDate !== '') && (this.eventForm.value.paymentPackage[0].earlyBirdRate === null || this.eventForm.value.paymentPackage[0].earlyBirdRate === '')){
    //   this.alertService.error(`Package early bird rate is required`);
    //   return;
    // }
    // if(this.eventForm.value.paymentCategory === 'per_head' &&  this.eventForm.value.paymentPackage[0].earlyBirdRate !== null || this.eventForm.value.paymentPackage[0].earlyBirdRate !== '' && this.eventForm.value.paymentPackage[0].earlyBirdDate === null || this.eventForm.value.paymentPackage[0].earlyBirdDate === ''){
    //   this.alertService.error(`Package early bird date is required`);
    //   return;
    // }
    // console.log("earlyBirdDate.....",this.eventForm.value.paymentPackage[0].earlyBirdDate);
    // console.log("currentDay....",this.currentDay.setDate(this.currentDay.getDate()));
    // console.log("createdtAt....",this.createdtAt);
    // console.log(this.eventForm.value.paymentPackage[0].earlyBirdDate);
    // console.log(this.eventForm.value.paymentCategory);
    
    if(this.eventForm.value.paymentCategory === 'per_head'){ 
      if (this.eventForm.value.paymentPackage[0].earlyBirdDate){
        if(!this.eventId){
          const ctDay = this.formatDate(new Date());
          const earlyDate = this.formatDate(this.eventForm.value.paymentPackage[0].earlyBirdDate);
          if(earlyDate < ctDay){
            this.alertService.error(`Early Bird RATE is applicable only between "Event creation date" AND before "RSVP end date"`);
            return;
          }
        }
        else{ 
          const createdtAt = this.formatDate(this.createdtAt);
          const earlyDateEdit = this.formatDate(this.eventForm.value.paymentPackage[0].earlyBirdDate);        
          if(earlyDateEdit < createdtAt){
            this.alertService.error(`Early Bird RATE is applicable only between "Event creation date" AND before "RSVP end date"`);
            return;
          }
        }
      }
    }
  }
  //console.log(this.eventForm.value.paymentPackages.length);
  
  if(this.eventForm.value.paymentPackages.length!= 0){
    for(let i=0; i<this.eventForm.value.paymentPackages.length; i++){
      if(this.eventForm.value.paymentCategory === 'package_wise' && this.eventForm.value.paymentPackages[i].packageName === '' || this.eventForm.value.paymentPackages[i].packageName === null){
        this.alertService.error(`Package ${i+1} name is required`);
        return;
      }
      if(this.eventForm.value.paymentCategory === 'package_wise' && this.eventForm.value.paymentPackages[i].packageRate === '' || this.eventForm.value.paymentPackages[i].packageRate === null){
        this.alertService.error(`Package ${i+1} rate is required`);
        return;
      }
      if(this.eventForm.value.paymentCategory === 'package_wise' && this.eventForm.value.paymentPackages[i].packageLogo === '' || this.eventForm.value.paymentPackages[i].packageLogo === null){
        this.alertService.error(`Package ${i+1} logo is required`);
        return;
      }
      if(this.eventForm.value.paymentCategory === 'package_wise'){
        if(this.eventForm.value.paymentPackages[i].earlyBirdDate){
          if(!this.eventForm.value.paymentPackages[i].earlyBirdRate){
            this.alertService.error(`Package ${i+1} early bird rate is required`);
          return;
          } 
        }
        if(this.eventForm.value.paymentPackages[i].earlyBirdRate){
          if(!this.eventForm.value.paymentPackages[i].earlyBirdDate){
            this.alertService.error(`Package ${i+1} early bird date is required`);
          return;
          } 
        }
        // if(this.eventForm.value.paymentPackages[i].earlyBirdRate !== null && this.eventForm.value.paymentPackages[i].earlyBirdDate === null || this.eventForm.value.paymentPackages[i].earlyBirdDate === ""){
        //   this.alertService.error(`Package ${i+1} early bird date is required`);
        //   return;
        // }
        
      }
      // if(this.eventForm.value.paymentCategory === 'package_wise' && this.eventForm.value.paymentPackages[i].earlyBirdDate !== '' && this.eventForm.value.paymentPackages[i].earlyBirdRate === null){
      //   this.alertService.error(`Package ${i+1} early bird rate is required`);
      //   return;
      // }
      // if(this.eventForm.value.paymentCategory === 'package_wise' &&  this.eventForm.value.paymentPackages[i].earlyBirdRate !== null && this.eventForm.value.paymentPackages[i].earlyBirdDate === ''){
      //   this.alertService.error(`Package ${i+1} early bird date is required`);
      //   return;
      // }
      // console.log(this.eventForm.value.paymentPackages[i].earlyBirdDate);
     
      if(this.eventForm.value.paymentCategory === 'package_wise'){  
        if (this.eventForm.value.paymentPackages[i].earlyBirdDate){
          if(!this.eventId){
            const ctDay = this.formatDate(new Date());
            const earlyDatePackages = this.formatDate(this.eventForm.value.paymentPackages[i].earlyBirdDate);
            
            if(earlyDatePackages < ctDay){
              this.alertService.error(`Package ${i+1} Early Bird RATE is applicable only between "Event creation date" AND before "RSVP end date"`);
              return;
            }
          }
          else{      
            const createdtAt = this.formatDate(this.createdtAt);
            const earlyDatePackageEdit = this.formatDate(this.eventForm.value.paymentPackages[i].earlyBirdDate);    
            if(earlyDatePackageEdit < createdtAt){
              this.alertService.error(`Package ${i+1} Early Bird RATE is applicable only between "Event creation date" AND before "RSVP end date"`);
              return;
            }
          }
        }
      }
      // if(this.eventForm.value.paymentCategory === 'package_wise' &&  this.eventForm.value.paymentPackages[i].earlyBirdDate !== ''){
      //   if(this.eventId === '' || this.eventId === null || this.eventId === undefined){
      //     if(this.eventForm.value.paymentPackages[i].earlyBirdDate < this.currentDay){
      //       this.alertService.error(`Package ${i+1} Early Bird RATE is applicable only between "Event creation date" AND before "RSVP end date"`);
      //       return;
      //     }
      //   }
      //   else{          
      //     if(this.eventForm.value.paymentPackages[i].earlyBirdDate < this.createdtAt){
      //       this.alertService.error(`Package ${i+1} Early Bird RATE is applicable only between "Event creation date" AND before "RSVP end date"`);
      //       return;
      //     }
      //   }
        
      // }
    }
  }
  // if(this.eventForm.value.invitationType === 'Private' && this.memberDataArray.length === 0){
  //   this.alertService.error("Member is required");
  //   return;
  // }

  // if(this.eventForm.value.invitationType === 'Private' && this.memberDataArray.length === 0){
  //   this.alertService.error("Member is required");
  //   return;
  // }

  // if(this.eventForm.value.invitationType === 'Private'){
  //   if(this.groupDataArray.length === 0 || this.memberDataArray.length === 0){
  //     this.alertService.error("Member and Group is required");
  //   return;
  //   }
  // } 

  if(this.paymentCategoryValue === 'per_head'){
    this.payPackage = this.eventForm.value.paymentPackage;
  }
  else if(this.paymentCategoryValue === 'package_wise'){
    this.payPackage = this.eventForm.value.paymentPackages;
  }

  if(this.isShowMaxNumber === true && this.eventForm.value.attendanceCounts === 0){
    this.alertService.error("maximum number of attendees count is required");
    return;
  }
  if(this.isShowMaxNumber === true && this.eventForm.value.attendanceCounts < 0){
    this.alertService.error("Negative number is not allowed");
    return;
  }
  if(this.isShowMaxNumber === true && this.eventForm.value.numberOfMaxGuests === 0){
    this.alertService.error("maximum number of guests count is required");
    return;
  }
  if(this.isShowMaxNumber === true && this.eventForm.value.numberOfMaxGuests < 0){
    this.alertService.error("Negative number is not allowed");
    return;
  }
  if(this.eventForm.value.numberOfMaxGuests!== 0 && this.eventForm.value.attendanceCounts!==0){
    if(this.eventForm.value.numberOfMaxGuests > this.eventForm.value.attendanceCounts){
      this.alertService.error("Number of guest must be less than or eaual to number of attandance");
      return;
    }
  }
  if(this.isShowWebVisitor === true && this.eventForm.value.webCount === 0){
    this.alertService.error("maximum number of web visitors  count is required");
    return;
  }
  if(this.isShowWebVisitor === true && this.eventForm.value.webCount < 0){
    this.alertService.error("Negative number is not allowed");
    return;
  }
  if(this.isShowWebVisitor === false){
    this.visitorsCount = 0;
  }
  if(this.isShowMaxNumber === false){
    this.attandanceCount = 0;
    this.guestCount = 0;
  }
  if(this.eventForm.value.fromtime && this.eventForm.value.totime){
    const startDateTime = new Date(`${this.eventForm.value.fromdate} ${this.eventForm.value.fromtime}`);
    const endDateTime = new Date(`${this.eventForm.value.todate} ${this.eventForm.value.totime}`);
    const timeDifference = endDateTime.getTime() - startDateTime.getTime();
    if (timeDifference < 0 || timeDifference > 24 * 60 * 60 * 1000) {
      this.alertService.error("start date and end date must be within 24 hours");
      return;
    }
  }
  const params: any = {};
  params['data'] = {
    //communityId: this.storageService.getLocalStorageItem('communtityId'),
    type: this.eventForm.value.type,
    title: this.eventForm.value.title,
    image: this.eventImage,
    logoImage: this.logoImage,
    description: this.eventForm.value.description,
    venueDetails: {
      firstAddressLine: this.eventForm.value.firstAddressLine,
      secondAddressLine: this.eventForm.value.secondAddressLine,
      city: this.eventForm.value.city,
      state: this.eventForm.value.state,
      country: this.eventForm.value.country,
      zipcode: this.eventForm.value.zipcode,
      phoneCode: this.eventForm.value.phoneCode,
      phoneNo: this.eventForm.value.phoneNo,
    },
    date: {
      from: this.eventForm.value.fromdate,
      to: this.eventForm.value.todate,
    },
    time: {
      from: this.eventForm.value.fromtime,
      to: this.eventForm.value.totime
    },    
    invitationType: this.eventForm.value.invitationType,
    rsvpEndTime: this.eventForm.value.rsvpEndTime,
    restrictNumberAttendees: this.eventForm.value.restrictNumberAttendees,
    postEventAsCommunity: this.eventForm.value.postEventAsCommunity,
    attendeeListVisibilty: this.eventForm.value.attendeeListVisibilty,
    collectEventPhotos: this.eventForm.value.collectEventPhotos,
    //numberOfMaxAttendees: this.eventForm.value.restrictNumberAttendees ? this.eventForm.value.numberOfMaxAttendees : null,
    numberOfMaxAttendees: this.eventForm.value.attendanceCounts ? this.eventForm.value.attendanceCounts : 0,
    numberOfMaxGuests: this.eventForm.value.numberOfMaxGuests ? this.eventForm.value.numberOfMaxGuests : 0,
    numberOfMaxWebVisitors: this.eventForm.value.webCount ? this.eventForm.value.webCount : 0,
    //paymentStatus: this.eventForm.value.paymentStatus,
    paymentCategory: this.eventForm.value.paymentCategory ? this.eventForm.value.paymentCategory : null,
    paymentPackages: this.payPackage ? this.payPackage : [],
    members: this.memberDataArray ? this.memberDataArray : [],
    groups: this.groupDataArray ? this.groupDataArray : [],
    webvistorRestriction: this.isShowWebVisitor
  }
  // console.log("params.....",params);
  // return;
  if(this.eventId)
  {
    params['data'].id = this.eventId;
      this.loaderService.show();
          this.apolloClient.setModule("updateEvent").mutateData(params).subscribe((response: any) => {
            if (response.error) {
              this.loaderService.hide();
              this.alertService.error(response.message)
            }
            else {
              this.loaderService.hide();
              this.alertService.error(response.message);
              this.router.navigateByUrl('/events');
              
            }
          });
  }
  else
  {
        params['data'].communityId = this.storageService.getLocalStorageItem('communtityId');
        params['data'].paymentStatus = this.eventForm.value.paymentStatus;
        this.loaderService.show();
        this.apolloClient.setModule("createEvent").mutateData(params).subscribe((response: any) => {
          if (response.error) {
            this.loaderService.hide();
            this.alertService.error(response.message)
          }
          else {
            this.loaderService.hide();
            this.alertService.error(response.message);
            this.router.navigateByUrl('/events');
            
          }
        });
  }
}

uploadPackageImage(event: any, imageName: String, index: number) {
  const val = event.target.value.split("\\").pop();
  this.getFileName = val;
  this.openPackageCropImageModal[index] = true;
  this.imagePackageChangedEvent[index] = event;

  if (event.target.files && event.target.files[0]) {
    let size = event.target.files[0].size / 1024;
    if (size > 5120) { 
      this.alertService.error("Image size should be within 2-5MB.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      let imageSrc = event.target?.result;
    }
  }
}

uploadImage(event: any, type: String) {

  const val = event.target.value.split("\\").pop();
  this.getFileName = val;

    if(type == 'eventImage')
    {      
      this.openCropImageModal = true;
      this.imageChangedEvent = event;
    }
    else if(type == 'logoImage')
    {
      //this.getLogoFileName = val;
      this.openLogoCropImageModal = true;
      this.imageLogoChangedEvent = event;
    }
  if (event.target.files && event.target.files[0]) {
    let size = event.target.files[0].size / 1024;
    //console.log('image size----', size);
    if (size > 5120) { //size < 2048
      this.alertService.error("Image size should be within 2-5MB.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      let imageSrc = event.target?.result;
      //console.log('imageSrc----', imageSrc);
    }
  }
  // this.sharedService.uploadFileToS3Bucket(event, imageName,
  //   (err : any, data : any, imageName: any) => {
  //     this.setS3BucketUploadedFilePath(err, data, imageName);
  //   });
}


uploadPackageLogo(event: any, type: String) {

  const val = event.target.value.split("\\").pop();
  this.getFileName = val;

    if(type == 'eventImage')
    {      
      this.openCropImageModal = true;
      this.imageChangedEvent = event;
    }
    else if(type == 'logoImage')
    {
      //this.getLogoFileName = val;
      this.openLogoCropImageModal = true;
      this.imageLogoChangedEvent = event;
    }


  if (event.target.files && event.target.files[0]) {
    let size = event.target.files[0].size / 1024;
    //console.log('image size----', size);
    if (size > 5120) { //size < 2048
      this.alertService.error("Image size should be within 2-5MB.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      let imageSrc = event.target?.result;
      //console.log('imageSrc----', imageSrc);
    }
  }
  // this.sharedService.uploadFileToS3Bucket(event, imageName,
  //   (err : any, data : any, imageName: any) => {
  //     this.setS3BucketUploadedFilePath(err, data, imageName);
  //   });
}


setS3BucketUploadedFilePath (err : any, data : any, type: string) {
  
  if (err) {
          this.alertService.error("There was an error uploading your file");
          return false;
  } else {
    
            if(type == 'eventImage')
            {
                 this.eventImage = data.Location;
            }
            else if(type == 'logoImage')
            {
                 this.logoImage = data.Location;
            } 

          this.alertService.error("Image has been uploaded successfully");
     
        return true;
  }
}

//Image Croped...............
cropImg(event: ImageCroppedEvent, type: string) {
  //console.log("event.......",event);
  this.croppedImage = event.blob;
  
}

//Package Image Croped...............
cropPackageImg(event: ImageCroppedEvent, type: string, index:number) {
  //console.log("event.......",event);
  this.croppedPackageImage[index] = event.blob;
  
}

closeImage(type: string)
{
    if(type == 'eventImage')
    {
        this.openCropImageModal = false;
    }
    else if(type == 'logoImage')
    {
        this.openLogoCropImageModal = false;
    }
  
}

closePackageImage(index:number){
  this.openPackageCropImageModal[index] = false;
}

savePackageImage(index:number){
  this.openPackageCropImageModal[index] = false;
  this.sharedService.uploadCropedFileToS3Bucket(this.croppedPackageImage[index], this.getFileName, 'packageLogo',
    (err : any, data : any, imageType: string) => {
      this.setS3BucketUploadedPackageImageFilePath(err, data, index);
    });
}

setS3BucketUploadedPackageImageFilePath (err : any, data : any, index:number) {
  
  if (err) {
          this.alertService.error("There was an error uploading your file");
          return false;
  } else {
          this.packageLogo[index] = data.Location;  
          this.paymentPackages.at(index).patchValue({packageLogo : data.Location});
          this.alertService.error("Image has been uploaded successfully");
        return true;
  }
}

saveImage(type: string)
{

  if(type == 'eventImage')
  {
      this.openCropImageModal = false;
  }
  else if(type == 'logoImage')
    {
        this.openLogoCropImageModal = false;
    }
  

  this.sharedService.uploadCropedFileToS3Bucket(this.croppedImage, this.getFileName, type, 
    (err : any, data : any, imageType: string) => {
      this.setS3BucketUploadedFilePath(err, data, imageType);
    });
}

  cancel(){
    this.router.navigateByUrl('events')
  }

  deleteImage(type : string)
  {
    if(type == 'eventImage')
    {
      this.eventImage = '';
    }
    else if(type == 'logoImage')
    {
      this.logoImage = '';
    } 
  }

  deletePackageImage(index:number){
    this.packageLogo[index] = ''
  }

  searchCountry(event:any){
    this._filter(event.target.value)
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    this.filteredOptions = this.countryData.filter(countryCode => countryCode.name.toLowerCase().includes(filterValue));
    if(this.filteredOptions.length == 0){
    }
  }

  addCountryCode(country:CountryCodes){
    this.selectedCountryCode = country;
    //console.log("country............",this.selectedCountryCode);
  }

  setEndDate(event:any)
  {
          this.todate = event.target.value;

          this.rsvpEndTime = new Date(this.todate);
          this.rsvpEndTime.setDate(this.rsvpEndTime.getDate() - 1);

          this.eventForm.patchValue({
            todate: '',  
            rsvpEndTime: '',  
          });
  }

  checkPostEventCommunity(event:any)
  {
        if(event.target.checked === false)
        {
            event.target.checked = true;
        }
  }

  
  // ---- date input test -- start --- 

  // openCalendar(): void {
  //   const dateInput = document.getElementById('dateInput') as HTMLInputElement;
  //   dateInput.type = 'date';
  //   dateInput.focus();
  // }

  // ---- date input test -- end --- 



  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our group
    if (value) {
      //console.log("value......",value);
      this.groups.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.groupCtrl.setValue(null);
  }

  addMember(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our member
    if (value) {
      this.members.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();

    this.memberCtrl.setValue(null);
  }

  remove(group: string): void {
    const index = this.groups.indexOf(group);
    if (index >= 0) {
      this.groups.splice(index, 1);
      this.groupDataArray.splice(index,1);
      this.announcer.announce(`Removed ${group}`);
    }
  }


  removeMember(member: string): void {
    const index = this.members.indexOf(member);
    if (index >= 0) {
      this.members.splice(index, 1);
      this.memberDataArray.splice(index,1);
      this.announcer.announce(`Removed ${member}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.groupDataArray.push(event.option.value);
    this.groups.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.groupCtrl.setValue(null);
  }

  selectedMember(event: MatAutocompleteSelectedEvent): void {
    this.memberDataArray.push(event.option.value);
    this.members.push(event.option.viewValue);
    this.memberInput.nativeElement.value = '';
    this.memberCtrl.setValue(null);
    //console.log(this.memberDataArray);
  }

  selectedMembers(value:any): void {
    this.memberDataArray.push(value.id);
    this.members.push(value.name+'('+ value.phone +')');
    //this.memberInput.nativeElement.value = '';
    this.memberCtrl.setValue(null);
    //console.log(this.memberDataArray);
  }

  selectedGroup(value:any): void {
    this.groupDataArray.push(value?.id);
    this.groups.push(value?.name);
    //this.fruitInput.nativeElement.value = '';
    this.groupCtrl.setValue(null);
    //this.getCommunityGroup();
  }

  // Add the trackGroup function
  trackGroup(index: number, group: any): any {
    return group; // or provide a unique identifier for tracking
  }

  // Add the trackMember function
  trackMember(index: number, member: any): any {
    return member; // or provide a unique identifier for tracking
  }


  getCommunityGroup(){
    const params= {
      data:{
        communityId: this.storageService.getLocalStorageItem('communtityId'),
      }
    }
    this.loaderService.show();
    this.apolloClient.setModule('getMyCommunityGroup').queryData(params).subscribe((response: GeneralResponse) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        this.getGroupData = response.data.groups ? response.data.groups : '';
        // if(this.eventId)
        // {
        //     this.getEventDetails();
        // }
        //console.log("getGroupData......",this.getGroupData);
        this.getGroupData.forEach((element:any,index:number) => {
          element.isDisabled = false;
        });
      }
    });
  }

  isOptionDisabled(index:number){
    this.getGroupData[index].isDisabled = true;
  }

  cancelGroup(groupData:any){
    const data1 = groupData.split('(')[0];
    const data2 = data1.split(')')[0];
    this.getGroupData.map((val:any,index:number)=>{
      if(val.name === data2){
        if(this.eventId && (this.getGroupData[index].id === val.id)){
          const params:any={};
          params['data']= {
            id: this.getGroupData[index].id,
            type: "group",
            eventId: this.eventId
          }
          this.removeGroupSubscriber = this.apolloClient.setModule('removeGroupOrMemberEvent').mutateData(params).subscribe({
            next:(response: GeneralResponse)=>{
              if(response.error){
                this.loaderService.hide();
                this.alertService.error(response.message);
                this.getGroupData[index].isDisabled = true;
              }
              else{
                this.loaderService.hide();
                this.alertService.error(response.message);
                this.getGroupData[index].isDisabled = false;
                this.remove(groupData);
              }
            },
            error: err =>{
              console.log(err);        
            }
          })
        }
        else{
          this.getGroupData[index].isDisabled = false;
          this.remove(groupData);
        }
      }
    })
  }

  getMemberList(){
    const params= {
      data:{
        communityId: this.storageService.getLocalStorageItem('communtityId'),
      }
    }
    this.loaderService.show();
    this.apolloClient.setModule('communityActivePassiveMemberList').queryData(params).subscribe((response: GeneralResponse) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        this.getMemberData = response.data?.members;
        if(this.eventId)
        {
            this.getEventDetails();
        }
        this.getMemberData.forEach((element:any,index:number) => {
          element.isMemberDisabled = false;
        });
      }
    });
  }
  
  isMemberOptionDisabled(index:number){
    this.getMemberData[index].isMemberDisabled = true;
  }

  cancelMember(memberData:any){
    const memberdata1 = memberData.split('(')[1];
    const memberdata2 = memberdata1.split(')')[0];
   
    this.getMemberData.map((value:any,index:number)=>{
      if(value?.members?.user?.phone === memberdata2){
        if(this.eventId && (this.getMemberData[index].id === value.id)){
          const params:any={};
          params['data']= {
            id: this.getMemberData[index].id,
            type: "member",
            eventId: this.eventId
          }
          this.removeGroupSubscriber = this.apolloClient.setModule('removeGroupOrMemberEvent').mutateData(params).subscribe({
            next:(response: GeneralResponse)=>{
              if(response.error){
                this.loaderService.hide();
                this.alertService.error(response.message);
                this.getMemberData[index].isMemberDisabled = true;
              }
              else{
                this.loaderService.hide();
                this.alertService.error(response.message);
                this.getMemberData[index].isMemberDisabled = false;
                this.removeMember(memberData);
              }
            },
            error: err =>{
              console.log(err);        
            }
          })
        }
        else{
          this.getMemberData[index].isMemberDisabled = false;
          this.removeMember(memberData);
        }
        //this.getMemberData[index].isMemberDisabled = false;
      }
    })
  }

  attendeesCountIncrement(){
    // this.attandanceCount++;
    this.attandanceCount = this.eventForm.value.attendanceCounts;
    this.attandanceCount++;
     this.eventForm.patchValue({
      attendanceCounts: this.attandanceCount
    })
  }

  attendeesCountDecrement(){
    //this.attandanceCount--;
    this.attandanceCount = this.eventForm.value.attendanceCounts;
    this.attandanceCount--;
     this.eventForm.patchValue({
      attendanceCounts: this.attandanceCount
    })
  }

  guestCountIncrement(){
    // this.attandanceCount++;
    this.guestCount = this.eventForm.value.numberOfMaxGuests;
    this.guestCount++;
     this.eventForm.patchValue({
      numberOfMaxGuests: this.guestCount
    })
  }

  guestCountDecrement(){
    //this.attandanceCount--;
    this.guestCount = this.eventForm.value.numberOfMaxGuests;
    this.guestCount--;
     this.eventForm.patchValue({
      numberOfMaxGuests: this.guestCount
    })
  }

  visitorsCountIncrement(){
    //this.visitorsCount++;
    this.visitorsCount = this.eventForm.value.webCount;
    this.visitorsCount++;
     this.eventForm.patchValue({
      webCount: this.visitorsCount
    })
  }

  visitorsCountDecrement(){
    // this.visitorsCount--;
    this.visitorsCount = this.eventForm.value.webCount;
    this.visitorsCount--;
     this.eventForm.patchValue({
      webCount: this.visitorsCount
    })
  }

  paymentSatusChange(event:any){
    this.paymentStatusValue = event.target.value;
    if (this.paymentStatusValue === 'Free'){
      this.paymentCategoryValue = [];
      this.eventForm.controls['paymentCategory'].setValue('');
    }
  }

  paymentSatusChanged(value:any){
    this.paymentStatusValue = value;
    if (this.paymentStatusValue === 'Free'){
      this.paymentCategoryValue = [];
      this.eventForm.controls['paymentCategory'].setValue('');
    }
  }

  paymentCategoryChange(event:any){
    this.paymentCategoryValue = event.target.value;
  }

  paymentCategoryChanged(value:any){
    this.paymentCategoryValue = value;
  }

  addFields(){
    const val = this.createPaymentPackage();
    this.paymentPackages.push(val);
  }

  createPaymentPackages() {
      return this.formBuilder.group({
        packageName: [''],
        packageRate: [''],
        currency: [this.getCurrency],
        packageLogo: [''],
        earlyBirdDate: [null],
        earlyBirdRate: [null]
      });
  }

  createPaymentPackage() {
    return this.formBuilder.group({
      packageName: [null],
      packageRate: [''],
      currency: [this.getCurrency],
      packageLogo: [null],
      earlyBirdDate: [null],
      earlyBirdRate: [null]
    });
}

  getInvitationTypeValue(event:any){
    if(event.target.value === "Private"){
      this.isPrivateInvitation = true;
      this.isShowWebVisitor = false;
      this.eventForm.controls['webvistorRestriction'].setValue(false);
      this.eventForm.controls['webCount'].setValue(0);
    }
    if(event.target.value === "Members"){
      this.isPrivateInvitation = false;
      this.isShowWebVisitor = false;
      this.eventForm.controls['webvistorRestriction'].setValue(false);
      this.eventForm.controls['webCount'].setValue(0);
    }
    if(event.target.value === "Public"){
      this.isPrivateInvitation = false;
      // this.isShowWebVisitor = true;
    }
    // else{
    //   this.isPrivateInvitation = false;
    // }
  }

  getInvitationTypeValues(value:any){
    if(value === "Private"){
      this.isPrivateInvitation = true;
    }
    else{
      this.isPrivateInvitation = false;
    }
  }


  removeDetails(i:any){
    // console.log("index........",i);
    this.paymentPackages.removeAt(i);
  }

  showWebVistor(event:any){
    if(event.target.checked === true){
      this.isShowWebVisitor = true;
    }
    else{
      this.isShowWebVisitor = false;
      this.eventForm.controls['webCount'].setValue(null);
    }
  }

  showMaxAttandace(event:any){
    if(event.target.checked === true){
      this.isShowMaxNumber = true;
    }
    else{
      this.isShowMaxNumber = false;
      this.eventForm.controls['attendanceCounts'].setValue(null);
    }
  }

  setEarlyBirdEndDate(event:any){
    const lastDay = event.target.value;
    const previousDay = new Date(lastDay);
    previousDay.setDate(previousDay.getDate() - 1)
    this.beforeDay = previousDay.toISOString().split('T')[0];
    if(this.paymentCategoryValue === "package_wise"){
      //this.alertService.error("Early Bird Date are applicable only between 'Event Start date' AND before 'RSVP end date'.");
      this.clearDate();
    }
    if(this.paymentCategoryValue === "per_head"){
      //this.alertService.error("Early Bird Date are applicable only between 'Event Start date' AND before 'RSVP end date'.");
      this.clearPackageDate();
    }
   
  }
  clearPackageDate(){
    const arrayVal1: FormArray = new FormArray<any>([]);
    let payVal1 = this.eventForm.value.paymentPackage;
    //console.log("payVal.....", payVal);
    if (payVal1.length) {
      payVal1.forEach((element: any, index: number) => {
        const PackagesFormVal1 = this.formBuilder.group({
          currency: [this.getCurrency],
          //packageName: [null],
          packageRate: [element?.packageRate],
          //packageLogo: [element?.packageLogo],
          earlyBirdRate: [element?.earlyBirdRate],
          earlyBirdDate: ['']
        });
        arrayVal1.push(PackagesFormVal1);
      });
      this.eventForm.setControl('paymentPackage', arrayVal1);
    }
  }
  clearDate(){
    const arrayVal: FormArray = new FormArray<any>([]);
    let payVal = this.eventForm.value.paymentPackages;
    //console.log("payVal.....", payVal);
    if (payVal.length) {
      payVal.forEach((element: any, index: number) => {
        const PackagesFormVal = this.formBuilder.group({
          currency: [this.getCurrency],
          packageName: [element?.packageName],
          packageRate: [element?.packageRate],
          packageLogo: [element?.packageLogo],
          earlyBirdRate: [element?.earlyBirdRate],
          earlyBirdDate: ['']
        });
        arrayVal.push(PackagesFormVal);
      });
      this.eventForm.setControl('paymentPackages', arrayVal);
    }
  }
}
