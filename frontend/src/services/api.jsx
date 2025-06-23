import axios, { AxiosError } from "axios";

const backEndURL = import.meta.env.VITE_BACKEND_URL;

export async function Register(username, firstname, lastname, email, password) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/user/";

  axios
    .post(
      url,
      {
        username: username,
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: password,
      },
      {
        signal: AbortSignal.timeout(10000),
      },
    )
    .then(function (response) {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    });
}

export async function VerifyEmail(new_password, uidb64, token) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/verify-email/" + uidb64 + "/" + token;

  await axios
    .get(url, {
      signal: AbortSignal.timeout(10000),
    })
    .then(function (response) {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    });
}

export async function PasswordChange(username, accessToken) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/password-change-request";
  const authToken = "Bearer " + accessToken;

  await axios
    .post(
      url,
      {
        username: username,
      },
      {
        headers: {
          HTTP_AUTHORIZATION: authToken,
        },
        signal: AbortSignal.timeout(10000),
      },
    )
    .then(function (response) {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    });
}

export async function PasswordReset(username) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/password-reset-request";

  await axios
    .post(
      url,
      {
        username: username,
      },
      {
        signal: AbortSignal.timeout(10000),
      },
    )
    .then(function (response) {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    });
}

export async function PasswordChangeConfirm(new_password, uidb64, token) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/password-reset-request/" + uidb64 + "/" + token;

  await axios
    .post(
      url,
      {
        new_password: new_password,
      },
      {
        signal: AbortSignal.timeout(10000),
      },
    )
    .then(function (response) {
      if (response.status === 200) {
        return true;
      } else if (response.status === 400) {
        return "password matches";
      } else {
        return false;
      }
    });
}

export async function TokenObtain(username, password) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/api/token/";

  await axios
    .post(
      url,
      {
        username: username,
        password: password,
      },
      {
        signal: AbortSignal.timeout(10000),
      },
    )
    .then(function (response) {
      if (response.status === 200) {
        return {
          access: response.data["access"],
          refresh: response.data["refresh"],
        };
      } else {
        return false;
      }
    });
}

export async function TokenRefresh(refreshToken) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/api/token/refresh/";

  await axios
    .post(
      url,
      {
        refresh: refreshToken,
      },
      {
        signal: AbortSignal.timeout(10000),
      },
    )
    .then(function (response) {
      if (response.status === 200) {
        return {
          access: response.data["access"],
        };
      } else {
        return false;
      }
    });
}

export async function VaultFetch(accessToken) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/vault/";
  const authToken = "Bearer " + accessToken;

  await axios
    .get(url, {
      headers: {
        HTTP_AUTHORIZATION: authToken,
      },
      signal: AbortSignal.timeout(10000),
    })
    .then(function (response) {
      if (response.status === 200) {
        return response.data;
      } else {
        return false;
      }
    });
}

export async function VaultCreate(
  label,
  username,
  encrypted_password,
  salt,
  nonce,
  notes = "",
  accessToken,
) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/vault/";
  const authToken = "Bearer " + accessToken;

  await axios
    .post(
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
        headers: {
          HTTP_AUTHORIZATION: authToken,
        },
        signal: AbortSignal.timeout(10000),
      },
    )
    .then(function (response) {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    });
}

export async function VaultEdit(
  label,
  username,
  encrypted_password,
  salt,
  nonce,
  notes = "",
  accessToken,
) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/vault/";
  const authToken = "Bearer " + accessToken;

  await axios
    .put(
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
        headers: {
          HTTP_AUTHORIZATION: authToken,
        },
        signal: AbortSignal.timeout(10000),
      },
    )
    .then(function (response) {
      if (response.status === 200) {
        return true;
      } else if (response.status === 404) {
        return "no entry";
      } else {
        return false;
      }
    });
}

export async function VaultDelete(
  label,
  username,
  encrypted_password,
  accessToken,
) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/vault/";
  const authToken = "Bearer " + accessToken;

  await axios
    .delete(
      url,
      {
        label: label,
        username: username,
        encrypted_password: encrypted_password,
      },
      {
        headers: {
          HTTP_AUTHORIZATION: authToken,
        },
        signal: AbortSignal.timeout(10000),
      },
    )
    .then(function (response) {
      if (response.status === 200) {
        return true;
      } else if (response.status === 404) {
        return "no entry";
      } else {
        return false;
      }
    });
}

export async function KeyFetch(accessToken) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/user/key/";
  const authToken = "Bearer " + accessToken;

  await axios
    .get(url, {
      headers: {
        HTTP_AUTHORIZATION: authToken,
      },
      signal: AbortSignal.timeout(10000),
    })
    .then(function (response) {
      if (response.status === 200) {
        return response.data;
      } else {
        return false;
      }
    });
}

export async function KeyCreate(
  encrypted_string,
  salt1,
  salt2,
  nonce,
  accessToken,
) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort());

  const url = backEndURL + "/vault/";
  const authToken = "Bearer " + accessToken;

  await axios
    .post(
      url,
      {
        encrypted_string: encrypted_string,
        salt: salt1,
        salt2: salt2,
        nonce: nonce,
      },
      {
        headers: {
          HTTP_AUTHORIZATION: authToken,
        },
        signal: AbortSignal.timeout(10000),
      },
    )
    .then(function (response) {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    });
}
