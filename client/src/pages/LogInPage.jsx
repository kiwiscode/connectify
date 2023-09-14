import { useState } from "react";
import SigninModal from "../components/ui/Modal";

import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

function LogInPage() {
  const [hideme, setHideme] = useState("");

  return (
    <>
      <div>
        <div>
          <p className={`${hideme} have-account`}>Already have an account ?</p>
          <SigninModal></SigninModal>
        </div>
      </div>
    </>
  );
}

export default LogInPage;
