import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams)=> ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {
          folder: 'electrical-club',
        },
        uploadStream: {
          folder: 'electrical-club',
        },
        delete: {},
      },
      // Cloudinary free tier / most hosts default to a small body limit.
      // Bump this if you're uploading large event photos or gallery images.
      sizeLimit: env.int('UPLOAD_SIZE_LIMIT', 10 * 1024 * 1024), // 10MB
    },
  },

  // Optional: control Strapi's auto-generated responsive image sizes
  // (large/medium/small/thumbnail) that get created alongside the original.
  // Uncomment if you want to customize breakpoints for the gallery/members pages.
  // 'upload-responsive-breakpoints': {
  //   config: {
  //     breakpoints: {
  //       xlarge: 1920,
  //       large: 1000,
  //       medium: 750,
  //       small: 500,
  //       xsmall: 64,
  //     },
  //   },
  // },

  // Optional: transactional email (registration confirmations, password resets)
  // Useful once your event registration flow needs to email attendees.
  email: {
  config: {
    provider: "nodemailer",
    providerOptions: {
      host: env("SMTP_HOST"),
      port: env.int("SMTP_PORT", 587),
      secure: env.bool("SMTP_SECURE", false), // <-- Add this
      auth: {
        user: env("SMTP_USERNAME"),
        pass: env("SMTP_PASSWORD"),
      },
    },
    settings: {
      defaultFrom: env("SMTP_FROM"),
      defaultReplyTo: env("SMTP_FROM"),
    },
  },
},
});

export default config;