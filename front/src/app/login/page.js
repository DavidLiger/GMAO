'use client';
import "./page.sass";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Theme from "../../../components/theme/theme";
import { useAuth } from "../../../providers/AuthProvider";
import { useRouter } from "next/navigation"; // Importer useRouter
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox, Label, TextInput } from "flowbite-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import BioButton from "../../../components/button/BioButton";
import i18n from "../../../i18n";

export default function Login() {
    const { setToken, setRefreshToken } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter(); // Initialiser useRouter
    const [redirectUrl, setRedirectUrl] = useState('/'); // URL de redirection par défaut

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(i18n.t('usernameRequired')),
        password: Yup.string().required(i18n.t('passwordRequired'))
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    const onSubmit = async (data) => {
        const tokenUrl = process.env.NEXT_PUBLIC_API_URL + "/token";
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: data.username,
                password: data.password,
                grant_type: "password",
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET
            }),
        });
        if (!response.ok) {
            throw new Error("Login failed");
        } else {
            console.log(redirectUrl);
            
            const dataResponse = await response.json();
            setToken(dataResponse["access_token"]);
            setRefreshToken(dataResponse["refresh_token"]);
            router.push(redirectUrl); // Rediriger vers l'URL de redirection
        }
    };

    useEffect(() => {
        // Vérifier si une URL de redirection est présente dans les paramètres de la requête
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        if (redirect) {
            setRedirectUrl(redirect);
        }
    }, []);

    return (
        <div className="flex">
            <div className="hidden md:block w-8/12 h-screen bg"></div>
            <div className="w-full md:w-4/12 h-screen flex flex-col items-center justify-center">
                <Theme />
                <div className="flex items-center justify-center pl-4">
                    <Image src="/images/logo.png" alt="logo" width={50} height={50} />
                    <span className="font-bold m-5 text-4xl">GMAO</span>
                </div>
                <span className="mb-1 text-muted-600 dark:text-muted-300">
                    {i18n.t('titleLogin')} 🎉
                </span>
                <span className="mb-1 text-muted-500 text-xs dark:text-muted-400">
                    {i18n.t('subtitleLogin')}
                </span>
                <div className="mb-4 mt-4 w-3/4 max-w-lg">
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        {/* Username */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="username" value="Username" />
                            </div>
                            < TextInput
                                id="username"
                                type="text"
                                {...register("username")}
                                color={errors.username ? 'failure' : 'default'}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>
                        {/* Password */}
                        <div className="relative">
                            <div className="mb-2 block">
                                <Label htmlFor="password" value="Mot de passe" />
                            </div>
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    color={errors.password ? 'failure' : 'default'}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <AiOutlineEye className="text-muted-800 dark:text-white" />
                                    ) : (
                                        <AiOutlineEyeInvisible className="text-muted-800 dark:text-white" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="flex mt-2 mb-2 justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox id="remember" />
                                <Label htmlFor="remember">{i18n.t('rememberMe')}</Label>
                            </div>
                            <a className="text-sm w-1/2 text-blue-500 text-right" href="/forgot">
                                {i18n.t('forgotPassword')}
                            </a>
                        </div>
                        <div className="w-full flex justify-end">
                            <BioButton color={'success'} type="submit">{i18n.t('connexion')}</BioButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}