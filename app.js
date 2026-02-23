const app = document.getElementById("app");

const SECTION_LABEL = {
  hero: "Hero",
  description: "Descricao/Introducao",
  publications: "Publicacoes",
  products: "Produtos",
  services: "Servicos"
};

const numberKeys = new Set([
  "profileSize",
  "titleSize",
  "titleWeight",
  "subtitleSize",
  "subtitleWeight",
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
    bgColor: "#0e7490",
    bgImage: "",
    profileImage: "",
    profileSize: 120,
    title: "Seu Nome Profissional",
    subtitle: "Especialista em resultado rapido com pagina personalizada",
    titleColor: "#ffffff",
    titleSize: 42,
    titleWeight: 700,
    subtitleColor: "#d1fae5",
    subtitleSize: 19,
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

const state = {
  auth: { logged: false, userEmail: "" },
  page: {
    title: "Minha Pagina Profissional",
    subtitle: "Edite as secoes no painel e veja o resultado em tempo real.",
    sections: [mkSection("hero"), mkSection("description"), mkSection("products"), mkSection("services")],
    footer: {
      title: "Contato",
      content: "WhatsApp: (00) 00000-0000\nInstagram: @seu_perfil\nEmail: contato@seusite.com"
    }
  },
  ui: { modalSectionId: null, toast: "" }
};

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

function sectionControls(sectionId, index, total) {
  return `
    <div class="section-actions">
      <button class="btn btn-muted" data-a="sec-up" data-s="${sectionId}" ${index === 0 ? "disabled" : ""}>↑</button>
      <button class="btn btn-muted" data-a="sec-down" data-s="${sectionId}" ${index === total - 1 ? "disabled" : ""}>↓</button>
      <button class="btn btn-danger" data-a="rem-sec" data-s="${sectionId}">Remover</button>
    </div>
  `;
}

function editorHero(section, index, total) {
  const d = section.data;
  const showColor = d.bgMode === "color" ? "" : "hidden";
  const showImage = d.bgMode === "image" ? "" : "hidden";
  const titleWeightOpts = [300, 400, 500, 600, 700, 800]
    .map((w) => `<option value="${w}" ${Number(d.titleWeight) === w ? "selected" : ""}>${w}</option>`)
    .join("");
  const subtitleWeightOpts = [300, 400, 500, 600, 700]
    .map((w) => `<option value="${w}" ${Number(d.subtitleWeight) === w ? "selected" : ""}>${w}</option>`)
    .join("");
  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Secao Hero</h3>
        ${sectionControls(section.id, index, total)}
      </header>
      <div class="field-row">
        <div class="field">
          <label>Fundo</label>
          <select data-s="${section.id}" data-k="bgMode">
            <option value="color" ${d.bgMode === "color" ? "selected" : ""}>Cor</option>
            <option value="image" ${d.bgMode === "image" ? "selected" : ""}>Imagem (URL)</option>
          </select>
        </div>
        <div class="field ${showColor}">
          <label>Cor de fundo</label>
          <input type="color" data-s="${section.id}" data-k="bgColor" value="${esc(d.bgColor)}" />
        </div>
        <div class="field ${showImage}">
          <label>Imagem de fundo (URL)</label>
          <input type="text" data-s="${section.id}" data-k="bgImage" value="${esc(d.bgImage)}" placeholder="https://..." />
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Imagem de perfil (URL)</label>
          <input type="text" data-s="${section.id}" data-k="profileImage" value="${esc(d.profileImage)}" placeholder="https://..." />
        </div>
        <div class="field">
          <label>Tamanho da imagem de perfil (px)</label>
          <input type="number" min="40" max="340" data-s="${section.id}" data-k="profileSize" data-t="n" value="${Number(d.profileSize)}" />
        </div>
      </div>
      <div class="field">
        <label>Titulo</label>
        <input type="text" data-s="${section.id}" data-k="title" value="${esc(d.title)}" />
      </div>
      <div class="field-row">
        <div class="field">
          <label>Cor do titulo</label>
          <input type="color" data-s="${section.id}" data-k="titleColor" value="${esc(d.titleColor)}" />
        </div>
        <div class="field">
          <label>Tamanho do titulo (px)</label>
          <input type="number" min="20" max="86" data-s="${section.id}" data-k="titleSize" data-t="n" value="${Number(d.titleSize)}" />
        </div>
        <div class="field">
          <label>Peso do titulo</label>
          <select data-s="${section.id}" data-k="titleWeight" data-t="n">${titleWeightOpts}</select>
        </div>
      </div>
      <div class="field">
        <label>Subtitulo</label>
        <input type="text" data-s="${section.id}" data-k="subtitle" value="${esc(d.subtitle)}" />
      </div>
      <div class="field-row">
        <div class="field">
          <label>Cor do subtitulo</label>
          <input type="color" data-s="${section.id}" data-k="subtitleColor" value="${esc(d.subtitleColor)}" />
        </div>
        <div class="field">
          <label>Tamanho do subtitulo (px)</label>
          <input type="number" min="12" max="54" data-s="${section.id}" data-k="subtitleSize" data-t="n" value="${Number(d.subtitleSize)}" />
        </div>
        <div class="field">
          <label>Peso do subtitulo</label>
          <select data-s="${section.id}" data-k="subtitleWeight" data-t="n">${subtitleWeightOpts}</select>
        </div>
      </div>
    </article>
  `;
}

function editorDescription(section, index, total) {
  const d = section.data;
  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Secao Descricao/Introducao</h3>
        ${sectionControls(section.id, index, total)}
      </header>
      <div class="field">
        <label>Titulo da secao</label>
        <input type="text" data-s="${section.id}" data-k="title" value="${esc(d.title)}" />
      </div>
      <div class="field">
        <label>Texto</label>
        <textarea data-s="${section.id}" data-k="text">${esc(d.text)}</textarea>
      </div>
    </article>
  `;
}

function editorPublications(section, index, total) {
  const d = section.data;
  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Secao Publicacoes</h3>
        ${sectionControls(section.id, index, total)}
      </header>
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
      <button class="btn btn-outline" data-a="add-item" data-s="${section.id}" data-c="items">Adicionar publicacao</button>
    </article>
  `;
}

function editorProducts(section, index, total) {
  const d = section.data;
  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Secao Produtos</h3>
        ${sectionControls(section.id, index, total)}
      </header>
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
      <button class="btn btn-outline" data-a="add-item" data-s="${section.id}" data-c="items">Adicionar produto</button>
    </article>
  `;
}

function editorServices(section, index, total) {
  const d = section.data;
  return `
    <article class="section-card">
      <header class="section-card-header">
        <h3 class="section-card-title">Secao Servicos</h3>
        ${sectionControls(section.id, index, total)}
      </header>
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
      <button class="btn btn-outline" data-a="add-item" data-s="${section.id}" data-c="plans">Adicionar plano</button>
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

function panelTpl() {
  return `
    <aside class="builder-panel">
      <div class="builder-header">
        <div>
          <h2 class="builder-title">Page Builder - Nivel 1</h2>
          <p class="builder-subtitle">Usuario: ${esc(state.auth.userEmail)}</p>
        </div>
        <button class="btn btn-outline" data-a="logout">Sair</button>
      </div>

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
            <option value="hero">Hero</option>
            <option value="description">Descricao/Introducao</option>
            <option value="publications">Publicacoes</option>
            <option value="products">Produtos</option>
            <option value="services">Servicos</option>
          </select>
        </div>
        <div class="field" style="align-self:end;">
          <button class="btn btn-primary" data-a="add-sec">Adicionar</button>
        </div>
      </div>

      <div class="section-list">
        ${state.page.sections.map((section, i) => editorByType(section, i, state.page.sections.length)).join("")}
      </div>

      <article class="section-card">
        <header class="section-card-header">
          <h3 class="section-card-title">Rodape editavel</h3>
        </header>
        <div class="field">
          <label>Titulo do rodape</label>
          <input id="footer-title" type="text" value="${esc(state.page.footer.title)}" />
        </div>
        <div class="field">
          <label>Conteudo (contatos e outros)</label>
          <textarea id="footer-content">${esc(state.page.footer.content)}</textarea>
        </div>
      </article>
    </aside>
  `;
}

function previewHero(section) {
  const d = section.data;
  const bg =
    d.bgMode === "image" && d.bgImage
      ? `background-image:url('${esc(d.bgImage)}');background-size:cover;background-position:center;`
      : `background:${esc(d.bgColor || "#0e7490")};`;
  return `
    <section class="preview-hero" style="${bg}">
      <div class="preview-hero-overlay"></div>
      <div class="preview-hero-content">
        <img class="preview-profile" style="width:${Number(d.profileSize)}px;height:${Number(d.profileSize)}px" src="${d.profileImage || "https://via.placeholder.com/300x300.png?text=Perfil"}" alt="Perfil" />
        <h1 style="margin:0;color:${esc(d.titleColor)};font-size:${Number(d.titleSize)}px;font-weight:${Number(d.titleWeight)};">${esc(d.title)}</h1>
        <p style="margin:0;color:${esc(d.subtitleColor)};font-size:${Number(d.subtitleSize)}px;font-weight:${Number(d.subtitleWeight)};max-width:680px;">${esc(d.subtitle)}</p>
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

function previewSection(section) {
  if (section.type === "hero") return previewHero(section);
  if (section.type === "description") return previewDescription(section);
  if (section.type === "publications") return previewPublications(section);
  if (section.type === "products") return previewProducts(section);
  return previewServices(section);
}

function previewTpl() {
  return `
    <section class="preview-area">
      <div class="preview-shell">
        <header class="preview-topbar">
          <div>
            <strong>${esc(state.page.title)}</strong>
            <div style="font-size:0.86rem;color:var(--text-soft)">${esc(state.page.subtitle)}</div>
          </div>
          <span style="font-size:0.84rem;color:var(--text-soft)">Preview responsivo</span>
        </header>
        <main class="preview-page">
          ${
            state.page.sections.length
              ? state.page.sections.map((section) => previewSection(section)).join("")
              : '<div class="empty-state">Adicione secoes para comecar.</div>'
          }
        </main>
        <footer class="preview-footer">
          <h3>${esc(state.page.footer.title)}</h3>
          <p>${esc(state.page.footer.content)}</p>
        </footer>
      </div>
    </section>
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
  return `
    <div class="app-layout">
      ${panelTpl()}
      ${previewTpl()}
    </div>
    ${modalTpl()}
    ${state.ui.toast ? `<div class="toast">${esc(state.ui.toast)}</div>` : ""}
  `;
}

function render() {
  app.innerHTML = state.auth.logged ? appTpl() : authTpl();
}

function onInput(event) {
  const t = event.target;

  if (t.id === "page-title") {
    state.page.title = t.value;
    render();
    return;
  }
  if (t.id === "page-subtitle") {
    state.page.subtitle = t.value;
    render();
    return;
  }
  if (t.id === "footer-title") {
    state.page.footer.title = t.value;
    render();
    return;
  }
  if (t.id === "footer-content") {
    state.page.footer.content = t.value;
    render();
    return;
  }

  const sectionId = t.dataset.s;
  const key = t.dataset.k;
  if (!sectionId || !key) return;

  const section = getSection(sectionId);
  if (!section) return;

  let value = t.value;
  if (t.dataset.t === "n" || numberKeys.has(key)) {
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
    section.data[key] = value;
  }

  render();
}

function onClick(event) {
  if (event.target.id === "services-modal") {
    state.ui.modalSectionId = null;
    render();
    return;
  }

  const btn = event.target.closest("[data-a]");
  if (!btn) return;

  const action = btn.dataset.a;
  const sectionId = btn.dataset.s;
  const itemId = btn.dataset.i;
  const collection = btn.dataset.c;

  if (action === "logout") {
    state.auth.logged = false;
    state.auth.userEmail = "";
    state.ui.modalSectionId = null;
    render();
    return;
  }

  if (action === "close-modal") {
    state.ui.modalSectionId = null;
    render();
    return;
  }

  if (action === "add-sec") {
    const select = document.getElementById("new-section-type");
    const type = select ? select.value : "description";
    state.page.sections.push(mkSection(type));
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
    if (state.ui.modalSectionId === sectionId) state.ui.modalSectionId = null;
    render();
    return;
  }

  if (!sectionId) return;
  const section = getSection(sectionId);
  if (!section) return;

  if (action === "add-item" && collection) {
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
app.addEventListener("click", onClick);
app.addEventListener("submit", onSubmit);

render();
