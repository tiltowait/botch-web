interface Subcategory {
  name: string
  traits: string[]
}

interface Category {
  category: string
  subcategories: Subcategory[]
}

export interface SpecialTrait {
  label: string
  name: string
  type: string
  options?: string[] | number[]
  default: string | number
}

interface Special {
  splat: string
  traits: SpecialTrait[]
}

export interface CharacterSheetData {
  line: string
  splats: string[]
  grounding: Record<string, string>
  inherent: Category
  learned: Category
  special?: Special[]
}

export class CharacterSheet {
  line: string
  splats: string[]
  grounding: Record<string, string>
  inherent: Category
  learned: Category
  virtues?: string[][]
  special?: Special[]

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
