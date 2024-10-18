interface Subcategory {
  name: string
  traits: string[]
}

interface Category {
  category: string
  subcategories: Subcategory[]
}

export interface CharacterSheetData {
  line: string
  splats: string[]
  inherent: Category
  learned: Category
}

export class CharacterSheet {
  line: string
  splats: string[]
  inherent: Category
  learned: Category
  virtues?: string[][]

  constructor(data: string | CharacterSheetData) {
    let parsedData: CharacterSheetData

    if (typeof data === 'string') {
      parsedData = JSON.parse(data)
    } else {
      parsedData = data
    }

    Object.assign(this, parsedData)
  }
}
