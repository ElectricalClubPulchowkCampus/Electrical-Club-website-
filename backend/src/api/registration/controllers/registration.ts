import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";

const { ApplicationError, NotFoundError } = errors;

export default factories.createCoreController(
  "api::registration.registration",
  ({ strapi }) => ({
    async create(ctx) {
      const data = ctx.request.body?.data;

      if (!data) {
        throw new ApplicationError("No registration data provided.");
      }

      const {
        fullName,
        email,
        phone,
        rollNumber,
        Institution,
        notes,
        event,
        venue,
        payment,
      } = data;

      if (!event) {
        throw new ApplicationError("Event is required.");
      }

      // ----------------------------------------------------------------
      // Query 1: Get event
      // ----------------------------------------------------------------
      const eventDoc = await strapi.documents("api::event.event").findOne({
        documentId: event,
        populate: {
          venue: true,
        },
      });

      if (!eventDoc) {
        throw new NotFoundError("Event not found.");
      }

      // ----------------------------------------------------------------
      // Query 2: Get all registrations for this event
      // ----------------------------------------------------------------
      const registrations = await strapi
        .documents("api::registration.registration")
        .findMany({
          filters: {
            event: {
              documentId: event,
            },
          },
          fields: ["email", "phone", "rollNumber"],
        });

      // Capacity validation
      const capacity = eventDoc.venue?.capacity ?? null;

      if (
        typeof capacity === "number" &&
        registrations.length >= capacity
      ) {
        throw new ApplicationError(
          "Registration is closed. This event is full."
        );
      }

      // Duplicate validation
      for (const registration of registrations) {
        if (registration.email === email) {
          return ctx.badRequest(
  "This email is already registered for this event."
);
        }

        if (phone && registration.phone === phone) {
          return ctx.badRequest(
            "This phone number is already registered for this event."
          );
        }

        if (rollNumber && registration.rollNumber === rollNumber) {
          return ctx.badRequest(
            "This roll number is already registered for this event."
          );
        }
      }

      // ----------------------------------------------------------------
      // Query 3: Create registration
      // ----------------------------------------------------------------
      const createdRegistration = await strapi
        .documents("api::registration.registration")
        .create({
          data: {
            fullName,
            email,
            phone,
            rollNumber,
            Institution,
            notes,
            event,
            venue,
            payment,
          },
        });

      ctx.body = {
        data: createdRegistration,
      };
    },
    
  })
);