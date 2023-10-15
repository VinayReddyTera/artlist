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
        id: 1,
        label: 'Skill Data',
        icon: 'bxs-detail',
        link: '/skill-data',
        role: ['artist','access-skill-data']
    },
    {
        id: 1,
        label: 'New Requests',
        icon: 'bxs-collection',
        link: '/new-requests',
        role: ['artist','access-new-requests']
    },
    {
        id: 1,
        label: 'Approve Artist',
        icon: 'bxs-user-plus',
        link: '/artist-approve',
        role: ['artist','access-artist-approve']
    },
    {
        id: 2,
        label: 'Profile',
        icon: 'bxs-id-card',
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
        label: 'All Artists',
        icon: 'bxs-group',
        link : '/all-artists',
        role: ['admin','user','access-all-artists']
    },
    {
        id: 6,
        label: 'Profile',
        icon: 'bxs-id-card',
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