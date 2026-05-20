export interface ITrustbadge {
  id: string
  children: ITrustbadgeChildren[]
}
export interface ITrustbadgeChildren {
  tag?: string
  attributes: {
    [key: string]: { value?: string | number | boolean; attributeName?: string }
  }
  children?: ITrustbadgeChildren[]
}

export interface IWidgets {
  children: Array<{
    tag?: string
    attributes?: {
      [key: string]: { value?: string; attributeName?: string }
    }
    children: IWidgetsChildren[]
  }>
}
export interface IWidgetsChildren {
  tag?: string
  widgetId: string
  applicationType: string
  widgetLocation?: {
    id: string
    name: string
  }
  extensions?: {
    product_star: {
      tag: string
    }
  }
  attributes?: {
    [key: string]: { value?: string; attributeName?: string }
  }
}

export interface ITrstdLoginConfiguration {
  script?: {
    tag?: string
    attributes?: {
      [key: string]: { value?: string; attributeName?: string }
    }
  }
  integration?: {
    applicationType?: string
    tag?: string
    location?: {
      id?: string
      name?: string
    }
    trstdLoginEnabled?: boolean
  }
}

export interface ITrstdLogin {
  id: string
  salesChannelRef: string
  configuration?: ITrstdLoginConfiguration
}

export interface IMappedChannel {
  eTrustedChannelRef: string
  eTrustedLocale: string
  eTrustedName: string
  eTrustedUrl: string
  eTrustedAccountRef: string
  salesChannelRef: string
  salesChannelLocale: string
  salesChannelName: string
  salesChannelUrl: string
}
