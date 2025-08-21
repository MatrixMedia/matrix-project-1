import { Apollo, gql } from 'apollo-angular';
import { ModuleKeyType } from '../interfaces/module-key-type.interface';

export const query_modules:ModuleKeyType = {
  /*auth........................*/
  //Login
  registerByPhone: gql`mutation RegisterByPhone($data: InputUser) {
      registerByPhone(data: $data) {
        data {
          login
          token {
            refreshToken
            accessToken
          }
          phone
        }
        code
        message
        systemCode
        error
      }
    }`,
  //Get Country List
  getCountryCodes: gql`query GetCountryCodes {
        getCountryCodes {
            error
            systemCode
            code
            message
            data {
              name
              dialCode
              code
              flag
            }
        }
    }`,
  //Send Otp
  // verifyOtp: gql`mutation($data: OtpInput){
  //     verifyOtp(data:$data) {
  //         code
  //         error
  //         message
  //         systemCode
  //         data {
  //             token {
  //                 accessToken
  //                 refreshToken
  //             }
  //             status
  //             causeOfAction
  //             user{
  //                 name
  //                 email
  //                 phone
  //             }
  //             role
  //             roleKey
  //             communityName
  //             communityId
  //         }
  //     }
  // }`,
  verifyOtp: gql`mutation VerifyOtp($data: OtpInput) {
      verifyOtp(data: $data) {
        error
        systemCode
        code
        message
        data {
          status
          causeOfAction
          token {
            refreshToken
            accessToken
          }
          user {
            phoneCode
            countryCode
            userType
            profileImage
            gender
            dateOfBirth {
              isMasked
              value
            }
            name
            id
            email
            phone
            selectedCommunity
          }
          role
          roleKey
          communityName
          communityId
          orgCurrency
        }
      }
    }`,

  // resendOtp: gql`mutation($data:ResendOtp) {
  //     resendOtp(data:$data) {
  //         code
  //         error
  //         message
  //         systemCode
  //     }
  // }`,
  resendOtp: gql`mutation($data:ResendOtp) {
      resendOtp(data:$data) {
          code
          error
          message
          systemCode
          data{
              status
              token {
                  accessToken
                  refreshToken
              }
              causeOfAction
          }
      }
  }`,
  //Logout
  logout: gql`mutation Logout {
        logout {
            code
            error
            systemCode
            message
        }
    }`,


  /**Communitity....................... */
  //Communtity List
  switchOrganizationList: gql`query SwitchOrganizationList {
        switchOrganizationList {
          error
          code
          systemCode
          message
          data {
            id
            logoImage
            communityName
            communityDescription
            role
          }
        }
      }`,

  //Switch Communtity
  switchOrganiztionPortal: gql`mutation SwitchOrganiztionPortal($data: GeneralIdInput) {
      switchOrganiztionPortal(data: $data) {
        code
        error
        systemCode
        message
      }
    }`,

  communityMemberStatusChange: gql`mutation CommunityMemberStatusChange($data: communityMemberStatusChange) {
      communityMemberStatusChange(data: $data) {
        code
        error
        systemCode
        message
      }
    }`,

  deleteCommunityMember: gql`mutation DeleteCommunityMember($data: DeleteCommunityMemberInput) {
      deleteCommunityMember(data: $data) {
        code
        error
        message
        systemCode
      }
    }`,


  //Community Active member list
  // communityActivePassiveMemberList: gql`query CommunityActivePassiveMemberList($data: CommunityActivePassiveMemberInput) {
  //   communityActivePassiveMemberList(data: $data) {
  //     error
  //     code
  //     systemCode
  //     message
  //     data {
  //       id
  //       communityName
  //       members {
  //         memberId
  //         roles
  //         joinedAt
  //         isActive
  //         user {
  //           id
  //           name
  //           email
  //           phone
  //           profileImage
  //         }
  //       }
  //     }
  //   }
  // }`,
  communityActivePassiveMemberList: gql`query CommunityActivePassiveMemberList($data: CommunityActivePassiveMemberInput) {
      communityActivePassiveMemberList(data: $data) {
        data {
          total
          from
          to
          members {
            id
            communityName
            isResend
            members {
              memberId
              roles
              joinedAt
              isActive
              user {
                profileImage
                lastActivityAt
                phone
                email
                name
                id
              }
              acknowledgementDate
              invitationDate
              acknowledgementStatus
              isActiveDeletePermission
            }
          }
        }
        error
        code
        systemCode
        message
      }
    }`,

  //Community Active member Details
  communityActivePassiveMemberDetails: gql`query CommunityActivePassiveMemberDetails($data: communityActivePassiveMemberDetailsInput) {
      communityActivePassiveMemberDetails(data: $data) {
        error
        systemCode
        code
        message
        data {
          filterFamilymembers {
            id
            userId
            memberName
            relationType
            ageOfMinority
            memberImage
            phone
            email
            gender
            phoneCode
            countryCode
            yearOfBirth
          }
          role
          user {
            id
            name
            email
            phone
            countryCode
            phoneCode
            profileImage
            userType
            isEmailVerified
            isPhoneVerified
            address
            firstAddressLine
            secondAddressLine
            country
            city
            state
            zipcode
            latitude
            longitude
            dateOfBirth {
              value
              isMasked
            }
            yearOfBirth
            isMasked
            gender
            hobbies
            areaOfWork
            profession
            aboutYourself
            familyMembers {
              id
              userId
              ageOfMinority
              relationType
              memberName
              memberImage
              phone
              email
              gender
              phoneCode
              countryCode
              yearOfBirth
            }
            contacts {
              id
              userId
              contactName
              contactImage
              contactPhone
              isDeleted
              user {
                contact {
                  first_address_line
                  second_address_line
                  city
                  state
                  zipcode
                  latitude
                  longitude
                }
              }
            }
            selectedCommunity
            isActive
            lastActivityAt
            language
          }
          totalFamilyMembers
        }
      }
    }`,

  findUserByPhoneMail: gql`query FindUserByPhoneMail($data: InputfindUserByPhoneMail) {
      findUserByPhoneMail(data: $data) {
        error
        systemCode
        code
        message
        data {
          isActiveUser
          isPassiveUser
          user {
            isActive
            selectedCommunity
            contacts {
              user {
                contact {
                  longitude
                  latitude
                  zipcode
                  state
                  city
                  second_address_line
                  first_address_line
                }
              }
              isDeleted
              contactPhone
              contactImage
              contactName
              userId
              id
            }
            familyMembers {
              countryCode
              phoneCode
              phone
              memberImage
              id
              userId
              ageOfMinority
              relationType
              memberName
            }
            aboutYourself
            profession
            areaOfWork
            gender
            hobbies
            isMasked
            dateOfBirth {
              value
              isMasked
            }
            longitude
            latitude
            zipcode
            state
            city
            secondAddressLine
            firstAddressLine
            address
            isPhoneVerified
            isEmailVerified
            userType
            profileImage
            phoneCode
            countryCode
            phone
            email
            name
            id
          }
        }
      }
    }`,

  //Resend Invitation
  resendOnboardingInvitation: gql`mutation ResendOnboardingInvitation($data: GeneralIdInput) {
      resendOnboardingInvitation(data: $data) {
        code
        error
        systemCode
        message
      }
    }`,

  //Add onboard passive member
  onboardPassiveMember: gql`mutation OnboardPassiveMember($data: InputPassiveMemberOnboard) {
      onboardPassiveMember(data: $data) {
        code
        error
        systemCode
        message
      }
    }`,
  passiveUserInvitationDetails: gql`query PassiveUserInvitationDetails($data: InputPassiveUserInvitationDetails) {
      passiveUserInvitationDetails(data: $data) {
        error        
        systemCode
        code
        message
        data {

          communityDetails {
            id
            communityName
            address {
              firstAddressLine
              secondAddressLine
              city
              state
              country
              zipcode
            }
            members {
              memberId
              invitationDate
              roleName
            }
          }
          userDetails {
            id
            name
            language
            email
            phone
            countryCode
            phoneCode
            profileImage
            userType
            firstAddressLine
            secondAddressLine
            city
            state
            zipcode
            country
            latitude
            longitude
            dateOfBirth {
              value
              isMasked
            }
            isMasked
            gender
            hobbies
            areaOfWork
            profession
            aboutYourself
            familyMembers {
              id
              userId
              ageOfMinority
              relationType
              memberName
              memberImage
              phone
              phoneCode
              countryCode
            }
          }
          orgAdminDetails {
            id
            name
          }
          emailSmsPreferences {
            smsAnnouncement
            emailAnnouncement
            smsEvent
            emailEvent
          }
          invitationType
        }
      }
    }`,
  //Get State
  getState: gql`query GetState($data: InputStateList) {
      getState(data: $data) {
        error
        systemCode
        code
        message
        data {
          name
          countryId
          countryCode
          stateCode
          latitude
          longitude
        }
      }
    }`,

  //On Board Existing User
  onboardExistUser: gql`mutation OnboardExistUser($data: InputOnboardExistUser) {
    onboardExistUser(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,
  updatePassiveUserInvitationDetails: gql`mutation UpdatePassiveUserInvitationDetails($data: InputPassiveUserInvitationUpdate) {
    updatePassiveUserInvitationDetails(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,
  invitationResponse: gql`mutation InvitationResponse($data: InputInvitationResponse) {
    invitationResponse(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  getMyCommunitiesView: gql`query GetMyCommunitiesView {
    getMyCommunitiesView {
      error
      systemCode
      code
      message
      data {
        myCommunities {
          id
          logoImage
          communityName
          communityDescription
          communityLocation {
            longitude
            latitude
            location
          }
          address {
            zipcode
            country
            state
            city
            secondAddressLine
            firstAddressLine
          }
          communityEmail
          communityNumber
          communityPhoneCode
          nonProfit
          nonProfitTaxId
          communityEmailApproval
        }
      }
    }
  }`,

  updateCommunityView: gql`mutation UpdateCommunityView($data: CommunityViewInput) {
    updateCommunityView(data: $data) {
      id
      error
      code
      systemCode
      message
    }
  }`,

  addOrgGlobalSettings: gql`mutation AddOrgGlobalSettings($data: OrgGlobalSettingsInput) {
    addOrgGlobalSettings(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  getMyCommunitiesSettingsView: gql`query GetMyCommunitiesSettingsView($data: InputCommunitiesSettingsView) {
    getMyCommunitiesSettingsView(data: $data) {
      error
      systemCode
      code
      message
      data {
        id
        communityId
        publicityPage
        freezePane
        homePage
        announcementPage
        videoPage
        paymentPage
        aboutPage
        lebel
        slug
        watermark
        headerFont
        headerFontSize
        bodyFont
        bodyFontSize
        textColor
        backgroupColor
        announcementSettings {
          showPublicAnnouncement
          showMemberAnnouncement
          showPublicEvents
          showPastEvents
          showMembersOnlyEvents
        }
        aboutUsSettings {
          showOrganizationDescription
          showOrganizationAddress
          showBoardMembers
          showExecutiveMembers
          showContactEmailPublicly
          showContactPhonePublicly
          boardMembersLabelName
          executiveMembersLabelName
        }
      }
    }
  }`,
  updateCommunityAnnouncementSettings: gql`mutation UpdateCommunityAnnouncementSettings($data: InputCommunityAnnouncementSettings) {
    updateCommunityAnnouncementSettings(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,
  getCommunityHomePageOverviewByID: gql`query GetCommunityHomePageOverviewByID($data: OrgPortalCommunityInput) {
    getCommunityHomePageOverviewByID(data: $data) {
      error
      systemCode
      code
      message
      data {
        id
        bannerImage
        logoImage
        communityDescription
      }
    }
  }`,

  updateHomePageOverview: gql`mutation UpdateHomePageOverview($data: InputHomePageOverview) {
    updateHomePageOverview(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  getCommunityVideos: gql`query GetCommunityVideos($data: OrgPortalCommunityInput) {
  getCommunityVideos(data: $data) {
    systemCode
    message
    error
    code
    data {
      id
      communityId
      title
      description
      thumbnailImage
      link
      orderNo
      isApproved
      type
      duration
      createdAt
    }
  }
}`,

  getMyCommunityEvents: gql `query GetMyCommunityEvents($data: AllEventsSearchField) {
    getMyCommunityEvents(data: $data) {
      error
      systemCode
      code
      message
      data {
        total
        from
        to
        events {
          id
          hostId
          postEventAsCommunity
          type
          title
          description
          image
          logoImage
          venueDetails {
            firstAddressLine
            secondAddressLine
            city
            state
            country
            zipcode
            phoneNo
            phoneCode
          }
          invitationType
          rsvpEndTime
          date {
            from
            to
          }
          time {
            from
            to
          }
          attendees {
            isRestricted
            numberOfMaxAttendees
            attendeesListVisibility
            mediaUploadByAttendees
          }
          isActive
          createdAt
          community {
            id
            communityName
          }
        }
      }
    }
  }`,

   getAllEventPayment : gql `query GetAllEventPayment($data: EventPaymentFindInput) {
    getAllEventPayment(data: $data) {
      error
      code
      systemCode
      message
      data {
        total
        from
        to
        payment {
          id
          userId
          email
          phoneCode
          phone
          memberType
          createdAt
          amount
          currency
          noOfAttendees
          paymentMode
          rsvpStatus
        }
      }
    }
  }`,

  getEventPaymentById : gql `query GetEventPaymentById($data: EventPaymentByIdFindInput) {
    getEventPaymentById(data: $data) {
      error
      code
      systemCode
      message
      data {
        paymentStatus
        amount
        transactionAmount
        gatewayChargeCost
        actualPaymentmtount
        paymentMode
        checkNo
        transactionId
        description
        cardNo
        currency
        createdAt
        userName
      }
    }
  }`,

  getAllAnnouncementOrganization: gql `query GetAllAnnouncementOrganization($data: AllAnnouncementSearchField) {
    getAllAnnouncementOrganization(data: $data) {
      error
      systemCode
      code
      message
      data {
         total
         from
         to
        announcements {
          id
          userId
          title
          description
          endDate
          toWhom
          isActive
          community {
            communityName
          }
        }
      }
    }
  }`,

  getMyCommunityGroup: gql`query GetMyCommunityGroup($data: InputCommunityId) {
    getMyCommunityGroup(data: $data) {
      error
      systemCode
      code
      message
      data {
        total
        to
        from
        loggeduser
        groups {
          id
          name
          description
          image
          type
          createdBy
          communityId
          isActive
          memberCount
          community {
            communityName
          }
          user {
            name
          }
        }
      }
    }
  }`,

  addOrUpdatepayment: gql`mutation AddOrUpdatepayment($data: InputPayment) {
    addOrUpdatepayment(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  getCommunityPayments: gql`query GetCommunityPayments($data: GeneralIdGetInput) {
    getCommunityPayments(data: $data) {
      error
      systemCode
      code
      message
      data {
        id
        communityId
        qrcodeImage
        bankcheckImage
        bankcheckImageName
        paymentDescription
        authorityName
        link
        otherpaymentLink
      }
    }
  }`,

  addOrUpdateVideo: gql`mutation AddOrUpdateVideo($data: [InputVideo]) {
    addOrUpdateVideo(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  getVideoDetails: gql`query GetVideoDetails($data: LinkInput) {
    getVideoDetails(data: $data) {
      systemCode
      message
      error
      data {
        type
        thumbnailImage
        title
        link
        description
        duration
      }
      code
    }
  }`,

  getCommunityBasicDetails: gql`query GetCommunityBasicDetails($data: InputGetCommunityBasicDetails) {
    getCommunityBasicDetails(data: $data) {
      error
      systemCode
      code
      message
      data {
        id
        communityName
        communityType
        nonProfit
        communityDescription
        communityEmail
        communityPhoneCode
        communityNumber
        communityLocation
        communityDescriptionApproval
        communityEmailApproval
        communityNumberApproval
        locationApproval
      }
    }
  }`,

  communityMemberRoleFilter: gql`query CommunityMemberRoleFilter($data: CommunityMemberRoleFilterInput) {
    communityMemberRoleFilter(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
        communityName
        communityRole
        members {
          memberId
          roles
          joinedAt
          isAdminApproved
          isActive
          isActiveDeletePermission
          user {
            id
            name
            email
            phone
            profileImage
            lastActivityAt
          }
          acknowledgementStatus
          acknowledgementDate
          invitationDate
        }
      }
    }
  }`,

  updateCommunityAboutUsSettings: gql`mutation UpdateCommunityAboutUsSettings($data: InputCommunityAboutUsSettings) {
    updateCommunityAboutUsSettings(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  /*
  *   Group
  */

  groupStatusChange: gql`mutation GroupStatusChange($groupStatusChangeId: String!) {
    groupStatusChange(id: $groupStatusChangeId) {
      code
      error
      systemCode
      message
    }
  }`,

  deleteMyCommunityGroup: gql`mutation DeleteMyCommunityGroup($data: GeneralIdInput) {
    deleteMyCommunityGroup(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  myCommunityCreateGroup: gql`mutation MyCommunityCreateGroup($data: InputCreateGroup) {
    myCommunityCreateGroup(data: $data) {
      error
      systemCode
      code
      message
      data {
        id
      }
    }
  }`,

  getMyCommunityGroupByID: gql`query GetMyCommunityGroupByID($getMyCommunityGroupByIdId: ID) {
    getMyCommunityGroupByID(id: $getMyCommunityGroupByIdId) {
      error
      systemCode
      code
      message
      data {
        name
        description
        image
        type
        myCommunity {
          communityName
          communityDescription
        }
      }
    }
  }`,

  updateMyCommunityGroup: gql`mutation UpdateMyCommunityGroup($updateMyCommunityGroupId: String!, $data: UpdateMycommunityGroupField) {
    updateMyCommunityGroup(id: $updateMyCommunityGroupId, data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  getAllCommunityFeedbacks: gql`query GetAllCommunityFeedbacks($data: FeedbackSearchField) {
    getAllCommunityFeedbacks(data: $data) {
      error
      systemCode
      code
      message
      data {
        total
        from
        to
        communityfeedbacks {
          id
          email
          message
          messageStatus
          createdAt
        }
      }
    }
  }`,
  /*
  *   Event
  */

  myCommunityEventStatusChange: gql`mutation MyCommunityEventStatusChange($myCommunityEventStatusChangeId: String!) {
    myCommunityEventStatusChange(id: $myCommunityEventStatusChangeId) {
      code
      error
      systemCode
      message
    }
  }`,

  myCommunitydeleteEvent: gql`mutation MyCommunitydeleteEvent($myCommunitydeleteEventId: String!) {
    myCommunitydeleteEvent(id: $myCommunitydeleteEventId) {
      error
      systemCode
      code
      message
    }
  }`,
  // getMyCommunityEventByID: gql`query GetMyCommunityEventByID($getMyCommunityEventByIdId: ID) {
  //   getMyCommunityEventByID(id: $getMyCommunityEventByIdId) {
  //     error
  //     systemCode
  //     code
  //     message
  //     data {
  //       id
  //       hostId
  //       postEventAsCommunity
  //       type
  //       title
  //       description
  //       image
  //       logoImage
  //       venueDetails {
  //         firstAddressLine
  //         secondAddressLine
  //         city
  //         state
  //         country
  //         zipcode
  //         phoneNo
  //         phoneCode
  //       }
  //       invitationType
  //       rsvpEndTime
  //       date {
  //         from
  //         to
  //       }
  //       time {
  //         from
  //         to
  //       }
  //       attendees {
  //          numberOfMaxAttendees
  //         attendeesListVisibility
  //         mediaUploadByAttendees
  //         isRestricted
  //       }
  //       isActive
  //     }
  //   }
  // }`,

  viewedFeedbackStatus: gql`mutation ViewedFeedbackStatus($data: GeneralIdInput) {
    viewedFeedbackStatus(data: $data) {
      systemCode
      message
      error
      code
    }
  }`,

  communityReplyFeedback: gql`mutation CommunityReplyFeedback($data: ReplyInput) {
    communityReplyFeedback(data: $data) {
      systemCode
      message
      error
      code
    }
  }`,
  createMyCommunityEvent: gql`mutation CreateMyCommunityEvent($data: MyCommunityEventInput) {
    createMyCommunityEvent(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
      }
    }
  }`,
  myCommunityupdateEvent: gql`mutation MyCommunityupdateEvent($data: UpdateEvent) {
    myCommunityupdateEvent(data: $data) {
      error
      systemCode
      code
      message
    }
  }
  `,

  createEvent: gql`mutation CreateEvent($data: EventInput) {
    createEvent(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
      }
    }
  }`,

  updateEvent: gql`mutation UpdateEvent($data: UpdateEvent) {
    updateEvent(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  //Dashboard
  getmyCommunityDashboardList: gql`query GetmyCommunityDashboardList($data: GeneralIdInput) {
    getmyCommunityDashboardList(data: $data) {
      error
      systemCode
      code
      message
      data {
        myCommunitieDasboard {
          peopleCount
          groupCount
          eventCount
          announcementCount
        }
        events {
          date {
            from
            to
          }
          time {
            from
            to
          }
          invitationType
          hostId
          id
          image
          logoImage
          isActive
          role
          title
          type
          description
        }
        announcements {
          communityId
          description
          endDate
          id
          title
          isActive
          toWhom
        }
      }
    }
  }`,
  //announcement 
  createAnnouncementOrganization: gql`mutation CreateAnnouncementOrganization($data: InputAnnouncementOrganization) {
    createAnnouncementOrganization(data: $data) {
      error
      systemCode
      code
      message
      data {
        id
      }
    }
  }`,
  deleteAnnouncementOrganizaztion: gql`mutation DeleteAnnouncementOrganizaztion($deleteAnnouncementOrganizaztionId: String!) {
    deleteAnnouncementOrganizaztion(id: $deleteAnnouncementOrganizaztionId) {
      error
      systemCode
      code
      message
    }
  }`,
  getAnnouncementOrganizationByID: gql`query GetAnnouncementOrganizationByID($getAnnouncementOrganizationByIdId: ID) {
    getAnnouncementOrganizationByID(id: $getAnnouncementOrganizationByIdId) {
      error
      systemCode
      code
      message
      data {
        id
        userId
        title
        description
        endDate
        toWhom
        communityId
        isActive
      }
    }
  }`,
  updateMyCommunityAnnouncement: gql`mutation UpdateMyCommunityAnnouncement($updateMyCommunityAnnouncementId: String!, $data: UpdateAnnouncement) {
    updateMyCommunityAnnouncement(id: $updateMyCommunityAnnouncementId, data: $data) {
      error
      systemCode
      code
      message
    }
  }
  `,
  myCommunityAnnouncementStatusChange: gql`mutation MyCommunityAnnouncementStatusChange($myCommunityAnnouncementStatusChangeId: String!) {
    myCommunityAnnouncementStatusChange(id: $myCommunityAnnouncementStatusChangeId) {
      code
      error
      systemCode
      message
    }
  }`,

  //Global Search
  myCommunityDotNetGlobalSearch :gql`query MyCommunityDotNetGlobalSearch($data: InputGlobalSearch) {
    myCommunityDotNetGlobalSearch(data: $data) {
      error
      systemCode
      code
      message
      data {
        announcements {
          id
          userId
          title
          description
          endDate
          toWhom
          communityId
          isActive
          community {
            id
            ownerId
            communityType
            emailCreditsRemaining
            smsCreditsRemaining
            bannerImage
            communityName
            communityDescription
            communityLocation {
              location
              latitude
              longitude
            }
            address {
              firstAddressLine
              secondAddressLine
              city
              state
              country
              zipcode
            }
            nonProfit
            nonProfitTaxId
            members {
              memberId
              roles
              isApproved
              isRejected
              memberPromotion {
                type
                date
                status
                authorizePersonId
              }
              isActive
              isDeleted
              isLeaved
              joinedAt
              updatedAt
              leaveAt
              isAcknowledge
              invitationDate
              roleName
            }
            currentlySelected
            isActive
            isDeleted
            expiredAt
            createdAt
            updatedAt
            ownerDetails {
              id
              name
              email
              phone
              image
            }
            memberCount
            groupCount
            isFeatured
            communitySettings {
              id
              communityId
              publicityPage
              freezePane
              homePage
              announcementPage
              videoPage
              paymentPage
              aboutPage
              lebel
              slug
              watermark
              headerFont
              headerFontSize
              bodyFont
              bodyFontSize
              textColor
              backgroupColor
              announcementSettings {
                showPublicAnnouncement
                showMemberAnnouncement
                showPublicEvents
                showPastEvents
                showMembersOnlyEvents
              }
              aboutUsSettings {
                showOrganizationDescription
                showOrganizationAddress
                showBoardMembers
                showExecutiveMembers
                showContactEmailPublicly
                showContactPhonePublicly
                boardMembersLabelName
                executiveMembersLabelName
              }
            }
          }
          user {
            id
            name
            email
            phone
            countryCode
            phoneCode
            profileImage
            userType
            isEmailVerified
            isPhoneVerified
            address
            firstAddressLine
            secondAddressLine
            country
            city
            state
            zipcode
            latitude
            longitude
            dateOfBirth {
              value
              isMasked
            }
            yearOfBirth
            isMasked
            gender
            hobbies
            areaOfWork
            profession
            aboutYourself
            familyMembers {
              id
              userId
              ageOfMinority
              relationType
              memberName
              memberImage
              phone
              email
              gender
              phoneCode
              countryCode
              yearOfBirth
            }
            contacts {
              id
              userId
              contactName
              contactImage
              contactPhone
              isDeleted
            }
            selectedCommunity
            isActive
            lastActivityAt
            language
          }
        }
        communityfeedbacks {
          id
          email
          message
          messageStatus
          createdAt
        }
        events {
          id
          hostId
          communityId
          groupId
          category
          postEventAsCommunity
          type
          title
          description
          image
          logoImage
          venueDetails {
            firstAddressLine
            secondAddressLine
            city
            state
            country
            zipcode
            phoneNo
            phoneCode
          }
          invitationType
          rsvpEndTime
          date {
            from
            to
          }
          time {
            from
            to
          }
          rsvp {
            userId
            status
            guests {
              adults
              minor
              total
              familyMembers {
                userId
                name
                relation
              }
            }
            createdAt
            updatedAt
          }
          attendees {
            isRestricted
            numberOfMaxAttendees
            additionalGuests
            numberOfMaxGuests
            attendeesListVisibility
            mediaUploadByAttendees
            isActive
            isDeleted
            createdAt
            updatedAt
          }
          isJoined
          isActive
          role
        }
        groups {
          total
          groupList {
            id
            name
            description
            image
            type
            createdBy
            communityId
            isActive
            members {
              memberId
              roles
              isApproved
              isRejected
              isActive
              isDeleted
              isLeaved
            }
            memberCount
            community {
              communityName
            }
          }
        }
        videos {
          id
          communityId
          title
          description
          thumbnailImage
          link
          orderNo
          isApproved
          type
          duration
          createdAt
        }
        members {
          id
          communityName
          members {
            memberId
            roles
            joinedAt
            isAdminApproved
            isActive
            isActiveDeletePermission
            user {
              id
              name
              email
              phone
              profileImage
              lastActivityAt
            }
            acknowledgementStatus
            acknowledgementDate
            invitationDate
          }
          isResend
        }
      }
    }
  }`,

  //Notification
  getAllNotifications: gql`query GetAllNotifications($data: GroupSearchField) {
    getAllNotifications(data: $data) {
      error
      systemCode
      code
      message
      data {
        total
        notifications {
          id
          userId
          subject
          image
          text
          type
          sentAt
          deviceType
          domains
        }
      }
    }
  }`,

  //Reset video
  resetVideo: gql`mutation ResetVideo($data: GeneralIdInput) {
    resetVideo(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  userDotNetSignUp: gql`mutation UserDotNetSignUp($data: DotNetSignUpInput) {
    userDotNetSignUp(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  getUserVisibility: gql`query GetUserVisibility($data: InputEventTaskId) {
    getUserVisibility(data: $data) {
      error
      systemCode
      code
      message
      data {
        rsvpStatus
        id
        age
        isAssigned
        name
        number
        type
        profileImage
      }
    }
  }`,

  createEventTask: gql`mutation CreateEventTask($data: EventTaskInput) {
    createEventTask(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
      }
    }
  }`,

  getAllEventTask: gql`query GetAllEventTask($data: EventTaskFindInput) {
    getAllEventTask(data: $data) {
      error
      systemCode
      code
      message
      data {
        total
        from
        to
         tasks {
          id
          eventId
          taskName
          requireTeam
          taskDescription
          teamSize {
            adult
            teenager
            children
          }
          priority
          taskStartDate
          taskDeadline
          time {
            from
            to
          }
          isDone
          assignedMembersCount
          assignedMembers {
            userId
            type
            isDeleted
            name
            invitedBy
            profileImage
          }
        }
      }
    }
  }`,

  eventTaskStatusChange: gql`mutation EventTaskStatusChange($eventTaskStatusChangeId: String!) {
    eventTaskStatusChange(id: $eventTaskStatusChangeId) {
      code
      error
      systemCode
      message
    }
  }`,

  getTaskStatusCounting: gql`query GetTaskStatusCounting($data: EventTaskFindInput) {
    getTaskStatusCounting(data: $data) {
      error
      systemCode
      code
      message
      data {
        openTask
        assignedTask
        pastTask
        closedTask
      }
    }
  }`,

  deleteEventTask: gql`mutation DeleteEventTask($data: DeleteEventTaskInput) {
    deleteEventTask(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  getEventTaskById: gql`query GetEventTaskById($data: EventTaskByIdFindInput) {
    getEventTaskById(data: $data) {
      error
      systemCode
      code
      message
      data {
        tasks {
          id
          eventId
          eventName
          taskName
          priority
          taskDescription
          taskStartDate
          taskDeadline
          requireTeam
          isDone
          teamSize {
            adult
            teenager
            children
          }
          time {
            from
            to
          }
        }
      }
    }
  }`,

  updateEventTask: gql`mutation UpdateEventTask($data: UpdareEventTaskInput) {
    updateEventTask(data: $data) {
      error
      systemCode
      code
      message
      data {
        id
      }
    }
  }`,

  assignMembers: gql`mutation AssignMembers($data: assignMembersInput) {
    assignMembers(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
      }
    }
  }`,

  deleteAssignMember: gql`mutation DeleteAssignMember($data: deletedInput) {
    deleteAssignMember(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  getAllBlogs: gql`query GetAllBlogs($data: BlogsFindInput) {
    getAllBlogs(data: $data) {
      error
      code
      systemCode
      message
      data {
        total
        from
        to
        blogs {
          id
          postedBy
          thumbnailImage
          image
          pdf
          blogTitle
          blogCategory
          blogDescription
          blogStatus
          paymentStatus
          createdAt
        }
      }
    }
  }`,

  blogStatusChange: gql`mutation BlogStatusChange($data: BlogsFindByIdInput!) {
    blogStatusChange(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  blogPaymentStatusChange: gql`mutation BlogPaymentStatusChange($data: BlogsFindByIdInput!) {
    blogPaymentStatusChange(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  deleteBlogs: gql`mutation DeleteBlogs($data: BlogsFindByIdInput) {
    deleteBlogs(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  createBlogs: gql`mutation CreateBlogs($data: BlogsInput) {
    createBlogs(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
      }
    }
  }`,

  getBolgsById: gql`query GetBolgsById($data: BlogsFindByIdInput) {
    getBolgsById(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
        eventId
        thumbnailImage
        image
        pdf
        blogTitle
        blogCategory
        blogDescription
        blogStatus
        paymentStatus
        createdAt
      }
    }
  }`,

  updateblogs: gql`mutation Updateblogs($data: updateBlogsInput) {
    updateblogs(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
      }
    }
  }`,

  getAllEventSupplierManagement: gql`query GetAllEventSupplierManagement($data: EventSupplierManagementFindInput) {
    getAllEventSupplierManagement(data: $data) {
      error
      systemCode
      code
      message
      data {
        total
        from
        to
        orders {
          id
          eventId
          supplyItem
          quantity
          remainingQuantity
          supplyItemDescription
          neededFor
          requiredDate
          alreadyTaken
          assignedMembersCount
          isDone
          assignedMembers {
            userId
            type
            isDeleted
            name
            invitedBy
            profileImage
          }
          time {
            from
            to
          }
          teamSize {
            adult
            teenager
            children
          }
        }
      }
    }
  }`,

  acceptOrRejectSupplierManagement: gql`mutation AcceptOrRejectSupplierManagement($data: userToSupplierManagementInput) {
    acceptOrRejectSupplierManagement(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  acceptOrRejectSupplierUserList: gql`query AcceptOrRejectSupplierUserList($data: acceptOrRejectSupplierUserInput) {
    acceptOrRejectSupplierUserList(data: $data) {
      error
      systemCode
      code
      message
      data {
        id
        name
        number
        age
        type
        status
        acceptedDate
        acceptedTime
      }
    }
  }`,

  deleteEventSupplierManagement: gql`mutation DeleteEventSupplierManagement($data: EventSupplierInput) {
    deleteEventSupplierManagement(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  assignSupplierMembers: gql`mutation AssignSupplierMembers($data: assignSupplierMembersInput) {
    assignSupplierMembers(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
      }
    }
  }`,

  deleteAssignSupplierMembers: gql`mutation DeleteAssignSupplierMembers($data: deletedSupplierInput) {
    deleteAssignSupplierMembers(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  updateEventSupplierManagement: gql`mutation UpdateEventSupplierManagement($data: UpdateEventSupplierManagement) {
    updateEventSupplierManagement(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  createEventSupplierManagement: gql`mutation CreateEventSupplierManagement($data: EventSupplierManagementInput) {
    createEventSupplierManagement(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
      }
    }
  }`,

  getEventSupplierById: gql`query GetEventSupplierById($data: EventSupplierByIdFindInput) {
    getEventSupplierById(data: $data) {
      error
      systemCode
      code
      message
      data {
        orders {
          id
          eventId
          supplyItem
          quantity
          supplyItemDescription
          neededFor
          requiredDate
          volunteered
          teamSize {
            adult
            teenager
            children
          }
          time {
            from
            to
          }
          isDone
          assignedMembers {
            userId
            name
            type
            invitedBy
            profileImage
            isDeleted
          }
        }
      }
    }
  }`,

  getAllUploadImage:gql`query GetAllUploadImage($data: eventMemoryInput) {
    getAllUploadImage(data: $data) {
      error
      code
      systemCode
      message
      data {
        total
        from
        to
        images {
          id
          uploadedImage
          imageDeadLine
          imageApprove
          imageStatus
          uploadedBy
          logoImage
          phoneNumber
          createdAt
        }
      }
    }
  }`,

  getUploadImageListCounting: gql`query GetUploadImageListCounting($data: uploadImageListCountingInput) {
    getUploadImageListCounting(data: $data) {
      error
      code
      systemCode
      message
      data {
        totalPhoto
        approvedPhoto
        rejectedPhoto
        uploadedThisWeek
        uploadedThisMonth
        activePhoto
      }
    }
  }`,

  uploadImage: gql`mutation UploadImage($data: uploadImageInput) {
    uploadImage(data: $data) {
      error
      code
      systemCode
      message
      data {
        id
      }
    }
  }`,

  editCurrency: gql`mutation EditCurrency($data: CurrencyInput) {
    editCurrency(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  getMyCommunityEventByID: gql`query GetMyCommunityEventByID($getMyCommunityEventByIdId: ID) {
    getMyCommunityEventByID(id: $getMyCommunityEventByIdId) {
      error
      systemCode
      code
      message
      data {
        id
        hostId
        communityId
        groupId
        category
        postEventAsCommunity
        type
        title
        description
        image
        logoImage
        venueDetails {
          firstAddressLine
          secondAddressLine
          city
          state
          country
          zipcode
          phoneNo
          phoneCode
          latitude
          longitude
        }
        invitationType
        rsvpEndTime
        date {
          from
          to
        }
        time {
          from
          to
        }
        rsvp {
          userId
          status
          createdAt
          updatedAt
          user {
            name
          }
        }
        attendees {
          isRestricted
          webvistorRestriction
          numberOfMaxAttendees
          numberOfMaxWebVisitors
          additionalGuests
          numberOfMaxGuests
          attendeesListVisibility
          mediaUploadByAttendees
          isActive
          isDeleted
        }
        user {
          name
        }
        community {
          communityName
        }
        paymentCategory
        paymentPackages {
          currency
          packageName
          packageRate
          packageLogo
          earlyBirdDate
          earlyBirdRate
        }
        paymentStatus
        members{
          id
          name
          phone
          phoneCode
          email
        }
        groups {
          id
          name
        }
        paymentCategory
        hostId
        createdAt
      }
    }
  }`,

  verifyCommunityEmail: gql`mutation VerifyCommunityEmail($data: EmailInput) {
    verifyCommunityEmail(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  verifyCommunityOTP: gql`mutation VerifyCommunityOTP($data: OtpInput) {
    verifyCommunityOTP(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  updateEventPayment: gql`mutation UpdateEventPayment($data: EventPaymentUpdateInput) {
    updateEventPayment(data: $data) {
      error
      systemCode
      code
      message
      data {
        id
        rsvpStatus
      }
    }
  }`,

  deleteEventPayment : gql `mutation DeleteEventPayment($data: DeleteEventPaymentInput) {
    deleteEventPayment(data: $data) {
      error
      systemCode
      code
      message
    }
  }`,

  acceptOrRejectUserList: gql`query AcceptOrRejectUserList($data: acceptOrRejectuserInput) {
    acceptOrRejectUserList(data: $data) {
      error
      systemCode
      code
      message
      data {
        id
        name
        number
        age
        type
        status
        acceptedDate
        acceptedTime
      }
    }
  }`,

  getLoggedInUsers: gql `query GetLoggedInUsers($data: InputUserSearch) {
    getLoggedInUsers(data: $data) {
      error
      systemCode
      code
      message
      data {
        total
        from
        to
        users {
          id
          name
        }
      }
    }
  }`,

  removeGroupOrMemberEvent: gql`mutation RemoveGroupOrMemberEvent($data: inputRemoveGroupOrMember) {
    removeGroupOrMemberEvent(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  approveOrRejectImage: gql`mutation ApproveOrRejectImage($data: acceptOrRejectImageInput) {
    approveOrRejectImage(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  imageStatusChange: gql`mutation ImageStatusChange($data: imageStatusInput) {
    imageStatusChange(data: $data) {
      code
      error
      systemCode
      message
    }
  }`,

  getMyCommunityEventsForBlog: gql`query GetMyCommunityEventsForBlog($data: AllEventsSearchFieldForBlog) {
    getMyCommunityEventsForBlog(data: $data) {
      error
      systemCode
      code
      message
      data {
        events {
          id
          title
        }
      }
    }
  }`,

  getSupplierStatusCounting: gql`query GetSupplierStatusCounting($data: EventTaskFindInput) {
    getSupplierStatusCounting(data: $data) {
      error
      systemCode
      code
      message
      data {
        openOrders
        closedOrders
        assignedOrders
      }
    }
  }`
}
