import axios, { AxiosError } from 'axios'

const backEndURL = import.meta.env.VITE_BACKEND_URL

export async function Register(username, password, firstname, lastname = '') {
    try {
        const url = backEndURL + '/user/'
        console.log('1')
        const response = await axios.post(
            url,
            {
                username: username,
                first_name: firstname,
                last_name: lastname,
                email: username,
                password: password,
            },
            { timeout: 10000 }
        )

        if (response.status === 200) {
            return response.data
        } else {
            console.log(response.status)
            return false
        }
    } catch (error) {
        console.error('Register failed:', error.response?.data || error.message)
        return false
    }
}

export async function VerifyEmailAddress(uidb64, token) {
    try {
        const url = backEndURL + '/verify-email/' + uidb64 + '/' + token
        console.log('1')
        const response = await axios.get(url, { timeout: 10000 })

        if (response.status === 200) {
            console.log('verified')
            return true
        } else {
            console.log(response.status)
            return false
        }
    } catch (error) {
        console.error('Verify failed:', error.response?.data || error.message)
        return false
    }
}

export async function PasswordChange(username, accessToken) {
    try {
        const url = backEndURL + '/password-change-request/'
        const authToken = 'Bearer ' + accessToken

        const response = await axios.post(
            url,
            { username: username },
            {
                headers: { AUTHORIZATION: authToken },
                timeout: 10000,
            }
        )
        if (response.status === 200) {
            return response.data
        } else {
            return false
        }
    } catch (error) {
        console.error(
            'Password change request failed:',
            error.response?.data || error.message
        )
        return false
    }
}

export async function PasswordReset(username) {
    try {
        const url = backEndURL + '/password-reset-request/'
        const response = await axios.post(
            url,
            { username: username },
            { timeout: 10000 }
        )
        if (response.status === 200) {
            return response.data
        } else {
            return false
        }
    } catch (error) {
        console.error(
            'Password reset request failed:',
            error.response?.data || error.message
        )
        return false
    }
}

export async function PasswordChangeConfirm(new_password, uidb64, token) {
    try {
        const url =
            backEndURL +
            '/password-change-confirm/' +
            uidb64 +
            '/' +
            token +
            '/'
        const response = await axios.post(
            url,
            { new_password: new_password },
            { timeout: 10000 }
        )
        if (response.status === 200) {
            return true
        } else if (response.status === 400) {
            return 'password matches'
        } else {
            return false
        }
    } catch (error) {
        console.error(
            'Password change confirm failed:',
            error.response?.data || error.message
        )
        return false
    }
}

export async function TokenObtain(username, password) {
    try {
        const url = backEndURL + '/api/token/'

        const response = await axios.post(
            url,
            { username: username, password: password },
            { timeout: 10000 }
        )
        if (response.status === 200) {
            return response.data
        } else {
            return false
        }
    } catch (error) {
        console.error('Sign in failed:', error.response?.data || error.message)
        return false
    }
}

export async function TokenRefresh(refreshToken) {
    try {
        const url = backEndURL + '/api/token/refresh/'
        const response = await axios.post(
            url,
            { refresh: refreshToken },
            { timeout: 10000 }
        )
        if (response.status === 200) {
            return response.data
        } else {
            return false
        }
    } catch (error) {
        console.error(
            'Token refresh failed:',
            error.response?.data || error.message
        )
        return false
    }
}

export async function VaultFetch(accessToken) {
    try {
        const url = backEndURL + '/vault/'
        const authToken = 'Bearer ' + accessToken

        const response = await axios.get(url, {
            headers: { AUTHORIZATION: authToken },
            timeout: 10000,
        })
        if (response.status === 200) {
            return response.data
        } else {
            return false
        }
    } catch (error) {
        console.error(
            'Vault fetch failed:',
            error.response?.data || error.message
        )
        return false
    }
}

