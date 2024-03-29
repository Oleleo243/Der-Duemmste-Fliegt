import { auth, } from '../firebase-config.js';
import { signInAnonymously, updateProfile } from "firebase/auth";
import '../styles/Auth.css';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars, lorelei } from '@dicebear/collection';
import {getRandomBoolean} from '../utilities/helperFunctions';


export const Auth = (props) => {
  
  const schema = yup.object().shape({
    name: yup.string().required("Please write a Nickname"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const signIn = async (data) => {
    const result = await signInAnonymously(auth);
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name
      })
      props.setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  }

  return (


    <form className="auth" onSubmit={handleSubmit(signIn)}>
      <h1 className="auth-heading">DER DÜMMSTE FLIEGT! 😜🤪</h1> 
      <input maxLength="20" placeholder="type name..." {...register("name")} />
      <p>{errors.name?.message}</p>
      <button type="submit"> play</button>
    </form>
  );
}