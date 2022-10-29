import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Human resource management'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
