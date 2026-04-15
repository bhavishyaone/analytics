function dateLabel(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

function lastSeenTs(hoursAgo) {
  return new Date(Date.now() - hoursAgo * 3_600_000).toISOString()
}


const DAILY_COUNTS = [
  51, 67, 55, 73, 49, 58, 42,   
  37, 44, 35, 58, 41, 50, 36,   
  33, 40, 31, 52, 37, 46, 32,   
  30, 37, 28, 48, 34, 42, 29,   
  27, 34, 25, 44, 31, 38, 26,   
  24, 31, 22, 39, 28, 35, 23,   
  21, 28, 19, 35, 25, 31, 20,  
  19, 25, 17, 31, 22, 28, 18,   
  17, 22, 15, 28, 20, 25, 16,  
  16, 20, 13, 25, 18, 22, 14,   
  14, 18, 12, 23, 16, 20, 13,   
  13, 16, 11, 21, 14, 18, 12,   
  12, 14, 10, 9, 11, 13,        
]

const OVERVIEW_BY_DAYS = {
  7:  { totalEvents: 395,  uniqueUsers: 174, periodDays: 7  },
  30: { totalEvents: 1847, uniqueUsers: 412, periodDays: 30 },
  90: { totalEvents: 5234, uniqueUsers: 891, periodDays: 90 },
}

const TOP_EVENTS_BY_DAYS = {
  7: [
    { name: 'page_view',       count: 196, uniqueUsers: 143, lastSeen: lastSeenTs(1)  },
    { name: 'feature_used',    count: 123, uniqueUsers: 97,  lastSeen: lastSeenTs(2)  },
    { name: 'button_click',    count: 82,  uniqueUsers: 71,  lastSeen: lastSeenTs(3)  },
    { name: 'settings_opened', count: 74,  uniqueUsers: 58,  lastSeen: lastSeenTs(5)  },
    { name: 'error_occurred',  count: 65,  uniqueUsers: 43,  lastSeen: lastSeenTs(6)  },
    { name: 'video_played',    count: 47,  uniqueUsers: 39,  lastSeen: lastSeenTs(8)  },
  ],
  30: [
    { name: 'page_view',       count: 921, uniqueUsers: 374, lastSeen: lastSeenTs(1)  },
    { name: 'feature_used',    count: 578, uniqueUsers: 291, lastSeen: lastSeenTs(2)  },
    { name: 'button_click',    count: 384, uniqueUsers: 218, lastSeen: lastSeenTs(3)  },
    { name: 'settings_opened', count: 346, uniqueUsers: 174, lastSeen: lastSeenTs(4)  },
    { name: 'error_occurred',  count: 303, uniqueUsers: 131, lastSeen: lastSeenTs(5)  },
    { name: 'video_played',    count: 221, uniqueUsers: 117, lastSeen: lastSeenTs(7)  },
  ],
  90: [
    { name: 'page_view',       count: 2614, uniqueUsers: 802, lastSeen: lastSeenTs(1) },
    { name: 'feature_used',    count: 1641, uniqueUsers: 631, lastSeen: lastSeenTs(2) },
    { name: 'button_click',    count: 1091, uniqueUsers: 471, lastSeen: lastSeenTs(3) },
    { name: 'settings_opened', count: 983,  uniqueUsers: 374, lastSeen: lastSeenTs(4) },
    { name: 'error_occurred',  count: 861,  uniqueUsers: 281, lastSeen: lastSeenTs(5) },
    { name: 'video_played',    count: 628,  uniqueUsers: 251, lastSeen: lastSeenTs(6) },
  ],
}

const ACTIVE_USERS = { dau: 86, wau: 174, mau: 380 }

function buildRetentionCohorts() {
  const cohorts = [
    { weeksAgo: 12, totalUsers: 8,  day1: 7,  day7: 5,  day14: 3,  day30: 2  },
    { weeksAgo: 11, totalUsers: 11, day1: 9,  day7: 7,  day14: 4,  day30: 3  },
    { weeksAgo: 10, totalUsers: 14, day1: 12, day7: 9,  day14: 6,  day30: 3  },
    { weeksAgo: 9,  totalUsers: 12, day1: 10, day7: 8,  day14: 5,  day30: 3  },
    { weeksAgo: 8,  totalUsers: 16, day1: 14, day7: 11, day14: 7,  day30: 4  },
    { weeksAgo: 7,  totalUsers: 15, day1: 13, day7: 10, day14: 7,  day30: 4  },
    { weeksAgo: 6,  totalUsers: 20, day1: 17, day7: 13, day14: 9,  day30: 5  },
    { weeksAgo: 5,  totalUsers: 18, day1: 16, day7: 12, day14: 8,  day30: 5  },
    { weeksAgo: 4,  totalUsers: 22, day1: 19, day7: 15, day14: 10, day30: 6  },
    { weeksAgo: 3,  totalUsers: 15, day1: 13, day7: 11, day14: 7,  day30: 0  },
    { weeksAgo: 2,  totalUsers: 20, day1: 17, day7: 14, day14: 0,  day30: 0  },
    { weeksAgo: 1,  totalUsers: 22, day1: 19, day7: 0,  day14: 0,  day30: 0  },
    { weeksAgo: 0,  totalUsers: 14, day1: 12, day7: 0,  day14: 0,  day30: 0  },
  ]

  return cohorts.map(({ weeksAgo, totalUsers, day1, day7, day14, day30 }) => {
    const monday = new Date()
    const dayOfWeek = monday.getDay()
    monday.setDate(monday.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) - weeksAgo * 7)
    const cohortWeek = monday.toISOString().split('T')[0]
    return { cohortWeek, totalUsers, day1, day7, day14, day30 }
  })
}

