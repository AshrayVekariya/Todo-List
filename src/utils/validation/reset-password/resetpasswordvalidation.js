
export default function resetPasswordValidation(values) {
    const errors = {};

    if (!values.password) {
        errors.password = 'Password is required!';
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = 'Confirm password is required!';
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Confirm Password does not match!';
    }

    return errors;
}
