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
  onCelebrate: () => void;
}

interface FormErrors {
  firstName?: string;
  team?: string;
  restaurantId?: string;
}

export const InvitationForm: React.FC<InvitationFormProps> = ({
  onCloseEnvelope,
  onCelebrate,
}) => {
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
      nextErrors.team = 'Choisis entre Team Maison et Team Restau.';
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

    // Trigger festive golden confetti celebration immediately upon validation
    onCelebrate();

    // Trigger WhatsApp navigation via anchor click (honors user gesture without window.open)
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
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12"
    >
      {/* Top quiet utility bar — safe on 320px phones */}
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-white/10 pb-3.5 sm:mb-8 sm:pb-4">
        <button
          type="button"
          onClick={onCloseEnvelope}
          className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-xs font-medium text-[#C5D3EA] transition-colors duration-150 hover:text-[#F5D391] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B] sm:gap-2 sm:px-2 sm:text-sm whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Refermer l&apos;enveloppe</span>
        </button>

        <span className="truncate text-[11px] font-medium tracking-[0.16em] text-[#E5B96B] uppercase tabular-nums sm:text-xs sm:tracking-[0.2em]">
          {EVENT_DETAILS.dateLabel} · {EVENT_DETAILS.timeLabel}
        </span>
      </div>

      {/* Responsive 1-col mobile/tablet -> 2-col desktop layout */}
      <div className="grid grid-cols-1 items-start gap-8 pb-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Editorial Column — Faithful details from the invitation paper */}
        <motion.section
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          aria-labelledby="invitation-heading"
          className="flex flex-col lg:col-span-5 lg:sticky lg:top-10"
        >
          <p className="font-script text-[1.95rem] leading-tight text-[#F3D08E] sm:text-[2.35rem]">
            {EVENT_DETAILS.eyebrow}
          </p>

          <h1
            id="invitation-heading"
            className="mt-2 font-serif text-[clamp(2rem,6vw,3.15rem)] font-semibold leading-[1.08] tracking-tight text-[#FBF7EF]"
            style={{ textWrap: 'balance' }}
          >
            {EVENT_DETAILS.title}
          </h1>

          <p className="mt-3.5 max-w-md text-sm leading-relaxed text-[#C2D0E6] sm:mt-4 sm:text-[15px]">
            Choisis l&apos;ambiance qui te convient pour notre repas de Noël, puis confirme ta
            participation.
          </p>

          {/* Practical Info List — Compact grid on mobile/tablet, crisp list on desktop */}
          <dl className="mt-6 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:mt-8 sm:grid-cols-2 sm:gap-x-6 sm:divide-y-0 lg:grid-cols-1 lg:divide-y">
            <div className="flex items-center justify-between gap-4 py-3.5 sm:border-b sm:border-white/10 lg:border-b-0 lg:py-4">
              <dt className="flex items-center gap-2.5 text-sm text-[#9FB3D4]">
                <Calendar className="h-4 w-4 shrink-0 text-[#E5B96B]" aria-hidden="true" />
                <span>Date</span>
              </dt>
              <dd className="text-sm font-semibold text-[#F8F4EC] tabular-nums">
                {EVENT_DETAILS.dateLabel}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 py-3.5 sm:border-b sm:border-white/10 lg:border-b-0 lg:py-4">
              <dt className="flex items-center gap-2.5 text-sm text-[#9FB3D4]">
                <Clock className="h-4 w-4 shrink-0 text-[#E5B96B]" aria-hidden="true" />
                <span>Heure</span>
              </dt>
              <dd className="text-sm font-semibold text-[#F8F4EC] tabular-nums">
                À {EVENT_DETAILS.timeLabel}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 py-3.5 lg:py-4">
              <dt className="flex items-center gap-2.5 text-sm text-[#9FB3D4]">
                <Wallet className="h-4 w-4 shrink-0 text-[#E5B96B]" aria-hidden="true" />
                <span>Participation</span>
              </dt>
              <dd className="text-right text-sm font-semibold text-[#F3D08E] tabular-nums">
                {EVENT_DETAILS.contributionLabel}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 py-3.5 lg:py-4">
              <dt className="flex items-center gap-2.5 text-sm text-[#9FB3D4]">
                <MessageCircle className="h-4 w-4 shrink-0 text-[#E5B96B]" aria-hidden="true" />
                <span>Confirmation</span>
              </dt>
              <dd className="text-sm font-medium text-[#F8F4EC]">Par WhatsApp</dd>
            </div>
          </dl>

          {/* Paper footnote rule */}
          <p className="mt-5 font-serif text-lg italic text-[#F1D59B] sm:mt-6 sm:text-xl">
            * {EVENT_DETAILS.majorityRule}
          </p>
        </motion.section>

        {/* Right Column — High-Contrast Architectural Neon-Framed RSVP Form */}
        <motion.section
          initial={{ opacity: 0, y: 20, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.58, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Formulaire de vote et confirmation"
          className="w-full lg:col-span-7"
        >
          <div className="neon-form-wrapper">
            <div className="neon-form-shell">
              {/* Rotating luminous neon beam */}
              <div aria-hidden="true" className="neon-form-beam" />

              <div className="neon-form-inner p-5 sm:p-7 md:p-9">
                {status === 'sent' && lastSubmission ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5B96B]/18 text-[#F3D08E] ring-1 ring-[#E5B96B]/55 shadow-[0_0_18px_rgba(246,206,118,0.35)]">
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-serif text-2xl font-semibold leading-tight text-[#FBF7EF] sm:text-3xl">
                          Ta réponse est prête pour WhatsApp
                        </h2>
                        <p className="mt-0.5 text-xs text-[#A5B8D8]">
                          Confirmation enregistrée pour le {EVENT_DETAILS.dateLabel}
                        </p>
                      </div>
                    </div>

                    <div className="neon-divider my-5" aria-hidden="true" />

                    {/* Clear summary of the submitted choice */}
                    <div className="rounded-xl border border-[#F6CE76]/20 bg-[#071226]/90 p-4 sm:p-5">
                      <dl className="space-y-3 text-sm">
                        <div className="flex items-baseline justify-between gap-4">
                          <dt className="text-[#9BB0D1]">Prénom</dt>
                          <dd className="text-right font-semibold text-[#FAF6EE]">
                            {lastSubmission.firstName}
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                          <dt className="text-[#9BB0D1]">Équipe choisie</dt>
                          <dd className="text-right font-semibold text-[#F3D08E]">
                            {lastSubmission.team === 'maison' ? 'Team Maison' : 'Team Restau'}
                          </dd>
                        </div>
                        {chosenRestaurant && (
                          <div className="flex items-baseline justify-between gap-4">
                            <dt className="text-[#9BB0D1]">Restaurant</dt>
                            <dd className="text-right font-semibold text-[#FAF6EE]">
                              {chosenRestaurant.fullLabel}
                            </dd>
                          </div>
                        )}
                        {lastSubmission.note && (
                          <div className="border-t border-white/10 pt-3">
                            <dt className="text-xs text-[#9BB0D1]">Message ajouté</dt>
                            <dd className="mt-1 break-words text-[#E6ECF6]">
                              {lastSubmission.note}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-[#A7B9D7]">
                      Si WhatsApp ne s&apos;est pas ouvert automatiquement, clique sur le bouton
                      ci-dessous pour transmettre ton message.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={preparedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neon-cta-btn inline-flex min-h-[48px] flex-1 items-center justify-center gap-2.5 rounded-xl bg-[#E5B96B] px-5 py-3.5 text-sm font-semibold text-[#081226] transition-all duration-150 hover:bg-[#F2CA7E] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D391] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1B36]"
                      >
                        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Ouvrir WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyMessage}
                        className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/[0.04] px-4 py-3.5 text-sm font-medium text-[#EBF0F9] transition-colors duration-150 hover:border-[#38E8FF]/55 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B]"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 shrink-0 text-[#38E8FF]" aria-hidden="true" />
                            <span>Message copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span>Copier le texte</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStatus('editing')}
                      className="mt-4 self-start min-h-[36px] cursor-pointer text-xs font-medium text-[#A9BCD9] underline decoration-white/25 underline-offset-4 transition-colors hover:text-[#F3D08E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B]"
                    >
                      Modifier ma réponse
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-7">
                    <div>
                      <h2 className="font-serif text-2xl font-semibold leading-tight text-[#FBF7EF] sm:text-3xl">
                        Confirme ta présence et ton vote
                      </h2>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#A5B8D8] sm:text-sm">
                        Indique ton prénom et tes choix, puis valide pour transmettre ta réponse.
                      </p>
                      <div className="neon-divider mt-4 sm:mt-5" aria-hidden="true" />
                    </div>

                    {/* 1. Ton prénom */}
                    <div>
                      <label
                        htmlFor={firstNameId}
                        className="block text-sm font-semibold text-[#F4EFE4]"
                      >
                        Ton prénom <span className="text-[#F6CE76]">*</span>
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
                        placeholder="Ex. : Sarah, Marc, Junior…"
                        aria-invalid={Boolean(errors.firstName)}
                        aria-describedby={errors.firstName ? `${firstNameId}-error` : undefined}
                        className={`neon-input mt-2 w-full rounded-xl border bg-[#071226]/95 px-4 py-3.5 text-base text-[#FBF7EF] placeholder-[#6D84A8] focus:outline-none sm:mt-2.5 sm:text-[15px] ${
                          errors.firstName ? 'border-[#F07868]' : 'border-white/16'
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
                        Quel est ton camp ? <span className="text-[#F6CE76]">*</span>
                      </legend>

                      <div
                        role="radiogroup"
                        aria-label="Choix entre Team Maison et Team Restau"
                        className="mt-2.5 grid grid-cols-1 gap-3 sm:mt-3 sm:grid-cols-2"
                      >
                        {/* Team Maison */}
                        <button
                          type="button"
                          role="radio"
                          aria-checked={team === 'maison'}
                          onClick={() => handleSelectTeam('maison')}
                          className={`group flex min-h-[56px] cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6CE76] ${
                            team === 'maison'
                              ? 'neon-option-active bg-[#152D57]'
                              : 'border-white/15 bg-[#071226]/85 hover:border-[#F6CE76]/55 hover:bg-[#102347]'
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <Home
                              className={`h-5 w-5 shrink-0 ${
                                team === 'maison' ? 'text-[#F6CE76]' : 'text-[#8FA5C9]'
                              }`}
                              aria-hidden="true"
                            />
                            <span className="text-sm font-medium text-[#F7F3EA] sm:text-[15px]">
                              Es-tu Team Maison ?
                            </span>
                          </span>

                          <span
                            aria-hidden="true"
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                              team === 'maison'
                                ? 'border-[#F6CE76] bg-[#E5B96B] text-[#081226]'
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
                          className={`group flex min-h-[56px] cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6CE76] ${
                            team === 'restau'
                              ? 'neon-option-active bg-[#152D57]'
                              : 'border-white/15 bg-[#071226]/85 hover:border-[#F6CE76]/55 hover:bg-[#102347]'
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <Utensils
                              className={`h-5 w-5 shrink-0 ${
                                team === 'restau' ? 'text-[#F6CE76]' : 'text-[#8FA5C9]'
                              }`}
                              aria-hidden="true"
                            />
                            <span className="text-sm font-medium text-[#F7F3EA] sm:text-[15px]">
                              Es-tu Team Restau ?
                            </span>
                          </span>

                          <span
                            aria-hidden="true"
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                              team === 'restau'
                                ? 'border-[#F6CE76] bg-[#E5B96B] text-[#081226]'
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
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                        <legend className="text-sm font-semibold text-[#F4EFE4]">
                          Choisis ton restaurant{' '}
                          {team === 'restau' && <span className="text-[#F6CE76]">*</span>}
                        </legend>
                        <span className="text-[11px] text-[#8FA5C9] sm:text-xs">
                          {team === 'maison'
                            ? 'Facultatif pour Team Maison'
                            : '4 adresses proposées à Yaoundé'}
                        </span>
                      </div>

                      <div
                        role="radiogroup"
                        aria-label="Choisis ton restaurant"
                        className={`mt-2.5 grid grid-cols-1 gap-2.5 sm:mt-3 sm:grid-cols-2 transition-opacity duration-200 ${
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
                              className={`flex min-h-[58px] cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6CE76] ${
                                isSelected
                                  ? 'neon-option-active bg-[#152D57]'
                                  : 'border-white/14 bg-[#071226]/80 hover:border-[#38E8FF]/60 hover:bg-[#102347]'
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-[#F7F3EA] sm:text-[15px]">
                                  {restaurant.name}
                                </p>
                                <p className="mt-0.5 flex items-center gap-1 text-xs text-[#9BB0D1]">
                                  <MapPin
                                    className="h-3 w-3 shrink-0 text-[#F6CE76]/85"
                                    aria-hidden="true"
                                  />
                                  <span className="truncate">{restaurant.district}</span>
                                </p>
                              </div>

                              <span
                                aria-hidden="true"
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                  isSelected
                                    ? 'border-[#F6CE76] bg-[#E5B96B] text-[#081226]'
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
                        className="flex items-baseline justify-between gap-2 text-sm font-medium text-[#D6E0F0]"
                      >
                        <span>Un petit mot ou une précision</span>
                        <span className="text-xs font-normal text-[#859CC2]">Facultatif</span>
                      </label>
                      <textarea
                        id={noteId}
                        name="note"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Je vous propose le restaurant… ou examinons le droit de bouchon, par exemple…"
                        className="neon-input mt-2 w-full resize-none rounded-xl border border-white/15 bg-[#071226]/95 px-4 py-3 text-base text-[#FBF7EF] placeholder-[#6D84A8] focus:outline-none sm:text-sm"
                      />
                    </div>

                    {/* Submit Action */}
                    <div className="pt-1">
                      <motion.button
                        type="submit"
                        disabled={status === 'submitting'}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.985 }}
                        className="neon-cta-btn inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#E5B96B] px-5 py-3.5 text-center text-sm font-semibold text-[#081226] transition-all duration-150 hover:bg-[#F2CB82] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D391] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1B36] sm:px-6 sm:py-4 sm:text-[15px]"
                      >
                        <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>
                          {status === 'submitting'
                            ? 'Préparation de ta confirmation…'
                            : 'Clique ici et envoie ta réponse'}
                        </span>
                      </motion.button>

                      <p className="mt-3 text-center text-xs italic text-[#E5C98E]">
                        * {EVENT_DETAILS.majorityRule}
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.main>
  );
};
