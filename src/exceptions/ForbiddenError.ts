import ApiError from "./ApiError";

export default class ForbiddenError extends ApiError {
    constructor(message: string) {
        super(403, message)
    }
}