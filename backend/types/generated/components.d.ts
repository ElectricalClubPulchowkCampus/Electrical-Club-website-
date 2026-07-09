import type { Schema, Struct } from '@strapi/strapi';

export interface SharedClubPillars extends Struct.ComponentSchema {
  collectionName: 'components_shared_club_pillars';
  info: {
    displayName: 'club_pillars';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedFaqs extends Struct.ComponentSchema {
  collectionName: 'components_shared_faqs';
  info: {
    displayName: 'faqs';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.Text;
  };
}

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
        'email',
      ]
    >;
    url: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.club-pillars': SharedClubPillars;
      'shared.faqs': SharedFaqs;
      'shared.social-link': SharedSocialLink;
    }
  }
}
