module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: 'localhost',
      port: 1030,
      ignoreTLS: true,
    },
  },
});
