import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import type { Core } from "@strapi/strapi";

function formatTime(time?: string | Date | null): string {
  if (!time) return "TBA";

  let hours: number;
  let minutes: number;

  if (time instanceof Date) {
    hours = time.getHours();
    minutes = time.getMinutes();
  } else {
    const [h, m] = time.split(":");
    hours = Number(h);
    minutes = Number(m);
  }

  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // ...
    strapi.documents.use(async (context, next) => {
      // Only care about Registration updates
      if (
        context.uid !== "api::registration.registration" ||
        context.action !== "update"
      ) {
        return next();
      }

      const documentId =
        (context.params as any)?.documentId ||
        (context.params as any)?.where?.documentId;

      if (!documentId) {
        return next();
      }

      // Previous registration
      const previous = await strapi
        .documents("api::registration.registration")
        .findOne({
          documentId,
          populate: {
            event: {
              populate: {
                venue: true,
                
              },
            },
            shift:true
          },
        });


      // Execute update
      const result = await next();

      // Updated registration
      const updated = await strapi
        .documents("api::registration.registration")
        .findOne({
          documentId,
          populate: {
            event: {
              populate: {
                venue: true,
                
              },
            },
            shift:true
          },
        });


      if (
        previous?.status_registration !== "confirmed" &&
        updated?.status_registration === "confirmed"
      ) {

        await strapi.plugin("email").service("email").send({
          to: updated.email,
          subject: `Registration Confirmed - ${updated.event.title}`,
          html: `
            <h2>Hello ${updated.fullName},</h2>

            <p>Your registration for
            <strong>${updated.event.title}</strong>
            has been confirmed.</p>
            <p><strong>Date:</strong> ${new Date(updated.event.startDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${formatTime(updated.shift.startTime)} - ${formatTime(updated.shift.endTime)}</p>
            <p><strong>Venue:</strong> ${updated.event.venue?.name ?? "TBA"}</p>

            <br>

            <p>We look forward to seeing you.</p>

            <p><strong>Electrical Club</strong></p>
          `,
        });

      }

      return result;
    });
  },

  bootstrap() {},
};