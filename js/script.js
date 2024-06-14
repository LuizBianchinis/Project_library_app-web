document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    // Aqui você pode adicionar a lógica para verificar as credenciais e redirecionar o usuário
    // Exemplo básico:
    if (username === "usuario" && password === "senha") {
        alert("Login bem-sucedido!");
        // Redirecionar para outra página, por exemplo:
        // window.location.href = "dashboard.html";
    } else {
        alert("Credenciais inválidas. Por favor, tente novamente.");
    }
});
