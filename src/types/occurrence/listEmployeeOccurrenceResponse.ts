type address = {
    address?: string
    number?: string
    district?: string
    reference?: string
    latitude?: string
    longitude?: string
}

type responseOccurrence = {
    id: string
    category: string
    address: address
    occurrenceNumber?: string
    violationNumber?: string
    status: string
    occurrenceDate: Date
}

export type listEmployeeOccurrenceResponse = {
    occurrences: responseOccurrence[]
    pages: number
}
