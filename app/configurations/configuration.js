module.exports = Configuration = {
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_KEY: process.env.JWT_KEY,
    MAILING_TYPE: process.env.MAILING_TYPE,
    AWS_SES_ACCESS_KEY_ID: process.env.AWS_SES_ACCESS_KEY_ID,
    AWS_SES_SECRET_ACCESS_KEY: process.env.AWS_SES_SECRET_ACCESS_KEY,
    AWS_SES_REGION: process.env.AWS_SES_REGION,
    CLIENT_URL: process.env.CLIENT_URL
}
