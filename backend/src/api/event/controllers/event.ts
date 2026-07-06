"use strict";
const { createCoreController } = require("@strapi/strapi").factories;


// Merge this action into src/api/event/controllers/event.js — if that file
// already has a createCoreController(...) call, just add `capacity` as
// another key on the object it returns rather than duplicating the file.

module.exports = createCoreController('api::event.event', ({ strapi }) => ({
  async capacity(ctx) {
    const { id } = ctx.params;

    const event = await strapi.documents('api::event.event').findOne({
      documentId: id,
      populate: { venue: true },
    });

    if (!event) {
      return ctx.notFound('Event not found');
    }

    const registeredCount = await strapi.documents('api::registration.registration').count({
      filters: { event: { documentId: id } },
    });

    const capacity = event.venue?.capacity ?? null;
    const isFull = typeof capacity === 'number' ? registeredCount >= capacity : false;

    ctx.body = {
      capacity,
      registered: registeredCount,
      isFull,
    };
  },
}));