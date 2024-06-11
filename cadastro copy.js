document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); 


    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const birthday = document.getElementById('birthday').value;
    const address = document.getElementById('address').value;

    const formData = {
        firstName,
        lastName,
        phone,
        email,
        password,
        birthday,
        address
    };


    console.log('Dados do formulário:', formData);

    alert('Cadastro realizado com sucesso!');
});
