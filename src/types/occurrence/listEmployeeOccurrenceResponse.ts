type responseOccurrence = {
    id: string
    category: string
    number: string
    occurrenceNumber: string
    violationNumber: string
    status: string
    occurrenceDate: Date
}

export type listEmployeeOccurrenceResponse = {
    occurrences: responseOccurrence[]
    pages: number
}
