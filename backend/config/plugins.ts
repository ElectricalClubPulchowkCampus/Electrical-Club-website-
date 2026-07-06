import type { Core } from "@strapi/strapi";

export default ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  email: {
    config: {
      provider: "@strapi/provider-email-nodemailer",
      providerOptions: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
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