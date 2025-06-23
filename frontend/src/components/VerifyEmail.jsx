import { useParams } from "react-router-dom";
import "../styles/VerifyEmail.scss";

export default function VerifyEmail() {
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
