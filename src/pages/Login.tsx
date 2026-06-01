import "../stylesforpage.css";
import "../general.css";
import logo from "./logo.png";
import googleLogo from "./th.jpg";
import appleLogo from "./svg-gobbler (2).webp";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleOramaLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="login-fullscreen">
      <div className="both-sides">
        {/* Left side with big logo only */}
        <div className="left logo-center">
          <img className="logo" src={logo} alt="Orama" />
        </div>

        {/* Right side with login */}
        <div className="right">
          <div className="big-heading">Schedule it now</div>
          <div className="sub-heading">Own your time with <span className="title">Orama</span></div>
          <div className="login-btn-stack">
            <button className="create-button" onClick={handleOramaLogin}>
              Continue as Visitor
            </button>
            <div className="Or">or</div>
            <a
              style={{ textDecoration: "none", width: "100%" }}
              href="https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Faccounts.google.com%2Fgsi%2Fselect%3Fclient_id%3D49625052041-kgt0hghf445lmcmhijv46b715m2mpbct.apps.googleusercontent.com%26ux_mode%3Dpopup%26ui_mode%3Dcard%26as%3DleYwD0lzNJyJ%2FxOcQ%2FwPgw%26channel_id%3D152d7adf37c42a1091f358bff2425495ad95e3898074986a79c64729b992df5e%26origin%3Dhttps%3A%2F%2Ftwitter.com&faa=1&ifkv=ASKXGp2CaQEz7J7XM9v_WANdsOSlJJKEFmOu0zyh-xipQwiocKB1rBqJ0AwK8q85jRaxXbQEANigZQ&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-1609581643%3A1702154591816483&theme=glif"
            >
              <button className="buta">
                <span className="icon-btn">
                  <img className="google-logo" src={googleLogo} alt="Google Logo" />
                </span>
                <span className="text-button">Sign up with Google</span>
              </button>
            </a>
            <a
              style={{ textDecoration: "none", width: "100%" }}
              href="https://appleid.apple.com/auth/authorize?client_id=com.twitter.twitter.siwa&redirect_uri=https%3A%2F%2Ftwitter.com&response_type=code%20id_token&state=2AWtUCTKB1oEUNtLiUFM6AzS__d54prAuZXYz_nvYga&scope=name%20email&response_mode=web_message&frame_id=7df278aa-305c-4e95-"
            >
              <button className="butb">
                <span className="icon-btn">
                  <img className="apple-logo" src={appleLogo} alt="Apple Logo" />
                </span>
                <span className="text-button">Sign up with Apple</span>
              </button>
            </a>
          </div>
          <div className="terms">
            By signing up, you agree to the
            <span className="blue"> Terms of Service</span> and
            <span className="blue"> Privacy Policy</span>, including
            <span className="blue"> Cookie Use</span>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
