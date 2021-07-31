type address = {
    address?: string
    number?: string
    district?: string
    reference?: string
    latitude?: string
    longitude?: string
}

export type listOccurrencesCitizenResponse = {
    id: string
    category: string
    newNotification: boolean
    address: address
    occurrenceNumber?: string
    violationNumber?: string
    status: string
    occurrenceDate: Date
}
