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
        label: 'New Requests',
        icon: 'bxs-collection',
        link: '/new-requests',
        role: ['artist','access-new-requests']
    },
    {
        id: 3,
        label: 'Add Skill',
        icon: 'bx-file',
        link: '/add-skill',
        role: ['artist','access-add-skill']
    },
    {
        id: 4,
        label: 'Skill Data',
        icon: 'bxs-detail',
        link: '/skill-data',
        role: ['artist','access-skill-data']
    },
    {
        id: 5,
        label: 'Profile',
        icon: 'bxs-id-card',
        link: '/artist-profile',
        role: ['artist','access-artist-profile']
    },
    {
        id: 6,
        label: 'History',
        icon: 'bx-history',
        link: '/artist-history',
        role: ['artist','access-artist-history']
    },
    {
        id: 7,
        label: 'Dashboard',
        icon: 'bxs-home-circle',
        link : '/user-dashboard',
        role: ['access-user-dashboard','user']
    },
    {
        id: 8,
        label: 'All Artists',
        icon: 'bxs-group',
        link : '/all-artists',
        role: ['admin','user','access-all-artists']
    },
    {
        id: 9,
        label: 'Profile',
        icon: 'bxs-id-card',
        link : '/user-profile',
        role: ['admin','user','access-user-profile']
    },
    {
        id: 10,
        label: 'History',
        icon: 'bx-history',
        link : '/user-history',
        role: ['admin', 'user','access-user-history']
    }
]