import { Router } from "express";
import { alterarFilme, alterarImagem, buscarPorId, buscarPorNome, inserirFilme, listarTodosFilmes, removerFilme } from "../repository/filmeRepository.js";

import  multer  from 'multer' 

const server = Router();

const upload = multer({ dest: 'storage/capasfilmes' })

server.post('/filme', async (req, resp) =>{
    try{
        const  novoFilme = req.body;


        if (!novoFilme.nome)
            throw new Error('Nome do filme obrigatório!');
        if (!novoFilme.sinopse)
            throw new Error('Sinopse do filme obrigatório');
        if (!novoFilme.avaliacao)
            throw new Error('Avaliação do filme obrigatório');
        if (!novoFilme.lancamento)
            throw new Error('Lancamento do filme obrigatório');
        if (novoFilme.disponivel == undefined)
            throw new Error('Campo disponível é obrigatório');
        if (!novoFilme.usuario)
            throw new Error('Usuário não logado');

       const filmeInserido = await inserirFilme(novoFilme);

       resp.send(filmeInserido);


    } catch (error) {
        resp.status(400).send({
            error: error.message
        })
    }
})

server.put('/filme/:id/capa', upload.single('capa'), async (req, resp)=> {
    try{
        const { id } = req.params; 
        const imagem = req.file.path;

        const resposta = await alterarImagem(imagem, id)
        if (resposta != 1)
        {
            throw new Error('Imagem não pode ser salva.')
        }

        resp.status(204).send();
    }catch(err){
        resp.status(400).send({
            error: error.message
        })
    }
})

server.get('/filme', async (req, resp)=> {
    try{

        const resposta = await listarTodosFilmes();
        resp.send(resposta);

    }catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme/busca', async (req, resp) => {
    try{
        const { nome }  = req.query;

        const resposta = await buscarPorNome(nome);

        
        if(resposta.length == 0)
            resp.status(404).send(['filme não encontrado'])
        else

        resp.send(resposta);

    }catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme/:id', async (req, resp) => {
    try{
        const id  = Number(req.params.id);
        const resposta = await buscarPorId(id);

        
        if(!resposta)
            resp.status(404).send(['filme não encontrado'])
        else

        resp.send(resposta);

    }catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.delete('/filme/:id', async (req,resp) => {
    try {
        const { id } =  req.params;

        const resposta = await removerFilme(Number(id));
        if (resposta != 1)
            throw new Error('Filme não pode ser removido.');
        
        resp.status(204).send();
    } catch (err) {
        resp.status(400).send({
            erro:err.message
        })
    }
})


server.put('/filme/:id', async (req, resp) => {
    try {
        const { id } =  req.params;
        const filme = req.body;

        if (!filme.nome)
        throw new Error('Nome do filme obrigatório!');
    if (!filme.sinopse)
        throw new Error('Sinopse do filme obrigatório');
    if (!filme.avaliacao)
        throw new Error('Avaliação do filme obrigatório');
    if (!filme.lancamento)
        throw new Error('Lancamento do filme obrigatório');
    if (filme.disponivel == undefined)
        throw new Error('Campo disponível é obrigatório');
    if (!filme.usuario)
        throw new Error('Usuário não logado');

        const resposta =  await alterarFilme(id, filme);
        if (resposta != 1)
        throw new Error('Filme não pode ser alterado');
        
        else
        resp.status(204).send();

    } catch (err) {
        resp.status(400).send({
            erro:err.message
        })
        
    }
})




export default server;