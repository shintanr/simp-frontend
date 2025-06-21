import Image from "next/image";
import FormLogin from "@/components/login/FormLogin";

export default function Login() {
  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center font-nunito">
      <div className="flex w-full h-full bg-white shadow-xl overflow-hidden">
        {/* Bagian Form Login */}
        <div className="w-full md:w-2/5 flex items-center justify-center p-12 h-full">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-4">
              <Image
                src="/Logo.svg"
                alt="Logo UNDIP"
                width={80}
                height={80}
              />
            </div>

            <h2 className="text-3xl font-extrabold text-[#0267FE] text-center">
              Login
            </h2>

            <div className="mt-6 mb-4">
              <FormLogin />
            </div>

            <div className="mt-4 text-center">
              <a
                href="/forgot-password"
                className="text-sm text-[#0267FE] hover:underline"
              >
               
              </a>
            </div>
          </div>
        </div>

        {/* Bagian Gambar */}
        <div className="relative hidden md:flex w-3/5 h-full">
          <Image
            src="/foto-signin.svg"
            alt="Login Illustration"
            fill
            className="object-cover object-[center_5%]"
          />
        </div>
      </div>
    </div>
  );
}
