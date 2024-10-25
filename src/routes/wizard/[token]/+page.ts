import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public'

import { generateUrl } from '$lib/httpMethods'
import { WizardSchema } from '$lib/types/WizardSchema'
import testData from './vtm.json'

export const load: PageLoad = async ({ params, fetch }) => {
  const { token } = params

  const fetchCharacterSheet = async (token: string): WizardSchema => {
    const url = generateUrl(token, `/character/create/${token}`)
    const response = await fetch(url)
    if (!response.ok) {
      const details = await response.json()
      throw error(404, details.detail)
    }

    const data = await response.json()
    return new WizardSchema(data)
  }

  const wizardSchema = await fetchCharacterSheet(token)
  return {
    token,
    wizardSchema,
    title: 'Create a character'
  }
}
