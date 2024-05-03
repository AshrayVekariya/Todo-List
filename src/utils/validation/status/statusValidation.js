export default function statusValidation(values) {
    const errors = {};
    
    if (!values.statusName) {
        errors.statusName = 'Status name is required!';
    }

    return errors;
}
