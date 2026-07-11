import { strapiClient } from '../strapiClient'
import type { ShiftCapacityResponse } from '../../types/Shift'

export const ShiftService = {
  async getShiftCapacity(shiftDocumentId: string): Promise<ShiftCapacityResponse> {
    const response = await strapiClient.fetch(`/shifts/${shiftDocumentId}/capacity`, {
      method: 'GET',
    })
    const json = await response.json()
    return json.data as ShiftCapacityResponse
  },
}