const app = document.getElementById("app");

const SECTION_LABEL = {
  hero: "Hero",
  description: "Descricao/Introducao",
  publications: "Publicacoes",
  products: "Produtos",
  services: "Servicos",
  footer: "Rodape"
};

const APP_SCHEMA_VERSION = 1;
const STORAGE_KEY = "page_builder_state_v1";
const LEVEL_IDS = [1, 2, 3, 4, 5];

const LEVEL_CONFIG = {
  1: {
    name: "Nivel 1",
    summary: "MVP local",
    description: "Fluxo local com preview em tempo real e rascunho salvo no navegador.",
    limits: { maxSections: 8, maxCollectionItems: 10 }
  },
  2: {
    name: "Nivel 2",
    summary: "Cloud starter",
    description: "Base para autenticacao real, banco e storage em nuvem.",
    limits: { maxSections: 12, maxCollectionItems: 20 }
  },
  3: {
    name: "Nivel 3",
    summary: "Escala comercial",
    description: "Templates, dominio customizado e analytics de conversao.",
    limits: { maxSections: 16, maxCollectionItems: 30 }
  },
  4: {
    name: "Nivel 4",
    summary: "SaaS completo",
    description: "Multi-tenant, permissao por perfil e controle de assinatura.",
    limits: { maxSections: 24, maxCollectionItems: 50 }
  },
  5: {
    name: "Nivel 5",
    summary: "Ecossistema",
    description: "Marketplace de templates/plugins e automacoes de marketing.",
    limits: { maxSections: 32, maxCollectionItems: 80 }
  }
};

const FEATURE_CATALOG = [
  { id: "localAuth", label: "Login local", unlockAt: 1 },
  { id: "realtimePreview", label: "Preview em tempo real", unlockAt: 1 },
  { id: "localDraft", label: "Persistencia local", unlockAt: 1 },
  { id: "cloudAuth", label: "Autenticacao em nuvem", unlockAt: 2 },
  { id: "cloudSync", label: "Persistencia em banco", unlockAt: 2 },
  { id: "imageStorage", label: "Storage de imagens", unlockAt: 2 },
  { id: "templates", label: "Biblioteca de templates", unlockAt: 3 },
  { id: "analytics", label: "Analytics e funil", unlockAt: 3 },
  { id: "customDomain", label: "Dominio customizado", unlockAt: 3 },
  { id: "multiTenant", label: "Multi-tenant", unlockAt: 4 },
  { id: "billing", label: "Billing e planos", unlockAt: 4 },
  { id: "roleAccess", label: "Permissao por perfil", unlockAt: 4 },
  { id: "marketplace", label: "Marketplace", unlockAt: 5 },
  { id: "automations", label: "Automacoes", unlockAt: 5 }
];

const VIEWPORT_CONFIG = {
  desktop: { label: "Desktop", maxWidth: 980 },
  tablet: { label: "Tablet", maxWidth: 820 },
  mobile: { label: "Mobile", maxWidth: 430 }
};

const FOOTER_SECTION_ID = "footer_section";
const LEVEL_SECTION_ID = "level_architecture_section";
const SECTION_TYPE_OPTIONS = [
  { id: "hero", label: "Hero" },
  { id: "description", label: "Descricao/Introducao" },
  { id: "publications", label: "Publicacoes" },
  { id: "products", label: "Produtos" },
  { id: "services", label: "Servicos" },
  { id: "footer", label: "Rodape" }
];

const FONT_OPTIONS = {
  sora: { label: "Sora", family: "'Sora', sans-serif" },
  manrope: { label: "Manrope", family: "'Manrope', sans-serif" },
  montserrat: { label: "Montserrat", family: "'Montserrat', sans-serif" },
  nunito: { label: "Nunito", family: "'Nunito', sans-serif" },
  playfair: { label: "Playfair Display", family: "'Playfair Display', serif" },
  merriweather: { label: "Merriweather", family: "'Merriweather', serif" }
};

const CSS_LENGTH_UNITS = [
  "px",
  "%",
  "em",
  "rem",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "svw",
  "svh",
  "lvw",
  "lvh",
  "dvw",
  "dvh",
  "svmin",
  "svmax",
  "lvmin",
  "lvmax",
  "dvmin",
  "dvmax",
  "vi",
  "vb",
  "ch",
  "ex",
  "cap",
  "ic",
  "lh",
  "rlh",
  "cm",
  "mm",
  "q",
  "in",
  "pt",
  "pc"
];

const ALIGN_OPTIONS = [
  ["left", "Esquerda"],
  ["center", "Centro"],
  ["right", "Direita"]
];

const PREVIEW_INLINE_VIEWPORT_UNITS = new Set(["vw", "svw", "lvw", "dvw", "vi"]);

const numberKeys = new Set([
  "bgGradientAngle",
  "heroWidth",
  "heroHeight",
  "profileSize",
  "profileBorderWidth",
  "titleSize",
  "titleWeight",
  "subtitleSize",
  "subtitleWeight",
  "profileOffsetX",
  "profileOffsetY",
  "titleOffsetX",
  "titleOffsetY",
  "subtitleOffsetX",
  "subtitleOffsetY",
  "footerTitleOffsetX",
  "footerTitleOffsetY",
  "footerContentOffsetX",
  "footerContentOffsetY",
  "durationDays",
  "weeklyFrequency"
]);

