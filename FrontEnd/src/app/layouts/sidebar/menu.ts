import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'Dashboard',
        icon: 'bxs-home-circle',
        link: '/artist-dashboard',
        role: ['artist','access-artist-dashboard']
    },
    {
        id: 2,
        label: 'Profile',
        icon: 'bx-id-card',
        link: '/artist-profile',
        role: ['artist','access-artist-profile']
    },
    {
        id: 3,
        label: 'History',
        icon: 'bx-history',
        link: '/artist-history',
        role: ['artist','access-artist-history']
    },
    {
        id: 4,
        label: 'Dashboard',
        icon: 'bxs-home-circle',
        link : '/user-dashboard',
        role: ['access-user-dashboard','user']
    },
    {
        id: 5,
        label: 'Book Interview',
        icon: 'bx-calendar',
        link : '/bookInterview',
        role: ['admin','user','access-bookInterview']
    },
    {
        id: 6,
        label: 'Profile',
        icon: 'bx-id-card',
        link : '/user-profile',
        role: ['admin','user','access-user-profile']
    },
    {
        id: 7,
        label: 'History',
        icon: 'bx-history',
        link : '/user-history',
        role: ['admin', 'user','access-user-history']
    }
]