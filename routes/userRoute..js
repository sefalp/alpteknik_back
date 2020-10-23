const express = require('express');
const router = new express.Router();
const User = require('../models/user')
const Auth = require('../middlewares/Auth')
const bcrypt = require('bcrypt')
const sgMail = require('@sendgrid/mail')

const sendGridAPIKey = SENDGRID_API
sgMail.setApiKey(sendGridAPIKey)



// creates new user in database
router.post('/user/create', async (req, res)=>{
   
    try{

    const form = req.body

    if(form.password.length >= 6){

        if(form.checked && form.password === form.passwordAgain)
        {
            const isUnique = await User.findOne({email: form.email})
            if( isUnique === null){
                const user = new User(form)
                await user.save()
                const token = await user.generateAuthToken()
                console.log(token, user)
    
                res.send('Kullanıcı profili oluşturuldu ! ')
            }else{

                throw new Error('Bu maile kayıtlı kullanıcı zaten var ! ')

            }

        }
        else if(form.password !== form.passwordAgain){

            throw new Error('Şifre ile tekrarı uyuşmuyor!')
        }
        else if(!form.checked){

            throw new Error('Sözleşme kabul edilmeden üye olunamaz!')
        }

        }
        else{
       
            throw new Error("parola '6' haneden az olmamalı !")
        }

    }catch(e){

         res.send(e.message)

    }
})

// change profile of user ( name and email basically )
router.post('/user/changeProfile', Auth, async (req, res)=>{

    try{

    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({email})
    const currentUser = await User.findOne(req.user)

    if(req.body.password === req.body.re_password){
         await currentUser.doesPasswordCorrect(password)
    }
    else{
        throw new Error(' Şifreler birbiriyle uyumlu değil ! ')
    }
   
    if( (email === currentUser.email) || (email !== currentUser.email && user === null) ){

        const updates = Object.keys(req.body)
        updates.forEach( (update) => req.user[update] = req.body[update] )
        await req.user.save()
        res.send(req.user)

    }else{
        res.send('olmaz')
    }
    
    }catch(e){

        res.status(400).send(e)

    }
})


// check if login successful or not 
router.post('/user/login', async (req, res) =>{
    try{

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})

    }
    catch(e){

        res.status(400).send(e)

    }
})

// log the user out from site
router.get('/user/logout', Auth, async (req, res) =>{
    try{

        req.user.tokens = req.user.tokens.filter((toki) =>{
            return toki.token !== req.token  
        }) 
        
        await req.user.save()
        res.send(req.token)
    }
    catch(e){
        res.status(400).send(e)
    }
})


// arrange user information from server
router.post('/user/changePassword', Auth, async (req, res) => {
    try{
        
        var newPassword = req.body.new_password
        const oldPassword = req.body.old_password

        if(req.body.new_password === req.body.re_new_password){
            await req.user.doesPasswordCorrect(oldPassword)
            req.user.password = newPassword
            await req.user.save()
            res.send('Şifreniz başarıyla değiştirildi')
       }
       else{
           throw new Error(' Yeni şifreler birbiriyle uyumlu değil ! ')
       }
    }
    catch(e){
        res.status(400).send(e)
    }
})

// update minicart in database
router.post('/user/update_minicart', Auth, async (req, res)=>{
    try{   
        const user = await User.findOne(req.user)
        user.minicart = req.body
        await user.save()
        res.send(user)
        
    }catch(e){
        res.status(400).send(e)
    }
})


router.post('/user/sendEmail', async (req, res) => {

    try{

        const userEmail = req.body.email
        const phoneNumber = req.body.phoneNumber
        const message = req.body.message
    
        await sgMail.send({
            to :'alpssefa@gmail.com',
            from: 'alpssefa@gmail.com',
            subject: phoneNumber,
            text: "Costumer's message: \n" + message + '\n' + "Costumer's email: \n" + userEmail
        })

        res.send(req.body.message)
        
    }catch(e){

        res.send(e)
    }
   

})



module.exports = router
