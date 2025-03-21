"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Lock, Mail, User, EyeOff, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation helper
  const validatePassword = (password: string) => {
    const requirements = [
      { regex: /.{8,}/, message: "at least 8 characters" },
      { regex: /[A-Z]/, message: "one uppercase letter" },
      { regex: /[a-z]/, message: "one lowercase letter" },
      { regex: /[0-9]/, message: "one number" },
      { regex: /[@$!%*?&]/, message: "one special character (@$!%*?&)" },
    ];

    const failedRequirements = requirements.filter(
      (req) => !req.regex.test(password)
    );

    if (failedRequirements.length === 0) {
      return { isValid: true, message: "" };
    }

    return {
      isValid: false,
      message:
        "Password must contain " +
        failedRequirements.map((r) => r.message).join(", "),
    };
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (isSignUp && name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (isSignUp) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }

    if (isSignUp && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    return {
      strength: strength,
      label: labels[strength - 1] || "",
    };
  };

  const showAlert = (type: "error" | "success", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          showAlert("success", "Signup successful! Please sign in.");
          setIsSignUp(false);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        } else {
          showAlert("error", data.error || "Signup failed. Please try again.");
        }
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          showAlert("error", "Invalid email or password");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      showAlert("error", "An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      showAlert("error", "Google sign-in failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="relative h-32 bg-black flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative z-10 text-white text-center"
            >
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-2 text-gray-400">
                {isSignUp ? "Create your account" : "Sign in to continue"}
              </p>
            </motion.div>
          </div>

          <div className="p-8">
            {/* Alert Component */}
            <AnimatePresence>
              {alert && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4"
                >
                  <Alert
                    className={`${
                      alert.type === "error"
                        ? "border-red-500 bg-red-50"
                        : "border-green-500 bg-green-50"
                    }`}
                  >
                    <AlertDescription className="flex justify-between items-center">
                      <span>{alert.message}</span>
                      <button onClick={() => setAlert(null)}>
                        <X size={16} />
                      </button>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) {
                              const newErrors = { ...errors };
                              delete newErrors.name;
                              setErrors(newErrors);
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2 border-2 ${
                            errors.name ? "border-red-500" : "border-gray-200"
                          } rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-colors duration-200`}
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        const newErrors = { ...errors };
                        delete newErrors.email;
                        setErrors(newErrors);
                      }
                    }}
                    className={`w-full pl-10 pr-4 py-2 border-2 ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-colors duration-200`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        const newErrors = { ...errors };
                        delete newErrors.password;
                        setErrors(newErrors);
                      }
                    }}
                    className={`w-full pl-10 pr-10 py-2 border-2 ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-colors duration-200`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                {isSignUp && password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className={`h-1 flex-1 rounded-full ${
                            index < getPasswordStrength(password).strength
                              ? "bg-black"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs ${
                        getPasswordStrength(password).strength >= 4
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {getPasswordStrength(password).label}
                    </p>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) {
                              const newErrors = { ...errors };
                              delete newErrors.confirmPassword;
                              setErrors(newErrors);
                            }
                          }}
                          className={`w-full pl-10 pr-10 py-2 border-2 ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-colors duration-200`}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full bg-black text-white py-3 rounded-lg font-medium
                  shadow-lg hover:bg-gray-900 transition-all duration-200
                  flex items-center justify-center ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                )}
              </motion.button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full flex items-center justify-center border-2 border-gray-200 py-2.5 rounded-lg
                  hover:bg-gray-50 transition-all duration-200 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <FcGoogle className="mr-2" size={20} />
                <span className="text-gray-700">
                  {isSignUp ? "Sign up" : "Sign in"} with Google
                </span>
              </motion.button>

              <div className="mt-6 text-center">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                    setAlert(null);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <span className="font-medium text-black hover:text-gray-800">
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </span>
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