const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
const esc = (v) =>
  String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const brl = (value) => {
  const normalized = String(value || "0").replace(/[R$\s]/g, "").replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n)) return `R$ ${value}`;
  return `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const mkPublication = () => ({
  id: uid("post"),
  image: "",
  title: "Titulo da publicacao",
  text: "Descricao curta da publicacao."
});

const mkProduct = () => ({
  id: uid("prod"),
  title: "Produto",
  price: "97,00",
  payment: "Pix ou cartao",
  cta: "Comprar"
});

const mkPlan = () => ({
  id: uid("plan"),
  title: "Plano Essencial",
  mode: "online",
  description: "Atendimento com foco em objetivo especifico.",
  durationDays: 30,
  weeklyFrequency: 1,
  price: "299,00"
});

const sectionFactory = {
  hero: () => ({
    bgMode: "color",
    bgColor: "#1d4ed8",
    bgGradientColorA: "#1e3a8a",
    bgGradientColorB: "#0f172a",
    bgGradientAngle: 135,
    heroWidth: 100,
    heroWidthUnit: "%",
    heroHeight: 0,
    heroHeightUnit: "px",
    bgImage: "",
    profileImage: "",
    showProfile: true,
    profileSize: 120,
    profileSizeUnit: "px",
    profileRadius: 999,
    profileRadiusUnit: "px",
    profileBorderWidth: 3,
    profileBorderWidthUnit: "px",
    profileOffsetX: 0,
    profileOffsetY: 0,
    contentAlign: "center",
    showTitle: true,
    title: "Seu Nome Profissional",
    titleAlign: "center",
    titleOffsetX: 0,
    titleOffsetY: 0,
    showSubtitle: true,
    subtitle: "Especialista em resultado rapido com pagina personalizada",
    subtitleAlign: "center",
    subtitleOffsetX: 0,
    subtitleOffsetY: 0,
    titleColor: "#ffffff",
    titleSize: 42,
    titleSizeUnit: "px",
    titleWeight: 700,
    subtitleColor: "#dbeafe",
    subtitleSize: 19,
    subtitleSizeUnit: "px",
    subtitleWeight: 500
  }),
  description: () => ({
    title: "Descricao",
    text: "Escreva aqui sua apresentacao, nicho de atuacao, experiencia e proposta de valor."
  }),
  publications: () => ({
    title: "Publicacoes",
    subtitle: "Mostre conteudos recentes, antes/depois, depoimentos e insights.",
    items: [mkPublication()]
  }),
  products: () => ({
    title: "Produtos",
    description: "Cadastre seus produtos e converta visitantes em clientes.",
    items: [mkProduct()]
  }),
  services: () => ({
    title: "Servicos",
    description: "Ofereca planos personalizados de atendimento.",
    buttonLabel: "Ver planos",
    plans: [mkPlan()]
  })
};

const mkSection = (type) => ({ id: uid("sec"), type, data: sectionFactory[type]() });

const coerceString = (value, fallback = "") => (typeof value === "string" ? value : fallback);
const coerceBoolean = (value, fallback = false) => (typeof value === "boolean" ? value : fallback);
const coerceNumber = (value, fallback, min, max) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  if (typeof min === "number" && n < min) return min;
  if (typeof max === "number" && n > max) return max;
  return n;
};
const ensureId = (value, prefix) => {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized : uid(prefix);
};
const coerceLevel = (value) => {
  const n = Number(value);
  return LEVEL_IDS.includes(n) ? n : 1;
};
const coerceViewport = (value) => (VIEWPORT_CONFIG[value] ? value : "desktop");
const coerceFont = (value, fallback) => (FONT_OPTIONS[value] ? value : fallback);
const coerceCssLengthUnit = (value, fallback = "px") => {
  const unit = String(value ?? "")
    .trim()
    .toLowerCase();
  return CSS_LENGTH_UNITS.includes(unit) ? unit : fallback;
};
const cssLength = (value, unit = "px", fallbackValue = 0, fallbackUnit = "px") => {
  const n = Number(value);
  const safeValue = Number.isFinite(n) ? n : fallbackValue;
  const safeUnit = coerceCssLengthUnit(unit, fallbackUnit);
  return `${safeValue}${safeUnit}`;
};
const previewInlineLength = (value, unit = "px", fallbackValue = 0, fallbackUnit = "px") => {
  const n = Number(value);
  const safeValue = Number.isFinite(n) ? n : fallbackValue;
  const safeUnit = coerceCssLengthUnit(unit, fallbackUnit);
  if (PREVIEW_INLINE_VIEWPORT_UNITS.has(safeUnit)) return `${safeValue}%`;
  return `${safeValue}${safeUnit}`;
};
const getLevelConfig = (level) => LEVEL_CONFIG[coerceLevel(level)] || LEVEL_CONFIG[1];
const fontFamilyByKey = (value, fallback = "manrope") => FONT_OPTIONS[coerceFont(value, fallback)].family;
const isFeatureEnabledAtLevel = (featureId, level) => {
  const feature = FEATURE_CATALOG.find((item) => item.id === featureId);
  return feature ? coerceLevel(level) >= feature.unlockAt : false;
};
const isFeatureEnabled = (featureId) => isFeatureEnabledAtLevel(featureId, state.product.level);

function createDefaultPage() {
  return {
    id: uid("page"),
    title: "Minha Pagina Profissional",
    subtitle: "Edite as secoes no painel e veja o resultado em tempo real.",
    sections: [],
    footer: {
      enabled: false,
      showFooter: true,
      contentAlign: "left",
      bgColor: "#10203a",
      textColor: "#f4f7ff",
      showTitle: true,
      title: "Contato",
      footerTitleOffsetX: 0,
      footerTitleOffsetY: 0,
      showContent: true,
      content: "WhatsApp: (00) 00000-0000\nInstagram: @seu_perfil\nEmail: contato@seusite.com",
      footerContentOffsetX: 0,
      footerContentOffsetY: 0
    },
    settings: {
      theme: "oceanic",
      locale: "pt-BR",
      headingFont: "sora",
      bodyFont: "manrope"
    },
    meta: {
      updatedAt: new Date().toISOString()
    }
  };
}

function createDefaultState() {
  return {
    schemaVersion: APP_SCHEMA_VERSION,
    product: { level: 1 },
    auth: { logged: false, userEmail: "" },
    page: createDefaultPage(),
    ui: {
      modalSectionId: null,
      toast: "",
      previewViewport: "desktop",
      previewAccountOpen: false,
      collapsedSubsections: {},
      collapsedSections: {
        [LEVEL_SECTION_ID]: true
      },
      publishedView: false
    }
  };
}

function sanitizePublication(item) {
  const defaults = mkPublication();
  return {
    id: ensureId(item?.id, "post"),
    image: coerceString(item?.image, ""),
    title: coerceString(item?.title, defaults.title),
    text: coerceString(item?.text, defaults.text)
  };
}

function sanitizeProduct(item) {
  const defaults = mkProduct();
  return {
    id: ensureId(item?.id, "prod"),
    title: coerceString(item?.title, defaults.title),
    price: coerceString(item?.price, defaults.price),
    payment: coerceString(item?.payment, defaults.payment),
    cta: coerceString(item?.cta, defaults.cta)
  };
}

function sanitizePlan(plan) {
  const defaults = mkPlan();
  const mode = coerceString(plan?.mode, defaults.mode);
  return {
    id: ensureId(plan?.id, "plan"),
    title: coerceString(plan?.title, defaults.title),
    mode: ["online", "presencial", "hibrida"].includes(mode) ? mode : defaults.mode,
    description: coerceString(plan?.description, defaults.description),
    durationDays: coerceNumber(plan?.durationDays, defaults.durationDays, 0, 365),
    weeklyFrequency: coerceNumber(plan?.weeklyFrequency, defaults.weeklyFrequency, 0, 7),
    price: coerceString(plan?.price, defaults.price)
  };
}

function sanitizeSection(section) {
  const type = coerceString(section?.type, "");
  if (!sectionFactory[type]) return null;
  const inputData = section && typeof section.data === "object" ? section.data : {};

  if (type === "hero") {
    const defaults = sectionFactory.hero();
    const contentAlign = coerceString(inputData.contentAlign, defaults.contentAlign);
    const titleAlign = coerceString(inputData.titleAlign, defaults.titleAlign);
    const subtitleAlign = coerceString(inputData.subtitleAlign, defaults.subtitleAlign);
    const profileSizeUnit = coerceCssLengthUnit(inputData.profileSizeUnit, defaults.profileSizeUnit);
    const profileRadiusUnit = coerceCssLengthUnit(inputData.profileRadiusUnit, defaults.profileRadiusUnit);
    const profileBorderWidthUnit = coerceCssLengthUnit(inputData.profileBorderWidthUnit, defaults.profileBorderWidthUnit);
    const heroWidthUnit = coerceCssLengthUnit(inputData.heroWidthUnit, defaults.heroWidthUnit);
    const heroHeightUnit = coerceCssLengthUnit(inputData.heroHeightUnit, defaults.heroHeightUnit);
    const titleSizeUnit = coerceCssLengthUnit(inputData.titleSizeUnit, defaults.titleSizeUnit);
    const subtitleSizeUnit = coerceCssLengthUnit(inputData.subtitleSizeUnit, defaults.subtitleSizeUnit);
    const bgMode = coerceString(inputData.bgMode, defaults.bgMode);
    return {
      id: ensureId(section?.id, "sec"),
      type,
      data: {
        bgMode: ["none", "color", "gradient", "image"].includes(bgMode) ? bgMode : "color",
        bgColor: coerceString(inputData.bgColor, defaults.bgColor),
        bgGradientColorA: coerceString(inputData.bgGradientColorA, defaults.bgGradientColorA),
        bgGradientColorB: coerceString(inputData.bgGradientColorB, defaults.bgGradientColorB),
        bgGradientAngle: coerceNumber(inputData.bgGradientAngle, defaults.bgGradientAngle, 0, 360),
        heroWidth: coerceNumber(inputData.heroWidth, defaults.heroWidth, 1, 5000),
        heroWidthUnit,
        heroHeight: coerceNumber(inputData.heroHeight, defaults.heroHeight, 0, 5000),
        heroHeightUnit,
        bgImage: coerceString(inputData.bgImage, defaults.bgImage),
        profileImage: coerceString(inputData.profileImage, defaults.profileImage),
        showProfile: coerceBoolean(inputData.showProfile, defaults.showProfile),
        profileSize: coerceNumber(inputData.profileSize, defaults.profileSize, 1, 5000),
        profileSizeUnit,
        profileRadius: coerceNumber(inputData.profileRadius, defaults.profileRadius, 0, 9999),
        profileRadiusUnit,
        profileBorderWidth: coerceNumber(inputData.profileBorderWidth, defaults.profileBorderWidth, 0, 999),
        profileBorderWidthUnit,
        profileOffsetX: coerceNumber(inputData.profileOffsetX, defaults.profileOffsetX, -600, 600),
        profileOffsetY: coerceNumber(inputData.profileOffsetY, defaults.profileOffsetY, -240, 240),
        contentAlign: ["left", "center", "right"].includes(contentAlign) ? contentAlign : defaults.contentAlign,
        showTitle: coerceBoolean(inputData.showTitle, defaults.showTitle),
        title: coerceString(inputData.title, defaults.title),
        titleAlign: ["left", "center", "right"].includes(titleAlign) ? titleAlign : defaults.titleAlign,
        titleOffsetX: coerceNumber(inputData.titleOffsetX, defaults.titleOffsetX, -600, 600),
        titleOffsetY: coerceNumber(inputData.titleOffsetY, defaults.titleOffsetY, -240, 240),
        showSubtitle: coerceBoolean(inputData.showSubtitle, defaults.showSubtitle),
        subtitle: coerceString(inputData.subtitle, defaults.subtitle),
        subtitleAlign: ["left", "center", "right"].includes(subtitleAlign) ? subtitleAlign : defaults.subtitleAlign,
        subtitleOffsetX: coerceNumber(inputData.subtitleOffsetX, defaults.subtitleOffsetX, -600, 600),
        subtitleOffsetY: coerceNumber(inputData.subtitleOffsetY, defaults.subtitleOffsetY, -240, 240),
        titleColor: coerceString(inputData.titleColor, defaults.titleColor),
        titleSize: coerceNumber(inputData.titleSize, defaults.titleSize, 1, 1000),
        titleSizeUnit,
        titleWeight: coerceNumber(inputData.titleWeight, defaults.titleWeight, 300, 900),
        subtitleColor: coerceString(inputData.subtitleColor, defaults.subtitleColor),
        subtitleSize: coerceNumber(inputData.subtitleSize, defaults.subtitleSize, 1, 1000),
        subtitleSizeUnit,
        subtitleWeight: coerceNumber(inputData.subtitleWeight, defaults.subtitleWeight, 300, 900)
      }
    };
  }

  if (type === "description") {
    const defaults = sectionFactory.description();
    return {
      id: ensureId(section?.id, "sec"),
      type,
      data: {
        title: coerceString(inputData.title, defaults.title),
        text: coerceString(inputData.text, defaults.text)
      }
    };
  }

  if (type === "publications") {
    const defaults = sectionFactory.publications();
    const items = Array.isArray(inputData.items) ? inputData.items.map(sanitizePublication).filter(Boolean) : [];
    return {
      id: ensureId(section?.id, "sec"),
      type,
      data: {
        title: coerceString(inputData.title, defaults.title),
        subtitle: coerceString(inputData.subtitle, defaults.subtitle),
        items: items.length ? items : [mkPublication()]
      }
    };
  }

  if (type === "products") {
    const defaults = sectionFactory.products();
    const items = Array.isArray(inputData.items) ? inputData.items.map(sanitizeProduct).filter(Boolean) : [];
    return {
      id: ensureId(section?.id, "sec"),
      type,
      data: {
        title: coerceString(inputData.title, defaults.title),
        description: coerceString(inputData.description, defaults.description),
        items: items.length ? items : [mkProduct()]
      }
    };
  }

  const defaults = sectionFactory.services();
  const plans = Array.isArray(inputData.plans) ? inputData.plans.map(sanitizePlan).filter(Boolean) : [];
  return {
    id: ensureId(section?.id, "sec"),
    type,
    data: {
      title: coerceString(inputData.title, defaults.title),
      description: coerceString(inputData.description, defaults.description),
      buttonLabel: coerceString(inputData.buttonLabel, defaults.buttonLabel),
      plans: plans.length ? plans : [mkPlan()]
    }
  };
}

function sanitizePage(page) {
  const defaults = createDefaultPage();
  const hasSectionsArray = Array.isArray(page?.sections);
  const sections = hasSectionsArray ? page.sections.map(sanitizeSection).filter(Boolean) : [];
  const hasFooter = Boolean(page?.footer && typeof page.footer === "object");
  const footerAlign = coerceString(page?.footer?.contentAlign, defaults.footer.contentAlign);
  const inferredFooterEnabled = hasFooter
    ? coerceBoolean(page?.footer?.enabled, coerceBoolean(page?.footer?.showFooter, true))
    : defaults.footer.enabled;
  return {
    id: ensureId(page?.id, "page"),
    title: coerceString(page?.title, defaults.title),
    subtitle: coerceString(page?.subtitle, defaults.subtitle),
    sections: hasSectionsArray ? sections : defaults.sections,
    footer: {
      enabled: inferredFooterEnabled,
      showFooter: coerceBoolean(page?.footer?.showFooter, defaults.footer.showFooter),
      contentAlign: ["left", "center", "right"].includes(footerAlign) ? footerAlign : defaults.footer.contentAlign,
      bgColor: coerceString(page?.footer?.bgColor, defaults.footer.bgColor),
      textColor: coerceString(page?.footer?.textColor, defaults.footer.textColor),
      showTitle: coerceBoolean(page?.footer?.showTitle, defaults.footer.showTitle),
      title: coerceString(page?.footer?.title, defaults.footer.title),
      footerTitleOffsetX: coerceNumber(page?.footer?.footerTitleOffsetX, defaults.footer.footerTitleOffsetX, -600, 600),
      footerTitleOffsetY: coerceNumber(page?.footer?.footerTitleOffsetY, defaults.footer.footerTitleOffsetY, -240, 240),
      showContent: coerceBoolean(page?.footer?.showContent, defaults.footer.showContent),
      content: coerceString(page?.footer?.content, defaults.footer.content),
      footerContentOffsetX: coerceNumber(
        page?.footer?.footerContentOffsetX,
        defaults.footer.footerContentOffsetX,
        -600,
        600
      ),
      footerContentOffsetY: coerceNumber(
        page?.footer?.footerContentOffsetY,
        defaults.footer.footerContentOffsetY,
        -240,
        240
      )
    },
    settings: {
      theme: coerceString(page?.settings?.theme, defaults.settings.theme),
      locale: coerceString(page?.settings?.locale, defaults.settings.locale),
      headingFont: coerceFont(page?.settings?.headingFont, defaults.settings.headingFont),
      bodyFont: coerceFont(page?.settings?.bodyFont, defaults.settings.bodyFont)
    },
    meta: {
      updatedAt: coerceString(page?.meta?.updatedAt, defaults.meta.updatedAt)
    }
  };
}

function sanitizeState(rawState) {
  const email = coerceString(rawState?.auth?.userEmail, "").trim();
  return {
    schemaVersion: APP_SCHEMA_VERSION,
    product: { level: coerceLevel(rawState?.product?.level) },
    auth: { logged: Boolean(rawState?.auth?.logged && email), userEmail: email },
    page: sanitizePage(rawState?.page),
    ui: {
      modalSectionId: null,
      toast: "",
      previewViewport: coerceViewport(rawState?.ui?.previewViewport),
      previewAccountOpen: false,
      publishedView: false,
      collapsedSubsections:
        rawState?.ui?.collapsedSubsections && typeof rawState.ui.collapsedSubsections === "object"
          ? rawState.ui.collapsedSubsections
          : {},
      collapsedSections:
        rawState?.ui?.collapsedSections && typeof rawState.ui.collapsedSections === "object"
          ? rawState.ui.collapsedSections
          : { [LEVEL_SECTION_ID]: true }
    }
  };
}

function canUseLocalStorage() {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function loadState() {
  const defaults = createDefaultState();
  if (!canUseLocalStorage()) return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return sanitizeState(parsed);
  } catch {
    return defaults;
  }
}

function persistedSnapshot() {
  return {
    schemaVersion: APP_SCHEMA_VERSION,
    product: { level: coerceLevel(state.product.level) },
    auth: { logged: state.auth.logged, userEmail: state.auth.userEmail },
    page: state.page,
    ui: {
      previewViewport: coerceViewport(state.ui.previewViewport),
      collapsedSubsections: state.ui.collapsedSubsections,
      collapsedSections: state.ui.collapsedSections
    }
  };
}

function persistState() {
  if (!canUseLocalStorage()) return;
  try {
    state.page.meta.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedSnapshot()));
  } catch {
    // Persistence is best-effort in Nivel 1.
  }
}

let persistTimer = null;
function schedulePersist() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persistTimer = null;
    persistState();
  }, 180);
}

const state = loadState();

const cssEscape = (value) =>
  typeof window !== "undefined" && window.CSS && typeof window.CSS.escape === "function"
    ? window.CSS.escape(String(value))
    : String(value).replace(/"/g, '\\"');

function captureFocusState() {
  const el = document.activeElement;
  if (!el || !app.contains(el)) return null;
  const canRestore =
    el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
  if (!canRestore) return null;

  let selector = "";
  if (el.id) {
    selector = `#${cssEscape(el.id)}`;
  } else {
    const attrs = ["s", "c", "i", "k", "a", "el", "target", "t"]
      .filter((key) => el.dataset[key] != null)
      .map((key) => `[data-${key}="${cssEscape(el.dataset[key])}"]`)
      .join("");
    if (!attrs) return null;
    selector = `${el.tagName.toLowerCase()}${attrs}`;
  }

  const supportsRange =
    (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
    typeof el.selectionStart === "number" &&
    typeof el.selectionEnd === "number";

  return {
    selector,
    selectionStart: supportsRange ? el.selectionStart : null,
    selectionEnd: supportsRange ? el.selectionEnd : null
  };
}

