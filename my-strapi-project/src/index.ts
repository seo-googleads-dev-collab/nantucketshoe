// Auto-grant public read permissions for page content types on bootstrap.
export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    const publicRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (!publicRole) return;

    const actions = [
      "api::home-page.home-page.find",
      "api::about-page.about-page.find",
      "api::rando-page.rando-page.find",
      "api::shoes-page.shoes-page.find",
      "api::contact-page.contact-page.find",
      "api::site-global.site-global.find",
      "api::shoe.shoe.find",
      "api::shoe.shoe.findOne",
    ];

    for (const action of actions) {
      const existing = await strapi
        .query("plugin::users-permissions.permission")
        .findOne({ where: { action, role: publicRole.id } });

      if (!existing) {
        await strapi.query("plugin::users-permissions.permission").create({
          data: { action, role: publicRole.id },
        });
      }
    }
  },
};
