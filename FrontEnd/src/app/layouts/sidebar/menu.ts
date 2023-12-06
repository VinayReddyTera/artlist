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
        id: 2,
        label: 'Commissions',
        icon: 'bx bx-money',
        link: '/commissions',
        role: ['artist','admin','access-commissions']
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
        label: 'Add Approver',
        icon: 'bxs-user-plus',
        link : '/add-approver',
        role: ['admin','access-add-approver']
    },
    {
        id: 9,
        label: 'All Approvers',
        icon: 'bxs-user-check',
        link : '/all-approvers',
        role: ['admin','access-all-approvers']
    },
    {
        id: 11,
        label: 'Approve Artist',
        icon: 'bxs-user-plus',
        link : '/artist-approve',
        role: ['tag','access-artist-approve']
    },
    {
        id: 12,
        label: 'History',
        icon: 'bx-history',
        link : '/user-history',
        role: ['user','access-user-history']
    },
    {
        id: 10,
        label: 'Profile',
        icon: 'bxs-id-card',
        link : '/user-profile',
        role: ['admin','user','tag','access-user-profile']
    },
    {
        id: 10,
        label: 'History',
        icon: 'bx-history',
        link : '/tag-history',
        role: ['tag','access-tag-history']
    }
]