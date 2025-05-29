import nodemailer from "nodemailer";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const resetCodes = new Map();

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export const sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "E-mail é obrigatório." });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    const code = generateCode();
    resetCodes.set(email, code);

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
  subject: "Recuperação de Senha - Two",
  text: `
Olá!

Recebemos uma solicitação para redefinir a senha da sua conta no Two.

Seu código de recuperação é: ${code}

Se você não solicitou a redefinição de senha, ignore este e-mail com segurança. Nenhuma ação será realizada.

Este código é válido por 10 minutos.

Atenciosamente,
Equipe Two
  `,
  html: `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
    <h2>Olá!</h2>
    <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Two</strong>.</p>
    <p>Seu código de recuperação é:</p>
    <h3 style="color:rgb(255, 0, 0); font-size: 24px;">${code}</h3>
    <p>Este código é válido por <strong>10 minutos</strong>.</p>
    <p>Se você não solicitou a redefinição de senha, ignore este e-mail com segurança. Nenhuma ação será realizada.</p>
    <br>
    <p>Atenciosamente,<br><strong>Equipe Two</strong></p>
  </div>
  `
});


    res.json({ message: "Código de recuperação enviado para o e-mail." });
  } catch (error) {
    console.error("Erro ao enviar código de recuperação:", error);
    res.status(500).json({ error: "Erro ao enviar código de recuperação." });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ error: "E-mail e código são obrigatórios." });

    const valid = resetCodes.get(email) === code;
    if (valid) {
      resetCodes.delete(email);
      return res.json({ verified: true });
    }
    res.status(400).json({ verified: false, error: "Código inválido." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar código." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(400).json({ error: "E-mail e nova senha são obrigatórios." });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "A nova senha deve ter pelo menos 8 caracteres." });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.senha = hash;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao redefinir senha." });
  }
};
