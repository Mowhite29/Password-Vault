import { zxcvbnOptions, zxcvbnAsync } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const charMap = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9,
    k: 10,
    l: 11,
    m: 12,
    n: 13,
    o: 14,
    p: 15,
    q: 16,
    r: 17,
    s: 18,
    t: 19,
    u: 20,
    v: 21,
    w: 22,
    x: 23,
    y: 24,
    z: 25,
    A: 26,
    B: 27,
    C: 28,
    D: 29,
    E: 30,
    F: 31,
    G: 32,
    H: 33,
    I: 34,
    J: 35,
    K: 36,
    L: 37,
    M: 38,
    N: 39,
    O: 40,
    P: 41,
    Q: 42,
    R: 43,
    S: 44,
    T: 45,
    U: 46,
    V: 47,
    W: 48,
    X: 49,
    Y: 50,
    Z: 51,
    0: 52,
    1: 53,
    2: 54,
    3: 55,
    4: 56,
    5: 57,
    6: 58,
    7: 59,
    8: 60,
    9: 61,
}

export async function Generate() {
    const password = []

    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 5; j++) {
            const value = Math.floor(Math.random() * 61)
            // eslint-disable-next-line security/detect-object-injection
            password.push(Object.keys(charMap)[value])
        }
        password.push('-')
    }
    password.pop()
    console.log(password.join(''))
    return password.join('')
}

export async function Check(user, password) {
    const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions)
    zxcvbnOptions.addMatcher('pwned', matcherPwned)

    const options = {
        translations: zxcvbnEnPackage.translations,
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
            userInputs: [user],
        },
        useLevenshteinDistance: true,
    }
    zxcvbnOptions.setOptions(options)

    const response = await zxcvbnAsync(password)
    console.log(response)
    if (response.score === 4) {
        return true
    } else {
        return response.feedback
    }
}
