const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const AziendaModel = require('../models/AziendaModel');


exports.register=async (req, res)=>{
    
    const{name,email,password,image, datanascita, luogo, biografia, impiego, ultimolavoro, lavoriprecedenti,indirizzosuperiore,corsodilaurea,posizionelavorativaricercata,luogonascita,luogoresidenza,cellulare }=req.body;
    const status="privato"

    const salt= await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        const existingUser = await UserModel.findOne({ email });

        if (!email || !password) { //se manca uno dei 2 invia errore
        return res.json("mancaqualcosa");
        }else{
            if(existingUser) {  //se mail gia usata
            return res.json('esistegia');
            }else{
                // salva i dati in users
                const newuser = new UserModel({ name:name, email:email, image:image, password:hashedPassword, luogo:luogo, status:status,
                                                datanascita:datanascita,biografia:biografia,impiego: impiego, ultimolavoro: ultimolavoro, 
                                                lavoriprecedenti: lavoriprecedenti, indirizzosuperiore: indirizzosuperiore, corsodilaurea: corsodilaurea, posizionelavorativaricercata: posizionelavorativaricercata, 
                                                luogonascita: luogonascita, luogoresidenza: luogoresidenza, cellulare: cellulare});

                await newuser.save()
                res.send({status:"ok"})

            }
    

        }
    }catch(error){
        res.send({status:"error"})
    }
    
    
}

exports.registerAzienda=async (req, res)=>{
    
    const{name, email, password, image, descrizione, datanascita, cienteladiriferimento, numerodipendenti, fatturatoannuale, mercati, settore, fondatori, ceo, strutturasocietaria, certificazioni, premi, luogonascita, sedelegale, sedioperative, telefono, sitoweb}=req.body;
    const status="azienda"
    const salt= await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        const existingUser = await AziendaModel.findOne({ email });

        if (!email || !password) { //se manca uno dei 2 invia errore
        return res.json("mancaqualcosa");
        }else{
            if(existingUser) {  //se mail gia usata
            return res.json('esistegia');
            }else{
                // salva i dati in users
                const newuser = new AziendaModel({ name:name, email:email, image:image, password:hashedPassword, descrizione:descrizione, status:status, datanascita:datanascita, cienteladiriferimento:cienteladiriferimento, numerodipendenti:numerodipendenti, fatturatoannuale:fatturatoannuale, mercati:mercati, settore:settore, fondatori:fondatori, ceo:ceo, strutturasocietaria:strutturasocietaria, certificazioni:certificazioni, premi:premi, luogonascita:luogonascita, sedelegale:sedelegale, sedioperative:sedioperative, telefono:telefono, sitoweb:sitoweb});

                await newuser.save()
                res.send({status:"ok"})

            }
    

        }
    }catch(error){
        res.send({status:"error"})
    }
    
    
}

exports.login=async (req, res)=>{
    
    const{email,password, status}=req.body;
    if(status=="privato"){
            const utentepresente = await UserModel.findOne({ email });
            if(!utentepresente){
                return res.json({status:'Email non risulta registrata'});
            }else{
                if (!password) {
                    res.json('passoword non valida');
                }else{
                    const confronto= await bcrypt.compare(password, utentepresente.password)

                    if (!utentepresente || !confronto) { //se utente non esiste o la pass è errata
                        return res.json({status:'credenzialierrate'});
                    }else{
                        const token=jwt.sign({email:utentepresente.email, status:utentepresente.status}, process.env.JWT_SECRET)
                        res.cookie("jwtToken", token, {
                            sameSite: 'strict',
                            httpOnly: true,
                            secure: false,
                            path: '/',
                            expires: new Date(Date.now() + 1000 * 60 * 60 * 12)
                        }).json({
                            "message": "ok",
                             "user": {email: utentepresente.email},
                             status:"ok",
                             data:token
                        })
                    }}

            }

    }else{
        const utentepresente = await AziendaModel.findOne({ email });
            if(!utentepresente){
                return res.json({status:'email non valida'});
            }else{
                if (!password) {
                    res.json('passoword non valida');
                }else{
                    const confronto= await bcrypt.compare(password, utentepresente.password)

                    if (!utentepresente || !confronto) { //se utente non esiste o la pass è errata
                        return res.json({status:'credenzialierrate'});
                    }else{
                        const token=jwt.sign({email:utentepresente.email, status:utentepresente.status}, process.env.JWT_SECRET)
                        res.cookie("jwtToken", token, {
                            sameSite: 'strict',
                            httpOnly: true,
                            secure: false,
                            path: '/',
                            expires: new Date(Date.now() + 1000 * 60 * 60 * 12)
                        }).json({
                            "message": "ok", "user": {
                                
                                email: user.email
                            }
                        })

                        if(res.status(201)){
                            return res.json({status:"ok",data:token})
                        }else{
                            return res.json({status:"error"})
                        }
                    }}

            }
        
    }
    
    
    
}

