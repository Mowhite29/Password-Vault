import { http, HttpResponse } from 'msw'

const backEndURL = import.meta.env.VITE_BACKEND_URL

export const mockAPI = [
    http.post(backEndURL + '/api/token/', () => {
        return HttpResponse.json({
            'refresh': 'mockRefreshToken',
            'access': 'mockAccessToken'
        })
    }),
    http.post(backEndURL + '/api/token/refresh/', () => {
        return HttpResponse.json({
            'access': 'mockAccessToken'
        })
    }),
    http.post(backEndURL + '/api/mobile/', () => {
        return HttpResponse.json({
            'refresh': 'mockRefreshToken',
            'access': 'mockAccessToken'
        })
    }),
    http.post(backEndURL + '/api/mobile/refresh/', () => {
        return HttpResponse.json({
            'access': 'mockAccessToken'
        })
    }),
    http.get(backEndURL + '/user/', () => {
        return HttpResponse.json({
            "uid": "uid", 
            "token": "token", 
            "user": "userFirstName", 
            "email": "userEmailAddress"
        })
    }),
    http.get(backEndURL + '/verify-email/uid/token')
]