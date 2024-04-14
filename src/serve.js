const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  
});

connection.connect();

// Função para verificar usuário e senha no banco de dados
function checkUserAndPassword(email, senha, callback) {
  const queryString = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  connection.query(queryString, [email, senha], (error, results, fields) => {
    if (error) {
      console.log('Erro ao verificar usuário e senha:', error);
      return callback(error, null);
    }
    // Se houver um usuário com o email e senha fornecidos, retorna true
    if (results.length > 0) {
      return callback(null, true);
    } else {
      // Caso contrário, retorna false
      return callback(null, false);
    }
  });
}

app.post('/cadastro', (req, res) => {
    const { nome, email, telefone, senha ,madrinha} = req.body;
  
    // Verifica se já existe um usuário com o email fornecido
    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
      if (error) {
        console.log('Erro ao verificar email:', error);
        res.sendStatus(500);
        return;
      }
  
      // Se já houver um usuário com o email fornecido, envia um status 400 (Bad Request)
      if (results.length > 0) {
        console.log('Email já cadastrado.');
        res.status(400).send('Email já cadastrado.');
        return;
      }
  
     
      connection.query('SELECT * FROM usuarios WHERE telefone = ?', [telefone], (error, results) => {
        if (error) {
          console.log('Erro ao verificar telefone:', error);
          res.sendStatus(500);
          return;
        }
  
        
        if (results.length > 0) {
          console.log('Telefone já cadastrado.');
          res.status(400).send('Telefone já cadastrado.');
          return;
        }
        const queryString = 'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)';
        connection.query(queryString, [nome, email, telefone, senha,madrinha], (error, results, fields) => {
          if (error) {
            console.log('Erro ao inserir usuário:', error);
            res.sendStatus(500);
            return;
          }
          console.log('Usuário inserido com sucesso!');
          res.sendStatus(200);
        });
      });
    });
  });
  

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    console.log('Email e senha são obrigatórios.');
    return res.status(400).send('Email e senha são obrigatórios.');
  }

  // Chama a função checkUserAndPassword para verificar o login
  checkUserAndPassword(email, senha, (error, result) => {
    if (error) {
      console.log('Erro ao verificar usuário e senha:', error);
      return res.status(500).send('Erro ao verificar usuário e senha.');
    }
    if (!result) {
      console.log('Credenciais inválidas.');
      return res.status(401).send('Credenciais inválidas.');
    }
    console.log('Login bem-sucedido!');
    return res.sendStatus(200);
  });
});

app.listen(3120, () => {
  console.log('Servidor está ouvindo na porta 3120');
});
