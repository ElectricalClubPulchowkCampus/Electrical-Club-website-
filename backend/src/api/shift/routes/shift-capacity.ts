/**
 * custom shift routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/shifts/:id/capacity',
      handler: 'shift.getCapacity',
      config: {
        auth: false, // public endpoint — only returns numbers, no registrant data
      },
    },
  ],
};