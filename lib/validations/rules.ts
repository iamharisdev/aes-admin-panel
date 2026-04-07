import * as Yup from "yup";

// ─── Phone ────────────────────────────────────────────────────────────────────
// Accepts: +923024149082  or  03024149082
// Format:  (+92 | 0) + 10 digits

const PHONE_REGEX = /^(\+92|0)[0-9]{10}$/;
const PHONE_MSG = "Enter a valid phone number (e.g. +923001234567 or 03001234567)";

/**
 * Required phone rule.
 * Use `.optional()` on top when the field is not mandatory.
 */
export const phoneRule = Yup.string()
  .matches(PHONE_REGEX, PHONE_MSG);

/**
 * Optional phone rule — skips validation when the field is empty.
 */
export const optionalPhoneRule = Yup.string().test(
  "optional-phone",
  PHONE_MSG,
  (v) => !v || PHONE_REGEX.test(v)
);

// ─── CNIC ─────────────────────────────────────────────────────────────────────
// Accepts: 32491-2951494-1
// Format:  5 digits - 7 digits - 1 digit

const CNIC_REGEX = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
const CNIC_MSG = "Enter a valid CNIC (e.g. 32491-2951494-1)";

/**
 * Required CNIC rule.
 * Use `.optional()` on top when the field is not mandatory.
 */
export const cnicRule = Yup.string()
  .matches(CNIC_REGEX, CNIC_MSG);

/**
 * Optional CNIC rule — skips validation when the field is empty.
 */
export const optionalCnicRule = Yup.string().test(
  "optional-cnic",
  CNIC_MSG,
  (v) => !v || CNIC_REGEX.test(v)
);
