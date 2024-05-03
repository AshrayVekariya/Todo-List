
export default function taskValidation(values) {
    const errors = {};

    if (!values.taskName) {
        errors.taskName = 'Task name is required!';
    }

    if (!values.priority) {
        errors.priority = 'Priority is required!';
    }

    if (!values.status) {
        errors.status = 'Status is required!';
    }

    if (!values.userId) {
        errors.userId = 'User is required!';
    }

    if (!values.deadline) {
        errors.deadline = 'Deadline is required!';
    }

    return errors;
}
