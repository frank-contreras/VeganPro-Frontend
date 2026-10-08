import { ProfessionalDirectoryPage } from './features/professional-directory/ProfessionalDirectoryPage'
import { mockDirectorySource } from './features/professional-directory/mockDirectorySource'

export function App() {
  return <ProfessionalDirectoryPage source={mockDirectorySource} />
}
