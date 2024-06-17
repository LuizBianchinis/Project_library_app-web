async function hashPassword(login, password) {
  // Importa o módulo Crypto para gerar a hash
  const { crypto } = window;

  // Converte a senha em bytes
  const passwordBytes = new TextEncoder().encode(login + password);

  // Gera a hash usando o algoritmo SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBytes);

  // Converte a hash para uma string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

async function loginUser(email, password) {
  const url = 'http://127.0.0.1:5000/v1/auth/login'; 
  
  try {
    console.log('Hashing password...');
    const hashedPassword = await hashPassword(email, password);
    console.log('Password hashed:', hashedPassword);

    const requestBody = {
      email, // Inclui o email no corpo da solicitação
      hash: hashedPassword
    };

    console.log('Request body:', requestBody); // Log para depuração

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Server response status:', response.status);
    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData);

    alert(responseData.message);

  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    alert('Erro ao fazer login. Por favor, tente novamente.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Form submitted with email:', email, 'and password:', password);

    loginUser(email, password);
  });
});
