import { useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import { contactForm as copy, profile } from "../content";
import { sendMessage } from "../lib/sendMessage";
import Field from "./Field";
import Modal from "./Modal";
import { buttonClass } from "./ui";

const EMPTY = { name: "", email: "", message: "" };
const FIELDS = ["name", "email", "message"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = copy.errors.name;
  if (!email.trim()) errors.email = copy.errors.emailMissing;
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = copy.errors.email;
  if (!message.trim()) errors.message = copy.errors.messageMissing;
  else if (message.trim().length < 10) errors.message = copy.errors.message;
  return errors;
}

// Figma "Form card". Errors show under their fields after the first Send, then update as you type.
// The result (sent / not sent) opens the shared Modal; form errors never do.
export default function ContactForm() {
  const formRef = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [triedToSend, setTriedToSend] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed
  const sending = status === "sending";

  function handleChange(e) {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (triedToSend) setErrors(validate(next));
  }

  async function send() {
    setStatus("sending");
    try {
      await sendMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });
      setValues(EMPTY);
      setTriedToSend(false);
      setStatus("sent");
    } catch (error) {
      console.error("Contact form: the message was not sent.", error);
      setStatus("failed"); // the values stay, so "Try again" resends the same message
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (sending) return; // the button stays focusable while sending, so ignore extra presses

    const found = validate(values);
    setTriedToSend(true);
    setErrors(found);
    const firstInvalid = FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current.elements[firstInvalid].focus();
      return;
    }
    // Honeypot: people never see this box; bots tick every box. Pretend it worked, send nothing.
    if (formRef.current.elements.botcheck.checked) {
      setValues(EMPTY);
      setStatus("sent");
      return;
    }
    send();
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="contact-form-title"
        className="space-y-5 rounded-2xl border border-border bg-surface px-5 py-6 md:space-y-6 md:p-8"
      >
        <div className="space-y-1.5">
          <h3 id="contact-form-title" className="text-heading-s text-primary">
            {copy.title}
          </h3>
          <p className="text-body-s text-secondary">{copy.subtitle}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-4">
          <Field
            id="contact-name"
            name="name"
            label="Name"
            autoComplete="name"
            maxLength={100}
            placeholder={copy.placeholders.name}
            value={values.name}
            onChange={handleChange}
            readOnly={sending}
            error={errors.name}
          />
          <Field
            id="contact-email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            placeholder={copy.placeholders.email}
            value={values.email}
            onChange={handleChange}
            readOnly={sending}
            error={errors.email}
          />
        </div>
        <Field
          id="contact-message"
          name="message"
          label="Message"
          multiline
          maxLength={5000}
          placeholder={copy.placeholders.message}
          value={values.message}
          onChange={handleChange}
          readOnly={sending}
          error={errors.message}
        />

        {/* Honeypot for spam bots (Web3Forms' "botcheck"): hidden from people and screen readers */}
        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-body-s text-muted">{copy.privacy}</p>
          <button
            type="submit"
            aria-disabled={sending || undefined}
            className={`${buttonClass("primary")} w-full md:w-auto ${sending ? "cursor-progress opacity-60" : ""}`}
          >
            {sending ? (
              "Sending…"
            ) : (
              <>
                Send message
                <LuSend aria-hidden="true" className="size-4" />
              </>
            )}
          </button>
        </div>
      </form>
      {/* Screen readers announce this; it sits outside the form so it adds no space to the card */}
      <p role="status" className="sr-only">
        {sending ? "Sending your message…" : ""}
      </p>

      <Modal
        open={status === "sent"}
        onClose={() => setStatus("idle")}
        tone="success"
        title={copy.sent.title}
        description={copy.sent.body}
        actions={
          <button type="button" onClick={() => setStatus("idle")} className={buttonClass("primary")}>
            Done
          </button>
        }
      />
      <Modal
        open={status === "failed"}
        onClose={() => setStatus("idle")}
        tone="error"
        title={copy.failed.title}
        description={
          <>
            {copy.failed.body}{" "}
            <a href={`mailto:${profile.email}`} className="text-primary underline underline-offset-2">
              {profile.email}
            </a>
            .
          </>
        }
        actions={
          <>
            <button type="button" onClick={() => setStatus("idle")} className={buttonClass("secondary")}>
              Close
            </button>
            <button type="button" onClick={send} className={buttonClass("primary")}>
              Try again
            </button>
          </>
        }
      />
    </>
  );
}
