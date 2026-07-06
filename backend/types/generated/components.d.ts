import type { Schema, Struct } from '@strapi/strapi';

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'social-link';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      [
        'facebook',
        'twitter',
        'instagram',
        'linkedin',
        'youtube',
        'tiktok',
        'github',
      ]
    >;
    url: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.social-link': SharedSocialLink;
    }
  }
}
