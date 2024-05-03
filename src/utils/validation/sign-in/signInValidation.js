
export default function signInValidation(values) {
    const errors = {};
    
    if (!values.username) {
        errors.username = 'Email address or username is required!';
    }

    if (!values.password) {
        errors.password = 'Password is required!';
    }
    return errors;
}
