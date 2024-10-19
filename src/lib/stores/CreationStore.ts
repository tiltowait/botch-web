import { writable } from 'svelte/store'

export interface CreationInfo {
  guildName: string
  guildIcon: string | null
  characterName: string
}

export const creationInfoStore = writable<CreationInfo | null>(null)
