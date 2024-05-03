
export default function userValidation(values, updatePassword) {
    const errors = {};

    if (!values.firstName) {
        errors.firstName = 'First name is required!';
    }

    if (!values.lastName) {
        errors.lastName = 'Last name is required!';
    }

    if (!values.username) {
        errors.username = 'Username is required!';
    } else if (!/^[A-Za-z][A-Za-z0-9_]{3,16}$/.test(values.username)) {
        errors.username = 'Enter valid username!';
    }

    if (!values.email) {
        errors.email = 'Email is required!';
    }

    if (!values.dob) {
        errors.dob = 'Date of birth is required!';
    }

    if (!values.role) {
        errors.role = 'Role is required!';
    }

    if (updatePassword) {
        if (!values.password) {
            errors.password = 'Password is required!';
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = 'Confirm password is required!';
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = 'Confirm Password does not match!';
        }
    }
    return errors;
}
