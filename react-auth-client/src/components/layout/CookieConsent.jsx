import React from "react";
import CookieConsent, { Cookies } from "react-cookie-consent";
 export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Tout accepter"
      declineButtonText="Tout refuser"
      enableDeclineButton
      cookieName="userConsentCookies"
      style={{ background: "#589db4ff", color: "#fff" }}
      buttonStyle={{ color: "#fff", fontSize: "14px" }}
      declineButtonStyle={{ color: "#fff", background: "#c00", fontSize: "14px" }}
      onAccept={() => console.log("Cookies acceptés")}
      onDecline={() => console.log("Cookies refusés")}
    >
      Ce site utilise des cookies pour améliorer votre expérience.
    </CookieConsent>
  );
}
