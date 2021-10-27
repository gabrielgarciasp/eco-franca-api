import { ValidationError, SchemaOf } from 'yup'
import ValidationErrorException from '../exceptions/ValidationError'

export default <Type>(schema: SchemaOf<Type>, object: Type): Type => {
    try {
        return schema.validateSync(object, { abortEarly: false }) as Type
    } catch (err: any) {
        const fields: Object[] = []

        err.inner.forEach(({ path, message }: ValidationError) => {
            fields.push({ field: path, message: message })
        })

        throw new ValidationErrorException(fields)
    }
}
