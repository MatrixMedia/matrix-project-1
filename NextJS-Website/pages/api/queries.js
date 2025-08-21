export const GET_COMMUNITY = `
query GetFeaturedCommunities($data: InputGetFeaturedCommunities) {
    getFeaturedCommunities(data: $data) {
      error
      systemCode
      code
      message
      data {
        total
        featuredCommunities {
          id
          bannerImage
          logoImage
          createdAt
          communityName
          ownerName
        }
      }
    }
  }
`;

export const GET_MY_COMMUNITY_SETTINGS = `
query GetMyCommunitiesSettingsView($data: InputCommunitiesSettingsView) {
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
        communityName
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
  }
`;

export const GET_COMMUNITY_HOME = `
query GetCommunityHomePageOverviewByID($data: OrgPortalCommunityInput) {
  getCommunityHomePageOverviewByID(data: $data) {
    error
    systemCode
    code
    message
    data {
      id
      bannerImage
      logoImage
      communityDescription,
      backgroupColor,
    }
  }
}
`;

export const GET_COMMUNITY_VIDEO = `
query GetCommunityVideos($data: OrgPortalCommunityInput) {
  getCommunityVideos(data: $data) {
    error
    systemCode
    code
    message
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
}
`;

export const GET_COMMUNITY_EVENTS = `
query GetMyCommunityEvents($data: AllEventsSearchField) {
  getMyCommunityEvents(data: $data) {
    error
    systemCode
    code
    message
    data {
      total
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
        recurringEvent 
        paymentCategory
        venueDetails {
          firstAddressLine
          secondAddressLine
          city
          state
          country
          zipcode
          phoneNo
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
            id
            name
          }
        }
        attendees {
          isRestricted
          numberOfMaxAttendees
          additionalGuests
          numberOfMaxGuests
          attendeesListVisibility
          mediaUploadByAttendees
          webvistorRestriction
          isActive
          isDeleted
          createdAt
          updatedAt
        }
        isJoined
        isActive
        paymentStatus
        user {
          id
          name
          email
          phone
        }
        community {
          id
          ownerId
          communityName
        }
        role
        image
        logoImage
        paymentPackages {
          id
          currency
          packageName
          packageRate
          packageLogo
          earlyBirdDate
          earlyBirdRate
          number
        }
      }
    }
  }
}
`;

export const GET_UPCOMING_EVENTS = `
query GetMyCommunityEvents($data: AllEventsSearchField) {
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
        recurringEvent 
        image
        logoImage
        isCancelled
        paymentCategory
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
          webvistorRestriction
          numberOfMaxAttendees
          numberOfMaxWebVisitors
          remainingNumberOfAttendees
          additionalGuests
          numberOfMaxGuests
          attendeesListVisibility
          mediaUploadByAttendees
          isActive
          isDeleted
          createdAt
          updatedAt
        }
        isActive
        paymentStatus
        community {
          id
          communityName
        }
        paymentPackages {
          id
          currency
          packageName
          packageRate
          packageLogo
          earlyBirdDate
          earlyBirdRate
          number
        }
      }
    }
  }
}
`;

export const GET_ALL_ANNOUNCEMENT_LIST = `
query GetAllAnnouncementOrganization($data: AllAnnouncementSearchField) {
  getAllAnnouncementOrganization(data: $data) {
    error
    systemCode
    code
    message
    data {
      total
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
}
`;

export const CREATE_COMMUNITY_FEEDBACK = `
mutation CreateCommunityFeedback($data: InputCommunityFeedback) {
  createCommunityFeedback(data: $data) {
    code
    error
    systemCode
    message
  }
}
`;
export const ABOUT_US = `
query CommunityMemberRoleFilter($data: CommunityMemberRoleFilterInput) {
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
}
`;

export const COMMUNITY_BASICS_DETAILS = `
query GetCommunityBasicDetails($data: InputGetCommunityBasicDetails) {
  getCommunityBasicDetails(data: $data) {
    error
    systemCode
    code
    message
    data {
      id
      communityType
      communityDescription
      communityEmail
      communityName
      communityPhoneCode
      communityNumber
      communityLocation
      communityDescriptionApproval
      communityEmailApproval
      communityNumberApproval
      locationApproval
      nonProfit
    }
  }
}
`;

