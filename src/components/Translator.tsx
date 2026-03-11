'use client';

import { useEffect, useState } from 'react';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export default function Translator() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check if script is already loaded
        if (window.google && window.google.translate) {
            setIsLoaded(true);
            return;
        }

        // Set callback
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
            }, 'google_translate_element');

            // Auto-detect browser language after a short delay
            setTimeout(() => {
                const userLang = navigator.language.split('-')[0];
                if (userLang !== 'en') {
                    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                    if (select && !select.value) {
                        select.value = userLang;
                        select.dispatchEvent(new Event('change'));
                    }
                }
            }, 1500);

            setIsLoaded(true);
        };

        // Load Google Translate script
        const script = document.createElement('script');
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="translator-container">
            <div id="google_translate_element"></div>
            <style jsx global>{`
        /* Hide Google Translate Branding & Ugly Bars */
        .goog-te-banner-frame.skiptranslate,
        .goog-te-gadget-icon,
        .goog-logo-link,
        .goog-te-gadget span {
          display: none !important;
        }
        .goog-te-gadget {
          color: transparent !important;
          font-size: 0 !important;
        }
        body {
          top: 0 !important;
        }
        /* Style the actual dropdown if shown */
        .goog-te-combo {
          background-color: var(--background);
          color: var(--foreground);
          border: 1px solid var(--border);
          padding: 0.5rem;
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 0.875rem;
          outline: none;
          cursor: pointer;
        }
        .goog-te-combo:hover {
          border-color: var(--secondary);
        }
      `}</style>
        </div>
    );
}
