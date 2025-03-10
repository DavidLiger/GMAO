'use client'

import "./page.sass";
import Image from "next/image";
import React from "react";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Theme from "../../../components/theme/theme";
import {Label, TextInput} from "flowbite-react";
import BioButton from "../../../components/button/BioButton";
import i18n from "../../../i18n"; // Importez i18n pour accéder aux traductions

export default function Forgot() {

    // Utilisation d'i18n.t pour les messages de validation
    const validationSchema = Yup.object({
        email: Yup.string()
            .email(i18n.t('usernameFormat'))
            .required(i18n.t('usernameRequired'))
    });

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({resolver: yupResolver(validationSchema)});

    const onSubmit = (data) => console.log(data);

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
                    {i18n.t('title')} 🔒️
                </span>
                <span className="mb-1 text-muted-500 text-xs dark:text-muted-400">
                    {i18n.t('subtitle')}
                </span>

                <div className="mb-4 mt-4 w-3/4 max-w-lg">
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <div className="z-0 w-full mb-5 group">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Email"/>
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    color={errors.email ? 'failure' : 'default'}
                                    placeholder="john.doe@mail.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <BioButton>{i18n.t('sendMail')}</BioButton>
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
