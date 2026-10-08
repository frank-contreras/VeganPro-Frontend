import { LocaleProvider } from '../../src/localization/LocaleProvider'
import { DocumentMetadata } from '../../src/localization/DocumentMetadata'
import { catalogs, supportedLocale, type Catalogs } from '../../src/localization/resolveMessage'
// Separate browser-test entry; never included in the published build.
import { createRoot } from 'react-dom/client'
import { ProfessionalDirectoryPage } from '../../src/features/professional-directory/ProfessionalDirectoryPage'
import { createMockDirectorySource } from '../../src/features/professional-directory/mockDirectorySource'
import { sampleOptions, sampleProfessionals } from '../../src/features/professional-directory/fixtures'
import { ALL, type DirectorySource } from '../../src/features/professional-directory/model'
import '../../src/styles.css'

const params = new URLSearchParams(location.search)
const mode = params.get('state')
const locale = supportedLocale(params.get('locale') ?? 'es')
let available: Catalogs = catalogs
if (params.get('copy') === 'long') {
  available = Object.fromEntries(Object.entries(catalogs).map(([code, catalog]) => [code, { ...catalog,
    'hero.description': catalog!['hero.description']!.repeat(3),
    'filters.category': catalog!['filters.category']!.repeat(3),
    'feedback.empty': catalog!['feedback.empty']!.repeat(3),
    'feedback.noMatches': catalog!['feedback.noMatches']!.repeat(3),
    'feedback.error': catalog!['feedback.error']!.repeat(3),
    'feedback.pending': catalog!['feedback.pending']!.repeat(3),
    'footer.context': catalog!['footer.context']!.repeat(3),
  }]))
}
if (params.get('copy') === 'fallback') available = { es: catalogs.es, en: { ...catalogs.en, 'filters.category': ' ', 'category.nutrition': '' } }
const longRecords = sampleProfessionals.map((p, i) => i ? p : {
  ...p, categoryLabelKey: undefined, locationLabelKey: undefined, name: 'LongProfessionalNameWithoutSpaces'.repeat(5), category: 'LongCategoryWithoutSpaces'.repeat(4), location: 'LongLocationWithoutSpaces'.repeat(4),
})
const mock = createMockDirectorySource(longRecords)
const source: DirectorySource = {
  load: async (selection) => {
    if (mode === 'loading') return new Promise(() => {})
    if (mode === 'error') throw new Error('Test-only failure')
    if (mode === 'empty') return { options: sampleOptions, professionals: [] }
    if (mode === 'no-matches' && selection.category !== ALL) return { options: sampleOptions, professionals: [] }
    return mock.load(selection)
  },
}
createRoot(document.getElementById('root')!).render(<LocaleProvider initialLocale={locale} available={available}><DocumentMetadata /><ProfessionalDirectoryPage source={source} /></LocaleProvider>)
