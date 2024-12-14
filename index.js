import express from "express";
import bodyParser from "body-parser";
//import ejs from "ejs";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import session from "express-session"
import pg from "pg";
import env from "dotenv";
import { Server } from "socket.io";
import {createServer} from "node:http";

import bcrypt, { compare } from "bcrypt";

env.config();


const app = express();
const port = 3000;

const server = createServer(app);
const io = new Server(server);

const saltRounds=10;
const config = {
    user: process.env.user,
    password: process.env.dbPassword,
    host: process.env.host,
    port: process.env.port,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUJ4o54VES/Uzq+uKydlB/hCmBd0gwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMTY2NWI4YjAtMThjYi00OTExLTkxNDItZTUzOWE0MThj
OTU1IFByb2plY3QgQ0EwHhcNMjQxMDEyMDY0ODQzWhcNMzQxMDEwMDY0ODQzWjA6
MTgwNgYDVQQDDC8xNjY1YjhiMC0xOGNiLTQ5MTEtOTE0Mi1lNTM5YTQxOGM5NTUg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAKpJAyQ1
YWBCeXTCXyFOEbZ+NYjY6+LXn8Y7/3cLvrAEpV7He2/YAj8rLI/QitbMM8UAuVxT
I+SaAZlr7Thhf5VGJIGtgLQviptoJGRvC7if53TET85rwD+f8iWbF2CAsihkM7g3
vQ77CHjFSUwh8zUCauX27ynrUQ1Ev6MQH4D77IdvH9xrQZPmUjXTtqDNvg2MA5xi
YUCXbZTl4H7smUDJOhWh8OjKR0aM4W9pt9TcXc5pZYMR//qrGg208Er0/W8eqHVW
CVwkoKyeLdhkpB9jSMCl83LkwFB+T+dvl5qCjDoRue+MgDSlAntWqcdnCDVght2N
ngUwXsUegHmjbxFXdRVdrOzOqzdtJAAn9VvPt0aRG5JtYqVp4EteuqLAAFbnHLXw
2CsiviRRisRHOXMKBkucRgfEJGa6xtefm8gf9xpUSmPoL7okdhMjz57Dx76CFwt1
p89MvgEuqOYhxKE2lrYTM3sjy/s3p4uJ/2gHmqwFULAjELkr+QnoXoIiiwIDAQAB
oz8wPTAdBgNVHQ4EFgQUY2ZCAm+R1LbUdMvZiL5Uoa2mLBowDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAJmGX7ESm1Bte2pb
LnwBxVmcBFFa3nNK7pTEbQZZ2qgmJHlypa1DkaT/ht3uizUINHyIVj/zBJ+62U+y
ijdVv5J2ZIjIXCPfT/yYhW14u6k/DU8M2QNHyXrRGc2sNZ4HbnH0VRjslZSlIzjK
WNDXQaS2TPeaQ24a4jIvUTo3K+SkR6tse3yPQ3zT6bH7rrAKhuOza79u6pKnl5v+
ayRD7bSE2Nldwh6H3hRzl3kZ78aCFwanl7XTsPPyPgtTRZ2N3co3goUpr9a+/Jr5
eLbwuXQsQg3UFbQ3MLmgeTroE23E2sed9rXo/zpYYnvIVUPHZd/aASudycbSEp7+
2ZLbYXdfWpERt5T3yB4Txbhtl05FeMMLOfcptelJURQmc2NJmdROPRPu5XyyW16M
I1sfveHKB+JwDihlJvMBPdsIwfOJksKd6L4Hq89469PdVvWJflNKmCH6kn78eBix
MzoDUovgmg8Ns/CW7BIpyJjAJ/L5s5Ly5ZsvAgR4eI8JpYlgwQ==
-----END CERTIFICATE-----`,
    },
};

const db = new pg.Client(config);
db.connect();

app.use(
    session({
      secret: process.env.topSecret,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // -> for 1 week
    }
    })
  );

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res)=>{
    res.render("index.ejs", {log:req.isAuthenticated()});
});
app.get("/academic", (req, res)=>{
    res.render("academic.ejs", {log:req.isAuthenticated(), eceurls : eceUrls, cseUrls : cesUrls, itUrls : itUrls});
});
app.get("/map", (req, res)=>{
    res.render("map.ejs", {log:req.isAuthenticated(), positions : position});
});
app.get("/resources", (req, res)=>{
    res.render("academic.ejs", {log:req.isAuthenticated(), resour : 1});
});
app.get("/login", (req, res)=>{
    (req.isAuthenticated())?res.redirect("/chat"):res.render("login.ejs");    

});
app.get("/failed_login", (req, res)=>{
    res.render("login.ejs", {failed : 1});
})
app.get("/signup", (req, res)=>{
    res.render("login.ejs", {signup:1});
})
app.get("/test", (req, res)=>{
    res.render("signupSuccess.ejs" , {log:req.isAuthenticated()});
});
app.get("/contact", (req, res)=>{
    res.render("contact.ejs", {log:req.isAuthenticated()});
});
app.get("/errorPage", (req, res)=>{
    res.render("errorPage.ejs", {log:req.isAuthenticated()});
});
app.get("/chat",async (req, res)=>{
    if(req.isAuthenticated()){
        const messageData = await db.query("select * from messages order by messageId desc;");
        res.render("chat.ejs", { allMessages : messageData.rows, currentUser:req.user.username, log:req.isAuthenticated()});

    }else{
        res.redirect("/login");

    }    
});

app.get("/secret", (req, res)=>{
    res.render("secret.ejs");
});

app.get("/forgetPassword", (req, res)=>{
    res.render("forgetPassword.ejs", {log:req.isAuthenticated()})
})

app.get("/logout", (req, res) => {
    req.logout( (err)=> {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

var connectedUsers = [];
io.on("connection", (socket)=>{
    console.log("user connected id: ", socket.id);
    
    socket.on('user details', (user)=>{
        const existingUser = connectedUsers.find((u) => u.name === user.name);
        if (!existingUser) {
            connectedUsers.push({ name: user.name, id: socket.id });
        }
    });

    socket.on('connected users', ()=>{      
        io.emit('connected users', connectedUsers);
    });

    socket.on('chat message', (msg, username)=>{
        //console.log("message: " + msg + " from " + username + " id " + socket.id);
        socket.broadcast.emit('chat message', msg, username);
    });
    
    socket.on("disconnect", ()=>{
        connectedUsers = connectedUsers.filter((user)=>{
            return user.id !== socket.id;
        });
        io.emit('connected users', connectedUsers);
    });
});


app.get("*", (req, res)=>{
    res.status(404).render("errorPage.ejs", {log:req.isAuthenticated()});
});


//post requests
app.post("/downloadSyllabus", (req, res)=>{
    console.log(req.body);
    setTimeout(()=>{
        res.redirect("/academic");
    }, 100);

});
app.post("/downloadResources", (req, res)=>{
    console.log(req.body);
    setTimeout(()=>{
        res.redirect("/resources");
    }, 100);

});

app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/chat",
      failureRedirect: "/failed_login",
    }));

app.post("/register", async (req, res)=>{

    if(req.body.passwordReg.length < 6 || req.body.password.length > 20 || req.body.usernameReg.length > 20 || req.body.dob.length != 8 || !isNumeric(req.body.dob) )
        res.render("login.ejs", {signup:1, invalidCredentials : 1});
    else {
        console.log(req.body);
        console.log(req.body.passwordReg);
        const reset = await db.query("select * from users where username = $1 and dob = $2;", [req.body.usernameReg, req.body.dob]);
        if(reset.rows.length > 0){
            bcrypt.hash(req.body.passwordReg, saltRounds, async(err, hash)=>{
                if(err)
                    console.log(err);
                else
                    db.query("update users set password = $1 where username = $2 and dob = $3;", [hash, req.body.usernameReg, req.body.dob]).then(()=>{
                        res.redirect("/test")
                    });

            })
        }else{
            const check = await db.query("select * from users where username = $1;", [req.body.usernameReg]);
            if(check.rows.length > 0)
                res.render("login.ejs", {signup : 1, signUpUsernameAlert : "User already exists",name : req.body.name})
            else
                bcrypt.hash(req.body.passwordReg, saltRounds,async (err, hash)=> {
                    if(err){
                        console.log(err);
                    }
                        
                    else{
                        console.log(hash);
                        const data =await db.query("insert into users values(default, $1, $2, $3);", [req.body.usernameReg, hash, req.body.dob]);
                        //db.query("insert into userdetails(id, fName) values($1, $2)", [id, req.body.name]);
                        res.redirect("/test");
                    }
                        
                });
        }
        
    }
        
    
});

passport.use(new LocalStrategy(
    async (username, password, cb) => {
        try{
            
      const user = await db.query("select * from users where username = $1", [username])
      if(user.rows.length>0){
        const hashed = user.rows[0].password;
        const check = bcrypt.compareSync(password, hashed);
        if(check){
            return cb(null, user.rows[0]); // password correct
        }else{
            return cb(null, false); //password incorrect
        }
      }else{
        return cb("user not found");
      }
        }catch (err){
            console.log("error in login auth",err);
        }
    }
  ));
  
  // Serialize user 
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  
  // Deserialize user
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });

app.post("*", (req, res)=>{
    res.render("errorPage.ejs");
});

server.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});

// here are the static datas
const position =[
    {lat : 23.222269, lon : 77.404709},
    {lat : 23.22313, lon : 77.40673}
]


const eceUrls =[
    "https://drive.usercontent.google.com/u/0/uc?id=1BJlcThazPReMBmJ2M6traE0SSiikWlA7&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1H4eY3pD2B8_-dhcRLRw-neXYfrRI_1yw&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1pVaiUcpu_NnKo9tbr0s9Hv04kuFimoMX&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1xz-fS_COYKWrsccwsur8cOFEP8YJq0tY&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1iM35u7wWDHDRIl77HvUy7famhWNOynG4&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=18TwfBlZH_1ydhpYW0KymOoTi4jNkCGM9&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1xiajrxlzWFbe2HU_SetV6KaWyX2OYvY9&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1T3kFQUA92qujtR2kTKH03KBVQDLaEZVi&export=download",

]
const cesUrls = [
    "https://drive.usercontent.google.com/u/0/uc?id=17swVC93YhmlNNDS0UYD_0HV44EcekuH3&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1nZH00hADsHIf7uFfOdUJWTJM29B84vta&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1m6kmQe0R7NRHZvgwtZkvW1yn5ZKL9sig&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1Lsu9WJnhTwyDUTVkQe1VgWW9w88LWtyE&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1wRYN-9zBwZBKbOdRiP2oepuB0DRhtxrO&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=18IHJgpUCqmWTjcd3mfzEA8UuVG13MLO7&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1AeTQpCWdvoh1OixQLBmG4RzPpRUwi8_U&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=12aYTyIxIQHRu1EBXzGXrBX1SfugZYOfI&export=download",
];
const itUrls = [
    "https://drive.usercontent.google.com/u/0/uc?id=1y0Obbet5VSfQZG8Xf87imExVkZCkocTs&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1zqvs64H-NBj5R85vdrJ-rqLWWJt6L23a&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1FudP238GdpTAmODpOAocTxDIhoCGVdn6&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1fq-yQ7AO98y0cPVmidUlSLacDLTN6gf_&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1y-YgGkIHNmoLGu59rtKLt0sJa3-scCmp&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1LUG6U3Fuv1mNW77UNjREwy0hoCnbL2m5&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1--XUeM7j4sr4oGA261p8fhG9jQ5C76qO&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1okQv03Em8eqfWDPegsM-sfh7L7efiq5U&export=download",
]