"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { clearError, login, selectAuth } from "@/lib/features/auth-slice";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const authState = useSelector(selectAuth);
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isDark = theme === "dark";

  useEffect(() => {
    if (authState.error) {
      if (authState.error.status === 400) {
        // Bad request - switch to signup mode
        setIsSignupMode(true);
        setFormError("Account not found. Please create an account.");
      } else if (authState.error.status === 401) {
        // Unauthorized - show error without switching mode
        setFormError("Invalid email or password. Please try again.");
      } else {
        setFormError(authState.error.message || "An error occurred");
      }
    } else {
      setFormError(null);
    }
  }, [authState.error]);

  useEffect(() => {
    dispatch(clearError());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignupMode) {
      if (!username.trim()) {
        setFormError("Username is required");
        return;
      }
      dispatch(login({ email, password, username: username! }));
    } else {
      dispatch(login({ email, password }));
    }
  };

  const handleSwitchMode = () => {
    setIsSignupMode(!isSignupMode);
    setFormError(null);
    dispatch(clearError());
  };

  return (
    <div
      className={cn(
        "flex min-h-svh w-full items-center justify-center p-6 md:p-10",
        isDark ? "bg-zinc-900" : "bg-white "
      )}
    >
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card
            className={`rounded-3xl ${
              isDark
                ? "bg-zinc-950 border-gray-700"
                : "bg-zinc-100 border-gray-200"
            } bg-opacity-80 border`}
          >
            <CardHeader className="text-center">
              <CardTitle
                className={`text-xl ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {isSignupMode ? "Create an account" : "Welcome back"}
              </CardTitle>
              <CardDescription
                className={isDark ? "text-gray-300" : "text-gray-600"}
              >
                {isSignupMode
                  ? "Sign up to get started"
                  : "Login to your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  {!isSignupMode && (
                    <>
                      <div className="flex flex-col gap-4">
                        <Button
                          variant="outline"
                          className={`w-full rounded-xl ${
                            isDark
                              ? "border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                              : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          {/* Google Icon */}
                          Continue with Google
                        </Button>
                      </div>
                      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span
                          className={`relative z-10 px-2 ${
                            isDark
                              ? "bg-zinc-950 bg-opacity-30 text-gray-400"
                              : "bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          Or continue with
                        </span>
                      </div>
                    </>
                  )}

                  <div className="grid gap-6">
                    {isSignupMode && (
                      <div className="grid gap-2">
                        <Label
                          htmlFor="username"
                          className={isDark ? "text-gray-300" : "text-gray-700"}
                        >
                          Username
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Your username"
                          required
                          className={`rounded-xl ${
                            isDark
                              ? "bg-zinc-800 text-white border-gray-600 focus-visible:ring-gray-300"
                              : "bg-zinc-50 text-gray-900 border-gray-300"
                          }`}
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={authState.loading}
                        />
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label
                        htmlFor="email"
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className={`rounded-xl ${
                          isDark
                            ? "bg-zinc-800 text-white border-gray-600 focus-visible:ring-gray-300"
                            : "bg-zinc-50 text-gray-900 border-gray-300"
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={authState.loading}
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label
                          htmlFor="password"
                          className={isDark ? "text-gray-300" : "text-gray-700"}
                        >
                          Password
                        </Label>
                        {!isSignupMode && (
                          <a
                            href="#"
                            className={`ml-auto text-sm underline-offset-4 hover:underline ${
                              isDark
                                ? "text-gray-400 hover:text-gray-200"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            Forgot password?
                          </a>
                        )}
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        className={`rounded-xl ${
                          isDark
                            ? "bg-zinc-800 text-white border-gray-600 focus-visible:ring-gray-300"
                            : "bg-zinc-50 text-gray-900 border-gray-300"
                        }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={authState.loading}
                      />
                    </div>

                    {/* Error message */}
                    {formError && (
                      <div
                        className={`text-sm p-3 rounded-lg ${
                          isDark
                            ? "bg-red-900/30 text-red-300"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {formError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className={`w-full rounded-xl ${
                        isDark
                          ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-900"
                          : "bg-zinc-900 text-white hover:bg-zinc-700"
                      }`}
                      disabled={authState.loading}
                    >
                      {authState.loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isSignupMode
                            ? "Creating account..."
                            : "Logging in..."}
                        </>
                      ) : isSignupMode ? (
                        "Create Account"
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>

                  <div
                    className={`text-center text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {isSignupMode
                      ? "Already have an account?"
                      : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      onClick={handleSwitchMode}
                      className={`underline underline-offset-4 ${
                        isDark
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-800 hover:text-gray-900"
                      }`}
                    >
                      {isSignupMode ? "Login instead" : "Sign up"}
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div
            className={`text-balance text-center text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            } [&_a]:underline [&_a]:underline-offset-4 ${
              isDark
                ? "[&_a]:text-gray-300 hover:[&_a]:text-white"
                : "[&_a]:text-gray-700 hover:[&_a]:text-gray-900"
            }`}
          >
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
