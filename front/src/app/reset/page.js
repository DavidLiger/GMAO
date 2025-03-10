'use client'

import "./page.sass";
import Image from "next/image";
import React, {useState} from "react";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Theme from "../../../components/theme/theme";
import PasswordValidator from "password-validator";
import {Label, TextInput} from "flowbite-react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import BioButton from "../../../components/button/BioButton";
import {FaCheck} from "react-icons/fa";
import i18n from "../../../i18n";

export default function Reset() {

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Définition du schéma de validation avec Yup en utilisant i18n pour les messages
    const validationSchema = Yup.object({
        password: Yup.string()
            .required(i18n.t('passwordRequired'))
            .matches(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{10,})/,
                i18n.t('passwordFormat')
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], i18n.t('samePassword'))
            .required(i18n.t('confirmPasswordRequired'))
    });

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({resolver: yupResolver(validationSchema)});

    const onSubmit = (data) => console.log(data);

    // Configuration du validateur de mot de passe
    const schema = new PasswordValidator();
    schema
        .is().min(8, i18n.t('min8char'))
        .has().uppercase(1, i18n.t('min1Uppercase'))
        .has().lowercase(1, i18n.t('min1Lowercase'))
        .has().digits(1, i18n.t('min1Digit'))
        .has().symbols(1, i18n.t('min1Symbol'));

    const [password, setPassword] = useState('');
    const [errorsFormatPassword, setErrorsFormatPassword] = useState([]);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        const validationErrors = schema.validate(value, {details: true});
        setErrorsFormatPassword(validationErrors);
    };

    return (
        <div className="flex">
            <div className="w-8/12 h-screen bg"></div>
            <div className="w-4/12 h-screen flex flex-col items-center justify-center">
                <Theme/>

                <div className="flex items-center justify-center">
                    <Image src="/images/logo.png" alt="logo" width={50} height={50}/>
                    <span className="font-bold m-5 text-4xl">GMAO</span>
                </div>
                <span className="mb-1 text-muted-600 dark:text-muted-300">
          {i18n.t('resetPassword')} 🔒️
        </span>
                <span className="mb-1 text-muted-500 text-xs dark:text-muted-400">
          {i18n.t('for')} John DoDoe
        </span>
                <div className="mb-4 mt-4 w-3/4 max-w-lg">
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        {/* Mot de passe */}
                        <div className="relative z-0 w-full mb-5 group">
                            <div className="mb-2 block">
                                <Label htmlFor="password" value={i18n.t('passwordLabel')}/>
                            </div>
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                onChange={handlePasswordChange}
                                color={errors.password ? 'failure' : 'default'}
                            />
                            <button
                                type="button"
                                className="absolute right-[10px] top-[54px] transform -translate-y-1/2 text-gray-500"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <AiOutlineEye className="text-muted-800 dark:text-white"/>
                                ) : (
                                    <AiOutlineEyeInvisible className="text-muted-800 dark:text-white"/>
                                )}
                            </button>
                            {password && (
                                <div className="mt-4">
                                    <div className="w-full flex">
                                        <div
                                            className={`w-1/5 h-1 ml-1 mr-1 rounded-md ${errorsFormatPassword.length >= 5 ? 'bg-red-600' : 'bg-green-500'}`}></div>
                                        <div
                                            className={`w-1/5 h-1 ml-1 mr-1 rounded-md ${errorsFormatPassword.length >= 4 ? 'bg-red-600' : 'bg-green-500'}`}></div>
                                        <div
                                            className={`w-1/5 h-1 ml-1 mr-1 rounded-md ${errorsFormatPassword.length >= 3 ? 'bg-red-600' : 'bg-green-500'}`}></div>
                                        <div
                                            className={`w-1/5 h-1 ml-1 mr-1 rounded-md ${errorsFormatPassword.length >= 2 ? 'bg-red-600' : 'bg-green-500'}`}></div>
                                        <div
                                            className={`w-1/5 h-1 ml-1 mr-1 rounded-md ${errorsFormatPassword.length >= 1 ? 'bg-red-600' : 'bg-green-500'}`}></div>
                                    </div>
                                    <div className="mt-2">
                                        {errorsFormatPassword.length === 0 ? (
                                            <p className="text-green-500 text-xs">{i18n.t('strongPassword')}</p>
                                        ) : (
                                            <ul className="text-xs text-red-500">
                                                {errorsFormatPassword.map((error, index) => (
                                                    <li key={index}>- {error.message}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        {/* Confirmer le mot de passe */}
                        <div className="relative z-0 w-full mb-5 group">
                            <div className="mb-2 block">
                                <Label htmlFor="confirmPassword" value={i18n.t('confirmPasswordLabel')}/>
                            </div>
                            <TextInput
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                onChange={handlePasswordChange}
                                color={errors.confirmPassword ? 'failure' : 'default'}
                            />
                            <button
                                type="button"
                                className="absolute right-[10px] top-[54px] transform -translate-y-1/2 text-gray-500"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <AiOutlineEye className="text-muted-800 dark:text-white"/>
                                ) : (
                                    <AiOutlineEyeInvisible className="text-muted-800 dark:text-white"/>
                                )}
                            </button>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        <div className="w-full flex justify-center">
                            <BioButton color="success">
                                <FaCheck size={15} className="mt-0.5 mr-2"/> {i18n.t('resetPassword')}
                            </BioButton>
                        </div>
                    </form>
                    <div className="flex w-full mt-4 mb-2">
                        <span className="w-1/4"></span>
                        <a href="/login" className="w-3/4 text-sm text-blue-500 text-right">
                            {i18n.t('redirectLogin')}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