export async function VaultCreate(
    label,
    username,
    encrypted_password,
    salt,
    nonce,
    notes = '',
    accessToken
) {
    try {
        const url = backEndURL + '/vault/'
        const authToken = 'Bearer ' + accessToken

        const response = await axios.post(
            url,
            {
                label: label,
                username: username,
                encrypted_password: encrypted_password,
                salt: salt,
                nonce: nonce,
                notes: notes,
            },
            {
                headers: { AUTHORIZATION: authToken },
                timeout: 10000,
            }
        )
        if (response.status === 200) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(
            'Vault entry creation failed:',
            error.response?.data || error.message
        )
        return false
    }
}

export async function VaultEdit(
    label,
    username,
    encrypted_password,
    salt,
    nonce,
    notes = '',
    accessToken
) {
    try {
        const url = backEndURL + '/vault/'
        const authToken = 'Bearer ' + accessToken
        const response = await axios.put(
            url,
            {
                label: label,
                username: username,
                encrypted_password: encrypted_password,
                salt: salt,
                nonce: nonce,
                notes: notes,
            },
            {
                headers: { AUTHORIZATION: authToken },
                timeout: 10000,
            }
        )
        if (response.status === 200) {
            return true
        } else if (response.status === 404) {
            return 'no entry'
        } else {
            return false
        }
    } catch (error) {
        console.error(
            'Vault entry edit failed:',
            error.response?.data || error.message
        )
        return false
    }
}

export async function VaultDelete(
    label,
    username,
    encrypted_password,
    salt,
    nonce,
    accessToken
) {
    try {
        const url = backEndURL + '/vault/'
        const authToken = 'Bearer ' + accessToken
        console.log(salt, nonce)
        const response = await axios.delete(url, {
            headers: { AUTHORIZATION: authToken },
            data: {
                label: label,
                username: username,
                encrypted_password: encrypted_password,
                salt: salt,
                nonce: nonce,
            },
            timeout: 10000,
        })
        if (response.status === 200) {
            return true
        } else if (response.status === 404) {
            return 'no entry'
        } else {
            return false
        }
    } catch (error) {
        console.error(
            'Vault entry delete failed:',
            error.response?.data || error.message
        )
        return false
    }
}

export async function KeyFetch(accessToken) {
    try {
        const url = backEndURL + '/user/key/'
        const authToken = 'Bearer ' + accessToken
        const response = await axios.get(url, {
            headers: { AUTHORIZATION: authToken },
            timeout: 10000,
        })

        if (response.status === 200) {
            return response.data
        } else {
            return false
        }
    } catch (error) {
        console.log('Key fetch failed:', error.message)
        return false
    }
}

export async function KeyCreate(
    encrypted_string,
    salt1,
    salt2,
    nonce,
    accessToken
) {
    try {
        const url = backEndURL + '/user/key/'
        const authToken = 'Bearer ' + accessToken
        const response = await axios.post(
            url,
            {
                encrypted_string: encrypted_string,
                salt1: salt1,
                salt2: salt2,
                nonce: nonce,
            },
            {
                headers: { AUTHORIZATION: authToken },
                timeout: 10000,
            }
        )
        if (response.status === 200) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(
            'Key creation failed:',
            error.response?.data || error.message
        )
        return false
    }
}

export async function NameRequest(accessToken) {
    try {
        const url = backEndURL + '/user/change/'
        const authToken = 'Bearer ' + accessToken
        const response = await axios.get(url, {
            headers: { AUTHORIZATION: authToken },
            timeout: 10000,
        })
        if (response.status === 200) {
            return response.data
        } else {
            return false
        }
    } catch {
        console.log('Name request failed')
    }
}

export async function NameChange(firstName, lastName, accessToken) {
    try {
        const url = backEndURL + '/user/change/'
        const authToken = 'Bearer ' + accessToken
        const response = await axios.post(
            url,
            {
                first_name: firstName,
                last_name: lastName,
            },
            {
                headers: { AUTHORIZATION: authToken },
                timeout: 10000,
            }
        )
        if (response.status === 200) {
            return true
        } else {
            return false
        }
    } catch {
        console.log('Name change request failed')
    }
}
