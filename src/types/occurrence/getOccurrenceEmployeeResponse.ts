type citizen = {
    first_name: string
    last_name: string
    email: string
    phone_number: string
}

type history = {
    title: string
    description: string
    historyDate: Date
}

type photos = {
    filename: string
}

type violator = {
    name: string | undefined
    vehicle: string | undefined
    address: string | undefined
    otherInformation: string | undefined
}

type address = {
    address: string
    number: string
    district: string
    reference: string
    latitude: string
    longitude: string
}

type internalComment = {
    comment: string
    employee: string
    commentDate: Date
}

export type getOccurrenceEmployeeResponse = {
    category: string
    status: string
    description: string
    occurrenceDate: Date
    newNotification: boolean
    occurrenceNumber: string
    violationNumber: string
    address: address
    citizen: citizen
    histories: history[]
    photos: photos[]
    violator: violator
    internalComments: internalComment[]
}
