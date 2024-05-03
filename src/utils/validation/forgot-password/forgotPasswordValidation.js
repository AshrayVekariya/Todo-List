
export default function forgotPasswordValidation(values) {
    const errors = {};

    if (!values.username) {
        errors.username = 'Username or email address is required!';
    }

    return errors;
}
