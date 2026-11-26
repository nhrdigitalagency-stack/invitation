import React, { useEffect, useId, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Home,
  MapPin,
  MessageCircle,
  Send,
  Utensils,
  Wallet,
} from 'lucide-react';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  EVENT_DETAILS,
  InvitationSubmission,
  RESTAURANTS,
  STORAGE_KEY,
  TeamChoice,
} from '../data/invitation';

interface InvitationFormProps {
  onCloseEnvelope: () => void;
}

interface FormErrors {
  firstName?: string;
  team?: string;
  restaurantId?: string;
}

export const InvitationForm: React.FC<InvitationFormProps> = ({ onCloseEnvelope }) => {
  const firstNameId = useId();
  const noteId = useId();

  const [firstName, setFirstName] = useState('');
  const [team, setTeam] = useState<TeamChoice | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'editing' | 'submitting' | 'sent'>('editing');
  const [lastSubmission, setLastSubmission] = useState<InvitationSubmission | null>(null);
  const [copied, setCopied] = useState(false);

  // Restore previous local draft/submission if the guest revisits
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<InvitationSubmission>;
      if (typeof parsed.firstName === 'string') setFirstName(parsed.firstName);
      if (parsed.team === 'maison' || parsed.team === 'restau') setTeam(parsed.team);
      if (typeof parsed.restaurantId === 'string') setRestaurantId(parsed.restaurantId);
      if (typeof parsed.note === 'string') setNote(parsed.note);
    } catch {
      // Ignore malformed storage entries
    }
  }, []);

  const handleSelectTeam = (choice: TeamChoice) => {
    setTeam(choice);
    if (choice === 'maison') {
      setRestaurantId(null);
      setErrors((prev) => ({ ...prev, team: undefined, restaurantId: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, team: undefined }));
    }
  };

  const handleSelectRestaurant = (id: string) => {
    setTeam('restau');
    setRestaurantId(id);
    setErrors((prev) => ({ ...prev, team: undefined, restaurantId: undefined }));
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!firstName.trim()) {
      nextErrors.firstName = 'Merci d’indiquer ton prénom avant d’envoyer.';
    }
    if (!team) {
      nextErrors.team = 'Choisis entre Team Maison ou Team Restau.';
    }
    if (team === 'restau' && !restaurantId) {
      nextErrors.restaurantId = 'Sélectionne le restaurant de ton choix.';
    }
    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus('submitting');

    const submission: InvitationSubmission = {
      firstName: firstName.trim(),
      team: team as TeamChoice,
      restaurantId: team === 'restau' ? restaurantId : null,
      note: note.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submission));
    } catch {
      // Non-blocking if storage is unavailable
    }

    const message = buildWhatsAppMessage(submission);
    const whatsappUrl = buildWhatsAppUrl(message);

    // Trigger WhatsApp navigation via anchor click (avoids window.open while honoring user gesture)
    const anchor = document.createElement('a');
    anchor.href = whatsappUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.setTimeout(() => {
      setLastSubmission(submission);
      setStatus('sent');
    }, 240);
  };

  const handleCopyMessage = async () => {
    if (!lastSubmission) return;
    const message = buildWhatsAppMessage(lastSubmission);
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const preparedMessage = lastSubmission ? buildWhatsAppMessage(lastSubmission) : '';
  const preparedUrl = lastSubmission ? buildWhatsAppUrl(preparedMessage) : '';
  const chosenRestaurant = lastSubmission?.restaurantId
    ? RESTAURANTS.find((r) => r.id === lastSubmission.restaurantId)
    : null;

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12"
    >
      {/* Top quiet utility bar */}
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={onCloseEnvelope}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-[#C5D3EA] transition-colors duration-150 hover:text-[#F5D391] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B] whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Refermer l&apos;enveloppe</span>
        </button>

        <span className="text-xs font-medium tracking-[0.2em] text-[#E5B96B] uppercase whitespace-nowrap shrink-0">
          {EVENT_DETAILS.dateLabel} · {EVENT_DETAILS.timeLabel}
        </span>
      </div>

      {/* Main 2-column desktop split / crisp single-column mobile stack */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Editorial Column — Faithful details from the invitation paper */}
        <section
          aria-labelledby="invitation-heading"
          className="flex flex-col lg:col-span-5 lg:sticky lg:top-10"
        >
          <p className="text-xs font-semibold tracking-[0.26em] text-[#E5B96B] uppercase">
            {EVENT_DETAILS.eyebrow}
          </p>

          <h1
            id="invitation-heading"
            className="mt-3 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[#FBF7EF] sm:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            {EVENT_DETAILS.title}
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#C2D0E6]">
            Choisis l&apos;ambiance qui te convient pour notre repas de Noël, sélectionne ton
            restaurant favori si tu votes Team Restau, puis envoie directement ta réponse sur
            WhatsApp.
          </p>

          {/* Practical Info Grid — Hairline dividers, tabular numbers, zero pill clutter */}
          <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="flex items-center gap-3 text-sm text-[#9FB3D4]">
                <Calendar className="h-4 w-4 text-[#E5B96B]" aria-hidden="true" />
                <span>Date</span>
              </dt>
              <dd className="text-sm font-semibold text-[#F8F4EC] tabular-nums">
                {EVENT_DETAILS.dateLabel}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="flex items-center gap-3 text-sm text-[#9FB3D4]">
                <Clock className="h-4 w-4 text-[#E5B96B]" aria-hidden="true" />
                <span>Heure</span>
              </dt>
              <dd className="text-sm font-semibold text-[#F8F4EC] tabular-nums">
                À {EVENT_DETAILS.timeLabel}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="flex items-center gap-3 text-sm text-[#9FB3D4]">
                <Wallet className="h-4 w-4 text-[#E5B96B]" aria-hidden="true" />
                <span>Participation</span>
              </dt>
              <dd className="text-sm font-semibold text-[#F3D08E] tabular-nums">
                {EVENT_DETAILS.contributionLabel}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="flex items-center gap-3 text-sm text-[#9FB3D4]">
                <MessageCircle className="h-4 w-4 text-[#E5B96B]" aria-hidden="true" />
                <span>Confirmation WhatsApp</span>
              </dt>
              <dd className="text-sm font-medium text-[#F8F4EC] tabular-nums">
                {EVENT_DETAILS.whatsappDisplay}
              </dd>
            </div>
          </dl>

          {/* Paper footnote rule */}
          <p className="mt-6 font-serif text-xl italic text-[#F1D59B]">
            * {EVENT_DETAILS.majorityRule}
          </p>
        </section>

        {/* Right Column — Precision Neon-Framed RSVP Form */}
        <section aria-label="Formulaire de vote et confirmation" className="lg:col-span-7">
          <div className="neon-form-shell">
            <div className="rounded-[calc(1.5rem-2px)] bg-[#0C1B36]/96 p-6 sm:p-8 md:p-9">
              {status === 'sent' && lastSubmission ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5B96B]/18 text-[#F3D08E] ring-1 ring-[#E5B96B]/45">
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-[#FBF7EF] sm:text-3xl">
                        Ta réponse est prête pour WhatsApp
                      </h2>
                      <p className="text-xs text-[#A5B8D8]">
                        Destinataire : {EVENT_DETAILS.whatsappDisplay}
                      </p>
                    </div>
                  </div>

                  {/* Clear summary of the submitted choice */}
                  <div className="mt-6 rounded-xl border border-white/10 bg-[#081327]/90 p-5">
                    <dl className="space-y-3 text-sm">
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-[#9BB0D1]">Prénom</dt>
                        <dd className="font-semibold text-[#FAF6EE]">
                          {lastSubmission.firstName}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-[#9BB0D1]">Équipe choisie</dt>
                        <dd className="font-semibold text-[#F3D08E]">
                          {lastSubmission.team === 'maison' ? 'Team Maison' : 'Team Restau'}
                        </dd>
                      </div>
                      {chosenRestaurant && (
                        <div className="flex items-baseline justify-between gap-4">
                          <dt className="text-[#9BB0D1]">Restaurant</dt>
                          <dd className="font-semibold text-[#FAF6EE]">
                            {chosenRestaurant.fullLabel}
                          </dd>
                        </div>
                      )}
                      {lastSubmission.note && (
                        <div className="border-t border-white/10 pt-3">
                          <dt className="text-xs text-[#9BB0D1]">Message ajouté</dt>
                          <dd className="mt-1 text-[#E6ECF6]">{lastSubmission.note}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-[#A7B9D7]">
                    Si WhatsApp ne s&apos;est pas ouvert automatiquement, clique sur le bouton
                    ci-dessous pour envoyer directement ton message au{' '}
                    <span className="font-medium text-[#F7F3EA] tabular-nums">
                      {EVENT_DETAILS.whatsappDisplay}
                    </span>
                    .
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={preparedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-xl bg-[#E5B96B] px-5 py-3.5 text-sm font-semibold text-[#081226] transition-all duration-150 hover:bg-[#F0C87D] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D391] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1B36] whitespace-nowrap"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      <span>Ouvrir WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-sm font-medium text-[#EBF0F9] transition-colors duration-150 hover:border-[#E5B96B]/50 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B] whitespace-nowrap"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-[#52D1DC]" aria-hidden="true" />
                          <span>Message copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" aria-hidden="true" />
                          <span>Copier le texte</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStatus('editing')}
                    className="mt-4 self-start cursor-pointer text-xs font-medium text-[#A9BCD9] underline decoration-white/25 underline-offset-4 transition-colors hover:text-[#F3D08E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B]"
                  >
                    Modifier ma réponse
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-7">
                  <div className="border-b border-white/10 pb-5">
                    <h2 className="font-serif text-2xl font-semibold text-[#FBF7EF] sm:text-3xl">
                      Confirme ta présence et ton vote
                    </h2>
                    <p className="mt-1.5 text-sm text-[#A5B8D8]">
                      Ta réponse sera formatée et envoyée par WhatsApp au{' '}
                      <span className="font-medium text-[#E5B96B] tabular-nums">
                        {EVENT_DETAILS.whatsappDisplay}
                      </span>
                      .
                    </p>
                  </div>

                  {/* 1. Ton Prénom */}
                  <div>
                    <label
                      htmlFor={firstNameId}
                      className="block text-sm font-semibold text-[#F4EFE4]"
                    >
                      Ton Prénom <span className="text-[#E5B96B]">*</span>
                    </label>
                    <input
                      id={firstNameId}
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) {
                          setErrors((prev) => ({ ...prev, firstName: undefined }));
                        }
                      }}
                      placeholder="Ex. Sarah, Marc, Junior..."
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? `${firstNameId}-error` : undefined}
                      className={`neon-input mt-2.5 w-full rounded-xl border bg-[#081327]/90 px-4 py-3.5 text-[15px] text-[#FBF7EF] placeholder-[#6D84A8] focus:outline-none ${
                        errors.firstName ? 'border-[#F07868]' : 'border-white/15'
                      }`}
                    />
                    {errors.firstName && (
                      <p
                        id={`${firstNameId}-error`}
                        role="alert"
                        className="mt-2 text-xs font-medium text-[#F79688]"
                      >
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* 2. Team Maison vs Team Restau */}
                  <fieldset>
                    <legend className="text-sm font-semibold text-[#F4EFE4]">
                      Quel est ton camp ? <span className="text-[#E5B96B]">*</span>
                    </legend>

                    <div
                      role="radiogroup"
                      aria-label="Choix entre Team Maison et Team Restau"
                      className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      {/* Team Maison */}
                      <button
                        type="button"
                        role="radio"
                        aria-checked={team === 'maison'}
                        onClick={() => handleSelectTeam('maison')}
                        className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B] ${
                          team === 'maison'
                            ? 'neon-option-active bg-[#152B52]'
                            : 'border-white/14 bg-[#081327]/80 hover:border-[#E5B96B]/45 hover:bg-[#102243]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Home
                            className={`h-5 w-5 shrink-0 ${
                              team === 'maison' ? 'text-[#F3D08E]' : 'text-[#8FA5C9]'
                            }`}
                            aria-hidden="true"
                          />
                          <span className="text-[15px] font-medium text-[#F7F3EA]">
                            Es-tu Team Maison ?
                          </span>
                        </span>

                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                            team === 'maison'
                              ? 'border-[#F3D08E] bg-[#E5B96B] text-[#081226]'
                              : 'border-[#738BB2] bg-transparent'
                          }`}
                        >
                          {team === 'maison' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </span>
                      </button>

                      {/* Team Restau */}
                      <button
                        type="button"
                        role="radio"
                        aria-checked={team === 'restau'}
                        onClick={() => handleSelectTeam('restau')}
                        className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B] ${
                          team === 'restau'
                            ? 'neon-option-active bg-[#152B52]'
                            : 'border-white/14 bg-[#081327]/80 hover:border-[#E5B96B]/45 hover:bg-[#102243]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Utensils
                            className={`h-5 w-5 shrink-0 ${
                              team === 'restau' ? 'text-[#F3D08E]' : 'text-[#8FA5C9]'
                            }`}
                            aria-hidden="true"
                          />
                          <span className="text-[15px] font-medium text-[#F7F3EA]">
                            Es-tu Team Restau ?
                          </span>
                        </span>

                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                            team === 'restau'
                              ? 'border-[#F3D08E] bg-[#E5B96B] text-[#081226]'
                              : 'border-[#738BB2] bg-transparent'
                          }`}
                        >
                          {team === 'restau' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </span>
                      </button>
                    </div>

                    {errors.team && (
                      <p role="alert" className="mt-2 text-xs font-medium text-[#F79688]">
                        {errors.team}
                      </p>
                    )}
                  </fieldset>

                  {/* 3. Choisis ton restaurant */}
                  <fieldset>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <legend className="text-sm font-semibold text-[#F4EFE4]">
                        Choisis ton restaurant{' '}
                        {team === 'restau' && <span className="text-[#E5B96B]">*</span>}
                      </legend>
                      <span className="text-xs text-[#8FA5C9]">
                        {team === 'maison'
                          ? 'Non requis pour Team Maison (cliquer bascule sur Team Restau)'
                          : '4 adresses proposées à Yaoundé'}
                      </span>
                    </div>

                    <div
                      role="radiogroup"
                      aria-label="Choisis ton restaurant"
                      className={`mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 transition-opacity duration-200 ${
                        team === 'maison' ? 'opacity-55 hover:opacity-100' : 'opacity-100'
                      }`}
                    >
                      {RESTAURANTS.map((restaurant) => {
                        const isSelected = team === 'restau' && restaurantId === restaurant.id;
                        return (
                          <button
                            key={restaurant.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => handleSelectRestaurant(restaurant.id)}
                            className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B] ${
                              isSelected
                                ? 'neon-option-active bg-[#152B52]'
                                : 'border-white/12 bg-[#081327]/75 hover:border-[#52D1DC]/50 hover:bg-[#102243]'
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-[15px] font-medium text-[#F7F3EA]">
                                {restaurant.name}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-[#9BB0D1]">
                                <MapPin className="h-3 w-3 text-[#E5B96B]/85" aria-hidden="true" />
                                <span>{restaurant.district}</span>
                              </p>
                            </div>

                            <span
                              aria-hidden="true"
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                isSelected
                                  ? 'border-[#F3D08E] bg-[#E5B96B] text-[#081226]'
                                  : 'border-[#6D84A8] bg-transparent'
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {errors.restaurantId && (
                      <p role="alert" className="mt-2 text-xs font-medium text-[#F79688]">
                        {errors.restaurantId}
                      </p>
                    )}
                  </fieldset>

                  {/* 4. Optional short note */}
                  <div>
                    <label
                      htmlFor={noteId}
                      className="flex items-baseline justify-between text-sm font-medium text-[#D6E0F0]"
                    >
                      <span>Un petit mot ou une précision</span>
                      <span className="text-xs font-normal text-[#859CC2]">Optionnel</span>
                    </label>
                    <textarea
                      id={noteId}
                      name="note"
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ex. Je viens avec 2 personnes, ou une suggestion pour le repas..."
                      className="neon-input mt-2 w-full resize-none rounded-xl border border-white/14 bg-[#081327]/90 px-4 py-3 text-sm text-[#FBF7EF] placeholder-[#6D84A8] focus:outline-none"
                    />
                  </div>

                  {/* Submit Action */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#E5B96B] px-6 py-4 text-[15px] font-semibold text-[#081226] shadow-[0_12px_30px_-8px_rgba(229,185,107,0.5)] transition-all duration-150 hover:bg-[#F1C97E] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D391] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1B36]"
                    >
                      <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="whitespace-nowrap">
                        {status === 'submitting'
                          ? 'Préparation du message WhatsApp...'
                          : 'Envoyer ma réponse sur WhatsApp'}
                      </span>
                    </button>

                    <p className="mt-3 text-center text-xs text-[#8FA5C9]">
                      Envoi direct vers WhatsApp ({EVENT_DETAILS.whatsappDisplay}) ·{' '}
                      <span className="italic text-[#E5C98E]">
                        {EVENT_DETAILS.majorityRule}
                      </span>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </motion.main>
  );
};