function restoreFocusState(focusState) {
  if (!focusState?.selector) return;
  const nextEl = app.querySelector(focusState.selector);
  if (!nextEl) return;
  if (
    !(nextEl instanceof HTMLInputElement) &&
    !(nextEl instanceof HTMLTextAreaElement) &&
    !(nextEl instanceof HTMLSelectElement)
  ) {
    return;
  }
  nextEl.focus({ preventScroll: true });

  if (
    (nextEl instanceof HTMLInputElement || nextEl instanceof HTMLTextAreaElement) &&
    typeof focusState.selectionStart === "number" &&
    typeof focusState.selectionEnd === "number"
  ) {
    try {
      nextEl.setSelectionRange(focusState.selectionStart, focusState.selectionEnd);
    } catch {
      // Ignore unsupported input types (e.g. color/range).
    }
  }
}

let toastTimer = null;

function pushToast(msg) {
  state.ui.toast = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    state.ui.toast = "";
    toastTimer = null;
    render();
  }, 1700);
}

const getSection = (id) => state.page.sections.find((s) => s.id === id);

function moveInList(list, id, direction) {
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) return list;
  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(i, 1);
  copy.splice(j, 0, item);
  return copy;
}

function currentLevelConfig() {
  return getLevelConfig(state.product.level);
}

function hasSectionType(type) {
  if (type === "footer") return Boolean(state.page.footer?.enabled);
  return state.page.sections.some((section) => section.type === type);
}

function availableSectionTypes() {
  return SECTION_TYPE_OPTIONS.filter((option) => !hasSectionType(option.id));
}

function currentSectionCount() {
  return state.page.sections.length + (state.page.footer?.enabled ? 1 : 0);
}

function canAddSection() {
  return currentSectionCount() < currentLevelConfig().limits.maxSections;
}

function canAddCollectionItem(section, collection) {
  const limit = currentLevelConfig().limits.maxCollectionItems;
  const current = Array.isArray(section?.data?.[collection]) ? section.data[collection].length : 0;
  return current < limit;
}

function isSectionCollapsed(sectionId) {
  return Boolean(state.ui.collapsedSections?.[sectionId]);
}

function subsectionCollapseId(sectionId, subsectionKey) {
  return `${sectionId}:${subsectionKey}`;
}

function isSubsectionCollapsed(sectionId, subsectionKey) {
  return Boolean(state.ui.collapsedSubsections?.[subsectionCollapseId(sectionId, subsectionKey)]);
}

function setSubsectionCollapsed(sectionId, subsectionKey, collapsed) {
  if (!state.ui.collapsedSubsections || typeof state.ui.collapsedSubsections !== "object") {
    state.ui.collapsedSubsections = {};
  }
  const key = subsectionCollapseId(sectionId, subsectionKey);
  if (collapsed) {
    state.ui.collapsedSubsections[key] = true;
  } else {
    delete state.ui.collapsedSubsections[key];
  }
}

function clearSubsectionCollapseState(sectionId) {
  if (!state.ui.collapsedSubsections || typeof state.ui.collapsedSubsections !== "object") return;
  const prefix = `${sectionId}:`;
  Object.keys(state.ui.collapsedSubsections).forEach((key) => {
    if (key.startsWith(prefix)) delete state.ui.collapsedSubsections[key];
  });
}

function getCollapsibleSectionIds() {
  const sectionIds = state.page.sections.map((section) => section.id);
  if (state.page.footer?.enabled) sectionIds.push(FOOTER_SECTION_ID);
  sectionIds.push(LEVEL_SECTION_ID);
  return sectionIds;
}

function normalizeCollapsedSections() {
  const collapsed = state.ui.collapsedSections && typeof state.ui.collapsedSections === "object" ? state.ui.collapsedSections : {};
  const ids = getCollapsibleSectionIds();
  const nextCollapsed = {};
  let hasExpandedSection = false;

  ids.forEach((id) => {
    const collapsedFlag = Boolean(collapsed[id]);
    if (collapsedFlag) {
      nextCollapsed[id] = true;
      return;
    }
    if (hasExpandedSection) {
      nextCollapsed[id] = true;
      return;
    }
    hasExpandedSection = true;
  });

  state.ui.collapsedSections = nextCollapsed;
}

function openSectionExclusive(sectionId) {
  const ids = getCollapsibleSectionIds();
  const nextCollapsed = {};
  ids.forEach((id) => {
    if (id !== sectionId) nextCollapsed[id] = true;
  });
  state.ui.collapsedSections = nextCollapsed;
}

function sectionSummary(section) {
  if (!section || !section.data) return "Sem conteudo.";
  if (section.type === "hero") return section.data.title ? `Hero: ${section.data.title}` : "Hero sem titulo.";
  if (section.type === "description") return section.data.text || "Descricao sem texto.";
  if (section.type === "publications") return `${(section.data.items || []).length} publicacao(oes).`;
  if (section.type === "products") return `${(section.data.items || []).length} produto(s).`;
  return `${(section.data.plans || []).length} plano(s).`;
}

function footerSummary() {
  const footer = state.page.footer || {};
  if (footer.showFooter === false) return "Rodape oculto.";
  const lines = String(footer.content || "")
    .split("\n")
    .filter((line) => line.trim()).length;
  return `${footer.title ? `Titulo: ${footer.title}. ` : ""}${lines} linha(s) de conteudo.`;
}

function levelSummary(config) {
  return `Nivel ativo: ${config.name}. Limites: ate ${config.limits.maxSections} secoes e ${config.limits.maxCollectionItems} cards por lista.`;
}

