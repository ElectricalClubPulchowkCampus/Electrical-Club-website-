'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/events/:id/capacity',
      handler: 'event.capacity',
      config: {
        auth: false,
      },
    },
  ],
};