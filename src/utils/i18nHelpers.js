/** Internal API values for sentiment (always Arabic in DB). */
export const SENTIMENT_POSITIVE = 'إيجابي'
export const SENTIMENT_NEGATIVE = 'سلبي'
export const SENTIMENT_NEUTRAL = 'محايد'
export const ALL_TOPICS_KEY = 'الكل'
export const TOPIC_UNSPECIFIED = 'غير محدد'

const SENTIMENT_EN = {
  [SENTIMENT_POSITIVE]: 'Positive',
  [SENTIMENT_NEGATIVE]: 'Negative',
  [SENTIMENT_NEUTRAL]: 'Neutral',
}

export function translateSentiment(lang, sentiment) {
  if (!sentiment) return sentiment
  if (lang === 'ar') return sentiment
  return SENTIMENT_EN[sentiment] || sentiment
}

export function topicFilterLabel(lang, topic) {
  if (topic === ALL_TOPICS_KEY) {
    return lang === 'ar' ? 'كل المواضيع' : 'All topics'
  }
  if (!topic || topic === TOPIC_UNSPECIFIED) {
    return lang === 'ar' ? TOPIC_UNSPECIFIED : 'Unspecified'
  }
  return topic
}

export function formatAppDate(lang, dateInput) {
  if (!dateInput) return lang === 'ar' ? 'غير محدد' : 'N/A'
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (Number.isNaN(d.getTime())) return lang === 'ar' ? 'غير محدد' : 'N/A'
  return d.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function localeForCharts(lang) {
  return lang === 'ar' ? 'ar-EG' : 'en-US'
}

/** True when analysis was routed to Gemini (online AI). */
export function isGeminiEngine(engineUsed) {
  return (engineUsed || '').toLowerCase().includes('gemini')
}

/** MARBERT, lexicon, context rules, system rules, hybrid local path, etc. */
export function isLocalTrainedEngine(engineUsed) {
  return !isGeminiEngine(engineUsed)
}