function chevronSvg(direction = "down") {
  const d = direction === "up" ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5";
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="${d}"></path>
    </svg>
  `;
}

function editorSubsectionTitleTpl(sectionId, subsectionKey, label, collapsed) {
  return `
    <div class="editor-subsection-title">
      <span>${esc(label)}</span>
      <button
        class="subsection-collapse-btn"
        type="button"
        data-a="toggle-subsec"
        data-s="${sectionId}"
        data-sub="${subsectionKey}"
        title="${collapsed ? "Expandir subsecao" : "Colapsar subsecao"}"
        aria-label="${collapsed ? `Expandir ${label}` : `Colapsar ${label}`}"
      >
        ${chevronSvg(collapsed ? "down" : "up")}
      </button>
    </div>
  `;
}

function maturityCardTpl() {
  const level = coerceLevel(state.product.level);
  const cfg = getLevelConfig(level);
  const collapsed = isSectionCollapsed(LEVEL_SECTION_ID);
  const featuresHtml = FEATURE_CATALOG.map((feature) => {
    const enabled = isFeatureEnabled(feature.id);
    const unlockCfg = getLevelConfig(feature.unlockAt);
    return `
      <article class="feature-chip ${enabled ? "is-enabled" : "is-locked"}">
        <strong>${esc(feature.label)}</strong>
        <span>${enabled ? "Ativo" : `Libera no ${unlockCfg.name}`}</span>
      </article>
    `;
  }).join("");

  return `
    <article class="section-card level-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Arquitetura de niveis</h3>
        <div class="section-actions">
          <span class="level-pill">${esc(cfg.name)}</span>
          <button class="btn btn-muted collapse-btn" data-a="toggle-sec" data-s="${LEVEL_SECTION_ID}" title="${collapsed ? "Expandir" : "Colapsar"}" aria-label="${collapsed ? "Expandir arquitetura de niveis" : "Colapsar arquitetura de niveis"}">${chevronSvg(collapsed ? "down" : "up")}</button>
        </div>
      </header>
      ${
        collapsed
          ? `<p class="helper-text">${esc(levelSummary(cfg))}</p>`
          : `
            <div class="section-card-body">
              <p class="helper-text">${esc(cfg.description)}</p>
              <div class="field">
                <label>Nivel ativo (simulacao local)</label>
                <select id="product-level">
                  ${LEVEL_IDS.map((id) => {
                    const item = getLevelConfig(id);
                    return `<option value="${id}" ${id === level ? "selected" : ""}>${item.name} - ${item.summary}</option>`;
                  }).join("")}
                </select>
              </div>
              <p class="helper-text">Limites do nivel: ate ${cfg.limits.maxSections} secoes e ${cfg.limits.maxCollectionItems} cards por lista.</p>
              <div class="feature-grid">${featuresHtml}</div>
            </div>
          `
      }
    </article>
  `;
}

function sectionControls(sectionId, index, total) {
  const collapsed = isSectionCollapsed(sectionId);
  return `
    <div class="section-actions">
      <button class="btn btn-muted btn-icon" data-a="sec-up" data-s="${sectionId}" ${index === 0 ? "disabled" : ""} title="Mover para cima" aria-label="Mover secao para cima">↑</button>
      <button class="btn btn-muted btn-icon" data-a="sec-down" data-s="${sectionId}" ${index === total - 1 ? "disabled" : ""} title="Mover para baixo" aria-label="Mover secao para baixo">↓</button>
      <button class="btn btn-danger btn-icon" data-a="rem-sec" data-s="${sectionId}" title="Remover secao" aria-label="Remover secao">&#128465;</button>
      <button class="btn btn-muted collapse-btn" data-a="toggle-sec" data-s="${sectionId}" title="${collapsed ? "Expandir" : "Colapsar"}" aria-label="${collapsed ? "Expandir secao" : "Colapsar secao"}">${chevronSvg(collapsed ? "down" : "up")}</button>
    </div>
  `;
}

function footerControls() {
  const collapsed = isSectionCollapsed(FOOTER_SECTION_ID);
  return `
    <div class="section-actions">
      <button class="btn btn-danger btn-icon" data-a="footer-remove" data-el="footer" title="Remover rodape" aria-label="Remover rodape">&#128465;</button>
      <button class="btn btn-muted collapse-btn" data-a="toggle-sec" data-s="${FOOTER_SECTION_ID}" title="${collapsed ? "Expandir" : "Colapsar"}">${chevronSvg(collapsed ? "down" : "up")}</button>
    </div>
  `;
}

function editorHero(section, index, total) {
  const d = section.data;
  const collapsed = isSectionCollapsed(section.id);
  const bgSubCollapsed = isSubsectionCollapsed(section.id, "hero-bg");
  const profileSubCollapsed = isSubsectionCollapsed(section.id, "hero-profile");
  const titleSubCollapsed = isSubsectionCollapsed(section.id, "hero-title");
  const subtitleSubCollapsed = isSubsectionCollapsed(section.id, "hero-subtitle");
  const hasProfileImage = Boolean(String(d.profileImage || "").trim());
  const showColor = d.bgMode === "color" ? "" : "hidden";
  const showGradient = d.bgMode === "gradient" ? "" : "hidden";
  const showImage = d.bgMode === "image" ? "" : "hidden";
  const contentAlignOpts = alignOptionsTpl(d.contentAlign);
  const titleAlignOpts = alignOptionsTpl(d.titleAlign);
  const subtitleAlignOpts = alignOptionsTpl(d.subtitleAlign);
  const titleWeightOpts = [300, 400, 500, 600, 700, 800]
    .map((w) => `<option value="${w}" ${Number(d.titleWeight) === w ? "selected" : ""}>${w}</option>`)
    .join("");
  const subtitleWeightOpts = [300, 400, 500, 600, 700]
    .map((w) => `<option value="${w}" ${Number(d.subtitleWeight) === w ? "selected" : ""}>${w}</option>`)
    .join("");
  const profileSizeUnitOpts = cssUnitOptionsTpl(d.profileSizeUnit || "px");
  const profileRadiusUnitOpts = cssUnitOptionsTpl(d.profileRadiusUnit || "px");
  const profileBorderWidthUnitOpts = cssUnitOptionsTpl(d.profileBorderWidthUnit || "px");
  const heroWidthUnitOpts = cssUnitOptionsTpl(d.heroWidthUnit || "%");
  const heroHeightUnitOpts = cssUnitOptionsTpl(d.heroHeightUnit || "px");
  const titleSizeUnitOpts = cssUnitOptionsTpl(d.titleSizeUnit || "px");
  const subtitleSizeUnitOpts = cssUnitOptionsTpl(d.subtitleSizeUnit || "px");
  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Secao Hero</h3>
        ${sectionControls(section.id, index, total)}
      </header>
      ${
        collapsed
          ? `<p class="helper-text">${esc(sectionSummary(section))}</p>`
          : `
            <div class="section-card-body">
	              <section class="editor-subsection ${bgSubCollapsed ? "is-collapsed" : ""}">
	                ${editorSubsectionTitleTpl(section.id, "hero-bg", "Fundo", bgSubCollapsed)}
	                <div class="editor-subsection-body">
	                <div class="field-row">
                  <div class="field">
                    <label>Tipo de fundo</label>
                    <select data-s="${section.id}" data-k="bgMode">
                      <option value="none" ${d.bgMode === "none" ? "selected" : ""}>Sem preenchimento</option>
                      <option value="color" ${d.bgMode === "color" ? "selected" : ""}>Cor solida</option>
                      <option value="gradient" ${d.bgMode === "gradient" ? "selected" : ""}>Gradiente</option>
                      <option value="image" ${d.bgMode === "image" ? "selected" : ""}>Imagem</option>
                    </select>
                  </div>
                  <div class="field">
                    <label>Alinhamento geral do conteudo</label>
                    <select data-s="${section.id}" data-k="contentAlign">${contentAlignOpts}</select>
                  </div>
                </div>
                <div class="field-row">
                  <div class="field">
                    <label>Largura do Hero</label>
                    <div class="input-unit">
                      <input type="number" min="1" max="5000" data-s="${section.id}" data-k="heroWidth" data-t="n" value="${Number(d.heroWidth)}" />
                      <select data-s="${section.id}" data-k="heroWidthUnit">${heroWidthUnitOpts}</select>
                    </div>
                  </div>
                  <div class="field">
                    <label>Altura do Hero (0 = auto)</label>
                    <div class="input-unit">
                      <input type="number" min="0" max="5000" data-s="${section.id}" data-k="heroHeight" data-t="n" value="${Number(d.heroHeight)}" />
                      <select data-s="${section.id}" data-k="heroHeightUnit">${heroHeightUnitOpts}</select>
                    </div>
                  </div>
                </div>

                <div class="field ${showColor}">
                  <label>Cor de fundo</label>
                  <input type="color" data-s="${section.id}" data-k="bgColor" value="${esc(d.bgColor)}" />
                </div>
                <div class="field-row ${showGradient}">
                  <div class="field">
                    <label>Cor A do gradiente</label>
                    <input type="color" data-s="${section.id}" data-k="bgGradientColorA" value="${esc(d.bgGradientColorA)}" />
                  </div>
                  <div class="field">
                    <label>Cor B do gradiente</label>
                    <input type="color" data-s="${section.id}" data-k="bgGradientColorB" value="${esc(d.bgGradientColorB)}" />
                  </div>
                  <div class="field">
                    <label>Angulo do gradiente (deg)</label>
                    <input type="number" min="0" max="360" step="1" data-s="${section.id}" data-k="bgGradientAngle" data-t="n" value="${Number(d.bgGradientAngle)}" />
                  </div>
                </div>
                <div class="field ${showImage}">
                  <label>Imagem de fundo (URL)</label>
                  <input type="text" data-s="${section.id}" data-k="bgImage" value="${esc(d.bgImage)}" placeholder="https://..." />
                </div>
	                <div class="field ${showImage}">
	                  <label>Carregar imagem de fundo (explorer)</label>
	                  <input type="file" accept="image/*" data-a="upload-image" data-s="${section.id}" data-target="bg" />
	                </div>
	                </div>
	              </section>

	              <section class="editor-subsection ${profileSubCollapsed ? "is-collapsed" : ""}">
	                ${editorSubsectionTitleTpl(section.id, "hero-profile", "Imagem de perfil", profileSubCollapsed)}
	                <div class="editor-subsection-body">
	                <div class="field-row">
                  <div class="field field-inline">
                    <label>Imagem de perfil visivel</label>
                    <input type="checkbox" data-s="${section.id}" data-k="showProfile" data-t="b" ${d.showProfile ? "checked" : ""} />
                  </div>
                  <div class="field field-inline">
                    <label>Acao de imagem de perfil</label>
                    <div class="section-actions">
                      <button class="btn btn-muted" data-a="hero-add" data-s="${section.id}" data-el="profile">Adicionar</button>
                      ${
                        hasProfileImage
                          ? `<button class="btn btn-danger" data-a="hero-remove" data-s="${section.id}" data-el="profile">Remover</button>`
                          : ""
                      }
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>Imagem de perfil (URL)</label>
                  <input type="text" data-s="${section.id}" data-k="profileImage" value="${esc(d.profileImage)}" placeholder="https://..." />
                </div>
                <div class="field">
                  <label>Carregar imagem de perfil (explorer)</label>
                  <input type="file" accept="image/*" data-a="upload-image" data-s="${section.id}" data-target="profile" />
                </div>
	                <div class="field-row">
	                  <div class="field">
                    <label>Tamanho da imagem</label>
                    <div class="input-unit">
                      <input type="number" min="1" max="5000" data-s="${section.id}" data-k="profileSize" data-t="n" value="${Number(d.profileSize)}" />
                      <select data-s="${section.id}" data-k="profileSizeUnit">${profileSizeUnitOpts}</select>
                    </div>
                  </div>
                  <div class="field">
                    <label>Raio da borda</label>
                    <div class="input-unit">
                      <input type="number" min="0" max="9999" data-s="${section.id}" data-k="profileRadius" data-t="n" value="${Number(d.profileRadius)}" />
                      <select data-s="${section.id}" data-k="profileRadiusUnit">${profileRadiusUnitOpts}</select>
                    </div>
                  </div>
                  <div class="field">
                    <label>Espessura da borda</label>
                    <div class="input-unit">
                      <input type="number" min="0" max="999" data-s="${section.id}" data-k="profileBorderWidth" data-t="n" value="${Number(d.profileBorderWidth)}" />
                      <select data-s="${section.id}" data-k="profileBorderWidthUnit">${profileBorderWidthUnitOpts}</select>
                    </div>
                  </div>
                </div>
                <div class="field-row">
                  <div class="field">
                    <label>Posicao imagem perfil (X): ${Number(d.profileOffsetX)}px</label>
                    <input type="range" min="-600" max="600" step="1" data-s="${section.id}" data-k="profileOffsetX" data-t="n" value="${Number(d.profileOffsetX)}" />
                  </div>
                  <div class="field">
                    <label>Posicao imagem perfil (Y): ${Number(d.profileOffsetY)}px</label>
	                    <input type="range" min="-240" max="240" step="1" data-s="${section.id}" data-k="profileOffsetY" data-t="n" value="${Number(d.profileOffsetY)}" />
	                  </div>
	                </div>
	                </div>
	              </section>

	              <section class="editor-subsection ${titleSubCollapsed ? "is-collapsed" : ""}">
	                ${editorSubsectionTitleTpl(section.id, "hero-title", "Titulo", titleSubCollapsed)}
	                <div class="editor-subsection-body">
	                <div class="field-row">
                  <div class="field field-inline">
                    <label>Titulo visivel</label>
                    <input type="checkbox" data-s="${section.id}" data-k="showTitle" data-t="b" ${d.showTitle ? "checked" : ""} />
                  </div>
                  <div class="field field-inline">
                    <label>Acao de titulo</label>
                    <div class="section-actions">
                      <button class="btn btn-muted" data-a="hero-add" data-s="${section.id}" data-el="title">Adicionar</button>
                      <button class="btn btn-danger" data-a="hero-remove" data-s="${section.id}" data-el="title">Remover</button>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>Titulo</label>
                  <input type="text" data-s="${section.id}" data-k="title" value="${esc(d.title)}" />
                </div>
                <div class="field">
                  <label>Alinhamento do titulo</label>
                  <select data-s="${section.id}" data-k="titleAlign">${titleAlignOpts}</select>
                </div>
	                <div class="field-row">
	                  <div class="field">
                    <label>Cor do titulo</label>
                    <input type="color" data-s="${section.id}" data-k="titleColor" value="${esc(d.titleColor)}" />
                  </div>
                  <div class="field">
                    <label>Tamanho do titulo</label>
                    <div class="input-unit">
                      <input type="number" min="1" max="1000" data-s="${section.id}" data-k="titleSize" data-t="n" value="${Number(d.titleSize)}" />
                      <select data-s="${section.id}" data-k="titleSizeUnit">${titleSizeUnitOpts}</select>
                    </div>
                  </div>
                  <div class="field">
                    <label>Peso do titulo</label>
                    <select data-s="${section.id}" data-k="titleWeight" data-t="n">${titleWeightOpts}</select>
                  </div>
                </div>
                <div class="field-row">
                  <div class="field">
                    <label>Posicao titulo (X): ${Number(d.titleOffsetX)}px</label>
                    <input type="range" min="-600" max="600" step="1" data-s="${section.id}" data-k="titleOffsetX" data-t="n" value="${Number(d.titleOffsetX)}" />
                  </div>
                  <div class="field">
                    <label>Posicao titulo (Y): ${Number(d.titleOffsetY)}px</label>
	                    <input type="range" min="-240" max="240" step="1" data-s="${section.id}" data-k="titleOffsetY" data-t="n" value="${Number(d.titleOffsetY)}" />
	                  </div>
	                </div>
	                </div>
	              </section>

	              <section class="editor-subsection ${subtitleSubCollapsed ? "is-collapsed" : ""}">
	                ${editorSubsectionTitleTpl(section.id, "hero-subtitle", "Subtitulo", subtitleSubCollapsed)}
	                <div class="editor-subsection-body">
	                <div class="field-row">
                  <div class="field field-inline">
                    <label>Subtitulo visivel</label>
                    <input type="checkbox" data-s="${section.id}" data-k="showSubtitle" data-t="b" ${d.showSubtitle ? "checked" : ""} />
                  </div>
                  <div class="field field-inline">
                    <label>Acao de subtitulo</label>
                    <div class="section-actions">
                      <button class="btn btn-muted" data-a="hero-add" data-s="${section.id}" data-el="subtitle">Adicionar</button>
                      <button class="btn btn-danger" data-a="hero-remove" data-s="${section.id}" data-el="subtitle">Remover</button>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>Subtitulo</label>
                  <input type="text" data-s="${section.id}" data-k="subtitle" value="${esc(d.subtitle)}" />
                </div>
                <div class="field">
                  <label>Alinhamento do subtitulo</label>
                  <select data-s="${section.id}" data-k="subtitleAlign">${subtitleAlignOpts}</select>
                </div>
	                <div class="field-row">
	                  <div class="field">
                    <label>Cor do subtitulo</label>
                    <input type="color" data-s="${section.id}" data-k="subtitleColor" value="${esc(d.subtitleColor)}" />
                  </div>
                  <div class="field">
                    <label>Tamanho do subtitulo</label>
                    <div class="input-unit">
                      <input type="number" min="1" max="1000" data-s="${section.id}" data-k="subtitleSize" data-t="n" value="${Number(d.subtitleSize)}" />
                      <select data-s="${section.id}" data-k="subtitleSizeUnit">${subtitleSizeUnitOpts}</select>
                    </div>
                  </div>
                  <div class="field">
                    <label>Peso do subtitulo</label>
                    <select data-s="${section.id}" data-k="subtitleWeight" data-t="n">${subtitleWeightOpts}</select>
                  </div>
                </div>
                <div class="field-row">
                  <div class="field">
                    <label>Posicao subtitulo (X): ${Number(d.subtitleOffsetX)}px</label>
                    <input type="range" min="-600" max="600" step="1" data-s="${section.id}" data-k="subtitleOffsetX" data-t="n" value="${Number(d.subtitleOffsetX)}" />
                  </div>
                  <div class="field">
                    <label>Posicao subtitulo (Y): ${Number(d.subtitleOffsetY)}px</label>
	                    <input type="range" min="-240" max="240" step="1" data-s="${section.id}" data-k="subtitleOffsetY" data-t="n" value="${Number(d.subtitleOffsetY)}" />
	                  </div>
	                </div>
	                </div>
	              </section>
            </div>
          `
      }
    </article>
  `;
}

