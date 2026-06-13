const adminState = {
  content: getSiteContent(),
  activeSection: "hero"
};

const schemas = {
  hero: {
    title: "Hero",
    fields: [
      { path: "description", label: "Small description", type: "textarea" },
      { path: "primaryCta", label: "Primary CTA", type: "text" },
      { path: "secondaryCta", label: "Secondary CTA", type: "text" }
    ],
    lists: [
      { path: "sentences", label: "Hero sentences", item: "string" }
    ]
  },
  proof: {
    title: "Proof Bar",
    fields: [{ path: "note", label: "Proof note", type: "textarea" }],
    lists: [{ path: "metrics", label: "Metrics", fields: ["value", "label"] }]
  },
  problem: {
    title: "Problem Section",
    fields: [
      { path: "eyebrow", label: "Eyebrow", type: "text" },
      { path: "title", label: "Title", type: "textarea" }
    ],
    lists: [{ path: "points", label: "Problem points", item: "string" }]
  },
  approach: {
    title: "Approach Process",
    fields: [
      { path: "eyebrow", label: "Eyebrow", type: "text" },
      { path: "title", label: "Title", type: "textarea" }
    ],
    lists: [{ path: "steps", label: "Process steps", fields: ["number", "title", "text"] }]
  },
  servicesPreview: {
    title: "Homepage Services",
    fields: [
      { path: "eyebrow", label: "Eyebrow", type: "text" },
      { path: "title", label: "Title", type: "textarea" }
    ],
    lists: [{ path: "items", label: "Service cards", fields: ["title", "text"] }]
  },
  casesPreview: {
    title: "Homepage Case Studies",
    fields: [
      { path: "eyebrow", label: "Eyebrow", type: "text" },
      { path: "title", label: "Title", type: "textarea" }
    ],
    lists: [{ path: "items", label: "Case cards", fields: ["tag", "title", "challenge", "strategy", "metric"] }]
  },
  why: {
    title: "Why Work With Me",
    fields: [
      { path: "eyebrow", label: "Eyebrow", type: "text" },
      { path: "title", label: "Title", type: "textarea" }
    ],
    lists: [{ path: "points", label: "Differentiators", item: "string" }]
  },
  leadMagnet: {
    title: "Lead Magnet",
    fields: [
      { path: "eyebrow", label: "Eyebrow", type: "text" },
      { path: "title", label: "Title", type: "textarea" },
      { path: "text", label: "Text", type: "textarea" },
      { path: "cta", label: "CTA", type: "text" }
    ]
  },
  finalCta: {
    title: "Final CTA",
    fields: [
      { path: "title", label: "Title", type: "textarea" },
      { path: "text", label: "Text", type: "textarea" },
      { path: "cta", label: "CTA", type: "text" }
    ]
  },
  global: {
    title: "Global Details",
    fields: [
      { path: "brandName", label: "Brand name", type: "text" },
      { path: "footerText", label: "Footer description", type: "textarea" },
      { path: "whatsapp", label: "WhatsApp number", type: "text" },
      { path: "location", label: "Location", type: "text" },
      { path: "serviceArea", label: "Service area", type: "text" }
    ]
  }
};

const form = document.querySelector("[data-admin-form]");
const saveButton = document.querySelector("[data-admin-save]");
const tabButtons = [...document.querySelectorAll("[data-admin-tab]")];

const getSection = () => adminState.content[adminState.activeSection];

const updateTabs = () => {
  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.adminTab === adminState.activeSection);
  });
};

const inputField = (field, value) => {
  const tag = field.type === "textarea" ? "textarea" : "input";
  const valueAttr = tag === "input" ? ` value="${String(value || "").replace(/"/g, "&quot;")}"` : "";
  return `<label><span>${field.label}</span><${tag} data-field="${field.path}"${valueAttr}>${tag === "textarea" ? value || "" : ""}</${tag}></label>`;
};

