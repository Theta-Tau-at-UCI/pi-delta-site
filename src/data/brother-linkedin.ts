// Hand-verified LinkedIn URLs for brothers whose profile wasn't in the chapter's
// own data, found via web research and confirmed against UC Irvine + major /
// Theta Tau evidence (only confident matches included, uncertain ones omitted
// rather than risk linking the wrong person). Keyed by name slug
// ("Wilson Nguyen" -> "wilsonnguyen"). This file is hand-maintained and is NOT
// overwritten by scripts/import-assets.mjs; enrichBrother() in chapter.ts uses
// it as a fallback after the chapter's own linkedin_url data.
export const researchedLinkedIn: Record<string, string> = {
  frederickhalo: 'https://www.linkedin.com/in/frederickhalo/',
  andreatran: 'https://www.linkedin.com/in/andrealtran/',
  eliseji: 'https://www.linkedin.com/in/elise-ji/',
  custoyang: 'https://www.linkedin.com/in/custoyang/',
  davidculciar: 'https://www.linkedin.com/in/david-culciar/',
  ethanchoi: 'https://www.linkedin.com/in/ethanjchoi/',
  hannahkim: 'https://www.linkedin.com/in/hannah-l-kim/',
  katiequach: 'https://www.linkedin.com/in/katie-quach35/',
  annacoppola: 'https://www.linkedin.com/in/anna-coppola-256a98305/',
  chloechow: 'https://www.linkedin.com/in/chloechow28/',
  ivylee: 'https://www.linkedin.com/in/ivy-lee-3719422a0',
  jarrettlim: 'https://www.linkedin.com/in/jarrett-lim/',
  piyawanchaiprasit: 'https://www.linkedin.com/in/piyawan-chaiprasit',
  trumanlindenthaler: 'https://www.linkedin.com/in/trumanlindenthaler',
  harmeetsingh: 'https://www.linkedin.com/in/harmeet-singh-uppal/',
  victoriasun: 'https://www.linkedin.com/in/victoria-sun-57362a31a/',
};
