import { http, HttpResponse } from 'msw'

const backEndURL = import.meta.env.VITE_BACKEND_URL ?? 'http://test.api'

export const mockAPI = [
    http.all(backEndURL + '/ping/', () => {
        return HttpResponse.json({
            status: 'ok',
        })
    }),
    http.post(backEndURL + '/api/token/', () => {
        return HttpResponse.json({
            refresh: 'mockRefreshToken',
            access: 'mockAccessToken',
        })
    }),
    http.post(backEndURL + '/api/token/refresh/', () => {
        return HttpResponse.json({
            access: 'mockAccessToken',
        })
    }),
    http.post(backEndURL + '/api/mobile/', () => {
        return HttpResponse.json({
            refresh: 'mockRefreshToken',
            access: 'mockAccessToken',
        })
    }),
    http.post(backEndURL + '/api/mobile/refresh/', () => {
        return HttpResponse.json({
            access: 'mockAccessToken',
        })
    }),
    http.post(backEndURL + '/user/', () => {
        return HttpResponse.json({
            uid: 'uid',
            token: 'token',
            user: 'userFirstName',
            email: 'userEmailAddress',
        })
    }),
    http.post(backEndURL + '/verify-email/uid/token', () => {
        return HttpResponse.json({
            message: 'Email verified successfully. You can now log in.',
        })
    }),
    http.post(backEndURL + '/user/key/', () => {
        return HttpResponse.json({
            message: 'User key set',
        })
    }),
    http.get(backEndURL + '/user/key/', () => {
        return HttpResponse.json({
            user: 'user',
            encrypted_string: 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            salt1: 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            salt2: 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            nonce: 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
        })
    }),
    http.get(backEndURL + '/user/change/', () => {
        return HttpResponse.json({
            first_name: 'first_name',
            last_name: 'last_name',
        })
    }),
    http.post(backEndURL + '/user/change/', () => {
        return HttpResponse.json({
            message: 'name updated',
        })
    }),
    http.get(backEndURL + '/vault/', () => {
        return HttpResponse.json({
            user: '01',
            label: 'label',
            username: 'username',
            encrypted_password: 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            salt: 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            nonce: 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            notes: 'notes',
            created_at: '2025-01-01T01:01:01.000001Z',
            updated_at: '2025-01-01T01:01:01.000001Z',
        })
    }),
    http.post(backEndURL + '/vault/', () => {
        return HttpResponse.json({
            message: 'Password saved',
        })
    }),
    http.put(backEndURL + '/vault/', () => {
        return HttpResponse.json({
            message: 'Entry Updated',
        })
    }),
    http.delete(backEndURL + '/vault/', () => {
        return HttpResponse.json({
            message: 'Password deleted',
        })
    }),
    http.post(backEndURL + '/password-change-request/', () => {
        return HttpResponse.json({
            uid: 'uid',
            token: 'token',
            user: 'userFirstName',
            email: 'email@example.com',
        })
    }),
    http.post(backEndURL + '/password-reset-request/', () => {
        return HttpResponse.json({
            uid: 'uid',
            token: 'token',
            user: 'userFirstName',
            email: 'email@example.com',
        })
    }),
    http.post(backEndURL + '/password-change-confirm/uid/token', () => {
        return HttpResponse.json({
            message: 'password updated',
        })
    }),
    http.all('https://api.pwnedpasswords.com/range/77EF7', () => {
        return HttpResponse.json({
            '00569F63A9A6A9F0B21D5AED0375457445F': 4,
            '008864DB8F69546486E462002872C4A5AC3': 1,
            '00EE1D1ACF495005AB4E03916581A9AB85A': 18,
            '02221D3A360AE313BED66F52D92DC50E527': 20,
            '025C026F0172347C5FD124F9A879CB8AF22': 36,
            '0299FE8678C9D126C687DC5F8F71AEBF51E': 1,
        })
    }),
]