export const GetCommunityIdFromSlug = `
query GetCommunityIdFromSlug($data: SlugInput) {
  getCommunityIdFromSlug(data: $data) {
    error
    code
    systemCode
    message
    data {
      communityId
    }
  }
}
`;

export const GetCommunityPayments = `
query GetCommunityPayments($data: GeneralIdGetInput) {
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
      paymentDescription
      authorityName
      link
      otherpaymentLink
    }
  }
}
`;

export const GetMyCommunityGroup = `
query GetMyCommunityGroup($data: InputCommunityId) {
  getMyCommunityGroup(data: $data) {
    error
    systemCode
    code
    message
    data {
     total
      from
      to
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
}
`;

export const MyCommunityOrgGlobalSearch = `
query MyCommunityOrgGlobalSearch($data: InputOrgGlobalSearch) {
  myCommunityOrgGlobalSearch(data: $data) {
    error
    systemCode
    code
    message
    data {
      events {
        publicEvents {
          id
          hostId
          communityId
          title
          invitationType
          type
          description
          image
          logoImage
          venueDetails {
            firstAddressLine
            city
            state
            country
            zipcode
            phoneNo
            phoneCode
            secondAddressLine
          }
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
            isActive
          }
          isActive
          postEventAsCommunity
        }
        pastEvents {
          id
          hostId
          communityId
          title
          invitationType
          postEventAsCommunity
          type
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
        }
        membersOnlyEvents {
          id
          hostId
          communityId
          title
          invitationType
          postEventAsCommunity
          type
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
            attendeesListVisibility
            mediaUploadByAttendees
          }
          isActive
        }
      }
      announcements {
        publicAnnouncement {
          id
          title
          description
          endDate
          toWhom
          communityId
          isActive
        }
        memberAnnouncement {
          id
          title
          description
          toWhom
          endDate
          communityId
          isActive
        }
      }
      groups {
        id
        name
        description
        image
        type
        createdBy
        communityId
        isActive
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
    }
  }
}
`;

export const GetCommunityBlogs = `
query GetAllBlogs($data: BlogsFindInput) {
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
        blogShortDesc
        blogStatus
        paymentStatus
        createdAt
        eventId
        eventName
        paymentStatusTimeVerify
      }
    }
  }
}
`;

export const GetEventNameWiseList = `
query OrgImageListEventWise($data: orgEventMemoryInput) {
  orgImageListEventWise(data: $data) {
    error
    code
    systemCode
    message
    data {
      total
      events {
        eventName
        images {
          id
          uploadedImage
          imageDeadLine
          imageApprove
          imageStatus
          uploadedBy
          profileImage
          phoneNumber
          createdAt
        }
      }
    }
  }
}
`;

export const GetDateWiseList = `
query OrgImageListDateWise($data: orgEventMemoryInput) {
  orgImageListDateWise(data: $data) {
    error
    code
    systemCode
    message
    data {
      total
      events {
        yearOfUpload
        images {
          id
          uploadedImage
          imageDeadLine
          profileImage
          imageApprove
          imageStatus
          uploadedBy
          phoneNumber
          createdAt
        }
      }
    }
  }
}
`;

export const GetSangaraahiCommunity = `
query GetSangaraahiCommunity {
  getSangaraahiCommunity {
    error
    systemCode
    code
    message
    data {
      total
      featuredCommunities {
        id
        bannerImage
        logoImage
        createdAt
        communityName
        ownerName
      }
    }
  }
}
`;

