import type { StrapiMedia } from "./strapi"
export interface Settings {
  documentId: string
   paymentQr?: StrapiMedia[] | null   // now an array
  paymentQrCaption?: string | null
}