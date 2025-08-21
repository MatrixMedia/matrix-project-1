export interface tasks{
    id?: string,
    eventId?: string,
    taskName?: string,
    requireTeam?: number,
    taskDescription?: string,
    teamSize?: teamSize,
    priority?: string,
    taskStartDate?: string,
    taskDeadline?: string,
    isDone?: boolean,
    assignedMembersCount?: number,
    assignedMembers?: any
}

interface teamSize{
    adult?: number,
    teenager?: number,
    children?: number
}

interface assignedMembers{
    userId?: string,
    type?: string,
    isDeleted?: boolean,
    name?: string,
    invitedBy?: string
}