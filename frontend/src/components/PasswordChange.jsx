import { useParams } from "react-router-dom";

export default function PasswordChange() {
  let { uidb64, token } = useParams;

  return (
    <>
      <p>
        {uidb64}
        {token}
      </p>
    </>
  );
}
