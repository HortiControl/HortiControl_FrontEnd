export function validarNomeCompleto(nome) {
  if (!nome.trim()) {
    return "Digite seu nome completo.";
  }

  if (!/^[A-Za-zÀ-ú\s]+$/.test(nome.trim()) || /[çÇ]/.test(nome)) {
    return "O nome deve conter apenas letras.";
  }

  return null;
}

export function validarTelefone(telefone) {
  if (telefone && !/^\d{0,11}$/.test(telefone)) {
    return "O telefone deve conter apenas números e no máximo 11 dígitos.";
  }

  return null;
}

export function validarTelefoneCadastro(telefone) {
  const telefoneLimpo = String(telefone || "").trim();

  if (!telefoneLimpo) {
    return null;
  }

  if (!/^\d+$/.test(telefoneLimpo)) {
    return "O telefone deve conter apenas números.";
  }

  if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    return "O telefone deve ter 10 ou 11 dígitos.";
  }

  return null;
}

export function validarEmail(email) {
  if (!email.trim()) {
    return "Digite um e-mail.";
  }

  const emailLimpo = email.trim();

  if (
    !emailLimpo.includes("@") ||
    !emailLimpo.includes(".") ||
    emailLimpo.startsWith("@") ||
    emailLimpo.endsWith("@") ||
    emailLimpo.endsWith(".")
  ) {
    return "Digite um e-mail válido.";
  }

  return null;
}

export function validarSenhaForte(senha) {
  if (senha.length < 5) {
    return "A senha deve ter no mínimo 5 caracteres.";
  }

  if (!/^[a-zA-Z0-9]+$/.test(senha)) {
    return "A senha não pode conter caracteres especiais.";
  }

  return null;
}

export function validarNovaSenha(novaSenha, confirmacao) {
  if (novaSenha !== confirmacao) {
    return "A nova senha e a confirmação não batem.";
  }

  return validarSenhaForte(novaSenha);
}
