import { settingSingle } from '../strapiClient'
import type { Settings } from '../../types/setting'

export const SettingsService = {
  async getSettings(): Promise<Settings | null > {
    const response = await settingSingle.find({
      populate: 'paymentQr',
    })
    const setting = response.data
    return setting 

  },
}