export function getDemoOverview(days) {
  return OVERVIEW_BY_DAYS[days] ?? OVERVIEW_BY_DAYS[30]
}

export function getDemoEventsOverTime(days) {
  const limit = Math.min(days, DAILY_COUNTS.length)
  return DAILY_COUNTS
    .slice(0, limit)
    .reverse()
    .map((count, index) => ({
      date:  dateLabel(limit - 1 - index),
      count,
    }))
}

export function getDemoTopEvents(days) {
  return TOP_EVENTS_BY_DAYS[days] ?? TOP_EVENTS_BY_DAYS[30]
}

export function getDemoActiveUsers() {
  return ACTIVE_USERS
}

export function getDemoRetention() {
  return buildRetentionCohorts()
}


const RAW_EVENTS_TEMPLATE = [
  { name: 'page_view',          userId: 'user_12',   properties: { page: '/dashboard', browser: 'Chrome', os: 'macOS', country: 'US' } },
  { name: 'button_click',       userId: 'user_45',   properties: { page: '/pricing', browser: 'Safari', os: 'iOS', country: 'IN' } },
  { name: 'feature_used',       userId: 'user_78',   properties: { page: '/features', browser: 'Firefox', os: 'Windows', country: 'GB' } },
  { name: 'page_view',          userId: 'user_23',   properties: { page: '/', browser: 'Chrome', os: 'macOS', country: 'DE' } },
  { name: 'settings_opened',    userId: 'user_91',   properties: { page: '/dashboard', browser: 'Edge', os: 'Windows', country: 'CA' } },
  { name: 'video_played',       userId: 'user_34',   properties: { page: '/docs', browser: 'Chrome', os: 'Android', country: 'AU' } },
  { name: 'error_occurred',     userId: 'user_56',   properties: { page: '/blog', browser: 'Safari', os: 'macOS', country: 'FR' } },
  { name: 'page_view',          userId: 'user_67',   properties: { page: '/pricing', browser: 'Chrome', os: 'Windows', country: 'JP' } },
  { name: 'button_click',       userId: 'user_89',   properties: { page: '/features', browser: 'Firefox', os: 'macOS', country: 'US' } },
  { name: 'feature_used',       userId: 'user_11',   properties: { page: '/dashboard', browser: 'Chrome', os: 'iOS', country: 'IN' } },
  { name: 'signup_started',     userId: 'user_22',   properties: { page: '/', browser: 'Safari', os: 'macOS', country: 'GB' } },
  { name: 'signup_completed',   userId: 'user_22',   properties: { page: '/', browser: 'Safari', os: 'macOS', country: 'GB' } },
  { name: 'page_view',          userId: 'user_33',   properties: { page: '/docs', browser: 'Chrome', os: 'Windows', country: 'US' } },
  { name: 'checkout_started',   userId: 'user_44',   properties: { page: '/pricing', browser: 'Edge', os: 'Windows', country: 'DE' } },
  { name: 'checkout_completed', userId: 'user_44',   properties: { page: '/pricing', browser: 'Edge', os: 'Windows', country: 'DE' } },
  { name: 'page_view',          userId: 'user_55',   properties: { page: '/blog', browser: 'Firefox', os: 'macOS', country: 'CA' } },
  { name: 'feature_used',       userId: 'user_66',   properties: { page: '/features', browser: 'Chrome', os: 'Android', country: 'AU' } },
  { name: 'button_click',       userId: 'user_77',   properties: { page: '/dashboard', browser: 'Safari', os: 'iOS', country: 'FR' } },
  { name: 'settings_opened',    userId: 'user_88',   properties: { page: '/dashboard', browser: 'Chrome', os: 'macOS', country: 'JP' } },
  { name: 'page_view',          userId: 'user_99',   properties: { page: '/', browser: 'Chrome', os: 'Windows', country: 'US' } },
  { name: 'video_played',       userId: 'user_10',   properties: { page: '/docs', browser: 'Firefox', os: 'macOS', country: 'IN' } },
  { name: 'error_occurred',     userId: 'user_20',   properties: { page: '/features', browser: 'Safari', os: 'iOS', country: 'GB' } },
  { name: 'page_view',          userId: 'user_30',   properties: { page: '/pricing', browser: 'Chrome', os: 'Windows', country: 'DE' } },
  { name: 'feature_used',       userId: 'user_40',   properties: { page: '/dashboard', browser: 'Edge', os: 'Windows', country: 'CA' } },
  { name: 'button_click',       userId: 'user_50',   properties: { page: '/', browser: 'Chrome', os: 'macOS', country: 'AU' } },
  { name: 'page_view',          userId: 'user_60',   properties: { page: '/blog', browser: 'Firefox', os: 'Android', country: 'FR' } },
  { name: 'signup_started',     userId: 'user_70',   properties: { page: '/', browser: 'Safari', os: 'macOS', country: 'JP' } },
  { name: 'page_view',          userId: 'user_80',   properties: { page: '/docs', browser: 'Chrome', os: 'iOS', country: 'US' } },
  { name: 'feature_used',       userId: 'user_90',   properties: { page: '/features', browser: 'Chrome', os: 'Windows', country: 'IN' } },
  { name: 'settings_opened',    userId: 'user_15',   properties: { page: '/dashboard', browser: 'Safari', os: 'macOS', country: 'GB' } },
  { name: 'page_view',          userId: 'user_25',   properties: { page: '/pricing', browser: 'Firefox', os: 'macOS', country: 'DE' } },
  { name: 'button_click',       userId: 'user_35',   properties: { page: '/', browser: 'Chrome', os: 'Android', country: 'CA' } },
  { name: 'checkout_started',   userId: 'user_48',   properties: { page: '/pricing', browser: 'Edge', os: 'Windows', country: 'AU' } },
  { name: 'page_view',          userId: 'user_58',   properties: { page: '/dashboard', browser: 'Chrome', os: 'macOS', country: 'FR' } },
  { name: 'video_played',       userId: 'user_68',   properties: { page: '/docs', browser: 'Safari', os: 'iOS', country: 'JP' } },
  { name: 'feature_used',       userId: 'user_18',   properties: { page: '/features', browser: 'Chrome', os: 'Windows', country: 'US' } },
  { name: 'page_view',          userId: 'user_28',   properties: { page: '/blog', browser: 'Firefox', os: 'macOS', country: 'IN' } },
  { name: 'error_occurred',     userId: 'user_38',   properties: { page: '/', browser: 'Chrome', os: 'Android', country: 'GB' } },
  { name: 'page_view',          userId: 'user_48',   properties: { page: '/pricing', browser: 'Safari', os: 'macOS', country: 'DE' } },
  { name: 'button_click',       userId: 'user_58',   properties: { page: '/dashboard', browser: 'Edge', os: 'Windows', country: 'CA' } },
  { name: 'signup_completed',   userId: 'user_70',   properties: { page: '/', browser: 'Safari', os: 'macOS', country: 'JP' } },
  { name: 'page_view',          userId: 'user_14',   properties: { page: '/features', browser: 'Chrome', os: 'iOS', country: 'AU' } },
  { name: 'feature_used',       userId: 'user_24',   properties: { page: '/dashboard', browser: 'Firefox', os: 'Windows', country: 'FR' } },
  { name: 'page_view',          userId: 'user_34',   properties: { page: '/docs', browser: 'Chrome', os: 'macOS', country: 'US' } },
  { name: 'settings_opened',    userId: 'user_54',   properties: { page: '/dashboard', browser: 'Safari', os: 'iOS', country: 'IN' } },
  { name: 'page_view',          userId: 'user_64',   properties: { page: '/', browser: 'Chrome', os: 'Windows', country: 'GB' } },
  { name: 'video_played',       userId: 'user_74',   properties: { page: '/blog', browser: 'Edge', os: 'macOS', country: 'DE' } },
  { name: 'button_click',       userId: 'user_84',   properties: { page: '/pricing', browser: 'Firefox', os: 'Android', country: 'CA' } },
  { name: 'checkout_completed', userId: 'user_48',   properties: { page: '/pricing', browser: 'Edge', os: 'Windows', country: 'AU' } },
  { name: 'page_view',          userId: 'user_94',   properties: { page: '/features', browser: 'Chrome', os: 'macOS', country: 'FR' } },
]

