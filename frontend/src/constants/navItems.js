const NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['UPAZILA_OFFICER', 'UP_OFFICIAL', 'NGO_WORKER'] },
    ],
  },
  {
    section: 'Management',
    items: [
      { key: 'households', label: 'Households', path: '/households', icon: 'building', roles: ['UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER'] },
      { key: 'distributions', label: 'Distributions', path: '/distributions', icon: 'truck', roles: ['UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER'] },
    ],
  },
  {
    section: 'Reports',
    items: [
      { key: 'reports', label: 'Reports', path: '/reports', icon: 'clipboard', roles: ['UPAZILA_OFFICER'] },
    ],
  },
  {
    section: 'Feedback',
    items: [
      { key: 'feedback', label: 'Submit Feedback', path: '/feedback', icon: 'message', roles: ['UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER'] },
      { key: 'feedback-manage', label: 'Manage Feedback', path: '/feedback/manage', icon: 'list', roles: ['UPAZILA_OFFICER'] },
    ],
  },
  {
    section: 'System',
    items: [
      { key: 'admin', label: 'Admin', path: '/admin', icon: 'shield', roles: ['UPAZILA_OFFICER'] },
      { key: 'profile', label: 'Profile', path: '/profile', icon: 'user', roles: ['UPAZILA_OFFICER', 'UP_OFFICIAL', 'NGO_WORKER'] },
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
