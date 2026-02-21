const requiredENV = [
    'PORT',
    'MONGO_URL',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
]

export const valudateENV = ()=>{
    const missing = requiredENV.filter((key)=>!process.env[key])
    if (missing.length>0){
        console.log("Required ENV are missing.")
        process.exit(1)
    }
};