exports.profilo=async(req, res)=>{
    const {token}=req.body;
    try{
        const user=jwt.verify(token, process.env.JWT_SECRET, (err, res)=>{
            if(err){
                return "token expired"
            }
            return res
        })
        if(user=="token expired"){
            return res.send({status:"error", data:"token expired"})
        }
        const useremail=user.email;
        const userstatus=user.status;
        if(userstatus=="privato"){
            UserModel.findOne({email:useremail})
            .then((data)=>{
                res.send({status:"ok", data:data})
            }).catch((error)=>{
                res.send({status:"error", data:error})
            })

        }else{
            AziendaModel.findOne({email:useremail})
            .then((data)=>{
                res.send({status:"ok", data:data})
            }).catch((error)=>{
                res.send({status:"error", data:error})
            })
        }
       
    }catch(error){}
}

exports.updateUser=async (req, res)=>{
    const{name,email, luogo, profilo, biografia, image, impiego, ultimolavoro, lavoriprecedenti,indirizzosuperiore,corsodilaurea,posizionelavorativaricercata,luogonascita,luogoresidenza,cellulare}=req.body;
    const{ status,descrizione, datanascita, cienteladiriferimento, numerodipendenti, fatturatoannuale, mercati, settore, fondatori, ceo, strutturasocietaria, certificazioni, premi, sedelegale, sedioperative, telefono, sitoweb}=req.body;

    try{
        if(status==="azienda"){
            await AziendaModel.updateOne({email:email},{
                $set:{
                    name: name,
                    image: image,
                    descrizione: descrizione,
                    status: status,
                    datanascita: datanascita,
                    cienteladiriferimento: cienteladiriferimento,
                    numerodipendenti: numerodipendenti,
                    fatturatoannuale: fatturatoannuale,
                    mercati: mercati,
                    settore: settore,
                    fondatori: fondatori,
                    ceo: ceo,
                    strutturasocietaria: strutturasocietaria,
                    certificazioni: certificazioni,
                    premi: premi,
                    luogonascita: luogonascita,
                    sedelegale: sedelegale,
                    sedioperative: sedioperative,
                    telefono: telefono,
                    sitoweb: sitoweb
                }})
            }else{
                await UserModel.updateOne({email:email},{
                    $set:{
                        name:name,
                        luogo: luogo,
                        profilo: profilo,
                        biografia: biografia,
                        impiego: impiego,
                        ultimolavoro: ultimolavoro,
                        lavoriprecedenti: lavoriprecedenti,
                        indirizzosuperiore: indirizzosuperiore,
                        corsodilaurea: corsodilaurea,
                        posizionelavorativaricercata: posizionelavorativaricercata,
                        luogonascita: luogonascita,
                        luogoresidenza: luogoresidenza,
                        cellulare: cellulare,
                        image:image,
                        status:status
                    }

            })
        }

        




    return res.json({status:"ok", data:"updated"})

    }catch(error){
        return res.json({status:"error", data:"error"})

    }
}

exports.verificaCookie=async (req, res, next) => {
    try {
      const token = req.cookies.jwtToken;
      console.log(token)
        const decodedToken = jsonwebtoken.decode(token, process.env.JWT_SECRET)
        if (decodedToken) {
            if(decodedToken.status=="privato"){
                    const user = await UserModel.findOne({email: decodedToken.email})
                if (user) {
                    req.user = user
                    next()
                } else {
                    res.json({message: "error", error: "Utente non trovato"})
                }

            }else{
                const user = await AziendaModel.findOne({email: decodedToken.email})
                if (user) {
                    req.user = user
                    next()
                } else {
                    res.json({message: "error", error: "Utente non trovato"})
                }

            }
            
        } else {
            res.json({message: "error", error: "Token non valido"})
        }
    } catch (e) {
        console.log(e);
        res.json({message: "error", error: e});
    }
}

exports.uploadImmage=async(req,res)=>{
    const {image}=req.body;
    try{
        Images.create({image:image});

        res.send({Status:"ok"})

    }catch(error){
        res.send({Status:"error", data:error})

    }
}

exports.getImmage=async(req,res)=>{
    try{
        await Images.find({}).then(data=>{
            res.send({status:"ok", data:data})

        })
    }catch(error){
    }
}

