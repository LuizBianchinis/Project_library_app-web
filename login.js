async function loginUser(email, password) {
    const url = 'http://127.0.0.1:5000/v1/auth/login'; // Substitua pela URL da sua API
    
    const requestBody = {
      email: email,
      password: password
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  }
  
  