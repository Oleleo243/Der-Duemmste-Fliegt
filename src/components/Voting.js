import { signInAnonymously, updateProfile } from "firebase/auth";
import '../styles/Auth.css';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'

export const Voting = ({players}) => {
  return (
        <p>{players[0].playername}</p>


  );
}