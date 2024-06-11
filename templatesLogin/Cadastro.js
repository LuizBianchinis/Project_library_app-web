document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registrationForm').addEventListener('submit', async function(event) {
        event.preventDefault(); 

        // Fetch form values
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const birthday = document.getElementById('birthday').value;
        const address = document.getElementById('address').value;
        const number = document.getElementById('number').value;
        const zip_code = document.getElementById('zip_code').value;

        const formData = {
            firstName,
            lastName,
            phone,
            email,
            password,
            birthday,
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
        
          } catch (error) {
            console.error('Erro ao fazer a requisição:', error);
            alert('Erro ao fazer cadastro. Por favor, tente novamente.');
          }
    });
});
