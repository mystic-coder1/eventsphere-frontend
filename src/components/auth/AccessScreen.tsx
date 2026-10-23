'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../lib/store';
import { api, ApiUser } from '../../lib/api';
import { getStoredProfileImage } from '../../lib/profileImageStorage';
import { CURRENT_USER, INITIAL_ATTENDEES } from '../../lib/mockData';
import { Person, DemoRole, RoleType } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
  Mail,
  RotateCcw,
  X,
  User,
} from 'lucide-react';
import { cleanupLingeringOverlays } from '../../lib/overlayCleanup';

interface AccessScreenProps {
  onSuccess: () => void;
}

// Google 4-Color Icon
const GoogleIcon: React.FC<{ className?: string; size?: number }> = ({ className = 'w-[18px] h-[18px]', size = 18 }) => (
  <svg
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px`, maxWidth: `${size}px`, maxHeight: `${size}px` }}
    viewBox="0 0 24 24"
  >
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

// Helper: Safely decode Google JWT payload with UTF-8 character support
const parseJwtPayload = (jwt: string): { email?: string; name?: string; picture?: string; sub?: string } | null => {
  try {
    const parts = jwt.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    try {
      const base64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
};

// Helper: Mask email address (e.g., harigupta@getmyevent.in -> h***a@getmyevent.in)
const maskEmailAddress = (rawEmail: string): string => {
  const email = rawEmail.trim();
  if (!email || !email.includes('@')) return email;
  const [localPart, domainPart] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domainPart}`;
  }
  const first = localPart[0];
  const last = localPart[localPart.length - 1];
  const maskedMiddle = '*'.repeat(Math.min(localPart.length - 2, 4));
  return `${first}${maskedMiddle}${last}@${domainPart}`;
};

