/**
 * shift controller
 */

import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const { NotFoundError } = errors;

export default factories.createCoreController('api::shift.shift', ({ strapi }) => ({
  async getCapacity(ctx) {
    const { id } = ctx.params;

    const shiftDoc = await strapi.documents('api::shift.shift').findOne({
      documentId: id,
      populate: {
        venue: true,
        event: {
          populate: {
            venue: true,
          },
        },
      },
    });

    if (!shiftDoc) {
      throw new NotFoundError('Shift not found.');
    }

    // Count registrations directly — strapi.documents() runs with full
    // internal access regardless of public API permissions, so this
    // works even though Registration only has "create" enabled publicly.
    const registeredCount = await strapi.documents('api::registration.registration').count({
      filters: {
        shift: {
          documentId: id,
        },
      },
    });

    const capacity =
      shiftDoc.capacity ??
      shiftDoc.venue?.capacity ??
      shiftDoc.event?.venue?.capacity ??
      null;

    const isFull = typeof capacity === 'number' && registeredCount >= capacity;

    ctx.body = {
      data: {
        capacity,
        registered: registeredCount,
        isFull,
        spotsLeft: typeof capacity === 'number' ? Math.max(capacity - registeredCount, 0) : null,
      },
    };
  },
}));