function buildDemoEvents() {
  const events = []
  for (let i = 0; i < RAW_EVENTS_TEMPLATE.length; i++) {
    const template = RAW_EVENTS_TEMPLATE[i]
    const hoursAgo = i * 2.5
    events.push({
      _id: `demo_event_${String(i + 1).padStart(4, '0')}`,
      projectId: 'demo_project',
      name: template.name,
      userId: template.userId,
      properties: template.properties,
      timestamp: new Date(Date.now() - hoursAgo * 3_600_000).toISOString(),
      createdAt: new Date(Date.now() - hoursAgo * 3_600_000).toISOString(),
      updatedAt: new Date(Date.now() - hoursAgo * 3_600_000).toISOString(),
    })
  }
  return events
}

export function getDemoEventsByProject(page, limit, nameFilter) {
  let events = buildDemoEvents()

  if (nameFilter) {
    const regex = new RegExp(nameFilter, 'i')
    events = events.filter(e => regex.test(e.name))
  }

  const total = events.length
  const uniqueEventTypes = [...new Set(events.map(e => e.name))].length
  const skip = (page - 1) * limit
  const paginated = events.slice(skip, skip + limit)

  return { total, page, limit, uniqueEventTypes, events: paginated }
}


const DEMO_FUNNELS = [
  {
    _id: 'demo_funnel_001',
    name: 'Signup to Checkout',
    steps: ['page_view', 'signup_completed', 'checkout_started', 'checkout_completed'],
    timeWindowDays: 30,
    createdAt: new Date('2026-03-01').toISOString(),
    updatedAt: new Date('2026-03-01').toISOString(),
  },
]

