import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.jwt;
    console.log({token});
    if(!token){
        return res.status(401).send("You are not authorized");
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        
        if(err){
        console.log(err);

            return res.status(403).send("Token is not Valid");
        };

        req.userId = payload.userId;

        next();
    });
};