// Helper: Derive readable name from email address
const deriveNameFromEmail = (email: string): string => {
  const local = email.split('@')[0] || '';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'MPSS26 Delegate';
  return cleaned
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const AccessScreen: React.FC<AccessScreenProps> = ({ onSuccess }) => {
  const { setRole, setHasAccessConfirmed, setCurrentUser, resetUserState } = useStore();

  const [step, setStep] = useState<'details' | 'otp' | 'create_profile'>('details');
  const [pendingEmail, setPendingEmail] = useState('');
  const [profileName, setProfileName] = useState('');
  const profileNameInputRef = useRef<HTMLInputElement>(null);
  const [eventId, setEventId] = useState('MPSS26');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  // 4-digit OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const [status, setStatus] = useState<'idle' | 'sending' | 'verifying' | 'confirmed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const digit0Ref = useRef<HTMLInputElement>(null);
  const digit1Ref = useRef<HTMLInputElement>(null);
  const digit2Ref = useRef<HTMLInputElement>(null);
  const digit3Ref = useRef<HTMLInputElement>(null);
  const digit4Ref = useRef<HTMLInputElement>(null);
  const digit5Ref = useRef<HTMLInputElement>(null);

  const digitRefs = [digit0Ref, digit1Ref, digit2Ref, digit3Ref, digit4Ref, digit5Ref];
  const googleButtonContainerRef = useRef<HTMLDivElement | null>(null);
  const [isGisReady, setIsGisReady] = useState(false);

  // Focus first digit box when switching to OTP screen
  useEffect(() => {
    if (step === 'otp') {
      const timer = setTimeout(() => {
        digitRefs[0].current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else if (step === 'create_profile') {
      const timer = setTimeout(() => {
        profileNameInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Aggressively clean up Google GIS One-Tap DOM containers and prompts when AccessScreen unmounts
  useEffect(() => {
    return () => {
      cleanupLingeringOverlays();
    };
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [step, resendTimer]);

  // Email validation helper
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Step 1: Send OTP handler
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (status === 'sending' || status === 'verifying' || status === 'confirmed') return;

    setErrorMessage('');

    // 1. Validate Event ID
    const trimmedEventId = eventId.trim().toUpperCase();
    if (!trimmedEventId) {
      setStatus('error');
      setErrorMessage('Please enter an Event ID.');
      return;
    }
    if (trimmedEventId !== 'MPSS26') {
      setStatus('error');
      setErrorMessage('Invalid Event ID. Please use MPSS26 for this summit.');
      return;
    }

    // 2. Validate Registered Email Address
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatus('error');
      setErrorMessage('Please enter your registered email address.');
      emailInputRef.current?.focus();
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid registered email address.');
      emailInputRef.current?.focus();
      return;
    }

    setStatus('sending');

    try {
      // Send OTP via auth service
      const res = await api.auth.sendEmailOtp(trimmedEventId, trimmedEmail);
      const masked = maskEmailAddress(trimmedEmail);

      setTimeout(() => {
        setOtpDigits(['', '', '', '', '', '']);
        setMaskedEmail(masked);
        setStatus('idle');
        setStep('otp');
        setResendTimer(45);
        setCanResend(false);
        const demoNote = res?.demoOtp ? ` (Demo OTP: ${res.demoOtp})` : '';
        setOtpNotice(`OTP sent to ${masked}.${demoNote}`);
        setTimeout(() => setOtpNotice(null), 7000);
      }, 300);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Failed to send OTP. Please check your email and try again.');
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(45);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMessage('');

    try {
      const res = await api.auth.sendEmailOtp(eventId.trim().toUpperCase(), email.trim());
      const demoNote = res?.demoOtp ? ` (Demo OTP: ${res.demoOtp})` : '';
      setOtpNotice(`New OTP sent to ${maskedEmail}.${demoNote}`);
      setTimeout(() => setOtpNotice(null), 6000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to resend OTP. Please wait before retrying.');
    }
    digitRefs[0].current?.focus();
  };

  // OTP Digits change handler
  const handleDigitChange = (index: number, val: string) => {
    setErrorMessage('');
    const clean = val.replace(/\D/g, '');

    const nextDigits = [...otpDigits];
    if (!clean) {
      nextDigits[index] = '';
      setOtpDigits(nextDigits);
      return;
    }

    // Single digit input
    nextDigits[index] = clean[clean.length - 1];
    setOtpDigits(nextDigits);

    // Auto-advance to next input box
    if (index < 5 && clean) {
      digitRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste) {
      const next = ['', '', '', '', '', ''];
      for (let i = 0; i < paste.length; i++) {
        next[i] = paste[i];
      }
      setOtpDigits(next);
      const nextFocus = Math.min(paste.length, 5);
      digitRefs[nextFocus].current?.focus();
    }
  };

  // Establish session directly from backend user profile
  const establishSessionFromBackendUser = (backendUser: any, token?: string) => {
    resetUserState();
    const rawRole = (backendUser.role || '').toLowerCase();
    const detectedDemoRole: DemoRole = rawRole.includes('organizer')
      ? 'organizer'
      : rawRole.includes('exhibitor')
      ? 'exhibitor'
      : 'delegate';

    setRole(detectedDemoRole);
    const personRole: RoleType = detectedDemoRole === 'organizer'
      ? 'organizer_staff'
      : detectedDemoRole === 'exhibitor'
      ? 'exhibitor_staff'
      : (rawRole === 'speaker' ? 'speaker' : rawRole === 'vip' ? 'vip' : 'delegate');

    const name = backendUser.name || deriveNameFromEmail(backendUser.email || '');
    const userId = backendUser.id || `att-${Date.now().toString().slice(-6)}`;
    const avatarUrl = getStoredProfileImage(backendUser.email) || backendUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=181818&color=ffffff&bold=true`;

    const isPlaceholderDesignation = (d?: string) => {
      if (!d) return true;
      const lower = d.trim().toLowerCase();
      return lower === 'delegate' || lower === 'summit attendee' || lower === 'attendee' || lower === 'participant';
    };

    const isPlaceholderCompany = (c?: string) => {
      if (!c) return true;
      const lower = c.trim().toLowerCase();
      return lower === 'summit attendee' || lower === 'mpss 2026' || lower === 'mpss26' || lower === 'delegate' || lower === 'attendee';
    };

    setCurrentUser({
      id: userId,
      name: name,
      designation: isPlaceholderDesignation(backendUser.designation) ? '' : (backendUser.designation || ''),
      company: isPlaceholderCompany(backendUser.company) ? '' : (backendUser.company || ''),
      role: personRole,
      email: backendUser.email || '',
      mobile: backendUser.mobile && backendUser.mobile !== 'Not listed' ? backendUser.mobile : '',
      avatar: avatarUrl,
      bio: backendUser.bio || '',
      linkedin: backendUser.linkedin || '',
      twitter: backendUser.twitter || '',
      interests: ['Semiconductors', 'VLSI Design', 'AI Infrastructure'],
      skills: ['Technology'],
      checkedIn: true,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      registrationId: backendUser.registrationId || `#REG-MPSS26-${(backendUser.id || '0000').slice(-4)}`,
      ticketType: backendUser.ticketType || 'Delegate',
      privacy: {
        shareEmail: true,
        sharePhone: true,
        shareLinkedIn: true,
        shareTwitter: false,
        preset: 'Connections Only',
      },
    });

    const activeToken = token || api.getToken() || `mpss26-delegate-token-${encodeURIComponent((backendUser.email || '').trim())}`;
    const apiRole = detectedDemoRole === 'organizer'
      ? 'ROLE_ORGANIZER'
      : detectedDemoRole === 'exhibitor'
      ? 'ROLE_EXHIBITOR'
      : 'ROLE_DELEGATE';

    const apiUser: ApiUser = {
      id: userId,
      name: name,
      email: backendUser.email || '',
      mobile: backendUser.mobile || '',
      role: apiRole as any,
      eventId: backendUser.eventId || 'MPSS26',
      avatar: avatarUrl,
      ticketType: backendUser.ticketType || 'Delegate',
      checkedIn: true,
    };
    api.setSession(activeToken, apiUser);
  };

  // Establish delegate authenticated session (only name and email fetched via Google auth, others blank)
  const establishSessionForEmail = (userEmail: string, userName?: string, userAvatar?: string) => {
    resetUserState();
    setRole('delegate');
    const derivedName = userName?.trim() || deriveNameFromEmail(userEmail);
    const userId = `att-${Date.now().toString().slice(-6)}`;
    const avatarUrl = getStoredProfileImage(userEmail) || userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=181818&color=ffffff&bold=true`;
    const newAttendee: Person = {
      id: userId,
      name: derivedName,
      designation: '',
      company: '',
      role: 'delegate',
      email: userEmail.trim(),
      mobile: '',
      linkedin: '',
      twitter: '',
      avatar: avatarUrl,
      bio: '',
      interests: ['Semiconductors', 'VLSI Design', 'AI Infrastructure'],
      skills: ['Technology'],
      checkedIn: true,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      registrationId: `#REG-MPSS26-${Math.floor(1000 + Math.random() * 9000)}`,
      ticketType: 'Delegate',
      privacy: {
        shareEmail: true,
        sharePhone: true,
        shareLinkedIn: true,
        shareTwitter: false,
        preset: 'Connections Only',
      },
    };
    setCurrentUser(newAttendee);

    // Save persistent session token and user into api client and localStorage
    const persistentToken = `mpss26-delegate-token-${encodeURIComponent(userEmail.trim())}`;
    const apiUser: ApiUser = {
      id: userId,
      name: derivedName,
      email: userEmail.trim(),
      mobile: '',
      role: 'ROLE_DELEGATE',
      eventId: 'MPSS26',
      avatar: avatarUrl,
      ticketType: 'Delegate',
      checkedIn: true,
    };
    api.setSession(persistentToken, apiUser);
  };

  // Step 2: Verify OTP & Enter Event
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (status === 'verifying' || status === 'confirmed') return;

    setErrorMessage('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setStatus('error');
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }

    setStatus('verifying');

    try {
      // 1. Try backend verification if endpoint is live
      try {
        const authRes = await api.auth.verifyEmailOtp(eventId || 'MPSS26', email.trim(), enteredOtp);
        if (authRes?.isNewUser || authRes?.newUser) {
          setPendingEmail(authRes.user?.email || email.trim());
          setProfileName('');
          setStatus('idle');
          setStep('create_profile');
          return;
        }
        if (authRes?.user) {
          establishSessionFromBackendUser(authRes.user, authRes.token);
          setStatus('confirmed');
          setTimeout(() => {
            setHasAccessConfirmed(true);
            onSuccess();
          }, 350);
          return;
        }
      } catch (err: any) {
        if (err?.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
          setStatus('error');
          setErrorMessage(err.message);
          return;
        }
        // Fallback for offline demo mode
        const isDemoOtp = enteredOtp === generatedOtp || enteredOtp === '123456' || enteredOtp === '000000';
        if (!isDemoOtp) {
          setStatus('error');
          setErrorMessage('Invalid OTP code. Please enter the 6-digit code.');
          return;
        }
      }

      establishSessionForEmail(email, fullName);

      setStatus('confirmed');
      setTimeout(() => {
        setHasAccessConfirmed(true);
        onSuccess();
      }, 350);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Verification failed. Please try again.');
    }
  };

  // Handle credential token returned by Google Identity Services
  const handleGoogleCredentialResponse = useCallback(
    async (response: any) => {
      if (!response?.credential) return;
      setIsGoogleLoading(true);
      setStatus('idle');
      setErrorMessage('');

      // Safely extract payload from Google JWT with UTF-8 character support
      const payload = parseJwtPayload(response.credential);
      const googleEmail = payload?.email || '';
      const googleName = payload?.name || '';
      const googlePicture = payload?.picture || '';

      const cleanEventId = (eventId || 'MPSS26').trim().toUpperCase().replace(/\s+/g, '');

      try {
        // Race backend call with 4s timeout for fast, reliable sign in
        const backendPromise = api.auth.googleLogin(cleanEventId, googleEmail, response.credential, googleName);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('BACKEND_TIMEOUT')), 4000)
        );

        let res: any = null;
        try {
          res = await Promise.race([backendPromise, timeoutPromise]);
        } catch (raceErr: any) {
          if (raceErr?.message === 'BACKEND_TIMEOUT') {
            // Cloud Run cold-start or slow network — immediately log in with verified Google credentials!
            if (googleEmail) {
              cleanupLingeringOverlays();
              establishSessionForEmail(googleEmail, googleName, googlePicture);
              setStatus('confirmed');
              setHasAccessConfirmed(true);
              onSuccess();
              // Continue background sync to hydrate full server profile once ready
              backendPromise
                .then((bgRes) => {
                  if (bgRes?.user) {
                    establishSessionFromBackendUser(bgRes.user, bgRes.token);
                  }
                })
                .catch(() => {});
              return;
            }
          }
          throw raceErr;
        }

        if (res?.isNewUser || res?.newUser) {
          const targetEmail = res.user?.email || googleEmail || email.trim();
          const targetName = res.user?.name || googleName || '';
          if (targetEmail && targetName) {
            cleanupLingeringOverlays();
            establishSessionForEmail(targetEmail, targetName, googlePicture);
            setStatus('confirmed');
            setTimeout(() => {
              setHasAccessConfirmed(true);
              onSuccess();
            }, 200);
            return;
          }
          cleanupLingeringOverlays();
          setPendingEmail(targetEmail);
          setProfileName(targetName);
          setStatus('idle');
          setStep('create_profile');
          return;
        }

        if (res?.user) {
          cleanupLingeringOverlays();
          establishSessionFromBackendUser(res.user, res.token);
          setStatus('confirmed');
          setTimeout(() => {
            setHasAccessConfirmed(true);
            onSuccess();
          }, 200);
          return;
        }
      } catch (err: any) {
        const errMsg = err?.message || '';
        if (
          errMsg.toLowerCase().includes('not registered') ||
          errMsg.toLowerCase().includes('not found') ||
          errMsg.includes('404')
        ) {
          const targetEmail = googleEmail || email.trim();
          if (targetEmail) {
            cleanupLingeringOverlays();
            setPendingEmail(targetEmail);
            setProfileName(googleName || deriveNameFromEmail(targetEmail));
            setStatus('idle');
            setStep('create_profile');
            return;
          }
        }
        if (googleEmail) {
          // Fallback: establish delegate authenticated session using verified Google identity
          cleanupLingeringOverlays();
          establishSessionForEmail(googleEmail, googleName, googlePicture);
          setStatus('confirmed');
          setTimeout(() => {
            setHasAccessConfirmed(true);
            onSuccess();
          }, 200);
          return;
        }
        setStatus('error');
        setErrorMessage(errMsg || 'This Google account is not registered as an event delegate.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [eventId, email, onSuccess, setHasAccessConfirmed]
  );

  // Step 3: Complete Profile & Activate Delegate Pass
  const handleCreateProfile = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (status === 'verifying' || status === 'confirmed') return;

    setErrorMessage('');
    const trimmedName = profileName.trim();
    if (!trimmedName) {
      setStatus('error');
      setErrorMessage('Please enter your full name.');
      profileNameInputRef.current?.focus();
      return;
    }
    if (trimmedName.length < 2) {
      setStatus('error');
      setErrorMessage('Please enter a valid full name (at least 2 characters).');
      profileNameInputRef.current?.focus();
      return;
    }

    setStatus('verifying');
    try {
      const targetEmail = pendingEmail.trim() || email.trim();
      const authRes = await api.auth.register(eventId || 'MPSS26', targetEmail, trimmedName);
      if (authRes?.user) {
        cleanupLingeringOverlays();
        establishSessionFromBackendUser(authRes.user, authRes.token);
        setStatus('confirmed');
        setTimeout(() => {
          setHasAccessConfirmed(true);
          onSuccess();
        }, 350);
        return;
      }

      // Offline fallback session
      cleanupLingeringOverlays();
      establishSessionForEmail(targetEmail, trimmedName);
      setStatus('confirmed');
      setTimeout(() => {
        setHasAccessConfirmed(true);
        onSuccess();
      }, 350);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Failed to complete profile. Please try again.');
    }
  };

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '1031947527724-gqcj9phog0kfubj1l1e0vg83uish36g2.apps.googleusercontent.com';

  // Render Google's official Sign-In button into container with zero dead-zones
  const renderGoogleButton = useCallback(
    (container: HTMLDivElement | null) => {
      if (!container || typeof window === 'undefined') return;

      if (!(window as any).google?.accounts?.id) {
        // Ensure Google GIS script tag is dynamically loaded if missing
        if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            renderGoogleButton(container);
          };
          document.head.appendChild(script);
        }
        return;
      }

      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        container.innerHTML = '';
        const measuredWidth = container.clientWidth || 340;
        const targetWidth = Math.min(Math.max(measuredWidth, 240), 400);

        (window as any).google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'center',
          width: targetWidth,
        });

        setIsGisReady(true);
      } catch (err) {
        console.error('Failed to render Google Sign-In button:', err);
      }
    },
    [googleClientId, handleGoogleCredentialResponse]
  );

  // Callback ref: renders Google button the moment container mounts into DOM
  const setGoogleButtonContainer = useCallback(
    (node: HTMLDivElement | null) => {
      googleButtonContainerRef.current = node;
      if (node) {
        renderGoogleButton(node);
      }
    },
    [renderGoogleButton]
  );

  // Ensure button is re-rendered whenever navigating back to 'details' step or resizing
  useEffect(() => {
    if (step !== 'details') return;

    const container = googleButtonContainerRef.current;
    if (container) {
      renderGoogleButton(container);
    }

    // Polling retry while GIS client finishes initialization
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if ((window as any).google?.accounts?.id && googleButtonContainerRef.current) {
        renderGoogleButton(googleButtonContainerRef.current);
        clearInterval(interval);
      }
      if (attempts > 30) {
        clearInterval(interval);
      }
    }, 150);

    // ResizeObserver to adjust button if device rotates or frame resizes
    let ro: ResizeObserver | null = null;
    if (container && typeof ResizeObserver !== 'undefined') {
      let lastWidth = container.clientWidth;
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.round(entry.contentRect.width);
          if (w > 200 && Math.abs(w - lastWidth) > 15) {
            lastWidth = w;
            renderGoogleButton(container);
          }
        }
      });
      ro.observe(container);
    }

    return () => {
      clearInterval(interval);
      ro?.disconnect();
    };
  }, [step, renderGoogleButton]);

  // Fallback Google Sign-In trigger when GIS is loading or One-Tap is used
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    if (typeof window === 'undefined') {
      setIsGoogleLoading(false);
      return;
    }

    if ((window as any).google?.accounts?.id) {
      if (googleButtonContainerRef.current) {
        renderGoogleButton(googleButtonContainerRef.current);
      }
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          setIsGoogleLoading(false);
          if (notification?.isNotDisplayed?.()) {
            const reason = notification.getNotDisplayedReason?.() || 'unknown';
            console.warn('GIS One-Tap not displayed:', reason);
            cleanupLingeringOverlays();
            if (reason === 'opt_out_or_no_session') {
              setErrorMessage('No active Google session found. Please sign in to your Google account in this browser and try again.');
            } else if (reason === 'suppressed_by_user') {
              setErrorMessage('Google Sign-In prompt was previously dismissed. Please use the button directly or reset browser cookies.');
            }
          }
          if (notification?.isDismissedMoment?.()) {
            cleanupLingeringOverlays();
          }
        });
        return;
      } catch (err: any) {
        setIsGoogleLoading(false);
        cleanupLingeringOverlays();
        setErrorMessage('Unable to initialize Google Sign-In. Please check your browser settings.');
        return;
      }
    }

    // Wait up to 3 seconds for GIS script to load
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += 150;
      if ((window as any).google?.accounts?.id) {
        clearInterval(timer);
        setIsGoogleLoading(false);
        if (googleButtonContainerRef.current) {
          renderGoogleButton(googleButtonContainerRef.current);
        }
        return;
      }
      if (elapsed >= 3000) {
        clearInterval(timer);
        setIsGoogleLoading(false);
        setErrorMessage('Google Sign-In service is taking longer than expected. Please check your internet connection or disable ad-blockers, then retry.');
      }
    }, 150);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6] min-h-[600px] select-none h-full relative overflow-y-auto">
      {/* Hero Image Section */}
      <div
        className="h-[48%] min-h-[320px] sm:min-h-[360px] relative bg-cover bg-center shrink-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")',
        }}
      >
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] bg-white rounded-lg flex items-center justify-center font-bold text-[#181818] text-[15px] shadow-sm">
              G
            </div>
            <span className="font-bold text-[13px] tracking-[0.18em] text-white">GETMYEVENT</span>
          </div>
          <span className="text-[11px] font-semibold tracking-wide text-white border border-white/20 px-3.5 py-1 rounded-lg backdrop-blur-md bg-[#334155]/70 shadow-xs">
            MPSS26
          </span>
        </div>

        {/* Bottom Hero Text */}
        <div className="absolute bottom-10 left-6 right-6 z-10 text-white">
          <p className="text-[13px] font-normal text-white/90 mb-1">Welcome to</p>
          <h1 className="text-[30px] sm:text-[34px] font-serif font-normal leading-[1.15] tracking-tight text-white">
            MP Semiconductor<br />Summit 2026
          </h1>
          <p className="text-[13px] font-normal text-white/85 mt-2">
            23 – 24 Oct 2026 · Indore
          </p>
        </div>
      </div>

      {/* Form / Bottom Sheet Section */}
      <div className="flex-1 bg-[#FAF9F6] rounded-t-[32px] -mt-6 relative z-20 px-6 pt-6 pb-8 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-black/5">
        {/* Floating OTP Notice banner */}
        {otpNotice && (
          <div className="mb-3 p-2.5 bg-[#181818] text-white text-[12px] rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1">{otpNotice}</span>
          </div>
        )}

        {/* STEP 1: Details Entry - Google Sign-In Only */}
        {step === 'details' && (
          <div className="flex-1 flex flex-col">
            {/* Header with Red Accent Bar */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-[4px] self-stretch min-h-[36px] bg-[#D32F2F] rounded-full shrink-0 mt-0.5" />
              <div>
                <h2 className="text-[19px] font-bold text-[#111827] tracking-tight leading-tight">
                  Enter your event
                </h2>
                <p className="text-[13px] text-[#6B7280] mt-1 leading-snug">
                  Sign in with your Google account to access MPSS 2026.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Event ID Field */}
              <div>
                <label className="block text-[12.5px] font-semibold text-[#181818] mb-1.5">
                  Event ID
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value.toUpperCase())}
                    placeholder="MPSS26"
                    disabled={isGoogleLoading}
                    className="w-full h-[52px] pl-4 pr-12 rounded-2xl bg-white border border-[#E5E7EB] text-[15px] font-bold tracking-normal text-[#181818] shadow-xs focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all uppercase"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <CheckCircle2 className="w-5 h-5 text-[#D32F2F] stroke-[1.8]" />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              )}

              {/* Google Sign-In Action */}
              <div className="pt-3.5 flex flex-col items-center justify-center w-full">
                <div className="w-full min-h-[46px] flex items-center justify-center relative overflow-hidden">
                  {/* Dedicated Loading State — completely isolated */}
                  {isGoogleLoading && (
                    <div
                      key="google-loading-state"
                      className="w-full h-[46px] bg-white border border-[#E5E7EB] text-[#111827] font-semibold text-[14px] rounded-full shadow-xs flex items-center justify-center gap-2.5 z-20"
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-[#D32F2F]" />
                      <span>Signing you in...</span>
                    </div>
                  )}

                  {/* Official Google Identity Services Rendered Button Container (kept in DOM, hidden while loading) */}
                  <div
                    key="google-native-btn-wrapper"
                    ref={setGoogleButtonContainer}
                    className={`w-full flex justify-center items-center ${isGoogleLoading || !isGisReady ? 'hidden' : 'block'} [&>div]:!mx-auto`}
                  />

                  {/* Fallback button when GIS script is initializing */}
                  {!isGisReady && !isGoogleLoading && (
                    <button
                      key="google-fallback-btn"
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={status === 'sending' || isGoogleLoading}
                      className="w-full h-[46px] bg-white hover:bg-[#FAFAFA] active:scale-[0.99] border border-[#E5E7EB] text-[#111827] font-semibold text-[14px] rounded-full shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70"
                    >
                      <GoogleIcon size={19} className="w-[19px] h-[19px] shrink-0" />
                      <span>Continue with Google</span>
                    </button>
                  )}
                </div>

                {/* Footer Trust Badges */}
                <div className="mt-6 pb-1 flex items-center justify-center gap-3 text-[12px] font-normal text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#6B7280] stroke-[1.8]" />
                    <span>Secure sign-in</span>
                  </div>
                  <span className="text-[#D1D5DB]">|</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#6B7280] stroke-[1.8]" />
                    <span>Registration verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-3 duration-200">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setStep('details');
                setStatus('idle');
                setErrorMessage('');
              }}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280] hover:text-[#181818] mb-3 transition-colors cursor-pointer w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change email address</span>
            </button>

            {/* Header with Red Accent Bar */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-1 self-stretch min-h-[38px] bg-[#B51F32] rounded-full shrink-0 mt-0.5" />
              <div>
                <h2 className="text-[17px] font-bold text-[#181818] tracking-tight">Verify Email Address</h2>
                <p className="text-[11.5px] text-[#6B7280] mt-0.5 leading-snug">
                  Enter the 6-digit code sent to{' '}
                  <strong className="text-[#181818]">{maskedEmail}</strong>
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center py-2">
              {/* 4 Digit Boxes */}
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={digitRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    disabled={status === 'verifying' || status === 'confirmed'}
                    className="w-11 h-12 sm:w-13 sm:h-14 text-center text-xl font-bold rounded-xl bg-white border border-[#E5E7EB] text-[#181818] shadow-xs focus:ring-2 focus:ring-[#B51F32]/25 focus:border-[#B51F32] outline-none transition-all"
                  />
                ))}
              </div>

              {/* Demo Helper Tag (convenient 1-click test fill) */}
              <div className="flex justify-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(['1', '2', '3', '4']);
                    setErrorMessage('');
                  }}
                  className="px-3 py-1 bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-full text-[11px] font-medium text-[#4B5563] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Demo OTP:</span>
                  <span className="font-bold text-[#B51F32]">1234</span>
                  <span className="text-[10px] text-[#9CA3AF]">(tap to autofill)</span>
                </button>
              </div>

              {/* Resend OTP Timer */}
              <div className="text-center mt-3">
                {resendTimer > 0 ? (
                  <p className="text-[12px] text-[#6B7280]">
                    Didn&apos;t receive code? Resend in{' '}
                    <strong className="text-[#181818]">
                      00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                    </strong>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[12px] font-bold text-[#B51F32] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in mt-3">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              )}

              {/* Success Confirmation State */}
              {status === 'confirmed' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in mt-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-[12px] text-emerald-900">Access Confirmed ✓</p>
                    <p className="text-[11px] text-emerald-700">Loading your personalized experience...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Verify & Enter Action */}
            <div className="mt-4 pt-1">
              <button
                type="submit"
                disabled={
                  otpDigits.join('').length < 6 ||
                  status === 'verifying' ||
                  status === 'confirmed'
                }
                className="w-full h-12 bg-[#B51F32] hover:bg-[#9C1A2B] active:scale-[0.98] text-white font-semibold text-[14px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'verifying' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : status === 'confirmed' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Access Confirmed ✓</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Footer Trust Badges */}
              <div className="mt-5 pb-1 flex items-center justify-center gap-3 text-[12px] font-medium text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Secure sign-in</span>
                </div>
                <span className="text-[#D1D5DB]">|</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Registration verified</span>
                </div>
              </div>
            </div>
          </form>
        )}
        {/* STEP 3: Create Profile (Only asks for Name) */}
        {step === 'create_profile' && (
          <form onSubmit={handleCreateProfile} className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-3 duration-200">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setStep('details');
                setStatus('idle');
                setErrorMessage('');
              }}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280] hover:text-[#181818] mb-3 transition-colors cursor-pointer w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign-in</span>
            </button>

            {/* Header with Red Accent Bar */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-1 self-stretch min-h-[38px] bg-[#B51F32] rounded-full shrink-0 mt-0.5" />
              <div>
                <h2 className="text-[17px] font-bold text-[#181818] tracking-tight">Create your profile</h2>
                <p className="text-[11.5px] text-[#6B7280] mt-0.5 leading-snug">
                  Welcome to MP Semiconductor Summit 2026. Only your name is needed to activate your delegate pass.
                </p>
              </div>
            </div>

            {/* Verified Email Badge */}
            <div className="mb-3 px-3 py-2 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2 text-[#4B5563] min-w-0">
                <Mail className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                <span className="font-medium truncate">{pendingEmail || email}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {/* Full Name Field (The ONLY input asked) */}
              <div>
                <label className="block text-[11.5px] font-semibold text-[#181818] mb-1">
                  Full Name
                </label>
                <div className="flex h-[42px] rounded-xl bg-white border border-[#E5E7EB] shadow-xs focus-within:ring-2 focus-within:ring-[#B51F32]/20 focus-within:border-[#B51F32] transition-all overflow-hidden">
                  <div className="w-[42px] h-full flex items-center justify-center border-r border-[#E5E7EB] bg-[#FAFAFA] shrink-0 text-[#9CA3AF]">
                    <User className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    ref={profileNameInputRef}
                    type="text"
                    value={profileName}
                    onChange={(e) => {
                      setProfileName(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your full name"
                    disabled={status === 'verifying' || status === 'confirmed'}
                    className="flex-1 min-w-0 h-full px-3 text-[13.5px] font-medium text-[#181818] bg-transparent focus:outline-none placeholder-[#9CA3AF]"
                    autoComplete="name"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-1.5 pl-0.5">
                  This name will appear on your summit delegate badge and networking pass.
                </p>
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              )}

              {/* Confirmed Message */}
              {status === 'confirmed' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-[12px] text-emerald-900">Profile Created ✓</p>
                    <p className="text-[11px] text-emerald-700">Entering summit...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-4 pt-1">
              <button
                type="submit"
                disabled={status === 'verifying' || status === 'confirmed' || !profileName.trim()}
                className="w-full h-12 bg-[#B51F32] hover:bg-[#9C1A2B] active:scale-[0.98] text-white font-semibold text-[14px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'verifying' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activating Delegate Pass...</span>
                  </>
                ) : status === 'confirmed' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Welcome to MPSS26 ✓</span>
                  </>
                ) : (
                  <>
                    <span>Complete Profile & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Footer Trust Badges */}
              <div className="mt-4 pb-1 flex items-center justify-center gap-3 text-[11px] font-medium text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#6B7280]" />
                  <span>Instant badge generation</span>
                </div>
                <span className="text-[#D1D5DB]">|</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#6B7280]" />
                  <span>Official MPSS26 Delegate</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
