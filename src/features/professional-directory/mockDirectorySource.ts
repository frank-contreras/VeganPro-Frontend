import { ALL, type DirectorySource } from './model'
import { sampleOptions, sampleProfessionals, type SampleProfessional } from './fixtures'

export function createMockDirectorySource(
  records: readonly SampleProfessional[] = sampleProfessionals,
): DirectorySource {
  return {
    load: async (selection) => ({
      options: sampleOptions,
      professionals: records.filter((record) =>
        record.eligible &&
        (selection.category === ALL || record.categoryValue === selection.category) &&
        (selection.affiliation === ALL || record.affiliation === selection.affiliation),
      ),
    }),
  }
}

// Stable instance: re-rendering the page does not restart the source operation.
export const mockDirectorySource = createMockDirectorySource()
