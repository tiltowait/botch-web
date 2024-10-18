// import { CharacterSheet, CharacterSheetData } from './CharacterSheet'
import { CharacterSheet } from './CharacterSheet'
import type { CharacterSheetData } from './CharacterSheet'

interface WizardSchemaData {
  guildName: string
  traits: CharacterSheetData
}

export class WizardSchema {
  guildName: string
  traits: CharacterSheet

  constructor(data: string | WizardSchemaData) {
    const parsedData: WizardSchemaData = typeof data === 'string' ? JSON.parse(data) : data
    this.guildName = parsedData.guildName
    this.traits = new CharacterSheet(parsedData.traits)
  }
}
