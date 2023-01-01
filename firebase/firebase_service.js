var admin = require("firebase-admin");
require("dotenv").config();

var serviceAccount = require("./../serviceAction.json");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "mall-barbershops",
    private_key_id: "eed32a36843a9b7bb7e90e9c0a9772e9f5344e72",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgJArNSfhPh1I4\nZn5W5BH6JWYWlPBqjwz8vZTtYb3EgjioQhy0gwbAAJANhC31CJ8BgCHwpTOgehl8\nAmJpt5qaDlUsENw3my6qpJMXjDvt6VZBcuJcHZrixvmdA6Gp61kCEW+8nyapCtOl\nn3dPKilMylulA4+KE7Yn3kmaYjDYjNAYgANCXjigygDHq4OaAeYkUpulscuB4usH\nbE80WOFXz+bJ0NgXt5juw2Rn9VeNhpGQ44aaJx3q33b6uNU49qahvZDxVO9OjL17\nqGdAm05LC4wNVt8NikS9Jlg54lkdNAzPhXrIKo79xiupwEy1oy/I7wdoOHDxcQV/\ngkWs3/33AgMBAAECggEAEISnOJWwr0NeD8NCtOPBlvPUm++w/MzUoh1MB1BVqrdj\n8LchDt2VDKkCMuK3etbwz87PsWrY8GynxEraq9zsbYec8XarwHCZV7CyG3Ozms6+\nvvGCt8219D5h8Pg27LgB7lyuEd64ticPvb29KMVIjUsyOMstOyjdWS9smCgYsb1q\n1FTGwZcHhFqaokSsuV6FmsNmeR6egHQOZ3ZbvyBQDtTrpg89xHj28UUN5FZkheGS\nFGvp9gAXyAvXIkI9fAxLO6iCk6e3lGUzvyB6gN25k2VMC5bkDOhJYmH2CjQ4ZSj+\nYb+FyXelcurKjiLTdT0Jp/03BHLHLz1UnmGCprqpQQKBgQDLQLrL1Zs6eTjUPJYW\nr8377FEcH9WnV9PsuG5qiOfLb8IUvTupVrSH+o/j6CDkQO3pcrxJSfe6mdB37AfO\nTKt4EvFVpX6dUmTixsyCb452dcTX2tGNCyWorG3P6IvRWZ5AlY8PKKuiCylm9w+P\nYZke+RTmg1FPtTeIfYTccr3xewKBgQDJsyCX09n5yPa0FY/b3yxhO5pyBYP+oe7s\nTP5grM2E0lr7I3+HE8SHBeykMhw4D3iLaap7WOSkJP4PysbZi0eS1sKakgll0xM/\nbYDxyvt7Y2gM7j5xEfuMNduo4Shh14cfIhuzsI8F/wZLLS9Q3d3gJe9fiyi7+H5q\nsJCcHXQmtQKBgAalbDZEGtpTom8WOBYv0318Yb6Yr+TT82MXOM0VAvddBSymb2//\nHNIheFkMex7bnKv4i32eBJK+etmhBzRQv36ip++UBMriKdhchc1yFmd7PF+OkTGa\nfrXARar5wLCszIbyHQZy3wHieY0bYQ/gMiCYJn3PJ3aCx3kYGaMXwWxHAoGAIX9C\nNnTUios5jYbXMWjK8gr4B1+rICq8hznyNRP9vcVBntuyXjiGNvZg6pP348eN+Xk+\n+uU0c55BI1ZF1/Mtm9FW2FzQerynQa1p8L4JLeDAcwVOEXEvGYYISO+7ySQGKMF9\nYEY+Ony0CuAiL4fpRUSHkJKH3U/Tjtxr58FsfNECgYEArTMBFCzTlz4q0xFF+8h9\nWwgvXNZT5ZD5FV3r6SoAQ1+XTRAHRZhMAGy1j+xrHQlnAWTS0t+x2yi54sG4pX/v\n4LuSSqjKrMkKAUszRk2XEf0J42uCLg0moYiN24EgtNUkP1dL0cOeMD0aTWoILFDR\ndgmLhzh7GhNYF14vlu/quIs=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-tw6gq@mall-barbershops.iam.gserviceaccount.com",
    client_id: "106361070408974863232",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tw6gq%40mall-barbershops.iam.gserviceaccount.com",
  }),
  databaseURL: "https://server-auth-41acc.firebaseio.com",
});

module.exports = admin;
