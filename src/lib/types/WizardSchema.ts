// import { CharacterSheet, CharacterSheetData } from './CharacterSheet'
import { CharacterSheet } from './CharacterSheet'
import type { CharacterSheetData } from './CharacterSheet'

interface WizardSchemaData {
  guildName: string
  guildIcon: string | null
  traits: CharacterSheetData
}

export class WizardSchema {
  guildName: string
  guildIcon: string | null
  traits: CharacterSheet

  constructor(data: string | WizardSchemaData) {
    const parsedData: WizardSchemaData = typeof data === 'string' ? JSON.parse(data) : data
    this.guildName = parsedData.guildName
    this.guildIcon = parsedData.guildIcon
    this.traits = new CharacterSheet(parsedData.traits)
  }
}
