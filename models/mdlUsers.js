"use strict"
const pool = require("../db");
const md5 = require("md5");
const jwt = require('jsonwebtoken');

//función para traer un usuario según su username
const getUserName = async (username) => {
    try {
      const query = "select * from authorized where username = ?";
      const row = await pool.query(query, [username]);
      return row;
    } catch (error) {
      console.log(error);
    }
  };

//Selecciona un registro de la Db segun usuario y contraseña
const getUser = async (user, password) => {
    try{ 
    const query = "SELECT * FROM authorized WHERE username = ? AND password = ?";
    const row = await pool.query(query, [user, md5(password)]);
    return row[0];
} catch (error) {
    console.log(error);
  }
}

//Inserta a la tabla los valores de data crea un nuevo registro
const addUser = async (data) => {
    try{ 
    const query = "INSERT INTO authorized SET ?";
    const row = await pool.query(query, [data]);
    return row;
    }  
    catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
        return true;
    } else {
            console.log(err);
     }
}
};

//Cambia el estado del campo "token" en el registro a: VERIFIED
const verified = async (mail) => {
    try{ 
    const query = "UPDATE authorized SET token='VERIFIED' WHERE email= ?";
    const row = await pool.query(query, [mail]);
    console.log(row);
    return row;
} catch (error) {
    console.log(error);
  }
}

//Recibe codigo aleatorio y genera un token
const getToken = (payload) => {
    return jwt.sign({
        data: payload
    }, 'SECRET', { expiresIn: '1h' });
}

//Muestra información de usario guardada en el token
const getTokenData = (token) => {
    let data = null;
    jwt.verify(token, 'SECRET', (err, decoded) => {
        if(err) {
            console.log('Error al obtener data del token');
        } else {
            data = decoded;
        }
    });
    return data;
}
//Borrar usuario
const deleteUser = async (user) => {
    try{ 
    const query = "delete from authorized where username = ?";
    const row = await pool.query(query, [user]);
    return row;
} catch (error) {
    console.log(error);
  }
};
//Actualizar usuario
const updateUser = async (data,user) => {
    try {
        const query = "update authorized set ? where username = ? ";
        const row = await pool.query(query, [data, user]);
        return row;
    } catch (error) {
        console.log(error);
    }
}
//Guardar dato score actual para mostrar al final
const updateScoreNow = async (score,user) => {
    try {
        const query = "update authorized set scoreNow = ? where username = ? ";
        const row = await pool.query(query, [score, user]);
        return row;
    } catch (error) {
        console.log(error);
    }
}
//Guardar mejor score
const updateScore = async (score,user) => {
    try {
        const query = "update authorized set score = ? where username = ? ";
        const row = await pool.query(query, [score, user]);
        return row;
    } catch (error) {
        console.log(error);
    }
}
//Mostrar lista de usuarios y score ordenados desde el mejor
const maxScores = async () => {
    try {
        const query = "SELECT username, score, imagen FROM authorized ORDER BY score DESC;";
        const row = await pool.query(query);
        return row;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getUser, addUser, getToken, getTokenData, verified ,
                   getUserName, deleteUser, updateUser, updateScoreNow, updateScore, maxScores };