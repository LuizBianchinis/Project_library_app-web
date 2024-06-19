document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('cadastro').addEventListener('submit', async function(event) {
      event.preventDefault(); 

      // Fetch form values
      const first_name = document.getElementById('first_name').value;
      const last_name = document.getElementById('last_name').value;
      const cellphone = document.getElementById('cellphone').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const birth_date = document.getElementById('birth_date').value;
      const address = document.getElementById('address').value;
      const number = document.getElementById('number').value;
      const zip_code = document.getElementById('zip_code').value;

      const formData = {
          first_name,
          last_name,
          cellphone,
          email,
          password,
          birth_date,
          address,
          number,
          zip_code
      };

      console.log('Dados do formulário:', formData);

      const url = 'http://127.0.0.1:5000/v1/user/register';
      
      try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
      
          if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
          }
      
          const responseData = await response.json();
          console.log(responseData);
      
          alert(responseData.message);

          // Redireciona para a página de login após o cadastro bem-sucedido
          window.location.href = '/views/login.html';
      
        } catch (error) {
          console.error('Erro ao fazer a requisição:', error);
          alert('Erro ao fazer cadastro. Por favor, tente novamente.');
        }
  });
});
