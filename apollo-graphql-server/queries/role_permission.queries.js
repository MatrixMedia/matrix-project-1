module.exports = function (gql) {
    return gql`
    type CommunityRole {
        id : String
        name : String
        slug : String
    }
    
    type MemberPermission{
        canOnboard: Boolean
        canEdit: Boolean
        canView: Boolean
        canDelete: Boolean
        canPromoteDemote: Boolean
    }

    type EventPermissions{
        canCreate: Boolean
        canEdit: Boolean
        canView: Boolean
        canDelete: Boolean
        canFrequency: Boolean
    }

    type GroupPermissions{
        canCreate : Boolean
        canEdit : Boolean
        canView : Boolean
        canDelete : Boolean
    }

    type BlogPermissions{
        canCreate : Boolean
        canEdit : Boolean
        canView : Boolean
        canDelete : Boolean
    }
    type CommunityRoleData {
        total : Int
        from : Int
        to : Int
        roles: [CommunityRole]
    }
    
    type AnnouncementPermissions{
        canCreate : Boolean
        canEdit : Boolean
        canView : Boolean
        canDelete : Boolean
    }
    type CheckinPermissions {
        canView: Boolean,
        canCheck: Boolean
    }
    type UnAssignedCommunityMemberList {
        id:ID
        communityName:String
        members:UnAssignedCommunityMember
    }
    type UnAssignedCommunityMember {
        memberId:String
        roles:[String]
        user:CommunityMemberUser
    }

    input MemberPermissionInput{
        can_onboard: Boolean
        can_edit: Boolean
        can_view: Boolean
        can_delete: Boolean
        can_promote_demote: Boolean
    }

    input EventPermissionsInput{
        can_create: Boolean
        can_edit: Boolean
        can_view: Boolean
        can_delete: Boolean
        can_frequency: Boolean
    }

    input GroupPermissionsInput{
        can_create : Boolean
        can_edit : Boolean
        can_view : Boolean
        can_delete : Boolean
    }

    input BlogPermissionsInput{
        can_create : Boolean
        can_edit : Boolean
        can_view : Boolean
        can_delete : Boolean
    }
    
    input CommunityRoleInput {
        search:String,
        page: Int,
        columnName:String,
        sort:String
        limit : Int
    }
    
    input AnnouncementPermissionsInput{
        can_create : Boolean
        can_edit : Boolean
        can_view : Boolean
        can_delete : Boolean
    }
    input CheckinPermissionsInput {
        can_view: Boolean,
        can_check: Boolean
    }
    type RolePermissionsList {
        id: String
        communityId: String
        role: String,
        member: MemberPermission
        event: EventPermissions
        group: GroupPermissions
        blog: BlogPermissions
        announcement: AnnouncementPermissions
        checkin: CheckinPermissions
    }
    type SlugType {
        slug : String
    }
    input RolePermissionsFindInput {
        communityId: String,
        role: String,
    }
    input updateRolePermissionsinput {
        id: String
        member: MemberPermissionInput
        event: EventPermissionsInput
        group: GroupPermissionsInput
        blog: BlogPermissionsInput
        announcement: AnnouncementPermissionsInput
        checkin: CheckinPermissionsInput
    }
    input AddCommunityRoleInput {
        name : String
        slug : String
        memberId : String
    }
    type RolePermissionsResponse implements Response {
        error : Boolean
        code:Int,
        systemCode:String,
        message:String,
        data: RolePermissionsList
    }
    type InsertRolePermissionsResponse {
        error:Boolean,
        code:Int,
        systemCode:String,
        message:String,
        data: Id
    }
    type CommunityCreatedRolesResponse {
        error:Boolean,
        code:Int,
        systemCode:String,
        message:String,
        data : CommunityRoleData
    }
    type getUnAssignedMembersResponse {
        error:Boolean,
        code:Int,
        systemCode:String,
        message:String,
        data : [UnAssignedCommunityMemberList]
    }
    type AddCommunityRoleResponse {
        error:Boolean,
        code:Int,
        systemCode:String,
        message:String,
        data : SlugType
    }
    extend type Query {
        getRolePermissions(data: RolePermissionsFindInput): RolePermissionsResponse
        getCommunityCreatedRoles (data: CommunityRoleInput) : CommunityCreatedRolesResponse
        getUnAssignedMembers : getUnAssignedMembersResponse
        getUsherAssignedMembers(data: AddCommunityRoleInput) : getUnAssignedMembersResponse
    }
    extend type Mutation {
        updateRolePermissions(data: updateRolePermissionsinput): InsertRolePermissionsResponse
        addCommunityRole(data: AddCommunityRoleInput) : AddCommunityRoleResponse
        assignUsherRole(data: AddCommunityRoleInput) : GeneralResponse
    }
    `
}