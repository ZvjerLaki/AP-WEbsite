import type { StructureResolver } from 'sanity/structure'
import {
  ComposeIcon,
  FolderIcon,
  WrenchIcon,
  UsersIcon,
  DocumentsIcon,
  CogIcon,
} from '@sanity/icons'

const PAGE_SINGLETONS = [
  { title: 'Home', identifier: 'home' },
  { title: 'About', identifier: 'about' },
  { title: 'Contact', identifier: 'contact' },
  { title: 'AP Lab', identifier: 'ap-lab' },
  { title: 'Privacy Policy', identifier: 'privacy-policy' },
  { title: 'Terms of Service', identifier: 'terms-of-service' },
  { title: 'Disclaimer', identifier: 'disclaimer' },
]

const SERVICE_CATEGORIES = [
  { title: 'Innovate', value: 'innovate' },
  { title: 'Build', value: 'build' },
  { title: 'Refresh', value: 'refresh' },
  { title: 'Accelerate', value: 'accelerate' },
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Insights')
        .icon(ComposeIcon)
        .child(S.documentTypeList('post').title('Insights')),

      S.listItem()
        .title('Stories')
        .icon(FolderIcon)
        .child(S.documentTypeList('story').title('Stories')),

      S.listItem()
        .title('Services')
        .icon(WrenchIcon)
        .child(
          S.list()
            .title('Services')
            .items(
              SERVICE_CATEGORIES.map((cat) =>
                S.listItem()
                  .title(cat.title)
                  .id(`service-${cat.value}`)
                  .child(
                    S.documentList()
                      .title(cat.title)
                      .filter('_type == "service" && category == $category')
                      .params({ category: cat.value })
                  )
              )
            )
        ),

      S.listItem()
        .title('Team Members')
        .icon(UsersIcon)
        .child(S.documentTypeList('teamMember').title('Team Members')),

      S.divider(),

      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items(
              PAGE_SINGLETONS.map((p) =>
                S.listItem()
                  .title(p.title)
                  .id(`page-${p.identifier}`)
                  .child(
                    S.documentList()
                      .title(p.title)
                      .filter('_type == "page" && identifier == $identifier')
                      .params({ identifier: p.identifier })
                  )
              )
            )
        ),

      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
    ])
