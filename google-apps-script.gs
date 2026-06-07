const SHEET_NAME = "Growth Audit Leads";
const NOTIFY_EMAIL = ""; // Optional: add your email address here.

function doPost(e) {
  try {
    const sheet = getLeadSheet_();
    const data = e.parameter || {};

    const row = [
      new Date(),
      data.name || "",
      data.business || "",
      data.phone || "",
      data.email || "",
      data.city || "",
      data.budget || "",
      data.link || "",
      data.challenge || "",
      data.pageUrl || "",
      data.submittedAt || ""
    ];

    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New Growth Audit Request",
        htmlBody: buildEmailBody_(data)
      });
    }

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function doGet() {
  return json_({ ok: true, message: "Growth audit form endpoint is live." });
}

function getLeadSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Business name",
      "Phone / WhatsApp",
      "Email",
      "City",
      "Monthly ad budget",
      "Website or Instagram link",
      "Current challenge",
      "Page URL",
      "Submitted at"
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function buildEmailBody_(data) {
  return `
    <h2>New Growth Audit Request</h2>
    <p><strong>Name:</strong> ${escapeHtml_(data.name)}</p>
    <p><strong>Business:</strong> ${escapeHtml_(data.business)}</p>
    <p><strong>Phone / WhatsApp:</strong> ${escapeHtml_(data.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml_(data.email)}</p>
    <p><strong>City:</strong> ${escapeHtml_(data.city)}</p>
    <p><strong>Budget:</strong> ${escapeHtml_(data.budget)}</p>
    <p><strong>Link:</strong> ${escapeHtml_(data.link)}</p>
    <p><strong>Challenge:</strong><br>${escapeHtml_(data.challenge)}</p>
    <p><strong>Page URL:</strong> ${escapeHtml_(data.pageUrl)}</p>
  `;
}

function escapeHtml_(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
