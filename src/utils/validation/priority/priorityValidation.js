export default function priorityValidation(values) {
    const errors = {};
    
    if (!values.priorityName) {
        errors.priorityName = 'Priority name is required!';
    }

    return errors;
}
