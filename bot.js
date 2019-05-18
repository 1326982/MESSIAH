const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const bubbles = require('lunicode-bubbles');

const auth = require('./auth.json');
const swear = require('./swear.json');
const fond = require('./danslfon.json');
const verset = require('./citation.json');
const versetMotiv = require('./citationMotiv.json');
let _change = false;
let db = new sqlite3.Database('./solde.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connecté a la base de donnée!');
});
// un solde = [username,solde]
var solde = [];

var messiah = new Discord.Client();


messiah.on('ready', () => {
  console.log(`Connecté en tant que ${messiah.user.tag}!`)
});


messiah.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Mes enfants souhaitez la bienvenue à notre plus jeune membre, ${member}`);
});

messiah.on('messageUpdate',(oldmsg, msg) => {/*0*/
    
//    if(msg.author.username == 'One Speed' || msg.author.username == 'Kev') {
//        citation = verset[Math.floor(Math.random()*verset.length)];
//        ajouterSolde(msg.author.username,0.25);
//        msg.reply( {files: ["./messiah.jpg"]}       
//        );
//        setTimeout(function(){ 
//            msg.reply(citation);
//            msg.reply("Ai-je bien entendu **"+msg.content+"** ? Ton comportement n'est pas digne. Je t'afflige du châtiment de la dette! 25 cent sera ajouté à ton solde d'hérétique!");
//        }, 700);
//
//    }
    if(msg.author.username != 'MESSIAH') {/*1*/
        var commande = msg.content.split(' ');
        if(commande[0].toLowerCase() == "amen") {
            msg.channel.send("Amen"); 
        } else if(commande[0].toLowerCase() == "xd") {
            msg.channel.send("xd c'est pas un mot, ressaisis-toi!"); 
        } else if(commande[0].toLowerCase() == ":ourmessiah:") {
            msg.channel.send("Nice."); 
        }
        if(commande.length >= 3 ) {
            if(commande.length >= 5 && commande[0].toLowerCase() === "check" && commande[1].toLowerCase() === "la" && commande[2].toLowerCase() === "doc" && commande[3].toLowerCase() === "de") {
                msg.channel.send('http://lmgtfy.com/?q=' + commande[4]);
            }
            if(commande[0].toLowerCase() === "ô" && commande[1].toLowerCase() === "messie") { /*3*/
                if(commande[2].toLowerCase() === "solde") {/*4*/
                    soldeAct = fetchCash(msg.author.username);
                    soldeAct.then(function(result) {
                        if(result != 0) {
                            msg.channel.send('Tu as une dette envers moi! Repent toi ou paie la somme de ' + result + "$ au grand Messie.");
                        } else {
                            msg.channel.send("Tu est aussi propre que la vierge marie."); 
                        }
                    }, function(err) {
                        console.log(err);
                    })

                }/*4*/else if(commande[2].toLowerCase() === "prayers") {
                    soldeAct = fetchPrayers(msg.author.username);
                    soldeAct.then(function(result) {
                        if(result != 0) {
                            msg.channel.send('"Que celui qui a deux chemises partage avec celui qui n\'en a pas, et que celui qui a de quoi manger fasse de même." -Proverbes 19:17. Tu as ' + result + " prayers.");
                        } else {
                            msg.channel.send("Personne ne prie pour toi. 'Aide ton prochain et il te retournera un prayer'. (Gandhi, 1818)"); 
                        }
                    }, function(err) {
                        console.log(err);
                    })

                }  else if(commande[2].toLowerCase() === "motivation") {
                    msg.channel.send(versetMotiv[Math.floor(Math.random()*versetMotiv.length)]); 
                    
                    
                } else if(commande[2].toLowerCase() === "communautée") {
                    
                    commun = fetchCommunaute();
                    commun.then(function(result) {
                        console.log(result);
                        msg.channel.send(textCommunaute(result));
                    },function(err){
                        console.log(err);
                    })
                    
                    
                } else if(commande[2].toLowerCase() === "rédemption") {
                    argentAct = fetchCash(msg.author.username);
                    argentAct.then(function(resultat) {
                        if(resultat != 0) {
                            soldeAct = fetchPrayers(msg.author.username);
                            soldeAct.then(function(result) {
                                if(result != 0) {
                                    transaction = (resultat/0.25);
                                    if(transaction >= result) {
                                        redemption(msg.author.username.toLowerCase(),result);
                                        msg.channel.send("Viens ici mon enfant, que je te purifie ;) ("+result+" prayers dépensé)"); 
                                    } else {
                                        redemption(msg.author.username.toLowerCase(),transaction);
                                        msg.channel.send("Viens ici mon enfant, que je te purifie ;)("+transaction+" prayers dépensé)"); 
                                    }

                                } else {
                                    msg.channel.send("Tu n'a pas de prayers. feelsbadman.psd"); 
                                }
                            }, function(err) {
                                console.log(err);
                            })
                        } else {
                            msg.channel.send("Le rédempteur en personne, tu n'a perpétré aucun péché."); 
                        }
                    }, function(err) {
                        console.log(err);
                    })
                    
                // SI JE PRIE POUR    
                }else if(commande[2].toLowerCase() === "je" && commande[3].toLowerCase() === "prie" && commande[4].toLowerCase() === "pour" && commande.length >= 6) {
                    checkpray = fecthLastPrayer(msg.author.username);
                    checkpray.then(function(timeLast) {
                        if(timeLast < Date.now() ) {
                            if(commande[6] != undefined) {
                                commande[5] += ' '+commande[6];
                            }
                            if(msg.author.username.toLowerCase() != commande[5].toLowerCase() ){
                                timestamprayer(msg.author.username.toLowerCase());
                                
                                
                                msg.channel.send("Ta prière a été envoyé à "+ commande[5].toLowerCase());
                                modPrayer(commande[5].toLowerCase(),1);
                            }else {
                                msg.channel.send("Tu ne peux pas t'envoyer de prayers à toi même."); 
                            }
                        }else {
                                msg.channel.send("Attend 15 min avant de prier à nouveau."); 
                            }
                    }, function(err) {
                        console.log(err);
                    });
                }
            }
                
            } else if(commande.length === 2 ) {
                if(commande[0].toLowerCase() === "ô" && commande[1].toLowerCase() === "messie") {
                    msg.channel.send("Qu'y a-t-il mon enfant? \n Pour connaitre le prix de la rédemption, il faut s'écrier '**Ô Messie solde**' ! \n Pour connaitre nombre de prayers, il faut s'écrier '**Ô Messie prayers**' ! \n Pour une bénédiction du grand sauveur, il faut s'écrier '**Ô Messie motivation**' ! \n Pour entreprendre le chemin de la rédemption, il faut s'écrier '**Ô Messie rédemption**' ! \n Pour envoyer un prayer, il faut s'écrier '**Ô Messie je prie pour <<username>>**' ! \n Pour s'informer su la communautée, il faut s'écrier '**Ô Messie communautée**' !");
                }
            }
            
        
        if(checkdansfond(msg.content)) {
            console.log('danslfon detect')
            msg.channel.send( {files: ["./cursed.jpg"]});
            ajouterSolde(msg.author.username,1);
  
            setTimeout(function(){ 
            msg.channel.send("DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS QUE LA COLÈRE DU MESSIE S'ABAT SUR TOI. (+1$ de dette)");
            }, 700);
        } else {
            var sacre = verifierSacre(msg.content.split(new RegExp('[-+()*/:? ]', 'g')));
            
            if(sacre != "clean") {
                citation = verset[Math.floor(Math.random()*verset.length)];
                ajouterSolde(msg.author.username,0.25);
                msg.channel.send( {files: ["./messiah.jpg"]}       
                );
                setTimeout(function(){ 
                    msg.channel.send(citation);
                    msg.channel.send("Ai-je bien entendu **"+sacre+"** ? Ton comportement n'est pas digne. Je t'afflige du châtiment de la dette! 25 cent sera ajouté à ton solde d'hérétique!");
                }, 700);

            }
        }
    }
    
});/*0*/

messiah.on('message', msg => {/*0*/
    if(msg.author.username != 'MESSIAH') {/*1*/
        var commande = msg.content.split(' ');
        if(commande[0].toLowerCase() == "amen") {
            msg.reply("Amen"); 
        }if(commande[0].toLowerCase() == "test") {
           const role = msg.guild.roles.find('name', 'Messie');
            console.log(role);
            msg.member.addRole(role);
        } else if(commande[0].toLowerCase() == "xd") {
            msg.reply("xd c'est pas un mot, ressaisis-toi!"); 
        } else if(commande[0].toLowerCase().includes(":ourmessiah:")) {
            msg.reply("Nice."); 
        }
        if(commande.length >= 3 ) {
            if(commande.length >= 5 && commande[0].toLowerCase() === "check" && commande[1].toLowerCase() === "la" && commande[2].toLowerCase() === "doc" && commande[3].toLowerCase() === "de") {
                msg.reply('http://lmgtfy.com/?q=' + commande[4]);
            }
            if(commande[0].toLowerCase() === "ô" && commande[1].toLowerCase() === "messie") { /*3*/
                if(commande[2].toLowerCase() === "solde") {/*4*/
                    soldeAct = fetchCash(msg.author.username);
                    soldeAct.then(function(result) {
                        if(result != 0) {
                            msg.reply('Tu as une dette envers moi! Repent toi ou paie la somme de ' + result + "$ au grand Messie.");
                        } else {
                            msg.reply("Tu est aussi propre que la vierge marie."); 
                        }
                    }, function(err) {
                        console.log(err);
                    })

                }/*4*/else if(commande[2].toLowerCase() === "prayers") {
                    soldeAct = fetchPrayers(msg.author.username);
                    soldeAct.then(function(result) {
                        if(result != 0) {
                            msg.reply('"Que celui qui a deux chemises partage avec celui qui n\'en a pas, et que celui qui a de quoi manger fasse de même." -Proverbes 19:17. Tu as ' + result + " prayers.");
                        } else {
                            msg.reply("Personne ne prie pour toi. 'Aide ton prochain et il te retournera un prayer'. (Gandhi, 1818)"); 
                        }
                    }, function(err) {
                        console.log(err);
                    })

                }  else if(commande[2].toLowerCase() === "motivation") {
                    msg.reply(versetMotiv[Math.floor(Math.random()*versetMotiv.length)]); 
                    
                    
                } else if(commande[2].toLowerCase() === "communautée") {
                    
                    commun = fetchCommunaute();
                    commun.then(function(result) {
                        console.log(result);
                        msg.reply(textCommunaute(result));
                    },function(err){
                        console.log(err);
                    })
                    
                    
                } else if(commande[2].toLowerCase() === "rédemption") {
                    argentAct = fetchCash(msg.author.username);
                    argentAct.then(function(resultat) {
                        if(resultat != 0) {
                            soldeAct = fetchPrayers(msg.author.username);
                            soldeAct.then(function(result) {
                                if(result != 0) {
                                    transaction = (resultat/0.25);
                                    if(transaction >= result) {
                                        redemption(msg.author.username.toLowerCase(),result);
                                        msg.reply("Viens ici mon enfant, que je te purifie ;) ("+result+" prayers dépensé)"); 
                                    } else {
                                        redemption(msg.author.username.toLowerCase(),transaction);
                                        msg.reply("Viens ici mon enfant, que je te purifie ;)("+transaction+" prayers dépensé)"); 
                                    }

                                } else {
                                    msg.reply("Tu n'a pas de prayers. feelsbadman.psd"); 
                                }
                            }, function(err) {
                                console.log(err);
                            })
                        } else {
                            msg.reply("Le rédempteur en personne, tu n'a perpétré aucun péché."); 
                        }
                    }, function(err) {
                        console.log(err);
                    })
                    
                // SI JE PRIE POUR    
                }else if(commande[2].toLowerCase() === "je" && commande[3].toLowerCase() === "prie" && commande[4].toLowerCase() === "pour" && commande.length >= 6) {
                    checkpray = fecthLastPrayer(msg.author.username);
                    checkpray.then(function(timeLast) {
                        if(timeLast < Date.now() ) {
                            if(commande[6] != undefined) {
                                commande[5] += ' '+commande[6];
                            }
                            if(msg.author.username.toLowerCase() != commande[5].toLowerCase() ){
                                timestamprayer(msg.author.username.toLowerCase());
                                
                                
                                msg.reply("Ta prière a été envoyé à "+ commande[5].toLowerCase());
                                modPrayer(commande[5].toLowerCase(),1);
                            }else {
                                msg.reply("Tu ne peux pas t'envoyer de prayers à toi même."); 
                            }
                        }else {
                                msg.reply("Attend 15 min avant de prier à nouveau."); 
                            }
                    }, function(err) {
                        console.log(err);
                    });
                }
            }
                
            } else if(commande.length === 2 ) {
                if(commande[0].toLowerCase() === "ô" && commande[1].toLowerCase() === "messie") {
                    msg.reply("Qu'y a-t-il mon enfant? \n Pour connaitre le prix de la rédemption, il faut s'écrier '**Ô Messie solde**' ! \n Pour connaitre nombre de prayers, il faut s'écrier '**Ô Messie prayers**' ! \n Pour une bénédiction du grand sauveur, il faut s'écrier '**Ô Messie motivation**' ! \n Pour entreprendre le chemin de la rédemption, il faut s'écrier '**Ô Messie rédemption**' ! \n Pour envoyer un prayer, il faut s'écrier '**Ô Messie je prie pour <<username>>**' ! \n Pour s'informer su la communautée, il faut s'écrier '**Ô Messie communautée**' !");
                }
            }
            
        
        if(checkdansfond(msg.content)) {
            console.log('danslfon detect')
            msg.reply( {files: ["./cursed.jpg"]});
            msg.react('👎');
            ajouterSolde(msg.author.username,1);
  
            setTimeout(function(){ 
            msg.reply("DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS L'FOND DANS QUE LA COLÈRE DU MESSIE S'ABAT SUR TOI. (+1$ de dette)");
            }, 700);
        } else {
            var sacre = verifierSacre(msg.content.split(new RegExp('[-+()*/:? ]', 'g')));
            
            if(sacre != "clean") {
                citation = verset[Math.floor(Math.random()*verset.length)];
                ajouterSolde(msg.author.username,0.25);
                msg.react('👎');
                msg.reply( {files: ["./messiah.jpg"]}       
                );
                setTimeout(function(){ 
                    msg.reply(citation);
                    msg.reply("Ai-je bien entendu **"+sacre+"** ? Ton comportement n'est pas digne. Je t'afflige du châtiment de la dette! 25 cent sera ajouté à ton solde d'hérétique!");
                }, 700);

            }
        }
    }
    
});/*0*/

function checkdansfond(mess) {
    str = mess;
    strfond = bubbles.decode(str).toLowerCase();
    for(i = 0; i <fond.length;i++ ) {
        if(str.toLowerCase().includes(fond[i])) {
            return true;
        } else if(strfond.includes(fond[i])){ 
            return true;  
        }
    } 
    return false; 
}

function redemption(nom,prayers){
    val = 0 - (prayers * 0.25)
    pray = 0-prayers;
    var enr = fetchByUsername(nom,val);
    enr.then(function(result) {
        if(result){
           modPrayer(nom,pray);
        }
    }, function(err) {
        console.log(err);
    })
}
function textCommunaute(table) {
    tcom=table;
    text = "Voici la liste des membres actifs de votre communautée: \n"
    for(i=0; i<tcom.length;i++) {
        text += tcom[i][0]+" qui a une dette de "+  tcom[i][1] + "$ et "+tcom[i][2] + " prayers. \n"
    }
    return text;
}
function fetchCommunaute() {
    var sql = "SELECT username,cash,prayers FROM solde" ;
    return new Promise(function(resolve, reject) {
        db.all(sql,[], (err, rows) => {
            tCom = [];
            rows.forEach((row) => {
                 tCom.push([row.username,row.cash,row.prayers]);
            });
            if (err) {
                reject(err);
            } else {
                resolve(tCom);
            }
        })
    })
}
function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
 
function verifierSacre(phrase) {
    for(o=0;o<swear.length;o++) {
        swearTest = swear[o];
        saveMot="";
        saveMotLunicode="";
        for(j=0;j<phrase.length;j++) {
            motBrut1 = phrase[j];
            motBrut = motBrut1.replace('\n','');
            mot = motBrut.replace(' ','').toLowerCase();
            motBubble = bubbles.decode(motBrut);  
            motbubClean = motBubble.replace(' ','').toLowerCase();
            if(isLetter(motbubClean)){
                console.log('isnotletter');
            }else{
                motbubClean=''; 
            }
            if(mot != ""){  
                if(mot.length <= 3){
                    saveMot = saveMot+mot;  
                } else if(mot.length > 5) {
                    saveMot = "";
                }
            }  
            if(motbubClean != ""){
                if(motbubClean.length <= 3){ 
                    saveMotLunicode = saveMotLunicode + motbubClean;  
                } else if(motbubClean.length > 5) {
                    saveMotLunicode = "";
                } 
            }
            if(mot===swearTest  ) {
                return mot;
            } else if(motbubClean === swearTest  ) { 
                //return motbubClean;
                return swearTest;
            }else if(saveMot===swearTest  ) {
                //return saveMot; 
                return swearTest; 
            } else if(saveMotLunicode===swearTest  ) {
                //return saveMotLunicode; 
                return swearTest; 
            }
        }
    }
    return "clean";
}

function ajouterSolde(nom , val){
   
    var enr = fetchByUsername(nom,val);
    enr.then(function(result) {
        if(result == false){
           ajouterHeretique(nom, val,0);
        }
        
    }, function(err) {
        console.log(err);
    })
}

function timestamprayer(nom) {
        var sql = "SELECT username,prayers,lastprayer FROM solde";
        db.all(sql,[], (err, rows) => {
            found = false;
            rows.forEach((row) => {
                if(row.username === nom.toLowerCase()){
                    date = Date.now() + (60*60*15);
                    sql = "UPDATE 'solde' SET lastprayer = "+date+" WHERE username ='"+nom+"'";
                    db.run(sql, [], function(err){ });
                }
            });
        })
}

function modPrayer(nom, val){
    var enr = fetchByUsernamePrayers(nom,val);
    enr.then(function(result) {
        if(result == false){
           ajouterHeretique(nom, 0,1);
        }
        
    }, function(err) {
        console.log(err);
    })
}
function fetchCash(username) {
    var sql = "SELECT username,cash FROM solde" ;
    return new Promise(function(resolve, reject) {
        db.all(sql,[], (err, rows) => {
            cash = "0";
            rows.forEach((row) => {
                if(row.username === username.toLowerCase()){
                    cash =  row.cash;
                }
            });
            if (err) {
                reject(err);
            } else {
                resolve(cash);
            }
        })
    })
}

function fecthLastPrayer(username) {
    var sql = "SELECT username,lastprayer FROM solde WHERE username='"+ username.toLowerCase()+"'" ;
    return new Promise(function(resolve, reject) {
        db.all(sql,[], (err, rows) => {
            prayers = 0;
            rows.forEach((row) => {
                if(row.username === username.toLowerCase()){
                    prayers =  row.lastprayer;
                }
            });
            if (err) {
                reject(err);
            } else {
                resolve(prayers);
            } 
        })
    })
} 

function fetchPrayers(username) {
    var sql = "SELECT username,prayers FROM solde" ;
    return new Promise(function(resolve, reject) {
        db.all(sql,[], (err, rows) => {
            prayers = "0";
            rows.forEach((row) => {
                if(row.username === username.toLowerCase()){
                    prayers =  row.prayers;
                }
            });
            if (err) {
                reject(err);
            } else {
                resolve(prayers);
            }
        })
    })
}

function fetchByUsername(username, val) {
    var sql = 'SELECT username,cash FROM solde';
    return new Promise(function(resolve, reject) {
        // Do async job
        db.all(sql,[], (err, rows) => {
            found = false;
            rows.forEach((row) => {
            if(row.username === username.toLowerCase() ){
                found = true;
                newSolde = row.cash + val;
                if(newSolde < 0 ) {
                    newSolde = 0;
                }
                sql = "UPDATE 'solde' SET cash = "+newSolde+" WHERE username ='"+username.toLowerCase()+"'";
                db.run(sql, [], function(err){ });
                return "old";
            }
        });
            if (err) {
                reject(err);
            } else {
                resolve(found);
            }
        })
    })
}
function fetchByUsernamePrayers(nom,val) {
    var sql = "SELECT username,prayers,lastprayer FROM solde";
    return new Promise(function(resolve, reject) {
        // Do async job
        db.all(sql,[], (err, rows) => {
            found = false;
            rows.forEach((row) => {
            if(row.username === nom.toLowerCase()){
                found = true;
                newSolde = row.prayers + val;
                if(newSolde <= 0) {
                 newSolde = 0;
                } 
                sql = "UPDATE 'solde' SET prayers = "+newSolde+" WHERE username ='"+nom+"'";
                db.run(sql, [], function(err){ });
            }
        });
            if (err) {
                reject(err);
            } else {
                resolve(found);
            }
        })
    })
}


function ajouterHeretique(nom , valSolde, valPrayers) {
    sql ="INSERT INTO 'solde'(username,cash,prayers) VALUES('"+nom.toLowerCase()+"',"+valSolde+","+valPrayers+")";
         db.exec(sql, function(err) {
        if (err) {
              return console.log(err.message + 'ici');
            }

          });
        return "new";
}


messiah.login(auth.token);
require('http').createServer().listen()

