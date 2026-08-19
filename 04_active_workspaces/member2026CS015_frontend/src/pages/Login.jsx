import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/backend";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("LOGIN BUTTON CLICKED");

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      /*
       * IMPORTANT
       *
       * loginUser expects ONE OBJECT.
       */

      const data = await loginUser({
        email: email.trim(),
        password: password,
      });

      console.log("LOGIN SUCCESS:", data);

      /* =========================================
         SAVE LOGIN INFORMATION
      ========================================= */

      if (data?.access_token) {
        localStorage.setItem(
          "access_token",
          data.access_token
        );

        localStorage.setItem(
          "token",
          data.access_token
        );
      }

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.setItem(
        "userEmail",
        email.trim()
      );

      if (data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      /* =========================================
         GO TO DASHBOARD
      ========================================= */

      navigate("/dashboard");

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err?.message ||
          "Login failed. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* Background */}
      <div style={styles.backgroundOverlay} />

      <div style={styles.backgroundCircleOne} />
      <div style={styles.backgroundCircleTwo} />
      <div style={styles.backgroundCircleThree} />

      {/* Main */}
      <div style={styles.container}>

        {/* =========================================
            LEFT SIDE
        ========================================= */}

        <div style={styles.leftSection}>

          <div style={styles.brandSection}>

            <h1 style={styles.projectName}>
              Apollo AgriVerse-Pashusense
            </h1>

            <p style={styles.tagline}>
              Smarter farms. Healthier livestock. Better decisions.
            </p>

          </div>

          <div style={styles.heroContent}>

            <div style={styles.iconCircle}>
              🐄
            </div>

            <h2 style={styles.heroTitle}>
              Welcome to your
              <br />

              <span style={styles.heroHighlight}>
                digital livestock farm
              </span>
            </h2>

            <p style={styles.heroText}>
              Monitor your livestock, manage farms,
              track production and make smarter farming
              decisions from one platform.
            </p>

          </div>

          <div style={styles.features}>

            <div style={styles.feature}>
              <span style={styles.featureIcon}>
                🌱
              </span>

              <span>
                Smart Farm Management
              </span>
            </div>

            <div style={styles.feature}>
              <span style={styles.featureIcon}>
                🐄
              </span>

              <span>
                Livestock Monitoring
              </span>
            </div>

            <div style={styles.feature}>
              <span style={styles.featureIcon}>
                📊
              </span>

              <span>
                Data-Driven Insights
              </span>
            </div>

          </div>

        </div>

        {/* =========================================
            RIGHT SIDE
        ========================================= */}

        <div style={styles.rightSection}>

          <div style={styles.loginCard}>

            <div style={styles.loginHeader}>

              <div style={styles.loginIcon}>
                🔐
              </div>

              <h2 style={styles.loginTitle}>
                Welcome Back
              </h2>

              <p style={styles.loginSubtitle}>
                Sign in to continue to your farm dashboard
              </p>

            </div>

            <form onSubmit={handleLogin}>

              {/* EMAIL */}

              <div style={styles.inputGroup}>

                <label style={styles.label}>
                  Email Address
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    ✉️
                  </span>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    style={styles.input}
                    autoComplete="email"
                    disabled={loading}
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div style={styles.inputGroup}>

                <label style={styles.label}>
                  Password
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    🔒
                  </span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    style={styles.input}
                    autoComplete="current-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    style={styles.passwordButton}
                    disabled={loading}
                  >
                    {showPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div style={styles.error}>
                  {error}
                </div>
              )}

              {/* OPTIONS */}

              <div style={styles.options}>

                <label style={styles.remember}>

                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    disabled={loading}
                  />

                  <span>
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  style={styles.forgotButton}
                  onClick={() =>
                    setError(
                      "Password reset is not available yet."
                    )
                  }
                  disabled={loading}
                >
                  Forgot password?
                </button>

              </div>

              {/* LOGIN */}

              <button
                type="submit"
                style={{
                  ...styles.loginButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
                disabled={loading}
              >

                <span>
                  {loading
                    ? "Signing In..."
                    : "Sign In"}
                </span>

                {!loading && (
                  <span style={styles.arrow}>
                    →
                  </span>
                )}

              </button>

            </form>

            {/* SECURITY */}

            <div style={styles.divider}>

              <span style={styles.dividerLine} />

              <span style={styles.dividerText}>
                Secure Access
              </span>

              <span style={styles.dividerLine} />

            </div>

            <div style={styles.security}>

              <span style={styles.securityIcon}>
                🛡️
              </span>

              <span>
                Your farm data is protected
              </span>

            </div>

            {/* REGISTER */}

            <div style={styles.registerSection}>

              <span style={styles.registerText}>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
                style={styles.registerButton}
                disabled={loading}
              >
                Create Account
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div style={styles.footer}>
        © 2026 Apollo AgriVerse-Pashusense
      </div>

    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = {

  page: {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background:
      "linear-gradient(135deg, #0b3d2e 0%, #12634a 45%, #d8eadf 100%)",
  },

  backgroundOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(120deg, rgba(5,35,26,0.82), rgba(16,87,64,0.65), rgba(240,248,243,0.18))",
    zIndex: 0,
  },

  backgroundCircleOne: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.06)",
    top: "-200px",
    left: "-180px",
    zIndex: 1,
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background:
      "rgba(165,214,167,0.12)",
    bottom: "-180px",
    right: "-120px",
    zIndex: 1,
  },

  backgroundCircleThree: {
    position: "absolute",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.08)",
    top: "18%",
    right: "34%",
    zIndex: 1,
  },

  container: {
    width: "92%",
    maxWidth: "1180px",
    minHeight: "650px",
    display: "grid",
    gridTemplateColumns:
      "1.15fr 0.85fr",
    borderRadius: "28px",
    overflow: "hidden",
    position: "relative",
    zIndex: 5,
    boxShadow:
      "0 30px 80px rgba(0,0,0,0.28)",
    background:
      "rgba(255,255,255,0.12)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter:
      "blur(16px)",
    border:
      "1px solid rgba(255,255,255,0.22)",
  },

  leftSection: {
    padding:
      "55px 55px 45px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#ffffff",
    background:
      "linear-gradient(145deg, rgba(4,45,33,0.72), rgba(16,105,75,0.50))",
  },

  brandSection: {
    textAlign: "left",
  },

  projectName: {
    margin: 0,
    fontSize: "38px",
    lineHeight: 1.1,
    fontWeight: 800,
    letterSpacing: "-1px",
    color: "#ffffff",
  },

  tagline: {
    margin: "10px 0 0",
    fontSize: "13px",
    lineHeight: 1.5,
    fontWeight: 500,
    letterSpacing: "0.2px",
    color:
      "rgba(255,255,255,0.78)",
  },

  heroContent: {
    marginTop: "35px",
  },

  iconCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    background:
      "rgba(255,255,255,0.13)",
    border:
      "1px solid rgba(255,255,255,0.20)",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.12)",
  },

  heroTitle: {
    margin: "22px 0 12px",
    fontSize: "36px",
    lineHeight: 1.18,
    fontWeight: 750,
    letterSpacing: "-0.8px",
  },

  heroHighlight: {
    color: "#b8e986",
  },

  heroText: {
    maxWidth: "520px",
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    color:
      "rgba(255,255,255,0.76)",
  },

  features: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "30px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    color:
      "rgba(255,255,255,0.88)",
  },

  featureIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(255,255,255,0.11)",
    fontSize: "16px",
  },

  rightSection: {
    padding: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(255,255,255,0.94)",
  },

  loginCard: {
    width: "100%",
    maxWidth: "390px",
  },

  loginHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },

  loginIcon: {
    width: "58px",
    height: "58px",
    margin: "0 auto 14px",
    borderRadius: "17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    background: "#e6f4ec",
  },

  loginTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 750,
    color: "#14352a",
  },

  loginSubtitle: {
    margin: "8px 0 0",
    fontSize: "13px",
    lineHeight: 1.5,
    color: "#718078",
  },

  inputGroup: {
    marginBottom: "19px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: 650,
    color: "#263c34",
  },

  inputWrapper: {
    height: "52px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #d8e2dc",
    borderRadius: "13px",
    background: "#ffffff",
    overflow: "hidden",
  },

  inputIcon: {
    width: "45px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "16px",
  },

  input: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#1d3028",
    padding: "0 10px 0 0",
  },

  passwordButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "16px",
    padding: "0 14px",
  },

  options: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "5px 0 22px",
    gap: "10px",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "12px",
    color: "#617068",
    cursor: "pointer",
  },

  checkbox: {
    accentColor: "#167653",
    cursor: "pointer",
  },

  forgotButton: {
    border: "none",
    background: "none",
    color: "#14734f",
    fontSize: "12px",
    fontWeight: 650,
    cursor: "pointer",
    padding: 0,
  },

  error: {
    padding: "10px 12px",
    marginBottom: "15px",
    borderRadius: "10px",
    background: "#fff0f0",
    border: "1px solid #ffd0d0",
    color: "#c53d3d",
    fontSize: "12px",
  },

  loginButton: {
    width: "100%",
    height: "52px",
    border: "none",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    cursor: "pointer",
    color: "#ffffff",
    background:
      "linear-gradient(135deg, #126b49, #1d8b60)",
    fontSize: "15px",
    fontWeight: 700,
    boxShadow:
      "0 10px 24px rgba(18,107,73,0.25)",
  },

  arrow: {
    fontSize: "20px",
    lineHeight: 1,
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "25px 0 18px",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e3e9e5",
  },

  dividerText: {
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#9aa7a0",
  },

  security: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px",
    fontSize: "11px",
    color: "#84928b",
  },

  securityIcon: {
    fontSize: "13px",
  },

  registerSection: {
    marginTop: "20px",
    textAlign: "center",
    borderTop: "1px solid #e3e9e5",
    paddingTop: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },

  registerText: {
    fontSize: "12px",
    color: "#7a8783",
    fontWeight: 500,
  },

  registerButton: {
    background:
      "linear-gradient(135deg, #2d9b5f, #4caf50)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 20px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow:
      "0 6px 16px rgba(45, 155, 95, 0.2)",
  },

  footer: {
    position: "absolute",
    bottom: "12px",
    zIndex: 10,
    color:
      "rgba(255,255,255,0.65)",
    fontSize: "10px",
  },
};

export default Login;