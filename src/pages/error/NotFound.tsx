import { Link } from "react-router";
import CustomButton from "../../Components/ui/Button";
import { Home, ArrowLeft, Search, Bot } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white selection:bg-emerald-100 selection:text-emerald-900">
      <div className="relative max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Visual/Graphic */}
        <div className="relative order-2 lg:order-1">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 animate-pulse delay-700"></div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* 404 Floating Number */}
            <div className="relative">
              <span className="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-primary/10 to-transparent leading-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center pt-8">
                <div className="w-48 h-48 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500 group border border-gray-100">
                  <Bot
                    size={80}
                    className="text-primary animate-bounce group-hover:scale-110 transition-transform"
                  />
                </div>
              </div>
            </div>

            {/* Shadow decoration */}
            <div className="w-32 h-4 bg-gray-900/5 rounded-full blur-md mt-4 animate-expand"></div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="text-center lg:text-left order-1 lg:order-2 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-primary text-xs font-bold uppercase tracking-widest">
              <Search size={14} /> System Error
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Lost in the <br />
              <span className="text-primary">Admin Galaxy?</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-sm mx-auto lg:mx-0 leading-relaxed">
              We couldn't find the page you're looking for. It might have
              vanished into thin air or moved to a secret location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/">
              <CustomButton
                variant="primary"
                size="lg"
                className="shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 px-8"
              >
                <Home size={18} className="mr-2" />
                Take Me Home
              </CustomButton>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-primary font-bold transition-all group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Safety
            </button>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-400 font-medium">
              <img
                src="/images/logo/smLogo.png"
                alt="smLogo"
                className="h-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
              />
              <span>Reference code: KJ-404-UNREACHABLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
