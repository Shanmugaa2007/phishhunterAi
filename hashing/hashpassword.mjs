import { compareSync, genSaltSync, hashSync } from "bcrypt";

const saltrounds = 10;

export const hashing = (password)=>{
    const salt = genSaltSync(saltrounds);
    return hashSync(password,salt);
}

export const comparepassword = (plain,hash)=>{
    return compareSync(plain,hash)
}
