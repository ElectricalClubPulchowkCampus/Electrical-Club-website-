import { clubSettingSingle, settingSingle } from '../strapiClient'
import type { Settings } from '../../types/setting'
import type { ClubSetting } from '../../types/clubSetting'

export const SettingsService = {
  async getSettings(): Promise<Settings | null > {
    const response = await settingSingle.find({
      populate: 'paymentQr',
    })
    const setting = response.data
    return setting 

  },
  async getClubSettings(): Promise<ClubSetting | null > {
    const response = await clubSettingSingle.find({
      populate:'*'
    })
    const setting = response.data
    return setting as ClubSetting

  },
}