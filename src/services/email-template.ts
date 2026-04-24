export default function EmailHtml(name: string, resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="background:#0c0f14;font-family:sans-serif;padding:40px 20px;margin:0">
        <div style="max-width:480px;margin:0 auto;background:#0e1117;border-radius:16px;padding:40px;border:1px solid rgba(255,255,255,0.08)">
          <div style="margin-bottom:32px">
            <span style="background:#f59e0b;color:#000;font-weight:900;padding:6px 12px;border-radius:8px;font-size:14px;letter-spacing:0.1em">
              KBYR
            </span>
          </div>
          <h1 style="color:#fff;font-size:24px;font-weight:900;margin:0 0 8px;text-transform:uppercase;letter-spacing:-0.02em">
            Reset your password
          </h1>
          <p style="color:rgba(255,255,255,0.4);font-size:14px;line-height:1.6;margin:0 0 32px">
            Hi ${name}, we received a request to reset your password. Click the button below — this link expires in <strong style="color:rgba(255,255,255,0.6)">1 hour</strong>.
          </p>
          
            href="${resetUrl}"
            style="display:inline-block;background:#f59e0b;color:#000;font-weight:700;font-size:13px;text-decoration:none;padding:14px 28px;border-radius:12px;text-transform:uppercase;letter-spacing:0.1em"
          >
            Reset Password →
          </a>
          <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:32px 0 0;line-height:1.6">
            If you didn't request this, you can safely ignore this email. Your password won't change.
            <br/><br/>
            Or paste this link into your browser:<br/>
            <span style="color:rgba(255,255,255,0.35);word-break:break-all">${resetUrl}</span>
          </p>
        </div>
      </body>
    </html>
  `;
}
