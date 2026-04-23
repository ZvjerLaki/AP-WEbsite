import type { SchemaTypeDefinition } from 'sanity'
import { post } from './post'
import { story } from './story'
import { service } from './service'
import { teamMember } from './teamMember'
import { page } from './page'
import { siteSettings } from './siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  story,
  service,
  teamMember,
  page,
  siteSettings,
]
