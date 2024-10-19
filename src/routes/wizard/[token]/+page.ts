import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit';

import { WizardSchema } from '$lib/types/WizardSchema'
import testData from './vtm.json'

export const load: PageLoad = async ({ params, fetch }) => {
  const { token } = params

  const fetchCharacterSheet = async (token: string): WizardSchema => {
    const response = await fetch(`http://localhost:8000/character/create/${token}`)
    if (!response.ok) {
      const details = await response.json()
      throw error(404, details.detail)
    }

    const data = await response.json()
    return new WizardSchema(data)
  }

  const wizardSchema = await fetchCharacterSheet(token)
  // const wizardSchema = new WizardSchema(testData)
  return {
    token,
    wizardSchema,
    title: 'Create a character'
  }
}
