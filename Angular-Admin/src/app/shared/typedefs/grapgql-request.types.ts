import { GeneralResponse } from "../interfaces/general-response.ineterface";
// All types will return general response

export type GraphQLRequests = {
    /**auth................ */  
    getCountryCodes: GeneralResponse,
    registerByPhone: GeneralResponse,
    verifyOtp: GeneralResponse,
    resendOtp: GeneralResponse,
    logout: GeneralResponse,

    /**Communtity */
    switchOrganizationList: GeneralResponse,
    switchOrganiztionPortal: GeneralResponse,
    communityActivePassiveMemberList: GeneralResponse,
    communityActivePassiveMemberDetails: GeneralResponse,
    communityMemberStatusChange: GeneralResponse,
    deleteCommunityMember: GeneralResponse,
    editCurrency: GeneralResponse,
    
    /** On board passive members */
    findUserByPhoneMail:GeneralResponse,
    resendOnboardingInvitation: GeneralResponse,   
    onboardPassiveMember: GeneralResponse,
    getState: GeneralResponse,
    onboardExistUser: GeneralResponse,

    //invitation
    passiveUserInvitationDetails: GeneralResponse;
    updatePassiveUserInvitationDetails: GeneralResponse;
    invitationResponse: GeneralResponse;
    
   //Community Management
   getMyCommunitiesView: GeneralResponse ;
   updateCommunityView: GeneralResponse;

   //Global Settings
   addOrgGlobalSettings: GeneralResponse;
   // getMyCommunitiesSettingsView: GeneralResponse;

   //Edit Webpage
   updateCommunityAnnouncementSettings: GeneralResponse; 
   getAllAnnouncementOrganization: GeneralResponse;
   getMyCommunitiesSettingsView: GeneralResponse;
   getMyCommunityEvents: GeneralResponse;
   getAllEventPayment: GeneralResponse;
   getEventPaymentById: GeneralResponse;
   addOrUpdatepayment: GeneralResponse;
   getCommunityPayments: GeneralResponse;
   getCommunityBasicDetails: GeneralResponse;
   communityMemberRoleFilter: GeneralResponse;
   updateCommunityAboutUsSettings: GeneralResponse;
   
   //Webpage Settings
   getCommunityHomePageOverviewByID: GeneralResponse;
   updateHomePageOverview: GeneralResponse;
   getCommunityVideos: GeneralResponse;
   getMyCommunityGroup: GeneralResponse;
   addOrUpdateVideo: GeneralResponse;
   getVideoDetails: GeneralResponse;

   /*Group*/
   groupStatusChange: GeneralResponse,
   deleteMyCommunityGroup: GeneralResponse,
   myCommunityCreateGroup: GeneralResponse;
   getMyCommunityGroupByID: GeneralResponse;
   updateMyCommunityGroup: GeneralResponse;

   //Feedback
   getAllCommunityFeedbacks: GeneralResponse;
   viewedFeedbackStatus: GeneralResponse;
   communityReplyFeedback: GeneralResponse;
   
   //Event
   myCommunityEventStatusChange: GeneralResponse;
   myCommunitydeleteEvent: GeneralResponse,
   getMyCommunityEventByID: GeneralResponse;
   createMyCommunityEvent: GeneralResponse;
   myCommunityupdateEvent: GeneralResponse;
   createEvent: GeneralResponse;
   updateEvent: GeneralResponse; 
   
   //Dashboard
   getmyCommunityDashboardList: GeneralResponse;

   //Global Search
   myCommunityDotNetGlobalSearch: GeneralResponse;
   
   //announcement
   createAnnouncementOrganization: GeneralResponse;
   deleteAnnouncementOrganizaztion: GeneralResponse;
   getAnnouncementOrganizationByID: GeneralResponse;
   updateMyCommunityAnnouncement: GeneralResponse;
   myCommunityAnnouncementStatusChange: GeneralResponse;

   //Notification
   getAllNotifications: GeneralResponse;

   //Reset Video
   resetVideo: GeneralResponse;

   //Sign up
   userDotNetSignUp: GeneralResponse;

   //Event task management
   getUserVisibility: GeneralResponse;
   createEventTask: GeneralResponse;
   getAllEventTask: GeneralResponse;
   eventTaskStatusChange: GeneralResponse;
   getTaskStatusCounting: GeneralResponse;
   deleteEventTask: GeneralResponse;
   getEventTaskById: GeneralResponse;
   updateEventTask: GeneralResponse;
   assignMembers: GeneralResponse;
   deleteAssignMember: GeneralResponse;
   acceptOrRejectUserList: GeneralResponse;
   removeGroupOrMemberEvent: GeneralResponse;
   
   //Blog Management
   getAllBlogs: GeneralResponse;
   blogStatusChange: GeneralResponse;
   blogPaymentStatusChange: GeneralResponse;
   deleteBlogs: GeneralResponse;
   createBlogs: GeneralResponse;
   getBolgsById: GeneralResponse;
   updateblogs: GeneralResponse;
   getMyCommunityEventsForBlog: GeneralResponse;

   //Supplier Management
   getAllEventSupplierManagement: GeneralResponse;
   acceptOrRejectSupplierManagement: GeneralResponse;
   acceptOrRejectSupplierUserList: GeneralResponse;
   deleteEventSupplierManagement: GeneralResponse;
   assignSupplierMembers: GeneralResponse;
   deleteAssignSupplierMembers: GeneralResponse;
   updateEventSupplierManagement: GeneralResponse;
   createEventSupplierManagement: GeneralResponse;
   getEventSupplierById: GeneralResponse;
   getSupplierStatusCounting: GeneralResponse;
   
   //Memory Management
   getAllUploadImage: GeneralResponse;
   getUploadImageListCounting: GeneralResponse;
   uploadImage: GeneralResponse;
   approveOrRejectImage: GeneralResponse;
   imageStatusChange: GeneralResponse;

   //Emial Verification
   verifyCommunityEmail: GeneralResponse;
   verifyCommunityOTP: GeneralResponse;
   
   //payment management
   updateEventPayment: GeneralResponse;
   deleteEventPayment: GeneralResponse;

   //Login user management
   getLoggedInUsers: GeneralResponse;
}