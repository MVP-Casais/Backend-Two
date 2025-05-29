import nodemailer from "nodemailer";
import User from "../models/user.js";

const codes = new Map();

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "E-mail é obrigatório." });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado." });

    const code = generateCode();
    codes.set(email, code);

    // Use configuração SMTP ao invés de 'service: gmail'
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Two" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Código de Verificação - Two",
      text: `
Seja bem-vindo(a), ${user.nome}!

Recebemos uma solicitação para verificar este endereço de e-mail no Two.

Seu código de verificação é: ${code}

Se você não solicitou este código, pode ignorar esta mensagem com segurança.

Atenciosamente,  
Equipe Two App
  `,
      html: `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Seja bem-vindo(a), ${user.nome}!</h2>
    <p>Recebemos uma solicitação para verificar este endereço de e-mail no <strong>Two</strong>.</p>
    <p>Seu código de verificação é:</p>
    <h3 style="color:rgb(255, 0, 0);">${code}</h3>
    <p>Se você não solicitou este código, pode ignorar esta mensagem com segurança.</p>
    <br>
    <p>Atenciosamente,<br><strong>Equipe Two</strong></p>
  </div>
  `,
    });

    res.json({ message: "Código enviado para o e-mail." });
  } catch (error) {
    console.error("Erro ao enviar código:", error);
    res.status(500).json({ error: "Erro ao enviar código." });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res
        .status(400)
        .json({ error: "E-mail e código são obrigatórios." });

    const valid = codes.get(email) === code;
    if (valid) {
      codes.delete(email);
      return res.json({ verified: true });
    }
    res.status(400).json({ verified: false, error: "Código inválido." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar código." });
  }
};
