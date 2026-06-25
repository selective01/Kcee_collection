// src/lib/icons.ts
// Registers ONLY the icons used in this app with the FA library.
// Import this once in main.tsx — replaces all.min.css with zero file changes elsewhere.
// To add a new icon: import it from the right package and add to library.add()

import { library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // injects FA CSS without webfonts

// ── Solid icons ─────────────────────────────────────────────────────────────
import {
  faArrowLeft,
  faArrowRight,
  faBox,
  faBoxOpen,
  faBoxes,
  faCalendarAlt,
  faCamera,
  faCheck,
  faCheckCircle,
  faCheckSquare,
  faCircle,
  faClock,
  faCog,
  faCreditCard,
  faEnvelope,
  faExclamationCircle,
  faExclamationTriangle,
  faHeart as fasHeart,
  faImage,
  faInbox,
  faMapMarkerAlt,
  faMousePointer,
  faNairaSign,
  faPaperPlane,
  faPhone,
  faPlus,
  faPlusCircle,
  faReply,
  faSearch,
  faShoppingBag,
  faShoppingCart,
  faSignOutAlt,
  faSlidersH,
  faSpinner,
  faTag,
  faTicketAlt,
  faTimes,
  faTimesCircle,
  faTrash,
  faTruck,
  faXmark,
  faEye,
  faEyeSlash,
  faChevronDown,
  faChevronUp,
  faInfoCircle,
  faLock,
  faUser,
  faEnvelopeOpen,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

// ── Regular icons ────────────────────────────────────────────────────────────
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

// ── Brand icons ──────────────────────────────────────────────────────────────
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

library.add(
  // Solid
  faArrowLeft, faArrowRight, faBox, faBoxOpen, faBoxes,
  faCalendarAlt, faCamera, faCheck, faCheckCircle, faCheckSquare,
  faCircle, faClock, faCog, faCreditCard, faEnvelope,
  faExclamationCircle, faExclamationTriangle, fasHeart, faImage,
  faInbox, faMapMarkerAlt, faMousePointer, faNairaSign, faPaperPlane,
  faPhone, faPlus, faPlusCircle, faReply, faSearch,
  faShoppingBag, faShoppingCart, faSignOutAlt, faSlidersH, faSpinner,
  faTag, faTicketAlt, faTimes, faTimesCircle, faTrash,
  faTruck, faXmark, faEye, faEyeSlash, faChevronDown, faChevronUp,
  faInfoCircle, faLock, faUser, faEnvelopeOpen, faBars,
  // Regular
  farHeart,
  // Brands
  faFacebook, faInstagram, faTwitter, faWhatsapp,
);
