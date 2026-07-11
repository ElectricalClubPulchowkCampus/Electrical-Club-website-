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
        shift, // <-- new field: documentId of the selected shift
      } = data;

      if (!event) {
        throw new ApplicationError("Event is required.");
      }

      if (!shift) {
        throw new ApplicationError("Shift is required.");
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
      // Query 2: Get the shift and confirm it belongs to this event
      // ----------------------------------------------------------------
      const shiftDoc = await strapi.documents("api::shift.shift").findOne({
        documentId: shift,
        populate: {
          event: true,
        },
      });

      if (!shiftDoc) {
        throw new NotFoundError("Shift not found.");
      }

      if (shiftDoc.event?.documentId !== event) {
        throw new ApplicationError(
          "Selected shift does not belong to this event."
        );
      }

      // ----------------------------------------------------------------
      // Query 3: Get all registrations for this SHIFT (not just event)
      // ----------------------------------------------------------------
      const shiftRegistrations = await strapi
        .documents("api::registration.registration")
        .findMany({
          filters: {
            shift: {
              documentId: shift,
            },
          },
          fields: ["email", "phone", "rollNumber"],
        });

      // ----------------------------------------------------------------
      // Shift capacity validation
      // ----------------------------------------------------------------
      const shiftCapacity = shiftDoc.capacity ?? null;

      if (
        typeof shiftCapacity === "number" &&
        shiftRegistrations.length >= shiftCapacity
      ) {
        throw new ApplicationError(
          "Registration is closed. This shift is full."
        );
      }

      // ----------------------------------------------------------------
      // (Optional) Overall event/venue capacity validation
      // ----------------------------------------------------------------
      const venueCapacity = eventDoc.venue?.capacity ?? null;

      if (typeof venueCapacity === "number") {
        const eventRegistrations = await strapi
          .documents("api::registration.registration")
          .findMany({
            filters: {
              event: {
                documentId: event,
              },
            },
            fields: ["id"],
          });

        if (eventRegistrations.length >= venueCapacity) {
          throw new ApplicationError(
            "Registration is closed. This event is full."
          );
        }
      }

      // ----------------------------------------------------------------
      // Duplicate validation — scoped to this SHIFT
      // (prevents someone registering twice for the same shift,
      //  but still allows registering for a different shift of the same event)
      // ----------------------------------------------------------------
      for (const registration of shiftRegistrations) {
        if (registration.email === email) {
          return ctx.badRequest(
            "This email is already registered for this shift."
          );
        }

        if (phone && registration.phone === phone) {
          return ctx.badRequest(
            "This phone number is already registered for this shift."
          );
        }

        if (rollNumber && registration.rollNumber === rollNumber) {
          return ctx.badRequest(
            "This roll number is already registered for this shift."
          );
        }
      }

      // ----------------------------------------------------------------
      // Create registration
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
            shift,
          },
        });

      ctx.body = {
        data: createdRegistration,
      };
    },
  })
);