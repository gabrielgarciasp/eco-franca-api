import ApiError from './ApiError'

export default class ValidationError extends ApiError {
    fields: Object

    constructor(fields: Object) {
        super(400, 'Validation failed')
        this.fields = fields
    }
}
