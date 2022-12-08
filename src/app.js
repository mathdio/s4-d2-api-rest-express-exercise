const { json } = require('express');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();

app.use(express.json());

const moviesPath = path.resolve(__dirname, './movies.json');


// 🚀 Exercício 4
// Crie uma função de leitura do JSON com o modulo fs.

const readFiles = async () => {
  try {
    const data = await fs.readFile(moviesPath);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Arquivo não pôde ser lido: ${error}`);
  }
};


// 🚀 Exercício 5
// Crie um endpoint do tipo GET com a rota /movies/:id, que possa listar um filme do JSON por id.

app.get('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movies = await readFiles();
    const choseMovie = movies.find((movie) => movie.id === Number(id));
    res.status(200).json(choseMovie);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// 🚀 Exercício 6
// Crie um endpoint do tipo GET com a rota /movies, que possa listar todos os filmes do JSON.

app.get('/movies', async (req, res) => {
  try {
    const movies = await readFiles();

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 🚀 Exercício 7
// Crie um endpoint do tipo POST com a rota /movies, para cadastrar um novo filme no JSON.



app.post('/movies', async (req, res) => {
  try {
    const movies = await readFiles();
    const newMovie = {
      id: movies.length + 1,
      ...req.body
    };

    movies.push(newMovie);
    await fs.writeFile(moviesPath, JSON.stringify(movies));

    res.status(201).json(newMovie);    
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 🚀 Exercício 8
// Crie um endpoint do tipo PUT com a rota /movies/:id, que possa editar informações de um filme do JSON.

app.put('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { movie, price } = req.body;
    const movies = await readFiles();

    const movieIndex = movies.findIndex((movie) => movie.id === Number(id));
    movies[movieIndex] = { id: Number(id), movie, price };
    const updatedMovies = JSON.stringify(movies, null, 2);
    // Os dois últimos parâmetros passados no método stringify são opcionais e têm por objetivo melhorar a formatação do arquivo JSON.

    await fs.writeFile(moviesPath, updatedMovies);
    res.status(200).json(movies[movieIndex]);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 🚀 Exercício 9
// Crie um endpoint do tipo DELETE com a rota /movies/:id que possa deletar um filme do JSON.

app.delete('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movies = await readFiles();
    const index = movies.findIndex((movie) => movie.id === Number(id));

    movies.splice(index, 1);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;