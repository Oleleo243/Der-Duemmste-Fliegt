import { auth } from "../firebase-config.js";
import { signInAnonymously, updateProfile } from "firebase/auth";
import "../styles/Auth.css";
import '../styles/Auth-grid.css';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars, lorelei } from "@dicebear/collection";
import { getRandomBoolean } from "../utilities/helperFunctions";

export const AuthTmp = (props) => {
  const schema = yup.object().shape({
    name: yup.string().required("Please write a Nickname"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const signIn = async (data) => {
    const result = await signInAnonymously(auth);
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name,
      });
      props.setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="auth" onSubmit={handleSubmit(signIn)}>
      <h1 className="auth-heading">Kick the Fool</h1>
      <input className="auth-input" maxLength="20" placeholder="type name..." {...register("name")} />
      <p className="auth-error">{errors.name?.message}</p>
      <button className="auth-button"type="submit"> play</button>
    </form>
  );
};
