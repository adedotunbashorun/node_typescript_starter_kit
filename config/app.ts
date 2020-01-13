export const config  = {
    app: {
        port: process.env.PORT as string,
        name : "Test",
        email : "adedotunolawale@gmail.com",
        JWT_SECRET: process.env.JWT_SECRET as string,
    },
    user: process.env.user as any,
    db: {
        url: process.env.MONGODB_URI as string,
    },
    data: {
        limit: "50mb",
        extended: false,
    },
    mail: {
        auth: {
            api_user: process.env.SENDGRID_USERNAME as string,
            api_key: process.env.SENDGRID_PASSWORD as string,
        },
    },
    sms: {
        africastalking: {
            apiKey: "f39adb22724c3c6686c19dce339dcb3e5344bb412512b294193c27139f5a0b93", //         // use your sandbox app API key for development in the test environment
            username: "weserve",      // use 'sandbox' for development in the test environment
        },
        twilio: {
            apiKey: "",
            username: "",
        },
    },
    video: {
        vimeo: {
            clientId: "b4c2351fdc0293b73e0edbf5db27685aa52af6d9",
            clientSecret: "jwSfO3NBVqNY+VNbA9D8u+biO460z0pVl8DmlT/e8matjD+UeyVLHNzsAXObVfCav1uFds8rPR3rvu+DXRL0kWRwEk8R09phcQ64qThLMLLMrXzHoH/Q774f2McIQn2f",
            accessToken: "a852ca944c59ab717ee9a94ed3c6b50a",
        },
    },
    pusher: {
        appId: process.env.PUSHER_APP_ID as string,
        key: process.env.PUSHER_APP_KEY as string,
        secret: process.env.PUSHER_APP_SECRET as string,
        cluster: process.env.PUSHER_APP_CLUSTER as string,
    },
};
