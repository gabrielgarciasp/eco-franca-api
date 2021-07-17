import * as Yup from 'yup'

const schema = Yup.object().shape({
    comment: Yup.string().required(),
})

export default schema
