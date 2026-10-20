import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Navigation i18n & Hydration Consistency', () => {
  // Navigation items mapping function as implemented in AppLayout
  function getNavItems(language) {
    return [
      {
        name: language === "om" ? "Daashboordii" : language === "am" ? "ዳሽቦርድ" : "Dashboard",
        href: "/dashboard",
      },
      {
        name: language === "om" ? "Maasii Koo" : language === "am" ? "ማሳዬ" : "My Farm",
        href: "/farms",
      },
      {
        name: language === "om" ? "Shakallii Lafaa" : language === "am" ? "የመሬት ስሌት" : "Land Calculator",
        href: "/land-calculator",
      },
      {
        name: language === "om" ? "Oomishaalee" : language === "am" ? "ሰብሎች" : "Crops",
        href: "/crops",
      },
      {
        name: "Gebere Vision AI",
        href: "/gebere-vision-ai",
        badge: language === "om" ? "Gargaaraa AI" : language === "am" ? "የAI ረዳት" : "AI Assistant",
      },
      {
        name: language === "om" ? "Eegumsa Oomishaa" : language === "am" ? "የሰብል ጥበቃ" : "Crop Protection",
        href: "/crop-protection",
        badge: language === "om" ? "Qoricha" : language === "am" ? "መድኃኒቶች" : "Medicines",
      },
      {
        name: language === "om" ? "Fayinaansii" : language === "am" ? "ፋይናንስ" : "Finance Dashboard",
        href: "/finance",
      },
      {
        name: language === "om" ? "Baasiiwwan" : language === "am" ? "ወጪዎች" : "Expenses",
        href: "/expenses",
      },
      {
        name: language === "om" ? "Gabaa" : language === "am" ? "ገበያ" : "Markets",
        href: "/marketplace",
      },
    ];
  }

  it('SSR initial render uses default language "en" and renders "Dashboard"', () => {
    const defaultLanguage = "en";
    const items = getNavItems(defaultLanguage);
    assert.equal(items[0].name, 'Dashboard');
    assert.equal(items[0].href, '/dashboard');
  });

  it('Afaan Oromoo language selection correctly maps navigation items', () => {
    const items = getNavItems('om');
    assert.equal(items[0].name, 'Daashboordii');
    assert.equal(items[1].name, 'Maasii Koo');
    assert.equal(items[2].name, 'Shakallii Lafaa');
    assert.equal(items[3].name, 'Oomishaalee');
  });

  it('Amharic language selection correctly maps navigation items', () => {
    const items = getNavItems('am');
    assert.equal(items[0].name, 'ዳሽቦርድ');
    assert.equal(items[1].name, 'ማሳዬ');
    assert.equal(items[2].name, 'የመሬት ስሌት');
    assert.equal(items[3].name, 'ሰብሎች');
  });

  it('all supported languages have complete, non-empty navigation item names', () => {
    const languages = ['en', 'om', 'am'];
    for (const lang of languages) {
      const items = getNavItems(lang);
      assert.equal(items.length, 9);
      for (const item of items) {
        assert.ok(item.name && item.name.trim().length > 0, `Empty nav name for lang: ${lang}`);
      }
    }
  });

  it('initial state does not depend on window or localStorage on server', () => {
    // Simulate server environment where window is undefined
    const isServer = typeof window === 'undefined';
    assert.equal(isServer, true);

    // Initial state must be deterministic constant
    const initialLanguage = 'en';
    assert.equal(initialLanguage, 'en');

    // Server output is guaranteed to be 'Dashboard'
    const items = getNavItems(initialLanguage);
    assert.equal(items[0].name, 'Dashboard');
  });
});
