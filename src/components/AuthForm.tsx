import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function AuthForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-950/20 to-amber-950/10 border border-amber-900/30 rounded-xl p-6 md:p-8 backdrop-blur-sm">
      <div className="flex justify-center gap-1 mb-6 md:mb-8 bg-amber-950/30 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setFlow("signIn")}
          className={`flex-1 py-2 text-xs md:text-sm font-medium tracking-wide rounded-md transition-all ${
            flow === "signIn"
              ? "bg-amber-800/50 text-amber-100"
              : "text-amber-600/60 hover:text-amber-400"
          }`}
        >
          SIGN IN
        </button>
        <button
          type="button"
          onClick={() => setFlow("signUp")}
          className={`flex-1 py-2 text-xs md:text-sm font-medium tracking-wide rounded-md transition-all ${
            flow === "signUp"
              ? "bg-amber-800/50 text-amber-100"
              : "text-amber-600/60 hover:text-amber-400"
          }`}
        >
          REGISTER
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-xs text-amber-600/80 tracking-wider mb-2 uppercase">
            Electronic Mail
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="knight@realm.com"
            className="w-full px-4 py-3 bg-amber-950/30 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-600/60 focus:ring-1 focus:ring-amber-600/30 transition-all text-sm md:text-base"
          />
        </div>

        <div>
          <label className="block text-xs text-amber-600/80 tracking-wider mb-2 uppercase">
            Secret Phrase
          </label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            minLength={6}
            className="w-full px-4 py-3 bg-amber-950/30 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-600/60 focus:ring-1 focus:ring-amber-600/30 transition-all text-sm md:text-base"
          />
        </div>

        <input name="flow" type="hidden" value={flow} />

        {error && (
          <div className="text-red-400/90 text-sm text-center py-2 bg-red-950/20 rounded-lg border border-red-900/30">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 md:py-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 text-amber-100 font-medium tracking-wider rounded-lg hover:from-amber-700 hover:via-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30 text-sm md:text-base"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
              PROCESSING...
            </span>
          ) : flow === "signIn" ? (
            "ENTER THE STABLES"
          ) : (
            "JOIN THE REALM"
          )}
        </button>
      </form>
    </div>
  );
}
