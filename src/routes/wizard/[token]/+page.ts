import type { PageLoad } from './$types'
import characterSheetData from './vtm.json'
import { CharacterSheet } from '$lib/types/CharacterSheet'

export const load: PageLoad = async ({ params, fetch }) => {
  const { token } = params

  const fetchCharacterSheet = async (token: string): CharacterSheet => {
    // await fetch ...
    return new CharacterSheet(characterSheetData)
  }

  const characterSheet = await fetchCharacterSheet(token)
  return {
    characterSheet
  }
}
