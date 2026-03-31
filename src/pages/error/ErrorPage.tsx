import { useRouteError, Link } from "react-router";
import CustomButton from "../../Components/ui/Button";
import { AlertCircle, RotateCcw, Home, Terminal } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fcfcfc]">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* Header Section */}
          <div className="bg-rose-50/50 p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 mb-6 animate-pulse">
              <AlertCircle size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              System Breakdown
            </h1>
            <p className="text-rose-600 font-semibold text-sm uppercase tracking-widest">
              Error {error?.status || "Inbound"}
            </p>
          </div>

          {/* Body Section */}
          <div className="p-10 space-y-8">
            <div className="space-y-4">
              <p className="text-gray-600 text-center text-lg">
                Something unexpected happened in our system layers. Don't worry,
                our engineers have been notified.
              </p>

              {/* Technical Detail Log */}
              <div className="bg-gray-950 rounded-xl p-6 font-mono text-sm relative group">
                <div className="flex items-center gap-2 text-gray-500 mb-3 pb-3 border-b border-gray-800">
                  <Terminal size={14} />
                  <span>system_logs</span>
                </div>
                <div className="text-emerald-400 opacity-80 overflow-x-auto">
                  <p className="whitespace-pre-wrap">
                    {error?.statusText ||
                      error?.message ||
                      "Unknown Runtime Exception"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <CustomButton
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full sm:w-auto px-8 border-gray-200 hover:border-primary text-gray-700 font-bold"
              >
                <RotateCcw size={18} className="mr-2" />
                Retry Connection
              </CustomButton>

              <Link to="/" className="w-full sm:w-auto">
                <CustomButton
                  variant="primary"
                  className="w-full px-8 shadow-lg shadow-emerald-900/10"
                >
                  <Home size={18} className="mr-2" />
                  Abort to Dashboard
                </CustomButton>
              </Link>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              KAJLAGBE CORE ENGINE
            </div>
            <span>Build v1.0.4-stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
