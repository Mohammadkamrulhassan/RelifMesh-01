const NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', path: '/app/dashboard', icon: 'dashboard', roles: ['UPAZILA_OFFICER', 'UP_OFFICIAL', 'NGO_WORKER', 'CITIZEN'] },
    ],
  },
  {
    section: 'My Requests',
    items: [
      { key: 'relief-requests', label: 'My Requests', path: '/app/relief-requests', icon: 'hand', roles: ['CITIZEN'] },
      { key: 'relief-request-new', label: 'Request Relief', path: '/app/relief-requests/new', icon: 'plus', roles: ['CITIZEN'] },
    ],
  },
  {
    section: 'Management',
    items: [
      { key: 'households', label: 'Households', path: '/app/households', icon: 'building', roles: ['UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER'] },
      { key: 'distributions', label: 'Distributions', path: '/app/distributions', icon: 'truck', roles: ['UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER'] },
      { key: 'need-dashboard', label: 'Need Assessment', path: '/app/need-dashboard', icon: 'chart', roles: ['UPAZILA_OFFICER', 'UP_OFFICIAL'] },
      { key: 'pledges', label: 'Pledges', path: '/app/pledges', icon: 'heart', roles: ['UPAZILA_OFFICER', 'UP_OFFICIAL', 'NGO_WORKER', 'CITIZEN'] },
      { key: 'relief-requests-admin', label: 'Relief Requests', path: '/app/relief-requests/admin', icon: 'hand', roles: ['UPAZILA_OFFICER', 'UP_OFFICIAL', 'NGO_WORKER'] },
    ],
  },
  {
    section: 'Reports',
    items: [
      { key: 'reports', label: 'Reports', path: '/app/reports', icon: 'clipboard', roles: ['UPAZILA_OFFICER'] },
    ],
  },
  {
    section: 'Feedback',
    items: [
      { key: 'feedback', label: 'Submit Feedback', path: '/app/feedback', icon: 'message', roles: ['UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER', 'CITIZEN'] },
      { key: 'feedback-manage', label: 'Manage Feedback', path: '/app/feedback/manage', icon: 'list', roles: ['UPAZILA_OFFICER'] },
    ],
  },
  {
    section: 'System',
    items: [
      { key: 'admin', label: 'Admin', path: '/app/admin', icon: 'shield', roles: ['UPAZILA_OFFICER'] },
      { key: 'profile', label: 'Profile', path: '/app/profile', icon: 'user', roles: ['UPAZILA_OFFICER', 'UP_OFFICIAL', 'NGO_WORKER', 'CITIZEN'] },
    ],
  },
]

export function getNavItems(role) {
  if (!role) return NAV_ITEMS.filter(s => s.items.every(i => i.public))
  return NAV_ITEMS.map(section => ({
    ...section,
    items: section.items.filter(item => !item.roles || item.roles.includes(role)),
  })).filter(s => s.items.length > 0)
}