export const getMyCommunityEventByID = `
query GetMyCommunityEventByID($getMyCommunityEventByIdId: ID) {
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
        timezone
      }
      time {
        from
        to
        timezone
      }
      rsvp {
        userId
        status
        guests {
          seniors
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
        webvistorRestriction
        numberOfMaxAttendees
        numberOfMaxWebVisitors
        remainingNumberOfAttendees
        remainingNumberOfWebVisitors
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
      createdAt
      isActive
      isCancelled
      user {
        id
        communityMemberId
        name
        email
        phone
        countryCode
        phoneCode
        secondaryPhone
        secondaryCountryCode
        secondaryPhoneCode
        isSecondaryPhoneVerified
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
        ageGroup
        isMasked
        gender
        hobbies
        areaOfWork
        profession
        aboutYourself
        familyMembers {
          id
          userId
          communityMemberId
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
          firstAddressLine
          secondAddressLine
          zipcode
          city
          state
          country
        }
        contacts {
          id
          userId
          contactName
          contactImage
          contactPhone
          isDeleted
          isFavourite
        }
        subLanguage
        selectedCommunity
        isActive
        lastActivityAt
        language
      }
      community {
        id
        ownerId
        communityMemberId
        communityType
        emailCreditsRemaining
        smsCreditsRemaining
        bannerImage
        logoImage
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
        paymentCategory
        nonProfitTaxId
        members {
          memberId
          communityMemberId
          roles
          isApproved
          isRejected
          memberPromotion {
            type
            date
            status
            path {
              from
              to
            }
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
          webpageApprovalStatus
          communityId
          communityName
          publicityPage
          eventPaymentSettings
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
        communityPayments {
          bankcheckImage
          bankcheckStatus
          bankcheckImageName
        }
        currency
        communityEmail
        communityPhoneCode
        communityNumber
        isJoined
        isJoinRequestSent
      }
      role
      invitedBy {
        id
        communityMemberId
        name
        email
        phone
        countryCode
        phoneCode
        secondaryPhone
        secondaryCountryCode
        secondaryPhoneCode
        isSecondaryPhoneVerified
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
        yearOfBirth
        ageGroup
        isMasked
        gender
        hobbies
        areaOfWork
        profession
        aboutYourself
        subLanguage
        selectedCommunity
        isActive
        lastActivityAt
        language
      }
      paymentCategory
      paymentPackages {
        id
        currency
        packageName
        packageRate
        packageLogo
        earlyBirdDate
        earlyBirdRate
        number
        description
        isActive
      }
      paymentStatus
      groups {
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
        createdAt
        memberCount
      }
      members {
        id
        communityMemberId
        name
        email
        phone
        countryCode
        phoneCode
        secondaryPhone
        secondaryCountryCode
        secondaryPhoneCode
        isSecondaryPhoneVerified
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
        yearOfBirth
        ageGroup
        isMasked
        gender
        hobbies
        areaOfWork
        profession
        aboutYourself
        subLanguage
        selectedCommunity
        isActive
        lastActivityAt
        language
      }
      recurringEvent
      recurringDetails {
        recurreingType
        startTime
        endTime
        occurationNumber
        weeklyDayIndex
        monthlyDate
      }
    }
  }
}
`;


export const GetAllUploadImage = `
query GetAllUploadImage($data: eventMemoryInput) {
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
        phoneNumber
        createdAt
      }
    }
  }
}
`;

export const GetBolgsById = `
query GetBolgsById($data: BlogsFindByIdInput) {
  getBolgsById(data: $data) {
    error
    code
    systemCode
    message
    data {
      id
      eventId
      eventName
      postedBy
      thumbnailImage
      image
      pdf
      blogTitle
      blogShortDesc
      blogCategory
      blogDescription
      blogStatus
      paymentStatus
      createdAt
      twitterLink
      fbLink
      likedinLink
    }
  }
}
`

export const Countrydialcode = `
query GetCountryCodes {
  getCountryCodes {
    error
    systemCode
    code
    message
    data {
      name
      dialCode
      code
    }
  }
}
`;
export const GetPhoneNumber = `mutation WebVisitorPhoneVerify($data: userToEventInput) {
  webVisitorPhoneVerify(data: $data) {
    error
    systemCode
    code
    message
    data {
      token
    }
  }
}`;
export const GetOtpVerification = `mutation WebVisitorPhoneOTPVerify($data: OtpTokenInput) {
  webVisitorPhoneOTPVerify(data: $data) {
    code
    error
    systemCode
    message
  }
}`;
export const GetPackageVerification = `mutation AcceptOrRejectOrgEvent($data: userToEventInput) {
  acceptOrRejectOrgEvent(data: $data) {
    code
    error
    systemCode
    message
  }
}`;