export function getDemoFunnelList() {
  return DEMO_FUNNELS
}

export function getDemoFunnelData(steps) {
  const conversionRates = {
    'page_view':          { count: 200, conversionFromPrev: 100, conversionFromFirst: 100 },
    'signup_started':     { count: 168, conversionFromPrev: 84,  conversionFromFirst: 84  },
    'signup_completed':   { count: 150, conversionFromPrev: 89,  conversionFromFirst: 75  },
    'checkout_started':   { count: 90,  conversionFromPrev: 60,  conversionFromFirst: 45  },
    'checkout_completed': { count: 68,  conversionFromPrev: 76,  conversionFromFirst: 34  },
    'feature_used':       { count: 130, conversionFromPrev: 65,  conversionFromFirst: 65  },
    'button_click':       { count: 95,  conversionFromPrev: 73,  conversionFromFirst: 48  },
    'settings_opened':    { count: 72,  conversionFromPrev: 76,  conversionFromFirst: 36  },
    'video_played':       { count: 54,  conversionFromPrev: 75,  conversionFromFirst: 27  },
    'error_occurred':     { count: 38,  conversionFromPrev: 70,  conversionFromFirst: 19  },
  }

  let prevCount = 200
  return steps.map((step, index) => {
    const preset = conversionRates[step]
    if (preset && index === 0) {
      prevCount = preset.count
      return { step, count: preset.count, conversionFromPrev: 100, conversionFromFirst: 100 }
    }
    if (preset) {
      const result = {
        step,
        count: preset.count,
        conversionFromPrev: prevCount > 0 ? Math.round((preset.count / prevCount) * 100) : 0,
        conversionFromFirst: conversionRates[steps[0]] ? Math.round((preset.count / conversionRates[steps[0]].count) * 100) : 0,
      }
      prevCount = preset.count
      return result
    }
    const count = Math.max(10, Math.round(prevCount * 0.65))
    const result = {
      step,
      count,
      conversionFromPrev: prevCount > 0 ? Math.round((count / prevCount) * 100) : 0,
      conversionFromFirst: 200 > 0 ? Math.round((count / 200) * 100) : 0,
    }
    prevCount = count
    return result
  })
}
