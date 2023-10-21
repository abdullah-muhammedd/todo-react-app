import * as Yup from "yup"

export default Yup.object({
    heading: Yup.string().trim().required("Heading Is Required"),
    color: Yup.string().trim().default("#00FF00")
        .matches(/^#[a-fA-F0-9]{6}$/, 'Invalid Hexadecimal Color')
})   