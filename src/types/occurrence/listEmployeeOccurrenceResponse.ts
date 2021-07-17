import Occurrence from '../../models/Occurrence'

export type listEmployeeOccurrenceResponse = {
    occurrence: Occurrence[]
    pages: number
}
