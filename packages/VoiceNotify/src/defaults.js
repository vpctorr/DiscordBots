export const defaults = {
  one2one: {
    label: 'A personnal voice chat',
    emoji: '🤝',
    description: 'Lower thresholds suited for one-to-one chats',
    settings: {
      threshold: 1,
      interval: 30,
      requireEmpty: true
    }
  },
  many2many: {
    label: 'A voice chat with a few people',
    emoji: '👋',
    description: 'Mid-ranged thresholds suited for many-to-many chats',
    settings: {
      threshold: 5,
      interval: 600,
      requireEmpty: true
    }
  },
  one2many: {
    label: 'A voice chat for larger events',
    emoji: '🙌',
    description: 'Higher thresholds suited for one-to-many chats',
    settings: {
      threshold: 15,
      interval: 3600,
      requireEmpty: false
    }
  }
}
/* 
export const valuesDefaults = {
  one2one: ['1', '30 seconds', 'Yes'],
  many2many: ['5', '10 minutes', 'Yes'],
  one2many: ['15', '1 hour', 'No']
}
 */
