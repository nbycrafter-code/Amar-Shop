import { Suspense } from "react";
import {VerifyOTPContent} from "./components/VerifyEmail";

const VerifyOTPPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-gray-600">Loading...</div>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}

export default VerifyOTPPage;