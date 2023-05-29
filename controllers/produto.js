// Inclui bibliotecas
// gerencia as requisições, rotas e urls
const express = require('express');
//conexão com banco
const db = require('./../db/models');
// chama a função do express, permite modularizar o projeto com os controllers, tornando esses metodos acessiveis
const router = express.Router();

//rota de cadastro 
router.post("/produto", async (req, res) => {
    var dados = req.body;
    
    // salva no banco
    await db.Produto.create(dados).then((dadosUsuario) => {
        return res.json({
            mensagem: "Produto cadastrado com sucesso!",
            
        });
    }).catch(() => {
        return res.status(400).json({
            mensagem: "Produto não cadastrado erro no processo!",
        });
    });

});

router.get("/produto", async (req, res) => {
    //lista os dados
    const produtos = await db.Produto.findAll({
        //Indica quais colunas quero, caso necessário
        //attributes:['id','codigo','nome', 'telefone', 'email'],

        // ordena decrecentemente pelo id
        order: [['id', 'DESC']]
    });
    if (produtos) {
        return res.json({
            produtos
        });
    } else {
        //Se der erro..
        return res.status(400).json({
            mensagem: "Erro: Não foi possível listar os registros"
        });

    }
});

//rota de edição
router.put("/produto", async (req, res) => {
    //recebo os dados
    var dados = req.body;
    console.log(dados);

    await db.Produto.update(dados, {where: {id: dados.id}})
    .then(()=>{
        return res.json({
            mensagem: "Registro editado!"
        });
    }).catch(()=>{
        return res.json({
        mensagem: "Erro: Não foi possível editar o registro"
    });
    })
    
} );

//rota de exclusão
router.delete("/produto/:id", async (req, res) => {

    //pega o dado da url
    const { id } = req.params;

    //pega o id e com o where indica qual o id a ser excluido no banco
    await db.Produto.destroy({
        where: { id }
    }).then(() => {
        return res.json({
        mensagem: "Registro apagado!"
        });

    }).catch(() => {
        return res.status(400).json({
            mensagem: "Erro: Não foi possível apagar o registro"
        });
    });

});

 /// busca o o maior id
 router.get("/produtomaior", async (req, res) => {
    
    try {
       const maiorId = await db.Produto.findOne({
        // passa a coluna e depois ordem decrecente 
        order:[['id', 'DESC']]
       
      });
      if(maiorId === null){
        console.log('nulo')
       return res.json({maiorId: 0 });
        
      }
        return res.json({   maiorId: maiorId.id   });
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        mensagem: "Erro: Não foi possível encontrar o maior"
      });
    }
  });


// exporta a router para usar no app
module.exports = router;