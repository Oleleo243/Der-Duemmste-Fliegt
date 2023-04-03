import { auth, provider } from '../firebase-config.js';
import { signInAnonymously, updateProfile } from "firebase/auth";
import '../styles/Auth.css';
import * as yup from "yup";
import { string, object, required } from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'

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
      console.log(result);
      props.setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    //<h1 className="auth-heading">DER DÜMMSTE FLIEGT! 😜🤪</h1> 

    <form className="auth" onSubmit={handleSubmit(signIn)}>
      <input maxLength="20" placeholder="type name..." {...register("name")} />
      <p>{errors.name?.message}</p>
      <button type="submit"> Play</button>
    </form>
  );
}