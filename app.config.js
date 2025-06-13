const IS_DEV = process.env.APP_VARIANT === 'development'

export default {
    expo: {
        name: IS_DEV ? 'subcycle (Dev)' : 'subcycle',
        slug: 'subcycle',
        scheme: 'subcycle',
        version: '3.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'automatic',
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff'
            },
            splash: {
                image: './assets/splash.png',
                resizeMode: 'contain',
                backgroundColor: '#ffffff',
                dark: {
                    image: './assets/splash.png',
                    resizeMode: 'contain',
                    backgroundColor: '#000000'
                }
            },
            package: IS_DEV ? 'dev.subbyte.subcycle' : 'com.subbyte.subcycle',
            permissions: [
                'RECEIVE_BOOT_COMPLETED',
                'SCHEDULE_EXACT_ALARM',
                'USE_EXACT_ALARM'
            ]
        },
        web: {
            favicon: './assets/favicon.png'
        },
        plugins: ['expo-router'],
        extra: {
            router: {
                origin: false
            },
            eas: {
                projectId: '48d6445a-942c-474d-be16-5d46d6f25603'
            }
        }
    }
}
