import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AdjustIcon from '@mui/icons-material/Adjust';
import SignInPage from '../view/sign-in';
import UserList from '../view/users';
import AddUser from '../view/users/add-user';
import PriorityList from '../view/priority';
import StatusList from '../view/status'
import TaskList from '../view/task-list';
import AddTask from '../view/task-list/add-task';
import ForgotPassword from '../view/forgot-password';
import VerifyOTP from '../view/verify-otp';
import ResetPassword from '../view/reset-password';
import UserTaskList from '../view/users-task-list';
import UserTaskDetails from '../view/users-task-list/task-details';
import UserSubTaskDetails from '../view/users-task-list/sub-task-details';
import InboxIcon from '@mui/icons-material/Inbox';
import Inbox from '../view/inbox';

export const privateRoutes = [
    {
        label: 'Users',
        role: ['Admin'],
        Icon: <PeopleIcon size='1.5rem' />,
        to: '/user',
        element: <UserList />,
    },
    {
        label: 'AddUser',
        role: ['Admin'],
        Icon: <PeopleIcon size='1.5rem' />,
        to: '/add/user',
        element: <AddUser />,
    },
    {
        label: 'AddUser',
        role: ['Admin'],
        Icon: <PeopleIcon size='1.5rem' />,
        to: '/user/edit/:id',
        element: <AddUser />,
    },
    {
        label: 'Tasks',
        role: ['Admin'],
        Icon: <AddTaskIcon size='1.5rem' />,
        to: '/taskList',
        element: <TaskList />,
    },
    {
        label: 'Tasks',
        role: ['Admin'],
        Icon: <AddTaskIcon size='1.5rem' />,
        to: '/taskList/add',
        element: <AddTask />,
    },
    {
        label: 'Tasks',
        role: ['Admin'],
        Icon: <AddTaskIcon size='1.5rem' />,
        to: '/taskList/edit/:id',
        element: <AddTask />,
    },
    {
        label: 'Priority',
        role: ['Admin'],
        Icon: <EmojiFlagsIcon size='1.5rem' />,
        to: '/priority',
        element: <PriorityList />,
    },
    {
        label: 'Status',
        role: ['Admin'],
        Icon: <AdjustIcon size='1.5rem' />,
        to: '/status',
        element: <StatusList />,
    },
    {
        label: 'My Task',
        role: ['User'],
        Icon: <TaskIcon size='1.5rem' />,
        to: '/myTask',
        element: <UserTaskList />,
    },
    {
        label: 'My Task',
        role: ['User'],
        Icon: <TaskIcon size='1.5rem' />,
        to: '/myTask/:id',
        element: <UserTaskDetails />,
    },
    {
        label: 'My Task',
        role: ['User'],
        Icon: <TaskIcon size='1.5rem' />,
        to: '/myTask/subTask/:id',
        element: <UserSubTaskDetails />,
    },
    {
        label: 'Inbox',
        role: ['Admin', 'User'],
        Icon: <InboxIcon size='1.5rem' />,
        to: '/inbox',
        element: <Inbox />,
    }
]

export const publicRoutes = [
    {
        to: '/login',
        element: <SignInPage />,
    },
    {
        to: '/forgotPassword',
        element: <ForgotPassword />,
    },
    {
        to: '/verify-otp/:id',
        element: <VerifyOTP />,
    },
    {
        to: '/resetPassword/:id/:token',
        element: <ResetPassword />,
    },
]

export const sideBarRoutes = [
    {
        label: 'Tasks',
        role: ['Admin'],
        Icon: <AddTaskIcon size='1.5rem' />,
        to: '/taskList',
    },
    {
        label: 'Priority',
        role: ['Admin'],
        Icon: <EmojiFlagsIcon size='1.5rem' />,
        to: '/priority',
    },
    {
        label: 'Status',
        role: ['Admin'],
        Icon: <AdjustIcon size='1.5rem' />,
        to: '/status',
    },
    {
        label: 'Users',
        role: ['Admin'],
        Icon: <PeopleIcon size='1.5rem' />,
        to: '/user',
    },
    {
        label: 'My Task',
        role: ['User'],
        Icon: <TaskIcon size='1.5rem' />,
        to: '/myTask',
    },
    {
        label: 'Inbox',
        role: ['Admin', 'User'],
        Icon: <InboxIcon size='1.5rem' />,
        to: '/inbox',
    },
]