function editorDescription(section, index, total) {
  const d = section.data;
  const collapsed = isSectionCollapsed(section.id);
  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Secao Descricao/Introducao</h3>
        ${sectionControls(section.id, index, total)}
      </header>
      ${
        collapsed
          ? `<p class="helper-text">${esc(sectionSummary(section))}</p>`
          : `
            <div class="section-card-body">
              <div class="field">
                <label>Titulo da secao</label>
                <input type="text" data-s="${section.id}" data-k="title" value="${esc(d.title)}" />
              </div>
              <div class="field">
                <label>Texto</label>
                <textarea data-s="${section.id}" data-k="text">${esc(d.text)}</textarea>
              </div>
            </div>
          `
      }
    </article>
  `;
}

function editorPublications(section, index, total) {
  const d = section.data;
  const collapsed = isSectionCollapsed(section.id);
  const limitReached = !canAddCollectionItem(section, "items");
  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Secao Publicacoes</h3>
        ${sectionControls(section.id, index, total)}
      </header>
      ${
        collapsed
          ? `<p class="helper-text">${esc(sectionSummary(section))}</p>`
          : `
            <div class="section-card-body">
              <div class="field">
                <label>Titulo da secao</label>
                <input type="text" data-s="${section.id}" data-k="title" value="${esc(d.title)}" />
              </div>
              <div class="field">
                <label>Subtitulo</label>
                <input type="text" data-s="${section.id}" data-k="subtitle" value="${esc(d.subtitle)}" />
              </div>
              <div class="card-list">
                ${d.items
                  .map(
                    (item, i) => `
                  <div class="card-item">
                    <div class="card-top">
                      <strong>Publicacao ${i + 1}</strong>
                      <div class="section-actions">
                        <button class="btn btn-muted" data-a="item-up" data-s="${section.id}" data-c="items" data-i="${item.id}" ${i === 0 ? "disabled" : ""}>↑</button>
                        <button class="btn btn-muted" data-a="item-down" data-s="${section.id}" data-c="items" data-i="${item.id}" ${i === d.items.length - 1 ? "disabled" : ""}>↓</button>
                        <button class="btn btn-danger" data-a="rem-item" data-s="${section.id}" data-c="items" data-i="${item.id}">Remover</button>
                      </div>
                    </div>
                    <div class="field">
                      <label>URL da imagem</label>
                      <input type="text" data-s="${section.id}" data-c="items" data-i="${item.id}" data-k="image" value="${esc(item.image)}" />
                    </div>
                    <div class="field">
                      <label>Titulo</label>
                      <input type="text" data-s="${section.id}" data-c="items" data-i="${item.id}" data-k="title" value="${esc(item.title)}" />
                    </div>
                    <div class="field">
                      <label>Texto</label>
                      <textarea data-s="${section.id}" data-c="items" data-i="${item.id}" data-k="text">${esc(item.text)}</textarea>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              <button class="btn btn-outline" data-a="add-item" data-s="${section.id}" data-c="items" ${limitReached ? "disabled" : ""}>Adicionar publicacao</button>
              ${limitReached ? '<p class="helper-text">Limite de cards atingido para este nivel.</p>' : ""}
            </div>
          `
      }
    </article>
  `;
}

function editorProducts(section, index, total) {
  const d = section.data;
  const collapsed = isSectionCollapsed(section.id);
  const limitReached = !canAddCollectionItem(section, "items");
  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Secao Produtos</h3>
        ${sectionControls(section.id, index, total)}
      </header>
      ${
        collapsed
          ? `<p class="helper-text">${esc(sectionSummary(section))}</p>`
          : `
            <div class="section-card-body">
              <div class="field">
                <label>Titulo da secao</label>
                <input type="text" data-s="${section.id}" data-k="title" value="${esc(d.title)}" />
              </div>
              <div class="field">
                <label>Descricao da secao</label>
                <textarea data-s="${section.id}" data-k="description">${esc(d.description)}</textarea>
              </div>
              <div class="card-list">
                ${d.items
                  .map(
                    (item, i) => `
                  <div class="card-item">
                    <div class="card-top">
                      <strong>Produto ${i + 1}</strong>
                      <button class="btn btn-danger" data-a="rem-item" data-s="${section.id}" data-c="items" data-i="${item.id}">Remover</button>
                    </div>
                    <div class="field-row">
                      <div class="field">
                        <label>Titulo</label>
                        <input type="text" data-s="${section.id}" data-c="items" data-i="${item.id}" data-k="title" value="${esc(item.title)}" />
                      </div>
                      <div class="field">
                        <label>Preco (R$)</label>
                        <input type="text" data-s="${section.id}" data-c="items" data-i="${item.id}" data-k="price" value="${esc(item.price)}" />
                      </div>
                    </div>
                    <div class="field">
                      <label>Forma de pagamento</label>
                      <input type="text" data-s="${section.id}" data-c="items" data-i="${item.id}" data-k="payment" value="${esc(item.payment)}" />
                    </div>
                    <div class="field">
                      <label>Texto do botao</label>
                      <input type="text" data-s="${section.id}" data-c="items" data-i="${item.id}" data-k="cta" value="${esc(item.cta)}" />
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              <button class="btn btn-outline" data-a="add-item" data-s="${section.id}" data-c="items" ${limitReached ? "disabled" : ""}>Adicionar produto</button>
              ${limitReached ? '<p class="helper-text">Limite de cards atingido para este nivel.</p>' : ""}
            </div>
          `
      }
    </article>
  `;
}

function editorServices(section, index, total) {
  const d = section.data;
  const collapsed = isSectionCollapsed(section.id);
  const limitReached = !canAddCollectionItem(section, "plans");
  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Secao Servicos</h3>
        ${sectionControls(section.id, index, total)}
      </header>
      ${
        collapsed
          ? `<p class="helper-text">${esc(sectionSummary(section))}</p>`
          : `
            <div class="section-card-body">
              <div class="field">
                <label>Titulo da secao</label>
                <input type="text" data-s="${section.id}" data-k="title" value="${esc(d.title)}" />
              </div>
              <div class="field">
                <label>Descricao da secao</label>
                <textarea data-s="${section.id}" data-k="description">${esc(d.description)}</textarea>
              </div>
              <div class="field">
                <label>Texto do botao</label>
                <input type="text" data-s="${section.id}" data-k="buttonLabel" value="${esc(d.buttonLabel)}" />
              </div>
              <div class="card-list">
                ${d.plans
                  .map(
                    (plan, i) => `
                  <div class="card-item">
                    <div class="card-top">
                      <strong>Plano ${i + 1}</strong>
                      <button class="btn btn-danger" data-a="rem-item" data-s="${section.id}" data-c="plans" data-i="${plan.id}">Remover</button>
                    </div>
                    <div class="field-row">
                      <div class="field">
                        <label>Titulo</label>
                        <input type="text" data-s="${section.id}" data-c="plans" data-i="${plan.id}" data-k="title" value="${esc(plan.title)}" />
                      </div>
                      <div class="field">
                        <label>Modalidade</label>
                        <select data-s="${section.id}" data-c="plans" data-i="${plan.id}" data-k="mode">
                          <option value="online" ${plan.mode === "online" ? "selected" : ""}>online</option>
                          <option value="presencial" ${plan.mode === "presencial" ? "selected" : ""}>presencial</option>
                          <option value="hibrida" ${plan.mode === "hibrida" ? "selected" : ""}>hibrida</option>
                        </select>
                      </div>
                    </div>
                    <div class="field">
                      <label>Descricao</label>
                      <textarea data-s="${section.id}" data-c="plans" data-i="${plan.id}" data-k="description">${esc(plan.description)}</textarea>
                    </div>
                    <div class="field-row">
                      <div class="field">
                        <label>Duracao (0 a 365 dias)</label>
                        <input type="number" min="0" max="365" data-s="${section.id}" data-c="plans" data-i="${plan.id}" data-k="durationDays" data-t="n" value="${Number(plan.durationDays)}" />
                      </div>
                      <div class="field">
                        <label>Frequencia semanal (0 a 7)</label>
                        <input type="number" min="0" max="7" data-s="${section.id}" data-c="plans" data-i="${plan.id}" data-k="weeklyFrequency" data-t="n" value="${Number(plan.weeklyFrequency)}" />
                      </div>
                      <div class="field">
                        <label>Preco (R$)</label>
                        <input type="text" data-s="${section.id}" data-c="plans" data-i="${plan.id}" data-k="price" value="${esc(plan.price)}" />
                      </div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              <button class="btn btn-outline" data-a="add-item" data-s="${section.id}" data-c="plans" ${limitReached ? "disabled" : ""}>Adicionar plano</button>
              ${limitReached ? '<p class="helper-text">Limite de cards atingido para este nivel.</p>' : ""}
            </div>
          `
      }
    </article>
  `;
}

function editorByType(section, index, total) {
  if (section.type === "hero") return editorHero(section, index, total);
  if (section.type === "description") return editorDescription(section, index, total);
  if (section.type === "publications") return editorPublications(section, index, total);
  if (section.type === "products") return editorProducts(section, index, total);
  return editorServices(section, index, total);
}

function fontOptionsTpl(selected) {
  return Object.entries(FONT_OPTIONS)
    .map(([key, option]) => `<option value="${key}" ${selected === key ? "selected" : ""}>${option.label}</option>`)
    .join("");
}

function cssUnitOptionsTpl(selected) {
  return CSS_LENGTH_UNITS.map((unit) => `<option value="${unit}" ${selected === unit ? "selected" : ""}>${unit}</option>`).join("");
}

function alignOptionsTpl(selected) {
  return ALIGN_OPTIONS.map(
    ([value, label]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${label}</option>`
  ).join("");
}

function editorFooter() {
  const d = state.page.footer;
  const collapsed = isSectionCollapsed(FOOTER_SECTION_ID);
  const alignOpts = alignOptionsTpl(d.contentAlign);

  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Rodape editavel</h3>
        ${footerControls()}
      </header>
      ${
        collapsed
          ? `<p class="helper-text">${esc(footerSummary())}</p>`
          : `
            <div class="section-card-body">
              <div class="field-row">
                <div class="field field-inline">
                  <label>Rodape visivel</label>
                  <input id="footer-visible" type="checkbox" ${d.showFooter ? "checked" : ""} />
                </div>
                <div class="field">
                  <label>Alinhamento do rodape</label>
                  <select id="footer-align">${alignOpts}</select>
                </div>
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Cor de fundo</label>
                  <input id="footer-bg-color" type="color" value="${esc(d.bgColor)}" />
                </div>
                <div class="field">
                  <label>Cor do texto</label>
                  <input id="footer-text-color" type="color" value="${esc(d.textColor)}" />
                </div>
              </div>

              <div class="field-row">
                <div class="field field-inline">
                  <label>Titulo visivel</label>
                  <input id="footer-title-visible" type="checkbox" ${d.showTitle ? "checked" : ""} />
                </div>
                <div class="field field-inline">
                  <label>Acao de titulo</label>
                  <div class="section-actions">
                    <button class="btn btn-muted" data-a="footer-add" data-el="title">Adicionar</button>
                    <button class="btn btn-danger btn-icon" data-a="footer-remove" data-el="title" title="Remover titulo do rodape" aria-label="Remover titulo do rodape">&#128465;</button>
                  </div>
                </div>
              </div>
              <div class="field">
                <label>Titulo do rodape</label>
                <input id="footer-title" type="text" value="${esc(d.title)}" />
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Posicao titulo (X): ${Number(d.footerTitleOffsetX)}px</label>
                  <input id="footer-title-offset-x" type="range" min="-600" max="600" step="1" value="${Number(d.footerTitleOffsetX)}" />
                </div>
                <div class="field">
                  <label>Posicao titulo (Y): ${Number(d.footerTitleOffsetY)}px</label>
                  <input id="footer-title-offset-y" type="range" min="-240" max="240" step="1" value="${Number(d.footerTitleOffsetY)}" />
                </div>
              </div>

              <div class="field-row">
                <div class="field field-inline">
                  <label>Conteudo visivel</label>
                  <input id="footer-content-visible" type="checkbox" ${d.showContent ? "checked" : ""} />
                </div>
                <div class="field field-inline">
                  <label>Acao de conteudo</label>
                  <div class="section-actions">
                    <button class="btn btn-muted" data-a="footer-add" data-el="content">Adicionar</button>
                    <button class="btn btn-danger btn-icon" data-a="footer-remove" data-el="content" title="Remover conteudo do rodape" aria-label="Remover conteudo do rodape">&#128465;</button>
                  </div>
                </div>
              </div>
              <div class="field">
                <label>Conteudo (contatos e outros)</label>
                <textarea id="footer-content">${esc(d.content)}</textarea>
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Posicao conteudo (X): ${Number(d.footerContentOffsetX)}px</label>
                  <input id="footer-content-offset-x" type="range" min="-600" max="600" step="1" value="${Number(d.footerContentOffsetX)}" />
                </div>
                <div class="field">
                  <label>Posicao conteudo (Y): ${Number(d.footerContentOffsetY)}px</label>
                  <input id="footer-content-offset-y" type="range" min="-240" max="240" step="1" value="${Number(d.footerContentOffsetY)}" />
                </div>
              </div>
            </div>
          `
      }
    </article>
  `;
}

function panelTpl() {
  const availableTypes = availableSectionTypes();
  const sectionLimitReached = !canAddSection();
  const addDisabled = sectionLimitReached || availableTypes.length === 0;
  return `
    <aside class="builder-panel">
      <div class="builder-header">
        <div>
          <h2 class="builder-title">Page Builder</h2>
          <p class="builder-subtitle">Usuario: ${esc(state.auth.userEmail)}</p>
        </div>
        <div class="builder-header-actions">
          <button class="btn btn-outline" data-a="logout">Sair</button>
        </div>
      </div>

      ${maturityCardTpl()}

      <div class="field">
        <label>Titulo da pagina</label>
        <input id="page-title" type="text" value="${esc(state.page.title)}" />
      </div>
      <div class="field">
        <label>Subtitulo da pagina</label>
        <input id="page-subtitle" type="text" value="${esc(state.page.subtitle)}" />
      </div>

      <div class="field-row">
        <div class="field">
          <label>Adicionar secao</label>
          <select id="new-section-type">
            ${
              availableTypes.length
                ? availableTypes.map((option) => `<option value="${option.id}">${option.label}</option>`).join("")
                : '<option value="" selected>Todas as secoes ja foram inseridas</option>'
            }
          </select>
        </div>
        <div class="field" style="align-self:end;">
          <button class="btn btn-primary" data-a="add-sec" ${addDisabled ? "disabled" : ""}>Adicionar</button>
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label>Fonte de titulos</label>
          <select id="font-heading">${fontOptionsTpl(state.page.settings.headingFont)}</select>
        </div>
        <div class="field">
          <label>Fonte de textos</label>
          <select id="font-body">${fontOptionsTpl(state.page.settings.bodyFont)}</select>
        </div>
      </div>

      <div class="section-list">
        ${
          state.page.sections.length
            ? state.page.sections.map((section, i) => editorByType(section, i, state.page.sections.length)).join("")
            : '<p class="helper-text">Nenhuma secao inserida ainda.</p>'
        }
        ${state.page.footer?.enabled ? editorFooter() : ""}
      </div>
    </aside>
  `;
}

function previewHero(section) {
  const d = section.data;
  const bgMode = ["none", "color", "gradient", "image"].includes(d.bgMode) ? d.bgMode : "color";
  const bg =
    bgMode === "image" && d.bgImage
      ? `background-image:url('${esc(d.bgImage)}');background-size:cover;background-position:center;`
      : bgMode === "gradient"
        ? `background:linear-gradient(${Number(d.bgGradientAngle) || 0}deg, ${esc(d.bgGradientColorA || "#1e3a8a")}, ${esc(d.bgGradientColorB || "#0f172a")});`
        : bgMode === "none"
          ? "background:transparent;"
          : `background:${esc(d.bgColor || "#1d4ed8")};`;
  const alignMap = { left: "start", center: "center", right: "end" };
  const textAlignMap = { left: "left", center: "center", right: "right" };
  const titleAlign = ["left", "center", "right"].includes(d.titleAlign) ? d.titleAlign : d.contentAlign;
  const subtitleAlign = ["left", "center", "right"].includes(d.subtitleAlign) ? d.subtitleAlign : d.contentAlign;
  const titleJustify = alignMap[titleAlign] || "center";
  const subtitleJustify = alignMap[subtitleAlign] || "center";
  const titleTextAlign = textAlignMap[titleAlign] || "center";
  const subtitleTextAlign = textAlignMap[subtitleAlign] || "center";
  const profileVisible = d.showProfile !== false;
  const titleVisible = d.showTitle !== false;
  const subtitleVisible = d.showSubtitle !== false;
  const heroWidthCss = previewInlineLength(d.heroWidth, d.heroWidthUnit, 100, "%");
  const heroMinHeightCss = Number(d.heroHeight) > 0 ? cssLength(d.heroHeight, d.heroHeightUnit, 0, "px") : "";
  const profileSizeCss = cssLength(d.profileSize, d.profileSizeUnit, 120, "px");
  const profileRadiusCss = cssLength(d.profileRadius, d.profileRadiusUnit, 999, "px");
  const profileBorderWidthCss = cssLength(d.profileBorderWidth, d.profileBorderWidthUnit, 3, "px");
  const titleSizeCss = cssLength(d.titleSize, d.titleSizeUnit, 42, "px");
  const subtitleSizeCss = cssLength(d.subtitleSize, d.subtitleSizeUnit, 19, "px");
  const showOverlay = false;
  const profileSrc = String(d.profileImage || "").trim();
  const heroBoxStyle = `width:${heroWidthCss};max-width:100%;justify-self:center;box-sizing:border-box;${heroMinHeightCss ? `min-height:${heroMinHeightCss};` : ""}${bg}`;
  return `
    <section class="preview-hero" data-s="${section.id}" style="${heroBoxStyle}">
      ${showOverlay ? '<div class="preview-hero-overlay"></div>' : ""}
      ${
        profileVisible
          ? profileSrc
            ? `<img class="preview-profile" style="position:absolute;left:50%;top:50%;z-index:1;transform:translate(-50%, -50%) translate(${Number(d.profileOffsetX)}px, ${Number(d.profileOffsetY)}px);width:${profileSizeCss};height:${profileSizeCss};border-radius:${profileRadiusCss};border-width:${profileBorderWidthCss};" src="${profileSrc}" alt="Perfil" />`
            : `<div class="preview-profile preview-profile-placeholder" style="position:absolute;left:50%;top:50%;z-index:1;transform:translate(-50%, -50%) translate(${Number(d.profileOffsetX)}px, ${Number(d.profileOffsetY)}px);width:${profileSizeCss};height:${profileSizeCss};border-radius:${profileRadiusCss};border-width:${profileBorderWidthCss};">
                <span class="preview-profile-placeholder-icon">${cameraIconSvg()}</span>
                <span class="preview-profile-placeholder-text">Adicionar foto</span>
              </div>`
          : ""
      }
      <div class="preview-hero-content" style="justify-items:stretch;text-align:left;">
        ${
          titleVisible
            ? `<h1 style="justify-self:${titleJustify};text-align:${titleTextAlign};width:min(100%,760px);transform:translate(${Number(d.titleOffsetX)}px, ${Number(d.titleOffsetY)}px);margin:0;color:${esc(d.titleColor)};font-size:${titleSizeCss};font-weight:${Number(d.titleWeight)};">${esc(d.title)}</h1>`
            : ""
        }
        ${
          subtitleVisible
            ? `<p style="justify-self:${subtitleJustify};text-align:${subtitleTextAlign};width:min(100%,760px);transform:translate(${Number(d.subtitleOffsetX)}px, ${Number(d.subtitleOffsetY)}px);margin:0;color:${esc(d.subtitleColor)};font-size:${subtitleSizeCss};font-weight:${Number(d.subtitleWeight)};">${esc(d.subtitle)}</p>`
            : ""
        }
      </div>
    </section>
  `;
}

function previewDescription(section) {
  const d = section.data;
  return `
    <section class="preview-description">
      <h2 class="section-heading">${esc(d.title)}</h2>
      <p class="section-sub">${esc(d.text)}</p>
    </section>
  `;
}

function previewPublications(section) {
  const d = section.data;
  return `
    <section class="preview-publications">
      <h2 class="section-heading">${esc(d.title)}</h2>
      <p class="section-sub">${esc(d.subtitle)}</p>
      <div class="preview-post-grid">
        ${d.items
          .map(
            (item) => `
          <article class="post-card">
            <img class="post-image" src="${item.image || "https://via.placeholder.com/600x400.png?text=Publicacao"}" alt="Publicacao" />
            <div class="post-body">
              <h3 style="margin:0 0 6px;">${esc(item.title)}</h3>
              <p style="margin:0;color:var(--text-soft);">${esc(item.text)}</p>
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

function previewProducts(section) {
  const d = section.data;
  return `
    <section class="preview-products">
      <h2 class="section-heading">${esc(d.title)}</h2>
      <p class="section-sub">${esc(d.description)}</p>
      <div class="preview-product-grid">
        ${d.items
          .map(
            (item) => `
          <article class="product-card">
            <div class="product-body">
              <h3 style="margin:0 0 8px;">${esc(item.title)}</h3>
              <span class="price-tag">${brl(item.price)}</span>
              <p style="margin:10px 0 8px;color:var(--text-soft);">Pagamento: ${esc(item.payment)}</p>
              <button class="btn btn-primary product-cta" type="button">${esc(item.cta)}</button>
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

function previewServices(section) {
  const d = section.data;
  return `
    <section class="preview-services">
      <h2 class="section-heading">${esc(d.title)}</h2>
      <p class="section-sub">${esc(d.description)}</p>
      <button class="btn btn-primary" data-a="open-modal" data-s="${section.id}">${esc(d.buttonLabel || "Ver planos")}</button>
    </section>
  `;
}

function previewFooter() {
  const d = state.page.footer;
  if (!d || d.enabled === false || d.showFooter === false) return "";
  const textAlign = ["left", "center", "right"].includes(d.contentAlign) ? d.contentAlign : "left";
  return `
    <footer class="preview-footer" style="background:${esc(d.bgColor)};color:${esc(d.textColor)};">
      <div class="preview-footer-inner" style="text-align:${textAlign};">
        ${
          d.showTitle !== false
            ? `<h3 class="preview-footer-title" style="transform:translate(${Number(d.footerTitleOffsetX)}px, ${Number(d.footerTitleOffsetY)}px);">${esc(d.title)}</h3>`
            : ""
        }
        ${
          d.showContent !== false
            ? `<p class="preview-footer-content" style="transform:translate(${Number(d.footerContentOffsetX)}px, ${Number(d.footerContentOffsetY)}px);">${esc(d.content)}</p>`
            : ""
        }
      </div>
    </footer>
  `;
}

function previewSection(section) {
  if (section.type === "hero") return previewHero(section);
  if (section.type === "description") return previewDescription(section);
  if (section.type === "publications") return previewPublications(section);
  if (section.type === "products") return previewProducts(section);
  return previewServices(section);
}

function viewportIconSvg(id) {
  if (id === "tablet") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="2.5" width="12" height="19" rx="1.8"></rect>
        <circle cx="12" cy="18.7" r="0.8"></circle>
      </svg>
    `;
  }
  if (id === "mobile") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="3.2" width="10" height="17.6" rx="1.9"></rect>
        <circle cx="12" cy="18.1" r="0.85"></circle>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="1.3"></rect>
      <path d="M9 20h6"></path>
      <path d="M6.5 20h11"></path>
      <path d="M12 16v4"></path>
    </svg>
  `;
}

function eyeIconSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1.5 12s3.8-6 10.5-6 10.5 6 10.5 6-3.8 6-10.5 6S1.5 12 1.5 12z"></path>
      <circle cx="12" cy="12" r="3.1"></circle>
    </svg>
  `;
}

function cameraIconSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.5h3l1.2-2h7.6l1.2 2H20a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  `;
}

function userIconSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4.2"></circle>
      <path d="M4.5 20c1.9-4 13.1-4 15 0"></path>
    </svg>
  `;
}

function previewTpl(options = {}) {
  const published = Boolean(options.published);
  const levelCfg = currentLevelConfig();
  const viewport = VIEWPORT_CONFIG[coerceViewport(state.ui.previewViewport)];
  const headingFont = fontFamilyByKey(state.page.settings.headingFont, "sora");
  const bodyFont = fontFamilyByKey(state.page.settings.bodyFont, "manrope");
  const savedDate = new Date(state.page?.meta?.updatedAt || "");
  const savedLabel = Number.isFinite(savedDate.getTime())
    ? savedDate.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : "ainda nao salvo";
  const previewAccountOpen = !published && Boolean(state.ui.previewAccountOpen);
  const pageTitleLabel = String(state.page.title || "").trim() || "Titulo da pagina";
  const pageSubtitleLabel = String(state.page.subtitle || "").trim() || "Subtitulo da pagina";
  const viewportButtons = Object.entries(VIEWPORT_CONFIG)
    .map(
      ([id, config]) => `
        <button
          class="preview-icon-btn ${state.ui.previewViewport === id ? "is-active" : ""}"
          type="button"
          data-a="set-preview-viewport"
          data-v="${id}"
          title="Tela: ${config.label}"
          aria-label="Tela ${config.label}"
        >
          ${viewportIconSvg(id)}
        </button>
      `
    )
    .join("");
  return `
    <section class="preview-area ${published ? "is-published" : ""}">
      <div class="preview-shell ${published ? "" : "is-editor-preview"}" style="max-width:${viewport.maxWidth}px;--preview-heading-font:${headingFont};--preview-body-font:${bodyFont};" ${
        !published ? `data-level="${esc(levelCfg.name)}" data-saved="${esc(savedLabel)}"` : ""
      }>
        ${
          published
            ? ""
            : `
              <header class="preview-workbench-bar" title="Nivel: ${esc(levelCfg.name)} | Rascunho: ${esc(savedLabel)}">
                <div class="preview-workbench-left">${viewportButtons}</div>
                <div class="preview-workbench-right">
                  <button class="preview-icon-btn" type="button" data-a="toggle-published-view" title="Ver publicada" aria-label="Ver publicada">
                    ${eyeIconSvg()}
                  </button>
                  <button class="preview-avatar-btn" type="button" data-a="toggle-preview-account" title="${esc(state.auth.userEmail || "Usuario")}" aria-label="Dados da conta">
                    ${userIconSvg()}
                  </button>
                  ${
                    previewAccountOpen
                      ? `
                        <div class="preview-account-popover">
                          <div class="preview-account-title">Conta do usuario</div>
                          <div class="preview-account-line"><strong>Email:</strong> ${esc(state.auth.userEmail || "-")}</div>
                          <div class="preview-account-line"><strong>Nivel:</strong> ${esc(levelCfg.name)}</div>
                          <div class="preview-account-line"><strong>Rascunho:</strong> ${esc(savedLabel)}</div>
                        </div>
                      `
                      : ""
                  }
                </div>
              </header>
              <section class="preview-stage-card preview-stage-page-head">
                <div class="preview-stage-title">${esc(pageTitleLabel)}</div>
                <div class="preview-stage-subtitle">${esc(pageSubtitleLabel)}</div>
              </section>
            `
        }
        <main class="preview-page">
          ${
            state.page.sections.length
              ? state.page.sections.map((section) => previewSection(section)).join("")
              : '<div class="empty-state preview-stage-card">Adicione uma secao para comecar</div>'
          }
        </main>
        ${previewFooter()}
      </div>
    </section>
  `;
}

function publishedControlsTpl() {
  return `
    <div class="published-controls">
      <div class="preview-device-row">
        <label class="preview-meta" for="preview-viewport">Tela</label>
        <select id="preview-viewport">
          ${Object.entries(VIEWPORT_CONFIG)
            .map(
              ([id, config]) =>
                `<option value="${id}" ${state.ui.previewViewport === id ? "selected" : ""}>${config.label}</option>`
            )
            .join("")}
        </select>
      </div>
      <button class="btn btn-outline btn-compact" data-a="toggle-published-view">Voltar ao editor</button>
    </div>
  `;
}

function modalTpl() {
  if (!state.ui.modalSectionId) return "";
  const section = getSection(state.ui.modalSectionId);
  if (!section || section.type !== "services") return "";
  return `
    <div class="modal" id="services-modal">
      <div class="modal-content">
        <header class="modal-header">
          <strong>${esc(section.data.title)} - Planos</strong>
          <button class="btn btn-muted" data-a="close-modal">Fechar</button>
        </header>
        <div class="modal-body">
          <div class="preview-plan-grid">
            ${section.data.plans
              .map(
                (plan) => `
              <article class="plan-card">
                <div class="plan-body">
                  <h3 style="margin:0 0 8px;">${esc(plan.title)}</h3>
                  <p style="margin:0 0 8px;color:var(--text-soft)">Modalidade: ${esc(plan.mode)}</p>
                  <p style="margin:0 0 8px;color:var(--text-soft)">${esc(plan.description)}</p>
                  <p style="margin:0 0 8px;color:var(--text-soft)">Duracao: ${Number(plan.durationDays)} dia(s)</p>
                  <p style="margin:0 0 8px;color:var(--text-soft)">Frequencia semanal: ${Number(plan.weeklyFrequency)}x</p>
                  <span class="price-tag">${brl(plan.price)}</span>
                </div>
              </article>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function authTpl() {
  return `
    <main class="auth-screen">
      <section class="auth-card">
        <span class="brand"><span class="brand-dot"></span>Builder Pro N1</span>
        <h1 class="auth-title">Login do usuario</h1>
        <p class="auth-subtitle">Acesso ao page builder para montar paginas modernas em poucos minutos.</p>
        <form id="login-form" class="form-grid">
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" placeholder="voce@exemplo.com" required />
          </div>
          <div class="field">
            <label for="password">Senha</label>
            <input id="password" type="password" placeholder="Digite sua senha" required />
          </div>
          <button class="btn btn-primary" type="submit">Entrar no builder</button>
        </form>
        <p class="auth-hint">Nivel 1: autenticacao local para validar o fluxo. Integracao real com backend no nivel 2.</p>
      </section>
    </main>
  `;
}

function appTpl() {
  if (state.ui.publishedView) {
    return `
      <div class="published-view">
        ${previewTpl({ published: true })}
        ${publishedControlsTpl()}
      </div>
      ${modalTpl()}
      ${state.ui.toast ? `<div class="toast">${esc(state.ui.toast)}</div>` : ""}
    `;
  }

  return `
    <div class="app-layout">
      ${panelTpl()}
      ${previewTpl({ published: false })}
    </div>
    ${modalTpl()}
    ${state.ui.toast ? `<div class="toast">${esc(state.ui.toast)}</div>` : ""}
  `;
}

function syncModalDom() {
  const existingModal = app.querySelector("#services-modal");
  const nextModalHtml = modalTpl().trim();

  if (!nextModalHtml) {
    if (existingModal) existingModal.remove();
    return;
  }

  const holder = document.createElement("div");
  holder.innerHTML = nextModalHtml;
  const nextModal = holder.firstElementChild;
  if (!nextModal) return;

  if (existingModal) {
    existingModal.replaceWith(nextModal);
    return;
  }

  app.append(nextModal);
}

function normalizeRangeValue(rangeInput, rawValue) {
  let next = Number(rawValue);
  const fallback = Number(rangeInput.value);
  if (!Number.isFinite(next)) next = Number.isFinite(fallback) ? fallback : 0;

  const min = rangeInput.min !== "" ? Number(rangeInput.min) : null;
  const max = rangeInput.max !== "" ? Number(rangeInput.max) : null;
  const step = rangeInput.step && rangeInput.step !== "any" ? Number(rangeInput.step) : null;

  if (Number.isFinite(min)) next = Math.max(next, min);
  if (Number.isFinite(max)) next = Math.min(next, max);
  if (Number.isFinite(step) && step > 0) {
    const base = Number.isFinite(min) ? min : 0;
    next = Math.round((next - base) / step) * step + base;
  }

  return Number(next.toFixed(6));
}

function enhanceRangeInputs() {
  const ranges = app.querySelectorAll('.field input[type="range"]');
  ranges.forEach((range) => {
    if (!(range instanceof HTMLInputElement)) return;
    if (range.closest(".range-control")) return;

    const field = range.closest(".field");
    const parent = range.parentElement;
    if (!field || !parent) return;

    const control = document.createElement("div");
    control.className = "range-control";

    const numberInput = document.createElement("input");
    numberInput.type = "number";
    numberInput.className = "range-number";
    numberInput.inputMode = "numeric";
    numberInput.value = range.value;
    if (range.min !== "") numberInput.min = range.min;
    if (range.max !== "") numberInput.max = range.max;
    if (range.step !== "") numberInput.step = range.step;

    const label = field.querySelector("label");
    const labelText = label ? label.textContent.replace(/\s+/g, " ").trim() : "Valor";
    numberInput.setAttribute("aria-label", `${labelText} valor numerico`);
    numberInput.title = "Digite um valor numerico";

    parent.insertBefore(control, range);
    control.append(range);
    control.append(numberInput);

    const syncFromRange = () => {
      numberInput.value = range.value;
    };

    numberInput.addEventListener("input", (event) => {
      event.stopPropagation();
      const rawValue = numberInput.value.trim();
      if (!rawValue || rawValue === "-" || rawValue === "+") return;
      const normalized = normalizeRangeValue(range, rawValue);
      range.value = String(normalized);
      range.dispatchEvent(new Event("input", { bubbles: true }));
    });

    numberInput.addEventListener("blur", () => {
      const rawValue = numberInput.value.trim();
      if (!rawValue || rawValue === "-" || rawValue === "+") {
        numberInput.value = range.value;
        return;
      }
      const normalized = normalizeRangeValue(range, rawValue);
      const normalizedText = String(normalized);
      numberInput.value = normalizedText;
      if (range.value !== normalizedText) {
        range.value = normalizedText;
        range.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    range.addEventListener("input", syncFromRange);
    range.addEventListener("change", syncFromRange);
  });
}

function syncHeroProfileBounds() {
  if (!state.auth.logged) return;
  if (!state.ui.heroProfileBounds || typeof state.ui.heroProfileBounds !== "object") {
    state.ui.heroProfileBounds = {};
  }

  let stateChanged = false;
  const heroNodes = app.querySelectorAll(".preview-hero[data-s]");
  heroNodes.forEach((heroNode) => {
    if (!(heroNode instanceof HTMLElement)) return;
    const sectionId = heroNode.dataset.s;
    if (!sectionId) return;
    const section = getSection(sectionId);
    if (!section || section.type !== "hero") return;

    const profileEl = heroNode.querySelector(".preview-profile");
    if (!(profileEl instanceof HTMLElement)) {
      delete state.ui.heroProfileBounds[sectionId];
      return;
    }

    const heroRect = heroNode.getBoundingClientRect();
    const profileRect = profileEl.getBoundingClientRect();
    const heroWidth = heroRect.width;
    const heroHeight = heroRect.height;
    const profileWidth = profileRect.width;
    const profileHeight = profileRect.height;
    if (!(heroWidth > 0 && heroHeight > 0 && profileWidth > 0 && profileHeight > 0)) return;

    const maxX = Math.max(0, Math.floor((heroWidth - profileWidth) / 2));
    const maxY = Math.max(0, Math.floor((heroHeight - profileHeight) / 2));
    state.ui.heroProfileBounds[sectionId] = { maxX, maxY };

    const currentX = Number(section.data.profileOffsetX) || 0;
    const currentY = Number(section.data.profileOffsetY) || 0;
    const clampedX = clamp(currentX, -maxX, maxX);
    const clampedY = clamp(currentY, -maxY, maxY);

    if (clampedX !== currentX) {
      section.data.profileOffsetX = clampedX;
      stateChanged = true;
    }
    if (clampedY !== currentY) {
      section.data.profileOffsetY = clampedY;
      stateChanged = true;
    }

    profileEl.style.transform = `translate(-50%, -50%) translate(${clampedX}px, ${clampedY}px)`;

    const syncAxisInput = (key, maxValue, currentValue) => {
      const selector = `input[type="range"][data-s="${cssEscape(sectionId)}"][data-k="${key}"]`;
      const range = app.querySelector(selector);
      if (!(range instanceof HTMLInputElement)) return;
      const min = String(-maxValue);
      const max = String(maxValue);
      if (range.min !== min) range.min = min;
      if (range.max !== max) range.max = max;
      if (range.value !== String(currentValue)) range.value = String(currentValue);

      const rangeControl = range.closest(".range-control");
      const numberInput = rangeControl ? rangeControl.querySelector(".range-number") : null;
      if (numberInput instanceof HTMLInputElement) {
        if (numberInput.min !== min) numberInput.min = min;
        if (numberInput.max !== max) numberInput.max = max;
        if (numberInput.value !== String(currentValue)) numberInput.value = String(currentValue);
      }
      updateRangeLabel(range);
    };

    syncAxisInput("profileOffsetX", maxX, clampedX);
    syncAxisInput("profileOffsetY", maxY, clampedY);
  });

  if (stateChanged) schedulePersist();
}

function renderPreviewOnly(options = {}) {
  if (!state.auth.logged) {
    render();
    return;
  }

  const keepHeroVisible = Boolean(options.keepHeroVisible);
  const currentPreview = app.querySelector(".preview-area");
  if (!currentPreview) {
    render();
    return;
  }
  const previousScrollTop = currentPreview.scrollTop;

  const holder = document.createElement("div");
  holder.innerHTML = previewTpl({ published: Boolean(state.ui.publishedView) }).trim();
  const nextPreview = holder.firstElementChild;
  if (!nextPreview) {
    render();
    return;
  }

  currentPreview.replaceWith(nextPreview);
  const nextPreviewArea = app.querySelector(".preview-area");
  if (nextPreviewArea) {
    nextPreviewArea.scrollTop = keepHeroVisible ? 0 : previousScrollTop;
  }
  syncHeroProfileBounds();
  syncModalDom();
  schedulePersist();
}

function updateRangeLabel(target) {
  if (!(target instanceof HTMLInputElement) || target.type !== "range") return;
  const rangeControl = target.closest(".range-control");
  const numberInput = rangeControl ? rangeControl.querySelector(".range-number") : null;
  if (numberInput instanceof HTMLInputElement) {
    numberInput.value = target.value;
  }

  const field = target.closest(".field");
  const label = field ? field.querySelector("label") : null;
  if (!label) return;

  label.textContent = label.textContent.replace(/-?\d+px/, `${Number(target.value) || 0}px`);
}

function render(preserveFocus = false) {
  if (state.auth.logged) normalizeCollapsedSections();
  const focusState = preserveFocus ? captureFocusState() : null;
  app.innerHTML = state.auth.logged ? appTpl() : authTpl();
  enhanceRangeInputs();
  syncHeroProfileBounds();
  if (focusState) restoreFocusState(focusState);
  schedulePersist();
}

function onInput(event) {
  const t = event.target;
  updateRangeLabel(t);

  if (t.id === "page-title") {
    state.page.title = t.value;
    renderPreviewOnly();
    return;
  }
  if (t.id === "page-subtitle") {
    state.page.subtitle = t.value;
    renderPreviewOnly();
    return;
  }
  if (t.id === "font-heading") {
    state.page.settings.headingFont = coerceFont(t.value, state.page.settings.headingFont);
    renderPreviewOnly();
    return;
  }
  if (t.id === "font-body") {
    state.page.settings.bodyFont = coerceFont(t.value, state.page.settings.bodyFont);
    renderPreviewOnly();
    return;
  }
  if (t.id === "product-level") {
    state.product.level = coerceLevel(t.value);
    pushToast(`Nivel ativo alterado para ${getLevelConfig(state.product.level).name}.`);
    render(true);
    return;
  }
  if (t.id === "preview-viewport") {
    state.ui.previewViewport = coerceViewport(t.value);
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-visible") {
    state.page.footer.showFooter = t.checked;
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-align") {
    state.page.footer.contentAlign = ["left", "center", "right"].includes(t.value) ? t.value : "left";
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-bg-color") {
    state.page.footer.bgColor = t.value;
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-text-color") {
    state.page.footer.textColor = t.value;
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-title-visible") {
    state.page.footer.showTitle = t.checked;
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-title") {
    state.page.footer.title = t.value;
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-title-offset-x") {
    state.page.footer.footerTitleOffsetX = clamp(Number(t.value) || 0, -600, 600);
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-title-offset-y") {
    state.page.footer.footerTitleOffsetY = clamp(Number(t.value) || 0, -240, 240);
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-content-visible") {
    state.page.footer.showContent = t.checked;
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-content") {
    state.page.footer.content = t.value;
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-content-offset-x") {
    state.page.footer.footerContentOffsetX = clamp(Number(t.value) || 0, -600, 600);
    renderPreviewOnly();
    return;
  }
  if (t.id === "footer-content-offset-y") {
    state.page.footer.footerContentOffsetY = clamp(Number(t.value) || 0, -240, 240);
    renderPreviewOnly();
    return;
  }

  const sectionId = t.dataset.s;
  const key = t.dataset.k;
  if (!sectionId || !key) return;

  const section = getSection(sectionId);
  if (!section) return;

  let value = t.value;
  if (t.dataset.t === "b") {
    value = t.checked;
  } else if (t.dataset.t === "n" || numberKeys.has(key)) {
    value = Number(value);
    if (!Number.isFinite(value)) value = 0;
  }

  if (t.dataset.c && t.dataset.i) {
    const collection = t.dataset.c;
    const item = (section.data[collection] || []).find((it) => it.id === t.dataset.i);
    if (!item) return;
    if (key === "durationDays") value = clamp(Number(value), 0, 365);
    if (key === "weeklyFrequency") value = clamp(Number(value), 0, 7);
    item[key] = value;
  } else {
    if (key === "heroWidth") value = clamp(Number(value), 1, 5000);
    if (key === "heroHeight") value = clamp(Number(value), 0, 5000);
    if ((key === "profileOffsetX" || key === "profileOffsetY") && state.ui.heroProfileBounds?.[sectionId]) {
      const bounds = state.ui.heroProfileBounds[sectionId];
      if (key === "profileOffsetX") value = clamp(Number(value) || 0, -(bounds.maxX || 0), bounds.maxX || 0);
      if (key === "profileOffsetY") value = clamp(Number(value) || 0, -(bounds.maxY || 0), bounds.maxY || 0);
    }
    section.data[key] = value;
  }

  if (key === "bgMode") {
    render(true);
    return;
  }

  renderPreviewOnly({ keepHeroVisible: section.type === "hero" });
}

function onClick(event) {
  if (event.target.id === "services-modal") {
    state.ui.modalSectionId = null;
    render();
    return;
  }

  const btn = event.target.closest("[data-a]");
  if (!btn) {
    if (state.ui.previewAccountOpen && !event.target.closest(".preview-account-popover")) {
      state.ui.previewAccountOpen = false;
      renderPreviewOnly();
    }
    return;
  }

  const action = btn.dataset.a;
  const sectionId = btn.dataset.s;
  const itemId = btn.dataset.i;
  const collection = btn.dataset.c;

  if (state.ui.previewAccountOpen && action !== "toggle-preview-account") {
    state.ui.previewAccountOpen = false;
  }

  if (action === "logout") {
    state.auth.logged = false;
    state.auth.userEmail = "";
    state.ui.modalSectionId = null;
    state.ui.publishedView = false;
    render();
    return;
  }

  if (action === "close-modal") {
    state.ui.modalSectionId = null;
    render();
    return;
  }

  if (action === "toggle-published-view") {
    state.ui.publishedView = !state.ui.publishedView;
    state.ui.modalSectionId = null;
    state.ui.previewAccountOpen = false;
    render();
    return;
  }

  if (action === "set-preview-viewport") {
    state.ui.previewViewport = coerceViewport(btn.dataset.v);
    renderPreviewOnly();
    return;
  }

  if (action === "toggle-preview-account") {
    state.ui.previewAccountOpen = !state.ui.previewAccountOpen;
    renderPreviewOnly();
    return;
  }

  if (action === "toggle-subsec" && sectionId && btn.dataset.sub) {
    const subsectionKey = btn.dataset.sub;
    setSubsectionCollapsed(sectionId, subsectionKey, !isSubsectionCollapsed(sectionId, subsectionKey));
    render();
    return;
  }

  if (action === "toggle-sec" && sectionId) {
    if (isSectionCollapsed(sectionId)) {
      openSectionExclusive(sectionId);
    } else {
      state.ui.collapsedSections[sectionId] = true;
    }
    render();
    return;
  }

  if (action === "add-sec") {
    if (!canAddSection()) {
      pushToast(`Limite do ${currentLevelConfig().name}: ${currentLevelConfig().limits.maxSections} secoes.`);
      render();
      return;
    }
    const select = document.getElementById("new-section-type");
    const type = select ? select.value : "";
    if (!type) {
      pushToast("Todas as secoes disponiveis ja foram inseridas.");
      render();
      return;
    }
    if (hasSectionType(type)) {
      pushToast(`A secao ${SECTION_LABEL[type] || type} ja foi inserida.`);
      render();
      return;
    }
    if (type === "footer") {
      const defaults = createDefaultPage().footer;
      state.page.footer.enabled = true;
      state.page.footer.showFooter = true;
      if (!String(state.page.footer.title || "").trim()) state.page.footer.title = defaults.title;
      if (!String(state.page.footer.content || "").trim()) state.page.footer.content = defaults.content;
      openSectionExclusive(FOOTER_SECTION_ID);
      pushToast("Secao Rodape adicionada.");
      render();
      return;
    }
    const newSection = mkSection(type);
    state.page.sections.push(newSection);
    openSectionExclusive(newSection.id);
    pushToast(`Secao ${SECTION_LABEL[type]} adicionada.`);
    render();
    return;
  }

  if (action === "open-modal") {
    state.ui.modalSectionId = sectionId || null;
    render();
    return;
  }

  if (action === "sec-up" || action === "sec-down") {
    state.page.sections = moveInList(state.page.sections, sectionId, action === "sec-up" ? "up" : "down");
    render();
    return;
  }

  if (action === "rem-sec") {
    state.page.sections = state.page.sections.filter((s) => s.id !== sectionId);
    delete state.ui.collapsedSections[sectionId];
    clearSubsectionCollapseState(sectionId);
    if (state.ui.modalSectionId === sectionId) state.ui.modalSectionId = null;
    render();
    return;
  }

  if (action === "footer-add" || action === "footer-remove") {
    const target = btn.dataset.el;
    const defaults = createDefaultPage().footer;
    if (action === "footer-add") {
      if (target === "footer") {
        state.page.footer.enabled = true;
        state.page.footer.showFooter = true;
      }
      if (target === "title") {
        state.page.footer.showTitle = true;
        if (!String(state.page.footer.title || "").trim()) state.page.footer.title = defaults.title;
      }
      if (target === "content") {
        state.page.footer.showContent = true;
        if (!String(state.page.footer.content || "").trim()) state.page.footer.content = defaults.content;
      }
      state.page.footer.showFooter = true;
      pushToast("Elemento adicionado ao rodape.");
    } else {
      if (target === "footer") {
        state.page.footer.enabled = false;
        state.page.footer.showFooter = false;
        delete state.ui.collapsedSections[FOOTER_SECTION_ID];
      }
      if (target === "title") {
        state.page.footer.showTitle = false;
        state.page.footer.title = "";
      }
      if (target === "content") {
        state.page.footer.showContent = false;
        state.page.footer.content = "";
      }
      pushToast(target === "footer" ? "Rodape removido da pagina." : "Elemento removido do rodape.");
    }
    render();
    return;
  }

  if (!sectionId) return;
  const section = getSection(sectionId);
  if (!section) return;

  if (action === "add-item" && collection) {
    if (!canAddCollectionItem(section, collection)) {
      pushToast(
        `Limite de ${currentLevelConfig().limits.maxCollectionItems} cards por lista no ${currentLevelConfig().name}.`
      );
      render();
      return;
    }
    if (collection === "items" && section.type === "publications") section.data.items.push(mkPublication());
    if (collection === "items" && section.type === "products") section.data.items.push(mkProduct());
    if (collection === "plans" && section.type === "services") section.data.plans.push(mkPlan());
    render();
    return;
  }

  if (action === "rem-item" && collection && itemId) {
    section.data[collection] = (section.data[collection] || []).filter((it) => it.id !== itemId);
    render();
    return;
  }

  if ((action === "item-up" || action === "item-down") && collection && itemId) {
    section.data[collection] = moveInList(
      section.data[collection] || [],
      itemId,
      action === "item-up" ? "up" : "down"
    );
    render();
    return;
  }

  if ((action === "hero-add" || action === "hero-remove") && section.type === "hero") {
    const target = btn.dataset.el;
    const defaults = sectionFactory.hero();

    if (action === "hero-add") {
      if (target === "profile") {
        section.data.showProfile = true;
      }
      if (target === "title") {
        section.data.showTitle = true;
        if (!String(section.data.title || "").trim()) section.data.title = defaults.title;
      }
      if (target === "subtitle") {
        section.data.showSubtitle = true;
        if (!String(section.data.subtitle || "").trim()) section.data.subtitle = defaults.subtitle;
      }
      pushToast("Elemento adicionado ao Hero.");
    } else {
      if (target === "profile") {
        section.data.profileImage = "";
        section.data.showProfile = false;
      }
      if (target === "title") {
        section.data.title = "";
        section.data.showTitle = false;
      }
      if (target === "subtitle") {
        section.data.subtitle = "";
        section.data.showSubtitle = false;
      }
      pushToast("Elemento removido do Hero.");
    }
    render();
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Falha ao ler arquivo."));
    reader.readAsDataURL(file);
  });
}

async function onChange(event) {
  const t = event.target;
  if (t.dataset.a !== "upload-image" || !t.dataset.s) return;

  const section = getSection(t.dataset.s);
  if (!section || section.type !== "hero") return;

  const file = t.files && t.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    pushToast("Selecione um arquivo de imagem.");
    t.value = "";
    return;
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    if (!dataUrl) {
      pushToast("Nao foi possivel carregar a imagem.");
      t.value = "";
      return;
    }

    if (t.dataset.target === "bg") {
      section.data.bgImage = dataUrl;
      section.data.bgMode = "image";
    }
    if (t.dataset.target === "profile") {
      section.data.profileImage = dataUrl;
      section.data.showProfile = true;
    }

    t.value = "";
    pushToast("Imagem carregada com sucesso.");
    render();
  } catch {
    t.value = "";
    pushToast("Falha ao carregar imagem.");
    render();
  }
}

function onSubmit(event) {
  if (event.target.id !== "login-form") return;
  event.preventDefault();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  if (!email || !password) {
    alert("Preencha email e senha.");
    return;
  }
  state.auth.logged = true;
  state.auth.userEmail = email;
  pushToast("Login confirmado.");
  render();
}

app.addEventListener("input", onInput);
app.addEventListener("change", onChange);
app.addEventListener("click", onClick);
app.addEventListener("submit", onSubmit);

render();
