import { TypedDocumentNode, ResultOf, VariablesOf } from "apollo-angular";
export interface ModuleKeyType {
    //auth
    'getCountryCodes': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'registerByPhone': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'verifyOtp': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'resendOtp': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'logout':TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    
    //communitity
    'switchOrganizationList': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'switchOrganiztionPortal': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'communityActivePassiveMemberList': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'communityActivePassiveMemberDetails': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'communityMemberStatusChange': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'deleteCommunityMember': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'editCurrency': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    
    //onBoard passive member
    'findUserByPhoneMail': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'resendOnboardingInvitation': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'onboardPassiveMember': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getState': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'onboardExistUser': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //invitation 
    'passiveUserInvitationDetails': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'updatePassiveUserInvitationDetails': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'invitationResponse': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getMyCommunitiesView': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'updateCommunityView': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //global settings
    'addOrgGlobalSettings': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getMyCommunitiesSettingsView': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //edit webpage
    'updateCommunityAnnouncementSettings': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getAllAnnouncementOrganization': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getMyCommunityEvents': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getAllEventPayment': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getEventPaymentById': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'addOrUpdatepayment': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getCommunityPayments': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getCommunityBasicDetails': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'communityMemberRoleFilter': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'updateCommunityAboutUsSettings': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    
    //Webpage Settings
    'getCommunityHomePageOverviewByID': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'updateHomePageOverview': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getCommunityVideos': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getMyCommunityGroup': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'addOrUpdateVideo': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getVideoDetails': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Group
    'groupStatusChange': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'deleteMyCommunityGroup': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'myCommunityCreateGroup': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getMyCommunityGroupByID': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'updateMyCommunityGroup': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Feedback
    'getAllCommunityFeedbacks': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'viewedFeedbackStatus': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'communityReplyFeedback': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Event
    'myCommunityEventStatusChange': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'myCommunitydeleteEvent': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getMyCommunityEventByID': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'createMyCommunityEvent': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'myCommunityupdateEvent': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'createEvent': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'updateEvent': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    //Dashboard
    'getmyCommunityDashboardList': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Global Search
    'myCommunityDotNetGlobalSearch': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    
    //Announcement
    'createAnnouncementOrganization': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'deleteAnnouncementOrganizaztion': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getAnnouncementOrganizationByID': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'updateMyCommunityAnnouncement': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'myCommunityAnnouncementStatusChange': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Notificaation
    'getAllNotifications': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Reset Video
    'resetVideo': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Sign up
    'userDotNetSignUp': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Event task management
    'getUserVisibility': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'createEventTask': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getAllEventTask': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'eventTaskStatusChange': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getTaskStatusCounting': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'deleteEventTask': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getEventTaskById': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'updateEventTask': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'assignMembers': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'deleteAssignMember': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'acceptOrRejectUserList': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'removeGroupOrMemberEvent': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    
    //Blog management
    'getAllBlogs': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'blogStatusChange': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'blogPaymentStatusChange': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'deleteBlogs': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'createBlogs': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getBolgsById': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'updateblogs': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getMyCommunityEventsForBlog': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Supplier management
    'getAllEventSupplierManagement': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'acceptOrRejectSupplierManagement': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'acceptOrRejectSupplierUserList': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'deleteEventSupplierManagement': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'assignSupplierMembers': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'deleteAssignSupplierMembers': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'updateEventSupplierManagement': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'createEventSupplierManagement': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getEventSupplierById': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getSupplierStatusCounting': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Memory Management
    'getAllUploadImage': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'getUploadImageListCounting': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'uploadImage': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'approveOrRejectImage': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'imageStatusChange': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Email Verification
    'verifyCommunityEmail': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'verifyCommunityOTP': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    
    //payment module
    'updateEventPayment': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
    'deleteEventPayment': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;

    //Login user management
    'getLoggedInUsers': TypedDocumentNode<ResultOf<any>, VariablesOf<any>>;
}