import * as Yup from 'yup'

const schema = Yup.object().shape({
    category: Yup.string().required(),
    description: Yup.string().required(),
    address: Yup.string(),
    number: Yup.string(),
    district: Yup.string(),
    reference: Yup.string(),
    latitude: Yup.string(),
    longitude: Yup.string(),
    occurrenceDate: Yup.date().required(),
    violatorName: Yup.string(),
    violatorVehicle: Yup.string(),
    violatorAddress: Yup.string(),
    violatorOtherInformation: Yup.string(),
})

export default schema