const renderListEditor = (listSchema, items) => {
  const itemRows = (items || []).map((item, index) => {
    if (listSchema.item === "string") {
      return `<article class="admin-list-item"><textarea data-list="${listSchema.path}" data-index="${index}">${item || ""}</textarea><button type="button" class="admin-danger" data-remove="${listSchema.path}" data-index="${index}">Delete</button></article>`;
    }

    const fields = listSchema.fields.map((field) => {
      const value = item[field] || "";
      return `<label><span>${field}</span><textarea data-list="${listSchema.path}" data-index="${index}" data-key="${field}">${value}</textarea></label>`;
    }).join("");

    return `<article class="admin-list-item">${fields}<button type="button" class="admin-danger" data-remove="${listSchema.path}" data-index="${index}">Delete</button></article>`;
  }).join("");

  return `<section class="admin-editor-block"><div class="admin-list-head"><h3>${listSchema.label}</h3><button type="button" data-add="${listSchema.path}">Add Item</button></div><div class="admin-list">${itemRows}</div></section>`;
};

const renderDataTools = () => {
  form.innerHTML = `
    <section class="admin-editor-block">
      <h2>Import / Export Content</h2>
      <textarea class="admin-json" data-json-output>${JSON.stringify(adminState.content, null, 2)}</textarea>
      <div class="admin-actions">
        <button class="button secondary" type="button" data-copy-json>Copy JSON</button>
        <button class="button secondary" type="button" data-import-json>Import JSON</button>
        <button class="button secondary" type="button" data-reset-content>Reset Default</button>
      </div>
    </section>
  `;
};

const renderForm = () => {
  updateTabs();

  if (adminState.activeSection === "data") {
    renderDataTools();
    return;
  }

  const schema = schemas[adminState.activeSection];
  const section = getSection();
  const fields = (schema.fields || []).map((field) => inputField(field, section[field.path])).join("");
  const lists = (schema.lists || []).map((list) => renderListEditor(list, section[list.path])).join("");

  form.innerHTML = `<section class="admin-editor-block"><h2>${schema.title}</h2><div class="admin-grid">${fields}</div></section>${lists}`;
};

const commitFormValues = () => {
  if (adminState.activeSection === "data") return;
  const section = getSection();

  form.querySelectorAll("[data-field]").forEach((input) => {
    section[input.dataset.field] = input.value;
  });

  form.querySelectorAll("[data-list]").forEach((input) => {
    const list = section[input.dataset.list];
    const index = Number(input.dataset.index);
    if (!Array.isArray(list) || !list[index]) return;

    if (input.dataset.key) {
      list[index][input.dataset.key] = input.value;
    } else {
      list[index] = input.value;
    }
  });
};

const addItem = (path) => {
  commitFormValues();
  const schema = schemas[adminState.activeSection].lists.find((list) => list.path === path);
  const list = getSection()[path];

  if (schema.item === "string") {
    list.push("New item");
  } else {
    list.push(Object.fromEntries(schema.fields.map((field) => [field, ""])));
  }

  renderForm();
};

const removeItem = (path, index) => {
  commitFormValues();
  getSection()[path].splice(index, 1);
  renderForm();
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    commitFormValues();
    adminState.activeSection = button.dataset.adminTab;
    renderForm();
  });
});

form.addEventListener("input", () => commitFormValues());

form.addEventListener("click", async (event) => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-remove]");
  const copyButton = event.target.closest("[data-copy-json]");
  const importButton = event.target.closest("[data-import-json]");
  const resetButton = event.target.closest("[data-reset-content]");

  if (addButton) addItem(addButton.dataset.add);
  if (removeButton) removeItem(removeButton.dataset.remove, Number(removeButton.dataset.index));
  if (copyButton) await navigator.clipboard.writeText(JSON.stringify(adminState.content, null, 2));
  if (importButton) {
    const output = form.querySelector("[data-json-output]");
    adminState.content = mergeContent(defaultSiteContent, JSON.parse(output.value));
    renderForm();
  }
  if (resetButton) {
    adminState.content = cloneContent(defaultSiteContent);
    renderForm();
  }
});

saveButton.addEventListener("click", () => {
  commitFormValues();
  saveSiteContent(adminState.content);
  saveButton.textContent = "Saved";
  window.setTimeout(() => {
    saveButton.textContent = "Save Changes";
  }, 1200);
});

renderForm();
