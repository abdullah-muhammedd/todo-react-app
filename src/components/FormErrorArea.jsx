function FormErrorArea(props) {
    if (props.condition && props.message) {
        return (
            <h3 className='error-area'>{props.message}</h3>
        )
    }
    else {
        return null;
    }
}
export default FormErrorArea;