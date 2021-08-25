type history = {
    title: string
    description: string
    historyDate: Date
}

type violator = {
    name: string | undefined
    vehicle: string | undefined
    address: string | undefined
    otherInformation: string | undefined
}

type address = {
    address?: string
    number?: string
    district?: string
    reference?: string
    latitude?: string
    longitude?: string
}

export type getOccurrenceCitizenResponse = {
    category: string
    status: string
    description: string
    occurrenceDate: Date
    newNotification: boolean
    occurrenceNumber?: string
    violationNumber?: string
    address: address
    histories: history[]
    violator: violator
    photos: string[]
}
