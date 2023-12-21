import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'bxs-home-circle',
        link: '/artist-dashboard',
        role: ['artist','access-artist-dashboard']
    },
    {
        label: 'New Requests',
        icon: 'bxs-collection',
        link: '/new-requests',
        role: ['artist','access-new-requests']
    },
    {
        label: 'Commissions',
        icon: 'bx bx-money',
        link: '/commissions',
        role: ['artist','access-commissions']
    },
    {
        label: 'Add Skill',
        icon: 'bx-file',
        link: '/add-skill',
        role: ['artist','access-add-skill']
    },
    {
        label: 'Skill Data',
        icon: 'bxs-detail',
        link: '/skill-data',
        role: ['artist','access-skill-data']
    },
    {
        label: 'Profile',
        icon: 'bxs-id-card',
        link: '/artist-profile',
        role: ['artist','access-artist-profile']
    },
    {
        label: 'History',
        icon: 'bx-history',
        link: '/artist-history',
        role: ['artist','access-artist-history']
    },
    {
        label: 'Dashboard',
        icon: 'bxs-home-circle',
        link : '/user-dashboard',
        role: ['access-user-dashboard','user']
    },
    {
        label: 'All Artists',
        icon: 'bxs-group',
        link : '/all-artists',
        role: ['admin','user','access-all-artists']
    },
    {
        label: 'All Commissions',
        icon: 'bx bx-money',
        link: '/all-commissions',
        role: ['admin','access-all-commissions']
    },
    {
        label: 'Refunds',
        icon: 'bx bxs-dollar-circle',
        link: '/refunds',
        role: ['admin','access-refunds']
    },
    {
        label: 'Add Approver',
        icon: 'bxs-user-plus',
        link : '/add-approver',
        role: ['admin','access-add-approver']
    },
    {
        label: 'All Approvers',
        icon: 'bxs-user-check',
        link : '/all-approvers',
        role: ['admin','access-all-approvers']
    },
    {
        label: 'Approve Artist',
        icon: 'bxs-user-plus',
        link : '/artist-approve',
        role: ['tag','access-artist-approve']
    },
    {
        label: 'History',
        icon: 'bx-history',
        link : '/user-history',
        role: ['user','access-user-history']
    },
    {
        label: 'Profile',
        icon: 'bxs-id-card',
        link : '/user-profile',
        role: ['admin','user','tag','access-user-profile']
    },
    {
        label: 'History',
        icon: 'bx-history',
        link : '/tag-history',
        role: ['tag','access-tag-history']
    },
    {
        label: 'Transactions',
        icon: 'bx-transfer-alt',
        link : '/transactions',
        role: ['user','artist','access-transactions']
    },
    {
        label: 'Wallet Transactions',
        icon: 'bxs-dollar-circle',
        link : '/wallet-transactions',
        role: ['user','artist','access-wallet-transactions']
    },
    {
        label: 'Withdraw Requests',
        icon: 'bx-transfer-alt',
        link : '/pending-withdraws',
        role: ['admin','access-pending-withdraws']
    }
]