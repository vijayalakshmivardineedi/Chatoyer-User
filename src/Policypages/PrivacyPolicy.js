import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy_policy_container">
      <div className="privacy_header">
        <h1 className="privacy_title">PRIVACY POLICY</h1>
      </div>
      <div className="privacy_content">
        <p>
          Welcome to <span style={{ color: '#de57e5' }}>Chatoyer</span>. At <span style={{ color: '#de57e5' }}>Chatoyer</span> Website, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit our website or use our services.
        </p>
        <h2 className="privacy_subtitle">Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li>
            <b className="bold_text">Personal Information:</b> This may include your name, email address, phone number, shipping address, and billing information when you make a purchase or sign up for an account.
          </li>
          <li>
            <b className="bold_text">Non-Personal Information:</b> This may include information such as your IP address, browser type, device type, and cookies, which are collected for analytics and website optimization purposes.
          </li>
        </ul>
        <h2 className="privacy_subtitle">How We Use Your Information</h2>
        <p>We may use your information for the following purposes:</p>
        <ul>
          <li>To process and fulfill orders and provide customer support.</li>
          <li>To send you transactional emails such as order confirmations and shipping notifications.</li>
          <li>To personalize your shopping experience and improve our website.</li>
          <li>To communicate with you about products, promotions, and updates.</li>
          <li>To protect our rights, privacy, safety, and property, or those of others.</li>
          <li>To comply with legal obligations and resolve disputes.</li>
        </ul>
        <h2 className="privacy_subtitle">Disclosure of Your Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Third-party service providers who assist us in operating our website and fulfilling orders.</li>
          <li>Legal authorities when required by law, to protect our rights, or in response to a legal request.</li>
          <li>Business partners, affiliates, or successors in connection with a merger, acquisition, or business transfer.</li>
        </ul>
        <h2 className="privacy_subtitle">Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to improve your experience on our website. You can manage your cookie preferences in your browser settings.
        </p>
        <h2 className="privacy_subtitle">Security</h2>
        <p>
          We take reasonable measures to protect your personal information from unauthorized access or disclosure. However, no data transmission over the internet or electronic storage is entirely secure. We cannot guarantee the absolute security of your information.
        </p>
        <h2 className="privacy_subtitle">Your Choices</h2>
        <p>You may have the following choices regarding your information:</p>
        <ul>
          <li>You can access and update your account information.</li>
          <li>You can unsubscribe from our marketing communications.</li>
          <li>You can delete or disable cookies in your browser settings.</li>
        </ul>
        <h2 className="privacy_subtitle">Children's Privacy</h2>
        <p>
          Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected personal information from a child under 13, please contact us to have it removed.
        </p>
        <h2 className="privacy_subtitle">Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the revised date will be indicated.
        </p>
        <p>
          If you have any questions or concerns about this Privacy Policy or how we handle your information, please contact us.
        </p>
      </div>
      <div className="privacy_contact">
        <p><b>ADDRESS:</b> Banjara Hills, Hyd 8-2-626/2 Road No. 10, Banjara Hills, Hyderabad-500034, Telangana, India</p>
        <p><b>CONTACT NUMBER:</b> +91 98456 23985</p>
        <b style={{ fontFamily: "'Domine', serif" }}>EMAIL:</b> support@chatoyer.net
      </div>
    </div>
  );
};

export default PrivacyPolicy;
