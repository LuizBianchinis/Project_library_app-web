async function hashPassword(login, password) {
  const { crypto } = window;
  const passwordBytes = new TextEncoder().encode(login + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBytes);
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
      email, 
      hash: hashedPassword
    };

    console.log('Request body:', requestBody);

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

    // Configura os cookies com o user_id e role e redireciona se login bem-sucedido
    if (responseData.data) {
      setCookie('user_id', responseData.data.user_id, 1); // Define o cookie por 1 dia
      setCookie('role', responseData.data.role, 1); // Define o cookie por 1 dia
      
      // Redireciona para a página desejada
      window.location.href = './inicial_user.html'; // Substitua pelo caminho da página de destino
    } else {
      alert('Erro ao fazer login. Dados não recebidos.');
    }

  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    alert('Erro ao fazer login. Por favor, tente novamente.');
  }
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
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
